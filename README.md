# Book-A-Yute | Premium Talent Roster

A curated talent roster platform with a red/black premium aesthetic, glow effects, and motion-driven UI. Built with Next.js 14 (App Router), Tailwind CSS, and Framer Motion.

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS
- **Motion**: Framer Motion
- **Data**: Demo talent data (Supabase-ready)

## Local Development
1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Open `http://localhost:3000`

## Environment Variables
Create a `.env.local` file for local overrides. Example:
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

See `.env.example` for placeholders.

## Production Build
```
npm run build
npm run start
```

## Vercel Deploy (Recommended)
1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Set environment variables in **Project Settings → Environment Variables**:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL` (optional)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional)
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only; optional)
4. Build Command: `npm run build`
5. Output Directory: Leave blank (Next.js default)
6. Deploy.

## Routes
- `/` Home
- `/roster` Roster
- `/talent/[slug]` SEO talent profiles
- `/request/[talentId]` Booking requests
- `/apply` Join roster
- `/dashboard` Talent portal shell
- `/admin` Admin portal shell
