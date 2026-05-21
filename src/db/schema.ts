import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import type {
  BlogContentBlock,
  BlogStatus,
} from "@/data/blog-content";
import type {
  InquiryReplyStatus,
  InquiryStatus,
} from "@/data/inquiry-content";
import type {
  ServiceBeforeAfter,
  ServiceContentCategory,
  ServiceDetailCta,
  ServiceDetailPanel,
  ServiceRichDetailImage,
  ServiceStatus,
  ServiceSurgeryInfo,
  ServiceVideoPreview,
} from "@/data/service-content";
import type { Locale } from "@/i18n/config";

const textArrayDefault = sql`ARRAY[]::text[]`;
const realArrayDefault = sql`ARRAY[]::real[]`;

export const serviceItems = pgTable(
  "service_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    category: text("category").$type<ServiceContentCategory>().notNull(),
    tags: text("tags").array().$type<ServiceContentCategory[]>().notNull().default(textArrayDefault),
    imageUrl: text("image_url").notNull().default(""),
    featured: boolean("featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(100),
    status: text("status").$type<ServiceStatus>().notNull().default("draft"),
    relatedSlugs: text("related_slugs").array().notNull().default(textArrayDefault),
    embedding: real("embedding").array().notNull().default(realArrayDefault),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  },
  (table) => [
    index("service_items_status_sort_idx").on(table.status, table.featured, table.sortOrder),
    index("service_items_tags_idx").using("gin", table.tags),
  ],
);

export const serviceItemTranslations = pgTable(
  "service_item_translations",
  {
    serviceItemId: uuid("service_item_id")
      .notNull()
      .references(() => serviceItems.id, { onDelete: "cascade" }),
    locale: text("locale").$type<Locale>().notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle").notNull().default(""),
    summary: text("summary").notNull().default(""),
    description: text("description").notNull().default(""),
    highlights: text("highlights").array().notNull().default(textArrayDefault),
    recommendedFor: text("recommended_for").array().notNull().default(textArrayDefault),
    processSteps: text("process_steps").array().notNull().default(textArrayDefault),
    recovery: text("recovery").notNull().default(""),
    duration: text("duration").notNull().default(""),
    priceNote: text("price_note").notNull().default(""),
    imageAlt: text("image_alt").notNull().default(""),
    surgeryInfo: jsonb("surgery_info").$type<ServiceSurgeryInfo>().notNull().default(sql`'{}'::jsonb`),
    detailPanels: jsonb("detail_panels").$type<ServiceDetailPanel[]>().notNull().default(sql`'[]'::jsonb`),
    beforeAfter: jsonb("before_after").$type<ServiceBeforeAfter>().notNull().default(sql`'{}'::jsonb`),
    richDetailImages: jsonb("rich_detail_images")
      .$type<ServiceRichDetailImage[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    youtubeVideos: jsonb("youtube_videos").$type<ServiceVideoPreview[]>().notNull().default(sql`'[]'::jsonb`),
    detailCta: jsonb("detail_cta").$type<ServiceDetailCta>().notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.serviceItemId, table.locale] }),
  ],
);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    firebaseUid: text("firebase_uid").unique(),
    name: text("name").notNull().default(""),
    email: text("email").notNull().unique(),
    phone: text("phone").notNull().default(""),
    photoUrl: text("photo_url").notNull().default(""),
    role: text("role").notNull().default("Patient"),
    status: text("status").notNull().default("active"),
    authProvider: text("auth_provider").notNull().default("firebase"),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true, mode: "string" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  },
  (table) => [
    index("users_role_status_idx").on(table.role, table.status),
    index("users_created_at_idx").on(table.createdAt),
  ],
);

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    excerpt: text("excerpt").notNull().default(""),
    category: text("category").notNull().default("Aesthetic Medicine"),
    status: text("status").$type<BlogStatus>().notNull().default("draft"),
    imageUrl: text("image_url").notNull().default(""),
    imageAlt: text("image_alt").notNull().default(""),
    tags: text("tags").array().notNull().default(textArrayDefault),
    featured: boolean("featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(100),
    authorName: text("author_name").notNull().default("BAKSAL BEAUTY"),
    publishedAt: timestamp("published_at", { withTimezone: true, mode: "string" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  },
  (table) => [
    index("blog_posts_status_created_idx").on(table.status, table.createdAt),
    index("blog_posts_status_sort_idx").on(table.status, table.featured, table.sortOrder),
  ],
);

export const blogPostTranslations = pgTable(
  "blog_post_translations",
  {
    blogPostId: uuid("blog_post_id")
      .notNull()
      .references(() => blogPosts.id, { onDelete: "cascade" }),
    locale: text("locale").$type<Locale>().notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull().default(""),
    contentBlocks: jsonb("content_blocks").$type<BlogContentBlock[]>().notNull().default(sql`'[]'::jsonb`),
    seoTitle: text("seo_title").notNull().default(""),
    seoDescription: text("seo_description").notNull().default(""),
    imageAlt: text("image_alt").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.blogPostId, table.locale] }),
  ],
);

export const inquiries = pgTable(
  "inquiries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    seedKey: text("seed_key"),
    name: text("name").notNull(),
    phone: text("phone").notNull().default(""),
    email: text("email").notNull().default(""),
    interest: text("interest").notNull().default(""),
    preferredChannel: text("preferred_channel").notNull().default("phone"),
    subject: text("subject").notNull().default(""),
    message: text("message").notNull().default(""),
    status: text("status").$type<InquiryStatus>().notNull().default("new"),
    assignedTo: text("assigned_to").notNull().default(""),
    locale: text("locale").notNull().default("ko"),
    privacyAccepted: boolean("privacy_accepted").notNull().default(false),
    sourcePath: text("source_path").notNull().default(""),
    repliedAt: timestamp("replied_at", { withTimezone: true, mode: "string" }),
    closedAt: timestamp("closed_at", { withTimezone: true, mode: "string" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  },
  (table) => [
    index("inquiries_status_created_idx").on(table.status, table.createdAt),
    uniqueIndex("inquiries_seed_key_unique_idx").on(table.seedKey).where(sql`${table.seedKey} IS NOT NULL AND ${table.seedKey} <> ''`),
  ],
);

export const inquiryReplies = pgTable(
  "inquiry_replies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    inquiryId: uuid("inquiry_id")
      .notNull()
      .references(() => inquiries.id, { onDelete: "cascade" }),
    adminName: text("admin_name").notNull().default(""),
    adminEmail: text("admin_email").notNull().default(""),
    sentTo: text("sent_to").notNull().default(""),
    subject: text("subject").notNull().default(""),
    body: text("body").notNull().default(""),
    status: text("status").$type<InquiryReplyStatus>().notNull().default("sent"),
    errorMessage: text("error_message").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  },
  (table) => [
    index("inquiry_replies_inquiry_created_idx").on(table.inquiryId, table.createdAt),
  ],
);
