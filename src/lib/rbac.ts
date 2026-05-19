export const ADMIN_ROLES = ["Owner", "Admin", "Manager"] as const;
export const USER_ROLES = ["Owner", "Admin", "Manager", "Staff", "Patient"] as const;
export const USER_STATUSES = ["active", "pending", "suspended"] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type UserStatus = (typeof USER_STATUSES)[number];

export type RbacUser = {
  role?: string | null;
  status?: string | null;
};

export function normalizeRole(value: unknown): UserRole {
  const role = String(value ?? "").trim();
  const matchedRole = USER_ROLES.find((item) => item.toLowerCase() === role.toLowerCase());

  return matchedRole ?? "Patient";
}

export function normalizeStatus(value: unknown): UserStatus {
  const status = String(value ?? "").trim().toLowerCase();

  return USER_STATUSES.includes(status as UserStatus) ? (status as UserStatus) : "active";
}

export function isActiveUser(user: RbacUser | null | undefined) {
  return user?.status === "active";
}

export function canAccessAdmin(user: RbacUser | null | undefined) {
  return Boolean(
    user &&
      isActiveUser(user) &&
      ADMIN_ROLES.includes(normalizeRole(user.role) as (typeof ADMIN_ROLES)[number]),
  );
}

export function canManageUsers(user: RbacUser | null | undefined) {
  return Boolean(user && isActiveUser(user) && normalizeRole(user.role) === "Owner");
}
