# Keep Close - Project Context

## Vision

**Keep Close** is a minimal app that gently reminds people of meaningful relationships and small acts of care in their daily life.

It does not track, measure, or enforce behavior — it simply surfaces what matters, so nothing important is forgotten.

### Tagline
> "Keep your family close — even when life gets fast."

### The Problem We Solve

Modern life is fast. Families drift apart not because they don't care, but because they forget. They forget to call. They forget the small moments. They forget what makes a family feel like home.

Keep Close is the gentle voice that says: *"Hey, maybe call mom today"* — without guilt, without scores, without judgment.

## Core Philosophy

### What This App IS
- A gentle reminder of what matters
- A place to see your family at a glance
- Simple suggestions that surface daily
- A tool that makes invisible care visible

### What This App IS NOT
- A task manager
- A productivity tool
- A habit tracker with scores
- Something that judges you

### Key Principles

1. **No Tracking** — We don't count how often you call your mom
2. **No Scores** — There's no "family health percentage" to stress about
3. **No Checkboxes** — You don't "complete" love
4. **Just Visibility** — See what matters, that's enough

## How It Works

### 1. Setup (Playful & Simple)
- Add your family members (parents, kids, siblings, grandparents)
- Add special things (pets, shared house, family car)
- Optionally add "things I don't want to forget" (nudges)

No complex configuration. Just names and relationships.

### 2. Daily Screen (The Whole Product)
When you open the app, you see today's gentle reminders:

```
"Ask your daughter about school"
"Call your parents"
"Play with the cat"
```

That's it. Nothing more.

### 3. Interaction Model
- **No checkboxes** — You don't tick off "called mom"
- **Optional acknowledgment** — Maybe just "I saw this"
- **No guilt** — Tomorrow is a new day

The app shows what's important. What you do with it is your choice.

## The Nudge System

### What is a Nudge?
A nudge is a gentle reminder — not a task. It appears, you see it, and that's enough.

### Types of Nudges
- **Quality Time** — "Spend time with [person]"
- **Check In** — "How is [person] doing?"
- **Appreciation** — "Tell [person] something nice"
- **Care** — "Take care of [asset/pet]"
- **Remember** — "Don't forget about [thing]"

### Nudge Behavior
- Nudges appear based on simple rules (daily, weekly, monthly)
- They rotate so you don't see the same thing every day
- You can add your own or use community suggestions
- They disappear after you've seen them (no lingering guilt)

## Future Vision: Wisdom Sharing

Families learn. They discover what works. They develop rituals and habits that keep them close.

**Community Wisdom** — Families can share their nudges with others:
- "We found that Sunday dinners really helped"
- "Asking about friends, not just grades, changed everything"
- "A weekly walk with grandpa made him so happy"

These shared wisdoms become nudge templates that other families can adopt.

## Target Users

- Busy parents who want to stay connected with their kids
- Adults with aging parents they don't want to forget
- Families that feel disconnected but don't know why
- Anyone who values relationships but struggles with consistency

## Design Philosophy

### Emotional Tone
- **Warm, not cold** — This is about love
- **Gentle, not urgent** — No red alerts
- **Simple, not overwhelming** — One screen matters
- **Personal, not corporate** — It's your family

### Visual Design
- Dark mode primary (cozy evening feel)
- Warm coral accents (not cold blue)
- Floating family members on dashboard
- Clean, confident typography (Manrope)

## Technical Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL + Prisma 7
- **i18n**: next-intl (Czech/English)
- **Animations**: Framer Motion
- **Layout**: d3-force for floating avatars
- **Icons**: Lucide React

## File Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── dashboard/     # Main daily view
│   │   ├── members/       # Family members
│   │   ├── assets/        # Pets, property, things
│   │   ├── nudges/        # Manage nudges
│   │   └── settings/      # Preferences
│   └── api/               # Backend endpoints
├── components/
│   ├── ui/                # Base components
│   ├── layout/            # App shell
│   ├── dashboard/         # Daily view components
│   └── nudges/            # Nudge components
├── hooks/                 # React hooks
├── lib/                   # Utilities
└── messages/              # Translations
```

## Success Metrics (Internal Only)

We don't track users. But we know we're successful when:
- People open the app daily (not because they have to, but because they want to)
- Families report feeling more connected
- The app disappears into routine — it's just part of the day

## Reference Materials

- Dashboard inspiration: `.claude/dashboard.jpg`
- Component patterns: `.claude/components.jpg`
- Logo (blue heart): `.claude/srdce.png`
