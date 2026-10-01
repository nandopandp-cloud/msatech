"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { sections } from "@/content/sections";
import { cn } from "@/lib/cn";

/**
 * Detalhes de interface para quem presta atenção: barra de progresso,
 * seção atual em microtipografia e percentual percorrido.
 */
export function ScrollHud() {
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const setScale = gsap.quickSetter(bar, "scaleX");
    const progress = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        setScale(self.progress);
        if (pctRef.current) pctRef.current.textContent = String(Math.round(self.progress * 100)).padStart(3, "0");
      },
    });

    const triggers = sections.map((s, i) =>
      ScrollTrigger.create({
        trigger: `#${s.id}`,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => self.isActive && setActive(i),
      }),
    );

    return () => {
      progress.kill();
      triggers.forEach((t) => t.kill());
    };
  }, []);

  const current = sections[active];

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-px">
        <div ref={barRef} className="h-full origin-left scale-x-0 bg-orange" />
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-y-0 left-0 right-0 z-30 hidden mix-blend-difference transition-opacity duration-700 xl:block",
          active === 0 ? "opacity-0" : "opacity-100",
        )}
      >
        <div className="absolute bottom-8 left-5 flex rotate-180 text-white/60 [writing-mode:vertical-rl]">
          <p className="t-micro flex items-center gap-3">
            <span className="inline-block w-[2ch] tabular-nums">{String(active).padStart(2, "0")}</span>
            <span className="h-8 w-px bg-white/40" />
            <span key={current?.id} className="inline-block animate-[fade-in_0.6s_ease]">{current?.label}</span>
          </p>
        </div>
        <p className="t-micro absolute bottom-8 right-5 rotate-180 tabular-nums text-white/60 [writing-mode:vertical-rl]">
          <span ref={pctRef}>000</span>%
        </p>
      </div>
    </>
  );
}
