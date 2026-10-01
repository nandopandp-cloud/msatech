"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { media } from "@/lib/motion";
import { stats } from "@/content/stats";
import { clients, type Client } from "@/content/clients";
import { sectionIndex } from "@/content/sections";
import { useReveal } from "@/hooks/useReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

const PLACEHOLDER = "XX";

function ClientSlot({ client, duplicate }: { client: Client; duplicate?: boolean }) {
  return (
    <li aria-hidden={duplicate || undefined} className="group flex h-24 w-[13rem] shrink-0 items-center justify-center rounded-2xl border border-line transition-colors duration-500 hover:border-orange/40 md:h-28 md:w-[15rem]">
      {client.logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- SVGs de logo monocromáticos, sem ganho com otimização
        <img src={client.logo} alt={client.name} className="max-h-10 w-auto max-w-[70%] opacity-60 transition-opacity duration-500 group-hover:opacity-100" loading="lazy" />
      ) : (
        <span className="flex items-center gap-3 text-fg/35 transition-colors duration-500 group-hover:text-fg">
          <span aria-hidden="true" className="size-2 bg-current transition-colors duration-500 group-hover:bg-orange" />
          <span className="t-label">{client.name}</span>
        </span>
      )}
    </li>
  );
}

/**
 * Prova de capacidade + clientes.
 * Números: count-up quando há dado real; "XX" com embaralhamento enquanto não há.
 * Marquee: dois trilhos em sentidos opostos, acelerados pela velocidade do scroll.
 */
export function Proof() {
  const rootRef = useRef<HTMLElement>(null);
  useReveal(rootRef);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add(media.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-stat]", root).forEach((el) => {
          const raw = el.dataset.value;
          const target = raw ? Number(raw) : null;
          ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            once: true,
            onEnter: () => {
              if (target !== null) {
                const counter = { v: 0 };
                gsap.to(counter, {
                  v: target,
                  duration: 2.2,
                  ease: "expo.out",
                  onUpdate: () => {
                    el.textContent = Math.round(counter.v).toLocaleString("pt-BR");
                  },
                });
              } else {
                const glyphs = "0123456789";
                const scramble = { t: 0 };
                gsap.to(scramble, {
                  t: 1,
                  duration: 1.4,
                  ease: "power2.out",
                  onUpdate: () => {
                    el.textContent =
                      scramble.t > 0.92
                        ? PLACEHOLDER
                        : PLACEHOLDER.split("")
                            .map(() => glyphs[Math.floor(Math.random() * glyphs.length)])
                            .join("");
                  },
                });
              }
            },
          });
        });

        // Marquee reativo ao scroll.
        const rows = gsap.utils.toArray<HTMLElement>("[data-marquee]", root);
        const loops = rows.map((row, i) =>
          gsap.fromTo(row, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 46, ease: "none", repeat: -1 }),
        );
        ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 6);
            loops.forEach((loop) => {
              gsap.to(loop, { timeScale: boost * self.direction, duration: 0.2, overwrite: true });
              gsap.to(loop, { timeScale: self.direction, duration: 1.4, delay: 0.2, ease: "power2.out" });
            });
          },
        });
      });
    },
    { scope: rootRef },
  );

  const rows = [clients, [...clients].reverse()];

  return (
    <section ref={rootRef} id="clientes" aria-labelledby="clients-title" className="relative overflow-hidden bg-ink pb-28 pt-10 md:pb-40">
      <div className="container-x">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="relative flex flex-col pt-6">
              <span data-line aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-fg/15" />
              <dt className="t-micro order-2 mt-4 text-fg/50">{s.label}</dt>
              <dd className="order-1 flex items-baseline text-[clamp(3.25rem,7vw,7.5rem)] font-semibold leading-none tracking-[-0.06em]">
                {s.prefix && <span className="text-orange">{s.prefix}</span>}
                <span data-stat data-value={s.value ?? undefined} className="tabular-nums">
                  {s.value !== null ? s.value.toLocaleString("pt-BR") : PLACEHOLDER}
                </span>
                {s.suffix && <span className="text-orange">{s.suffix}</span>}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-32 grid gap-8 md:mt-40 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SectionLabel index={sectionIndex("clientes")}>Nossos clientes</SectionLabel>
            <h2 id="clients-title" data-split className="t-h2 mt-8 max-w-[18ch]">
              Marcas que já estão construindo o próximo passo.
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-16 space-y-4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        {rows.map((row, r) => (
          <div key={r} className="overflow-hidden">
            <ul data-marquee className="flex w-max gap-4" aria-hidden={r > 0 || undefined}>
              {[...row, ...row].map((c, i) => (
                <ClientSlot key={`${c.name}-${i}`} client={c} duplicate={i >= row.length} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
