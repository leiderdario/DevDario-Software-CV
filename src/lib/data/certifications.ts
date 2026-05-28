import type { BiText } from '../types';

export type Certification = {
  id: string;
  title: BiText;
  issuer: string;
  period: BiText;
  url?: string;
};

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'kmeans-google',
    title: {
      es: 'K-Means Unsupervised Clustering Algorithm with Python',
      en: 'K-Means Unsupervised Clustering Algorithm with Python',
    },
    issuer: 'Google',
    period: { es: 'Feb 2026', en: 'Feb 2026' },
  },
  {
    id: 'cyber-sena',
    title: {
      es: 'Mitigación y Prevención de Amenazas en Ciberseguridad',
      en: 'Cybersecurity Threat Mitigation & Prevention',
    },
    issuer: 'SENA',
    period: { es: 'Feb 2026', en: 'Feb 2026' },
  },
  {
    id: 'stanford-ai',
    title: { es: 'The AI Awakening', en: 'The AI Awakening' },
    issuer: 'Stanford University',
    period: { es: 'Jul — Ago 2025', en: 'Jul — Aug 2025' },
  },
  {
    id: 'langgraph',
    title: { es: 'Agents in LangGraph', en: 'Agents in LangGraph' },
    issuer: 'DeepLearning.AI',
    period: { es: 'May 2025', en: 'May 2025' },
  },
  {
    id: 'prompt-google',
    title: { es: 'Prompt Engineering', en: 'Prompt Engineering' },
    issuer: 'Google',
    period: { es: 'Jun — Jul 2025', en: 'Jun — Jul 2025' },
  },
  {
    id: 'voice-agents',
    title: {
      es: 'Building AI Voice Agents for Production',
      en: 'Building AI Voice Agents for Production',
    },
    issuer: 'DeepLearning.AI',
    period: { es: 'May — Jun 2025', en: 'May — Jun 2025' },
  },
  {
    id: 'sensorica',
    title: { es: 'Sensórica Industrial', en: 'Industrial Sensorics' },
    issuer: 'SENA',
    period: { es: 'May — Jun 2025', en: 'May — Jun 2025' },
  },
];
