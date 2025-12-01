# Phase 1 - Atomic Implementation Plan

**Objective**: Install `next-intl` and create the foundational i18n configuration files for Next.js 15 App Router.

---

## 🎯 Overview

### Why an Atomic Approach?

The implementation is split into **3 independent commits** to:

✅ **Facilitate review** - Each commit focuses on a single responsibility
✅ **Enable rollback** - If a commit has issues, revert it without breaking everything
✅ **Progressive type-safety** - Types validate at each step
✅ **Clear dependencies** - Package first, config second, messages third
✅ **Continuous documentation** - Each commit can be documented independently

### Global Strategy

```
[Commit 1]    →    [Commit 2]     →    [Commit 3]
Install pkg        Create config       Messages + Types
    ↓                   ↓                    ↓
  100%               100%                 100%
dependency        type-safe             ready for
resolved          config                Phase 2
```

---

## 📦 The 3 Atomic Commits

### Commit 1: Install next-intl Package

**Files**: `package.json`, `pnpm-lock.yaml`
**Size**: ~5 lines changed (package.json) + lockfile
**Duration**: 10-15 min (implementation) + 5 min (review)

**Content**:

- Add `next-intl` v4.x to dependencies
- Run `pnpm install`
- Verify package resolution

**Why it's atomic**:

- Single responsibility: package installation only
- No configuration changes
- Can be validated immediately with `pnpm list next-intl`

**Technical Validation**:
```bash
pnpm add next-intl@^4
pnpm list next-intl
```

**Expected Result**: `next-intl` appears in dependencies with version 4.x.x

**Review Criteria**:

- [ ] Version is ^4.x (not 3.x or 5.x)
- [ ] No peer dependency warnings
- [ ] Package listed in `dependencies` (not devDependencies)

---

### Commit 2: Create i18n Configuration Files

**Files**:
- `src/i18n/config.ts` (create)
- `src/i18n/routing.ts` (create)
- `src/i18n/request.ts` (create)

**Size**: ~80 lines
**Duration**: 30-45 min (implementation) + 15-20 min (review)

**Content**:

- Create `src/i18n/config.ts`: Define supported locales and default locale
- Create `src/i18n/routing.ts`: Configure routing with `defineRouting()`
- Create `src/i18n/request.ts`: Server-side i18n request configuration with `getRequestConfig()`

**Why it's atomic**:

- Single responsibility: i18n infrastructure setup
- No app changes yet (Phase 3)
- Type-safe configuration using `next-intl` APIs
- All three files work together as a unit

**Technical Validation**:
```bash
pnpm exec tsc --noEmit
pnpm lint
```

**Expected Result**: No TypeScript or ESLint errors

**Review Criteria**:

- [ ] Locales match Payload CMS config: `['fr', 'en']`
- [ ] Default locale is `'fr'`
- [ ] `localePrefix: 'always'` for consistent URLs
- [ ] `getRequestConfig()` uses async API (Next.js 15 compatible)
- [ ] No `any` types
- [ ] Follows next-intl App Router patterns

**Configuration Details**:

```typescript
// src/i18n/config.ts
export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

---

### Commit 3: Create Message Files and TypeScript Types

**Files**:
- `messages/fr.json` (create)
- `messages/en.json` (create)
- `global.d.ts` (create/modify)

**Size**: ~60 lines
**Duration**: 20-30 min (implementation) + 10-15 min (review)

**Content**:

- Create `messages/fr.json`: French translations (minimal structure)
- Create `messages/en.json`: English translations (minimal structure)
- Create/update `global.d.ts`: TypeScript type augmentation for type-safe messages

**Why it's atomic**:

- Single responsibility: translation files and types
- Messages are separate from config
- Type definitions enable compile-time checking
- Minimal content (only structure validation)

**Technical Validation**:
```bash
pnpm exec tsc --noEmit
pnpm lint
```

**Expected Result**: No TypeScript errors, message types are inferred correctly

**Review Criteria**:

- [ ] Both JSON files have identical structure
- [ ] JSON is valid (no trailing commas, proper escaping)
- [ ] TypeScript augmentation follows next-intl pattern
- [ ] Messages are minimal (navigation, common labels only)
- [ ] Messages use nested structure for organization

**Message Structure**:

```json
// messages/fr.json
{
  "common": {
    "loading": "Chargement...",
    "error": "Une erreur est survenue"
  },
  "navigation": {
    "home": "Accueil",
    "blog": "Blog",
    "about": "À propos"
  },
  "metadata": {
    "title": "sebc.dev - Blog technique",
    "description": "Blog technique sur le développement web moderne"
  }
}
```

**TypeScript Augmentation**:

```typescript
// global.d.ts
import fr from './messages/fr.json';

type Messages = typeof fr;

declare global {
  interface IntlMessages extends Messages {}
}
```

---

## 🔄 Implementation Workflow

### Step-by-Step

1. **Read specification**: Understand requirements fully
2. **Setup environment**: Follow ENVIRONMENT_SETUP.md
3. **Implement Commit 1**: Install next-intl
4. **Validate Commit 1**: Run `pnpm list next-intl`
5. **Commit Commit 1**: Use provided commit message
6. **Implement Commit 2**: Create config files
7. **Validate Commit 2**: Run `pnpm exec tsc --noEmit && pnpm lint`
8. **Commit Commit 2**: Use provided commit message
9. **Implement Commit 3**: Create messages and types
10. **Validate Commit 3**: Run `pnpm exec tsc --noEmit && pnpm lint`
11. **Commit Commit 3**: Use provided commit message
12. **Final validation**: Complete VALIDATION_CHECKLIST.md

### Validation at Each Step

After each commit:
```bash
# TypeScript check
pnpm exec tsc --noEmit

# Lint check
pnpm lint
```

All must pass before moving to next commit.

---

## 📊 Commit Metrics

| Commit | Files | Lines | Implementation | Review | Total |
|--------|-------|-------|----------------|--------|-------|
| 1. Install next-intl | 2 | ~5 | 15 min | 5 min | 20 min |
| 2. i18n Configuration | 3 | ~80 | 45 min | 20 min | 65 min |
| 3. Messages & Types | 3 | ~60 | 30 min | 15 min | 45 min |
| **TOTAL** | **8** | **~145** | **1.5h** | **40min** | **~2h** |

---

## ✅ Atomic Approach Benefits

### For Developers

- 🎯 **Clear focus**: One thing at a time
- 🧪 **Testable**: Each commit validated with tsc and lint
- 📝 **Documented**: Clear commit messages

### For Reviewers

- ⚡ **Fast review**: 5-20 min per commit
- 🔍 **Focused**: Single responsibility to check
- ✅ **Quality**: Easier to spot issues

### For the Project

- 🔄 **Rollback-safe**: Revert without breaking
- 📚 **Historical**: Clear progression in git history
- 🏗️ **Maintainable**: Easy to understand later

---

## 📝 Best Practices

### Commit Messages

Format:
```
type(scope): short description (max 50 chars)

- Point 1: detail
- Point 2: detail
- Point 3: justification if needed

Part of Phase 1 - Commit X/3
```

Types: `feat`, `chore`, `docs`

### Review Checklist

Before committing:

- [ ] Code follows project style guide
- [ ] TypeScript compiles without errors
- [ ] Linter passes
- [ ] No console.logs or debug code
- [ ] Configuration matches next-intl official docs

---

## ⚠️ Important Points

### Do's

- ✅ Follow the commit order (dependencies)
- ✅ Validate after each commit
- ✅ Use exact versions specified (^4.x)
- ✅ Use provided commit messages as template

### Don'ts

- ❌ Skip commits or combine them
- ❌ Commit without running validations
- ❌ Use `any` types
- ❌ Add middleware or app changes (that's Phase 2 & 3)

---

## 🔧 Technical Notes

### next-intl v4.x Requirements

- Compatible with Next.js 15 async APIs (`await params`)
- Uses `getRequestConfig()` for server-side setup
- Supports `defineRouting()` for type-safe routing config

### Cloudflare Workers Compatibility

- `next-intl` is edge-compatible
- No Node.js-only APIs used
- Bundle size impact: ~15KB gzipped

### File Organization

```
src/
├── i18n/
│   ├── config.ts      # Locales and default
│   ├── routing.ts     # Routing configuration
│   └── request.ts     # Server-side request config
messages/
├── fr.json            # French translations
└── en.json            # English translations
global.d.ts            # Type augmentation
```

---

## ❓ FAQ

**Q: What if a commit is too big?**
A: These commits are already minimal. Don't split further.

**Q: What if I need to fix a previous commit?**
A: Fix in place if not pushed, or create a fixup commit

**Q: Can I change the commit order?**
A: No. Commit 2 depends on Commit 1 (package), Commit 3 depends on Commit 2 (imports)

**Q: What if tests fail?**
A: Phase 1 has no unit tests. TypeScript and lint must pass.

**Q: Why minimal message content?**
A: Full translations come later. This phase validates structure only.
