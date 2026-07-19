# 🐣 Hodlchi

> **The Duolingo of Money.**
> Raise **Penny**, your money companion, while learning saving, investing,
> credit, entrepreneurship, and crypto basics — one 5-minute lesson at a time.

<p>
  <a href="https://hodlchi.com">🌐 Live app</a> ·
  <a href="https://hodlchi.com/es">🇪🇸 Spanish version</a> ·
  <a href="#-see-it-in-action">🎬 Demo</a> ·
  <a href="#-screenshots">📸 Screenshots</a>
</p>

<p>
  <img alt="Status: active development" src="https://img.shields.io/badge/status-active%20development-22c55e">
  <img alt="Made with TanStack Start" src="https://img.shields.io/badge/TanStack%20Start-v1-0f172a">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-149eca">
  <img alt="Tailwind CSS v4" src="https://img.shields.io/badge/Tailwind-v4-38bdf8">
  <img alt="Lovable Cloud" src="https://img.shields.io/badge/Backend-Lovable%20Cloud-8b5cf6">
</p>

---

## 🐣 Meet Penny

Penny isn't just another chatbot.
She's a companion who learns alongside you.

**Feed her knowledge. Watch her evolve. Build better financial habits together.**

That's Hodlchi in one sentence — a habit product where a cute creature is
the reason you come back, and financial literacy is what you happen to
pick up on the way.

---

## 🎬 See it in action

<p align="center">
  <img src="public/media/core-loop.gif" alt="Hodlchi core loop: hatch → name → lesson → XP → evolve" width="320">
</p>

Hatch → Name → 5-minute lesson → XP → Evolve → Come back tomorrow.

---

## ✨ Features

| | |
| :-- | :-- |
| 🐣 **AI-flavored companion** | Penny has moods, memory, and idle life — she yawns, stretches, and reacts to you. |
| 📚 **5 learning paths** | Saving · Investing · Credit · Entrepreneurship · Crypto basics — 4 lessons each. |
| 🎯 **3-question quizzes** | Every lesson ends in a short quiz with feedback and XP. |
| 🔥 **Streaks & levels** | Daily-habit loop: XP → level → evolve → return tomorrow. |
| 🥚 **Evolution stages** | Egg → Baby → Student → Builder → Investor → Money Legend. |
| 🌎 **English + Spanish** | Full mirror at `/es` with translated curriculum and SEO. |
| 🔊 **Procedural sound** | Web Audio marimba, coin pings, and Penny's wordless vocalizations. |
| 🎬 **Cinematic evolution** | Shell crack, glow, star burst, screen shake. |
| 📜 **Free certificate** | Print-optimized PDF when the learner finishes. |
| 🤖 **MCP server** | Public read-only tools at `/mcp` for external AI agents. |
| ☁️ **Lovable Cloud backend** | Supabase with RLS-first schemas. |

---

## 📸 Screenshots

| Landing | Path | Lesson |
| :-: | :-: | :-: |
| <img src="public/screenshots/landing.png" alt="Landing page with Penny greeting" width="240"> | <img src="public/screenshots/path.png" alt="Learning path" width="240"> | <img src="public/screenshots/lesson.png" alt="Lesson screen" width="240"> |

| Dashboard | Money Basics |
| :-: | :-: |
| <img src="public/screenshots/dashboard.png" alt="Daily-habit dashboard" width="240"> | <img src="public/screenshots/money-basics.png" alt="Money Basics glossary" width="240"> |

---

## 🚀 Quick start

```bash
git clone https://github.com/<your-org>/hodlchi.git
cd hodlchi
bun install                 # or: npm install
cp .env.example .env        # fill in your Supabase / Lovable Cloud keys
bun run dev                 # or: npm run dev
```

Open <http://localhost:8080>.

### Environment variables

Copy `.env.example` to `.env` and fill in:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_anon_key
VITE_SUPABASE_PROJECT_ID=your-project-ref
```

On Lovable, these are provisioned automatically when Cloud is enabled —
`.env.example` is only needed for local development outside Lovable.

---

## 🧠 How Codex and GPT-5.6 were used

Hodlchi was built end-to-end with **OpenAI Codex-style agentic coding**
inside Lovable, using **GPT-5.6** as the primary reasoning + code-generation
model.

### GPT-5.6 (`openai/gpt-5.6-sol` and `openai/gpt-5.6-terra`)

1. **Curriculum** — 20 lessons across 5 paths (`src/lib/lessons-data.ts`)
   plus the Money Basics glossary (`src/lib/money-basics.ts`).
2. **Spanish localization** — full translation of curriculum, UI strings,
   and SEO metadata (`src/lib/lessons-data-es.ts`,
   `src/lib/money-basics-es.ts`, `src/lib/i18n-strings.ts`).
3. **Penny's mood + memory** — `deriveMood` state machine and
   personality-specific dialog (`src/lib/hodlchi-store.tsx`,
   `src/lib/penny-greetings.ts`, `src/lib/reflections.ts`).
4. **MCP tool schemas** — public curriculum tools at `/mcp`.

### Codex-style agentic coding

- File-based TanStack Start routes authored and kept in sync with
  `routeTree.gen.ts` through iterative edits.
- Procedural Web Audio sound design (`src/lib/sfx.ts`) built and debugged
  for iOS unlock behavior.
- Cinematic evolution and idle-life micro-animations
  (`EvolveCinematic.tsx`, `HodlchiAvatar.tsx`, `useIdleLife.ts`).
- Certificate print-to-PDF pipeline (`src/routes/certificate.tsx`).
- Playwright + `ffmpeg` recording of the core-loop tour videos.
- SEO + i18n hardening (unique `head()` per route, JSON-LD, `robots.txt`,
  `sitemap.xml`, bidirectional `hreflang`).

### Model routing

- **Reasoning:** `openai/gpt-5.6-sol` for hard tasks (curriculum design,
  i18n, mood state machine).
- **Everyday coding:** `openai/gpt-5.6-terra`.
- **In-app AI:** Lovable AI Gateway — no user API key required.

---

## 🧱 Tech stack

- **Framework:** TanStack Start v1 (React 19 + Vite 7, SSR-capable,
  deployed to Cloudflare Workers via Lovable).
- **Styling:** Tailwind CSS v4 with semantic design tokens in
  `src/styles.css`.
- **Backend:** Lovable Cloud (Supabase) with row-level security.
- **AI:** Lovable AI Gateway (`openai/gpt-5.6-*`, `google/gemini-3.*`).
- **Audio:** Procedural Web Audio API (`src/lib/sfx.ts`).
- **Agent integration:** Public MCP server at `/mcp`
  (`@lovable.dev/mcp-js`).

---

## 🗺️ Roadmap

- ✅ MVP core loop (hatch → learn → feed → evolve)
- ✅ Penny mood + memory system
- ✅ Cinematic evolution
- ✅ Procedural sound design
- ✅ English + Spanish mirror
- ✅ Public MCP server
- ✅ Completion certificate
- ⬜ Dramatic per-stage avatar redesign
- ⬜ Daily memories ("Yesterday you learned…")
- ⬜ Push notifications / streak reminders
- ⬜ Referral rewards
- ⬜ AI money coach (in-lesson Q&A)
- ⬜ Native mobile app
- ⬜ Multiplayer / group streaks

---

## 🔑 Key routes

| Route | Purpose |
| --- | --- |
| `/` | Landing — Penny greets the visitor |
| `/onboarding` | Hatch Penny (egg → name → personality) |
| `/dashboard` | Daily-habit home |
| `/path/:pathId` | Learning path (4 lessons) |
| `/lesson/:pathId/:lessonId` | Lesson + quiz |
| `/certificate` | Free completion certificate |
| `/money-basics` | Plain-English glossary |
| `/mcp` | Public MCP server for AI agents |
| `/es/*` | Full Spanish mirror |

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).
For security reports, see [SECURITY.md](./SECURITY.md).
Release notes live in [CHANGELOG.md](./CHANGELOG.md).

---

## ⚠️ Disclaimer

Hodlchi is **educational only**. It does not offer trading, wallets, or
investment advice. Nothing in the app should be interpreted as a
recommendation to buy, sell, or hold any asset.

## 📄 License

Hodlchi is source-available but not currently released under an
open-source license. All rights reserved © Hodlchi.
