"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeftRight, Check } from "lucide-react";
import type { TreatmentPillar } from "@/i18n/dictionaries";

type TreatmentPillarsProps = {
  pillars: TreatmentPillar[];
  ctaLabel: string;
};

type BeforeAfterSliderProps = {
  beforeLabel: string;
  afterLabel: string;
  rangeLabel: string;
  beforeAlt: string;
  afterAlt: string;
};

export function TreatmentPillars({ pillars, ctaLabel }: TreatmentPillarsProps) {
  const [activeId, setActiveId] = useState(pillars[0]?.id ?? "");
  const active = pillars.find((pillar) => pillar.id === activeId) ?? pillars[0];

  if (!active) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="relative grid items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative z-10 rounded-lg border border-white/10 bg-[#0d0d10]/90 p-6 shadow-2xl shadow-black/30 md:p-10 lg:translate-x-10">
          <p className="eyebrow text-[#d7bd77]">{active.eyebrow}</p>
          <h3 className="font-display mt-4 text-4xl text-white md:text-5xl">
            {active.title}
          </h3>
          <p className="mt-6 leading-8 text-[#d9d0c9]">{active.description}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {active.items.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-white">
                <Check size={18} className="shrink-0 text-[#e5c879]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <a className="button-outline mt-10 inline-flex" href="#consult">
            {ctaLabel}
          </a>
        </div>

        <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-white/10 md:min-h-[520px]">
          <Image
            key={active.image}
            src={active.image}
            alt={active.title}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
        </div>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {pillars.map((pillar) => {
          const isActive = pillar.id === active.id;

          return (
            <button
              key={pillar.id}
              type="button"
              onClick={() => setActiveId(pillar.id)}
              className={`flex h-16 items-center justify-center gap-3 rounded-md border px-4 text-xs font-bold uppercase transition ${
                isActive
                  ? "border-[#e38aa0] bg-[#e38aa0] text-[#211515]"
                  : "border-white/10 bg-black text-white hover:border-[#d7bd77]/70"
              }`}
            >
              <span className="flower-mark" aria-hidden="true" />
              {pillar.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function BeforeAfterSlider({
  beforeLabel,
  afterLabel,
  rangeLabel,
  beforeAlt,
  afterAlt,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(52);

  return (
    <div className="relative overflow-hidden rounded-lg border border-white/15 bg-black">
      <div className="relative aspect-square">
        <Image
          src="/images/after-face.jpg"
          alt={afterAlt}
          fill
          sizes="(min-width: 1024px) 42vw, 100vw"
          className="object-cover"
        />
        <Image
          src="/images/before-face.jpg"
          alt={beforeAlt}
          fill
          sizes="(min-width: 1024px) 42vw, 100vw"
          className="object-cover"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        />
        <div
          className="absolute inset-y-0 w-px bg-white"
          style={{ left: `${position}%` }}
        >
          <div className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white bg-white text-[#c93052] shadow-xl">
            <ArrowLeftRight size={18} />
          </div>
        </div>
        <div className="absolute left-4 top-4 rounded bg-black/55 px-3 py-2 text-xs font-bold uppercase text-white">
          {beforeLabel}
        </div>
        <div className="absolute right-4 top-4 rounded bg-white/90 px-3 py-2 text-xs font-bold uppercase text-[#211515]">
          {afterLabel}
        </div>
      </div>
      <input
        aria-label={rangeLabel}
        type="range"
        min="12"
        max="88"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="comparison-range"
      />
    </div>
  );
}
