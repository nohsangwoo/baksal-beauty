import { notFound } from "next/navigation";
import { ServiceAdminPanel } from "./service-admin-panel";
import { isLocale } from "@/i18n/config";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminServicesPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <ServiceAdminPanel initialLocale={locale} />;
}
