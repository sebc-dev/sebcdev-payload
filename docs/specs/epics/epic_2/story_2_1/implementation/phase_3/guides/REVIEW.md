# Phase 3 - Code Review Guide

Complete guide for reviewing the Phase 3 (Articles Collection) implementation.

---

## 🎯 Review Objective

Validate that the implementation:

- ✅ Creates a complete Articles collection with all required fields
- ✅ Implements i18n correctly for FR/EN content
- ✅ Establishes proper relations to Categories, Tags, Users, and Media
- ✅ Implements automated reading time calculation
- ✅ Provides draft/published/archived workflow
- ✅ Includes comprehensive integration tests
- ✅ Follows Payload CMS 3.x best practices
- ✅ Maintains type safety and code quality

---

## 📋 Review Approach

Phase 3 is split into **5 atomic commits**. You can:

**Option A: Commit-by-commit review** (recommended)

- Easier to digest (20-60 min per commit)
- Progressive validation
- Targeted feedback
- **Total Time**: ~2.5-3.5 hours

**Option B: Global review at once**

- Faster (3-4h total)
- Immediate overview
- Requires more focus

**Estimated Total Time**: 2.5-4 hours

---

## 🔍 Commit-by-Commit Review

### Commit 1: Create calculateReadingTime Hook

**Files**:
- `src/hooks/calculateReadingTime.ts` (~70 lines)
- `src/hooks/index.ts` (~3 lines)
- `tests/unit/calculateReadingTime.spec.ts` (~100 lines)

**Duration**: 20-30 minutes

#### Review Checklist

##### Hook Implementation

- [ ] Function signature matches `CollectionBeforeChangeHook` from Payload
- [ ] Handles `data.content` being null, undefined, or empty
- [ ] Correctly extracts plain text from Lexical JSON structure
  - Supports paragraph nodes
  - Supports heading nodes
  - Supports list items
  - Handles text nodes with formatting (bold, italic, etc.)
  - Handles code blocks appropriately
- [ ] Word count calculation uses whitespace split (`/\s+/`)
- [ ] Reading time calculation:
  - Uses 200 words per minute constant
  - Rounds up using `Math.ceil()`
  - Returns 0 or undefined for empty content
- [ ] Hook modifies `data.readingTime` correctly
- [ ] Hook returns the modified `data` object
- [ ] No side effects (only modifies readingTime field)

##### Type Safety

- [ ] Hook properly typed as `CollectionBeforeChangeHook`
- [ ] Type imports from `payload` package are correct
- [ ] No use of `any` type (unless absolutely justified and documented)
- [ ] Lexical content structure properly typed or validated

##### Code Quality

- [ ] Clear and descriptive function/variable names
- [ ] JSDoc comments explain:
  - Reading speed assumption (200 words/min)
  - Edge case handling
  - Lexical JSON structure expectations
- [ ] No console.logs or debug statements
- [ ] No commented-out code
- [ ] Proper error handling for malformed content

##### Unit Tests

- [ ] Test file properly structured with `describe` and `it` blocks
- [ ] Tests cover all edge cases:
  - Null content
  - Undefined content
  - Empty content object
  - Simple text (100-200 words)
  - Rich formatted text (bold, italic)
  - Headings and paragraphs
  - Lists
  - Code blocks
  - Mixed content types
- [ ] Reading time calculation accuracy:
  - 100 words → 1 minute (100/200 = 0.5, rounds to 1)
  - 200 words → 1 minute
  - 201 words → 2 minutes
  - 400 words → 2 minutes
- [ ] Proper use of Vitest matchers (`toBe`, `toBeUndefined`, `toEqual`, etc.)
- [ ] All tests pass without errors
- [ ] Test descriptions are clear and descriptive
- [ ] No skipped or commented-out tests

#### Technical Validation

```bash
# Type checking
pnpm exec tsc --noEmit

# Run unit tests
pnpm test:unit

# Lint
pnpm lint
```

**Expected Result**: All pass with no errors

#### Questions to Ask

1. Does the text extraction algorithm handle all Lexical node types used in the project?
2. Is 200 words/min a reasonable reading speed for technical articles?
3. Should code blocks be counted differently (e.g., slower reading speed)?
4. Are there any performance concerns with processing large articles?
5. Does the hook handle malformed Lexical JSON gracefully?

---

### Commit 2: Create Articles Collection Base Structure

**Files**:
- `src/collections/Articles.ts` (~80 lines)
- `src/collections/index.ts` (modified, +1 export)
- `src/payload.config.ts` (modified, +1 collection)
- `src/payload-types.ts` (regenerated)

**Duration**: 30-40 minutes

#### Review Checklist

##### Collection Configuration

- [ ] Collection slug is `'articles'` (lowercase, plural)
- [ ] Admin config:
  - `useAsTitle: 'title'` - uses title for list display
  - `defaultColumns` includes at least `'title'` and `'slug'`
- [ ] Collection is properly exported as named export
- [ ] Collection follows Payload `CollectionConfig` type

##### Field Definitions

- [ ] **Title field**:
  - Name: `'title'`
  - Type: `'text'`
  - Required: `true`
  - Localized: `true` (supports FR/EN)
  - Admin: Clear label if customized
- [ ] **Content field**:
  - Name: `'content'`
  - Type: `'richText'`
  - Localized: `true`
  - Uses Lexical editor (default for richText in Payload 3.x)
  - No unnecessary editor customizations
- [ ] **Excerpt field**:
  - Name: `'excerpt'`
  - Type: `'textarea'`
  - Localized: `true`
  - Optional (no `required: true`)
- [ ] **Slug field**:
  - Name: `'slug'`
  - Type: `'text'`
  - Required: `true`
  - Unique: `true` (enforces DB-level uniqueness)
  - Admin: Consider if slug auto-generation is needed

##### Integration

- [ ] Collection exported from `Articles.ts` as `export const Articles: CollectionConfig`
- [ ] Collection re-exported from `src/collections/index.ts`
- [ ] Collection added to `collections` array in `payload.config.ts`
- [ ] Import path is correct (e.g., `import { Articles } from './collections'`)

##### Type Safety

- [ ] Types regenerated successfully (`src/payload-types.ts` updated)
- [ ] `Article` type exists in payload-types
- [ ] `Article` type includes all defined fields with correct types:
  - `title: string` (for default locale)
  - `content: { root: { ... } }` (Lexical structure)
  - `excerpt: string | null`
  - `slug: string`
- [ ] No TypeScript compilation errors
- [ ] Generated types match field definitions

##### Code Quality

- [ ] Fields ordered logically (content fields → identifiers)
- [ ] Consistent indentation (2 or 4 spaces)
- [ ] No unnecessary or duplicate field configurations
- [ ] Comments added for complex configurations (if any)
- [ ] No console.logs or debug code

#### Technical Validation

```bash
# Regenerate types
pnpm generate:types:payload

# Type checking
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Dev server (manual verification)
pnpm dev
# Navigate to http://localhost:3000/admin/collections/articles
```

**Expected Result**:
- Articles collection appears in admin sidebar
- Can create article with all base fields
- Language toggle (FR/EN) works for title, content, excerpt
- Slug uniqueness enforced (try duplicate slug)
- Types compile without errors

#### Questions to Ask

1. Should the slug field have auto-generation (e.g., from title)?
2. Is excerpt required or optional for articles?
3. Are there any admin UI customizations needed (field grouping, conditional logic)?
4. Should there be a character limit for title or excerpt?
5. Does the Lexical editor need custom features/blocks configured?

---

### Commit 3: Add Relations and SEO Fields to Articles

**Files**:
- `src/collections/Articles.ts` (modified, +~60 lines)
- `src/payload-types.ts` (regenerated)

**Duration**: 30-40 minutes

#### Review Checklist

##### Relationship Fields

- [ ] **FeaturedImage field**:
  - Name: `'featuredImage'`
  - Type: `'upload'` (correct type for media uploads)
  - RelationTo: `'media'` (matches media collection slug)
  - Required: `false` (featured image is optional)
  - Admin: Clear label
- [ ] **Category field**:
  - Name: `'category'`
  - Type: `'relationship'`
  - RelationTo: `'categories'` (matches collection slug from Phase 2)
  - Required: `false` (articles can be uncategorized)
  - HasMany: NOT set (or `false`) - 1:1 relationship
- [ ] **Tags field**:
  - Name: `'tags'`
  - Type: `'relationship'`
  - RelationTo: `'tags'` (matches collection slug from Phase 2)
  - HasMany: `true` (many-to-many relationship)
  - Required: `false`
- [ ] **Author field**:
  - Name: `'author'`
  - Type: `'relationship'`
  - RelationTo: `'users'` (matches users collection slug)
  - Required: Depends on spec (consider `true` if every article must have author)

##### SEO Group

- [ ] Group configuration:
  - Name: `'seo'`
  - Type: `'group'`
  - Contains fields array
- [ ] **MetaTitle field**:
  - Name: `'metaTitle'`
  - Type: `'text'`
  - Localized: `true` (SEO varies by language)
  - Optional (no `required: true`)
  - Admin: Clear label like "SEO Meta Title"
- [ ] **MetaDescription field**:
  - Name: `'metaDescription'`
  - Type: `'textarea'`
  - Localized: `true`
  - Optional
  - Admin: Label like "SEO Meta Description"
  - Consider: Character limit hint (e.g., "Max 160 characters")

##### Field Organization

- [ ] Fields ordered logically:
  - Content fields (title, content, excerpt)
  - Identifiers (slug)
  - Metadata (readingTime, publishedAt, status - if added)
  - Relations (featuredImage, category, tags, author)
  - SEO (seo group)
- [ ] No duplicate field names
- [ ] Consistent naming convention (camelCase)

##### Type Safety

- [ ] Types regenerated successfully
- [ ] Relationship types correctly typed as union:
  - `Article['category']` → `Category | string | null`
  - `Article['tags']` → `(Tag | string)[] | null`
  - `Article['author']` → `User | string | null`
  - `Article['featuredImage']` → `Media | string | null`
- [ ] SEO group typed as nested object:
  - `Article['seo']` → `{ metaTitle?: string, metaDescription?: string }`
- [ ] No TypeScript compilation errors

##### Code Quality

- [ ] Consistent indentation
- [ ] Clear field names matching spec
- [ ] No console.logs
- [ ] Comments for complex configurations (if needed)

#### Technical Validation

```bash
# Regenerate types
pnpm generate:types:payload

# Type checking
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Dev server (manual verification)
pnpm dev
# Create/edit article in admin:
# - Select category (should show list from Phase 2)
# - Select tags (multi-select, shows tags from Phase 2)
# - Select author (shows users)
# - Select featured image (shows media)
# - Fill SEO fields (should be localized)
```

**Expected Result**:
- All relation pickers appear and function correctly
- Can select category, tags, author, featured image
- SEO group displays with localized fields
- Switching locale updates SEO field values
- Types include proper relation types

#### Questions to Ask

1. Should relations be required or optional?
2. Should there be a default author (current logged-in user)?
3. Are there any relation filters needed (e.g., only published categories)?
4. Should SEO fields have character limits or validation?
5. Is there a need for og:image (Open Graph image) in addition to featuredImage?

---

### Commit 4: Add Hooks and Status Workflow to Articles

**Files**:
- `src/collections/Articles.ts` (modified, +~40 lines)
- `src/payload-types.ts` (regenerated)

**Duration**: 25-35 minutes

#### Review Checklist

##### Import Statement

- [ ] Hook imported correctly:
  ```typescript
  import { calculateReadingTime } from '@/hooks'
  // OR from '../hooks' or './hooks' depending on structure
  ```
- [ ] Import path resolves correctly (no broken imports)
- [ ] No unused imports

##### Metadata Fields

- [ ] **PublishedAt field**:
  - Name: `'publishedAt'`
  - Type: `'date'`
  - Required: `false` (optional, only set when publishing)
  - Admin: Clear label like "Published Date"
- [ ] **Status field**:
  - Name: `'status'`
  - Type: `'select'`
  - Options: Exactly `['draft', 'published', 'archived']`
  - DefaultValue: `'draft'`
  - Required: `true` (status should always be set)
  - Admin: Clear labels for options (if customized)
- [ ] **ReadingTime field**:
  - Name: `'readingTime'`
  - Type: `'number'`
  - Admin: `readOnly: true` (calculated by hook, not editable)
  - Admin: Label like "Reading Time (minutes)"
  - Required: `false` (will be auto-set by hook)

##### Hooks Configuration

- [ ] Hooks object defined at collection level (not field level)
- [ ] `beforeChange` array includes `calculateReadingTime`
- [ ] Hook function reference (not invoked): `[calculateReadingTime]` NOT `[calculateReadingTime()]`
- [ ] No other hooks interfere with reading time calculation
- [ ] Hook runs on both create and update operations

##### Admin Configuration

- [ ] `defaultColumns` updated to include workflow fields
- [ ] Recommended columns: `['title', 'status', 'publishedAt', 'author']`
- [ ] Column order makes sense for list view

##### Field Organization

- [ ] Workflow fields grouped logically
- [ ] Status and publishedAt near each other
- [ ] Reading time near content fields (shows reading time of article)

##### Type Safety

- [ ] Types regenerated successfully
- [ ] `Article['status']` typed as `'draft' | 'published' | 'archived'`
- [ ] `Article['publishedAt']` typed as `string | null | undefined` (ISO date string)
- [ ] `Article['readingTime']` typed as `number | null | undefined`
- [ ] No TypeScript errors

##### Code Quality

- [ ] Hook import at top of file
- [ ] Consistent formatting
- [ ] No console.logs

#### Technical Validation

```bash
# Regenerate types
pnpm generate:types:payload

# Type checking
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Dev server (manual verification)
pnpm dev
# Test in admin:
# 1. Create article with ~200 words of content
# 2. Save → verify readingTime auto-populated (~1 min)
# 3. Verify readingTime field is grayed out (read-only)
# 4. Verify status defaults to 'draft'
# 5. Change status to 'published', set publishedAt date
# 6. Save → verify changes persist
# 7. Edit article, change content to ~400 words
# 8. Save → verify readingTime updated to ~2 min
```

**Expected Result**:
- ReadingTime calculates automatically on save
- ReadingTime field is read-only in UI
- Status defaults to 'draft'
- Status dropdown shows all three options
- PublishedAt date picker works
- List view shows status and publishedAt columns

#### Questions to Ask

1. Should status transitions have validation (e.g., can't go from archived to draft)?
2. Should publishedAt auto-set when status changes to 'published'?
3. Is there a need for lastModified or lastEditedBy fields?
4. Should draft articles be hidden from public queries by default?
5. Is the reading time calculation visible in the admin UI (for authors to see)?

---

### Commit 5: Add Articles Collection Integration Tests

**Files**:
- `tests/int/articles.int.spec.ts` (~200 lines)

**Duration**: 45-60 minutes

#### Review Checklist

##### Test Structure

- [ ] Tests organized in `describe` blocks by feature area:
  - CRUD Operations
  - i18n Behavior
  - Relations
  - Hook Execution
  - Status Workflow
  - Validation
- [ ] Each test has clear, descriptive name
- [ ] Tests use `it('should ...')` pattern

##### Setup and Teardown

- [ ] `beforeAll` hook creates test data:
  - Test user (for author)
  - Test category (for category relation)
  - 2-3 test tags (for tags relation)
  - Test media/upload (for featuredImage)
  - Stores IDs for use in tests
- [ ] `afterAll` hook cleans up:
  - Deletes all test articles
  - Deletes test user, category, tags, media
  - Leaves database clean
- [ ] No test pollution (each test can run independently)

##### CRUD Operation Tests

- [ ] **Create test**:
  - Creates article with required fields (title, slug)
  - Verifies article created successfully
  - Verifies returned article has expected structure
- [ ] **Read test**:
  - Creates article, retrieves by ID
  - Verifies fields match input
- [ ] **Update test**:
  - Creates article, updates fields
  - Verifies changes persisted
- [ ] **Delete test**:
  - Creates article, deletes by ID
  - Verifies article no longer exists (expect 404 or null)

##### i18n Behavior Tests

- [ ] **French creation, English fallback**:
  - Creates article with French title/content
  - Retrieves with `locale: 'en'`
  - Verifies fallback behavior (falls back to FR or returns empty if no fallback)
- [ ] **Localized content in both languages**:
  - Creates article with both FR and EN content
  - Retrieves in FR → verifies FR content
  - Retrieves in EN → verifies EN content
- [ ] **SEO localization**:
  - Creates article with FR and EN SEO fields
  - Verifies locale-specific SEO values retrieved correctly

##### Relation Tests

- [ ] **Category relation**:
  - Creates article with category ID
  - Retrieves article
  - Verifies category populated or ID correct
- [ ] **Tags relation**:
  - Creates article with array of tag IDs
  - Verifies tags array saved and populated
- [ ] **Author relation**:
  - Creates article with user ID as author
  - Verifies author relation
- [ ] **FeaturedImage relation**:
  - Creates article with media ID
  - Verifies featuredImage upload relation

##### Hook Execution Tests

- [ ] **Short content (~100 words)**:
  - Creates article with ~100 words
  - Verifies `readingTime === 1` (rounds up from 0.5)
- [ ] **Medium content (~400 words)**:
  - Creates article with ~400 words
  - Verifies `readingTime === 2`
- [ ] **Empty/null content**:
  - Creates article with no content
  - Verifies `readingTime` is 0, null, or undefined
- [ ] **Content update**:
  - Creates article with short content
  - Updates to longer content
  - Verifies `readingTime` recalculated

##### Status Workflow Tests

- [ ] **Default status**:
  - Creates article without specifying status
  - Verifies `status === 'draft'`
- [ ] **Draft to published**:
  - Creates draft article
  - Updates status to 'published'
  - Verifies status changed
- [ ] **Published to archived**:
  - Creates published article
  - Updates status to 'archived'
  - Verifies status changed

##### Validation and Constraint Tests

- [ ] **Slug uniqueness**:
  - Creates article with slug 'test-slug'
  - Attempts to create another with same slug
  - Expects error or validation failure
- [ ] **Required fields**:
  - Attempts to create article without `title`
  - Expects validation error
  - Attempts to create article without `slug`
  - Expects validation error

##### Code Quality

- [ ] Proper use of `expect()` matchers:
  - `toBe()` for primitives
  - `toEqual()` for objects
  - `toBeDefined()` / `toBeUndefined()` for existence checks
  - `toHaveLength()` for arrays
- [ ] No hardcoded IDs (uses variables from setup)
- [ ] No console.logs (except for debugging, should be removed)
- [ ] No skipped tests (`it.skip`) unless justified with comment
- [ ] Tests are isolated (don't depend on execution order)
- [ ] Assertions are specific and meaningful
- [ ] Error messages in assertions are helpful

##### Test Coverage

- [ ] All collection features tested (CRUD, relations, hooks, workflow)
- [ ] Edge cases covered (null, empty, invalid data)
- [ ] Happy path and error path both tested
- [ ] At least 15+ test cases total

#### Technical Validation

```bash
# Run integration tests
pnpm test:int

# Run only Articles tests
pnpm exec vitest run tests/int/articles.int.spec.ts

# Verify all tests pass
```

**Expected Result**: All 15+ tests pass, execution time <30 seconds

#### Questions to Ask

1. Are there additional edge cases to test (e.g., very long content, special characters)?
2. Should there be performance tests (e.g., create 100 articles)?
3. Are there API-level tests needed (REST/GraphQL endpoints)?
4. Should tests verify access control (draft articles only visible to authors)?
5. Are there tests for cascading deletes (e.g., deleting category affects articles)?

---

## ✅ Global Validation

After reviewing all commits:

### Architecture & Design

- [ ] Collection follows Payload CMS 3.x best practices
- [ ] Proper separation of concerns (hook separate from collection)
- [ ] Reusable hook design (could be used by other collections)
- [ ] Relations properly defined (not circular dependencies)
- [ ] Field types appropriate for content (text, richText, select, etc.)

### Code Quality

- [ ] Consistent code style throughout all files
- [ ] Clear and descriptive naming (fields, functions, variables)
- [ ] Appropriate comments where needed (not over-commented)
- [ ] No dead code or commented-out code
- [ ] No console.logs or debug statements

### Testing

- [ ] Hook has comprehensive unit tests
- [ ] Collection has comprehensive integration tests
- [ ] Edge cases covered
- [ ] Test coverage >80% for new code
- [ ] Tests are meaningful (not just for coverage)

### Type Safety

- [ ] No TypeScript errors
- [ ] No use of `any` (unless justified)
- [ ] Types regenerated and correct
- [ ] Proper type imports from `payload` package
- [ ] Generated `Article` type matches field definitions

### Performance

- [ ] No obvious performance bottlenecks
- [ ] Hook algorithm is efficient (O(n) text extraction)
- [ ] No unnecessary database queries
- [ ] Relations use Payload's optimized queries

### Security

- [ ] No sensitive data exposed in collection
- [ ] Input validation for required fields
- [ ] Unique constraints enforced (slug uniqueness)
- [ ] No SQL injection risks (Payload handles this)

### Documentation

- [ ] Commit messages clear and descriptive
- [ ] Complex logic explained with comments
- [ ] JSDoc comments for hook function
- [ ] README or docs updated if needed

### i18n and Accessibility

- [ ] Localized fields marked correctly
- [ ] Both FR and EN supported
- [ ] Fallback behavior appropriate
- [ ] Admin UI labels clear (for both languages if customized)

---

## 📝 Feedback Template

Use this template for feedback:

```markdown
## Review Feedback - Phase 3: Articles Collection

**Reviewer**: [Your Name]
**Date**: [YYYY-MM-DD]
**Commits Reviewed**: [All 5 commits | Commit X-Y]

### ✅ Strengths

- Hook implementation is clean and well-tested
- Collection structure is logical and follows Payload best practices
- Integration tests are comprehensive
- [Other positive observations]

### 🔧 Required Changes

1. **Commit 1 - Hook**: [Issue description]
   - **Why**: [Explanation]
   - **Suggestion**: [How to fix]

2. **Commit 3 - Relations**: [Issue description]
   - **Why**: [Explanation]
   - **Suggestion**: [How to fix]

[Add more as needed]

### 💡 Suggestions (Optional)

- Consider adding og:image field for social media sharing
- Slug auto-generation from title could improve UX
- [Other nice-to-have improvements]

### 📊 Verdict

- [ ] ✅ **APPROVED** - Ready to merge
- [ ] 🔧 **CHANGES REQUESTED** - Needs fixes (see above)
- [ ] ❌ **REJECTED** - Major rework needed

### Next Steps

[What should happen next - fix issues, re-review, merge, etc.]
```

---

## 🎯 Review Actions

### If Approved ✅

1. Approve pull request (if using PRs)
2. Merge commits to main branch
3. Update INDEX.md status to ✅ COMPLETED
4. Update EPIC_TRACKING.md (Phase 3 complete, progress 3/5)
5. Prepare for next phase (Phase 4 or 5)

### If Changes Requested 🔧

1. Create detailed feedback using template above
2. Discuss with developer (clarify issues)
3. Developer fixes issues
4. Re-review affected commits
5. Approve when issues resolved

### If Rejected ❌

1. Document major issues clearly
2. Schedule discussion with developer and tech lead
3. Plan rework strategy
4. Consider if requirements were unclear
5. Update spec or plan if needed

---

## ❓ FAQ

**Q: What if I disagree with the implementation approach?**
A: Discuss with the developer. If it works correctly and meets requirements, it might be acceptable even if it's not how you would do it. Focus on correctness, not personal preference.

**Q: Should I review tests as thoroughly as implementation code?**
A: Yes! Tests are critical. Poor tests give false confidence. Ensure tests actually validate functionality and cover edge cases.

**Q: How detailed should my feedback be?**
A: Specific enough to be actionable. Include file name, line number (if applicable), description of issue, why it's a problem, and suggestion for fix.

**Q: Can I approve with minor comments?**
A: Yes, mark as approved and note that comments are optional improvements. Distinguish between "must fix" and "nice to have".

**Q: What if the spec is unclear or incomplete?**
A: Clarify with tech lead or product owner first. Don't reject code that follows an unclear spec. Instead, request spec clarification.

**Q: Should I run the code locally?**
A: Highly recommended. Manual testing in admin UI is essential to verify everything works as expected.

---

**Happy reviewing! 🎉**
