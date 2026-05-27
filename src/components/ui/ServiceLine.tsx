'use client';

import { useRef } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useMagnetic } from '@/components/effects/useMagnetic';
import type { Service } from '@/lib/types';

type Props = {
  service: Service;
  index: number;
};

export function ServiceLine({ service, index }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  useMagnetic(ref, 0.1);
  const { lang } = useTranslation();
  const label = service.label[lang];

  return (
    <div ref={ref} className="service-line group" data-cursor="open">
      <div className="container-x flex items-baseline gap-6">
        <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-text-dim)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="text-[var(--color-text-dim)] transition-colors duration-300 group-hover:text-[var(--color-accent)]">
          /
        </span>
        <span className="flex-1">{label}</span>
      </div>
    </div>
  );
}
