# Contributing to Hodlchi

Thanks for taking a look! Hodlchi is an early-stage product, so contributions
are welcome — especially bug reports, lesson-content suggestions, and
accessibility fixes.

## Ground rules

- **Educational only.** Hodlchi does not offer trading, wallets, or
  investment advice. Any PR that adds live financial data, trade execution,
  or advice-shaped content will be closed.
- **Penny is the hero.** Copy and UI changes should keep Penny — the money
  companion — at the center of the experience.
- **Keep it playful.** Tone is warm, encouraging, and beginner-friendly.

## Setup

```bash
git clone https://github.com/<your-fork>/hodlchi.git
cd hodlchi
bun install         # or: npm install
cp .env.example .env  # fill in your Lovable Cloud / Supabase keys
bun run dev         # or: npm run dev
```

Open http://localhost:8080.

## Project layout

- `src/routes/` — file-based TanStack Start routes (English at `/`, Spanish
  mirror at `/es`).
- `src/lib/lessons-data.ts` and `lessons-data-es.ts` — the curriculum.
- `src/lib/hodlchi-store.tsx` — Penny's XP, streak, mood, and memory state.
- `src/lib/sfx.ts` — procedural Web Audio sound design.
- `src/components/HodlchiAvatar.tsx` — Penny herself.

## Making a change

1. Create a branch: `git checkout -b fix/short-description`.
2. Keep edits scoped — one thing per PR.
3. Run `bun run lint` and `bun run build` before pushing.
4. If you touch curriculum, update both `lessons-data.ts` and
   `lessons-data-es.ts` so English and Spanish stay in sync.
5. Open a PR describing the *why*, not just the *what*.

## Reporting bugs

Include:
- What you were doing (route, action)
- What you expected
- What happened
- Browser + OS
- A screenshot or short screen recording if the bug is visual

## Security

See [SECURITY.md](./SECURITY.md).
