import type { MetadataRoute } from 'next';
import { siteUrl } from '../lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/roster', '/talent/', '/request/', '/apply'],
        disallow: ['/admin', '/dashboard'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
