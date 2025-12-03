# Phase 2: Testing Guide - Header & Desktop Navigation

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 2 of 5

This guide outlines the testing strategy for Phase 2's Header and Navigation components.

---

## Testing Overview

### Phase 2 Testing Scope

| Test Type | Required | Notes |
|-----------|----------|-------|
| Build Verification | Yes | Must pass |
| Type Checking | Yes | Must pass |
| Lint Checking | Yes | Must pass |
| Manual Functional Test | Yes | Navigation works |
| Manual Visual Test | Yes | Styling correct |
| Unit Tests | Optional | Can add later |
| E2E Tests | No | Added in Phase 5 |

### Why No E2E Tests Yet?

- Full E2E tests added in Phase 5 (Accessibility & Validation)
- Phase 2 focuses on component creation
- Manual testing sufficient for navigation verification
- E2E tests need complete layout (Header + Footer + Mobile)

---

## Required Tests

### 1. Build Verification

```bash
# Run the full build
pnpm build
```

**Expected Result**: Build succeeds without errors

**What It Validates**:
- All components compile correctly
- No import errors
- No missing dependencies
- TypeScript is happy
- RSC/Client boundaries correct

### 2. Type Checking

```bash
# Run TypeScript type check
pnpm exec tsc --noEmit
```

**Expected Result**: No type errors

**What It Validates**:
- All types resolve correctly
- Props are properly typed
- Imports are valid
- i18n types work

### 3. Lint Checking

```bash
# Run linter
pnpm lint
```

**Expected Result**: No errors (warnings acceptable)

**What It Validates**:
- Code style compliance
- No unused imports
- Accessibility issues detected
- React hooks rules followed

---

## Manual Functional Tests

### 4. Header Visibility Test

Start the dev server and verify Header appears:

```bash
pnpm dev
```

| Page | Expected Result | Check |
|------|-----------------|-------|
| `http://localhost:3000/fr` | Header visible at top | [ ] |
| `http://localhost:3000/en` | Header visible at top | [ ] |
| `http://localhost:3000/fr/articles` | Header visible at top | [ ] |

### 5. Logo Test

| Test | Steps | Expected Result | Check |
|------|-------|-----------------|-------|
| Logo visible | Look at left side of header | "sebc.dev" text visible | [ ] |
| Logo links home (FR) | Click logo on `/fr/articles` | Navigate to `/fr` | [ ] |
| Logo links home (EN) | Click logo on `/en/articles` | Navigate to `/en` | [ ] |
| Logo hover | Hover over logo | Color changes to primary | [ ] |

### 6. Navigation Links Test

| Test | Steps | Expected Result | Check |
|------|-------|-----------------|-------|
| Articles link visible | Look at navigation | "Articles" text visible | [ ] |
| Articles link (FR) | Click "Articles" | Navigate to `/fr/articles` | [ ] |
| Articles link (EN) | Switch to EN, click "Articles" | Navigate to `/en/articles` | [ ] |

### 7. Categories Dropdown Test

| Test | Steps | Expected Result | Check |
|------|-------|-----------------|-------|
| Trigger visible | Look at navigation | "Catégories" with chevron | [ ] |
| Opens on click | Click "Catégories" | Dropdown appears | [ ] |
| All items visible | Inspect dropdown | 4 items (All + 3 categories) | [ ] |
| "All categories" works | Click "Toutes les catégories" | Navigate to `/articles` | [ ] |
| AI category | Click "Intelligence Artificielle" | Navigate to `/articles?category=ai` | [ ] |
| UX category | Click "UX Design" | Navigate to `/articles?category=ux` | [ ] |
| Engineering category | Click "Ingénierie Logicielle" | Navigate to `/articles?category=engineering` | [ ] |
| Closes on selection | Click any item | Dropdown closes | [ ] |
| Closes on click outside | Click elsewhere | Dropdown closes | [ ] |
| Closes on Escape | Press Escape | Dropdown closes | [ ] |

### 8. Levels Dropdown Test

| Test | Steps | Expected Result | Check |
|------|-------|-----------------|-------|
| Trigger visible | Look at navigation | "Niveaux" with chevron | [ ] |
| Opens on click | Click "Niveaux" | Dropdown appears | [ ] |
| All items visible | Inspect dropdown | 4 items (All + 3 levels) | [ ] |
| "All levels" works | Click "Tous les niveaux" | Navigate to `/articles` | [ ] |
| Beginner | Click "Débutant" | Navigate to `/articles?complexity=beginner` | [ ] |
| Intermediate | Click "Intermédiaire" | Navigate to `/articles?complexity=intermediate` | [ ] |
| Advanced | Click "Avancé" | Navigate to `/articles?complexity=advanced` | [ ] |

### 9. Sticky Header Test

| Test | Steps | Expected Result | Check |
|------|-------|-----------------|-------|
| Sticky on scroll | Scroll down page | Header stays at top | [ ] |
| Z-index correct | Scroll with content | Header above content | [ ] |
| Background visible | Scroll | Header has background color | [ ] |

### 10. i18n Test

| Test | Steps | Expected Result | Check |
|------|-------|-----------------|-------|
| French labels | Visit `/fr` | "Articles", "Catégories", "Niveaux" | [ ] |
| English labels | Visit `/en` | "Articles", "Categories", "Levels" | [ ] |
| French dropdown | Open Catégories on `/fr` | French category names | [ ] |
| English dropdown | Open Categories on `/en` | English category names | [ ] |

---

## Manual Visual Tests

### 11. Desktop Layout Test (≥1024px)

Set viewport to 1024px or wider:

| Element | Expected | Check |
|---------|----------|-------|
| Logo | Left side | [ ] |
| Navigation | Right side, visible | [ ] |
| Articles link | Visible | [ ] |
| Catégories dropdown | Visible | [ ] |
| Niveaux dropdown | Visible | [ ] |

### 12. Styling Test

| Element | Expected Styling | Check |
|---------|------------------|-------|
| Header background | Dark (#1A1D23 or similar) | [ ] |
| Header border | Subtle bottom border | [ ] |
| Logo text | White, bold | [ ] |
| Nav links | Muted color (gray) | [ ] |
| Nav links hover | Lighter color | [ ] |
| Dropdown background | Dark popover | [ ] |
| Dropdown items | Light text on dark | [ ] |
| Dropdown item hover | Highlight color | [ ] |

### 13. Mobile Hidden Test (<1024px)

Set viewport to mobile width (375px):

| Element | Expected | Check |
|---------|----------|-------|
| Logo | Visible | [ ] |
| Navigation links | Hidden | [ ] |
| Dropdowns | Hidden | [ ] |

**Note**: Mobile menu added in Phase 4.

---

## Keyboard Navigation Tests

### 14. Keyboard Accessibility

| Test | Steps | Expected Result | Check |
|------|-------|-----------------|-------|
| Tab to logo | Press Tab | Logo receives focus | [ ] |
| Tab to Articles | Press Tab | Articles link focused | [ ] |
| Tab to Catégories | Press Tab | Catégories trigger focused | [ ] |
| Open dropdown | Press Enter | Dropdown opens | [ ] |
| Navigate items | Press Arrow Down | Move through items | [ ] |
| Select item | Press Enter | Item selected, navigation | [ ] |
| Close dropdown | Press Escape | Dropdown closes | [ ] |
| Continue Tab | Press Tab | Move to Niveaux | [ ] |

---

## Regression Tests

### 15. No Breaking Changes

Verify existing functionality still works:

| Page | Expected | Check |
|------|----------|-------|
| Admin panel (`/admin`) | Loads correctly | [ ] |
| Existing content | Still renders | [ ] |
| Phase 1 components | Still work | [ ] |

### 16. Console Check

| Check | Expected | Status |
|-------|----------|--------|
| No errors | Console clean | [ ] |
| No hydration warnings | No mismatch | [ ] |
| No 404 errors | No missing resources | [ ] |

---

## Optional: Unit Tests

If you want to add unit tests for the components:

### Test File Structure

```
tests/
└── unit/
    └── components/
        └── layout/
            ├── Logo.spec.tsx
            ├── Navigation.spec.tsx
            └── Header.spec.tsx
```

### Example: Logo Unit Test

```tsx
// tests/unit/components/layout/Logo.spec.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Logo } from '@/components/layout/Logo'

// Mock next-intl routing
vi.mock('@/i18n/routing', () => ({
  Link: ({ children, href, className }: any) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

describe('Logo', () => {
  it('renders sebc.dev text', () => {
    render(<Logo />)
    expect(screen.getByText('sebc.dev')).toBeInTheDocument()
  })

  it('links to home', () => {
    render(<Logo />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/')
  })

  it('accepts className prop', () => {
    render(<Logo className="custom-class" />)
    const link = screen.getByRole('link')
    expect(link).toHaveClass('custom-class')
  })
})
```

### Example: Header Unit Test

```tsx
// tests/unit/components/layout/Header.spec.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/layout/Header'

// Mock child components
vi.mock('@/components/layout/Logo', () => ({
  Logo: () => <div data-testid="logo">Logo</div>,
}))

vi.mock('@/components/layout/Navigation', () => ({
  Navigation: () => <nav data-testid="navigation">Navigation</nav>,
}))

describe('Header', () => {
  it('renders header element', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('contains Logo component', () => {
    render(<Header />)
    expect(screen.getByTestId('logo')).toBeInTheDocument()
  })

  it('contains Navigation component', () => {
    render(<Header />)
    expect(screen.getByTestId('navigation')).toBeInTheDocument()
  })

  it('has sticky positioning class', () => {
    render(<Header />)
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('sticky')
  })
})
```

### Run Unit Tests

```bash
pnpm test:unit
```

---

## Test Coverage Goals

### Phase 2 Coverage Targets

| Test Type | Target | Notes |
|-----------|--------|-------|
| Build | 100% pass | Required |
| Type Check | 100% pass | Required |
| Lint | 100% pass | Required |
| Manual Functional | All items checked | Required |
| Manual Visual | All items checked | Required |
| Keyboard | All items checked | Recommended |
| Unit | Optional | Can add in future |

### Full Story Coverage (Phase 5)

- E2E tests for complete navigation flows
- Accessibility tests with axe-core
- Visual regression tests

---

## Test Commands Quick Reference

```bash
# Build verification (required)
pnpm build

# Type check (required)
pnpm exec tsc --noEmit

# Lint check (required)
pnpm lint

# Unit tests (optional)
pnpm test:unit

# All tests
pnpm test

# Dev server for manual testing
pnpm dev
```

---

## Troubleshooting

### Navigation Links Not Working

```bash
# Check if articles page exists
ls src/app/[locale]/\(frontend\)/articles/

# If missing, links will 404 - that's OK for Phase 2
# Articles page implemented in Story 4.x
```

### Dropdown Not Opening

```bash
# Verify DropdownMenu component exists
ls src/components/ui/dropdown-menu.tsx

# Check for console errors
# Open browser DevTools → Console
```

### Translations Not Loading

```bash
# Verify JSON is valid
cat messages/fr.json | jq .

# Check for key mismatches
grep -o "t('.*')" src/components/layout/Navigation.tsx
cat messages/fr.json | jq '.navigation'
```

### Header Not Sticky

```bash
# Check CSS classes
grep "sticky" src/components/layout/Header.tsx

# Verify z-index
grep "z-50" src/components/layout/Header.tsx
```

### Console Hydration Warnings

```bash
# Check for RSC/Client mismatch
# Navigation.tsx should have "use client"
head -1 src/components/layout/Navigation.tsx
```

---

## Test Checklist Summary

Before marking Phase 2 complete:

### Required

- [ ] Build passes
- [ ] Type check passes
- [ ] Lint passes
- [ ] Header visible on all frontend pages
- [ ] Logo links to home
- [ ] Navigation links work
- [ ] Dropdowns open and close
- [ ] i18n translations work
- [ ] Keyboard navigation works
- [ ] No console errors

### Recommended

- [ ] All manual tests pass
- [ ] Styling matches design spec
- [ ] Admin panel still works

### Optional

- [ ] Unit tests added
- [ ] Visual regression baseline

---

**Document Created**: 2025-12-03
**Last Updated**: 2025-12-03
