CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS service_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  category text NOT NULL CHECK (category IN ('eye', 'nose', 'lifting', 'petit')),
  tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  image_url text NOT NULL DEFAULT '',
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 100,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  related_slugs text[] NOT NULL DEFAULT ARRAY[]::text[],
  embedding real[] NOT NULL DEFAULT ARRAY[]::real[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_item_translations (
  service_item_id uuid NOT NULL REFERENCES service_items(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale IN ('ko', 'en', 'zh', 'ja')),
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  highlights text[] NOT NULL DEFAULT ARRAY[]::text[],
  recommended_for text[] NOT NULL DEFAULT ARRAY[]::text[],
  process_steps text[] NOT NULL DEFAULT ARRAY[]::text[],
  recovery text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '',
  price_note text NOT NULL DEFAULT '',
  image_alt text NOT NULL DEFAULT '',
  surgery_info jsonb NOT NULL DEFAULT '{}'::jsonb,
  detail_panels jsonb NOT NULL DEFAULT '[]'::jsonb,
  before_after jsonb NOT NULL DEFAULT '{}'::jsonb,
  rich_detail_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  youtube_videos jsonb NOT NULL DEFAULT '[]'::jsonb,
  detail_cta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (service_item_id, locale)
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid text UNIQUE,
  name text NOT NULL DEFAULT '',
  email text NOT NULL UNIQUE,
  phone text NOT NULL DEFAULT '',
  photo_url text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'Patient',
  status text NOT NULL DEFAULT 'active',
  auth_provider text NOT NULL DEFAULT 'firebase',
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Aesthetic Medicine',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  image_url text NOT NULL DEFAULT '',
  image_alt text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 100,
  author_name text NOT NULL DEFAULT 'BAKSAL BEAUTY',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_post_translations (
  blog_post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale IN ('ko', 'en', 'zh', 'ja')),
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content_blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  seo_title text NOT NULL DEFAULT '',
  seo_description text NOT NULL DEFAULT '',
  image_alt text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (blog_post_id, locale)
);

CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seed_key text,
  name text NOT NULL,
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  interest text NOT NULL DEFAULT '',
  preferred_channel text NOT NULL DEFAULT 'phone',
  subject text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  assigned_to text NOT NULL DEFAULT '',
  locale text NOT NULL DEFAULT 'ko',
  privacy_accepted boolean NOT NULL DEFAULT false,
  source_path text NOT NULL DEFAULT '',
  replied_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE inquiries
  ADD COLUMN IF NOT EXISTS seed_key text,
  ADD COLUMN IF NOT EXISTS subject text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'ko',
  ADD COLUMN IF NOT EXISTS privacy_accepted boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS source_path text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS replied_at timestamptz,
  ADD COLUMN IF NOT EXISTS closed_at timestamptz;

CREATE TABLE IF NOT EXISTS inquiry_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id uuid NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  admin_name text NOT NULL DEFAULT '',
  admin_email text NOT NULL DEFAULT '',
  sent_to text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'sent',
  error_message text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE service_items
  ADD COLUMN IF NOT EXISTS related_slugs text[] NOT NULL DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS embedding real[] NOT NULL DEFAULT ARRAY[]::real[];

ALTER TABLE service_item_translations
  ADD COLUMN IF NOT EXISTS surgery_info jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS detail_panels jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS before_after jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS rich_detail_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS youtube_videos jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS detail_cta jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS firebase_uid text,
  ADD COLUMN IF NOT EXISTS phone text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS photo_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS auth_provider text NOT NULL DEFAULT 'firebase',
  ADD COLUMN IF NOT EXISTS last_login_at timestamptz;

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS image_alt text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS author_name text NOT NULL DEFAULT 'BAKSAL BEAUTY';

INSERT INTO blog_post_translations (
  blog_post_id,
  locale,
  title,
  excerpt,
  content_blocks,
  seo_title,
  seo_description,
  image_alt,
  created_at,
  updated_at
)
SELECT
  id,
  'ko',
  title,
  excerpt,
  '[]'::jsonb,
  title,
  excerpt,
  image_alt,
  created_at,
  updated_at
FROM blog_posts
ON CONFLICT (blog_post_id, locale) DO NOTHING;

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx
  ON users (email);

CREATE UNIQUE INDEX IF NOT EXISTS users_firebase_uid_unique_idx
  ON users (firebase_uid)
  WHERE firebase_uid IS NOT NULL AND firebase_uid <> '';

DO $$
BEGIN
  IF to_regclass('public.admin_users') IS NOT NULL THEN
    EXECUTE '
      INSERT INTO users (name, email, role, status, auth_provider, created_at, updated_at)
      SELECT name, email, role, status, ''manual'', created_at, updated_at
      FROM admin_users
      ON CONFLICT (email) DO UPDATE
      SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        status = EXCLUDED.status,
        auth_provider = COALESCE(NULLIF(users.auth_provider, ''''), ''manual''),
        updated_at = now()
    ';

    DROP TABLE IF EXISTS admin_users;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS service_items_status_sort_idx
  ON service_items (status, featured DESC, sort_order ASC);

CREATE INDEX IF NOT EXISTS service_items_tags_idx
  ON service_items USING gin (tags);

CREATE INDEX IF NOT EXISTS blog_posts_status_created_idx
  ON blog_posts (status, created_at DESC);

CREATE INDEX IF NOT EXISTS blog_posts_status_sort_idx
  ON blog_posts (status, featured DESC, sort_order ASC);

CREATE INDEX IF NOT EXISTS inquiries_status_created_idx
  ON inquiries (status, created_at DESC);

CREATE INDEX IF NOT EXISTS inquiry_replies_inquiry_created_idx
  ON inquiry_replies (inquiry_id, created_at DESC);

CREATE INDEX IF NOT EXISTS users_role_status_idx
  ON users (role, status);

CREATE INDEX IF NOT EXISTS users_created_at_idx
  ON users (created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS inquiries_seed_key_unique_idx
  ON inquiries (seed_key)
  WHERE seed_key IS NOT NULL AND seed_key <> '';
