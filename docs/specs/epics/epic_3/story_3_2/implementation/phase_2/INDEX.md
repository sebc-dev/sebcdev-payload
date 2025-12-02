# Phase 2: shadcn/ui & Utility Functions

**Story**: 3.2 - Integration Design System (Dark Mode)
**Epic**: 3 - Frontend Core & Design System
**Phase**: 2 of 4
**Status**: PLANNED

---

## Quick Navigation

| Document | Purpose |
|----------|---------|
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Atomic commit strategy and implementation order |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) | Detailed checklist per commit |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Environment configuration guide |
| [guides/REVIEW.md](./guides/REVIEW.md) | Code review guide (commit-by-commit) |
| [guides/TESTING.md](./guides/TESTING.md) | Testing strategy (unit + integration) |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Final validation checklist |

---

## Phase Overview

### Objective

Initialize shadcn/ui and create the necessary utility functions (`cn`, `cva`) to enable a robust component system for the design system.

### Scope

- Initialize shadcn/ui with CLI
- Configure `components.json` for dark mode
- Create `cn()` utility function (clsx + tailwind-merge)
- Install utility dependencies
- Add Button component for validation
- Integrate Button in homepage

### Prerequisites

- **Phase 1 Completed**: Tailwind CSS 4 installed and configured
- Build succeeds with `pnpm build`
- Development server works with `pnpm dev`

---

## Key Deliverables

| Deliverable | File | Status |
|-------------|------|--------|
| shadcn/ui config | `components.json` | Pending |
| cn() utility | `src/lib/utils.ts` | Pending |
| Button component | `src/components/ui/button.tsx` | Pending |
| Homepage integration | `src/app/[locale]/(frontend)/page.tsx` | Pending |

---

## Dependencies

### Internal Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Phase 1 (Tailwind Foundation) | Required | Completed |
| Story 3.1 (i18n) | Required | Completed |

### External Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `clsx` | ^2.x | Conditional class names |
| `tailwind-merge` | ^2.x | Merge Tailwind classes |
| `class-variance-authority` | ^0.7.x | Variant management for components |

---

## Files Affected

### New Files (~4)

| File | Purpose |
|------|---------|
| `components.json` | shadcn/ui configuration |
| `src/lib/utils.ts` | cn() utility function |
| `src/components/ui/button.tsx` | First shadcn component |

### Modified Files (~3)

| File | Changes |
|------|---------|
| `package.json` | Add utility dependencies |
| `tsconfig.json` | Verify path aliases |
| `src/app/[locale]/(frontend)/page.tsx` | Use Button component |

---

## Atomic Commits Summary

This phase is broken down into **4 atomic commits**:

| Commit | Description | Files | Est. LOC |
|--------|-------------|-------|----------|
| 1 | Install utility dependencies | 1 | ~10 |
| 2 | Create cn() utility function | 1 | ~15 |
| 3 | Initialize shadcn/ui configuration | 1 | ~30 |
| 4 | Add Button component and integrate | 2 | ~80 |

**Total Estimated LOC**: ~135 lines
**Total Estimated Time**: 2-4 hours

---

## Success Criteria

### Functional Criteria

- [ ] `npx shadcn@latest init` succeeds
- [ ] `npx shadcn@latest add button` succeeds
- [ ] Button displays correctly in the homepage
- [ ] `cn()` works with Tailwind classes
- [ ] Build succeeds (`pnpm build`)

### Non-Functional Criteria

- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] No console errors in dev mode
- [ ] Path aliases work correctly (`@/components`, `@/lib`)

---

## Risk Assessment

### Risk Level: LOW

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| shadcn CLI fails | Low | Medium | Verify path aliases before init |
| React 19 incompatibility | Low | High | Test Button immediately after install |
| Path alias issues | Low | Medium | Check tsconfig.json before init |

### Mitigation Strategies

1. **Verify path aliases** before running shadcn init
2. **Use --overwrite flag** if needed during init
3. **Test Button immediately** after installation
4. **Check console** for any React 19 warnings

---

## Technical Notes

### shadcn/ui Specifics

- shadcn/ui copies components locally (not a runtime dependency)
- Use "new-york" style for modern look
- Base color: "slate" (close to anthracite theme)
- CSS variables: enabled (for dark mode)

### cn() Function

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### components.json Structure

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

---

## Timeline

| Activity | Duration |
|----------|----------|
| Implementation | 2-4 hours |
| Code Review | 30 min |
| Testing & Validation | 30 min |
| **Total** | **3-5 hours** |

---

## Related Documents

- [PHASES_PLAN.md](../../PHASES_PLAN.md) - Overall phases strategy
- [Story 3.2 Spec](../../story_3.2.md) - Story specification
- [Phase 1 INDEX](../phase_1/INDEX.md) - Previous phase documentation
- [UX_UI_Spec.md](../../../../../UX_UI_Spec.md) - Design system requirements
- [LEGACY_THEME_REFERENCE.md](../LEGACY_THEME_REFERENCE.md) - Legacy theme tokens (for Phase 3)

---

## Legacy Theme Reference

A complete theme configuration from a previous version has been extracted and documented:

**File**: `src/app/globals copy.css`
**Documentation**: [LEGACY_THEME_REFERENCE.md](../LEGACY_THEME_REFERENCE.md)

### Key Elements Available for Phase 3

| Element | Description |
|---------|-------------|
| OKLCH Colors | Modern color format with perceptual uniformity |
| Primitive Tokens | `--color-primary`, `--neutral-*` scales |
| Semantic Tokens | Full shadcn/ui variable set |
| `@theme inline` | Tailwind CSS 4 theme mapping |
| Dark Mode | Complete `.dark` class configuration |
| Typography | Nunito Sans + JetBrains Mono fonts |
| Shadows | Complete shadow preset system |
| Accessibility | `prefers-reduced-motion` support |

This reference will be used in Phase 3 for design token implementation.

---

## Next Steps

After completing this phase:

1. **Update EPIC_TRACKING.md** with Phase 2 completion status
2. **Generate Phase 3 documentation** using `phase-doc-generator`
3. **Start Phase 3** (Design Tokens & Visual Migration)

---

**Phase Status**: PLANNED
**Created**: 2025-12-02
**Last Updated**: 2025-12-02
**Generated by**: phase-doc-generator skill
