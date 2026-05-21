import { notFound } from "next/navigation";
import { UserManagementAdminPanel } from "./user-management-panel";
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

  return <UserManagementAdminPanel canManageUsers={canManageUsers(currentUser)} />;
}
