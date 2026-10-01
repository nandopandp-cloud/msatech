import { clamp, seeded } from "@/lib/motion";

/**
 * Sistema de partículas que "pensa": cada etapa da jornada é uma formação,
 * e o scroll interpola entre elas. Do caos (desafio) à curva de crescimento
 * (resultado) — a própria interface conta a história do processo.
 */

type Point = [number, number];
type Formation = (k: number, t: number) => Point;

const N = 112;
const FG = [238, 236, 231] as const;
const OR = [241, 118, 49] as const;

const rand = seeded(42);
const chaos: Point[] = Array.from({ length: N }, () => [(rand() * 2 - 1) * 0.92, (rand() * 2 - 1) * 0.86]);

const lattice: Point[] = (() => {
  const pts: Point[] = [];
  const s = 0.15;
  for (let r = -8; r <= 8; r++)
    for (let q = -8; q <= 8; q++) pts.push([(q + r / 2) * s, r * s * 0.866]);
  return pts.sort((a, b) => Math.hypot(...a) - Math.hypot(...b)).slice(0, N);
})();

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const formations: Formation[] = [
  // 01 Desafio — ruído
  (k, t) => [chaos[k]![0] + Math.sin(t * 0.7 + k) * 0.02, chaos[k]![1] + Math.cos(t * 0.6 + k * 1.3) * 0.02],
  // 02 Imersão — lente concêntrica
  (k, t) => {
    if (k === 0) return [0, 0];
    const rings = [10, 22, 34, 45];
    let idx = k - 1;
    let ring = 0;
    while (ring < rings.length - 1 && idx >= rings[ring]!) idx -= rings[ring++]!;
    const count = rings[ring]!;
    const a = (idx / count) * Math.PI * 2 + t * (ring % 2 ? -0.08 : 0.08);
    const r = 0.2 + ring * 0.21;
    return [Math.cos(a) * r, Math.sin(a) * r];
  },
  // 03 Estratégia — vetor de direção
  (k) => {
    const tip: Point = [0.72, 0.52];
    if (k < 80) {
      const u = k / 79;
      return [-0.8 + u * 1.52, -0.62 + u * 1.14];
    }
    const side = k < 96 ? 1 : -1;
    const u = ((k - 80) % 16) / 15;
    const ang = Math.atan2(1.14, 1.52) + Math.PI + side * 0.55;
    return [tip[0] + Math.cos(ang) * u * 0.42, tip[1] + Math.sin(ang) * u * 0.42];
  },
  // 04 Conceito — ideia irradiando
  (k, t) => {
    if (k < 4) return [Math.cos(k * 1.57) * 0.03, Math.sin(k * 1.57) * 0.03];
    const ray = (k - 4) % 12;
    const step = Math.floor((k - 4) / 12);
    const a = (ray / 12) * Math.PI * 2 + t * 0.05;
    const r = 0.16 + step * 0.085 + Math.sin(t * 2 + ray) * 0.01;
    return [Math.cos(a) * r, Math.sin(a) * r];
  },
  // 05 Design — grid
  (k) => {
    const cols = 11;
    const c = k % cols;
    const r = Math.floor(k / cols);
    return [-0.78 + c * 0.156, 0.72 - r * 0.145];
  },
  // 06 Tecnologia — rede
  (k, t) => [lattice[k]![0] + Math.sin(t + k) * 0.006, lattice[k]![1] + Math.cos(t * 1.1 + k) * 0.006],
  // 07 Experiência — jornada em dupla hélice
  (k, t) => {
    const u = Math.floor(k / 2) / (N / 2 - 1);
    const x = -0.9 + u * 1.8;
    const phase = k % 2 ? Math.PI : 0;
    return [x, Math.sin(u * Math.PI * 3 + t * 1.2 + phase) * 0.28];
  },
  // 08 Resultado — curva de crescimento + barras
  (k) => {
    if (k < 70) {
      const u = k / 69;
      return [-0.85 + u * 1.7, -0.62 + 1.32 * u ** 2.2];
    }
    const bar = Math.floor((k - 70) / 6);
    const level = (k - 70) % 6;
    const bx = -0.75 + bar * 0.25;
    const top = -0.62 + 1.32 * ((bx + 0.85) / 1.7) ** 2.2;
    return [bx, -0.72 + ((top + 0.72) * (level + 0.5)) / 6.4];
  },
];

export const FORMATION_COUNT = formations.length;

export class FormationRenderer {
  /** 0 … FORMATION_COUNT - 1 (contínuo). */
  progress = 0;

  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private time = 0;
  private raf = 0;
  private last = 0;
  private running = false;
  private readonly xs = new Float32Array(N);
  private readonly ys = new Float32Array(N);

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D indisponível");
    this.canvas = canvas;
    this.ctx = ctx;
  }

  resize(width: number, height: number) {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = width;
    this.h = height;
    this.canvas.width = Math.round(width * this.dpr);
    this.canvas.height = Math.round(height * this.dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    if (!this.running) this.render(0);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      const dt = Math.min((now - this.last) / 1000, 0.05);
      this.last = now;
      this.render(dt);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  render(dt = 0) {
    const { ctx, w, h, dpr } = this;
    this.time += dt;
    const p = clamp(this.progress, 0, FORMATION_COUNT - 1);
    const i = Math.min(Math.floor(p), FORMATION_COUNT - 2);
    const f = p - i;
    const from = formations[i]!;
    const to = formations[i + 1]!;
    const size = Math.min(w, h) * 0.44;
    const cx = w / 2;
    const cy = h / 2;
    const t = this.time;

    for (let k = 0; k < N; k++) {
      const local = ease(clamp(f * 1.4 - (k / N) * 0.4));
      const a = from(k, t);
      const b = to(k, t);
      this.xs[k] = cx + (a[0] + (b[0] - a[0]) * local) * size;
      this.ys[k] = cy - (a[1] + (b[1] - a[1]) * local) * size;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Conexões — mais densas na etapa de tecnologia, mínimas no caos.
    const techWeight = clamp(1 - Math.abs(p - 5) / 1.2);
    const linkDist = size * (0.2 + techWeight * 0.06);
    const linkAlpha = 0.07 + techWeight * 0.22 + clamp(p / 7) * 0.05;
    ctx.lineWidth = 0.6;
    ctx.strokeStyle = `rgba(${FG.join(",")}, ${linkAlpha})`;
    ctx.beginPath();
    const maxD2 = linkDist * linkDist;
    for (let a = 0; a < N; a++) {
      const ax = this.xs[a]!;
      const ay = this.ys[a]!;
      for (let b = a + 1; b < N; b++) {
        const dx = this.xs[b]! - ax;
        const dy = this.ys[b]! - ay;
        if (dx * dx + dy * dy < maxD2) {
          ctx.moveTo(ax, ay);
          ctx.lineTo(this.xs[b]!, this.ys[b]!);
        }
      }
    }
    ctx.stroke();

    // Partículas: o laranja cresce conforme o processo avança.
    const warmth = clamp(p / (FORMATION_COUNT - 1));
    for (let k = 0; k < N; k++) {
      const accent = k % 9 === 0 || (p > 6 && k >= 70) || (p > 6.5 && k % 3 === 0);
      const mix = accent ? 1 : warmth * 0.35;
      const r = Math.round(FG[0] + (OR[0] - FG[0]) * mix);
      const g = Math.round(FG[1] + (OR[1] - FG[1]) * mix);
      const bl = Math.round(FG[2] + (OR[2] - FG[2]) * mix);
      const s = accent ? 4 : 3;
      ctx.fillStyle = `rgb(${r},${g},${bl})`;
      ctx.globalAlpha = accent ? 1 : 0.85;
      ctx.fillRect(this.xs[k]! - s / 2, this.ys[k]! - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
  }
}
