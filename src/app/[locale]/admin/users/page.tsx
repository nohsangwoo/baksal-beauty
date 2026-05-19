import { notFound } from "next/navigation";
import { AdminConsole } from "@/components/admin-console";
import { getCurrentUserFromCookies } from "@/lib/auth-session";
import { canManageUsers } from "@/lib/rbac";
import { isLocale } from "@/i18n/config";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminUsersPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const currentUser = await getCurrentUserFromCookies();

  return (
    <AdminConsole
      locale={locale}
      section="users"
      canManageUsers={canManageUsers(currentUser)}
    />
  );
}
