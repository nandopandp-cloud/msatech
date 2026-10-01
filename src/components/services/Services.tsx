"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { media } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { services } from "@/content/services";
import { sectionIndex } from "@/content/sections";
import { useReveal } from "@/hooks/useReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Arrow } from "@/components/ui/Arrow";
import { ServiceMedia } from "./ServiceMedia";

/**
 * "Tudo começa com o desafio." — uma folha clara que sobe sobre o escuro.
 * Desktop: painéis em perspectiva que expandem ao explorar (tabs acessíveis).
 * Mobile: acordeão próprio, com o mesmo estado.
 */
export function Services() {
  const rootRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const current = services[active]!;
  useReveal(rootRef);

  const go = (next: number) => setActive((next + services.length) % services.length);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const map: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: services.length - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = (map[e.key]! + services.length) % services.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add(media.motion, () => {
        // Entrada/saída da folha: escala + raio criam a sensação de camada.
        gsap.fromTo(
          "[data-sheet]",
          { scale: 0.9, borderRadius: "3rem" },
          { scale: 1, borderRadius: "0rem", ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "top top", scrub: true } },
        );
        gsap.to("[data-sheet]", {
          scale: 0.94,
          borderRadius: "3rem",
          ease: "none",
          scrollTrigger: { trigger: root, start: "bottom bottom", end: "bottom top", scrub: true },
        });
        gsap.to("[data-sheet-shade]", {
          opacity: 0.7,
          ease: "none",
          scrollTrigger: { trigger: root, start: "bottom bottom", end: "bottom top", scrub: true },
        });

        gsap.from("[data-panel]", {
          yPercent: 18,
          autoAlpha: 0,
          rotateY: -22,
          duration: 1.6,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-deck]", start: "top 80%" },
        });
      });

      // Deck reage ao ponteiro com uma inclinação mínima.
      mm.add(`${media.motion} and ${media.desktop} and ${media.finePointer}`, () => {
        const deck = deckRef.current;
        if (!deck) return;
        const rx = gsap.quickTo(deck, "rotateX", { duration: 1.2, ease: "power3.out" });
        const ry = gsap.quickTo(deck, "rotateY", { duration: 1.2, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = deck.getBoundingClientRect();
          ry(-6 + ((e.clientX - r.left) / r.width - 0.5) * 6);
          rx(((e.clientY - r.top) / r.height - 0.5) * -4);
        };
        const leave = () => {
          rx(0);
          ry(-6);
        };
        gsap.set(deck, { rotateY: -6 });
        deck.addEventListener("pointermove", move);
        deck.addEventListener("pointerleave", leave);
        return () => {
          deck.removeEventListener("pointermove", move);
          deck.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} id="servicos" aria-labelledby="services-title" className="relative">
      <div
        data-sheet
        className="relative overflow-hidden text-paper-ink transition-[background-color] duration-1000 ease-[var(--ease-out-expo)] will-change-transform"
        style={{ backgroundColor: current.tone }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_15%_20%,rgba(255,255,255,0.75),transparent_70%)]" />
          <div className="absolute -bottom-[20%] right-[-10%] h-[70%] w-[70%] bg-[radial-gradient(closest-side,rgba(241,118,49,0.12),transparent)]" />
          <span
            key={current.index}
            className="absolute -right-[2vw] bottom-[-7vw] animate-[fade-in_1.2s_var(--ease-out-expo)] text-[34vw] font-semibold leading-none tracking-[-0.08em] text-paper-ink/[0.05] lg:text-[22vw]"
          >
            {current.index}
          </span>
        </div>
        <div data-sheet-shade aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-ink opacity-0" />

        <div className="container-x relative py-28 md:py-36 lg:py-40">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="flex flex-col lg:col-span-4">
              <SectionLabel index={sectionIndex("servicos")} tone="light">
                Nossos serviços
              </SectionLabel>
              <h2 id="services-title" data-split className="t-h2 mt-8 max-w-[11ch]">
                Tudo começa com o <span className="text-orange-deep">desafio.</span>
              </h2>
              <p data-reveal className="t-lead mt-6 max-w-[26rem] text-paper-ink/60">
                Seis disciplinas, uma única conversa. Explore cada pilar. Na prática, eles nunca trabalham sozinhos.
              </p>

              {/* Painel de conteúdo das tabs (desktop) */}
              <div
                id="svc-panel"
                role="tabpanel"
                aria-labelledby={`svc-tab-${current.id}`}
                aria-live="polite"
                className="mt-auto hidden pt-14 lg:block"
              >
                <div key={current.id} className="animate-[fade-in_0.9s_var(--ease-out-expo)]">
                  <p className="t-micro text-paper-ink/45">
                    {current.index} / {current.title}
                  </p>
                  <p className="mt-4 text-[1.6rem] font-semibold leading-[1.15] tracking-[-0.03em]">{current.statement}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {current.capabilities.map((c) => (
                      <li key={c} className="rounded-full border border-paper-ink/15 px-3 py-1.5 text-[0.75rem] font-medium text-paper-ink/70">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 flex items-center gap-3">
                  <button type="button" onClick={() => go(active - 1)} aria-label="Serviço anterior" className="grid size-11 place-items-center rounded-full border border-paper-ink/20 transition-colors hover:bg-paper-ink hover:text-paper">
                    <Arrow direction="left" className="size-3.5" />
                  </button>
                  <button type="button" onClick={() => go(active + 1)} aria-label="Próximo serviço" className="grid size-11 place-items-center rounded-full border border-paper-ink/20 transition-colors hover:bg-paper-ink hover:text-paper">
                    <Arrow className="size-3.5" />
                  </button>
                  <span className="t-micro ml-3 tabular-nums text-paper-ink/45">
                    {current.index} / {String(services.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop: deck em perspectiva */}
            <div className="hidden [perspective:1800px] lg:col-span-8 lg:block">
              <div
                ref={deckRef}
                data-deck
                role="tablist"
                aria-label="Pilares da MSATech"
                className="flex h-[min(72vh,680px)] gap-2.5 [transform-style:preserve-3d] xl:gap-3"
              >
                {services.map((s, i) => {
                  const isActive = i === active;
                  return (
                    <button
                      key={s.id}
                      ref={(el) => {
                        tabRefs.current[i] = el;
                      }}
                      id={`svc-tab-${s.id}`}
                      data-panel
                      role="tab"
                      type="button"
                      aria-selected={isActive}
                      aria-controls="svc-panel"
                      tabIndex={isActive ? 0 : -1}
                      data-cursor={isActive ? "view" : "link"}
                      onPointerEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      onKeyDown={(e) => onTabKey(e, i)}
                      className={cn(
                        "group relative min-w-0 overflow-hidden rounded-[1.1rem] bg-ink text-left text-fg shadow-[0_40px_80px_-30px_rgba(5,6,7,0.55)] transition-[flex-grow] duration-[1100ms] ease-[var(--ease-out-expo)]",
                        isActive ? "is-active grow-[4.2]" : "grow",
                      )}
                      style={{ flexBasis: 0 }}
                    >
                      <div className={cn("absolute inset-0 transition-[transform,filter] duration-[1400ms] ease-[var(--ease-out-expo)]", isActive ? "scale-100 brightness-100" : "scale-[1.18] brightness-[0.78] saturate-[0.8]")}>
                        <ServiceMedia service={s} sizes="(min-width: 1024px) 40vw, 1px" />
                      </div>
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
                      <span className="t-micro absolute left-4 top-4 text-fg/60">{s.index}</span>

                      <span
                        className={cn(
                          "absolute bottom-5 left-1/2 -translate-x-1/2 rotate-180 whitespace-nowrap text-[0.9375rem] font-semibold tracking-[-0.01em] transition-opacity duration-500 [writing-mode:vertical-rl]",
                          isActive ? "opacity-0" : "opacity-100 delay-200",
                        )}
                      >
                        {s.title}
                      </span>

                      <span className={cn("absolute inset-x-6 bottom-6 block transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)]", isActive ? "translate-y-0 opacity-100 delay-300" : "translate-y-6 opacity-0")}>
                        <span className="flex items-end justify-between gap-4">
                          <span className="text-[clamp(1.75rem,2.6vw,2.75rem)] font-semibold leading-none tracking-[-0.04em]">{s.title}</span>
                          <span className="brand-square mb-1.5 shrink-0" aria-hidden="true" />
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile/tablet: acordeão */}
            <ul className="border-t border-paper-ink/15 lg:hidden">
              {services.map((s, i) => {
                const isActive = i === active;
                return (
                  <li key={s.id} className={cn("border-b border-paper-ink/15", isActive && "is-active")}>
                    <h3>
                      <button
                        type="button"
                        id={`svc-m-${s.id}`}
                        aria-expanded={isActive}
                        aria-controls={`svc-m-panel-${s.id}`}
                        onClick={() => setActive(i)}
                        className="flex w-full items-center gap-5 py-5 text-left"
                      >
                        <span className="t-micro w-6 text-paper-ink/45">{s.index}</span>
                        <span className="flex-1 text-[clamp(1.6rem,7vw,2.5rem)] font-semibold tracking-[-0.04em]">{s.title}</span>
                        <span aria-hidden="true" className="relative grid size-9 place-items-center rounded-full border border-paper-ink/20">
                          <span className="absolute h-px w-3 bg-current" />
                          <span className={cn("absolute h-3 w-px bg-current transition-transform duration-500", isActive && "scale-y-0")} />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`svc-m-panel-${s.id}`}
                      role="region"
                      aria-labelledby={`svc-m-${s.id}`}
                      className={cn("grid transition-[grid-template-rows] duration-700 ease-[var(--ease-out-expo)]", isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-8">
                          <div className="relative h-56 overflow-hidden rounded-2xl bg-ink sm:h-72">
                            <ServiceMedia service={s} sizes="(max-width: 1023px) 100vw, 1px" />
                          </div>
                          <p className="mt-5 text-xl font-semibold leading-snug tracking-[-0.02em]">{s.statement}</p>
                          <ul className="mt-4 flex flex-wrap gap-2">
                            {s.capabilities.map((c) => (
                              <li key={c} className="rounded-full border border-paper-ink/15 px-3 py-1.5 text-xs font-medium text-paper-ink/70">
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
