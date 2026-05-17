import { adminUserSeeds, blogPostSeeds, inquirySeeds } from "@/data/admin-seed";
import { dbQuery, hasDatabaseConnection, toPostgresArray } from "@/lib/db";

export type AdminResource = "users" | "blog" | "inquire";

export type AdminRecord = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  meta: string;
  imageUrl?: string;
  tags?: string[];
  createdAt?: string;
};

type ResourceConfig = {
  table: string;
  select: string;
  orderBy: string;
  fallback: AdminRecord[];
};

const userFallback: AdminRecord[] = adminUserSeeds.map((user) => ({
  id: user.email,
  title: user.name,
  subtitle: user.email,
  status: user.status,
  meta: user.role,
}));

const blogFallback: AdminRecord[] = blogPostSeeds.map((post) => ({
  id: post.slug,
  title: post.title,
  subtitle: post.excerpt,
  status: post.status,
  meta: post.category,
  imageUrl: post.imageUrl,
  tags: post.tags,
}));

const inquiryFallback: AdminRecord[] = inquirySeeds.map((inquiry) => ({
  id: inquiry.seedKey,
  title: inquiry.name,
  subtitle: inquiry.message,
  status: inquiry.status,
  meta: inquiry.interest,
  tags: [inquiry.preferredChannel],
}));

const resourceConfigs: Record<AdminResource, ResourceConfig> = {
  users: {
    table: "admin_users",
    select:
      "id::text, name AS title, email AS subtitle, status, role AS meta, NULL::text AS image_url, ARRAY[]::text[] AS tags, created_at::text",
    orderBy: "created_at DESC",
    fallback: userFallback,
  },
  blog: {
    table: "blog_posts",
    select:
      "id::text, title, excerpt AS subtitle, status, category AS meta, image_url, tags, created_at::text",
    orderBy: "created_at DESC",
    fallback: blogFallback,
  },
  inquire: {
    table: "inquiries",
    select:
      "id::text, name AS title, message AS subtitle, status, interest AS meta, NULL::text AS image_url, ARRAY[preferred_channel]::text[] AS tags, created_at::text",
    orderBy: "created_at DESC",
    fallback: inquiryFallback,
  },
};

export function isAdminResource(value: string): value is AdminResource {
  return value === "users" || value === "blog" || value === "inquire";
}

export async function listAdminRecords(resource: AdminResource) {
  const config = resourceConfigs[resource];

  if (!hasDatabaseConnection()) {
    return {
      source: "fallback" as const,
      items: config.fallback,
    };
  }

  try {
    const result = await dbQuery<{
      id: string;
      title: string;
      subtitle: string;
      status: string;
      meta: string;
      image_url: string | null;
      tags: string[] | null;
      created_at: string;
    }>(
      `
        SELECT ${config.select}
        FROM ${config.table}
        ORDER BY ${config.orderBy}
      `,
    );

    return {
      source: "database" as const,
      items: result.rows.map((row) => ({
        id: row.id,
        title: row.title,
        subtitle: row.subtitle,
        status: row.status,
        meta: row.meta,
        imageUrl: row.image_url ?? undefined,
        tags: row.tags ?? [],
        createdAt: row.created_at,
      })),
    };
  } catch (error) {
    console.error(`Failed to list ${resource}`, error);
    return {
      source: "fallback" as const,
      items: config.fallback,
    };
  }
}

export async function createAdminRecord(resource: AdminResource, body: Record<string, unknown>) {
  assertDatabase();

  if (resource === "users") {
    const result = await dbQuery<{ id: string }>(
      `
        INSERT INTO admin_users (name, email, role, status)
        VALUES ($1, $2, $3, $4)
        RETURNING id::text
      `,
      [
        String(body.title ?? ""),
        String(body.subtitle ?? ""),
        String(body.meta ?? "Editor"),
        String(body.status ?? "active"),
      ],
    );
    return result.rows[0]?.id;
  }

  if (resource === "blog") {
    const result = await dbQuery<{ id: string }>(
      `
        INSERT INTO blog_posts (title, slug, excerpt, category, status, image_url, tags)
        VALUES ($1, $2, $3, $4, $5, $6, $7::text[])
        RETURNING id::text
      `,
      [
        String(body.title ?? ""),
        String(body.slug ?? slugify(String(body.title ?? "blog-post"))),
        String(body.subtitle ?? ""),
        String(body.meta ?? "Aesthetic Medicine"),
        String(body.status ?? "draft"),
        String(body.imageUrl ?? ""),
        toPostgresArray(normalizeTags(body.tags)),
      ],
    );
    return result.rows[0]?.id;
  }

  const result = await dbQuery<{ id: string }>(
    `
      INSERT INTO inquiries (name, phone, email, interest, preferred_channel, message, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id::text
    `,
    [
      String(body.title ?? ""),
      String(body.phone ?? ""),
      String(body.email ?? ""),
      String(body.meta ?? ""),
      normalizeTags(body.tags)[0] ?? "phone",
      String(body.subtitle ?? ""),
      String(body.status ?? "new"),
    ],
  );

  return result.rows[0]?.id;
}

export async function updateAdminRecord(
  resource: AdminResource,
  id: string,
  body: Record<string, unknown>,
) {
  assertDatabase();

  if (resource === "users") {
    await dbQuery(
      `
        UPDATE admin_users
        SET name = $2, email = $3, role = $4, status = $5, updated_at = now()
        WHERE id = $1::uuid
      `,
      [
        id,
        String(body.title ?? ""),
        String(body.subtitle ?? ""),
        String(body.meta ?? "Editor"),
        String(body.status ?? "active"),
      ],
    );
    return;
  }

  if (resource === "blog") {
    await dbQuery(
      `
        UPDATE blog_posts
        SET title = $2, excerpt = $3, category = $4, status = $5, image_url = $6, tags = $7::text[], updated_at = now()
        WHERE id = $1::uuid
      `,
      [
        id,
        String(body.title ?? ""),
        String(body.subtitle ?? ""),
        String(body.meta ?? "Aesthetic Medicine"),
        String(body.status ?? "draft"),
        String(body.imageUrl ?? ""),
        toPostgresArray(normalizeTags(body.tags)),
      ],
    );
    return;
  }

  await dbQuery(
    `
      UPDATE inquiries
      SET name = $2, message = $3, interest = $4, status = $5, preferred_channel = $6, updated_at = now()
      WHERE id = $1::uuid
    `,
    [
      id,
      String(body.title ?? ""),
      String(body.subtitle ?? ""),
      String(body.meta ?? ""),
      String(body.status ?? "new"),
      normalizeTags(body.tags)[0] ?? "phone",
    ],
  );
}

export async function deleteAdminRecord(resource: AdminResource, id: string) {
  assertDatabase();
  const config = resourceConfigs[resource];
  await dbQuery(`DELETE FROM ${config.table} WHERE id = $1::uuid`, [id]);
}

function assertDatabase() {
  if (!hasDatabaseConnection()) {
    throw new Error("DATABASE_URL is not connected. Connect bsclinic-db first.");
  }
}

function normalizeTags(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
