# Changelog

All notable changes to Hodlchi are documented here. This project loosely
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Repository polish: README overhaul, screenshots, demo GIF,
  `.env.example`, `CONTRIBUTING.md`, `SECURITY.md`, and this changelog.

## [0.5.0] — Penny is alive

### Added
- Landing hero rewritten to lead with Penny greeting the visitor
  ("Hi! I'm Penny. Will you hatch me?"). CTA is now **Hatch Penny →**.
- Time-of-day awareness in Penny's dashboard greetings (morning hungry,
  afternoon check-in, evening sleepy).
- Contextual memory greetings based on last visit, last lesson, and
  perfect-quiz streaks.

## [0.4.0] — Localization

### Added
- Full Spanish mirror at `/es` with locale derived from the URL.
- Translated curriculum (`lessons-data-es.ts`, `money-basics-es.ts`).
- `LanguageToggle` component and bidirectional `hreflang` links.
- Spanish core-loop tour video with narration.

## [0.3.0] — Agent integrations

### Added
- Public MCP server at `/mcp` exposing curriculum tools
  (`list_learning_paths`, `get_lesson`, `list_money_basics`,
  `get_money_basics_topic`).
- OAuth-protected resource metadata at
  `/.well-known/oauth-protected-resource`.

## [0.2.0] — Character-alive pass

### Added
- Procedural Web Audio sound design (`src/lib/sfx.ts`) with wooden
  clicks, marimba puffs, coin pings, and Penny wordless vocalizations.
- Mood system: `deriveMood` reacts to XP, streak, and recent quiz
  outcomes; six mood states drive avatar animation.
- Idle life micro-actions (`useIdleLife`): yawn, stretch, tail swish,
  soft chirp every 20–90s.
- Cinematic evolution moment with shell crack, glow, and star burst.
- Spring-eased progress bars and XP particle bursts.

## [0.1.0] — MVP

### Added
- Five learning paths (Saving, Investing, Credit, Entrepreneurship,
  Crypto), 4 lessons each with 3-question quizzes.
- Onboarding: egg selection → hatch → naming → personality.
- Home dashboard with XP, streak, level, and evolution progress.
- Evolution stages: Egg → Baby → Student → Builder → Investor →
  Money Legend.
- Print-optimized completion certificate.
- Lovable Cloud (Supabase) backend enabled.
