"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, Clock, Loader2, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import { useState } from "react";
import {
  serviceCategoryIds,
  type ServiceCategoryId,
  type ServiceItem,
  type ServicePageCopy,
} from "@/data/service-content";
import type { Locale } from "@/i18n/config";

type ServiceBrowserProps = {
  locale: Locale;
  copy: ServicePageCopy;
};

type ServicesResponse = {
  source: "database" | "fallback";
  items: ServiceItem[];
};

export function ServiceBrowser({ locale, copy }: ServiceBrowserProps) {
  const [category, setCategory] = useState<ServiceCategoryId>("all");
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["services", locale, category],
    queryFn: async () => {
      const response = await fetch(`/api/services?locale=${locale}&category=${category}`);

      if (!response.ok) {
        throw new Error("Failed to load services.");
      }

      return (await response.json()) as ServicesResponse;
    },
  });
  const items = data?.items ?? [];

  return (
    <section data-reveal-section="" className="bg-[#1f1715] py-20 md:py-28">
      <div className="section-shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow text-[#dec47b]">{copy.eyebrow}</p>
            <h2 className="font-display mt-4 text-5xl leading-tight md:text-6xl">
              {copy.catalogTitle}
            </h2>
            <p className="mt-6 leading-8 text-[#d9d0c9]">{copy.description}</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-black uppercase text-white/48">
            {isFetching ? <Loader2 size={14} className="animate-spin text-[#dec47b]" /> : null}
            {data?.source === "fallback" ? "Fallback catalog" : "Live catalog"}
          </div>
        </div>

        <div className="mt-12 flex gap-2 overflow-x-auto border-b border-white/10 pb-4">
          {serviceCategoryIds.map((id) => (
            <button
              key={id}
              className={`h-11 shrink-0 rounded-full border px-5 text-sm font-black transition ${
                category === id
                  ? "border-[#d62f55] bg-[#d62f55] text-white"
                  : "border-white/10 bg-white/[0.03] text-white/68 hover:border-[#dec47b]/60 hover:text-[#dec47b]"
              }`}
              onClick={() => setCategory(id)}
              type="button"
            >
              {copy.tabs[id]}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid min-h-80 place-items-center text-[#d9d0c9]">
            <Loader2 className="animate-spin text-[#dec47b]" size={28} />
          </div>
        ) : items.length === 0 ? (
          <div className="glass-panel mt-10 p-10 text-center text-[#d9d0c9]">{copy.details.empty}</div>
        ) : (
          <div className="mt-10 grid gap-5 overflow-visible md:grid-cols-2 xl:grid-cols-4">
            {items.map((item, index) => (
              <ServiceCatalogCard
                key={item.id}
                item={item}
                index={index}
                locale={locale}
                copy={copy}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceCatalogCard({
  item,
  index,
  locale,
  copy,
}: {
  item: ServiceItem;
  index: number;
  locale: Locale;
  copy: ServicePageCopy;
}) {
  const detailHref = `/${locale}/service/${item.slug}`;
  const flyoutSide = index % 4 >= 2 ? "xl:right-[calc(100%+0.75rem)]" : "xl:left-[calc(100%+0.75rem)]";

  return (
    <article
      id={item.slug}
      data-magnetic=""
      data-magnetic-strength="3"
      className="glass-panel group relative flex min-h-[23rem] flex-col overflow-visible p-3 transition duration-300 hover:border-[#dec47b]/35"
      style={{ "--reveal-delay": `${Math.min(index * 70, 280)}ms` } as CSSProperties}
    >
      <Link className="absolute inset-0 z-10 rounded-lg" href={detailHref} aria-label={`${item.title} details`} />

      <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-white/10 bg-[#0b0909]">
        <Image
          src={item.imageUrl}
          alt={item.imageAlt}
          fill
          sizes="(min-width: 1280px) 280px, (min-width: 768px) 50vw, 100vw"
          className="object-contain transition duration-700 group-hover:scale-[1.025]"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/48 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {item.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/18 bg-black/45 px-3 py-1 text-[0.66rem] font-black uppercase text-white backdrop-blur"
            >
              {copy.tabs[tag]}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-2 pt-4">
        <p className="line-clamp-1 text-[0.72rem] font-black text-[#dec47b]">{item.subtitle}</p>
        <h3 className="font-display mt-2 line-clamp-2 min-h-[4.1rem] text-[2rem] leading-[1.03]">
          {item.title}
        </h3>
        <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-[#d9d0c9]">{item.summary}</p>

        <div className="relative z-20 mt-auto grid grid-cols-[1fr_2.75rem] gap-2 pt-5">
          <Link
            className="button-primary !h-10 min-w-0 whitespace-nowrap px-3 text-[0.72rem]"
            href={`/${locale}/inquire?service=${item.slug}`}
          >
            {copy.details.inquiry}
          </Link>
          <Link
            className="button-outline aspect-square !h-10 px-0"
            href={detailHref}
            aria-label={`${item.title} details`}
            title="View details"
          >
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <HoverDetail item={item} copy={copy} sideClass={flyoutSide} />
    </article>
  );
}

function HoverDetail({
  item,
  copy,
  sideClass,
}: {
  item: ServiceItem;
  copy: ServicePageCopy;
  sideClass: string;
}) {
  return (
    <aside
      className={`pointer-events-none absolute top-0 z-40 hidden w-80 rounded-md border border-[#dec47b]/25 bg-[#0f0b0d]/95 p-5 opacity-0 shadow-2xl shadow-black/45 backdrop-blur-xl transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 xl:block ${sideClass}`}
    >
      <p className="eyebrow text-[#dec47b]">{copy.details.process}</p>
      <p className="mt-3 text-sm leading-7 text-[#d9d0c9]">{item.description}</p>
      <div className="mt-5 grid gap-2">
        {item.highlights.slice(0, 3).map((highlight) => (
          <p key={highlight} className="flex items-center gap-2 text-sm font-bold text-white/82">
            <Check size={14} className="shrink-0 text-[#dec47b]" />
            {highlight}
          </p>
        ))}
      </div>
      <div className="mt-5 grid gap-3 border-y border-white/10 py-4 text-sm">
        <p className="flex gap-2 leading-6 text-white/72">
          <Sparkles size={15} className="mt-1 shrink-0 text-[#dec47b]" />
          <span>{item.recovery}</span>
        </p>
        <p className="flex gap-2 leading-6 text-white/72">
          <Clock size={15} className="mt-1 shrink-0 text-[#dec47b]" />
          <span>{item.duration}</span>
        </p>
      </div>
      <p className="mt-4 text-xs font-bold leading-6 text-white/58">
        <span className="text-[#dec47b]">{copy.details.price}</span>
        {" / "}
        {item.priceNote}
      </p>
    </aside>
  );
}
