"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { media } from "@/lib/motion";
import { conceptChain } from "@/content/concept";
import { sectionIndex } from "@/content/sections";
import { useReveal } from "@/hooks/useReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * "Não somos apenas tecnologia." — seção fixada: a cadeia de valor
 * acende elo por elo enquanto um pulso percorre a linha que os conecta.
 */
export function Concept() {
  const rootRef = useRef<HTMLElement>(null);
  useReveal(rootRef);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-chain-item]", root);
        const titles = items.map((el) => el.querySelector("[data-chain-title]"));
        const notes = items.map((el) => el.querySelector("[data-chain-note]"));
        const fills = items.map((el) => el.querySelector("[data-chain-fill]"));
        const n = items.length;

        gsap.set(titles, { opacity: 0.12 });
        gsap.set(notes, { autoAlpha: 0, x: -12 });
        gsap.set(fills, { scale: 0 });
        gsap.set("[data-chain-progress]", { scaleY: 0 });
        gsap.set("[data-concept-final] > *", { autoAlpha: 0, yPercent: 40 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight * (n * 0.6 + 0.8)}`,
            pin: "[data-concept-pin]",
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        items.forEach((_, i) => {
          tl.to("[data-chain-progress]", { scaleY: (i + 0.5) / n, duration: 0.6, ease: "none" }, i)
            .to(titles[i]!, { opacity: 1, duration: 0.5 }, i + 0.3)
            .to(fills[i]!, { scale: 1, duration: 0.3, ease: "back.out(3)" }, i + 0.35)
            .to(notes[i]!, { autoAlpha: 1, x: 0, duration: 0.4 }, i + 0.4);
          if (i < n - 1) {
            tl.to(titles[i]!, { opacity: 0.38, duration: 0.4 }, i + 1.1).to(notes[i]!, { autoAlpha: 0, duration: 0.3 }, i + 1.1);
          }
        });

        tl.to("[data-chain-progress]", { scaleY: 1, duration: 0.5, ease: "none" }, n)
          .to(titles, { opacity: 1, duration: 0.6 }, n + 0.1)
          .to(titles[n - 1]!, { color: "var(--color-orange)", duration: 0.6 }, n + 0.1)
          .to("[data-concept-final] > *", { autoAlpha: 1, yPercent: 0, duration: 0.8, stagger: 0.15, ease: "expo.out" }, n + 0.2)
          .to({}, { duration: 0.6 });
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} id="sobre" aria-labelledby="concept-title" className="relative">
      <div data-concept-pin className="relative flex min-h-[100svh] items-center overflow-hidden py-20 lg:py-0">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_60%,rgba(2,71,79,0.16),transparent_70%)]" />

        <div className="container-x relative grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-5">
            <SectionLabel index={sectionIndex("sobre")}>O que é a MSATech</SectionLabel>
            <h2 id="concept-title" data-split className="t-h2 mt-8 max-w-[12ch]">
              Não somos apenas tecnologia.
            </h2>
            <p data-reveal className="t-lead mt-5 max-w-[30rem] text-fg/60 lg:mt-7">
              Somos o ponto onde estratégia, marca, experiência e tecnologia se encontram.
            </p>
            <div data-concept-final className="mt-6 border-l border-orange pl-6 lg:mt-12">
              <p className="text-[clamp(1.25rem,1.7vw,1.75rem)] font-semibold leading-tight tracking-[-0.03em]">Uma experiência completa.</p>
              <p className="text-[clamp(1.25rem,1.7vw,1.75rem)] font-semibold leading-tight tracking-[-0.03em] text-fg/45">
                Uma solução pensada para o seu negócio.
              </p>
            </div>
          </div>

          <div className="relative lg:col-span-6 lg:col-start-7">
            <div aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-px bg-fg/10">
              <div data-chain-progress className="absolute inset-0 origin-top bg-gradient-to-b from-orange/40 to-orange">
                <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 bg-orange shadow-[0_0_18px_4px_rgba(241,118,49,0.6)]" />
              </div>
            </div>
            <ol className="relative">
              {conceptChain.map((item, i) => (
                <li key={item.title} data-chain-item className="relative flex flex-col gap-1 py-1.5 pl-12 md:py-3 lg:flex-row lg:items-center lg:gap-8">
                  <span aria-hidden="true" className="absolute left-0 top-1/2 size-[15px] -translate-y-1/2 border border-fg/30 bg-ink">
                    <span data-chain-fill className="absolute inset-[3px] bg-orange" />
                  </span>
                  <span className="flex items-baseline gap-5">
                    <span className="t-micro w-6 text-fg/35 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span data-chain-title className="text-[clamp(1.75rem,4.4vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
                      {item.title}
                    </span>
                  </span>
                  <span data-chain-note className="t-micro hidden text-fg/50 lg:inline">
                    {item.note}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
