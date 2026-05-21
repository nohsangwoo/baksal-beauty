import { notFound } from "next/navigation";
import { DashboardPanel } from "./_components/dashboard-panel";
import { getCurrentUserFromCookies } from "@/lib/auth-session";
import { canManageUsers } from "@/lib/rbac";
import { isLocale } from "@/i18n/config";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminDashboardPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const currentUser = await getCurrentUserFromCookies();

  return <DashboardPanel canManageUsers={canManageUsers(currentUser)} />;
}
