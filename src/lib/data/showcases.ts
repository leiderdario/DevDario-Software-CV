import type { Showcase } from '../types';

export const SHOWCASES: Showcase[] = [
  {
    id: 'alira',
    side: 'left',
    eyebrow: { es: 'Proyecto destacado', en: 'Featured project' },
    title: 'ALIRA',
    blurb: {
      es: 'Tres señales, un solo veredicto emocional. En tiempo real, sin nube.',
      en: 'Three signals, one emotional verdict. Real time, no cloud.',
    },
    features: [
      {
        id: 'face',
        text: {
          es: 'Reconocimiento facial en tiempo real · <16ms por frame',
          en: 'Real-time face recognition · <16ms per frame',
        },
      },
      {
        id: 'voice',
        text: {
          es: 'Análisis de voz multilingüe — ES/EN/FR/CA',
          en: 'Multilingual voice analysis — ES/EN/FR/CA',
        },
      },
      {
        id: 'fusion',
        text: {
          es: 'Fusion sensor: pulso, GSR, acelerómetro',
          en: 'Sensor fusion: pulse, GSR, accelerometer',
        },
      },
    ],
    badge: { es: 'Presentado en U. Zaragoza 2025', en: 'Presented at U. Zaragoza 2025' },
    gradient: ['#ff6b35', '#1a0a02'],
    glyph: 'A',
    mockup: 'tablet',
    accent: '#ff6b35',
  },
  {
    id: 'mahates',
    side: 'right',
    eyebrow: { es: 'Plataforma de gobierno', en: 'Government platform' },
    title: 'Mahates',
    blurb: {
      es: 'Un municipio entero en una sola plataforma. Lo lidero con un equipo de cinco.',
      en: 'A whole municipality in one platform. I lead it with a team of five.',
    },
    features: [
      {
        id: 'routes',
        text: { es: 'Catálogo de 80+ rutas turísticas', en: 'Catalog of 80+ tourist routes' },
      },
      {
        id: 'booking',
        text: {
          es: 'Reserva integrada con operadores locales',
          en: 'Integrated booking with local operators',
        },
      },
      {
        id: 'admin',
        text: { es: 'Panel administrativo multi-rol', en: 'Multi-role admin panel' },
      },
    ],
    badge: { es: 'Hecho para la Alcaldía Municipal · 2026', en: 'Built for Alcaldía Municipal · 2026' },
    gradient: ['#3a8dde', '#04111f'],
    glyph: 'M',
    mockup: 'laptop',
    accent: '#3a8dde',
  },
  {
    id: '3digitall',
    side: 'vertical',
    eyebrow: { es: 'Estudio propio', en: 'Own studio' },
    title: '3DIGIT-ALL FACTORY',
    blurb: {
      es: 'Cofundé el lugar donde se construye lo siguiente. Industria, plataformas, gaming.',
      en: 'I co-founded the place where the next thing gets built. Industry, platforms, gaming.',
    },
    features: [
      {
        id: 'studio',
        text: { es: 'Estudio independiente · Fundado 2026', en: 'Independent studio · Founded 2026' },
      },
      {
        id: 'scope',
        text: {
          es: 'Software para industrias, plataformas y gaming',
          en: 'Software for industry, platforms, and gaming',
        },
      },
      {
        id: 'role',
        text: { es: 'Co-fundador & Engineering Lead', en: 'Co-founder & Engineering Lead' },
      },
    ],
    badge: { es: '3digitallfactory.com ↗', en: '3digitallfactory.com ↗' },
    badgeUrl: 'https://3digitallfactory.com/',
    gradient: ['#e2e1df', '#121212'],
    glyph: '3D',
    mockup: 'monitor',
    accent: '#a855f7',
  },
];
