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
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (service_item_id, locale)
);

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'Editor',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Aesthetic Medicine',
  status text NOT NULL DEFAULT 'draft',
  image_url text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  interest text NOT NULL DEFAULT '',
  preferred_channel text NOT NULL DEFAULT 'phone',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  assigned_to text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS service_items_status_sort_idx
  ON service_items (status, featured DESC, sort_order ASC);

CREATE INDEX IF NOT EXISTS service_items_tags_idx
  ON service_items USING gin (tags);

CREATE INDEX IF NOT EXISTS blog_posts_status_created_idx
  ON blog_posts (status, created_at DESC);

CREATE INDEX IF NOT EXISTS inquiries_status_created_idx
  ON inquiries (status, created_at DESC);
