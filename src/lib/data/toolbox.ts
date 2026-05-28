import type { ToolGroup } from '../types';

export const TOOLBOX: ToolGroup[] = [
  {
    id: 'languages',
    title: { es: 'Lenguajes', en: 'Languages' },
    tools: ['Python', 'TypeScript', 'JavaScript', 'PHP', 'Ruby', 'Java', 'SQL', 'HTML/CSS'],
  },
  {
    id: 'frontend',
    title: { es: 'Frontend', en: 'Frontend' },
    tools: ['React', 'React Native', 'Next.js', 'Figma', 'Responsive', 'Accesible'],
  },
  {
    id: 'backend',
    title: { es: 'Backend & Datos', en: 'Backend & Data' },
    tools: ['Node.js', 'Firebase', 'REST APIs', 'PostgreSQL', 'MySQL', 'SQL'],
  },
  {
    id: 'ai',
    title: { es: 'IA & ML', en: 'AI & ML' },
    tools: [
      'LangChain',
      'LangGraph',
      'Agentes autónomos',
      'RAG',
      'Fine-tuning',
      'OpenAI API',
      'Anthropic API',
      'Prompt Engineering',
      'Machine Learning',
    ],
  },
  {
    id: 'devops',
    title: { es: 'DevOps & Cloud', en: 'DevOps & Cloud' },
    tools: ['Docker', 'Kubernetes', 'CI/CD', 'Git', 'GitHub'],
  },
  {
    id: 'automation',
    title: { es: 'Automatización', en: 'Automation' },
    tools: ['N8N', 'Web scraping', 'Orquestación de agentes'],
  },
  {
    id: 'cms',
    title: { es: 'CMS & No-Code', en: 'CMS & No-Code' },
    tools: ['Strapi', 'WordPress', 'Elementor', 'WPBakery'],
  },
];
