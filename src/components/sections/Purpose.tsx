"use client";

import { useMemo, useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { media, seeded } from "@/lib/motion";
import { sectionIndex } from "@/content/sections";
import { useReveal } from "@/hooks/useReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

const BELIEFS = ["entender.", "Questionar.", "Criar.", "Testar.", "E construir a solução certa."];

function ridge(seed: number, base: number, amp: number, freq: number) {
  const r = seeded(seed);
  const ph = [r() * 6, r() * 6, r() * 6];
  let d = `M0 800 L0 ${base}`;
  for (let x = 0; x <= 1200; x += 8) {
    const ridged = (v: number) => (1 - Math.abs(Math.sin(v))) ** 2;
    const n =
      0.62 * ridged(x * freq + ph[0]!) +
      0.28 * ridged(x * freq * 2.3 + ph[1]!) +
      0.1 * ridged(x * freq * 5.7 + ph[2]!) +
      0.04 * Math.sin(x * freq * 13 + ph[0]!);
    d += ` L${x} ${(base - amp * n).toFixed(1)}`;
  }
  return `${d} L1200 800 Z`;
}

/** Paisagem gerada — sem fotos de banco: cada camada é uma cordilheira procedural. */
function Horizon() {
  const layers = useMemo(
    () => [
      { d: ridge(3, 520, 150, 0.006), fill: "#7a4128", opacity: 0.5, depth: 0.2 },
      { d: ridge(11, 585, 170, 0.0048), fill: "#43261b", opacity: 0.9, depth: 0.45 },
      { d: ridge(23, 660, 150, 0.0042), fill: "#1d1411", opacity: 1, depth: 0.7 },
      { d: ridge(41, 745, 110, 0.0036), fill: "#0b0909", opacity: 1, depth: 1 },
    ],
    [],
  );

  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <linearGradient id="purpose-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#090b0d" />
          <stop offset="0.38" stopColor="#1f1612" />
          <stop offset="0.6" stopColor="#7a3d1f" />
          <stop offset="0.7" stopColor="#e07d43" />
          <stop offset="0.76" stopColor="#ffc59a" />
        </linearGradient>
        <radialGradient id="purpose-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff1e2" />
          <stop offset="0.12" stopColor="#ffc89c" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#f17631" stopOpacity="0.35" />
          <stop offset="1" stopColor="#f17631" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#purpose-sky)" />
      <g data-sun>
        <circle cx="760" cy="560" r="420" fill="url(#purpose-sun)" />
      </g>
      {layers.map((l, i) => (
        <path key={i} data-depth={l.depth} d={l.d} fill={l.fill} fillOpacity={l.opacity} />
      ))}
    </svg>
  );
}

export function Purpose() {
  const rootRef = useRef<HTMLElement>(null);
  useReveal(rootRef);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        // Janela: abre com clip-path; camadas se deslocam em profundidades diferentes.
        const scene = root.querySelector("[data-scene]");
        gsap.fromTo(
          scene,
          { clipPath: "inset(14% 10% 14% 10% round 28px)" },
          { clipPath: "inset(0% 0% 0% 0% round 20px)", ease: "none", scrollTrigger: { trigger: scene, start: "top 95%", end: "top 25%", scrub: true } },
        );
        gsap.utils.toArray<SVGPathElement>("[data-depth]", root).forEach((layer) => {
          const depth = Number(layer.dataset.depth);
          gsap.fromTo(layer, { y: depth * 70 }, { y: -depth * 50, ease: "none", scrollTrigger: { trigger: scene, start: "top bottom", end: "bottom top", scrub: true } });
        });
        gsap.fromTo("[data-sun]", { y: 70 }, { y: -60, ease: "none", scrollTrigger: { trigger: scene, start: "top bottom", end: "bottom top", scrub: true } });

        // Crenças: cada palavra acende conforme a leitura avança.
        gsap.fromTo(
          "[data-belief]",
          { opacity: 0.16 },
          { opacity: 1, stagger: 0.3, ease: "none", scrollTrigger: { trigger: "[data-beliefs]", start: "top 75%", end: "bottom 45%", scrub: true } },
        );

        // Declaração: "im" é riscado e "possível" permanece.
        const statement = root.querySelector<HTMLElement>("[data-statement]");
        const answer = root.querySelector<HTMLElement>("[data-answer]");
        if (!statement || !answer) return;
        const split = SplitText.create(answer, { type: "words", mask: "words", wordsClass: "split-word" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: statement,
            start: "top top",
            end: () => `+=${window.innerHeight * 2.2}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        tl.from("[data-line1] > span", { yPercent: 110, duration: 1, stagger: 0.12, ease: "expo.out" })
          .from("[data-strike]", { scaleX: 0, duration: 0.7, ease: "power2.inOut" }, "+=0.3")
          .to("[data-dim]", { opacity: 0.16, duration: 0.6 }, "+=0.05")
          .to("[data-im]", { opacity: 0.12, yPercent: 8, filter: "blur(3px)", duration: 0.6 }, "<")
          .from(split.words, { yPercent: 105, duration: 1, stagger: 0.06, ease: "expo.out" }, "+=0.1")
          .from("[data-underline]", { scaleX: 0, duration: 0.8, ease: "power2.inOut" }, "-=0.3")
          .to({}, { duration: 0.6 });

        return () => split.revert();
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} id="proposito" aria-labelledby="purpose-title" className="relative bg-ink">
      <div className="container-x grid gap-16 py-32 md:py-40 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5 lg:pt-10">
          <SectionLabel index={sectionIndex("proposito")}>Nosso propósito</SectionLabel>
          <h2 id="purpose-title" data-split className="t-h2 mt-8 max-w-[11ch]">
            Existe sempre uma maneira <span className="text-orange">melhor.</span>
          </h2>
          <div className="mt-10 max-w-[30rem] space-y-6 text-[1.0625rem] leading-relaxed text-fg/60">
            <p data-reveal>
              Cada negócio possui desafios diferentes. Cada marca possui uma história. Cada cliente possui uma necessidade.
            </p>
            <p data-reveal className="text-fg">Por isso, não acreditamos em soluções prontas.</p>
          </div>
          <p data-beliefs className="mt-12 text-[clamp(1.6rem,2.4vw,2.4rem)] font-semibold leading-[1.15] tracking-[-0.035em]">
            <span className="text-fg/40">Acreditamos em </span>
            {BELIEFS.map((b, i) => (
              <span key={b} data-belief className={i === BELIEFS.length - 1 ? "block text-orange" : undefined}>
                {b}{" "}
              </span>
            ))}
          </p>
        </div>

        <figure className="relative lg:col-span-7">
          <div data-scene className="relative aspect-[4/5] overflow-hidden rounded-[20px] md:aspect-[5/4] lg:sticky lg:top-24 lg:aspect-auto lg:h-[min(78vh,760px)]" data-cursor="view">
            <Horizon />
            {/* Caixilho: a vista é emoldurada como uma janela de arquitetura */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute inset-y-0 left-[63%] w-[6px] bg-ink/90" />
              <div className="absolute inset-x-0 top-0 h-[7%] bg-gradient-to-b from-ink to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-ink/90 to-transparent" />
            </div>
            <figcaption className="t-micro absolute bottom-5 left-5 right-5 flex justify-between text-fg/55">
              <span>Fig. 01 — O próximo horizonte</span>
              <span className="hidden sm:inline">Sempre há um próximo passo</span>
            </figcaption>
          </div>
        </figure>
      </div>

      {/* Declaração principal */}
      <div data-statement className="relative flex min-h-[100svh] items-center overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_38%_at_50%_68%,rgba(241,118,49,0.12),transparent_100%)]" />
        <div className="container-x relative">
          <p className="t-label mb-10 text-fg/40">Nossa filosofia</p>
          <p className="t-mega">
            <span className="sr-only">Não existe impossível.</span>
            <span data-line1 className="block overflow-hidden pb-[0.06em]" aria-hidden="true">
              <span data-dim className="inline-block">Não existe</span>
            </span>
            <span data-line1 className="block overflow-hidden pb-[0.06em]" aria-hidden="true">
              <span className="relative inline-block">
                <span data-im className="relative inline-block">
                  im
                  <span data-strike className="absolute left-[-0.04em] right-[-0.04em] top-[54%] block h-[0.075em] origin-left bg-orange" />
                </span>
                <span>possível.</span>
              </span>
            </span>
          </p>
          <p data-answer className="t-h2 mt-12 max-w-[22ch] text-fg/90 md:mt-16">
            Existe a{" "}
            <span className="relative inline-block text-orange">
              melhor solução
              <span data-underline aria-hidden="true" className="absolute -bottom-1 left-0 right-0 block h-px origin-left bg-orange" />
            </span>{" "}
            para o que você precisa.
          </p>
        </div>
      </div>
    </section>
  );
}
