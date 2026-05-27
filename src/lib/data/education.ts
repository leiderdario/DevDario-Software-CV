import type { Education } from '../types';

export const EDUCATION: Education[] = [
  {
    id: 'udec',
    institution: 'Universidad de Cartagena',
    program: { es: 'Ingeniería de Software', en: 'Software Engineering' },
    period: { es: '2021 — 2026', en: '2021 — 2026' },
    location: 'Cartagena, Colombia',
    details: {
      es: 'Énfasis en IA aplicada, sistemas distribuidos y liderazgo de proyectos.',
      en: 'Focus on applied AI, distributed systems and project leadership.',
    },
  },
  {
    id: 'fenadeco',
    institution: 'Universidad FENADECO',
    program: { es: 'Econometría Espacial en Python', en: 'Spatial Econometrics in Python' },
    period: { es: 'Sep — Oct 2025', en: 'Sep — Oct 2025' },
    location: 'San Juan Nepomuceno, Colombia',
    details: {
      es: 'Modelos espaciales, autocorrelación, regresiones GIS y visualización con GeoPandas.',
      en: 'Spatial models, autocorrelation, GIS regressions and visualisation with GeoPandas.',
    },
  },
  {
    id: 'sena',
    institution: 'SENA',
    program: { es: 'Técnicos y Cursos de Formación', en: 'Technical Degrees & Training Courses' },
    period: { es: '2020 — 2025', en: '2020 — 2025' },
    location: 'Colombia',
    details: {
      es: 'Mantenimiento, gestión, eléctrica, C++/PHP/Python, K-Means, ciberseguridad e IA.',
      en: 'Maintenance, management, electrical, C++/PHP/Python, K-Means, cybersecurity and AI.',
    },
  },
];
