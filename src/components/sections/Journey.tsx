"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { media } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { journey } from "@/content/journey";
import { sectionIndex } from "@/content/sections";
import { useReveal } from "@/hooks/useReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FORMATION_COUNT, FormationRenderer } from "./formation-renderer";

/**
 * "Do desafio à solução" — jornada narrativa.
 * Desktop: seção fixada com trilho horizontal; Mobile: lista vertical com visual sticky.
 * Em ambos, o progresso do scroll reorganiza o sistema de partículas.
 */
export function Journey() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<FormationRenderer | null>(null);
  const [active, setActive] = useState(0);
  useReveal(rootRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = canvas?.parentElement;
    if (!canvas || !wrap) return;
    const renderer = new FormationRenderer(canvas);
    rendererRef.current = renderer;
    const reduced = window.matchMedia(media.reduced).matches;

    const ro = new ResizeObserver(([e]) => e && renderer.resize(e.contentRect.width, e.contentRect.height));
    ro.observe(wrap);
    const io = new IntersectionObserver(([e]) => (e?.isIntersecting && !reduced ? renderer.start() : renderer.stop()));
    io.observe(wrap);
    return () => {
      ro.disconnect();
      io.disconnect();
      renderer.stop();
      rendererRef.current = null;
    };
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const steps = journey.length;
      const apply = (progress: number) => {
        const r = rendererRef.current;
        const value = progress * (FORMATION_COUNT - 1);
        if (r) {
          r.progress = value;
          r.render(0);
        }
        setActive(Math.min(steps - 1, Math.round(progress * (steps - 1))));
      };

      const mm = gsap.matchMedia();

      mm.add(media.desktop, () => {
        const track = root.querySelector<HTMLElement>("[data-track]");
        if (!track) return;

        // O foco percorre o trilho da esquerda para a direita: a última etapa termina visível.
        gsap.to(track, {
          x: () => -Math.max(0, track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight * 4}`,
            pin: "[data-journey-pin]",
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => apply(self.progress),
          },
        });
        gsap.to("[data-journey-fill]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: () => `+=${window.innerHeight * 4}`, scrub: true },
        });
      });

      mm.add(media.mobile, () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: "[data-track]",
            start: "top 55%",
            end: "bottom 85%",
            scrub: 0.4,
            onUpdate: (self) => apply(self.progress),
          },
        });
      });
    },
    { scope: rootRef },
  );

  const current = journey[active]!;

  return (
    <section ref={rootRef} id="processo" aria-labelledby="journey-title" className="relative bg-ink">
      <div data-journey-pin className="relative lg:h-[100svh] lg:overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_45%_at_72%_40%,rgba(2,71,79,0.22),transparent_70%)]" />

        <div className="container-x relative z-10 flex items-start justify-between gap-8 pt-28 lg:pt-32">
          <div>
            <SectionLabel index={sectionIndex("processo")}>Como trabalhamos</SectionLabel>
            <h2 id="journey-title" data-split className="t-h2 mt-8 max-w-[10ch]">
              Do desafio à solução.
            </h2>
          </div>
          <div aria-hidden="true" className="hidden text-right lg:block">
            <p className="t-micro text-fg/40">Etapa</p>
            <p className="mt-3 font-mono text-5xl tabular-nums tracking-tight">
              <span className="text-orange">{current.index}</span>
              <span className="text-fg/25"> / {String(journey.length).padStart(2, "0")}</span>
            </p>
            <p key={current.title} className="t-micro mt-3 animate-[fade-in_0.6s_var(--ease-out-expo)] text-fg/60">
              {current.title}
            </p>
          </div>
        </div>

        <div className="relative lg:static">
          <div className="sticky top-0 z-[5] h-[46svh] bg-ink lg:absolute lg:inset-auto lg:right-[4vw] lg:top-[12%] lg:h-[56%] lg:w-[56%] lg:bg-transparent">
            <span aria-hidden="true" className="absolute inset-x-0 top-full h-14 bg-gradient-to-b from-ink to-transparent lg:hidden" />
            <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0" />
            <span className="t-micro absolute bottom-4 left-[clamp(1rem,4vw,4.5rem)] text-fg/35 lg:hidden">
              {current.index} / {current.title}
            </span>
          </div>

          <ol data-track className="relative flex flex-col px-[clamp(1rem,4vw,4.5rem)] pb-20 lg:absolute lg:bottom-[9%] lg:left-0 lg:w-max lg:flex-row lg:gap-6 lg:pb-0">
            {journey.map((step, i) => (
              <li
                key={step.index}
                className={cn(
                  "flex min-h-[50svh] flex-col border-t border-fg/15 pt-6 transition-opacity duration-700 lg:min-h-0 lg:w-[min(27vw,400px)] lg:shrink-0",
                  i === active ? "opacity-100" : "lg:opacity-35",
                )}
              >
                <div className="flex items-baseline justify-between">
                  <span className={cn("font-mono text-sm tabular-nums transition-colors duration-700", i <= active ? "text-orange" : "text-fg/40")}>{step.index}</span>
                  <span aria-hidden="true" className={cn("size-2 transition-colors duration-700", i <= active ? "bg-orange" : "bg-fg/15")} />
                </div>
                <h3 className="t-h3 mt-6">{step.title}</h3>
                <p className="mt-4 max-w-[34ch] text-[0.9375rem] leading-relaxed text-fg/55">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>

        <div aria-hidden="true" className="container-x absolute inset-x-0 bottom-[4%] hidden lg:block">
          <div className="relative h-px bg-fg/10">
            <div data-journey-fill className="absolute inset-0 origin-left scale-x-0 bg-orange" />
          </div>
        </div>
      </div>
    </section>
  );
}
