-- =========================================================================
-- SUPABASE POSTGRESQL SCHEMA FOR MEDIAKITA (PLATFORM BERITA KOLABORATIF)
-- Jalankan skrip ini langsung di Supabase Dashboard -> SQL Editor
-- =========================================================================

-- 1. Tabel Profil Pengguna (Penulis Kontributor & Editor)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  pen_name text,
  bio text,
  avatar_url text,
  role text default 'contributor' check (role in ('reader', 'contributor', 'editor', 'admin')),
  is_verified boolean default false,
  reputation_score numeric(4,1) default 100.0,
  bank_name text,
  bank_account_number text,
  bank_account_holder text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabel Rubrik / Kategori Berita
create table if not exists public.categories (
  id serial primary key,
  name text not null unique,
  slug text not null unique,
  description text,
  display_order int default 0
);

insert into public.categories (name, slug, display_order) values
  ('Kebijakan Publik', 'kebijakan-publik', 1),
  ('Ekonomi Rakyat', 'ekonomi-rakyat', 2),
  ('Liputan Daerah', 'liputan-daerah', 3),
  ('Opini & Esai', 'opini-esai', 4),
  ('Riset & Sains', 'riset-sains', 5),
  ('Seni & Budaya', 'seni-budaya', 6)
on conflict do nothing;

-- 3. Tabel Artikel / Naskah Tulisan
create table if not exists public.articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  category_id int references public.categories(id),
  author_id uuid references public.profiles(id) on delete set null,
  excerpt text not null,
  content text not null,
  cover_image_url text,
  status text default 'draft' check (status in ('draft', 'pending', 'published', 'revision_requested', 'archived')),
  is_lead_story boolean default false,
  reading_time_minutes int default 4,
  views_count int default 0,
  likes_count int default 0,
  royalty_accumulated_idr int default 0,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Tabel Pencatatan Bagi Hasil (Revenue Share 70% Penulis / 30% Platform)
create table if not exists public.revenue_payouts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  amount_idr int not null,
  payout_status text default 'pending' check (payout_status in ('pending', 'processing', 'completed', 'failed')),
  payment_reference text,
  requested_at timestamp with time zone default timezone('utc'::text, now()) not null,
  paid_at timestamp with time zone
);

-- 5. Tabel Cache Data Living Assistance (Emas, Cuaca, AQI, Skor Bola)
create table if not exists public.living_assistance_cache (
  widget_key text primary key,
  payload jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
alter table public.profiles enable row level security;
alter table public.articles enable row level security;
alter table public.revenue_payouts enable row level security;

-- Siapa pun (publik/pembaca anonim) bisa membaca artikel yang sudah 'published'
create policy "Artikel terbit dapat dibaca oleh publik"
  on public.articles for select
  using (status = 'published');

-- Kontributor hanya dapat melihat draf milik dirinya sendiri
create policy "Penulis dapat melihat drafnya sendiri"
  on public.articles for select
  using (auth.uid() = author_id);

-- Kontributor dapat membuat draf artikel baru
create policy "Penulis dapat membuat artikel"
  on public.articles for insert
  with check (auth.uid() = author_id);

-- Kontributor dapat mengubah naskah jika belum dipublikasikan
create policy "Penulis dapat mengubah naskah sendiri"
  on public.articles for update
  using (auth.uid() = author_id and status in ('draft', 'revision_requested'));
