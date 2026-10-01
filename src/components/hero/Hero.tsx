"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { onIntroComplete } from "@/lib/intro";
import { media } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import type { GlobeReadout, GlobeRenderer } from "./globe-renderer";

const HeroGlobe = dynamic(() => import("./HeroGlobe"), { ssr: false });

const PILLARS = ["Estratégia", "Marca", "Design", "Experiência", "Tecnologia", "Resultados"] as const;

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const globeRef = useRef<GlobeRenderer | null>(null);
  const rotRef = useRef<HTMLSpanElement>(null);
  const xyRef = useRef<HTMLSpanElement>(null);

  const onReadout = (r: GlobeReadout) => {
    if (rotRef.current) rotRef.current.textContent = `${r.rotation.toFixed(1).padStart(5, "0")}°`;
    if (xyRef.current) xyRef.current.textContent = `${r.x.toFixed(3)} / ${r.y.toFixed(3)}`;
  };

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add(media.motion, () => {
        const title = root.querySelector<HTMLElement>("[data-hero-title]");
        const split = title
          ? SplitText.create(title, { type: "lines", mask: "lines", linesClass: "split-line" })
          : null;
        const headerItems = document.querySelectorAll("[data-hero-in='header']");

        const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        tl.set(title, { autoAlpha: 1 })
          .from(split?.lines ?? [], { yPercent: 118, duration: 1.7, stagger: 0.11 }, 0)
          .from("[data-hero-in='label']", { autoAlpha: 0, y: 12, duration: 1.2 }, 0.15)
          .from("[data-hero-in='copy']", { autoAlpha: 0, y: 28, filter: "blur(10px)", duration: 1.5, clearProps: "filter" }, 0.5)
          .from("[data-hero-in='cta']", { autoAlpha: 0, y: 24, duration: 1.3, stagger: 0.09 }, 0.65)
          .from(headerItems, { autoAlpha: 0, y: -14, duration: 1.3, stagger: 0.07 }, 0.25)
          .from("[data-hero-in='meta']", { autoAlpha: 0, duration: 1.4, stagger: 0.1 }, 1);

        const off = onIntroComplete(() => tl.play());

        // Saída: o conteúdo sobe e desfoca; o globo cresce e se dispersa em partículas.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: true,
              onUpdate: (self) => {
                if (globeRef.current) globeRef.current.scatter = Math.min(1, self.progress * 1.35);
              },
            },
          })
          .to("[data-hero-content]", { yPercent: -18, autoAlpha: 0, filter: "blur(12px)", ease: "none" }, 0)
          .to("[data-hero-meta]", { autoAlpha: 0, ease: "none", duration: 0.4 }, 0)
          .to("[data-hero-globe]", { scale: 1.18, yPercent: 8, ease: "none" }, 0)
          .to("[data-hero-globe]", { autoAlpha: 0, ease: "power1.in" }, 0.35);

        return () => {
          off();
          split?.revert();
        };
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Atmosfera: horizonte quente sutil + vinheta */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_75%_40%,rgba(2,71,79,0.18),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(238,236,231,0.035)_1px,transparent_1px)] [background-size:calc(100%/12)_100%]" />
      </div>

      <div
        data-hero-globe
        aria-hidden="true"
        className="absolute right-[-38vw] top-[2%] -z-10 h-[58svh] w-[115vw] opacity-70 will-change-transform md:right-[-20vw] md:w-[90vw] md:opacity-100 lg:inset-y-0 lg:left-auto lg:right-[-2vw] lg:top-0 lg:h-full lg:w-[60vw]"
      >
        <HeroGlobe labels={PILLARS} onReady={(g) => (globeRef.current = g)} onReadout={onReadout} />
      </div>

      <div data-hero-content className="container-x relative flex flex-1 flex-col justify-end pb-28 pt-32 lg:justify-center lg:pb-24">
        <p data-hero-in="label" className="t-micro mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-fg/55">
          {["Estratégia", "Marca", "Experiência", "Tecnologia"].map((item, i) => (
            <span key={item} className="flex items-center gap-3">
              {i > 0 && <span className="text-orange">×</span>}
              {item}
            </span>
          ))}
        </p>

        <h1
          id="hero-title"
          data-hero-title
          data-hero-in="title"
          className="max-w-[16ch] text-[clamp(2.6rem,5.1vw,6.25rem)] font-semibold leading-[0.98] tracking-[-0.045em]"
        >
          <span className="block">Transformamos</span>
          <span className="block">ideias em</span>
          <span className="block text-orange">experiências</span>
          <span className="block">que movem negócios.</span>
        </h1>

        <p data-hero-in="copy" className="t-lead mt-8 max-w-[34rem] text-fg/65">
          A tecnologia é apenas parte da solução. Nós conectamos estratégia, marca, design e tecnologia para construir
          experiências digitais que fazem sentido para o seu negócio.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <div data-hero-in="cta">
            <Button href="#contato" size="lg" cursor="talk">
              Construir algo juntos
            </Button>
          </div>
          <a data-hero-in="cta" href="#sobre" className="group flex items-center gap-4 text-[0.9375rem] font-semibold">
            <span className="relative grid size-14 place-items-center rounded-full border border-fg/25 transition-colors duration-500 group-hover:border-orange">
              <svg viewBox="0 0 12 12" className="ml-0.5 size-3 text-fg transition-colors duration-500 group-hover:text-orange" aria-hidden="true">
                <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
              </svg>
              <svg viewBox="0 0 56 56" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
                <circle cx="28" cy="28" r="27" fill="none" stroke="var(--color-orange)" strokeWidth="1" strokeDasharray="170" strokeDashoffset="170" className="transition-[stroke-dashoffset] duration-1000 ease-[var(--ease-out-expo)] group-hover:[stroke-dashoffset:0]" />
              </svg>
            </span>
            <span className="link-underline">Conheça a MSATech</span>
          </a>
        </div>
      </div>

      <div data-hero-meta className="container-x pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between pb-7">
        <div data-hero-in="meta" className="flex items-center gap-4">
          <span className="relative block h-12 w-px overflow-hidden bg-fg/15">
            <span className="absolute inset-0 animate-[scroll-cue_2.4s_var(--ease-in-out-quart)_infinite] bg-orange" />
          </span>
          <span className="t-micro text-fg/50">Role para explorar</span>
        </div>
        <div data-hero-in="meta" aria-hidden="true" className="t-micro hidden flex-col items-end gap-1.5 text-fg/35 tabular-nums md:flex">
          <span>
            ROT <span ref={rotRef}>000.0°</span>
          </span>
          <span>
            XY <span ref={xyRef}>0.500 / 0.500</span>
          </span>
        </div>
      </div>
    </section>
  );
}
