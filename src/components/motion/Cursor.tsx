"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { media } from "@/lib/motion";
import { cn } from "@/lib/cn";

type CursorState = "default" | "link" | "view" | "explore" | "talk" | "hidden";

const LABELS: Partial<Record<CursorState, string>> = {
  view: "View",
  explore: "Explore",
  talk: "Let’s talk",
};

const INTERACTIVE = "[data-cursor], a, button, [role='button'], label, input, textarea, select, summary";

function resolveState(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) return "default";
  const el = target.closest(INTERACTIVE);
  if (!el) return "default";
  if (el.matches("input, textarea, select")) return "hidden";
  const explicit = el.getAttribute("data-cursor") as CursorState | null;
  return explicit ?? "link";
}

/**
 * Cursor customizado — ponto (default), anel (links) e bolha com rótulo
 * (imagens, cases e CTAs). Só existe em ponteiros finos.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("default");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(media.finePointer);
    const sync = () => setEnabled(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  // <dialog> modal vive na top layer, acima de qualquer z-index. O cursor também
  // vai para lá (popover) e é reerguido sempre que um dialog abre, para ficar por cima.
  useEffect(() => {
    const layer = layerRef.current;
    if (!enabled || !layer || typeof layer.showPopover !== "function") return;
    const raise = () => {
      if (layer.matches(":popover-open")) layer.hidePopover();
      layer.showPopover();
    };
    raise();
    const observer = new MutationObserver(raise);
    observer.observe(document.body, { subtree: true, attributeFilter: ["open"] });
    return () => observer.disconnect();
  }, [enabled]);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!enabled || !dot || !ring) return;

    const html = document.documentElement;
    html.classList.add("has-cursor");
    const reduced = window.matchMedia(media.reduced).matches;

    const dx = gsap.quickTo(dot, "x", { duration: reduced ? 0 : 0.12, ease: "power3.out" });
    const dy = gsap.quickTo(dot, "y", { duration: reduced ? 0 : 0.12, ease: "power3.out" });
    const rx = gsap.quickTo(ring, "x", { duration: reduced ? 0 : 0.55, ease: "power3.out" });
    const ry = gsap.quickTo(ring, "y", { duration: reduced ? 0 : 0.55, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      setVisible(true);
    };
    const over = (e: PointerEvent) => setState(resolveState(e.target));
    const leave = () => setVisible(false);
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });

    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled]);

  if (!enabled) return null;

  const label = LABELS[state];
  const hasLabel = Boolean(label);

  return (
    <div
      ref={layerRef}
      popover="manual"
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-[90] m-0 size-full max-h-none max-w-none overflow-visible border-0 bg-transparent p-0 transition-opacity duration-300", visible && state !== "hidden" ? "opacity-100" : "opacity-0",
      )}
    >
      <div ref={ringRef} className="absolute left-0 top-0">
        <div
          className={cn(
            "absolute left-0 top-0 grid place-items-center rounded-full transition-[width,height,background-color,border-color,translate] duration-500 ease-[var(--ease-out-expo)]",
            // CTAs: a bolha flutua ao lado do ponteiro para não cobrir o rótulo do botão.
            state === "talk" ? "translate-x-5 translate-y-5" : "-translate-x-1/2 -translate-y-1/2",
            state === "link" && "size-12 border border-white mix-blend-difference",
            state === "default" && "size-0 border border-transparent",
            hasLabel && (state === "talk" ? "size-[5.5rem]" : "size-24"),
            state === "talk" && "bg-orange",
            (state === "view" || state === "explore") && "bg-fg",
            pressed && "scale-90",
          )}
        >
          <span className={cn("t-micro font-medium text-ink transition-opacity duration-300", hasLabel ? "opacity-100 delay-100" : "opacity-0")}>{label}</span>
        </div>
      </div>
      <div ref={dotRef} className="absolute left-0 top-0 mix-blend-difference">
        <div className={cn("size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-transform duration-300", state !== "default" && state !== "talk" && "scale-0")} />
      </div>
    </div>
  );
}
