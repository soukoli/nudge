# Keep Close - Project Context

## Vision & Purpose

**Keep Close** is a minimalist family connection app that helps maintain emotional bonds with family and loved ones. Unlike productivity apps, Keep Close focuses on the **health and continuity of family relationships**.

### Tagline
> "Keep your family close — even when life gets fast."

### Core Philosophy
- **Not about productivity** - about family health and emotional connection
- **Gentle reminders** for small, meaningful actions (calls, quality time)
- **Zero friction, no overwhelm** - simple, beautiful interface
- **"Make invisible care visible"** - surface the small acts of love that keep families together

## Target Users
- Busy families who want to stay connected
- People with elderly parents they want to check on regularly
- Families with shared assets (house, car, cottage) requiring maintenance
- Anyone who values family relationships but struggles with consistent connection

## Core Features

### 1. Family Dashboard (Priority)
- **Floating avatars** of family members arranged around a central status hub
- **d3-force simulation** for natural, organic layout
- **Visual health indicators** showing connection status with each member
- **Quick actions** - call, message, schedule time together

### 2. Family Members
- Profile with photo, relationship, contact info
- **Connection metrics** - last contact, check completion rate
- **Personal checks** - reminders specific to that person (call mom weekly, visit grandpa monthly)

### 3. Assets (Shared Property)
- Track family assets: house, car, cottage, etc.
- **Maintenance checks** - oil change, roof inspection, garden care
- Shared responsibility across family members

### 4. Checks System
- **Templates** - pre-defined recurring tasks (22 templates in seed)
- **Auto-creation** - checks automatically added when member/asset created
- **Status tracking** - overdue (red), pending (yellow), completed (green)
- **Completion history** - track who completed what and when

### 5. Sidebar Navigation (80px, icons only)
- Dashboard (home)
- Members
- Assets
- Checks
- Settings

## Design System v2

### Design Philosophy
- **Warmth over coldness** - Family is warm, use warm colors
- **Confidence in simplicity** - Don't fill every space
- **Typography as design** - Let Manrope speak
- **Motion with purpose** - Subtle, not distracting
- **Approachable, not corporate** - This is for families, not enterprises

### Typography
- **Font**: Manrope (Google Fonts)
- Clean, modern, highly readable
- Large, confident headings with tight letter-spacing

### Colors

**Dark Mode (Primary):**
- Background: Deep charcoal (#0a0a0b) - true dark, not blue-ish
- Surfaces: #111113, #18181b, #1f1f23
- Accent: Soft coral (#FF8A7A) - warm, inviting
- Secondary: Warm amber (#FFB366)
- Text: #fafafa (primary), #a1a1aa (secondary), #71717a (muted)

**Light Mode:**
- Background: Pure white (#ffffff)
- Surfaces: #fafafa, #f4f4f5
- Accent: Deeper coral (#E85A4F) for contrast
- Text: #09090b (primary), #3f3f46 (secondary)

**Status Colors (Both Modes):**
- Success: Soft mint (#6EE7B7 dark / #059669 light)
- Warning: Soft yellow (#FCD34D dark / #D97706 light)
- Error: Soft red (#FCA5A5 dark / #DC2626 light)

### Components Style
- **Cards**: Subtle borders, no heavy shadows or glass morphism everywhere
- **Rounded corners**: 6px (xs) to 28px (xl)
- **Buttons**: Fully rounded (pill shape), warm accent color
- **Icons**: Lucide icon set only
- **Animations**: Framer Motion for purposeful transitions

### Logo
- Blue heart icon (srdce.png in .claude folder)
- Symbolizes connection and communication
- Used in sidebar and central hub

## Technical Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + CSS custom properties
- **Database**: PostgreSQL + Prisma 7
- **i18n**: next-intl (CS/EN)
- **Animations**: Framer Motion
- **Physics**: d3-force for floating layout
- **Icons**: Lucide React
- **Deployment**: Vercel

## File Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx        # Root layout with AppShell
│   │   ├── page.tsx          # Landing page
│   │   ├── dashboard/        # Main floating dashboard
│   │   ├── members/          # Family members list/detail
│   │   ├── assets/           # Assets list/detail
│   │   ├── checks/           # Checks table view
│   │   └── settings/         # App settings
│   ├── api/                  # API routes
│   └── globals.css           # Design system v2
├── components/
│   ├── ui/                   # Base components (Button, Input, Modal, Card, Avatar, Badge)
│   ├── layout/               # AppShell, Sidebar, Header
│   ├── dashboard/            # FamilyCanvas, FloatingAvatar, FamilyStatusHub
│   ├── modals/               # Add modals
│   ├── checks/               # Check-related components
│   └── pages/                # LandingPage
├── hooks/                    # Custom hooks (useForceLayout, useMediaQuery, useFamily, etc.)
├── lib/                      # Utilities, Prisma client, types
├── i18n/                     # next-intl configuration
└── messages/                 # Translation files (cs.json, en.json)
```

## Database Schema (Prisma)

- **Family** - root entity, has invite code for sharing
- **FamilyMember** - people in family (name, role, avatar, birthdate)
- **Asset** - shared property (type: CAR, HOUSE, COTTAGE, OTHER)
- **Check** - task/reminder linked to member or asset
- **CheckTemplate** - reusable check templates
- **CheckCompletion** - history of completed checks

## API Endpoints

- `GET/POST /api/family` - Family CRUD
- `GET/POST /api/members` - Members CRUD
- `GET/POST /api/assets` - Assets CRUD
- `GET/POST/PATCH /api/checks` - Checks CRUD + completion
- `GET/POST /api/templates` - Check templates

## Key UX Principles

1. **Emotion over efficiency** - warm colors, gentle animations
2. **Glanceable status** - see family health at a glance
3. **Non-judgmental** - no guilt, just gentle nudges
4. **Personal** - feels like your family, not a corporate tool
5. **Desktop-first, mobile-ready** - works beautifully on desktop, list view on mobile

## Reference Materials

- Dashboard design: `.claude/dashboard.jpg`
- Component patterns: `.claude/components.jpg`
- Logo: `.claude/srdce.png`
