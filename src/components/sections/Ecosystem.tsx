"use client";

import { useRef, useState, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { media } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { ecosystem } from "@/content/ecosystem";
import { sectionIndex } from "@/content/sections";
import { site } from "@/content/site";
import { useReveal } from "@/hooks/useReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

/**
 * Grupo MSA como arquitetura: camadas empilhadas em 3D que se afastam com o
 * scroll. A MSATech é a base — a camada digital sobre a qual o resto opera.
 */
export function Ecosystem() {
  const rootRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  useReveal(rootRef);

  // Base (z = 0) é a tecnologia; as demais empilham acima.
  const stack = [...ecosystem].reverse();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        gsap.fromTo(
          "[data-stage]",
          { "--gap": "10px" },
          {
            "--gap": () => `${Math.min(84, Math.max(44, window.innerWidth * 0.06))}px`,
            ease: "none",
            scrollTrigger: { trigger: "[data-stage-wrap]", start: "top 85%", end: "center 45%", scrub: true, invalidateOnRefresh: true },
          },
        );
        gsap.from("[data-plate]", {
          autoAlpha: 0,
          "--lift": "-120px",
          duration: 1.6,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-stage-wrap]", start: "top 80%" },
        });
      });
      mm.add(`${media.motion} and ${media.finePointer}`, () => {
        const el = tiltRef.current;
        const wrap = rootRef.current?.querySelector<HTMLElement>("[data-stage-wrap]");
        if (!el || !wrap) return;
        const rx = gsap.quickTo(el, "rotateX", { duration: 1.4, ease: "power3.out" });
        const ry = gsap.quickTo(el, "rotateY", { duration: 1.4, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = wrap.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 12);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        wrap.addEventListener("pointermove", move);
        wrap.addEventListener("pointerleave", leave);
        return () => {
          wrap.removeEventListener("pointermove", move);
          wrap.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} id="grupo-msa" aria-labelledby="ecosystem-title" className="relative overflow-hidden bg-ink py-28 md:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_50%_at_70%_55%,rgba(241,118,49,0.08),transparent_70%)]" />
      <div className="container-x relative grid gap-16 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-5">
          <SectionLabel index={sectionIndex("grupo-msa")}>Grupo MSA</SectionLabel>
          <h2 id="ecosystem-title" data-split className="t-h2 mt-8 max-w-[14ch]">
            Um ecossistema construído para o seu negócio.
          </h2>
          <div className="mt-8 max-w-[30rem] space-y-5 text-[1.0625rem] leading-relaxed text-fg/60">
            <p data-reveal>O Grupo MSA reúne conhecimento em diferentes áreas essenciais para empresas.</p>
            <p data-reveal>
              A MSATech nasce como seu <span className="text-fg">pilar de tecnologia</span>, conectando esse conhecimento à
              inovação digital.
            </p>
          </div>

          <ul className="mt-10 border-t border-line" aria-label="Frentes do Grupo MSA">
            {ecosystem.map((layer) => (
              <li
                key={layer.id}
                data-reveal
                onPointerEnter={() => setHovered(layer.id)}
                onPointerLeave={() => setHovered(null)}
                className={cn(
                  "flex items-baseline justify-between gap-6 border-b border-line py-4 transition-colors duration-500",
                  hovered && hovered !== layer.id && "text-fg/35",
                )}
              >
                <span className={cn("flex items-center gap-3 font-semibold tracking-[-0.01em]", layer.highlight && "text-orange")}>
                  <span aria-hidden="true" className={cn("size-1.5", layer.highlight ? "bg-orange" : "bg-fg/40")} />
                  {layer.highlight ? "MSATech — Tecnologia" : layer.title}
                </span>
                <span className="text-right text-sm text-fg/45">{layer.note}</span>
              </li>
            ))}
          </ul>

          <div data-reveal className="mt-10">
            <Button href={site.group.url} variant="ghost">
              Conheça o Grupo MSA
            </Button>
          </div>
        </div>

        <div data-stage-wrap className="relative h-[440px] [perspective:2200px] sm:h-[540px] lg:col-span-7 lg:h-[680px]">
          <p className="t-micro absolute left-1/2 top-0 -translate-x-1/2 text-fg/40">Grupo MSA</p>
          <div ref={tiltRef} className="absolute inset-0 [transform-style:preserve-3d]">
            <div
              data-stage
              className="absolute left-1/2 top-[54%] [--gap:clamp(44px,6vw,84px)] [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-38deg)]"
            >
              {stack.map((layer, z) => {
                const isHover = hovered === layer.id;
                return (
                  <div
                    key={layer.id}
                    data-plate
                    onPointerEnter={() => setHovered(layer.id)}
                    onPointerLeave={() => setHovered(null)}
                    className={cn(
                      "absolute left-0 top-0 h-[var(--ph)] w-[var(--pw)] rounded-[14px] border transition-[border-color,background-color,box-shadow] duration-500 [--ph:calc(var(--pw)*0.62)] [--pw:clamp(220px,27vw,380px)]",
                      layer.highlight
                        ? "border-orange/80 bg-[linear-gradient(135deg,rgba(241,118,49,0.22),rgba(17,20,21,0.92)_55%)] shadow-[0_0_80px_-10px_rgba(241,118,49,0.55)]"
                        : "border-fg/15 bg-ink-3/85 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]",
                      isHover && !layer.highlight && "border-fg/40 bg-ink-4/95",
                    )}
                    style={
                      {
                        transform: `translate(-50%, -50%) translateZ(calc(var(--gap) * ${z} + var(--lift, 0px) + ${isHover ? 22 : 0}px))`,
                        transition: "transform 0.7s var(--ease-out-expo), border-color 0.5s, background-color 0.5s",
                      } as CSSProperties
                    }
                  >
                    <div aria-hidden="true" className="absolute inset-0 rounded-[14px] [background-image:linear-gradient(rgba(238,236,231,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(238,236,231,0.05)_1px,transparent_1px)] [background-size:22px_22px]" />
                    <div className="relative flex h-full flex-col justify-between p-5">
                      <span className="t-micro text-fg/45">0{stack.length - z}</span>
                      {layer.highlight ? (
                        <div className="flex items-end justify-between">
                          <Logo className="h-7 w-auto" />
                          <span className="t-micro text-orange">{layer.title}</span>
                        </div>
                      ) : (
                        <span className="text-xl font-semibold tracking-[-0.02em]">{layer.title}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div aria-hidden="true" className="absolute bottom-[8%] right-0 hidden max-w-[11rem] border-l border-orange pl-4 xl:block">
            <p className="text-sm leading-snug text-fg/55">
              Mais do que tecnologia. <span className="font-semibold text-fg">Parte de algo maior.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
