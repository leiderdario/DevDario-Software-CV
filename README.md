# Leider Dario Bolaño Agámez — Portfolio (Next.js 15)

Production-grade portfolio built with Next.js 15 App Router, React 19, Tailwind v4, GSAP 3.13 + Lenis, TypeScript strict and bilingual ES/EN content.

## Stack

- **Next.js 15** (App Router · RSC · Server Actions)
- **React 19**
- **TypeScript 5.x** strict
- **Tailwind CSS v4** (`@import "tailwindcss"`)
- **GSAP 3.13** (+ ScrollTrigger · SplitText · CustomEase · Draggable · InertiaPlugin · Flip — all free since May 2024)
- **Lenis 1.1.x** for smooth scroll
- **Framer Motion 11**, **lucide-react**, **clsx + tailwind-merge**

## Get started

```bash
cd C:\Users\xBenedictox\Desktop\Personal\Cv\CV_LeiderD\CV_LeiderD\leider-cv-next
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command            | Purpose                          |
| ------------------ | -------------------------------- |
| `npm run dev`      | Dev server with Turbopack        |
| `npm run build`    | Production build                 |
| `npm start`        | Serve production build           |
| `npm run lint`     | ESLint (next/core-web-vitals)    |
| `npm run type-check` | TypeScript check               |
| `npm run format`   | Prettier write                   |

## Deploy on Vercel

Option A — CLI:

```bash
npx vercel
```

Option B — Dashboard:

1. Push the repo to GitHub.
2. Import the repository at https://vercel.com/new.
3. Framework auto-detects as Next.js. No env vars required. Click **Deploy**.

## Project layout

```
src/
  app/                 → App Router (layout, page, OG image, manifest)
  components/
    providers/         → I18n · GSAP plugins · Lenis smooth scroll
    layout/            → Preloader · Nav · Footer
    sections/          → Hero, Services, Work, Testimonials, …
    ui/                → ProjectCard, ServiceLine, Cursor, Marquee, …
    effects/           → useGsap, useMagnetic, useReducedMotion, SectionBgFader
  lib/
    data/              → typed data sources (projects, services, …)
    i18n/              → dictionary (≈120 keys) + useTranslation hook
    types.ts
public/
  assets/              → profile + portfolio images
```

## Content

All copy is bilingual (ES/EN). The language toggle persists in `localStorage` under `leider.lang`.

## License

Code: MIT. Portrait, content and brand belong to Leider Dario Bolaño Agámez.
