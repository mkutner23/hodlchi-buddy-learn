import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TokenInput = z.object({ token: z.string().min(16).max(200) });

function checkToken(token: string): { ok: true } | { ok: false; error: string } {
  const expected = process.env.ANALYTICS_ADMIN_TOKEN;
  if (!expected) return { ok: false, error: "not_configured" };
  if (token.length !== expected.length) return { ok: false, error: "unauthorized" };
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return { ok: false, error: "unauthorized" };
  return { ok: true };
}

export interface InviteRow {
  code: string;
  label: string | null;
  max_uses: number;
  used_count: number;
  active: boolean;
  expires_at: string | null;
  created_at: string;
  redeemed_devices: number;
}

export const listInvites = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => TokenInput.parse(data))
  .handler(async ({ data }): Promise<{ invites: InviteRow[] } | { error: string }> => {
    const gate = checkToken(data.token);
    if (!gate.ok) return { error: gate.error };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: codes, error } = await supabaseAdmin
      .from("invite_codes")
      .select("code, label, max_uses, used_count, active, expires_at, created_at")
      .order("created_at", { ascending: false });
    if (error) return { error: error.message };

    const { data: redemptions } = await supabaseAdmin
      .from("invite_redemptions")
      .select("code, device_id");
    const counts = new Map<string, Set<string>>();
    for (const r of redemptions ?? []) {
      const set = counts.get(r.code) ?? new Set<string>();
      set.add(r.device_id);
      counts.set(r.code, set);
    }

    return {
      invites: (codes ?? []).map((c) => ({
        ...c,
        redeemed_devices: counts.get(c.code)?.size ?? 0,
      })),
    };
  });

const CreateInput = z.object({
  token: z.string().min(16).max(200),
  code: z.string().trim().min(3).max(64),
  label: z.string().trim().max(120).optional(),
  max_uses: z.number().int().min(1).max(100000),
  expires_at: z.string().datetime().nullable().optional(),
});

export const createInvite = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => CreateInput.parse(data))
  .handler(async ({ data }): Promise<{ ok: true } | { error: string }> => {
    const gate = checkToken(data.token);
    if (!gate.ok) return { error: gate.error };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const code = data.code.trim().toUpperCase().replace(/\s+/g, "");
    const { error } = await supabaseAdmin.from("invite_codes").insert({
      code,
      label: data.label ?? null,
      max_uses: data.max_uses,
      expires_at: data.expires_at ?? null,
      active: true,
    });
    if (error) return { error: error.message };
    return { ok: true };
  });

const ToggleInput = z.object({
  token: z.string().min(16).max(200),
  code: z.string().min(3).max(64),
  active: z.boolean(),
});

export const setInviteActive = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ToggleInput.parse(data))
  .handler(async ({ data }): Promise<{ ok: true } | { error: string }> => {
    const gate = checkToken(data.token);
    if (!gate.ok) return { error: gate.error };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("invite_codes")
      .update({ active: data.active })
      .eq("code", data.code);
    if (error) return { error: error.message };
    return { ok: true };
  });

/** Returns the set of device_ids that redeemed a given code. Used for cohort filtering. */
export const listInviteDevices = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ token: z.string().min(16).max(200), code: z.string().min(3).max(64) }).parse(data),
  )
  .handler(async ({ data }): Promise<{ devices: string[] } | { error: string }> => {
    const gate = checkToken(data.token);
    if (!gate.ok) return { error: gate.error };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("invite_redemptions")
      .select("device_id")
      .eq("code", data.code);
    if (error) return { error: error.message };
    return { devices: (rows ?? []).map((r) => r.device_id) };
  });
