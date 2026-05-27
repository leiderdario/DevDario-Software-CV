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
  metadataBase: new URL('https://leiderdario.com'),
  title: {
    default: 'Leider Dario Bolaño Agámez — Software Engineer & AI Developer',
    template: '%s · Leider Dario',
  },
  description:
    'Software engineer and AI developer from Colombia. Building serious, beautiful software for government, fintech, EdTech and platforms.',
  keywords: ['Leider Dario', 'Software Engineer', 'AI', 'Next.js', 'Colombia', '3DIGIT-ALL FACTORY'],
  authors: [{ name: 'Leider Dario Bolaño Agámez' }],
  openGraph: {
    title: 'Leider Dario Bolaño Agámez — Software Engineer & AI Developer',
    description:
      'Software engineer and AI developer from Colombia. Building serious, beautiful software for government, fintech, EdTech and platforms.',
    type: 'website',
    locale: 'es_CO',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leider Dario Bolaño Agámez',
    description: 'Software Engineer & AI Developer.',
  },
  icons: {
    icon: '/favicon.ico',
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
