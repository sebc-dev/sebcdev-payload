# Phase 4 - Validation Checklist

**Phase**: Image Rendering & Advanced Styling
**Purpose**: Final validation before marking phase complete

---

## Pre-Validation

Before starting validation:

- [ ] All 4 commits completed
- [ ] All code reviewed
- [ ] All unit tests written and passing
- [ ] Development server running

---

## Build & Quality Gates

### Build Check

```bash
pnpm build
```

- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No warning about missing images/loaders

### Linting

```bash
pnpm lint
```

- [ ] ESLint passes
- [ ] Biome passes (if configured)
- [ ] No warnings in new code

### Type Check

```bash
pnpm exec tsc --noEmit
```

- [ ] TypeScript compiles without errors
- [ ] No implicit `any` in new code

### Unit Tests

```bash
pnpm test:unit
```

- [ ] All tests pass
- [ ] Coverage > 80% for new files
- [ ] No skipped tests

---

## Functional Validation

### ImageBlock Component

Test with article containing inline images:

- [ ] Images render correctly
- [ ] Alt text is present (check in DevTools)
- [ ] Captions display when present
- [ ] No caption element when caption missing
- [ ] Uses `<figure>` semantic element
- [ ] Rounded corners applied
- [ ] Proper spacing (my-8 or similar)

### ArticleHero Component

Test with article containing featured image:

- [ ] Hero displays at top of article
- [ ] Hero is full-width (breaks out of container)
- [ ] Hero loads immediately (check Network tab - no lazy)
- [ ] Alt text is present
- [ ] Aspect ratio looks good on current viewport
- [ ] No horizontal overflow/scrollbar

### Serializer Integration

- [ ] Upload nodes render as ImageBlock
- [ ] No more "[Image placeholder - Phase 4]" text
- [ ] Mixed content (text + images) renders correctly
- [ ] Multiple images in one article work

### Featured Image Extraction

- [ ] `coverImage` populated in article data
- [ ] Works when featuredImage exists
- [ ] `null` when featuredImage missing
- [ ] All CoverImage fields mapped (url, alt, width, height, blurDataURL)

---

## Visual Validation

### Typography (Desktop - 1280px+)

- [ ] Content width ~65ch (~700px)
- [ ] Text centered in viewport
- [ ] Line length comfortable for reading
- [ ] Headings have proper spacing
  - [ ] More space above than below
  - [ ] First heading has no top margin
- [ ] Paragraphs have consistent bottom margin
- [ ] Lists properly indented
- [ ] List items have proper spacing
- [ ] Blockquotes visually distinct
  - [ ] Left border with accent color
  - [ ] Background color
  - [ ] Proper padding
- [ ] Code blocks properly spaced
- [ ] Images don't exceed content width (unless intentional)

### Typography (Tablet - 768px)

- [ ] Content centered
- [ ] Comfortable reading width
- [ ] No horizontal scroll
- [ ] All elements scale appropriately

### Typography (Mobile - 375px)

- [ ] Content uses full width with padding
- [ ] Text readable without zooming
- [ ] Images scale to container width
- [ ] No horizontal scroll
- [ ] Spacing still feels balanced

### Image Display

#### Hero Image

| Viewport | Expected Behavior |
|----------|-------------------|
| Mobile | Full width, ~16:9 or 2:1 aspect |
| Tablet | Full width, ~16:9 or 21:9 aspect |
| Desktop | Full width or max ~1200px, ~21:9 aspect |

- [ ] Verified on mobile
- [ ] Verified on tablet
- [ ] Verified on desktop

#### Inline Images

| Viewport | Expected Behavior |
|----------|-------------------|
| Mobile | Full container width |
| Tablet | Centered, within content width |
| Desktop | Centered, max ~700px |

- [ ] Verified on mobile
- [ ] Verified on tablet
- [ ] Verified on desktop

---

## Performance Validation

### Lighthouse Audit

Run Lighthouse on article page:

```bash
# Using Chrome DevTools
# 1. Open article page
# 2. Open DevTools (F12)
# 3. Go to Lighthouse tab
# 4. Check "Performance"
# 5. Click "Analyze page load"
```

#### Metrics

| Metric | Target | Actual | Pass |
|--------|--------|--------|------|
| LCP | < 2.5s | _____ | [ ] |
| CLS | < 0.1 | _____ | [ ] |
| Performance Score | > 90 | _____ | [ ] |

### Image Loading

- [ ] Hero image loads with priority (check Network tab - early)
- [ ] Inline images lazy load (check Network tab - on scroll)
- [ ] Images use next/image (not native `<img>`)
- [ ] No unnecessary image requests

### Layout Shift

- [ ] No visible layout shift when images load
- [ ] Page doesn't "jump" during loading
- [ ] CLS < 0.1 confirmed in Lighthouse

---

## Accessibility Validation

### Automated (axe DevTools)

```
1. Install axe DevTools Chrome extension
2. Open article page
3. Open DevTools > axe DevTools tab
4. Click "Scan ALL of my page"
```

- [ ] No critical issues
- [ ] No serious issues
- [ ] Reviewed moderate/minor issues

### Manual Checks

#### Images

- [ ] All images have alt text
- [ ] Alt text is descriptive (not just filename)
- [ ] Decorative images (if any) have `alt=""`
- [ ] Figure/figcaption relationship correct

#### Focus States

- [ ] Links have visible focus state
- [ ] Focus ring meets contrast requirements
- [ ] Tab order is logical

#### Color Contrast

- [ ] Caption text has 4.5:1 contrast ratio
- [ ] Body text has 4.5:1 contrast ratio
- [ ] Heading text has 4.5:1 contrast ratio

### Screen Reader Test

Using VoiceOver (Mac) or NVDA (Windows):

- [ ] Images announced with alt text
- [ ] Captions announced as part of figure
- [ ] Content reads in logical order
- [ ] Heading structure makes sense

---

## Cross-Browser Validation

Test article page in:

### Chrome

- [ ] Images display correctly
- [ ] Typography looks good
- [ ] No console errors

### Firefox

- [ ] Images display correctly
- [ ] Typography looks good
- [ ] No console errors

### Safari (if available)

- [ ] Images display correctly
- [ ] Typography looks good
- [ ] No console errors

### Edge

- [ ] Images display correctly
- [ ] Typography looks good
- [ ] No console errors

---

## Code Quality Validation

### New Files Check

#### `src/lib/cloudflare-image-loader.ts`

- [ ] TypeScript types defined
- [ ] Default export function
- [ ] Handles all URL patterns
- [ ] No `any` types

#### `src/components/richtext/nodes/ImageBlock.tsx`

- [ ] Props interface defined
- [ ] Null safety implemented
- [ ] Console warning for missing URL
- [ ] Uses semantic HTML
- [ ] No `any` types

#### `src/components/articles/ArticleHero.tsx`

- [ ] Props interface defined
- [ ] Uses priority loading
- [ ] Supports blur placeholder
- [ ] Responsive aspect ratio
- [ ] No `any` types

### Modified Files Check

#### `src/components/richtext/serialize.tsx`

- [ ] ImageBlock imported
- [ ] Upload case uses ImageBlock
- [ ] Placeholder removed

#### `src/app/[locale]/(frontend)/articles/[slug]/page.tsx`

- [ ] ArticleHero imported
- [ ] Type guard for Media added
- [ ] coverImage extraction implemented
- [ ] ArticleHero conditionally rendered

#### `src/app/globals.css`

- [ ] .article-prose class added
- [ ] Custom properties defined
- [ ] Vertical rhythm consistent
- [ ] No conflicting selectors

---

## Documentation Validation

### Commit Messages

- [ ] All commits follow Gitmoji convention
- [ ] Messages are descriptive
- [ ] Co-authored-by included

### Code Comments

- [ ] Complex logic has comments
- [ ] JSDoc for exported functions
- [ ] No TODO/FIXME left (or tracked in issues)

---

## Final Sign-Off

### Summary

| Category | Status |
|----------|--------|
| Build & Tests | [ ] Pass |
| Functional | [ ] Pass |
| Visual | [ ] Pass |
| Performance | [ ] Pass |
| Accessibility | [ ] Pass |
| Cross-Browser | [ ] Pass |
| Code Quality | [ ] Pass |

### Issues Found

| Issue | Severity | Resolution |
|-------|----------|------------|
| | | |
| | | |
| | | |

### Phase Status

- [ ] **APPROVED**: Phase 4 complete, ready for Phase 5
- [ ] **NEEDS WORK**: Issues documented above must be resolved

---

## Post-Validation Actions

After phase is approved:

### 1. Update PHASES_PLAN.md

```markdown
- [x] Phase 4: Images & Styling - Status: ✅ COMPLETED
```

### 2. Update EPIC_TRACKING.md

Update story progress in Epic tracking document.

### 3. Prepare for Phase 5

- [ ] Read Phase 5 specification in PHASES_PLAN.md
- [ ] Generate Phase 5 documentation
- [ ] Start Phase 5 implementation

---

## Validation Metrics

### Time Spent

| Activity | Time |
|----------|------|
| Build & Tests | ___ min |
| Functional Testing | ___ min |
| Visual Testing | ___ min |
| Performance Testing | ___ min |
| Accessibility Testing | ___ min |
| Cross-Browser Testing | ___ min |
| **Total** | ___ min |

### Quality Score

| Metric | Score (1-5) |
|--------|-------------|
| Code Quality | ___ |
| Test Coverage | ___ |
| Performance | ___ |
| Accessibility | ___ |
| Visual Design | ___ |
| **Average** | ___ |

---

**Validation Checklist Created**: 2025-12-10
**Last Updated**: 2025-12-10
**Validated By**: ________________
**Validation Date**: ________________
