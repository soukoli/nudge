# Keep Close - Development Progress

## Current State (April 2026)

The app is functional with core features implemented. The focus now shifts from building features to refining the philosophy — removing task-tracking language and embracing the "gentle reminder" approach.

### What's Working

**Infrastructure**
- Next.js 15+ with App Router
- TypeScript throughout
- Prisma 7 with PostgreSQL
- i18n (Czech/English) via next-intl
- Vercel-ready deployment

**Core Features**
- Family dashboard with floating avatars (d3-force)
- Family members management
- Assets (pets, property) management
- Theme switching (light/dark/system)
- Responsive design (desktop floating, mobile list)

**Design System**
- Warm, dark-mode-first aesthetic
- Coral accent colors (#FF8A7A)
- Manrope typography
- Glass morphism for floating elements
- Framer Motion animations

### What Needs Refinement

**Terminology Cleanup**
- [ ] Rename "checks" to "nudges" throughout
- [ ] Remove scoring/tracking language
- [ ] Update "completed" to "seen" or remove entirely
- [ ] Simplify status indicators (no percentages)

**Philosophy Alignment**
- [ ] Dashboard should show today's nudges, not completion stats
- [ ] Remove "family health score" concept
- [ ] Make interactions optional (seen vs. checked)
- [ ] Add community wisdom sharing (future)

## Build Status

```
npm run build  ✓ Passing
npm run dev    ✓ Working
```

## Quick Start

```bash
# Start database
docker compose up -d

# Setup database
npm run db:setup

# Run development server
npm run dev
```

Open http://localhost:3000
