// Public endpoint that serves the two hero SFX (evolve sparkle + level-up
// fanfare) as MP3 bytes. On first request per instance, it generates the clip
// via ElevenLabs and caches it in memory; subsequent requests are served from
// cache. The client also caches the bytes in localStorage so most users hit
// the server exactly once ever.
import { createFileRoute } from "@tanstack/react-router";

type HeroName = "sparkle" | "levelUp";

const PROMPTS: Record<HeroName, { text: string; duration: number }> = {
  sparkle: {
    text: "Magical evolution transformation: rising shimmering crystal arpeggio with sparkling glass bells, gentle rising orchestral swell underneath, a triumphant sparkle burst at the peak. Nintendo Pokemon-evolution feeling, warm, emotional, joyful, magical, not harsh. Around 1.2 seconds.",
    duration: 1.5,
  },
  levelUp: {
    text: "Cheerful level-up fanfare: bright ascending bell melody like a Mario power-up star, warm triangle-wave pad underneath, celebratory sparkle tail at the end. Rewarding, joyful, warm, Nintendo-quality, not harsh. Around 1.5 seconds.",
    duration: 2,
  },
};

const cache = new Map<HeroName, ArrayBuffer>();

async function generate(name: HeroName): Promise<ArrayBuffer> {
  const cached = cache.get(name);
  if (cached) return cached;
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY not configured");
  const { text, duration } = PROMPTS[name];
  const res = await fetch("https://api.elevenlabs.io/v1/sound-generation", {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      duration_seconds: duration,
      prompt_influence: 0.5,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ElevenLabs error ${res.status}: ${body.slice(0, 200)}`);
  }
  const bytes = await res.arrayBuffer();
  cache.set(name, bytes);
  return bytes;
}

export const Route = createFileRoute("/api/public/hero-sfx")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const name = url.searchParams.get("name") as HeroName | null;
        if (name !== "sparkle" && name !== "levelUp") {
          return new Response("invalid name", { status: 400 });
        }
        try {
          const bytes = await generate(name);
          return new Response(bytes, {
            status: 200,
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "unknown";
          return new Response(msg, { status: 503 });
        }
      },
    },
  },
});
