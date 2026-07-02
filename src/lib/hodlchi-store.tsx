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
  moodExpiresAt: number | null; // timestamp; after this, mood is derived from context
  lastQuizPct: number | null; // 0..1 last quiz score
  acknowledgedStage: Stage;
  reflections: Reflection[];
}

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
};

const STORAGE_KEY = "hodlchi-state-v1";

function loadState(): HodlchiState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
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

export function stageForLevel(level: number): Stage {
  // Users hatch during onboarding, so level 1 already starts as Baby.
  if (level <= 2) return "Baby";
  if (level <= 5) return "Student";
  if (level <= 9) return "Builder";
  if (level <= 15) return "Investor";
  return "Money Legend";
}

export function progressToNextStage(level: number, xp: number) {
  // Thresholds align with stageForLevel (Baby → Student → Builder → Investor → Legend).
  const thresholds = [0, 200, 500, 900, 1500, 2400];
  let stageIdx = 0;
  for (let i = 0; i < thresholds.length - 1; i++) {
    if (xp >= thresholds[i] && xp < thresholds[i + 1]) {
      stageIdx = i;
      break;
    }
    if (xp >= thresholds[thresholds.length - 1]) stageIdx = thresholds.length - 2;
  }
  const start = thresholds[stageIdx];
  const end = thresholds[stageIdx + 1] ?? xp + 1;
  const pct = Math.min(100, Math.round(((xp - start) / (end - start)) * 100));
  return { pct, start, end, current: xp, nextStage: stageForLevel(xpToLevel(end)) };
  void level;
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
  if (stageForLevel(state.level) !== state.acknowledgedStage) return "celebrating";
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
        setState((s) => ({ ...s, acknowledgedStage: stageForLevel(s.level), mood: "happy" })),
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
