'use client';

import { useState, useRef } from 'react';
import {
  Code2,
  Server,
  Database,
  Globe,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  Microscope,
  BrainCircuit,
  Cpu,
  Boxes,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/cn';

type RoleItem = {
  id: string;
  icon: typeof Code2;
  category: 'core' | 'ai' | 'security' | 'strategy';
  title: { es: string; en: string };
  badge: { es: string; en: string };
  description: { es: string; en: string };
  skills: string[];
  highlight: { es: string; en: string };
};

const ROLES: RoleItem[] = [
  {
    id: 'frontend',
    icon: Code2,
    category: 'core',
    title: { es: 'Frontend Developer', en: 'Frontend Developer' },
    badge: { es: 'UI/UX & Interactividad', en: 'UI/UX & Interactivity' },
    description: {
      es: 'Interfaces reactivas de ultra-alta fidelidad, animaciones complejas con GSAP/Lenis, microinteracciones y accesibilidad AA con Next.js y TypeScript.',
      en: 'Ultra-high fidelity reactive interfaces, complex animations with GSAP/Lenis, micro-interactions, and AA accessibility with Next.js and TypeScript.',
    },
    skills: ['Next.js', 'React', 'TypeScript', 'GSAP', 'Lenis', 'Tailwind CSS'],
    highlight: { es: 'Renderizado fluido a 60fps con accesibilidad total', en: 'Smooth 60fps rendering with full accessibility' },
  },
  {
    id: 'backend',
    icon: Server,
    category: 'core',
    title: { es: 'Backend Developer', en: 'Backend Developer' },
    badge: { es: 'APIs & Microservicios', en: 'APIs & Microservices' },
    description: {
      es: 'Arquitectura de servicios escalables, endpoints de baja latencia en Node.js, Python, Ruby y PHP con autenticación robusta y procesamiento asíncrono.',
      en: 'Scalable service architecture, low-latency endpoints in Node.js, Python, Ruby, and PHP with robust authentication and async processing.',
    },
    skills: ['Node.js', 'Python', 'FastAPI', 'Ruby', 'Express', 'REST / WebSockets'],
    highlight: { es: 'Tiempos de respuesta sub-100ms y concurrencia optimizada', en: 'Sub-100ms response times and optimized concurrency' },
  },
  {
    id: 'database',
    icon: Database,
    category: 'core',
    title: { es: 'Especialista en Bases de Datos', en: 'Database Specialist' },
    badge: { es: 'Modelado & Rendimiento', en: 'Data Modeling & Performance' },
    description: {
      es: 'Diseño de esquemas relacionales y documentales, optimización de consultas SQL, indexación estratégica y gestión con PostgreSQL, MySQL y Firebase.',
      en: 'Relational and document schema design, SQL query optimization, strategic indexing, and management with PostgreSQL, MySQL, and Firebase.',
    },
    skills: ['PostgreSQL', 'MySQL', 'Prisma ORM', 'Firebase', 'SQL Query Tuning'],
    highlight: { es: 'Integridad referencial y pipelines de datos consistentes', en: 'Referential integrity and consistent data pipelines' },
  },
  {
    id: 'web-dev',
    icon: Globe,
    category: 'core',
    title: { es: 'Desarrollador Web Full Stack', en: 'Full Stack Web Developer' },
    badge: { es: 'End-to-End', en: 'End-to-End' },
    description: {
      es: 'Construcción integral de productos web de punta a punta: desde la experiencia de usuario y SEO técnico hasta la infraestructura de despliegue.',
      en: 'Comprehensive end-to-end web product development: from user experience and technical SEO to production deployment infrastructure.',
    },
    skills: ['Vercel', 'Next.js App Router', 'Full Stack TypeScript', 'SEO', 'PWA'],
    highlight: { es: 'Puntuaciones 100/100 en Lighthouse y despliegues sin fricción', en: '100/100 Lighthouse scores and frictionless deployments' },
  },
  {
    id: 'qa',
    icon: CheckCircle2,
    category: 'security',
    title: { es: 'QA & Calidad de Software', en: 'QA & Software Quality' },
    badge: { es: 'Robustez & Testing', en: 'Robustness & Testing' },
    description: {
      es: 'Pruebas unitarias, de integración y end-to-end. Validación de contratos de datos con Zod y control estricto de casos límite en producción.',
      en: 'Unit, integration, and end-to-end testing. Data contract validation with Zod and rigorous edge case auditing in production.',
    },
    skills: ['Zod Contracts', 'E2E Testing', 'Integration Testing', 'Code Audits', 'CI/CD Guardrails'],
    highlight: { es: 'Cero regresiones críticas en lanzamientos a producción', en: 'Zero critical regressions on production releases' },
  },
  {
    id: 'marketing-digital',
    icon: TrendingUp,
    category: 'strategy',
    title: { es: 'Marketing Digital & Growth', en: 'Digital Marketing & Growth' },
    badge: { es: 'Embudos & Conversión', en: 'Funnels & Conversion' },
    description: {
      es: 'Diseño de funnels de conversión, analítica de comportamiento del usuario, automatización no-code e integración técnica para captación de clientes.',
      en: 'Conversion funnel design, user behavioral analytics, no-code automation, and technical integration for customer acquisition.',
    },
    skills: ['Conversion Funnels', 'N8N Automation', 'Analytics', 'A/B Testing', 'Landing Optimization'],
    highlight: { es: 'Optimización medible de tasas de conversión y retención', en: 'Measurable conversion rate and retention optimization' },
  },
  {
    id: 'cybersecurity',
    icon: ShieldAlert,
    category: 'security',
    title: { es: 'Auditoría de Ciberseguridad Ofensiva', en: 'Offensive Cybersecurity Auditor' },
    badge: { es: 'Red Teaming & Hardening', en: 'Red Teaming & Hardening' },
    description: {
      es: 'Evaluación ética de vulnerabilidades, pruebas de intrusión en Kali Linux/Parrot OS, defensas en profundidad y auditoría de seguridad para sistemas con LLMs.',
      en: 'Ethical vulnerability assessment, penetration testing on Kali Linux/Parrot OS, defense-in-depth, and security audits for LLM systems.',
    },
    skills: ['Kali Linux', 'Parrot OS', 'Prompt Injection Defense', 'Falco Runtime', 'Sandbox Isolation'],
    highlight: { es: 'Kamuli: workbench de red teaming con 6 capas de defensa', en: 'Kamuli: 6-layer defense-in-depth red teaming workbench' },
  },
  {
    id: 'research',
    icon: Microscope,
    category: 'strategy',
    title: { es: 'Investigador en Proyectos de Software', en: 'Software Project Researcher' },
    badge: { es: 'I+D Aplicada', en: 'Applied R&D' },
    description: {
      es: 'Investigación académica y tecnológica aplicada a productos reales. Ponente internacional en España y proyectos galardonados a nivel nacional.',
      en: 'Academic and technological research applied to real products. International speaker in Spain and nationally awarded research projects.',
    },
    skills: ['Paper Prototyping', 'Universidad de Zaragoza', 'Simposios', 'I+D Multimodal'],
    highlight: { es: 'Becario internacional y múltiples reconocimientos nacionales', en: 'International fellow and multiple national research awards' },
  },
  {
    id: 'ai-dev',
    icon: BrainCircuit,
    category: 'ai',
    title: { es: 'Desarrollador de IA Supervisada y No Supervisada', en: 'Supervised & Unsupervised AI Dev' },
    badge: { es: 'Modelos & Computer Vision', en: 'Models & Computer Vision' },
    description: {
      es: 'Clasificación supervisada, clustering no supervisado (K-Means), pipelines multimodales (visión por computador, prosodia y biometría) y agentes con LangGraph.',
      en: 'Supervised classification, unsupervised clustering (K-Means), multimodal pipelines (computer vision, voice, biometrics), and LangGraph agents.',
    },
    skills: ['Computer Vision', 'K-Means Clustering', 'LangChain', 'LangGraph', 'OpenCV / MediaPipe'],
    highlight: { es: 'ALIRA & Habitusutos: visión e inferencia en tiempo real', en: 'ALIRA & Habitusutos: real-time vision and inference' },
  },
  {
    id: 'computational-systems',
    icon: Cpu,
    category: 'security',
    title: { es: 'Sistemas Computacionales & DevOps', en: 'Computational Systems & DevOps' },
    badge: { es: 'Infraestructura & Linux', en: 'Infrastructure & Linux' },
    description: {
      es: 'Virtualización, contenedores Docker, orquestación Kubernetes, pipelines CI/CD y administración avanzada de entornos Unix/Linux.',
      en: 'Virtualization, Docker containers, Kubernetes orchestration, CI/CD pipelines, and advanced Unix/Linux system administration.',
    },
    skills: ['Docker', 'Kubernetes', 'CI/CD Pipelines', 'Linux Systems', 'Git Architecture'],
    highlight: { es: 'Contenedores seguros e implementaciones reproducibles', en: 'Secure containers and reproducible production builds' },
  },
  {
    id: 'software-architect',
    icon: Boxes,
    category: 'strategy',
    title: { es: 'Arquitecto de Software', en: 'Software Architect' },
    badge: { es: 'Sistemas Distribuidos', en: 'Distributed Systems' },
    description: {
      es: 'Diseño de arquitecturas tolerantes a fallos, monolitos modulares escalables, separación de dominios y toma de decisiones técnicas estratégicas.',
      en: 'Design of fault-tolerant architectures, scalable modular monoliths, domain boundaries, and strategic technical trade-off decisions.',
    },
    skills: ['Modular Monoliths', 'Microservices Strategy', 'Domain Driven Design', 'System Resilience'],
    highlight: { es: 'Liderazgo técnico de equipos de desarrollo y entrega continua', en: 'Technical leadership of engineering teams and continuous shipping' },
  },
];

export function RolesShowcase() {
  const { lang } = useTranslation();
  const [selectedId, setSelectedId] = useState<string>('ai-dev');
  const [activeFilter, setActiveFilter] = useState<'all' | 'core' | 'ai' | 'security' | 'strategy'>('all');
  const containerRef = useRef<HTMLDivElement | null>(null);

  const filteredRoles = activeFilter === 'all'
    ? ROLES
    : ROLES.filter((r) => r.category === activeFilter);

  const selectedRole = ROLES.find((r) => r.id === selectedId) || ROLES[0];
  const SelectedIcon = selectedRole.icon;

  return (
    <div ref={containerRef} className="w-full mt-10">
      {/* Header & Filter pills */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[var(--color-border)]/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--color-accent)] mb-1">
            <Sparkles size={14} className="animate-pulse" />
            <span>{lang === 'es' ? 'Versatilidad Técnica Probada' : 'Proven Technical Versatility'}</span>
          </div>
          <p className="text-sm text-[var(--color-text-dim)]">
            {lang === 'es'
              ? 'Más de 10 roles ejercidos en proyectos reales, investigación y producción:'
              : 'More than 10 professional roles executed across real projects, R&D and production:'}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-[var(--color-bg-alt)]/60 border border-[var(--color-border)]">
          {(
            [
              { key: 'all', label: { es: 'Todos (11)', en: 'All (11)' } },
              { key: 'core', label: { es: 'Desarrollo', en: 'Development' } },
              { key: 'ai', label: { es: 'IA & Modelos', en: 'AI & Models' } },
              { key: 'security', label: { es: 'Seguridad & Infra', en: 'Security & Infra' } },
              { key: 'strategy', label: { es: 'Arquitectura', en: 'Architecture' } },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveFilter(f.key)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-mono transition-all duration-300',
                activeFilter === f.key
                  ? 'bg-[var(--color-accent)] text-white shadow-sm'
                  : 'text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:bg-white/5',
              )}
            >
              {f.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of roles + interactive detail drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Roles list / pills */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredRoles.map((role) => {
            const Icon = role.icon;
            const isSelected = role.id === selectedId;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedId(role.id)}
                className={cn(
                  'group relative flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-300 overflow-hidden',
                  isSelected
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 shadow-[0_0_20px_rgba(255,107,53,0.15)] ring-1 ring-[var(--color-accent)]/30'
                    : 'border-[var(--color-border)] bg-[var(--color-bg-alt)]/40 hover:border-[var(--color-border-hover,#555)] hover:bg-[var(--color-bg-alt)]',
                )}
              >
                {/* Glow pill behind */}
                <div
                  className={cn(
                    'absolute -right-8 -top-8 size-20 rounded-full blur-xl pointer-events-none transition-opacity duration-300',
                    isSelected ? 'bg-[var(--color-accent)]/20 opacity-100' : 'opacity-0 group-hover:opacity-30 bg-white/10',
                  )}
                />

                <div
                  className={cn(
                    'size-9 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-300',
                    isSelected
                      ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                      : 'bg-white/5 text-[var(--color-text-dim)] border-[var(--color-border)] group-hover:text-[var(--color-accent)] group-hover:border-[var(--color-accent)]/40',
                  )}
                >
                  <Icon size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-mono text-[var(--color-accent)] truncate">
                      {role.badge[lang]}
                    </span>
                    <ChevronRight
                      size={14}
                      className={cn(
                        'shrink-0 transition-transform duration-300',
                        isSelected
                          ? 'translate-x-0.5 text-[var(--color-accent)]'
                          : 'opacity-0 group-hover:opacity-100 text-[var(--color-text-dim)]',
                      )}
                    />
                  </div>
                  <h4 className="font-serif text-sm font-medium leading-snug tracking-tight text-[var(--color-text)] truncate mt-0.5">
                    {role.title[lang]}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected role detailed view panel */}
        <div className="lg:col-span-5 relative rounded-2xl border border-[var(--color-accent)]/40 bg-[var(--color-bg-alt)]/90 p-6 backdrop-blur-md shadow-2xl overflow-hidden transition-all duration-300">
          <div className="absolute top-0 right-0 size-48 bg-[var(--color-accent)]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 rounded-xl bg-[var(--color-accent)] text-white flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/20">
              <SelectedIcon size={24} />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-accent)]">
                {selectedRole.badge[lang]}
              </span>
              <h3 className="font-serif text-xl font-medium tracking-tight text-[var(--color-text)]">
                {selectedRole.title[lang]}
              </h3>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-[var(--color-text-dim)] mb-5">
            {selectedRole.description[lang]}
          </p>

          <div className="mb-5 rounded-xl border border-[var(--color-border)] bg-black/20 p-3.5">
            <span className="block text-[11px] font-mono uppercase tracking-wider text-[var(--color-accent)] mb-1">
              {lang === 'es' ? 'Logro / Enfoque Clave' : 'Key Focus & Achievement'}
            </span>
            <p className="text-xs text-[var(--color-text)] leading-normal font-medium">
              {selectedRole.highlight[lang]}
            </p>
          </div>

          <div>
            <span className="block text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-dim)] mb-2">
              {lang === 'es' ? 'Stack & Herramientas Dominadas' : 'Mastered Stack & Tooling'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedRole.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-[var(--color-border)] bg-white/5 px-2.5 py-1 font-mono text-[11px] text-[var(--color-text)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
