# InfluencerHub - Product Requirements Document

## Project Overview
**InfluencerHub** is a production-grade web application for discovering influencers and submitting collaboration requests. Built as a premium agency-site storefront with high-end motion design and storytelling.

## Tech Stack
- **Frontend**: Vanilla HTML/CSS/JS (No React)
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL with RLS)
- **Media Storage**: Cloudinary CDN
- **Deployment**: Cloud Run (Dockerfile provided)
- **Motion Libraries**: GSAP + ScrollTrigger + Lenis

## User Personas

### 1. Brands/Agencies
- Campaign managers looking for influencer partnerships
- Need: Search, filter, compare rates, submit requests to multiple influencers

### 2. Influencers/Creators  
- Content creators seeking brand collaborations
- Need: Profile management, portfolio showcase, request management

### 3. Platform Administrators
- Internal operations team
- Need: User management, metrics dashboard, platform oversight

## Core Requirements (Static)

### Visual Design
- Clean white base with red accents (#E11D48)
- Syne font for headings, Inter for body
- Premium motion effects (parallax, tilt cards, staggered reveals)
- Glassmorphism, grain textures, magnetic buttons

### Portals
1. **Storefront** - Public marketing + discovery
2. **Brand Portal** - Authenticated brand dashboard
3. **Influencer Portal** - Creator profile management  
4. **Admin Portal** - Internal dashboard (env-based auth)

### Data Model
- profiles, influencers, brands, requests, shortlists tables
- Row Level Security (RLS) enabled

## What's Been Implemented (Jan 2026)

### ✅ Completed Features
- [x] Premium storefront with GSAP animations
- [x] Hero section with parallax background
- [x] Story sections (3 chapters with scroll animations)
- [x] Horizontal scroll deck (4 feature cards)
- [x] Discovery section with filters
- [x] CTA section (3 cards)
- [x] Brand Portal with sidebar navigation
  - [x] Discover influencers tab
  - [x] Campaign Tray (cart-style multi-select)
  - [x] My Requests tab
  - [x] Saved/Shortlist tab
- [x] Influencer Portal
  - [x] Profile Builder (4 sections)
  - [x] Media upload zone
  - [x] Requests management
  - [x] Analytics placeholder
- [x] Admin Portal
  - [x] Login form (env-based credentials)
  - [x] Dashboard with metrics
  - [x] Data tables (influencers, brands, requests)
- [x] API endpoints (all functional)
- [x] 7 demo influencer profiles (seed data)
- [x] .env.example with all required keys
- [x] Dockerfile for Cloud Run deployment
- [x] Comprehensive README with SQL schema

### 🔧 Configuration Needed
- [ ] Supabase project setup (URL, keys)
- [ ] Cloudinary account setup (for media uploads)
- [ ] Admin credentials (ADMIN_USERNAME, ADMIN_PASSWORD)

## Prioritized Backlog

### P0 - Critical (Blocks Usage)
- Configure Supabase environment variables
- Run SQL schema in Supabase

### P1 - High Priority
- Cloudinary integration for media uploads
- Email notifications for new requests
- Password reset flow for users

### P2 - Medium Priority  
- Stripe integration for premium tiers
- Advanced analytics dashboard
- Email verification flow
- Mobile app (React Native)

### P3 - Nice to Have
- AI-powered influencer matching
- Contract generation
- Calendar integration for bookings

## Next Tasks
1. Set up Supabase project and configure .env
2. Run SQL schema to create tables
3. Test full flow with real data
4. Configure Cloudinary for media uploads
5. Deploy to Cloud Run

---
*Last Updated: Jan 2026*
