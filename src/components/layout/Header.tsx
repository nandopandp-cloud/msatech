"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { mainNav } from "@/content/sections";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { media } from "@/lib/motion";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { useLenis } from "@/components/motion/SmoothScroll";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        setScrolled(y > 40);
        setHidden(self.direction === 1 && y > window.innerHeight * 0.9);
      },
    });
    return () => st.kill();
  }, []);

  // Menu mobile: trava o scroll, foca o primeiro link e fecha com Esc.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const first = menuRef.current?.querySelector<HTMLElement>("a");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  useGSAP(
    () => {
      if (!open || !menuRef.current) return;
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        gsap.from(menuRef.current!.querySelectorAll("[data-menu-item]"), {
          yPercent: 120,
          duration: 1.1,
          stagger: 0.06,
          ease: "expo.out",
          delay: 0.15,
        });
      });
    },
    { dependencies: [open] },
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-[var(--ease-out-expo)]",
          hidden && !open && "-translate-y-full",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 border-b transition-[background-color,border-color,backdrop-filter] duration-500",
            scrolled && !open ? "border-line bg-ink/65 backdrop-blur-xl" : "border-transparent bg-transparent",
          )}
        />
        <div className={cn("container-x relative flex items-center justify-between transition-[height] duration-500", scrolled ? "h-16" : "h-20 md:h-24")}>
          <a href="#top" aria-label="MSATech — voltar ao início" className="relative z-10 block" data-hero-in="header">
            <Logo className="h-6 w-auto md:h-7" />
          </a>

          <nav aria-label="Principal" className="hidden lg:block" data-hero-in="header">
            <ul className="flex items-center gap-9">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="link-underline text-[0.8125rem] font-medium text-fg/75 transition-colors hover:text-fg">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3" data-hero-in="header">
            <div className="hidden md:block">
              <Button href="#contato" variant="ghost" cursor="talk" className="!border-orange/70">
                Falar com a MSATech
              </Button>
            </div>
            <button
              ref={toggleRef}
              type="button"
              className="relative z-10 grid size-11 place-items-center rounded-full border border-fg/20 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className={cn("absolute h-px w-4 bg-fg transition-transform duration-500 ease-[var(--ease-out-expo)]", open ? "rotate-45" : "-translate-y-[3px]")} />
              <span className={cn("absolute h-px w-4 bg-fg transition-transform duration-500 ease-[var(--ease-out-expo)]", open ? "-rotate-45" : "translate-y-[3px]")} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        className={cn(
          "fixed inset-0 z-40 flex flex-col bg-ink pt-28 transition-[clip-path,visibility] duration-700 ease-[var(--ease-in-out-quart)] lg:hidden",
          open ? "visible [clip-path:inset(0_0_0_0)]" : "invisible [clip-path:inset(0_0_100%_0)]",
        )}
        aria-hidden={!open}
      >
        <nav aria-label="Menu" className="container-x flex-1">
          <ul className="flex flex-col gap-1">
            {mainNav.map((item, i) => (
              <li key={item.href} className="overflow-hidden border-b border-line">
                <a
                  data-menu-item
                  href={item.href}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-4 text-[clamp(2rem,9vw,3.5rem)] font-semibold tracking-[-0.04em]"
                >
                  {item.label}
                  <span className="t-micro text-orange">{String(i + 1).padStart(2, "0")}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="container-x flex items-center justify-between pb-10 pt-8">
          <p className="t-micro text-fg/40">{site.tagline}</p>
          <span className="brand-square" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}
