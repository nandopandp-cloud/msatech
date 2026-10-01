"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { media } from "@/lib/motion";

/** Inclinação 3D muito sutil seguindo o ponteiro. */
export function useTilt(ref: RefObject<HTMLElement | null>, max = 3) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia(media.finePointer).matches || window.matchMedia(media.reduced).matches) return;
    gsap.set(el, { transformPerspective: 1200 });
    const rx = gsap.quickTo(el, "rotateX", { duration: 0.9, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotateY", { duration: 0.9, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * max * 2);
      rx(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [ref, max]);
}
