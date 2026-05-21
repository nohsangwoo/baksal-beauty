"use client";

import type { Locale } from "@/i18n/config";
import { DashboardPanel } from "@/app/[locale]/admin/_components/dashboard-panel";
import type { AdminSection } from "@/app/[locale]/admin/_components/admin-types";
import { BlogAdminPanel } from "@/app/[locale]/admin/blog/blog-studio-panel";
import { InquireAdminPanel } from "@/app/[locale]/admin/inquire/inquire-admin-panel";
import { ServiceAdminPanel } from "@/app/[locale]/admin/services/service-admin-panel";
import { UserManagementAdminPanel } from "@/app/[locale]/admin/users/user-management-panel";

export type { AdminSection };

export function AdminConsole({
  locale,
  section,
  canManageUsers = false,
}: {
  locale: Locale;
  section: AdminSection;
  canManageUsers?: boolean;
}) {
  if (section === "dashboard") {
    return <DashboardPanel canManageUsers={canManageUsers} />;
  }

  if (section === "services") {
    return <ServiceAdminPanel initialLocale={locale} />;
  }

  if (section === "users") {
    return <UserManagementAdminPanel canManageUsers={canManageUsers} />;
  }

  if (section === "blog") {
    return <BlogAdminPanel initialLocale={locale} />;
  }

  return <InquireAdminPanel />;
}
