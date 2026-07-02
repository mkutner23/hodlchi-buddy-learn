import type { CSSProperties } from "react";
import type { PathId } from "@/lib/lessons-data";
import { PATH_FRUIT, PATH_FRUIT_ANIM } from "@/lib/lessons-data";

interface Props {
  pathId: PathId;
  className?: string;
  animate?: boolean;
  style?: CSSProperties;
}

// Renders a path's signature fruit with its idle micro-animation.
// The credit blueberry is shifted bluer via CSS filter so it doesn't look
// purple and collide with the entrepreneurship grape.
export function PathFruit({ pathId, className = "", animate = true, style }: Props) {
  return (
    <span
      className={`inline-block will-change-transform ${animate ? PATH_FRUIT_ANIM[pathId] : ""} ${className}`}
      aria-hidden="true"
      style={{
        ...(pathId === "credit"
          ? { filter: "hue-rotate(-20deg) saturate(1.25) brightness(1.05)" }
          : undefined),
        ...style,
      }}
    >
      {PATH_FRUIT[pathId]}
    </span>
  );
}


