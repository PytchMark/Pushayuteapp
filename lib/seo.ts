import type { Metadata } from 'next';
import type { Talent } from '../types';

const fallbackSiteUrl = 'https://book-a-yute.vercel.app';

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || fallbackSiteUrl;

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Book-A-Yute | Curated Talent Roster',
  description:
    'Premium roster of verified talent for festivals, corporate events, and private bookings.',
  openGraph: {
    title: 'Book-A-Yute | Curated Talent Roster',
    description:
      'Premium roster of verified talent for festivals, corporate events, and private bookings.',
    url: siteUrl,
    siteName: 'Book-A-Yute',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const buildTalentMetadata = (talent: Talent): Metadata => ({
  title: `${talent.stage_name} | Book Verified Talent`,
  description: `${talent.stage_name} — ${talent.city}, ${talent.country}. ${talent.bio}`,
  openGraph: {
    title: `${talent.stage_name} | Book Verified Talent`,
    description: `${talent.stage_name} — ${talent.city}, ${talent.country}. ${talent.bio}`,
    url: `${siteUrl}/talent/${talent.slug}`,
    images: talent.hero_image ? [{ url: talent.hero_image }] : undefined,
    type: 'profile',
  },
});

export const buildTalentJsonLd = (talent: Talent) => ({
  '@context': 'https://schema.org',
  '@type': talent.categories.includes('Band') ? 'MusicGroup' : 'Person',
  name: talent.stage_name,
  description: talent.bio,
  genre: talent.genres,
  address: {
    '@type': 'PostalAddress',
    addressLocality: talent.city,
    addressCountry: talent.country,
  },
  url: `${siteUrl}/talent/${talent.slug}`,
  image: talent.hero_image,
});
