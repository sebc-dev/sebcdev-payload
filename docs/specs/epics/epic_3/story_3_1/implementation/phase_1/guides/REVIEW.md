# Phase 1 - Code Review Guide

Complete guide for reviewing the Phase 1 implementation.

---

## 🎯 Review Objective

Validate that the implementation:

- ✅ Installs `next-intl` v4.x correctly
- ✅ Creates type-safe i18n configuration
- ✅ Sets up proper locale definitions (FR/EN)
- ✅ Creates minimal message files structure
- ✅ Follows next-intl App Router patterns
- ✅ Is compatible with Cloudflare Workers (edge runtime)

---

## 📋 Review Approach

Phase 1 is split into **3 atomic commits**. You can:

**Option A: Commit-by-commit review** (recommended)

- Easier to digest (5-20 min per commit)
- Progressive validation
- Targeted feedback

**Option B: Global review at once**

- Faster (30-45 min total)
- Immediate overview
- Requires more focus

**Estimated Total Time**: 30-45 minutes

---

## 🔍 Commit-by-Commit Review

### Commit 1: Install next-intl Package

**Files**: `package.json`, `pnpm-lock.yaml` (~5 lines)
**Duration**: 5 minutes

#### Review Checklist

##### Package Configuration

- [ ] `next-intl` is in `dependencies` (not `devDependencies`)
- [ ] Version constraint is `^4` (allows minor/patch updates)
- [ ] Version installed is 4.x.x

##### Compatibility

- [ ] No peer dependency warnings in install output
- [ ] No conflicts with existing packages
- [ ] Compatible with Next.js 15.x

##### Security

- [ ] Package is from official npm registry
- [ ] No unexpected additional packages added

#### Technical Validation

```bash
# Check package is installed correctly
pnpm list next-intl

# Verify no peer dependency issues
pnpm install
```

**Expected Result**: Package installed without warnings

#### Questions to Ask

1. Is v4.x the correct version for Next.js 15 async APIs?
2. Are there any known security issues with this version?
3. Will this work with Cloudflare Workers edge runtime?

---

### Commit 2: Create i18n Configuration Files

**Files**: `src/i18n/config.ts`, `src/i18n/routing.ts`, `src/i18n/request.ts` (~80 lines)
**Duration**: 15-20 minutes

#### Review Checklist

##### config.ts

- [ ] `locales` array is `['fr', 'en'] as const` (literal types)
- [ ] `Locale` type is properly exported
- [ ] `defaultLocale` is `'fr'`
- [ ] `isValidLocale()` helper is type-safe

##### routing.ts

- [ ] Uses `defineRouting()` from `next-intl/routing`
- [ ] `localePrefix: 'always'` is set (SEO requirement)
- [ ] Imports from `./config` are correct
- [ ] Re-exports `Locale` type for convenience

##### request.ts

- [ ] Uses `getRequestConfig()` from `next-intl/server`
- [ ] `requestLocale` is awaited (Next.js 15 async pattern)
- [ ] Fallback to `defaultLocale` is implemented
- [ ] Message import path is correct (`../../messages/${locale}.json`)

##### Code Quality

- [ ] JSDoc comments explain purpose
- [ ] No `any` types (except in type narrowing)
- [ ] Consistent formatting
- [ ] No debug statements

#### Technical Validation

```bash
# TypeScript check
pnpm exec tsc --noEmit

# Lint check
pnpm lint
```

**Expected Result**: No errors

#### Questions to Ask

1. Does the locale order matter (`['fr', 'en']` vs `['en', 'fr']`)?
2. Is `localePrefix: 'always'` correct for SEO strategy?
3. Are the message import paths correct relative to final file locations?
4. Is the async/await pattern compatible with edge runtime?

---

### Commit 3: Create Message Files and TypeScript Types

**Files**: `messages/fr.json`, `messages/en.json`, `global.d.ts` (~60 lines)
**Duration**: 10-15 minutes

#### Review Checklist

##### JSON Structure

- [ ] Both files have identical structure
- [ ] JSON is valid (no trailing commas)
- [ ] Keys are nested by category (`common`, `navigation`, etc.)
- [ ] No duplicate keys

##### French Content (fr.json)

- [ ] All text is in French (no English)
- [ ] Proper French punctuation (spaces before `:`, `!`, `?`)
- [ ] Accents are correct (`À propos`, not `A propos`)
- [ ] No typos

##### English Content (en.json)

- [ ] All text is in English (no French)
- [ ] Proper English punctuation
- [ ] Capitalization is consistent
- [ ] No typos

##### TypeScript Types (global.d.ts)

- [ ] Imports from `./messages/fr.json` (source of truth)
- [ ] `Messages` type is derived from JSON
- [ ] `IntlMessages` interface extends `Messages`
- [ ] ESLint disable comment is appropriate

##### Content Categories

- [ ] `common`: Generic UI labels (loading, error, etc.)
- [ ] `navigation`: Menu items
- [ ] `metadata`: SEO-related text
- [ ] `accessibility`: WCAG compliance labels

#### Technical Validation

```bash
# TypeScript check (ensures type augmentation works)
pnpm exec tsc --noEmit

# Validate JSON
node -e "JSON.parse(require('fs').readFileSync('./messages/fr.json', 'utf8'))"
node -e "JSON.parse(require('fs').readFileSync('./messages/en.json', 'utf8'))"
```

**Expected Result**: No errors, JSON parses successfully

#### Questions to Ask

1. Are the message categories comprehensive enough for Phase 2-4?
2. Is the French translation quality professional?
3. Should we add more accessibility labels?
4. Is the type augmentation pattern correct for next-intl v4?

---

## ✅ Global Validation

After reviewing all commits:

### Architecture & Design

- [ ] Files are in correct directories (`src/i18n/`, `messages/`)
- [ ] Separation of concerns (config, routing, request, messages)
- [ ] No coupling with app directory (Phase 3)
- [ ] Pattern matches next-intl official examples

### Code Quality

- [ ] Consistent TypeScript style
- [ ] Proper exports for reuse
- [ ] No unused imports
- [ ] No dead code

### Configuration Correctness

- [ ] Locales match Payload CMS (`fr`, `en`)
- [ ] Default locale matches requirements (`fr`)
- [ ] Routing config enables `/fr/*` and `/en/*` URLs

### Type Safety

- [ ] No `any` types (except justified cases)
- [ ] Types are exported for use in other modules
- [ ] Message types are inferred correctly
- [ ] `IntlMessages` augmentation is global

### Edge Runtime Compatibility

- [ ] No Node.js-only APIs used
- [ ] Dynamic imports use standard ES syntax
- [ ] No file system operations beyond JSON import

### Documentation

- [ ] JSDoc comments on public exports
- [ ] Purpose of each file is clear
- [ ] No TODO comments left behind

---

## 📝 Feedback Template

Use this template for feedback:

```markdown
## Review Feedback - Phase 1

**Reviewer**: [Name]
**Date**: [Date]
**Commits Reviewed**: All 3

### ✅ Strengths

- [What was done well]
- [Highlight good practices]

### 🔧 Required Changes

1. **[File/Area]**: [Issue description]
   - **Why**: [Explanation]
   - **Suggestion**: [How to fix]

2. [Repeat for each required change]

### 💡 Suggestions (Optional)

- [Nice-to-have improvements]
- [Alternative approaches to consider]

### 📊 Verdict

- [ ] ✅ **APPROVED** - Ready to merge
- [ ] 🔧 **CHANGES REQUESTED** - Needs fixes
- [ ] ❌ **REJECTED** - Major rework needed

### Next Steps

[What should happen next]
```

---

## 🔧 Common Issues to Watch For

### Critical Issues

- ❌ Wrong next-intl version (must be v4.x)
- ❌ Missing `localePrefix: 'always'` (breaks SEO)
- ❌ Mismatched message keys between FR and EN
- ❌ Invalid JSON syntax

### Minor Issues

- ⚠️ Missing JSDoc comments
- ⚠️ Inconsistent formatting
- ⚠️ Translation quality concerns

### Non-Issues (Acceptable)

- ✅ Minimal message content (intentional for Phase 1)
- ✅ ESLint disable on empty interface (required pattern)
- ✅ No unit tests (config validation in Phase 4)

---

## 🎯 Review Actions

### If Approved ✅

1. Merge the commits
2. Update INDEX.md status to COMPLETED
3. Archive review notes
4. Proceed to Phase 2

### If Changes Requested 🔧

1. Create detailed feedback (use template)
2. Discuss with developer
3. Re-review after fixes

### If Rejected ❌

1. Document major issues
2. Schedule discussion
3. Plan rework strategy

---

## ❓ FAQ

**Q: What if I disagree with the locale order?**
A: The order defines enum values and array iteration. `['fr', 'en']` puts French first as the default. This is intentional.

**Q: Should I review the lockfile?**
A: Quick scan only. Check for unexpected packages or major version changes in transitive dependencies.

**Q: Is the message content quality important?**
A: Moderate importance. These are placeholder messages for structure validation. Full content comes later.

**Q: Can I approve with minor comments?**
A: Yes, mark as approved and note that comments are optional improvements.

**Q: What about test coverage?**
A: Phase 1 has no unit tests by design. Configuration is validated via TypeScript and lint. Full testing is in Phase 4.
