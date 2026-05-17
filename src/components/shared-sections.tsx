import Image from "next/image";
import { MapPin } from "lucide-react";
import { SocialChannelButtons } from "@/components/contact-actions";
import type { Locale } from "@/i18n/config";
import type { HomeDictionary } from "@/i18n/dictionaries";

type SharedSectionProps = {
  t: HomeDictionary;
  locale?: Locale;
};

const contactCopy: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    body: string;
    representative: string;
    address: string;
    phone: string;
    email: string;
    connect: string;
  }
> = {
  ko: {
    eyebrow: "Contact Us",
    title: "상담과 방문을 한 화면에서 확인하세요.",
    body: "주식회사 럿지의 공식 연락처입니다. 프로젝트 상담과 운영 문의를 같은 채널에서 확인합니다.",
    representative: "대표자",
    address: "주소",
    phone: "전화번호",
    email: "이메일",
    connect: "바로 연결",
  },
  en: {
    eyebrow: "Contact Us",
    title: "Visit, call, or start a private conversation.",
    body: "These are the official contact details for LUDGI Inc. Project and operation inquiries are handled through the same channels.",
    representative: "Representative",
    address: "Address",
    phone: "Phone",
    email: "Email",
    connect: "Connect directly",
  },
  zh: {
    eyebrow: "Contact Us",
    title: "访问、来电或开始一对一咨询。",
    body: "以下为 LUDGI Inc. 官方联系方式。项目咨询与运营咨询可通过同一渠道确认。",
    representative: "负责人",
    address: "地址",
    phone: "电话",
    email: "邮箱",
    connect: "直接联系",
  },
  ja: {
    eyebrow: "Contact Us",
    title: "来院・お電話・個別相談をこちらから。",
    body: "LUDGI Inc. の公式連絡先です。プロジェクト相談と運営のお問い合わせを同じ窓口で確認します。",
    representative: "代表者",
    address: "住所",
    phone: "電話番号",
    email: "メール",
    connect: "直接つながる",
  },
};

export function ContactSection({ t, locale = "ko" }: SharedSectionProps) {
  const copy = contactCopy[locale];
  const contactRows = [
    { label: copy.representative, value: "노상우" },
    { label: copy.address, value: "인천광역시 연수구 인천타워대로 323, 에이동 20층" },
    { label: copy.phone, value: "010 - 3006 - 9310", href: "tel:01030069310" },
    { label: copy.email, value: "milli@molluhub.com", href: "mailto:milli@molluhub.com" },
  ];

  return (
    <section
      data-reveal-section=""
      id="contact"
      className="border-y border-white/10 bg-[#120d0e] py-24 md:py-32"
    >
      <div className="section-shell">
        <div className="mb-12 max-w-3xl">
          <p className="eyebrow text-[#dec47b]">{copy.eyebrow}</p>
          <h2 className="font-display mt-4 text-5xl leading-tight md:text-7xl">{copy.title}</h2>
          <p className="mt-6 leading-8 text-[#d9d0c9]">
            {copy.body} <span className="text-white/80">{t.footer.companyName}</span>
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.45fr_0.8fr]">
          <div
            data-magnetic=""
            data-magnetic-strength="4"
            className="contact-map-frame relative min-h-[420px] overflow-hidden rounded-lg border border-white/10 md:min-h-[560px]"
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(222,196,123,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(222,196,123,0.08)_1px,transparent_1px)] bg-[size:52px_52px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_46%,rgba(222,196,123,0.24),transparent_26%),radial-gradient(circle_at_70%_65%,rgba(227,138,160,0.12),transparent_28%)]" />
            <iframe
              aria-label="LUDGI office map"
              className="absolute inset-0 h-full w-full opacity-80 grayscale-[0.25] invert-[0.88] saturate-[0.65]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.openstreetmap.org/export/embed.html?bbox=126.6396%2C37.3901%2C126.6514%2C37.3978&layer=mapnik&marker=37.39395%2C126.6455"
              title="LUDGI office map"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#120d0e]/35 via-transparent to-[#120d0e]/10" />
            <div className="pointer-events-none absolute bottom-7 left-7 max-w-xs rounded-lg border border-white/10 bg-[#120d0e]/82 p-5 shadow-2xl backdrop-blur">
              <p className="eyebrow text-[#dec47b]">Office Map</p>
              <p className="mt-3 flex items-start gap-2 text-sm leading-7 text-white">
                <MapPin className="mt-1 shrink-0 text-[#dec47b]" size={16} />
                인천광역시 연수구 인천타워대로 323, 에이동 20층
              </p>
            </div>
          </div>

          <aside className="glass-panel flex flex-col justify-between p-6 md:p-8">
            <div>
              <span className="flower-mark text-[#dec47b]" aria-hidden="true" />
              <h3 className="font-display mt-5 text-4xl">BAKSAL BEAUTY Contact</h3>
              <div className="mt-8 divide-y divide-white/10">
                {contactRows.map((row) => (
                  <div key={row.label} className="grid gap-2 py-5">
                    <p className="eyebrow text-[#d9c1ad]">{row.label}</p>
                    {row.href ? (
                      <a className="leading-7 text-white transition hover:text-[#dec47b]" href={row.href}>
                        {row.value}
                      </a>
                    ) : (
                      <p className="leading-7 text-white">{row.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="mb-4 text-sm font-bold text-[#b6aaa6]">{copy.connect}</p>
              <SocialChannelButtons />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export function NewsletterSection({ t }: SharedSectionProps) {
  return (
    <section data-reveal-section="" className="relative overflow-hidden py-24 md:py-32">
      <Image
        src="/images/newsletter.jpg"
        alt={t.newsletter.imageAlt}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="section-shell relative z-10 text-center">
        <span className="flower-mark mx-auto text-[#dec47b]" aria-hidden="true" />
        <h2 className="font-display mx-auto mt-7 max-w-4xl text-5xl leading-tight md:text-7xl">
          {t.newsletter.title}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#d9d0c9]">{t.newsletter.body}</p>
        <form className="mx-auto mt-9 flex max-w-xl flex-col gap-3 sm:flex-row">
          <input
            className="form-field flex-1"
            name="email"
            placeholder={t.newsletter.placeholder}
            suppressHydrationWarning
          />
          <button className="button-primary sm:w-44" type="button">
            {t.newsletter.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
