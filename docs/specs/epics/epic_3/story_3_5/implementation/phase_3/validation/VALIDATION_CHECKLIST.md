# Phase 3: Validation Checklist - Polish & Tests

**Story**: 3.5 - Homepage Implementation
**Phase**: 3 of 3 (FINAL)

---

## Pre-Validation

- [ ] Phase 1 completee et validee
- [ ] Phase 2 completee et validee
- [ ] Tous les 4 commits de Phase 3 completes

---

## Build Validation

### TypeScript

```bash
pnpm exec tsc --noEmit
```

- [ ] **PASS** - Aucune erreur

### ESLint

```bash
pnpm lint
```

- [ ] **PASS** - Aucune erreur

### Build

```bash
pnpm build
```

- [ ] **PASS** - Build complete

---

## Test Validation

### E2E Tests

```bash
pnpm test:e2e -- tests/e2e/homepage.e2e.spec.ts
```

| Test Suite | Pass | Fail |
|------------|------|------|
| Page Load | [ ] | [ ] |
| Featured Article | [ ] | [ ] |
| Article Grid | [ ] | [ ] |
| Hub CTA | [ ] | [ ] |
| Empty State | [ ] | [ ] |
| Responsive | [ ] | [ ] |
| Accessibility | [ ] | [ ] |

**Total Tests**: ___/18 passing

### Accessibility Tests

| Test | Status |
|------|--------|
| WCAG AA audit (FR) | [ ] PASS |
| WCAG AA audit (EN) | [ ] PASS |
| Heading hierarchy | [ ] PASS |
| Image alt text | [ ] PASS |
| Keyboard navigation | [ ] PASS |
| Focus indicators | [ ] PASS |

---

## Performance Validation

### Lighthouse Audit

```bash
# Run via Chrome DevTools or Lighthouse CLI
```

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Performance | >80 | ___ | [ ] |
| Accessibility | >95 | ___ | [ ] |
| Best Practices | >90 | ___ | [ ] |
| SEO | >90 | ___ | [ ] |

### Core Web Vitals

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| LCP | <2.5s | ___ | [ ] |
| FID/INP | <100ms | ___ | [ ] |
| CLS | <0.1 | ___ | [ ] |

### Animation Performance

1. Open Chrome DevTools > Performance
2. Record while hovering over cards
3. Check FPS

- [ ] Animations run at 60fps
- [ ] No frame drops during hover
- [ ] No jank visible

---

## Image Optimization Validation

### Image Loader

- [ ] Custom loader file exists (`src/lib/image-loader.ts`)
- [ ] next.config.ts updated with loader config
- [ ] Remote patterns configured

### Image Loading

1. Visit homepage
2. Open Network tab
3. Filter by images

- [ ] Images load without errors
- [ ] Images use correct dimensions
- [ ] No 404 errors for images

---

## Animation Validation

### Hover Effects

| Component | Scale | Shadow | Timing | Status |
|-----------|-------|--------|--------|--------|
| ArticleCard | 1.02 | lg | 200ms | [ ] |
| FeaturedArticleCard | 1.01 | xl | 300ms | [ ] |
| Image zoom | 1.05 | - | 200-300ms | [ ] |

### Reduced Motion

1. Enable prefers-reduced-motion in OS or browser
2. Visit homepage
3. Hover over cards

- [ ] No scale animation
- [ ] No zoom animation
- [ ] Transitions disabled
- [ ] Content still accessible

---

## Accessibility Final Check

### axe DevTools

1. Install axe DevTools extension
2. Visit /fr
3. Run analysis

- [ ] 0 critical violations
- [ ] 0 serious violations
- [ ] Minor violations reviewed

### Keyboard Navigation

1. Tab through the page from top

| Element | Focus Order | Visible | Action |
|---------|-------------|---------|--------|
| Skip link | 1 | [ ] | [ ] |
| Logo | 2 | [ ] | [ ] |
| Nav items | 3-6 | [ ] | [ ] |
| Featured article | 7 | [ ] | [ ] |
| Category badge | 8 | [ ] | [ ] |
| Tags | 9-13 | [ ] | [ ] |
| Read CTA | 14 | [ ] | [ ] |
| Grid cards | 15-20 | [ ] | [ ] |
| Hub CTA | 21 | [ ] | [ ] |
| Footer | 22+ | [ ] | [ ] |

### Screen Reader

1. Enable VoiceOver (macOS) or NVDA (Windows)
2. Navigate through page

- [ ] Page structure announced
- [ ] Headings navigable
- [ ] Links have descriptive text
- [ ] Images described

---

## Responsive Final Check

### Mobile (375px)

- [ ] Featured card readable
- [ ] Grid 1 column
- [ ] All content visible
- [ ] Touch targets >= 44px

### Tablet (768px)

- [ ] Featured card appropriate size
- [ ] Grid 2 columns
- [ ] Gaps correct (20px)

### Desktop (1280px)

- [ ] Featured card max-h 400px
- [ ] Grid 3 columns
- [ ] Gaps correct (24px)
- [ ] Content centered

---

## i18n Final Check

### French (/fr)

- [ ] Title: "Accueil | sebc.dev"
- [ ] Section: "Articles recents"
- [ ] CTA: "Voir tous les articles"
- [ ] Read: "Lire l'article"
- [ ] Empty: "Bienvenue sur sebc.dev !"

### English (/en)

- [ ] Title: "Home | sebc.dev"
- [ ] Section: "Recent articles"
- [ ] CTA: "View all articles"
- [ ] Read: "Read article"
- [ ] Empty: "Welcome to sebc.dev!"

---

## SEO Final Check

### Meta Tags (DevTools > Elements > head)

| Tag | FR | EN |
|-----|----|----|
| title | [ ] | [ ] |
| description | [ ] | [ ] |
| canonical | [ ] | [ ] |
| og:title | [ ] | [ ] |
| og:description | [ ] | [ ] |
| og:locale | [ ] | [ ] |
| twitter:card | [ ] | [ ] |
| hreflang fr | [ ] | [ ] |
| hreflang en | [ ] | [ ] |

---

## Story Completion Checklist

### Code Complete

- [ ] All 3 phases implemented
- [ ] All 14 commits completed (5+5+4)
- [ ] All tests passing
- [ ] Build passing

### Documentation

- [ ] Phase docs complete (21 files)
- [ ] Code comments where needed
- [ ] README updated if needed

### Acceptance Criteria (from story_3.5.md)

| AC | Description | Status |
|----|-------------|--------|
| AC1 | Article Vedette | [ ] |
| AC2 | Grille d'Articles | [ ] |
| AC3 | Carte d'Article | [ ] |
| AC4 | CTA "Voir tous les articles" | [ ] |
| AC5 | Empty State | [ ] |
| AC6 | Data Fetching & Performance | [ ] |
| AC7 | SEO & Metadata | [ ] |
| AC8 | Accessibilite | [ ] |

---

## Sign-Off

### Developer

- [ ] All validation checks pass
- [ ] Story ready for review

**Developer Name**: _______________
**Date**: _______________

### Reviewer

- [ ] Code review completed
- [ ] Tests verified
- [ ] Approved for merge

**Reviewer Name**: _______________
**Date**: _______________

---

## Post-Merge Actions

After merging to main:

1. [ ] Update EPIC_TRACKING.md:
   - Story 3.5 status: COMPLETED
   - Phases completed: 3/3

2. [ ] Verify production deployment:
   - [ ] Homepage loads correctly
   - [ ] No console errors
   - [ ] Analytics tracking working

3. [ ] Close related issues/tickets

---

## Story Summary

**Story 3.5: Homepage Implementation**

| Phase | Commits | Status |
|-------|---------|--------|
| Phase 1: Atomic Components | 5 | [ ] COMPLETE |
| Phase 2: Homepage Structure | 5 | [ ] COMPLETE |
| Phase 3: Polish & Tests | 4 | [ ] COMPLETE |
| **Total** | **14** | [ ] **DONE** |

**Files Created**: ~20
**Lines of Code**: ~1200-1500
**Tests Added**: ~18

---

## Final Approval

- [ ] **APPROVED** - Story 3.5 complete and validated
- [ ] **BLOCKED** - Issues to resolve:
  - ___
  - ___
