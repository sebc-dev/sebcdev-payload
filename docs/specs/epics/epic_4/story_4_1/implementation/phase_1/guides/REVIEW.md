# Phase 1 - Code Review Guide

**Phase**: Article Page Route & Basic Layout
**Review Time**: ~15-30 minutes per commit

This guide helps reviewers (including self-review) evaluate each commit in Phase 1.

---

## Review Philosophy

### Atomic Commit Review

Each commit should be reviewed independently:

1. **Focused**: Does the commit do one thing well?
2. **Complete**: Is the feature complete within the commit's scope?
3. **Safe**: Can this commit be deployed without breaking the app?
4. **Testable**: Are there tests or can it be manually verified?

### What to Look For

| Category | Priority | Description |
|----------|----------|-------------|
| **Correctness** | High | Does the code do what it's supposed to? |
| **Type Safety** | High | Are types correct and complete? |
| **Error Handling** | High | Are edge cases handled? |
| **Performance** | Medium | No obvious performance issues? |
| **Consistency** | Medium | Follows existing patterns? |
| **Documentation** | Low | JSDoc comments where needed? |

---

## Commit 1 Review: Payload Fetch Utilities

### Files to Review

- `src/lib/payload/articles.ts`
- `tests/unit/lib/payload/articles.spec.ts`

### Review Checklist

#### Functionality

- [ ] `getArticleBySlug` accepts slug and locale parameters
- [ ] Returns `ArticleFetchResult` with article or null
- [ ] Filters by `status: 'published'` only
- [ ] Uses `depth: 2` for relations (category, tags)
- [ ] Limits to 1 result

#### Error Handling

- [ ] Try/catch wraps the Payload call
- [ ] Error message included in result
- [ ] Console.error logs the error for debugging
- [ ] Doesn't throw - returns gracefully

#### Type Safety

- [ ] `ArticleFetchResult` interface exported
- [ ] Function return type explicitly declared
- [ ] Locale type from `@/i18n/config`
- [ ] Article type from `@/payload-types`

#### Tests

- [ ] All scenarios covered (found, not found, error)
- [ ] Mocks are appropriate
- [ ] Tests are isolated (don't depend on each other)
- [ ] Assertions are meaningful

#### Code Quality

- [ ] JSDoc documentation present
- [ ] Follows existing patterns in codebase
- [ ] No magic strings/numbers
- [ ] Clean imports

### Questions to Ask

1. Is the error handling sufficient for production?
2. Should we add caching (like `unstable_cache`)?
3. Is `depth: 2` appropriate for all use cases?

### Common Issues

| Issue | Fix |
|-------|-----|
| Missing error property in result | Add `error?: string` to interface |
| Not filtering by published | Add `status: { equals: 'published' }` |
| Wrong collection name | Verify against Payload config |

---

## Commit 2 Review: ArticleHeader Component

### Files to Review

- `src/components/articles/ArticleHeader.tsx`
- `src/components/articles/index.ts` (export added)

### Review Checklist

#### Component Structure

- [ ] Async Server Component (uses `getTranslations`)
- [ ] Props interface defined (`ArticleHeaderProps`)
- [ ] Uses existing components correctly
- [ ] Semantic HTML (`<header>` element)

#### UI/Layout

- [ ] Category badge rendered and clickable
- [ ] Title in `<h1>` element
- [ ] Responsive typography (text-3xl/4xl/5xl)
- [ ] Metadata row with proper spacing
- [ ] Border separator at bottom

#### Accessibility

- [ ] Heading hierarchy correct (h1)
- [ ] Decorative elements have `aria-hidden`
- [ ] Text contrast sufficient

#### Reusability

- [ ] Uses existing `CategoryBadge`
- [ ] Uses existing `ComplexityBadge`
- [ ] Uses existing `RelativeDate`
- [ ] No duplicate code

#### Export

- [ ] Added to barrel export in `index.ts`

### Questions to Ask

1. Is the typography scale appropriate for the design?
2. Should reading time show "0 min" if readingTime is 0?
3. Is the metadata order correct per UX spec?

### Common Issues

| Issue | Fix |
|-------|-----|
| Not async function | Add `async` keyword |
| Missing translations | Ensure `getTranslations` call |
| Wrong heading level | Use h1 for page title |

---

## Commit 3 Review: ArticleFooter Component

### Files to Review

- `src/components/articles/ArticleFooter.tsx`
- `src/components/articles/index.ts` (export added)

### Review Checklist

#### Component Structure

- [ ] Async Server Component
- [ ] Props interface defined
- [ ] Returns null when tags empty
- [ ] Semantic HTML (`<footer>` element)

#### UI/Layout

- [ ] Border separator at top
- [ ] Tags label translated
- [ ] Tags in flex-wrap container
- [ ] Proper spacing (gap-2)

#### Edge Cases

- [ ] Empty tags array → returns null
- [ ] Single tag → renders correctly
- [ ] Many tags → wraps properly

#### Reusability

- [ ] Uses existing `TagPill` component
- [ ] No hardcoded strings (uses translations)

#### Export

- [ ] Added to barrel export in `index.ts`

### Questions to Ask

1. Should we limit visible tags (like ArticleCard does)?
2. Is "Tags" the right label for the section?
3. Should empty state show differently?

### Common Issues

| Issue | Fix |
|-------|-----|
| Not handling empty tags | Add early return for `tags.length === 0` |
| Missing translation | Add `tagsLabel` to messages files |
| Hardcoded "Tags" label | Use `t('tagsLabel')` |

---

## Commit 4 Review: Article Page Route

### Files to Review

- `src/app/[locale]/(frontend)/articles/[slug]/page.tsx`

### Review Checklist

#### Route Configuration

- [ ] `dynamic = 'force-dynamic'` exported
- [ ] Correct file path for Next.js App Router
- [ ] Props interface with `Promise<{ locale, slug }>`

#### Data Flow

- [ ] Params awaited correctly
- [ ] `setRequestLocale` called
- [ ] `getArticleBySlug` called with slug and locale
- [ ] `notFound()` called when article is null

#### Data Mapping

- [ ] `mapPayloadToArticleData` handles all fields
- [ ] Category mapped correctly (handles object vs ID)
- [ ] Tags mapped and filtered correctly
- [ ] coverImage set to null (Phase 4)

#### Component Assembly

- [ ] `ArticleHeader` receives article and locale
- [ ] Content placeholder present
- [ ] `ArticleFooter` receives tags and locale
- [ ] Container has `max-w-prose` class

#### Type Safety

- [ ] No `any` types
- [ ] Payload types imported correctly
- [ ] ArticleData type used

### Questions to Ask

1. Is `max-w-prose` the right width for reading?
2. Should the content placeholder be more descriptive?
3. Are all mapping edge cases handled?

### Common Issues

| Issue | Fix |
|-------|-----|
| Not awaiting params | `const { locale, slug } = await params` |
| Missing `setRequestLocale` | Add after extracting locale |
| `notFound` not imported | `import { notFound } from 'next/navigation'` |

---

## Commit 5 Review: Translations & 404 Page

### Files to Review

- `src/app/[locale]/(frontend)/articles/[slug]/not-found.tsx`
- `messages/fr.json`
- `messages/en.json`

### Review Checklist

#### 404 Page

- [ ] Async Server Component
- [ ] Uses `getTranslations` with correct namespace
- [ ] Icon present (FileQuestion)
- [ ] Title in h1
- [ ] Helpful description
- [ ] CTA button linking to home

#### French Translations

- [ ] `article.readingTime` with `{minutes}` interpolation
- [ ] `article.tagsLabel` correct French term
- [ ] `article.notFound.title` appropriate message
- [ ] `article.notFound.description` helpful text
- [ ] `article.notFound.backToHome` clear CTA

#### English Translations

- [ ] All keys match French structure
- [ ] `{minutes}` interpolation in readingTime
- [ ] Natural English phrasing

#### JSON Validity

- [ ] Both files are valid JSON
- [ ] No trailing commas
- [ ] Proper nesting structure

### Questions to Ask

1. Is the 404 message helpful for users?
2. Should we suggest searching instead of going home?
3. Are translations consistent with existing terms?

### Common Issues

| Issue | Fix |
|-------|-----|
| Invalid JSON | Check for trailing commas |
| Missing interpolation | Use `{minutes}` not `%minutes%` |
| Wrong namespace | Check translation key path |

---

## Self-Review Checklist

Before marking a commit as ready:

### Code Quality

- [ ] No console.log statements (except error logging)
- [ ] No commented-out code
- [ ] No TODO comments without tracking
- [ ] Imports organized (external, internal, types)

### Type Safety

- [ ] `pnpm exec tsc --noEmit` passes
- [ ] No explicit `any` types
- [ ] Proper null handling

### Style

- [ ] `pnpm lint` passes
- [ ] Consistent with existing code style
- [ ] Tailwind classes organized

### Testing

- [ ] Unit tests pass (where applicable)
- [ ] Manual testing done
- [ ] Edge cases verified

### Documentation

- [ ] JSDoc on exported functions
- [ ] Complex logic has comments
- [ ] Component purpose is clear

---

## Review Commands

```bash
# View changes in last commit
git show HEAD

# Check types
pnpm exec tsc --noEmit

# Run linting
pnpm lint

# Run tests
pnpm test:unit

# Compare with main
git diff main...HEAD
```

---

## After Review

### Approval Criteria

A commit is approved when:

- [ ] All checklist items pass
- [ ] No blocking issues found
- [ ] Types compile
- [ ] Lint passes

### If Issues Found

1. Document the issue
2. Discuss if needed
3. Fix in the same commit (amend) if not yet pushed
4. Or create a follow-up commit

---

**Review Guide Generated**: 2025-12-09
