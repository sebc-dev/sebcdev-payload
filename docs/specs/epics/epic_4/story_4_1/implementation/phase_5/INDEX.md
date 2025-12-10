# Phase 5 - SEO, Metadata & E2E Tests

**Story**: 4.1 - Rendu Article & MDX
**Epic**: Epic 4 - Article Reading Experience
**Phase**: 5 of 5 (Final Phase)
**Status**: READY FOR IMPLEMENTATION

---

## Quick Navigation

| Document | Purpose |
|----------|---------|
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Atomic commit strategy (5 commits) |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) | Per-commit detailed checklists |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Dependencies and configuration |
| [guides/REVIEW.md](./guides/REVIEW.md) | Code review guide |
| [guides/TESTING.md](./guides/TESTING.md) | Testing strategy |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Final validation |

---

## Phase Overview

### Objective

Finalize the article page with comprehensive SEO metadata, structured data (JSON-LD), multilingual hreflang support, and complete E2E test coverage. This phase validates the entire Story 4.1 implementation.

### User Value

- **Search engines** will properly index articles with rich snippets
- **Social sharing** will display compelling previews (Open Graph, Twitter Cards)
- **International users** will be served the correct language version
- **Quality assurance** ensures reliable, bug-free article rendering

### Scope

**In Scope**:
- Dynamic `generateMetadata` with Open Graph tags
- JSON-LD Article structured data (Schema.org)
- hreflang alternate links for FR/EN
- E2E tests for article page navigation and rendering
- E2E tests for 404 handling
- Lighthouse audit validation (LCP, CLS, Accessibility)
- Story completion documentation

**Out of Scope**:
- Sitemap generation (separate story)
- RSS feeds (separate story)
- Analytics integration
- Comments/reactions

---

## Technical Approach

### Why This Phase Matters

SEO and testing are often overlooked but critical for:

| Aspect | Impact |
|--------|--------|
| **SEO Metadata** | 40% of traffic from organic search |
| **Open Graph** | Social shares drive 20% of referral traffic |
| **JSON-LD** | Rich snippets increase CTR by 30% |
| **E2E Tests** | Catch regressions before users do |
| **Lighthouse** | Performance directly affects SEO ranking |

### Architecture

```
+-------------------------------------------------------------+
|                   Article Page (RSC)                         |
+-------------------------------------------------------------+
|                    generateMetadata()                        |
|  +-------------------------------------------------------+  |
|  | title: article.title | site.name                      |  |
|  | description: article.excerpt                          |  |
|  | openGraph: { title, description, images, type }       |  |
|  | twitter: { card, title, description, images }         |  |
|  | alternates: { languages: { fr, en } }                 |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
|                      <head> output                           |
|  +-------------------------------------------------------+  |
|  | <title>...</title>                                    |  |
|  | <meta name="description" content="...">               |  |
|  | <meta property="og:*" content="...">                  |  |
|  | <meta name="twitter:*" content="...">                 |  |
|  | <link rel="alternate" hreflang="fr" href="...">       |  |
|  | <link rel="alternate" hreflang="en" href="...">       |  |
|  | <script type="application/ld+json">...</script>       |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
```

### Metadata Strategy

```typescript
// Metadata generation flow
1. Fetch article by slug (same as page)
2. Extract: title, excerpt, featuredImage, publishedAt, author
3. Build OpenGraph object with image dimensions
4. Build Twitter Card metadata
5. Generate hreflang alternates for FR/EN
6. Return Metadata object to Next.js
```

### JSON-LD Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "description": "Article excerpt...",
  "image": "https://example.com/image.jpg",
  "datePublished": "2024-01-15T10:00:00Z",
  "dateModified": "2024-01-16T14:30:00Z",
  "author": {
    "@type": "Organization",
    "name": "SebCDev"
  },
  "publisher": {
    "@type": "Organization",
    "name": "SebCDev",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/fr/articles/slug"
  }
}
```

---

## Commits Summary

| # | Commit | Files | Lines | Duration |
|---|--------|-------|-------|----------|
| 1 | SEO Utilities & Types | 3 | ~150 | 45-60 min |
| 2 | generateMetadata Implementation | 2 | ~120 | 45-60 min |
| 3 | JSON-LD Structured Data | 2 | ~100 | 30-45 min |
| 4 | E2E Tests - Article Page | 2 | ~200 | 60-90 min |
| 5 | E2E Tests - 404 & Validation | 2 | ~150 | 45-60 min |
| **Total** | | **11** | **~720** | **4-5 hours** |

---

## Dependencies

### Phase Dependencies

- **Phase 1** (Route & Layout): Route structure exists
- **Phase 2** (Lexical Rendering): Content renders correctly
- **Phase 3** (Code Highlighting): Code blocks styled
- **Phase 4** (Images & Styling): Images optimized, styling complete

All previous phases must be complete before this phase.

### Package Dependencies

No new packages required. Uses existing:
- `next/metadata` (built-in Next.js)
- `@playwright/test` (already installed)

### Existing Infrastructure

- `src/app/[locale]/(frontend)/articles/[slug]/page.tsx` - Page to enhance
- `src/lib/payload/articles.ts` - Article fetching utilities
- `tests/e2e/homepage-seeded.e2e.spec.ts` - E2E test patterns
- `messages/fr.json`, `messages/en.json` - Translations

---

## Risk Assessment

### Identified Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Metadata not generating for edge cases | Low | Medium | Handle null article gracefully |
| JSON-LD validation errors | Low | Low | Test with Schema.org validator |
| hreflang pointing to non-existent translations | Medium | Low | Check article exists in both locales |
| E2E tests flaky due to data | Medium | Medium | Use seeded data consistently |
| Lighthouse scores not meeting targets | Low | High | Profile and optimize iteratively |

### Contingency Plans

1. **If metadata fails**: Return minimal metadata (title, description only)
2. **If JSON-LD invalid**: Log warning, render page without structured data
3. **If E2E flaky**: Add retry logic, increase timeouts
4. **If Lighthouse fails**: Profile, identify bottleneck, iterate

---

## Success Criteria

### Functional

- [ ] `generateMetadata` returns correct title and description
- [ ] Open Graph tags render in page source
- [ ] Twitter Card meta tags present
- [ ] hreflang alternates point to FR and EN versions
- [ ] JSON-LD script renders valid Article schema
- [ ] E2E tests pass for article navigation
- [ ] E2E tests pass for 404 handling

### Non-Functional

- [ ] LCP < 2.5s (Core Web Vital)
- [ ] CLS < 0.1 (Core Web Vital)
- [ ] Accessibility score = 100 (Lighthouse)
- [ ] SEO score >= 90 (Lighthouse)
- [ ] Best Practices score >= 90 (Lighthouse)

### Quality Gates

- [ ] All unit tests pass
- [ ] All E2E tests pass
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Build succeeds
- [ ] JSON-LD validates on Schema.org validator
- [ ] OG tags validate on Facebook/Twitter debuggers

---

## File Structure

After implementation:

```
src/lib/seo/
+-- article-metadata.ts      (new) - Metadata generation utilities
+-- json-ld.ts               (new) - JSON-LD generation utilities
+-- types.ts                 (new) - SEO-related types

src/app/[locale]/(frontend)/articles/[slug]/
+-- page.tsx                 (modified) - Add generateMetadata, JSON-LD

tests/e2e/
+-- article-page.e2e.spec.ts      (new) - Article page E2E tests
+-- article-404.e2e.spec.ts       (new) - 404 handling E2E tests

docs/specs/epics/epic_4/story_4_1/
+-- IMPLEMENTATION_NOTES.md       (new) - Story completion docs
```

---

## Testing Strategy

### E2E Test Coverage

| Test Suite | Tests | Purpose |
|------------|-------|---------|
| article-page.e2e.spec.ts | 8-10 | Navigation, rendering, metadata |
| article-404.e2e.spec.ts | 4-5 | 404 handling, error states |

### Test Scenarios

**Article Page Tests**:
1. Navigate to article from homepage
2. Verify article title renders
3. Verify article content renders (richtext)
4. Verify metadata in page source
5. Verify locale switching (FR/EN)
6. Verify responsive layout
7. Verify code blocks render
8. Verify images render

**404 Tests**:
1. Navigate to non-existent slug
2. Verify 404 page renders
3. Verify correct HTTP status
4. Verify navigation back to homepage

### Lighthouse Validation

```bash
# Run Lighthouse CI
pnpm exec lighthouse-ci --url=http://localhost:3000/fr/articles/test-article

# Expected scores:
# - Performance: >= 90
# - Accessibility: 100
# - Best Practices: >= 90
# - SEO: >= 90
```

---

## References

### Documentation

- [PHASES_PLAN.md](../PHASES_PLAN.md) - Overall story planning
- [Story 4.1 Spec](../../story_4.1.md) - Story requirements
- [UX/UI Spec](../../../../UX_UI_Spec.md) - Design requirements

### External

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org Article](https://schema.org/Article)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup)
- [Playwright Testing](https://playwright.dev/docs/intro)

### Validation Tools

- [Schema.org Validator](https://validator.schema.org/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

---

## Getting Started

1. **Read** [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for configuration
2. **Follow** [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) commit by commit
3. **Check** [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) before each commit
4. **Review** with [guides/REVIEW.md](./guides/REVIEW.md)
5. **Test** following [guides/TESTING.md](./guides/TESTING.md)
6. **Validate** using [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)

---

## Story Completion

This is the **final phase** of Story 4.1. Upon completion:

- [ ] All 5 phases implemented
- [ ] All acceptance criteria met
- [ ] Test coverage > 80%
- [ ] Lighthouse scores meet targets
- [ ] Documentation complete
- [ ] Ready for production deployment

**Story 4.1 Status**: Will be marked COMPLETE after Phase 5 validation.

---

**Phase Created**: 2025-12-10
**Last Updated**: 2025-12-10
**Generated by**: phase-doc-generator skill
