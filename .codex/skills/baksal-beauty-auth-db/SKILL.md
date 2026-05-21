---
name: baksal-beauty-auth-db
description: Manage BAKSAL Beauty authentication, Firebase login, Neon Postgres user storage, Drizzle schema, RBAC, auth sync APIs, and DB cleanup. Use when Codex edits login/signup, Google auth, user/admin permissions, Neon tables, Drizzle migrations, auth environment variables, or anything involving the users table.
---

# BAKSAL Beauty Auth DB

## Core Rule

Use Firebase Authentication for identity and `public.users` in Neon for app profile, RBAC, status, and admin management. Do not add a second app user table unless the user explicitly changes the auth architecture.

When any DB structure or login behavior changes, update this skill in the same work so future changes follow the new source of truth.

## Current Architecture

- Client auth lives in `src/components/auth-provider.tsx` and `src/components/auth-menu.tsx`.
- Firebase config lives in `src/lib/firebase-config.ts` and `src/lib/firebase-client.ts`.
- Auth sync endpoint is `src/app/api/auth/sync-user/route.ts`.
- Auth session endpoint is `src/app/api/auth/session/route.ts`; it verifies Firebase ID tokens and sets/clears the server cookie.
- The session cookie lifetime is capped by the Firebase ID token `exp` with a safety buffer, so the server never keeps a cookie longer than the token should validate.
- User persistence lives in `src/lib/user-repository.ts`.
- Server auth/RBAC helpers live in `src/lib/auth-session.ts`, `src/lib/rbac.ts`, and `src/lib/auth-cookie.ts`.
- Drizzle schema lives in `src/db/schema.ts`; SQL bootstrap/migration reference lives in `src/db/schema.sql`.
- DB connection is lazy in `src/lib/db.ts`.
- Google login uses `signInWithPopup` first. Redirect is only a fallback for popup-blocked cases.
- `next.config.ts` sets `Cross-Origin-Opener-Policy: same-origin-allow-popups` for Google popup auth.

## Table Ownership

- Keep `public.users`: this is the canonical app user/RBAC table.
- Do not recreate `public.user`, `admin_users`, or `neon_auth.user`.
- `admin_users` was intentionally removed after unifying RBAC into `public.users`.
- `neon_auth` schema was removed because this project uses Firebase Auth, not Neon Auth.
- If a table named `user` appears again, verify its schema first. It is usually from Neon Auth or another auth provider, not this app.

## Auth Flow

Email/password:

1. User submits login or signup in `AuthMenu`.
2. Firebase creates or signs in the account.
3. Client calls `/api/auth/sync-user` with a Firebase ID token.
4. Server verifies the token using Firebase Identity Toolkit `accounts:lookup`.
5. `upsertFirebaseUser` writes to `public.users`.
6. Client calls `/api/auth/session`; server sets a short-lived HttpOnly `baksal_auth_token` cookie for SSR/admin API RBAC.

Google:

1. Use popup flow with `signInWithPopup`.
2. On success, immediately sync to Neon.
3. Only fallback to `signInWithRedirect` for popup-blocked or cancelled-popup-request cases.
4. If redirect is used, expect `getRedirectResult`; but do not make redirect the default because third-party storage restrictions can make the result disappear.

## RBAC

- `users.role` controls privileges. Canonical values: `Owner`, `Admin`, `Manager`, `Staff`, `Patient`.
- `users.status` controls account state. Canonical values: `active`, `pending`, `suspended`.
- Admin access is allowed only for active `Owner`, `Admin`, or `Manager`.
- User Management and role grant/revoke is allowed only for active `Owner`.
- Preserve existing role/status during auth sync. Firebase login must not downgrade an Owner to patient.
- Admin pages must be protected on the server through `src/app/[locale]/admin/layout.tsx`.
- If the server guard renders a denied state but Firebase is still signed in on the client, `AdminDenied` refreshes the Neon sync + session cookie once and then calls `router.refresh()` before showing a final denial. This prevents intermittent admin lockouts caused by an expired/missing SSR cookie.
- Admin APIs must call `requireAdminUserFromRequest`; user-management APIs must pass `ownerOnly: true`.
- Admin pages are split by route: `/admin`, `/admin/users`, `/admin/services`, `/admin/blog`, `/admin/inquire`.
- Public demo admin lives at `/[locale]/testadmin`. It is intentionally front-end only, uses a hard-coded demo login, stores mock state in React, has `robots: noindex`, and must never import real admin panels, repositories, RBAC helpers, Firebase auth, Neon data, upload APIs, or `/api/admin/*` fetches.

## Drizzle and DB Changes

- Use Drizzle schema in `src/db/schema.ts` as the app source of truth.
- Use lazy DB initialization through `getDb()` from `src/lib/db.ts`; do not initialize DB clients at module scope.
- For schema changes, update both Drizzle definitions and migration/bootstrap SQL if the project still uses `src/db/schema.sql`.
- Before dropping tables, verify:
  - table schema and exact qualified name,
  - row count,
  - FK/dependencies,
  - code references with `rg`.
- Never drop `public.users` unless the user explicitly asks for a full auth reset and confirms data loss.

## Inquiry Management

- Public inquiries are stored in `public.inquiries`; admin email replies are stored in `public.inquiry_replies`.
- Inquiry attachments are stored in `public.inquiry_attachments`; files are uploaded through server-side Vercel Blob writes and only Blob URLs/pathnames are persisted in Neon.
- Public submission endpoint is `src/app/api/inquiries/route.ts`; it accepts JSON or `multipart/form-data`, validates name, phone, email, message, consent, locale, source path, and attachment limits/types.
- Admin inquiry list/status endpoint is `src/app/api/admin/inquiries/route.ts` and `src/app/api/admin/inquiries/[id]/route.ts`.
- Admin email reply endpoint is `src/app/api/admin/inquiries/[id]/reply/route.ts`; it must call `requireAdminUserFromRequest` before sending mail.
- Gmail SMTP credentials are read from `GMAIL_USER` and `GMAIL_APP_PASSWORD` through `src/lib/email.ts`; never expose these values to the client.
- Inquiry admin UI lives in `src/app/[locale]/admin/inquire/inquire-admin-panel.tsx` and should support search, status filters, unanswered view, pagination, status assignment, reply history, attachment preview/download, and answer-complete state.

## Debugging Checklist

For login issues, check logs in this order:

- Browser console: `[BAKSAL_AUTH]`.
- Local or Vercel server logs: `[BAKSAL_AUTH_CLIENT]` and `[BAKSAL_AUTH_API]`.
- Firebase Auth console for created identity records.
- Neon `public.users` for synced app records.

Healthy Google popup flow should show:

- `dialog.google.click`
- `loginWithGoogle.popup.start`
- `loginWithGoogle.popup.success`
- `syncNeonUser.fetch.start`
- `syncNeonUser.fetch.done` with `ok: true`
- `/api/auth/sync-user` returning 200

For RBAC issues, verify:

- `baksal_auth_token` cookie exists after Firebase login.
- The cookie is set by `/api/auth/session`, not by `document.cookie`.
- Firebase token validates through Identity Toolkit.
- `public.users.email` or `public.users.firebase_uid` matches the Firebase identity.
- `public.users.status` is `active`.
- `public.users.role` is one of the allowed roles for the requested page/API.

## Reference

Read `references/auth-db-current-state.md` when changing auth, RBAC, DB schema, sync behavior, or when investigating table confusion.
