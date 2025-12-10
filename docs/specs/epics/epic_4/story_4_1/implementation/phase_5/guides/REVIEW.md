# Phase 5 - Code Review Guide

**Phase**: SEO, Metadata & E2E Tests

This guide helps reviewers evaluate Phase 5 code changes effectively.

---

## Review Overview

### Files to Review

| Commit | Files | Focus Areas |
|--------|-------|-------------|
| 1 | `src/lib/seo/*.ts` | Types, metadata generation |
| 2 | `page.tsx` (modified) | generateMetadata integration |
| 3 | `json-ld.ts`, `page.tsx` | Structured data |
| 4 | `article-page.e2e.spec.ts` | E2E test coverage |
| 5 | `article-404.e2e.spec.ts` | 404 handling, docs |

### Review Priorities

1. **SEO Correctness**: Meta tags and JSON-LD must be valid
2. **Security**: No XSS vulnerabilities in JSON-LD
3. **Performance**: Metadata generation doesn't slow page load
4. **Test Quality**: E2E tests are reliable, not flaky

---

## Commit 1 Review: SEO Utilities & Types

### Files

- `src/lib/seo/types.ts`
- `src/lib/seo/article-metadata.ts`
- `src/lib/seo/index.ts`

### Checklist

#### Type Definitions (`types.ts`)

- [ ] `ArticleSEOData` interface covers all needed fields
- [ ] All fields are properly typed (no `any`)
- [ ] Optional fields marked with `?`
- [ ] Locale type is union `'fr' | 'en'` not string
- [ ] JSDoc comments explain purpose

```typescript
// Good
locale: 'fr' | 'en'

// Bad
locale: string
```

#### Site Configuration (`article-metadata.ts`)

- [ ] `siteConfig.url` uses environment variable
- [ ] Fallback URL provided for development
- [ ] `locales` defined as `readonly` array

```typescript
// Good
url: process.env.NEXT_PUBLIC_SITE_URL || 'https://sebcdev.com'

// Bad
url: 'https://sebcdev.com' // No env var support
```

#### Metadata Generation

- [ ] `generateArticleMetadata` returns valid `Metadata` type
- [ ] Title format: `"Article Title | Site Name"`
- [ ] Description has fallback if excerpt empty
- [ ] Open Graph type is `'article'`
- [ ] Locale format correct (`fr_FR`, `en_US`)
- [ ] hreflang includes `x-default`

```typescript
// Good
locale: article.locale === 'fr' ? 'fr_FR' : 'en_US'

// Bad
locale: article.locale // Wrong format
```

#### URL Generation

- [ ] `getArticleUrl` generates correct format
- [ ] No trailing slashes inconsistencies
- [ ] Handles both locales correctly

```typescript
// Expected URL format
https://sebcdev.com/fr/articles/my-article
```

### Red Flags

- [ ] Hardcoded URLs (should use `siteConfig.url`)
- [ ] Missing error handling
- [ ] Type assertions without validation (`as any`)
- [ ] Non-exported utilities that should be exported

---

## Commit 2 Review: generateMetadata Implementation

### Files

- `src/app/[locale]/(frontend)/articles/[slug]/page.tsx`

### Checklist

#### Function Signature

- [ ] `generateMetadata` is `async` and exported
- [ ] Returns `Promise<Metadata>`
- [ ] Params properly awaited

```typescript
// Good
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params
  // ...
}
```

#### Data Mapping

- [ ] Uses existing type guards (`isPopulatedMedia`, etc.)
- [ ] Handles null/undefined gracefully
- [ ] Maps all required fields to `ArticleSEOData`
- [ ] No duplicate article fetching (consider caching)

```typescript
// Check: featuredImage mapping handles missing data
featuredImage: isPopulatedMedia(article.featuredImage)
  ? {
      url: article.featuredImage.url ?? '',
      // ...
    }
  : null
```

#### Error Handling

- [ ] Try/catch around article fetch
- [ ] Returns 404 metadata for missing articles
- [ ] Logs errors appropriately
- [ ] No unhandled promise rejections

```typescript
// Good
try {
  const { article } = await getArticleBySlug(slug, locale)
  if (!article) {
    return generate404Metadata(locale)
  }
  // ...
} catch (error) {
  console.error('Error generating metadata:', error)
  return generate404Metadata(locale)
}
```

### Manual Verification

```bash
# View page source and check for:
# 1. <title> tag with article title
# 2. <meta name="description"> with excerpt
# 3. <meta property="og:*"> tags
# 4. <meta name="twitter:*"> tags
# 5. <link rel="alternate" hreflang="*"> tags
```

### Red Flags

- [ ] Article fetched twice (once in generateMetadata, once in page component)
- [ ] No error handling
- [ ] Type errors or `any` usage
- [ ] Missing locale validation

---

## Commit 3 Review: JSON-LD Structured Data

### Files

- `src/lib/seo/json-ld.ts`
- `src/app/[locale]/(frontend)/articles/[slug]/page.tsx`

### Checklist

#### JSON-LD Generation (`json-ld.ts`)

- [ ] `@context` is `"https://schema.org"` (https required)
- [ ] `@type` is `"Article"`
- [ ] All required fields present (headline, description, datePublished)
- [ ] `author` and `publisher` are objects with `@type`
- [ ] `inLanguage` uses correct format (`fr-FR`, `en-US`)
- [ ] Optional fields only added when data exists

```typescript
// Good - Conditional field
if (article.updatedAt) {
  jsonLd.dateModified = article.updatedAt
}

// Bad - Always adds field even if undefined
jsonLd.dateModified = article.updatedAt // Could be undefined
```

#### Security Review

- [ ] JSON properly escaped with `JSON.stringify`
- [ ] No user input directly in JSON-LD without sanitization
- [ ] `dangerouslySetInnerHTML` is safe (only serialized JSON)

```typescript
// Safe pattern
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

#### Schema Validity

- [ ] Validates on Schema.org validator
- [ ] Validates on Google Rich Results Test
- [ ] Logo URL is absolute (not relative)
- [ ] Image URL is absolute

```typescript
// Good - Absolute URL
logo: {
  '@type': 'ImageObject',
  url: `${siteConfig.url}${siteConfig.logo.url}`,
}

// Bad - Relative URL
logo: {
  '@type': 'ImageObject',
  url: '/logo.png', // Won't work in JSON-LD
}
```

### Validation Commands

```bash
# Extract JSON-LD from page source
curl -s http://localhost:3000/fr/articles/test | grep -o '<script type="application/ld+json">.*</script>'

# Validate at:
# https://validator.schema.org/
# https://search.google.com/test/rich-results
```

### Red Flags

- [ ] HTTP instead of HTTPS in `@context`
- [ ] Relative URLs for images/logos
- [ ] Missing `@type` on nested objects
- [ ] XSS vulnerability in dangerouslySetInnerHTML

---

## Commit 4 Review: E2E Tests - Article Page

### Files

- `tests/e2e/article-page.e2e.spec.ts`

### Checklist

#### Test Structure

- [ ] Uses `test.describe` for grouping
- [ ] Clear, descriptive test names
- [ ] `beforeEach` skips gracefully without seed data
- [ ] Test constants match seed data

```typescript
// Good - Descriptive name
test('displays article title in H1', async ({ page }) => {

// Bad - Vague name
test('title works', async ({ page }) => {
```

#### Selector Quality

- [ ] Prefers role-based selectors (`getByRole`, `getByText`)
- [ ] Avoids brittle CSS selectors
- [ ] Uses `first()` when multiple matches expected

```typescript
// Good
const h1 = page.getByRole('heading', { level: 1 })
const categoryBadge = page.getByText('Tutoriels').first()

// Bad
const h1 = page.locator('article > div > h1')
const categoryBadge = page.locator('.badge-category')
```

#### Assertion Quality

- [ ] Uses `expect()` with clear assertions
- [ ] Awaits visibility before assertions
- [ ] Uses appropriate matchers (`toBeVisible`, `toContainText`, `toHaveURL`)

```typescript
// Good
await expect(h1).toBeVisible()
await expect(h1).toContainText(TEST_ARTICLE.fr.title)

// Bad
const text = await h1.textContent()
if (text !== TEST_ARTICLE.fr.title) throw new Error('fail')
```

#### Coverage

- [ ] Content rendering tests (title, content, code, category, time)
- [ ] SEO metadata tests (all meta tags)
- [ ] Navigation tests (homepage to article, locale switch)
- [ ] Responsive tests (mobile, tablet, desktop)

#### Flakiness Prevention

- [ ] Skips tests when data not available
- [ ] Uses stable selectors
- [ ] Waits for elements before interacting
- [ ] No hardcoded timeouts (use `waitFor` instead)

```typescript
// Good
await expect(page.locator('h1')).toBeVisible()

// Bad
await page.waitForTimeout(2000)
```

### Red Flags

- [ ] Hardcoded waits (`waitForTimeout`)
- [ ] Tests that always pass (no real assertions)
- [ ] Tests that depend on specific database state
- [ ] Flaky selectors that may break

---

## Commit 5 Review: E2E Tests - 404 & Final Validation

### Files

- `tests/e2e/article-404.e2e.spec.ts`
- `docs/specs/epics/epic_4/story_4_1/IMPLEMENTATION_NOTES.md`

### Checklist

#### 404 Tests

- [ ] Tests multiple non-existent slugs
- [ ] Verifies 404 HTTP status code
- [ ] Checks 404 page content
- [ ] Verifies `noindex` meta tag
- [ ] Tests navigation back to homepage
- [ ] Handles special characters gracefully

```typescript
// Good - Checks actual status code
const response = await page.goto(`/fr/articles/non-existent`)
expect(response?.status()).toBe(404)
```

#### Documentation Quality

- [ ] Summary accurately describes implementation
- [ ] Phase completion table is accurate
- [ ] Key decisions documented
- [ ] Known limitations listed
- [ ] Links to phase documentation work

### Red Flags

- [ ] 404 tests pass for wrong reasons
- [ ] Documentation contains placeholder text
- [ ] Broken links in documentation

---

## Overall Review Checklist

### Code Quality

- [ ] No TypeScript errors (`pnpm exec tsc --noEmit`)
- [ ] No ESLint errors (`pnpm lint`)
- [ ] Consistent code style
- [ ] Meaningful variable names
- [ ] Proper error handling

### Testing

- [ ] All unit tests pass (`pnpm test:unit`)
- [ ] All E2E tests pass (`pnpm test:e2e`)
- [ ] Tests cover happy path and error cases
- [ ] No flaky tests

### Build

- [ ] Build succeeds (`pnpm build`)
- [ ] No build warnings for new code

### SEO Validation

- [ ] Meta tags render correctly
- [ ] JSON-LD validates on Schema.org
- [ ] hreflang alternates correct
- [ ] 404 pages have noindex

### Performance

- [ ] Metadata generation doesn't slow page load
- [ ] No unnecessary re-renders
- [ ] No duplicate data fetching

---

## Review Commands

```bash
# Run all checks
pnpm exec tsc --noEmit && pnpm lint && pnpm test:unit && pnpm test:e2e && pnpm build

# Check specific E2E test
pnpm test:e2e tests/e2e/article-page.e2e.spec.ts

# View page source for meta tags
curl -s http://localhost:3000/fr/articles/test | head -100

# Extract JSON-LD
curl -s http://localhost:3000/fr/articles/test | grep "application/ld+json" -A 50
```

---

## Approval Criteria

### Must Have

- [ ] All TypeScript compiles without errors
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Meta tags render correctly in page source
- [ ] JSON-LD validates

### Should Have

- [ ] No code duplication
- [ ] Clean error handling
- [ ] Good test coverage
- [ ] Clear documentation

### Nice to Have

- [ ] Performance optimizations
- [ ] Additional test scenarios
- [ ] Inline comments for complex logic

---

**Review Guide Created**: 2025-12-10
**Last Updated**: 2025-12-10
