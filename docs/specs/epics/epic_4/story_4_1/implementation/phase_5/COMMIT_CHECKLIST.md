# Phase 5 - Commit Checklist

**Phase**: SEO, Metadata & E2E Tests
**Total Commits**: 5

Use this checklist before each commit to ensure quality and completeness.

---

## Commit 1: SEO Utilities & Types

### Pre-Commit Checklist

#### Files Created
- [ ] `src/lib/seo/types.ts` - SEO type definitions
- [ ] `src/lib/seo/article-metadata.ts` - Metadata generation utilities
- [ ] `src/lib/seo/index.ts` - Module exports

#### Implementation Verification
- [ ] `ArticleSEOData` interface includes all required fields
- [ ] `SiteConfig` interface defined with site name, URL, author
- [ ] `siteConfig` uses `NEXT_PUBLIC_SITE_URL` environment variable
- [ ] `generateArticleMetadata()` returns valid `Metadata` object
- [ ] `getArticleUrl()` generates correct URLs for both locales
- [ ] `getAlternates()` generates hreflang for FR, EN, and x-default
- [ ] `generate404Metadata()` returns noindex metadata

#### Code Quality
- [ ] `pnpm exec tsc --noEmit` passes (no TypeScript errors)
- [ ] `pnpm lint` passes (no ESLint errors)
- [ ] No hardcoded URLs (use siteConfig)
- [ ] Functions are properly documented with JSDoc

#### Testing
- [ ] Unit test for `generateArticleMetadata` (optional but recommended)
- [ ] Manual verification of type correctness

### Commit Command

```bash
git add src/lib/seo/
git commit -m "$(cat <<'EOF'
✨ feat(seo): add article metadata utilities and types

- Add ArticleSEOData and SiteConfig types
- Implement generateArticleMetadata for Next.js Metadata API
- Support Open Graph, Twitter Cards, and hreflang alternates
- Add site configuration with environment variable support

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Commit 2: generateMetadata Implementation

### Pre-Commit Checklist

#### Files Modified
- [ ] `src/app/[locale]/(frontend)/articles/[slug]/page.tsx` - Add generateMetadata

#### Implementation Verification
- [ ] `generateMetadata` function exported from page
- [ ] Function receives `params` and extracts `locale` and `slug`
- [ ] Article fetched using existing `getArticleBySlug`
- [ ] Maps Payload article to `ArticleSEOData` correctly
- [ ] Handles missing article (returns 404 metadata)
- [ ] Error handling with try/catch
- [ ] Uses existing type guards (`isPopulatedMedia`, `isPopulatedCategory`, `isPopulatedTag`)

#### Code Quality
- [ ] `pnpm exec tsc --noEmit` passes
- [ ] `pnpm lint` passes
- [ ] No duplicate fetching (article fetched once in generateMetadata, once in page)
- [ ] Consistent with existing page patterns

#### Manual Testing
- [ ] Start dev server: `pnpm dev`
- [ ] Navigate to article page: `/fr/articles/[slug]`
- [ ] View page source (Ctrl+U or Cmd+Option+U)
- [ ] Verify `<title>` contains article title and site name
- [ ] Verify `<meta name="description">` contains excerpt
- [ ] Verify `<meta property="og:title">` present
- [ ] Verify `<meta property="og:type">` is "article"
- [ ] Verify `<meta property="og:url">` contains correct URL
- [ ] Verify `<meta name="twitter:card">` present
- [ ] Verify `<link rel="alternate" hreflang="fr">` present
- [ ] Verify `<link rel="alternate" hreflang="en">` present

#### Build Verification
- [ ] `pnpm build` succeeds

### Commit Command

```bash
git add src/app/[locale]/(frontend)/articles/[slug]/page.tsx
git commit -m "$(cat <<'EOF'
✨ feat(seo): implement generateMetadata for article pages

- Add generateMetadata function to article page
- Map Payload article data to SEO metadata
- Handle missing articles with 404 metadata
- Support Open Graph and Twitter Card meta tags
- Add hreflang alternates for FR/EN

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Commit 3: JSON-LD Structured Data

### Pre-Commit Checklist

#### Files Created/Modified
- [ ] `src/lib/seo/json-ld.ts` - JSON-LD generation utilities (create)
- [ ] `src/lib/seo/index.ts` - Add json-ld export (modify)
- [ ] `src/app/[locale]/(frontend)/articles/[slug]/page.tsx` - Add JSON-LD script (modify)

#### Implementation Verification
- [ ] `ArticleJsonLd` interface matches Schema.org Article type
- [ ] `generateArticleJsonLd()` returns valid JSON-LD object
- [ ] `@context` is "https://schema.org"
- [ ] `@type` is "Article"
- [ ] `headline` contains article title
- [ ] `description` contains article excerpt
- [ ] `datePublished` in ISO 8601 format
- [ ] `author` object with name and URL
- [ ] `publisher` object with logo
- [ ] `mainEntityOfPage` with correct URL
- [ ] `inLanguage` set correctly (fr-FR or en-US)
- [ ] Optional fields handled (dateModified, image, keywords, articleSection)
- [ ] `ArticleJsonLdScript` component renders `<script type="application/ld+json">`
- [ ] JSON-LD integrated into article page component

#### Code Quality
- [ ] `pnpm exec tsc --noEmit` passes
- [ ] `pnpm lint` passes
- [ ] JSON is properly escaped (using `JSON.stringify`)
- [ ] No XSS vulnerabilities in dangerouslySetInnerHTML

#### Manual Testing
- [ ] Start dev server: `pnpm dev`
- [ ] Navigate to article page
- [ ] View page source
- [ ] Find `<script type="application/ld+json">`
- [ ] Copy JSON content
- [ ] Paste into [Schema.org Validator](https://validator.schema.org/)
- [ ] Verify no validation errors
- [ ] Test with [Google Rich Results Test](https://search.google.com/test/rich-results)

#### Build Verification
- [ ] `pnpm build` succeeds

### Commit Command

```bash
git add src/lib/seo/ src/app/[locale]/(frontend)/articles/[slug]/page.tsx
git commit -m "$(cat <<'EOF'
✨ feat(seo): add JSON-LD Article structured data

- Create json-ld.ts with Schema.org Article generation
- Add ArticleJsonLdScript component for rendering
- Include keywords from tags, articleSection from category
- Support dateModified for updated articles
- Integrate into article page component

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Commit 4: E2E Tests - Article Page

### Pre-Commit Checklist

#### Files Created
- [ ] `tests/e2e/article-page.e2e.spec.ts` - Article page E2E tests

#### Implementation Verification
- [ ] Test constants match seed data (`TEST_ARTICLE` slug and titles)
- [ ] `beforeEach` skips tests when database not seeded
- [ ] Content rendering tests:
  - [ ] Article title in H1
  - [ ] Article title in EN locale
  - [ ] RichText content renders
  - [ ] Code blocks render (skip if none)
  - [ ] Category badge visible
  - [ ] Reading time visible
- [ ] SEO metadata tests:
  - [ ] Page title correct
  - [ ] Meta description present
  - [ ] Open Graph tags present
  - [ ] Twitter Card tags present
  - [ ] hreflang alternates correct
  - [ ] JSON-LD structured data valid
- [ ] Navigation tests:
  - [ ] Navigate from homepage to article
  - [ ] Locale switch preserves article
- [ ] Responsive layout tests:
  - [ ] Mobile (375x667)
  - [ ] Tablet (768x1024)
  - [ ] Desktop (1280x800)

#### Code Quality
- [ ] `pnpm lint` passes
- [ ] Test descriptions are clear and descriptive
- [ ] Assertions use Playwright best practices
- [ ] No flaky selectors (prefer role-based selectors)

#### Testing
- [ ] Seed database: `pnpm seed --clean`
- [ ] Run tests: `pnpm test:e2e tests/e2e/article-page.e2e.spec.ts`
- [ ] All tests pass
- [ ] Tests skip gracefully without seed data

### Commit Command

```bash
git add tests/e2e/article-page.e2e.spec.ts
git commit -m "$(cat <<'EOF'
✅ test(e2e): add article page E2E tests

- Add content rendering tests (title, RichText, code blocks)
- Add SEO metadata tests (title, description, OG, Twitter, hreflang)
- Add JSON-LD structured data validation
- Add navigation tests (homepage to article, locale switch)
- Add responsive layout tests (mobile, tablet, desktop)
- Skip tests gracefully when database not seeded

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Commit 5: E2E Tests - 404 & Final Validation

### Pre-Commit Checklist

#### Files Created
- [ ] `tests/e2e/article-404.e2e.spec.ts` - 404 handling E2E tests
- [ ] `docs/specs/epics/epic_4/story_4_1/IMPLEMENTATION_NOTES.md` - Story completion docs

#### Implementation Verification

**404 Tests:**
- [ ] Test non-existent article returns 404 status (FR)
- [ ] Test non-existent article returns 404 status (EN)
- [ ] Test 404 page has navigation back to homepage
- [ ] Test 404 page has noindex meta tag
- [ ] Test special characters in slug handled gracefully

**Implementation Notes:**
- [ ] Summary of story implementation
- [ ] Phase completion table
- [ ] Key decisions documented
- [ ] Known limitations listed
- [ ] Performance results table (to be filled)
- [ ] Links to phase documentation

#### Code Quality
- [ ] `pnpm lint` passes
- [ ] Documentation is clear and complete
- [ ] Markdown formatting correct

#### Testing
- [ ] Run 404 tests: `pnpm test:e2e tests/e2e/article-404.e2e.spec.ts`
- [ ] All 404 tests pass
- [ ] Run all E2E tests: `pnpm test:e2e`
- [ ] All E2E tests pass

#### Final Validation
- [ ] `pnpm test:unit` passes
- [ ] `pnpm test:e2e` passes
- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes

### Commit Command

```bash
git add tests/e2e/article-404.e2e.spec.ts docs/specs/epics/epic_4/story_4_1/IMPLEMENTATION_NOTES.md
git commit -m "$(cat <<'EOF'
✅ test(e2e): add article 404 E2E tests and story documentation

- Add 404 handling tests for non-existent articles
- Verify 404 status code and page content
- Test noindex meta tag on 404 pages
- Handle special characters in slugs gracefully
- Add IMPLEMENTATION_NOTES.md for story completion
- Story 4.1 complete

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Post-Phase Checklist

After all 5 commits are complete:

### Story Validation
- [ ] All acceptance criteria from Story 4.1 spec met
- [ ] Test coverage > 80%
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Build succeeds

### Performance Validation
- [ ] Run Lighthouse audit on article page
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] Accessibility score = 100
- [ ] SEO score >= 90
- [ ] Best Practices score >= 90

### SEO Validation
- [ ] Test with [Schema.org Validator](https://validator.schema.org/)
- [ ] Test with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Test with [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] Test with [Google Rich Results Test](https://search.google.com/test/rich-results)

### Documentation Updates
- [ ] Update `PHASES_PLAN.md` - Mark Phase 5 complete
- [ ] Update `EPIC_TRACKING.md` - Mark Story 4.1 complete
- [ ] Fill in actual metrics in `IMPLEMENTATION_NOTES.md`

---

## Quick Commands Reference

```bash
# Development
pnpm dev

# Type checking
pnpm exec tsc --noEmit

# Linting
pnpm lint

# Unit tests
pnpm test:unit

# E2E tests (requires seeded data)
pnpm seed --clean
pnpm test:e2e

# Specific E2E test file
pnpm test:e2e tests/e2e/article-page.e2e.spec.ts

# Build
pnpm build

# View test report
pnpm exec playwright show-report
```

---

**Checklist Created**: 2025-12-10
**Last Updated**: 2025-12-10
