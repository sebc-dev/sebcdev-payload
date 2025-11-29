# Phase 1: i18n Configuration - Code Review Guide

## Overview

This guide provides review criteria for the 2 commits in Phase 1. Use this during self-review or peer review to ensure code quality.

---

## Review Checklist Summary

| Commit | Key Review Points                                                   |
| ------ | ------------------------------------------------------------------- |
| 1      | Localization config syntax, locale definitions, placement in config |
| 2      | Type regeneration completeness, Config.locale type                  |

---

## Commit 1 Review: Localization Configuration

### Commit Details

- **Message**: `feat(i18n): add localization configuration to payload.config.ts`
- **File**: `src/payload.config.ts`
- **Lines Changed**: +15 (approximately)

### Review Criteria

#### 1. Configuration Syntax

- [ ] `localization` object is properly structured
- [ ] All required properties present: `locales`, `defaultLocale`, `fallback`
- [ ] No trailing commas causing issues
- [ ] Proper TypeScript types inferred

```typescript
// Expected structure
localization: {
  locales: [
    { label: 'Francais', code: 'fr' },
    { label: 'English', code: 'en' },
  ],
  defaultLocale: 'fr',
  fallback: true,
},
```

#### 2. Locale Definitions

- [ ] French locale defined with code `'fr'`
- [ ] English locale defined with code `'en'`
- [ ] Labels are human-readable (for admin UI)
- [ ] Default locale is `'fr'` (as per requirements)

#### 3. Configuration Placement

- [ ] `localization` block placed correctly in `buildConfig`
- [ ] Does not break other config sections
- [ ] Maintains file organization

#### 4. Code Style

- [ ] Follows project code style
- [ ] Proper indentation (2 spaces)
- [ ] No unnecessary changes to other parts of file
- [ ] Comment explaining the change (optional but helpful)

### Red Flags to Watch For

| Issue                    | Why It's a Problem                      |
| ------------------------ | --------------------------------------- |
| Missing `fallback: true` | Translations won't fall back to default |
| Wrong `defaultLocale`    | Content might show in wrong language    |
| Syntax errors            | Build will fail                         |
| Wrong locale codes       | API inconsistencies later               |

### Questions to Ask

1. Is the locale code format correct (ISO 639-1)?
2. Will the labels display correctly in the admin UI?
3. Is fallback behavior appropriate for this project?

---

## Commit 2 Review: TypeScript Types Regeneration

### Commit Details

- **Message**: `chore(types): regenerate payload types with i18n support`
- **File**: `src/payload-types.ts`
- **Lines Changed**: ~50 (generated)

### Review Criteria

#### 1. Type Generation Success

- [ ] File was regenerated (check timestamp/diff)
- [ ] No generation errors occurred
- [ ] File is valid TypeScript

#### 2. Locale Type Present

- [ ] `Config` interface includes `locale` property
- [ ] Type is `'fr' | 'en'` (union of defined locales)

```typescript
// Expected in Config interface
export interface Config {
  // ...
  locale: 'fr' | 'en'
  // ...
}
```

#### 3. No Unintended Changes

- [ ] Only locale-related types changed
- [ ] Existing types not broken
- [ ] No removed types that shouldn't be removed

#### 4. Build Verification

- [ ] `pnpm build` succeeds
- [ ] No TypeScript errors in codebase
- [ ] Lint passes

### Red Flags to Watch For

| Issue                        | Why It's a Problem              |
| ---------------------------- | ------------------------------- |
| `locale: null` still present | Config not regenerated properly |
| Missing locale union type    | Type safety not working         |
| Extra unexpected changes     | Possible version mismatch       |

### Questions to Ask

1. Does the generated type match our locale configuration?
2. Are all other types still intact?
3. Does the project build successfully?

---

## General Review Guidelines

### Code Quality Standards

| Aspect     | Requirement                    |
| ---------- | ------------------------------ |
| TypeScript | Strict mode passes             |
| Linting    | No ESLint errors               |
| Formatting | Prettier compliant             |
| Comments   | Minimal, meaningful if present |

### Commit Message Quality

- [ ] Uses Gitmoji convention
- [ ] Type is correct (`feat` or `chore`)
- [ ] Scope is specified (`i18n` or `types`)
- [ ] Description is clear and concise
- [ ] Body explains the "why"
- [ ] References story/phase

### Security Considerations

For this phase, security is minimal since we're only adding configuration:

- [ ] No secrets exposed in config
- [ ] No debug/development code left in
- [ ] No console.log statements

---

## Review Process

### Self-Review Steps

1. **Before Committing**:

   ```bash
   # Check what's staged
   git diff --cached

   # Verify no unintended files
   git status
   ```

2. **After Each Commit**:

   ```bash
   # Verify commit content
   git show HEAD

   # Check commit message
   git log -1
   ```

3. **After All Commits**:

   ```bash
   # Full diff from main
   git diff main...HEAD

   # Run all checks
   pnpm lint && pnpm build && pnpm test:int
   ```

### Peer Review Steps

1. **Review Commit Messages**:
   - Clear and descriptive?
   - Follows conventions?

2. **Review Code Changes**:
   - Use diff view in GitHub/GitLab
   - Check each file changed
   - Verify no unrelated changes

3. **Test Locally** (if needed):
   ```bash
   git fetch origin
   git checkout <branch>
   pnpm install
   pnpm dev
   # Test admin UI language toggle
   ```

---

## Approval Criteria

### Commit 1 Approval

- [ ] Syntax is correct
- [ ] All locale properties defined correctly
- [ ] Dev server starts without errors
- [ ] Admin UI shows language toggle
- [ ] Commit message follows conventions

### Commit 2 Approval

- [ ] Types regenerated successfully
- [ ] `Config.locale` type is correct
- [ ] Build passes
- [ ] No TypeScript errors
- [ ] Commit message follows conventions

### Phase Approval

- [ ] All commits approved
- [ ] Integration tests pass
- [ ] No regressions
- [ ] Documentation updated (if needed)

---

## Common Review Feedback

### Typical Comments

1. **Config Placement**:

   > "Consider placing localization config near related config (admin, editor)"

2. **Label Consistency**:

   > "Labels should match how they appear in language-specific contexts"

3. **Type Safety**:
   > "Verify locale type is properly exported for use in other files"

### How to Address Feedback

1. Make requested changes
2. Amend commit if same commit, new commit if different scope
3. Re-request review
4. Document any decisions made

---

## Post-Review Actions

### If Approved

1. Merge to target branch (or ready for next phase)
2. Update EPIC_TRACKING.md
3. Notify team (if applicable)

### If Changes Requested

1. Address each comment
2. Push updates
3. Re-request review
4. Don't force-push if already reviewed

---

## References

- [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) - What should be implemented
- [COMMIT_CHECKLIST.md](../COMMIT_CHECKLIST.md) - Step-by-step guide
- [Payload i18n Docs](https://payloadcms.com/docs/configuration/i18n) - Official documentation
- [Project CLAUDE.md](../../../../../../../CLAUDE.md) - Project conventions

---

**Review Guide Status**: READY FOR USE
