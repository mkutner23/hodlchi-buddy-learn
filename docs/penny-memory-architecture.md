# Penny's Memory Architecture

_Last updated: sprint after founder dashboard shipped._

Penny only feels alive if she **remembers**. This doc is the source of truth
for what she remembers, when it's captured, and when it's allowed to
surface. Everything here answers to a single filter:

> Does this make Penny feel more alive **or** help the user feel more
> confident with money? If neither — cut it.

Memory is a **relational feature**, not a data feature. The goal is never
completeness; it's recognition. A user should be able to walk away for a
week, come back, and feel like Penny actually noticed.

---

## 1. Layers

Penny's memory has three layers. Only Layer 1 is authoritative; the others
are derived on the fly so they can't drift.

### Layer 1 — Persistent facts (`state.memory` in `hodlchi-store`)

Stored in `localStorage` under `hodlchi-state-v1`. Never mutate a field once
set except `visitCount`, `lastLoginAt`, and `longestStreak`.

| Field                | Captured when                                        | Feeling it fuels          |
| -------------------- | ---------------------------------------------------- | ------------------------- |
| `firstHatchedAt`     | Onboarding completes                                 | Birthday, "age together"  |
| `firstLessonAt`      | First lesson ever completed                          | "Remember our first?"     |
| `firstLessonKey`     | Same event, stores `pathId:lessonId`                 | Specific callback         |
| `firstStreakAt`      | Streak first reaches 2                               | "You came back"           |
| `firstInvestingAt`   | First lesson in the Investing path                   | Topic opinion             |
| `firstEvolutionAt`   | First stage evolution acknowledged                   | "You grew me up"          |
| `longestStreak`      | Every lesson (max with current streak)               | Personal-best pride       |
| `visitCount`         | Once per session (see `HodlchiProvider` visit tick)  | "We've met N times"       |
| `lastLoginAt`        | Same tick                                            | Absence detection         |

Layer 1 fields must survive schema drift. `loadState` merges any parsed
value against `DEFAULT_MEMORY` so a returning user never loses a milestone
because we added a new field.

### Layer 2 — Behavioral facts (derived from `state`)

Computed by `src/lib/penny-memory.ts`. Cheap enough to recompute on every
render.

- **Age in days** — from `firstHatchedAt`.
- **Days since last seen** — from `lastActiveDay`.
- **Favorite topic + confidence** — from `completedLessons`. Confidence is
  "high" once the leading path has ≥ 2 more lessons than the runner-up,
  otherwise "low". Penny only voices an opinion at high confidence.
- **Milestone ledger** — a chronologically-ordered list of everything above
  that has actually happened, with the exact timestamp. This is the
  contract `PennyRemembers` renders against.

### Layer 3 — Conversational callbacks (`penny-greetings.ts`)

Reads Layer 1 + Layer 2 and picks a single line per session. Priority is
strict and lives in that file — the highest-signal callback wins. See the
comments there; do not fork the ordering.

---

## 2. Capture rules

1. **Write once, read forever.** First-time fields (`firstHatchedAt`,
   `firstLessonAt`, `firstLessonKey`, `firstInvestingAt`,
   `firstEvolutionAt`, `firstStreakAt`) are set with `?? existing`. Never
   overwrite.
2. **Idempotent updates.** `visitCount` bumps once per session guarded by
   `visitedRef`. `longestStreak` uses `Math.max`. No field increments in a
   loop.
3. **No network required.** Every capture must succeed offline. Analytics
   mirroring via `trackEvent` is fire-and-forget and never blocks writes.
4. **Reset means reset.** `reset()` restores `DEFAULT_MEMORY` in full so
   demo/staging users don't inherit ghosts.

---

## 3. Surface rules

Memory is only allowed to speak when it makes the user feel **recognized**,
never audited.

**Allowed surfaces**

- `PennyRemembers` — a soft, personal strip on the dashboard.
- `pickContextualGreeting` — one line per session in the hero bubble.
- Certificate — uses the user's name; may reference `firstLessonAt` age but
  never a lesson list.

**Forbidden surfaces**

- Push-style modals that block the app on return.
- Full history dumps ("You visited on Mon, Tue, Thu…"). This is
  surveillance, not memory.
- Any copy that quantifies absence in a negative way ("You've been gone
  for 6 days"). Rewrite to invite ("Great to see you again").
- Referencing wrong-answer streaks or failed quizzes. Memory only surfaces
  wins.

---

## 4. Feeling map

Every memory field ships with an intended feeling. If a new field can't be
placed here, it doesn't belong in memory.

| Field                | Feeling produced         |
| -------------------- | ------------------------ |
| `firstHatchedAt`     | belonging, birthday joy  |
| `firstLessonAt`      | nostalgia, "we started"  |
| `firstStreakAt`      | pride                    |
| `firstInvestingAt`   | curiosity ("she noticed")|
| `firstEvolutionAt`   | shared growth            |
| `longestStreak`      | personal best            |
| favorite topic       | being known              |
| age in days          | companionship            |

---

## 5. Adding a new memory field — checklist

1. Does it map to a feeling in §4? If not, stop.
2. Add it to `PennyMemory` and `DEFAULT_MEMORY`, and merge in `loadState`.
3. Write it inside an existing reducer using the `?? existing` pattern.
4. Expose it through `penny-memory.ts` derivations, not raw reads.
5. Give it exactly one surface (a `PennyRemembers` row, a greeting
   priority, or a cinematic). Never two.
6. Add a smile-check-friendly copy line — warm, never guilt-inducing.
