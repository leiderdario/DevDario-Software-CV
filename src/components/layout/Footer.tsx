'use client';

import { useRef } from 'react';
import {
  Github,
  Linkedin,
  Instagram,
  Twitter,
  Calendar,
  Download,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { CONTACT_EMAIL, CONTACT_PHONE, CV_PDF_HREF } from '@/lib/data/nav';
import { useMagnetic } from '@/components/effects/useMagnetic';

const SOCIALS = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/leiderdario', Icon: Github },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/', Icon: Linkedin },
  { id: 'instagram', label: 'Instagram', href: '#', Icon: Instagram },
  { id: 'x', label: 'X', href: '#', Icon: Twitter },
];

export function Footer() {
  const { lang, t } = useTranslation();
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  useMagnetic(ctaRef, 0.35);

  return (
    <footer
      data-section="footer"
      data-bg="#ece9e2"
      className="bg-[#ece9e2] text-[#161512]"
    >
      <div className="container-x flex flex-col items-center pb-12 pt-24 text-center md:pt-32">
        <h2 className="mx-auto max-w-[22ch] font-medium tracking-[-0.03em] text-[clamp(48px,8vw,128px)] leading-[0.95]">
          {t('footer.cta.headline')}
        </h2>

        <a
          ref={ctaRef}
          href={`mailto:${CONTACT_EMAIL}`}
          data-cursor="open"
          className="magnetic mt-12 inline-flex items-center gap-3 rounded-full bg-[#161512] px-8 py-4 text-sm font-medium text-[#ece9e2] transition-colors hover:bg-[var(--color-accent)] md:text-base"
        >
          <Calendar size={16} />
          {t('footer.cta.button')}
        </a>

        <a
          href={CV_PDF_HREF}
          download
          data-cursor="open"
          className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#5b574e] transition-colors hover:text-[#161512]"
        >
          <Download size={12} />
          {t('footer.cta.cv')}
        </a>
      </div>

      <div className="container-x grid grid-cols-1 items-center gap-8 border-t border-black/10 py-8 md:grid-cols-3">
        <ul className="flex items-center justify-center gap-5 md:justify-start">
          {SOCIALS.map(({ id, label, href, Icon }) => (
            <li key={id}>
              <a
                href={href}
                aria-label={label}
                data-cursor="open"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#5b574e] transition-colors hover:bg-[#161512] hover:text-[#ece9e2]"
              >
                <Icon size={16} />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center gap-1 text-center">
          <span className="font-serif text-lg leading-none tracking-tight">
            Leider Dario
          </span>
          <span className="text-xs uppercase tracking-[0.18em] text-[#5b574e]">
            {t('footer.role')}
          </span>
        </div>

        <ul className="flex items-center justify-center gap-6 text-sm md:justify-end">
          <li>
            <a href="#work" data-cursor="open" className="transition-colors hover:text-[var(--color-accent)]">
              {lang === 'es' ? 'Proyectos' : 'Work'}
            </a>
          </li>
          <li>
            <a href="#about" data-cursor="open" className="transition-colors hover:text-[var(--color-accent)]">
              {lang === 'es' ? 'Sobre mí' : 'About'}
            </a>
          </li>
          <li>
            <a href="#contact" data-cursor="open" className="transition-colors hover:text-[var(--color-accent)]">
              {lang === 'es' ? 'Contacto' : 'Contact'}
            </a>
          </li>
        </ul>
      </div>

      <div className="container-x grid grid-cols-1 gap-3 border-t border-black/10 py-6 text-xs text-[#5b574e] md:grid-cols-3 md:items-center">
        <span className="md:text-left">
          © {new Date().getFullYear()} Leider Dario Bolaño Agámez ·{' '}
          <a href="/sitemap.xml" className="underline-offset-2 hover:underline">Site Map</a>
        </span>
        <span className="text-center">Medellín · Cartagena, Colombia</span>
        <span className="md:text-right">
          <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-[#161512]">{CONTACT_EMAIL}</a>
          {' · '}
          <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="transition-colors hover:text-[#161512]">{CONTACT_PHONE}</a>
        </span>
      </div>
    </footer>
  );
}
