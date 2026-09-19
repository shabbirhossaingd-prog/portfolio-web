-- Portfolio CMS foundation
create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  type text not null check (type in ('design', 'video')),
  category text not null,
  description text default '',
  cover_url text,
  gallery_urls text[] default '{}',
  video_url text,
  youtube_url text,
  source_url text,
  source_kind text not null default 'upload' check (source_kind in ('upload','youtube','drive','direct','embed')),
  year integer,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_type_idx on public.projects(type);
create index if not exists projects_published_idx on public.projects(published);
create index if not exists projects_sort_order_idx on public.projects(sort_order);

alter table public.projects enable row level security;

create policy "Public can read published portfolio projects"
on public.projects
for select
using (published = true);

-- Authenticated admin write policies should be restricted to the portfolio owner's
-- Supabase user id during deployment. Do not enable broad anonymous writes.


-- Editable public portfolio copy. Writes happen only through the authenticated
-- backend API with the service-role key; visitors can only read it.
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "Public can read site content"
on public.site_content
for select
using (true);


alter table public.projects drop constraint if exists projects_category_check;
alter table public.projects
  add constraint projects_category_check
  check (category in ('Posters','Reels','Videos','AI Video','Logos','Company Profiles','Animations'));
