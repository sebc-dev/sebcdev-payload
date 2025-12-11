# Phase 4: Code Review Guide

**Phase**: Integration & E2E Testing
**Reviewer Focus**: Integration correctness, E2E test quality, accessibility

---

## Review Checklist by Commit

### Commit 1: TOC Translations

**Files**: `messages/en.json`, `messages/fr.json`

| Check | Status |
|-------|--------|
| JSON syntax valid (no trailing commas) | [ ] |
| Keys match between en.json and fr.json | [ ] |
| Translations are accurate and natural | [ ] |
| No hardcoded text left in components | [ ] |

**Review Questions**:
- Are the French translations idiomatic?
- Is "Table des matières" preferred over "Sommaire"?
- Are accessibility labels clear for screen readers?

---

### Commit 2: ArticleLayout Component

**Files**: `src/components/articles/ArticleLayout.tsx`, `src/components/articles/index.ts`

| Check | Status |
|-------|--------|
| `'use client'` directive present | [ ] |
| Props interface fully typed | [ ] |
| JSDoc documentation complete | [ ] |
| Responsive breakpoint correct (lg = 1024px) | [ ] |
| Grid layout matches spec | [ ] |
| Conditional rendering for TOC correct | [ ] |
| ref forwarding to article element works | [ ] |
| Export added to barrel file | [ ] |

**Code Quality Checks**:

```tsx
// Verify grid layout
className={cn(
  'lg:grid lg:grid-cols-[1fr_minmax(0,65ch)_200px] lg:gap-8 lg:max-w-7xl',
  // ...
)}
```

- [ ] Grid columns: `1fr` (left spacer) + `65ch` (content) + `200px` (TOC)
- [ ] Gap appropriate: `gap-8` (2rem)
- [ ] Max width reasonable: `max-w-7xl` (80rem)

**Accessibility Checks**:
- [ ] `<aside>` used for TOC sidebar
- [ ] `aria-hidden="true"` on decorative spacer
- [ ] Article element has ref for progress tracking

**Review Questions**:
- Does the layout gracefully degrade without TOC?
- Is the mobile breakpoint consistent with project standards?
- Are z-indexes appropriate (no conflicts)?

---

### Commit 3: Article Page Integration

**File**: `src/app/[locale]/(frontend)/articles/[slug]/page.tsx`

| Check | Status |
|-------|--------|
| Import paths correct | [ ] |
| `extractTOCHeadings` called server-side | [ ] |
| Translation keys match messages files | [ ] |
| Layout structure preserved | [ ] |
| No SSR/hydration issues | [ ] |
| Error handling for missing headings | [ ] |

**Integration Points**:

```tsx
// Server-side extraction (correct)
const headings = isLexicalContent(payloadArticle.content)
  ? extractTOCHeadings(payloadArticle.content)
  : []
```

- [ ] Extraction happens before render (server)
- [ ] Empty array fallback prevents errors
- [ ] No client-side extraction (would cause hydration mismatch)

**Translation Keys Check**:
- [ ] `t('toc.title')` → matches `article.toc.title` in messages
- [ ] `t('toc.openButton')` → matches `article.toc.openButton`
- [ ] `t('toc.progressLabel')` → matches `article.toc.progressLabel`

**Removed Code Check**:
- [ ] Old `<article className="container...">` wrapper removed
- [ ] No duplicate article tags
- [ ] No orphaned CSS classes

**Review Questions**:
- Is the page structure semantically correct?
- Does the layout work for articles without images?
- Are translations accessed efficiently (not re-fetching)?

---

### Commit 4: E2E Tests - TOC Navigation

**File**: `tests/e2e/articles/toc-navigation.e2e.spec.ts`

| Check | Status |
|-------|--------|
| Test descriptions clear | [ ] |
| Proper test isolation (beforeEach) | [ ] |
| Desktop/mobile viewport separation | [ ] |
| Selectors use accessible queries | [ ] |
| Waits are appropriate (not arbitrary) | [ ] |
| axe-core integration correct | [ ] |
| Tests don't depend on specific content | [ ] |

**Selector Quality**:

```typescript
// Good - Uses accessible queries
page.getByRole('navigation', { name: /table/i })
page.getByRole('link')
page.getByRole('button', { name: /ouvrir/i })

// Bad - Fragile selectors to avoid
page.locator('.toc-link')
page.locator('nav > ul > li:first-child')
```

- [ ] No CSS class selectors
- [ ] Uses `getByRole`, `getByText`, `getByLabel`
- [ ] Regex patterns case-insensitive

**Wait Strategy**:
- [ ] `waitForLoadState('networkidle')` for page loads
- [ ] `waitForTimeout` only where necessary (scroll animations)
- [ ] No arbitrary long timeouts (>1000ms without reason)

**Test Coverage**:
- [ ] Desktop TOC visibility
- [ ] Click navigation works
- [ ] Active section highlighting
- [ ] Mobile button visibility
- [ ] Sheet opening/closing
- [ ] Auto-close on navigation
- [ ] Keyboard navigation
- [ ] axe-core compliance

**Review Questions**:
- Will tests pass in CI environment?
- Are tests resilient to content changes?
- Is test article slug configurable?

---

### Commit 5: E2E Tests - Reading Progress

**File**: `tests/e2e/articles/reading-progress.e2e.spec.ts`

| Check | Status |
|-------|--------|
| Progress calculations realistic | [ ] |
| Scroll simulation accurate | [ ] |
| ARIA attribute verification complete | [ ] |
| Reduced motion test correct | [ ] |

**Progress Value Checks**:

```typescript
// Verify reasonable expectations
expect(Number(value)).toBeLessThanOrEqual(10)    // Top of page
expect(Number(value)).toBeGreaterThan(20)        // Middle
expect(Number(value)).toBeGreaterThanOrEqual(85) // End
```

- [ ] Top: Allow some tolerance (0-10%)
- [ ] Middle: Wide range acceptable (20-80%)
- [ ] End: High but not exactly 100% (85-100%)

**Scroll Simulation**:

```typescript
// Correct - Scrolls within article bounds
await page.evaluate(() => {
  const article = document.querySelector('article')
  // Calculate position relative to article
})
```

- [ ] Scrolls to article element, not document
- [ ] Uses `behavior: 'instant'` for test reliability
- [ ] Waits after scroll for RAF update

**Reduced Motion Test**:
- [ ] `emulateMedia({ reducedMotion: 'reduce' })` used
- [ ] Page reloaded after emulation change
- [ ] Verifies transition-duration is 0s/none

**Review Questions**:
- Do tests account for variable article heights?
- Is the reduced motion test meaningful?
- Are ARIA assertions complete?

---

## General Review Criteria

### Code Quality

| Criteria | Status |
|----------|--------|
| No TypeScript errors | [ ] |
| No ESLint warnings | [ ] |
| No unused imports/variables | [ ] |
| Consistent code style | [ ] |
| No console.log statements | [ ] |

### Performance

| Criteria | Status |
|----------|--------|
| No unnecessary re-renders | [ ] |
| No layout shift on load | [ ] |
| Scroll handlers optimized (RAF) | [ ] |
| Memoization where appropriate | [ ] |

### Accessibility

| Criteria | Status |
|----------|--------|
| ARIA roles correct | [ ] |
| Labels present and descriptive | [ ] |
| Keyboard navigation works | [ ] |
| Focus management correct | [ ] |
| Color contrast sufficient | [ ] |

### Security

| Criteria | Status |
|----------|--------|
| No XSS vulnerabilities | [ ] |
| No exposed secrets | [ ] |
| User input sanitized | [ ] |

---

## Review Process

### Before Approving

1. **Run all checks locally**:
   ```bash
   pnpm lint
   pnpm test:unit
   pnpm build
   pnpm test:e2e
   ```

2. **Manual testing**:
   - [ ] Test on Chrome desktop (≥1024px)
   - [ ] Test on Chrome mobile (375px)
   - [ ] Test keyboard navigation
   - [ ] Test with screen reader (VoiceOver/NVDA)

3. **Performance check**:
   ```bash
   # Run Lighthouse on article page
   # Check: Performance ≥ 90, CLS < 0.1
   ```

### Feedback Guidelines

**For minor issues** (style, naming):
- Comment inline, approve with suggestions

**For significant issues** (logic, accessibility):
- Request changes, be specific about fix

**For blocking issues** (security, breaking):
- Request changes, mark as blocking

---

## Review Completion

After all commits reviewed:

- [ ] All checks pass
- [ ] Manual testing complete
- [ ] No blocking issues
- [ ] PR approved

**Final Sign-off**:

```
Reviewed Phase 4: Integration & E2E Testing
- Commits: 5/5 reviewed
- Tests: E2E passing
- Manual: Desktop + Mobile verified
- Accessibility: axe-core clean

Approved ✅
```
