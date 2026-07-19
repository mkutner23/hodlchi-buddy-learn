import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const EventInput = z.object({
  name: z.string().min(1).max(80),
  meta: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
  ts: z.number().optional(), // client timestamp (not stored; server time wins)
});

const TrackInput = z.object({
  device_id: z.string().min(8).max(64),
  locale: z.string().max(8).optional(),
  path: z.string().max(200).optional(),
  events: z.array(EventInput).min(1).max(50),
});

export type TrackPayload = z.infer<typeof TrackInput>;

/**
 * Anonymous event ingestion. Uses publishable key so the anon RLS policy applies.
 * device_id is a random client-side UUID stored in localStorage — not user identity.
 */
export const trackEvents = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => TrackInput.parse(data))
  .handler(async ({ data }) => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return { ok: false, error: "not_configured" as const };

    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          // sb_ publishable keys are opaque; PostgREST rejects Bearer.
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const rows = data.events.map((e) => ({
      device_id: data.device_id,
      name: e.name,
      path: data.path ?? null,
      locale: data.locale ?? null,
      meta: e.meta ?? {},
    }));

    const { error } = await supabase.from("analytics_events").insert(rows);
    if (error) return { ok: false, error: error.message };
    return { ok: true, count: rows.length };
  });

const SummaryInput = z.object({
  token: z.string().min(16).max(200),
  invite_code: z.string().min(3).max(64).optional(),
});

export interface AnalyticsSummary {
  totals: {
    events: number;
    devices: number;
    hatched: number;
    firstLessonCompleted: number;
    sevenDayStreak: number;
    evolutionReached: number;
  };
  funnel: Array<{ step: string; devices: number; rate: number }>;
  eventCounts: Array<{ name: string; count: number }>;
  retention: {
    // For each cohort (day of first_seen), pct of devices returning on day N.
    cohorts: Array<{ cohort: string; size: number; d1: number; d7: number; d30: number }>;
    overall: { d1: number; d7: number; d30: number };
  };
  recentEvents: Array<{ name: string; created_at: string; device_id: string; meta: Record<string, string | number | boolean | null> }>;
  feedback: Array<{ rating: string; count: number }>;
  inviteCodes: Array<{ code: string; label: string | null; redeemed_devices: number }>;
  activeInviteFilter: string | null;
}

/**
 * Token-gated admin summary. Uses service role to read events (RLS blocks anon reads).
 * The token is stored in ANALYTICS_ADMIN_TOKEN; the caller passes it in the body.
 */
export const getAnalyticsSummary = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => SummaryInput.parse(data))
  .handler(async ({ data }): Promise<AnalyticsSummary | { error: string }> => {
    const expected = process.env.ANALYTICS_ADMIN_TOKEN;
    if (!expected) return { error: "not_configured" };
    // constant-time-ish compare
    if (data.token.length !== expected.length) return { error: "unauthorized" };
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= data.token.charCodeAt(i) ^ expected.charCodeAt(i);
    if (diff !== 0) return { error: "unauthorized" };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Optional cohort filter: only include devices that redeemed a specific invite code.
    let deviceFilter: Set<string> | null = null;
    if (data.invite_code) {
      const { data: reds } = await supabaseAdmin
        .from("invite_redemptions")
        .select("device_id")
        .eq("code", data.invite_code);
      deviceFilter = new Set((reds ?? []).map((r) => r.device_id));
    }

    // Pull last 30 days of events. For a demo product this stays well under limits.
    const since = new Date(Date.now() - 30 * 86400_000).toISOString();
    const { data: rows, error } = await supabaseAdmin
      .from("analytics_events")
      .select("device_id, name, meta, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000);
    if (error) return { error: error.message };

    const all = deviceFilter
      ? (rows ?? []).filter((r) => deviceFilter!.has(r.device_id))
      : rows ?? [];
    const byDevice = new Map<string, typeof all>();
    for (const r of all) {
      const arr = byDevice.get(r.device_id) ?? [];
      arr.push(r);
      byDevice.set(r.device_id, arr);
    }

    const hasEvent = (deviceRows: typeof all, name: string) =>
      deviceRows.some((r) => r.name === name);

    let hatched = 0;
    let firstLessonCompleted = 0;
    let sevenDayStreak = 0;
    let evolutionReached = 0;
    let firstLessonStarted = 0;
    for (const [, drows] of byDevice) {
      if (hasEvent(drows, "penny_hatched")) hatched++;
      if (hasEvent(drows, "first_lesson_started")) firstLessonStarted++;
      if (hasEvent(drows, "first_lesson_completed")) firstLessonCompleted++;
      if (hasEvent(drows, "seven_day_streak")) sevenDayStreak++;
      if (hasEvent(drows, "evolution_reached")) evolutionReached++;
    }

    const totalDevices = byDevice.size;
    const funnel = [
      { step: "Visited app", devices: totalDevices },
      { step: "Hatched Penny", devices: hatched },
      { step: "Started first lesson", devices: firstLessonStarted },
      { step: "Completed first lesson", devices: firstLessonCompleted },
      { step: "Reached an evolution", devices: evolutionReached },
      { step: "7-day streak", devices: sevenDayStreak },
    ].map((s) => ({ ...s, rate: totalDevices ? s.devices / totalDevices : 0 }));

    const counts = new Map<string, number>();
    for (const r of all) counts.set(r.name, (counts.get(r.name) ?? 0) + 1);
    const eventCounts = [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Cohort retention: cohort = UTC day of device's first event within window.
    const firstSeen = new Map<string, Date>();
    const daysActive = new Map<string, Set<string>>();
    for (const r of all) {
      const d = new Date(r.created_at);
      const day = d.toISOString().slice(0, 10);
      const prev = firstSeen.get(r.device_id);
      if (!prev || d < prev) firstSeen.set(r.device_id, d);
      const set = daysActive.get(r.device_id) ?? new Set<string>();
      set.add(day);
      daysActive.set(r.device_id, set);
    }
    const cohortMap = new Map<string, string[]>();
    for (const [device, first] of firstSeen) {
      const cohort = first.toISOString().slice(0, 10);
      const arr = cohortMap.get(cohort) ?? [];
      arr.push(device);
      cohortMap.set(cohort, arr);
    }
    const dayString = (d: Date) => d.toISOString().slice(0, 10);
    const cohorts = [...cohortMap.entries()]
      .sort(([a], [b]) => (a < b ? 1 : -1))
      .slice(0, 14)
      .map(([cohort, devices]) => {
        const cohortDate = new Date(cohort + "T00:00:00Z");
        const hit = (n: number) => {
          const target = new Date(cohortDate.getTime() + n * 86400_000);
          const targetDay = dayString(target);
          let count = 0;
          for (const dev of devices) if (daysActive.get(dev)?.has(targetDay)) count++;
          return devices.length ? count / devices.length : 0;
        };
        return { cohort, size: devices.length, d1: hit(1), d7: hit(7), d30: hit(30) };
      });

    // Overall retention = weighted average across cohorts with sufficient time elapsed.
    const now = Date.now();
    const avg = (n: number) => {
      let total = 0;
      let weighted = 0;
      for (const c of cohorts) {
        const cohortMs = new Date(c.cohort + "T00:00:00Z").getTime();
        if (now - cohortMs < n * 86400_000) continue;
        total += c.size;
        weighted += c.size * (n === 1 ? c.d1 : n === 7 ? c.d7 : c.d30);
      }
      return total ? weighted / total : 0;
    };

    const feedbackCounts = new Map<string, number>();
    for (const r of all) {
      if (r.name !== "feedback_submitted") continue;
      const rating = (r.meta as { rating?: string } | null)?.rating ?? "unknown";
      feedbackCounts.set(rating, (feedbackCounts.get(rating) ?? 0) + 1);
    }

    // Invite-code list for the cohort dropdown (with redemption counts).
    const { data: allCodes } = await supabaseAdmin
      .from("invite_codes")
      .select("code, label")
      .order("created_at", { ascending: false });
    const { data: allReds } = await supabaseAdmin
      .from("invite_redemptions")
      .select("code, device_id");
    const redCounts = new Map<string, Set<string>>();
    for (const r of allReds ?? []) {
      const s = redCounts.get(r.code) ?? new Set<string>();
      s.add(r.device_id);
      redCounts.set(r.code, s);
    }
    const inviteCodes = (allCodes ?? []).map((c) => ({
      code: c.code,
      label: c.label,
      redeemed_devices: redCounts.get(c.code)?.size ?? 0,
    }));

    return {
      totals: {
        events: all.length,
        devices: totalDevices,
        hatched,
        firstLessonCompleted,
        sevenDayStreak,
        evolutionReached,
      },
      funnel,
      eventCounts,
      retention: {
        cohorts,
        overall: { d1: avg(1), d7: avg(7), d30: avg(30) },
      },
      recentEvents: all.slice(0, 30).map((r) => ({
        name: r.name,
        created_at: r.created_at,
        device_id: r.device_id.slice(0, 8),
        meta: (r.meta && typeof r.meta === "object" && !Array.isArray(r.meta) ? r.meta : {}) as Record<string, string | number | boolean | null>,
      })),
      feedback: [...feedbackCounts.entries()].map(([rating, count]) => ({ rating, count })),
    };
  });
