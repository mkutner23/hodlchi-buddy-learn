import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const redeemInput = z.object({
  code: z.string().trim().min(3).max(64),
  deviceId: z.string().trim().min(6).max(64),
});

function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

export const redeemInviteCode = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => redeemInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const code = normalizeCode(data.code);

    const { data: row, error: fetchError } = await supabaseAdmin
      .from("invite_codes")
      .select("code, active, max_uses, used_count, expires_at")
      .eq("code", code)
      .maybeSingle();

    if (fetchError) {
      return { ok: false as const, error: "Something went wrong. Please try again." };
    }
    if (!row) {
      return { ok: false as const, error: "That invite code isn't valid." };
    }
    if (!row.active) {
      return { ok: false as const, error: "That invite code is no longer active." };
    }
    if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
      return { ok: false as const, error: "That invite code has expired." };
    }

    // Check if this device already redeemed this code — allow re-unlock.
    const { data: existing } = await supabaseAdmin
      .from("invite_redemptions")
      .select("id")
      .eq("code", code)
      .eq("device_id", data.deviceId)
      .maybeSingle();

    if (existing) {
      return { ok: true as const, code, alreadyRedeemed: true };
    }

    if (row.used_count >= row.max_uses) {
      return { ok: false as const, error: "That invite code has reached its limit." };
    }

    const { error: insertError } = await supabaseAdmin
      .from("invite_redemptions")
      .insert({ code, device_id: data.deviceId });

    if (insertError) {
      // Unique-violation race: someone else took the last slot.
      return { ok: false as const, error: "That invite code has reached its limit." };
    }

    await supabaseAdmin
      .from("invite_codes")
      .update({ used_count: row.used_count + 1 })
      .eq("code", code);

    return { ok: true as const, code, alreadyRedeemed: false };
  });
