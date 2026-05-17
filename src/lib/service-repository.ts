import type { Locale } from "@/i18n/config";
import {
  getFallbackServices,
  serviceCategoryIds,
  type ServiceCategoryId,
  type ServiceContentCategory,
  type ServiceItem,
  type ServiceStatus,
} from "@/data/service-content";
import { dbQuery, hasDatabaseConnection, toPostgresArray } from "@/lib/db";

type ServiceRow = {
  id: string;
  slug: string;
  category: ServiceContentCategory;
  tags: string[] | string;
  image_url: string;
  image_alt: string | null;
  featured: boolean;
  sort_order: number;
  status: ServiceStatus;
  title: string;
  subtitle: string;
  summary: string;
  description: string;
  highlights: string[] | string | null;
  recommended_for: string[] | string | null;
  process_steps: string[] | string | null;
  recovery: string;
  duration: string;
  price_note: string;
  updated_at: string;
};

export type ServiceMutationInput = {
  slug?: string;
  category?: ServiceContentCategory;
  tags?: ServiceContentCategory[];
  imageUrl?: string;
  imageAlt?: string;
  featured?: boolean;
  sortOrder?: number;
  status?: ServiceStatus;
  locale?: Locale;
  title?: string;
  subtitle?: string;
  summary?: string;
  description?: string;
  highlights?: string[];
  recommendedFor?: string[];
  process?: string[];
  recovery?: string;
  duration?: string;
  priceNote?: string;
};

export function normalizeServiceCategory(value: string | null): ServiceCategoryId {
  if (value && serviceCategoryIds.includes(value as ServiceCategoryId)) {
    return value as ServiceCategoryId;
  }

  return "all";
}

export async function listServices(locale: Locale, category: ServiceCategoryId = "all") {
  if (!hasDatabaseConnection()) {
    return {
      source: "fallback" as const,
      items: getFallbackServices(locale, category),
    };
  }

  try {
    const result = await dbQuery<ServiceRow>(
      `
        SELECT
          si.id::text,
          si.slug,
          si.category,
          si.tags,
          si.image_url,
          COALESCE(st.image_alt, st_ko.image_alt, '') AS image_alt,
          si.featured,
          si.sort_order,
          si.status,
          COALESCE(st.title, st_ko.title, '') AS title,
          COALESCE(st.subtitle, st_ko.subtitle, '') AS subtitle,
          COALESCE(st.summary, st_ko.summary, '') AS summary,
          COALESCE(st.description, st_ko.description, '') AS description,
          COALESCE(st.highlights, st_ko.highlights, ARRAY[]::text[]) AS highlights,
          COALESCE(st.recommended_for, st_ko.recommended_for, ARRAY[]::text[]) AS recommended_for,
          COALESCE(st.process_steps, st_ko.process_steps, ARRAY[]::text[]) AS process_steps,
          COALESCE(st.recovery, st_ko.recovery, '') AS recovery,
          COALESCE(st.duration, st_ko.duration, '') AS duration,
          COALESCE(st.price_note, st_ko.price_note, '') AS price_note,
          si.updated_at::text
        FROM service_items si
        LEFT JOIN service_item_translations st
          ON st.service_item_id = si.id AND st.locale = $1
        LEFT JOIN service_item_translations st_ko
          ON st_ko.service_item_id = si.id AND st_ko.locale = 'ko'
        WHERE si.status <> 'archived'
          AND ($2 = 'all' OR $2 = ANY(si.tags))
        ORDER BY si.featured DESC, si.sort_order ASC, si.created_at DESC
      `,
      [locale, category],
    );

    return {
      source: "database" as const,
      items: result.rows.map(mapServiceRow),
    };
  } catch (error) {
    console.error("Failed to list services from database", error);

    return {
      source: "fallback" as const,
      items: getFallbackServices(locale, category),
    };
  }
}

export async function getAdminServices(locale: Locale) {
  return listServices(locale, "all");
}

export async function createService(input: ServiceMutationInput) {
  assertDatabase();
  const locale = input.locale ?? "ko";
  const slug = input.slug?.trim();
  const category = input.category ?? "eye";

  if (!slug || !input.title?.trim()) {
    throw new Error("slug and title are required.");
  }

  const serviceResult = await dbQuery<{ id: string }>(
    `
      INSERT INTO service_items
        (slug, category, tags, image_url, featured, sort_order, status)
      VALUES ($1, $2, $3::text[], $4, $5, $6, $7)
      RETURNING id::text
    `,
    [
      slug,
      category,
      toPostgresArray(input.tags?.length ? input.tags : [category]),
      input.imageUrl ?? "",
      Boolean(input.featured),
      Number(input.sortOrder ?? 100),
      input.status ?? "draft",
    ],
  );

  const id = serviceResult.rows[0]?.id;
  if (!id) {
    throw new Error("Failed to create service.");
  }

  await upsertServiceTranslation(id, locale, input);

  return id;
}

export async function updateService(id: string, input: ServiceMutationInput) {
  assertDatabase();
  const locale = input.locale ?? "ko";

  await dbQuery(
    `
      UPDATE service_items
      SET
        slug = COALESCE($2, slug),
        category = COALESCE($3, category),
        tags = COALESCE($4::text[], tags),
        image_url = COALESCE($5, image_url),
        featured = COALESCE($6, featured),
        sort_order = COALESCE($7, sort_order),
        status = COALESCE($8, status),
        updated_at = now()
      WHERE id = $1::uuid
    `,
    [
      id,
      input.slug ?? null,
      input.category ?? null,
      input.tags ? toPostgresArray(input.tags) : null,
      input.imageUrl ?? null,
      typeof input.featured === "boolean" ? input.featured : null,
      typeof input.sortOrder === "number" ? input.sortOrder : null,
      input.status ?? null,
    ],
  );

  await upsertServiceTranslation(id, locale, input);

  return id;
}

export async function deleteService(id: string) {
  assertDatabase();
  await dbQuery("DELETE FROM service_items WHERE id = $1::uuid", [id]);
}

async function upsertServiceTranslation(
  serviceId: string,
  locale: Locale,
  input: ServiceMutationInput,
) {
  await dbQuery(
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
      VALUES
        ($1::uuid, $2, $3, $4, $5, $6, $7::text[], $8::text[], $9::text[], $10, $11, $12, $13)
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
      input.title ?? "",
      input.subtitle ?? "",
      input.summary ?? "",
      input.description ?? "",
      toPostgresArray(input.highlights ?? []),
      toPostgresArray(input.recommendedFor ?? []),
      toPostgresArray(input.process ?? []),
      input.recovery ?? "",
      input.duration ?? "",
      input.priceNote ?? "",
      input.imageAlt ?? "",
    ],
  );
}

function assertDatabase() {
  if (!hasDatabaseConnection()) {
    throw new Error("DATABASE_URL is not connected. Connect bsclinic-db first.");
  }
}

function mapServiceRow(row: ServiceRow): ServiceItem {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    tags: normalizeArray(row.tags) as ServiceContentCategory[],
    imageUrl: row.image_url,
    imageAlt: row.image_alt || row.title,
    featured: row.featured,
    sortOrder: row.sort_order,
    status: row.status,
    title: row.title,
    subtitle: row.subtitle,
    summary: row.summary,
    description: row.description,
    highlights: normalizeArray(row.highlights),
    recommendedFor: normalizeArray(row.recommended_for),
    process: normalizeArray(row.process_steps),
    recovery: row.recovery,
    duration: row.duration,
    priceNote: row.price_note,
    updatedAt: row.updated_at,
  };
}

function normalizeArray(value: string[] | string | null | undefined) {
  if (Array.isArray(value)) {
    return value;
  }

  if (!value) {
    return [];
  }

  return value
    .replace(/^{|}$/g, "")
    .split(",")
    .map((item) => item.replace(/^"|"$/g, "").trim())
    .filter(Boolean);
}
