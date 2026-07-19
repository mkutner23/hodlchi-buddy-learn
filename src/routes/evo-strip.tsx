import { createFileRoute } from "@tanstack/react-router";
import { HodlchiAvatar } from "@/components/HodlchiAvatar";
import type { Stage } from "@/lib/hodlchi-store";

const STAGES: Stage[] = ["Egg", "Baby", "Student", "Builder", "Investor"];

export const Route = createFileRoute("/evo-strip")({
  component: EvoStrip,
});

function EvoStrip() {
  return (
    <div
      id="evo-strip"
      className="flex items-end justify-center gap-6 bg-gradient-hero p-10"
      style={{ width: 1200, height: 340 }}
    >
      {STAGES.map((stage) => (
        <div key={stage} className="flex flex-col items-center gap-3">
          <HodlchiAvatar egg="mint" personality="fox" stage={stage} size={170} />
          <div className="rounded-full bg-foreground px-3 py-1 text-xs font-bold text-primary shadow-pop">
            {stage}
          </div>
        </div>
      ))}
    </div>
  );
}
