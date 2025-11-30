# Phase 3 - Atomic Implementation Plan

**Objective**: Créer la collection Articles complète avec relations, hooks, SEO localisé et workflow de statut

---

## 🎯 Overview

### Why an Atomic Approach?

The implementation is split into **5 independent commits** to:

✅ **Facilitate review** - Each commit focuses on a single responsibility
✅ **Enable rollback** - If a commit has issues, revert it without breaking everything
✅ **Progressive type-safety** - Types validate at each step
✅ **Tests as you go** - Tests accompany the relevant code
✅ **Continuous documentation** - Each commit can be documented independently

### Global Strategy

```
[Hook]  →  [Base]  →  [Relations]  →  [Integration]  →  [Tests]
  ↓          ↓           ↓               ↓                ↓
100%       100%        100%            100%             100%
tested     types      validated       working          coverage
```

**Progression Logic**:
1. **Hook First**: Independent utility, testable in isolation
2. **Base Structure**: Core fields without complexity
3. **Relations & SEO**: Add dependencies on other collections
4. **Integration**: Wire everything together with hooks and workflow
5. **Tests**: Validate complete functionality

---

## 📦 The 5 Atomic Commits

### Commit 1: Create calculateReadingTime Hook

**Files**:
- `src/hooks/calculateReadingTime.ts` (new)
- `src/hooks/index.ts` (new)
- `tests/unit/calculateReadingTime.spec.ts` (new)

**Size**: ~100 lines
**Duration**: 45-60 min (implementation) + 20-30 min (review)

**Content**:
- Hook function that extracts text from Lexical rich text content
- Calculates word count and reading time (200 words/min average)
- Properly typed for Payload `CollectionBeforeChangeHook`
- Barrel export in `src/hooks/index.ts`
- Unit tests covering edge cases (empty content, rich formatting, etc.)

**Why it's atomic**:
- **Single responsibility**: Only handles reading time calculation
- **No dependencies**: Works independently of collection definition
- **Testable**: Can be unit tested without database or Payload runtime
- **Reusable**: Could be used by other collections in the future

**Technical Validation**:
```bash
# Type checking
pnpm exec tsc --noEmit

# Run unit tests
pnpm test:unit

# Lint
pnpm lint
```

**Expected Result**: Hook compiles, all unit tests pass, no lint errors

**Review Criteria**:
- [ ] Hook correctly extracts text from Lexical JSON structure
- [ ] Reading time calculation is accurate (200 words/min)
- [ ] Handles edge cases (null, empty, no content field)
- [ ] Type signature matches `CollectionBeforeChangeHook`
- [ ] Unit tests cover all branches
- [ ] JSDoc comments explain algorithm

---

### Commit 2: Create Articles Collection Base Structure

**Files**:
- `src/collections/Articles.ts` (new)
- `src/collections/index.ts` (modify - add export)
- `src/payload.config.ts` (modify - register collection)
- `src/payload-types.ts` (regenerate)

**Size**: ~150 lines
**Duration**: 60-75 min (implementation) + 30-40 min (review)

**Content**:
- Create `Articles` collection with core fields:
  - `title` (text, localized, required)
  - `content` (richText, localized - Lexical editor)
  - `excerpt` (textarea, localized)
  - `slug` (text, unique, required)
- Admin configuration (`useAsTitle`, `defaultColumns`)
- Export from `src/collections/index.ts`
- Register in `payload.config.ts` collections array
- Regenerate types with `pnpm generate:types:payload`

**Why it's atomic**:
- **Single responsibility**: Core content fields only
- **No external dependencies**: No relations to other collections yet
- **Type-safe**: Types regenerate and validate immediately
- **Minimal migration**: Simple table creation

**Technical Validation**:
```bash
# Regenerate types
pnpm generate:types:payload

# Type checking
pnpm exec tsc --noEmit

# Dev server (verify admin UI)
pnpm dev
# Navigate to http://localhost:3000/admin/collections/articles
```

**Expected Result**:
- Articles collection appears in admin sidebar
- Can create article with title, content, excerpt, slug
- Language toggle (FR/EN) works for localized fields
- Types compile without errors

**Review Criteria**:
- [ ] Collection slug is `articles`
- [ ] `useAsTitle` is set to `title`
- [ ] Localized fields (`title`, `content`, `excerpt`) marked correctly
- [ ] `slug` is unique and required
- [ ] Lexical editor configured for `content` field
- [ ] Collection exported and registered in config
- [ ] Types regenerated successfully
- [ ] No TypeScript errors

---

### Commit 3: Add Relations and SEO Fields to Articles

**Files**:
- `src/collections/Articles.ts` (modify)
- `src/payload-types.ts` (regenerate)

**Size**: ~120 lines
**Duration**: 60-75 min (implementation) + 30-40 min (review)

**Content**:
- Add relationship fields:
  - `featuredImage` → `media` (1:1 upload relation)
  - `category` → `categories` (N:1 relation)
  - `tags` → `tags` (N:N relation, `hasMany: true`)
  - `author` → `users` (N:1 relation)
- Add SEO group (localized):
  - `seo.metaTitle` (text, localized)
  - `seo.metaDescription` (textarea, localized)
- Regenerate types

**Why it's atomic**:
- **Single responsibility**: Relations and SEO metadata only
- **Depends on**: Phase 2 (Categories/Tags), existing Users and Media collections
- **Type-safe**: Relationship types validate against target collections
- **Testable**: Can verify relations in admin UI

**Technical Validation**:
```bash
# Regenerate types
pnpm generate:types:payload

# Type checking
pnpm exec tsc --noEmit

# Dev server (verify relations work)
pnpm dev
# Create article → Select category, tags, image, author
```

**Expected Result**:
- Article form shows relation pickers for category, tags, featured image, author
- SEO group appears with localized meta fields
- Selecting relations works and saves correctly
- Types include proper relation types

**Review Criteria**:
- [ ] `featuredImage` relation points to `media` collection
- [ ] `category` relation points to `categories` (singular)
- [ ] `tags` relation has `hasMany: true` and points to `tags`
- [ ] `author` relation points to `users`
- [ ] SEO group fields are localized
- [ ] SEO fields use `type: 'group'` correctly
- [ ] Types regenerated successfully
- [ ] No TypeScript errors

---

### Commit 4: Add Hooks and Status Workflow to Articles

**Files**:
- `src/collections/Articles.ts` (modify)
- `src/payload-types.ts` (regenerate)

**Size**: ~80 lines
**Duration**: 45-60 min (implementation) + 25-35 min (review)

**Content**:
- Add metadata fields:
  - `publishedAt` (date field)
  - `status` (select: draft/published/archived, default: draft)
  - `readingTime` (number, admin read-only)
- Add `beforeChange` hook: `calculateReadingTime`
- Update `admin.defaultColumns` to include `status` and `publishedAt`
- Regenerate types

**Why it's atomic**:
- **Single responsibility**: Workflow and automation only
- **Depends on**: Commit 1 (hook) and Commit 2/3 (collection structure)
- **Type-safe**: Hook integration validates against collection schema
- **Testable**: Reading time auto-calculation can be tested

**Technical Validation**:
```bash
# Regenerate types
pnpm generate:types:payload

# Type checking
pnpm exec tsc --noEmit

# Dev server (test hook)
pnpm dev
# Create article with content → Save → Verify readingTime is calculated
```

**Expected Result**:
- Status dropdown shows draft/published/archived
- Creating article auto-sets status to "draft"
- Saving article with content auto-calculates `readingTime`
- `readingTime` field is read-only in admin
- `publishedAt` date picker works

**Review Criteria**:
- [ ] Status field options: `['draft', 'published', 'archived']`
- [ ] Status default value is `'draft'`
- [ ] `publishedAt` is type `date`
- [ ] `readingTime` is type `number` and `admin.readOnly: true`
- [ ] `beforeChange` hook array includes `calculateReadingTime`
- [ ] Hook import path is correct
- [ ] `defaultColumns` updated appropriately
- [ ] Types regenerated successfully

---

### Commit 5: Add Articles Collection Integration Tests

**Files**:
- `tests/int/articles.int.spec.ts` (new)

**Size**: ~200 lines
**Duration**: 90-120 min (implementation) + 45-60 min (review)

**Content**:
- Integration tests using Vitest + Payload Local API
- Test scenarios:
  1. **CRUD Operations**: Create, read, update, delete articles
  2. **i18n Behavior**: Create in FR, verify EN fallback
  3. **Relations**: Create article with category, tags, author, featuredImage
  4. **Hook Execution**: Verify `readingTime` auto-calculation
  5. **Status Workflow**: Test draft → published → archived transitions
  6. **Slug Uniqueness**: Verify unique constraint enforcement
  7. **SEO Localization**: Verify SEO fields switch with locale
- Use `getPayload()` to access Payload API directly
- Proper setup/teardown (create/delete test data)

**Why it's atomic**:
- **Single responsibility**: Testing only, no implementation code
- **Depends on**: All previous commits (complete Articles collection)
- **Comprehensive coverage**: Validates all features end-to-end
- **Safe**: Tests don't modify dev database (use test environment)

**Technical Validation**:
```bash
# Run integration tests
pnpm test:int

# Coverage report
pnpm exec vitest run --coverage tests/int/articles.int.spec.ts

# Verify all tests pass
```

**Expected Result**: All integration tests pass (>15 test cases)

**Review Criteria**:
- [ ] Tests use `getPayload()` for Local API access
- [ ] Setup creates necessary test data (categories, tags, users, media)
- [ ] Teardown cleans up test data
- [ ] CRUD operations test all fields
- [ ] i18n tests verify FR/EN localization
- [ ] Relations tests verify category, tags, author, featuredImage
- [ ] Hook test verifies `readingTime` calculation
- [ ] Status workflow test covers all transitions
- [ ] Slug uniqueness test expects proper error
- [ ] SEO localization test verifies locale-specific values
- [ ] Tests are well-structured with `describe`/`it` blocks
- [ ] Assertions use appropriate matchers (`toBe`, `toEqual`, `toBeDefined`, etc.)

---

## 🔄 Implementation Workflow

### Step-by-Step

1. **Read specification**: Understand requirements fully (PHASES_PLAN.md)
2. **Setup environment**: Follow ENVIRONMENT_SETUP.md (verify Phase 2 complete)
3. **Implement Commit 1**: Follow COMMIT_CHECKLIST.md → Hook + unit tests
4. **Validate Commit 1**: Run tests, typecheck, lint
5. **Review Commit 1**: Self-review against criteria
6. **Commit Commit 1**: Use provided commit message format
7. **Implement Commit 2**: Base collection structure
8. **Validate Commit 2**: Regenerate types, verify admin UI
9. **Review Commit 2**: Check collection config and types
10. **Commit Commit 2**: Commit with message
11. **Repeat for Commits 3-5**
12. **Final validation**: Complete VALIDATION_CHECKLIST.md

### Validation at Each Step

After each commit:
```bash
# Type checking
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Tests (Commit 1 and 5 only)
pnpm test:unit  # Commit 1
pnpm test:int   # Commit 5

# Dev server (Commits 2-4)
pnpm dev
# Manual verification in admin UI
```

All must pass before moving to next commit.

---

## 📊 Commit Metrics

| Commit                    | Files | Lines | Implementation | Review  | Total   |
| ------------------------- | ----- | ----- | -------------- | ------- | ------- |
| 1. Reading Time Hook      | 3     | ~100  | 45-60 min      | 20-30 min | 65-90 min |
| 2. Base Structure         | 4     | ~150  | 60-75 min      | 30-40 min | 90-115 min |
| 3. Relations & SEO        | 2     | ~120  | 60-75 min      | 30-40 min | 90-115 min |
| 4. Hooks & Workflow       | 2     | ~80   | 45-60 min      | 25-35 min | 70-95 min |
| 5. Integration Tests      | 1     | ~200  | 90-120 min     | 45-60 min | 135-180 min |
| **TOTAL**                 | **12** | **~650** | **5-6.5h**     | **2.5-3.5h** | **7.5-10h** |

---

## ✅ Atomic Approach Benefits

### For Developers

- 🎯 **Clear focus**: One thing at a time (hook → base → relations → integration → tests)
- 🧪 **Testable**: Hook tested immediately, collection validated progressively
- 📝 **Documented**: Each commit has clear purpose and message

### For Reviewers

- ⚡ **Fast review**: 20-60 min per commit
- 🔍 **Focused**: Single responsibility per commit
- ✅ **Quality**: Easier to spot issues in isolated changes

### For the Project

- 🔄 **Rollback-safe**: Can revert relations or workflow without losing base structure
- 📚 **Historical**: Git history shows clear progression
- 🏗️ **Maintainable**: Easy to understand how Articles collection was built

---

## 📝 Best Practices

### Commit Messages

Format (following Gitmoji convention):
```
🎨 type(scope): short description (max 50 chars)

- Point 1: detail
- Point 2: detail
- Point 3: justification if needed

Part of Phase 3 - Commit X/5
```

Gitmoji types for this phase:
- ✨ `feat`: New features (collection, fields, hooks)
- ✅ `test`: Tests
- ♻️ `refactor`: Code restructuring (if needed)
- 📝 `docs`: Documentation updates

**Example**:
```
✨ feat(collections): create Articles collection base structure

- Add core fields: title, content, excerpt, slug
- Configure Lexical editor for rich text content
- Set up localization for FR/EN support
- Register collection in payload.config.ts

Part of Phase 3 - Commit 2/5
```

### Review Checklist

Before committing:

- [ ] Code follows Payload CMS best practices
- [ ] All tests pass (if applicable)
- [ ] Types regenerated and compile correctly
- [ ] No console.logs or debug code
- [ ] Admin UI manually verified (Commits 2-4)
- [ ] Commit message uses correct Gitmoji
- [ ] Commit message describes what and why

---

## ⚠️ Important Points

### Do's

- ✅ Follow the commit order (hook → base → relations → integration → tests)
- ✅ Regenerate types after collection changes (`pnpm generate:types:payload`)
- ✅ Test in admin UI after each collection modification
- ✅ Use provided commit message format with Gitmoji
- ✅ Verify Phase 2 is complete before starting (Categories and Tags exist)

### Don'ts

- ❌ Skip the hook commit - it must be isolated for testing
- ❌ Combine relations and workflow in same commit
- ❌ Commit without regenerating types
- ❌ Add features not in the spec (keep it focused)
- ❌ Modify Phase 2 collections (Categories/Tags are dependencies)

---

## 🔧 Payload CMS Specific Patterns

### Collection Definition Pattern

```typescript
import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt'],
  },
  fields: [
    // Localized content fields
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    // ...
  ],
  hooks: {
    beforeChange: [
      // Import from src/hooks
      calculateReadingTime,
    ],
  },
}
```

### Hook Pattern

```typescript
import type { CollectionBeforeChangeHook } from 'payload'
import type { Article } from '@/payload-types'

export const calculateReadingTime: CollectionBeforeChangeHook<Article> = async ({
  data,
  req,
  operation,
  context, // Added for infinite loop protection
}) => {
  // Prevent infinite loops if hook is called recursively
  if (context?.skipReadingTimeHook) {
    return data
  }

  // Hook logic here
  return data
}
```

### Relationship Field Pattern

```typescript
{
  name: 'category',
  type: 'relationship',
  relationTo: 'categories', // Must match target collection slug
  required: false,
}

{
  name: 'tags',
  type: 'relationship',
  relationTo: 'tags',
  hasMany: true, // N:N relationship
}
```

### SEO Group Pattern

```typescript
{
  name: 'seo',
  type: 'group',
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      localized: true,
    },
  ],
}
```

---

## ❓ FAQ

**Q: Why create the hook before the collection?**
A: The hook is a reusable utility that can be unit tested in isolation. Creating it first allows us to validate the reading time calculation logic before integrating it into the collection. This follows the principle of building and testing small, focused pieces before combining them.

**Q: Can I test the collection without creating all test scenarios?**
A: No. Integration tests are critical for validating that all features work together correctly. Comprehensive tests prevent regressions and ensure the collection behaves as expected in production.

**Q: What if the migration fails?**
A: Ensure Phase 2 migrations ran successfully first. If Phase 3 migration fails, check the generated migration file in `src/migrations/`. You may need to manually adjust or re-run migrations. Always test migrations locally before deploying.

**Q: Should I add timestamps (createdAt, updatedAt)?**
A: Payload automatically adds these fields to all collections. You don't need to define them manually. They are available in the types as `Article['createdAt']` and `Article['updatedAt']`.

**Q: How do I test the Lexical content extraction in the hook?**
A: The unit test should create mock Lexical JSON structures with various content types (paragraphs, headings, lists, code blocks) and verify the hook correctly extracts plain text and calculates word count. Test edge cases like empty content, null content, and content with only formatting.

**Q: Can I modify the reading time calculation algorithm later?**
A: Yes. Since the hook is isolated and unit tested, you can easily modify the algorithm (e.g., change words per minute, handle code blocks differently) and update the tests. The atomic structure makes this safe and easy to review.

**Q: Why use `overrideAccess: false` in integration tests?**
A: By default, Payload's Local API bypasses ALL access control, even when passing a user. Without `overrideAccess: false`, tests won't validate actual permissions, creating a false sense of security. Always use `overrideAccess: false` when testing operations on behalf of a user.

**Q: How do I prevent infinite loops in hooks?**
A: Use the `context` parameter to set flags that skip hook execution in recursive calls. For example, `context.skipReadingTimeHook` prevents the calculateReadingTime hook from running when you update an article from within another hook.
