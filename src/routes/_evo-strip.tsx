import { createFileRoute } from "@tanstack/react-router";
import { HodlchiAvatar } from "@/components/HodlchiAvatar";
import type { Stage } from "@/lib/hodlchi-store";

const STAGES: Stage[] = ["Egg", "Baby", "Student", "Builder", "Investor"];
const LABELS = ["Egg", "Baby", "Student", "Builder", "Investor"];

export const Route = createFileRoute("/_evo-strip")({
  component: EvoStrip,
});

function EvoStrip() {
  return (
    <div
      id="evo-strip"
      className="flex items-end justify-center gap-4 bg-gradient-hero p-8"
      style={{ width: 1200, height: 320 }}
    >
      {STAGES.map((stage, i) => (
        <div key={stage} className="flex flex-col items-center gap-2">
          <HodlchiAvatar egg="mint" personality="fox" stage={stage} size={170} />
          <div className="rounded-full bg-foreground px-3 py-1 text-xs font-bold text-primary shadow-pop">
            {LABELS[i]}
          </div>
          {i < STAGES.length - 1 && null}
        </div>
      ))}
    </div>
  );
}
