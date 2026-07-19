// Penny's memory — derived views over the persistent `state.memory` facts.
// Pure functions only. No React, no localStorage, no side effects. Anything
// the UI wants to render about "what Penny remembers" should flow through
// here so callbacks stay consistent across surfaces (dashboard, greetings,
// certificate).
//
// See docs/penny-memory-architecture.md for the contract.

import type { HodlchiState } from "@/lib/hodlchi-store";
import { PATHS, type PathId } from "@/lib/lessons-data";

const MS_PER_DAY = 86400000;

export function daysSinceTs(ts: number, now: number = Date.now()): number {
  return Math.max(0, Math.floor((now - ts) / MS_PER_DAY));
}

export function ageInDays(state: HodlchiState, now: number = Date.now()): number | null {
  const t = state.memory.firstHatchedAt;
  return t ? daysSinceTs(t, now) : null;
}

export function daysSinceLastSeen(state: HodlchiState, now: number = Date.now()): number | null {
  if (!state.lastActiveDay) return null;
  const then = new Date(state.lastActiveDay + "T12:00:00Z").getTime();
  return Math.max(0, Math.floor((now - then) / MS_PER_DAY));
}

/** Look up a lesson's title from a "pathId:lessonId" key. */
export function lessonTitleFromKey(key: string): { pathId: PathId; title: string } | null {
  const [pathId, lessonId] = key.split(":") as [PathId, string];
  const path = PATHS.find((p) => p.id === pathId);
  const lesson = path?.lessons.find((l) => l.id === lessonId);
  return lesson ? { pathId, title: lesson.title } : null;
}

export interface FavoriteTopic {
  pathId: PathId;
  count: number;
  /** "high" once the leading path has >= 2 more lessons than the runner-up. */
  confidence: "high" | "low";
}

export function favoriteTopic(state: HodlchiState): FavoriteTopic | null {
  const counts: Partial<Record<PathId, number>> = {};
  for (const k of state.completedLessons) {
    const p = k.split(":")[0] as PathId;
    counts[p] = (counts[p] ?? 0) + 1;
  }
  const entries = Object.entries(counts) as Array<[PathId, number]>;
  if (entries.length === 0) return null;
  entries.sort((a, b) => b[1] - a[1]);
  const [topId, topN] = entries[0];
  const runnerUp = entries[1]?.[1] ?? 0;
  return {
    pathId: topId,
    count: topN,
    confidence: topN - runnerUp >= 2 ? "high" : "low",
  };
}

export type MilestoneKind =
  | "hatched"
  | "first-lesson"
  | "first-streak"
  | "first-investing"
  | "first-evolution"
  | "longest-streak"
  | "favorite-topic"
  | "visits";

export interface Milestone {
  kind: MilestoneKind;
  /** Timestamp when it happened. `null` for derived-only rows (favorite topic, visits). */
  ts: number | null;
  /** Stable id for React keys and de-dupe. */
  id: string;
  /** Optional payload — lesson key, path id, streak length, etc. */
  meta?: Record<string, string | number>;
}

/**
 * Chronological ledger of everything Penny remembers about this user.
 * Ordered oldest → newest so a UI can render it as a diary. Derived-only
 * rows (favorite topic, visit count) are appended at the end with `ts: null`.
 */
export function getMilestones(state: HodlchiState): Milestone[] {
  const m = state.memory;
  const dated: Milestone[] = [];

  if (m.firstHatchedAt) {
    dated.push({ kind: "hatched", ts: m.firstHatchedAt, id: "hatched" });
  }
  if (m.firstLessonAt && m.firstLessonKey) {
    dated.push({
      kind: "first-lesson",
      ts: m.firstLessonAt,
      id: "first-lesson",
      meta: { lessonKey: m.firstLessonKey },
    });
  }
  if (m.firstStreakAt) {
    dated.push({ kind: "first-streak", ts: m.firstStreakAt, id: "first-streak" });
  }
  if (m.firstInvestingAt) {
    dated.push({ kind: "first-investing", ts: m.firstInvestingAt, id: "first-investing" });
  }
  if (m.firstEvolutionAt) {
    dated.push({ kind: "first-evolution", ts: m.firstEvolutionAt, id: "first-evolution" });
  }
  dated.sort((a, b) => (a.ts ?? 0) - (b.ts ?? 0));

  const derived: Milestone[] = [];
  if (m.longestStreak >= 2) {
    derived.push({
      kind: "longest-streak",
      ts: null,
      id: "longest-streak",
      meta: { days: m.longestStreak },
    });
  }
  const fav = favoriteTopic(state);
  if (fav && fav.confidence === "high") {
    derived.push({
      kind: "favorite-topic",
      ts: null,
      id: `favorite-${fav.pathId}`,
      meta: { pathId: fav.pathId, count: fav.count },
    });
  }
  if (m.visitCount >= 3) {
    derived.push({
      kind: "visits",
      ts: null,
      id: "visits",
      meta: { count: m.visitCount },
    });
  }

  return [...dated, ...derived];
}
