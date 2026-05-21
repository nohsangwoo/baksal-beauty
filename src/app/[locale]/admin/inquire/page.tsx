import { notFound } from "next/navigation";
import { InquireAdminPanel } from "./inquire-admin-panel";
import { isLocale } from "@/i18n/config";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminInquirePage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <InquireAdminPanel />;
}
