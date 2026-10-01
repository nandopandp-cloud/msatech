import { cn } from "@/lib/cn";

/** Microtipografia de seção: "02 — Nossos serviços" (número sublinhado, texto na cor de acento). */
export function SectionLabel({ index, children, className, tone = "dark" }: { index: string; children: React.ReactNode; className?: string; tone?: "dark" | "light" }) {
  return (
    <p className={cn("t-label flex items-center gap-4", className)} data-reveal>
      <span className={cn("border-b pb-1", tone === "dark" ? "border-fg/25 text-fg/50" : "border-paper-ink/25 text-paper-ink/50")}>{index}</span>
      <span className={tone === "dark" ? "text-orange" : "text-orange-deep"}>{children}</span>
    </p>
  );
}
