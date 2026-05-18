import { and, asc, desc, eq, ne, sql, type SQL } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import {
  createServiceEmbedding,
  getServiceDetailContent,
} from "@/data/service-detail-defaults";
import type { Locale } from "@/i18n/config";
import {
  getFallbackServices,
  serviceCategoryIds,
  type ServiceBeforeAfter,
  type ServiceCategoryId,
  type ServiceContentCategory,
  type ServiceDetailCta,
  type ServiceDetailPanel,
  type ServiceItem,
  type ServiceRichDetailImage,
  type ServiceStatus,
  type ServiceSurgeryInfo,
  type ServiceVideoPreview,
} from "@/data/service-content";
import { serviceItems, serviceItemTranslations } from "@/db/schema";
import { getDb, hasDatabaseConnection } from "@/lib/db";

type ListOptions = {
  includeDrafts?: boolean;
};

type ServiceRow = {
  id: string;
  slug: string;
  category: ServiceContentCategory;
  tags: ServiceContentCategory[] | string | null;
  imageUrl: string;
  imageAlt: string | null;
  featured: boolean;
  sortOrder: number;
  status: ServiceStatus;
  relatedSlugs: string[] | string | null;
  embedding: number[] | string | null;
  title: string;
  subtitle: string;
  summary: string;
  description: string;
  highlights: string[] | string | null;
  recommendedFor: string[] | string | null;
  processSteps: string[] | string | null;
  recovery: string;
  duration: string;
  priceNote: string;
  surgeryInfo: ServiceSurgeryInfo | string | null;
  detailPanels: ServiceDetailPanel[] | string | null;
  beforeAfter: ServiceBeforeAfter | string | null;
  richDetailImages: ServiceRichDetailImage[] | string | null;
  youtubeVideos: ServiceVideoPreview[] | string | null;
  detailCta: ServiceDetailCta | string | null;
  updatedAt: string;
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
  relatedSlugs?: string[];
  embedding?: number[];
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
  surgeryInfo?: ServiceSurgeryInfo;
  detailPanels?: ServiceDetailPanel[];
  beforeAfter?: ServiceBeforeAfter;
  richDetailImages?: ServiceRichDetailImage[];
  youtubeVideos?: ServiceVideoPreview[];
  detailCta?: ServiceDetailCta;
};

const localizedTranslations = alias(serviceItemTranslations, "st");
const koreanTranslations = alias(serviceItemTranslations, "st_ko");

export function normalizeServiceCategory(value: string | null): ServiceCategoryId {
  if (value && serviceCategoryIds.includes(value as ServiceCategoryId)) {
    return value as ServiceCategoryId;
  }

  return "all";
}

export async function listServices(
  locale: Locale,
  category: ServiceCategoryId = "all",
  options: ListOptions = {},
) {
  if (!hasDatabaseConnection()) {
    const fallback = getFallbackServices(locale, category).filter(
      (item) => options.includeDrafts || item.status === "published",
    );

    return {
      source: "fallback" as const,
      items: fallback,
    };
  }

  try {
    const filters: SQL[] = [ne(serviceItems.status, "archived")];

    if (!options.includeDrafts) {
      filters.push(eq(serviceItems.status, "published"));
    }

    if (category !== "all") {
      filters.push(sql`${category} = any(${serviceItems.tags})`);
    }

    const rows = await getDb()
      .select(serviceSelectFields())
      .from(serviceItems)
      .leftJoin(
        localizedTranslations,
        and(
          eq(localizedTranslations.serviceItemId, serviceItems.id),
          eq(localizedTranslations.locale, locale),
        ),
      )
      .leftJoin(
        koreanTranslations,
        and(
          eq(koreanTranslations.serviceItemId, serviceItems.id),
          eq(koreanTranslations.locale, "ko"),
        ),
      )
      .where(and(...filters))
      .orderBy(desc(serviceItems.featured), asc(serviceItems.sortOrder), desc(serviceItems.createdAt));

    return {
      source: "database" as const,
      items: rows.map(mapServiceRow),
    };
  } catch (error) {
    console.error("Failed to list services from database", error);

    return {
      source: "fallback" as const,
      items: getFallbackServices(locale, category).filter(
        (item) => options.includeDrafts || item.status === "published",
      ),
    };
  }
}

export async function getAdminServices(locale: Locale) {
  return listServices(locale, "all", { includeDrafts: true });
}

export async function getAdminServiceById(locale: Locale, id: string) {
  if (!hasDatabaseConnection()) {
    return getFallbackServices(locale, "all").find((item) => item.id === id || item.slug === id) ?? null;
  }

  try {
    const rows = await getDb()
      .select(serviceSelectFields())
      .from(serviceItems)
      .leftJoin(
        localizedTranslations,
        and(
          eq(localizedTranslations.serviceItemId, serviceItems.id),
          eq(localizedTranslations.locale, locale),
        ),
      )
      .leftJoin(
        koreanTranslations,
        and(
          eq(koreanTranslations.serviceItemId, serviceItems.id),
          eq(koreanTranslations.locale, "ko"),
        ),
      )
      .where(and(ne(serviceItems.status, "archived"), eq(serviceItems.id, id)))
      .limit(1);

    return rows[0] ? mapServiceRow(rows[0]) : null;
  } catch (error) {
    console.error(`Failed to get admin service ${id} from database`, error);
    return null;
  }
}

export async function getServiceBySlug(locale: Locale, slug: string) {
  if (!hasDatabaseConnection()) {
    return (
      getFallbackServices(locale, "all").find(
        (item) => item.slug === slug && item.status === "published",
      ) ?? null
    );
  }

  try {
    const rows = await getDb()
      .select(serviceSelectFields())
      .from(serviceItems)
      .leftJoin(
        localizedTranslations,
        and(
          eq(localizedTranslations.serviceItemId, serviceItems.id),
          eq(localizedTranslations.locale, locale),
        ),
      )
      .leftJoin(
        koreanTranslations,
        and(
          eq(koreanTranslations.serviceItemId, serviceItems.id),
          eq(koreanTranslations.locale, "ko"),
        ),
      )
      .where(and(eq(serviceItems.status, "published"), eq(serviceItems.slug, slug)))
      .limit(1);

    return rows[0] ? mapServiceRow(rows[0]) : null;
  } catch (error) {
    console.error(`Failed to get service ${slug} from database`, error);
    return (
      getFallbackServices(locale, "all").find(
        (item) => item.slug === slug && item.status === "published",
      ) ?? null
    );
  }
}

export async function getRelatedServices(locale: Locale, service: ServiceItem, limit = 2) {
  const result = await listServices(locale, "all");
  const candidates = result.items.filter((item) => item.slug !== service.slug);
  const bySlug = new Map(candidates.map((item) => [item.slug, item]));
  const explicit = (service.relatedSlugs ?? [])
    .map((slug) => bySlug.get(slug))
    .filter((item): item is ServiceItem => Boolean(item));
  const explicitSlugs = new Set(explicit.map((item) => item.slug));
  const serviceVector = getEmbedding(service);
  const scored = candidates
    .filter((item) => !explicitSlugs.has(item.slug))
    .map((item) => ({
      item,
      score:
        cosineSimilarity(serviceVector, getEmbedding(item)) +
        sharedTagScore(service, item) +
        (service.category === item.category ? 0.08 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);

  return [...explicit, ...scored].slice(0, limit);
}

export async function createService(input: ServiceMutationInput) {
  assertDatabase();
  const locale = input.locale ?? "ko";
  const slug = input.slug?.trim();
  const category = input.category ?? "eye";
  const tags = input.tags?.length ? input.tags : [category];
  const embedding = input.embedding?.length
    ? input.embedding
    : createServiceEmbedding(category, tags, `${input.title ?? ""} ${input.summary ?? ""}`);

  if (!slug || !input.title?.trim()) {
    throw new Error("slug and title are required.");
  }

  const [service] = await getDb()
    .insert(serviceItems)
    .values({
      slug,
      category,
      tags,
      imageUrl: input.imageUrl ?? "",
      featured: Boolean(input.featured),
      sortOrder: Number(input.sortOrder ?? 100),
      status: input.status ?? "published",
      relatedSlugs: input.relatedSlugs ?? [],
      embedding,
    })
    .returning({ id: serviceItems.id });

  const id = service?.id;
  if (!id) {
    throw new Error("Failed to create service.");
  }

  await upsertServiceTranslation(id, locale, input);

  return id;
}

export async function updateService(id: string, input: ServiceMutationInput) {
  assertDatabase();
  const locale = input.locale ?? "ko";
  const category = input.category ?? "eye";
  const tags = input.tags?.length ? input.tags : undefined;
  const embedding = input.embedding?.length
    ? input.embedding
    : input.category || input.tags || input.title || input.summary
      ? createServiceEmbedding(
          category,
          tags ?? [category],
          `${input.title ?? ""} ${input.summary ?? ""}`,
        )
      : undefined;

  await getDb()
    .update(serviceItems)
    .set({
      slug: input.slug ?? undefined,
      category: input.category ?? undefined,
      tags,
      imageUrl: input.imageUrl ?? undefined,
      featured: typeof input.featured === "boolean" ? input.featured : undefined,
      sortOrder: typeof input.sortOrder === "number" ? input.sortOrder : undefined,
      status: input.status ?? undefined,
      relatedSlugs: input.relatedSlugs ?? undefined,
      embedding,
      updatedAt: sql`now()`,
    })
    .where(eq(serviceItems.id, id));

  await upsertServiceTranslation(id, locale, input);

  return id;
}

export async function deleteService(id: string) {
  assertDatabase();
  await getDb().delete(serviceItems).where(eq(serviceItems.id, id));
}

async function upsertServiceTranslation(
  serviceId: string,
  locale: Locale,
  input: ServiceMutationInput,
) {
  const detailDefaults = getServiceDetailContent(
    {
      id: serviceId,
      slug: input.slug ?? "",
      category: input.category ?? "eye",
      tags: input.tags ?? [input.category ?? "eye"],
      imageUrl: input.imageUrl ?? "",
      imageAlt: input.imageAlt ?? input.title ?? "",
      featured: Boolean(input.featured),
      sortOrder: Number(input.sortOrder ?? 100),
      status: input.status ?? "published",
      title: input.title ?? "",
      subtitle: input.subtitle ?? "",
      summary: input.summary ?? "",
      description: input.description ?? "",
      highlights: input.highlights ?? [],
      recommendedFor: input.recommendedFor ?? [],
      process: input.process ?? [],
      recovery: input.recovery ?? "",
      duration: input.duration ?? "",
      priceNote: input.priceNote ?? "",
      surgeryInfo: input.surgeryInfo,
      detailPanels: input.detailPanels,
      beforeAfter: input.beforeAfter,
      youtubeVideos: input.youtubeVideos,
      richDetailImages: input.richDetailImages,
      detailCta: input.detailCta,
    },
    locale,
  );

  const values = {
    serviceItemId: serviceId,
    locale,
    title: input.title ?? "",
    subtitle: input.subtitle ?? "",
    summary: input.summary ?? "",
    description: input.description ?? "",
    highlights: input.highlights ?? [],
    recommendedFor: input.recommendedFor ?? [],
    processSteps: input.process ?? [],
    recovery: input.recovery ?? "",
    duration: input.duration ?? "",
    priceNote: input.priceNote ?? "",
    imageAlt: input.imageAlt ?? "",
    surgeryInfo: input.surgeryInfo ?? detailDefaults.surgeryInfo,
    detailPanels: input.detailPanels ?? detailDefaults.detailPanels,
    beforeAfter: input.beforeAfter ?? detailDefaults.beforeAfter,
    richDetailImages: input.richDetailImages ?? detailDefaults.richDetailImages,
    youtubeVideos: input.youtubeVideos ?? detailDefaults.youtubeVideos,
    detailCta: input.detailCta ?? detailDefaults.detailCta,
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

function serviceSelectFields() {
  return {
    id: serviceItems.id,
    slug: serviceItems.slug,
    category: serviceItems.category,
    tags: serviceItems.tags,
    imageUrl: serviceItems.imageUrl,
    imageAlt: sql<string>`coalesce(${localizedTranslations.imageAlt}, ${koreanTranslations.imageAlt}, '')`,
    featured: serviceItems.featured,
    sortOrder: serviceItems.sortOrder,
    status: serviceItems.status,
    relatedSlugs: serviceItems.relatedSlugs,
    embedding: serviceItems.embedding,
    title: sql<string>`coalesce(${localizedTranslations.title}, ${koreanTranslations.title}, '')`,
    subtitle: sql<string>`coalesce(${localizedTranslations.subtitle}, ${koreanTranslations.subtitle}, '')`,
    summary: sql<string>`coalesce(${localizedTranslations.summary}, ${koreanTranslations.summary}, '')`,
    description: sql<string>`coalesce(${localizedTranslations.description}, ${koreanTranslations.description}, '')`,
    highlights: sql<string[]>`coalesce(${localizedTranslations.highlights}, ${koreanTranslations.highlights}, ARRAY[]::text[])`,
    recommendedFor: sql<string[]>`coalesce(${localizedTranslations.recommendedFor}, ${koreanTranslations.recommendedFor}, ARRAY[]::text[])`,
    processSteps: sql<string[]>`coalesce(${localizedTranslations.processSteps}, ${koreanTranslations.processSteps}, ARRAY[]::text[])`,
    recovery: sql<string>`coalesce(${localizedTranslations.recovery}, ${koreanTranslations.recovery}, '')`,
    duration: sql<string>`coalesce(${localizedTranslations.duration}, ${koreanTranslations.duration}, '')`,
    priceNote: sql<string>`coalesce(${localizedTranslations.priceNote}, ${koreanTranslations.priceNote}, '')`,
    surgeryInfo: sql<ServiceSurgeryInfo>`coalesce(${localizedTranslations.surgeryInfo}, ${koreanTranslations.surgeryInfo}, '{}'::jsonb)`,
    detailPanels: sql<ServiceDetailPanel[]>`coalesce(${localizedTranslations.detailPanels}, ${koreanTranslations.detailPanels}, '[]'::jsonb)`,
    beforeAfter: sql<ServiceBeforeAfter>`coalesce(${localizedTranslations.beforeAfter}, ${koreanTranslations.beforeAfter}, '{}'::jsonb)`,
    richDetailImages: sql<ServiceRichDetailImage[]>`coalesce(${localizedTranslations.richDetailImages}, ${koreanTranslations.richDetailImages}, '[]'::jsonb)`,
    youtubeVideos: sql<ServiceVideoPreview[]>`coalesce(${localizedTranslations.youtubeVideos}, ${koreanTranslations.youtubeVideos}, '[]'::jsonb)`,
    detailCta: sql<ServiceDetailCta>`coalesce(${localizedTranslations.detailCta}, ${koreanTranslations.detailCta}, '{}'::jsonb)`,
    updatedAt: serviceItems.updatedAt,
  };
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
    imageUrl: row.imageUrl,
    imageAlt: row.imageAlt || row.title,
    featured: row.featured,
    sortOrder: row.sortOrder,
    status: row.status,
    relatedSlugs: normalizeArray(row.relatedSlugs),
    embedding: normalizeNumberArray(row.embedding),
    title: row.title,
    subtitle: row.subtitle,
    summary: row.summary,
    description: row.description,
    highlights: normalizeArray(row.highlights),
    recommendedFor: normalizeArray(row.recommendedFor),
    process: normalizeArray(row.processSteps),
    recovery: row.recovery,
    duration: row.duration,
    priceNote: row.priceNote,
    surgeryInfo: normalizeJson<ServiceSurgeryInfo | undefined>(row.surgeryInfo, undefined),
    detailPanels: normalizeJson<ServiceDetailPanel[]>(row.detailPanels, []),
    beforeAfter: normalizeJson<ServiceBeforeAfter | undefined>(row.beforeAfter, undefined),
    richDetailImages: normalizeJson<ServiceRichDetailImage[]>(row.richDetailImages, []),
    youtubeVideos: normalizeJson<ServiceVideoPreview[]>(row.youtubeVideos, []),
    detailCta: normalizeJson<ServiceDetailCta | undefined>(row.detailCta, undefined),
    updatedAt: row.updatedAt,
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

function normalizeNumberArray(value: number[] | string | null | undefined) {
  if (Array.isArray(value)) {
    return value.map(Number).filter(Number.isFinite);
  }

  if (!value) {
    return [];
  }

  return value
    .replace(/^{|}$/g, "")
    .split(",")
    .map((item) => Number(item.trim()))
    .filter(Number.isFinite);
}

function normalizeJson<T>(value: unknown, fallback: T): T {
  if (!value) {
    return fallback;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  return value as T;
}

function getEmbedding(service: ServiceItem) {
  return service.embedding?.length
    ? service.embedding
    : createServiceEmbedding(service.category, service.tags, `${service.title} ${service.summary}`);
}

function cosineSimilarity(a: number[], b: number[]) {
  if (!a.length || !b.length) {
    return 0;
  }

  const size = Math.min(a.length, b.length);
  let dot = 0;
  let aMagnitude = 0;
  let bMagnitude = 0;

  for (let index = 0; index < size; index += 1) {
    dot += a[index] * b[index];
    aMagnitude += a[index] * a[index];
    bMagnitude += b[index] * b[index];
  }

  return dot / ((Math.sqrt(aMagnitude) || 1) * (Math.sqrt(bMagnitude) || 1));
}

function sharedTagScore(a: ServiceItem, b: ServiceItem) {
  const aTags = new Set(a.tags);
  const shared = b.tags.filter((tag) => aTags.has(tag)).length;

  return shared * 0.12;
}
