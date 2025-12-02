# Phase 1: Tailwind CSS 4 Foundation

**Story**: 3.2 - Intégration Design System (Dark Mode)
**Phase**: 1 of 4
**Status**: 📋 READY FOR IMPLEMENTATION

---

## Quick Navigation

| Document | Purpose |
|----------|---------|
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Atomic commit strategy and code changes |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) | Per-commit checklist for implementation |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Prerequisites and environment configuration |
| [guides/REVIEW.md](./guides/REVIEW.md) | Code review guide |
| [guides/TESTING.md](./guides/TESTING.md) | Testing strategy |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Final validation checklist |

---

## Phase Overview

### Objective

Installer et configurer Tailwind CSS 4 avec PostCSS pour Next.js 15, établissant la fondation du design system.

### Scope

- Installation des dépendances Tailwind CSS 4
- Configuration PostCSS pour Next.js
- Création du fichier CSS global avec imports Tailwind
- Intégration dans le layout Next.js
- Vérification du build

### Out of Scope

- Design tokens (Phase 3)
- shadcn/ui components (Phase 2)
- CSS migration (Phase 3)
- Fonts configuration (Phase 3)

---

## Key Deliverables

| Deliverable | File | Status |
|-------------|------|--------|
| Tailwind CSS 4 installed | `package.json` | ⬜ |
| PostCSS configuration | `postcss.config.mjs` | ⬜ |
| Global CSS with Tailwind | `src/app/globals.css` | ⬜ |
| Layout integration | `src/app/[locale]/layout.tsx` | ⬜ |
| Build verification | N/A | ⬜ |

---

## Atomic Commits

This phase is implemented in **3 atomic commits**:

| # | Commit | Description | Files | Est. Time |
|---|--------|-------------|-------|-----------|
| 1 | Install Tailwind CSS 4 | Add dependencies and PostCSS config | 2 | 15 min |
| 2 | Create globals.css | Add Tailwind imports and base styles | 1 | 15 min |
| 3 | Integrate in layout | Import globals.css, verify build | 1 | 20 min |

**Total Estimated Time**: ~50 minutes

---

## Dependencies

### Prerequisites (Must be complete)

- [x] Story 3.1 (i18n) - Structure `[locale]` en place
- [x] Node.js ≥ 20.9.0
- [x] pnpm ≥ 9.0.0

### External Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | `^4.0.0` | CSS framework |
| `@tailwindcss/postcss` | `^4.0.0` | PostCSS plugin |

---

## Success Criteria

### Build & Runtime

- [ ] `pnpm install` succeeds without errors
- [ ] `pnpm build` succeeds without CSS errors
- [ ] `pnpm dev` starts without errors
- [ ] No console errors in browser

### Functional

- [ ] Tailwind utility classes work (e.g., `bg-red-500`)
- [ ] Base styles applied (box-sizing, margins reset)
- [ ] Admin panel `/admin` not affected

### Quality

- [ ] TypeScript compiles without errors
- [ ] ESLint passes (`pnpm lint`)
- [ ] No unused dependencies

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Tailwind v4 breaking changes | Low | Medium | Follow official docs |
| PostCSS config conflicts | Low | Low | Minimal config |
| Build failures | Low | High | Verify after each commit |

**Overall Risk Level**: 🟢 Low

---

## Technical Notes

### Tailwind CSS 4 Changes

Tailwind v4 introduces a CSS-first configuration:

```css
/* Old (v3): @tailwind base; @tailwind components; @tailwind utilities; */
/* New (v4): */
@import "tailwindcss";
```

### PostCSS Configuration

Minimal configuration required:

```javascript
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### No tailwind.config.ts Needed

For Phase 1, we use Tailwind's CSS-first approach. Custom theme will be added in Phase 3 using `@theme` directive.

---

## Implementation Workflow

```
1. Read ENVIRONMENT_SETUP.md
   └── Ensure prerequisites are met

2. Follow IMPLEMENTATION_PLAN.md
   └── Execute commits in order

3. Use COMMIT_CHECKLIST.md
   └── Check off items after each commit

4. Run guides/TESTING.md
   └── Verify functionality

5. Complete validation/VALIDATION_CHECKLIST.md
   └── Final phase validation
```

---

## Quick Commands

```bash
# Install dependencies
pnpm add tailwindcss@^4.0.0
pnpm add -D @tailwindcss/postcss@^4.0.0

# Verify installation
pnpm list tailwindcss

# Build verification
pnpm build

# Dev server
pnpm dev

# Lint check
pnpm lint
```

---

## Related Documents

### Story Context

- [Story 3.2 Specification](../../story_3.2.md)
- [PHASES_PLAN.md](../PHASES_PLAN.md)
- [EPIC_TRACKING.md](../../../EPIC_TRACKING.md)

### Next Phase

- [Phase 2: shadcn/ui & Utility Functions](../phase_2/INDEX.md) (pending)

---

## Progress Tracking

### Commits Progress

- [ ] Commit 1: Install Tailwind CSS 4
- [ ] Commit 2: Create globals.css
- [ ] Commit 3: Integrate in layout

### Phase Completion

- [ ] All commits implemented
- [ ] All tests passing
- [ ] Validation checklist complete
- [ ] Ready for Phase 2

---

**Phase Created**: 2025-12-02
**Last Updated**: 2025-12-02
**Status**: 📋 READY FOR IMPLEMENTATION
