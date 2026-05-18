import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { eq, sql } from "drizzle-orm";
import { adminUserSeeds, blogPostSeeds, inquirySeeds } from "../src/data/admin-seed";
import {
  createServiceEmbedding,
  getServiceDetailContent,
} from "../src/data/service-detail-defaults";
import { serviceSeeds } from "../src/data/service-content";
import { adminUsers, blogPosts, inquiries, serviceItems, serviceItemTranslations } from "../src/db/schema";
import type { Locale } from "../src/i18n/config";
import { closeDatabase, executeSchemaSql, getDb } from "../src/lib/db";

const root = process.cwd();

void main();

async function main() {
  await loadEnv(".env.local");
  await loadEnv(".env");

  const databaseUrl =
    process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL. Connect bsclinic-db, then run npm run db:seed.");
  }

  try {
    const schemaSql = await readFile(path.join(root, "src", "db", "schema.sql"), "utf8");
    await executeSchemaSql(schemaSql);

    for (const seed of serviceSeeds) {
      const imageUrl = await uploadSeedAsset(seed.imageUrl, seed.slug);
      const [service] = await getDb()
        .insert(serviceItems)
        .values({
          slug: seed.slug,
          category: seed.category,
          tags: seed.tags,
          imageUrl,
          featured: seed.featured,
          sortOrder: seed.sortOrder,
          status: seed.status,
          relatedSlugs: getRelatedSlugs(seed.slug),
          embedding: createServiceEmbedding(seed.category, seed.tags, seed.slug),
        })
        .onConflictDoUpdate({
          target: serviceItems.slug,
          set: {
            category: seed.category,
            tags: seed.tags,
            imageUrl,
            featured: seed.featured,
            sortOrder: seed.sortOrder,
            status: seed.status,
            relatedSlugs: getRelatedSlugs(seed.slug),
            embedding: createServiceEmbedding(seed.category, seed.tags, seed.slug),
            updatedAt: sql`now()`,
          },
        })
        .returning({ id: serviceItems.id });

      const serviceId = service?.id;

      if (!serviceId) {
        throw new Error(`Failed to upsert ${seed.slug}`);
      }

      for (const locale of Object.keys(seed.translations) as Locale[]) {
        const translation = seed.translations[locale];
        const detail = getServiceDetailContent(
          {
            id: serviceId,
            slug: seed.slug,
            category: seed.category,
            tags: seed.tags,
            imageUrl,
            imageAlt: seed.imageAlt[locale],
            featured: seed.featured,
            sortOrder: seed.sortOrder,
            status: seed.status,
            title: translation.title,
            subtitle: translation.subtitle,
            summary: translation.summary,
            description: translation.description,
            highlights: translation.highlights,
            recommendedFor: translation.recommendedFor,
            process: translation.process,
            recovery: translation.recovery,
            duration: translation.duration,
            priceNote: translation.priceNote,
          },
          locale,
        );

        const detailPanels = await uploadDetailPanels(detail.detailPanels, seed.slug);
        const beforeAfter = await uploadBeforeAfter(detail.beforeAfter, seed.slug);
        const richDetailImages = await uploadRichDetailImages(detail.richDetailImages, seed.slug);
        const youtubeVideos = await uploadYoutubeVideos(detail.youtubeVideos, seed.slug);
        const values = {
          serviceItemId: serviceId,
          locale,
          title: translation.title,
          subtitle: translation.subtitle,
          summary: translation.summary,
          description: translation.description,
          highlights: translation.highlights,
          recommendedFor: translation.recommendedFor,
          processSteps: translation.process,
          recovery: translation.recovery,
          duration: translation.duration,
          priceNote: translation.priceNote,
          imageAlt: seed.imageAlt[locale],
          surgeryInfo: detail.surgeryInfo,
          detailPanels,
          beforeAfter,
          richDetailImages,
          youtubeVideos,
          detailCta: detail.detailCta,
        };

        await getDb()
          .insert(serviceItemTranslations)
          .values(values)
          .onConflictDoUpdate({
            target: [serviceItemTranslations.serviceItemId, serviceItemTranslations.locale],
            set: {
              title: values.title,
              subtitle: values.subtitle,
              summary: values.summary,
              description: values.description,
              highlights: values.highlights,
              recommendedFor: values.recommendedFor,
              processSteps: values.processSteps,
              recovery: values.recovery,
              duration: values.duration,
              priceNote: values.priceNote,
              imageAlt: values.imageAlt,
              surgeryInfo: values.surgeryInfo,
              detailPanels: values.detailPanels,
              beforeAfter: values.beforeAfter,
              richDetailImages: values.richDetailImages,
              youtubeVideos: values.youtubeVideos,
              detailCta: values.detailCta,
              updatedAt: sql`now()`,
            },
          });
      }

      console.log(`seeded ${seed.slug}`);
    }

    await seedAdminUsers();
    await seedBlogPosts();
    await seedInquiries();
  } finally {
    await closeDatabase();
  }
}

async function uploadRichDetailImages(
  images: { title: string; imageUrl: string; imageAlt: string }[],
  slug: string,
) {
  return Promise.all(
    images.map(async (image, index) => ({
      ...image,
      imageUrl: await uploadSeedAsset(
        image.imageUrl,
        `${slug}-detail-${String(index + 1).padStart(2, "0")}`,
        "service-rich-details",
      ),
    })),
  );
}

async function uploadDetailPanels<T extends { imageUrl: string }>(
  panels: T[],
  slug: string,
) {
  return Promise.all(
    panels.map(async (panel, index) => ({
      ...panel,
      imageUrl: await uploadSeedAsset(
        panel.imageUrl,
        `${slug}-panel-${String(index + 1).padStart(2, "0")}`,
        "service-detail-panels",
      ),
    })),
  );
}

async function uploadBeforeAfter<T extends { beforeImageUrl: string; afterImageUrl: string }>(
  beforeAfter: T,
  slug: string,
) {
  return {
    ...beforeAfter,
    beforeImageUrl: await uploadSeedAsset(
      beforeAfter.beforeImageUrl,
      `${slug}-before`,
      "service-before-after",
    ),
    afterImageUrl: await uploadSeedAsset(
      beforeAfter.afterImageUrl,
      `${slug}-after`,
      "service-before-after",
    ),
  };
}

async function uploadYoutubeVideos<T extends { thumbnailUrl: string }>(
  videos: T[],
  slug: string,
) {
  return Promise.all(
    videos.map(async (video, index) => ({
      ...video,
      thumbnailUrl: await uploadSeedAsset(
        video.thumbnailUrl,
        `${slug}-video-${String(index + 1).padStart(2, "0")}`,
        "service-video-thumbnails",
      ),
    })),
  );
}

function getRelatedSlugs(slug: string) {
  const relatedMap: Record<string, string[]> = {
    "natural-eye-design": ["balanced-rhinoplasty", "petit-facial-balancing"],
    "balanced-rhinoplasty": ["natural-eye-design", "petit-facial-balancing"],
    "deep-structure-lifting": ["petit-facial-balancing", "natural-eye-design"],
    "petit-facial-balancing": ["deep-structure-lifting", "natural-eye-design"],
  };

  return relatedMap[slug] ?? [];
}

async function seedAdminUsers() {
  for (const seed of adminUserSeeds) {
    await getDb()
      .insert(adminUsers)
      .values({
        name: seed.name,
        email: seed.email,
        role: seed.role,
        status: seed.status,
      })
      .onConflictDoUpdate({
        target: adminUsers.email,
        set: {
          name: seed.name,
          role: seed.role,
          status: seed.status,
          updatedAt: sql`now()`,
        },
      });

    console.log(`seeded admin user ${seed.email}`);
  }
}

async function seedBlogPosts() {
  for (const seed of blogPostSeeds) {
    const imageUrl = await uploadSeedAsset(seed.imageUrl, seed.slug, "blog");

    await getDb()
      .insert(blogPosts)
      .values({
        title: seed.title,
        slug: seed.slug,
        excerpt: seed.excerpt,
        category: seed.category,
        status: seed.status,
        imageUrl,
        tags: seed.tags,
      })
      .onConflictDoUpdate({
        target: blogPosts.slug,
        set: {
          title: seed.title,
          excerpt: seed.excerpt,
          category: seed.category,
          status: seed.status,
          imageUrl,
          tags: seed.tags,
          updatedAt: sql`now()`,
        },
      });

    console.log(`seeded blog ${seed.slug}`);
  }
}

async function seedInquiries() {
  for (const seed of inquirySeeds) {
    const [existing] = await getDb()
      .select({ id: inquiries.id })
      .from(inquiries)
      .where(eq(inquiries.seedKey, seed.seedKey))
      .limit(1);

    if (existing?.id) {
      await getDb()
        .update(inquiries)
        .set({
          name: seed.name,
          phone: seed.phone,
          email: seed.email,
          interest: seed.interest,
          preferredChannel: seed.preferredChannel,
          message: seed.message,
          status: seed.status,
          updatedAt: sql`now()`,
        })
        .where(eq(inquiries.seedKey, seed.seedKey));
    } else {
      await getDb().insert(inquiries).values({
        seedKey: seed.seedKey,
        name: seed.name,
        phone: seed.phone,
        email: seed.email,
        interest: seed.interest,
        preferredChannel: seed.preferredChannel,
        message: seed.message,
        status: seed.status,
      });
    }

    console.log(`seeded inquiry ${seed.seedKey}`);
  }
}

async function uploadSeedAsset(imageUrl: string, slug: string, folder = "services") {
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
  const blob = await put(`${folder}/${slug}${extension}`, file, {
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
