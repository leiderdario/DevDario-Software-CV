import type { Education } from '../types';

export const EDUCATION: Education[] = [
  {
    id: 'udec',
    institution: 'Universidad de Cartagena',
    program: { es: 'Ingeniería de Software', en: 'Software Engineering' },
    period: { es: 'Feb 2022 — May 2026', en: 'Feb 2022 — May 2026' },
    location: 'Cartagena, Colombia',
    details: {
      es: 'Pregrado profesional. Enfoque en IA aplicada, sistemas distribuidos y liderazgo de proyectos.',
      en: 'Professional undergraduate degree. Focus on applied AI, distributed systems and project leadership.',
    },
  },
  {
    id: 'udec-ia',
    institution: 'Universidad de Cartagena',
    program: { es: 'Inteligencia Artificial Aplicada', en: 'Applied Artificial Intelligence' },
    period: { es: 'Nov — Dic 2025', en: 'Nov — Dec 2025' },
    location: 'Cartagena, Colombia',
  },
  {
    id: 'unizar',
    institution: 'Universidad de Zaragoza',
    program: {
      es: 'Pasantía Internacional de Investigación',
      en: 'International Research Internship',
    },
    period: { es: 'Oct 2025', en: 'Oct 2025' },
    location: 'Zaragoza, España',
    details: {
      es: 'Proyecto ALIRA — IA de detección de emociones con análisis biométrico en tiempo real.',
      en: 'ALIRA project — emotion-detection AI with real-time biometric analysis.',
    },
  },
  {
    id: 'sena',
    institution: 'SENA',
    program: {
      es: 'Técnico en Gestión de Datos en Modelos IA',
      en: 'Technician in Data Management for AI Models',
    },
    period: { es: 'Feb 2021 — Dic 2022', en: 'Feb 2021 — Dec 2022' },
    location: 'Colombia',
  },
  {
    id: 'fenadeco',
    institution: 'Universidad FENADECO',
    program: {
      es: 'Econometría Espacial en Python',
      en: 'Spatial Econometrics in Python',
    },
    period: { es: 'Ago — Oct 2025', en: 'Aug — Oct 2025' },
    location: 'Colombia',
  },
  {
    id: 'ingles',
    institution: 'Eder Ledezma',
    program: {
      es: 'Inglés Conversacional',
      en: 'Conversational English',
    },
    period: { es: 'Feb 2025', en: 'Feb 2025' },
    location: 'Colombia',
  },
];
