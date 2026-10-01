"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { media } from "@/lib/motion";
import { cn } from "@/lib/cn";
import type { CaseScreen, CaseStudy } from "@/content/cases";
import { useLenis } from "@/components/motion/SmoothScroll";
import { Arrow } from "@/components/ui/Arrow";
import { CaseCover } from "./CaseCover";

type CaseModalProps = {
  item: CaseStudy | null;
  next: CaseStudy | null;
  onClose: () => void;
  onNavigate: (item: CaseStudy) => void;
};

/**
 * Detalhe do case em <dialog> nativo: foco preso, Esc e fundo inerte de graça.
 * Estrutura pronta para virar rota dedicada (/cases/[slug]) quando houver conteúdo.
 */
export function CaseModal({ item, next, onClose, onNavigate }: CaseModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !item) return;
    if (!dialog.open) {
      dialog.showModal();
      lenis?.stop();
      if (!window.matchMedia(media.reduced).matches) {
        gsap.fromTo(dialog, { backgroundColor: "rgba(5,6,7,0)" }, { backgroundColor: "rgba(5,6,7,0.8)", duration: 0.6, ease: "power2.out" });
        gsap.fromTo(panelRef.current, { yPercent: 12, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1, ease: "expo.out" });
      }
    }
    const panel = panelRef.current;
    if (!panel) return;
    panel.scrollTo({ top: 0 });

    // Telas longas são percorridas conforme a rolagem do próprio painel.
    // Criado aqui (e não num layout effect) porque precisa do <dialog> já aberto para medir.
    const mm = gsap.matchMedia();
    mm.add(media.motion, () => {
      panel.querySelectorAll<HTMLElement>("[data-pan]").forEach((frame) => {
        const img = frame.querySelector("img");
        const bar = frame.querySelector("[data-pan-bar]");
        const scrollTrigger = { trigger: frame, scroller: panel, start: "top 70%", end: "bottom 30%", scrub: 0.6, invalidateOnRefresh: true };
        gsap.fromTo(img, { y: 0 }, { y: () => -Math.max(0, img!.offsetHeight - frame.clientHeight), ease: "none", scrollTrigger });
        gsap.fromTo(bar, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger });
      });
    });
    return () => mm.revert();
  }, [item, lenis]);

  const close = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const finish = () => {
      dialog.close();
      lenis?.start();
      onClose();
    };
    if (window.matchMedia(media.reduced).matches) return finish();
    gsap.to(panelRef.current, { yPercent: 8, autoAlpha: 0, duration: 0.45, ease: "power3.in" });
    gsap.to(dialog, { backgroundColor: "rgba(5,6,7,0)", duration: 0.45, ease: "power2.in", onComplete: finish });
  }, [lenis, onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="case-modal-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => e.target === dialogRef.current && close()}
      className="m-0 h-full max-h-none w-full max-w-none bg-ink/80 p-0 text-fg backdrop:bg-transparent"
    >
      {item && (
        <div ref={panelRef} data-lenis-prevent className="mx-auto mt-[4vh] h-[96vh] max-w-[1280px] overflow-y-auto rounded-t-[1.5rem] bg-ink-2 shadow-[0_-40px_120px_rgba(0,0,0,0.6)]">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-ink-2/85 px-6 py-4 backdrop-blur-xl md:px-10">
            <p className="t-micro text-fg/50">Case · {item.client}</p>
            <button type="button" onClick={close} className="t-micro flex items-center gap-3 rounded-full border border-fg/20 px-4 py-2.5 transition-colors hover:border-orange hover:text-orange">
              Fechar <span aria-hidden="true">✕</span>
            </button>
          </div>

          <div className="relative aspect-[16/8] overflow-hidden">
            <CaseCover item={item} sizes="1280px" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/20 to-transparent" />
          </div>

          <div className="px-6 pb-16 md:px-10">
            <div className="-mt-20 grid gap-10 md:-mt-28 lg:grid-cols-12">
              <div className="relative lg:col-span-8">
                <p className="t-micro text-orange">
                  {item.segment} · {item.year}
                </p>
                <h2 id="case-modal-title" className="t-h2 mt-5">
                  {item.title}
                </h2>
              </div>
              <ul className="relative flex flex-wrap content-end gap-2 lg:col-span-4 lg:justify-end">
                {item.services.map((s) => (
                  <li key={s} className="t-micro rounded-full border border-fg/20 px-3 py-1.5 text-fg/70">
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {item.intro && (
              <div className="mt-16 grid gap-10 border-t border-line pt-10 lg:grid-cols-12">
                <p className="t-lead text-fg/80 lg:col-span-7">{item.intro}</p>
                {item.facts && (
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-7 lg:col-span-4 lg:col-start-9">
                    {item.facts.map((f) => (
                      <div key={f.label}>
                        <dt className="t-micro text-fg/40">{f.label}</dt>
                        <dd className="mt-2 text-[0.9375rem] leading-snug text-fg/85">{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            )}

            <div className="mt-16 grid gap-10 border-t border-line pt-10 md:grid-cols-3">
              {(
                [
                  ["Desafio", item.story.challenge],
                  ["Solução", item.story.solution],
                  ["Resultado", item.story.result],
                ] as const
              ).map(([title, text], i) => (
                <div key={title}>
                  <p className="t-micro text-fg/40">0{i + 1}</p>
                  <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em]">{title}</h3>
                  <p className="mt-3 leading-relaxed text-fg/60">{text}</p>
                </div>
              ))}
            </div>

            {item.highlights && (
              <div className="mt-24">
                <p className="t-micro text-orange">O que entregamos</p>
                <ul className="mt-8 grid gap-px overflow-hidden rounded-[1.25rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                  {item.highlights.map((h, i) => (
                    <li key={h.title} className="group/hl bg-ink-2 p-7 transition-colors duration-500 hover:bg-ink-3 md:p-8">
                      <span className="t-micro flex items-center gap-3 text-fg/40">
                        <span className="brand-square transition-transform duration-500 group-hover/hl:rotate-45" aria-hidden="true" />
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em]">{h.title}</h3>
                      <p className="mt-2 leading-relaxed text-fg/55">{h.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.screens && (
              <div className="mt-24 border-t border-line pt-10">
                <p className="t-micro text-orange">Por dentro do produto</p>
                <div className="mt-12 space-y-20 md:space-y-28">
                  {item.screens.map((screen, i) => (
                    <CaseScreenFigure
                      key={screen.src}
                      screen={screen}
                      index={i}
                      flip={item.screens!.slice(0, i).filter((s) => s.layout === "scroll").length % 2 === 1}
                    />
                  ))}
                </div>
              </div>
            )}

            {next && (
              <button
                type="button"
                onClick={() => onNavigate(next)}
                className="group mt-20 flex w-full items-center justify-between border-t border-line pt-8 text-left"
              >
                <span>
                  <span className="t-micro block text-fg/40">Próximo case</span>
                  <span className="mt-2 block text-[clamp(1.5rem,3vw,2.75rem)] font-semibold tracking-[-0.035em] transition-colors group-hover:text-orange">
                    {next.title}
                  </span>
                </span>
                <span className="grid size-14 place-items-center rounded-full border border-fg/20 transition-colors group-hover:border-orange group-hover:bg-orange group-hover:text-ink">
                  <Arrow className="size-4" />
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}

/**
 * Tela do produto: inteira ("wide") ou percorrida pela rolagem ("scroll"), com texto ao lado.
 * `flip` alterna o lado entre telas "scroll" consecutivas.
 */
function CaseScreenFigure({ screen, index, flip }: { screen: CaseScreen; index: number; flip: boolean }) {
  const number = String(index + 1).padStart(2, "0");
  const scroll = screen.layout === "scroll";

  const frame = (
    <div className={cn("overflow-hidden", screen.chrome && "rounded-[0.9rem] border border-fg/12 bg-ink-3 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)]", !screen.chrome && "rounded-[1.25rem]")}>
      {screen.chrome && (
        <div className="flex h-9 items-center gap-1.5 border-b border-fg/10 bg-ink-4 px-4" aria-hidden="true">
          {[0, 1, 2].map((d) => (
            <span key={d} className="size-2 rounded-full bg-fg/20" />
          ))}
          <span className="t-micro mx-auto truncate rounded-full bg-ink-2 px-4 py-1 normal-case tracking-[0.02em] text-fg/45">{screen.chrome}</span>
          <span className="w-8" />
        </div>
      )}
      {scroll ? (
        <div data-pan className="relative aspect-[4/3] overflow-hidden motion-reduce:aspect-auto">
          <Image src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} sizes="(min-width: 1024px) 860px, 100vw" className="h-auto w-full will-change-transform" />
          <span aria-hidden="true" className="absolute inset-y-3 right-1.5 w-[3px] overflow-hidden rounded-full bg-ink/15 motion-reduce:hidden">
            <span data-pan-bar className="block size-full origin-top rounded-full bg-orange" />
          </span>
        </div>
      ) : (
        <Image src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} sizes="(min-width: 1280px) 1200px, 100vw" className="h-auto w-full" />
      )}
    </div>
  );

  const text = (
    <figcaption>
      <p className="t-micro text-fg/40">{screen.kicker ?? `Tela ${number}`}</p>
      <h3 className="t-h3 mt-4">{screen.title}</h3>
      <p className="mt-4 max-w-[34rem] leading-relaxed text-fg/60">{screen.caption}</p>
      {screen.points && (
        <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
          {screen.points.map((point) => (
            <li key={point} className="flex items-center gap-3 text-[0.9375rem] text-fg/75">
              <span className="size-1.5 shrink-0 bg-orange" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      )}
    </figcaption>
  );

  if (!scroll) {
    return (
      <figure>
        {frame}
        <figcaption className="mt-8 grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="t-micro text-fg/40">{screen.kicker ?? `Tela ${number}`}</p>
            <h3 className="t-h3 mt-4">{screen.title}</h3>
          </div>
          <p className="max-w-[34rem] leading-relaxed text-fg/60 lg:col-span-5 lg:col-start-8">{screen.caption}</p>
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className={cn("lg:col-span-8", flip && "lg:order-2")}>{frame}</div>
      <div className={cn("lg:col-span-4", flip && "lg:order-1")}>
        <div className="lg:sticky lg:top-28">{text}</div>
      </div>
    </figure>
  );
}
