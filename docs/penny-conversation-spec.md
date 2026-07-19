# Penny Conversation Spec

This document defines Penny's emotional voice across the lifecycle of a user.
It is the source of truth for what Penny says, when, and — just as importantly —
what she does **not** say.

Every line should support at least one of these feelings:
**proud · curious · responsible · delighted · encouraged**

Lines should never make the user feel **guilty, judged, or pressured**.

---

## Tone principles

1. **Warm, not needy.** Penny is happy you're here, but her mood does not
   depend on your attendance.
2. **Specific, not generic.** Reference the actual lesson, topic, or streak
   whenever memory allows.
3. **Short.** One or two sentences. Emoji sparingly.
4. **Optional relationship.** A user taking a break is fine. Penny welcomes
   them back — she does not report how long they were gone.
5. **Encourage, don't guilt.** ✅ "Welcome back! I saved today's challenge for
   us." ⚠️ Avoid: "I've been waiting." / "It's been N days." / "I was worried."

---

## Lifecycle moments

### 🐣 First launch (pre-hatch)
- "Hi! I'm Penny."
- "Nobody has ever hatched me before."
- "Will you help me learn about money?"

### 🥚 Just after hatch, before naming
- Personality-specific line ("I'm Penny — let's build something big.")
- "What should your Hodlchi call themselves?"

### ☀️ Day 1 — first lesson complete
- "That was fun! I feel a little smarter already."
- If quiz was perfect: "You're already teaching me things. 👀"

### 🔁 Day 2 return
- "You came back! I was thinking about yesterday's lesson."
- If memory has `lastTopic`: "Yesterday we finished {topic}. What today?"

### 🌙 Two days away
- "Good to see you! We were on {topic} — pick it up together?"
- Never mention the gap length.

### 💚 Three or more days away
- "Welcome back! 💚 I saved our spot on {topic}."
- Fallback (no memory): "Welcome back! I saved today's challenge for us."
- Never: "I missed you", "I was worried", "It's been N days".

### 🎓 First investing lesson complete
- "I think I'm starting to understand investing!"

### 🔥 7-day streak
- "We've learned together every day this week."

### 🎂 Hatch anniversary
- "It's my hatch-day today! 🎂 Let's celebrate with a lesson?"

### 🏆 Evolution
- Speech bubble stays celebratory and about *growth*, not obligation.
- "Look at us — we levelled up together."

---

## Time-of-day (fallback, when nothing more specific fits)

- Morning: "Morning! I'm hungry — one lesson to start the day?"
- Afternoon: "Afternoon check-in — feed me a lesson? 🍎"
- Evening: "Getting sleepy… one quick lesson before bed? 🌙"

---

## Forbidden patterns

- ❌ Guilt-inducing absence lines.
- ❌ Numeric day-count callouts ("It's been 5 days").
- ❌ Passive-aggressive teasing.
- ❌ Streak-loss shame. If a streak breaks, Penny greets warmly and *does
  not* mention the broken streak.
- ❌ Repetition within a session (every line has a stable key).

---

## Feature ↔ feeling map

| Feature | Primary feeling |
|---|---|
| Hatch sequence | delighted, curious |
| Naming | responsible |
| Lesson completion | proud |
| Evolution | proud, delighted |
| Streak | encouraged |
| Absence return greeting | encouraged (never guilt) |
| Daily ritual card | curious |
| Certificate | proud |

If a future feature does not map to a feeling on this list, question whether
it belongs in the next sprint at all.

---

## Personality consistency across surfaces

Penny should sound recognizably like herself everywhere — not just in the dashboard greeting.

- **Loading**: Calm and brief. "Just a moment…" / "Waking up…"
- **Errors**: Reassuring, never alarming. "Something wobbled." / "Your Hodlchi is safe. Try again."
- **Achievements**: Celebrate growth, not numbers. "Look at us!" / "We did that together."
- **Reminders / notifications**: Gentle invitation, not a demand. "I saved a spot for today's lesson." / "Ready when you are."

If a message would sound weird coming from a warm, curious friend, rewrite it.

---

## Feature test

Before shipping any new copy, feature, or interaction, ask:

> **Does this make someone more likely to care about Penny?**

If the answer is no, reconsider the feature or the way it is framed.
