import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getAnalyticsSummary, type AnalyticsSummary } from "@/lib/analytics.functions";

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalytics,
  head: () => ({
    meta: [
      { title: "Analytics — Hodlchi Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminAnalytics() {
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("hodlchi.admin.token") ?? "";
  });
  const [inviteFilter, setInviteFilter] = useState<string>("");
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load(t: string, invite?: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await getAnalyticsSummary({
        data: { token: t, invite_code: invite || undefined },
      });
      if ("error" in res) {
        setError(res.error);
        setData(null);
      } else {
        setData(res);
        sessionStorage.setItem("hodlchi.admin.token", t);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-sky pb-16 font-sans">
      <div className="mx-auto max-w-3xl px-5 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-extrabold">Hodlchi Analytics</h1>
          <a href="/admin/invites" className="text-xs font-semibold text-primary hover:underline">
            Manage invites →
          </a>
        </div>
        <p className="mt-1 text-sm text-foreground/60">
          Cohort retention, funnel, and event volumes. 30-day window.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (token.trim()) void load(token.trim(), inviteFilter);
          }}
          className="mt-4 flex flex-wrap gap-2 rounded-3xl bg-white p-3 shadow-soft"
        >
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Admin token"
            className="min-w-0 flex-1 rounded-full border-2 border-foreground/15 bg-white px-4 py-2 text-sm font-semibold outline-none focus:border-primary"
          />
          {data && data.inviteCodes.length > 0 && (
            <select
              value={inviteFilter}
              onChange={(e) => {
                setInviteFilter(e.target.value);
                if (token.trim()) void load(token.trim(), e.target.value);
              }}
              className="rounded-full border-2 border-foreground/15 bg-white px-4 py-2 text-sm font-semibold outline-none focus:border-primary"
            >
              <option value="">All cohorts</option>
              {data.inviteCodes.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                  {c.label ? ` · ${c.label}` : ""} ({c.redeemed_devices})
                </option>
              ))}
            </select>
          )}
          <button
            type="submit"
            disabled={loading || !token.trim()}
            className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            {loading ? "Loading…" : data ? "Refresh" : "Load"}
          </button>
        </form>

        {data?.activeInviteFilter && (
          <div className="mt-3 rounded-2xl bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
            Filtered to cohort: {data.activeInviteFilter}
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-2xl bg-red-100 p-3 text-sm font-semibold text-red-800">
            {error === "unauthorized" ? "Wrong token." : error}
          </div>
        )}

        {data && <SummaryView data={data} />}
      </div>
    </main>
  );
}

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

function SummaryView({ data }: { data: AnalyticsSummary }) {
  const t = data.totals;
  const d1 = computeD1Trend(data);
  return (
    <>
      <section className="mt-5 rounded-3xl bg-gradient-to-br from-primary/15 to-primary/5 p-5 shadow-soft">
        <div className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
          Day-1 retention · this week
        </div>
        <div className="mt-1 flex items-baseline gap-3">
          <div className="font-display text-5xl font-extrabold text-primary">
            {d1.thisWeek === null ? "—" : pct(d1.thisWeek)}
          </div>
          {d1.delta !== null && d1.lastWeek !== null && (
            <div
              className={`text-sm font-bold ${d1.delta >= 0 ? "text-primary" : "text-red-600"}`}
            >
              {d1.delta >= 0 ? "▲" : "▼"} {pct(Math.abs(d1.delta))} vs last week
            </div>
          )}
        </div>
        <div className="mt-1 text-xs text-foreground/60">
          {d1.thisWeekSize} devices this week
          {d1.lastWeek !== null && d1.lastWeekSize
            ? ` · last week ${pct(d1.lastWeek)} (${d1.lastWeekSize} devices)`
            : ""}
        </div>
        <p className="mt-3 text-xs italic text-foreground/60">
          The one number to watch: are new users coming back the day after they hatch Penny?
        </p>
      </section>

      <section className="mt-5 rounded-3xl bg-white p-4 shadow-soft">
        <div className="flex items-baseline justify-between">
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary-deep">
            😊 Smile-check · north star
          </div>
          <div className="text-xs font-mono text-foreground/60">
            {data.smile.yes + data.smile.meh + data.smile.no} responses
          </div>
        </div>
        <div className="mt-1 flex items-baseline gap-3">
          <div className="font-display text-4xl font-extrabold text-primary">
            {data.smile.yes + data.smile.meh + data.smile.no === 0 ? "—" : pct(data.smile.rate)}
          </div>
          <div className="text-xs text-foreground/60">
            said Penny made them smile today
          </div>
        </div>
        <div className="mt-2 flex gap-3 text-[11px] font-semibold">
          <span>😍 yes: {data.smile.yes}</span>
          <span>😐 meh: {data.smile.meh}</span>
          <span>😕 no: {data.smile.no}</span>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Devices" v={t.devices} />
        <Stat label="Events" v={t.events} />
        <Stat label="Hatched" v={t.hatched} />
        <Stat label="1st lesson done" v={t.firstLessonCompleted} />
        <Stat label="Evolutions" v={t.evolutionReached} />
        <Stat label="7-day streaks" v={t.sevenDayStreak} />
        <Stat label="Interview signups" v={data.interviewSignups} />
        <Stat label="Feedback msgs" v={data.productFeedback} />
      </section>


      <section className="mt-5 rounded-3xl bg-white p-4 shadow-soft">
        <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Funnel</div>
        <ol className="mt-2 space-y-2">
          {data.funnel.map((f) => (
            <li key={f.step}>
              <div className="flex justify-between text-sm">
                <span className="font-semibold">{f.step}</span>
                <span className="font-mono text-foreground/60">
                  {f.devices} · {pct(f.rate)}
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-foreground/10">
                <div className="h-full bg-primary transition-all" style={{ width: `${Math.max(2, f.rate * 100)}%` }} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-5 rounded-3xl bg-white p-4 shadow-soft">
        <div className="flex items-baseline justify-between">
          <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Retention</div>
          <div className="text-xs font-mono text-foreground/60">
            D1 {pct(data.retention.overall.d1)} · D7 {pct(data.retention.overall.d7)} · D30 {pct(data.retention.overall.d30)}
          </div>
        </div>
        <div className="mt-3 overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-foreground/50">
                <th className="pb-2 font-semibold">Cohort</th>
                <th className="pb-2 font-semibold">Size</th>
                <th className="pb-2 font-semibold">D1</th>
                <th className="pb-2 font-semibold">D7</th>
                <th className="pb-2 font-semibold">D30</th>
              </tr>
            </thead>
            <tbody>
              {data.retention.cohorts.map((c) => (
                <tr key={c.cohort} className="border-t border-foreground/5">
                  <td className="py-1.5 font-mono">{c.cohort}</td>
                  <td className="py-1.5 font-bold">{c.size}</td>
                  <RetCell v={c.d1} />
                  <RetCell v={c.d7} />
                  <RetCell v={c.d30} />
                </tr>
              ))}
              {data.retention.cohorts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-3 text-center text-foreground/50">No cohorts yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl bg-white p-4 shadow-soft">
          <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Feedback</div>
          {data.feedback.length === 0 ? (
            <div className="mt-2 text-sm text-foreground/50">No feedback yet.</div>
          ) : (
            <ul className="mt-2 space-y-1 text-sm">
              {data.feedback.map((f) => (
                <li key={f.rating} className="flex justify-between">
                  <span className="capitalize">{f.rating}</span>
                  <span className="font-bold">{f.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-3xl bg-white p-4 shadow-soft">
          <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Event volumes</div>
          <ul className="mt-2 max-h-56 space-y-1 overflow-auto text-sm">
            {data.eventCounts.map((e) => (
              <li key={e.name} className="flex justify-between">
                <span className="font-mono">{e.name}</span>
                <span className="font-bold">{e.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-5 rounded-3xl bg-white p-4 shadow-soft">
        <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Recent events</div>
        <ul className="mt-2 max-h-64 space-y-1 overflow-auto text-xs">
          {data.recentEvents.map((e, i) => (
            <li key={i} className="rounded-lg bg-foreground/5 px-2 py-1">
              <span className="font-mono font-bold">{e.name}</span>
              <span className="text-foreground/50"> · {new Date(e.created_at).toLocaleString()}</span>
              <span className="text-foreground/40"> · dev {e.device_id}</span>
              {Object.keys(e.meta).length > 0 && (
                <span className="text-foreground/40"> · {JSON.stringify(e.meta)}</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function Stat({ label, v }: { label: string; v: number }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-soft">
      <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">{label}</div>
      <div className="mt-0.5 font-display text-2xl font-extrabold">{v}</div>
    </div>
  );
}

function RetCell({ v }: { v: number }) {
  const bg = v === 0 ? "bg-foreground/5" : v < 0.15 ? "bg-primary/15" : v < 0.4 ? "bg-primary/40" : "bg-primary/70";
  return <td className="py-1.5 pr-2"><span className={`inline-block rounded px-1.5 py-0.5 font-mono ${bg}`}>{pct(v)}</span></td>;
}

// Weighted D1 for cohorts that landed in the [start, end) day window,
// where cohorts are only counted once at least 1 full day has elapsed.
function computeD1Trend(data: AnalyticsSummary): {
  thisWeek: number | null;
  lastWeek: number | null;
  delta: number | null;
  thisWeekSize: number;
  lastWeekSize: number;
} {
  const now = Date.now();
  const DAY = 86400_000;

  const window = (startDaysAgo: number, endDaysAgo: number) => {
    let devices = 0;
    let weighted = 0;
    for (const c of data.retention.cohorts) {
      const cohortMs = new Date(c.cohort + "T00:00:00Z").getTime();
      const ageDays = (now - cohortMs) / DAY;
      if (ageDays < 1) continue; // needs a full day to measure D1
      if (ageDays < endDaysAgo || ageDays >= startDaysAgo) continue;
      devices += c.size;
      weighted += c.size * c.d1;
    }
    return devices > 0 ? { rate: weighted / devices, size: devices } : { rate: null, size: 0 };
  };

  const thisW = window(7, 0);
  const lastW = window(14, 7);
  return {
    thisWeek: thisW.rate,
    lastWeek: lastW.rate,
    delta:
      thisW.rate !== null && lastW.rate !== null ? thisW.rate - lastW.rate : null,
    thisWeekSize: thisW.size,
    lastWeekSize: lastW.size,
  };
}
