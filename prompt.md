# Prompt para Claude Code — Pase 3: Contact form en lugar de Contact section + FreeDomain leiderdario.us.kg

Pega esto en Claude Code, parado en la raíz de `leider-cv-next/`. Trae mediciones reales del navegador después de tu pase 2 y resuelve dos cosas pendientes que el usuario marcó como prioritarias.

---

## Estado verificado tras tu pase 2 (medido en navegador, no estimado)

```
Page height total: 23,722 px  (baseline 33,594 → −9,872 px, −29%)
Viewport:           901 px
Ratio scroll:       26.33x viewport  (divyansh ≈ 19x)
```

Por sección (px de alto):

```
top (hero):       1,059    ✅ con foto profile.jpg al 100% opacity, layout 2-col
services:         1,520
trusted:            629
work:             9,849    ⚠️ aún muy alto (baseline 10,446, esperabas ~3,800)
statement:          720
about:              926
experience:       1,295
achievements:       861
education:        1,117
certifications:     697
toolbox:            717
testimonials:     1,317
studio:             485
contact:          1,654    ❌ USUARIO QUIERE BORRARLA COMPLETAMENTE
footer:             875
```

Conclusiones que aplican a este pase:
- **Contact** (1,654 px) **desaparece**. En su lugar va el form que ya tenías brainstormeado (Enfoque B).
- **Work** sigue inflado. Aplicar la compresión que faltó del pase anterior.

---

## Tarea A — Borrar Contact section + implementar Contact Form

### A.1 Borrar `src/components/sections/Contact.tsx`

Quitar el archivo completo. Quitar su import + uso de `src/app/page.tsx`. El layout queda:

```tsx
// page.tsx final
<Hero />
<Services />
<TrustedBy />
<Work />
<div className="relative"><Statement /><About /></div>
<Experience />
<Achievements />
<Education />
<Certifications />
<Toolbox />
<Testimonials />
<Studio />
<ContactForm />       {/* nuevo componente, ocupa el slot de Contact */}
```

### A.2 Crear `src/components/sections/ContactForm.tsx`

Sigue el Enfoque B que ya tenías diseñado:

- **Stack**: `react-hook-form` + `zod` + `@hookform/resolvers/zod` + `fetch` AJAX a Formspree (modo JSON)
- **Layout**: 2 columnas en desktop (texto/headline a la izquierda · form a la derecha), 1 columna mobile
- **Campos** (los 5 que ya decidiste):
  1. `name` — text, required, min 2
  2. `email` — email, required, valid format
  3. `company` — text, opcional
  4. `budget` — compound input: número + select de moneda (USD/EUR/COP). Opcional.
  5. `message` — textarea, required, min 20
  6. Honeypot field `_gotcha` invisible (con `tabindex="-1"`, `autocomplete="off"`, `aria-hidden`)
- **Inputs estilo "underlined editorial"**: sin box, solo border-bottom, focus border-bottom accent, labels arriba en mono uppercase pequeño, sin background
- **Estados animados con GSAP** siguiendo el lenguaje del sitio:
  - `idle` — form normal
  - `submitting` — botón con dots animados, inputs deshabilitados
  - `success` — MaskReveal sobre un mensaje "Recibido — te respondo en 24h", form fade-out
  - `error` — shake horizontal del form, mensaje de error
- **i18n ES/EN** completo via dictionary
- **Accesibilidad**: `<label htmlFor>`, `aria-invalid`, `aria-describedby` para errores
- **id de la sección**: `id="contact"` `data-section="contact"` para que el link del nav siga funcionando

### A.3 Endpoint Formspree

Necesito que el usuario me dé el endpoint Formspree antes de pegar este prompt. Mientras tanto, **deja un constante placeholder** y un README en el componente:

```tsx
// ContactForm.tsx
// TODO(leider): replace with real Formspree endpoint from formspree.io dashboard.
const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || 'https://formspree.io/f/REPLACE_ME';
```

Y agrega a `.env.local.example`:

```
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxxxx
```

### A.4 Borrar claves obsoletas del diccionario

En `src/lib/i18n/dictionary.ts` quitar todas las `contact.*` actuales (`contact.eyebrow`, `contact.title.*`, `contact.subline`, `contact.copy`, `contact.copied`, `contact.write`, `contact.downloadCv`) porque el form usa claves nuevas. Crear el nuevo bloque `contactForm.*`:

```ts
'contactForm.eyebrow':   { es: 'Hablemos', en: "Let's talk" },
'contactForm.title':     { es: 'Cuéntame sobre tu proyecto.', en: 'Tell me about your project.' },
'contactForm.subline':   { es: 'Respondo en 24 horas hábiles. Si prefieres email directo: leiderddario@gmail.com', en: 'I reply within 24 business hours. Prefer direct email: leiderddario@gmail.com' },
'contactForm.field.name':    { es: 'Nombre', en: 'Name' },
'contactForm.field.email':   { es: 'Correo', en: 'Email' },
'contactForm.field.company': { es: 'Empresa (opcional)', en: 'Company (optional)' },
'contactForm.field.budget':  { es: 'Presupuesto (opcional)', en: 'Budget (optional)' },
'contactForm.field.message': { es: 'Cuéntame qué necesitas', en: 'Tell me what you need' },
'contactForm.submit':        { es: 'Enviar mensaje', en: 'Send message' },
'contactForm.submitting':    { es: 'Enviando…', en: 'Sending…' },
'contactForm.success':       { es: 'Recibido. Te respondo en 24h.', en: 'Got it. I will reply in 24h.' },
'contactForm.error':         { es: 'Algo falló. Intenta de nuevo o escríbeme directo.', en: 'Something failed. Try again or email me directly.' },
'contactForm.error.name':    { es: 'Dime cómo te llamas.', en: 'I need your name.' },
'contactForm.error.email':   { es: 'Necesito un correo válido para responderte.', en: 'I need a valid email to reply.' },
'contactForm.error.message': { es: 'Cuéntame un poco más (mínimo 20 caracteres).', en: 'Tell me a bit more (at least 20 characters).' },
```

### A.5 Mockup ASCII del nuevo ContactForm (apruébalo conmigo antes de codear)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ [eyebrow ital] Hablemos                                                        │
│                                                                                │
│ ┌───────────────────────────────────┬─────────────────────────────────────────┐│
│ │ Cuéntame sobre tu                 │ NOMBRE                                   ││
│ │ proyecto.                         │ ___________________________              ││
│ │ (h2 display, serif italic acc)    │                                          ││
│ │                                   │ CORREO                                   ││
│ │ Respondo en 24h hábiles.          │ ___________________________              ││
│ │ Si prefieres email directo:       │                                          ││
│ │ leiderddario@gmail.com            │ EMPRESA (opcional)                       ││
│ │                                   │ ___________________________              ││
│ │ [Cal.com pill button - opcional]  │                                          ││
│ │                                   │ PRESUPUESTO (opcional)                   ││
│ │                                   │ ____________ [USD ▾]                     ││
│ │                                   │                                          ││
│ │                                   │ CUÉNTAME QUÉ NECESITAS                   ││
│ │                                   │ ┌─────────────────────────────────┐      ││
│ │                                   │ │                                 │      ││
│ │                                   │ │                                 │      ││
│ │                                   │ │                                 │      ││
│ │                                   │ └─────────────────────────────────┘      ││
│ │                                   │                                          ││
│ │                                   │ [   ENVIAR MENSAJE  →   ]                ││
│ └───────────────────────────────────┴─────────────────────────────────────────┘│
│                                                                                │
│ Footer (separado, ya existe en layout.tsx)                                     │
└────────────────────────────────────────────────────────────────────────────────┘
```

Subir mockup a chat, esperar OK del usuario antes de implementar.

---

## Tarea B — Comprimir Work definitivamente (9,849 → ≤ 3,500 px)

El pase 2 dejó Work casi sin tocar. Necesitamos volver al `ProjectCard` y reducirlo de verdad.

**Diagnóstico esperado** (verifícalo en `src/components/sections/Work.tsx` y `src/components/ui/ProjectCard.tsx`):

- ¿Las cards `featured` están usando `md:col-span-2` con `aspect-[16/9]`? Cuando un card es 100% del ancho y aspecto 16/9 al doble de ancho, su altura crece muchísimo. Cap a `md:col-span-2` solo si la imagen lo aporta visualmente; si no, **eliminar el flag featured** y dejar todas las cards `md:col-span-1` con `aspect-[4/3]`.
- Aplica `max-h-[420px] object-cover` para evitar que las imágenes verticales empujen alturas.
- Reduce el bloque de tags interno: padding `pb-5 → pb-3`, line-height `leading-snug`, max 4 tags visibles (resto colapsa o se oculta).
- El padding interno `p-5` está ok, pero el wrapper de cada card podría tener `min-h-[280px]` si quieres uniformidad visual.

**Test cuantitativo** después del cambio: con 6 proyectos en 2 cols el grid debería medir aprox `3 filas × (280 + 24 gap) ≈ 900 px` + headline 250 + padding 200 ≈ **1,350 px**. Si te quedas en >3,000 px hay algo mal.

---

## Tarea C — Subdominio gratis `leiderdario.us.kg` vía FreeDomain

Contexto: el usuario quiere usar `https://github.com/DigitalPlatDev/FreeDomain.git` para reclamar un subdominio gratis tipo `leiderdario.us.kg` (o el que esté libre) y apuntarlo a Vercel.

**Flujo** (sigue el README oficial del repo, NO inventes pasos):

1. Visita https://github.com/DigitalPlatDev/FreeDomain
2. Lee su README.md para el formato exacto del JSON que pide. Históricamente es algo como:

```json
{
  "owner": {
    "username": "leiderdario",
    "email": "leiderddario@gmail.com"
  },
  "record": {
    "CNAME": "cname.vercel-dns.com",
    "A": ["76.76.21.21"]
  }
}
```

Pero **NO asumas** los valores — confírmalos contra el README actual.

3. Genera un archivo `domains/leiderdario.json` (o el path que el repo indique) con:
   - Subdominio deseado: `leiderdario` (fallback: `leiderdariobolano`, `lcv`, `leider`, ver disponibilidad)
   - Tipo de dominio padre disponible (`.us.kg`, `.is-a.dev`, etc. — el repo soporta varios)
   - Target: `cname.vercel-dns.com` para Vercel (verificar en docs de Vercel actuales)
   - Email del owner: `leiderddario@gmail.com`

4. Output esperado del prompt:
   - **NO hacer fork/PR automáticamente**: yo (Claude Code) genero el archivo en `outputs/freedomain-leiderdario.json`
   - Le doy al usuario los **pasos exactos** que debe seguir manualmente: forkear el repo, copiar mi JSON a la ruta correcta, abrir PR con descripción autogenerada
   - Le entrego también los pasos en Vercel para conectar el dominio cuando el PR sea mergeado

5. Si el README de FreeDomain pide cosas adicionales (Discord verification, captcha, owner GitHub username confirmed) — listámelo en el chat, no inventes.

---

## Tarea D — Verificación final

Después de A + B + C corre:

```bash
npm run type-check && npm run lint && npm run build
```

Y en el browser (consola), pega:

```js
copy(document.body.scrollHeight + 'px / ' + document.querySelectorAll('[data-section]').length + ' secciones / hero ' + document.querySelector('#top').offsetHeight + 'px / work ' + document.querySelector('#work').offsetHeight + 'px / contact ' + document.querySelector('#contact').offsetHeight + 'px')
```

Espero ver:

- Page height: ≤ 14,500 px
- Secciones: 13 (incluyendo el nuevo ContactForm)
- Work: ≤ 3,500 px
- Contact: ≤ 1,000 px (form 2-col compacto)

---

## Reglas de trabajo

1. **NO toques** los archivos de datos del PDF: `experience.ts`, `education.ts`, `achievements.ts`, `certifications.ts`, `toolbox.ts`.
2. Mockup ASCII del form ANTES de codear, espera OK.
3. Para FreeDomain, lee el README real del repo. Cero invención.
4. Reporta al final con: nuevas mediciones de px, lista de archivos creados/borrados, instrucciones FreeDomain paso a paso, endpoint Formspree pendiente de configurar.
5. Si Formspree no está configurado aún, deja el form funcional pero con estado "demo" claramente marcado (botón que muestra `alert` "configurar FORMSPREE_ENDPOINT en .env.local").