// Random idle "life" — every 20–90s, if the user is idle on the dashboard and
// the tab is visible, Penny does a tiny thing (stretch, yawn, tail swish,
// content sigh, soft chirp). Animal Crossing style — makes the world never
// feel frozen.

import { useCallback, useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/sfx";

export type IdleAction = "stretch" | "yawn" | "tail" | "sigh" | "chirp" | null;

const ACTIONS: Exclude<IdleAction, null>[] = ["stretch", "yawn", "tail", "sigh", "chirp"];

interface Options {
  enabled?: boolean;
  minMs?: number;
  maxMs?: number;
  idleAfterMs?: number; // wait this long after last interaction
}

export function useIdleLife({
  enabled = true,
  minMs = 20000,
  maxMs = 90000,
  idleAfterMs = 8000,
}: Options = {}) {
  const [action, setAction] = useState<IdleAction>(null);
  const lastInteractionRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearActionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bump = useCallback(() => {
    lastInteractionRef.current = Date.now();
  }, []);

  const scheduleNext = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const wait = minMs + Math.random() * (maxMs - minMs);
    timerRef.current = setTimeout(tick, wait);
  }, [minMs, maxMs]);

  const tick = useCallback(() => {
    if (typeof document === "undefined") return;
    if (document.visibilityState !== "visible") {
      scheduleNext();
      return;
    }
    if (Date.now() - lastInteractionRef.current < idleAfterMs) {
      scheduleNext();
      return;
    }
    const next = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    setAction(next);
    // fire matching soft sound
    try {
      if (next === "chirp") sfx.chirp();
      else if (next === "yawn") sfx.penny.sleepy();
      else if (next === "sigh") sfx.penny.happy();
      else if (next === "stretch") sfx.penny.proud();
      // "tail" is silent
    } catch {
      /* audio failures are non-fatal */
    }
    if (clearActionRef.current) clearTimeout(clearActionRef.current);
    clearActionRef.current = setTimeout(() => setAction(null), 1400);
    scheduleNext();
  }, [idleAfterMs, scheduleNext]);

  useEffect(() => {
    if (!enabled) return;
    scheduleNext();
    const events = ["pointerdown", "keydown", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    const onVis = () => {
      if (document.visibilityState === "visible") bump();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (clearActionRef.current) clearTimeout(clearActionRef.current);
      events.forEach((e) => window.removeEventListener(e, bump));
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [enabled, scheduleNext, bump]);

  return action;
}
