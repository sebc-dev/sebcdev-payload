# Phase 4: Environment Setup

**Phase**: Integration & E2E Testing
**Prerequisites**: Phases 1-3 completed

---

## Quick Start

```bash
# 1. Verify branch
git checkout feature/story-4.2-phase-4
git pull origin feature/story-4.2-phase-4

# 2. Install dependencies
pnpm install

# 3. Verify prerequisite components exist
ls src/lib/toc/                    # Phase 1: TOC extraction
ls src/components/articles/*.tsx    # Phases 2-3: Components

# 4. Start development server
pnpm dev

# 5. Verify Playwright is ready
pnpm exec playwright install  # If not already installed
```

---

## Prerequisites Verification

### Phase 1: TOC Extraction (REQUIRED)

Verify the TOC extraction module exists:

```bash
# Check files exist
ls -la src/lib/toc/
# Expected: types.ts, slugify.ts, extract-headings.ts, index.ts

# Verify exports work
pnpm exec tsc --noEmit
```

**Required exports from `@/lib/toc`**:
- `extractTOCHeadings(content: LexicalContent): TOCHeading[]`
- `slugify(text: string): string`
- `TOCHeading` type

### Phase 2: Reading Progress Bar (REQUIRED)

```bash
# Check component exists
cat src/components/articles/ReadingProgressBar.tsx

# Verify it's exported
grep -n "ReadingProgressBar" src/components/articles/index.ts
```

**Required exports**:
- `ReadingProgressBar` component
- `ReadingProgressBarProps` type

### Phase 3: TOC Components (REQUIRED)

```bash
# Check components exist
ls src/components/articles/TableOfContents.tsx
ls src/components/articles/MobileTOC.tsx
ls src/components/articles/TOCLink.tsx

# Verify hook exists
ls src/hooks/use-active-section.ts
```

**Required exports**:
- `TableOfContents` component
- `MobileTOC` component
- `TOCLink` component
- `useActiveSection` hook

---

## Development Environment

### Node.js & Package Manager

```bash
# Verify Node.js version (requires ≥18.17)
node --version

# Verify pnpm
pnpm --version
```

### Environment Variables

No additional environment variables required for Phase 4.

Existing `.env` should have:
```bash
PAYLOAD_SECRET=your-secret-key
# Other existing vars...
```

### IDE Setup

**Recommended VS Code Extensions**:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Playwright Test for VS Code

**Settings for E2E tests** (`.vscode/settings.json`):
```json
{
  "playwright.reuseBrowser": true,
  "playwright.showTrace": true
}
```

---

## Testing Environment

### Playwright Setup

```bash
# Install Playwright browsers (if not already)
pnpm exec playwright install chromium

# Verify installation
pnpm exec playwright --version
```

### Test Database & Seeding

E2E tests require a seeded article with headings:

```bash
# Check if seed script exists
cat package.json | grep seed

# Run seed if needed
pnpm seed

# Or start dev server which may auto-seed
pnpm dev
```

**Required seeded content**:
- At least one article with multiple h2/h3 headings
- Article must be published (not draft)
- Article must have sufficient length for scroll testing

### Verify Test Article Exists

```bash
# Start dev server
pnpm dev

# In another terminal, check article exists
curl -s http://localhost:3000/fr/articles | grep -o 'href="/fr/articles/[^"]*"' | head -5
```

Note the article slug for use in E2E tests.

---

## File Structure

### Files to Create

```
src/components/articles/
└── ArticleLayout.tsx          # New - Layout wrapper

tests/e2e/articles/
├── toc-navigation.e2e.spec.ts    # New - TOC tests
└── reading-progress.e2e.spec.ts  # New - Progress tests
```

### Files to Modify

```
messages/
├── en.json                    # Add TOC translations
└── fr.json                    # Add TOC translations

src/app/[locale]/(frontend)/articles/[slug]/
└── page.tsx                   # Integrate ArticleLayout

src/components/articles/
└── index.ts                   # Add ArticleLayout export
```

---

## Dependency Verification

### Runtime Dependencies

All should already be installed:

```bash
# Check key dependencies
pnpm list react next lucide-react @radix-ui/react-dialog
```

### Dev Dependencies for Testing

```bash
# Playwright and axe-core
pnpm list @playwright/test @axe-core/playwright --dev
```

If `@axe-core/playwright` is missing:
```bash
pnpm add -D @axe-core/playwright
```

---

## Common Issues & Solutions

### Issue: TOC components not found

**Symptom**: Import errors for `TableOfContents`, `MobileTOC`, etc.

**Solution**: Verify Phase 3 is complete:
```bash
git log --oneline | grep -i "phase.3" | head -5
ls src/components/articles/TableOfContents.tsx
```

### Issue: Playwright tests timeout

**Symptom**: Tests hang waiting for page load

**Solution**:
1. Ensure dev server is running: `pnpm dev`
2. Check article exists at test URL
3. Increase timeout in test config if needed

### Issue: E2E tests fail on CI but pass locally

**Symptom**: Different behavior in GitHub Actions

**Solution**:
1. Ensure test article is seeded in CI
2. Use explicit waits instead of fixed timeouts
3. Check viewport sizes match expectations

### Issue: axe-core violations

**Symptom**: Accessibility tests fail

**Solution**:
1. Check specific violation messages
2. Usually: missing labels, contrast issues
3. Fix in component code, not by excluding from tests

---

## Verification Checklist

Before starting implementation:

- [ ] On correct branch: `feature/story-4.2-phase-4`
- [ ] Dependencies installed: `pnpm install`
- [ ] Dev server works: `pnpm dev`
- [ ] Build passes: `pnpm build`
- [ ] Lint passes: `pnpm lint`
- [ ] Unit tests pass: `pnpm test:unit`
- [ ] Phase 1 complete: `@/lib/toc` exports work
- [ ] Phase 2 complete: `ReadingProgressBar` renders
- [ ] Phase 3 complete: `TableOfContents` renders
- [ ] Playwright installed: `pnpm exec playwright --version`
- [ ] Test article exists: Navigate to `/fr/articles/[slug]`

---

## Quick Reference Commands

```bash
# Development
pnpm dev                          # Start dev server
pnpm build                        # Build application
pnpm lint                         # Run ESLint

# Testing
pnpm test:unit                    # Unit tests
pnpm test:e2e                     # All E2E tests
pnpm test:e2e tests/e2e/articles/ # Article E2E tests only

# Playwright specific
pnpm exec playwright test --ui    # Interactive UI mode
pnpm exec playwright test --debug # Debug mode
pnpm exec playwright show-report  # Show HTML report

# Type checking
pnpm exec tsc --noEmit            # Check types without emitting
```

---

**Ready to implement?** Proceed to [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
