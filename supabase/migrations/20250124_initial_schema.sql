
-- BOOK-A-YUTE IDEAL DATABASE SCHEMA
-- Powered by Push-A-Yute

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. TABLES

-- Profiles: Extended user data linked to Supabase Auth
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('admin', 'talent', 'booker')) default 'talent',
  full_name text,
  email text,
  phone text,
  created_at timestamptz default now()
);

-- Talents: The core roster
create table public.talents (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.profiles(id) on delete set null,
  slug text unique not null,
  stage_name text not null,
  bio text,
  city text,
  country text,
  categories text[] not null,
  genres text[],
  base_rate_min int,
  base_rate_max int,
  status text check (status in ('draft', 'pending', 'approved', 'rejected')) default 'draft',
  visibility boolean default false,
  featured boolean default false,
  subscription_tier text check (subscription_tier in ('FREE', 'STARTER', 'PRO', 'ELITE')) default 'FREE',
  subscription_status text check (subscription_status in ('active', 'past_due', 'canceled', 'trialing', 'none')) default 'none',
  hero_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Talent Media: Images, Videos, Links
create table public.talent_media (
  id uuid default gen_random_uuid() primary key,
  talent_id uuid references public.talents(id) on delete cascade,
  type text check (type in ('image', 'video', 'audio', 'link')),
  title text,
  url text not null,
  storage_path text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Booking Requests: Leads generated from the platform
create table public.booking_requests (
  id uuid default gen_random_uuid() primary key,
  talent_id uuid references public.talents(id),
  requester_name text not null,
  requester_email text not null,
  requester_phone text,
  event_type text,
  event_date date,
  location_city text,
  venue text,
  budget_range text,
  notes text,
  status text check (status in ('new', 'contacted', 'negotiating', 'booked', 'declined', 'closed')) default 'new',
  assigned_agent_id uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Rosters: Private selections for specific clients
create table public.rosters (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  description text,
  access_token text not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- Junction table for private rosters
create table public.roster_talents (
  roster_id uuid references public.rosters(id) on delete cascade,
  talent_id uuid references public.talents(id) on delete cascade,
  primary key (roster_id, talent_id)
);

-- 3. STORAGE SETUP (Supabase Storage)
-- Note: Buckets must be created via the dashboard or API, but here are the SQL commands for metadata
insert into storage.buckets (id, name, public) values ('talent-media', 'talent-media', true);

-- 4. ROW LEVEL SECURITY (RLS)

alter table public.profiles enable row level security;
alter table public.talents enable row level security;
alter table public.talent_media enable row level security;
alter table public.booking_requests enable row level security;
alter table public.rosters enable row level security;
alter table public.roster_talents enable row level security;

-- Talents Policies
create policy "Public view approved talents" on public.talents
  for select using (status = 'approved' and visibility = true);

create policy "Owners can manage own talent profile" on public.talents
  for all using (auth.uid() = owner_id);

create policy "Admins full access talents" on public.talents
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Booking Requests Policies
create policy "Anyone can insert booking requests" on public.booking_requests
  for insert with check (true);

create policy "Admins can view all requests" on public.booking_requests
  for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 5. DEMO SEED DATA (3 Rows)

-- Profile for an Admin (Simulated)
-- Note: In a real app, you'd create these via Auth first.
insert into public.profiles (id, role, full_name, email)
values 
('00000000-0000-0000-0000-000000000000', 'admin', 'Push-A-Yute Admin', 'admin@pushayute.com');

-- Talent 1: DJ
insert into public.talents (slug, stage_name, bio, city, country, categories, genres, status, visibility, featured, subscription_tier, hero_image)
values (
  'dj-phantom-kingston', 
  'DJ Phantom', 
  'The heavy hitter of Kingston nightlife. Exclusive Push-A-Yute talent.', 
  'Kingston', 
  'Jamaica', 
  '{DJ}', 
  '{Dancehall, Reggae}', 
  'approved', 
  true, 
  true, 
  'PRO',
  'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&q=80&w=800'
);

-- Talent 2: Band
insert into public.talents (slug, stage_name, bio, city, country, categories, genres, status, visibility, featured, subscription_tier, hero_image)
values (
  'rhythm-collective-nyc', 
  'The Rhythm Collective', 
  'World-class jazz fusion for high-end corporate galas.', 
  'New York', 
  'USA', 
  '{Band}', 
  '{Jazz, Fusion}', 
  'approved', 
  true, 
  true, 
  'ELITE',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800'
);

-- Talent 3: Poet
insert into public.talents (slug, stage_name, bio, city, country, categories, genres, status, visibility, featured, subscription_tier, hero_image)
values (
  'blaze-rebel-london', 
  'Blaze Rebel', 
  'Poetry that moves the soul and the room.', 
  'London', 
  'UK', 
  '{Poet}', 
  '{Spoken Word}', 
  'approved', 
  true, 
  false, 
  'STARTER',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800'
);

-- Mock Private Roster
insert into public.rosters (slug, title, description, access_token)
values ('vip-client-2025', 'Private Selection for Global Summit', 'Curated for the executive gala.', 'vip-2025-token');

insert into public.roster_talents (roster_id, talent_id)
select 
  (select id from public.rosters where slug = 'vip-client-2025'),
  id from public.talents limit 2;
