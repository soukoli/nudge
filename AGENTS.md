<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Keep Close - Agent Instructions

## Project Overview

**Keep Close** is a minimalist family connection app focused on maintaining emotional bonds with family members. This is NOT a productivity app - it's about family health and relationships.

### Key Files to Reference
- `.context/PROJECT.md` - Full project vision, design system, technical stack
- `.context/PROGRESS.md` - Current development status and next steps
- `.context/DECISIONS.md` - Architecture decisions and rationale

### Design Assets
- `.claude/dashboard.jpg` - Dashboard UI inspiration
- `.claude/components.jpg` - Component patterns
- `.claude/srdce.png` - App logo (blue heart)

## Critical Design Rules

1. **Font**: Manrope only (via next/font/google)
2. **Icons**: Lucide React only (no Consta, no other icon sets)
3. **Colors**: Pink-purple gradient background, blue (#5B8DEF) primary
4. **Cards**: Glass morphism (backdrop-blur, semi-transparent)
5. **Corners**: 24px for cards, 12px for buttons
6. **Sidebar**: 72px wide, icons only
7. **Dark/Light**: Follow system preference

## Technical Stack (DO NOT CHANGE)

- Next.js 15+ (App Router)
- TypeScript
- Tailwind CSS 4
- Prisma 7 with PostgreSQL
- next-intl for i18n (CS/EN)
- Framer Motion for animations
- d3-force for floating layout
- Lucide React for icons

## Component Guidelines

### New Components
- Place in `src/components/ui/` for base components
- Place in `src/components/dashboard/` for dashboard-specific
- Use TypeScript interfaces for props
- Use Framer Motion for animations
- Follow glass morphism design pattern

### Existing Code
- DO NOT use @consta/uikit or @consta/icons
- Migrate existing components to new design system
- Keep API routes unchanged (they work correctly)

## Emotional Tone

Remember: This app is about **love and connection**, not tasks and productivity.
- Warm, inviting colors
- Gentle animations
- Non-judgmental language
- "Keep your family close — even when life gets fast."
