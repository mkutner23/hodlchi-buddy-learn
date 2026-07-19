import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getFounderMetrics, type FounderMetrics } from "@/lib/analytics.functions";

export const Route = createFileRoute("/admin/founder")({
  component: FounderDashboard,
  head: () => ({
    meta: [
      { title: "Founder Dashboard — Hodlchi" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function FounderDashboard() {
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("hodlchi.admin.token") ?? "";
  });
  const [data, setData] = useState<FounderMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load(t: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await getFounderMetrics({ data: { token: t } });
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

  // Auto-load if a token is already stashed from /admin/analytics.
  useEffect(() => {
    if (token && !data && !loading) void load(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-gradient-sky pb-16 font-sans">
      <div className="mx-auto max-w-3xl px-5 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-extrabold">Founder Dashboard</h1>
          <Link to="/admin/analytics" className="text-xs font-semibold text-primary hover:underline">
            Full analytics →
          </Link>
        </div>
        <p className="mt-1 text-sm text-foreground/60">
          The morning glance. Yesterday vs the last 7 days.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void load(token);
          }}
          className="mt-4 flex flex-wrap gap-2"
        >
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Admin token"
            className="flex-1 min-w-[220px] rounded-full border-2 border-foreground/15 bg-white px-4 py-2 text-sm font-semibold outline-none focus:border-primary"
            type="password"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading || !token.trim()}
            className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            {loading ? "Loading…" : data ? "Refresh" : "Load"}
          </button>
        </form>

        {error && (
          <div className="mt-3 rounded-2xl bg-red-100 p-3 text-sm font-semibold text-red-800">
            {error === "unauthorized" ? "Wrong token." : error}
          </div>
        )}

        {data && (
          <>
            <div className="mt-5 rounded-3xl bg-white p-5 shadow-soft">
              <div className="mb-3 flex items-baseline justify-between">
                <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
                  Yesterday · {data.yesterdayLabel}
                </div>
                <div className="text-[10px] font-mono text-foreground/40">
                  updated {new Date(data.generatedAt).toLocaleTimeString()}
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-foreground/10">
                <table className="w-full text-sm">
                  <thead className="bg-foreground/5 text-left text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                    <tr>
                      <th className="px-3 py-2">Metric</th>
                      <th className="px-3 py-2 text-right">Yesterday</th>
                      <th className="px-3 py-2 text-right">Last 7 days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.metrics.map((m, i) => (
                      <tr key={m.label} className={i % 2 === 0 ? "bg-white" : "bg-foreground/[0.02]"}>
                        <td className="px-3 py-3">
                          <div className="font-semibold">{m.label}</div>
                          {m.hint && (
                            <div className="text-[11px] text-foreground/50">{m.hint}</div>
                          )}
                        </td>
                        <td className="px-3 py-3 text-right font-mono text-base font-bold text-foreground">
                          {m.yesterday}
                        </td>
                        <td className="px-3 py-3 text-right font-mono text-base font-bold text-primary">
                          {m.last7}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="mt-4 text-center text-xs italic text-foreground/50">
              &ldquo;People miss Penny when they don&rsquo;t open the app.&rdquo; — watch D1 and D7.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
