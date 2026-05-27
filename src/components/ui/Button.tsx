'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'ghost' | 'outline';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  asChild?: boolean;
  children: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', className, children, ...rest },
  ref,
) {
  const base =
    'inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300';
  const variants: Record<Variant, string> = {
    primary: 'bg-[var(--color-text)] text-[var(--color-bg)] hover:bg-[var(--color-accent)]',
    ghost: 'text-[var(--color-text)] hover:text-[var(--color-accent)]',
    outline:
      'border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]',
  };
  return (
    <button ref={ref} className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
});
