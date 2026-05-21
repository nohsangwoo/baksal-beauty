import { notFound } from "next/navigation";
import { BlogAdminPanel } from "./blog-studio-panel";
import { isLocale } from "@/i18n/config";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminBlogPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <BlogAdminPanel initialLocale={locale} />;
}
