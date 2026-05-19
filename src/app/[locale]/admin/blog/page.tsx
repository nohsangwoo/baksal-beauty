import { notFound } from "next/navigation";
import { AdminConsole } from "@/components/admin-console";
import { isLocale } from "@/i18n/config";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminBlogPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <AdminConsole locale={locale} section="blog" />;
}
