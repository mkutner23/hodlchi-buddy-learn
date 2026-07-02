# Four bigger builds for Hodlchi

Four independent workstreams. I'll ship them in this order so each unlocks something visible before the next.

## 1. Money Basics hub (SEO)

Goal: capture "what is X" search intent and funnel to onboarding.

- New index route `/money-basics` listing all topics in a clean card grid, with hub-level metadata + `CollectionPage` JSON-LD.
- New leaf route `/money-basics/$topic` with 8 topics: `budgeting`, `saving`, `investing`, `compound-interest`, `apr`, `credit-score`, `inflation`, `diversification`.
- Each leaf: unique title/description/canonical, `DefinitionText` + `FAQPage` JSON-LD, ~350–500 word plain-English explainer, a "Learn this in 5 minutes with Hodlchi →" CTA linking to the most relevant `/path/*`, and internal links to 2–3 sibling topics.
- Wire hub into homepage footer Resources, `llms.txt`, and `sitemap.xml.ts`.

## 2. Post-lesson reflection

Goal: bridge learning to real life without grading.

- After the quiz results screen in `lesson.$pathId.$lessonId.tsx`, insert one optional reflection step before returning to the dashboard.
- Penny asks one topic-appropriate question (e.g. Saving → "What's one thing you might save for this month?"). Question bank keyed by `pathId` + lesson index in `lessons-data.ts`.
- Free-text input, "Save reflection" and "Skip" buttons. No validation, no scoring.
- Reflections stored in the local Hodlchi store (`reflections: {lessonKey, text, ts}[]`) so future greetings can reference them ("Still thinking about that savings goal?").
- New dashboard card "Your reflections" showing the last 3, collapsible.

## 3. Social proof (framework + honest placeholders)

Goal: build the trust surface now so real numbers slot in later.

- New `src/lib/social-proof.ts` central config with `enabled` flags per stat so nothing shows until it's real.
- Homepage stat strip below the hero: hatched Hodlchis, lessons completed, average lesson length, star rating. Hidden by default; renders only when `enabled: true`.
- Testimonial section (parents/teachers/learners) driven by the same config, hidden until populated.
- Certificate + curriculum pages get a small trust row when enabled.
- No fake numbers shipped — every stat starts disabled with a TODO comment.

## 4. Polished product-tour frame

Goal: make `ProductWalkthrough` visually match the rest of the brand.

- Replace the generic browser chrome with a phone-style device frame (rounded bezel, subtle notch, layered shadow, soft gradient background).
- Add a slow floating idle animation (~6s ease-in-out) and a subtle parallax highlight.
- Tighten spacing so the frame reads as a hero artifact, not a screenshot.
- Reuse existing shadow tokens (`shadow-pop`, `shadow-soft`) and path accent colors — no new palette.

## Technical notes

- All routes use the standard TanStack pattern: `createFileRoute` + `head()` with title/description/canonical/og tags, leaf-only og:image where relevant.
- Money Basics topics stored as a typed const map so the leaf route validates `$topic` and 404s cleanly for unknown slugs (`notFoundComponent` + `errorComponent`).
- Reflections and social-proof config live client-side (localStorage / static config) — no backend changes.
- Add each new URL to `sitemap.xml.ts` and `llms.txt` in the same edit batch that creates the route.
- Typecheck after each workstream.

Reply "go" to start, or tell me to reorder / drop any of the four.
