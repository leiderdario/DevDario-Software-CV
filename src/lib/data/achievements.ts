import type { BiText } from '../types';

export type Achievement = {
  id: string;
  index: string;
  label: BiText;
  title: BiText;
  meta: BiText;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'unizar-pasantia',
    index: '01',
    label: { es: 'Pasantía Internacional', en: 'International Internship' },
    title: {
      es: 'Universidad de Zaragoza — Proyecto ALIRA',
      en: 'Universidad de Zaragoza — ALIRA Project',
    },
    meta: {
      es: 'IA de detección de emociones por análisis biométrico en tiempo real · Oct 2025',
      en: 'Emotion-detection AI with real-time biometric analysis · Oct 2025',
    },
  },
  {
    id: 'ponente-zaragoza',
    index: '02',
    label: { es: 'Ponente', en: 'Speaker' },
    title: {
      es: 'Simposio Internacional de IA Generativa',
      en: 'International Symposium on Generative AI',
    },
    meta: { es: 'Zaragoza, España · 2025', en: 'Zaragoza, Spain · 2025' },
  },
  {
    id: 'primer-lugar-bolivar',
    index: '03',
    label: { es: '1.º Lugar', en: '1st Place' },
    title: {
      es: 'Feria de Innovación y Tecnología — Universidad de Cartagena',
      en: 'Innovation & Technology Fair — Universidad de Cartagena',
    },
    meta: {
      es: 'Por el proyecto UNIA-Emotion · Bolívar · Mayo 2026',
      en: 'For the UNIA-Emotion project · Bolívar · May 2026',
    },
  },
  {
    id: 'segundo-mompox',
    index: '04',
    label: { es: '2.º Lugar', en: '2nd Place' },
    title: {
      es: 'III Seminario de Investigación · Universidad de Cartagena',
      en: 'Third Research Seminar · Universidad de Cartagena',
    },
    meta: { es: 'Mompox · 2025', en: 'Mompox · 2025' },
  },
];
