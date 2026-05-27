import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center">
      <div className="container-x">
        <p className="eyebrow mb-3">404</p>
        <h1 className="mb-6 font-serif text-[clamp(56px,10vw,160px)] leading-[0.95]">
          Ruta no encontrada.
        </h1>
        <p className="mb-10 max-w-prose text-[18px] text-[var(--color-text-dim)]">
          La página que buscas no existe o fue movida. Volvamos al inicio.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm text-white"
        >
          ← Volver al inicio
        </Link>
      </div>
    </section>
  );
}
