'use client';

import { useRef, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { gsap } from 'gsap';
import { ArrowUpRight, Check, Mail } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';
import { MaskReveal } from '@/components/ui/MaskReveal';
import { CONTACT_EMAIL, CV_PDF_HREF } from '@/lib/data/nav';
import { cn } from '@/lib/cn';

const FORMSPREE_ENDPOINT =
  process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || 'https://formspree.io/f/REPLACE_ME';
const IS_DEMO = FORMSPREE_ENDPOINT.includes('REPLACE_ME');

const CURRENCIES = ['USD', 'EUR', 'COP'] as const;
type Currency = (typeof CURRENCIES)[number];

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  budgetAmount: z
    .string()
    .optional()
    .refine((v) => !v || /^[\d.,\s]+$/.test(v), 'amount-format'),
  budgetCurrency: z.enum(CURRENCIES).optional(),
  message: z.string().min(20),
  _gotcha: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;
type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const { lang, t } = useTranslation();
  const [status, setStatus] = useState<Status>('idle');
  const formRef = useRef<HTMLFormElement | null>(null);
  const successRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { budgetCurrency: 'USD' },
  });

  const shake = () => {
    const el = formRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { x: 0 },
      {
        x: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
        keyframes: { x: [-12, 12, -8, 8, -4, 4, 0] },
      },
    );
  };

  const fadeOutForm = () => {
    const el = formRef.current;
    if (!el) return;
    gsap.to(el, { opacity: 0, y: -20, duration: 0.5, ease: 'expo.in' });
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (IS_DEMO) {
      window.alert(
        lang === 'es'
          ? 'Modo demo. Configura NEXT_PUBLIC_FORMSPREE_ENDPOINT en .env.local para enviar mensajes reales.'
          : 'Demo mode. Set NEXT_PUBLIC_FORMSPREE_ENDPOINT in .env.local to send real messages.',
      );
      return;
    }
    setStatus('submitting');
    try {
      const amount = values.budgetAmount?.replace(/[^\d]/g, '') ?? '';
      const payload = {
        name: values.name,
        email: values.email,
        company: values.company || '',
        budget: amount ? `${values.budgetCurrency} ${amount}` : 'A discutir',
        message: values.message,
        _subject: `[CV] ${values.name} — ${values.company || 'sin empresa'}`,
      };
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('formspree error');
      fadeOutForm();
      setTimeout(() => {
        setStatus('success');
        reset();
      }, 500);
    } catch {
      setStatus('error');
      shake();
      setTimeout(() => setStatus('idle'), 2500);
    }
  };

  const inputBase =
    'w-full border-0 border-b border-[var(--color-border)] bg-transparent px-0 py-3 text-base text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-accent)] disabled:opacity-50';
  const labelBase =
    'mb-2 block font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-dim)]';
  const errorBase = 'mt-1 text-xs text-red-400';

  return (
    <section
      id="contact"
      data-section="contact"
      data-bg="#131313"
      className="bg-[var(--color-bg)] py-[var(--section-pad-y,96px)]"
    >
      <div className="container-x">
        <p className="eyebrow mb-3">{t('contactForm.eyebrow')}</p>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <MaskReveal>
              <h2 className="font-medium leading-[1.0] tracking-tight text-[clamp(36px,5vw,72px)]">
                <SplitTextReveal as="span" type="lines" stagger={0.1} className="block">
                  {t('contactForm.title')}
                </SplitTextReveal>
              </h2>
            </MaskReveal>

            <p className="mt-6 max-w-prose text-[clamp(15px,1.1vw,18px)] leading-[1.6] text-[var(--color-text-dim)]">
              {t('contactForm.subline')}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                data-cursor="copy"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-3 text-sm transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                <Mail size={14} />
                {CONTACT_EMAIL}
              </a>
              <a
                href={CV_PDF_HREF}
                download
                data-cursor="open"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-3 text-sm transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                {t('contactForm.downloadCv')}
              </a>
            </div>

            {IS_DEMO && (
              <p className="mt-6 rounded-md border border-amber-500/40 bg-amber-500/5 px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-amber-300/90">
                {lang === 'es'
                  ? 'Modo demo · configura NEXT_PUBLIC_FORMSPREE_ENDPOINT'
                  : 'Demo mode · set NEXT_PUBLIC_FORMSPREE_ENDPOINT'}
              </p>
            )}
          </div>

          <div className="lg:col-span-7">
            {status === 'success' ? (
              <div ref={successRef}>
                <MaskReveal>
                  <div className="flex items-start gap-4 rounded-xl border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/5 p-6">
                    <Check className="mt-1 text-[var(--color-accent)]" size={22} />
                    <div>
                      <p className="font-serif text-xl">{t('contactForm.success')}</p>
                      <p className="mt-2 text-sm text-[var(--color-text-dim)]">
                        {CONTACT_EMAIL}
                      </p>
                    </div>
                  </div>
                </MaskReveal>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="flex flex-col gap-6"
              >
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                  {...register('_gotcha')}
                />

                <div>
                  <label htmlFor="cf-name" className={labelBase}>
                    {t('contactForm.field.name')}
                  </label>
                  <input
                    id="cf-name"
                    type="text"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'cf-name-err' : undefined}
                    disabled={status === 'submitting'}
                    className={cn(inputBase, errors.name && 'border-red-400')}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p id="cf-name-err" className={errorBase}>
                      {t('contactForm.error.name')}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="cf-email" className={labelBase}>
                    {t('contactForm.field.email')}
                  </label>
                  <input
                    id="cf-email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'cf-email-err' : undefined}
                    disabled={status === 'submitting'}
                    className={cn(inputBase, errors.email && 'border-red-400')}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p id="cf-email-err" className={errorBase}>
                      {t('contactForm.error.email')}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="cf-company" className={labelBase}>
                    {t('contactForm.field.company')}
                  </label>
                  <input
                    id="cf-company"
                    type="text"
                    autoComplete="organization"
                    disabled={status === 'submitting'}
                    className={inputBase}
                    {...register('company')}
                  />
                </div>

                <div>
                  <label htmlFor="cf-budget" className={labelBase}>
                    {t('contactForm.field.budget')}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="cf-budget"
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      disabled={status === 'submitting'}
                      className={cn(inputBase, 'flex-1')}
                      {...register('budgetAmount')}
                    />
                    <select
                      aria-label="currency"
                      disabled={status === 'submitting'}
                      className="border-0 border-b border-[var(--color-border)] bg-transparent px-2 py-3 font-mono text-xs uppercase tracking-wider text-[var(--color-text-dim)] outline-none focus:border-[var(--color-accent)]"
                      {...register('budgetCurrency')}
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c} className="bg-[var(--color-bg)]">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="cf-message" className={labelBase}>
                    {t('contactForm.field.message')}
                  </label>
                  <textarea
                    id="cf-message"
                    rows={5}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'cf-message-err' : undefined}
                    disabled={status === 'submitting'}
                    className={cn(inputBase, 'resize-none', errors.message && 'border-red-400')}
                    {...register('message')}
                  />
                  {errors.message && (
                    <p id="cf-message-err" className={errorBase}>
                      {t('contactForm.error.message')}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                  {status === 'error' && (
                    <p className="text-sm text-red-400">{t('contactForm.error')}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    data-cursor="open"
                    className="ml-auto inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-7 py-3 text-sm font-medium text-white transition-all hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] disabled:opacity-60"
                  >
                    {status === 'submitting'
                      ? t('contactForm.submitting')
                      : t('contactForm.submit')}
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
