import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Leider Dario Bolaño Agámez — Software Engineer & AI Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 64,
          background: 'linear-gradient(135deg, #131313 0%, #1a1410 100%)',
          color: '#e2e1df',
          fontFamily: 'system-ui',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span
            style={{
              fontSize: 28,
              color: '#ff6b35',
              fontStyle: 'italic',
              fontFamily: 'Georgia, serif',
            }}
          >
            ✦ disponible para nuevos proyectos
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ fontSize: 88, lineHeight: 0.95, letterSpacing: '-0.03em' }}>
            Leider Dario
          </span>
          <span
            style={{
              fontSize: 88,
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              fontStyle: 'italic',
              color: '#ff6b35',
              fontFamily: 'Georgia, serif',
            }}
          >
            Bolaño Agámez.
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 22,
            color: '#8a8a87',
          }}
        >
          <span>Software Engineer & AI Developer</span>
          <span>Cartagena · COL</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
