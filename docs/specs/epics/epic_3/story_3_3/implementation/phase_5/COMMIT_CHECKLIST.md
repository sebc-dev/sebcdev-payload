# Commit Checklist: Phase 5 - Accessibility & E2E Validation

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 5 of 5 (Final Phase)
**Total Commits**: 4

---

## How to Use This Checklist

1. Complete each commit's checklist **in order**
2. Mark items as complete: `[x]`
3. Run validations after each commit
4. Do not proceed to next commit if validation fails
5. Document any blockers or deviations

---

## Commit 1: Add i18n Keys for Accessibility

### Pre-Commit Checklist

- [ ] Review existing i18n structure in `messages/fr.json`
- [ ] Review existing i18n structure in `messages/en.json`
- [ ] Identify correct location for new namespace

### Implementation Checklist

- [ ] Add `accessibility` namespace to `messages/fr.json`:
  ```json
  {
    "accessibility": {
      "skipToContent": "Aller au contenu principal",
      "mainNavigation": "Navigation principale",
      "languageSelection": "Sélection de la langue"
    }
  }
  ```
- [ ] Add `accessibility` namespace to `messages/en.json`:
  ```json
  {
    "accessibility": {
      "skipToContent": "Skip to main content",
      "mainNavigation": "Main navigation",
      "languageSelection": "Language selection"
    }
  }
  ```
- [ ] Verify JSON syntax is valid (no trailing commas, proper quotes)
- [ ] Ensure keys are alphabetically ordered (optional but recommended)

### Post-Commit Validation

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] No TypeScript errors
- [ ] Verify keys accessible: Create temp test file:
  ```tsx
  // Temporary verification (delete after)
  const t = useTranslations('accessibility')
  console.log(t('skipToContent'))
  ```

### Commit

```bash
git add messages/fr.json messages/en.json
git commit -m "$(cat <<'EOF'
🌐 i18n(a11y): add translation keys for skip link and ARIA labels

Add accessibility namespace with:
- skipToContent: Skip link text for keyboard users
- mainNavigation: ARIA label for nav element
- languageSelection: ARIA label for language switcher

Translations provided in French and English.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Sign-off

- [ ] Commit created
- [ ] Validation passed
- [ ] Ready for Commit 2

---

## Commit 2: Create SkipLink Component

### Pre-Commit Checklist

- [ ] Verify Commit 1 is complete
- [ ] Review existing layout components in `src/components/layout/`
- [ ] Understand sr-only and focus:not-sr-only Tailwind utilities

### Implementation Checklist

- [ ] Create `src/components/layout/SkipLink.tsx`:
  ```tsx
  'use client'

  import { useTranslations } from 'next-intl'

  /**
   * SkipLink Component
   *
   * Provides a "skip to main content" link for keyboard users.
   * Visually hidden by default, becomes visible when focused.
   *
   * Accessibility:
   * - First focusable element on page
   * - Allows keyboard users to bypass navigation
   * - Required for WCAG 2.1 AA compliance (2.4.1 Bypass Blocks)
   *
   * @returns Skip link that focuses main content when activated
   */
  export function SkipLink() {
    const t = useTranslations('accessibility')

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      const main = document.getElementById('main-content')
      if (main) {
        main.focus()
        main.scrollIntoView({ behavior: 'smooth' })
      }
    }

    return (
      <a
        href="#main-content"
        onClick={handleClick}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        {t('skipToContent')}
      </a>
    )
  }
  ```
- [ ] Verify 'use client' directive is present
- [ ] Verify import paths are correct
- [ ] Verify className uses correct Tailwind utilities

### Post-Commit Validation

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] TypeScript: 0 errors
- [ ] Component can be imported: `import { SkipLink } from './SkipLink'`
- [ ] Manual test: Component renders (can test in isolation or wait for Commit 3)

### Commit

```bash
git add src/components/layout/SkipLink.tsx
git commit -m "$(cat <<'EOF'
♿ feat(a11y): create SkipLink component for keyboard navigation

Add skip to content link featuring:
- Visually hidden by default (sr-only)
- Visible when focused (focus:not-sr-only)
- High z-index to appear above navigation
- JavaScript focus management for main content
- Uses primary color for high visibility
- Translated text via next-intl

Implements WCAG 2.1 AA Success Criterion 2.4.1 (Bypass Blocks).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Sign-off

- [ ] Commit created
- [ ] Validation passed
- [ ] Ready for Commit 3

---

## Commit 3: Integrate SkipLink and Verify Landmarks

### Pre-Commit Checklist

- [ ] Verify Commit 2 is complete
- [ ] Review current layout at `src/app/[locale]/(frontend)/layout.tsx`
- [ ] Review barrel export at `src/components/layout/index.ts`

### Implementation Checklist

#### Update Barrel Export

- [ ] Add SkipLink export to `src/components/layout/index.ts`:
  ```typescript
  export { Footer } from './Footer'
  export { Header } from './Header'
  export { LanguageSwitcher } from './LanguageSwitcher'
  export { Logo } from './Logo'
  export { MobileMenu } from './MobileMenu'
  export { Navigation } from './Navigation'
  export { SkipLink } from './SkipLink'
  ```
- [ ] Maintain alphabetical order

#### Update Frontend Layout

- [ ] Modify `src/app/[locale]/(frontend)/layout.tsx`:
  ```tsx
  import type { Metadata } from 'next'
  import { setRequestLocale } from 'next-intl/server'
  import { Footer, Header, SkipLink } from '@/components/layout'

  export const metadata: Metadata = {
    description: 'A Payload CMS blog with i18n support.',
    title: 'sebc.dev',
  }

  export default async function FrontendLayout({
    children,
    params,
  }: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
  }) {
    const { locale } = await params
    setRequestLocale(locale)

    return (
      <div className="flex min-h-screen flex-col">
        <SkipLink />
        <Header />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </div>
    )
  }
  ```
- [ ] SkipLink is first child (before Header)
- [ ] main has `id="main-content"`
- [ ] main has `tabIndex={-1}`
- [ ] Import includes SkipLink

### Post-Commit Validation

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] TypeScript: 0 errors

#### Manual Accessibility Tests

- [ ] Open browser dev server: `pnpm dev`
- [ ] Navigate to `http://localhost:3000/fr`
- [ ] Press Tab key once
- [ ] **Expected**: Skip link becomes visible at top-left
- [ ] **Expected**: Skip link has text "Aller au contenu principal"
- [ ] Press Enter to activate skip link
- [ ] **Expected**: Focus moves to main content area

#### Landmark Verification

- [ ] Open browser DevTools → Accessibility panel
- [ ] Verify `<header>` has role="banner"
- [ ] Verify `<nav>` has role="navigation"
- [ ] Verify `<main>` has role="main"
- [ ] Verify `<footer>` has role="contentinfo"

### Commit

```bash
git add src/components/layout/index.ts src/app/[locale]/(frontend)/layout.tsx
git commit -m "$(cat <<'EOF'
♿ feat(a11y): integrate SkipLink and verify ARIA landmarks

Add accessibility infrastructure to frontend layout:
- SkipLink as first focusable element
- id="main-content" on <main> for skip target
- tabIndex={-1} on <main> for programmatic focus
- Export SkipLink from layout barrel

Landmarks verified:
- <header> → banner role
- <nav> → navigation role
- <main> → main role
- <footer> → contentinfo role

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Sign-off

- [ ] Commit created
- [ ] Validation passed
- [ ] Skip link working manually
- [ ] Ready for Commit 4

---

## Commit 4: Add Navigation E2E Tests

### Pre-Commit Checklist

- [ ] Verify Commit 3 is complete
- [ ] Review existing E2E test patterns in `tests/e2e/`
- [ ] Verify Playwright is configured: `npx playwright test --version`
- [ ] Verify axe-core is available: check `@axe-core/playwright` in package.json

### Implementation Checklist

- [ ] Create `tests/e2e/navigation.e2e.spec.ts` with full test suite
- [ ] Include imports for Playwright and AxeBuilder
- [ ] Include imports for i18n messages (fr.json, en.json)
- [ ] Implement test categories:
  - [ ] Header tests (4 tests)
  - [ ] Desktop Navigation tests (3 tests)
  - [ ] Mobile Navigation tests (5 tests)
  - [ ] Language Switcher tests (5 tests)
  - [ ] Skip Link tests (4 tests)
  - [ ] Keyboard Navigation tests (2 tests)
  - [ ] Accessibility tests (4 tests)
  - [ ] Footer tests (2 tests)

### Test Implementation Reference

See `IMPLEMENTATION_PLAN.md` for the complete test file content (~220 lines).

Key test patterns to follow:
```typescript
// Viewport setup for mobile tests
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
})

// Using i18n messages for assertions
await expect(page.getByRole('link', { name: frMessages.navigation.articles })).toBeVisible()

// axe-core audit
const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa'])
  .analyze()
expect(results.violations).toHaveLength(0)
```

### Post-Commit Validation

- [ ] Run tests: `pnpm test:e2e -- tests/e2e/navigation.e2e.spec.ts`
- [ ] All tests pass (29 tests)
- [ ] No test timeouts
- [ ] Tests complete in < 2 minutes

#### If Tests Fail

Common fixes:
1. **axe violations**: Check console output for specific violations, fix in components
2. **Selector not found**: Update selectors to match actual component output
3. **Timeout**: Increase timeout or add explicit waits
4. **Mobile menu issues**: Ensure Sheet component aria-labels match test expectations

### Commit

```bash
git add tests/e2e/navigation.e2e.spec.ts
git commit -m "$(cat <<'EOF'
✅ test(e2e): add comprehensive navigation E2E tests

Add navigation.e2e.spec.ts with 29 tests covering:
- Header visibility and sticky behavior
- Desktop navigation links
- Mobile hamburger menu and Sheet
- Language switcher (FR/EN toggle)
- Skip link accessibility
- Keyboard navigation flow
- axe-core WCAG 2.1 AA audit
- Footer visibility and links

Tests run on both FR and EN locales.
Tests cover both desktop (1280px) and mobile (375px) viewports.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Sign-off

- [ ] Commit created
- [ ] All 29 tests pass
- [ ] axe-core reports 0 violations
- [ ] Phase 5 complete

---

## Phase Completion Checklist

### All Commits Complete

- [ ] Commit 1: i18n keys added
- [ ] Commit 2: SkipLink component created
- [ ] Commit 3: SkipLink integrated, landmarks verified
- [ ] Commit 4: E2E tests added and passing

### Final Validation

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes (all test suites)
- [ ] `pnpm test:e2e` passes (includes new navigation tests)

### Accessibility Audit

- [ ] axe-core: 0 violations on FR homepage
- [ ] axe-core: 0 violations on EN homepage
- [ ] axe-core: 0 violations with mobile menu open
- [ ] Skip link works on keyboard navigation
- [ ] All ARIA landmarks present
- [ ] Focus rings visible on all interactive elements

### Manual Testing

- [ ] Desktop (Chrome): Full navigation flow works
- [ ] Mobile (Chrome DevTools): Hamburger menu works
- [ ] Language switch: FR ↔ EN works, URL updates
- [ ] Skip link: Visible on focus, navigates to main

### Documentation Updates

- [ ] Update `PHASES_PLAN.md`: Mark Phase 5 as complete
- [ ] Update `EPIC_TRACKING.md`: Mark Story 3.3 as complete
- [ ] Verify all acceptance criteria in `story_3.3.md` are met

---

## Troubleshooting

### Skip Link Not Visible

1. Check `sr-only` and `focus:not-sr-only` classes are correct
2. Verify no CSS overrides hiding the element
3. Check z-index is high enough (z-[100])
4. Ensure element can receive focus (no `tabindex="-1"` on skip link)

### Focus Not Moving to Main

1. Verify `id="main-content"` is on `<main>`
2. Verify `tabIndex={-1}` is on `<main>`
3. Check JavaScript handler is executing
4. Ensure no focus trap preventing focus movement

### E2E Tests Failing

1. **Selector issues**: Use Playwright Inspector to find correct selectors
2. **Timing issues**: Add `await page.waitForSelector()` before assertions
3. **Viewport issues**: Ensure viewport is set before test actions
4. **i18n issues**: Verify message keys match actual JSON files

### axe-core Violations

Common violations and fixes:

| Violation | Fix |
|-----------|-----|
| color-contrast | Adjust text/background colors to 4.5:1 ratio |
| landmark-unique | Ensure only one `<main>` element |
| button-name | Add aria-label to buttons without text |
| link-name | Ensure links have discernible text |
| focus-visible | Ensure focus styles are visible |

---

## Files Changed Summary

| Commit | File | Action |
|--------|------|--------|
| 1 | `messages/fr.json` | Modified |
| 1 | `messages/en.json` | Modified |
| 2 | `src/components/layout/SkipLink.tsx` | Created |
| 3 | `src/components/layout/index.ts` | Modified |
| 3 | `src/app/[locale]/(frontend)/layout.tsx` | Modified |
| 4 | `tests/e2e/navigation.e2e.spec.ts` | Created |

**Total**: 2 files created, 4 files modified

---

**Checklist Created**: 2025-12-03
**Last Updated**: 2025-12-03
