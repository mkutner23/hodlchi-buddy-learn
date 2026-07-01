import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Personality = "ape" | "turtle" | "fox";
export type Mood = "hungry" | "happy" | "focused" | "tired";
export type EggColor = "mint" | "sun" | "berry";

export const EVOLUTION_STAGES = [
  "Egg",
  "Baby Hodlchi",
  "Learner",
  "Builder",
  "Wealth Sage",
  "Money Legend",
] as const;

export type Stage = (typeof EVOLUTION_STAGES)[number];

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
  if (level <= 1) return "Egg";
  if (level <= 3) return "Baby Hodlchi";
  if (level <= 6) return "Learner";
  if (level <= 10) return "Builder";
  return "Wealth Sage";
}

export function progressToNextStage(level: number, xp: number) {
  const thresholds = [0, 100, 300, 600, 1000, 1600]; // stage boundaries
  const stageIdx = Math.min(
    thresholds.length - 2,
    thresholds.findIndex((t, i) => xp < (thresholds[i + 1] ?? Infinity)),
  );
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
  reset: () => void;
  demoMode: () => void;
  isLessonComplete: (pathId: string, lessonId: string) => boolean;
}

const HodlchiContext = createContext<Ctx | null>(null);

export function HodlchiProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HodlchiState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

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
          const mood: Mood =
            correctCount === total ? "happy" : correctCount >= total / 2 ? "focused" : "tired";
          return {
            ...s,
            xp,
            level,
            streak,
            lastActiveDay: today,
            mood,
            completedLessons: already ? s.completedLessons : [...s.completedLessons, key],
          };
        });
      },
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
