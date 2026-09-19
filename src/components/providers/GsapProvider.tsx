'use client';

import { useEffect, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { Flip } from 'gsap/Flip';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, Draggable, InertiaPlugin, Flip);
  try {
    CustomEase.create('expo-out', '0.16, 1, 0.3, 1');
    CustomEase.create('smooth', '0.65, 0, 0.35, 1');
    CustomEase.create('snap', '0.85, 0, 0.15, 1');
  } catch {}
}

export function GsapProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Asegura que los plugins esten registrados tras la hidratacion
    gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, Draggable, InertiaPlugin, Flip);
  }, []);

  return <>{children}</>;
}
