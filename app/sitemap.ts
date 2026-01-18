import type { MetadataRoute } from 'next';
import { demoTalents } from '../lib/demoTalents';
import { siteUrl } from '../lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/roster', '/apply'].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const talentRoutes = demoTalents.map((talent) => ({
    url: `${siteUrl}/talent/${talent.slug}`,
    lastModified: new Date(),
  }));

  return [...routes, ...talentRoutes];
}
