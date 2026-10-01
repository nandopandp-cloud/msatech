import { useId } from "react";
import { seeded } from "@/lib/motion";
import type { CaseArt as CaseArtVariant } from "@/content/cases";

/**
 * Capas generativas para cases sem imagem. Quatro atmosferas distintas
 * dentro da mesma paleta — substituídas automaticamente quando `image` existir.
 */
export function CaseArt({ variant }: { variant: CaseArtVariant }) {
  const uid = useId().replace(/:/g, "");
  const id = (n: string) => `${uid}-${n}`;

  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#07090a" />
          <stop offset="0.5" stopColor="#1a1310" />
          <stop offset="0.62" stopColor="#8a4421" />
          <stop offset="0.68" stopColor="#f3a06a" />
          <stop offset="0.7" stopColor="#120d0b" />
          <stop offset="1" stopColor="#050607" />
        </linearGradient>
        <radialGradient id={id("glow")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffc69c" stopOpacity="0.9" />
          <stop offset="0.3" stopColor="#f17631" stopOpacity="0.3" />
          <stop offset="1" stopColor="#f17631" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("planet")} cx="0.7" cy="0.2" r="0.9">
          <stop offset="0" stopColor="#1c2a2c" />
          <stop offset="0.6" stopColor="#090b0c" />
          <stop offset="1" stopColor="#050607" />
        </radialGradient>
        <linearGradient id={id("rim")} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#f17631" stopOpacity="0" />
          <stop offset="1" stopColor="#ffb07a" />
        </linearGradient>
      </defs>

      {variant === "horizon" && (
        <g>
          <rect width="800" height="600" fill={`url(#${id("sky")})`} />
          <ellipse cx="400" cy="405" rx="260" ry="120" fill={`url(#${id("glow")})`} />
          {Array.from({ length: 17 }, (_, i) => {
            const x = -800 + i * 150;
            return <path key={i} d={`M400 412 L${x} 640`} stroke="#eeece7" strokeOpacity={0.05 + (i === 8 ? 0.1 : 0)} />;
          })}
          {Array.from({ length: 9 }, (_, i) => {
            const y = 412 + Math.pow(i + 1, 2) * 3;
            return <path key={i} d={`M0 ${y}H800`} stroke="#eeece7" strokeOpacity={0.03 + i * 0.008} />;
          })}
          <path d="M400 414 L380 640 M400 414 L420 640" stroke="#f17631" strokeOpacity="0.85" strokeDasharray="10 14" />
          <path d="M392 414 L250 640 M408 414 L550 640" stroke="#ffb07a" strokeOpacity="0.4" />
          <rect x="396" y="404" width="8" height="8" fill="#f17631" />
        </g>
      )}

      {variant === "orbit" && (
        <g>
          <rect width="800" height="600" fill="#060708" />
          <circle cx="560" cy="760" r="520" fill={`url(#${id("planet")})`} />
          <path d="M80 640 A520 520 0 0 1 1060 420" fill="none" stroke={`url(#${id("rim")})`} strokeWidth="2" />
          <ellipse cx="400" cy="300" rx="360" ry="90" transform="rotate(-14 400 300)" fill="none" stroke="#eeece7" strokeOpacity="0.14" />
          <ellipse cx="400" cy="300" rx="290" ry="60" transform="rotate(-14 400 300)" fill="none" stroke="#eeece7" strokeOpacity="0.08" strokeDasharray="2 6" />
          <rect x="702" y="200" width="10" height="10" fill="#f17631" />
          <circle cx="707" cy="205" r="22" fill="none" stroke="#f17631" strokeOpacity="0.35" />
          {Array.from({ length: 60 }, (_, i) => {
            const r = seeded(i + 5);
            return <rect key={i} x={r() * 800} y={r() * 330} width="1.5" height="1.5" fill="#eeece7" fillOpacity={0.15 + r() * 0.5} />;
          })}
        </g>
      )}

      {variant === "topography" && (
        <g fill="none">
          <rect width="800" height="600" fill="#060809" />
          {Array.from({ length: 18 }, (_, i) => {
            const r = seeded(i + 30);
            const k = 30 + i * 22;
            let d = "";
            for (let a = 0; a <= 64; a++) {
              const t = (a / 64) * Math.PI * 2;
              const wobble = 1 + 0.12 * Math.sin(t * 3 + i * 0.4) + 0.06 * Math.sin(t * 7 + r() * 0.2);
              const x = 470 + Math.cos(t) * k * wobble * 1.25;
              const y = 290 + Math.sin(t) * k * wobble * 0.85;
              d += `${a === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
            }
            return <path key={i} d={`${d}Z`} stroke={i % 5 === 0 ? "#0d6b75" : "#eeece7"} strokeOpacity={i % 5 === 0 ? 0.9 : 0.1 + (18 - i) * 0.008} />;
          })}
          <rect x="465" y="285" width="10" height="10" fill="#f17631" />
          <path d="M475 290 H620" stroke="#f17631" strokeOpacity="0.6" />
          <text x="628" y="294" fill="#eeece7" fillOpacity="0.55" fontFamily="monospace" fontSize="11" letterSpacing="2">
            PICO
          </text>
        </g>
      )}

      {variant === "monolith" && (
        <g>
          <rect width="800" height="600" fill="#060708" />
          <path d="M0 470 L800 410 L800 600 L0 600Z" fill="#0b0c0d" />
          <path d="M120 120 L560 80 L560 460 L120 480Z" fill="#1a1d1f" />
          <path d="M560 80 L700 110 L700 440 L560 460Z" fill="#0e1011" />
          {[200, 260, 320, 380].map((y, i) => (
            <path key={y} d={`M140 ${y + 8 - i * 3} L540 ${y - 28 - i * 2}`} stroke="#f17631" strokeWidth={i === 1 ? 3 : 1.5} strokeOpacity={0.95 - i * 0.18} />
          ))}
          <path d="M140 528 L540 492" stroke="#f17631" strokeOpacity="0.25" strokeWidth="6" />
          <ellipse cx="340" cy="510" rx="320" ry="40" fill={`url(#${id("glow")})`} opacity="0.6" />
          <rect x="330" y="455" width="6" height="22" fill="#050607" />
        </g>
      )}
    </svg>
  );
}
