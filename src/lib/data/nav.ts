import type { NavLink } from '../types';

export const NAV_LINKS: NavLink[] = [
  { id: 'work', href: '#work', label: { es: 'Proyectos', en: 'Work' } },
  { id: 'about', href: '#about', label: { es: 'Sobre mí', en: 'About' } },
  { id: 'services', href: '#services', label: { es: 'Servicios', en: 'Services' } },
  { id: 'testimonials', href: '#testimonials', label: { es: 'Testimonios', en: 'Testimonials' } },
  { id: 'contact', href: '#contact', label: { es: 'Contacto', en: 'Contact' } },
];

export const FOOTER_COLUMNS = [
  {
    id: 'contact',
    title: { es: 'Contacto', en: 'Contact' },
    items: [
      { label: 'lbolanoa1@unicartagena.edu.co', href: 'mailto:lbolanoa1@unicartagena.edu.co' },
      { label: '+57 300 803 7847', href: 'tel:+573008037847' },
      { label: 'Cartagena, Colombia', href: '#' },
    ],
  },
  {
    id: 'social',
    title: { es: 'Redes', en: 'Socials' },
    items: [
      { label: 'GitHub', href: 'https://github.com/leiderdario' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
      { label: '3DIGIT-ALL', href: 'https://3digitallfactory.com/' },
    ],
  },
  {
    id: 'sitemap',
    title: { es: 'Sitemap', en: 'Sitemap' },
    items: [
      { label: { es: 'Proyectos', en: 'Work' }, href: '#work' },
      { label: { es: 'Sobre mí', en: 'About' }, href: '#about' },
      { label: { es: 'Servicios', en: 'Services' }, href: '#services' },
      { label: { es: 'Contacto', en: 'Contact' }, href: '#contact' },
    ],
  },
];
