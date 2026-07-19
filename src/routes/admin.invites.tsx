import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  listInvites,
  createInvite,
  setInviteActive,
  type InviteRow,
} from "@/lib/invite-admin.functions";

export const Route = createFileRoute("/admin/invites")({
  component: AdminInvites,
  head: () => ({
    meta: [
      { title: "Invites — Hodlchi Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminInvites() {
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("hodlchi.admin.token") ?? "";
  });
  const [invites, setInvites] = useState<InviteRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Create form
  const [newCode, setNewCode] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newMaxUses, setNewMaxUses] = useState(50);
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function load(t: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await listInvites({ data: { token: t } });
      if ("error" in res) {
        setError(res.error);
        setInvites(null);
      } else {
        setInvites(res.invites);
        sessionStorage.setItem("hodlchi.admin.token", t);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim() || !newCode.trim()) return;
    setCreating(true);
    setCreateError(null);
    try {
      const res = await createInvite({
        data: {
          token: token.trim(),
          code: newCode.trim(),
          label: newLabel.trim() || undefined,
          max_uses: newMaxUses,
        },
      });
      if ("error" in res) {
        setCreateError(res.error);
      } else {
        setNewCode("");
        setNewLabel("");
        setNewMaxUses(50);
        await load(token.trim());
      }
    } catch (err) {
      setCreateError((err as Error).message);
    } finally {
      setCreating(false);
    }
  }

  async function toggleActive(code: string, next: boolean) {
    if (!token.trim()) return;
    const res = await setInviteActive({ data: { token: token.trim(), code, active: next } });
    if (!("error" in res)) await load(token.trim());
  }

  return (
    <main className="min-h-screen bg-gradient-sky pb-16 font-sans">
      <div className="mx-auto max-w-3xl px-5 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-extrabold">Invites</h1>
          <a href="/admin/analytics" className="text-xs font-semibold text-primary hover:underline">
            ← Analytics
          </a>
        </div>
        <p className="mt-1 text-sm text-foreground/60">
          Create and manage private-beta invite codes. Each code counts unique devices.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (token.trim()) void load(token.trim());
          }}
          className="mt-4 flex gap-2 rounded-3xl bg-white p-3 shadow-soft"
        >
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Admin token"
            className="flex-1 rounded-full border-2 border-foreground/15 bg-white px-4 py-2 text-sm font-semibold outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={loading || !token.trim()}
            className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            {loading ? "Loading…" : invites ? "Refresh" : "Load"}
          </button>
        </form>

        {error && (
          <div className="mt-3 rounded-2xl bg-red-100 p-3 text-sm font-semibold text-red-800">
            {error === "unauthorized" ? "Wrong token." : error}
          </div>
        )}

        {invites && (
          <>
            <form
              onSubmit={handleCreate}
              className="mt-5 rounded-3xl bg-white p-4 shadow-soft"
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
                New code
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_120px_auto]">
                <input
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="CODE (e.g. WAITLIST-01)"
                  className="rounded-full border-2 border-foreground/15 px-4 py-2 font-mono text-sm uppercase tracking-wider outline-none focus:border-primary"
                  maxLength={64}
                />
                <input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Label (e.g. Twitter round)"
                  className="rounded-full border-2 border-foreground/15 px-4 py-2 text-sm outline-none focus:border-primary"
                  maxLength={120}
                />
                <input
                  type="number"
                  min={1}
                  max={100000}
                  value={newMaxUses}
                  onChange={(e) => setNewMaxUses(Number(e.target.value) || 1)}
                  className="rounded-full border-2 border-foreground/15 px-4 py-2 text-sm outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={creating || !newCode.trim()}
                  className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
                >
                  {creating ? "…" : "Create"}
                </button>
              </div>
              {createError && (
                <p className="mt-2 text-xs font-semibold text-red-700">{createError}</p>
              )}
            </form>

            <section className="mt-5 rounded-3xl bg-white p-4 shadow-soft">
              <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
                Codes ({invites.length})
              </div>
              <div className="mt-3 overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-foreground/50">
                      <th className="pb-2 font-semibold">Code</th>
                      <th className="pb-2 font-semibold">Label</th>
                      <th className="pb-2 font-semibold">Used</th>
                      <th className="pb-2 font-semibold">Devices</th>
                      <th className="pb-2 font-semibold">Status</th>
                      <th className="pb-2 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {invites.map((c) => {
                      const full = c.used_count >= c.max_uses;
                      return (
                        <tr key={c.code} className="border-t border-foreground/5">
                          <td className="py-2 font-mono font-bold">{c.code}</td>
                          <td className="py-2 text-foreground/70">{c.label ?? "—"}</td>
                          <td className="py-2 font-mono">
                            {c.used_count}/{c.max_uses}
                          </td>
                          <td className="py-2 font-mono">{c.redeemed_devices}</td>
                          <td className="py-2">
                            {!c.active ? (
                              <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-semibold">
                                inactive
                              </span>
                            ) : full ? (
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                                full
                              </span>
                            ) : (
                              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                                active
                              </span>
                            )}
                          </td>
                          <td className="py-2">
                            <button
                              onClick={() => toggleActive(c.code, !c.active)}
                              className="rounded-full border border-foreground/15 px-3 py-1 text-xs font-semibold hover:bg-foreground/5"
                            >
                              {c.active ? "Deactivate" : "Activate"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {invites.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-3 text-center text-foreground/50">
                          No codes yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
