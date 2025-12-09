# Phase 1 - Commit Checklists

**Phase**: Article Page Route & Basic Layout
**Total Commits**: 5

Use this document during implementation. Check off items as you complete them.

---

## Commit 1: Payload Fetch Utilities

**Title**: `✨ feat(articles): add article fetch utilities for slug lookup`

### Pre-Implementation

- [ ] Branch is up to date with main
- [ ] Development server stopped (if running)
- [ ] Previous commit (if any) is clean

### Files to Create

#### `src/lib/payload/articles.ts`

- [ ] Create directory `src/lib/payload/` if not exists
- [ ] Create file with proper header comment
- [ ] Export `ArticleFetchResult` interface
- [ ] Implement `getArticleBySlug` function
- [ ] Add proper JSDoc documentation
- [ ] Handle error cases with try/catch
- [ ] Use `depth: 2` for relations
- [ ] Filter by `status: 'published'`

#### `tests/unit/lib/payload/articles.spec.ts`

- [ ] Create test file with proper structure
- [ ] Mock `payload` module
- [ ] Mock `@payload-config` module
- [ ] Test: returns article when found
- [ ] Test: returns null when not found
- [ ] Test: handles errors gracefully
- [ ] Test: uses correct locale parameter
- [ ] Test: filters by published status

### Validation

```bash
# Run these commands and verify they pass
pnpm exec tsc --noEmit
pnpm lint
pnpm test:unit -- tests/unit/lib/payload/articles.spec.ts
```

- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Unit tests pass

### Commit

```bash
git add src/lib/payload/articles.ts tests/unit/lib/payload/articles.spec.ts
git commit -m "$(cat <<'EOF'
✨ feat(articles): add article fetch utilities for slug lookup

- Create getArticleBySlug utility for fetching articles by slug
- Add ArticleFetchResult type for type-safe returns
- Handle error cases gracefully with error message
- Include depth: 2 for category/tags relations
- Add unit tests for all scenarios

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

- [ ] Commit created successfully
- [ ] Verify with `git log -1`

---

## Commit 2: ArticleHeader Component

**Title**: `✨ feat(articles): add ArticleHeader component with metadata display`

### Pre-Implementation

- [ ] Commit 1 is complete and pushed
- [ ] TypeScript compiles

### Files to Create/Modify

#### `src/components/articles/ArticleHeader.tsx`

- [ ] Create file with proper header comment
- [ ] Import `getTranslations` from `next-intl/server`
- [ ] Import existing components: `CategoryBadge`, `ComplexityBadge`, `RelativeDate`
- [ ] Define `ArticleHeaderProps` interface
- [ ] Implement `ArticleHeader` async function
- [ ] Add category badge (clickable)
- [ ] Add h1 title with responsive sizing
- [ ] Add metadata row: complexity, reading time, date
- [ ] Use proper spacing classes
- [ ] Add border-b separator

#### `src/components/articles/index.ts`

- [ ] Add export for `ArticleHeader`

### Validation

```bash
pnpm exec tsc --noEmit
pnpm lint
```

- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Component structure matches specification

### Manual Verification

- [ ] Review component visually in IDE
- [ ] Verify all imports are correct
- [ ] Verify props interface is complete

### Commit

```bash
git add src/components/articles/ArticleHeader.tsx src/components/articles/index.ts
git commit -m "$(cat <<'EOF'
✨ feat(articles): add ArticleHeader component with metadata display

- Create ArticleHeader RSC with article metadata
- Display category badge, title (h1), complexity badge
- Show reading time and relative publication date
- Use existing CategoryBadge, ComplexityBadge, RelativeDate
- Add responsive typography (text-3xl to text-5xl)
- Export from articles barrel file

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

- [ ] Commit created successfully
- [ ] Verify with `git log -1`

---

## Commit 3: ArticleFooter Component

**Title**: `✨ feat(articles): add ArticleFooter component with tags display`

### Pre-Implementation

- [ ] Commit 2 is complete and pushed
- [ ] TypeScript compiles

### Files to Create/Modify

#### `src/components/articles/ArticleFooter.tsx`

- [ ] Create file with proper header comment
- [ ] Import `getTranslations` from `next-intl/server`
- [ ] Import `TagPill` component
- [ ] Define `ArticleFooterProps` interface
- [ ] Implement `ArticleFooter` async function
- [ ] Return null when tags array is empty
- [ ] Add tags section with label
- [ ] Use `TagPill` for each tag
- [ ] Add border-t separator
- [ ] Use flex-wrap for responsive layout

#### `src/components/articles/index.ts`

- [ ] Add export for `ArticleFooter`

### Validation

```bash
pnpm exec tsc --noEmit
pnpm lint
```

- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Component handles empty tags correctly

### Commit

```bash
git add src/components/articles/ArticleFooter.tsx src/components/articles/index.ts
git commit -m "$(cat <<'EOF'
✨ feat(articles): add ArticleFooter component with tags display

- Create ArticleFooter RSC for displaying article tags
- Use existing TagPill component for tag rendering
- Add tags label with translation support
- Handle empty tags case (return null)
- Add responsive flex-wrap layout
- Export from articles barrel file

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

- [ ] Commit created successfully
- [ ] Verify with `git log -1`

---

## Commit 4: Article Page Route

**Title**: `✨ feat(articles): add article page route with data fetching`

### Pre-Implementation

- [ ] Commits 1-3 are complete
- [ ] TypeScript compiles
- [ ] All components are exported

### Files to Create

#### `src/app/[locale]/(frontend)/articles/[slug]/page.tsx`

- [ ] Create directory structure if not exists
- [ ] Create file with proper header comment
- [ ] Set `export const dynamic = 'force-dynamic'`
- [ ] Define `ArticlePageProps` interface
- [ ] Implement `mapPayloadToArticleData` function
  - [ ] Map category correctly
  - [ ] Map tags correctly
  - [ ] Handle all ArticleData fields
- [ ] Implement `ArticlePage` async component
- [ ] Extract locale and slug from params
- [ ] Call `setRequestLocale`
- [ ] Fetch article with `getArticleBySlug`
- [ ] Call `notFound()` if article not found
- [ ] Render `ArticleHeader`
- [ ] Add content placeholder div
- [ ] Render `ArticleFooter`
- [ ] Use `max-w-prose` for reading width

### Validation

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Build succeeds

### Manual Verification (with dev server)

```bash
pnpm dev
# Visit: http://localhost:3000/fr/articles/[existing-slug]
```

- [ ] Page renders with article header
- [ ] Content placeholder visible
- [ ] Footer with tags visible
- [ ] No console errors

### Commit

```bash
git add src/app/[locale]/(frontend)/articles/[slug]/page.tsx
git commit -m "$(cat <<'EOF'
✨ feat(articles): add article page route with data fetching

- Create article page at /[locale]/articles/[slug]
- Implement mapPayloadToArticleData for type conversion
- Assemble ArticleHeader and ArticleFooter components
- Add content placeholder for Phase 2 Lexical integration
- Use notFound() for missing articles
- Force dynamic rendering for Payload compatibility

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

- [ ] Commit created successfully
- [ ] Verify with `git log -1`

---

## Commit 5: Translations & 404 Page

**Title**: `✨ feat(articles): add article translations and 404 page`

### Pre-Implementation

- [ ] Commits 1-4 are complete
- [ ] Page route works

### Files to Create/Modify

#### `src/app/[locale]/(frontend)/articles/[slug]/not-found.tsx`

- [ ] Create file with proper header comment
- [ ] Import `Link`, `getTranslations`, `FileQuestion`, `Button`
- [ ] Implement `ArticleNotFound` async component
- [ ] Add FileQuestion icon (centered)
- [ ] Add translated title (h1)
- [ ] Add translated description
- [ ] Add "Back to home" button with Link

#### `messages/fr.json`

- [ ] Add/update `article` section
- [ ] Add `readingTime`: `"{minutes} min de lecture"`
- [ ] Add `tagsLabel`: `"Mots-clés"`
- [ ] Add `notFound.title`: `"Article non trouvé"`
- [ ] Add `notFound.description`: appropriate message
- [ ] Add `notFound.backToHome`: `"Retour à l'accueil"`

#### `messages/en.json`

- [ ] Add/update `article` section
- [ ] Add `readingTime`: `"{minutes} min read"`
- [ ] Add `tagsLabel`: `"Tags"`
- [ ] Add `notFound.title`: `"Article not found"`
- [ ] Add `notFound.description`: appropriate message
- [ ] Add `notFound.backToHome`: `"Back to home"`

### Validation

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Build succeeds
- [ ] JSON files are valid

### Manual Verification

```bash
pnpm dev
# Visit: http://localhost:3000/fr/articles/non-existent-slug
# Visit: http://localhost:3000/en/articles/non-existent-slug
```

- [ ] 404 page renders for non-existent slugs
- [ ] French version shows French text
- [ ] English version shows English text
- [ ] Button links to homepage

### Commit

```bash
git add src/app/[locale]/(frontend)/articles/[slug]/not-found.tsx messages/fr.json messages/en.json
git commit -m "$(cat <<'EOF'
✨ feat(articles): add article translations and 404 page

- Create not-found.tsx for missing articles
- Add FileQuestion icon and helpful message
- Add translation keys for article page (FR/EN):
  - readingTime, tagsLabel, notFound.*
- Include backToHome CTA button

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

- [ ] Commit created successfully
- [ ] Verify with `git log -1`

---

## Post-Phase Validation

After all 5 commits:

### Final Checks

```bash
# Full validation suite
pnpm exec tsc --noEmit
pnpm lint
pnpm test:unit
pnpm build
```

- [ ] All checks pass

### Git History

```bash
git log --oneline -5
```

- [ ] 5 commits visible with correct messages
- [ ] Each commit has gitmoji prefix (✨)

### Manual Testing

- [ ] Visit article page with valid slug
- [ ] Verify header displays correctly
- [ ] Verify footer displays tags
- [ ] Visit with invalid slug → 404 page
- [ ] Test both FR and EN locales

### Documentation Update

- [ ] Update EPIC_TRACKING.md to mark Phase 1 docs generated
- [ ] Complete [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| TypeScript error on Payload types | Run `pnpm generate:types` |
| Import not found | Check barrel exports in `index.ts` |
| Translation not found | Verify key exists in both JSON files |
| 404 not rendering | Check `notFound()` is called correctly |
| Build fails | Check for missing dependencies |

### Recovery Commands

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# View changes in last commit
git show HEAD

# Check current status
git status
```

---

**Checklist Generated**: 2025-12-09
**Total Commits**: 5
