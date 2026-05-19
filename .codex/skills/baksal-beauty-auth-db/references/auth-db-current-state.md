# Auth and DB Current State

## Firebase

- Project name: `bsclinic`
- Project ID: `bsclinic`
- Project number: `230404370315`
- App uses Firebase Authentication for identity.
- Supported login methods in app:
  - Email/password
  - Google popup login
- Client auth sends Firebase ID tokens to `/api/auth/session`; the server verifies the token and writes a short-lived HttpOnly `baksal_auth_token` cookie so server-rendered admin pages and admin APIs can verify the Firebase identity before checking Neon RBAC.
- Firebase config fallback values are in `src/lib/firebase-config.ts`.
- Expected public env var names:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
  - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

## Neon

- Vercel Neon resource name: `bsclinic-db`
- App database connection envs, in preference order:
  - `DATABASE_URL`
  - `POSTGRES_URL`
  - `NEON_DATABASE_URL`
- App user table: `public.users`
- Removed/unused auth tables:
  - `admin_users`
  - `neon_auth.*`
  - `neon_auth.user`

## public.users

`public.users` is the only canonical user table for app accounts and RBAC.

Columns:

- `id`
- `firebase_uid`
- `name`
- `email`
- `phone`
- `photo_url`
- `role`
- `status`
- `auth_provider`
- `last_login_at`
- `created_at`
- `updated_at`

Important constraints and behavior:

- `email` must be unique.
- `firebase_uid` must be unique when present.
- Auth sync upserts on email.
- Auth sync updates `firebase_uid`, `auth_provider`, `last_login_at`, and `updated_at`.
- Auth sync preserves existing `role` and `status`.
- Canonical roles: `Owner`, `Admin`, `Manager`, `Staff`, `Patient`.
- Canonical statuses: `active`, `pending`, `suspended`.
- Active `Owner`, `Admin`, and `Manager` can access admin routes.
- Only active `Owner` can access User Management and grant/revoke roles.
- At least one active `Owner` must remain when editing/deleting users.

## Files

- `src/db/schema.ts`: Drizzle schema.
- `src/db/schema.sql`: SQL schema/bootstrap reference.
- `src/lib/db.ts`: lazy Neon/Drizzle connection.
- `src/lib/rbac.ts`: role/status constants and permission checks.
- `src/lib/auth-cookie.ts`: Firebase ID-token cookie name.
- `src/lib/auth-session.ts`: server-side Firebase token verification and Neon user lookup.
- `src/lib/user-repository.ts`: Firebase profile to `public.users` upsert.
- `src/app/api/auth/sync-user/route.ts`: Firebase ID token verification and user sync API.
- `src/app/api/auth/session/route.ts`: short-lived HttpOnly auth cookie issue/clear API.
- `src/app/api/auth/debug-log/route.ts`: client auth debug log sink.
- `src/components/auth-provider.tsx`: Firebase auth state and auth actions.
- `src/components/auth-menu.tsx`: login/signup/profile UI.
- `src/components/admin-shell.tsx`: admin layout navigation and access denied UI.
- `src/components/admin-console.tsx`: admin dashboard and page panels.
- `src/app/[locale]/admin/layout.tsx`: server-rendered admin route guard.
- `src/app/[locale]/admin/users/page.tsx`: Owner-only user management page.
- `src/app/[locale]/admin/services/page.tsx`: service management page.
- `src/app/[locale]/admin/blog/page.tsx`: blog management page.
- `src/app/[locale]/admin/inquire/page.tsx`: inquiry management page.
- `next.config.ts`: COOP header for Google popup auth.

## Google Login Note

Do not change Google login back to redirect-first. Redirect auth can return to the app with `getRedirectResult()` as `null` in modern browsers due to third-party storage restrictions around the Firebase helper domain.

Popup-first is the stable current behavior. Keep redirect only as a fallback for popup-blocked cases.

## Cleanup Rule

If another auth provider or Neon Auth is intentionally introduced later, update:

- this reference,
- `SKILL.md`,
- Drizzle schema,
- admin user management expectations,
- `/api/auth/sync-user` or its replacement,
- production environment variable list.

If a DB cleanup request mentions `user` versus `users`, query fully qualified tables:

```sql
select table_schema, table_name, table_type
from information_schema.tables
where table_name ilike '%user%'
order by table_schema, table_name;
```

Then identify whether the table is `public.users` or a provider-owned table such as `neon_auth.user`.

## Current Owner Seeds

- `milli@molluhub.com`: active `Owner`.
- `nsgr12@gmail.com`: active `Owner`.
