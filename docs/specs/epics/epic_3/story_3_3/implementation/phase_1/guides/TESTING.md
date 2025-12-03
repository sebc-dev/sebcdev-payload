# Phase 1: Testing Guide - shadcn/ui Navigation Components

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 1 of 5

This guide outlines the testing strategy for Phase 1's shadcn/ui component installation.

---

## Testing Overview

### Phase 1 Testing Scope

| Test Type | Required | Notes |
|-----------|----------|-------|
| Build Verification | Yes | Must pass |
| Type Checking | Yes | Must pass |
| Lint Checking | Yes | Must pass |
| Manual Component Test | Recommended | Verify rendering |
| Unit Tests | Optional | For this phase |
| E2E Tests | No | Added in Phase 5 |

### Why Minimal Testing for Phase 1?

- Components are copy-pasted from shadcn/ui (already tested)
- Primary risk is installation/configuration, not functionality
- Full testing added in Phase 5 (Accessibility & E2E Validation)

---

## Required Tests

### 1. Build Verification

```bash
# Run the full build
pnpm build
```

**Expected Result**: Build succeeds without errors

**What It Validates**:
- Components compile correctly
- No import errors
- No missing dependencies
- TypeScript is happy

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

### 3. Lint Checking

```bash
# Run linter
pnpm lint
```

**Expected Result**: No errors (warnings acceptable)

**What It Validates**:
- Code style compliance
- No unused imports
- No obvious issues

---

## Recommended Tests

### 4. Manual Component Verification

Create a temporary test page to verify components render:

#### Step 1: Create Test Page

```tsx
// src/app/[locale]/(frontend)/test-ui/page.tsx
'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

export default function TestUIPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">
        UI Components Test Page
      </h1>

      {/* DropdownMenu Test */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">DropdownMenu Component</h2>
        <div className="space-y-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open Dropdown</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Navigation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Articles</DropdownMenuItem>
              <DropdownMenuItem>Catégories</DropdownMenuItem>
              <DropdownMenuItem>Niveaux</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="text-sm text-muted-foreground">
            <p>Test checklist:</p>
            <ul className="list-disc list-inside ml-4">
              <li>Click button to open dropdown</li>
              <li>Click outside to close</li>
              <li>Press Escape to close</li>
              <li>Use arrow keys to navigate</li>
              <li>Press Enter to select item</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sheet Test */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Sheet Component</h2>
        <div className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            {/* Right Sheet (Default) */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Open Right Sheet</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Right Sheet</SheetTitle>
                  <SheetDescription>
                    This sheet slides in from the right (default).
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <p>Sheet content goes here.</p>
                  <ul className="mt-4 space-y-2">
                    <li>Menu Item 1</li>
                    <li>Menu Item 2</li>
                    <li>Menu Item 3</li>
                  </ul>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button type="button">Close</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {/* Left Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Open Left Sheet</Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Left Sheet</SheetTitle>
                  <SheetDescription>
                    This sheet slides in from the left.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <p>Left side navigation could go here.</p>
                </div>
              </SheetContent>
            </Sheet>

            {/* Top Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Open Top Sheet</Button>
              </SheetTrigger>
              <SheetContent side="top">
                <SheetHeader>
                  <SheetTitle>Top Sheet</SheetTitle>
                  <SheetDescription>
                    This sheet slides down from the top.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>

            {/* Bottom Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Open Bottom Sheet</Button>
              </SheetTrigger>
              <SheetContent side="bottom">
                <SheetHeader>
                  <SheetTitle>Bottom Sheet</SheetTitle>
                  <SheetDescription>
                    This sheet slides up from the bottom.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Test checklist:</p>
            <ul className="list-disc list-inside ml-4">
              <li>Click button to open sheet</li>
              <li>Click overlay to close</li>
              <li>Click X button to close</li>
              <li>Press Escape to close</li>
              <li>Test all 4 directions (right, left, top, bottom)</li>
              <li>Verify animation is smooth</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Keyboard Navigation Test */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Keyboard Navigation Test</h2>
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">Use keyboard to test accessibility:</p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Press Tab to focus the first dropdown button</li>
            <li>Press Enter or Space to open dropdown</li>
            <li>Use Arrow keys to navigate items</li>
            <li>Press Enter to select an item</li>
            <li>Press Escape to close without selecting</li>
            <li>Tab to the sheet buttons and repeat</li>
          </ol>
        </div>
      </section>

      {/* Dark Mode Test */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Dark Mode Test</h2>
        <p className="text-sm text-muted-foreground">
          This page should render correctly in dark mode (the default for this project).
          Verify that:
        </p>
        <ul className="list-disc list-inside ml-4 text-sm text-muted-foreground">
          <li>Background is dark</li>
          <li>Text is light</li>
          <li>Dropdowns have appropriate contrast</li>
          <li>Sheet overlay is visible</li>
        </ul>
      </section>
    </div>
  )
}
```

#### Step 2: Run Dev Server

```bash
pnpm dev
```

#### Step 3: Test Components

Navigate to: `http://localhost:3000/fr/test-ui`

#### Step 4: Manual Test Checklist

##### DropdownMenu Tests

- [ ] Dropdown opens on click
- [ ] Dropdown opens on Enter/Space when focused
- [ ] Items are visible and styled correctly
- [ ] Hover state works on items
- [ ] Clicking an item triggers action (close)
- [ ] Clicking outside closes dropdown
- [ ] Pressing Escape closes dropdown
- [ ] Arrow keys navigate between items
- [ ] Tab key moves focus correctly
- [ ] Disabled items are not selectable
- [ ] Separator is visible

##### Sheet Tests

- [ ] Right sheet opens with animation
- [ ] Left sheet opens with animation
- [ ] Top sheet opens with animation
- [ ] Bottom sheet opens with animation
- [ ] Overlay appears behind sheet
- [ ] X button closes sheet
- [ ] Clicking overlay closes sheet
- [ ] Pressing Escape closes sheet
- [ ] Focus is trapped inside sheet
- [ ] Focus returns to trigger on close

##### Styling Tests

- [ ] Components use correct colors (dark mode)
- [ ] Text is readable
- [ ] Borders are visible
- [ ] Animations are smooth
- [ ] No layout shift on open/close

#### Step 5: Clean Up

**IMPORTANT**: Delete the test page before committing!

```bash
rm -rf src/app/\[locale\]/\(frontend\)/test-ui
```

---

## Optional: Unit Tests

If you want to add unit tests for the components:

### Test File Structure

```
tests/
└── unit/
    └── components/
        ├── dropdown-menu.spec.tsx
        └── sheet.spec.tsx
```

### Example: DropdownMenu Unit Test

```tsx
// tests/unit/components/dropdown-menu.spec.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

describe('DropdownMenu', () => {
  it('renders trigger button', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('opens on click', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    fireEvent.click(screen.getByText('Open'))

    // Wait for dropdown to open
    expect(await screen.findByText('Item')).toBeInTheDocument()
  })

  it('calls onClick handler on item click', async () => {
    const handleClick = vi.fn()

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleClick}>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    fireEvent.click(screen.getByText('Open'))
    fireEvent.click(await screen.findByText('Item'))

    expect(handleClick).toHaveBeenCalled()
  })
})
```

### Example: Sheet Unit Test

```tsx
// tests/unit/components/sheet.spec.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

describe('Sheet', () => {
  it('renders trigger button', () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Title</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )

    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('opens on trigger click', async () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )

    fireEvent.click(screen.getByText('Open'))

    expect(await screen.findByText('Sheet Title')).toBeInTheDocument()
  })

  it('renders with different sides', () => {
    const { rerender } = render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent side="left">
          <p>Left content</p>
        </SheetContent>
      </Sheet>
    )

    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByText('Left content')).toBeInTheDocument()
  })
})
```

### Run Unit Tests

```bash
pnpm test:unit
```

---

## Test Coverage Goals

### Phase 1 Coverage Targets

| Test Type | Target | Notes |
|-----------|--------|-------|
| Build | 100% pass | Required |
| Type Check | 100% pass | Required |
| Lint | 100% pass | Required |
| Manual | All items checked | Recommended |
| Unit | Optional | Can add in future |

### Overall Story Coverage

Full test coverage will be achieved in Phase 5:

- E2E tests for navigation flows
- Accessibility tests with axe-core
- Visual regression tests

---

## Regression Testing

### Verify No Breaking Changes

After Phase 1, verify existing functionality still works:

#### Homepage Test

```bash
# Start dev server
pnpm dev

# In browser, navigate to:
# http://localhost:3000/fr
# http://localhost:3000/en
```

- [ ] French homepage loads
- [ ] English homepage loads
- [ ] No console errors
- [ ] Existing content displays

#### Admin Panel Test

```bash
# Navigate to:
# http://localhost:3000/admin
```

- [ ] Admin login page loads
- [ ] No console errors
- [ ] Admin panel is functional

#### Existing Components Test

- [ ] Button component still works
- [ ] Other UI components unaffected

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

### Test Page Not Loading

```bash
# Check for syntax errors
pnpm lint

# Check TypeScript
pnpm exec tsc --noEmit

# Check console in browser DevTools
```

### Component Not Rendering

```bash
# Verify component file exists
ls src/components/ui/dropdown-menu.tsx
ls src/components/ui/sheet.tsx

# Check imports are correct
grep -n "from '@/components/ui" src/app/[locale]/\(frontend\)/test-ui/page.tsx
```

### Styling Issues

```bash
# Verify Tailwind is working
# Check if other components are styled

# Check CSS variables exist
grep -r "popover" src/styles/globals.css
```

---

**Document Created**: 2025-12-03
**Last Updated**: 2025-12-03
