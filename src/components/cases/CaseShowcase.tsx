import Image from "next/image";
import { useId } from "react";
import type { CaseStudy } from "@/content/cases";

type Showcase = NonNullable<CaseStudy["showcase"]>;

/**
 * Capa composta: a tela real do produto em perspectiva, sobre arcos nas cores
 * da marca do cliente. Proporções em %, então serve ao card e ao modal.
 */
export function CaseShowcase({ showcase, sizes }: { showcase: Showcase; sizes: string }) {
  const uid = useId().replace(/:/g, "");
  const { primary, secondary } = showcase.colors;

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink [perspective:1800px]">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: `radial-gradient(90% 80% at 80% 0%, ${primary}33 0%, transparent 60%), radial-gradient(70% 60% at 100% 100%, ${secondary}26 0%, transparent 70%)` }}
      />
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <linearGradient id={`${uid}-a`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor={primary} stopOpacity="0" />
            <stop offset="0.55" stopColor={primary} stopOpacity="0.85" />
            <stop offset="1" stopColor={primary} stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id={`${uid}-b`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor={secondary} stopOpacity="0" />
            <stop offset="0.6" stopColor={secondary} stopOpacity="0.9" />
            <stop offset="1" stopColor={secondary} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <path d="M-40 700 C 160 420, 420 120, 860 -80" fill="none" stroke={`url(#${uid}-a)`} strokeWidth="110" />
        <path d="M150 760 C 350 470, 610 170, 1060 -40" fill="none" stroke={`url(#${uid}-b)`} strokeWidth="80" />
        <path d="M-40 700 C 160 420, 420 120, 860 -80" fill="none" stroke="#eeece7" strokeOpacity="0.12" strokeWidth="1" transform="translate(-70 0)" />
      </svg>

      {/* Tela do produto */}
      <div className="absolute left-[24%] top-[16%] w-[86%] origin-left max-sm:left-[30%] max-sm:top-[9%] max-sm:opacity-60 transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] [transform:rotateY(-16deg)_rotateX(6deg)] group-hover:[transform:rotateY(-9deg)_rotateX(3deg)]">
        <div className="overflow-hidden rounded-[0.6rem] border border-fg/15 bg-ink-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.75),0_0_0_1px_rgba(0,0,0,0.4)]">
          <div className="flex h-[3.2%] min-h-3 items-center gap-1 border-b border-fg/10 bg-ink-4 px-2.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-1.5 rounded-full bg-fg/25" />
            ))}
          </div>
          <Image src={showcase.screen} alt="" width={showcase.width} height={showcase.height} sizes={sizes} className="h-auto w-full" />
        </div>
      </div>

      {showcase.chips && (
        <ul className="absolute left-[5%] top-[22%] flex flex-col gap-2.5 max-sm:hidden" aria-hidden="true">
          {showcase.chips.map((chip, i) => (
            <li
              key={chip.label}
              className="rounded-xl border border-fg/12 bg-ink/55 px-3.5 py-2.5 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md"
              style={{ marginLeft: `${i * 1.5}rem` }}
            >
              <span className="flex items-center gap-2 text-[0.6875rem] text-fg/55">
                <span className="size-1.5 rounded-full animate-[pulse-dot_2.4s_ease-in-out_infinite]" style={{ background: primary }} />
                {chip.label}
              </span>
              <span className="mt-1 block text-[0.9375rem] font-semibold tracking-[-0.02em] text-fg">{chip.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
