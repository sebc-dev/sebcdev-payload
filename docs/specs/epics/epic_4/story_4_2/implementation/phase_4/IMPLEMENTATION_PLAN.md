# Phase 4: Implementation Plan

**Phase**: Integration & E2E Testing
**Commits**: 5 atomic commits
**Estimated Duration**: 3-4 hours

---

## Commit Strategy Overview

This phase integrates all components from Phases 1-3 into the article page and validates with E2E tests.

```
┌─────────────────────────────────────────────────────────────┐
│ Commit 1: Translations                                       │
│ ├─ messages/en.json                                          │
│ └─ messages/fr.json                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Commit 2: ArticleLayout Component                            │
│ ├─ src/components/articles/ArticleLayout.tsx (new)          │
│ └─ src/components/articles/index.ts (export)                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Commit 3: Article Page Integration                           │
│ └─ src/app/[locale]/(frontend)/articles/[slug]/page.tsx     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Commit 4: E2E Tests - TOC Navigation                         │
│ └─ tests/e2e/articles/toc-navigation.e2e.spec.ts (new)      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Commit 5: E2E Tests - Reading Progress                       │
│ └─ tests/e2e/articles/reading-progress.e2e.spec.ts (new)    │
└─────────────────────────────────────────────────────────────┘
```

---

## Commit 1: Add TOC Translations

**Message**: `🌐 feat(i18n): add TOC translations for article page`

**Objective**: Add French and English translations for TOC labels and accessibility strings.

### Files Changed

| File | Action | Lines |
|------|--------|-------|
| `messages/en.json` | Modify | +15 |
| `messages/fr.json` | Modify | +15 |

### Implementation Details

**messages/en.json** - Add under `article` key:

```json
{
  "article": {
    // existing keys...
    "toc": {
      "title": "Table of Contents",
      "openButton": "Open table of contents",
      "progressLabel": "Reading progress"
    }
  }
}
```

**messages/fr.json** - Add under `article` key:

```json
{
  "article": {
    // existing keys...
    "toc": {
      "title": "Table des matières",
      "openButton": "Ouvrir la table des matières",
      "progressLabel": "Progression de lecture"
    }
  }
}
```

### Validation

- [ ] JSON syntax valid (no trailing commas)
- [ ] Keys match between en.json and fr.json
- [ ] `pnpm lint` passes

---

## Commit 2: Create ArticleLayout Wrapper Component

**Message**: `✨ feat(article): add ArticleLayout component for TOC integration`

**Objective**: Create a client component that handles the responsive 3-column layout with TOC integration.

### Files Changed

| File | Action | Lines |
|------|--------|-------|
| `src/components/articles/ArticleLayout.tsx` | Create | ~120 |
| `src/components/articles/index.ts` | Modify | +2 |

### Implementation Details

**ArticleLayout.tsx**:

```tsx
'use client'

import { useRef, type ReactNode } from 'react'
import type { TOCHeading } from '@/lib/toc/types'
import { ReadingProgressBar } from './ReadingProgressBar'
import { TableOfContents } from './TableOfContents'
import { MobileTOC } from './MobileTOC'
import { cn } from '@/lib/utils'

export interface ArticleLayoutProps {
  /**
   * Article content (rendered RichText)
   */
  children: ReactNode
  /**
   * TOC headings extracted from article content
   */
  headings: TOCHeading[]
  /**
   * Title for TOC (i18n)
   */
  tocTitle: string
  /**
   * Mobile TOC button label (i18n)
   */
  tocOpenLabel: string
  /**
   * Progress bar aria-label (i18n)
   */
  progressLabel: string
  /**
   * Optional className for the article wrapper
   */
  className?: string
}

/**
 * Article layout with reading progress bar and responsive TOC.
 *
 * - Desktop (≥1024px): 3-column grid with sticky TOC sidebar
 * - Mobile (<1024px): Single column with floating TOC button
 *
 * @example
 * <ArticleLayout
 *   headings={headings}
 *   tocTitle={t('article.toc.title')}
 *   tocOpenLabel={t('article.toc.openButton')}
 *   progressLabel={t('article.toc.progressLabel')}
 * >
 *   <RichText content={article.content} />
 * </ArticleLayout>
 */
export function ArticleLayout({
  children,
  headings,
  tocTitle,
  tocOpenLabel,
  progressLabel,
  className,
}: ArticleLayoutProps) {
  const articleRef = useRef<HTMLElement>(null)
  const hasTOC = headings.length > 0

  return (
    <>
      {/* Reading Progress Bar - Always visible */}
      <ReadingProgressBar
        articleRef={articleRef}
        ariaLabel={progressLabel}
      />

      {/* 3-Column Layout Container */}
      <div
        className={cn(
          // Base layout
          'mx-auto px-4',
          // Desktop: 3-column grid
          hasTOC && 'lg:grid lg:grid-cols-[1fr_minmax(0,65ch)_200px] lg:gap-8 lg:max-w-7xl',
          // Mobile: Single column, centered
          !hasTOC && 'max-w-prose',
          className,
        )}
      >
        {/* Left spacer (desktop only) */}
        {hasTOC && <div className="hidden lg:block" aria-hidden="true" />}

        {/* Main article content */}
        <article
          ref={articleRef}
          className={cn(
            'py-8',
            // When no TOC, center the content
            !hasTOC && 'mx-auto max-w-prose',
          )}
        >
          {children}
        </article>

        {/* TOC Sidebar (desktop only) */}
        {hasTOC && (
          <aside className="hidden lg:block relative">
            <TableOfContents
              headings={headings}
              title={tocTitle}
              topOffset={100}
            />
          </aside>
        )}
      </div>

      {/* Mobile TOC Button */}
      {hasTOC && (
        <div className="lg:hidden">
          <MobileTOC
            headings={headings}
            title={tocTitle}
            triggerLabel={tocOpenLabel}
            topOffset={100}
          />
        </div>
      )}
    </>
  )
}
```

**Update index.ts** - Add export:

```tsx
// Article Layout
export { ArticleLayout, type ArticleLayoutProps } from './ArticleLayout'
```

### Validation

- [ ] Component renders without errors
- [ ] Desktop: 3-column layout visible
- [ ] Mobile: Single column + floating button
- [ ] `pnpm lint` passes
- [ ] `pnpm build` succeeds

---

## Commit 3: Integrate Components in Article Page

**Message**: `✨ feat(article): integrate TOC and progress bar in article page`

**Objective**: Update the article page to use ArticleLayout with TOC extraction.

### Files Changed

| File | Action | Lines |
|------|--------|-------|
| `src/app/[locale]/(frontend)/articles/[slug]/page.tsx` | Modify | ~30 |

### Implementation Details

**Key Changes**:

1. Import `ArticleLayout` and `extractTOCHeadings`
2. Extract headings from article content (server-side)
3. Get translations for TOC labels
4. Wrap content with `ArticleLayout`

**Updated ArticlePage structure**:

```tsx
import { extractTOCHeadings, isLexicalContent } from '@/lib/toc'
import { ArticleLayout } from '@/components/articles'

export default async function ArticlePage({ params }: ArticlePageProps) {
  // ... existing code ...

  // Extract TOC headings from content (server-side)
  const headings = isLexicalContent(payloadArticle.content)
    ? extractTOCHeadings(payloadArticle.content)
    : []

  return (
    <>
      {/* JSON-LD Structured Data */}
      <ArticleJsonLdScript article={seoData} />

      <ArticleLayout
        headings={headings}
        tocTitle={t('toc.title')}
        tocOpenLabel={t('toc.openButton')}
        progressLabel={t('toc.progressLabel')}
      >
        {/* Hero: Featured Image */}
        {article.heroCoverImage && (
          <ArticleHero image={article.heroCoverImage} title={article.title} />
        )}

        {/* Header: Title, Category, Metadata */}
        <ArticleHeader article={article} locale={locale} />

        {/* Content - Rendered via RichText serializer */}
        <div className="py-8">
          {isLexicalContent(payloadArticle.content) ? (
            <RichText content={payloadArticle.content} />
          ) : (
            <p className="text-muted-foreground italic">{t('contentUnavailable')}</p>
          )}
        </div>

        {/* Footer: Tags */}
        <ArticleFooter tags={article.tags} locale={locale} />
      </ArticleLayout>
    </>
  )
}
```

### Validation

- [ ] Article page renders correctly
- [ ] Desktop: TOC sidebar visible with content
- [ ] Mobile: TOC button visible in bottom-right
- [ ] Progress bar updates on scroll
- [ ] TOC links navigate to sections
- [ ] `pnpm lint` passes
- [ ] `pnpm build` succeeds

---

## Commit 4: E2E Tests - TOC Navigation

**Message**: `✅ test(e2e): add TOC navigation tests for article page`

**Objective**: Add comprehensive E2E tests for TOC functionality.

### Files Changed

| File | Action | Lines |
|------|--------|-------|
| `tests/e2e/articles/toc-navigation.e2e.spec.ts` | Create | ~150 |

### Implementation Details

**Test Structure**:

```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Table of Contents Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a seeded article with headings
    await page.goto('/fr/articles/[seeded-article-slug]')
    await page.waitForLoadState('networkidle')
  })

  test.describe('Desktop TOC', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
    })

    test('should display TOC sidebar on desktop', async ({ page }) => {
      const toc = page.getByRole('navigation', { name: /table/i })
      await expect(toc).toBeVisible()
    })

    test('should navigate to section on TOC link click', async ({ page }) => {
      const tocLink = page.getByRole('link', { name: /first-heading/i })
      await tocLink.click()

      // Verify scroll position
      const heading = page.locator('#first-heading-id')
      await expect(heading).toBeInViewport()
    })

    test('should highlight active section on scroll', async ({ page }) => {
      // Scroll to a section
      await page.locator('#second-heading-id').scrollIntoViewIfNeeded()
      await page.waitForTimeout(300) // Wait for intersection observer

      // Verify active state
      const activeLink = page.getByRole('link', { name: /second-heading/i })
      await expect(activeLink).toHaveAttribute('aria-current', 'true')
    })
  })

  test.describe('Mobile TOC', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
    })

    test('should display TOC button on mobile', async ({ page }) => {
      const tocButton = page.getByRole('button', { name: /ouvrir/i })
      await expect(tocButton).toBeVisible()
    })

    test('should open TOC sheet on button click', async ({ page }) => {
      const tocButton = page.getByRole('button', { name: /ouvrir/i })
      await tocButton.click()

      // Sheet should be visible
      const sheet = page.getByRole('dialog')
      await expect(sheet).toBeVisible()
    })

    test('should close sheet after navigation', async ({ page }) => {
      // Open sheet
      await page.getByRole('button', { name: /ouvrir/i }).click()

      // Click a link
      const tocLink = page.getByRole('dialog').getByRole('link').first()
      await tocLink.click()

      // Sheet should close
      const sheet = page.getByRole('dialog')
      await expect(sheet).not.toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('should have no accessibility violations', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('nav[aria-label*="Table"]')
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })
  })
})
```

### Validation

- [ ] All TOC tests pass
- [ ] Tests work on both desktop and mobile viewports
- [ ] No accessibility violations detected
- [ ] `pnpm test:e2e` passes

---

## Commit 5: E2E Tests - Reading Progress

**Message**: `✅ test(e2e): add reading progress bar tests for article page`

**Objective**: Add E2E tests for reading progress functionality.

### Files Changed

| File | Action | Lines |
|------|--------|-------|
| `tests/e2e/articles/reading-progress.e2e.spec.ts` | Create | ~100 |

### Implementation Details

**Test Structure**:

```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Reading Progress Bar', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a seeded article
    await page.goto('/fr/articles/[seeded-article-slug]')
    await page.waitForLoadState('networkidle')
  })

  test('should display progress bar at top of page', async ({ page }) => {
    const progressBar = page.getByRole('progressbar', { name: /progress/i })
    await expect(progressBar).toBeVisible()
  })

  test('should start at 0% at top of page', async ({ page }) => {
    // Scroll to top
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(100)

    const progressBar = page.getByRole('progressbar')
    const value = await progressBar.getAttribute('aria-valuenow')
    expect(Number(value)).toBeLessThanOrEqual(5) // Near 0%
  })

  test('should update on scroll', async ({ page }) => {
    // Scroll to middle
    await page.evaluate(() => {
      const article = document.querySelector('article')
      if (article) {
        const middle = article.offsetTop + article.offsetHeight / 2
        window.scrollTo(0, middle)
      }
    })
    await page.waitForTimeout(200) // Wait for RAF update

    const progressBar = page.getByRole('progressbar')
    const value = await progressBar.getAttribute('aria-valuenow')
    expect(Number(value)).toBeGreaterThan(20)
    expect(Number(value)).toBeLessThan(80)
  })

  test('should reach ~100% at end of article', async ({ page }) => {
    // Scroll to bottom of article
    await page.evaluate(() => {
      const article = document.querySelector('article')
      if (article) {
        const bottom = article.offsetTop + article.offsetHeight
        window.scrollTo(0, bottom)
      }
    })
    await page.waitForTimeout(200)

    const progressBar = page.getByRole('progressbar')
    const value = await progressBar.getAttribute('aria-valuenow')
    expect(Number(value)).toBeGreaterThanOrEqual(90) // Near 100%
  })

  test.describe('Accessibility', () => {
    test('should have proper ARIA attributes', async ({ page }) => {
      const progressBar = page.getByRole('progressbar')
      await expect(progressBar).toHaveAttribute('aria-valuemin', '0')
      await expect(progressBar).toHaveAttribute('aria-valuemax', '100')
      await expect(progressBar).toHaveAttribute('aria-label')
    })

    test('should have no accessibility violations', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .include('[role="progressbar"]')
        .analyze()

      expect(results.violations).toEqual([])
    })
  })
})
```

### Validation

- [ ] All progress bar tests pass
- [ ] Progress updates correctly on scroll
- [ ] ARIA attributes are correct
- [ ] No accessibility violations
- [ ] `pnpm test:e2e` passes

---

## Post-Implementation Checklist

After all commits are complete:

### Code Quality

- [ ] All `pnpm lint` checks pass
- [ ] All `pnpm test:unit` tests pass
- [ ] All `pnpm test:e2e` tests pass
- [ ] `pnpm build` succeeds

### Functional Verification

- [ ] Desktop: TOC sidebar visible and functional
- [ ] Mobile: TOC button opens sheet
- [ ] TOC navigation works (smooth scroll)
- [ ] Active section highlighting works
- [ ] Progress bar updates on scroll
- [ ] `prefers-reduced-motion` respected

### Performance

- [ ] No CLS regression (< 0.1)
- [ ] Lighthouse Performance ≥ 90
- [ ] No janky scroll behavior

### Accessibility

- [ ] axe-core: 0 violations
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly

---

## Rollback Strategy

If issues are discovered after integration:

1. **Single commit revert**: `git revert <commit-hash>`
2. **Full phase rollback**: Revert commits 5→4→3→2→1 in order
3. **Component isolation**: Components from Phases 1-3 remain functional independently

---

**Next Step**: Proceed to [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) for detailed per-commit instructions.
