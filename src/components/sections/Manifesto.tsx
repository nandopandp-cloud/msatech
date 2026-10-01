"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { media } from "@/lib/motion";
import { manifesto } from "@/content/manifesto";
import { Logo } from "@/components/ui/Logo";

const FPS = 24;
const RUNTIME_SECONDS = 42;

function timecode(progress: number) {
  const total = Math.floor(progress * RUNTIME_SECONDS * FPS);
  const f = total % FPS;
  const s = Math.floor(total / FPS) % 60;
  const m = Math.floor(total / FPS / 60);
  return `00:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
}

/**
 * Manifesto — dirigido como um curta. Enquadramento de câmera, timecode
 * atrelado ao scroll, cenas que entram com foco e saem desfocadas, e uma
 * luz que muda de lugar a cada frase.
 */
export function Manifesto() {
  const rootRef = useRef<HTMLElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const sceneRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        const shots = gsap.utils.toArray<HTMLElement>("[data-shot]", root);
        const question = root.querySelector<HTMLElement>("[data-question]");
        const split = question ? SplitText.create(question, { type: "words" }) : null;

        gsap.set(shots, { autoAlpha: 0 });
        gsap.set("[data-frame]", { scale: 1.08, autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight * 6}`,
            pin: "[data-manifesto-pin]",
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (tcRef.current) tcRef.current.textContent = timecode(self.progress);
              if (sceneRef.current) {
                const scene = self.progress < 0.55 ? 1 : self.progress < 0.75 ? 2 : 3;
                sceneRef.current.textContent = `0${scene}`;
              }
            },
          },
        });

        tl.to("[data-frame]", { scale: 1, autoAlpha: 1, duration: 0.8 });

        // Cena 1 — tudo muda.
        const lights = [
          { x: "-25%", y: "10%", c: "rgba(241,118,49,0.22)" },
          { x: "25%", y: "-15%", c: "rgba(13,107,117,0.3)" },
          { x: "-10%", y: "-20%", c: "rgba(241,118,49,0.18)" },
          { x: "20%", y: "20%", c: "rgba(13,107,117,0.26)" },
        ];
        shots.forEach((shot, i) => {
          const light = lights[i % lights.length]!;
          tl.fromTo(shot, { autoAlpha: 0, scale: 1.12, filter: "blur(18px)" }, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1 })
            .to("[data-light]", { xPercent: parseFloat(light.x), yPercent: parseFloat(light.y), backgroundColor: light.c, duration: 1.2, ease: "power2.inOut" }, "<")
            .to(shot, { autoAlpha: 0, scale: 0.94, y: -40, filter: "blur(12px)", duration: 0.8, ease: "power2.in" }, "+=0.5");
        });

        // Cena 2 — a pergunta.
        tl.set(question, { autoAlpha: 1 })
          .from(split?.words ?? [], { autoAlpha: 0, y: 30, filter: "blur(10px)", stagger: 0.08, duration: 0.9 })
          .to("[data-light]", { xPercent: 0, yPercent: 0, backgroundColor: "rgba(241,118,49,0.28)", duration: 1 }, "<")
          .to({}, { duration: 0.6 })
          .to(question, { autoAlpha: 0, filter: "blur(12px)", scale: 0.96, duration: 0.8, ease: "power2.in" });

        // Cena 3 — assinatura.
        tl.fromTo("[data-signature]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, "-=0.35")
          .fromTo("[data-signature-logo]", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power3.inOut" })
          .from("[data-pillar]", { autoAlpha: 0, y: 24, stagger: 0.25, duration: 0.8 }, "-=0.3")
          .to({}, { duration: 1 });

        return () => split?.revert();
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} id="manifesto" aria-label="Manifesto" className="relative bg-ink">
      <div data-manifesto-pin className="relative overflow-hidden motion-safe:h-[100svh] motion-reduce:py-32">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
          <div data-light className="size-[70vmax] rounded-full bg-[rgba(241,118,49,0.18)] blur-[120px]" />
        </div>

        {/* Enquadramento de câmera */}
        <div data-frame aria-hidden="true" className="pointer-events-none absolute inset-4 md:inset-8">
          <div className="absolute inset-0 border border-fg/10" />
          {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((pos) => (
            <span key={pos} className={`absolute size-5 border-fg/60 ${pos}`} />
          ))}
          <div className="t-micro absolute inset-x-4 top-4 flex justify-between text-fg/45 md:inset-x-6 md:top-5">
            <span>MSATech — Manifesto</span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 animate-[pulse-dot_1.6s_ease-in-out_infinite] rounded-full bg-orange" /> Rec
            </span>
          </div>
          <div className="t-micro absolute inset-x-4 bottom-4 flex justify-between tabular-nums text-fg/45 md:inset-x-6 md:bottom-5">
            <span>
              TC <span ref={tcRef}>00:00:00:00</span>
            </span>
            <span>
              Cena <span ref={sceneRef}>01</span> / 03
            </span>
          </div>
        </div>

        <div className="container-x relative grid h-full place-items-center motion-reduce:gap-16">
          {manifesto.changes.map((line) => (
            <p key={line} data-shot className="t-mega text-center motion-safe:[grid-area:1/1]">
              {line}
            </p>
          ))}

          <p
            data-question
            className="max-w-[18ch] text-center text-[clamp(2.25rem,6vw,6.5rem)] font-semibold leading-[1] tracking-[-0.05em] motion-safe:invisible motion-safe:[grid-area:1/1]"
          >
            Então por que sua experiência deveria <span className="text-orange">permanecer igual?</span>
          </p>

          <div data-signature className="flex flex-col items-center gap-10 motion-safe:invisible motion-safe:[grid-area:1/1]">
            <div data-signature-logo>
              <Logo className="h-auto w-[min(72vw,640px)]" title="MSATech" />
            </div>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 md:gap-x-10">
              {manifesto.pillars.map((p) => (
                <li key={p} data-pillar className="flex items-center gap-3 text-[clamp(1.1rem,2vw,1.75rem)] font-semibold tracking-[-0.03em]">
                  <span aria-hidden="true" className="size-2 bg-orange" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
