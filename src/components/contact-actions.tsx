"use client";

import { ArrowUp, PhoneCall } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { SiKakaotalk, SiNaver } from "react-icons/si";

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

export function FloatingContactActions() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-6 right-4 z-40 flex flex-col gap-2 md:bottom-8 md:right-6">
      {socialChannels.map(({ id, label, href, Icon }) => (
        <a
          key={id}
          aria-label={label}
          className="floating-action-button"
          href={href}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          target={href.startsWith("http") ? "_blank" : undefined}
          title={label}
        >
          <Icon size={17} aria-hidden="true" />
        </a>
      ))}
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
  );
}
