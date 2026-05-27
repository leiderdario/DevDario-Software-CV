import type { CurrentlyItem } from '../types';

export const CURRENTLY: CurrentlyItem[] = [
  {
    id: 'listening',
    icon: 'music',
    label: { es: 'Escuchando', en: 'Listening to' },
    value: 'Bonobo · Cirrus',
  },
  {
    id: 'reading',
    icon: 'book',
    label: { es: 'Leyendo', en: 'Reading' },
    value: 'Designing Data-Intensive Applications · Kleppmann',
  },
  {
    id: 'building',
    icon: 'wrench',
    label: { es: 'Construyendo', en: 'Building' },
    value: 'Plataforma turística Mahates · v0.7',
  },
  {
    id: 'location',
    icon: 'pin',
    label: { es: 'Ubicación', en: 'Location' },
    value: 'Cartagena, Colombia · GMT-5',
  },
];
