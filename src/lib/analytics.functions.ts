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
  smile: { yes: number; meh: number; no: number; rate: number };
  interviewSignups: number;
  productFeedback: number;
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

    // Smile-check north-star metric.
    const smile = { yes: 0, meh: 0, no: 0 };
    for (const r of all) {
      if (r.name !== "smile_check") continue;
      const v = (r.meta as { rating?: string } | null)?.rating;
      if (v === "yes") smile.yes++;
      else if (v === "meh") smile.meh++;
      else if (v === "no") smile.no++;
    }
    const smileTotal = smile.yes + smile.meh + smile.no;
    const smileRate = smileTotal ? smile.yes / smileTotal : 0;

    // Interview & product-feedback counts (from admin-only tables).
    let interviewSignups = 0;
    let productFeedback = 0;
    {
      const q1 = await supabaseAdmin
        .from("interview_signups")
        .select("device_id", { count: "exact", head: true })
        .gte("created_at", since);
      interviewSignups = q1.count ?? 0;
      const q2 = await supabaseAdmin
        .from("product_feedback")
        .select("device_id", { count: "exact", head: true })
        .gte("created_at", since);
      productFeedback = q2.count ?? 0;
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
      inviteCodes,
      activeInviteFilter: data.invite_code ?? null,
      smile: { ...smile, rate: smileRate },
      interviewSignups,
      productFeedback,
    };

  });

// ============================================================================
// Founder Dashboard — glanceable morning metrics.
// Yesterday (UTC) vs Last 7 days (rolling), for the numbers a founder watches.
// ============================================================================

const FounderInput = z.object({
  token: z.string().min(16).max(200),
});

export interface FounderMetric {
  label: string;
  yesterday: number | string;
  last7: number | string;
  hint?: string;
}

export interface FounderMetrics {
  generatedAt: string;
  yesterdayLabel: string; // e.g. "2026-07-18"
  metrics: FounderMetric[];
}

export const getFounderMetrics = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => FounderInput.parse(data))
  .handler(async ({ data }): Promise<FounderMetrics | { error: string }> => {
    const expected = process.env.ANALYTICS_ADMIN_TOKEN;
    if (!expected) return { error: "not_configured" };
    if (data.token.length !== expected.length) return { error: "unauthorized" };
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= data.token.charCodeAt(i) ^ expected.charCodeAt(i);
    if (diff !== 0) return { error: "unauthorized" };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const dayStr = (d: Date) => d.toISOString().slice(0, 10);
    const now = new Date();
    const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const yesterdayStart = new Date(todayStart.getTime() - 86400_000);
    const yesterdayLabel = dayStr(yesterdayStart);
    // Pull enough history to compute D7 retention for last-7-day cohort.
    const lookbackStart = new Date(todayStart.getTime() - 15 * 86400_000);

    const { data: rows, error } = await supabaseAdmin
      .from("analytics_events")
      .select("device_id, name, created_at")
      .gte("created_at", lookbackStart.toISOString())
      .order("created_at", { ascending: true })
      .limit(20000);
    if (error) return { error: error.message };

    const all = rows ?? [];

    // Per-device: first_seen day, set of active days, set of event names.
    const firstSeen = new Map<string, string>();
    const activeDays = new Map<string, Set<string>>();
    const events = new Map<string, Set<string>>();
    for (const r of all) {
      const day = r.created_at.slice(0, 10);
      if (!firstSeen.has(r.device_id)) firstSeen.set(r.device_id, day);
      const ad = activeDays.get(r.device_id) ?? new Set<string>();
      ad.add(day);
      activeDays.set(r.device_id, ad);
      const ev = events.get(r.device_id) ?? new Set<string>();
      ev.add(r.name);
      events.set(r.device_id, ev);
    }

    // Windows.
    const in7 = new Set<string>();
    for (let i = 1; i <= 7; i++) in7.add(dayStr(new Date(todayStart.getTime() - i * 86400_000)));

    const visitorsY = new Set<string>();
    const visitors7 = new Set<string>();
    for (const [dev, days] of activeDays) {
      if (days.has(yesterdayLabel)) visitorsY.add(dev);
      for (const d of days) if (in7.has(d)) { visitors7.add(dev); break; }
    }

    // Named-event counters, scoped to devices whose FIRST event happened in-window.
    const countBy = (evName: string, dayFilter: (d: string) => boolean) => {
      let n = 0;
      for (const [dev, fs] of firstSeen) {
        if (!dayFilter(fs)) continue;
        if (events.get(dev)?.has(evName)) n++;
      }
      return n;
    };
    const isY = (d: string) => d === yesterdayLabel;
    const is7 = (d: string) => in7.has(d);

    // Retention: of devices whose FIRST day was N days ago, % active +1 day / +7 days later.
    const retentionForCohortDay = (cohortDay: string, offset: number) => {
      const devicesInCohort: string[] = [];
      for (const [dev, fs] of firstSeen) if (fs === cohortDay) devicesInCohort.push(dev);
      if (devicesInCohort.length === 0) return { size: 0, rate: 0 };
      const targetDay = dayStr(new Date(new Date(cohortDay + "T00:00:00Z").getTime() + offset * 86400_000));
      let hit = 0;
      for (const dev of devicesInCohort) if (activeDays.get(dev)?.has(targetDay)) hit++;
      return { size: devicesInCohort.length, rate: hit / devicesInCohort.length };
    };

    // D1 for yesterday's cohort = day-before-yesterday cohort measured at yesterday.
    const dbyLabel = dayStr(new Date(todayStart.getTime() - 2 * 86400_000));
    const d1Yesterday = retentionForCohortDay(dbyLabel, 1);

    // D1 rolling across last 7 completed cohort days (cohort at least 1 day old).
    let d1Num = 0, d1Den = 0;
    for (let i = 2; i <= 8; i++) {
      const cohortDay = dayStr(new Date(todayStart.getTime() - i * 86400_000));
      const r = retentionForCohortDay(cohortDay, 1);
      d1Num += r.size * r.rate;
      d1Den += r.size;
    }
    const d1Rolling = d1Den ? d1Num / d1Den : 0;

    // D7 rolling across cohorts old enough to have 7 days elapsed.
    let d7Num = 0, d7Den = 0;
    for (let i = 8; i <= 14; i++) {
      const cohortDay = dayStr(new Date(todayStart.getTime() - i * 86400_000));
      const r = retentionForCohortDay(cohortDay, 7);
      d7Num += r.size * r.rate;
      d7Den += r.size;
    }
    const d7Rolling = d7Den ? d7Num / d7Den : 0;

    // Avg events per active device (proxy for session depth).
    const eventsYesterday = all.filter((r) => r.created_at.slice(0, 10) === yesterdayLabel);
    const events7 = all.filter((r) => in7.has(r.created_at.slice(0, 10)));
    const avgEventsY = visitorsY.size ? eventsYesterday.length / visitorsY.size : 0;
    const avgEvents7 = visitors7.size ? events7.length / visitors7.size : 0;

    // Interviews completed — count of interview_signups rows in each window.
    const { count: intY } = await supabaseAdmin
      .from("interview_signups")
      .select("device_id", { count: "exact", head: true })
      .gte("created_at", yesterdayStart.toISOString())
      .lt("created_at", todayStart.toISOString());
    const sevenAgo = new Date(todayStart.getTime() - 7 * 86400_000);
    const { count: int7 } = await supabaseAdmin
      .from("interview_signups")
      .select("device_id", { count: "exact", head: true })
      .gte("created_at", sevenAgo.toISOString())
      .lt("created_at", todayStart.toISOString());

    // Sign-ups = invite_redemptions in-window (proxy for "someone unlocked the app").
    const { count: signY } = await supabaseAdmin
      .from("invite_redemptions")
      .select("device_id", { count: "exact", head: true })
      .gte("created_at", yesterdayStart.toISOString())
      .lt("created_at", todayStart.toISOString());
    const { count: sign7 } = await supabaseAdmin
      .from("invite_redemptions")
      .select("device_id", { count: "exact", head: true })
      .gte("created_at", sevenAgo.toISOString())
      .lt("created_at", todayStart.toISOString());

    const pct = (n: number) => `${Math.round(n * 100)}%`;

    const metrics: FounderMetric[] = [
      { label: "Visitors", yesterday: visitorsY.size, last7: visitors7.size, hint: "Unique devices with any event" },
      { label: "Sign-ups", yesterday: signY ?? 0, last7: sign7 ?? 0, hint: "Invite codes redeemed" },
      { label: "Penny hatched", yesterday: countBy("penny_hatched", isY), last7: countBy("penny_hatched", is7), hint: "First-time hatches (cohort by first day)" },
      { label: "Lesson 1 completed", yesterday: countBy("first_lesson_completed", isY), last7: countBy("first_lesson_completed", is7), hint: "First lesson finished (cohort by first day)" },
      { label: "Day 1 retention", yesterday: d1Yesterday.size ? pct(d1Yesterday.rate) : "—", last7: d1Den ? pct(d1Rolling) : "—", hint: "% of new devices back the next day" },
      { label: "Day 7 retention", yesterday: "—", last7: d7Den ? pct(d7Rolling) : "—", hint: "% of new devices back 7 days later" },
      { label: "Avg events / device", yesterday: avgEventsY.toFixed(1), last7: avgEvents7.toFixed(1), hint: "Proxy for session depth" },
      { label: "Interviews signed up", yesterday: intY ?? 0, last7: int7 ?? 0, hint: "'Help Penny grow' opt-ins" },
    ];

    return {
      generatedAt: new Date().toISOString(),
      yesterdayLabel,
      metrics,
    };
  });

