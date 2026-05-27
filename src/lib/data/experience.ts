import type { Experience } from '../types';

export const EXPERIENCE: Experience[] = [
  {
    id: 'mahates',
    company: 'Alcaldía Municipal de Mahates',
    role: { es: 'Ingeniero de Software Contratista / Líder de Proyecto', en: 'Software Engineer Contractor / Project Lead' },
    period: { es: 'Ene 2026 — Actualidad', en: 'Jan 2026 — Present' },
    location: 'Mahates, Bolívar',
    bullets: {
      es: [
        'Lidero un equipo multidisciplinario de cinco desarrolladores con metodologías ágiles.',
        'Arquitectura, backend y despliegue de la plataforma turística municipal.',
        'Stakeholder management con el gabinete municipal y proveedores externos.',
      ],
      en: [
        'Leading a multidisciplinary team of five developers under agile delivery.',
        'Architecture, backend and deployment of the municipal tourism platform.',
        'Stakeholder management with city cabinet and external providers.',
      ],
    },
  },
  {
    id: 'unizar',
    company: 'Universidad de Zaragoza',
    role: { es: 'Investigador y Desarrollador de IA — Pasantía Internacional', en: 'AI Researcher & Developer — International Internship' },
    period: { es: 'Ago — Oct 2025', en: 'Aug — Oct 2025' },
    location: 'Zaragoza, España',
    bullets: {
      es: [
        'Beca internacional por ponencia y proyecto de IA emocional avanzada (ALIRA).',
        'Computación afectiva: visión por computador, voz y biometría en tiempo real.',
        'Orquestación de agentes con LangGraph y modelos multi-LLM.',
      ],
      en: [
        'International scholarship for advanced emotional-AI talk and project (ALIRA).',
        'Affective computing: real-time computer vision, voice and biometrics.',
        'Agent orchestration with LangGraph and multi-LLM stacks.',
      ],
    },
  },
  {
    id: 'udec',
    company: 'Universidad de Cartagena',
    role: { es: 'Movilidad Nacional · Ganador Tercer Seminario CTI', en: 'National Mobility · Winner of the Third CTI Seminar' },
    period: { es: 'Jun 2025', en: 'Jun 2025' },
    location: 'Mompox, Bolívar',
    bullets: {
      es: [
        'Primer lugar en el Tercer Seminario de Inmersión en Ciencia, Tecnología e Innovación.',
        'Defensa de un proyecto de IA aplicada con jurado interuniversitario.',
      ],
      en: [
        'First place at the Third CTI Immersion Seminar.',
        'Defended an applied-AI project before an inter-university jury.',
      ],
    },
  },
  {
    id: 'smartassets',
    company: 'SmartAssets',
    role: { es: 'Desarrollador Frontend PHP', en: 'Frontend PHP Developer' },
    period: { es: 'Feb — Jul 2025', en: 'Feb — Jul 2025' },
    location: 'Cartagena, Colombia',
    bullets: {
      es: [
        'Interfaces responsive en PHP, HTML, CSS y JavaScript con tiempos de carga 30% menores.',
        'Integración con APIs internas y mejoras de accesibilidad WCAG.',
      ],
      en: [
        'Responsive PHP, HTML, CSS and JavaScript interfaces with 30% faster load times.',
        'Integration with internal APIs and WCAG accessibility improvements.',
      ],
    },
  },
  {
    id: 'nequi',
    company: 'Nequi (Bancolombia S.A.)',
    role: { es: 'Soporte Técnico', en: 'Technical Support' },
    period: { es: 'Jul — Dic 2024', en: 'Jul — Dec 2024' },
    location: 'Medellín, Colombia',
    bullets: {
      es: [
        'Resolución de incidencias críticas con 95% de satisfacción de usuario.',
        'Automatización de flujos de consentimiento usados a lo largo del producto.',
      ],
      en: [
        'Critical-incident resolution with 95% customer satisfaction.',
        'Automated consent flows now used across the product.',
      ],
    },
  },
  {
    id: 'dran',
    company: 'Dran Digital',
    role: { es: 'Desarrollador Backend', en: 'Backend Developer' },
    period: { es: 'Oct 2021 — Sep 2023', en: 'Oct 2021 — Sep 2023' },
    location: 'Cartagena, Colombia',
    bullets: {
      es: [
        'Reescritura de APIs Python y MySQL llevando la disponibilidad al 99.9%.',
        'Mentoría a un equipo junior y revisión de pull requests diarias.',
      ],
      en: [
        'Rewrote Python and MySQL APIs lifting availability to 99.9%.',
        'Mentored a junior team and ran daily code reviews.',
      ],
    },
  },
];
