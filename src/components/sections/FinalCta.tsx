"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { gsap } from "@/lib/gsap";
import { media } from "@/lib/motion";
import { sectionIndex } from "@/content/sections";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { HorizonRenderer } from "./horizon-renderer";

export function FinalCta() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<HorizonRenderer | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const renderer = new HorizonRenderer(canvas);
    rendererRef.current = renderer;
    const reduced = window.matchMedia(media.reduced).matches;

    const ro = new ResizeObserver(([e]) => e && renderer.resize(e.contentRect.width, e.contentRect.height));
    ro.observe(wrap);
    const io = new IntersectionObserver(([e]) => (e?.isIntersecting && !reduced ? renderer.start() : renderer.stop()));
    io.observe(wrap);
    const move = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      renderer.setPointer(e.clientX - r.left, e.clientY - r.top);
    };
    wrap.addEventListener("pointermove", move);

    return () => {
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", move);
      renderer.stop();
      gsap.killTweensOf(renderer);
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        gsap.fromTo(
          "[data-cta-photo]",
          { yPercent: -6, scale: 1.12 },
          { yPercent: 6, scale: 1.02, ease: "none", scrollTrigger: { trigger: wrapRef.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: wrapRef },
  );

  const intensify = (on: boolean) => {
    if (rendererRef.current) gsap.to(rendererRef.current, { boost: on ? 1 : 0, duration: 0.9, ease: "power3.out" });
  };

  return (
    <div ref={wrapRef} className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div data-cta-photo className="absolute inset-y-0 right-0 w-full will-change-transform lg:w-[72%]">
          <Image src="/images/cta.jpg" alt="" fill sizes="(min-width: 1024px) 72vw, 100vw" className="object-cover object-[70%_center] opacity-60 lg:opacity-90" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-ink)_0%,rgba(5,6,7,0.92)_30%,rgba(5,6,7,0.35)_65%,rgba(5,6,7,0.15)_100%)]" />
      </div>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 opacity-80 mix-blend-screen" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-ink)_0%,transparent_25%,transparent_75%,var(--color-ink)_100%)]" />

      <div className="container-x relative pb-[18svh]">
        <SectionLabel index={sectionIndex("contato")}>Vamos conversar?</SectionLabel>
        <h2 className="t-mega mt-10">
          <span data-split className="block text-fg/40">
            Tem um desafio?
          </span>
          <span data-split className="block">
            Vamos construir a solução.
          </span>
        </h2>
        <div data-reveal className="mt-12 md:mt-16" onPointerEnter={() => intensify(true)} onPointerLeave={() => intensify(false)}>
          <Button href="#contato-form" size="xl" cursor="talk" magnetic={0.35}>
            Falar com a MSATech
          </Button>
        </div>
      </div>
    </div>
  );
}
