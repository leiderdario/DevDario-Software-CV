import type { Experience } from '../types';

export const EXPERIENCE: Experience[] = [
  {
    id: 'mahates',
    company: 'Alcaldía Municipal de Mahates',
    role: {
      es: 'Desarrollador Full Stack · Jornada parcial · Presencial',
      en: 'Full Stack Developer · Part-time · On-site',
    },
    period: { es: 'Ene 2026 — Jul 2026', en: 'Jan 2026 — Jul 2026' },
    location: 'Mahates, Bolívar, Colombia',
    bullets: {
      es: [
        'Construcción de interfaces web y móviles con Node.js y TypeScript; base de datos PostgreSQL.',
        'Integración de APIs de IA, ajuste fino de modelos y diseño de pipelines de datos.',
        'Despliegue de servicios en Docker y Kubernetes; modelado de datos en SQL y pipelines CI/CD.',
        'Proyecto paralelo a Dran Digital.',
      ],
      en: [
        'Built web and mobile interfaces with Node.js and TypeScript backed by PostgreSQL.',
        'Integrated AI APIs, fine-tuned models and designed data pipelines.',
        'Deployed services with Docker and Kubernetes; SQL data modelling and CI/CD pipelines.',
        'Engagement run in parallel to Dran Digital.',
      ],
    },
  },
  {
    id: 'dran',
    company: 'Dran Digital',
    role: {
      es: 'Desarrollador Full Stack · Rol principal, tiempo completo · Remoto',
      en: 'Full Stack Developer · Primary role, full-time · Remote',
    },
    period: { es: 'Ene 2025 — Actualidad', en: 'Jan 2025 — Present' },
    location: 'Cartagena, Colombia',
    bullets: {
      es: [
        'Construcción de interfaces web y móviles con React, React Native y TypeScript; backend en PHP y Ruby.',
        'Automatización de procesos internos con N8N y flujos en LangGraph que redujeron tareas manuales repetitivas del equipo.',
        'Implementación y mantenimiento de sitios en WordPress (Elementor, WPBakery) para clientes del área comercial.',
        'Gestión de datos y autenticación con Firebase; trabajo colaborativo en Git y GitHub.',
      ],
      en: [
        'Web and mobile interfaces with React, React Native and TypeScript; backend in PHP and Ruby.',
        'Internal-process automation with N8N and LangGraph flows that cut repetitive manual work for the team.',
        'WordPress implementation and maintenance (Elementor, WPBakery) for commercial clients.',
        'Data and auth management with Firebase; daily collaboration on Git and GitHub.',
      ],
    },
  },
  {
    id: 'nequi',
    company: 'Nequi — Bancolombia S.A.',
    role: {
      es: 'Pasante · Jornada parcial · Remoto',
      en: 'Intern · Part-time · Remote',
    },
    period: { es: 'Ago 2024 — Sep 2024', en: 'Aug 2024 — Sep 2024' },
    location: 'Medellín, Colombia',
    bullets: {
      es: [
        'Diseño y optimización de funnels digitales para mejorar tasas de conversión.',
        'Automatización de procesos de marketing con herramientas no-code e integración de APIs.',
        'Soporte técnico especializado a la plataforma financiera digital basada en COBOL y Oracle.',
      ],
      en: [
        'Designed and optimized digital funnels to lift conversion rates.',
        'Marketing-process automation using no-code tooling plus API integrations.',
        'Specialized technical support for the digital finance platform built on COBOL and Oracle.',
      ],
    },
  },
  {
    id: 'smartassets',
    company: 'SmartAssets',
    role: {
      es: 'Desarrollador Fullstack PHP',
      en: 'Fullstack PHP Developer',
    },
    period: { es: 'Feb 2024 — Jun 2024', en: 'Feb 2024 — Jun 2024' },
    location: 'Remoto',
    bullets: {
      es: [
        'Construcción de arquitectura de interfaces web y móviles, optimización de SEO y performance.',
        'Administración de equipos y servidores; capacitación a empleados en nuevas herramientas.',
        'Despliegue completo de Landing Page con formulario usando el servicio de WordPress.',
      ],
      en: [
        'Built the architecture for web and mobile interfaces with SEO and performance tuning.',
        'Team and server administration; trained employees on new tooling.',
        'Full deployment of a WordPress landing page with form capture.',
      ],
    },
  },
  {
    id: 'bleisor',
    company: 'Bleisor Solution',
    role: {
      es: 'Agente de Ventas · Jornada completa · Remoto',
      en: 'Sales Agent · Full-time · Remote',
    },
    period: { es: 'Jun 2023 — Dic 2023', en: 'Jun 2023 — Dec 2023' },
    location: 'España',
    bullets: {
      es: [
        'Atención al cliente, gestión de inventario, cobros y facturación.',
      ],
      en: [
        'Customer support, inventory management, billing and invoicing.',
      ],
    },
  },
];
