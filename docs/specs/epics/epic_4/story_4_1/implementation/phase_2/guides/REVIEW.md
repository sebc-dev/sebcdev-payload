# Phase 2 - Code Review Guide

Complete guide for reviewing the Phase 2 implementation.

---

## 🎯 Review Objective

Validate that the implementation:

- ✅ Correctly serializes Lexical JSON to React components
- ✅ Handles all supported node types (paragraph, heading, list, quote, link)
- ✅ Applies proper text formatting (bold, italic, code, etc.)
- ✅ Generates heading anchors for future TOC integration
- ✅ Uses Next.js Link for internal navigation
- ✅ Follows project standards (TypeScript, no any, tests)
- ✅ Integrates seamlessly with article page

---

## 📋 Review Approach

Phase 2 is split into **6 atomic commits**. You can:

**Option A: Commit-by-commit review** (recommended)

- Easier to digest (15-30 min per commit)
- Progressive validation
- Targeted feedback

**Option B: Global review at once**

- Faster (2-3h total)
- Immediate overview
- Requires more focus

**Estimated Total Time**: 2-3h

---

## 🔍 Commit-by-Commit Review

### Commit 1: Lexical Types & Interfaces

**Files**: `src/components/richtext/types.ts`, `src/components/richtext/index.ts` (~150 lines)
**Duration**: 15-20 minutes

#### Review Checklist

##### Type Definitions

- [ ] All Lexical node types defined (text, paragraph, heading, list, listitem, quote, link)
- [ ] TEXT_FORMAT constants for bitmask operations
- [ ] Base interface with shared properties
- [ ] Union type `LexicalNode` covers all nodes

##### Type Safety

- [ ] No `any` types used
- [ ] Optional fields marked with `?`
- [ ] Correct use of discriminated unions
- [ ] Type guards implemented and exported

##### Code Quality

- [ ] JSDoc comments on all interfaces
- [ ] Consistent naming (PascalCase for types)
- [ ] Organized by category (text, block, inline)
- [ ] Barrel file exports all types

#### Technical Validation

```bash
pnpm exec tsc --noEmit
```

**Expected Result**: No TypeScript errors

#### Questions to Ask

1. Are all node types from Payload Lexical covered?
2. Is the TEXT_FORMAT bitmask correctly documented?
3. Are type guards properly typed with type predicates?

---

### Commit 2: Base Serializer Function

**Files**: `src/components/richtext/serialize.tsx`, `tests/unit/components/richtext/serialize.spec.ts` (~200 lines)
**Duration**: 20-30 minutes

#### Review Checklist

##### Serializer Logic

- [ ] `serializeLexical` handles null/undefined content
- [ ] Recursive traversal via `serializeNode`
- [ ] Children serialized via `serializeChildren`
- [ ] Unknown nodes handled gracefully (warning logged)

##### Text Formatting

- [ ] Bold applies `<strong>`
- [ ] Italic applies `<em>`
- [ ] Underline applies `<u>`
- [ ] Strikethrough applies `<s>`
- [ ] Code applies `<code>` with styling
- [ ] Combined formats work (bold + italic)

##### Code Quality

- [ ] No `any` types
- [ ] Keys provided for array elements
- [ ] Proper React fragments where needed
- [ ] Unit tests cover all scenarios

#### Technical Validation

```bash
pnpm exec tsc --noEmit && pnpm test:unit -- --grep "serialize"
```

**Expected Result**: All tests pass

#### Questions to Ask

1. Does the serializer handle deeply nested content?
2. Are all text format flags tested?
3. Is the unknown node warning helpful for debugging?

---

### Commit 3: Paragraph & Heading Nodes

**Files**: `src/components/richtext/nodes/Paragraph.tsx`, `Heading.tsx`, `index.ts` (~180 lines)
**Duration**: 20-30 minutes

#### Review Checklist

##### Paragraph Component

- [ ] Renders as `<p>` element
- [ ] Has appropriate margin-bottom
- [ ] Children rendered correctly

##### Heading Component

- [ ] Renders correct tag (h1-h6)
- [ ] ID generated from text content
- [ ] slugify handles accents and special chars
- [ ] Anchor link visible on hover
- [ ] `scroll-mt-20` for fixed header offset

##### Accessibility

- [ ] Anchor link has `aria-label`
- [ ] Heading hierarchy preserved
- [ ] Text content extractable

#### Technical Validation

```bash
pnpm exec tsc --noEmit && pnpm test:unit -- --grep "Paragraph|Heading"
```

**Expected Result**: All tests pass

#### Questions to Ask

1. Does slugify handle all edge cases (emojis, numbers)?
2. Is the anchor link accessible via keyboard?
3. Are heading styles consistent with design system?

---

### Commit 4: List & Quote Nodes

**Files**: `src/components/richtext/nodes/List.tsx`, `Quote.tsx` (~200 lines)
**Duration**: 20-30 minutes

#### Review Checklist

##### List Component

- [ ] Unordered list renders `<ul>` with bullets
- [ ] Ordered list renders `<ol>` with numbers
- [ ] List items render `<li>`
- [ ] Nested lists work correctly
- [ ] `start` attribute preserved for ordered lists

##### Quote Component

- [ ] Renders `<blockquote>`
- [ ] Left border with primary color
- [ ] Italic styling applied
- [ ] Proper vertical margins

##### Nesting

- [ ] Nested lists render correctly
- [ ] Indentation visible at each level
- [ ] List style changes for nested levels

#### Technical Validation

```bash
pnpm exec tsc --noEmit && pnpm test:unit -- --grep "List|Quote"
```

**Expected Result**: All tests pass

#### Questions to Ask

1. Are check lists handled (if supported)?
2. Is the nesting depth limited?
3. Does the quote style match design system?

---

### Commit 5: Link Node

**Files**: `src/components/richtext/nodes/Link.tsx` (~100 lines)
**Duration**: 15-20 minutes

#### Review Checklist

##### Link Behavior

- [ ] Internal links use Next.js `Link` component
- [ ] External links open in new tab
- [ ] `rel="noopener noreferrer"` on external links
- [ ] mailto: links work without new tab
- [ ] tel: links work without new tab

##### URL Detection

- [ ] `isExternalUrl` correctly identifies external URLs
- [ ] Relative URLs treated as internal
- [ ] Hash links (`#anchor`) treated as internal
- [ ] Protocol-relative URLs handled

##### Security

- [ ] No XSS via href injection
- [ ] External links have security attributes
- [ ] URL validation in place

#### Technical Validation

```bash
pnpm exec tsc --noEmit && pnpm test:unit -- --grep "Link"
```

**Expected Result**: All tests pass

#### Questions to Ask

1. How are broken/invalid URLs handled?
2. Is the newTab field from Payload respected?
3. Are internal doc links (Payload relationships) supported?

---

### Commit 6: RichText Component & Integration

**Files**: `src/components/richtext/RichText.tsx`, `index.ts`, article page update (~150 lines)
**Duration**: 20-30 minutes

#### Review Checklist

##### RichText Component

- [ ] Wraps content in prose container
- [ ] Handles null/undefined content
- [ ] Accepts className prop for customization
- [ ] Dark mode prose styles applied

##### Integration

- [ ] Article page imports RichText
- [ ] Phase 1 placeholder removed
- [ ] Content renders correctly
- [ ] No visual regressions

##### Exports

- [ ] All types exported from barrel
- [ ] Serializer functions exported
- [ ] Node components exported (advanced usage)

#### Technical Validation

```bash
pnpm exec tsc --noEmit && pnpm lint && pnpm test:unit && pnpm build
```

**Expected Result**: All checks pass, build succeeds

#### Visual Validation

1. Start dev server: `pnpm dev`
2. Visit article page with rich content
3. Verify all node types render correctly
4. Check dark mode styling

#### Questions to Ask

1. Does empty content show anything or nothing?
2. Are prose overrides correct for dark theme?
3. Can RichText be reused in other contexts?

---

## ✅ Global Validation

After reviewing all commits:

### Architecture & Design

- [ ] Serializer pattern is extensible for new node types
- [ ] Node components are reusable
- [ ] Types provide good IntelliSense
- [ ] No circular dependencies

### Code Quality

- [ ] Consistent style across all files
- [ ] Clear naming conventions
- [ ] Appropriate comments where needed
- [ ] No dead code

### Testing

- [ ] All node types tested
- [ ] Edge cases covered (empty, nested, malformed)
- [ ] Text formatting tested
- [ ] Coverage > 80%

### Type Safety

- [ ] No `any` types (unless justified)
- [ ] Type guards used correctly
- [ ] Props interfaces documented
- [ ] Return types explicit

### Performance

- [ ] No unnecessary re-renders
- [ ] Keys provided for lists
- [ ] No blocking operations in serializer

### Security

- [ ] External links have security attrs
- [ ] No dangerouslySetInnerHTML
- [ ] URL sanitization where needed

### Accessibility

- [ ] Semantic HTML elements used
- [ ] Heading hierarchy correct
- [ ] Links have descriptive text
- [ ] Anchor links accessible

---

## 📝 Feedback Template

Use this template for feedback:

```markdown
## Review Feedback - Phase 2

**Reviewer**: [Name]
**Date**: [Date]
**Commits Reviewed**: [list or "all"]

### ✅ Strengths

- [What was done well]
- [Highlight good practices]

### 🔧 Required Changes

1. **[File/Area]**: [Issue description]
   - **Why**: [Explanation]
   - **Suggestion**: [How to fix]

2. [Repeat for each required change]

### 💡 Suggestions (Optional)

- [Nice-to-have improvements]
- [Alternative approaches to consider]

### 📊 Verdict

- [ ] ✅ **APPROVED** - Ready to merge
- [ ] 🔧 **CHANGES REQUESTED** - Needs fixes
- [ ] ❌ **REJECTED** - Major rework needed

### Next Steps

[What should happen next]
```

---

## 🎯 Review Actions

### If Approved ✅

1. Merge the commits
2. Update phase status to COMPLETED in INDEX.md
3. Update EPIC_TRACKING.md progress (1/5 → 2/5)
4. Archive review notes

### If Changes Requested 🔧

1. Create detailed feedback (use template)
2. Discuss with developer
3. Re-review after fixes

### If Rejected ❌

1. Document major issues
2. Schedule discussion
3. Plan rework strategy

---

## ❓ FAQ

**Q: What if I disagree with an implementation choice?**
A: Discuss with the developer. If it works and meets requirements, it might be fine.

**Q: Should I review tests?**
A: Yes! Tests are as important as the code.

**Q: How detailed should feedback be?**
A: Specific enough to be actionable. Include file, line, and suggestion.

**Q: Can I approve with minor comments?**
A: Yes, mark as approved and note that comments are optional improvements.

**Q: What about code blocks and images?**
A: Those are Phase 3 and Phase 4. For now, they should render as placeholders.

---

**Review Guide Created**: 2025-12-09
**Last Updated**: 2025-12-09
