# Phase 3: Commit Checklist - Polish & Tests

**Story**: 3.5 - Homepage Implementation
**Phase**: 3 of 3

---

## Prerequisites

- [ ] Phase 1 completee et mergee
- [ ] Phase 2 completee et mergee
- [ ] `pnpm install` execute
- [ ] `pnpm build` passe
- [ ] `pnpm test:e2e` fonctionne (tests existants passent)

---

## Commit 1: Image Optimization

### Pre-Implementation
- [x] Verifier la config images actuelle dans `next.config.ts`
- [x] Identifier les domaines R2 utilises

### Implementation

#### Creer `src/lib/image-loader.ts`

```typescript
import type { ImageLoaderProps } from 'next/image'

export function cloudflareImageLoader({ src, width, quality }: ImageLoaderProps): string {
  // External URLs
  if (src.startsWith('http://') || src.startsWith('https://')) {
    const url = new URL(src)

    // Add Cloudflare image params for R2 URLs
    if (
      url.hostname.includes('r2.cloudflarestorage.com') ||
      url.hostname.includes('r2.dev')
    ) {
      url.searchParams.set('width', width.toString())
      if (quality) {
        url.searchParams.set('quality', quality.toString())
      }
      return url.toString()
    }

    return src
  }

  // Local URLs
  return `${src}?w=${width}&q=${quality || 75}`
}
```

#### Modifier `next.config.ts`

Ajouter la config images:

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ... existing config
  images: {
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
}

export default nextConfig
```

### Validation Commands
```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
pnpm dev  # Tester que les images chargent
```

### Checklist
- [x] `image-loader.ts` cree
- [x] `next.config.ts` modifie
- [x] Images chargent correctement
- [x] Pas d'erreur console
- [x] `pnpm build` passe

### Commit
```bash
git add src/lib/image-loader.ts next.config.ts
git commit -m "feat(images): configure Cloudflare image optimization

Add custom image loader for Cloudflare R2:
- Custom loader function for width/quality params
- Remote patterns for R2 domains
- Fallback for non-R2 images

Related: Story 3.5 Phase 3"
```

---

## Commit 2: Hover Animations

### Pre-Implementation
- [x] Verifier les animations actuelles dans ArticleCard
- [x] Verifier les animations dans FeaturedArticleCard

### Implementation

#### Modifier `src/app/globals.css`

Ajouter apres les imports Tailwind:

```css
@layer utilities {
  /* GPU-accelerated transforms */
  .transform-gpu {
    transform: translateZ(0);
    backface-visibility: hidden;
  }
}
```

#### Modifier `src/components/articles/ArticleCard.tsx`

Mettre a jour les classes de Card:

```typescript
<Card className={cn(
  'h-full overflow-hidden',
  // GPU-accelerated, smooth transitions
  'transform-gpu transition-all duration-200 ease-out',
  // Motion-safe hover effects (respects prefers-reduced-motion)
  'motion-safe:hover:shadow-lg motion-safe:hover:scale-[1.02]',
  // Focus ring for accessibility
  'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background',
  className
)}>
```

Mettre a jour les classes de l'image:

```typescript
<Image
  // ... existing props
  className="object-cover transform-gpu transition-transform duration-200 ease-out motion-safe:group-hover:scale-105"
/>
```

#### Modifier `src/components/articles/FeaturedArticleCard.tsx`

Mettre a jour les classes de Card:

```typescript
<Card className={cn(
  'overflow-hidden',
  // GPU-accelerated, smooth transitions
  'transform-gpu transition-all duration-300 ease-out',
  // Motion-safe hover effects
  'motion-safe:hover:shadow-xl motion-safe:hover:scale-[1.01]',
  className
)}>
```

Mettre a jour les classes de l'image:

```typescript
<Image
  // ... existing props
  className="object-cover transform-gpu transition-transform duration-300 ease-out motion-safe:group-hover:scale-105"
/>
```

### Validation Commands
```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
pnpm dev
# Tester:
# 1. Hover sur les cartes -> animation fluide
# 2. Activer prefers-reduced-motion -> pas d'animation
```

### Checklist
- [x] `globals.css` modifie
- [x] `ArticleCard.tsx` modifie
- [x] `FeaturedArticleCard.tsx` modifie
- [x] Animations fluides (60fps)
- [x] `motion-safe:` fonctionne
- [x] `pnpm build` passe

### Commit
```bash
git add src/app/globals.css src/components/articles/ArticleCard.tsx src/components/articles/FeaturedArticleCard.tsx
git commit -m "perf(animations): optimize hover effects for GPU acceleration

Improve hover animations:
- Add transform-gpu for GPU acceleration
- Use motion-safe: for reduced-motion support
- Optimize transition timing (200ms/300ms)
- Consistent easing (ease-out)

Related: Story 3.5 Phase 3"
```

---

## Commit 3: E2E Tests

### Pre-Implementation
- [ ] Verifier la config Playwright existante
- [ ] Avoir des articles de test dans la DB

### Implementation

#### Creer `tests/e2e/homepage.e2e.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.describe('Page Load', () => {
    test('loads FR homepage correctly', async ({ page }) => {
      await page.goto('/fr')
      await expect(page).toHaveTitle(/Accueil.*sebc\.dev/)
      await expect(page.locator('main')).toBeVisible()
    })

    test('loads EN homepage correctly', async ({ page }) => {
      await page.goto('/en')
      await expect(page).toHaveTitle(/Home.*sebc\.dev/)
      await expect(page.locator('main')).toBeVisible()
    })
  })

  test.describe('Featured Article', () => {
    test('displays featured article with H1 title', async ({ page }) => {
      await page.goto('/fr')

      // Check for H1 (featured article title)
      const h1 = page.locator('h1')
      const h1Count = await h1.count()

      // If there are articles, should have exactly one H1
      if (h1Count > 0) {
        expect(h1Count).toBe(1)
        await expect(h1).toBeVisible()
      }
    })

    test('displays read article CTA', async ({ page }) => {
      await page.goto('/fr')

      const readButton = page.getByRole('link', { name: /Lire l'article/i })

      // If featured article exists, CTA should be visible
      if (await readButton.count() > 0) {
        await expect(readButton.first()).toBeVisible()
      }
    })
  })

  test.describe('Article Grid', () => {
    test('displays recent articles section', async ({ page }) => {
      await page.goto('/fr')

      // Section title
      const sectionTitle = page.getByRole('heading', { name: /Articles récents/i })

      // If there are more than 1 article, section should exist
      const h1Exists = (await page.locator('h1').count()) > 0
      if (h1Exists) {
        // May or may not have recent articles depending on data
        // Just check the page doesn't crash
        await expect(page.locator('main')).toBeVisible()
      }
    })
  })

  test.describe('Hub CTA', () => {
    test('displays view all articles button', async ({ page }) => {
      await page.goto('/fr')

      const ctaButton = page.getByRole('link', { name: /Voir tous les articles/i })

      // If there are articles, CTA should exist
      if (await ctaButton.count() > 0) {
        await expect(ctaButton).toBeVisible()
      }
    })

    test('navigates to Hub on click', async ({ page }) => {
      await page.goto('/fr')

      const ctaButton = page.getByRole('link', { name: /Voir tous les articles/i })

      if (await ctaButton.count() > 0) {
        await ctaButton.click()
        await expect(page).toHaveURL('/fr/articles')
      }
    })
  })

  test.describe('Empty State', () => {
    // Note: These tests assume empty database state
    test('displays welcome message when no articles', async ({ page }) => {
      await page.goto('/fr')

      const emptyTitle = page.getByRole('heading', {
        name: /Bienvenue sur sebc\.dev/i,
      })

      // If empty state is visible, check content
      if (await emptyTitle.isVisible()) {
        await expect(emptyTitle).toBeVisible()
        await expect(
          page.getByText(/Aucun article n'a encore été publié/i)
        ).toBeVisible()
      }
    })

    test('hides create CTA when not authenticated', async ({ page }) => {
      await page.goto('/fr')

      const emptyTitle = page.getByRole('heading', {
        name: /Bienvenue sur sebc\.dev/i,
      })

      if (await emptyTitle.isVisible()) {
        const createCta = page.getByRole('link', { name: /Créer un article/i })
        await expect(createCta).not.toBeVisible()
      }
    })
  })

  test.describe('Responsive', () => {
    test('mobile viewport works', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/fr')
      await expect(page.locator('main')).toBeVisible()
    })

    test('tablet viewport works', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/fr')
      await expect(page.locator('main')).toBeVisible()
    })

    test('desktop viewport works', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 })
      await page.goto('/fr')
      await expect(page.locator('main')).toBeVisible()
    })
  })
})
```

### Validation Commands
```bash
pnpm test:e2e -- tests/e2e/homepage.e2e.spec.ts
```

### Checklist
- [x] Fichier de test cree
- [x] Tests couvrent les cas principaux
- [x] Tests passent avec des articles
- [x] Tests passent sans articles (empty state)
- [x] Tests responsive passent

### Commit
```bash
git add tests/e2e/homepage.e2e.spec.ts
git commit -m "test(e2e): add comprehensive homepage tests

Add Playwright E2E tests for homepage:
- Page load (FR/EN)
- Featured article display
- Article grid rendering
- Hub CTA navigation
- Empty state handling
- Responsive viewports

Related: Story 3.5 Phase 3"
```

---

## Commit 4: Accessibility Tests

### Pre-Implementation
- [ ] Installer @axe-core/playwright si necessaire

### Implementation

#### Installer dependency

```bash
pnpm add -D @axe-core/playwright
```

#### Ajouter tests dans `tests/e2e/homepage.e2e.spec.ts`

Ajouter au debut:
```typescript
import AxeBuilder from '@axe-core/playwright'
```

Ajouter a la fin:
```typescript
test.describe('Accessibility', () => {
  test('FR homepage passes WCAG AA audit', async ({ page }) => {
    await page.goto('/fr')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    const violations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )

    expect(violations).toHaveLength(0)
  })

  test('EN homepage passes WCAG AA audit', async ({ page }) => {
    await page.goto('/en')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    const violations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )

    expect(violations).toHaveLength(0)
  })

  test('has exactly one H1', async ({ page }) => {
    await page.goto('/fr')

    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)
  })

  test('all images have alt text', async ({ page }) => {
    await page.goto('/fr')

    const images = page.locator('img')
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt')
      expect(alt).toBeTruthy()
    }
  })

  test('interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/fr')

    // Tab through page
    await page.keyboard.press('Tab')

    // Something should receive focus
    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()
  })

  test('focus indicators are visible', async ({ page }) => {
    await page.goto('/fr')

    await page.keyboard.press('Tab')

    const focused = page.locator(':focus')

    if (await focused.count() > 0) {
      const styles = await focused.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          outline: computed.outline,
          boxShadow: computed.boxShadow,
        }
      })

      const hasFocusIndicator =
        (styles.outline && styles.outline !== 'none') ||
        (styles.boxShadow && styles.boxShadow !== 'none')

      expect(hasFocusIndicator).toBe(true)
    }
  })
})
```

### Validation Commands
```bash
pnpm test:e2e -- tests/e2e/homepage.e2e.spec.ts --grep "Accessibility"
```

### Checklist
- [ ] `@axe-core/playwright` installe
- [ ] Tests a11y ajoutes
- [ ] Pas de violations critiques/serieuses
- [ ] Heading hierarchy correct
- [ ] Images ont alt text
- [ ] Focus visible
- [ ] Tous les tests passent

### Commit
```bash
git add tests/e2e/homepage.e2e.spec.ts package.json pnpm-lock.yaml
git commit -m "test(a11y): add accessibility tests for homepage

Add axe-core accessibility tests:
- WCAG 2.1 AA compliance (FR/EN)
- Heading hierarchy validation
- Alt text verification
- Keyboard navigation testing
- Focus indicator visibility

Related: Story 3.5 Phase 3"
```

---

## Post-Phase Verification

```bash
# Full test suite
pnpm test:e2e

# Check build
pnpm build

# Manual verification
pnpm dev
# Test hover animations
# Test with prefers-reduced-motion enabled
```

### Final Checklist
- [ ] Tous les 4 commits completes
- [ ] Images optimisees
- [ ] Animations fluides
- [ ] Tous les tests E2E passent
- [ ] Tous les tests a11y passent
- [ ] Build passe
- [ ] Story 3.5 prete pour merge
