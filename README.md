# Hodlchi — The Duolingo of Money 🥚💸

Hatch a cute virtual companion (Penny) and grow it by completing 5-minute financial literacy lessons on Saving, Investing, Credit, Entrepreneurship, and Crypto basics. Educational only — no trading, wallets, or investment advice.

- **Live app:** https://hodlchi.com
- **Spanish version:** https://hodlchi.com/es
- **Code repository:** _Connect this Lovable project to GitHub via the workspace's GitHub integration to publish the repo URL here._ Once connected, the repo will live at `https://github.com/<your-org>/hodlchi` and sync bidirectionally with Lovable.

> To connect: in Lovable, open the **+** menu → **GitHub → Connect project**, then paste the resulting repo URL into this section.

---

## How Codex & GPT-5.6 were used

Hodlchi was built end-to-end with **OpenAI Codex-style agentic coding** inside Lovable, using **GPT-5.6** as the primary reasoning + code-generation model. Every feature below was designed, coded, and iteratively debugged through Codex-style tool calls (file edits, shell exec, Playwright verification, migrations) driven by GPT-5.6.

### GPT-5.6 (via `openai/gpt-5.6-sol` and `openai/gpt-5.6-terra`)
Used as the app's reasoning engine and as the agent model that authored the codebase:

1. **Curriculum authoring** — GPT-5.6 generated all 20 lessons across 5 learning paths (`src/lib/lessons-data.ts`) plus the full "Money Basics" glossary (`src/lib/money-basics.ts`), each with age-agnostic explanations, quiz questions, and correct/incorrect feedback.
2. **Full Spanish localization** — GPT-5.6 translated the entire curriculum, UI strings, and SEO metadata into neutral Latin American Spanish (`src/lib/lessons-data-es.ts`, `src/lib/money-basics-es.ts`, `src/lib/i18n-strings.ts`) and mirrored the routing tree under `/es`.
3. **Penny's mood + dialog system** — GPT-5.6 wrote the `deriveMood` state machine (`src/lib/hodlchi-store.tsx`) and the personality-specific greeting/reflection copy (`src/lib/penny-greetings.ts`, `src/lib/reflections.ts`).
4. **MCP tool schemas** — GPT-5.6 designed the public MCP server exposing curriculum tools (`list_learning_paths`, `get_lesson`, `list_money_basics`, `get_money_basics_topic`) so external AI agents can consume Hodlchi's content.

### Codex-style agentic coding
The whole app was built by an agent loop that reads files, edits them, runs the dev server, and verifies visually — the same pattern OpenAI Codex uses:

1. **File-based routing scaffold** — TanStack Start routes (`src/routes/*.tsx`) authored, refactored, and kept in sync with `routeTree.gen.ts` through iterative edits.
2. **Procedural sound design** — `src/lib/sfx.ts` was authored by the agent using the Web Audio API (compressor, master gain, marimba/bell/chirp synths, 8–12 variations per sound, Penny wordless vocalizations) and debugged for iOS unlock behavior.
3. **Cinematic evolution + idle life** — `EvolveCinematic.tsx`, `HodlchiAvatar.tsx`, and `useIdleLife.ts` were built with spring easing, particle bursts, pointer tracking, and random micro-animations (yawn, stretch, chirp) through many small verified edits.
4. **Certificate PDF pipeline** — the print-to-PDF flow in `src/routes/certificate.tsx` renders a standalone landscape document into a hidden iframe, iteratively debugged until printing was clean.
5. **Playwright + ffmpeg recording** — the agent drove a headless Chromium against the running app to record the English core-loop tour, cropped it to the phone frame with ffmpeg, and exported `hodlchi-core-loop-en.mp4`.
6. **SEO + i18n hardening** — unique `head()` metadata, JSON-LD, `robots.txt`, `sitemap.xml.ts`, bidirectional `hreflang` links, and Google Search Console verification all landed through Codex-style iterative edits.

### Model routing
- **Chat / reasoning:** `openai/gpt-5.6-sol` for hard reasoning (curriculum design, i18n, mood state machine), `openai/gpt-5.6-terra` for everyday coding turns, with `reasoning_effort: "none"` set on all GPT-5.6 chat-completions calls per the Lovable AI Gateway contract.
- **In-app AI:** Lovable AI Gateway (no user API key required) — see `<cloud-ai-models>` in the project.

---

## Tech stack

- **Framework:** TanStack Start v1 (React 19 + Vite 7, SSR-capable, deployed to Cloudflare Workers via Lovable)
- **Styling:** Tailwind CSS v4 with semantic design tokens in `src/styles.css`
- **Backend:** Lovable Cloud (Supabase) with RLS-first schemas
- **AI:** Lovable AI Gateway (`openai/gpt-5.6-*`, `google/gemini-3.*`)
- **Audio:** Procedural Web Audio API synthesis (`src/lib/sfx.ts`)
- **Agent integration:** Public MCP server at `/mcp` (`@lovable.dev/mcp-js`)

## Key routes

| Route | Purpose |
| --- | --- |
| `/` | Landing + product walkthrough |
| `/onboarding` | Hatch Penny (egg → name → personality) |
| `/dashboard` | Daily-habit home (mood, XP, streak, evolution) |
| `/path/:pathId` | Learning path (4 lessons) |
| `/lesson/:pathId/:lessonId` | Lesson + 3-question quiz |
| `/certificate` | Free completion certificate (print-optimized PDF) |
| `/money-basics` | Plain-English glossary |
| `/mcp` | Public MCP server for AI agents |
| `/es/*` | Full Spanish mirror |

## Local development

```bash
bun install
bun run dev
```

## License

Educational content © Hodlchi. Code available under the repository's license once GitHub sync is enabled.
