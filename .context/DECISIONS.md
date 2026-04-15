# Keep Close - Architecture Decisions

## ADR-001: Replace Consta UI with Custom Components

**Status**: Accepted & Implemented

**Context**: Consta UI was initially used for rapid prototyping but doesn't align with the warm, personal aesthetic needed for Keep Close.

**Decision**: Build custom components using:
- Tailwind CSS for styling
- Lucide React for icons
- Framer Motion for animations
- Manrope font for typography

**Consequences**: 
- More control over design
- Smaller bundle size
- Consistent with design vision

---

## ADR-002: d3-force for Floating Layout

**Status**: Accepted & Implemented

**Context**: The dashboard needs organic, floating avatars that don't overlap and feel natural.

**Decision**: Use d3-force simulation with:
- `forceRadial` - circular arrangement around center
- `forceCollide` - prevent overlapping
- `forceCenter` - keep centered in viewport

**Consequences**:
- ~15KB additional bundle
- Natural, physics-based movement
- Responsive to container size

---

## ADR-003: Mobile List View

**Status**: Accepted & Implemented

**Context**: Floating canvas doesn't work well on small screens.

**Decision**: On mobile (<768px), show a vertical list of family members instead of the floating canvas.

**Consequences**:
- Better mobile UX
- Simpler touch interactions
- Need to maintain two layouts

---

## ADR-004: Dark Mode First with Warm Accents

**Status**: Accepted (Replaced ADR about Glass Morphism)

**Context**: Initial pink-purple gradient with heavy glass morphism looked generic - like every AI-generated template.

**Decision**: Dark mode as primary with:
- Deep charcoal background (#0a0a0b) - not blue-ish
- Warm coral accent (#FF8A7A) - family-friendly
- Amber secondary (#FFB366)
- Subtle borders instead of heavy shadows
- Glass morphism only for floating elements

**Consequences**:
- Unique, non-template aesthetic
- Warm and inviting feel
- Better readability
- Light mode as minimal alternative (pure black/white)

---

## ADR-005: Sidebar Icons Only (80px)

**Status**: Accepted & Implemented

**Context**: Maximize content area while maintaining navigation.

**Decision**: Sidebar shows only icons by default (80px width). No expand functionality needed - keep it minimal.

**Consequences**:
- More space for dashboard
- Cleaner interface
- Icons must be self-explanatory (use tooltips)

---

## ADR-006: Check Templates Auto-Creation

**Status**: Implemented

**Context**: Users shouldn't have to manually create common checks for each family member.

**Decision**: When a member or asset is created, automatically create checks from relevant templates based on:
- Member role (ADULT, CHILD variants)
- Asset type (CAR, HOUSE, COTTAGE)

**Consequences**:
- Immediate value for new users
- May create unwanted checks (provide easy deletion)
- Templates need to be well-curated

---

## ADR-007: Prisma 7 with Adapter Pattern

**Status**: Implemented

**Context**: Prisma 7 no longer supports direct database URLs in schema.

**Decision**: Use `@prisma/adapter-pg` with explicit adapter configuration in `prisma.config.ts`.

**Consequences**:
- Modern Prisma setup
- Better connection pooling potential
- Different initialization pattern than Prisma 5/6

---

## ADR-008: Typography-Driven Design

**Status**: Accepted (New)

**Context**: Need to leverage Manrope font beyond just applying it.

**Decision**: Use typography as a primary design element:
- Large, confident headings with tight letter-spacing (-0.02em to -0.03em)
- Clear hierarchy: display (60px), headline (36px), title (24px)
- Gradient text for emphasis
- text-micro for labels (uppercase, spaced)

**Consequences**:
- Stronger visual hierarchy
- More modern appearance
- Requires consistent application across all pages
