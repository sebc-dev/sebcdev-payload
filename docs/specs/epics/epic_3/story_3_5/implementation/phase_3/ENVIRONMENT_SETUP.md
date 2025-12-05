# Phase 3: Environment Setup - Polish & Tests

**Story**: 3.5 - Homepage Implementation
**Phase**: 3 of 3

---

## Prerequisites

### Previous Phases

- [ ] Phase 1 completee et mergee
- [ ] Phase 2 completee et mergee
- [ ] Homepage fonctionnelle

### Verification

```bash
# Build passes
pnpm build

# Homepage loads
pnpm dev
# Visit localhost:3000/fr
```

---

## Tools Installation

### axe-playwright

Pour les tests d'accessibilite:

```bash
pnpm add -D @axe-core/playwright
```

### Verification

```bash
pnpm list @axe-core/playwright
# Expected: @axe-core/playwright@4.x.x
```

---

## Playwright Configuration

### Verify Playwright Config

Le fichier `playwright.config.ts` devrait deja etre configure. Verifier:

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Run Playwright Tests

```bash
# All E2E tests
pnpm test:e2e

# Specific file
pnpm test:e2e -- tests/e2e/homepage.e2e.spec.ts

# With UI
pnpm exec playwright test --ui

# Headed mode
pnpm exec playwright test --headed
```

---

## Test Data Requirements

### Articles for Testing

Pour tester la homepage avec des articles:

1. **Option A: Manual**
   - Go to `/admin`
   - Create 7+ articles with status "published"
   - Include: title, slug, excerpt, category, tags, complexity, readingTime, publishedAt

2. **Option B: Seed Script**
   ```bash
   # If a seed script exists
   pnpm seed:dev
   ```

### Minimum Test Data

| Field | Value |
|-------|-------|
| title | "Test Article 1" (localized) |
| slug | "test-article-1" |
| excerpt | "This is a test excerpt" |
| category | Any existing category |
| complexity | "beginner" |
| readingTime | 5 |
| publishedAt | Recent date |
| _status | "published" |

---

## Reduced Motion Testing

### macOS

1. System Preferences > Accessibility > Display
2. Check "Reduce motion"

### Windows

1. Settings > Ease of Access > Display
2. Turn on "Show animations in Windows"

### Browser DevTools

Chrome:
1. DevTools > More tools > Rendering
2. "Emulate CSS media feature prefers-reduced-motion: reduce"

---

## Image Testing

### Test Images Load

1. Create an article with a cover image
2. Visit the homepage
3. Verify image displays correctly
4. Check Network tab for image requests
5. Verify no 404 errors

### R2 URL Format

If using Cloudflare R2, URLs should be:
- `https://your-account.r2.cloudflarestorage.com/bucket/image.jpg`
- Or custom domain: `https://cdn.sebc.dev/image.jpg`

---

## Directory Structure

### After Phase 3

```
tests/
└── e2e/
    └── homepage.e2e.spec.ts   # NEW/MODIFIED
src/
├── lib/
│   └── image-loader.ts        # NEW
├── app/
│   └── globals.css            # MODIFIED
└── components/
    └── articles/
        ├── ArticleCard.tsx        # MODIFIED
        └── FeaturedArticleCard.tsx # MODIFIED
```

---

## Debugging

### E2E Test Failures

```bash
# Run with debug mode
pnpm exec playwright test --debug

# Show browser
pnpm exec playwright test --headed

# Generate trace
pnpm exec playwright test --trace on
```

### Accessibility Violations

```typescript
// Log violations for debugging
const results = await new AxeBuilder({ page }).analyze()
console.log(JSON.stringify(results.violations, null, 2))
```

### Animation Issues

```bash
# Check animation performance
# Chrome DevTools > Performance > Record
# Look for frame drops during hover
```

---

## CI/CD Considerations

### GitHub Actions

Les tests E2E sont executes dans le workflow CI. Verifier:

1. `pnpm test:e2e` est dans le job
2. Playwright browsers sont installes
3. Timeout suffisant pour les tests

### Environment Variables

```yaml
# .github/workflows/quality-gate.yml
env:
  CI: true
  PLAYWRIGHT_BROWSERS_PATH: 0
```

---

## Troubleshooting

### Issue: "No tests found"

```bash
# Verify test file location
ls tests/e2e/homepage.e2e.spec.ts

# Verify pattern in playwright.config.ts
testDir: './tests/e2e',
```

### Issue: "axe-core not found"

```bash
# Reinstall
pnpm add -D @axe-core/playwright

# Clear cache
rm -rf node_modules/.cache
```

### Issue: "Image loader error"

```bash
# Check the loader file exists
ls src/lib/image-loader.ts

# Verify next.config.ts references it correctly
loaderFile: './src/lib/image-loader.ts',
```

### Issue: "Animations not GPU-accelerated"

```typescript
// Verify classes are correct
'transform-gpu transition-all duration-200 ease-out'

// Check for conflicting styles
'transform' // Should not override transform-gpu
```

---

## Pre-Implementation Checklist

- [ ] Phase 1 & 2 completees
- [ ] `pnpm build` passe
- [ ] `pnpm test:e2e` fonctionne (tests existants)
- [ ] `@axe-core/playwright` installe ou pret a installer
- [ ] Articles de test disponibles
- [ ] Comprends comment tester prefers-reduced-motion

**Ready to implement Phase 3!**
