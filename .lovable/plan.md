Ship a "character-alive" pass for Penny across three fronts, in one batch.

## 1. Penny reacts before you do (contextual greetings)

Extend `src/lib/hodlchi-store.tsx` with tracked signals: `lastVisitAt`, `streak`, `sessionCorrectStreak`, `totalCorrect`, `lastAcknowledgedGreetingKey`.

New helper `getContextualGreeting(state)` in `src/lib/penny-greetings.ts` picks the highest-priority line:
- Streak ≥ 6 & first visit today → "I've been waiting for you!"
- Same-day return within 2h → "Back so soon? Let's go."
- Missed yesterday (streak just broken) → "I saved your seat."
- 20+ session correct → "You're getting scary good at this."
- New day, streak 2-5 → "Day {n}. Let's keep it going."
- Fallback → existing dynamic bubble.

Dashboard shows greeting bubble on mount with a 400ms delay + `sfx.penny.happy/excited` matched to tone. Greeting stored so it doesn't repeat within the session.

## 2. Random idle sounds & animations (Animal Crossing feel)

New `src/hooks/useIdleLife.ts`:
- Runs only when dashboard tab is visible and user hasn't interacted for 8s.
- Every 20-90s (random) picks from: stretch, yawn, tail-swish, sigh, soft-chirp.
- Fires a matching `sfx.penny.*` or `sfx.chirp` at low volume + sets a transient `idleAction` on the avatar for 1.2s.

`HodlchiAvatar` gains idle overlay animations in `src/styles.css`:
- `animate-penny-stretch` (scaleY 1.08 then settle)
- `animate-penny-yawn` (mouth-o emoji fade)
- `animate-penny-tail` (subtle rotate)
- `animate-penny-sigh` (tiny puff)

Pauses during evolve cinematic, during lesson nav, and when tab hidden (`document.visibilityState`).

## 3. Game feel polish

- **Button squish**: new `.btn-squish` utility (active:scale-95 + ease-out spring). Applied to primary CTAs on dashboard and lesson.
- **XP particles**: enhance existing `+50 XP` on lesson-complete with 6 tiny star spans radiating out (`animate-xp-particle` with random rotate via inline style).
- **Spring progress bars**: replace linear width transition on evolution progress with a cubic-bezier spring (`cubic-bezier(.34,1.56,.64,1)`, 700ms).
- **Subtle evolution screen shake**: add `animate-screen-shake` (translate ±3px, 400ms) triggered inside `EvolveCinematic` at the crack moment.
- **Penny looks toward taps**: track last tap X on dashboard; avatar container gets `--look: -1|0|1` CSS var and eyes/head translate 2-3px horizontally.
- **Pet interaction**: already squishes; add tiny heart particle burst.

## Quiet fix

Fix the dashboard hydration mismatch by gating the client-only greeting/idle work behind a mounted flag so SSR renders a stable shell.

## Files touched

- `src/lib/hodlchi-store.tsx` (new signals)
- `src/lib/penny-greetings.ts` (new)
- `src/hooks/useIdleLife.ts` (new)
- `src/components/HodlchiAvatar.tsx` (idle overlays, look-toward)
- `src/routes/dashboard.tsx` (wire greetings, idle, squish, shake, mounted flag)
- `src/routes/lesson.$pathId.$lessonId.tsx` (XP particles, squish)
- `src/components/EvolveCinematic.tsx` (screen shake)
- `src/styles.css` (new keyframes + utilities)

No new deps. Pure CSS + Web Audio. Should ship in one build.