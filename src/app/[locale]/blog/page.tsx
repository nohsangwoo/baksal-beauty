import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type PageProps = {
  params: Promise<{ locale: string }>;
};

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
  };
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = getDictionary(locale);

  return (
    <PageShell
      locale={locale}
      t={t}
      eyebrow={t.blog.eyebrow}
      title={`${t.blog.titleA} ${t.blog.titleB}`}
      description={t.newsletter.body}
      image="/images/blog-consultation.jpg"
      imageAlt={t.blog.posts[0]?.title ?? "BAKSAL BEAUTY blog"}
    >
      <section data-reveal-section="" className="py-24 md:py-32">
        <div className="section-shell grid gap-7 lg:grid-cols-3">
          {t.blog.posts.map((post) => (
            <article key={post.title} className="group">
              <div
                data-magnetic=""
                data-magnetic-strength="5"
                className="relative aspect-[1.35] overflow-hidden rounded-lg border border-white/10"
              >
                <Image src={post.image} alt={post.title} fill sizes="380px" className="object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <p className="eyebrow mt-6 text-[#e38aa0]">{post.category}</p>
              <h2 className="font-display mt-4 text-3xl leading-snug">{post.title}</h2>
              <a className="mt-6 inline-flex items-center gap-2 border-t border-white/10 pt-5 text-xs font-black uppercase hover:text-[#dec47b]" href={`/${locale}#blog`}>
                {t.common.readMore}
                <ArrowRight size={14} />
              </a>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
