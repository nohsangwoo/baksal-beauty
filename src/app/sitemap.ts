import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/i18n/config";
import { listBlogPosts } from "@/lib/blog-repository";
import { listServices } from "@/lib/service-repository";
import { absoluteLanguageAlternates, localizedAbsoluteUrl, siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const staticPaths = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "about", priority: 0.78, changeFrequency: "monthly" },
  { path: "service", priority: 0.9, changeFrequency: "weekly" },
  { path: "blog", priority: 0.82, changeFrequency: "daily" },
  { path: "inquire", priority: 0.74, changeFrequency: "monthly" },
  { path: "company", priority: 0.88, changeFrequency: "monthly" },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: absoluteLanguageAlternates(""),
      },
    },
  ];

  for (const locale of locales) {
    for (const page of staticPaths) {
      entries.push(createEntry(locale, page.path, {
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      }));
    }
  }

  const [serviceGroups, blogGroups] = await Promise.all([
    Promise.all(locales.map(async (locale) => ({ locale, result: await listServices(locale, "all") }))),
    Promise.all(locales.map(async (locale) => ({ locale, result: await listBlogPosts(locale) }))),
  ]);

  for (const { locale, result } of serviceGroups) {
    for (const service of result.items) {
      entries.push(createEntry(locale, `service/${service.slug}`, {
        lastModified: service.updatedAt ? new Date(service.updatedAt) : now,
        changeFrequency: "weekly",
        priority: service.featured ? 0.86 : 0.8,
      }));
    }
  }

  for (const { locale, result } of blogGroups) {
    for (const post of result.items) {
      entries.push(createEntry(locale, `blog/${post.slug}`, {
        lastModified: new Date(post.updatedAt || post.publishedAt || post.createdAt || now),
        changeFrequency: "monthly",
        priority: post.featured ? 0.78 : 0.7,
      }));
    }
  }

  return dedupeEntries(entries);
}

function createEntry(
  locale: Locale,
  path: string,
  options: Pick<MetadataRoute.Sitemap[number], "lastModified" | "changeFrequency" | "priority">,
): MetadataRoute.Sitemap[number] {
  return {
    url: localizedAbsoluteUrl(locale, path),
    ...options,
    alternates: {
      languages: absoluteLanguageAlternates(path),
    },
  };
}

function dedupeEntries(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const seen = new Set<string>();

  return entries.filter((entry) => {
    if (seen.has(entry.url)) {
      return false;
    }

    seen.add(entry.url);
    return true;
  });
}
