# Phase 3 - Checklist per Commit

This document provides a detailed checklist for each atomic commit of Phase 3.

---

## 📋 Commit 1: Create calculateReadingTime Hook

**Files**:
- `src/hooks/calculateReadingTime.ts` (new)
- `src/hooks/index.ts` (new)
- `tests/unit/calculateReadingTime.spec.ts` (new)

**Estimated Duration**: 45-60 minutes

### Implementation Tasks

- [ ] Create `src/hooks/` directory if it doesn't exist
- [ ] Create `src/hooks/calculateReadingTime.ts` file
- [ ] Import necessary Payload types (`CollectionBeforeChangeHook`)
- [ ] Implement function to extract plain text from Lexical JSON structure
  - Handle paragraph nodes
  - Handle heading nodes
  - Handle list nodes
  - Handle text nodes with formatting
  - Handle code blocks
- [ ] Calculate word count from extracted text (split by whitespace)
- [ ] Calculate reading time (words / 200 words per minute, round up)
- [ ] Update `data.readingTime` with calculated value
- [ ] Return modified `data` object
- [ ] Add JSDoc comments explaining algorithm
- [ ] Create `src/hooks/index.ts` barrel export
- [ ] Export `calculateReadingTime` from barrel
- [ ] Create `tests/unit/calculateReadingTime.spec.ts`
- [ ] Write unit test: handles null/undefined content
- [ ] Write unit test: handles empty content object
- [ ] Write unit test: calculates correctly for simple text
- [ ] Write unit test: extracts text from rich formatting (bold, italic)
- [ ] Write unit test: handles headings and paragraphs
- [ ] Write unit test: handles lists
- [ ] Write unit test: handles code blocks
- [ ] Write unit test: rounds up correctly (e.g., 190 words = 1 min, 210 words = 2 min)

### Validation

```bash
# Type checking
pnpm exec tsc --noEmit

# Run unit tests
pnpm test:unit

# Lint
pnpm lint
```

**Expected Result**: All tests pass, no TypeScript errors, no lint errors

### Review Checklist

#### Hook Implementation

- [ ] Function signature matches `CollectionBeforeChangeHook<Article>` (with generic type)
- [ ] Imports `Article` type from `@/payload-types`
- [ ] Includes `context` parameter for infinite loop protection
- [ ] Checks `context?.skipReadingTimeHook` to prevent recursion
- [ ] Handles `data.content` being null, undefined, or missing
- [ ] Text extraction correctly processes Lexical JSON structure
- [ ] Word count calculation splits on whitespace regex (`/\s+/`)
- [ ] Reading time calculation uses 200 words/min constant
- [ ] Reading time rounds up using `Math.ceil()`
- [ ] Hook returns the modified `data` object
- [ ] No side effects (only modifies `data.readingTime`)

#### Type Safety

- [ ] Hook properly typed as `CollectionBeforeChangeHook`
- [ ] No `any` types (unless explicitly justified)
- [ ] Type imports from `payload` package

#### Code Quality

- [ ] Clear function and variable names
- [ ] JSDoc comments explain reading speed assumption (200 words/min)
- [ ] No console.logs or debug statements
- [ ] No commented-out code

#### Tests

- [ ] All test cases pass
- [ ] Edge cases covered (null, empty, various content types)
- [ ] Test descriptions are clear (`it('should ...')`)
- [ ] Proper use of Vitest matchers (`expect`, `toBe`, `toBeUndefined`, etc.)
- [ ] Test coverage >90% for hook logic

### Commit Message

```bash
git add src/hooks/calculateReadingTime.ts src/hooks/index.ts tests/unit/calculateReadingTime.spec.ts
git commit -m "$(cat <<'EOF'
✨ feat(hooks): create calculateReadingTime hook

- Implement Lexical text extraction algorithm
- Calculate word count and reading time (200 words/min)
- Handle edge cases: null content, empty content, rich formatting
- Add comprehensive unit tests (8+ test cases)
- Export from src/hooks barrel

Part of Phase 3 - Commit 1/5
EOF
)"
```

---

## 📋 Commit 2: Create Articles Collection Base Structure

**Files**:
- `src/collections/Articles.ts` (new)
- `src/collections/index.ts` (modify)
- `src/payload.config.ts` (modify)
- `src/payload-types.ts` (regenerate)

**Estimated Duration**: 60-75 minutes

### Implementation Tasks

- [ ] Create `src/collections/Articles.ts` file
- [ ] Import `CollectionConfig` type from Payload
- [ ] Define `Articles` collection config object
- [ ] Set `slug: 'articles'`
- [ ] Configure admin UI:
  - `useAsTitle: 'title'`
  - `defaultColumns: ['title', 'slug']` (we'll add more columns in Commit 4)
- [ ] Add `title` field:
  - Type: `text`
  - Required: `true`
  - Localized: `true`
- [ ] Add `content` field:
  - Type: `richText`
  - Localized: `true`
  - Editor: Lexical (default for richText in Payload 3.x)
- [ ] Add `excerpt` field:
  - Type: `textarea`
  - Localized: `true`
- [ ] Add `slug` field:
  - Type: `text`
  - Required: `true`
  - Unique: `true`
  - Admin: Consider adding a slug field with auto-generation hooks (optional)
- [ ] Export `Articles` as named export
- [ ] Update `src/collections/index.ts`:
  - Add `export { Articles } from './Articles'`
- [ ] Update `src/payload.config.ts`:
  - Import `Articles` from `./collections`
  - Add `Articles` to `collections` array
- [ ] Regenerate types: `pnpm generate:types:payload`

### Validation

```bash
# Regenerate types
pnpm generate:types:payload

# Type checking
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Start dev server
pnpm dev
# Navigate to http://localhost:3000/admin
# Login and verify:
# - Articles collection appears in sidebar
# - Can create new article
# - Language toggle (FR/EN) works
# - Can switch between FR and EN for title, content, excerpt
# - Slug uniqueness is enforced (try creating duplicate slug)
```

**Expected Result**:
- Articles collection visible and functional in admin
- Localized fields switch between FR/EN
- Slug uniqueness enforced
- No TypeScript errors

### Review Checklist

#### Collection Configuration

- [ ] Collection slug is `'articles'`
- [ ] `useAsTitle` is `'title'`
- [ ] `defaultColumns` includes at least `'title'` and `'slug'`
- [ ] No unnecessary or missing fields

#### Field Definitions

- [ ] `title` field:
  - Type `'text'`
  - `required: true`
  - `localized: true`
- [ ] `content` field:
  - Type `'richText'`
  - `localized: true`
  - Uses Lexical editor (default)
- [ ] `excerpt` field:
  - Type `'textarea'`
  - `localized: true`
- [ ] `slug` field:
  - Type `'text'`
  - `required: true`
  - `unique: true` (enforces uniqueness at DB level)
  - `index: true` (for query performance)
  - Includes `beforeChange` hook for auto-generation from title
  - Hook only generates slug on create operation if not provided
  - Uses slugify function (similar to Categories/Tags)

#### Integration

- [ ] Collection exported from `Articles.ts` as named export
- [ ] Collection re-exported from `src/collections/index.ts`
- [ ] Collection registered in `payload.config.ts` collections array
- [ ] Import path in config is correct (`./collections` or `@/collections`)

#### Type Safety

- [ ] Types regenerated successfully
- [ ] `Article` type available in `src/payload-types.ts`
- [ ] No TypeScript compilation errors
- [ ] Article type includes all defined fields with correct types

#### Code Quality

- [ ] Consistent field ordering (content → identifiers is a good pattern)
- [ ] Clear field names matching spec
- [ ] No console.logs or debug code
- [ ] Comments added for complex configurations (if any)

### Commit Message

```bash
git add src/collections/Articles.ts src/collections/index.ts src/payload.config.ts src/payload-types.ts
git commit -m "$(cat <<'EOF'
✨ feat(collections): create Articles collection base structure

- Add core fields: title, content, excerpt, slug
- Configure Lexical editor for rich text content
- Set up localization (FR/EN) for content fields
- Enforce slug uniqueness at database level
- Register collection in payload.config.ts
- Regenerate types with Article interface

Part of Phase 3 - Commit 2/5
EOF
)"
```

---

## 📋 Commit 3: Add Relations and SEO Fields to Articles

**Files**:
- `src/collections/Articles.ts` (modify)
- `src/payload-types.ts` (regenerate)

**Estimated Duration**: 60-75 minutes

### Implementation Tasks

- [ ] Open `src/collections/Articles.ts`
- [ ] Add `featuredImage` relationship field:
  - Name: `'featuredImage'`
  - Type: `'upload'`
  - RelationTo: `'media'`
  - Required: `false` (optional featured image)
- [ ] Add `category` relationship field:
  - Name: `'category'`
  - Type: `'relationship'`
  - RelationTo: `'categories'`
  - Required: `false` (articles can be uncategorized)
- [ ] Add `tags` relationship field:
  - Name: `'tags'`
  - Type: `'relationship'`
  - RelationTo: `'tags'`
  - HasMany: `true` (many-to-many)
  - Required: `false`
- [ ] Add `author` relationship field:
  - Name: `'author'`
  - Type: `'relationship'`
  - RelationTo: `'users'`
  - Required: `false` (consider making required: true if every article must have author)
- [ ] Add `seo` group field:
  - Name: `'seo'`
  - Type: `'group'`
  - Fields array:
    - `metaTitle` (text, localized)
    - `metaDescription` (textarea, localized)
- [ ] Organize fields logically (content → metadata → relations → seo)
- [ ] Regenerate types: `pnpm generate:types:payload`

### Validation

```bash
# Regenerate types
pnpm generate:types:payload

# Type checking
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Dev server
pnpm dev
# Navigate to Articles collection in admin
# Create or edit article and verify:
# - Featured image picker appears and works
# - Category picker appears (lists categories from Phase 2)
# - Tags picker appears (lists tags from Phase 2, can select multiple)
# - Author picker appears (lists users)
# - SEO group appears with metaTitle and metaDescription
# - SEO fields switch between FR/EN
```

**Expected Result**:
- All relation pickers functional
- Can select category, tags, author, featured image
- SEO group displays with localized fields
- Types include proper relation types (e.g., `Article['category']` is `Category | string`)

### Review Checklist

#### Relationship Fields

- [ ] `featuredImage`:
  - Type `'upload'`
  - `relationTo: 'media'`
- [ ] `category`:
  - Type `'relationship'`
  - `relationTo: 'categories'` (singular collection slug)
- [ ] `tags`:
  - Type `'relationship'`
  - `relationTo: 'tags'`
  - `hasMany: true`
- [ ] `author`:
  - Type `'relationship'`
  - `relationTo: 'users'`

#### SEO Group

- [ ] Group name is `'seo'`
- [ ] Group type is `'group'`
- [ ] Contains `metaTitle` field:
  - Type `'text'`
  - `localized: true`
- [ ] Contains `metaDescription` field:
  - Type `'textarea'`
  - `localized: true`

#### Type Safety

- [ ] Types regenerated successfully
- [ ] Relationship types correctly typed (union of Document | string)
- [ ] SEO group typed as nested object
- [ ] No TypeScript errors

#### Code Quality

- [ ] Fields ordered logically (e.g., content → relations → metadata → seo)
- [ ] Consistent indentation and formatting
- [ ] No console.logs

### Commit Message

```bash
git add src/collections/Articles.ts src/payload-types.ts
git commit -m "$(cat <<'EOF'
✨ feat(collections): add relations and SEO fields to Articles

- Add featuredImage upload relation to media collection
- Add category relation (1:N) to categories collection
- Add tags relation (N:N) with hasMany support
- Add author relation to users collection
- Add SEO group with localized metaTitle and metaDescription
- Regenerate types with updated Article interface

Part of Phase 3 - Commit 3/5
EOF
)"
```

---

## 📋 Commit 4: Add Hooks and Status Workflow to Articles

**Files**:
- `src/collections/Articles.ts` (modify)
- `src/payload-types.ts` (regenerate)

**Estimated Duration**: 45-60 minutes

### Implementation Tasks

- [ ] Open `src/collections/Articles.ts`
- [ ] Import `calculateReadingTime` hook from `@/hooks`
- [ ] Add `publishedAt` field:
  - Name: `'publishedAt'`
  - Type: `'date'`
  - Admin: Optional label/description
- [ ] Add `status` field:
  - Name: `'status'`
  - Type: `'select'`
  - Options: `['draft', 'published', 'archived']`
  - DefaultValue: `'draft'`
  - Required: `true`
  - Admin: Consider adding field descriptions
- [ ] Add `readingTime` field:
  - Name: `'readingTime'`
  - Type: `'number'`
  - Admin: `readOnly: true` (calculated by hook, not editable)
  - Label: 'Reading Time (minutes)' or similar
- [ ] Add `hooks` configuration at collection level:
  - `beforeChange: [calculateReadingTime]`
- [ ] Update `admin.defaultColumns` to include `'status'` and `'publishedAt'`
- [ ] Organize fields logically (content → metadata → workflow)
- [ ] Regenerate types: `pnpm generate:types:payload`

### Validation

```bash
# Regenerate types
pnpm generate:types:payload

# Type checking
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Dev server
pnpm dev
# Test in admin:
# 1. Create article with content (200+ words)
# 2. Save article
# 3. Verify readingTime field is populated automatically
# 4. Verify readingTime field is read-only (grayed out)
# 5. Verify status defaults to 'draft'
# 6. Change status to 'published', save
# 7. Verify publishedAt date picker works
# 8. Verify defaultColumns in list view show status and publishedAt
```

**Expected Result**:
- `readingTime` auto-calculates on save
- Status defaults to 'draft'
- Status dropdown shows all three options
- publishedAt date picker functional
- List view shows status and publishedAt columns

### Review Checklist

#### Metadata Fields

- [ ] `publishedAt`:
  - Type `'date'`
  - Optional (not required)
- [ ] `status`:
  - Type `'select'`
  - Options: `['draft', 'published', 'archived']`
  - DefaultValue: `'draft'`
  - Required: `true`
- [ ] `readingTime`:
  - Type `'number'`
  - Admin: `readOnly: true`
  - Clear label (e.g., 'Reading Time (minutes)')

#### Hooks Configuration

- [ ] Hook imported correctly: `import { calculateReadingTime } from '@/hooks'`
- [ ] Hooks object defined at collection level
- [ ] `beforeChange` array includes `calculateReadingTime`
- [ ] No other hooks interfere

#### Admin Configuration

- [ ] `defaultColumns` updated to include `'status'` and `'publishedAt'`
- [ ] Column order makes sense (e.g., `['title', 'status', 'publishedAt']`)

#### Type Safety

- [ ] Types regenerated successfully
- [ ] `Article['status']` typed as `'draft' | 'published' | 'archived'`
- [ ] `Article['readingTime']` typed as `number | null | undefined`
- [ ] `Article['publishedAt']` typed as `string | null | undefined` (ISO date string)
- [ ] No TypeScript errors

#### Code Quality

- [ ] Import statement for hook is correct
- [ ] Fields ordered logically
- [ ] No console.logs

### Commit Message

```bash
git add src/collections/Articles.ts src/payload-types.ts
git commit -m "$(cat <<'EOF'
✨ feat(collections): add hooks and status workflow to Articles

- Add status field with draft/published/archived options
- Add publishedAt date field for publication tracking
- Add readingTime field (auto-calculated, read-only)
- Integrate calculateReadingTime hook in beforeChange
- Update admin defaultColumns to show status and publishedAt
- Regenerate types with workflow fields

Part of Phase 3 - Commit 4/5
EOF
)"
```

---

## 📋 Commit 5: Add Articles Collection Integration Tests

**Files**:
- `tests/int/articles.int.spec.ts` (new)

**Estimated Duration**: 90-120 minutes

### Implementation Tasks

#### Test File Setup

- [ ] Create `tests/int/articles.int.spec.ts` file
- [ ] Import Vitest utilities (`describe`, `it`, `expect`, `beforeAll`, `afterAll`)
- [ ] Import `getPayload` from `@payloadcms/next`
- [ ] Import necessary types from `@/payload-types`
- [ ] Import test config and utilities

#### Test Data Setup

- [ ] Implement `beforeAll` hook:
  - Initialize Payload with `getPayload()`
  - Create test user (for author relation) - uses default `overrideAccess: true` (OK for setup)
  - Create test category (for category relation)
  - Create test tags (2-3 tags for tags relation)
  - Create test media/upload (for featuredImage relation)
  - Store IDs for use in tests
  - **IMPORTANT**: Setup operations can use default `overrideAccess: true`
- [ ] Implement `afterAll` hook:
  - Delete all test articles created during tests
  - Delete test user, category, tags, media
  - Clean up database to prevent pollution
  - Thread `req` through delete operations for transaction safety

#### Test Suite 1: CRUD Operations

- [ ] Test: Create article with all required fields
  - Create article with title (FR), content (FR), slug
  - Verify article created successfully
  - Verify returned article has expected fields
- [ ] Test: Read article by ID
  - Create article
  - Retrieve by ID
  - Verify fields match
- [ ] Test: Update article
  - Create article
  - Update title and content
  - Verify changes persisted
- [ ] Test: Delete article
  - Create article
  - Delete by ID
  - Verify article no longer exists

#### Test Suite 2: i18n Behavior

- [ ] Test: Create article in French, verify English fallback
  - Create article with French title/content
  - Retrieve with `locale: 'en'`
  - Verify English falls back to French (or empty if no fallback configured)
- [ ] Test: Create localized content in both languages
  - Create article with both FR and EN content
  - Retrieve in FR, verify FR content
  - Retrieve in EN, verify EN content
- [ ] Test: SEO fields are localized correctly
  - Create article with FR and EN SEO fields
  - Verify locale-specific retrieval

#### Test Suite 3: Relations

- [ ] Test: Create article with category relation
  - Create article with category ID
  - Retrieve article
  - Verify category is populated or ID is correct
- [ ] Test: Create article with multiple tags
  - Create article with array of tag IDs
  - Verify tags relation saved
- [ ] Test: Create article with author relation
  - Create article with user ID as author
  - Verify author relation
- [ ] Test: Create article with featuredImage
  - Create article with media ID
  - Verify featuredImage upload relation

#### Test Suite 4: Hook Execution (Reading Time)

- [ ] Test: Reading time calculated for short content (~100 words)
  - Create article with ~100 words of content
  - Verify `readingTime === 1` (100/200 = 0.5, rounds up to 1)
- [ ] Test: Reading time calculated for medium content (~400 words)
  - Create article with ~400 words
  - Verify `readingTime === 2`
- [ ] Test: Reading time handles null/empty content
  - Create article with no content
  - Verify `readingTime` is 0 or undefined
- [ ] Test: Reading time updates on content change
  - Create article with short content
  - Update with longer content
  - Verify `readingTime` recalculated

#### Test Suite 5: Status Workflow

- [ ] Test: Article defaults to 'draft' status
  - Create article without specifying status
  - Verify `status === 'draft'`
- [ ] Test: Transition from draft to published
  - Create draft article
  - Update status to 'published'
  - Verify status changed
- [ ] Test: Transition to archived
  - Create published article
  - Update status to 'archived'
  - Verify status changed

#### Test Suite 6: Validation and Constraints

- [ ] Test: Slug uniqueness enforced
  - Create article with slug 'test-slug'
  - Attempt to create another article with same slug
  - Expect error or validation failure
- [ ] Test: Required fields enforced
  - Attempt to create article without `title`
  - Expect validation error
  - Attempt to create article without `slug`
  - Expect validation error

#### Test Suite 7: Access Control and Security

- [ ] Test: Access control enforced with `overrideAccess: false`
  - Create restricted user (non-admin)
  - Attempt to query articles with `overrideAccess: false`
  - Verify only authorized articles returned
  - **CRITICAL**: Always use `overrideAccess: false` when testing user permissions
- [ ] Test: Admin can access all articles
  - Create admin user
  - Query with `overrideAccess: false` and admin user
  - Verify all articles returned
- [ ] Test: Transaction atomicity with threaded `req`
  - Create article with relations in beforeAll/afterAll
  - Thread `req` through all nested operations
  - Verify rollback on failure (if applicable)

#### Code Quality

- [ ] All tests use descriptive names (`it('should calculate reading time for 100-word article')`)
- [ ] Tests are independent (don't rely on execution order)
- [ ] Proper use of `expect()` matchers
- [ ] Tests clean up after themselves
- [ ] No hardcoded IDs or values (use variables from setup)
- [ ] Assertions are meaningful and specific

### Validation

```bash
# Run integration tests
pnpm test:int

# Run only Articles tests
pnpm exec vitest run tests/int/articles.int.spec.ts

# Coverage for Articles tests
pnpm exec vitest run --coverage tests/int/articles.int.spec.ts

# Verify all tests pass (expect 15+ tests)
```

**Expected Result**:
- All 15+ integration tests pass
- No errors or warnings
- Tests execute in <30 seconds
- Coverage >80% for Articles collection logic

### Review Checklist

#### Test Structure

- [ ] Tests organized in `describe` blocks by feature area
- [ ] `beforeAll` creates necessary test data
- [ ] `afterAll` cleans up test data
- [ ] Each test is independent

#### CRUD Tests

- [ ] Create, read, update, delete operations tested
- [ ] Proper assertions for each operation
- [ ] Error cases handled

#### i18n Tests

- [ ] Tests verify FR/EN localization
- [ ] Fallback behavior tested
- [ ] SEO fields localization tested

#### Relation Tests

- [ ] All relations tested (category, tags, author, featuredImage)
- [ ] Verify IDs or populated documents

#### Hook Tests

- [ ] Reading time calculation tested for various content lengths
- [ ] Edge cases tested (null, empty content)
- [ ] Update behavior tested

#### Workflow Tests

- [ ] Default status tested
- [ ] Status transitions tested
- [ ] All status values covered

#### Validation Tests

- [ ] Slug uniqueness tested
- [ ] Required field validation tested

#### Code Quality

- [ ] Clear test descriptions
- [ ] Proper use of `expect()` and matchers
- [ ] No console.logs
- [ ] No skipped tests (unless justified with comment)
- [ ] No flaky tests (run multiple times to verify)

### Commit Message

```bash
git add tests/int/articles.int.spec.ts
git commit -m "$(cat <<'EOF'
✅ test(int): add Articles collection integration tests

- CRUD operations: create, read, update, delete
- i18n behavior: FR/EN localization and fallback
- Relations: category, tags, author, featuredImage
- Hook execution: calculateReadingTime validation
- Status workflow: draft, published, archived transitions
- Validation: slug uniqueness, required fields
- Comprehensive coverage: 15+ test scenarios

Part of Phase 3 - Commit 5/5
EOF
)"
```

---

## ✅ Final Phase Validation

After all 5 commits:

### Complete Phase Checklist

- [ ] All 5 commits completed
- [ ] All unit tests pass (`pnpm test:unit`)
- [ ] All integration tests pass (`pnpm test:int`)
- [ ] TypeScript compiles with no errors (`pnpm exec tsc --noEmit`)
- [ ] Linter passes (`pnpm lint`)
- [ ] Build succeeds (`pnpm build` - if required)
- [ ] Manual verification in admin UI completed
- [ ] VALIDATION_CHECKLIST.md completed
- [ ] EPIC_TRACKING.md updated (Phase 3 marked complete)

### Final Validation Commands

```bash
# Run all tests
pnpm test

# Type check
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Regenerate types one final time
pnpm generate:types:payload

# Verify dev server works
pnpm dev
# Test creating, editing, publishing an article in admin
```

### Manual Verification in Admin UI

- [ ] Navigate to Articles collection
- [ ] Create new article:
  - Fill in title (FR)
  - Add content with Lexical editor (FR) - ~200 words
  - Fill in excerpt (FR)
  - Enter unique slug
  - Select category
  - Select 2-3 tags
  - Upload or select featured image
  - Select author
  - Fill in SEO metaTitle and metaDescription (FR)
  - Verify status defaults to 'draft'
- [ ] Save article
- [ ] Verify `readingTime` calculated and displayed (should be ~1 minute for 200 words)
- [ ] Switch language to English
- [ ] Add English translations for title, content, excerpt, SEO fields
- [ ] Save again
- [ ] Change status to 'published', set publishedAt date
- [ ] Save and verify
- [ ] View articles list:
  - Verify title, status, publishedAt columns visible
  - Verify article appears correctly
- [ ] Edit article:
  - Change content to ~400 words
  - Save
  - Verify `readingTime` updated to ~2 minutes
- [ ] Delete test article

**Phase 3 is complete when all checkboxes are checked and all validations pass! 🎉**

**Next Steps**:
1. Update INDEX.md status to ✅ COMPLETED
2. Update EPIC_TRACKING.md (mark Phase 3 complete, update progress to 3/5)
3. Proceed to Phase 4 (Pages Collection) or Phase 5 (Integration & Validation)
