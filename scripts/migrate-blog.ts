import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { sql } from "drizzle-orm";
import { blogFallbackPosts } from "../src/data/blog-content";
import { blogPosts, blogPostTranslations } from "../src/db/schema";
import { locales, type Locale } from "../src/i18n/config";
import { closeDatabase, executeSchemaSql, getDb } from "../src/lib/db";

const root = process.cwd();

void main();

async function main() {
  await loadEnv(".env.local");
  await loadEnv(".env");

  const databaseUrl =
    process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL. Connect bsclinic-db, then run npm run db:migrate:blog.");
  }

  try {
    const schemaSql = await readFile(path.join(root, "src", "db", "schema.sql"), "utf8");
    await executeSchemaSql(schemaSql);

    for (const seed of blogFallbackPosts) {
      const imageUrl = await uploadSeedAsset(seed.imageUrl, seed.slug);
      const [post] = await getDb()
        .insert(blogPosts)
        .values({
          title: seed.title,
          slug: seed.slug,
          excerpt: seed.excerpt,
          category: seed.category,
          status: seed.status,
          imageUrl,
          imageAlt: seed.imageAlt,
          tags: seed.tags,
          featured: seed.featured,
          sortOrder: seed.sortOrder,
          authorName: seed.authorName,
          publishedAt: seed.publishedAt,
        })
        .onConflictDoUpdate({
          target: blogPosts.slug,
          set: {
            title: seed.title,
            excerpt: seed.excerpt,
            category: seed.category,
            status: seed.status,
            imageUrl,
            imageAlt: seed.imageAlt,
            tags: seed.tags,
            featured: seed.featured,
            sortOrder: seed.sortOrder,
            authorName: seed.authorName,
            publishedAt: seed.publishedAt,
            updatedAt: sql`now()`,
          },
        })
        .returning({ id: blogPosts.id });

      if (!post?.id) {
        throw new Error(`Failed to upsert blog post ${seed.slug}`);
      }

      for (const locale of locales) {
        await seedTranslation(post.id, locale, seed, imageUrl);
      }

      console.log(`migrated blog ${seed.slug}`);
    }
  } finally {
    await closeDatabase();
  }
}

async function seedTranslation(
  blogPostId: string,
  locale: Locale,
  seed: (typeof blogFallbackPosts)[number],
  imageUrl: string,
) {
  const blocks = seed.contentBlocks.map((block) =>
    block.type === "image" && block.imageUrl === seed.imageUrl ? { ...block, imageUrl } : block,
  );

  await getDb()
    .insert(blogPostTranslations)
    .values({
      blogPostId,
      locale,
      title: seed.title,
      excerpt: seed.excerpt,
      contentBlocks: blocks,
      seoTitle: seed.seoTitle,
      seoDescription: seed.seoDescription,
      imageAlt: seed.imageAlt,
    })
    .onConflictDoUpdate({
      target: [blogPostTranslations.blogPostId, blogPostTranslations.locale],
      set: {
        title: seed.title,
        excerpt: seed.excerpt,
        contentBlocks: blocks,
        seoTitle: seed.seoTitle,
        seoDescription: seed.seoDescription,
        imageAlt: seed.imageAlt,
        updatedAt: sql`now()`,
      },
    });
}

async function uploadSeedAsset(imageUrl: string, slug: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN || !imageUrl.startsWith("/images/")) {
    return imageUrl;
  }

  const filePath = path.join(root, "public", imageUrl);

  if (!existsSync(filePath)) {
    console.warn(`skip blob upload, missing local asset: ${imageUrl}`);
    return imageUrl;
  }

  const file = await readFile(filePath);
  const extension = path.extname(imageUrl) || ".jpg";
  const blob = await put(`blog/${slug}${extension}`, file, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  return blob.url;
}

async function loadEnv(file: string) {
  const envPath = path.join(root, file);

  if (!existsSync(envPath)) {
    return;
  }

  const raw = await readFile(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...rest] = trimmed.split("=");
    const value = rest.join("=").trim().replace(/^['"]|['"]$/g, "");

    if (!process.env[key.trim()]) {
      process.env[key.trim()] = value;
    }
  }
}
