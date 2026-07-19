import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

function anonClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const InterviewInput = z.object({
  device_id: z.string().min(8).max(64),
  email: z.string().email().max(200),
  note: z.string().max(1000).optional(),
});

export const submitInterviewSignup = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InterviewInput.parse(d))
  .handler(async ({ data }) => {
    const supabase = anonClient();
    const { error } = await supabase.from("interview_signups").insert({
      device_id: data.device_id,
      email: data.email,
      note: data.note ?? null,
    });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

const FeedbackInput = z.object({
  device_id: z.string().min(8).max(64),
  rating: z.string().min(1).max(40),
  text: z.string().max(2000).optional(),
  surface: z.string().max(60).optional(),
});

export const submitProductFeedback = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => FeedbackInput.parse(d))
  .handler(async ({ data }) => {
    const supabase = anonClient();
    const { error } = await supabase.from("product_feedback").insert({
      device_id: data.device_id,
      rating: data.rating,
      text: data.text ?? null,
      surface: data.surface ?? null,
    });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });
