# Spanish language version

Ship a neutral Latin American Spanish version of Hodlchi with an in-app EN/ES toggle. Same URLs — the toggle swaps rendered strings and persists the choice in localStorage. Full coverage: UI copy, all 20 lessons + quizzes, Money Basics glossary, Penny's dialog, SEO metadata, blog post, and comparison page.

## Language infrastructure

Add a lightweight i18n layer (no library — small footprint, no server complexity):

- `src/lib/i18n.tsx` — React context providing `{ locale, setLocale, t }`. Persists to `localStorage` under `hodlchi-locale`. Defaults to `en`.
- `src/lib/i18n-strings.ts` — flat `{ en: {...}, es: {...} }` dictionary for all UI copy (landing, nav, buttons, dashboard, onboarding, lesson chrome, certificate, footer, walkthrough, empty states, toasts).
- Wrap the app in `<I18nProvider>` inside `__root.tsx` alongside `HodlchiProvider`.
- Add a subtle `EN | ES` pill toggle in the top-right of every page (header of landing/dashboard/lesson/etc.).

## Translated content

Restructure content files to hold both languages side-by-side rather than duplicating routes:

- `src/lib/lessons-data.ts` — every `title`, `tagline`, `intro`, `question`, `options[]`, `explanation` becomes `{ en, es }`. Helper `getLocalized(field, locale)` returns the right string. All 20 lessons across Saving, Investing, Credit, Entrepreneurship, Crypto — including 60 quiz questions with 4 options and explanations each — get Spanish translations.
- `src/lib/money-basics.ts` — every glossary topic (title, short description, body sections, example, FAQ) gets Spanish alongside English.
- `src/lib/penny-greetings.ts` — mood-based dialog translated per key.
- `src/lib/reflections.ts` and `src/lib/social-proof.ts` — prompts and testimonials translated.

## Routes and SEO

Every route reads `locale` and renders the right language. Head metadata (title, description, og:*, JSON-LD) becomes locale-aware:

- Landing (`/`), dashboard, onboarding, lesson runner, path index, certificate, Money Basics hub + topic pages, blog post, comparison page, financial-literacy-for-everyone.
- Each route's `head()` returns Spanish title/description when locale is `es`. `<html lang>` in `__root.tsx` shell reads the persisted locale on first render.
- Add `<link rel="alternate" hreflang="es">` and `hreflang="en"` pairs on shareable pages so Google understands the two versions live at the same URL under different app state.
- `robots.txt` and `sitemap.xml` unchanged (same URLs).

## Voice guidelines

Neutral Latin American Spanish. Uses "tú" (never "vosotros" or "usted"). Currency examples stay generic ("$100") — no peseta/euro localization. Financial terms use widely-recognized forms: "ahorro", "inversión", "puntaje de crédito" (with "score" in parens the first time), "emprendimiento", "criptomonedas". Penny's tone stays warm and playful. "Streak" translates as "racha", "XP" stays "XP", "Money Legend" becomes "Leyenda del Dinero".

## Delivery order

1. i18n infrastructure + toggle UI + `<html lang>` wiring.
2. UI dictionary (all interface strings across every route).
3. Lessons + quizzes (largest translation surface).
4. Money Basics glossary.
5. Penny dialog + reflections + social proof.
6. SEO head metadata + hreflang alternates + blog + comparison page.

## Technical section

- No new dependencies. Context + dictionary is enough for this scope.
- `useLocale()` hook reads context; components call `t("dashboard.feed_button")` for UI copy and `getLocalized(lesson.intro, locale)` for content.
- Locale reads happen on the client; `__root.tsx` sets `<html lang="en">` at SSR and a client effect updates it to the persisted value. This is fine because the toggle is client-driven and search engines will get either version via hreflang.
- No route changes — the MCP server, sitemap, and existing SEO fixes stay intact.
- Once done, mark any Spanish-relevant SEO findings fixed and note the hreflang additions.

Approve to build.
