# Keep Close - Architecture Decisions

## Philosophy Decisions

### PD-001: No Tracking, No Scores

**Context**: The app could easily become another task tracker with completion rates and streaks. That's not what families need.

**Decision**: 
- No completion percentages
- No streaks or scores
- No "you missed X days" guilt
- Nudges appear and disappear — that's enough

**Rationale**: Families aren't projects to be managed. Love isn't measured in checkboxes.

---

### PD-002: Visibility Over Action

**Context**: Traditional apps require action (check, complete, dismiss). This creates obligation.

**Decision**: 
- Showing a nudge is enough
- User can optionally mark "seen" 
- No required interaction
- Nudges rotate naturally

**Rationale**: The value is in surfacing what matters, not in tracking whether you did it.

---

### PD-003: Gentle Language

**Context**: Words shape experience. "Task", "check", "overdue" create stress.

**Decision**: Use warm, gentle language:
- "Nudge" instead of "task" or "check"
- "Reminder" instead of "alert"
- "Seen" instead of "completed"
- No "overdue" — just "you might want to..."

**Rationale**: This is about care, not compliance.

---

## Technical Decisions

### TD-001: Custom Components Over UI Libraries

**Status**: Implemented

**Decision**: Build custom components with Tailwind + Framer Motion instead of using UI libraries like Consta.

**Rationale**: 
- Full control over warm, personal aesthetic
- Smaller bundle size
- No fighting library defaults

---

### TD-002: d3-force for Floating Layout

**Status**: Implemented

**Decision**: Use d3-force simulation for the family dashboard with floating avatars.

**Configuration**:
- `forceRadial` — circular arrangement around center
- `forceCollide` — prevent overlapping
- `forceCenter` — keep centered in viewport

**Rationale**: Creates organic, living feel — family members float naturally, not in a grid.

---

### TD-003: Mobile List Fallback

**Status**: Implemented

**Decision**: On screens < 768px, show vertical list instead of floating canvas.

**Rationale**: 
- Touch interactions with floating elements are awkward
- List is more scannable on small screens
- Maintains functionality without compromising UX

---

### TD-004: Dark Mode First

**Status**: Implemented

**Decision**: Dark mode as primary, light mode as alternative.

**Colors**:
- Background: Deep charcoal (#0a0a0b)
- Accent: Warm coral (#FF8A7A)
- Secondary: Amber (#FFB366)

**Rationale**: 
- Evening usage likely (checking family before bed)
- Warm colors feel cozy, not corporate
- Light mode remains minimal (pure black/white)

---

### TD-005: Icons-Only Sidebar (72px)

**Status**: Implemented

**Decision**: Sidebar shows only icons, no labels. Fixed 72px width.

**Rationale**:
- Maximizes content area
- Dashboard is the star, not navigation
- Icons with tooltips are sufficient

---

### TD-006: Prisma 7 Adapter Pattern

**Status**: Implemented

**Decision**: Use `@prisma/adapter-pg` with explicit configuration.

**Rationale**: Modern Prisma setup, required for Prisma 7+.

---

## Rejected Decisions

### RD-001: Auto-Create Checks from Templates

**Previous Decision**: Automatically create checks when member/asset is added.

**Why Rejected**: Creates immediate overwhelm. User should consciously add what they care about.

**New Approach**: Offer suggestions, but user chooses what to add.

---

### RD-002: Family Health Score

**Previous Decision**: Central hub shows "family health" as percentage.

**Why Rejected**: Scoring creates pressure and guilt. Reduces relationships to metrics.

**New Approach**: Hub shows today's gentle reminders, no numerical score.
