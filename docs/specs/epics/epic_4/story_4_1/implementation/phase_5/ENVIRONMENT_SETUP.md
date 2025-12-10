# Phase 5 - Environment Setup

**Phase**: SEO, Metadata & E2E Tests

This document covers the environment configuration needed for Phase 5 implementation.

---

## Prerequisites

### Required Software

| Software | Version | Check Command |
|----------|---------|---------------|
| Node.js | >= 20.x | `node --version` |
| pnpm | >= 9.x | `pnpm --version` |
| Git | >= 2.x | `git --version` |

### Required Previous Phases

Phase 5 depends on all previous phases being complete:

- [ ] **Phase 1**: Route & Layout - Article page route exists
- [ ] **Phase 2**: Lexical Rendering - RichText component works
- [ ] **Phase 3**: Code Highlighting - CodeBlock renders
- [ ] **Phase 4**: Images & Styling - ImageBlock and ArticleHero work

### Verify Previous Phases

```bash
# Check article page exists
ls src/app/[locale]/(frontend)/articles/[slug]/page.tsx

# Check RichText components exist
ls src/components/richtext/

# Check article components exist
ls src/components/articles/

# Start dev server and navigate to article
pnpm dev
# Open: http://localhost:3000/fr/articles/[any-slug]
```

---

## Environment Variables

### Required Variables

Phase 5 requires one new environment variable for SEO:

```bash
# .env.local (or .env)

# Site URL for SEO (canonical URLs, Open Graph)
NEXT_PUBLIC_SITE_URL=https://sebcdev.com

# For local development, use:
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Verify Environment

```bash
# Check environment variables are set
grep NEXT_PUBLIC_SITE_URL .env.local

# If not set, add it:
echo "NEXT_PUBLIC_SITE_URL=http://localhost:3000" >> .env.local
```

---

## Dependencies

### No New Dependencies Required

Phase 5 uses existing dependencies:

| Package | Already Installed | Purpose |
|---------|------------------|---------|
| `next` | Yes | Metadata API |
| `@playwright/test` | Yes | E2E testing |
| `next-intl` | Yes | Localization |

### Verify Dependencies

```bash
# Check Playwright is installed
pnpm exec playwright --version

# If not installed:
pnpm add -D @playwright/test
pnpm exec playwright install chromium
```

---

## Project Structure

### Directories to Create

```bash
# Create SEO utilities directory
mkdir -p src/lib/seo
```

### Expected File Structure After Phase 5

```
src/
├── lib/
│   └── seo/
│       ├── types.ts              # SEO type definitions
│       ├── article-metadata.ts   # Metadata generation
│       ├── json-ld.ts            # JSON-LD generation
│       └── index.ts              # Module exports
├── app/
│   └── [locale]/
│       └── (frontend)/
│           └── articles/
│               └── [slug]/
│                   └── page.tsx  # Updated with generateMetadata
tests/
├── e2e/
│   ├── article-page.e2e.spec.ts  # Article E2E tests
│   └── article-404.e2e.spec.ts   # 404 E2E tests
docs/
└── specs/
    └── epics/
        └── epic_4/
            └── story_4_1/
                └── IMPLEMENTATION_NOTES.md  # Story completion
```

---

## Database Setup

### Seed Data Required

E2E tests require seeded article data:

```bash
# Clean and seed database
pnpm seed --clean

# Verify seed data
# Should create:
# - 5 Categories
# - 10 Tags
# - 7 Articles (with images and localized content)
```

### Test Article Reference

The E2E tests use the following seed article:

```typescript
const TEST_ARTICLE = {
  slug: 'nextjs-cloudflare-workers',
  fr: {
    title: 'Déployer une Application Next.js sur Cloudflare Workers',
  },
  en: {
    title: 'Deploy a Next.js Application on Cloudflare Workers',
  },
}
```

Ensure this article exists in the seed script (`scripts/seed.ts`).

---

## Development Server

### Start Development Server

```bash
# Standard start
pnpm dev

# Clean start (removes .next cache)
pnpm devsafe
```

### Verify Article Page

1. Navigate to: `http://localhost:3000/fr/articles/nextjs-cloudflare-workers`
2. Verify:
   - Article title renders
   - Content displays correctly
   - No console errors

---

## Testing Setup

### Playwright Configuration

Verify Playwright is configured correctly in `playwright.config.ts`:

```typescript
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

### Install Playwright Browsers

```bash
# Install browsers if not already installed
pnpm exec playwright install chromium
```

### Run Test Suite

```bash
# Run all E2E tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e tests/e2e/article-page.e2e.spec.ts

# Run tests with UI
pnpm exec playwright test --ui

# View test report
pnpm exec playwright show-report
```

---

## SEO Validation Tools

### Online Validators

Bookmark these tools for manual validation:

| Tool | URL | Purpose |
|------|-----|---------|
| Schema.org Validator | https://validator.schema.org/ | Validate JSON-LD |
| Google Rich Results | https://search.google.com/test/rich-results | Test rich snippets |
| Facebook Debugger | https://developers.facebook.com/tools/debug/ | Test Open Graph |
| Twitter Card Validator | https://cards-dev.twitter.com/validator | Test Twitter Cards |

### Local Validation

```bash
# View page source to check meta tags
# In browser: Ctrl+U (Windows/Linux) or Cmd+Option+U (Mac)

# Or use curl:
curl -s http://localhost:3000/fr/articles/nextjs-cloudflare-workers | grep -E "<(title|meta|link|script)"
```

---

## Lighthouse Setup

### Run Lighthouse Audit

```bash
# Using Chrome DevTools:
# 1. Open article page in Chrome
# 2. Open DevTools (F12)
# 3. Go to Lighthouse tab
# 4. Select categories: Performance, Accessibility, Best Practices, SEO
# 5. Click "Analyze page load"

# Using CLI (optional):
npm install -g lighthouse
lighthouse http://localhost:3000/fr/articles/nextjs-cloudflare-workers --output=html --output-path=./lighthouse-report.html
```

### Expected Scores

| Metric | Target |
|--------|--------|
| Performance | >= 90 |
| Accessibility | 100 |
| Best Practices | >= 90 |
| SEO | >= 90 |

---

## TypeScript Configuration

### Verify TypeScript Setup

```bash
# Check types compile
pnpm exec tsc --noEmit

# No errors should appear
```

### Path Aliases

Ensure `tsconfig.json` has the correct path aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@payload-config": ["./src/payload.config.ts"]
    }
  }
}
```

---

## IDE Setup

### Recommended VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- Playwright Test for VS Code

### VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## Troubleshooting

### Common Issues

#### 1. Environment Variable Not Loading

```bash
# Ensure .env.local exists and has NEXT_PUBLIC_SITE_URL
cat .env.local | grep NEXT_PUBLIC_SITE_URL

# Restart dev server after changes
pnpm devsafe
```

#### 2. E2E Tests Failing - No Seed Data

```bash
# Seed the database
pnpm seed --clean

# Verify articles exist
pnpm dev
# Navigate to /fr and check for articles
```

#### 3. Playwright Browsers Not Installed

```bash
# Install browsers
pnpm exec playwright install

# Or just chromium
pnpm exec playwright install chromium
```

#### 4. Type Errors After Adding SEO Files

```bash
# Ensure index.ts exports are correct
cat src/lib/seo/index.ts

# Should export:
# export * from './types'
# export * from './article-metadata'
# export * from './json-ld'
```

#### 5. generateMetadata Not Working

```bash
# Check function is exported from page
grep "export async function generateMetadata" src/app/[locale]/(frontend)/articles/[slug]/page.tsx

# Should find the export
```

---

## Quick Start Checklist

Before starting implementation:

- [ ] Node.js >= 20.x installed
- [ ] pnpm >= 9.x installed
- [ ] Previous phases (1-4) complete
- [ ] `NEXT_PUBLIC_SITE_URL` set in `.env.local`
- [ ] Database seeded: `pnpm seed --clean`
- [ ] Playwright installed: `pnpm exec playwright install chromium`
- [ ] Dev server starts: `pnpm dev`
- [ ] Article page renders: `/fr/articles/nextjs-cloudflare-workers`

---

**Setup Created**: 2025-12-10
**Last Updated**: 2025-12-10
