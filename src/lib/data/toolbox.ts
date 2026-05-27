import type { ToolGroup } from '../types';

export const TOOLBOX: ToolGroup[] = [
  {
    id: 'languages',
    title: { es: 'Lenguajes', en: 'Languages' },
    tools: ['Python', 'TypeScript', 'C++', 'Java', 'PHP', 'SQL'],
  },
  {
    id: 'ai-ml',
    title: { es: 'IA / ML', en: 'AI / ML' },
    tools: ['TensorFlow', 'PyTorch', 'OpenCV', 'Hugging Face', 'scikit-learn', 'K-Means'],
  },
  {
    id: 'web',
    title: { es: 'Web', en: 'Web' },
    tools: ['Next.js', 'React', 'Node', 'Express', 'FastAPI'],
  },
  {
    id: 'data-infra',
    title: { es: 'Datos & Infra', en: 'Data & Infra' },
    tools: ['MySQL', 'SQL Server', 'MongoDB', 'Docker', 'Git', 'Linux'],
  },
];
