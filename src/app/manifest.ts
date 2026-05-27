import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Leider Dario Bolaño Agámez',
    short_name: 'Leider Dario',
    description: 'Software Engineer & AI Developer.',
    start_url: '/',
    display: 'standalone',
    background_color: '#131313',
    theme_color: '#131313',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
