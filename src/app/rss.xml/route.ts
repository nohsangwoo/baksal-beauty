import { localeLabels, locales, type Locale } from "@/i18n/config";
import { listBlogPosts } from "@/lib/blog-repository";
import { absoluteUrl, companySeoKeywords, localizedAbsoluteUrl, siteName } from "@/lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  const groups = await Promise.all(
    locales.map(async (locale) => ({
      locale,
      posts: (await listBlogPosts(locale)).items,
    })),
  );

  const items = groups
    .flatMap(({ locale, posts }) => posts.map((post) => ({ locale, post })))
    .sort((a, b) => {
      const aDate = new Date(a.post.publishedAt || a.post.updatedAt || a.post.createdAt || 0).getTime();
      const bDate = new Date(b.post.publishedAt || b.post.updatedAt || b.post.createdAt || 0).getTime();
      return bDate - aDate;
    })
    .slice(0, 80);

  const updatedAt = items[0]?.post.publishedAt || items[0]?.post.updatedAt || new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)} Journal</title>
    <link>${absoluteUrl("/ko/blog")}</link>
    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />
    <description>${escapeXml("BAKSAL BEAUTY aesthetic medicine notes and LUDGI Inc. hospital website production updates in Korean, English, Chinese, and Japanese.")}</description>
    <language>ko-KR</language>
    <lastBuildDate>${new Date(updatedAt).toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
${renderCompanyItem()}
${items.map(({ locale, post }) => renderItem(locale, post)).join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

function renderItem(locale: Locale, post: Awaited<ReturnType<typeof listBlogPosts>>["items"][number]) {
  const url = localizedAbsoluteUrl(locale, `blog/${post.slug}`);
  const publishedAt = new Date(post.publishedAt || post.updatedAt || post.createdAt || Date.now());
  const title = `[${localeLabels[locale]}] ${post.seoTitle || post.title}`;

  return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${publishedAt.toUTCString()}</pubDate>
      <author>${escapeXml(post.authorName || siteName)}</author>
      <category>${escapeXml(post.category)}</category>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
      <description>${escapeCdata(post.seoDescription || post.excerpt)}</description>
    </item>`;
}

function renderCompanyItem() {
  const url = localizedAbsoluteUrl("ko", "company");

  return `    <item>
      <title>${escapeXml("[KR] 주식회사 럿지 병원 홈페이지 제작 안내")}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date("2026-05-21T00:00:00.000Z").toUTCString()}</pubDate>
      <author>${escapeXml("LUDGI Inc.")}</author>
      ${companySeoKeywords.slice(0, 12).map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
      <description>${escapeCdata("주식회사 럿지의 병원 홈페이지 제작, 성형외과 홈페이지 제작, 홈페이지 제작 아웃소싱, SEO와 관리자 CMS 구축 안내 페이지입니다.")}</description>
    </item>`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeCdata(value: string) {
  return `<![CDATA[${value.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}
