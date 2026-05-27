'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

/**
 * Global scroll-driven choreography.
 * Every animation here is scrubbed against the scroll position so motion stays
 * continuous in both directions, giving the page an organic always-moving feel.
 */
export function ScrollFX() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const triggers: ScrollTrigger[] = [];
    const cleanups: Array<() => void> = [];

    const track = <T extends gsap.core.Tween | gsap.core.Timeline>(tw: T): T => {
      const st = (tw as gsap.core.Tween).scrollTrigger;
      if (st) triggers.push(st);
      return tw;
    };

    const setup = () => {
      /* 1 - Image mask-reveal + parallax on every img */
      document.querySelectorAll<HTMLElement>('img, picture, [data-mask-img]').forEach((el) => {
        if (el.dataset.skipFx === 'true') return;
        const rect = el.getBoundingClientRect();
        if (rect.width < 60 || rect.height < 60) return;
        gsap.set(el, { clipPath: 'inset(0 0 100% 0)', scale: 1.08, willChange: 'transform, clip-path' });
        track(gsap.to(el, {
          clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.1, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
        }));
        track(gsap.fromTo(el, { yPercent: -6 }, {
          yPercent: 6, ease: 'none',
          scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: 1.1 },
        }));
      });

      /* 2 - Heading reveals + overscan parallax */
      document.querySelectorAll<HTMLElement>('h2:not([data-no-fx]), h3:not([data-no-fx])').forEach((el) => {
        if (el.closest('[data-split-handled]')) return;
        if (el.dataset.fxApplied === 'true') return;
        el.dataset.fxApplied = 'true';
        gsap.set(el, { yPercent: 8, opacity: 0, willChange: 'transform, opacity' });
        track(gsap.to(el, {
          yPercent: 0, opacity: 1, duration: 1.0, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
        }));
        track(gsap.fromTo(el, { y: 0 }, {
          y: -40, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top+=80', end: 'bottom top', scrub: 1.4 },
        }));
      });

      /* 3 - Card stagger reveal */
      const cardGroups: Array<{ container: string; child: string }> = [
        { container: '#work, [data-section="work"], .work-grid', child: '.work-card, [data-work-card]' },
        { container: '#testimonials, .testimonials', child: '.testimonial-card, [data-testimonial]' },
        { container: '#toolbox, .toolbox', child: '[data-chip]' },
        { container: '#behind-the-scenes, .behind-the-scenes', child: '[data-polaroid]' },
        { container: '#archives, .archives-table', child: '[data-archive-row]' },
        { container: '#process, .process', child: '[data-process-card]' },
        { container: '#press, .press', child: '[data-press-item]' },
        { container: '#trusted, .trusted', child: '[data-wordmark]' },
      ];
      cardGroups.forEach(({ container, child }) => {
        document.querySelectorAll<HTMLElement>(container).forEach((root) => {
          const items = root.querySelectorAll<HTMLElement>(child);
          if (!items.length) return;
          gsap.set(items, { y: 64, opacity: 0, willChange: 'transform, opacity' });
          track(gsap.to(items, {
            y: 0, opacity: 1, duration: 0.9, ease: 'expo.out',
            stagger: { each: 0.08, from: 'start' },
            scrollTrigger: { trigger: root, start: 'top 80%', toggleActions: 'play none none reverse' },
          }));
        });
      });

      /* 4 - Polaroid zig-zag straighten */
      document.querySelectorAll<HTMLElement>('[data-polaroid]').forEach((el) => {
        const startRot = parseFloat(el.dataset.rotate ?? '0');
        if (!Number.isFinite(startRot) || startRot === 0) return;
        track(gsap.fromTo(el, { rotate: startRot, scale: 0.96 }, {
          rotate: 0, scale: 1, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'center center', scrub: 1.2 },
        }));
      });

      /* 5 - Project card image sub-parallax scale */
      document.querySelectorAll<HTMLElement>('.work-card, [data-work-card]').forEach((card) => {
        const img = card.querySelector<HTMLElement>('img, picture, [data-mockup]');
        if (!img) return;
        track(gsap.fromTo(img, { scale: 1 }, {
          scale: 1.08, ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.3 },
        }));
      });

      /* 6 - Section entrance + soft exit dim */
      document.querySelectorAll<HTMLElement>('section').forEach((sec) => {
        if (sec.dataset.fxSection === 'true') return;
        sec.dataset.fxSection = 'true';
        gsap.set(sec, { willChange: 'transform, opacity' });
        track(gsap.fromTo(sec, { y: 48, opacity: 0.001 }, {
          y: 0, opacity: 1, duration: 1.0, ease: 'expo.out',
          scrollTrigger: { trigger: sec, start: 'top 92%', toggleActions: 'play none none reverse' },
        }));
        if (sec.offsetHeight > window.innerHeight * 0.5) {
          track(gsap.fromTo(sec, { autoAlpha: 1 }, {
            autoAlpha: 0.55, ease: 'none',
            scrollTrigger: { trigger: sec, start: 'bottom 35%', end: 'bottom top', scrub: 1.5 },
          }));
        }
      });

      /* 7 - Hero text translate-out on scroll */
      const hero = document.querySelector<HTMLElement>('#top, #hero, section[data-section="hero"]');
      if (hero) {
        const h1 = hero.querySelector<HTMLElement>('h1');
        const lead = hero.querySelector<HTMLElement>('h1 + p, [data-hero-lead], p.lead');
        const tl = gsap.timeline({
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
        });
        if (h1) tl.to(h1, { y: -120, opacity: 0.0, ease: 'none' }, 0);
        if (lead) tl.to(lead, { y: -60, opacity: 0.2, ease: 'none' }, 0);
        if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
      }

      /* 8 - Background decor drift */
      document.querySelectorAll<HTMLElement>('[data-bg-decor]').forEach((el) => {
        const depth = parseFloat(el.dataset.depth ?? '1');
        const amp = 60 * depth;
        track(gsap.fromTo(el, { yPercent: -amp }, {
          yPercent: amp, ease: 'none',
          scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: 1.5 + depth * 0.5 },
        }));
      });

      /* 9 - Eyebrows opposite drift */
      document.querySelectorAll<HTMLElement>('.eyebrow, [data-eyebrow]').forEach((el) => {
        track(gsap.fromTo(el, { yPercent: 28, opacity: 0 }, {
          yPercent: -28, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
        }));
      });

      /* 10 - Marquee velocity reactivity is owned by Marquee.tsx (no-op here). */

      /* 11 - 3D tilt on project cards */
      const tiltCards = document.querySelectorAll<HTMLElement>('.work-card, [data-work-card]');
      tiltCards.forEach((card) => {
        const setRX = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' });
        const setRY = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' });
        const setZ = gsap.quickTo(card, 'translateZ', { duration: 0.6, ease: 'power3.out' });
        const onMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const cx = (e.clientX - r.left) / r.width - 0.5;
          const cy = (e.clientY - r.top) / r.height - 0.5;
          setRX(-cy * 4); setRY(cx * 4); setZ(8);
        };
        const onLeave = () => { setRX(0); setRY(0); setZ(0); };
        card.style.transformStyle = 'preserve-3d';
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
        cleanups.push(() => {
          card.removeEventListener('mousemove', onMove);
          card.removeEventListener('mouseleave', onLeave);
        });
      });

      /* 12 - Manifesto / Statement word-by-word scrub */
      document.querySelectorAll<HTMLElement>('[data-manifesto-line]').forEach((line) => {
        if (line.dataset.wordsWrapped !== 'true') {
          const text = line.textContent ?? '';
          line.textContent = '';
          const frag = document.createDocumentFragment();
          text.split(/(\s+)/).forEach((piece) => {
            if (!piece.trim()) { frag.appendChild(document.createTextNode(piece)); return; }
            const span = document.createElement('span');
            span.className = 'fx-word inline-block';
            span.textContent = piece;
            frag.appendChild(span);
          });
          line.appendChild(frag);
          line.dataset.wordsWrapped = 'true';
        }
        const words = line.querySelectorAll<HTMLElement>('.fx-word');
        if (!words.length) return;
        gsap.set(words, { opacity: 0.15 });
        track(gsap.to(words, {
          opacity: 1, ease: 'none', stagger: 0.5,
          scrollTrigger: { trigger: line, start: 'top 75%', end: 'bottom 50%', scrub: 0.8 },
        }));
      });

      /* 13 - Section title letter-spacing settle */
      document.querySelectorAll<HTMLElement>('section h2').forEach((h2) => {
        if (h2.dataset.fxScale === 'true') return;
        h2.dataset.fxScale = 'true';
        track(gsap.fromTo(h2, { letterSpacing: '-0.04em' }, {
          letterSpacing: '-0.02em', ease: 'none',
          scrollTrigger: { trigger: h2, start: 'top 90%', end: 'bottom top', scrub: 1.6 },
        }));
      });

      ScrollTrigger.refresh();
    };

    const id = window.setTimeout(setup, 400);
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      window.clearTimeout(id);
      window.removeEventListener('resize', onResize);
      triggers.forEach((t) => t.kill());
      cleanups.forEach((c) => c());
    };
  }, [reduced]);

  return null;
}
