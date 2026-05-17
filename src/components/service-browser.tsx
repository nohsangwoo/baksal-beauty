"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, Clock, Loader2, Sparkles } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
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
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {items.map((item, index) => (
              <article
                key={item.id}
                data-magnetic=""
                data-magnetic-strength="4"
                className="glass-panel group grid overflow-hidden lg:grid-cols-[0.78fr_1fr]"
                style={{ "--reveal-delay": `${Math.min(index * 80, 360)}ms` } as CSSProperties}
              >
                <div className="relative min-h-72 overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 420px, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/64 via-transparent to-transparent" />
                  <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/18 bg-black/38 px-3 py-1 text-[0.68rem] font-black uppercase text-white backdrop-blur"
                      >
                        {copy.tabs[tag]}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex min-h-full flex-col p-6 md:p-8">
                  <div>
                    <p className="eyebrow text-[#dec47b]">{item.subtitle}</p>
                    <h3 className="font-display mt-3 text-4xl leading-tight">{item.title}</h3>
                    <p className="mt-5 leading-8 text-[#d9d0c9]">{item.summary}</p>
                  </div>

                  <div className="mt-6 grid gap-3">
                    {item.highlights.map((highlight) => (
                      <p key={highlight} className="flex items-center gap-3 text-sm text-white/82">
                        <Check size={15} className="text-[#dec47b]" />
                        {highlight}
                      </p>
                    ))}
                  </div>

                  <div className="mt-7 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
                    <InfoBlock icon={<Sparkles size={16} />} label={copy.details.recovery} value={item.recovery} />
                    <InfoBlock icon={<Clock size={16} />} label={copy.details.duration} value={item.duration} />
                  </div>

                  <div className="mt-6 rounded-md border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-[#d9d0c9]">
                    <span className="font-black text-[#dec47b]">{copy.details.price}</span>
                    <br />
                    {item.priceNote}
                  </div>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link className="button-primary" href={`/${locale}/inquire?service=${item.slug}`}>
                      {copy.details.inquiry}
                      <ArrowRight size={15} />
                    </Link>
                    <Link className="button-outline" href={`/${locale}/service#${item.slug}`}>
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function InfoBlock({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-black/16 p-4">
      <p className="flex items-center gap-2 text-xs font-black uppercase text-[#dec47b]">
        {icon}
        {label}
      </p>
      <p className="mt-3 text-sm leading-7 text-white/78">{value}</p>
    </div>
  );
}
