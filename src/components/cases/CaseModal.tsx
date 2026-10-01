"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { media } from "@/lib/motion";
import type { CaseStudy } from "@/content/cases";
import { useLenis } from "@/components/motion/SmoothScroll";
import { Arrow } from "@/components/ui/Arrow";
import { CaseArt } from "./CaseArt";

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
    panelRef.current?.scrollTo({ top: 0 });
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
            {item.image ? <Image src={item.image} alt="" fill sizes="1280px" className="object-cover" style={{ objectPosition: item.imagePosition }} /> : <CaseArt variant={item.art} />}
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
