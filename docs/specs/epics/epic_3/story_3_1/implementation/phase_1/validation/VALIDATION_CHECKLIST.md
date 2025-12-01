# Phase 1 - Final Validation Checklist

Complete validation checklist before marking Phase 1 as complete.

---

## ✅ 1. Commits and Structure

- [ ] All 3 atomic commits completed
- [ ] Commits follow naming convention (type(scope): description)
- [ ] Commit order is correct: package → config → messages
- [ ] Each commit is focused (single responsibility)
- [ ] No merge commits in phase branch
- [ ] Git history is clean

**Verification**:
```bash
git log --oneline -5
# Should show 3 commits for Phase 1
```

---

## ✅ 2. Type Safety

- [ ] No TypeScript errors
- [ ] No `any` types (unless justified)
- [ ] `Locale` type is properly exported
- [ ] `IntlMessages` interface extends `Messages`
- [ ] Type inference works for messages

**Validation**:
```bash
pnpm exec tsc --noEmit
```

**Expected Result**: No errors

---

## ✅ 3. Code Quality

- [ ] Code follows project style guide
- [ ] Consistent formatting (Prettier)
- [ ] Clear and descriptive naming
- [ ] JSDoc comments on exports
- [ ] No commented-out code
- [ ] No debug statements (console.log)
- [ ] No TODO/FIXME comments

**Validation**:
```bash
pnpm lint
```

**Expected Result**: No errors or warnings

---

## ✅ 4. Package Installation

- [ ] `next-intl` is in `dependencies`
- [ ] Version is ^4.x.x
- [ ] No peer dependency warnings
- [ ] Package resolves correctly
- [ ] No conflicting versions

**Validation**:
```bash
pnpm list next-intl
pnpm install --frozen-lockfile
```

**Expected Result**: Package listed at version 4.x.x, install succeeds

---

## ✅ 5. Configuration Files

### src/i18n/config.ts

- [ ] File exists at `src/i18n/config.ts`
- [ ] `locales` array is `['fr', 'en'] as const`
- [ ] `defaultLocale` is `'fr'`
- [ ] `Locale` type is exported
- [ ] `isValidLocale()` helper exists

### src/i18n/routing.ts

- [ ] File exists at `src/i18n/routing.ts`
- [ ] Uses `defineRouting()` from `next-intl/routing`
- [ ] `localePrefix: 'always'` is set
- [ ] Imports from `./config` are correct
- [ ] `routing` object is exported

### src/i18n/request.ts

- [ ] File exists at `src/i18n/request.ts`
- [ ] Uses `getRequestConfig()` from `next-intl/server`
- [ ] `requestLocale` is awaited (async pattern)
- [ ] Fallback to `defaultLocale` implemented
- [ ] Message import path is correct

**Validation**:
```bash
ls -la src/i18n/
# Should show: config.ts, routing.ts, request.ts
```

---

## ✅ 6. Message Files

### Structure

- [ ] `messages/fr.json` exists
- [ ] `messages/en.json` exists
- [ ] Both files have identical keys
- [ ] Nested structure: common, navigation, metadata, accessibility

### Content

- [ ] French file contains French text
- [ ] English file contains English text
- [ ] No placeholder text (TODO, FIXME)
- [ ] No empty values
- [ ] Valid JSON syntax

### Type Definition

- [ ] `global.d.ts` exists
- [ ] Imports from `./messages/fr.json`
- [ ] `IntlMessages` interface defined
- [ ] ESLint disable comment if needed

**Validation**:
```bash
# Check files exist
ls -la messages/

# Validate JSON
node -e "console.log('FR keys:', Object.keys(require('./messages/fr.json')))"
node -e "console.log('EN keys:', Object.keys(require('./messages/en.json')))"

# Compare keys
node -e "const fr=Object.keys(require('./messages/fr.json')).sort(); const en=Object.keys(require('./messages/en.json')).sort(); console.log('Match:', JSON.stringify(fr)===JSON.stringify(en))"
```

**Expected Result**: Keys match between FR and EN

---

## ✅ 7. File Structure

- [ ] `src/i18n/` directory exists
- [ ] `messages/` directory exists (in project root)
- [ ] `global.d.ts` is in project root
- [ ] No files in wrong locations

**Validation**:
```bash
# Verify structure
tree -L 2 src/i18n/ messages/ 2>/dev/null || (ls -la src/i18n/ && ls -la messages/)
cat global.d.ts
```

---

## ✅ 8. Linting and Formatting

- [ ] ESLint passes with no errors
- [ ] ESLint passes with no warnings
- [ ] Prettier formatting applied
- [ ] No formatting differences

**Validation**:
```bash
pnpm lint
pnpm format:check
```

---

## ✅ 9. Edge Runtime Compatibility

- [ ] No Node.js-only APIs used
- [ ] Dynamic imports use ES syntax
- [ ] No file system operations (except JSON import)
- [ ] Compatible with Cloudflare Workers

**Validation**:
```bash
# Check for Node.js-only imports
grep -r "require('fs')" src/i18n/ || echo "No fs imports found ✓"
grep -r "require('path')" src/i18n/ || echo "No path imports found ✓"
```

---

## ✅ 10. Documentation

- [ ] Configuration files have JSDoc comments
- [ ] Purpose of each file is clear
- [ ] No stale documentation
- [ ] Implementation matches PHASES_PLAN.md

---

## ✅ 11. Integration Readiness

- [ ] Configuration is ready for Phase 2 (middleware)
- [ ] Types are exported for use in app
- [ ] Message structure supports future expansion
- [ ] No breaking changes to existing code

**Validation**:
```bash
# Ensure app still works
pnpm lint
pnpm exec tsc --noEmit
```

---

## ✅ 12. Final Validation

- [ ] All previous checklist items checked
- [ ] Phase objectives met (from PHASES_PLAN.md)
- [ ] No known issues
- [ ] Ready for Phase 2

---

## 📋 Validation Commands Summary

Run all these commands before final approval:

```bash
# 1. Install dependencies (ensure clean state)
pnpm install --frozen-lockfile

# 2. TypeScript check
pnpm exec tsc --noEmit

# 3. Linting
pnpm lint

# 4. Format check
pnpm format:check

# 5. Verify next-intl installation
pnpm list next-intl

# 6. Validate JSON files
node -e "JSON.parse(require('fs').readFileSync('./messages/fr.json', 'utf8')); console.log('FR JSON valid ✓')"
node -e "JSON.parse(require('fs').readFileSync('./messages/en.json', 'utf8')); console.log('EN JSON valid ✓')"

# 7. Verify file structure
ls -la src/i18n/
ls -la messages/
ls -la global.d.ts

# 8. Check commits
git log --oneline -5
```

**All must pass with no errors.**

---

## 📊 Success Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Commits | 3 | - | ⏳ |
| Type Safety | 100% | - | ⏳ |
| Lint Status | ✅ | - | ⏳ |
| JSON Valid | ✅ | - | ⏳ |
| Files Created | 6 | - | ⏳ |

### Files Created Checklist

| File | Status |
|------|--------|
| `src/i18n/config.ts` | ⏳ |
| `src/i18n/routing.ts` | ⏳ |
| `src/i18n/request.ts` | ⏳ |
| `messages/fr.json` | ⏳ |
| `messages/en.json` | ⏳ |
| `global.d.ts` | ⏳ |

---

## 🎯 Final Verdict

Select one:

- [ ] ✅ **APPROVED** - Phase 1 is complete and ready for Phase 2
- [ ] 🔧 **CHANGES REQUESTED** - Issues to fix:
  - [List issues]
- [ ] ❌ **REJECTED** - Major rework needed:
  - [List major issues]

---

## 📝 Next Steps

### If Approved ✅

1. [ ] Update INDEX.md status to ✅ COMPLETED
2. [ ] Update EPIC_TRACKING.md with Phase 1 completion
3. [ ] Create git tag: `story-3.1-phase-1-complete` (optional)
4. [ ] Begin Phase 2: Middleware & Routing
5. [ ] Generate Phase 2 docs: `/generate-phase-doc Epic 3 Story 3.1 Phase 2`

### If Changes Requested 🔧

1. [ ] Address all feedback items
2. [ ] Re-run validation commands
3. [ ] Request re-review

### If Rejected ❌

1. [ ] Document issues
2. [ ] Plan rework
3. [ ] Schedule review

---

**Validation completed by**: _______________
**Date**: _______________
**Notes**: _______________
