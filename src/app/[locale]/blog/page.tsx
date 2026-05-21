import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { listBlogPosts } from "@/lib/blog-repository";
import { keywordsFor, pageAlternates, pageOpenGraph } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const t = getDictionary(locale);

  return {
    title: `${t.nav[2]?.label ?? "Blog"} | BAKSAL BEAUTY`,
    description: `${t.blog.titleA} ${t.blog.titleB}`,
    keywords: keywordsFor(locale, ["blog", "journal", "aesthetic medicine guide"]),
    alternates: pageAlternates(locale, "blog"),
    openGraph: pageOpenGraph({
      locale,
      path: "blog",
      title: `${t.nav[2]?.label ?? "Blog"} | BAKSAL BEAUTY`,
      description: `${t.blog.titleA} ${t.blog.titleB}`,
      image: "/images/blog-consultation.jpg",
    }),
  };
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = getDictionary(locale);
  const posts = await listBlogPosts(locale);
  const heroPost = posts.items[0];

  return (
    <PageShell
      locale={locale}
      t={t}
      eyebrow={t.blog.eyebrow}
      title={`${t.blog.titleA} ${t.blog.titleB}`}
      description={t.newsletter.body}
      image={heroPost?.imageUrl || "/images/blog-consultation.jpg"}
      imageAlt={heroPost?.imageAlt || t.blog.posts[0]?.title || "BAKSAL BEAUTY blog"}
    >
      <section data-reveal-section="" className="py-24 md:py-32">
        {posts.source === "fallback" ? (
          <div className="section-shell mb-8">
            <p className="rounded-md border border-[#dec47b]/25 bg-[#dec47b]/8 px-4 py-3 text-sm font-bold text-[#dec47b]">
              Blog is showing fallback content until Neon blog data is available.
            </p>
          </div>
        ) : null}
        <div className="section-shell grid gap-7 lg:grid-cols-3">
          {posts.items.map((post) => (
            <article key={post.title} className="group">
              <div
                data-magnetic=""
                data-magnetic-strength="5"
                className="relative aspect-[1.35] overflow-hidden rounded-lg border border-white/10"
              >
                <Image src={post.imageUrl || "/images/blog-consultation.jpg"} alt={post.imageAlt || post.title} fill sizes="380px" className="object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <p className="eyebrow mt-6 text-[#e38aa0]">{post.category}</p>
              <h2 className="font-display mt-4 text-3xl leading-snug">{post.title}</h2>
              <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#d9d0c9]">{post.excerpt}</p>
              <Link className="mt-6 inline-flex items-center gap-2 border-t border-white/10 pt-5 text-xs font-black uppercase hover:text-[#dec47b]" href={`/${locale}/blog/${post.slug}`}>
                {t.common.readMore}
                <ArrowRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
