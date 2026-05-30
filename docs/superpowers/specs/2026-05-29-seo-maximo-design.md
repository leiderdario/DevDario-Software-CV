# SEO Máximo — Diseño

**Fecha:** 2026-05-29
**Proyecto:** leider-cv-next (portfolio/CV en Next.js 15, App Router)
**Dominio canónico:** `https://leiderdario.online`
**Autor:** Leider Darío Bolaño Agámez

## Objetivo

Llevar el SEO del sitio al máximo usando las convenciones nativas de Next.js 15
(Metadata API + file conventions + JSON-LD), sin dependencias nuevas. El sitio es
de una sola página principal (`/`) más páginas de detalle de proyecto
(`/work/[slug]`), con i18n por toggle en cliente (misma URL, ES principal — no se
usa `hreflang`).

## Decisiones tomadas

- **Dominio:** `leiderdario.online` es el canónico definitivo. El código actual
  apunta erróneamente a `leiderdario.com` — bug crítico a corregir.
- **Idiomas:** toggle en misma URL (client-side `I18nProvider`). No se generan
  rutas `/es` `/en` ni `hreflang`. ES es el idioma principal (`<html lang="es">`,
  `og:locale = es_CO`, `alternateLocale = en_US`).
- **Alcance:** máximo (todo lo listado abajo).
- **LinkedIn real:** `https://www.linkedin.com/in/leider-dario-bolaño-3d`
- **Iconos PWA:** se generan desde `public/logo.png` (1024×1024).
- **PDF del CV:** ya tiene metadatos en blanco (sin rastro de "Diego Hernandez
  Caraballo"); se incluye en el commit final tal como está.

## Enfoque elegido

**API nativa de Next.js 15 + convenciones de archivo.** Cero dependencias nuevas,
estándar oficial, type-safe, e integra con el `opengraph-image.tsx` dinámico que
ya existe. (Descartadas: `next-seo` por redundante con Pages Router en mente, y
tags `<head>` manuales por frágiles.)

## Componentes / Trabajo

### 1. Fix crítico de dominio
- En `src/app/layout.tsx`: cambiar `metadataBase` de
  `https://leiderdario.com` → `https://leiderdario.online`.
- Esto arregla en cascada: canónicas, OG e imágenes absolutas, sitemap.

### 2. `src/app/robots.ts` (nuevo)
Genera `/robots.txt`:
- `userAgent: '*'`, `allow: '/'`.
- `sitemap: 'https://leiderdario.online/sitemap.xml'`.
- `host` apuntando al dominio canónico.
- No hay rutas sensibles que bloquear.

### 3. `src/app/sitemap.ts` (nuevo)
Genera `/sitemap.xml` dinámico:
- Home `/` — `priority: 1.0`, `changeFrequency: 'monthly'`.
- Una entrada por cada proyecto con `detailHref` (`/work/[slug]`), derivado de
  `PROJECTS` en `src/lib/data/projects.ts` — `priority: 0.8`,
  `changeFrequency: 'monthly'`.
- `lastModified`: se pasa una fecha fija/estática (no usar `new Date()` en build
  determinista; usar una constante de fecha del proyecto).

### 4. Datos estructurados JSON-LD
- **`src/lib/data/seo.ts` (nuevo):** objetos JSON-LD tipados:
  - `Person`: name, jobTitle (Full Stack Developer / AI Engineer / Software
    Engineer), `url`, `image` (OG), `sameAs` (GitHub `leiderdario`, LinkedIn
    real), `knowsAbout` (skills: Python, TypeScript, LangChain, LangGraph,
    Next.js, React, Docker…), `alumniOf` (Universidad de Cartagena, Universidad
    de Zaragoza), `address` (Cartagena/Medellín, CO), y enlace al CV PDF
    (`/cv/Leider-Dario-CV.pdf`).
  - `WebSite`: name, url, `inLanguage: 'es'`, publisher → Person.
- **`src/components/seo/JsonLd.tsx` (nuevo):** componente server que renderiza
  `<script type="application/ld+json">` con `JSON.stringify`. Se monta en
  `layout.tsx` (Person + WebSite global).
- **BreadcrumbList** en páginas de proyecto: Home → Work → [Proyecto]. Generado
  en `work/[slug]/page.tsx` e inyectado vía el mismo componente.
- **Cada proyecto** como `CreativeWork` (o `SoftwareApplication` si aplica) en su
  página de detalle: name, description, url (demo), author → Person.

### 5. Canónicas (`alternates.canonical`)
- `layout.tsx` (home): canónica raíz.
- `work/[slug]/page.tsx`: canónica `/work/[slug]` en `generateMetadata`.

### 6. OG / Twitter completos
- `layout.tsx`: añadir a `twitter` → `images` (reusar el OG dinámico); a
  `openGraph` → `images` con `width: 1200, height: 630, alt`. `twitter.site`/
  `creator` si hay handle (omitir si no existe).
- `work/[slug]`: `og:image` por proyecto se resuelve absoluto vía `metadataBase`
  una vez corregido; añadir `alt`.

### 7. Manifest PWA completo (`src/app/manifest.ts`)
- Iconos reales: `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`
  (`purpose: 'maskable'`), generados desde `public/logo.png`.
- Añadir: `lang: 'es'`, `categories`, `dir: 'ltr'`, `orientation`.
- Iconos generados a `public/`:
  - `public/icon-192.png` (192×192)
  - `public/icon-512.png` (512×512)
  - `public/icon-maskable-512.png` (512×512, con padding seguro)
  - `public/apple-touch-icon.png` (180×180) — referenciado en `icons.apple` del
    metadata.
- Referenciar `apple-touch-icon` y los PNG en `metadata.icons` de `layout.tsx`.

### 8. Metadata por proyecto mejorada (`work/[slug]/page.tsx`)
- Canónica (ver §5).
- `keywords` derivadas de los `tags`/stack del proyecto.
- `authors: [{ name: 'Leider Darío Bolaño Agámez' }]`.
- BreadcrumbList + CreativeWork JSON-LD (ver §4).

### 9. Rendimiento / Core Web Vitals (alcance acotado)
Solo fixes seguros, sin reescribir animaciones GSAP/Lenis:
- Asegurar `next/image` con `priority` en la imagen LCP y `sizes` correctos.
- `preconnect`/`dns-prefetch` a orígenes de fuentes (Google Fonts ya optimizado
  por `next/font`, verificar que no haya `<link>` redundante).
- Verificar que el Preloader no bloquee el render del contenido indexable (el
  contenido debe estar en el DOM para el crawler aunque el preloader anime).
- Reportar (no necesariamente arreglar) cualquier problema mayor encontrado.

## Generación de iconos

Desde `public/logo.png` (1024×1024). Preferir Pillow (`PIL`) si está disponible
para redimensionar; si no, evaluar `sharp` (viene con Next) vía script Node, o
documentar el comando manual. El maskable lleva padding (~10%) para zona segura.

## Commit final

Un commit que incluya:
- Todo el código SEO nuevo/modificado.
- Los iconos PNG generados en `public/`.
- `public/logo.png` y `public/logo.ico` (actualmente untracked).
- El PDF actualizado `public/cv/Leider-Dario-CV.pdf` (metadatos en blanco).

**Excluir:** `prompt.md` (queda untracked, por decisión del usuario).
Luego `git push origin main`.

## Verificación

- `npm run build` debe pasar sin errores.
- Comprobar que se generan `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`.
- Validar JSON-LD (estructura correcta, sin campos vacíos rotos).
- Confirmar que `metadataBase` resuelve URLs absolutas a `leiderdario.online`.

## Fuera de alcance (YAGNI)

- Rutas separadas por idioma / `hreflang` (i18n es toggle en cliente).
- Reescritura de animaciones o del sistema de preloader.
- Analytics/GA4 (no solicitado).
- Blog u otras secciones nuevas.

## Notas / riesgos

- El LinkedIn contiene `ñ`; puede requerir codificación percent-encoded en
  contextos estrictos, pero se usará tal cual la dio el usuario.
- `lastModified` del sitemap debe ser una constante (entorno de build
  determinista, sin `new Date()`).
- Si Pillow/sharp no están disponibles, la generación de iconos puede requerir
  un paso manual — se resolverá en el plan de implementación.
