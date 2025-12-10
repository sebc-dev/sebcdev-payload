# Phase 1: TOC Data Extraction - Index

**Story**: 4.2 - Table des Matières (TOC) & Progression
**Epic**: Epic 4 - Article Reading Experience
**Phase**: 1 of 4
**Status**: 📋 READY FOR IMPLEMENTATION

---

## Quick Navigation

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Atomic commit strategy | Start here - understand the approach |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) | Per-commit detailed checklist | During implementation |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Environment configuration | Before starting development |
| [guides/REVIEW.md](./guides/REVIEW.md) | Code review guidelines | During PR review |
| [guides/TESTING.md](./guides/TESTING.md) | Testing strategy | When writing tests |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Final validation | Before marking phase complete |

---

## Phase Overview

### Objective

Create a reusable utility for extracting headings (h2, h3) from Lexical JSON content to power the Table of Contents feature. This is the **foundation phase** that provides data extraction capabilities needed by Phase 3 (TOC Component).

### Key Deliverables

- [ ] TypeScript types for TOC data structures (`TOCHeading`, `TOCData`)
- [ ] `extractTOCHeadings()` function to parse Lexical content
- [ ] Shared `slugify()` utility (moved from Heading.tsx)
- [ ] Comprehensive unit tests (5+ test cases)
- [ ] Clean exports via `@/lib/toc` barrel file

### Scope Summary

| Aspect | Details |
|--------|---------|
| **New Files** | 4 files in `src/lib/toc/` + 1 test file |
| **Modified Files** | 1 file (`Heading.tsx` - export slugify) |
| **Dependencies** | None (foundation phase) |
| **Complexity** | Low |
| **Estimated Commits** | 3-4 atomic commits |

---

## Files Affected

### New Files

| File | Purpose | Lines Est. |
|------|---------|-----------|
| `src/lib/toc/types.ts` | TypeScript type definitions | ~25 |
| `src/lib/toc/slugify.ts` | Shared slugify utility | ~30 |
| `src/lib/toc/extract-headings.ts` | Main extraction logic | ~60 |
| `src/lib/toc/index.ts` | Barrel exports | ~15 |
| `tests/unit/lib/toc/extract-headings.spec.ts` | Unit tests | ~150 |

### Modified Files

| File | Change | Reason |
|------|--------|--------|
| `src/components/richtext/nodes/Heading.tsx` | Import slugify from shared location | DRY - single source of truth |

---

## Technical Context

### Existing Code Analysis

**Heading.tsx** (`src/components/richtext/nodes/Heading.tsx`):
- Contains `slugify()` function (lines 36-45)
- Contains `extractText()` helper (lines 19-31)
- Generates heading IDs using `slugify(extractText(children))`

**Lexical Types** (`src/components/richtext/types.ts`):
- `HeadingNode` interface defined (lines 68-72)
- `LexicalContent` interface with `root.children` structure (lines 194-196)
- `isHeadingNode()` type guard available (lines 222-224)

### Data Flow

```
Lexical JSON (article.content)
        ↓
  extractTOCHeadings()
        ↓
  TOCHeading[] array
        ↓
  Phase 3: TableOfContents component
```

### Type Definitions (Target)

```typescript
interface TOCHeading {
  id: string        // Generated via slugify()
  text: string      // Plain text from heading
  level: 2 | 3      // h2 or h3 only
}

type TOCData = TOCHeading[]
```

---

## Dependencies

### This Phase Requires

- None (foundation phase)

### This Phase Blocks

- **Phase 3**: TOC Component needs `extractTOCHeadings()` function
- **Phase 4**: Integration needs both extraction and components

### External Dependencies

- None - pure TypeScript/JavaScript utilities

---

## Success Criteria

### Functional Requirements

- [ ] `extractTOCHeadings()` correctly parses h2 and h3 headings
- [ ] Generated IDs match those produced by Heading.tsx component
- [ ] Empty content returns empty array (no errors)
- [ ] Nested/complex content structures handled correctly

### Technical Requirements

- [ ] TypeScript strict mode compliance
- [ ] ESLint passes with no errors
- [ ] Unit test coverage > 80%
- [ ] All 5+ test cases pass

### Integration Requirements

- [ ] Heading.tsx continues to work after refactor
- [ ] No regression in article page rendering

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Lexical structure variations | Low | Medium | Test with real article content |
| ID mismatch with Heading.tsx | Low | High | Use same slugify function |
| Breaking existing code | Low | Medium | Test Heading.tsx after changes |

**Overall Risk Level**: 🟢 Low

---

## Implementation Workflow

### Recommended Order

1. **Read** ENVIRONMENT_SETUP.md - ensure environment ready
2. **Read** IMPLEMENTATION_PLAN.md - understand commit strategy
3. **Follow** COMMIT_CHECKLIST.md - implement commit by commit
4. **Apply** guides/TESTING.md - write tests as you go
5. **Request** code review using guides/REVIEW.md
6. **Complete** validation/VALIDATION_CHECKLIST.md - verify all criteria

### Commands Quick Reference

```bash
# Run unit tests
pnpm test:unit

# Run specific test file
pnpm test:unit tests/unit/lib/toc/extract-headings.spec.ts

# Type checking
pnpm exec tsc --noEmit

# Linting
pnpm lint

# All quality checks
pnpm test:unit && pnpm exec tsc --noEmit && pnpm lint
```

---

## Related Documents

### Story Level

- [Story 4.2 Specification](../../story_4.2.md)
- [PHASES_PLAN.md](../PHASES_PLAN.md)

### Phase Level (Other Phases)

- Phase 2: Reading Progress Bar (parallel after Phase 1)
- Phase 3: TOC Component (depends on Phase 1)
- Phase 4: Integration (depends on all phases)

### Architecture

- [Architecture Technique](../../../../../Architecture_technique.md)
- [UX/UI Spec](../../../../../UX_UI_Spec.md) - Sections 5.2, 8.2

---

## Metrics & Tracking

### Estimated vs Actual

| Metric | Estimated | Actual |
|--------|-----------|--------|
| Duration | 1-2 days | - |
| Commits | 3-4 | - |
| Lines of Code | ~280 | - |
| Test Cases | 5+ | - |

### Progress Tracking

- [ ] Commit 1: Types and slugify utility
- [ ] Commit 2: Extract headings function
- [ ] Commit 3: Unit tests
- [ ] Commit 4: Integration with Heading.tsx (optional)

---

**Phase Documentation Generated**: 2025-12-10
**Last Updated**: 2025-12-10
**Generated by**: phase-doc-generator skill
