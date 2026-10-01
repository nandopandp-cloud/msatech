import { clamp } from "@/lib/motion";

/**
 * Piso infinito em perspectiva com feixes de luz correndo em direção ao
 * observador — a sensação de "caminho à frente". O ponto de fuga segue o
 * ponteiro; `boost` intensifica a luz (hover no CTA).
 */
export class HorizonRenderer {
  boost = 0;

  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private t = 0;
  private raf = 0;
  private last = 0;
  private running = false;
  private pointer = { x: 0, y: 0, tx: 0, ty: 0, sx: -1e4, sy: -1e4 };
  private readonly beams = [-7, -4, -2, 1, 3, 6].map((lane, i) => ({ lane, speed: 0.18 + (i % 3) * 0.06, offset: i * 0.37 }));

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

  setPointer(x: number, y: number) {
    this.pointer.sx = x;
    this.pointer.sy = y;
    this.pointer.tx = clamp(x / this.w, 0, 1) * 2 - 1;
    this.pointer.ty = clamp(y / this.h, 0, 1) * 2 - 1;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      this.render(Math.min((now - this.last) / 1000, 0.05));
      this.last = now;
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  render(dt: number) {
    const { ctx, w, h, dpr } = this;
    const p = this.pointer;
    this.t += dt;
    p.x += (p.tx - p.x) * Math.min(1, dt * 2);
    p.y += (p.ty - p.y) * Math.min(1, dt * 2);

    const hy = h * 0.64 + p.y * 14;
    const vx = w / 2 + p.x * 90;
    const boost = this.boost;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Brilho do horizonte.
    const glow = ctx.createRadialGradient(vx, hy, 0, vx, hy, Math.max(w, h) * 0.6);
    glow.addColorStop(0, `rgba(241,118,49,${0.26 + boost * 0.2})`);
    glow.addColorStop(0.3, `rgba(241,118,49,${0.07 + boost * 0.06})`);
    glow.addColorStop(1, "rgba(241,118,49,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // Linha do horizonte.
    const line = ctx.createLinearGradient(0, 0, w, 0);
    line.addColorStop(0, "rgba(255,176,122,0)");
    line.addColorStop(clamp(vx / w), `rgba(255,190,140,${0.75 + boost * 0.25})`);
    line.addColorStop(1, "rgba(255,176,122,0)");
    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, hy);
    ctx.lineTo(w, hy);
    ctx.stroke();

    // Raios do piso convergindo ao ponto de fuga.
    const spread = w / 7;
    ctx.lineWidth = 0.7;
    for (let i = -16; i <= 16; i++) {
      const a = 0.09 - Math.abs(i) * 0.003;
      if (a <= 0) continue;
      ctx.strokeStyle = `rgba(238,236,231,${a})`;
      ctx.beginPath();
      ctx.moveTo(vx + i * 3, hy);
      ctx.lineTo(vx + i * spread, h + 40);
      ctx.stroke();
    }

    // Linhas transversais avançando.
    const rows = 16;
    for (let k = 0; k < rows; k++) {
      const d = ((k + this.t * 0.55) % rows) / rows;
      const y = hy + (h - hy) * d * d;
      ctx.strokeStyle = `rgba(238,236,231,${0.02 + d * 0.09})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Feixes de luz correndo pelas faixas.
    for (const b of this.beams) {
      const u = (this.t * b.speed * (1 + boost * 1.5) + b.offset) % 1;
      const u0 = Math.max(0, u - 0.12);
      const at = (s: number) => {
        const e = s * s;
        return [vx + b.lane * 3 + (b.lane * spread - b.lane * 3) * e, hy + (h + 40 - hy) * e] as const;
      };
      const [x0, y0] = at(u0);
      const [x1, y1] = at(u);
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, "rgba(241,118,49,0)");
      g.addColorStop(1, `rgba(255,170,110,${0.85 * (0.4 + u * 0.6)})`);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1 + u * 2.5;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }

    // Luz sob o cursor, quando ele está no piso.
    if (p.sy > hy) {
      const r = 180;
      const spot = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, r);
      spot.addColorStop(0, "rgba(241,118,49,0.16)");
      spot.addColorStop(1, "rgba(241,118,49,0)");
      ctx.fillStyle = spot;
      ctx.fillRect(p.sx - r, p.sy - r, r * 2, r * 2);
    }
  }
}
