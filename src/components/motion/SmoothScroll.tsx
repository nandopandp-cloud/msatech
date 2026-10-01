"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { onIntroComplete } from "@/lib/intro";
import { media } from "@/lib/motion";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

/**
 * Lenis sincronizado ao ticker do GSAP: um único loop de animação para
 * scroll suave e ScrollTrigger. Desligado com movimento reduzido.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    let instance: Lenis | null = null;
    let offIntro = () => {};
    const tick = (time: number) => instance?.raf(time * 1000);

    if (!window.matchMedia(media.reduced).matches) {
      instance = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        anchors: { duration: 1.6 },
        autoRaf: false,
      });
      instance.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      instance.stop();
      offIntro = onIntroComplete(() => instance?.start());
      setLenis(instance);
    }

    // Recalcula gatilhos quando as fontes chegam (métricas de texto mudam).
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      offIntro();
      gsap.ticker.remove(tick);
      instance?.destroy();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
