"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { media } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { cases, type CaseStudy } from "@/content/cases";
import { sectionIndex } from "@/content/sections";
import { useReveal } from "@/hooks/useReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CaseCard } from "./CaseCard";
import { CaseModal } from "./CaseModal";

/** Composição editorial assimétrica: tamanhos e velocidades de parallax diferentes. */
const LAYOUT = [
  { col: "lg:col-span-7", aspect: "aspect-[4/3]", offset: "", speed: 0.4 },
  { col: "lg:col-span-5", aspect: "aspect-[4/5]", offset: "lg:mt-[38%]", speed: 1 },
  { col: "lg:col-span-5", aspect: "aspect-[4/5]", offset: "lg:-mt-[12%]", speed: 0.8 },
  { col: "lg:col-span-7", aspect: "aspect-[16/11]", offset: "lg:mt-[14%]", speed: 0.3 },
];

export function Cases() {
  const rootRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<CaseStudy | null>(null);
  useReveal(rootRef);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-case-item]", rootRef.current).forEach((el) => {
          const cover = el.querySelector("[data-case-reveal]");
          gsap.fromTo(
            cover,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 85%" } },
          );
          gsap.from(el.querySelector("[data-case-media]"), { scale: 1.3, duration: 2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%" } });
        });
      });
      mm.add(`${media.motion} and ${media.desktop}`, () => {
        gsap.utils.toArray<HTMLElement>("[data-case-item]", rootRef.current).forEach((el) => {
          const speed = Number(el.dataset.speed ?? 0.5);
          gsap.fromTo(el, { y: 80 * speed }, { y: -80 * speed, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        });
      });
    },
    { scope: rootRef },
  );

  const selectedIndex = selected ? cases.findIndex((c) => c.slug === selected.slug) : -1;
  const next = selectedIndex >= 0 ? cases[(selectedIndex + 1) % cases.length]! : null;

  return (
    <section ref={rootRef} id="cases" aria-labelledby="cases-title" className="relative overflow-hidden bg-ink py-28 md:py-40">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index={sectionIndex("cases")}>Cases em destaque</SectionLabel>
            <h2 id="cases-title" data-split className="t-h2 mt-8 max-w-[14ch]">
              Projetos que geram resultados reais.
            </h2>
          </div>
          <p data-reveal className="t-lead max-w-[28rem] text-fg/55 lg:col-span-4 lg:col-start-9">
            Cada projeto começa diferente — porque cada negócio é diferente. Aqui está o que construímos quando estratégia,
            design e tecnologia trabalham juntos.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0">
          {cases.map((item, i) => {
            const layout = LAYOUT[i % LAYOUT.length]!;
            return (
              <div key={item.slug} data-case-item data-speed={layout.speed} className={cn(layout.col, layout.offset)}>
                <div data-case-reveal>
                  <CaseCard item={item} index={i} total={cases.length} aspect={layout.aspect} onOpen={setSelected} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CaseModal item={selected} next={next} onClose={() => setSelected(null)} onNavigate={setSelected} />
    </section>
  );
}
