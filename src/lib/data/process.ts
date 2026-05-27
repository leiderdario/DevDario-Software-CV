import type { ProcessStep } from '../types';

export const PROCESS: ProcessStep[] = [
  {
    id: 'listen',
    index: '01',
    title: { es: 'Escuchar', en: 'Listen' },
    body: {
      es: 'Entiendo el problema antes de tocar el editor. Una buena pregunta vale más que diez líneas inteligentes.',
      en: 'I understand the problem before I touch the editor. A good question beats ten clever lines.',
    },
  },
  {
    id: 'sketch',
    index: '02',
    title: { es: 'Bocetar', en: 'Sketch' },
    body: {
      es: 'Diagramas, pseudocódigo, un prototipo feo. La arquitectura primero, la elegancia después.',
      en: 'Diagrams, pseudocode, an ugly prototype. Architecture first, elegance later.',
    },
  },
  {
    id: 'ship',
    index: '03',
    title: { es: 'Enviar', en: 'Ship' },
    body: {
      es: 'Iteraciones cortas, deployment temprano. Si no está en producción, no existe.',
      en: "Short iterations, early deployment. If it's not in production, it doesn't exist.",
    },
  },
  {
    id: 'listen-again',
    index: '04',
    title: { es: 'Escuchar otra vez', en: 'Listen Again' },
    body: {
      es: 'Métricas, feedback, refactor. El producto vive del segundo round.',
      en: 'Metrics, feedback, refactor. The product lives on the second round.',
    },
  },
];
