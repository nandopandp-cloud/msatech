"use client";

import { useRef } from "react";
import { reasons } from "@/content/why";
import { sectionIndex } from "@/content/sections";
import { useReveal } from "@/hooks/useReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Arrow } from "@/components/ui/Arrow";

/**
 * Índice editorial de convicções. No hover, a linha é tomada pela cor da
 * marca — a convicção "ocupa" o espaço, como deve ser.
 */
export function Why() {
  const rootRef = useRef<HTMLElement>(null);
  useReveal(rootRef);

  return (
    <section ref={rootRef} id="diferenciais" aria-labelledby="why-title" className="relative bg-ink py-28 md:py-40">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index={sectionIndex("diferenciais")}>Por que a MSATech</SectionLabel>
            <h2 id="why-title" data-split className="t-h2 mt-8 max-w-[13ch]">
              Seis convicções. Nenhum atalho.
            </h2>
          </div>
          <p data-reveal className="t-lead max-w-[26rem] text-fg/55 lg:col-span-4 lg:col-start-9">
            Não é uma lista de serviços. É o jeito como decidimos, em cada projeto, em cada detalhe.
          </p>
        </div>

        <ol className="mt-20 border-b border-line">
          {reasons.map((r, i) => (
            <li key={r.title} className="group relative overflow-hidden border-t border-line">
              <span data-line aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-fg/25" />
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-bottom scale-y-0 bg-orange transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
              />
              <div className="relative grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-2 py-7 transition-colors duration-500 group-hover:text-ink group-focus-visible:text-ink md:grid-cols-12 md:items-center md:gap-x-6 md:py-9">
                <span className="t-micro text-fg/40 transition-colors duration-500 group-hover:text-ink/60 group-focus-visible:text-ink/60 md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[clamp(1.75rem,3.6vw,3.75rem)] font-semibold leading-none tracking-[-0.045em] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-3 md:col-span-5">
                  {r.title}
                </h3>
                <p className="col-start-2 text-[1.0625rem] leading-snug text-fg/60 transition-colors duration-500 group-hover:text-ink/80 group-focus-visible:text-ink/80 md:col-span-5 md:col-start-auto md:text-xl">
                  {r.statement}
                </p>
                <span aria-hidden="true" className="hidden justify-self-end md:col-span-1 md:grid">
                  <span className="grid size-12 place-items-center rounded-full border border-current/25 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-rotate-45">
                    <Arrow className="size-4" />
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
