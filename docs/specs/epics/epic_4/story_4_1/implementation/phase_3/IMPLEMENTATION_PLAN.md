# Phase 3 - Atomic Implementation Plan

**Objective**: Add syntax highlighting for code blocks with Shiki, compatible with Cloudflare Workers Edge runtime

---

## Overview

### Why an Atomic Approach?

This phase is split into **5 independent commits** to:

- **Facilitate review**: Each commit focuses on a single responsibility
- **Enable rollback**: If a commit has issues, revert without breaking everything
- **Progressive type-safety**: Types validate at each step
- **Tests as you go**: Tests accompany the relevant code
- **Continuous documentation**: Each commit can be documented independently

### Global Strategy

```
[Commit 1] → [Commit 2] → [Commit 3] → [Commit 4] → [Commit 5]
     ↓           ↓           ↓           ↓           ↓
   Shiki      CodeBlock   InlineCode  CopyButton  Integration
   Config     Component   Component   Component   & Tests
```

---

## The 5 Atomic Commits

### Commit 1: Shiki Configuration & Setup

**Files**: 2 files
**Size**: ~80 lines
**Duration**: 30-45 min (implementation) + 15 min (review)

**Content**:

- Install `shiki` package
- Create `src/components/richtext/shiki-config.ts`
- Configure highlighter with web bundle
- Define supported languages subset
- Define theme (github-dark)
- Export async `getHighlighter()` function

**Why it's atomic**:

- Single responsibility: Configuration only
- Foundation for CodeBlock component
- Can be validated independently
- No visual changes yet

**Files Affected**:

```
package.json                                   (modified - add shiki)
src/components/richtext/shiki-config.ts        (new)
```

**Technical Validation**:

```bash
pnpm exec tsc --noEmit
```

**Expected Result**: TypeScript compiles, Shiki config exports correctly

**Review Criteria**:

- [ ] Shiki installed with correct version
- [ ] Languages limited to essential set (bundle size)
- [ ] Theme matches Design System (dark)
- [ ] Async highlighter properly typed
- [ ] Web bundle used for Edge compatibility

---

### Commit 2: CodeBlock Component

**Files**: 3 files
**Size**: ~150 lines
**Duration**: 45-60 min (implementation) + 20 min (review)

**Content**:

- Create `src/components/richtext/nodes/CodeBlock.tsx`
- Server Component that renders highlighted code
- Extract code text from Lexical node children
- Handle language detection from node
- Render Shiki highlighted HTML
- Add language indicator header
- Apply styling consistent with Design System

**Why it's atomic**:

- Core functionality of the phase
- Complete visual component
- Can be tested in isolation
- Does not modify existing code yet

**Files Affected**:

```
src/components/richtext/nodes/CodeBlock.tsx    (new)
src/components/richtext/nodes/index.ts         (modified - export)
```

**Technical Validation**:

```bash
pnpm exec tsc --noEmit && pnpm test:unit -- --grep "CodeBlock"
```

**Expected Result**: CodeBlock renders highlighted code with language indicator

**Review Criteria**:

- [ ] Server Component (async, no "use client")
- [ ] Extracts text from children recursively
- [ ] Handles missing language gracefully (defaults to "text")
- [ ] Applies JetBrains Mono font
- [ ] Dark background consistent with Design System
- [ ] Language indicator styled appropriately
- [ ] Horizontal scroll for long lines
- [ ] Accessible (no issues with screen readers)

---

### Commit 3: InlineCode Component

**Files**: 2 files
**Size**: ~60 lines
**Duration**: 20-30 min (implementation) + 10 min (review)

**Content**:

- Create `src/components/richtext/nodes/InlineCode.tsx`
- Simple styled `<code>` element
- No syntax highlighting (inline text)
- Consistent styling with Design System
- Update serializer to handle inline code in text

**Why it's atomic**:

- Simple, focused component
- Complements CodeBlock for inline usage
- Independent of copy functionality

**Files Affected**:

```
src/components/richtext/nodes/InlineCode.tsx   (new)
src/components/richtext/nodes/index.ts         (modified - export)
```

**Technical Validation**:

```bash
pnpm exec tsc --noEmit && pnpm test:unit -- --grep "InlineCode"
```

**Expected Result**: Inline code renders with consistent styling

**Review Criteria**:

- [ ] Simple `<code>` element
- [ ] Background matches code block style
- [ ] Rounded corners (border-radius)
- [ ] Padding appropriate for inline use
- [ ] JetBrains Mono font
- [ ] Doesn't break text flow

**Note**: Inline code is already handled in `serializeText` via TEXT_FORMAT.CODE. This commit may focus on refining the styling to be consistent with CodeBlock, or creating a dedicated component if needed.

---

### Commit 4: CopyButton Component

**Files**: 2 files
**Size**: ~100 lines
**Duration**: 30-45 min (implementation) + 15 min (review)

**Content**:

- Create `src/components/ui/copy-button.tsx`
- Client Component ("use client")
- Clipboard API integration
- Copy/Copied state with icon change
- Accessible button with aria-label
- Timeout to reset state

**Why it's atomic**:

- Client-side interactivity isolated
- Reusable UI component
- Can be tested independently
- Clear separation from server rendering

**Files Affected**:

```
src/components/ui/copy-button.tsx              (new)
src/components/richtext/nodes/CodeBlock.tsx    (modified - integrate CopyButton)
```

**Technical Validation**:

```bash
pnpm exec tsc --noEmit && pnpm test:unit -- --grep "CopyButton"
```

**Expected Result**: Copy button works, shows "Copied!" feedback

**Review Criteria**:

- [ ] Client Component directive present
- [ ] Uses Clipboard API (`navigator.clipboard.writeText`)
- [ ] Feature detection for unsupported browsers
- [ ] Icons: Copy icon → Check icon on success
- [ ] Auto-reset after 2 seconds
- [ ] Accessible: aria-label, focus visible
- [ ] Positioned top-right of code block
- [ ] Hover state on code block shows button

---

### Commit 5: Serializer Integration & Tests

**Files**: 4 files
**Size**: ~120 lines
**Duration**: 45-60 min (implementation) + 20 min (review)

**Content**:

- Update `serialize.tsx` to use CodeBlock
- Remove placeholder code block rendering
- Add comprehensive unit tests
- Verify integration with article page
- Update globals.css if needed for code styles

**Why it's atomic**:

- Integration commit: connects everything
- Replaces placeholder from Phase 2
- Completes the feature loop
- Final validation of the phase

**Files Affected**:

```
src/components/richtext/serialize.tsx                  (modified)
src/app/globals.css                                    (modified - if needed)
tests/unit/components/richtext/code-block.spec.tsx     (new)
tests/unit/components/richtext/nodes.spec.tsx          (modified - optional)
```

**Technical Validation**:

```bash
pnpm exec tsc --noEmit && pnpm lint && pnpm test:unit && pnpm build
```

**Expected Result**: Code blocks render with syntax highlighting in article pages

**Review Criteria**:

- [ ] Placeholder removed from serialize.tsx
- [ ] CodeBlock properly imported and used
- [ ] All unit tests pass
- [ ] Build succeeds without errors
- [ ] Visual inspection: code renders correctly
- [ ] Multiple languages render correctly
- [ ] Copy button functional

---

## Implementation Workflow

### Step-by-Step

1. **Read specification**: Understand requirements fully
2. **Setup environment**: Follow [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
3. **Implement Commit 1**: Follow [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md)
4. **Validate Commit 1**: Run validation commands
5. **Review Commit 1**: Self-review against criteria
6. **Commit Commit 1**: Use provided commit message
7. **Repeat for commits 2-5**
8. **Final validation**: Complete [VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)

### Validation at Each Step

After each commit:

```bash
# Type-check
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Unit tests
pnpm test:unit

# Build (recommended)
pnpm build
```

All must pass before moving to next commit.

---

## Commit Metrics

| Commit | Files | Lines | Implementation | Review | Total |
|--------|-------|-------|----------------|--------|-------|
| 1. Shiki Configuration | 2 | ~80 | 30-45 min | 15 min | ~50 min |
| 2. CodeBlock Component | 3 | ~150 | 45-60 min | 20 min | ~70 min |
| 3. InlineCode Component | 2 | ~60 | 20-30 min | 10 min | ~35 min |
| 4. CopyButton Component | 2 | ~100 | 30-45 min | 15 min | ~55 min |
| 5. Integration & Tests | 4 | ~120 | 45-60 min | 20 min | ~70 min |
| **TOTAL** | **13** | **~510** | **2.5-4h** | **1.3h** | **4-5h** |

---

## Atomic Approach Benefits

### For Developers

- Clear focus: One thing at a time
- Testable: Each commit validated
- Documented: Clear commit messages

### For Reviewers

- Fast review: 15-20 min per commit
- Focused: Single responsibility to check
- Quality: Easier to spot issues

### For the Project

- Rollback-safe: Revert without breaking
- Historical: Clear progression in git history
- Maintainable: Easy to understand later

---

## Commit Messages

### Format

```
<gitmoji> <type>(<scope>): short description

- Point 1: detail
- Point 2: detail

Phase 3 - Commit X/5
Story 4.1 - Rendu Article & MDX
```

### Suggested Messages

**Commit 1**:
```
🔧 feat(richtext): add Shiki syntax highlighting configuration

- Install shiki package for Edge-compatible highlighting
- Configure web bundle with essential languages
- Set github-dark theme for Design System consistency
- Export async getHighlighter utility

Phase 3 - Commit 1/5
Story 4.1 - Rendu Article & MDX
```

**Commit 2**:
```
✨ feat(richtext): add CodeBlock component with syntax highlighting

- Create CodeBlock RSC with Shiki integration
- Extract code text from Lexical node children
- Add language indicator header
- Apply Design System styling (JetBrains Mono, dark theme)

Phase 3 - Commit 2/5
Story 4.1 - Rendu Article & MDX
```

**Commit 3**:
```
✨ feat(richtext): add InlineCode component

- Create styled inline code element
- Consistent styling with CodeBlock
- JetBrains Mono font with subtle background

Phase 3 - Commit 3/5
Story 4.1 - Rendu Article & MDX
```

**Commit 4**:
```
✨ feat(ui): add CopyButton component for code blocks

- Create client-side copy button with Clipboard API
- Add visual feedback (copy → check icon)
- Integrate with CodeBlock component
- Accessible: aria-label, focus visible

Phase 3 - Commit 4/5
Story 4.1 - Rendu Article & MDX
```

**Commit 5**:
```
✅ feat(richtext): integrate CodeBlock in serializer with tests

- Update serialize.tsx to use CodeBlock component
- Remove Phase 2 placeholder code
- Add comprehensive unit tests
- Verify build and visual rendering

Phase 3 - Commit 5/5
Story 4.1 - Rendu Article & MDX
```

---

## Lexical Code Node Reference

### Code Block Node (from Payload Lexical)

```json
{
  "type": "code",
  "language": "typescript",
  "children": [
    {
      "type": "code-highlight",
      "text": "const foo = 'bar';",
      "highlightType": "keyword"
    }
  ],
  "direction": "ltr",
  "format": "",
  "indent": 0,
  "version": 1
}
```

**Note**: Payload Lexical may structure code differently. The actual structure should be verified by inspecting the JSON output from the CMS.

### Alternative Structure (simpler)

```json
{
  "type": "code",
  "language": "typescript",
  "children": [
    {
      "type": "text",
      "text": "const foo = 'bar';\nconst baz = 42;",
      "format": 0,
      "version": 1
    }
  ],
  "version": 1
}
```

The CodeBlock component should handle both structures gracefully.

---

## Important Points

### Do's

- Follow the commit order (dependencies)
- Validate after each commit
- Write tests alongside code
- Use provided commit messages as template
- Check Payload Lexical code structure before implementing

### Don'ts

- Skip commits or combine them
- Commit without running validations
- Change files from previous commits (unless fixing a bug)
- Add features not in scope (line numbers, diff highlighting)
- Use heavy grammars that bloat bundle size

---

## FAQ

**Q: What if Shiki bundle is too large?**
A: Reduce language set. Start with JS/TS/JSON/Bash, add more if needed.

**Q: What if a commit is too big?**
A: Split it into smaller commits (update this plan).

**Q: How to handle unknown languages?**
A: Render as plain text (no highlighting). Log warning in dev mode.

**Q: Should CodeBlock be async?**
A: Yes, Shiki `codeToHtml` is async. Use async Server Component.

**Q: What about SSR/hydration mismatch?**
A: CodeBlock is a Server Component. CopyButton is Client Component with proper isolation.

---

## Next Steps

After completing this phase:

1. **Phase 4**: Image Rendering & Advanced Styling
2. **Phase 5**: SEO, Metadata & E2E Tests

The article page will then have complete rich text rendering.

---

**Plan Generated**: 2025-12-10
**Total Commits**: 5
**Estimated Duration**: 4-5 hours
