import type { NavLink } from '../types';

export const NAV_LINKS: NavLink[] = [
  { id: 'work', href: '#work', label: { es: 'Proyectos', en: 'Work' } },
  { id: 'about', href: '#about', label: { es: 'Sobre mí', en: 'About' } },
  { id: 'experience', href: '#experience', label: { es: 'Experiencia', en: 'Experience' } },
  { id: 'achievements', href: '#achievements', label: { es: 'Logros', en: 'Achievements' } },
  { id: 'certifications', href: '#certifications', label: { es: 'Certificaciones', en: 'Certifications' } },
  { id: 'contact', href: '#contact', label: { es: 'Contacto', en: 'Contact' } },
];

export const CV_PDF_HREF = '/cv/Leider-Dario-CV.pdf';
export const CONTACT_EMAIL = 'leiderddario@gmail.com';
export const CONTACT_PHONE = '+57 300 803 7847';

export const FOOTER_COLUMNS = [
  {
    id: 'contact',
    title: { es: 'Contacto', en: 'Contact' },
    items: [
      { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
      { label: CONTACT_PHONE, href: 'tel:+573008037847' },
      { label: 'Medellín / Cartagena, Colombia', href: '#' },
    ],
  },
  {
    id: 'social',
    title: { es: 'Redes', en: 'Socials' },
    items: [
      { label: 'GitHub', href: 'https://github.com/leiderdario' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
      { label: { es: 'Descargar CV (PDF)', en: 'Download CV (PDF)' }, href: CV_PDF_HREF },
    ],
  },
  {
    id: 'sitemap',
    title: { es: 'Sitemap', en: 'Sitemap' },
    items: [
      { label: { es: 'Proyectos', en: 'Work' }, href: '#work' },
      { label: { es: 'Experiencia', en: 'Experience' }, href: '#experience' },
      { label: { es: 'Logros', en: 'Achievements' }, href: '#achievements' },
      { label: { es: 'Certificaciones', en: 'Certifications' }, href: '#certifications' },
      { label: { es: 'Contacto', en: 'Contact' }, href: '#contact' },
    ],
  },
];
