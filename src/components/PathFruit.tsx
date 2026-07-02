import type { PathId } from "@/lib/lessons-data";
import { PATH_FRUIT, PATH_FRUIT_ANIM } from "@/lib/lessons-data";

interface Props {
  pathId: PathId;
  className?: string;
  animate?: boolean;
}

// Renders a path's signature fruit with its idle micro-animation.
export function PathFruit({ pathId, className = "", animate = true }: Props) {
  return (
    <span
      className={`inline-block will-change-transform ${animate ? PATH_FRUIT_ANIM[pathId] : ""} ${className}`}
      aria-hidden="true"
    >
      {PATH_FRUIT[pathId]}
    </span>
  );
}
