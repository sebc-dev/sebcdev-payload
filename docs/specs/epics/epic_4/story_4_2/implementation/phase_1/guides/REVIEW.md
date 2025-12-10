# Phase 1: TOC Data Extraction - Code Review Guide

**Story**: 4.2 - Table des Matières (TOC) & Progression
**Phase**: 1 - TOC Data Extraction

---

## Review Overview

This guide provides structured review criteria for each commit in Phase 1. Use this during PR review to ensure quality and consistency.

### Review Scope

| Commit | Files to Review | Focus Areas |
|--------|-----------------|-------------|
| 1 | `types.ts`, `slugify.ts` | Types, function correctness |
| 2 | `extract-headings.ts`, `index.ts` | Logic, edge cases, exports |
| 3 | `extract-headings.spec.ts` | Test coverage, quality |
| 4 | `Heading.tsx` | Integration, no regression |

---

## General Review Criteria

### Code Quality Standards

- [ ] **TypeScript**: Strict mode compliance, no `any` types
- [ ] **ESLint**: All rules pass, no disabled rules
- [ ] **Naming**: Clear, descriptive names following project conventions
- [ ] **Comments**: JSDoc on exports, inline comments for complex logic only
- [ ] **DRY**: No code duplication
- [ ] **Single Responsibility**: Each function does one thing

### Documentation Standards

- [ ] All exported functions have JSDoc with `@param`, `@returns`, `@example`
- [ ] Type definitions have clear descriptions
- [ ] Module-level JSDoc explains purpose

---

## Commit 1 Review: Types & Slugify Utility

### Files: `src/lib/toc/types.ts`

#### Type Definitions

```typescript
// Review checklist for types.ts
```

- [ ] `TOCHeading` interface is complete and correct
  - [ ] `id: string` - for URL anchor
  - [ ] `text: string` - plain text content
  - [ ] `level: 2 | 3` - literal union type (not `number`)

- [ ] `TOCData` is a type alias for `TOCHeading[]`

- [ ] `TOCExtractionInput` properly handles nullable cases
  - [ ] Accepts `LexicalContent`
  - [ ] Accepts `null`
  - [ ] Accepts `undefined`

- [ ] Import from `@/components/richtext/types` is correct

#### Questions to Ask

1. Are the types too restrictive or too permissive?
2. Would future phases need additional fields?
3. Is the naming consistent with project conventions?

### Files: `src/lib/toc/slugify.ts`

#### Function Implementation

- [ ] Function signature: `function slugify(text: string): string`

- [ ] Algorithm correctness:
  - [ ] `.toLowerCase()` - case normalization
  - [ ] `.normalize('NFD')` - Unicode normalization
  - [ ] `/[\u0300-\u036f]/g` - accent removal
  - [ ] `/[^a-z0-9\s-]/g` - special char removal
  - [ ] `.trim()` - whitespace trim
  - [ ] `/\s+/g` - space to hyphen
  - [ ] `/-+/g` - hyphen deduplication

- [ ] Edge case handling:
  - [ ] Empty string returns empty string
  - [ ] String with only special chars returns empty string
  - [ ] Multiple spaces collapse correctly

- [ ] JSDoc present with:
  - [ ] `@param text` description
  - [ ] `@returns` description
  - [ ] `@example` with realistic examples

#### Comparison with Original

```bash
# Compare with original in Heading.tsx
diff <(sed -n '36,45p' src/components/richtext/nodes/Heading.tsx) src/lib/toc/slugify.ts
```

- [ ] Logic is identical to original `slugify` in Heading.tsx
- [ ] No functional differences that would cause ID mismatches

---

## Commit 2 Review: Extract Headings Function

### Files: `src/lib/toc/extract-headings.ts`

#### Helper Functions

**`extractText(children: LexicalNode[]): string`**

- [ ] Recursively traverses node tree
- [ ] Handles `TextNode` correctly (returns `text` property)
- [ ] Handles nodes with children (recursive call)
- [ ] Handles nodes without text/children (returns empty string)
- [ ] Joins results without separator issues

**`isTOCHeadingLevel(tag): tag is 'h2' | 'h3'`**

- [ ] Type guard returns correct type predicate
- [ ] Only returns true for 'h2' and 'h3'

**`headingNodeToTOCHeading(node): TOCHeading | null`**

- [ ] Returns `null` for non-h2/h3 headings
- [ ] Returns `null` for empty text
- [ ] Returns `null` for text that produces empty ID
- [ ] Correctly maps level: `'h2' -> 2`, `'h3' -> 3`
- [ ] Trims text before returning

**`extractFromNodes(nodes: LexicalNode[]): TOCHeading[]`**

- [ ] Iterates through all nodes
- [ ] Checks for heading nodes
- [ ] Recursively processes children (for nested structures)
- [ ] Accumulates headings correctly

#### Main Function

**`extractTOCHeadings(content: TOCExtractionInput): TOCData`**

- [ ] Handles `null` input (returns `[]`)
- [ ] Handles `undefined` input (returns `[]`)
- [ ] Handles missing `root` (returns `[]`)
- [ ] Handles missing `root.children` (returns `[]`)
- [ ] Uses optional chaining correctly
- [ ] Returns proper `TOCData` type

#### JSDoc Quality

- [ ] Module-level JSDoc explaining purpose
- [ ] Function JSDoc with `@param`, `@returns`, `@example`
- [ ] Example shows realistic usage

### Files: `src/lib/toc/index.ts`

#### Exports

- [ ] Types exported: `TOCHeading`, `TOCData`, `TOCExtractionInput`
- [ ] Functions exported: `slugify`, `extractTOCHeadings`
- [ ] Uses `export type` for type-only exports
- [ ] Module JSDoc with usage example

#### Import Test

```typescript
// This should work after commit 2
import { extractTOCHeadings, slugify } from '@/lib/toc'
import type { TOCHeading, TOCData } from '@/lib/toc'
```

- [ ] All imports resolve correctly
- [ ] No circular dependencies

---

## Commit 3 Review: Unit Tests

### Files: `tests/unit/lib/toc/extract-headings.spec.ts`

#### Test Structure

- [ ] Uses `describe` blocks for logical grouping
- [ ] Test names are descriptive (`it('should...')`)
- [ ] Follows Arrange-Act-Assert pattern
- [ ] No test interdependencies

#### Helper Functions

- [ ] `createLexicalContent` - creates valid test fixtures
- [ ] `createHeading` - creates heading nodes
- [ ] `createParagraph` - creates paragraph nodes
- [ ] Helpers produce valid Lexical structures

#### Slugify Tests

| Test Case | Covered |
|-----------|---------|
| Lowercase conversion | [ ] |
| Space to hyphen | [ ] |
| Accent removal | [ ] |
| Special char removal | [ ] |
| Hyphen deduplication | [ ] |
| Whitespace trim | [ ] |
| Empty string | [ ] |
| Only special chars | [ ] |

#### Extraction Tests - Basic

| Test Case | Covered |
|-----------|---------|
| Extract h2 headings | [ ] |
| Extract h3 headings | [ ] |
| Extract mixed h2/h3 | [ ] |

#### Extraction Tests - Filtering

| Test Case | Covered |
|-----------|---------|
| Ignore h1 | [ ] |
| Ignore h4/h5/h6 | [ ] |

#### Extraction Tests - Edge Cases

| Test Case | Covered |
|-----------|---------|
| Null content | [ ] |
| Undefined content | [ ] |
| Empty children array | [ ] |
| Empty heading text | [ ] |
| Whitespace-only heading | [ ] |
| Special chars in heading | [ ] |
| Accents in heading | [ ] |

#### Extraction Tests - Nested Content

| Test Case | Covered |
|-----------|---------|
| Heading with nested link | [ ] |
| Heading with formatted text | [ ] |

#### Extraction Tests - Real World

| Test Case | Covered |
|-----------|---------|
| Typical article structure | [ ] |
| Order preservation | [ ] |

#### Test Quality

- [ ] Assertions are specific (not just `toBeTruthy`)
- [ ] Uses `toEqual` for object comparison
- [ ] Tests independent, can run in any order
- [ ] No console.log or debug code
- [ ] Realistic test data

#### Coverage Check

```bash
pnpm test:unit --coverage tests/unit/lib/toc/
```

- [ ] Statement coverage > 80%
- [ ] Branch coverage > 80%
- [ ] Function coverage > 80%

---

## Commit 4 Review: Heading.tsx Integration

### Files: `src/components/richtext/nodes/Heading.tsx`

#### Import Changes

- [ ] Added: `import { slugify } from '@/lib/toc'`
- [ ] Removed: Local `slugify` function implementation
- [ ] Added: `export { slugify }` for backwards compatibility

#### No Regression

- [ ] Component still compiles
- [ ] JSX rendering unchanged
- [ ] ID generation unchanged

#### Verification Commands

```bash
# Type check
pnpm exec tsc --noEmit

# Run tests
pnpm test:unit

# Manual verification
pnpm dev
# Visit article page, inspect heading IDs
```

- [ ] TypeScript passes
- [ ] All tests pass
- [ ] Article page renders correctly
- [ ] Heading IDs match expected format

---

## Overall PR Review

### Completeness

- [ ] All 4 commits present (or 3 if commit 4 deferred)
- [ ] Commit messages follow gitmoji convention
- [ ] Each commit is atomic and self-contained
- [ ] No unrelated changes included

### Quality Checklist

- [ ] TypeScript strict mode compliance
- [ ] ESLint passes
- [ ] All unit tests pass
- [ ] Test coverage > 80%
- [ ] JSDoc on all exports
- [ ] No `console.log` or debug code
- [ ] No commented-out code
- [ ] No TODO comments (unless tracked in issue)

### Integration Verification

- [ ] Can import from `@/lib/toc`
- [ ] No circular dependencies
- [ ] Heading.tsx works with shared slugify
- [ ] Article page renders correctly

### Security Review

- [ ] No sensitive data in code
- [ ] No hardcoded secrets
- [ ] Input sanitization appropriate (slugify removes special chars)

---

## Review Feedback Template

### Approval Template

```markdown
## Review: Phase 1 - TOC Data Extraction

**Status**: ✅ Approved

### Summary
All commits reviewed and meet quality standards.

### Highlights
- [mention positive aspects]

### Minor Suggestions (non-blocking)
- [optional improvements]

### Verified
- [x] TypeScript compiles
- [x] ESLint passes
- [x] All tests pass
- [x] Integration verified
```

### Request Changes Template

```markdown
## Review: Phase 1 - TOC Data Extraction

**Status**: ❌ Changes Requested

### Issues Found

#### Commit X: [commit name]
- [ ] **Issue**: [description]
  - **File**: `path/to/file.ts:line`
  - **Suggestion**: [how to fix]

### Before Approval
Please address the issues above and re-request review.
```

---

**Review Guide Generated**: 2025-12-10
**Last Updated**: 2025-12-10
