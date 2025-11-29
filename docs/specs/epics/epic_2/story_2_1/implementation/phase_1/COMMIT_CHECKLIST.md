# Phase 1: i18n Configuration - Commit Checklist

## Overview

This checklist guides you through implementing Phase 1 with 2 atomic commits. Follow each step in order, checking off items as you complete them.

---

## Pre-Implementation Checklist

### Environment Verification

- [ ] Node.js installed (v18+)
- [ ] pnpm installed
- [ ] Git configured with correct user
- [ ] On correct branch (`epic/epic-2-cms-core` or feature branch)

### Project State

- [ ] Working directory clean (`git status`)
- [ ] Dependencies installed (`pnpm install`)
- [ ] Dev server works (`pnpm dev`)
- [ ] Types generate successfully (`pnpm generate:types:payload`)

### Documentation Review

- [ ] Read [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
- [ ] Read [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
- [ ] Understand success criteria

---

## Commit 1: Add Localization Configuration

### Message

```
feat(i18n): add localization configuration to payload.config.ts
```

### Pre-Commit

- [ ] Backup current state: `git stash` (if needed)
- [ ] Verify branch: `git branch --show-current`

### Implementation Steps

#### Step 1.1: Open payload.config.ts

- [ ] Open `src/payload.config.ts` in editor
- [ ] Locate the `buildConfig` function call
- [ ] Identify where to add `localization` block (after `typescript` config)

#### Step 1.2: Add Localization Block

- [ ] Add the following code after the `typescript` configuration:

```typescript
  // i18n Configuration - Story 2.1 Phase 1
  localization: {
    locales: [
      { label: 'Francais', code: 'fr' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'fr',
    fallback: true,
  },
```

#### Step 1.3: Verify Syntax

- [ ] Save the file
- [ ] Run TypeScript check:
  ```bash
  pnpm tsc --noEmit
  ```
- [ ] Verify: No compilation errors

#### Step 1.4: Test Dev Server

- [ ] Start development server:
  ```bash
  pnpm dev
  ```
- [ ] Verify: Server starts without errors
- [ ] Open browser: `http://localhost:3000/admin`
- [ ] Verify: Admin login page loads

#### Step 1.5: Verify Language Toggle

- [ ] Log into admin panel
- [ ] Look for language toggle in header (top right area)
- [ ] Verify: Toggle shows "Francais" / "English" options
- [ ] Click toggle to switch languages
- [ ] Verify: UI responds to language change

### Post-Implementation Verification

- [ ] `pnpm tsc --noEmit` passes
- [ ] `pnpm dev` starts successfully
- [ ] Admin UI accessible
- [ ] Language toggle visible and functional

### Commit

- [ ] Stage changes:
  ```bash
  git add src/payload.config.ts
  ```
- [ ] Verify staged files:
  ```bash
  git diff --cached
  ```
- [ ] Create commit:

  ```bash
  git commit -m "$(cat <<'EOF'
  feat(i18n): add localization configuration to payload.config.ts

  - Configure FR as default locale with EN as secondary
  - Enable fallback to default locale for missing translations
  - Add human-readable labels for admin UI language selector

  Part of Story 2.1 - Phase 1

  🤖 Generated with [Claude Code](https://claude.com/claude-code)

  Co-Authored-By: Claude <noreply@anthropic.com>
  EOF
  )"
  ```

- [ ] Verify commit:
  ```bash
  git log -1 --oneline
  ```

### Checkpoint

**Commit 1 Complete**: ✅

---

## Commit 2: Regenerate TypeScript Types

### Message

```
chore(types): regenerate payload types with i18n support
```

### Pre-Commit

- [ ] Verify Commit 1 is complete
- [ ] Working directory clean except for generated files

### Implementation Steps

#### Step 2.1: Clear Cache (Optional but Recommended)

- [ ] Remove Next.js cache:
  ```bash
  rm -rf .next
  ```

#### Step 2.2: Generate Types

- [ ] Run type generation:
  ```bash
  pnpm generate:types:payload
  ```
- [ ] Verify: Command completes without errors

#### Step 2.3: Verify Generated Types

- [ ] Open `src/payload-types.ts`
- [ ] Search for `locale:` in the file
- [ ] Verify: `locale: 'fr' | 'en';` is present in Config interface
- [ ] Verify: File has been updated (check git diff)
  ```bash
  git diff src/payload-types.ts | head -50
  ```

#### Step 2.4: Build Verification

- [ ] Run full build:
  ```bash
  pnpm build
  ```
- [ ] Verify: Build completes successfully

#### Step 2.5: Lint Check

- [ ] Run linter:
  ```bash
  pnpm lint
  ```
- [ ] Verify: No linting errors

### Post-Implementation Verification

- [ ] Types generated successfully
- [ ] `locale` type is `'fr' | 'en'`
- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes

### Commit

- [ ] Stage changes:
  ```bash
  git add src/payload-types.ts
  ```
- [ ] Verify staged files:
  ```bash
  git diff --cached --stat
  ```
- [ ] Create commit:

  ```bash
  git commit -m "$(cat <<'EOF'
  chore(types): regenerate payload types with i18n support

  - Update payload-types.ts with locale configuration
  - Add Config.locale type for type-safe locale handling

  Part of Story 2.1 - Phase 1

  🤖 Generated with [Claude Code](https://claude.com/claude-code)

  Co-Authored-By: Claude <noreply@anthropic.com>
  EOF
  )"
  ```

- [ ] Verify commit:
  ```bash
  git log -1 --oneline
  ```

### Checkpoint

**Commit 2 Complete**: ✅

---

## Phase Completion Checklist

### All Commits Verified

- [ ] 2 commits created
- [ ] All commits follow Gitmoji convention
- [ ] Commit history is clean:
  ```bash
  git log --oneline -5
  ```

### Final Verification

- [ ] `pnpm dev` starts without errors
- [ ] `pnpm build` completes successfully
- [ ] `pnpm lint` passes
- [ ] `pnpm tsc --noEmit` passes
- [ ] Admin UI shows language toggle
- [ ] Language switching works

### Integration Tests

- [ ] Run existing tests:
  ```bash
  pnpm test:int
  ```
- [ ] Verify: All tests still pass

### Documentation

- [ ] Complete [VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)
- [ ] Update Epic tracking (if applicable)

---

## Troubleshooting

### Type Generation Fails

```bash
# Clear all caches and retry
rm -rf .next node_modules/.cache
pnpm generate:types:payload
```

### Dev Server Won't Start

```bash
# Check for syntax errors
pnpm tsc --noEmit

# Check Payload config specifically
npx tsc src/payload.config.ts --noEmit
```

### Language Toggle Not Visible

1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Check browser console for errors
4. Verify localization block syntax in config

### Build Fails

```bash
# Check what's failing
pnpm build 2>&1 | head -100

# Common fix: clear cache
rm -rf .next .open-next
pnpm build
```

---

## Quick Reference Commands

```bash
# Environment
pnpm dev                      # Start dev server
pnpm build                    # Build project
pnpm lint                     # Run linter
pnpm tsc --noEmit            # Type check

# Types
pnpm generate:types:payload   # Generate Payload types

# Git
git status                    # Check status
git diff                      # See changes
git add <file>               # Stage file
git commit -m "message"      # Commit
git log --oneline -5         # View recent commits

# Testing
pnpm test:int                # Integration tests
```

---

## Next Steps

After completing Phase 1:

1. **Run validation**: [VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)
2. **Update tracking**: Mark Phase 1 as complete in EPIC_TRACKING.md
3. **Start Phase 2**: Categories & Tags Collections

```bash
# Generate Phase 2 docs
/generate-phase-doc Epic 2 Story 2.1 Phase 2
```

---

**Checklist Status**: READY FOR USE
