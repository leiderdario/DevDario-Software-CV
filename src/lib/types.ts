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
  url: string;
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
