"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { completeIntro, INTRO_STORAGE_KEY } from "@/lib/intro";
import { Logo } from "@/components/ui/Logo";

/**
 * Abertura cinematográfica (~2,4 s): o traço da marca é desenhado, ganha
 * preenchimento, "tech" sobe e os quadrados acendem. Pulável a qualquer momento
 * e exibida uma única vez por sessão.
 */
export function Intro() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || document.documentElement.dataset.intro === "skip") {
      completeIntro();
      return;
    }
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {
      /* armazenamento indisponível: a intro simplesmente toca de novo */
    }

    let tl: gsap.core.Timeline | undefined;
    const ctx = gsap.context(() => {
      const strokes = root.querySelectorAll<SVGPathElement>("[data-part='m'], [data-part='s']");
      const letters = root.querySelectorAll("[data-letter]");
      const squares = root.querySelectorAll("[data-part='square']");
      const mark = root.querySelector("[data-intro-mark]");
      const meta = root.querySelectorAll("[data-intro-meta]");

      strokes.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0, stroke: p.getAttribute("fill") ?? "#fff", strokeWidth: 2.5 });
      });

      tl = gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .to(strokes, { strokeDashoffset: 0, duration: 1.05, ease: "power2.inOut", stagger: 0.1 })
        .to(strokes, { fillOpacity: 1, strokeWidth: 0, duration: 0.45, ease: "power1.out" }, "-=0.3")
        .from(letters, { y: 70, autoAlpha: 0, duration: 0.8, stagger: 0.05 }, "-=0.4")
        .from(squares, { scale: 0, transformOrigin: "50% 50%", duration: 0.6, stagger: 0.09, ease: "back.out(2.4)" }, "-=0.6")
        .from(meta, { autoAlpha: 0, y: 8, duration: 0.6, stagger: 0.06 }, "-=0.6")
        .addLabel("exit", "+=0.2")
        .to(mark, { y: -24, autoAlpha: 0, filter: "blur(6px)", duration: 0.6, ease: "power3.in" }, "exit")
        .to(meta, { autoAlpha: 0, duration: 0.4 }, "exit")
        .call(completeIntro, [], "exit+=0.35")
        .to(root, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.05, ease: "power4.inOut" }, "exit+=0.25")
        .set(root, { display: "none" });
    }, root);

    const skip = () => {
      if (!tl) return;
      const exit = tl.labels.exit ?? 0;
      if (tl.time() < exit) tl.seek(exit);
      tl.timeScale(1.6);
    };
    const onKey = (e: KeyboardEvent) => {
      if (["Escape", "Enter", " "].includes(e.key)) skip();
    };
    root.addEventListener("click", skip);
    window.addEventListener("keydown", onKey);

    return () => {
      root.removeEventListener("click", skip);
      window.removeEventListener("keydown", onKey);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="intro-overlay fixed inset-0 z-[100] grid place-items-center bg-ink [clip-path:inset(0%_0%_0%_0%)]"
      role="presentation"
    >
      <div className="flex flex-col items-center gap-8">
        <div data-intro-mark>
          <Logo className="h-auto w-[min(62vw,320px)] overflow-visible" title="MSATech" />
        </div>
        <p data-intro-meta className="t-micro text-fg/45">
          Strategy · Brand · Experience · Technology
        </p>
      </div>
      <button type="button" data-intro-meta className="t-micro absolute bottom-8 right-6 text-fg/45 transition-colors hover:text-fg md:right-10">
        Pular intro
      </button>
      <span data-intro-meta className="t-micro absolute bottom-8 left-6 text-fg/30 md:left-10">
        MSATech / {new Date().getFullYear()}
      </span>
    </div>
  );
}
