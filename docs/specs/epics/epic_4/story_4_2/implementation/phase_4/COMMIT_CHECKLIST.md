# Phase 4: Commit Checklist

**Phase**: Integration & E2E Testing
**Total Commits**: 5

---

## How to Use This Checklist

For each commit:
1. Read the "Before Starting" section
2. Complete all implementation tasks in order
3. Run validation checks
4. Commit only after all checks pass

**Commit Message Format**:
```
<gitmoji> <type>(<scope>): <description>

<body>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

---

## Commit 1: Add TOC Translations

**Message**: `🌐 feat(i18n): add TOC translations for article page`

### Before Starting
- [ ] Verify current branch is `feature/story-4.2-phase-4`
- [ ] Ensure working directory is clean (`git status`)
- [ ] Read `messages/en.json` structure

### Implementation Tasks

#### 1.1 Update English translations

**File**: `messages/en.json`

- [ ] Open `messages/en.json`
- [ ] Locate the `"article"` key
- [ ] Add `"toc"` object with the following keys:

```json
{
  "article": {
    // ... existing keys ...
    "toc": {
      "title": "Table of Contents",
      "openButton": "Open table of contents",
      "progressLabel": "Reading progress"
    }
  }
}
```

- [ ] Ensure no trailing commas
- [ ] Save file

#### 1.2 Update French translations

**File**: `messages/fr.json`

- [ ] Open `messages/fr.json`
- [ ] Locate the `"article"` key
- [ ] Add `"toc"` object with the following keys:

```json
{
  "article": {
    // ... existing keys ...
    "toc": {
      "title": "Table des matières",
      "openButton": "Ouvrir la table des matières",
      "progressLabel": "Progression de lecture"
    }
  }
}
```

- [ ] Ensure no trailing commas
- [ ] Save file

### Validation Checks

- [ ] JSON syntax valid: `pnpm exec prettier --check messages/*.json`
- [ ] Keys match between files: visually verify structure
- [ ] Lint passes: `pnpm lint`

### Commit

```bash
git add messages/en.json messages/fr.json
git commit -m "$(cat <<'EOF'
🌐 feat(i18n): add TOC translations for article page

Add French and English translations for:
- TOC title
- Mobile TOC button label
- Reading progress bar aria-label

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Commit 2: Create ArticleLayout Wrapper Component

**Message**: `✨ feat(article): add ArticleLayout component for TOC integration`

### Before Starting
- [ ] Commit 1 is complete and pushed
- [ ] Review existing components in `src/components/articles/`
- [ ] Review `TableOfContents`, `MobileTOC`, `ReadingProgressBar` interfaces

### Implementation Tasks

#### 2.1 Create ArticleLayout component

**File**: `src/components/articles/ArticleLayout.tsx`

- [ ] Create new file `ArticleLayout.tsx`
- [ ] Add `'use client'` directive at top
- [ ] Import dependencies:

```typescript
import { useRef, type ReactNode } from 'react'
import type { TOCHeading } from '@/lib/toc/types'
import { ReadingProgressBar } from './ReadingProgressBar'
import { TableOfContents } from './TableOfContents'
import { MobileTOC } from './MobileTOC'
import { cn } from '@/lib/utils'
```

- [ ] Define props interface:

```typescript
export interface ArticleLayoutProps {
  children: ReactNode
  headings: TOCHeading[]
  tocTitle: string
  tocOpenLabel: string
  progressLabel: string
  className?: string
}
```

- [ ] Implement component:
  - [ ] Create `articleRef` using `useRef<HTMLElement>(null)`
  - [ ] Calculate `hasTOC = headings.length > 0`
  - [ ] Render `ReadingProgressBar` with `articleRef`
  - [ ] Render 3-column grid layout container
  - [ ] Render left spacer (desktop only, hidden on mobile)
  - [ ] Render `<article>` with ref and children
  - [ ] Render `TableOfContents` in aside (desktop only)
  - [ ] Render `MobileTOC` (hidden on desktop)

- [ ] Add JSDoc documentation
- [ ] Save file

#### 2.2 Export from barrel file

**File**: `src/components/articles/index.ts`

- [ ] Open `index.ts`
- [ ] Add export for ArticleLayout:

```typescript
// Article Layout
export { ArticleLayout, type ArticleLayoutProps } from './ArticleLayout'
```

- [ ] Add to barrel comment at top
- [ ] Save file

### Validation Checks

- [ ] TypeScript compiles: `pnpm exec tsc --noEmit`
- [ ] Lint passes: `pnpm lint`
- [ ] Build succeeds: `pnpm build`

### Manual Testing

- [ ] Import works: verify in dev tools or test file
- [ ] No runtime errors when rendered

### Commit

```bash
git add src/components/articles/ArticleLayout.tsx src/components/articles/index.ts
git commit -m "$(cat <<'EOF'
✨ feat(article): add ArticleLayout component for TOC integration

Create ArticleLayout wrapper component that provides:
- 3-column responsive grid layout (desktop)
- Single column layout (mobile)
- ReadingProgressBar integration
- TableOfContents sidebar (desktop)
- MobileTOC floating button (mobile)

Layout breakpoint: lg (1024px)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Commit 3: Integrate Components in Article Page

**Message**: `✨ feat(article): integrate TOC and progress bar in article page`

### Before Starting
- [ ] Commit 2 is complete and pushed
- [ ] Review current `page.tsx` structure
- [ ] Verify `extractTOCHeadings` function exists in `@/lib/toc`

### Implementation Tasks

#### 3.1 Update article page

**File**: `src/app/[locale]/(frontend)/articles/[slug]/page.tsx`

- [ ] Add imports at top:

```typescript
import { extractTOCHeadings } from '@/lib/toc'
import { ArticleLayout } from '@/components/articles'
```

- [ ] In the `ArticlePage` component, after `mapPayloadToArticleData`:

```typescript
// Extract TOC headings from content (server-side)
const headings = isLexicalContent(payloadArticle.content)
  ? extractTOCHeadings(payloadArticle.content)
  : []
```

- [ ] Replace the existing `<article>` wrapper with `<ArticleLayout>`:

**Before**:
```tsx
<article className="container mx-auto px-4 py-8 max-w-prose">
  {/* content */}
</article>
```

**After**:
```tsx
<ArticleLayout
  headings={headings}
  tocTitle={t('toc.title')}
  tocOpenLabel={t('toc.openButton')}
  progressLabel={t('toc.progressLabel')}
>
  {/* content stays the same, just remove outer wrapper */}
</ArticleLayout>
```

- [ ] Remove the `className="container mx-auto..."` from content wrapper
- [ ] Keep all child components (Hero, Header, Content, Footer) inside

- [ ] Save file

### Validation Checks

- [ ] TypeScript compiles: `pnpm exec tsc --noEmit`
- [ ] Lint passes: `pnpm lint`
- [ ] Build succeeds: `pnpm build`

### Manual Testing

Start dev server and test:

```bash
pnpm dev
```

**Desktop (viewport ≥1024px)**:
- [ ] TOC sidebar visible on right
- [ ] TOC contains article headings
- [ ] Clicking TOC link scrolls to section
- [ ] Active section highlighted during scroll
- [ ] Progress bar visible at top
- [ ] Progress bar updates on scroll

**Mobile (viewport <1024px)**:
- [ ] TOC sidebar hidden
- [ ] Floating button visible in bottom-right
- [ ] Clicking button opens Sheet
- [ ] Sheet contains TOC links
- [ ] Clicking link scrolls and closes Sheet
- [ ] Progress bar visible and updates

### Commit

```bash
git add src/app/[locale]/(frontend)/articles/[slug]/page.tsx
git commit -m "$(cat <<'EOF'
✨ feat(article): integrate TOC and progress bar in article page

- Extract TOC headings server-side from Lexical content
- Wrap article content with ArticleLayout
- Pass i18n translations for TOC labels
- Desktop: 3-column layout with sticky TOC sidebar
- Mobile: Single column with floating TOC button

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Commit 4: E2E Tests - TOC Navigation

**Message**: `✅ test(e2e): add TOC navigation tests for article page`

### Before Starting
- [ ] Commit 3 is complete and pushed
- [ ] Verify E2E test setup: `tests/e2e/` directory exists
- [ ] Check if seeded article exists for testing
- [ ] Review Playwright test patterns in existing tests

### Implementation Tasks

#### 4.1 Create TOC navigation test file

**File**: `tests/e2e/articles/toc-navigation.e2e.spec.ts`

- [ ] Create directory if needed: `mkdir -p tests/e2e/articles`
- [ ] Create test file with structure:

```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Table of Contents Navigation', () => {
  // Define test article slug
  const ARTICLE_SLUG = 'article-with-headings' // Update with actual seeded slug

  test.describe('Desktop TOC (@desktop)', () => {
    test.use({ viewport: { width: 1280, height: 720 } })

    test.beforeEach(async ({ page }) => {
      await page.goto(`/fr/articles/${ARTICLE_SLUG}`)
      await page.waitForLoadState('networkidle')
    })

    test('displays TOC sidebar', async ({ page }) => {
      const toc = page.getByRole('navigation', { name: /table des matières/i })
      await expect(toc).toBeVisible()
    })

    test('TOC contains headings from article', async ({ page }) => {
      const tocNav = page.getByRole('navigation', { name: /table des matières/i })
      const links = tocNav.getByRole('link')
      await expect(links).not.toHaveCount(0)
    })

    test('clicking TOC link scrolls to section', async ({ page }) => {
      const tocLink = page.getByRole('navigation', { name: /table des matières/i })
        .getByRole('link')
        .first()

      const linkText = await tocLink.textContent()
      await tocLink.click()

      // Wait for scroll
      await page.waitForTimeout(500)

      // Verify target heading is in viewport
      // The ID is generated from the heading text via slugify
      const targetHeading = page.locator(`h2, h3`).filter({ hasText: linkText })
      await expect(targetHeading.first()).toBeInViewport()
    })

    test('highlights active section on scroll', async ({ page }) => {
      // Get second TOC link
      const secondLink = page.getByRole('navigation', { name: /table des matières/i })
        .getByRole('link')
        .nth(1)

      const linkText = await secondLink.textContent()

      // Scroll the corresponding heading into view
      const heading = page.locator('h2, h3').filter({ hasText: linkText })
      await heading.first().scrollIntoViewIfNeeded()
      await page.waitForTimeout(400) // Wait for intersection observer

      // Check aria-current
      await expect(secondLink).toHaveAttribute('aria-current', 'true')
    })
  })

  test.describe('Mobile TOC (@mobile)', () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test.beforeEach(async ({ page }) => {
      await page.goto(`/fr/articles/${ARTICLE_SLUG}`)
      await page.waitForLoadState('networkidle')
    })

    test('hides desktop TOC sidebar', async ({ page }) => {
      // Desktop TOC should be hidden
      const desktopToc = page.locator('aside').getByRole('navigation', { name: /table des matières/i })
      await expect(desktopToc).not.toBeVisible()
    })

    test('displays floating TOC button', async ({ page }) => {
      const button = page.getByRole('button', { name: /ouvrir la table des matières/i })
      await expect(button).toBeVisible()
    })

    test('opens sheet on button click', async ({ page }) => {
      await page.getByRole('button', { name: /ouvrir la table des matières/i }).click()

      const sheet = page.getByRole('dialog')
      await expect(sheet).toBeVisible()
    })

    test('closes sheet after link click', async ({ page }) => {
      // Open sheet
      await page.getByRole('button', { name: /ouvrir la table des matières/i }).click()
      await expect(page.getByRole('dialog')).toBeVisible()

      // Click first link
      await page.getByRole('dialog').getByRole('link').first().click()

      // Wait for animation and verify closed
      await page.waitForTimeout(500)
      await expect(page.getByRole('dialog')).not.toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test.use({ viewport: { width: 1280, height: 720 } })

    test.beforeEach(async ({ page }) => {
      await page.goto(`/fr/articles/${ARTICLE_SLUG}`)
      await page.waitForLoadState('networkidle')
    })

    test('TOC has no accessibility violations', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .include('nav[aria-label*="matières"], nav[aria-label*="Contents"]')
        .analyze()

      expect(results.violations).toEqual([])
    })

    test('keyboard navigation works', async ({ page }) => {
      const toc = page.getByRole('navigation', { name: /table des matières/i })
      const firstLink = toc.getByRole('link').first()

      // Tab to TOC
      await firstLink.focus()
      await expect(firstLink).toBeFocused()

      // Press Enter to navigate
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      // Verify scroll occurred
      const linkText = await firstLink.textContent()
      const heading = page.locator('h2, h3').filter({ hasText: linkText })
      await expect(heading.first()).toBeInViewport()
    })
  })
})
```

- [ ] Update `ARTICLE_SLUG` with actual seeded article slug
- [ ] Save file

### Validation Checks

- [ ] TypeScript compiles: `pnpm exec tsc --noEmit`
- [ ] Tests pass: `pnpm test:e2e tests/e2e/articles/toc-navigation.e2e.spec.ts`

### Commit

```bash
git add tests/e2e/articles/toc-navigation.e2e.spec.ts
git commit -m "$(cat <<'EOF'
✅ test(e2e): add TOC navigation tests for article page

Add comprehensive E2E tests for Table of Contents:

Desktop tests:
- TOC sidebar visibility
- Heading content display
- Click navigation to sections
- Active section highlighting

Mobile tests:
- Floating button visibility
- Sheet modal opening
- Auto-close after navigation

Accessibility tests:
- axe-core validation
- Keyboard navigation

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Commit 5: E2E Tests - Reading Progress

**Message**: `✅ test(e2e): add reading progress bar tests for article page`

### Before Starting
- [ ] Commit 4 is complete and pushed
- [ ] TOC tests are passing

### Implementation Tasks

#### 5.1 Create reading progress test file

**File**: `tests/e2e/articles/reading-progress.e2e.spec.ts`

- [ ] Create test file:

```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Reading Progress Bar', () => {
  const ARTICLE_SLUG = 'article-with-headings' // Same as TOC tests

  test.beforeEach(async ({ page }) => {
    await page.goto(`/fr/articles/${ARTICLE_SLUG}`)
    await page.waitForLoadState('networkidle')
  })

  test('displays progress bar at top of page', async ({ page }) => {
    const progressBar = page.getByRole('progressbar', { name: /progression/i })
    await expect(progressBar).toBeVisible()
  })

  test('starts near 0% at top of page', async ({ page }) => {
    // Ensure at top
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(150)

    const progressBar = page.getByRole('progressbar')
    const value = await progressBar.getAttribute('aria-valuenow')

    expect(Number(value)).toBeLessThanOrEqual(10)
  })

  test('updates progress on scroll', async ({ page }) => {
    // Scroll to middle of article
    await page.evaluate(() => {
      const article = document.querySelector('article')
      if (article) {
        const rect = article.getBoundingClientRect()
        const middle = rect.top + window.scrollY + rect.height / 2
        window.scrollTo({ top: middle, behavior: 'instant' })
      }
    })
    await page.waitForTimeout(200)

    const progressBar = page.getByRole('progressbar')
    const value = await progressBar.getAttribute('aria-valuenow')

    expect(Number(value)).toBeGreaterThan(20)
    expect(Number(value)).toBeLessThan(80)
  })

  test('reaches high percentage at end of article', async ({ page }) => {
    // Scroll to end of article
    await page.evaluate(() => {
      const article = document.querySelector('article')
      if (article) {
        const rect = article.getBoundingClientRect()
        const bottom = rect.top + window.scrollY + rect.height - window.innerHeight
        window.scrollTo({ top: Math.max(0, bottom), behavior: 'instant' })
      }
    })
    await page.waitForTimeout(200)

    const progressBar = page.getByRole('progressbar')
    const value = await progressBar.getAttribute('aria-valuenow')

    expect(Number(value)).toBeGreaterThanOrEqual(85)
  })

  test.describe('ARIA Attributes', () => {
    test('has required progressbar attributes', async ({ page }) => {
      const progressBar = page.getByRole('progressbar')

      await expect(progressBar).toHaveAttribute('aria-valuemin', '0')
      await expect(progressBar).toHaveAttribute('aria-valuemax', '100')
      await expect(progressBar).toHaveAttribute('aria-valuenow')
      await expect(progressBar).toHaveAttribute('aria-label')
    })
  })

  test.describe('Accessibility', () => {
    test('has no accessibility violations', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .include('[role="progressbar"]')
        .analyze()

      expect(results.violations).toEqual([])
    })
  })

  test.describe('Reduced Motion', () => {
    test('respects prefers-reduced-motion', async ({ page }) => {
      // Emulate reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.reload()
      await page.waitForLoadState('networkidle')

      // Progress bar should still work, just without transitions
      const progressBar = page.getByRole('progressbar')
      await expect(progressBar).toBeVisible()

      // Verify no transition style (motion-reduce:transition-none)
      const innerBar = progressBar.locator('div').first()
      const transitionDuration = await innerBar.evaluate((el) => {
        return window.getComputedStyle(el).transitionDuration
      })

      // With reduced motion, transition should be 0s or none
      expect(['0s', '0ms', 'none', '']).toContain(transitionDuration)
    })
  })
})
```

- [ ] Update `ARTICLE_SLUG` to match Commit 4
- [ ] Save file

### Validation Checks

- [ ] TypeScript compiles: `pnpm exec tsc --noEmit`
- [ ] Tests pass: `pnpm test:e2e tests/e2e/articles/reading-progress.e2e.spec.ts`
- [ ] All E2E tests pass: `pnpm test:e2e`

### Commit

```bash
git add tests/e2e/articles/reading-progress.e2e.spec.ts
git commit -m "$(cat <<'EOF'
✅ test(e2e): add reading progress bar tests for article page

Add E2E tests for reading progress functionality:

Progress tracking:
- Visibility at page top
- Initial value near 0%
- Update on scroll to middle
- High percentage at article end

Accessibility:
- ARIA attribute validation
- axe-core compliance

Motion preference:
- prefers-reduced-motion respect

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Phase Completion

After all 5 commits:

### Final Validation

- [ ] All commits pushed: `git log --oneline -5`
- [ ] All tests pass: `pnpm test`
- [ ] Build succeeds: `pnpm build`
- [ ] E2E tests pass: `pnpm test:e2e`

### Update Tracking

- [ ] Update PHASES_PLAN.md Phase 4 status to COMPLETED
- [ ] Update EPIC_TRACKING.md if applicable

### Next Steps

- [ ] Create PR for phase review
- [ ] Complete [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)
- [ ] Request code review using [guides/REVIEW.md](./guides/REVIEW.md)
