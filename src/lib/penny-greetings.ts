// Contextual greetings — Penny reacts before the user does, based on streak,
// time-since-last-visit, recent quiz performance, and MEMORY of what the
// user just studied. Highest priority wins.

import type { HodlchiState } from "@/lib/hodlchi-store";
import { PATHS, type PathId } from "@/lib/lessons-data";

export type GreetingTone = "excited" | "happy" | "proud" | "hungry" | "sleepy";

export interface Greeting {
  key: string; // stable id so we don't repeat within a session
  line: string;
  tone: GreetingTone;
}

const MS_PER_DAY = 86400000;

function daysBetween(iso: string, now: number): number {
  const then = new Date(iso + "T12:00:00Z").getTime();
  return Math.floor((now - then) / MS_PER_DAY);
}

// Warm, casual phrase for each lesson so Penny can "remember" it.
// Falls back to the lesson title if we don't have a specific line.
const LESSON_TOPIC: Record<string, string> = {
  "saving:s1": "why saving matters",
  "saving:s2": "emergency funds",
  "saving:s3": "the 50/30/20 budget",
  "saving:s4": "automating your savings",
  "investing:i1": "what investing really is",
  "investing:i2": "compounding",
  "investing:i3": "diversification",
  "investing:i4": "risk and time horizon",
  "credit:c1": "how credit works",
  "credit:c2": "interest and APR",
  "credit:c3": "building a credit score",
  "credit:c4": "dodging debt traps",
  "entrepreneurship:e1": "starting from a real problem",
  "entrepreneurship:e2": "pricing",
  "entrepreneurship:e3": "cash flow",
  "entrepreneurship:e4": "growth loops",
  "crypto:o1": "how crypto works",
  "crypto:o2": "wallets and keys",
  "crypto:o3": "stablecoins",
  "crypto:o4": "spotting scams",
};

function lookupLesson(key: string): { pathId: PathId; title: string } | null {
  const [pathId, lessonId] = key.split(":") as [PathId, string];
  const path = PATHS.find((p) => p.id === pathId);
  if (!path) return null;
  const lesson = path.lessons.find((l) => l.id === lessonId);
  if (!lesson) return null;
  return { pathId, title: lesson.title };
}

function nextPathReadingAhead(state: HodlchiState): PathId | null {
  const done = new Set(state.completedLessons.map((k) => k.split(":")[0]));
  const lastPath = state.completedLessons.length
    ? (state.completedLessons[state.completedLessons.length - 1].split(":")[0] as PathId)
    : null;
  for (const p of PATHS) {
    if (p.id === lastPath) continue;
    // Path they've started but not finished, OR a fresh one they haven't touched.
    const doneCount = p.lessons.filter((l) =>
      state.completedLessons.includes(`${p.id}:${l.id}`),
    ).length;
    if (doneCount < p.lessons.length && !done.has(p.id)) return p.id;
  }
  return null;
}

const PATH_TEASE: Record<PathId, string> = {
  saving: "Saving next? I've been thinking about it.",
  investing: "Investing next? I've been reading ahead. 🌱",
  credit: "Credit next? I've been reading ahead.",
  entrepreneurship: "Entrepreneurship next? I've been brainstorming. 🚀",
  crypto: "Crypto next? I've been curious about it. 🪙",
};

export function pickContextualGreeting(
  state: HodlchiState,
  now: number = Date.now(),
): Greeting | null {
  const today = new Date(now).toISOString().slice(0, 10);
  const doneToday = state.lastActiveDay === today;
  const daysSince = state.lastActiveDay ? daysBetween(state.lastActiveDay, now) : null;
  const doneLessons = state.completedLessons.length;
  const lastKey = doneLessons > 0 ? state.completedLessons[doneLessons - 1] : null;
  const lastTopic = lastKey ? LESSON_TOPIC[lastKey] : null;
  const lastLesson = lastKey ? lookupLesson(lastKey) : null;

  // 1. Loyal returner — long streak, first visit of the day.
  if (state.streak >= 6 && !doneToday) {
    return {
      key: `waiting-${today}`,
      line: "I've been waiting for you! 💚",
      tone: "excited",
    };
  }

  // 2. MEMORY — returning after a day off, referencing what they just learned.
  if (daysSince === 1 && !doneToday && lastTopic) {
    return {
      key: `remember-yesterday-${lastKey}-${today}`,
      line: `Yesterday you learned about ${lastTopic}. Ready for more?`,
      tone: "happy",
    };
  }

  // 3. Streak just broke — gentle re-welcome, still with memory.
  if (daysSince !== null && daysSince >= 2 && state.streak <= 1 && doneLessons > 2) {
    if (lastTopic) {
      return {
        key: `saved-seat-${lastKey}-${today}`,
        line: `I saved your seat. We left off at ${lastTopic}.`,
        tone: "sleepy",
      };
    }
    return {
      key: `saved-seat-${today}`,
      line: "I saved your seat. Ready to pick it up?",
      tone: "sleepy",
    };
  }

  // 4. Hot streak of correct answers this session.
  if (state.lastQuizPct === 1 && doneLessons >= 3) {
    return {
      key: `scary-good-${doneLessons}`,
      line: "You're getting scary good at this. 👀",
      tone: "proud",
    };
  }

  // 5. MEMORY — proud of consistency in a single path.
  if (state.streak >= 3 && lastLesson) {
    const pathDone = state.completedLessons.filter((k) =>
      k.startsWith(`${lastLesson.pathId}:`),
    ).length;
    if (pathDone >= 2) {
      return {
        key: `path-streak-${lastLesson.pathId}-${state.streak}`,
        line: `${state.streak} days on ${lastLesson.pathId} in a row — proud of you. 💪`,
        tone: "proud",
      };
    }
  }

  // 6. MEMORY — teasing the next path she's "been reading ahead" on.
  if (doneToday && doneLessons >= 2) {
    const tease = nextPathReadingAhead(state);
    if (tease) {
      return {
        key: `tease-${tease}-${today}`,
        line: PATH_TEASE[tease],
        tone: "excited",
      };
    }
  }

  // 7. Same-day quick return.
  if (doneToday && daysSince === 0) {
    return {
      key: `back-soon-${today}`,
      line: "Back so soon? Let's go! ⚡",
      tone: "happy",
    };
  }

  // 8. Mid-streak nudge.
  if (state.streak >= 2 && state.streak < 6 && !doneToday) {
    return {
      key: `day-n-${today}`,
      line: `Day ${state.streak + 1}. Let's keep it going. 🔥`,
      tone: "excited",
    };
  }

  return null;
}
