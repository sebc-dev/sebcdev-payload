# Phase 1 - Article Page Route & Basic Layout

**Story**: 4.1 - Rendu Article & MDX
**Epic**: Epic 4 - Article Reading Experience
**Phase**: 1 of 5
**Status**: 📋 READY FOR IMPLEMENTATION

---

## Quick Navigation

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Atomic commit strategy with 5 commits | Start here - understand the plan |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) | Detailed per-commit checklists | During implementation |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Environment configuration | Before starting |
| [guides/REVIEW.md](./guides/REVIEW.md) | Code review checklist | After each commit |
| [guides/TESTING.md](./guides/TESTING.md) | Testing strategy & commands | During & after implementation |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Final phase validation | After all commits |

---

## Phase Overview

### Objective

Créer la route dynamique `/[locale]/articles/[slug]` avec le layout de base et le fetch de données Payload. Cette phase établit les fondations pour les phases suivantes (rendu Lexical, syntax highlighting, etc.).

### What This Phase Delivers

1. **Dynamic Route**: `/[locale]/articles/[slug]/page.tsx` - Article page with Server Component
2. **Article Header**: Component displaying title, date, category, reading time
3. **Article Footer**: Component for tags and navigation
4. **404 Handling**: Proper not-found page for missing articles
5. **Data Fetching**: Payload fetch utilities for articles by slug
6. **i18n Support**: Translations for article page UI elements

### Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Rendering Strategy** | React Server Components | Zero client JS for article content, faster LCP |
| **Data Fetching** | Payload Local API | No HTTP round-trip, direct function call |
| **404 Handling** | Next.js `notFound()` | Native framework support, SEO-friendly |
| **Content Rendering** | JSON placeholder | Phase 2 will add Lexical serializer |
| **Styling** | Tailwind CSS + existing components | Consistent with Design System |

---

## Scope Definition

### In Scope

- [x] Route file structure for `/[locale]/articles/[slug]`
- [x] `ArticleHeader` component (title, date, category, complexity, reading time)
- [x] `ArticleFooter` component (tags display)
- [x] `not-found.tsx` for 404 handling
- [x] `src/lib/payload/articles.ts` fetch utilities
- [x] Translation keys in `messages/fr.json` and `messages/en.json`
- [x] Basic responsive layout for article page
- [x] Reuse existing components: `CategoryBadge`, `ComplexityBadge`, `TagPill`, `RelativeDate`

### Out of Scope (Handled in Later Phases)

- Phase 2: Lexical content rendering
- Phase 3: Code syntax highlighting
- Phase 4: Image rendering with next/image
- Phase 5: SEO metadata, JSON-LD, E2E tests

### Temporary Solutions

| Item | Temporary State | Permanent Solution |
|------|-----------------|-------------------|
| Article content | Display as JSON placeholder | Phase 2: Lexical serializer |
| Featured image | Not displayed in hero | Phase 4: ArticleHero component |
| SEO metadata | Basic title only | Phase 5: Full generateMetadata |

---

## Files to Create/Modify

### New Files (6 files)

| File | Type | Purpose | Lines Est. |
|------|------|---------|-----------|
| `src/app/[locale]/(frontend)/articles/[slug]/page.tsx` | Page | Article page Server Component | ~120 |
| `src/app/[locale]/(frontend)/articles/[slug]/not-found.tsx` | Page | 404 page for missing articles | ~40 |
| `src/components/articles/ArticleHeader.tsx` | Component | Article header with metadata | ~80 |
| `src/components/articles/ArticleFooter.tsx` | Component | Article footer with tags | ~50 |
| `src/lib/payload/articles.ts` | Utility | Fetch article by slug | ~60 |
| `tests/unit/lib/payload/articles.spec.ts` | Test | Unit tests for fetch utilities | ~80 |

### Modified Files (3 files)

| File | Changes | Lines Changed |
|------|---------|--------------|
| `src/components/articles/index.ts` | Add exports for new components | +4 |
| `messages/fr.json` | Add article page translations | +20 |
| `messages/en.json` | Add article page translations | +20 |

**Total**: ~9 files, ~470 lines

---

## Commit Strategy Overview

This phase uses **5 atomic commits**:

| # | Commit | Focus | Files | Est. Time |
|---|--------|-------|-------|-----------|
| 1 | Payload fetch utilities | Data layer | 2 files | 30 min |
| 2 | ArticleHeader component | UI component | 2 files | 45 min |
| 3 | ArticleFooter component | UI component | 2 files | 30 min |
| 4 | Article page route | Page assembly | 2 files | 45 min |
| 5 | Translations & 404 | i18n + error | 3 files | 30 min |

**Total Estimated Time**: ~3 hours

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for detailed commit specifications.

---

## Dependencies

### Prerequisites (Must Be Complete)

- [x] Epic 2 (CMS Core): Articles collection with Lexical editor
- [x] Epic 3 (Frontend Core): Design System, Layout, i18n routing
- [x] Existing components: `CategoryBadge`, `ComplexityBadge`, `TagPill`, `RelativeDate`
- [x] Existing types: `ArticleData`, `CategoryData`, `TagData` in `src/components/articles/types.ts`

### External Dependencies

| Dependency | Version | Already Installed |
|------------|---------|-------------------|
| `payload` | 3.65.x | Yes |
| `next-intl` | 4.5.x | Yes |
| `lucide-react` | Latest | Yes |
| `tailwindcss` | 4.0.x | Yes |

### No New Dependencies Required

This phase uses only existing project dependencies.

---

## Success Criteria

### Functional Requirements

- [ ] Route `/[locale]/articles/[slug]` displays article with title and metadata
- [ ] 404 returned for non-existent slug
- [ ] Article header shows: title, category badge, complexity badge, reading time, date
- [ ] Article footer shows: tags with clickable TagPills
- [ ] Page works for both `/fr/articles/xxx` and `/en/articles/xxx`

### Technical Requirements

- [ ] TypeScript compilation without errors
- [ ] ESLint + Prettier pass
- [ ] All unit tests pass (100% for new code)
- [ ] Next.js build succeeds
- [ ] No hydration mismatches

### Quality Gates

| Gate | Target | Tool |
|------|--------|------|
| Type Safety | 100% | `pnpm exec tsc --noEmit` |
| Linting | 0 errors | `pnpm lint` |
| Unit Tests | 100% coverage on new files | `pnpm test:unit` |
| Build | Success | `pnpm build` |

---

## Risk Assessment

### Low Risk Phase

**Overall Risk Level**: 🟢 Low

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Data type mismatches | Low | Low | Reuse existing `ArticleData` type |
| Route conflicts | Low | Low | Standard Next.js dynamic route |
| i18n issues | Low | Low | Follow existing pattern from homepage |

### No Blocking Dependencies

This is a foundation phase with no external blockers.

---

## Quick Start Checklist

Before starting implementation:

- [ ] Read this INDEX.md completely
- [ ] Review [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
- [ ] Ensure development server runs (`pnpm dev`)
- [ ] Verify test article exists in Payload admin
- [ ] Open [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
- [ ] Start with Commit 1

---

## Related Documentation

### Story-Level

- [Story 4.1 Spec](../../story_4.1.md)
- [PHASES_PLAN.md](../PHASES_PLAN.md)

### Epic-Level

- [EPIC_TRACKING.md](../../../EPIC_TRACKING.md)

### Technical References

- [Architecture_technique.md](../../../../../../Architecture_technique.md)
- [UX_UI_Spec.md](../../../../../../UX_UI_Spec.md)
- Payload Lexical Docs: https://payloadcms.com/docs/rich-text/lexical

### Existing Code References

- Homepage implementation: `src/app/[locale]/(frontend)/page.tsx`
- Article components: `src/components/articles/`
- Article types: `src/components/articles/types.ts`

---

## Next Phase

After completing Phase 1, proceed to:

**Phase 2: Lexical Content Rendering**
- Generate docs: `/generate-phase-doc Epic 4 Story 4.1 Phase 2`
- Focus: Lexical JSON → React components serializer

---

**Phase Documentation Generated**: 2025-12-09
**Generator**: Claude Code (phase-doc-generator skill)
**Phase Status**: 📋 READY FOR IMPLEMENTATION
