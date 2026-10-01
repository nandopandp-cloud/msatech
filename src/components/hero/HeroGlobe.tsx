"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { onIntroComplete } from "@/lib/intro";
import { media } from "@/lib/motion";
import { EarthGL } from "./earth-gl";
import { GlobeRenderer, type GlobeReadout } from "./globe-renderer";

type HeroGlobeProps = {
  labels: readonly string[];
  onReady?: (globe: GlobeRenderer) => void;
  onReadout?: (r: GlobeReadout) => void;
};

/** Carregado sob demanda (next/dynamic) — o canvas nunca bloqueia o primeiro paint. */
export default function HeroGlobe({ labels, onReady, onReadout }: HeroGlobeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const readoutRef = useRef(onReadout);
  readoutRef.current = onReadout;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const glCanvas = glRef.current;
    if (!wrap || !canvas || !glCanvas) return;

    const reduced = window.matchMedia(media.reduced).matches;
    const compact = window.innerWidth < 768;
    const earth = EarthGL.create(glCanvas);
    const globe = new GlobeRenderer(canvas, {
      labels: labelRefs.current.filter((el): el is HTMLSpanElement => el !== null),
      onReadout: (r) => readoutRef.current?.(r),
      compact,
      earth,
    });

    let disposed = false;
    earth
      ?.load("/textures/earth-lights.jpg", "/textures/earth-land.jpg")
      .then(() => !disposed && reduced && globe.still())
      .catch(() => {
        /* sem texturas: o globo de partículas continua funcionando sozinho */
      });

    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return;
      earth?.resize(entry.contentRect.width, entry.contentRect.height, compact ? 1.5 : 2);
      globe.resize(entry.contentRect.width, entry.contentRect.height);
    });
    ro.observe(wrap);

    let visible = false;
    const sync = () => (visible && !document.hidden && !reduced ? globe.start() : globe.stop());
    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      sync();
    });
    io.observe(wrap);
    document.addEventListener("visibilitychange", sync);

    const fine = window.matchMedia(media.finePointer).matches;
    const move = (e: PointerEvent) => globe.setPointer(e.clientX, e.clientY, wrap.getBoundingClientRect());
    const leave = () => globe.clearPointer();
    if (fine && !reduced) {
      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
    }

    let offIntro = () => {};
    if (reduced) globe.still();
    else offIntro = onIntroComplete(() => gsap.to(globe, { assemble: 0, duration: 2.8, ease: "power3.out" }));

    onReady?.(globe);

    return () => {
      disposed = true;
      offIntro();
      gsap.killTweensOf(globe);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      globe.destroy();
      earth?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas ref={glRef} className="absolute inset-0" aria-hidden="true" />
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 max-md:hidden">
        {labels.map((label, i) => (
          <span
            key={label}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            className="t-micro absolute left-0 top-0 whitespace-nowrap text-fg/80 opacity-0 will-change-transform"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
