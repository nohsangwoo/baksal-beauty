"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { BriefcaseBusiness, FileText, GraduationCap, Video, X } from "lucide-react";
import type { DoctorProfile, DoctorProfileLabels } from "@/data/doctor-profiles";

type DoctorProfileCardsProps = {
  doctors: DoctorProfile[];
  labels: DoctorProfileLabels;
};

export function DoctorProfileCards({ doctors, labels }: DoctorProfileCardsProps) {
  const { activeDoctor, closeDoctor, openDoctor } = useDoctorDialog();

  return (
    <>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <button
            key={doctor.name}
            className="group glass-panel text-left transition duration-300 hover:-translate-y-1 hover:border-[#dec47b]/35"
            data-magnetic=""
            data-magnetic-strength="4"
            onClick={() => openDoctor(doctor)}
            type="button"
          >
            <div className="relative h-72 overflow-hidden rounded-lg border border-white/10 bg-white/5">
              <Image
                src={doctor.image}
                alt={doctor.name}
                fill
                sizes="(min-width: 1024px) 31vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-transparent" />
            </div>
            <div className="p-7">
              <p className="font-display break-keep text-3xl leading-tight text-white">
                {doctor.name}
              </p>
              <p className="mt-2 text-sm font-bold text-[#e38aa0]">{doctor.role}</p>
              <p className="mt-5 min-h-20 leading-7 text-[#d9d0c9]">{doctor.summary}</p>
              <span className="mt-7 inline-flex text-xs font-black uppercase tracking-[0.14em] text-[#dec47b]">
                {labels.openProfile}
              </span>
            </div>
          </button>
        ))}
      </div>

      <DoctorProfileDialog doctor={activeDoctor} labels={labels} onClose={closeDoctor} />
    </>
  );
}

type DoctorTeamPreviewProps = {
  representative: DoctorProfile;
  doctors: DoctorProfile[];
  labels: DoctorProfileLabels;
  featuredLabel: string;
  featuredCta: string;
};

export function DoctorTeamPreview({
  representative,
  doctors,
  labels,
  featuredLabel,
  featuredCta,
}: DoctorTeamPreviewProps) {
  const { activeDoctor, closeDoctor, openDoctor } = useDoctorDialog();

  return (
    <>
      <div className="mt-16 space-y-6">
        <button
          className="group glass-panel grid gap-6 p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-[#dec47b]/35 md:p-6 lg:grid-cols-[0.42fr_1fr]"
          data-magnetic=""
          data-magnetic-strength="4"
          onClick={() => openDoctor(representative)}
          type="button"
        >
          <div className="relative min-h-80 overflow-hidden rounded-lg border border-[#dec47b]/20 bg-white/5 lg:min-h-[380px]">
            <Image
              src={representative.image}
              alt={representative.name}
              fill
              sizes="(min-width: 1280px) 38vw, (min-width: 1024px) 34vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/12 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="eyebrow text-[#dec47b]">{featuredLabel}</p>
              <h3 className="font-display mt-3 break-keep text-4xl leading-tight text-white md:text-5xl">
                {representative.name}
              </h3>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <p className="eyebrow text-[#dec47b]">{featuredLabel}</p>
              <h3 className="font-display mt-4 break-keep text-4xl leading-tight text-white md:text-5xl">
                {representative.name}
              </h3>
              <p className="mt-2 text-sm font-bold text-[#e38aa0]">{representative.role}</p>
              <p className="mt-6 leading-8 text-[#d9d0c9]">{representative.summary}</p>
            </div>
            <span className="mt-8 inline-flex text-xs font-black uppercase tracking-[0.14em] text-[#dec47b]">
              {featuredCta}
            </span>
          </div>
        </button>

        <div className="grid gap-6 md:grid-cols-3">
          {doctors.map((doctor) => (
            <button
              key={doctor.name}
              className="group glass-panel flex flex-col text-left transition duration-300 hover:-translate-y-1 hover:border-[#dec47b]/35"
              data-magnetic=""
              data-magnetic-strength="4"
              onClick={() => openDoctor(doctor)}
              type="button"
            >
              <div className="relative h-64 overflow-hidden rounded-t-lg border-b border-white/10 bg-white/5">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  sizes="(min-width: 1024px) 23vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="font-display break-keep text-3xl leading-tight text-white">
                  {doctor.name}
                </p>
                <p className="mt-2 text-sm font-bold text-[#e38aa0]">{doctor.role}</p>
                <p className="mt-5 flex-1 leading-7 text-[#d9d0c9]">{doctor.summary}</p>
                <span className="mt-7 text-xs font-black uppercase tracking-[0.14em] text-[#dec47b]">
                  {labels.openProfile}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <DoctorProfileDialog doctor={activeDoctor} labels={labels} onClose={closeDoctor} />
    </>
  );
}

function useDoctorDialog() {
  const [activeDoctor, setActiveDoctor] = useState<DoctorProfile | null>(null);

  useEffect(() => {
    if (!activeDoctor) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveDoctor(null);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [activeDoctor]);

  return {
    activeDoctor,
    closeDoctor: () => setActiveDoctor(null),
    openDoctor: setActiveDoctor,
  };
}

function DoctorProfileDialog({
  doctor,
  labels,
  onClose,
}: {
  doctor: DoctorProfile | null;
  labels: DoctorProfileLabels;
  onClose: () => void;
}) {
  if (!doctor) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[80] overflow-y-auto bg-black/72 px-4 py-8 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="mx-auto grid w-full max-w-6xl gap-8 rounded-lg border border-white/10 bg-[#120d0e] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.6)] md:p-8 lg:grid-cols-[0.8fr_1.2fr]"
        onClick={(event) => event.stopPropagation()}
      >
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/10">
            <Image
              src={doctor.image}
              alt={doctor.name}
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div>
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="eyebrow text-[#dec47b]">{doctor.role}</p>
              <h2 className="font-display mt-3 text-5xl leading-tight text-white md:text-6xl">
                {doctor.name}
              </h2>
              <p className="mt-5 max-w-2xl leading-8 text-[#d9d0c9]">{doctor.summary}</p>
            </div>
            <button
              aria-label={labels.close}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/72 transition hover:border-[#dec47b]/50 hover:text-[#dec47b]"
              onClick={onClose}
              type="button"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <ProfileList icon={<GraduationCap size={18} />} title={labels.education} items={doctor.education} />
            <ProfileList icon={<BriefcaseBusiness size={18} />} title={labels.career} items={doctor.career} />
            <ProfileList icon={<FileText size={18} />} title={labels.publications} items={doctor.publications} />
            <ProfileList icon={<Video size={18} />} title={labels.liveSurgery} items={doctor.liveSurgery} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileList({
  icon,
  title,
  items,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
      <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-[#dec47b]">
        {icon}
        {title}
      </h3>
      <ul className="mt-5 space-y-3 text-sm leading-7 text-[#d9d0c9]">
        {items.map((item) => (
          <li key={item} className="border-t border-white/10 pt-3 first:border-t-0 first:pt-0">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
