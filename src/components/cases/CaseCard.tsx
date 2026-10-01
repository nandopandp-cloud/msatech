"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";
import type { CaseStudy } from "@/content/cases";
import { useTilt } from "@/hooks/useTilt";
import { Arrow } from "@/components/ui/Arrow";
import { CaseCover } from "./CaseCover";

type CaseCardProps = {
  item: CaseStudy;
  index: number;
  total: number;
  aspect: string;
  onOpen: (item: CaseStudy) => void;
};

export function CaseCard({ item, index, total, aspect, onOpen }: CaseCardProps) {
  const tiltRef = useRef<HTMLDivElement>(null);
  useTilt(tiltRef, 2.5);

  const body = (
    <div ref={tiltRef} className={cn("relative overflow-hidden rounded-[1.25rem] bg-ink-3", aspect)}>
      <div data-case-media className="absolute inset-0 transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]">
        <CaseCover item={item} sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-ink/10 transition-opacity duration-700 group-hover:opacity-90" />
      <div aria-hidden="true" className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/25" />

      <div className="t-micro absolute inset-x-5 top-5 flex items-center justify-between text-fg/70 md:inset-x-7 md:top-7">
        <span className="tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span className="rounded-full border border-fg/20 px-2.5 py-1 backdrop-blur-sm">{item.segment}</span>
      </div>

      <div className="absolute inset-x-5 bottom-5 md:inset-x-7 md:bottom-7">
        <span
          aria-hidden="true"
          className="absolute bottom-0 right-0 flex translate-y-2 items-center gap-2.5 rounded-full bg-fg px-4 py-2.5 text-[0.8125rem] font-semibold text-ink opacity-0 transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 max-md:hidden"
        >
          Ver projeto <Arrow className="size-3" />
        </span>
        <p className="t-micro text-orange">{item.client}</p>
        <h3 className="mt-3 max-w-[18ch] text-[clamp(1.4rem,2.2vw,2.25rem)] font-semibold leading-[1.05] tracking-[-0.035em] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-1">
          {item.title}
        </h3>
        <ul className="mt-4 flex flex-wrap gap-1.5 transition-opacity duration-500 md:opacity-70 md:group-hover:opacity-100">
          {item.services.map((s) => (
            <li key={s} className="t-micro rounded-[4px] border border-fg/20 px-2 py-1 text-fg/70">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const label = `${item.client}, ${item.title}. Ver projeto`;

  return item.href ? (
    <a href={item.href} className="group block" data-cursor="explore" aria-label={label}>
      {body}
    </a>
  ) : (
    <button type="button" onClick={() => onOpen(item)} className="group block w-full text-left" data-cursor="explore" aria-label={label} aria-haspopup="dialog">
      {body}
    </button>
  );
}
