import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Personality = "ape" | "turtle" | "fox";
export type Mood =
  | "hungry"
  | "happy"
  | "focused"
  | "tired"
  | "sleepy"
  | "excited"
  | "proud"
  | "confused"
  | "celebrating";
export type EggColor = "mint" | "sun" | "berry";

export const EVOLUTION_STAGES = [
  "Egg",
  "Baby",
  "Student",
  "Builder",
  "Investor",
  "Money Legend",
] as const;

export type Stage = (typeof EVOLUTION_STAGES)[number];

export interface Reflection {
  lessonKey: string; // "pathId:lessonId"
  text: string;
  ts: number;
}

export interface PennyMemory {
  firstHatchedAt: number | null; // birthday
  firstLessonAt: number | null;
  firstLessonKey: string | null;
  firstStreakAt: number | null; // ts when streak first hit >= 2
  firstInvestingAt: number | null;
  firstEvolutionAt: number | null;
  visitCount: number;
  lastLoginAt: number | null;
}

export type FeedbackRating = "love" | "good" | "ok" | "confusing";

export interface AnalyticsEvent {
  name: string;
  ts: number;
  meta?: Record<string, string | number | boolean | null>;
}

export interface HodlchiState {
  onboarded: boolean;
  name: string;
  egg: EggColor;
  personality: Personality;
  xp: number;
  level: number;
  streak: number;
  lastActiveDay: string | null;
  completedLessons: string[]; // "pathId:lessonId"
  mood: Mood;
  moodExpiresAt: number | null;
  lastQuizPct: number | null;
  acknowledgedStage: Stage;
  reflections: Reflection[];
  memory: PennyMemory;
  events: AnalyticsEvent[]; // capped, most-recent last
  feedback: { firstLesson: FeedbackRating | null };
}

const DEFAULT_MEMORY: PennyMemory = {
  firstHatchedAt: null,
  firstLessonAt: null,
  firstLessonKey: null,
  firstStreakAt: null,
  firstInvestingAt: null,
  firstEvolutionAt: null,
  visitCount: 0,
  lastLoginAt: null,
};

const DEFAULT_STATE: HodlchiState = {
  onboarded: false,
  name: "",
  egg: "mint",
  personality: "ape",
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDay: null,
  completedLessons: [],
  mood: "hungry",
  moodExpiresAt: null,
  lastQuizPct: null,
  acknowledgedStage: "Baby",
  reflections: [],
  memory: { ...DEFAULT_MEMORY },
  events: [],
  feedback: { firstLesson: null },
};

const STORAGE_KEY = "hodlchi-state-v1";

function loadState(): HodlchiState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<HodlchiState>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      memory: { ...DEFAULT_MEMORY, ...(parsed.memory ?? {}) },
      feedback: { ...DEFAULT_STATE.feedback, ...(parsed.feedback ?? {}) },
      events: Array.isArray(parsed.events) ? parsed.events : [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(s: HodlchiState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function xpToLevel(xp: number) {
  // simple curve: 100 xp per level
  return Math.max(1, Math.floor(xp / 100) + 1);
}

// XP thresholds for each stage. Index i is the minimum XP to be in STAGE_ORDER[i].
const STAGE_THRESHOLDS = [0, 80, 200, 380, 580] as const;
const STAGE_ORDER: Stage[] = ["Baby", "Student", "Builder", "Investor", "Money Legend"];

export function stageForXp(xp: number): Stage {
  let idx = 0;
  for (let i = 0; i < STAGE_THRESHOLDS.length; i++) {
    if (xp >= STAGE_THRESHOLDS[i]) idx = i;
  }
  return STAGE_ORDER[idx];
}

// Back-compat wrapper — some callers pass level; derive xp from level.
export function stageForLevel(level: number): Stage {
  return stageForXp(Math.max(0, (level - 1) * 100));
}

export function progressToNextStage(_level: number, xp: number) {
  let stageIdx = 0;
  for (let i = 0; i < STAGE_THRESHOLDS.length; i++) {
    if (xp >= STAGE_THRESHOLDS[i]) stageIdx = i;
  }
  const start = STAGE_THRESHOLDS[stageIdx];
  const nextIdx = Math.min(stageIdx + 1, STAGE_ORDER.length - 1);
  const isMax = stageIdx === STAGE_ORDER.length - 1;
  const end = isMax ? xp : STAGE_THRESHOLDS[nextIdx];
  const pct = isMax
    ? 100
    : Math.min(100, Math.round(((xp - start) / (end - start)) * 100));
  return { pct, start, end, current: xp, nextStage: STAGE_ORDER[nextIdx] };
  void _level;
}


interface Ctx {
  state: HodlchiState;
  setOnboarding: (data: { name: string; egg: EggColor; personality: Personality }) => void;
  completeLesson: (pathId: string, lessonId: string, correctCount: number, total: number) => void;
  flashMood: (mood: Mood, durationMs?: number) => void;
  evolve: () => void;
  reset: () => void;
  demoMode: () => void;
  isLessonComplete: (pathId: string, lessonId: string) => boolean;
  addReflection: (pathId: string, lessonId: string, text: string) => void;
}

export function stageIndex(stage: Stage): number {
  return EVOLUTION_STAGES.indexOf(stage);
}

/**
 * Derive the mood Penny should show right now.
 *
 * Priority:
 * 1. A short-lived "flash" mood (excited/confused/proud/celebrating) that was
 *    set by a recent interaction and hasn't expired yet.
 * 2. A contextual mood derived from streak, XP progress, and last-active day.
 */
export function deriveMood(state: HodlchiState, now: number = Date.now()): Mood {
  if (state.moodExpiresAt && now < state.moodExpiresAt) return state.mood;

  const today = new Date(now).toISOString().slice(0, 10);
  const lastActive = state.lastActiveDay;

  // No lesson yet today — Penny nudges the user.
  if (lastActive !== today) {
    if (!lastActive) return "hungry"; // brand new
    const daysAgo = Math.floor(
      (now - new Date(lastActive + "T12:00:00Z").getTime()) / 86400000,
    );
    if (daysAgo >= 2) return "sleepy"; // been ignored — dozing off
    return "hungry"; // one day gap, ready to be fed a lesson
  }

  // Already active today.
  const prog = progressToNextStage(state.level, state.xp);
  const xpToNext = Math.max(0, prog.end - state.xp);
  if (stageForXp(state.xp) !== state.acknowledgedStage) return "celebrating";
  if (xpToNext > 0 && xpToNext <= 30) return "excited";
  if (state.streak >= 3) return "proud";
  return "happy";
}




const HodlchiContext = createContext<Ctx | null>(null);

export function HodlchiProvider({ children }: { children: ReactNode }) {
  // Initialize synchronously from localStorage so route guards (e.g. dashboard's
  // "redirect if !onboarded") see the persisted state on first render rather
  // than racing against a post-mount setState.
  const [state, setState] = useState<HodlchiState>(() => loadState());
  const [ready, setReady] = useState(true);

  useEffect(() => {
    if (ready) saveState(state);
  }, [state, ready]);

  const value = useMemo<Ctx>(
    () => ({
      state,
      setOnboarding: ({ name, egg, personality }) =>
        setState((s) => ({
          ...s,
          onboarded: true,
          name,
          egg,
          personality,
          mood: "happy",
        })),
      completeLesson: (pathId, lessonId, correctCount, total) => {
        const key = `${pathId}:${lessonId}`;
        setState((s) => {
          const already = s.completedLessons.includes(key);
          const gained = correctCount * 10 + (correctCount === total ? 20 : 0);
          const xp = s.xp + gained;
          const level = xpToLevel(xp);
          const today = todayKey();
          let streak = s.streak;
          if (s.lastActiveDay !== today) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
            streak = s.lastActiveDay === yesterday ? s.streak + 1 : 1;
          }
          const pct = total > 0 ? correctCount / total : 0;
          // Celebrate a perfect run; feel proud on a strong pass;
          // look a bit confused on a shaky one.
          const mood: Mood =
            pct === 1 ? "celebrating" : pct >= 0.5 ? "proud" : "confused";
          return {
            ...s,
            xp,
            level,
            streak,
            lastActiveDay: today,
            mood,
            moodExpiresAt: Date.now() + 8000,
            lastQuizPct: pct,
            completedLessons: already ? s.completedLessons : [...s.completedLessons, key],
          };
        });
      },
      flashMood: (mood, durationMs = 1500) =>
        setState((s) => ({ ...s, mood, moodExpiresAt: Date.now() + durationMs })),
      evolve: () =>
        setState((s) => ({ ...s, acknowledgedStage: stageForXp(s.xp), mood: "happy" })),
      reset: () => setState({ ...DEFAULT_STATE }),
      demoMode: () =>
        setState({
          ...DEFAULT_STATE,
          onboarded: true,
          name: "Demo Hodlchi",
          egg: "mint",
          personality: "fox",
          xp: 120,
          level: xpToLevel(120),
          streak: 3,
          lastActiveDay: todayKey(),
          mood: "happy",
          completedLessons: ["saving:s1", "saving:s2", "investing:i1"],
        }),
      isLessonComplete: (pathId, lessonId) =>
        state.completedLessons.includes(`${pathId}:${lessonId}`),
      addReflection: (pathId, lessonId, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        setState((s) => ({
          ...s,
          reflections: [
            { lessonKey: `${pathId}:${lessonId}`, text: trimmed, ts: Date.now() },
            ...s.reflections,
          ].slice(0, 50),
        }));
      },
    }),
    [state],
  );

  return <HodlchiContext.Provider value={value}>{children}</HodlchiContext.Provider>;
}

export function useHodlchi() {
  const ctx = useContext(HodlchiContext);
  if (!ctx) throw new Error("useHodlchi must be used within HodlchiProvider");
  return ctx;
}
