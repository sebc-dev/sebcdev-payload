# Phase 2: Categories & Tags Collections - Commit Checklist

## Overview

This checklist guides you through implementing Phase 2 with 4 atomic commits. Follow each step in order, checking off items as you complete them.

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

### Phase 1 Prerequisites

- [ ] i18n configuration complete in `payload.config.ts`
- [ ] Locale type is `'fr' | 'en'` in `payload-types.ts`
- [ ] Language toggle visible in admin UI

### Documentation Review

- [ ] Read [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
- [ ] Read [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
- [ ] Understand success criteria

---

## Commit 1: Create Categories Collection

### Message

```
feat(collections): create Categories collection with i18n support
```

### Pre-Commit

- [ ] Backup current state: `git stash` (if needed)
- [ ] Verify branch: `git branch --show-current`

### Implementation Steps

#### Step 1.1: Create Categories File

- [ ] Create file `src/collections/Categories.ts`
- [ ] Add the following content:

```typescript
import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Category',
    plural: 'Categories',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'color'],
    group: 'Content',
    listSearchableFields: ['name', 'slug', 'description'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      localized: true,
      required: true,
      admin: {
        description: 'Category display name (localized)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      index: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "actualites", "tutoriel")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Brief description of the category (localized)',
      },
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Hex color code for visual identity (e.g., "#FF5733")',
      },
      validate: (value) => {
        if (!value) return true
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
        return hexRegex.test(value) || 'Please enter a valid hex color (e.g., "#FF5733")'
      },
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Icon identifier for visual identity (e.g., "newspaper", "book")',
      },
    },
  ],
}
```

#### Step 1.2: Verify Syntax

- [ ] Save the file
- [ ] Run TypeScript check (should still pass, file not imported yet):
  ```bash
  pnpm tsc --noEmit
  ```
- [ ] Verify: No compilation errors

#### Step 1.3: Verify File Structure

- [ ] Confirm file exists:
  ```bash
  ls -la src/collections/Categories.ts
  ```
- [ ] Confirm export is correct:
  ```bash
  grep "export const Categories" src/collections/Categories.ts
  ```

### Post-Implementation Verification

- [ ] File `src/collections/Categories.ts` exists
- [ ] File exports `Categories` constant
- [ ] No TypeScript errors

### Commit

- [ ] Stage changes:
  ```bash
  git add src/collections/Categories.ts
  ```
- [ ] Verify staged files:
  ```bash
  git diff --cached
  ```
- [ ] Create commit:

  ```bash
  git commit -m "$(cat <<'EOF'
  feat(collections): create Categories collection with i18n support

  - Add Categories collection with localized name and description
  - Include visual identity fields (color, icon) for frontend styling
  - Enforce unique constraint on slug for URL safety

  Part of Story 2.1 - Phase 2

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

**Commit 1 Complete**: [ ]

---

## Commit 2: Create Tags Collection

### Message

```
feat(collections): create Tags collection with i18n support
```

### Pre-Commit

- [ ] Verify Commit 1 is complete
- [ ] Working directory clean

### Implementation Steps

#### Step 2.1: Create Tags File

- [ ] Create file `src/collections/Tags.ts`
- [ ] Add the following content:

```typescript
import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: {
    singular: 'Tag',
    plural: 'Tags',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: 'Content',
    listSearchableFields: ['name', 'slug'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      localized: true,
      required: true,
      admin: {
        description: 'Tag display name (localized)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      index: true,
      admin: {
        description: 'URL-friendly identifier',
      },
    },
  ],
}
```

#### Step 2.2: Verify Syntax

- [ ] Save the file
- [ ] Run TypeScript check:
  ```bash
  pnpm tsc --noEmit
  ```
- [ ] Verify: No compilation errors

#### Step 2.3: Verify File Structure

- [ ] Confirm file exists:
  ```bash
  ls -la src/collections/Tags.ts
  ```
- [ ] Confirm export is correct:
  ```bash
  grep "export const Tags" src/collections/Tags.ts
  ```

### Post-Implementation Verification

- [ ] File `src/collections/Tags.ts` exists
- [ ] File exports `Tags` constant
- [ ] No TypeScript errors

### Commit

- [ ] Stage changes:
  ```bash
  git add src/collections/Tags.ts
  ```
- [ ] Verify staged files:
  ```bash
  git diff --cached
  ```
- [ ] Create commit:

  ```bash
  git commit -m "$(cat <<'EOF'
  feat(collections): create Tags collection with i18n support

  - Add Tags collection with localized name field
  - Enforce unique constraint on slug for URL safety
  - Minimal schema optimized for taxonomy tagging

  Part of Story 2.1 - Phase 2

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

**Commit 2 Complete**: [ ]

---

## Commit 3: Create Barrel Export and Register in Config

### Message

```
feat(collections): create barrel export and register in config
```

### Pre-Commit

- [ ] Verify Commits 1 and 2 are complete
- [ ] Working directory clean

### Implementation Steps

#### Step 3.1: Create Barrel Export File

- [ ] Create file `src/collections/index.ts`
- [ ] Add the following content:

```typescript
export { Users } from './Users'
export { Media } from './Media'
export { Categories } from './Categories'
export { Tags } from './Tags'
```

#### Step 3.2: Update payload.config.ts

- [ ] Open `src/payload.config.ts`
- [ ] Update imports (replace individual imports with barrel import):

**Before:**

```typescript
import { Users } from './collections/Users'
import { Media } from './collections/Media'
```

**After:**

```typescript
import { Users, Media, Categories, Tags } from './collections'
```

- [ ] Update collections array:

**Before:**

```typescript
collections: [Users, Media],
```

**After:**

```typescript
collections: [Users, Media, Categories, Tags],
```

#### Step 3.3: Verify Syntax

- [ ] Save all files
- [ ] Run TypeScript check:
  ```bash
  pnpm tsc --noEmit
  ```
- [ ] Verify: No compilation errors

#### Step 3.4: Test Dev Server

- [ ] Start development server:
  ```bash
  pnpm dev
  ```
- [ ] Verify: Server starts without errors
- [ ] Open browser: `http://localhost:3000/admin`
- [ ] Verify: Admin login page loads

#### Step 3.5: Verify Collections in Admin

- [ ] Log into admin panel
- [ ] Look for "Content" group in sidebar
- [ ] Verify: "Categories" appears in sidebar
- [ ] Verify: "Tags" appears in sidebar
- [ ] Click on Categories: collection page should load
- [ ] Click on Tags: collection page should load

### Post-Implementation Verification

- [ ] `src/collections/index.ts` file created
- [ ] All collections exported from barrel
- [ ] `payload.config.ts` imports from barrel
- [ ] Collections visible in admin sidebar
- [ ] No TypeScript errors
- [ ] Dev server starts without errors

### Commit

- [ ] Stage changes:
  ```bash
  git add src/collections/index.ts src/payload.config.ts
  ```
- [ ] Verify staged files:
  ```bash
  git diff --cached --stat
  ```
- [ ] Create commit:

  ```bash
  git commit -m "$(cat <<'EOF'
  feat(collections): create barrel export and register in config

  - Create collections/index.ts barrel export for clean imports
  - Register Categories and Tags in payload.config.ts
  - Maintain existing Users and Media collections

  Part of Story 2.1 - Phase 2

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

**Commit 3 Complete**: [ ]

---

## Commit 4: Generate and Apply Migration

### Message

```
chore(db): generate and apply migration for Categories and Tags
```

### Pre-Commit

- [ ] Verify Commit 3 is complete
- [ ] Dev server running and collections visible in admin

### Implementation Steps

#### Step 4.1: Clear Cache (Recommended)

- [ ] Stop dev server if running (Ctrl+C)
- [ ] Remove Next.js cache:
  ```bash
  rm -rf .next
  ```

#### Step 4.2: Generate Migration

- [ ] Run migration creation:
  ```bash
  pnpm payload migrate:create
  ```
- [ ] Verify: New migration file created in `src/migrations/`
- [ ] Note the migration filename:
  ```bash
  ls -la src/migrations/
  ```

#### Step 4.3: Review Migration (Optional but Recommended)

- [ ] Open the new migration file
- [ ] Verify it creates tables for:
  - `categories`
  - `tags`
  - Localization tables if applicable

#### Step 4.4: Apply Migration

- [ ] Run migration:
  ```bash
  pnpm payload migrate
  ```
- [ ] Verify: Migration completes without errors

#### Step 4.5: Regenerate Types

- [ ] Run type generation:
  ```bash
  pnpm generate:types:payload
  ```
- [ ] Verify: Command completes without errors

#### Step 4.6: Verify Generated Types

- [ ] Check for Category type:
  ```bash
  grep -A 10 "interface Category" src/payload-types.ts
  ```
- [ ] Check for Tag type:
  ```bash
  grep -A 5 "interface Tag" src/payload-types.ts
  ```
- [ ] Verify both types include expected fields

#### Step 4.7: Build Verification

- [ ] Run full build:
  ```bash
  pnpm build
  ```
- [ ] Verify: Build completes successfully

#### Step 4.8: Lint Check

- [ ] Run linter:
  ```bash
  pnpm lint
  ```
- [ ] Verify: No linting errors

#### Step 4.9: Test CRUD Operations

- [ ] Start dev server:
  ```bash
  pnpm dev
  ```
- [ ] Navigate to Categories in admin
- [ ] Create a test category:
  - Name (FR): "Test Categorie"
  - Slug: "test-categorie"
  - Color: "#FF5733"
- [ ] Verify: Category created successfully
- [ ] Switch to EN locale
- [ ] Verify: Fallback displays FR content
- [ ] Navigate to Tags
- [ ] Create a test tag:
  - Name (FR): "Test Tag"
  - Slug: "test-tag"
- [ ] Verify: Tag created successfully

### Post-Implementation Verification

- [ ] Migration file created
- [ ] Migration applied successfully
- [ ] Types regenerated with Category and Tag
- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes
- [ ] CRUD operations work in admin

### Commit

- [ ] Stage changes:
  ```bash
  git add src/migrations/ src/payload-types.ts
  ```
- [ ] Verify staged files:
  ```bash
  git diff --cached --stat
  ```
- [ ] Create commit:

  ```bash
  git commit -m "$(cat <<'EOF'
  chore(db): generate and apply migration for Categories and Tags

  - Generate D1 migration for new collections schema
  - Apply migration to local database
  - Regenerate TypeScript types with new collections

  Part of Story 2.1 - Phase 2

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

**Commit 4 Complete**: [ ]

---

## Phase Completion Checklist

### All Commits Verified

- [ ] 4 commits created
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
- [ ] Categories collection visible and functional
- [ ] Tags collection visible and functional
- [ ] i18n fallback works for both collections

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

### Migration Generation Fails

```bash
# Clear all caches and retry
rm -rf .next node_modules/.cache
pnpm payload migrate:create
```

### Migration Apply Fails

```bash
# Check D1 bindings
pnpm exec wrangler d1 list

# Verify environment
echo $CLOUDFLARE_ENV

# Try with verbose output
pnpm payload migrate --verbose
```

### Collections Not Visible in Admin

1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Check browser console for errors
4. Verify collections are registered in `payload.config.ts`
5. Verify barrel export includes all collections

### Unique Constraint Error on Create

This is expected behavior - slugs must be unique. Use a different slug value.

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

# Migrations
pnpm payload migrate:create   # Create migration
pnpm payload migrate          # Apply migrations

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

After completing Phase 2:

1. **Run validation**: [VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)
2. **Update tracking**: Mark Phase 2 as complete in EPIC_TRACKING.md
3. **Start Phase 3**: Articles Collection

```bash
# Generate Phase 3 docs
/generate-phase-doc Epic 2 Story 2.1 Phase 3
```

---

**Checklist Status**: READY FOR USE
