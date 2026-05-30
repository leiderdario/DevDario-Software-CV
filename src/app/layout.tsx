import type { Metadata, Viewport } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import './globals.css';
import '../styles/themes.css';
import { I18nProvider } from '@/components/providers/I18nProvider';
import { GsapProvider } from '@/components/providers/GsapProvider';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { Cursor } from '@/components/ui/Cursor';
import { Preloader } from '@/components/layout/Preloader';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { SectionBgFader } from '@/components/effects/SectionBgFader';
import { ScrollFX } from '@/components/effects/ScrollFX';
import { PageTransition } from '@/components/effects/PageTransition';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_URL, SITE_DESCRIPTION, personJsonLd, websiteJsonLd } from '@/lib/data/seo';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const instrument = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Leider Dario Bolaño Agámez — Software Engineer & AI Developer',
    template: '%s · Leider Dario',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'Leider Dario',
    'Leider Dario Bolaño Agámez',
    'Software Engineer',
    'Full Stack Developer',
    'AI Engineer',
    'AI Developer',
    'LangChain',
    'LangGraph',
    'Python',
    'TypeScript',
    'Next.js',
    'React',
    'Node.js',
    'Colombia',
    'Cartagena',
    'Medellín',
  ],
  authors: [{ name: 'Leider Dario Bolaño Agámez', url: SITE_URL }],
  creator: 'Leider Dario Bolaño Agámez',
  publisher: 'Leider Dario Bolaño Agámez',
  category: 'technology',
  openGraph: {
    title: 'Leider Dario Bolaño Agámez — Full Stack Developer & AI Engineer',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: 'Leider Dario Bolaño Agámez',
    type: 'website',
    locale: 'es_CO',
    alternateLocale: 'en_US',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Leider Dario Bolaño Agámez — Software Engineer & AI Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leider Dario Bolaño Agámez',
    description: 'Full Stack Developer · AI Engineer · Software Engineer.',
    images: ['/opengraph-image'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#131313',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${instrument.variable}`}>
      <body className="grain bg-[var(--color-bg)] text-[var(--color-text)] antialiased">
        <JsonLd data={[personJsonLd(), websiteJsonLd()]} />
        <I18nProvider>
          <GsapProvider>
            <LenisProvider>
              <Preloader />
              <Cursor />
              <Nav />
              <main>{children}</main>
              <Footer />
              <SectionBgFader />
              <ScrollFX />
              <PageTransition />
            </LenisProvider>
          </GsapProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
