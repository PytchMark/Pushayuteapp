# InfluencerHub

InfluencerHub is a production-focused influencer discovery and campaign request platform built in **vanilla HTML/CSS/JS** with an **Express API** and designed for **Google Cloud Run**.

It combines a premium animated storefront experience with three operational portals:
- **Influencer Portal** (profile + media + inbound requests)
- **Brand Portal** (search, shortlist, campaign tray, request tracking)
- **Admin Portal** (credential-based internal dashboard)

Core backend integrations:
- **Supabase** for auth-aware data modeling and RLS policies.
- **Cloudinary** for secure media upload and CDN-hosted assets.

---

## Product Overview

### 1) Public Storefront + Discovery
A high-end agency-style marketing and discovery front with:
- Cinematic hero, staggered reveals, and CTA micro-interactions.
- Storytelling chapters designed for scroll-led narrative pacing.
- Horizontal scroll deck driven by vertical scroll progress.
- API-powered discovery grid with search and niche filters.
- Card tilt interactions and skeleton loading.

### 2) Influencer Portal
For creators to manage their commercial profile:
- Update handle, bio, niche, platform handles, rates, and audience metrics.
- Upload media via Cloudinary (`/api/media/upload`).
- Review inbound collaboration requests.
- Update request statuses (`new/contacted/negotiating/booked/closed`).

### 3) Brand Portal
For campaign managers and business teams:
- Discover influencers and inspect profile summaries.
- Add creators to a **Campaign Tray** (cart-style selection).
- Submit one campaign to multiple influencers in one action.
- Track submitted request statuses.
- Quick WhatsApp outreach fallback from discovery cards.

### 4) Admin Portal
For internal operations:
- Env-credential login (`ADMIN_USERNAME` / `ADMIN_PASSWORD`), separate from Supabase auth.
- View summary metrics and top niches.
- View influencer, brand, and request datasets.
- Admin token-based protected endpoints.

---

## Architecture

```txt
/apps
  /storefront
    index.html
    storefront.js
  /influencer
    index.html
    influencer.css
    influencer.js
  /brand
    index.html
    brand.css
    brand.js
  /admin
    index.html
    admin.js
/public
  /assets
    /css
      shared.css
      motion.css
    /js
      api.js
      ui.js
      formatters.js
      motion.js
/services
  supabase.js
  auth.js
  cloudinary.js
/scripts
  seed.js
server.js
Dockerfile
.env.example
README.md
```

---

## API Surface

### Public
- `GET /api/public/influencers`
- `GET /api/public/influencers/:handle`

### Brand
- `POST /api/brand/shortlist`
- `GET /api/brand/shortlist`
- `POST /api/brand/requests` (multi-influencer)
- `GET /api/brand/requests`

### Influencer
- `GET /api/influencer/me`
- `POST /api/influencer/profile`
- `POST /api/media/upload`
- `GET /api/influencer/requests`
- `POST /api/influencer/requests/:id/status`

### Admin
- `POST /api/admin/login`
- `GET /api/admin/summary`
- `GET /api/admin/influencers`
- `GET /api/admin/brands`
- `GET /api/admin/requests`

---

## Motion and Performance Strategy

- **GSAP + ScrollTrigger** for hero/story/deck motion choreography.
- **Lenis** enabled on desktop for smooth wheel-based scroll.
- `prefers-reduced-motion` respected (heavy animation disabled).
- Mobile guardrails reduce expensive effects on small viewports.
- Animations primarily use `transform` + `opacity` for better compositing performance.

---

## Environment Variables

Use `.env.example` as the source of truth:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=
JWT_SECRET=
ADMIN_USERNAME=
ADMIN_PASSWORD=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=influencerhub/{userId}
PORT=8080
NODE_ENV=development
CORS_ORIGINS=
```

---

## Local Development

1. Install dependencies
```bash
npm install
```

2. Create env file
```bash
cp .env.example .env
```

3. Run app
```bash
npm run dev
```

App paths:
- `http://localhost:8080/apps/storefront/`
- `http://localhost:8080/apps/influencer/`
- `http://localhost:8080/apps/brand/`
- `http://localhost:8080/apps/admin/`

---

## Supabase Schema + RLS (Copy/Paste)

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

---

## Demo Data

`server.js` seeds 12 demo influencers if the `influencers` table is empty at startup.

---

## Cloudinary Setup

1. Create a Cloudinary account.
2. Configure env vars:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Upload media from influencer portal, or POST multipart file to `/api/media/upload`.

---

## Cloud Run Deployment

```bash
gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/influencerhub
gcloud run deploy influencerhub \
  --image gcr.io/$GOOGLE_CLOUD_PROJECT/influencerhub \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars SUPABASE_URL=...,SUPABASE_SERVICE_ROLE_KEY=...,SUPABASE_ANON_KEY=...,JWT_SECRET=...,ADMIN_USERNAME=...,ADMIN_PASSWORD=...,CLOUDINARY_CLOUD_NAME=...,CLOUDINARY_API_KEY=...,CLOUDINARY_API_SECRET=...
```

---

## Production Readiness Notes

- Frontend scripts now avoid fragile implicit global DOM references.
- Discovery/portal screens now surface API failures instead of failing silently.
- Admin auth is intentionally decoupled from Supabase per requirements.
- Ensure Cloud Run service env vars are correctly set; missing Supabase/Cloudinary values will cause request failures.
