"use client";

import { ArrowUp, PhoneCall, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { SiKakaotalk, SiNaver } from "react-icons/si";
import { InquireForm } from "@/app/[locale]/inquire/inquire-form";
import type { Locale } from "@/i18n/config";
import type { HomeDictionary } from "@/i18n/dictionaries";

type ConsultationCopy = HomeDictionary["consultation"];

export const socialChannels = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: "https://wa.me/821030069310",
    Icon: FaWhatsapp,
  },
  {
    id: "kakao",
    label: "KakaoTalk",
    href: "https://pf.kakao.com/",
    Icon: SiKakaotalk,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/",
    Icon: FaInstagram,
  },
  {
    id: "naver",
    label: "Naver",
    href: "https://naver.me/",
    Icon: SiNaver,
  },
  {
    id: "phone",
    label: "Phone",
    href: "tel:01030069310",
    Icon: PhoneCall,
  },
];

type SocialChannelButtonsProps = {
  className?: string;
};

type FloatingContactActionsProps = {
  locale: Locale;
  inquiryCopy: ConsultationCopy;
};

export function SocialChannelButtons({ className = "" }: SocialChannelButtonsProps) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {socialChannels.map(({ id, label, href, Icon }) => (
        <a
          key={id}
          aria-label={label}
          className="social-action-button"
          href={href}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          target={href.startsWith("http") ? "_blank" : undefined}
          title={label}
        >
          <Icon size={18} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

export function FloatingContactActions({ locale, inquiryCopy }: FloatingContactActionsProps) {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="fixed bottom-6 right-4 z-40 flex flex-col gap-2 md:bottom-8 md:right-6">
        {socialChannels.map(({ id, label, href, Icon }) =>
          id === "phone" ? (
            <a key={id} aria-label={label} className="floating-action-button" href={href} title={label}>
              <Icon size={17} aria-hidden="true" />
            </a>
          ) : (
            <button
              key={id}
              aria-label={`${label} inquiry`}
              className="floating-action-button"
              onClick={() => setInquiryOpen(true)}
              title={`${label} inquiry`}
              type="button"
            >
              <Icon size={17} aria-hidden="true" />
            </button>
          ),
        )}
        <button
          aria-label="Scroll to top"
          className="floating-action-button"
          onClick={scrollToTop}
          title="Scroll to top"
          type="button"
        >
          <ArrowUp size={17} aria-hidden="true" />
        </button>
      </div>
      {inquiryOpen ? (
        <FloatingInquiryDialog copy={inquiryCopy} locale={locale} onClose={() => setInquiryOpen(false)} />
      ) : null}
    </>
  );
}

function FloatingInquiryDialog({
  locale,
  copy,
  onClose,
}: {
  locale: Locale;
  copy: ConsultationCopy;
  onClose: () => void;
}) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-black/72 px-4 py-6 backdrop-blur-md"
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        aria-modal="true"
        className="glass-panel max-h-[calc(100svh-2rem)] w-full max-w-2xl overflow-y-auto p-5 md:p-7"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-[#dec47b]">{copy.eyebrow}</p>
            <h2 className="font-display mt-2 text-4xl leading-tight md:text-5xl">{copy.title}</h2>
          </div>
          <button
            aria-label="Close inquiry"
            className="floating-action-button shrink-0"
            onClick={onClose}
            type="button"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>
        <InquireForm
          className="!border-0 !bg-transparent !p-0 !shadow-none"
          copy={copy}
          locale={locale}
          sourcePath={`/${locale}/floating-inquiry`}
        />
      </div>
    </div>
  );
}
