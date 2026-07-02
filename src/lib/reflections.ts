import type { PathId } from "@/lib/lessons-data";

/**
 * One optional, non-graded reflection prompt per lesson.
 * Indexed by pathId, then by lesson index (0..3).
 * Kept short — this is a bridge from lesson to real life, not homework.
 */
export const REFLECTION_PROMPTS: Record<PathId, string[]> = {
  saving: [
    "What's one thing you might save for this month?",
    "If a surprise expense hit tomorrow, what would you do?",
    "Which of your spending buckets feels a little off right now?",
    "What's one small thing you could automate this week?",
  ],
  investing: [
    "If you had $50 to invest today, what would you do first?",
    "How long could you leave money invested without touching it?",
    "Do you feel more like a saver or an investor right now?",
    "What would help you stay calm when markets dip?",
  ],
  credit: [
    "Do you know your current credit score? (No wrong answer.)",
    "What's one habit that would improve your credit this month?",
    "How do you feel about using a credit card day-to-day?",
    "What's one debt you'd like to knock down first?",
  ],
  entrepreneurship: [
    "What's a small problem you notice in your own life?",
    "Who's one person you could ask for honest feedback?",
    "What's the tiniest version of your idea you could test this week?",
    "What would make you proud to launch — even messy?",
  ],
  crypto: [
    "What's one crypto term you've always wanted explained?",
    "How much (if any) of your money feels okay to experiment with?",
    "What would help you feel more confident here?",
    "What's one myth about crypto you've heard lately?",
  ],
};

export function getReflectionPrompt(pathId: PathId, lessonIndex: number): string {
  const list = REFLECTION_PROMPTS[pathId];
  return list[lessonIndex] ?? list[0];
}
