import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Tag } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { ContactSection, NewsletterSection } from "@/components/shared-sections";
import type { BlogContentBlock } from "@/data/blog-content";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getBlogPostBySlug, listBlogPosts } from "@/lib/blog-repository";
import { keywordsFor, pageAlternates } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const post = await getBlogPostBySlug(locale, slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.seoTitle || post.title} | BAKSAL BEAUTY`,
    description: post.seoDescription || post.excerpt,
    keywords: keywordsFor(locale, [post.category, ...post.tags]),
    alternates: pageAlternates(locale, `blog/${post.slug}`),
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      url: `/${locale}/blog/${post.slug}`,
      siteName: "BAKSAL BEAUTY",
      type: "article",
      publishedTime: post.publishedAt || undefined,
      authors: [post.authorName || "BAKSAL BEAUTY"],
      tags: post.tags,
      images: post.imageUrl ? [{ url: post.imageUrl, alt: post.imageAlt || post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.imageUrl ? [post.imageUrl] : ["/opengraph-image"],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = getDictionary(locale);
  const post = await getBlogPostBySlug(locale, slug);

  if (!post) {
    notFound();
  }

  const related = (await listBlogPosts(locale, { limit: 4 })).items
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

  return (
    <PageShell
      locale={locale}
      t={t}
      eyebrow={post.category}
      title={post.title}
      description={post.excerpt}
      image={post.imageUrl || "/images/blog-consultation.jpg"}
      imageAlt={post.imageAlt || post.title}
    >
      <article>
        <section className="border-b border-white/10 bg-[#1f1715] py-8">
          <div className="section-shell">
            <div className="flex flex-wrap gap-3 text-xs font-black uppercase text-white/58">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                <CalendarDays size={14} className="text-[#dec47b]" />
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(locale) : "Draft"}
              </span>
              {post.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                  <Tag size={13} className="text-[#dec47b]" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="section-shell grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,0.22fr)]">
            <div className="grid gap-8">
              {post.contentBlocks.map((block, index) => (
                <BlogBlock key={block.id || index} block={block} />
              ))}
            </div>
            <aside className="h-fit border-l border-white/10 pl-6 lg:sticky lg:top-28">
              <p className="eyebrow text-[#dec47b]">Editor Note</p>
              <p className="mt-5 text-sm font-bold leading-7 text-[#d9d0c9]">
                본 콘텐츠는 개인별 진단을 대체하지 않습니다. 시술 가능 여부와 범위는 의료진 상담 후 안내됩니다.
              </p>
              <Link className="button-primary mt-7" href={`/${locale}/inquire`}>
                상담 문의
              </Link>
            </aside>
          </div>
        </section>
      </article>

      {related.length ? (
        <section className="border-y border-white/10 bg-[#241b18] py-20 md:py-28">
          <div className="section-shell">
            <p className="eyebrow text-[#dec47b]">Related Notes</p>
            <h2 className="font-display mt-4 text-5xl md:text-6xl">More from BAKSAL BEAUTY</h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {related.map((item, index) => (
                <Link key={item.slug} className="group" href={`/${locale}/blog/${item.slug}`} style={{ "--reveal-delay": `${index * 80}ms` } as CSSProperties}>
                  <div className="relative aspect-[1.45] overflow-hidden rounded-lg border border-white/10">
                    <Image src={item.imageUrl || "/images/blog-consultation.jpg"} alt={item.imageAlt || item.title} fill sizes="33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <p className="eyebrow mt-5 text-[#e38aa0]">{item.category}</p>
                  <h3 className="font-display mt-3 text-3xl leading-snug">{item.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ContactSection t={t} locale={locale} />
      <NewsletterSection t={t} />
    </PageShell>
  );
}

function BlogBlock({ block }: { block: BlogContentBlock }) {
  if (block.type === "heading") {
    const Heading = block.level === 3 ? "h3" : "h2";

    return (
      <Heading className={`${block.level === 3 ? "text-4xl" : "text-5xl md:text-6xl"} font-display leading-tight text-[#fff8ef]`}>
        {block.content}
      </Heading>
    );
  }

  if (block.type === "image") {
    return (
      <figure className="overflow-hidden rounded-lg border border-white/10 bg-[#0d0b0c]">
        {block.imageUrl ? (
          <Image src={block.imageUrl} alt={block.imageAlt || block.caption || "Blog image"} width={1280} height={760} className="h-auto w-full object-cover" />
        ) : null}
        {block.caption ? <figcaption className="px-5 py-4 text-sm font-bold text-white/58">{block.caption}</figcaption> : null}
      </figure>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote className="border-l-4 border-[#dec47b] bg-white/[0.035] px-7 py-6 font-display text-3xl leading-snug text-[#fff8ef]">
        {block.content}
      </blockquote>
    );
  }

  if (block.type === "callout") {
    return (
      <div className="rounded-lg border border-[#dec47b]/25 bg-[#dec47b]/8 p-6">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#dec47b]">BAKSAL Note</p>
        <p className="mt-4 leading-8 text-[#f4e7d6]">{block.content}</p>
      </div>
    );
  }

  if (block.type === "divider") {
    return <div className="h-px bg-white/10" aria-hidden="true" />;
  }

  return <p className="text-lg leading-9 text-[#d9d0c9]">{block.content}</p>;
}
