import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { redeemInviteCode } from "@/lib/invites.functions";
import { HodlchiLogo } from "@/components/HodlchiLogo";

const STORAGE_KEY = "hodlchi_invite_v1";
const DEVICE_KEY = "hodlchi_device_id";

type Unlock = { code: string; redeemedAt: number };

/** Paths that require an invite. Everything else stays public for SEO / marketing. */
const GATED_PREFIXES = [
  "/onboarding",
  "/dashboard",
  "/path",
  "/lesson",
  "/money-basics",
  "/certificate",
  "/debug",
  "/es/onboarding",
  "/es/dashboard",
  "/es/path",
  "/es/lesson",
  "/es/money-basics",
  "/es/certificate",
];

function isGatedPath(pathname: string): boolean {
  return GATED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p + "?"),
  );
}

function readUnlock(): Unlock | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Unlock;
    if (parsed && typeof parsed.code === "string" && parsed.code.length > 0) return parsed;
    return null;
  } catch {
    return null;
  }
}

function writeUnlock(code: string) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ code, redeemedAt: Date.now() } satisfies Unlock),
    );
  } catch {
    /* ignore quota errors */
  }
}

function ensureDeviceId(): string {
  if (typeof window === "undefined") return "ssr-placeholder";
  let id = window.localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id =
      (crypto.randomUUID && crypto.randomUUID()) ||
      `dev_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    try {
      window.localStorage.setItem(DEVICE_KEY, id);
    } catch {
      /* ignore */
    }
  }
  return id;
}

export function InviteGate({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const gated = useMemo(() => isGatedPath(pathname), [pathname]);

  const [hydrated, setHydrated] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setUnlocked(readUnlock() !== null);
  }, []);

  // SSR + first paint: render children so public routes are crawlable and
  // gated routes don't flash a blank shell before hydration.
  if (!gated || !hydrated || unlocked) {
    return <>{children}</>;
  }

  return <InviteWall onUnlock={() => setUnlocked(true)} />;
}

function InviteWall({ onUnlock }: { onUnlock: () => void }) {
  const redeem = useServerFn(redeemInviteCode);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    const trimmed = code.trim();
    if (trimmed.length < 3) {
      setStatus("error");
      setError("Enter your invite code to continue.");
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      const result = await redeem({
        data: { code: trimmed, deviceId: ensureDeviceId() },
      });
      if (result.ok) {
        writeUnlock(result.code);
        onUnlock();
      } else {
        setStatus("error");
        setError(result.error);
      }
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <HodlchiLogo className="h-12 w-auto" />
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            <span>🚧</span> Private Beta
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
            Hodlchi is invite-only right now
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Enter your invite code to hatch Penny and start your first 5-minute lesson.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border bg-card p-5 shadow-soft"
          aria-label="Invite code"
        >
          <label htmlFor="invite-code" className="text-sm font-semibold text-foreground">
            Invite code
          </label>
          <input
            id="invite-code"
            type="text"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (status === "error") {
                setStatus("idle");
                setError(null);
              }
            }}
            placeholder="e.g. PENNY-BETA"
            className="mt-2 w-full rounded-xl border bg-background px-4 py-3 text-base font-mono uppercase tracking-wider outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            maxLength={64}
          />
          {error && (
            <p role="alert" className="mt-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-primary/90 disabled:opacity-60"
          >
            {status === "loading" ? "Checking…" : "Unlock Hodlchi"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Don't have a code?{" "}
          <a
            href="mailto:hello@hodlchi.com?subject=Hodlchi%20private%20beta%20invite"
            className="font-semibold text-primary hover:underline"
          >
            Request an invite
          </a>
          .
        </p>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          <a href="/" className="hover:underline">
            ← Back to landing
          </a>
        </p>
      </div>
    </div>
  );
}
