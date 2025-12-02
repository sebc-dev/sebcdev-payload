# Phase 1 - Checklist per Commit

This document provides a detailed checklist for each atomic commit of Phase 1.

---

## 📋 Commit 1: Install next-intl Package

**Files**: `package.json`, `pnpm-lock.yaml`
**Estimated Duration**: 10-15 minutes

### Implementation Tasks

- [ ] Run `pnpm add next-intl@^4` to install the package
- [ ] Verify installation completes without errors
- [ ] Check that version is 4.x.x in package.json
- [ ] Verify no peer dependency warnings

### Validation

```bash
# Install the package
pnpm add next-intl@^4

# Verify installation
pnpm list next-intl

# Check package.json
grep -A1 '"next-intl"' package.json
```

**Expected Result**:
```
next-intl@4.x.x
```

### Review Checklist

#### Package Configuration

- [ ] `next-intl` is in `dependencies` (not `devDependencies`)
- [ ] Version constraint is `^4` (allows minor/patch updates)
- [ ] No conflicting versions of related packages

#### Security

- [ ] Package is from official npm registry
- [ ] No additional unexpected packages added

#### Code Quality

- [ ] package.json is valid JSON
- [ ] Lockfile is updated and committed

### Commit Message

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore(deps): add next-intl v4 for i18n routing

- Add next-intl@^4 to dependencies
- Package provides App Router i18n support
- Required for FR/EN locale routing in Story 3.1

Part of Phase 1 - Commit 1/3"
```

---

## 📋 Commit 2: Create i18n Configuration Files

**Files**: `src/i18n/config.ts`, `src/i18n/routing.ts`, `src/i18n/request.ts`
**Estimated Duration**: 30-45 minutes

### Implementation Tasks

- [ ] Create `src/i18n/` directory
- [ ] Create `src/i18n/config.ts` with locale definitions
- [ ] Create `src/i18n/routing.ts` with routing configuration
- [ ] Create `src/i18n/request.ts` with server-side request config
- [ ] Run TypeScript check to verify no errors
- [ ] Run linter to verify code style

### File Contents

#### src/i18n/config.ts

```typescript
/**
 * i18n Configuration
 *
 * Defines the supported locales and default locale for the application.
 * This configuration is shared across routing, middleware, and server components.
 */

export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

/**
 * Check if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
```

#### src/i18n/routing.ts

```typescript
import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './config';

/**
 * i18n Routing Configuration
 *
 * Configures how locales are handled in URLs:
 * - localePrefix: 'always' ensures /fr/* and /en/* URLs
 * - This enables SEO-friendly localized URLs
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

// Re-export for convenience
export type { Locale } from './config';
```

#### src/i18n/request.ts

```typescript
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { isValidLocale } from './config';

/**
 * Server-side i18n Request Configuration
 *
 * This is called for every request to determine the locale
 * and load the appropriate messages.
 *
 * @see https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request (set by middleware)
  let locale = await requestLocale;

  // Validate and fallback to default if invalid
  if (!locale || !isValidLocale(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

### Validation

```bash
# Create directory
mkdir -p src/i18n

# After creating files, validate
pnpm exec tsc --noEmit
pnpm lint
```

**Expected Result**: No errors from TypeScript or ESLint

### Review Checklist

#### Configuration Accuracy

- [ ] Locales array matches Payload CMS: `['fr', 'en']`
- [ ] Default locale is `'fr'` (French)
- [ ] `localePrefix: 'always'` is set (not 'as-needed')
- [ ] `getRequestConfig` uses async pattern (Next.js 15 compatible)

#### TypeScript Quality

- [ ] `Locale` type is properly exported
- [ ] `locales` uses `as const` for literal types
- [ ] No `any` types (except in type guard)
- [ ] Import paths are correct

#### Code Style

- [ ] JSDoc comments explain purpose
- [ ] Consistent formatting (Prettier)
- [ ] No unused imports
- [ ] No console.log statements

#### Architecture

- [ ] Files are in `src/i18n/` directory
- [ ] Separation of concerns (config, routing, request)
- [ ] Messages import path is correct (`../../messages/`)

### Commit Message

```bash
git add src/i18n/
git commit -m "feat(i18n): add next-intl configuration files

- Add src/i18n/config.ts with locale definitions (fr/en)
- Add src/i18n/routing.ts with defineRouting() setup
- Add src/i18n/request.ts for server-side request config
- Configure localePrefix: 'always' for SEO-friendly URLs
- Default locale set to French ('fr')

Part of Phase 1 - Commit 2/3"
```

---

## 📋 Commit 3: Create Message Files and TypeScript Types

**Files**: `messages/fr.json`, `messages/en.json`, `global.d.ts`
**Estimated Duration**: 20-30 minutes

### Implementation Tasks

- [ ] Create `messages/` directory in project root
- [ ] Create `messages/fr.json` with French translations
- [ ] Create `messages/en.json` with English translations
- [ ] Create/update `global.d.ts` with type augmentation
- [ ] Run TypeScript check to verify type inference works
- [ ] Run linter to verify JSON is valid

### File Contents

#### messages/fr.json

```json
{
  "common": {
    "loading": "Chargement...",
    "error": "Une erreur est survenue",
    "retry": "Réessayer",
    "back": "Retour",
    "close": "Fermer"
  },
  "navigation": {
    "home": "Accueil",
    "blog": "Blog",
    "about": "À propos",
    "contact": "Contact",
    "search": "Rechercher"
  },
  "metadata": {
    "title": "sebc.dev - Blog technique",
    "description": "Blog technique sur le développement web moderne, Next.js, et Cloudflare"
  },
  "accessibility": {
    "skipToContent": "Aller au contenu principal",
    "menu": "Menu",
    "languageSelector": "Sélectionner la langue"
  }
}
```

#### messages/en.json

```json
{
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "retry": "Retry",
    "back": "Back",
    "close": "Close"
  },
  "navigation": {
    "home": "Home",
    "blog": "Blog",
    "about": "About",
    "contact": "Contact",
    "search": "Search"
  },
  "metadata": {
    "title": "sebc.dev - Technical Blog",
    "description": "Technical blog about modern web development, Next.js, and Cloudflare"
  },
  "accessibility": {
    "skipToContent": "Skip to main content",
    "menu": "Menu",
    "languageSelector": "Select language"
  }
}
```

#### global.d.ts

```typescript
import fr from './messages/fr.json';

type Messages = typeof fr;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntlMessages extends Messages {}
}
```

### Validation

```bash
# Create directory
mkdir -p messages

# After creating files, validate
pnpm exec tsc --noEmit
pnpm lint

# Optionally validate JSON
node -e "require('./messages/fr.json')"
node -e "require('./messages/en.json')"
```

**Expected Result**:
- No TypeScript errors
- No linting errors
- JSON files parse successfully

### Review Checklist

#### Message Content

- [ ] Both JSON files have identical structure
- [ ] No trailing commas in JSON
- [ ] French translations are correct (no English mixed in)
- [ ] English translations are correct
- [ ] Keys are descriptive and consistent

#### Message Structure

- [ ] Nested organization (common, navigation, metadata, accessibility)
- [ ] Messages are minimal (only essential labels)
- [ ] Accessibility messages included (WCAG compliance)

#### TypeScript Types

- [ ] `global.d.ts` imports French file as source of truth
- [ ] `IntlMessages` interface extends `Messages` type
- [ ] Type augmentation follows next-intl pattern
- [ ] ESLint disable comment is appropriate

#### Code Quality

- [ ] JSON is valid (parseable by Node.js)
- [ ] No unused messages
- [ ] No placeholder text (`TODO`, `FIXME`, etc.)
- [ ] Consistent capitalization in messages

### Commit Message

```bash
git add messages/ global.d.ts
git commit -m "feat(i18n): add message files and TypeScript types

- Add messages/fr.json with French translations
- Add messages/en.json with English translations
- Add global.d.ts for type-safe message access
- Include common, navigation, metadata, accessibility keys
- Minimal content for structure validation

Part of Phase 1 - Commit 3/3"
```

---

## ✅ Final Phase Validation

After all commits:

### Complete Phase Checklist

- [ ] All 3 commits completed
- [ ] TypeScript compiles without errors
- [ ] Linter passes without errors
- [ ] All files in correct locations
- [ ] No placeholder text remaining
- [ ] VALIDATION_CHECKLIST.md completed

### Final Validation Commands

```bash
# Install dependencies (ensure clean state)
pnpm install

# TypeScript check
pnpm exec tsc --noEmit

# Lint check
pnpm lint

# Verify file structure
ls -la src/i18n/
ls -la messages/
cat global.d.ts

# Verify imports work
node -e "console.log('FR:', Object.keys(require('./messages/fr.json')))"
node -e "console.log('EN:', Object.keys(require('./messages/en.json')))"

# Verify next-intl installed
pnpm list next-intl
```

**Phase 1 is complete when all checkboxes are checked!** 🎉

---

## 📝 Troubleshooting

### Issue: TypeScript error on message import

**Symptom**: `Cannot find module '../../messages/fr.json'`

**Solution**:
1. Ensure `messages/` is in project root (not `src/messages/`)
2. Check `tsconfig.json` has `"resolveJsonModule": true`
3. Verify file path in `src/i18n/request.ts` is correct

### Issue: ESLint error on global.d.ts

**Symptom**: `Empty interface` warning

**Solution**:
Add `// eslint-disable-next-line @typescript-eslint/no-empty-object-type` before the interface

### Issue: next-intl not found

**Symptom**: `Cannot find module 'next-intl/routing'`

**Solution**:
1. Run `pnpm install` again
2. Verify package.json has `next-intl` in dependencies
3. Check version is 4.x.x
