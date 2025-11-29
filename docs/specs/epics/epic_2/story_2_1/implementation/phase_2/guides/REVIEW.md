# Phase 2: Categories & Tags Collections - Code Review Guide

## Overview

This guide provides code review criteria for Phase 2. Use this when reviewing commits or pull requests related to the Categories and Tags collections.

---

## Review Checklist Summary

| Category        | Items | Priority |
| --------------- | ----- | -------- |
| Code Quality    | 8     | High     |
| Type Safety     | 5     | High     |
| i18n Compliance | 4     | High     |
| Security        | 3     | Medium   |
| Performance     | 3     | Low      |
| Documentation   | 4     | Medium   |

---

## Commit-by-Commit Review

### Commit 1: Categories Collection

**File**: `src/collections/Categories.ts`

#### Code Quality

- [ ] File exports named constant `Categories` of type `CollectionConfig`
- [ ] Collection slug is `'categories'` (lowercase, plural)
- [ ] All required fields present: `name`, `slug`, `description`, `color`, `icon`
- [ ] Field order is logical (required first, optional last)
- [ ] No unused imports
- [ ] No console.log statements

#### Type Safety

- [ ] Import uses `type` keyword: `import type { CollectionConfig }`
- [ ] No `any` types
- [ ] Field types match Payload field type specs

#### i18n Compliance

- [ ] `name` field has `localized: true`
- [ ] `description` field has `localized: true`
- [ ] `slug` field does NOT have `localized: true` (intentional)
- [ ] `color` and `icon` are NOT localized (intentional)

#### Security

- [ ] No hardcoded secrets
- [ ] `slug` has `unique: true` constraint
- [ ] Required fields properly marked

#### Admin Configuration

- [ ] `useAsTitle` set to `'name'`
- [ ] `defaultColumns` includes useful columns
- [ ] `group` is set to `'Content'`
- [ ] Admin descriptions are helpful and accurate

---

### Commit 2: Tags Collection

**File**: `src/collections/Tags.ts`

#### Code Quality

- [ ] File exports named constant `Tags` of type `CollectionConfig`
- [ ] Collection slug is `'tags'` (lowercase, plural)
- [ ] All required fields present: `name`, `slug`
- [ ] Schema is minimal (no unnecessary fields)
- [ ] No unused imports
- [ ] No console.log statements

#### Type Safety

- [ ] Import uses `type` keyword: `import type { CollectionConfig }`
- [ ] No `any` types
- [ ] Field types match Payload field type specs

#### i18n Compliance

- [ ] `name` field has `localized: true`
- [ ] `slug` field does NOT have `localized: true` (intentional)

#### Security

- [ ] `slug` has `unique: true` constraint
- [ ] Required fields properly marked

#### Admin Configuration

- [ ] `useAsTitle` set to `'name'`
- [ ] `defaultColumns` includes useful columns
- [ ] `group` is set to `'Content'`
- [ ] Admin descriptions are helpful

---

### Commit 3: Barrel Export and Config Update

**Files**: `src/collections/index.ts`, `src/payload.config.ts`

#### Barrel Export (`index.ts`)

- [ ] All collections are exported: Users, Media, Categories, Tags
- [ ] Export order is consistent
- [ ] No circular dependencies
- [ ] File is minimal (exports only)

#### Config Update (`payload.config.ts`)

- [ ] Imports from barrel: `import { ... } from './collections'`
- [ ] Collections array includes all 4 collections
- [ ] Collection order is logical (core first, content after)
- [ ] No duplicate imports
- [ ] No breaking changes to existing config

---

### Commit 4: Migration and Types

**Files**: `src/migrations/*.ts`, `src/payload-types.ts`

#### Migration File

- [ ] Migration file has timestamp prefix
- [ ] Creates `categories` table with correct columns
- [ ] Creates `tags` table with correct columns
- [ ] Includes localization tables if applicable
- [ ] Has down migration (rollback capability)
- [ ] No SQL syntax errors

#### Type Definitions

- [ ] `Category` interface exists
- [ ] `Category` includes all fields: id, name, slug, description, color, icon, timestamps
- [ ] `Tag` interface exists
- [ ] `Tag` includes all fields: id, name, slug, timestamps
- [ ] Types match collection definitions
- [ ] No TypeScript errors

---

## Detailed Review Criteria

### Code Quality Standards

#### Naming Conventions

| Element          | Convention       | Example           |
| ---------------- | ---------------- | ----------------- |
| Collection const | PascalCase       | `Categories`      |
| Collection slug  | lowercase-plural | `'categories'`    |
| Field name       | camelCase        | `metaDescription` |
| File name        | PascalCase.ts    | `Categories.ts`   |

#### Import Order

```typescript
// 1. Type imports
import type { CollectionConfig } from 'payload'

// 2. Regular imports (if any)
// None expected in collection files
```

#### Field Definition Order

```typescript
fields: [
  // 1. Primary/required fields first
  { name: 'name', ... required: true },
  { name: 'slug', ... required: true },

  // 2. Optional content fields
  { name: 'description', ... },

  // 3. Configuration/metadata fields
  { name: 'color', ... },
  { name: 'icon', ... },
]
```

### i18n Best Practices

#### Localized Fields (Should Have `localized: true`)

| Field         | Collection | Localized | Reason                           |
| ------------- | ---------- | --------- | -------------------------------- |
| `name`        | Both       | Yes       | Displayed in UI per language     |
| `description` | Categories | Yes       | Content field, needs translation |

#### Non-Localized Fields (Should NOT Have `localized: true`)

| Field   | Collection | Localized | Reason                               |
| ------- | ---------- | --------- | ------------------------------------ |
| `slug`  | Both       | No        | URL identifier, must be consistent   |
| `color` | Categories | No        | Visual config, same across languages |
| `icon`  | Categories | No        | Visual config, same across languages |

### Security Checklist

#### Data Validation

- [ ] Required fields are marked `required: true`
- [ ] Unique constraints on `slug` fields
- [ ] No SQL injection vectors (handled by Payload)
- [ ] No XSS vectors in text fields (handled by Payload)

#### Access Control

For Phase 2, default Payload access control is acceptable. Collections will inherit:

- Read: Authenticated users
- Create/Update/Delete: Admin users

**Note**: Custom access control can be added later if needed.

### Performance Considerations

#### Index Candidates

| Field  | Collection | Index Recommended | Reason            |
| ------ | ---------- | ----------------- | ----------------- |
| `slug` | Both       | Yes (automatic)   | Unique constraint |
| `name` | Both       | Optional          | Frequent queries  |

Payload handles indexing for unique fields automatically.

#### Query Optimization

- [ ] No N+1 query patterns introduced
- [ ] No unnecessary field population
- [ ] Default columns are minimal but useful

---

## Common Review Issues

### Issue 1: Missing Localization

**Problem**:

```typescript
// Wrong - name should be localized
{ name: 'name', type: 'text', required: true }
```

**Solution**:

```typescript
// Correct
{ name: 'name', type: 'text', localized: true, required: true }
```

### Issue 2: Wrong Import Style

**Problem**:

```typescript
// Wrong - not using type import
import { CollectionConfig } from 'payload'
```

**Solution**:

```typescript
// Correct - using type import
import type { CollectionConfig } from 'payload'
```

### Issue 3: Missing Unique Constraint

**Problem**:

```typescript
// Wrong - slug should be unique
{ name: 'slug', type: 'text', required: true }
```

**Solution**:

```typescript
// Correct
{ name: 'slug', type: 'text', unique: true, required: true }
```

### Issue 4: Localized Slug

**Problem**:

```typescript
// Wrong - slug should NOT be localized
{ name: 'slug', type: 'text', localized: true, unique: true, required: true }
```

**Solution**:

```typescript
// Correct - slug is not localized
{ name: 'slug', type: 'text', unique: true, required: true }
```

### Issue 5: Missing Admin Descriptions

**Problem**:

```typescript
// Missing helpful description
{ name: 'color', type: 'text' }
```

**Solution**:

```typescript
// With helpful description
{
  name: 'color',
  type: 'text',
  admin: {
    description: 'Hex color code for visual identity (e.g., "#FF5733")',
  },
}
```

---

## Review Process

### Pre-Review Checklist

Before reviewing:

1. [ ] Pull latest code from branch
2. [ ] Run `pnpm tsc --noEmit` - no TypeScript errors
3. [ ] Run `pnpm lint` - no linting errors
4. [ ] Run `pnpm build` - build succeeds

### Review Steps

1. **Read the commit message**
   - Does it follow Gitmoji convention?
   - Does it describe the change accurately?

2. **Review file changes**
   - Are changes limited to expected files?
   - Are there any unexpected changes?

3. **Check code quality**
   - Use the commit-specific checklist above

4. **Test functionality**
   - Start dev server: `pnpm dev`
   - Verify collections appear in admin
   - Create test entries
   - Test i18n switching

### Post-Review Actions

#### If Approved

- [ ] Approve PR/commit
- [ ] Note any minor suggestions for future

#### If Changes Requested

- [ ] Document specific issues found
- [ ] Reference relevant section of this guide
- [ ] Request re-review after fixes

---

## Approval Criteria

### Minimum for Approval

- [ ] All "High" priority items pass
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Build succeeds
- [ ] Collections functional in admin

### Ideal State

- [ ] All checklist items pass
- [ ] Code is clean and well-organized
- [ ] Admin descriptions are helpful
- [ ] i18n behavior is correct

---

## References

- [Payload Collections Documentation](https://payloadcms.com/docs/configuration/collections)
- [Payload Fields Documentation](https://payloadcms.com/docs/fields/overview)
- [Payload Localization](https://payloadcms.com/docs/configuration/localization)
- [Project CLAUDE.md](../../../../../../CLAUDE.md) - Commit conventions

---

**Review Guide Status**: READY FOR USE
