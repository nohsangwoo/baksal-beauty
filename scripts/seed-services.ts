import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Pool } from "@neondatabase/serverless";
import { put } from "@vercel/blob";
import { adminUserSeeds, blogPostSeeds, inquirySeeds } from "../src/data/admin-seed";
import { serviceSeeds } from "../src/data/service-content";
import type { Locale } from "../src/i18n/config";

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

  const pool = new Pool({ connectionString: databaseUrl });
  const schemaSql = await readFile(path.join(root, "src", "db", "schema.sql"), "utf8");

  await pool.query(schemaSql);

  for (const seed of serviceSeeds) {
    const imageUrl = await uploadSeedAsset(seed.imageUrl, seed.slug);
    const serviceResult = await pool.query<{ id: string }>(
      `
        INSERT INTO service_items
          (slug, category, tags, image_url, featured, sort_order, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (slug)
        DO UPDATE SET
          category = EXCLUDED.category,
          tags = EXCLUDED.tags,
          image_url = EXCLUDED.image_url,
          featured = EXCLUDED.featured,
          sort_order = EXCLUDED.sort_order,
          status = EXCLUDED.status,
          updated_at = now()
        RETURNING id::text
      `,
      [
        seed.slug,
        seed.category,
        seed.tags,
        imageUrl,
        seed.featured,
        seed.sortOrder,
        seed.status,
      ],
    );
    const serviceId = serviceResult.rows[0]?.id;

    if (!serviceId) {
      throw new Error(`Failed to upsert ${seed.slug}`);
    }

    for (const locale of Object.keys(seed.translations) as Locale[]) {
      const translation = seed.translations[locale];

      await pool.query(
        `
          INSERT INTO service_item_translations
            (
              service_item_id,
              locale,
              title,
              subtitle,
              summary,
              description,
              highlights,
              recommended_for,
              process_steps,
              recovery,
              duration,
              price_note,
              image_alt
            )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT (service_item_id, locale)
          DO UPDATE SET
            title = EXCLUDED.title,
            subtitle = EXCLUDED.subtitle,
            summary = EXCLUDED.summary,
            description = EXCLUDED.description,
            highlights = EXCLUDED.highlights,
            recommended_for = EXCLUDED.recommended_for,
            process_steps = EXCLUDED.process_steps,
            recovery = EXCLUDED.recovery,
            duration = EXCLUDED.duration,
            price_note = EXCLUDED.price_note,
            image_alt = EXCLUDED.image_alt,
            updated_at = now()
        `,
        [
          serviceId,
          locale,
          translation.title,
          translation.subtitle,
          translation.summary,
          translation.description,
          translation.highlights,
          translation.recommendedFor,
          translation.process,
          translation.recovery,
          translation.duration,
          translation.priceNote,
          seed.imageAlt[locale],
        ],
      );
    }

    console.log(`seeded ${seed.slug}`);
  }

  await seedAdminUsers(pool);
  await seedBlogPosts(pool);
  await seedInquiries(pool);

  await pool.end();
}

async function seedAdminUsers(pool: Pool) {
  for (const seed of adminUserSeeds) {
    await pool.query(
      `
        INSERT INTO admin_users (name, email, role, status)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email)
        DO UPDATE SET
          name = EXCLUDED.name,
          role = EXCLUDED.role,
          status = EXCLUDED.status,
          updated_at = now()
      `,
      [seed.name, seed.email, seed.role, seed.status],
    );

    console.log(`seeded admin user ${seed.email}`);
  }
}

async function seedBlogPosts(pool: Pool) {
  for (const seed of blogPostSeeds) {
    const imageUrl = await uploadSeedAsset(seed.imageUrl, seed.slug, "blog");

    await pool.query(
      `
        INSERT INTO blog_posts
          (title, slug, excerpt, category, status, image_url, tags)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (slug)
        DO UPDATE SET
          title = EXCLUDED.title,
          excerpt = EXCLUDED.excerpt,
          category = EXCLUDED.category,
          status = EXCLUDED.status,
          image_url = EXCLUDED.image_url,
          tags = EXCLUDED.tags,
          updated_at = now()
      `,
      [
        seed.title,
        seed.slug,
        seed.excerpt,
        seed.category,
        seed.status,
        imageUrl,
        seed.tags,
      ],
    );

    console.log(`seeded blog ${seed.slug}`);
  }
}

async function seedInquiries(pool: Pool) {
  for (const seed of inquirySeeds) {
    const existing = await pool.query<{ id: string }>(
      "SELECT id::text FROM inquiries WHERE seed_key = $1 LIMIT 1",
      [seed.seedKey],
    );

    if (existing.rows[0]?.id) {
      await pool.query(
        `
          UPDATE inquiries
          SET
            name = $2,
            phone = $3,
            email = $4,
            interest = $5,
            preferred_channel = $6,
            message = $7,
            status = $8,
            updated_at = now()
          WHERE seed_key = $1
        `,
        [
          seed.seedKey,
          seed.name,
          seed.phone,
          seed.email,
          seed.interest,
          seed.preferredChannel,
          seed.message,
          seed.status,
        ],
      );
    } else {
      await pool.query(
        `
          INSERT INTO inquiries
            (seed_key, name, phone, email, interest, preferred_channel, message, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [
          seed.seedKey,
          seed.name,
          seed.phone,
          seed.email,
          seed.interest,
          seed.preferredChannel,
          seed.message,
          seed.status,
        ],
      );
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
