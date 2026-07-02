// Contextual greetings — Penny reacts before the user does, based on streak,
// time-since-last-visit, and recent quiz performance. Highest priority wins.

import type { HodlchiState } from "@/lib/hodlchi-store";

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

export function pickContextualGreeting(
  state: HodlchiState,
  now: number = Date.now(),
): Greeting | null {
  const today = new Date(now).toISOString().slice(0, 10);
  const doneToday = state.lastActiveDay === today;
  const daysSince = state.lastActiveDay ? daysBetween(state.lastActiveDay, now) : null;
  const doneLessons = state.completedLessons.length;

  // 1. Loyal returner — long streak, first visit of the day.
  if (state.streak >= 6 && !doneToday) {
    return {
      key: `waiting-${today}`,
      line: "I've been waiting for you! 💚",
      tone: "excited",
    };
  }

  // 2. Streak just broke — gentle re-welcome.
  if (daysSince !== null && daysSince >= 2 && state.streak <= 1 && doneLessons > 2) {
    return {
      key: `saved-seat-${today}`,
      line: "I saved your seat. Ready to pick it up?",
      tone: "sleepy",
    };
  }

  // 3. Hot streak of correct answers this session.
  if (state.lastQuizPct === 1 && doneLessons >= 3) {
    return {
      key: `scary-good-${doneLessons}`,
      line: "You're getting scary good at this. 👀",
      tone: "proud",
    };
  }

  // 4. Same-day quick return.
  if (doneToday && daysSince === 0) {
    return {
      key: `back-soon-${today}`,
      line: "Back so soon? Let's go! ⚡",
      tone: "happy",
    };
  }

  // 5. Mid-streak nudge.
  if (state.streak >= 2 && state.streak < 6 && !doneToday) {
    return {
      key: `day-n-${today}`,
      line: `Day ${state.streak + 1}. Let's keep it going. 🔥`,
      tone: "excited",
    };
  }

  return null;
}
