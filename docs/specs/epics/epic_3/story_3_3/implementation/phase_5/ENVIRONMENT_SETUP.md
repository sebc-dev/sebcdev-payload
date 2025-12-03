# Environment Setup: Phase 5 - Accessibility & E2E Validation

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 5 of 5 (Final Phase)

---

## Prerequisites

### Required Completions

Before starting Phase 5, ensure the following are complete:

- [x] **Phase 1**: shadcn/ui Components installed (Sheet, DropdownMenu)
- [x] **Phase 2**: Header & Desktop Navigation created
- [x] **Phase 3**: Footer Component created
- [x] **Phase 4**: MobileMenu & LanguageSwitcher created

### Verify Phase 4 Completion

```bash
# Check that all layout components exist
ls -la src/components/layout/

# Expected files:
# - Footer.tsx
# - Header.tsx
# - index.ts
# - LanguageSwitcher.tsx
# - Logo.tsx
# - MobileMenu.tsx
# - Navigation.tsx
```

---

## System Requirements

### Development Environment

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18.17.0 | 20.x LTS |
| pnpm | 8.x | 9.x |
| RAM | 4GB | 8GB+ |
| Disk Space | 2GB | 5GB+ |

### Browser Requirements (for E2E Tests)

| Browser | Version | Purpose |
|---------|---------|---------|
| Chromium | Latest (auto-installed) | Primary E2E testing |
| Chrome DevTools | Latest | Manual accessibility testing |

---

## Initial Setup

### 1. Repository State

```bash
# Ensure you're on the correct branch
git checkout epic-3-story-3.3-planning

# Pull latest changes
git pull origin epic-3-story-3.3-planning

# Verify clean working directory
git status
```

### 2. Install Dependencies

```bash
# Install all dependencies
pnpm install

# Verify Playwright browsers are installed
npx playwright install chromium

# If browsers not installed, run:
npx playwright install
```

### 3. Verify Build

```bash
# Run build to ensure no existing errors
pnpm build

# Expected: Build succeeds with no errors
```

### 4. Verify Existing Tests

```bash
# Run existing E2E tests to ensure baseline is working
pnpm test:e2e

# Expected: All existing tests pass
```

---

## Dependencies

### Existing Dependencies (No New Installs)

Phase 5 uses only existing project dependencies:

| Package | Version | Purpose |
|---------|---------|---------|
| `@playwright/test` | ^1.x | E2E testing framework |
| `@axe-core/playwright` | ^4.x | Accessibility testing |
| `next-intl` | ^3.x | i18n (translations) |
| `tailwindcss` | ^3.x | Styling (sr-only utilities) |

### Verify axe-core Installation

```bash
# Check if @axe-core/playwright is installed
pnpm list @axe-core/playwright

# If not installed (should already be):
pnpm add -D @axe-core/playwright
```

---

## Project Structure

### Files to Create

```
src/components/layout/
└── SkipLink.tsx          # New component

tests/e2e/
└── navigation.e2e.spec.ts # New test file
```

### Files to Modify

```
messages/
├── fr.json               # Add accessibility namespace
└── en.json               # Add accessibility namespace

src/components/layout/
└── index.ts              # Add SkipLink export

src/app/[locale]/(frontend)/
└── layout.tsx            # Add SkipLink, id on main
```

---

## Development Server

### Start Development Server

```bash
# Start the development server
pnpm dev

# Server runs at http://localhost:3000
```

### Test URLs for Manual Validation

| URL | Purpose |
|-----|---------|
| `http://localhost:3000/fr` | French homepage |
| `http://localhost:3000/en` | English homepage |
| `http://localhost:3000/fr/articles` | French articles page |
| `http://localhost:3000/en/articles` | English articles page |

---

## E2E Testing Setup

### Playwright Configuration

The project uses Playwright for E2E testing. Configuration is in `playwright.config.ts`.

```bash
# Run all E2E tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e -- tests/e2e/navigation.e2e.spec.ts

# Run tests with UI mode (for debugging)
npx playwright test --ui

# Run tests with headed browser (visible)
npx playwright test --headed
```

### Debugging E2E Tests

```bash
# Run with Playwright Inspector
npx playwright test --debug

# Run specific test with debug
npx playwright test --debug -g "skip link"

# Generate test code with codegen
npx playwright codegen http://localhost:3000/fr
```

### Test Reporter

```bash
# View HTML report after test run
npx playwright show-report
```

---

## Accessibility Tools

### Browser DevTools

1. **Chrome Accessibility Panel**:
   - Open DevTools (F12)
   - Elements tab → Accessibility panel
   - View ARIA properties and computed accessibility tree

2. **Lighthouse**:
   - Open DevTools (F12)
   - Lighthouse tab
   - Run accessibility audit

### axe DevTools Extension

Install the [axe DevTools browser extension](https://www.deque.com/axe/browser-extensions/) for additional manual testing.

### Screen Reader Testing (Optional)

For thorough accessibility validation:

| OS | Screen Reader |
|----|---------------|
| macOS | VoiceOver (built-in, Cmd+F5) |
| Windows | NVDA (free), JAWS |
| Linux | Orca (GNOME) |

---

## Tailwind CSS Utilities

### sr-only and focus:not-sr-only

Phase 5 uses these Tailwind utilities for the skip link:

```css
/* sr-only - Screen reader only (visually hidden) */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* focus:not-sr-only - Remove sr-only on focus */
.focus\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

These are built into Tailwind - no additional configuration needed.

---

## i18n Setup

### Message Files Structure

```
messages/
├── fr.json    # French translations
└── en.json    # English translations
```

### Adding New Keys

When adding the `accessibility` namespace:

```json
// messages/fr.json
{
  "existing": { ... },
  "accessibility": {
    "skipToContent": "Aller au contenu principal",
    "mainNavigation": "Navigation principale",
    "languageSelection": "Sélection de la langue"
  }
}
```

### Using Translations

```tsx
import { useTranslations } from 'next-intl'

export function SkipLink() {
  const t = useTranslations('accessibility')
  return <a href="#main-content">{t('skipToContent')}</a>
}
```

---

## Quality Gate Commands

### Pre-Commit Validation

```bash
# Run these before each commit
pnpm build       # Build succeeds
pnpm lint        # Linting passes
```

### Full Test Suite

```bash
# Run complete test suite
pnpm test

# Run only E2E tests
pnpm test:e2e

# Run only unit tests
pnpm test:unit

# Run only integration tests
pnpm test:int
```

### Specific Phase 5 Tests

```bash
# Run navigation E2E tests only
pnpm test:e2e -- tests/e2e/navigation.e2e.spec.ts

# Run with verbose output
pnpm test:e2e -- tests/e2e/navigation.e2e.spec.ts --reporter=list
```

---

## Troubleshooting

### Playwright Browser Issues

```bash
# Reinstall browsers
npx playwright install --force

# Install system dependencies (Linux)
npx playwright install-deps
```

### Port 3000 In Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 pnpm dev
```

### Build Failures

```bash
# Clear build cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules
pnpm install

# Generate types
pnpm generate:types
```

### Test Timeouts

```bash
# Increase timeout for slow systems
npx playwright test --timeout=60000

# Or modify playwright.config.ts:
# timeout: 60000
```

---

## Environment Variables

No new environment variables required for Phase 5.

Existing variables (for reference):

| Variable | Purpose |
|----------|---------|
| `PAYLOAD_SECRET` | Payload CMS secret key |
| `CLOUDFLARE_ENV` | Deployment environment |

---

## IDE Setup

### VS Code Extensions

Recommended extensions for this phase:

| Extension | Purpose |
|-----------|---------|
| axe Accessibility Linter | Inline accessibility warnings |
| Playwright Test for VS Code | Test runner integration |
| Tailwind CSS IntelliSense | Utility class autocomplete |
| ESLint | Linting integration |

### VS Code Settings

```json
// .vscode/settings.json (if not present)
{
  "editor.formatOnSave": true,
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

---

## Ready to Start

### Verification Checklist

Before starting implementation:

- [ ] On correct branch (`epic-3-story-3.3-planning`)
- [ ] `pnpm install` completed
- [ ] `pnpm build` succeeds
- [ ] Playwright browsers installed
- [ ] Existing E2E tests pass
- [ ] Dev server runs without errors

### First Step

Once environment is verified, proceed to:

**[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** - Commit 1: Add i18n Keys

---

**Setup Guide Created**: 2025-12-03
**Last Updated**: 2025-12-03
