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
    'Full Stack Developer, AI Engineer & Software Engineer based in Colombia. Python, TypeScript, LangChain, LangGraph, Next.js, Docker. International fellow at Universidad de Zaragoza.',
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
  authors: [{ name: 'Leider Dario Bolaño Agámez' }],
  openGraph: {
    title: 'Leider Dario Bolaño Agámez — Full Stack Developer & AI Engineer',
    description:
      'Full Stack Developer, AI Engineer & Software Engineer based in Colombia. Python, TypeScript, LangChain, LangGraph, Next.js, Docker. International fellow at Universidad de Zaragoza.',
    type: 'website',
    locale: 'es_CO',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leider Dario Bolaño Agámez',
    description: 'Full Stack Developer · AI Engineer · Software Engineer.',
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
