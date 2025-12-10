# Phase 1: TOC Data Extraction - Commit Checklist

**Story**: 4.2 - Table des Matières (TOC) & Progression
**Phase**: 1 - TOC Data Extraction
**Total Commits**: 3-4

---

## How to Use This Checklist

1. Complete each commit section in order
2. Check off items as you complete them
3. Run validation commands before committing
4. Use the provided commit message templates
5. Move to next commit only after all items checked

---

## Commit 1: Types & Slugify Utility

### Pre-Commit Setup

- [ ] Working on branch: `feature/story-4.2-phase-1`
- [ ] Development server stopped (not required for this commit)
- [ ] Terminal ready for commands

### Create Directory Structure

```bash
mkdir -p src/lib/toc
```

- [ ] Directory created: `src/lib/toc/`

### Create `src/lib/toc/types.ts`

- [ ] Create file with TOCHeading interface
- [ ] Create file with TOCData type alias
- [ ] Create file with TOCExtractionInput type
- [ ] Add JSDoc comments for all exports
- [ ] Import LexicalContent type from richtext/types

**Content Verification**:
- [ ] `TOCHeading` has: `id: string`, `text: string`, `level: 2 | 3`
- [ ] `TOCData` is `TOCHeading[]`
- [ ] `TOCExtractionInput` handles null/undefined cases

### Create `src/lib/toc/slugify.ts`

- [ ] Copy slugify logic from `src/components/richtext/nodes/Heading.tsx`
- [ ] Add JSDoc documentation with @param, @returns, @example
- [ ] Export function as named export

**Function Verification**:
- [ ] Converts to lowercase
- [ ] Normalizes NFD and removes accents
- [ ] Removes special characters (keeps a-z, 0-9, spaces, hyphens)
- [ ] Trims whitespace
- [ ] Replaces spaces with hyphens
- [ ] Collapses multiple hyphens

### Pre-Commit Validation

```bash
# Type check
pnpm exec tsc --noEmit

# Lint
pnpm lint
```

- [ ] TypeScript compiles without errors
- [ ] ESLint passes without errors

### Commit

```bash
git add src/lib/toc/types.ts src/lib/toc/slugify.ts
git commit -m "$(cat <<'EOF'
✨ feat(toc): add types and slugify utility for TOC extraction

- Add TOCHeading and TOCData type definitions
- Create shared slugify utility (moved from Heading.tsx logic)
- Prepare foundation for heading extraction

Story 4.2 Phase 1 - Commit 1/4

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

- [ ] Commit created successfully
- [ ] Commit message follows gitmoji convention

---

## Commit 2: Extract Headings Function

### Create `src/lib/toc/extract-headings.ts`

- [ ] Import types from richtext/types (LexicalNode, HeadingNode, etc.)
- [ ] Import type guards from richtext/types (hasChildren, isHeadingNode, isTextNode)
- [ ] Import slugify from ./slugify
- [ ] Import TOC types from ./types

**Helper Functions**:
- [ ] `extractText(children)` - recursively extracts plain text
- [ ] `isTOCHeadingLevel(tag)` - checks if h2 or h3
- [ ] `headingNodeToTOCHeading(node)` - converts HeadingNode to TOCHeading
- [ ] `extractFromNodes(nodes)` - recursively traverses node tree

**Main Function**:
- [ ] `extractTOCHeadings(content)` - main export
- [ ] Handles null/undefined input gracefully
- [ ] Handles missing root.children gracefully
- [ ] Returns empty array for invalid input
- [ ] JSDoc with @param, @returns, @example

**Logic Verification**:
- [ ] Only extracts h2 and h3 headings
- [ ] Skips h1, h4, h5, h6
- [ ] Skips empty headings
- [ ] Skips headings that produce empty IDs
- [ ] Handles nested text (links, formatted text)
- [ ] Preserves heading order

### Create `src/lib/toc/index.ts`

- [ ] Export types: `TOCHeading`, `TOCData`, `TOCExtractionInput`
- [ ] Export functions: `slugify`, `extractTOCHeadings`
- [ ] Add module JSDoc comment

### Pre-Commit Validation

```bash
# Type check
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Quick manual test (optional)
# Create a test file and run it
```

- [ ] TypeScript compiles without errors
- [ ] ESLint passes without errors
- [ ] No circular import warnings

### Commit

```bash
git add src/lib/toc/extract-headings.ts src/lib/toc/index.ts
git commit -m "$(cat <<'EOF'
✨ feat(toc): implement extractTOCHeadings function

- Add extractTOCHeadings() to parse Lexical JSON
- Support h2/h3 heading extraction with text and ID
- Handle edge cases: null content, empty headings, nested text
- Export via @/lib/toc barrel file

Story 4.2 Phase 1 - Commit 2/4

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

- [ ] Commit created successfully

---

## Commit 3: Unit Tests

### Create Test Directory

```bash
mkdir -p tests/unit/lib/toc
```

- [ ] Directory created: `tests/unit/lib/toc/`

### Create `tests/unit/lib/toc/extract-headings.spec.ts`

**Test Setup**:
- [ ] Import describe, it, expect from vitest
- [ ] Import extractTOCHeadings, slugify from @/lib/toc
- [ ] Import types from @/components/richtext/types
- [ ] Create helper functions: `createLexicalContent`, `createHeading`, `createParagraph`

**Slugify Tests** (8 tests):
- [ ] Converts text to lowercase
- [ ] Replaces spaces with hyphens
- [ ] Removes accents
- [ ] Removes special characters
- [ ] Collapses multiple hyphens
- [ ] Trims whitespace
- [ ] Handles empty string
- [ ] Handles string with only special chars

**Basic Extraction Tests** (3 tests):
- [ ] Extracts h2 headings
- [ ] Extracts h3 headings
- [ ] Extracts mixed h2 and h3 headings

**Filtering Tests** (2 tests):
- [ ] Ignores h1 headings
- [ ] Ignores h4, h5, h6 headings

**Edge Case Tests** (5 tests):
- [ ] Returns empty array for null content
- [ ] Returns empty array for undefined content
- [ ] Returns empty array for content without children
- [ ] Skips empty headings
- [ ] Handles headings with special characters
- [ ] Handles headings with accents

**Nested Content Tests** (2 tests):
- [ ] Extracts text from headings with nested links
- [ ] Handles headings with formatted text

**Real-World Scenario Tests** (2 tests):
- [ ] Handles typical article structure
- [ ] Preserves heading order

### Pre-Commit Validation

```bash
# Run unit tests
pnpm test:unit tests/unit/lib/toc/extract-headings.spec.ts

# Run all unit tests to ensure no regression
pnpm test:unit

# Type check
pnpm exec tsc --noEmit

# Lint
pnpm lint
```

- [ ] All tests pass
- [ ] No test failures
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without errors

### Check Coverage (Optional)

```bash
pnpm test:unit --coverage tests/unit/lib/toc/
```

- [ ] Coverage > 80% for toc module

### Commit

```bash
git add tests/unit/lib/toc/extract-headings.spec.ts
git commit -m "$(cat <<'EOF'
✅ test(toc): add comprehensive unit tests for TOC extraction

- Add slugify utility tests (8 test cases)
- Add extractTOCHeadings tests (15+ test cases)
- Cover edge cases: null/empty content, special chars, accents
- Test nested content: links, formatted text
- Verify real-world article structure handling

Story 4.2 Phase 1 - Commit 3/4

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

- [ ] Commit created successfully

---

## Commit 4: Heading.tsx Integration (Optional)

> **Note**: This commit is optional but recommended to maintain DRY principle.

### Modify `src/components/richtext/nodes/Heading.tsx`

**Current State** (lines 36-45):
```typescript
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    // ... rest of implementation
}
```

**Target State**:
```typescript
// Import from shared location
import { slugify } from '@/lib/toc'

// Re-export for backwards compatibility
export { slugify }
```

- [ ] Add import statement at top of file
- [ ] Remove local slugify implementation (lines 36-45)
- [ ] Add re-export for backwards compatibility
- [ ] Update JSDoc if needed

### Pre-Commit Validation

```bash
# Type check
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Run all unit tests
pnpm test:unit

# Start dev server and verify article page works
pnpm dev
# Visit an article page and check headings have correct IDs
```

- [ ] TypeScript compiles without errors
- [ ] ESLint passes without errors
- [ ] All unit tests pass
- [ ] Article page renders correctly
- [ ] Heading IDs are unchanged (check browser inspector)

### Commit

```bash
git add src/components/richtext/nodes/Heading.tsx
git commit -m "$(cat <<'EOF'
♻️ refactor(richtext): use shared slugify from @/lib/toc

- Import slugify from centralized location
- Remove duplicate implementation
- Maintain backwards compatibility with re-export

Story 4.2 Phase 1 - Commit 4/4

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

- [ ] Commit created successfully

---

## Final Phase Validation

After all commits are complete:

### Run Full Test Suite

```bash
# Unit tests
pnpm test:unit

# Type check
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Integration test (start dev and manually check)
pnpm dev
```

- [ ] All unit tests pass
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without errors
- [ ] Dev server starts without errors

### Verify Implementation

- [ ] `src/lib/toc/types.ts` exists and exports types
- [ ] `src/lib/toc/slugify.ts` exists and exports function
- [ ] `src/lib/toc/extract-headings.ts` exists and exports function
- [ ] `src/lib/toc/index.ts` exists and re-exports all
- [ ] Tests exist in `tests/unit/lib/toc/`
- [ ] Can import from `@/lib/toc` without errors

### Git Status Check

```bash
git log --oneline -4
```

- [ ] 3-4 commits created with proper messages
- [ ] All commits follow gitmoji convention
- [ ] No uncommitted changes

### Complete Validation Checklist

- [ ] Complete [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)

---

## Quick Command Reference

```bash
# Create directories
mkdir -p src/lib/toc tests/unit/lib/toc

# Type check
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Run specific test file
pnpm test:unit tests/unit/lib/toc/extract-headings.spec.ts

# Run all unit tests
pnpm test:unit

# Start dev server
pnpm dev

# Check git status
git status

# View commit history
git log --oneline -5
```

---

**Checklist Generated**: 2025-12-10
**Last Updated**: 2025-12-10
