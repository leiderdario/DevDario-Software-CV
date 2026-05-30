export type Lang = 'es' | 'en';

export type BiText = { es: string; en: string };

export type ProjectLayout = 'featured-left' | 'featured-right' | 'featured-vertical' | 'compact';

export type Project = {
  id: string;
  index: string;
  title: string;
  tags: string[];
  category: BiText;
  year: string;
  description: BiText;
  image: string | null;
  /** External URL: demo, video, or repo. null when project is private/NDA. */
  url: string | null;
  /** Optional internal route to a detail page, e.g. '/work/alira'. Takes precedence over `url` on card click. */
  detailHref?: string;
  /** One concrete trade-off or lesson learned, shown inline on the card. */
  tradeOff?: BiText;
  /** Long-form story for the detail page. */
  longDescription?: BiText;
  /** One concrete number per project (latency, users…). Rendered as a small badge on the card. */
  metric?: { value: string; label: BiText };
  /** YouTube video id (just the id, e.g. '0JQkCcUkMhk') for detail page embed. */
  videoEmbed?: string;
  /** Client name for case studies (e.g. 'NDA · Banca digital'). */
  client?: string;
  /** Explicit NDA flag — disables external link, shows "Private" badge. */
  isPrivate?: boolean;
  featured: boolean;
  layout: ProjectLayout;
  placeholder?: { gradient: [string, string]; glyph: string };
};

export type Service = {
  id: string;
  label: BiText;
};

export type Testimonial = {
  id: string;
  name: string;
  role: BiText;
  company: string;
  quote: BiText;
  initials: string;
  gradient: [string, string];
  procedural: boolean;
  duration?: string;
};

export type Experience = {
  id: string;
  company: string;
  role: BiText;
  period: BiText;
  location: string;
  bullets: { es: string[]; en: string[] };
};

export type Education = {
  id: string;
  institution: string;
  program: BiText;
  period: BiText;
  location: string;
  details?: BiText;
};

export type TrustedItem = {
  id: string;
  name: string;
};

export type NavLink = {
  id: string;
  href: string;
  label: BiText;
};

export type ToolGroup = {
  id: string;
  title: BiText;
  tools: string[];
};
