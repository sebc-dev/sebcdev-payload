# Code Review Guide: Phase 5 - Accessibility & E2E Validation

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 5 of 5 (Final Phase)
**Review Focus**: Accessibility compliance, E2E test coverage

---

## Review Overview

Phase 5 focuses on accessibility and validation. This review guide emphasizes:

1. **WCAG 2.1 AA Compliance**: Skip link, landmarks, keyboard navigation
2. **E2E Test Quality**: Coverage, reliability, maintainability
3. **i18n Completeness**: All user-facing text translated
4. **Integration Correctness**: SkipLink properly integrated into layout

---

## Commit-by-Commit Review

### Commit 1: i18n Keys for Accessibility

**Files**: `messages/fr.json`, `messages/en.json`

#### Review Checklist

- [ ] **JSON syntax valid**: No trailing commas, proper structure
- [ ] **Keys are complete**: All three keys present (`skipToContent`, `mainNavigation`, `languageSelection`)
- [ ] **French translations accurate**: Native speaker review if possible
- [ ] **English translations accurate**: Clear, standard accessibility terminology
- [ ] **Namespace placement**: `accessibility` namespace at correct level

#### Expected Content

```json
// fr.json
"accessibility": {
  "skipToContent": "Aller au contenu principal",
  "mainNavigation": "Navigation principale",
  "languageSelection": "Sélection de la langue"
}

// en.json
"accessibility": {
  "skipToContent": "Skip to main content",
  "mainNavigation": "Main navigation",
  "languageSelection": "Language selection"
}
```

#### Quality Criteria

| Criterion | Pass | Fail |
|-----------|------|------|
| JSON parses without error | Valid JSON | Syntax error |
| All 3 keys present | Complete | Missing keys |
| French correct | Native-level | Machine translation artifacts |
| English standard | WCAG terminology | Non-standard terms |

---

### Commit 2: SkipLink Component

**Files**: `src/components/layout/SkipLink.tsx`

#### Review Checklist

- [ ] **'use client' directive**: Present (required for hooks)
- [ ] **Import correctness**: `useTranslations` from `next-intl`
- [ ] **JSDoc comment**: Documents purpose and accessibility rationale
- [ ] **onClick handler**: Prevents default, focuses main, scrolls smoothly
- [ ] **Tailwind classes**: Correct sr-only/focus:not-sr-only pattern
- [ ] **Accessibility attributes**: href points to valid anchor

#### Code Review Points

```tsx
// 1. Client directive required
'use client'

// 2. Correct import
import { useTranslations } from 'next-intl'

// 3. Focus management
const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault()
  const main = document.getElementById('main-content')
  if (main) {
    main.focus()
    main.scrollIntoView({ behavior: 'smooth' })
  }
}

// 4. Class pattern for visibility
className="sr-only focus:not-sr-only focus:absolute ..."
```

#### Accessibility Review

| WCAG Criterion | Implementation | Verify |
|----------------|----------------|--------|
| 2.4.1 Bypass Blocks | Skip link present | Link exists |
| 2.1.1 Keyboard | Focusable with Tab | Tab reaches link |
| 1.4.11 Non-text Contrast | Focus visible | Ring visible |
| 2.4.7 Focus Visible | High contrast focus | Primary color bg |

#### Common Issues to Check

| Issue | Check For | Resolution |
|-------|-----------|------------|
| Missing 'use client' | Hook usage in server component | Add directive |
| Wrong z-index | Skip link behind header | Increase z-index |
| Focus not working | Main lacks tabIndex | Add tabIndex={-1} |
| Scroll jump | No smooth scroll | Add `behavior: 'smooth'` |

---

### Commit 3: Layout Integration

**Files**: `src/components/layout/index.ts`, `src/app/[locale]/(frontend)/layout.tsx`

#### Review Checklist

**Barrel Export (index.ts)**:
- [ ] SkipLink exported
- [ ] Alphabetical order maintained
- [ ] No duplicate exports

**Layout (layout.tsx)**:
- [ ] SkipLink imported from barrel
- [ ] SkipLink is first child in return JSX
- [ ] main has `id="main-content"`
- [ ] main has `tabIndex={-1}`
- [ ] No other changes to layout structure

#### Code Review Points

```tsx
// index.ts - alphabetical order
export { Footer } from './Footer'
export { Header } from './Header'
export { LanguageSwitcher } from './LanguageSwitcher'
export { Logo } from './Logo'
export { MobileMenu } from './MobileMenu'
export { Navigation } from './Navigation'
export { SkipLink } from './SkipLink'  // ✓ Alphabetical position

// layout.tsx - correct structure
return (
  <div className="flex min-h-screen flex-col">
    <SkipLink />           {/* ✓ First child */}
    <Header />
    <main id="main-content" className="flex-1" tabIndex={-1}>
      {children}
    </main>
    <Footer />
  </div>
)
```

#### Landmark Verification

After this commit, verify landmarks in browser DevTools:

| Element | Role | Verified |
|---------|------|----------|
| `<header>` | banner | Check Accessibility panel |
| `<nav>` | navigation | Check Accessibility panel |
| `<main>` | main | Check Accessibility panel |
| `<footer>` | contentinfo | Check Accessibility panel |

---

### Commit 4: E2E Tests

**Files**: `tests/e2e/navigation.e2e.spec.ts`

#### Review Checklist

- [ ] **Imports correct**: Playwright, AxeBuilder, i18n messages
- [ ] **Test organization**: Logical describe blocks
- [ ] **Test coverage**: All navigation scenarios covered
- [ ] **Accessibility tests**: axe-core audits included
- [ ] **Viewport handling**: Mobile and desktop tests separated
- [ ] **Locator quality**: Uses accessible locators (role, name)
- [ ] **No hardcoded strings**: Uses i18n messages for assertions

#### Test Quality Criteria

| Criterion | Good | Bad |
|-----------|------|-----|
| Locators | `getByRole('link', { name: ... })` | `page.locator('a.nav-link')` |
| Waits | Implicit (Playwright auto-wait) | `page.waitForTimeout(1000)` |
| Assertions | `expect(...).toBeVisible()` | `expect(await page.isVisible(...)).toBe(true)` |
| i18n | `frMessages.navigation.articles` | `'Articles'` hardcoded |

#### Test Coverage Review

| Category | Expected Tests | Coverage |
|----------|----------------|----------|
| Header | 4 | Visibility, sticky, logo |
| Desktop Nav | 3 | Links, visibility |
| Mobile Nav | 5 | Hamburger, sheet, close |
| Language Switcher | 5 | Toggle, URL, preserve |
| Skip Link | 4 | Focus, visible, navigate |
| Keyboard | 2 | Tab order, focus rings |
| Accessibility | 4 | axe-core, landmarks |
| Footer | 2 | Visibility, links |
| **Total** | **29** | |

#### axe-core Test Pattern

```typescript
// Correct pattern
test('homepage FR passes axe-core audit', async ({ page }) => {
  await page.goto('/fr')

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()

  if (results.violations.length > 0) {
    console.log('Violations:', JSON.stringify(results.violations, null, 2))
  }

  expect(results.violations).toHaveLength(0)
})
```

#### Common Test Anti-patterns

| Anti-pattern | Issue | Better Approach |
|--------------|-------|-----------------|
| `page.waitForTimeout()` | Flaky, slow | Use auto-wait or explicit conditions |
| CSS selectors | Brittle | Use `getByRole`, `getByText` |
| Hardcoded viewport in test | Inconsistent | Use `beforeEach` hook |
| Ignoring axe violations | Hides issues | Log and fail on violations |

---

## Overall Phase Review

### Accessibility Compliance

After all commits, verify:

| WCAG Criterion | Requirement | Implementation |
|----------------|-------------|----------------|
| 2.4.1 Bypass Blocks | Provide skip mechanism | SkipLink component |
| 1.3.1 Info and Relationships | Use semantic markup | ARIA landmarks |
| 2.1.1 Keyboard | All functionality keyboard accessible | Tab navigation |
| 2.4.3 Focus Order | Logical focus sequence | Skip → Header → Main → Footer |
| 2.4.7 Focus Visible | Focus indicator visible | Tailwind focus rings |
| 4.1.2 Name, Role, Value | ARIA attributes correct | Role-based locators pass |

### Integration Correctness

- [ ] SkipLink appears before any other focusable element
- [ ] Main content receives focus when skip link activated
- [ ] No visual regression in layout
- [ ] No new console errors or warnings

### Test Reliability

- [ ] All tests pass consistently (run 3+ times)
- [ ] No flaky tests (timeout or intermittent failures)
- [ ] Tests complete in reasonable time (< 2 minutes)
- [ ] Test output is clear and helpful on failure

---

## Review Approval Criteria

### Must Have (Blocking)

- [ ] Build succeeds (`pnpm build`)
- [ ] Lint passes (`pnpm lint`)
- [ ] All E2E tests pass
- [ ] axe-core reports 0 violations
- [ ] Skip link works on keyboard navigation

### Should Have (Non-blocking but note)

- [ ] JSDoc comments on SkipLink component
- [ ] Tests use accessible locators
- [ ] Test organization is logical
- [ ] No console warnings in dev mode

### Nice to Have (Suggestions)

- [ ] Visual regression baseline captured
- [ ] Performance not degraded
- [ ] Code style consistent with codebase

---

## Review Checklist Summary

### Per-Commit

| Commit | Primary Review Focus |
|--------|---------------------|
| 1 | i18n completeness, translation quality |
| 2 | Accessibility compliance, focus management |
| 3 | Integration correctness, landmark presence |
| 4 | Test coverage, test quality, reliability |

### Final Review

- [ ] All commits reviewed individually
- [ ] Full test suite passes
- [ ] Manual accessibility test completed
- [ ] No regressions in existing functionality
- [ ] Documentation reflects implementation

---

## Reviewer Actions

### Before Approving

1. Run `pnpm build` locally
2. Run `pnpm test:e2e` locally
3. Manually test skip link in browser
4. Check axe DevTools for any violations
5. Verify landmarks in Accessibility panel

### After Approving

1. Confirm merge strategy (squash vs merge)
2. Ensure PHASES_PLAN.md updated
3. Verify EPIC_TRACKING.md updated
4. Check Story 3.3 acceptance criteria

---

**Review Guide Created**: 2025-12-03
**Last Updated**: 2025-12-03
