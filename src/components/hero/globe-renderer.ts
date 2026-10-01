import { clamp, seeded } from "@/lib/motion";

/**
 * Globo de partículas em Canvas 2D.
 *
 * Direção de arte: uma "esfera de negócios" feita do quadrado da marca.
 * Massas mais densas sugerem território, arcos laranja conectam pontos
 * com pulsos de informação, e duas órbitas carregam os pilares da MSATech.
 *
 * Interação: o globo inclina na direção do ponteiro, partículas próximas
 * se afastam e linhas finas conectam o cursor aos nós mais próximos.
 * `assemble` (intro) e `scatter` (scroll) dispersam/reúnem as partículas.
 */

const FG = "238, 236, 231";
const ORANGE = "241, 118, 49";
const CAMERA = 3.4;
const ARC_SAMPLES = 44;
const RING_SAMPLES = 180;

type Ring = { radius: number; tiltX: number; tiltZ: number; dashed: boolean };
type Arc = { pts: Float32Array; speed: number; offset: number };
type Label = { el: HTMLElement; ring: number; angle: number; speed: number; opacity: number };

export type GlobeReadout = { rotation: number; x: number; y: number };

export type GlobeOptions = {
  labels: HTMLElement[];
  onReadout?: (r: GlobeReadout) => void;
  compact?: boolean;
};

export class GlobeRenderer {
  /** 1 = partículas espalhadas (antes da intro); 0 = globo formado. */
  assemble = 1;
  /** Dispersão controlada pelo scroll (0–1). */
  scatter = 0;

  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly layer: HTMLCanvasElement;
  private readonly opts: GlobeOptions;

  private w = 0;
  private h = 0;
  private dpr = 1;
  private R = 0;
  private cx = 0;
  private cy = 0;

  private count = 0;
  private pos = new Float32Array(0);
  private kind = new Uint8Array(0);
  private spread = new Float32Array(0);
  private hubs: number[] = [];
  private arcs: Arc[] = [];
  private rings: Ring[] = [];
  private labels: Label[] = [];

  private pointer = { x: 0, y: 0, tx: 0, ty: 0, sx: -1e4, sy: -1e4, active: false };
  private rotY = 0.6;
  private time = 0;
  private frame = 0;
  private raf = 0;
  private last = 0;
  private running = false;

  // Projeção reutilizável (evita alocações no loop).
  private px = 0;
  private py = 0;
  private pz = 0;
  private occluded = false;
  private cosY = 1;
  private sinY = 0;
  private cosX = 1;
  private sinX = 0;
  private persp = 1;

  constructor(canvas: HTMLCanvasElement, opts: GlobeOptions) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D indisponível");
    this.canvas = canvas;
    this.ctx = ctx;
    this.opts = opts;
    this.layer = document.createElement("canvas");
    this.build();
  }

  // ---------------------------------------------------------------- setup

  private build() {
    const rand = seeded(7);
    const n = this.opts.compact ? 900 : 1800;
    this.count = n;
    this.pos = new Float32Array(n * 3);
    this.kind = new Uint8Array(n);
    this.spread = new Float32Array(n);
    const golden = Math.PI * (3 - Math.sqrt(5));
    const land: number[] = [];

    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const phi = i * golden;
      const x = Math.cos(phi) * r;
      const z = Math.sin(phi) * r;
      this.pos.set([x, y, z], i * 3);
      const field =
        Math.sin(x * 3.1 + 1.7) * Math.cos(y * 2.6 - 0.4) +
        Math.sin(z * 3.7 + 0.9) * 0.6 +
        Math.sin((x + y) * 5.3) * 0.25 +
        Math.cos((y - z) * 4.2 + 2) * 0.25;
      const isLand = field > 0.12;
      this.kind[i] = isLand ? (rand() < 0.055 ? 2 : 1) : 0;
      this.spread[i] = 0.6 + rand() * 1.8;
      if (isLand) land.push(i);
    }

    // Hubs bem distribuídos sobre a "terra" e arcos entre pares distantes.
    this.hubs = [];
    for (let k = 0; k < 11 && land.length; k++) {
      const idx = land[Math.floor(rand() * land.length)]!;
      if (this.hubs.every((h) => this.angleBetween(h, idx) > 0.55)) this.hubs.push(idx);
    }
    this.arcs = [];
    for (let a = 0; a < this.hubs.length; a++) {
      const b = (a + 3) % this.hubs.length;
      const ia = this.hubs[a]!;
      const ib = this.hubs[b]!;
      const omega = this.angleBetween(ia, ib);
      if (omega < 0.45 || omega > 1.7) continue;
      this.arcs.push({ pts: this.slerpArc(ia, ib, omega), speed: 0.16 + rand() * 0.12, offset: rand() * 2 });
    }

    this.rings = [
      { radius: 1.42, tiltX: 1.18, tiltZ: 0.32, dashed: false },
      { radius: 1.76, tiltX: 1.32, tiltZ: -0.42, dashed: true },
    ];
    this.labels = this.opts.labels.map((el, i) => ({
      el,
      ring: i % 2,
      angle: (i / this.opts.labels.length) * Math.PI * 2 + (i % 2) * 0.6,
      speed: i % 2 ? -0.045 : 0.06,
      opacity: -1,
    }));
  }

  private angleBetween(a: number, b: number) {
    const p = this.pos;
    const dot = p[a * 3]! * p[b * 3]! + p[a * 3 + 1]! * p[b * 3 + 1]! + p[a * 3 + 2]! * p[b * 3 + 2]!;
    return Math.acos(clamp(dot, -1, 1));
  }

  private slerpArc(a: number, b: number, omega: number) {
    const out = new Float32Array(ARC_SAMPLES * 3);
    const p = this.pos;
    const s = Math.sin(omega);
    for (let i = 0; i < ARC_SAMPLES; i++) {
      const t = i / (ARC_SAMPLES - 1);
      const k1 = Math.sin((1 - t) * omega) / s;
      const k2 = Math.sin(t * omega) / s;
      const lift = 1 + 0.07 * omega * Math.sin(Math.PI * t);
      for (let c = 0; c < 3; c++) out[i * 3 + c] = (p[a * 3 + c]! * k1 + p[b * 3 + c]! * k2) * lift;
    }
    return out;
  }

  // ---------------------------------------------------------------- public api

  resize(width: number, height: number) {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = width;
    this.h = height;
    this.canvas.width = Math.round(width * this.dpr);
    this.canvas.height = Math.round(height * this.dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.R = Math.min(width, height) * (this.opts.compact ? 0.3 : 0.27);
    this.cx = width / 2;
    this.cy = height / 2;
    this.paintLayer();
    if (!this.running) this.render(0);
  }

  setPointer(clientX: number, clientY: number, rect: DOMRect) {
    this.pointer.sx = clientX - rect.left;
    this.pointer.sy = clientY - rect.top;
    this.pointer.tx = clamp((clientX / window.innerWidth) * 2 - 1, -1, 1);
    this.pointer.ty = clamp((clientY / window.innerHeight) * 2 - 1, -1, 1);
    this.pointer.active = true;
  }

  clearPointer() {
    this.pointer.active = false;
    this.pointer.tx = 0;
    this.pointer.ty = 0;
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

  /** Um quadro estático (movimento reduzido). */
  still() {
    this.assemble = 0;
    this.render(0);
  }

  destroy() {
    this.stop();
  }

  // ---------------------------------------------------------------- rendering

  /** Camadas que não giram: halo, volume e luz de borda (pintadas só no resize). */
  private paintLayer() {
    const { w, h, dpr, R, cx, cy } = this;
    const l = this.layer;
    l.width = Math.round(w * dpr);
    l.height = Math.round(h * dpr);
    const g = l.getContext("2d");
    if (!g) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    const halo = g.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.9);
    halo.addColorStop(0, `rgba(${ORANGE}, 0.07)`);
    halo.addColorStop(0.3, `rgba(13, 107, 117, 0.05)`);
    halo.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = halo;
    g.fillRect(0, 0, w, h);

    const body = g.createRadialGradient(cx + R * 0.4, cy - R * 0.45, R * 0.1, cx, cy, R * 1.05);
    body.addColorStop(0, "rgba(13, 107, 117, 0.26)");
    body.addColorStop(0.55, "rgba(2, 71, 79, 0.12)");
    body.addColorStop(1, "rgba(5, 6, 7, 0.55)");
    g.beginPath();
    g.arc(cx, cy, R, 0, Math.PI * 2);
    g.fillStyle = body;
    g.fill();

    // Luz de borda: um "nascer do sol" no quadrante superior direito.
    const flareA = -0.85;
    const fx = cx + Math.cos(flareA) * R;
    const fy = cy + Math.sin(flareA) * R;
    const rim = g.createLinearGradient(cx - R, cy + R, fx, fy);
    rim.addColorStop(0, `rgba(${ORANGE}, 0)`);
    rim.addColorStop(0.55, `rgba(${ORANGE}, 0.08)`);
    rim.addColorStop(1, `rgba(255, 170, 110, 0.95)`);
    g.save();
    g.shadowColor = `rgba(${ORANGE}, 0.9)`;
    g.shadowBlur = 28;
    g.strokeStyle = rim;
    g.lineWidth = 2.2;
    g.beginPath();
    g.arc(cx, cy, R, -2.9, 1.2);
    g.stroke();
    g.restore();
    g.strokeStyle = rim;
    g.lineWidth = 1;
    g.beginPath();
    g.arc(cx, cy, R, -2.9, 1.2);
    g.stroke();

    const flare = g.createRadialGradient(fx, fy, 0, fx, fy, R * 0.55);
    flare.addColorStop(0, "rgba(255, 190, 140, 0.45)");
    flare.addColorStop(0.25, `rgba(${ORANGE}, 0.16)`);
    flare.addColorStop(1, `rgba(${ORANGE}, 0)`);
    g.fillStyle = flare;
    g.fillRect(0, 0, w, h);
  }

  private setRotation(ry: number, rx: number) {
    this.cosY = Math.cos(ry);
    this.sinY = Math.sin(ry);
    this.cosX = Math.cos(rx);
    this.sinX = Math.sin(rx);
  }

  private project(x: number, y: number, z: number, cx: number, cy: number, R: number) {
    const x1 = x * this.cosY + z * this.sinY;
    const z1 = -x * this.sinY + z * this.cosY;
    const y1 = y * this.cosX - z1 * this.sinX;
    const z2 = y * this.sinX + z1 * this.cosX;
    const persp = CAMERA / (CAMERA - z2);
    this.px = cx + x1 * R * persp;
    this.py = cy - y1 * R * persp;
    this.pz = z2;
    this.persp = persp;
    this.occluded = z2 < 0 && x1 * x1 + y1 * y1 < 1;
  }

  private render(dt: number) {
    const { ctx, dpr, w, h, R } = this;
    const p = this.pointer;
    this.time += dt;
    this.frame++;
    this.rotY += dt * 0.07;

    p.x += (p.tx - p.x) * Math.min(1, dt * 2.6);
    p.y += (p.ty - p.y) * Math.min(1, dt * 2.6);

    const ox = p.x * 16;
    const oy = p.y * 10;
    const cx = this.cx + ox;
    const cy = this.cy + oy;
    const ry = this.rotY + p.x * 0.5;
    const rx = -0.34 + p.y * 0.24;

    const disperse = Math.max(this.assemble, this.scatter);
    const ease = disperse * disperse * (3 - 2 * disperse);
    const formed = 1 - ease;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    ctx.globalAlpha = formed;
    ctx.drawImage(this.layer, ox, oy, w, h);
    ctx.globalAlpha = 1;

    this.setRotation(ry, rx);

    // Graticule: equador + dois meridianos, muito sutis.
    if (formed > 0.02) {
      ctx.lineWidth = 0.6;
      for (let c = 0; c < 3; c++) {
        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= 120; i++) {
          const a = (i / 120) * Math.PI * 2;
          const ca = Math.cos(a);
          const sa = Math.sin(a);
          if (c === 0) this.project(ca, 0, sa, cx, cy, R);
          else if (c === 1) this.project(0, ca, sa, cx, cy, R);
          else this.project(ca * 0.707, sa, ca * 0.707, cx, cy, R);
          if (this.pz < -0.05) {
            started = false;
            continue;
          }
          if (started) ctx.lineTo(this.px, this.py);
          else ctx.moveTo(this.px, this.py);
          started = true;
        }
        ctx.strokeStyle = `rgba(${FG}, ${0.07 * formed})`;
        ctx.stroke();
      }
    }

    // Partículas.
    const near: { x: number; y: number; d: number }[] = [];
    const reach = 130;
    const pos = this.pos;
    const accentX: number[] = [];
    const accentY: number[] = [];
    const accentA: number[] = [];
    ctx.fillStyle = `rgb(${FG})`;

    for (let i = 0; i < this.count; i++) {
      const k = this.kind[i]!;
      const m = 1 + ease * this.spread[i]! * 2.4;
      this.project(pos[i * 3]! * m, pos[i * 3 + 1]! * m, pos[i * 3 + 2]! * m, cx, cy, R);
      let sx = this.px;
      let sy = this.py;
      const z = this.pz;

      const depth = z > 0 ? 0.35 + 0.65 * z : 0.06 + 0.26 * (1 + z);
      const base = k === 0 ? 0.3 : k === 1 ? 0.9 : 1;
      let alpha = base * (formed > 0.5 ? depth : depth * formed + 0.35 * (1 - formed)) * (1 - this.scatter * 0.75);

      if (p.active) {
        const dx = sx - p.sx;
        const dy = sy - p.sy;
        const d2 = dx * dx + dy * dy;
        if (d2 < 160 * 160 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / 160) ** 2 * 26 * formed;
          sx += (dx / d) * f;
          sy += (dy / d) * f;
          if (z > 0.15 && d < reach) {
            near.push({ x: sx, y: sy, d });
            alpha = Math.min(1, alpha + (1 - d / reach) * 0.5);
          }
        }
      }

      if (alpha < 0.015) continue;
      const size = (k === 0 ? 1.05 : 1.6) * this.persp;
      if (k === 2) {
        accentX.push(sx);
        accentY.push(sy);
        accentA.push(alpha);
        continue;
      }
      ctx.globalAlpha = alpha;
      ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
    }

    ctx.fillStyle = `rgb(${ORANGE})`;
    for (let i = 0; i < accentX.length; i++) {
      ctx.globalAlpha = accentA[i]!;
      ctx.fillRect(accentX[i]! - 1.2, accentY[i]! - 1.2, 2.4, 2.4);
    }
    ctx.globalAlpha = 1;

    if (formed > 0.05) {
      this.drawArcs(cx, cy, formed);
      this.drawHubs(cx, cy, formed);
    }
    this.drawRings(cx, cy, formed, dt);

    // Linhas do cursor até os nós mais próximos.
    if (p.active && near.length && formed > 0.5) {
      near.sort((a, b) => a.d - b.d);
      ctx.lineWidth = 0.7;
      for (let i = 0; i < Math.min(5, near.length); i++) {
        const n = near[i]!;
        const a = (1 - n.d / reach) * 0.55 * formed;
        ctx.strokeStyle = `rgba(${ORANGE}, ${a})`;
        ctx.beginPath();
        ctx.moveTo(p.sx, p.sy);
        ctx.lineTo(n.x, n.y);
        ctx.stroke();
        ctx.fillStyle = `rgba(${ORANGE}, ${Math.min(1, a * 2)})`;
        ctx.fillRect(n.x - 1.5, n.y - 1.5, 3, 3);
      }
    }

    if (this.opts.onReadout && this.frame % 8 === 0) {
      const deg = (((ry * 180) / Math.PI) % 360 + 360) % 360;
      this.opts.onReadout({ rotation: deg, x: (p.x + 1) / 2, y: (p.y + 1) / 2 });
    }
  }

  private drawArcs(cx: number, cy: number, formed: number) {
    const { ctx, R } = this;
    ctx.lineWidth = 0.8;
    for (const arc of this.arcs) {
      ctx.strokeStyle = `rgba(${ORANGE}, ${0.18 * formed})`;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < ARC_SAMPLES; i++) {
        this.project(arc.pts[i * 3]!, arc.pts[i * 3 + 1]!, arc.pts[i * 3 + 2]!, cx, cy, R);
        if (this.occluded || this.pz < -0.2) {
          started = false;
          continue;
        }
        if (started) ctx.lineTo(this.px, this.py);
        else ctx.moveTo(this.px, this.py);
        started = true;
      }
      ctx.stroke();

      // Pulso com cauda.
      const head = ((this.time * arc.speed + arc.offset) % 1.6) / 1.2;
      if (head > 1.25) continue;
      const tail = 0.28;
      let prevX = 0;
      let prevY = 0;
      let has = false;
      for (let s = 0; s <= 14; s++) {
        const t = head - tail + (s / 14) * tail;
        if (t < 0 || t > 1) {
          has = false;
          continue;
        }
        const f = t * (ARC_SAMPLES - 1);
        const i0 = Math.floor(f);
        const i1 = Math.min(ARC_SAMPLES - 1, i0 + 1);
        const fr = f - i0;
        const x = arc.pts[i0 * 3]! + (arc.pts[i1 * 3]! - arc.pts[i0 * 3]!) * fr;
        const y = arc.pts[i0 * 3 + 1]! + (arc.pts[i1 * 3 + 1]! - arc.pts[i0 * 3 + 1]!) * fr;
        const z = arc.pts[i0 * 3 + 2]! + (arc.pts[i1 * 3 + 2]! - arc.pts[i0 * 3 + 2]!) * fr;
        this.project(x, y, z, cx, cy, R);
        if (this.occluded) {
          has = false;
          continue;
        }
        if (has) {
          ctx.strokeStyle = `rgba(255, 170, 110, ${(s / 14) * 0.95 * formed})`;
          ctx.lineWidth = 0.6 + (s / 14) * 1.4;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(this.px, this.py);
          ctx.stroke();
        }
        prevX = this.px;
        prevY = this.py;
        has = true;
      }
    }
  }

  private drawHubs(cx: number, cy: number, formed: number) {
    const { ctx, R } = this;
    for (let k = 0; k < this.hubs.length; k++) {
      const i = this.hubs[k]!;
      this.project(this.pos[i * 3]!, this.pos[i * 3 + 1]!, this.pos[i * 3 + 2]!, cx, cy, R);
      if (this.pz < 0.05) continue;
      const a = this.pz * formed;
      ctx.fillStyle = `rgba(${ORANGE}, ${a})`;
      ctx.fillRect(this.px - 2, this.py - 2, 4, 4);
      const phase = (this.time * 0.5 + k * 0.37) % 1;
      ctx.strokeStyle = `rgba(${ORANGE}, ${(1 - phase) * 0.5 * a})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(this.px, this.py, 3 + phase * 14, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  private drawRings(cx: number, cy: number, formed: number, dt: number) {
    const { ctx, R } = this;
    const p = this.pointer;
    // As órbitas não giram com o globo — apenas reagem ao ponteiro.
    const baseRy = 0.35 + p.x * 0.5;
    const baseRx = -0.34 + p.y * 0.24;
    const grow = 1 + this.scatter * 0.6;

    this.rings.forEach((ring, r) => {
      const cosT = Math.cos(ring.tiltX);
      const sinT = Math.sin(ring.tiltX);
      const cosZ = Math.cos(ring.tiltZ);
      const sinZ = Math.sin(ring.tiltZ);
      const pointOn = (a: number) => {
        const x0 = Math.cos(a) * ring.radius * grow;
        const z0 = Math.sin(a) * ring.radius * grow;
        const y1 = -z0 * sinT;
        const z1 = z0 * cosT;
        return [x0 * cosZ - y1 * sinZ, x0 * sinZ + y1 * cosZ, z1] as const;
      };

      this.setRotation(baseRy, baseRx);
      ctx.lineWidth = 0.7;
      ctx.setLineDash(ring.dashed ? [2, 5] : []);
      let prevX = 0;
      let prevY = 0;
      for (let i = 0; i <= RING_SAMPLES; i++) {
        const [x, y, z] = pointOn((i / RING_SAMPLES) * Math.PI * 2);
        this.project(x, y, z, cx, cy, R);
        const a = (this.occluded ? 0 : this.pz < 0 ? 0.07 : 0.1 + this.pz * 0.22) * formed;
        if (i > 0 && a > 0.005) {
          ctx.strokeStyle = `rgba(${FG}, ${a})`;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(this.px, this.py);
          ctx.stroke();
        }
        prevX = this.px;
        prevY = this.py;
      }
      ctx.setLineDash([]);

      for (const label of this.labels) {
        if (label.ring !== r) continue;
        label.angle += dt * label.speed;
        const [x, y, z] = pointOn(label.angle);
        this.project(x, y, z, cx, cy, R);
        const vis = (this.occluded ? 0 : this.pz < 0 ? 0.35 : 1) * formed;
        if (vis > 0.01) {
          ctx.fillStyle = `rgba(${ORANGE}, ${0.18 * vis})`;
          ctx.beginPath();
          ctx.arc(this.px, this.py, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(${ORANGE}, ${vis})`;
          ctx.fillRect(this.px - 2.5, this.py - 2.5, 5, 5);
        }
        label.el.style.transform = `translate3d(${(this.px + 12).toFixed(1)}px, ${(this.py - 6).toFixed(1)}px, 0)`;
        const op = Math.round(vis * 100) / 100;
        if (op !== label.opacity) {
          label.el.style.opacity = String(op);
          label.opacity = op;
        }
      }
    });
  }
}
