import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/data/seo';
import { PROJECTS } from '@/lib/data/projects';

/** Fixed last-modified date so the build stays deterministic. Bump on content updates. */
const LAST_MODIFIED = '2026-05-29';

export default function sitemap(): MetadataRoute.Sitemap {
  const home: MetadataRoute.Sitemap[number] = {
    url: SITE_URL,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: 1,
  };

  const projects: MetadataRoute.Sitemap = PROJECTS.filter((p) => p.detailHref).map((p) => ({
    url: `${SITE_URL}${p.detailHref}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [home, ...projects];
}
