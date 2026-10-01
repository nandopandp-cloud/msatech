/**
 * Terra fotorrealista em WebGL2 — um único triângulo em tela cheia com uma
 * esfera analítica no fragment shader (sem bibliotecas 3D).
 *
 * Texturas NASA (domínio público): luzes noturnas das cidades + máscara de
 * continentes. A rotação usa exatamente a mesma convenção do canvas 2D do
 * globo, então arcos, cidades e órbitas ficam alinhados com o planeta.
 */

const VERT = `#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 u_center;
uniform float u_R;
uniform vec4 u_rot;
uniform float u_alpha;
uniform vec3 u_light;
uniform sampler2D u_lights;
uniform sampler2D u_land;
out vec4 outColor;
const float PI = 3.14159265;

vec4 sampleSeamless(sampler2D tex, vec2 uv) {
  // Evita a linha da emenda (lon ±180°) escolhendo o gradiente contínuo.
  vec2 alt = vec2(fract(uv.x + 0.5) - 0.5, uv.y);
  vec2 dx = dFdx(uv), dy = dFdy(uv);
  vec2 dxa = dFdx(alt), dya = dFdy(alt);
  if (abs(dxa.x) + abs(dya.x) < abs(dx.x) + abs(dy.x)) { dx = dxa; dy = dya; }
  return textureGrad(tex, uv, dx, dy);
}

void main() {
  vec2 p = (gl_FragCoord.xy - u_center) / u_R;
  float d = length(p);
  vec3 col = vec3(0.0);
  float cover = 0.0;

  if (d < 1.0) {
    float z = sqrt(1.0 - d * d);
    vec3 v = vec3(p, z);
    float cY = u_rot.x, sY = u_rot.y, cX = u_rot.z, sX = u_rot.w;
    float y = v.y * cX + v.z * sX;
    float z1 = -v.y * sX + v.z * cX;
    float x = v.x * cY - z1 * sY;
    float zw = v.x * sY + z1 * cY;
    vec2 uv = vec2((atan(-zw, x) + PI) / (2.0 * PI), (PI * 0.5 - asin(clamp(y, -1.0, 1.0))) / PI);

    float lights = sampleSeamless(u_lights, uv).r;
    float land = sampleSeamless(u_land, uv).r;
    float ndl = dot(v, u_light);
    float day = smoothstep(-0.2, 0.75, ndl);

    vec3 night = vec3(0.010, 0.016, 0.019) + land * vec3(0.020, 0.048, 0.054);
    vec3 lit = mix(vec3(0.014, 0.036, 0.050), vec3(0.075, 0.12, 0.13), land);
    col = mix(night, lit, day * 0.6);

    float city = pow(lights, 1.5) * (1.0 - day * 0.55);
    col += city * vec3(1.0, 0.62, 0.28) * 2.6;

    float fres = pow(1.0 - z, 3.0);
    float warm = smoothstep(0.45, 0.95, ndl);
    vec3 rimTint = mix(vec3(0.16, 0.42, 0.52), vec3(1.0, 0.62, 0.34), warm);
    col += fres * rimTint * (0.35 + 0.9 * warm);
    col += vec3(0.95, 0.42, 0.14) * exp(-pow(ndl * 5.0, 2.0)) * 0.05;

    cover = smoothstep(1.0, 1.0 - 1.5 / u_R, d);
  }

  float halo = d > 1.0 ? exp(-(d - 1.0) * 10.0) : 0.0;
  float side = clamp(dot(normalize(p + 1e-5), normalize(u_light.xy)) * 0.5 + 0.5, 0.0, 1.0);
  float hot = pow(side, 4.0);
  vec3 haloCol = mix(vec3(0.05, 0.24, 0.30), vec3(1.0, 0.55, 0.25), hot) * halo * (0.35 + 0.65 * hot);

  vec3 rgb = col * cover + haloCol * (1.0 - cover);
  float a = max(cover, max(haloCol.r, max(haloCol.g, haloCol.b)));
  outColor = vec4(rgb, a) * u_alpha;
}`;

export type EarthFrame = { cx: number; cy: number; R: number; ry: number; rx: number; alpha: number };

export class EarthGL {
  ready = false;

  private readonly gl: WebGL2RenderingContext;
  private readonly program: WebGLProgram;
  private readonly uniforms: Record<string, WebGLUniformLocation | null> = {};
  private w = 0;
  private h = 0;
  private dpr = 1;

  private constructor(private readonly canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.program = this.link();
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(this.program, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(this.program);
    for (const name of ["u_center", "u_R", "u_rot", "u_alpha", "u_light", "u_lights", "u_land"]) {
      this.uniforms[name] = gl.getUniformLocation(this.program, name);
    }
    gl.uniform1i(this.uniforms.u_lights!, 0);
    gl.uniform1i(this.uniforms.u_land!, 1);
    const l = [0.55, 0.62, 0.56];
    const n = Math.hypot(...l);
    gl.uniform3f(this.uniforms.u_light!, l[0]! / n, l[1]! / n, l[2]! / n);
  }

  /** Retorna null quando WebGL2 não está disponível — o globo de partículas segue sozinho. */
  static create(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return null;
    try {
      return new EarthGL(canvas, gl);
    } catch {
      return null;
    }
  }

  async load(lightsUrl: string, landUrl: string) {
    const [lights, land] = await Promise.all([loadImage(lightsUrl), loadImage(landUrl)]);
    this.texture(0, lights);
    this.texture(1, land);
    this.ready = true;
  }

  resize(width: number, height: number, maxDpr: number) {
    this.dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    this.w = width;
    this.h = height;
    this.canvas.width = Math.round(width * this.dpr);
    this.canvas.height = Math.round(height * this.dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  draw(f: EarthFrame) {
    const { gl, dpr } = this;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (!this.ready || f.alpha <= 0.001) return;
    gl.uniform2f(this.uniforms.u_center!, f.cx * dpr, (this.h - f.cy) * dpr);
    gl.uniform1f(this.uniforms.u_R!, f.R * dpr);
    gl.uniform4f(this.uniforms.u_rot!, Math.cos(f.ry), Math.sin(f.ry), Math.cos(f.rx), Math.sin(f.rx));
    gl.uniform1f(this.uniforms.u_alpha!, f.alpha);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  destroy() {
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
  }

  private texture(unit: number, image: HTMLImageElement) {
    const { gl } = this;
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  private link() {
    const { gl } = this;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
      return s;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link");
    return p;
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
