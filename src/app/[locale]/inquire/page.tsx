import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { SocialChannelButtons } from "@/components/contact-actions";
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
    title: `${t.nav[3]?.label ?? "Inquire"} | BAKSAL BEAUTY`,
    description: t.consultation.body,
  };
}

export default async function InquirePage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = getDictionary(locale);

  return (
    <PageShell
      locale={locale}
      t={t}
      eyebrow={t.consultation.eyebrow}
      title={t.consultation.title}
      description={t.consultation.body}
      image="/images/consultation-face.jpg"
      imageAlt={t.consultation.imageAlt}
    >
      <section data-reveal-section="" className="bg-[#241b18] py-24 md:py-32">
        <div className="section-shell grid gap-8 lg:grid-cols-[1fr_0.7fr]">
          <form className="glass-panel grid gap-4 p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-xs font-black uppercase">
                {t.consultation.fields.name}
                <input className="form-field" name="name" placeholder={t.consultation.placeholders.name} />
              </label>
              <label className="grid gap-2 text-xs font-black uppercase">
                {t.consultation.fields.phone}
                <input className="form-field" name="phone" placeholder={t.consultation.placeholders.phone} />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-xs font-black uppercase">
                {t.consultation.fields.interest}
                <select className="form-field" name="service" defaultValue="">
                  <option value="" disabled>
                    {t.consultation.placeholders.service}
                  </option>
                  {t.consultation.services.map((service) => (
                    <option key={service}>{service}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-xs font-black uppercase">
                {t.consultation.fields.channel}
                <select className="form-field" name="channel" defaultValue="">
                  <option value="" disabled>
                    {t.consultation.placeholders.channel}
                  </option>
                  {t.consultation.channels.map((channel) => (
                    <option key={channel}>{channel}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="grid gap-2 text-xs font-black uppercase">
              {t.consultation.fields.message}
              <textarea
                className="form-field min-h-40 resize-none"
                name="message"
                placeholder={t.consultation.placeholders.message}
              />
            </label>
            <button className="button-primary mt-2 w-full" type="button">
              {t.consultation.submit}
              <CalendarDays size={16} />
            </button>
          </form>

          <aside className="glass-panel p-6 md:p-8">
            <p className="eyebrow text-[#dec47b]">Direct channels</p>
            <h2 className="font-display mt-4 text-4xl">Talk to BAKSAL BEAUTY</h2>
            <p className="mt-5 leading-8 text-[#d9d0c9]">{t.inquiry.body}</p>
            <div className="mt-8">
              <SocialChannelButtons />
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
