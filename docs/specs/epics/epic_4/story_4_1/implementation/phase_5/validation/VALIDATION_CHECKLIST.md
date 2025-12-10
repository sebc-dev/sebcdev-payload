# Phase 5 - Validation Checklist

**Phase**: SEO, Metadata & E2E Tests
**Story**: 4.1 - Rendu Article & MDX

Use this checklist for final validation before marking Phase 5 complete.

---

## Pre-Validation Requirements

Before starting validation:

- [ ] All 5 commits completed
- [ ] Development server starts without errors
- [ ] Database is seeded with test data

```bash
# Start fresh
pnpm devsafe
pnpm seed --clean
```

---

## 1. Code Quality Validation

### TypeScript Compilation

```bash
pnpm exec tsc --noEmit
```

- [ ] No TypeScript errors
- [ ] No implicit `any` types in new code
- [ ] All imports resolve correctly

### Linting

```bash
pnpm lint
```

- [ ] No ESLint errors
- [ ] No ESLint warnings in new files
- [ ] Code follows project conventions

### Build

```bash
pnpm build
```

- [ ] Build completes successfully
- [ ] No build warnings for Phase 5 files
- [ ] Output files generated correctly

---

## 2. SEO Metadata Validation

### Meta Tags in Page Source

Navigate to: `http://localhost:3000/fr/articles/nextjs-cloudflare-workers`

View source (Ctrl+U / Cmd+Option+U) and verify:

#### Title Tag
- [ ] Format: `<title>Article Title | SebCDev</title>`
- [ ] Contains article title
- [ ] Contains site name

#### Description
- [ ] `<meta name="description" content="...">` present
- [ ] Contains article excerpt
- [ ] Length is reasonable (50-160 characters)

#### Open Graph Tags
- [ ] `<meta property="og:type" content="article">` present
- [ ] `<meta property="og:title" content="...">` contains title
- [ ] `<meta property="og:description" content="...">` present
- [ ] `<meta property="og:url" content="...">` contains correct URL
- [ ] `<meta property="og:site_name" content="SebCDev">` present
- [ ] `<meta property="og:locale" content="fr_FR">` correct format
- [ ] `<meta property="og:image" content="...">` present (if article has image)

#### Twitter Card Tags
- [ ] `<meta name="twitter:card" content="...">` present
- [ ] `<meta name="twitter:title" content="...">` present
- [ ] `<meta name="twitter:description" content="...">` present
- [ ] `<meta name="twitter:image" content="...">` present (if image)

#### hreflang Alternates
- [ ] `<link rel="alternate" hreflang="fr" href=".../fr/articles/...">` present
- [ ] `<link rel="alternate" hreflang="en" href=".../en/articles/...">` present
- [ ] `<link rel="alternate" hreflang="x-default" href="...">` present
- [ ] All URLs are absolute (start with https://)

### Locale Switching

- [ ] Navigate to `/fr/articles/[slug]` - French metadata
- [ ] Navigate to `/en/articles/[slug]` - English metadata
- [ ] `og:locale` changes correctly (fr_FR / en_US)
- [ ] hreflang URLs point to correct locales

---

## 3. JSON-LD Validation

### Script Presence

In page source, find:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  ...
}
</script>
```

- [ ] Script tag present in page source
- [ ] JSON is valid (no syntax errors)
- [ ] `@context` is `https://schema.org`
- [ ] `@type` is `Article`

### Required Fields

- [ ] `headline` contains article title
- [ ] `description` contains excerpt
- [ ] `datePublished` in ISO 8601 format
- [ ] `author` object with `@type` and `name`
- [ ] `publisher` object with `@type`, `name`, and `logo`
- [ ] `mainEntityOfPage` with `@id` URL
- [ ] `inLanguage` correct (`fr-FR` or `en-US`)

### Optional Fields

- [ ] `dateModified` present (if article was updated)
- [ ] `image` URL present (if article has featured image)
- [ ] `keywords` from tags (comma-separated)
- [ ] `articleSection` from category

### External Validation

#### Schema.org Validator
1. Go to: https://validator.schema.org/
2. Enter URL: `http://localhost:3000/fr/articles/nextjs-cloudflare-workers`
3. Click "Run Test"
4. [ ] No errors
5. [ ] Article type detected
6. [ ] All required fields present

#### Google Rich Results Test
1. Go to: https://search.google.com/test/rich-results
2. Enter URL or paste HTML
3. [ ] Article rich result eligible
4. [ ] No critical issues

---

## 4. 404 Page Validation

### HTTP Status

```bash
curl -I http://localhost:3000/fr/articles/non-existent-slug
```

- [ ] Returns `HTTP/1.1 404 Not Found`

### Page Content

Navigate to: `http://localhost:3000/fr/articles/non-existent-slug`

- [ ] 404 message displayed
- [ ] Page is readable/styled
- [ ] Navigation available (link to homepage)

### SEO for 404

View source of 404 page:

- [ ] `<meta name="robots" content="noindex...">` present
- [ ] Page should NOT be indexed

---

## 5. E2E Test Validation

### Run All E2E Tests

```bash
pnpm test:e2e
```

- [ ] All tests pass
- [ ] No flaky tests
- [ ] Test report generates

### Article Page Tests

```bash
pnpm test:e2e tests/e2e/article-page.e2e.spec.ts
```

- [ ] Content rendering tests pass
- [ ] SEO metadata tests pass
- [ ] Navigation tests pass
- [ ] Responsive layout tests pass

### 404 Tests

```bash
pnpm test:e2e tests/e2e/article-404.e2e.spec.ts
```

- [ ] 404 status tests pass
- [ ] Navigation tests pass
- [ ] Special character handling passes

---

## 6. Unit Test Validation

### Run Unit Tests

```bash
pnpm test:unit
```

- [ ] All existing tests still pass
- [ ] New SEO utility tests pass (if added)

### Coverage Check

```bash
pnpm test:unit --coverage
```

- [ ] Overall coverage maintained
- [ ] New files have > 80% coverage (if applicable)

---

## 7. Performance Validation

### Lighthouse Audit

Open Chrome DevTools on article page:

1. Go to Lighthouse tab
2. Select: Performance, Accessibility, Best Practices, SEO
3. Click "Analyze page load"

#### Scores

| Category | Target | Actual | Pass |
|----------|--------|--------|------|
| Performance | >= 90 | ____ | [ ] |
| Accessibility | 100 | ____ | [ ] |
| Best Practices | >= 90 | ____ | [ ] |
| SEO | >= 90 | ____ | [ ] |

#### Core Web Vitals

| Metric | Target | Actual | Pass |
|--------|--------|--------|------|
| LCP | < 2.5s | ____ | [ ] |
| CLS | < 0.1 | ____ | [ ] |
| FID/INP | < 100ms | ____ | [ ] |

---

## 8. Social Sharing Validation

### Facebook Sharing Debugger

1. Go to: https://developers.facebook.com/tools/debug/
2. Enter production URL (or ngrok tunnel)
3. Click "Debug"

- [ ] Title displays correctly
- [ ] Description displays correctly
- [ ] Image displays (if present)
- [ ] No warnings

### Twitter Card Validator

1. Go to: https://cards-dev.twitter.com/validator
2. Enter production URL (or ngrok tunnel)

- [ ] Card preview renders
- [ ] Title correct
- [ ] Description correct
- [ ] Image displays (if present)

---

## 9. Cross-Browser Validation

### Browsers to Test

| Browser | Version | Article Page | 404 Page | Meta Tags |
|---------|---------|--------------|----------|-----------|
| Chrome | Latest | [ ] | [ ] | [ ] |
| Firefox | Latest | [ ] | [ ] | [ ] |
| Safari | Latest | [ ] | [ ] | [ ] |
| Edge | Latest | [ ] | [ ] | [ ] |

### Mobile Testing

| Device | Article Page | 404 Page | Responsive |
|--------|--------------|----------|------------|
| iPhone SE | [ ] | [ ] | [ ] |
| iPhone 14 | [ ] | [ ] | [ ] |
| Android (Chrome) | [ ] | [ ] | [ ] |

---

## 10. Documentation Validation

### Phase Documentation

- [ ] `INDEX.md` is complete and accurate
- [ ] `IMPLEMENTATION_PLAN.md` matches implementation
- [ ] `COMMIT_CHECKLIST.md` complete
- [ ] `ENVIRONMENT_SETUP.md` accurate
- [ ] `guides/REVIEW.md` complete
- [ ] `guides/TESTING.md` complete
- [ ] This validation checklist complete

### Story Documentation

- [ ] `IMPLEMENTATION_NOTES.md` created
- [ ] Summary accurate
- [ ] Phase completion table filled
- [ ] Key decisions documented

---

## 11. Story Acceptance Criteria

### From Story 4.1 Spec

#### Functional

- [ ] **AC1**: Route `/[locale]/articles/[slug]` displays article
- [ ] **AC2**: Lexical content renders correctly
- [ ] **AC3**: Code blocks have syntax highlighting
- [ ] **AC4**: Images optimized with next/image
- [ ] **AC5**: Metadata displayed (category, tags, reading time, date)
- [ ] **AC6**: FR and EN locales work
- [ ] **AC7**: 404 page for missing articles

#### Non-Functional

- [ ] **AC8**: LCP < 2.5s on mobile 4G
- [ ] **AC9**: CLS < 0.1
- [ ] **AC10**: Accessibility score = 100
- [ ] **AC11**: Compatible with Cloudflare Workers

---

## 12. Final Checklist

### Before Marking Complete

- [ ] All sections above validated
- [ ] No critical issues remaining
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Documentation updated

### Post-Completion Actions

- [ ] Update `PHASES_PLAN.md` - Mark Phase 5 complete
- [ ] Update `EPIC_TRACKING.md` - Update story status
- [ ] Fill actual metrics in `IMPLEMENTATION_NOTES.md`
- [ ] Commit any final documentation updates

---

## Validation Summary

| Section | Status |
|---------|--------|
| Code Quality | [ ] Pass |
| SEO Metadata | [ ] Pass |
| JSON-LD | [ ] Pass |
| 404 Page | [ ] Pass |
| E2E Tests | [ ] Pass |
| Unit Tests | [ ] Pass |
| Performance | [ ] Pass |
| Social Sharing | [ ] Pass |
| Cross-Browser | [ ] Pass |
| Documentation | [ ] Pass |
| Acceptance Criteria | [ ] Pass |

---

## Sign-Off

**Phase 5 Validated By**: _______________

**Date**: _______________

**Story 4.1 Status**: [ ] COMPLETE

---

**Checklist Created**: 2025-12-10
**Last Updated**: 2025-12-10
