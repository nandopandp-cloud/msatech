"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";
import { cn } from "@/lib/cn";
import { useMagnetic } from "@/hooks/useMagnetic";
import { Arrow } from "./Arrow";

type Variant = "primary" | "ghost" | "ghost-dark";
type Size = "md" | "lg" | "xl";
type CursorState = "link" | "talk" | "view" | "explore";

type ButtonProps = {
  children: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  size?: Size;
  icon?: "arrow" | "play" | "none";
  cursor?: CursorState;
  className?: string;
  disabled?: boolean;
  magnetic?: number;
  "aria-label"?: string;
};

const variants: Record<Variant, string> = {
  primary: "bg-orange text-ink [--fill:var(--color-fg)]",
  ghost: "text-fg border border-fg/25 [--fill:var(--color-fg)] hover:text-ink",
  "ghost-dark": "text-paper-ink border border-paper-ink/25 [--fill:var(--color-paper-ink)] hover:text-paper",
};

const sizes: Record<Size, string> = {
  md: "h-11 pl-5 pr-4 text-[0.8125rem] gap-3",
  lg: "h-14 pl-7 pr-5 text-[0.9375rem] gap-4",
  xl: "h-20 pl-10 pr-7 text-lg gap-5 md:h-24 md:pl-12 md:text-xl",
};

/**
 * Botão-assinatura: texto em "roll" vertical, seta que sai e reentra,
 * preenchimento que nasce do ponto de entrada do ponteiro e leve magnetismo.
 */
export function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  icon = "arrow",
  cursor = "link",
  className,
  disabled,
  magnetic = 0.28,
  ...rest
}: ButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  useMagnetic(ref, magnetic);

  const setOrigin = (e: PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  const content = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[var(--x,50%)] top-[var(--y,50%)] size-[260%] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-[var(--fill)] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-100"
      />
      <span className="relative block overflow-hidden whitespace-nowrap font-semibold tracking-[-0.01em]">
        <span className="block transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">{children}</span>
        <span aria-hidden="true" className="absolute inset-0 block translate-y-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-0">
          {children}
        </span>
      </span>
      {icon !== "none" && (
        <span
          aria-hidden="true"
          className={cn(
            "relative grid shrink-0 place-items-center overflow-hidden rounded-full",
            size === "xl" ? "size-12 md:size-14" : size === "lg" ? "size-8" : "size-6",
            variant === "primary" ? "bg-ink/10" : "",
          )}
        >
          {icon === "arrow" ? (
            <>
              <Arrow className="size-3.5 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-[320%]" />
              <Arrow className="absolute size-3.5 -translate-x-[320%] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-0" />
            </>
          ) : (
            <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
              <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
            </svg>
          )}
        </span>
      )}
    </>
  );

  const classes = cn(
    "group relative inline-flex select-none items-center justify-between overflow-hidden rounded-full transition-[color,opacity] duration-500",
    variants[variant],
    sizes[size],
    disabled && "pointer-events-none opacity-50",
    className,
  );

  if (href) {
    return (
      <a ref={ref} href={href} className={classes} data-cursor={cursor} onPointerEnter={setOrigin} onPointerLeave={setOrigin} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button ref={ref} type={type} onClick={onClick} className={classes} data-cursor={cursor} disabled={disabled} onPointerEnter={setOrigin} onPointerLeave={setOrigin} {...rest}>
      {content}
    </button>
  );
}
