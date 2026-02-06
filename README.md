# InfluencerHub (Vanilla HTML/CSS/JS + Express + Supabase + Cloudinary)

InfluencerHub is a production-oriented creator discovery + collaboration workflow platform built with:
- Vanilla frontend (no React)
- Express API (Cloud Run ready)
- Supabase (Postgres + Auth + RLS)
- Cloudinary media upload/CDN
- GSAP + ScrollTrigger motion for premium storefront storytelling

## Project Structure

```txt
/apps
  /storefront/index.html
  /influencer/index.html influencer.css influencer.js
  /brand/index.html brand.css brand.js
  /admin/index.html admin.js
/public/assets/css/shared.css motion.css
/public/assets/js/api.js ui.js formatters.js motion.js
/services/supabase.js auth.js cloudinary.js
/server.js
/.env.example
/Dockerfile
```

## Local Setup

1. Install dependencies
```bash
npm install
```

2. Copy env values
```bash
cp .env.example .env
```

3. Start local server
```bash
npm run dev
```

App URLs:
- Storefront: `http://localhost:8080/apps/storefront`
- Influencer portal: `http://localhost:8080/apps/influencer`
- Brand portal: `http://localhost:8080/apps/brand`
- Admin portal: `http://localhost:8080/apps/admin`

## Supabase SQL Schema (copy/paste)

```sql
create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  role text check (role in ('admin','influencer','brand')) not null,
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists influencers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  handle text unique,
  display_name text,
  bio text,
  niche text,
  location text,
  platforms jsonb default '{}'::jsonb,
  followers_count int,
  engagement_rate numeric,
  avg_views int,
  rate_min numeric,
  rate_max numeric,
  pricing_notes text,
  content_types text[],
  audience_regions text[],
  verified boolean default false,
  status text default 'active',
  profile_image_url text,
  cover_video_url text,
  portfolio_media jsonb default '[]'::jsonb,
  plan_tier text default 'starter',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  company_name text,
  contact_name text,
  email text,
  phone text,
  industry text,
  website text,
  created_at timestamptz default now()
);

create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  request_id text unique,
  brand_user_id uuid references auth.users(id) on delete cascade,
  influencer_user_id uuid references auth.users(id) on delete set null,
  status text check (status in ('new','contacted','negotiating','booked','closed')) default 'new',
  campaign_name text,
  message text,
  budget numeric,
  deliverables text,
  deadline text,
  channel text,
  created_at timestamptz default now()
);

create table if not exists shortlists (
  id uuid primary key default gen_random_uuid(),
  brand_user_id uuid references auth.users(id) on delete cascade,
  influencer_user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (brand_user_id, influencer_user_id)
);

alter table profiles enable row level security;
alter table influencers enable row level security;
alter table brands enable row level security;
alter table requests enable row level security;
alter table shortlists enable row level security;

create policy "public can read active influencers" on influencers
for select using (status = 'active');

create policy "influencer edits own row" on influencers
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "influencer inserts own row" on influencers
for insert with check (user_id = auth.uid());

create policy "brands create requests" on requests
for insert with check (brand_user_id = auth.uid());

create policy "brands read own requests" on requests
for select using (brand_user_id = auth.uid());

create policy "influencers read own requests" on requests
for select using (influencer_user_id = auth.uid());

create policy "influencers update own request status" on requests
for update using (influencer_user_id = auth.uid());

create policy "brands manage own shortlist" on shortlists
for all using (brand_user_id = auth.uid()) with check (brand_user_id = auth.uid());
```

### Admin Access Note
Admin portal auth is app-level (`ADMIN_USERNAME`, `ADMIN_PASSWORD`) and does **not** rely on Supabase auth.

## Cloudinary Setup
1. Create Cloudinary account.
2. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
3. Upload endpoint: `POST /api/media/upload` with multipart key `file`.

## Demo Seed Data
- `server.js` performs insert-if-empty seeding for 12 influencer records at startup.
- Remove/disable by deleting `ensureSeedData()` call in `server.js`.

## Cloud Run Deploy

```bash
gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/influencerhub
gcloud run deploy influencerhub \
  --image gcr.io/$GOOGLE_CLOUD_PROJECT/influencerhub \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars SUPABASE_URL=...,SUPABASE_SERVICE_ROLE_KEY=...,SUPABASE_ANON_KEY=...,JWT_SECRET=...,ADMIN_USERNAME=...,ADMIN_PASSWORD=...,CLOUDINARY_CLOUD_NAME=...,CLOUDINARY_API_KEY=...,CLOUDINARY_API_SECRET=...
```

## Motion + Performance
- GSAP + ScrollTrigger implemented in `/public/assets/js/motion.js`.
- Lenis smooth scrolling enabled on desktop and skipped on mobile.
- `prefers-reduced-motion` guard disables heavy motion.
- Transform/opacity-driven animations to reduce repaint overhead.
