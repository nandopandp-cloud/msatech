import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export const alt = "MSATech — Estratégia, Design, Tecnologia e Experiência";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoData = await readFile(join(process.cwd(), "public/assets/msatech-logo.png"), "base64");
const logoSrc = `data:image/png;base64,${logoData}`;

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(70% 90% at 85% 40%, rgba(241,118,49,0.28), rgba(5,6,7,0) 60%), #050607",
          color: "#eeece7",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={300} height={72} alt="" />
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 600, letterSpacing: -3, lineHeight: 1 }}>
          <span>Transformamos ideias em</span>
          <span style={{ color: "#f17631" }}>experiências que movem negócios.</span>
        </div>
        <div style={{ display: "flex", fontSize: 20, letterSpacing: 4, textTransform: "uppercase", color: "rgba(238,236,231,0.55)" }}>
          Strategy. Brand. Experience. Technology.
        </div>
      </div>
    ),
    size,
  );
}
