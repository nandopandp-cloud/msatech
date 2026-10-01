import { useId } from "react";
import type { ServiceVisualId } from "@/content/services";

/**
 * Arte generativa por pilar — composições em SVG, centradas no eixo vertical
 * para funcionarem tanto no painel estreito quanto no expandido.
 * Elementos `.svc-anim` só animam quando o ancestral tem `.is-active`.
 */
export function ServiceVisual({ id }: { id: ServiceVisualId }) {
  const uid = useId().replace(/:/g, "");
  const g = (name: string) => `${uid}-${name}`;

  return (
    <svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <linearGradient id={g("bg")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0c0f10" />
          <stop offset="1" stopColor="#050607" />
        </linearGradient>
        <radialGradient id={g("glow")} cx="0.5" cy="1" r="0.75">
          <stop offset="0" stopColor="#f17631" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#b8501a" stopOpacity="0.12" />
          <stop offset="1" stopColor="#050607" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={g("teal")} cx="0.5" cy="0.35" r="0.6">
          <stop offset="0" stopColor="#0d6b75" stopOpacity="0.45" />
          <stop offset="1" stopColor="#050607" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={g("stroke")} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ffb07a" />
          <stop offset="1" stopColor="#f17631" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id={g("sweep")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f17631" stopOpacity="0" />
          <stop offset="1" stopColor="#f17631" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      <rect width="400" height="600" fill={`url(#${g("bg")})`} />
      <rect width="400" height="600" fill={`url(#${g(id === "technology" || id === "design" ? "teal" : "glow")})`} />

      {id === "strategy" && (
        <g>
          {[40, 75, 110, 145, 180, 215].map((r) => (
            <circle key={r} cx="200" cy="300" r={r} fill="none" stroke="#eeece7" strokeOpacity={0.05 + (215 - r) / 1600} />
          ))}
          <path d="M200 60V540M-20 300H420" stroke="#eeece7" strokeOpacity="0.08" />
          <g className="svc-anim" style={{ transformOrigin: "200px 300px", animation: "spin-slow 9s linear infinite" }}>
            <path d="M200 300 L415 300 A215 215 0 0 0 386 192 Z" fill={`url(#${g("sweep")})`} />
          </g>
          <path
            d="M60 560 C 90 470, 210 470, 170 400 S 150 320, 200 300"
            fill="none"
            stroke="#f17631"
            strokeWidth="1.5"
            strokeDasharray="4 8"
            className="svc-anim"
            style={{ animation: "dash-flow 6s linear infinite" }}
          />
          <rect x="193" y="293" width="14" height="14" fill="#f17631" />
          <rect x="186" y="286" width="28" height="28" fill="none" stroke="#f17631" strokeOpacity="0.5" />
          <text x="222" y="290" fill="#eeece7" fillOpacity="0.55" fontFamily="monospace" fontSize="10" letterSpacing="2">
            DESTINO
          </text>
          <circle cx="60" cy="560" r="4" fill="#eeece7" />
        </g>
      )}

      {id === "branding" && (
        <g fill="none">
          {Array.from({ length: 14 }, (_, i) => {
            const o = i * 7;
            return (
              <path
                key={i}
                d={`M${330 - o} ${-20 + o} C ${120 - o} ${40 + o}, ${60 + o} ${210 - o}, ${200} ${300} S ${340 - o} ${420 + o}, ${70 + o} ${620 - o}`}
                stroke={`url(#${g("stroke")})`}
                strokeOpacity={0.12 + (i % 5) * 0.09}
                strokeWidth={i === 6 ? 2.4 : 1}
              />
            );
          })}
          <path
            d="M330 -20 C 120 40, 60 210, 200 300 S 340 420, 70 620"
            stroke="#ffd2b0"
            strokeWidth="2"
            strokeDasharray="60 900"
            className="svc-anim"
            style={{ animation: "dash-flow 3.2s linear infinite" }}
          />
          <rect x="268" y="96" width="18" height="18" fill="#f17631" />
          <rect x="286" y="114" width="18" height="18" fill="#f17631" />
        </g>
      )}

      {id === "design" && (
        <g fill="none">
          {Array.from({ length: 26 }, (_, i) => (
            <path key={`v${i}`} d={`M${i * 16} 0V600`} stroke="#eeece7" strokeOpacity={i % 4 === 0 ? 0.07 : 0.025} />
          ))}
          {Array.from({ length: 38 }, (_, i) => (
            <path key={`h${i}`} d={`M0 ${i * 16}H400`} stroke="#eeece7" strokeOpacity={i % 4 === 0 ? 0.07 : 0.025} />
          ))}
          <g className="svc-anim" style={{ transformOrigin: "200px 300px", animation: "spin-slow 40s linear infinite" }}>
            <rect x="72" y="172" width="256" height="256" stroke="#eeece7" strokeOpacity="0.25" />
            <path d="M72 428 A256 256 0 0 1 328 172" stroke="#f17631" strokeWidth="1.5" />
            <path d="M328 172 A158 158 0 0 1 328 330" stroke="#f17631" strokeOpacity="0.8" />
            <path d="M328 330 A98 98 0 0 1 230 428" stroke="#f17631" strokeOpacity="0.6" />
            <path d="M230 428 A60 60 0 0 1 170 368" stroke="#f17631" strokeOpacity="0.4" />
            <circle cx="200" cy="300" r="128" stroke="#eeece7" strokeOpacity="0.12" />
          </g>
          <rect x="120" y="236" width="160" height="128" stroke="#f17631" strokeWidth="1.2" />
          {[
            [120, 236],
            [280, 236],
            [120, 364],
            [280, 364],
          ].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x! - 4} y={y! - 4} width="8" height="8" fill="#eeece7" stroke="#f17631" />
          ))}
          <rect x="166" y="372" width="68" height="18" rx="2" fill="#f17631" />
          <text x="200" y="384.5" textAnchor="middle" fill="#050607" fontFamily="monospace" fontSize="9" letterSpacing="1">
            160 × 128
          </text>
        </g>
      )}

      {id === "experience" && (
        <g fill="none">
          <path d="M80 600 C 80 500, 320 500, 320 400 S 80 300, 80 200 S 320 100, 300 0" stroke="#eeece7" strokeOpacity="0.15" strokeWidth="1" />
          <path
            d="M80 600 C 80 500, 320 500, 320 400 S 80 300, 80 200 S 320 100, 300 0"
            stroke="#ffb07a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="40 1200"
            className="svc-anim"
            style={{ animation: "dash-flow 4s linear infinite" }}
          />
          {[
            [80, 600],
            [200, 450],
            [200, 300],
            [200, 150],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="18" stroke="#f17631" strokeOpacity="0.25" />
              <circle cx={x} cy={y} r="5" fill={i === 3 ? "#f17631" : "#eeece7"} />
              <text x={x! + 28} y={y! + 4} fill="#eeece7" fillOpacity="0.5" fontFamily="monospace" fontSize="9" letterSpacing="2">
                {["", "DESCOBRE", "USA", "RECOMENDA"][i]}
              </text>
            </g>
          ))}
        </g>
      )}

      {id === "technology" && (
        <g fill="none">
          {[0, 1, 2].map((layer) => {
            const y = 190 + layer * 110;
            return (
              <g key={layer}>
                <path d={`M200 ${y - 60} L340 ${y} L200 ${y + 60} L60 ${y} Z`} fill="#0d6b75" fillOpacity={0.06 + layer * 0.03} stroke="#eeece7" strokeOpacity={0.12 + layer * 0.08} />
                {Array.from({ length: 5 }, (_, i) =>
                  Array.from({ length: 5 }, (_, j) => {
                    const px = 200 + (i - j) * 28;
                    const py = y - 56 + (i + j) * 14;
                    return <rect key={`${i}-${j}`} x={px - 1.5} y={py - 1.5} width="3" height="3" fill={layer === 2 && i === 2 && j === 2 ? "#f17631" : "#eeece7"} fillOpacity={layer === 2 && i === 2 && j === 2 ? 1 : 0.35} />;
                  }),
                )}
              </g>
            );
          })}
          <path d="M200 130V470" stroke="#f17631" strokeDasharray="3 6" className="svc-anim" style={{ animation: "dash-flow 5s linear infinite" }} />
          <path d="M60 190V410M340 190V410" stroke="#eeece7" strokeOpacity="0.08" />
          <text x="40" y="96" fill="#eeece7" fillOpacity="0.45" fontFamily="monospace" fontSize="10" letterSpacing="1">
            {"<interface />"}
          </text>
          <text x="40" y="530" fill="#eeece7" fillOpacity="0.45" fontFamily="monospace" fontSize="10" letterSpacing="1">
            {"deploy --prod  ✓"}
          </text>
        </g>
      )}

      {id === "product" && (
        <g>
          {Array.from({ length: 9 }, (_, i) => {
            const h = 30 + Math.pow(i, 1.75) * 9;
            return (
              <rect
                key={i}
                x={52 + i * 34}
                y={520 - h}
                width="20"
                height={h}
                fill={i === 8 ? "#f17631" : "#eeece7"}
                fillOpacity={i === 8 ? 1 : 0.07 + i * 0.03}
                className="svc-anim"
                style={{ transformOrigin: `${62 + i * 34}px 520px`, animation: `rise 2.8s ${i * 0.08}s cubic-bezier(0.16,1,0.3,1) infinite alternate` }}
              />
            );
          })}
          <path d="M40 500 C 140 490, 220 420, 360 170" fill="none" stroke="#ffb07a" strokeWidth="1.5" />
          {[
            ["v0.1", 70, 480],
            ["v1.0", 200, 430],
            ["escala", 320, 230],
          ].map(([label, x, y]) => (
            <g key={label as string}>
              <circle cx={x as number} cy={y as number} r="3.5" fill="#f17631" />
              <text x={(x as number) + 10} y={(y as number) - 8} fill="#eeece7" fillOpacity="0.6" fontFamily="monospace" fontSize="10" letterSpacing="1.5">
                {label as string}
              </text>
            </g>
          ))}
          <path d="M40 520H360" stroke="#eeece7" strokeOpacity="0.2" />
        </g>
      )}
    </svg>
  );
}
