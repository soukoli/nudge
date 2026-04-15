# Keep Close

> Keep your family close — even when life gets fast.

A minimal app that gently reminds you of meaningful relationships and small acts of care in your daily life.

**It does not track, measure, or enforce behavior — it simply surfaces what matters, so nothing important is forgotten.**

## What is Keep Close?

Modern life is fast. Families drift apart not because they don't care, but because they forget. They forget to call. They forget the small moments. They forget what makes a family feel like home.

Keep Close is the gentle voice that says: *"Hey, maybe call mom today"* — without guilt, without scores, without judgment.

### What This App Does

- Shows you gentle reminders about your family
- Displays your family members in a beautiful, floating dashboard
- Lets you add "nudges" — things you don't want to forget
- Works on desktop and mobile

### What This App Does NOT Do

- Track your behavior
- Score your "family health"
- Make you feel guilty
- Require constant interaction

## Screenshots

*Coming soon*

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (or Docker)
- npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/soukoli/nudge.git
cd nudge

# Install dependencies
npm install

# Start PostgreSQL (with Docker)
docker compose up -d

# Setup database
npm run db:setup

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/keepclose"
```

## Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: PostgreSQL + [Prisma 7](https://www.prisma.io/)
- **i18n**: [next-intl](https://next-intl-docs.vercel.app/) (Czech/English)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Layout**: [d3-force](https://d3js.org/d3-force) for floating avatars
- **Icons**: [Lucide React](https://lucide.dev/)

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── [locale]/        # Internationalized routes
│   │   ├── dashboard/   # Main daily view
│   │   ├── members/     # Family members
│   │   ├── assets/      # Pets, property
│   │   ├── nudges/      # Manage nudges
│   │   └── settings/    # Preferences
│   └── api/             # Backend endpoints
├── components/          # React components
│   ├── ui/              # Base components
│   ├── layout/          # App shell
│   └── dashboard/       # Dashboard components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities
└── messages/            # Translation files
```

## Philosophy

### No Tracking
We don't count how often you call your mom. That's between you and her.

### No Scores
There's no "family health percentage" to stress about. Life isn't a game.

### No Checkboxes
You don't "complete" love. You just show up.

### Just Visibility
See what matters. That's enough.

## Contributing

This is currently a personal project. If you're interested in contributing, please open an issue first to discuss what you'd like to change.

## License

MIT

---

Made with care for families everywhere.
