import { asc, desc, eq, sql } from "drizzle-orm";
import {
  blogFallbackPosts,
  emptyBlogPost,
  type BlogContentBlock,
  type BlogPost,
  type BlogPostInput,
  type BlogStatus,
} from "@/data/blog-content";
import { blogPosts, blogPostTranslations } from "@/db/schema";
import { type Locale } from "@/i18n/config";
import { getDb, hasDatabaseConnection } from "@/lib/db";

type BlogListOptions = {
  includeDrafts?: boolean;
  limit?: number;
};

type BlogSource = "database" | "fallback";

export async function listBlogPosts(locale: Locale, options: BlogListOptions = {}) {
  if (!hasDatabaseConnection()) {
    return {
      source: "fallback" as BlogSource,
      items: getFallbackBlogPosts(locale, options),
    };
  }

  try {
    const rows = await getDb()
      .select()
      .from(blogPosts)
      .where(options.includeDrafts ? undefined : eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.featured), asc(blogPosts.sortOrder), desc(blogPosts.createdAt))
      .limit(options.limit ?? 100);

    const items = await Promise.all(rows.map((row) => hydrateBlogPost(row, locale)));

    return {
      source: "database" as BlogSource,
      items,
    };
  } catch (error) {
    console.error("Failed to list blog posts", error);
    return {
      source: "fallback" as BlogSource,
      items: getFallbackBlogPosts(locale, options),
    };
  }
}

export async function getBlogPostBySlug(locale: Locale, slug: string, options: { includeDrafts?: boolean } = {}) {
  if (!hasDatabaseConnection()) {
    return getFallbackBlogPosts(locale, { includeDrafts: options.includeDrafts }).find((post) => post.slug === slug) ?? null;
  }

  try {
    const [row] = await getDb()
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    if (!row || (!options.includeDrafts && row.status !== "published")) {
      return null;
    }

    return hydrateBlogPost(row, locale);
  } catch (error) {
    console.error(`Failed to get blog post ${slug}`, error);
    return getFallbackBlogPosts(locale, { includeDrafts: options.includeDrafts }).find((post) => post.slug === slug) ?? null;
  }
}

export async function listAdminBlogPosts(locale: Locale) {
  return listBlogPosts(locale, { includeDrafts: true });
}

export async function createBlogPost(input: Partial<BlogPostInput>) {
  assertDatabase();
  const normalized = normalizeBlogInput(input);
  const publishedAt = normalized.status === "published" ? normalized.publishedAt || new Date().toISOString() : normalized.publishedAt || null;

  const [created] = await getDb()
    .insert(blogPosts)
    .values({
      title: normalized.title,
      slug: normalized.slug,
      excerpt: normalized.excerpt,
      category: normalized.category,
      status: normalized.status,
      imageUrl: normalized.imageUrl,
      imageAlt: normalized.imageAlt,
      tags: normalized.tags,
      featured: normalized.featured,
      sortOrder: normalized.sortOrder,
      authorName: normalized.authorName,
      publishedAt,
    })
    .returning({ id: blogPosts.id });

  if (!created?.id) {
    throw new Error("Failed to create blog post.");
  }

  await upsertBlogTranslation(created.id, normalized);

  return created.id;
}

export async function updateBlogPost(id: string, input: Partial<BlogPostInput>) {
  assertDatabase();
  const normalized = normalizeBlogInput({ ...input, id });
  const publishedAt = normalized.status === "published" ? normalized.publishedAt || new Date().toISOString() : normalized.publishedAt || null;

  await getDb()
    .update(blogPosts)
    .set({
      title: normalized.title,
      slug: normalized.slug,
      excerpt: normalized.excerpt,
      category: normalized.category,
      status: normalized.status,
      imageUrl: normalized.imageUrl,
      imageAlt: normalized.imageAlt,
      tags: normalized.tags,
      featured: normalized.featured,
      sortOrder: normalized.sortOrder,
      authorName: normalized.authorName,
      publishedAt,
      updatedAt: sql`now()`,
    })
    .where(eq(blogPosts.id, id));

  await upsertBlogTranslation(id, normalized);
}

export async function deleteBlogPost(id: string) {
  assertDatabase();
  await getDb().delete(blogPosts).where(eq(blogPosts.id, id));
}

export function normalizeBlogInput(input: Partial<BlogPostInput>): BlogPostInput {
  const title = String(input.title ?? "").trim();
  const slug = slugify(String(input.slug || title || "blog-post"));
  const status = normalizeBlogStatus(input.status);
  const contentBlocks = normalizeBlocks(input.contentBlocks);
  const imageAlt = String(input.imageAlt ?? input.title ?? "").trim();

  return {
    ...emptyBlogPost,
    ...input,
    id: String(input.id ?? ""),
    slug,
    title,
    excerpt: String(input.excerpt ?? "").trim(),
    category: String(input.category ?? "Aesthetic Medicine").trim() || "Aesthetic Medicine",
    status,
    imageUrl: String(input.imageUrl ?? "").trim(),
    imageAlt,
    tags: normalizeTags(input.tags),
    featured: Boolean(input.featured),
    sortOrder: Number(input.sortOrder ?? 100) || 100,
    authorName: String(input.authorName ?? "BAKSAL BEAUTY").trim() || "BAKSAL BEAUTY",
    publishedAt: input.publishedAt ?? null,
    locale: (input.locale ?? "ko") as Locale,
    contentBlocks,
    seoTitle: String(input.seoTitle ?? title).trim(),
    seoDescription: String(input.seoDescription ?? input.excerpt ?? "").trim(),
  };
}

async function hydrateBlogPost(row: typeof blogPosts.$inferSelect, locale: Locale): Promise<BlogPost> {
  const translation = await getTranslation(row.id, locale);

  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    status: row.status,
    imageUrl: row.imageUrl,
    imageAlt: translation?.imageAlt || row.imageAlt || translation?.title || row.title,
    tags: row.tags,
    featured: row.featured,
    sortOrder: row.sortOrder,
    authorName: row.authorName,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    locale,
    title: translation?.title || row.title,
    excerpt: translation?.excerpt || row.excerpt,
    contentBlocks: translation?.contentBlocks?.length ? translation.contentBlocks : createDefaultBlocks(row, translation),
    seoTitle: translation?.seoTitle || translation?.title || row.title,
    seoDescription: translation?.seoDescription || translation?.excerpt || row.excerpt,
  };
}

async function getTranslation(blogPostId: string, locale: Locale) {
  const db = getDb();
  const [localized] = await db
    .select()
    .from(blogPostTranslations)
    .where(sql`${blogPostTranslations.blogPostId} = ${blogPostId} AND ${blogPostTranslations.locale} = ${locale}`)
    .limit(1);

  if (localized) {
    return localized;
  }

  const [ko] = await db
    .select()
    .from(blogPostTranslations)
    .where(sql`${blogPostTranslations.blogPostId} = ${blogPostId} AND ${blogPostTranslations.locale} = 'ko'`)
    .limit(1);

  return ko;
}

async function upsertBlogTranslation(blogPostId: string, input: BlogPostInput) {
  await getDb()
    .insert(blogPostTranslations)
    .values({
      blogPostId,
      locale: input.locale,
      title: input.title,
      excerpt: input.excerpt,
      contentBlocks: input.contentBlocks,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      imageAlt: input.imageAlt,
    })
    .onConflictDoUpdate({
      target: [blogPostTranslations.blogPostId, blogPostTranslations.locale],
      set: {
        title: input.title,
        excerpt: input.excerpt,
        contentBlocks: input.contentBlocks,
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
        imageAlt: input.imageAlt,
        updatedAt: sql`now()`,
      },
    });
}

function createDefaultBlocks(row: typeof blogPosts.$inferSelect, translation?: typeof blogPostTranslations.$inferSelect): BlogContentBlock[] {
  const title = translation?.title || row.title;
  const excerpt = translation?.excerpt || row.excerpt;

  return [
    {
      id: "intro-heading",
      type: "heading",
      level: 2,
      content: title,
    },
    {
      id: "intro-paragraph",
      type: "paragraph",
      content: excerpt,
    },
  ];
}

function getFallbackBlogPosts(locale: Locale, options: BlogListOptions) {
  const posts = blogFallbackPosts
    .filter((post) => options.includeDrafts || post.status === "published")
    .map((post) => ({ ...post, locale }));

  return typeof options.limit === "number" ? posts.slice(0, options.limit) : posts;
}

function normalizeBlogStatus(value: unknown): BlogStatus {
  return value === "published" || value === "archived" || value === "draft" ? value : "draft";
}

function normalizeTags(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeBlocks(value: unknown): BlogContentBlock[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((block, index) => {
      const item = block as Partial<BlogContentBlock>;
      const type = item.type ?? "paragraph";

      if (!["heading", "paragraph", "image", "quote", "callout", "divider"].includes(type)) {
        return null;
      }

      return {
        id: item.id || `${type}-${index}`,
        type,
        content: item.content ?? "",
        level: item.level === 3 ? 3 : 2,
        imageUrl: item.imageUrl ?? "",
        imageAlt: item.imageAlt ?? "",
        caption: item.caption ?? "",
      } satisfies BlogContentBlock;
    })
    .filter(Boolean) as BlogContentBlock[];
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || "blog-post";
}

function assertDatabase() {
  if (!hasDatabaseConnection()) {
    throw new Error("DATABASE_URL is not connected. Connect bsclinic-db first.");
  }
}
