"use client";

import type { RefObject } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { ease, media } from "@/lib/motion";

/**
 * Coreografia padrão de entrada de uma seção:
 * - `[data-split]`: títulos revelados linha a linha através de máscara.
 * - `[data-reveal]`: blocos sobem com fade + desfoque. `data-reveal-delay` opcional.
 * - `[data-line]`: filetes que se desenham (scaleX).
 * Nada fica escondido via CSS — com movimento reduzido, tudo já está visível.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 112,
                duration: 1.4,
                ease: ease.out,
                stagger: 0.09,
                scrollTrigger: { trigger: el, start: "top 86%", toggleActions: "play none none none" },
              }),
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal]", root).forEach((el) => {
          gsap.from(el, {
            y: 36,
            autoAlpha: 0,
            filter: "blur(8px)",
            duration: 1.3,
            ease: ease.out,
            delay: Number(el.dataset.revealDelay ?? 0),
            clearProps: "filter",
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-line]", root).forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.6,
            ease: ease.inOut,
            scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" },
          });
        });
      });
    },
    { scope },
  );
}
