# Phase 2: Categories & Tags Collections - Implementation Plan

## Atomic Commit Strategy

This phase is implemented through **4 atomic commits**, each delivering a specific, testable piece of functionality.

---

## Commit Overview

| #   | Type  | Message                                                             | Files | Lines | Time   |
| --- | ----- | ------------------------------------------------------------------- | ----- | ----- | ------ |
| 1   | feat  | `feat(collections): create Categories collection with i18n support` | 1     | ~45   | 45 min |
| 2   | feat  | `feat(collections): create Tags collection with i18n support`       | 1     | ~25   | 30 min |
| 3   | feat  | `feat(collections): create barrel export and register in config`    | 2     | ~15   | 30 min |
| 4   | chore | `chore(db): generate and apply migration for Categories and Tags`   | 2     | ~250  | 45 min |

**Total**: 4 commits, ~335 lines, 2h30 minutes

---

## Commit 1: Create Categories Collection

### Commit Message

```
feat(collections): create Categories collection with i18n support

- Add Categories collection with localized name and description
- Include visual identity fields (color, icon) for frontend styling
- Enforce unique constraint on slug for URL safety

Part of Story 2.1 - Phase 2
```

### Objective

Create the Categories collection with i18n support and visual identity fields for the blog taxonomy system.

### Files Changed

| File                            | Action | Changes             |
| ------------------------------- | ------ | ------------------- |
| `src/collections/Categories.ts` | Create | New collection file |

### Implementation Details

#### Code to Create

```typescript
// src/collections/Categories.ts
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

### Field Specifications

| Field         | Type     | Localized | Required | Unique | Index | Validate | Notes                               |
| ------------- | -------- | --------- | -------- | ------ | ----- | -------- | ----------------------------------- |
| `name`        | text     | Yes       | Yes      | No     | No    | No       | Display name in admin and frontend  |
| `slug`        | text     | No        | Yes      | Yes    | Yes   | No       | URL identifier, indexed for queries |
| `description` | textarea | Yes       | No       | No     | No    | No       | Optional category description       |
| `color`       | text     | No        | No       | No     | No    | Yes      | Hex color with format validation    |
| `icon`        | text     | No        | No       | No     | No    | No       | Icon identifier for frontend        |

### Verification Steps

1. **Syntax Check**: Ensure no TypeScript errors

   ```bash
   pnpm tsc --noEmit
   ```

2. **File Exists**: Verify file creation
   ```bash
   ls -la src/collections/Categories.ts
   ```

### Success Criteria

- [ ] `src/collections/Categories.ts` file created
- [ ] No TypeScript compilation errors
- [ ] File exports `Categories` constant of type `CollectionConfig`

### Estimated Time

- Implementation: 30 minutes
- Verification: 15 minutes
- **Total**: 45 minutes

---

## Commit 2: Create Tags Collection

### Commit Message

```
feat(collections): create Tags collection with i18n support

- Add Tags collection with localized name field
- Enforce unique constraint on slug for URL safety
- Minimal schema optimized for taxonomy tagging

Part of Story 2.1 - Phase 2
```

### Objective

Create the Tags collection with i18n support for free-form content tagging.

### Files Changed

| File                      | Action | Changes             |
| ------------------------- | ------ | ------------------- |
| `src/collections/Tags.ts` | Create | New collection file |

### Implementation Details

#### Code to Create

```typescript
// src/collections/Tags.ts
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

### Field Specifications

| Field  | Type | Localized | Required | Unique | Index | Notes                               |
| ------ | ---- | --------- | -------- | ------ | ----- | ----------------------------------- |
| `name` | text | Yes       | Yes      | No     | No    | Display name in admin and frontend  |
| `slug` | text | No        | Yes      | Yes    | Yes   | URL identifier, indexed for queries |

### Verification Steps

1. **Syntax Check**: Ensure no TypeScript errors

   ```bash
   pnpm tsc --noEmit
   ```

2. **File Exists**: Verify file creation
   ```bash
   ls -la src/collections/Tags.ts
   ```

### Success Criteria

- [ ] `src/collections/Tags.ts` file created
- [ ] No TypeScript compilation errors
- [ ] File exports `Tags` constant of type `CollectionConfig`

### Estimated Time

- Implementation: 20 minutes
- Verification: 10 minutes
- **Total**: 30 minutes

---

## Commit 3: Create Barrel Export and Register Collections

### Commit Message

```
feat(collections): create barrel export and register in config

- Create collections/index.ts barrel export for clean imports
- Register Categories and Tags in payload.config.ts
- Maintain existing Users and Media collections

Part of Story 2.1 - Phase 2
```

### Objective

Create a barrel export file and register the new collections in the Payload configuration.

### Files Changed

| File                       | Action | Changes                  |
| -------------------------- | ------ | ------------------------ |
| `src/collections/index.ts` | Create | Barrel export file       |
| `src/payload.config.ts`    | Modify | Register new collections |

### Implementation Details

#### Barrel Export

```typescript
// src/collections/index.ts
export { Users } from './Users'
export { Media } from './Media'
export { Categories } from './Categories'
export { Tags } from './Tags'
```

#### Config Update

Update `src/payload.config.ts`:

```typescript
// Before
import { Users } from './collections/Users'
import { Media } from './collections/Media'
// ...
collections: [Users, Media],

// After
import { Users, Media, Categories, Tags } from './collections'
// ...
collections: [Users, Media, Categories, Tags],
```

### Verification Steps

1. **Syntax Check**: Ensure no TypeScript errors

   ```bash
   pnpm tsc --noEmit
   ```

2. **Dev Server**: Start and verify collections load

   ```bash
   pnpm dev
   ```

3. **Admin UI**: Navigate to `/admin` and verify:
   - Categories collection appears in sidebar
   - Tags collection appears in sidebar

### Success Criteria

- [ ] `src/collections/index.ts` file created
- [ ] All collections exported from barrel file
- [ ] `payload.config.ts` imports from barrel
- [ ] Categories and Tags visible in admin sidebar
- [ ] No TypeScript compilation errors
- [ ] Dev server starts without errors

### Estimated Time

- Implementation: 20 minutes
- Verification: 10 minutes
- **Total**: 30 minutes

---

## Commit 4: Generate and Apply Migration

### Commit Message

```
chore(db): generate and apply migration for Categories and Tags

- Generate D1 migration for new collections schema
- Apply migration to local database
- Regenerate TypeScript types with new collections

Part of Story 2.1 - Phase 2
```

### Objective

Generate the database migration for the new collections and regenerate TypeScript types.

### Files Changed

| File                   | Action     | Changes                |
| ---------------------- | ---------- | ---------------------- |
| `src/migrations/*.ts`  | Generate   | New migration file     |
| `src/payload-types.ts` | Regenerate | Updated with new types |

### Implementation Details

#### Step 1: Generate Migration

```bash
pnpm payload migrate:create
```

This will create a new migration file in `src/migrations/` with the schema for Categories and Tags tables.

#### Step 2: Apply Migration

```bash
pnpm payload migrate
```

#### Step 3: Regenerate Types

```bash
pnpm generate:types:payload
```

### Expected Migration Content

The migration will create:

**categories table**:

- `id` - Primary key
- `name` - Text (localized via separate table or JSON)
- `slug` - Text, UNIQUE
- `description` - Text (localized)
- `color` - Text
- `icon` - Text
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

**tags table**:

- `id` - Primary key
- `name` - Text (localized)
- `slug` - Text, UNIQUE
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

**Localization tables** (Payload handles automatically):

- `categories_locales`
- `tags_locales`

### Expected Type Changes

The `payload-types.ts` will include:

```typescript
export interface Category {
  id: number
  name: string
  slug: string
  description?: string | null
  color?: string | null
  icon?: string | null
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: number
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}
```

### Verification Steps

1. **Migration Generated**:

   ```bash
   ls -la src/migrations/
   ```

2. **Migration Applied**:

   ```bash
   pnpm payload migrate
   ```

3. **Types Generated**:

   ```bash
   pnpm generate:types:payload
   grep -A 5 "interface Category" src/payload-types.ts
   grep -A 5 "interface Tag" src/payload-types.ts
   ```

4. **Build Verification**:
   ```bash
   pnpm build
   ```

### Success Criteria

- [ ] Migration file created in `src/migrations/`
- [ ] Migration applies without errors
- [ ] `payload-types.ts` includes `Category` interface
- [ ] `payload-types.ts` includes `Tag` interface
- [ ] `pnpm build` succeeds
- [ ] No TypeScript errors

### Estimated Time

- Migration generation: 10 minutes
- Migration application: 10 minutes
- Type regeneration: 5 minutes
- Verification: 20 minutes
- **Total**: 45 minutes

---

## Implementation Order

```
┌─────────────────────────────────────┐
│  Commit 1: Categories Collection    │
│  - Create src/collections/Categories.ts
│  - Verify TypeScript compiles       │
└─────────────────┬───────────────────┘
                  │
                  v
┌─────────────────────────────────────┐
│  Commit 2: Tags Collection          │
│  - Create src/collections/Tags.ts   │
│  - Verify TypeScript compiles       │
└─────────────────┬───────────────────┘
                  │
                  v
┌─────────────────────────────────────┐
│  Commit 3: Barrel & Config          │
│  - Create collections/index.ts      │
│  - Update payload.config.ts         │
│  - Verify admin UI                  │
└─────────────────┬───────────────────┘
                  │
                  v
┌─────────────────────────────────────┐
│  Commit 4: Migration & Types        │
│  - Generate migration               │
│  - Apply migration                  │
│  - Regenerate types                 │
└─────────────────────────────────────┘
```

---

## Rollback Strategy

### Commit 1-2 Rollback

If issues occur after Commits 1 or 2:

```bash
# Revert the collection file
git revert HEAD
# Or simply delete the file if not committed
rm src/collections/Categories.ts  # or Tags.ts
```

### Commit 3 Rollback

If issues occur after Commit 3:

```bash
# Revert the config changes
git revert HEAD

# Restore original imports in payload.config.ts
```

### Commit 4 Rollback

If issues occur after Commit 4:

```bash
# Revert migration (requires manual database cleanup)
git revert HEAD

# If migration was applied, manual cleanup needed
# Contact team for database restoration
```

**Note**: Migration rollback is complex. Always backup before applying migrations.

---

## Testing During Implementation

### After Commit 1

| Test       | Command                            | Expected Result                         |
| ---------- | ---------------------------------- | --------------------------------------- |
| TypeScript | `pnpm tsc --noEmit`                | No errors (collection not imported yet) |
| File       | `ls src/collections/Categories.ts` | File exists                             |

### After Commit 2

| Test       | Command                      | Expected Result                         |
| ---------- | ---------------------------- | --------------------------------------- |
| TypeScript | `pnpm tsc --noEmit`          | No errors (collection not imported yet) |
| File       | `ls src/collections/Tags.ts` | File exists                             |

### After Commit 3

| Test         | Command             | Expected Result             |
| ------------ | ------------------- | --------------------------- |
| TypeScript   | `pnpm tsc --noEmit` | No errors                   |
| Dev Server   | `pnpm dev`          | Server starts               |
| Admin Access | Browser: `/admin`   | Login page loads            |
| Collections  | Admin sidebar       | Categories and Tags visible |

### After Commit 4

| Test            | Command                       | Expected Result |
| --------------- | ----------------------------- | --------------- |
| Migration       | `pnpm payload migrate`        | Success         |
| Type Generation | `pnpm generate:types:payload` | Success         |
| Build           | `pnpm build`                  | Success         |
| Lint            | `pnpm lint`                   | No errors       |
| CRUD Test       | Create category in admin      | Success         |

---

## Common Issues & Solutions

### Issue 1: Collection Not Appearing in Admin

**Symptom**: Categories/Tags not visible in admin sidebar

**Solution**:

1. Verify collection is exported from barrel file
2. Verify collection is registered in `payload.config.ts`
3. Hard refresh browser (Ctrl+Shift+R)
4. Check browser console for errors

### Issue 2: Migration Fails

**Symptom**: `pnpm payload migrate` fails with error

**Solution**:

```bash
# Clear cache
rm -rf .next

# Check D1 bindings
pnpm exec wrangler d1 list

# Try generating migration again
pnpm payload migrate:create
```

### Issue 3: Unique Constraint Error

**Symptom**: Cannot create category/tag with same slug

**Solution**: This is expected behavior. Slugs must be unique. Use a different slug value.

### Issue 4: Localized Field Not Switching

**Symptom**: Field content same in both languages

**Solution**:

1. Verify field has `localized: true`
2. Use language toggle in admin to switch
3. Save content in each language separately

---

## Code Quality Checklist

### Before Each Commit

- [ ] Code follows project style guide
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] TypeScript strict mode passes
- [ ] Admin descriptions added to fields

### Commit Message Format

Follow Gitmoji convention:

```
<type>(<scope>): <description>

<body>

<footer>
```

Types used in this phase:

- `feat`: New feature (collections)
- `chore`: Maintenance task (migration, types)

---

## References

- [Payload Collections Documentation](https://payloadcms.com/docs/configuration/collections)
- [Payload Fields Documentation](https://payloadcms.com/docs/fields/overview)
- [Payload i18n Localized Fields](https://payloadcms.com/docs/configuration/localization)
- [Project CLAUDE.md](../../../../../../CLAUDE.md) - Commit conventions

---

## Next Steps

After completing all commits:

1. **Verify all success criteria** in [VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)
2. **Update EPIC_TRACKING.md** with Phase 2 completion
3. **Proceed to Phase 3**: Articles Collection

---

**Implementation Status**: READY TO START
