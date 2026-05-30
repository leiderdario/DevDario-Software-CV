import type { Project } from '../types';

/** Canonical production domain. Used by metadataBase, sitemap, robots and JSON-LD. */
export const SITE_URL = 'https://leiderdario.online';
export const SITE_NAME = 'Leider Darío Bolaño Agámez';
export const SITE_TITLE = 'Leider Dario Bolaño Agámez — Software Engineer & AI Developer';
export const SITE_DESCRIPTION =
  'Full Stack Developer, AI Engineer & Software Engineer based in Colombia. Python, TypeScript, LangChain, LangGraph, Next.js, Docker. International fellow at Universidad de Zaragoza.';

export const SOCIAL = {
  github: 'https://github.com/leiderdario',
  linkedin: 'https://www.linkedin.com/in/leider-dario-bolaño-3d',
};

/** Resolve a path against the canonical domain into an absolute URL. */
export const abs = (path: string): string => new URL(path, SITE_URL).toString();

/**
 * Person schema (https://schema.org/Person). The single most valuable structured
 * data for a personal portfolio — feeds rich results and knowledge panels.
 */
export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: SITE_NAME,
    alternateName: 'Leider Dario',
    url: SITE_URL,
    image: abs('/opengraph-image'),
    jobTitle: 'Software Engineer & AI Engineer',
    description: SITE_DESCRIPTION,
    email: 'mailto:leiderddario@gmail.com',
    telephone: '+57 300 803 7847',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cartagena',
      addressRegion: 'Bolívar',
      addressCountry: 'CO',
    },
    nationality: { '@type': 'Country', name: 'Colombia' },
    sameAs: [SOCIAL.github, SOCIAL.linkedin],
    knowsAbout: [
      'Python',
      'TypeScript',
      'JavaScript',
      'LangChain',
      'LangGraph',
      'Next.js',
      'React',
      'Node.js',
      'Docker',
      'Machine Learning',
      'Computer Vision',
      'Large Language Models',
      'Full Stack Development',
      'Artificial Intelligence',
    ],
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Universidad de Cartagena' },
      { '@type': 'CollegeOrUniversity', name: 'Universidad de Zaragoza' },
    ],
    worksFor: { '@type': 'Organization', name: '3DIGIT-ALL FACTORY' },
  };
}

/** WebSite schema (https://schema.org/WebSite). Ties the domain to its publisher. */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: 'es',
    publisher: { '@id': `${SITE_URL}/#person` },
  };
}

/** CreativeWork schema for a single project detail page. */
export function projectJsonLd(project: Project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.longDescription?.en ?? project.description.en,
    url: abs(project.detailHref ?? `/work/${project.id}`),
    ...(project.image ? { image: abs(project.image) } : {}),
    dateCreated: project.year,
    keywords: project.tags.join(', '),
    inLanguage: 'es',
    author: { '@id': `${SITE_URL}/#person` },
    creator: { '@id': `${SITE_URL}/#person` },
    ...(project.url ? { sameAs: project.url } : {}),
  };
}

/** BreadcrumbList schema. `items` are ordered from root to current page. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}
