'use client';

import { useRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { useMagnetic } from '@/components/effects/useMagnetic';
import { cn } from '@/lib/cn';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  strength?: number;
  children: ReactNode;
};

export function MagneticLink({ strength = 0.3, className, children, ...rest }: Props) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  useMagnetic(ref, strength);
  return (
    <a ref={ref} className={cn('inline-block magnetic', className)} {...rest}>
      {children}
    </a>
  );
}
