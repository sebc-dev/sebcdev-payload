# Phase 4: Environment Setup

**Phase**: Accessibility Validation & Cleanup
**Prerequisites**: Phases 1-3 completed

---

## Pre-Flight Checklist

Before starting Phase 4, verify the following:

### Phase Dependencies

- [x] **Phase 1**: Tailwind CSS 4 Foundation
  - Tailwind installed and working
  - PostCSS configured
  - globals.css with Tailwind imports

- [x] **Phase 2**: shadcn/ui & Utility Functions
  - components.json configured
  - cn() utility available
  - Button component installed

- [x] **Phase 3**: Design Tokens & Visual Migration
  - CSS variables defined
  - Fonts configured (Nunito Sans, JetBrains Mono)
  - Homepage migrated to Tailwind
  - styles.css deleted

### Verification Commands

```bash
# Verify Phases 1-3 are complete
pnpm build

# Check that homepage loads with correct styles
pnpm dev
# Visit http://localhost:3000/fr

# Verify no missing files
ls -la src/app/globals.css
ls -la src/lib/utils.ts
ls -la components.json
```

---

## Required Dependencies

### New Dependencies for Phase 4

```bash
# Install axe-core for accessibility testing
pnpm add -D @axe-core/playwright
```

### Verify Existing Dependencies

```bash
# Check Playwright is installed
pnpm exec playwright --version

# Check existing test dependencies
cat package.json | grep -A5 '"devDependencies"'
```

### Expected devDependencies

```json
{
  "devDependencies": {
    "@axe-core/playwright": "^4.x",
    "@playwright/test": "^1.56.x",
    "knip": "^5.x"
  }
}
```

---

## Environment Verification

### 1. Development Server

```bash
# Clear cache and start fresh
rm -rf .next .open-next
pnpm dev
```

**Expected Output**:
- Server starts on http://localhost:3000
- No CSS errors in console
- Homepage displays with anthracite background

### 2. Build Verification

```bash
pnpm build
```

**Expected Output**:
- Build completes successfully
- No TypeScript errors
- No CSS compilation errors

### 3. Existing Tests

```bash
# Run existing E2E tests to verify baseline
pnpm test:e2e
```

**Expected Output**:
- All existing tests pass
- No timeout errors
- Playwright browser launches correctly

---

## Playwright Configuration

### Verify Playwright Setup

```bash
# Check Playwright config exists
cat playwright.config.ts
```

### Required Configuration

Ensure these settings in `playwright.config.ts`:

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
# Ensure browsers are installed
pnpm exec playwright install chromium
```

---

## axe-core Setup

### Verify Installation

After installing `@axe-core/playwright`:

```bash
# Check it's in node_modules
ls node_modules/@axe-core/playwright
```

### Import Pattern

In your test files, use:

```typescript
import AxeBuilder from '@axe-core/playwright'

// In a test
const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa'])
  .analyze()
```

### axe-core Tags Reference

| Tag | Description |
|-----|-------------|
| `wcag2a` | WCAG 2.0 Level A |
| `wcag2aa` | WCAG 2.0 Level AA |
| `wcag21a` | WCAG 2.1 Level A |
| `wcag21aa` | WCAG 2.1 Level AA |
| `best-practice` | Best practices (not WCAG) |

---

## Knip Configuration

### Verify Knip Setup

```bash
# Check Knip config
cat knip.ts
```

### Run Knip Check

```bash
pnpm knip
```

**Expected Output**:
- No unused exports
- No unused dependencies
- No unused files

---

## Directory Structure Verification

### Expected Structure After Phase 3

```
src/
├── app/
│   ├── globals.css              # Tailwind + design tokens
│   └── [locale]/
│       ├── layout.tsx           # Fonts configured
│       └── (frontend)/
│           ├── layout.tsx       # No styles.css import
│           └── page.tsx         # Tailwind classes
├── components/
│   └── ui/
│       └── button.tsx           # shadcn Button
└── lib/
    └── utils.ts                 # cn() utility

tests/
└── e2e/
    └── frontend.e2e.spec.ts     # Existing tests
```

### Files to Verify Don't Exist

```bash
# These should NOT exist after Phase 3
ls src/app/[locale]/(frontend)/styles.css 2>/dev/null && echo "ERROR: styles.css still exists!"
```

---

## IDE Setup

### VS Code Extensions (Recommended)

- **Tailwind CSS IntelliSense**: Autocomplete for Tailwind classes
- **axe Accessibility Linter**: Real-time a11y feedback
- **Playwright Test for VSCode**: Test runner integration

### VS Code Settings

```json
{
  "editor.quickSuggestions": {
    "strings": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

---

## Quick Start Commands

```bash
# 1. Install Phase 4 dependencies
pnpm add -D @axe-core/playwright

# 2. Verify everything works
pnpm build
pnpm test:e2e

# 3. Start development
pnpm dev

# 4. You're ready to implement Phase 4!
```

---

## Troubleshooting

### Common Issues

#### axe-core Import Error

```
Error: Cannot find module '@axe-core/playwright'
```

**Solution**:
```bash
pnpm add -D @axe-core/playwright
```

#### Playwright Browser Missing

```
Error: browserType.launch: Executable doesn't exist
```

**Solution**:
```bash
pnpm exec playwright install chromium
```

#### Tests Timeout

```
Error: Test timeout of 30000ms exceeded
```

**Solution**:
- Ensure dev server is running
- Check `webServer` config in playwright.config.ts
- Increase timeout in specific tests if needed

#### styles.css Not Found Error

```
Module not found: Can't resolve 'styles.css'
```

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next .open-next
pnpm dev
```

---

## Environment Variables

No new environment variables required for Phase 4.

### Existing Variables (Reference)

```bash
# .env (should already exist)
PAYLOAD_SECRET=your-secret-here
```

---

## Ready Checklist

Before starting implementation:

- [ ] Phase 1-3 complete and verified
- [ ] `@axe-core/playwright` installed
- [ ] Playwright browsers installed
- [ ] `pnpm build` succeeds
- [ ] `pnpm test:e2e` passes (existing tests)
- [ ] `pnpm dev` starts without errors
- [ ] Homepage displays correct design system

**You are ready to start Phase 4 implementation!**

---

**Created**: 2025-12-02
**Last Updated**: 2025-12-02
