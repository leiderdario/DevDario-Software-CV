'use client';

import { useRef, useCallback, useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { cn } from '@/lib/cn';

type Props = {
  colorSrc: string | StaticImageData;
  bwSrc: string | StaticImageData;
  alt: string;
  radius?: number;
  priority?: boolean;
  className?: string;
};

export function HeroPhotoReveal({
  colorSrc,
  bwSrc,
  alt,
  radius = 150,
  priority = true,
  className = '',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  const setPos = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--x', `${x}%`);
      el.style.setProperty('--y', `${y}%`);
      el.style.setProperty('--r', `${radius}px`);
    },
    [radius],
  );

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsActive(true);
    setPos(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setPos(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    setIsActive(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsActive(true);
    const t = e.touches[0];
    if (t) setPos(t.clientX, t.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (t) setPos(t.clientX, t.clientY);
  };

  const handleTouchEnd = () => {
    setIsActive(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full h-full overflow-hidden isolate select-none',
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Base Layer: Black and White */}
      <Image
        src={bwSrc}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 45vw"
        className="object-cover object-center pointer-events-none select-none transition-all duration-300 filter grayscale contrast-[1.03]"
      />

      {/* Reveal Layer: Full Color revealed via dynamic radial mask */}
      <Image
        src={colorSrc}
        alt=""
        aria-hidden
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 45vw"
        className={cn(
          'object-cover object-center pointer-events-none select-none transition-opacity duration-300',
          isActive ? 'opacity-100' : 'opacity-0',
        )}
        style={{
          WebkitMaskImage:
            'radial-gradient(circle var(--r, 150px) at var(--x, 50%) var(--y, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0) 100%)',
          maskImage:
            'radial-gradient(circle var(--r, 150px) at var(--x, 50%) var(--y, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0) 100%)',
        }}
      />
    </div>
  );
}

export default HeroPhotoReveal;
