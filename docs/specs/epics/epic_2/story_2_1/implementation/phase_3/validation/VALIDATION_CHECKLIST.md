# Phase 3 - Final Validation Checklist

Complete validation checklist before marking Phase 3 (Articles Collection) as complete.

---

## ✅ 1. Commits and Structure

- [ ] All 5 atomic commits completed
- [ ] Commits follow Gitmoji naming convention
- [ ] Commit order is logical (hook → base → relations → integration → tests)
- [ ] Each commit is focused (single responsibility)
- [ ] No merge commits in phase branch
- [ ] Git history is clean and readable
- [ ] Commit messages include "Part of Phase 3 - Commit X/5"

**Verify**:
```bash
# Check commit history
git log --oneline --grep="Phase 3"

# Should show 5 commits with clear messages
```

---

## ✅ 2. Type Safety

- [ ] No TypeScript errors (`pnpm exec tsc --noEmit`)
- [ ] No `any` types (unless justified and documented)
- [ ] All types regenerated with `pnpm generate:types:payload`
- [ ] `Article` type exists in `src/payload-types.ts`
- [ ] Article type includes all defined fields:
  - `title: string`
  - `content: { root: { ... } }` (Lexical structure)
  - `excerpt: string | null`
  - `slug: string`
  - `featuredImage: Media | string | null`
  - `category: Category | string | null`
  - `tags: (Tag | string)[] | null`
  - `author: User | string | null`
  - `seo: { metaTitle?: string, metaDescription?: string }`
  - `publishedAt: string | null`
  - `status: 'draft' | 'published' | 'archived'`
  - `readingTime: number | null`
- [ ] Type inference works correctly (no need for explicit type annotations everywhere)
- [ ] Hook type matches `CollectionBeforeChangeHook<Article>`

**Validation**:
```bash
# Type check
pnpm exec tsc --noEmit

# Should output: "Found 0 errors"
```

---

## ✅ 3. Code Quality

- [ ] Code follows project style guide (ESLint + Prettier)
- [ ] No code duplication
- [ ] Clear and consistent naming:
  - `calculateReadingTime` (camelCase for functions)
  - `Articles` (PascalCase for collection config)
  - Field names match spec (title, content, excerpt, etc.)
- [ ] Complex logic documented with comments
- [ ] No commented-out code
- [ ] No debug statements (console.log, console.warn, etc.)
- [ ] Error handling is appropriate:
  - Hook handles null/undefined content gracefully
  - Tests expect proper errors for validation failures
- [ ] JSDoc comments on exported hook function

**Validation**:
```bash
# Lint
pnpm lint

# Should output: "✓ No linting errors"
```

---

## ✅ 4. Tests

### Unit Tests

- [ ] All unit tests pass (`pnpm test:unit`)
- [ ] `calculateReadingTime` hook has comprehensive unit tests:
  - Null content
  - Undefined content
  - Empty content
  - Short content (~100 words → 1 min)
  - Medium content (~200-400 words)
  - Rich formatted content (bold, italic)
  - Headings and paragraphs
  - Lists
  - Code blocks
  - Rounding logic (Math.ceil)
- [ ] Unit tests are meaningful (not just for coverage)
- [ ] No flaky tests
- [ ] Unit test coverage >90% for hook

### Integration Tests

- [ ] All integration tests pass (`pnpm test:int`)
- [ ] Articles collection has comprehensive integration tests:
  - **CRUD**: Create, read, update, delete
  - **i18n**: FR creation, EN fallback, localized content
  - **Relations**: Category, tags, author, featuredImage
  - **Hook**: Reading time calculation and updates
  - **Workflow**: Default status, transitions (draft → published → archived)
  - **Validation**: Slug uniqueness, required fields
- [ ] At least 15+ integration tests
- [ ] Tests clean up after themselves (`afterAll` hook)
- [ ] Tests are independent (no execution order dependency)
- [ ] Integration test coverage >80%

### Overall Coverage

- [ ] Total test coverage >80%
- [ ] All critical paths covered
- [ ] Edge cases tested
- [ ] No skipped tests (unless justified with comment)

**Validation**:
```bash
# Run all tests
pnpm test

# Should output all tests passing

# Coverage
pnpm exec vitest run --coverage

# Should show >80% overall coverage
```

---

## ✅ 5. Build and Compilation

- [ ] Next.js build succeeds without errors
- [ ] No build warnings
- [ ] No dependency conflicts
- [ ] Build output size reasonable (no huge bundles)

**Validation**:
```bash
# Build
pnpm build

# Should complete successfully
# Check for "Compiled successfully" message
```

---

## ✅ 6. Linting and Formatting

- [ ] ESLint passes with no errors
- [ ] ESLint passes with no warnings
- [ ] Code formatted consistently (Prettier)
- [ ] No trailing whitespace
- [ ] Consistent indentation (2 spaces)

**Validation**:
```bash
# Lint
pnpm lint

# Format check
pnpm format:check

# Both should pass without issues
```

---

## ✅ 7. Collection Configuration

### Articles Collection

- [ ] Collection slug is `'articles'`
- [ ] Admin UI configured:
  - `useAsTitle: 'title'`
  - `defaultColumns: ['title', 'status', 'publishedAt', ...]`
- [ ] All fields defined correctly:
  - **Content fields**: title, content, excerpt (localized)
  - **Identifier**: slug (unique, required)
  - **Relations**: featuredImage, category, tags, author
  - **Metadata**: publishedAt, status, readingTime
  - **SEO**: seo.metaTitle, seo.metaDescription (localized)
- [ ] Hooks configured:
  - `beforeChange: [calculateReadingTime]`
- [ ] Collection exported from `src/collections/Articles.ts`
- [ ] Collection registered in `payload.config.ts`

### Hook

- [ ] `calculateReadingTime` hook:
  - Correctly extracts text from Lexical JSON
  - Calculates word count
  - Computes reading time (200 wpm)
  - Rounds up with Math.ceil
  - Updates `data.readingTime`
  - Returns modified data
- [ ] Hook exported from `src/hooks/index.ts`
- [ ] Hook imported in Articles collection

**Validation**:
```bash
# Verify collection appears in admin
pnpm dev
# Navigate to http://localhost:3000/admin
# Check Articles in sidebar
```

---

## ✅ 8. Database and Migrations

- [ ] Migration generated for Articles table (after Commit 2)
- [ ] Migration applied successfully
- [ ] Articles table exists in D1 database
- [ ] Table schema matches collection definition:
  - All fields present
  - Unique constraint on slug
  - Foreign keys for relations (category, tags, author, featuredImage)
- [ ] No migration errors in logs
- [ ] Database queries work correctly (tested via integration tests)

**Validation**:
```bash
# Check D1 tables
pnpm exec wrangler d1 execute D1 --local --command "SELECT name FROM sqlite_master WHERE type='table' AND name='articles';"

# Should return 'articles' table

# Check articles table schema
pnpm exec wrangler d1 execute D1 --local --command "PRAGMA table_info(articles);"

# Should show all columns
```

---

## ✅ 9. Internationalization (i18n)

- [ ] Localized fields marked correctly:
  - title (localized: true)
  - content (localized: true)
  - excerpt (localized: true)
  - seo.metaTitle (localized: true)
  - seo.metaDescription (localized: true)
- [ ] Non-localized fields correct:
  - slug (global)
  - status (global)
  - publishedAt (global)
  - readingTime (global)
  - Relations (global)
- [ ] Language toggle works in admin UI
- [ ] Can create content in FR
- [ ] Can add EN translations
- [ ] Switching locale updates correct fields
- [ ] Fallback behavior works (FR → EN if EN missing)

**Manual Validation**:
```bash
pnpm dev
# Create article in FR
# Switch to EN, add translations
# Switch back to FR, verify content
```

---

## ✅ 10. Relations and Dependencies

### Relations Work Correctly

- [ ] **Category relation**:
  - Can select category from dropdown
  - Saves category ID
  - Category can be populated in queries
- [ ] **Tags relation**:
  - Can select multiple tags
  - Saves array of tag IDs
  - Tags can be populated in queries
- [ ] **Author relation**:
  - Can select user as author
  - Saves user ID
  - Author can be populated in queries
- [ ] **FeaturedImage relation**:
  - Can select existing media
  - Can upload new media
  - Saves media ID
  - Image can be populated in queries

### Dependency Validation

- [ ] Phase 1 (i18n) complete and functional
- [ ] Phase 2 (Categories & Tags) complete and functional
- [ ] Categories collection exists and has test data
- [ ] Tags collection exists and has test data
- [ ] Users collection exists (default from Payload)
- [ ] Media collection exists (default from Payload)

**Manual Validation**:
```bash
# Test creating article with all relations
pnpm dev
# Create article → Select category, tags, author, image → Save → Verify
```

---

## ✅ 11. Hooks and Automation

- [ ] `calculateReadingTime` hook executes on save
- [ ] Reading time calculated correctly:
  - ~100 words → 1 minute
  - ~200 words → 1 minute
  - ~400 words → 2 minutes
  - Empty content → 0 or null
- [ ] Reading time updates when content changes
- [ ] Reading time field is read-only in admin
- [ ] Hook doesn't break article save on error (graceful failure)
- [ ] Hook logs no errors in console

**Manual Validation**:
```bash
pnpm dev
# Create article with ~200 words → Save → Check readingTime = 1
# Edit → Add ~200 more words (total ~400) → Save → Check readingTime = 2
```

---

## ✅ 12. Status Workflow

- [ ] Status field configuration:
  - Type: `'select'`
  - Options: `['draft', 'published', 'archived']`
  - DefaultValue: `'draft'`
  - Required: `true`
- [ ] Status defaults to 'draft' when creating article
- [ ] Can transition from draft to published
- [ ] Can transition from published to archived
- [ ] Can transition from archived to draft (if allowed)
- [ ] Status appears in list view (defaultColumns)
- [ ] PublishedAt date picker works
- [ ] PublishedAt can be set when status is 'published'

**Manual Validation**:
```bash
pnpm dev
# Create article → Verify status = 'draft' → Save
# Edit → Change status to 'published' → Set publishedAt → Save
# Edit → Change status to 'archived' → Save
```

---

## ✅ 13. Admin UI Functionality

- [ ] Articles collection appears in admin sidebar
- [ ] Collection icon displays (if configured)
- [ ] Can access collection list view
- [ ] List view shows configured columns (title, status, publishedAt, etc.)
- [ ] Can create new article (Create New button works)
- [ ] Can edit existing article
- [ ] Can delete article
- [ ] All fields render correctly:
  - Title: text input
  - Content: Lexical rich text editor
  - Excerpt: textarea
  - Slug: text input
  - FeaturedImage: upload picker
  - Category: relationship picker (dropdown)
  - Tags: relationship picker (multi-select)
  - Author: relationship picker (dropdown)
  - SEO group: collapsed/expandable
  - PublishedAt: date picker
  - Status: dropdown (draft/published/archived)
  - ReadingTime: read-only number field (grayed out)
- [ ] Language toggle visible and functional
- [ ] Form validation works (required fields enforced)
- [ ] Save button works
- [ ] Success/error messages display correctly
- [ ] No JavaScript errors in browser console

**Manual Validation**:
```bash
pnpm dev
# Test all UI functionality listed above
```

---

## ✅ 14. SEO and Metadata

- [ ] SEO group defined:
  - Name: `'seo'`
  - Type: `'group'`
- [ ] SEO fields:
  - metaTitle (text, localized)
  - metaDescription (textarea, localized)
- [ ] SEO fields optional (not required)
- [ ] SEO fields localized (FR/EN)
- [ ] SEO group appears in admin UI
- [ ] Can expand/collapse SEO group
- [ ] Can fill SEO fields in both FR and EN
- [ ] SEO fields save correctly

**Manual Validation**:
```bash
pnpm dev
# Create article → Fill SEO fields in FR → Switch to EN → Fill EN SEO → Save → Verify
```

---

## ✅ 15. Performance and Optimization

- [ ] No obvious performance bottlenecks
- [ ] Reading time calculation is efficient (O(n) where n = content length)
- [ ] No N+1 query issues (Payload handles this)
- [ ] Relations use Payload's optimized queries
- [ ] No unnecessary re-renders in admin UI (Payload handles this)
- [ ] Build time reasonable (<2 minutes for full build)
- [ ] Test execution time reasonable (<30 seconds for all Phase 3 tests)

**Validation**:
```bash
# Build time
time pnpm build

# Test time
time pnpm test
```

---

## ✅ 16. Security

- [ ] No sensitive data exposed in collection fields
- [ ] Input validation for required fields (title, slug)
- [ ] Unique constraint enforced on slug (prevents duplicates)
- [ ] No SQL injection risks (Payload's ORM handles this)
- [ ] No XSS risks in content (Lexical editor sanitizes)
- [ ] Environment variables used correctly (PAYLOAD_SECRET)
- [ ] No hardcoded secrets or credentials
- [ ] Access control configured (if needed - depends on project requirements)

**Validation**:
```bash
# Try creating article with duplicate slug → Should fail
# Try creating article without title → Should fail
# Try creating article without slug → Should fail
```

---

## ✅ 17. Documentation

- [ ] Commit messages clear and descriptive
- [ ] Hook function has JSDoc comments
- [ ] Complex logic explained with inline comments
- [ ] No outdated or misleading comments
- [ ] README updated if needed (project-level docs)
- [ ] Phase 3 documentation files complete:
  - INDEX.md
  - IMPLEMENTATION_PLAN.md
  - COMMIT_CHECKLIST.md
  - ENVIRONMENT_SETUP.md
  - guides/REVIEW.md
  - guides/TESTING.md
  - validation/VALIDATION_CHECKLIST.md (this file)

---

## ✅ 18. Integration with Previous Phases

- [ ] Works with Phase 1 (i18n):
  - Localized fields use FR/EN locales
  - Language toggle functional
  - Fallback behavior works
- [ ] Works with Phase 2 (Categories & Tags):
  - Can relate to categories
  - Can relate to tags
  - Relations display correctly in admin
  - Deleting category/tag doesn't break articles (or shows warning)
- [ ] No breaking changes to existing collections
- [ ] No conflicts with existing code
- [ ] Dependencies resolved correctly

**Integration Tests**:
```bash
# Run all integration tests (Phase 1, 2, and 3)
pnpm test:int

# All should pass
```

---

## 📊 Success Metrics

| Metric                 | Target   | Actual | Status |
| ---------------------- | -------- | ------ | ------ |
| **Commits**            | 5        | -      | ⏳     |
| **Type Coverage**      | 100%     | -      | ⏳     |
| **Test Coverage**      | >80%     | -      | ⏳     |
| **Unit Tests**         | 8+       | -      | ⏳     |
| **Integration Tests**  | 15+      | -      | ⏳     |
| **Build Status**       | ✅ Pass  | -      | ⏳     |
| **Lint Status**        | ✅ Pass  | -      | ⏳     |
| **Manual Validation**  | Complete | -      | ⏳     |

---

## 🎯 Final Verdict

Select one:

- [ ] ✅ **APPROVED** - Phase 3 is complete and ready
  - All checklist items verified
  - All tests passing
  - Manual validation complete
  - Quality meets standards
  - Ready to proceed to Phase 4

- [ ] 🔧 **CHANGES REQUESTED** - Issues to fix:
  - [ ] Issue 1: [Description]
  - [ ] Issue 2: [Description]
  - [ ] Issue 3: [Description]

- [ ] ❌ **REJECTED** - Major rework needed:
  - [ ] Major issue 1: [Description]
  - [ ] Major issue 2: [Description]

---

## 📝 Next Steps

### If Approved ✅

1. [ ] Update [INDEX.md](../INDEX.md) status to ✅ COMPLETED
2. [ ] Update EPIC_TRACKING.md:
   ```markdown
   | Story | Progress |
   | 2.1   | 3/5      | ← Update this
   ```
3. [ ] Create git tag for Phase 3 completion:
   ```bash
   git tag -a phase-3-articles-complete -m "Phase 3: Articles Collection complete"
   git push --tags
   ```
4. [ ] Merge phase branch to main (if using branches)
5. [ ] Prepare for next phase:
   - [ ] Phase 4 (Pages Collection) or
   - [ ] Phase 5 (Integration & Validation)

### If Changes Requested 🔧

1. [ ] Address all feedback items listed above
2. [ ] Re-run validation commands
3. [ ] Update this checklist
4. [ ] Request re-validation

### If Rejected ❌

1. [ ] Document all major issues
2. [ ] Schedule discussion with tech lead
3. [ ] Plan rework strategy
4. [ ] Update PHASES_PLAN.md if needed

---

## 📋 Validation Commands Summary

Run all these commands before final approval:

```bash
# 1. Type checking
pnpm exec tsc --noEmit

# 2. Lint
pnpm lint

# 3. Format check
pnpm format:check

# 4. Unit tests
pnpm test:unit

# 5. Integration tests
pnpm test:int

# 6. All tests with coverage
pnpm exec vitest run --coverage

# 7. Build
pnpm build

# 8. Dev server (manual validation)
pnpm dev
```

**All must pass with no errors.**

---

## ✅ Sign-off

**Validated by**: [Name]
**Date**: [YYYY-MM-DD]
**Time spent on Phase 3**: [X hours]

**Notes**:
[Any additional notes, observations, or recommendations]

---

**Phase 3 (Articles Collection) validation complete! 🎉**

If all checks pass, congratulations! The Articles collection is fully implemented with:
- ✅ Complete collection structure with all fields
- ✅ i18n support for FR/EN
- ✅ Relations to Categories, Tags, Users, Media
- ✅ Automated reading time calculation
- ✅ Draft/Published/Archived workflow
- ✅ Comprehensive unit and integration tests
- ✅ Type-safe implementation
- ✅ Clean, maintainable code

**Ready to proceed to Phase 4 (Pages Collection)! 🚀**
