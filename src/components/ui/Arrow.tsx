import type { SVGProps } from "react";

export function Arrow({ direction = "right", ...props }: SVGProps<SVGSVGElement> & { direction?: "right" | "left" | "up" | "down" | "up-right" }) {
  const rotation = { right: 0, down: 90, left: 180, up: -90, "up-right": -45 }[direction];
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props} style={{ transform: `rotate(${rotation}deg)`, ...props.style }}>
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}
