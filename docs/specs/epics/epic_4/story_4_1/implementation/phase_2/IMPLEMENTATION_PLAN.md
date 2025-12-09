# Phase 2 - Atomic Implementation Plan

**Objective**: Implement the Lexical JSON → React serializer to render rich text content from Payload CMS

---

## 🎯 Overview

### Why an Atomic Approach?

The implementation is split into **6 independent commits** to:

✅ **Facilitate review** - Each commit focuses on a single responsibility
✅ **Enable rollback** - If a commit has issues, revert it without breaking everything
✅ **Progressive type-safety** - Types validate at each step
✅ **Tests as you go** - Tests accompany the relevant code
✅ **Continuous documentation** - Each commit can be documented independently

### Global Strategy

```
[Commit 1] → [Commit 2] → [Commit 3] → [Commit 4] → [Commit 5] → [Commit 6]
     ↓           ↓           ↓           ↓           ↓           ↓
   Types     Serializer   Text Nodes  List/Quote    Link      RichText
  100%        core       Paragraph     ul/ol      internal    Component
  typed      function     Heading      quote      external   Integration
```

---

## 📦 The 6 Atomic Commits

### Commit 1: Lexical Types & Interfaces

**Files**: 2 files
**Size**: ~150 lines
**Duration**: 30-45 min (implementation) + 15-20 min (review)

**Content**:

- Define TypeScript interfaces for Lexical JSON structure
- Create types for all supported node types (root, paragraph, heading, list, listitem, quote, link, text)
- Define text format flags (bold, italic, underline, strikethrough, code)
- Export types from richtext module barrel

**Why it's atomic**:

- Single responsibility: Type definitions only
- No runtime code, purely types
- Can be validated by TypeScript compiler
- Foundation for all subsequent commits

**Technical Validation**:
```bash
pnpm exec tsc --noEmit
```

**Expected Result**: TypeScript compiles without errors

**Review Criteria**:

- [ ] All Lexical node types defined
- [ ] Text format flags properly typed
- [ ] No `any` types used
- [ ] Types match Payload Lexical output structure

---

### Commit 2: Base Serializer Function

**Files**: 3 files
**Size**: ~120 lines
**Duration**: 45-60 min (implementation) + 20-30 min (review)

**Content**:

- Create `serializeLexical` main function
- Implement recursive node traversal
- Add fallback for unknown node types
- Create `serializeChildren` helper
- Add basic text node handling with format support

**Why it's atomic**:

- Core serialization logic only
- No specific node renderers yet (placeholders)
- Tests can verify traversal works
- Clear separation from node-specific code

**Technical Validation**:
```bash
pnpm exec tsc --noEmit && pnpm test:unit -- --grep "serializeLexical"
```

**Expected Result**: Serializer handles node traversal, unknown nodes return placeholder

**Review Criteria**:

- [ ] Recursive traversal implemented
- [ ] Unknown nodes handled gracefully (returns null or placeholder)
- [ ] Text format flags applied (bold, italic, etc.)
- [ ] Children serialized recursively
- [ ] Unit tests for traversal logic

---

### Commit 3: Text Nodes (Paragraph & Heading)

**Files**: 3 files
**Size**: ~180 lines
**Duration**: 45-60 min (implementation) + 20-30 min (review)

**Content**:

- Create `Paragraph` node component
- Create `Heading` node component (h1-h6)
- Add heading anchor links for TOC integration
- Generate slug from heading text
- Apply prose typography styling
- Integrate with serializer

**Why it's atomic**:

- Two closely related node types
- Both render text children
- Heading includes anchor generation (needed for Phase 4.2 TOC)
- Natural pairing for implementation

**Technical Validation**:
```bash
pnpm exec tsc --noEmit && pnpm test:unit -- --grep "Paragraph|Heading"
```

**Expected Result**: Paragraphs and headings render with correct tags and styles

**Review Criteria**:

- [ ] Paragraph renders as `<p>` with prose styling
- [ ] Heading renders as `<h1>` through `<h6>` based on tag
- [ ] Heading has id attribute for anchor linking
- [ ] Slug generation handles special characters
- [ ] Children (text nodes) rendered correctly
- [ ] Unit tests for both components

---

### Commit 4: List & Quote Nodes

**Files**: 3 files
**Size**: ~200 lines
**Duration**: 45-60 min (implementation) + 20-30 min (review)

**Content**:

- Create `List` node component (ordered/unordered)
- Create `ListItem` node component
- Create `Quote` (blockquote) node component
- Handle nested lists
- Apply prose typography styling
- Integrate with serializer

**Why it's atomic**:

- Structural nodes that contain other nodes
- List and ListItem are tightly coupled
- Quote is similar in complexity
- All need recursive child rendering

**Technical Validation**:
```bash
pnpm exec tsc --noEmit && pnpm test:unit -- --grep "List|Quote"
```

**Expected Result**: Lists (ul/ol) and blockquotes render correctly with nested content

**Review Criteria**:

- [ ] Unordered list renders as `<ul>` with bullets
- [ ] Ordered list renders as `<ol>` with numbers
- [ ] List items render as `<li>`
- [ ] Nested lists supported (2+ levels)
- [ ] Blockquote renders with proper styling
- [ ] Unit tests for all scenarios

---

### Commit 5: Link Node

**Files**: 2 files
**Size**: ~100 lines
**Duration**: 30-45 min (implementation) + 15-20 min (review)

**Content**:

- Create `Link` node component
- Handle internal links (same domain)
- Handle external links (new tab, rel="noopener")
- Support mailto: and tel: links
- Apply proper link styling
- Integrate with serializer

**Why it's atomic**:

- Single node type
- Clear responsibility: link rendering
- Security considerations (rel="noopener")
- Distinct from text formatting

**Technical Validation**:
```bash
pnpm exec tsc --noEmit && pnpm test:unit -- --grep "Link"
```

**Expected Result**: Links render with correct href, target, and rel attributes

**Review Criteria**:

- [ ] Internal links use Next.js Link component
- [ ] External links open in new tab
- [ ] External links have `rel="noopener noreferrer"`
- [ ] mailto: and tel: links work correctly
- [ ] Link styling matches design system
- [ ] Unit tests for all link types

---

### Commit 6: RichText Component & Integration

**Files**: 4 files
**Size**: ~150 lines
**Duration**: 45-60 min (implementation) + 20-30 min (review)

**Content**:

- Create main `RichText` component
- Export from richtext module barrel
- Update article page to use RichText
- Remove Phase 1 placeholder
- Add prose styling container
- Handle empty/null content

**Why it's atomic**:

- Integration commit: connects serializer to page
- Replaces placeholder from Phase 1
- Completes the feature loop
- Can be tested end-to-end

**Technical Validation**:
```bash
pnpm exec tsc --noEmit && pnpm lint && pnpm test:unit
```

**Expected Result**: Article page renders rich text content instead of JSON placeholder

**Review Criteria**:

- [ ] RichText component exported
- [ ] Article page imports and uses RichText
- [ ] Placeholder removed
- [ ] Empty content handled (shows nothing or message)
- [ ] Prose container applied
- [ ] Visual inspection: content renders correctly

---

## 🔄 Implementation Workflow

### Step-by-Step

1. **Read specification**: Understand requirements fully
2. **Setup environment**: Follow ENVIRONMENT_SETUP.md
3. **Implement Commit 1**: Follow COMMIT_CHECKLIST.md
4. **Validate Commit 1**: Run validation commands
5. **Review Commit 1**: Self-review against criteria
6. **Commit Commit 1**: Use provided commit message
7. **Repeat for commits 2-6**
8. **Final validation**: Complete VALIDATION_CHECKLIST.md

### Validation at Each Step

After each commit:
```bash
# Type-check
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Unit tests
pnpm test:unit

# Build (optional but recommended)
pnpm build
```

All must pass before moving to next commit.

---

## 📊 Commit Metrics

| Commit | Files | Lines | Implementation | Review | Total |
|--------|-------|-------|----------------|--------|-------|
| 1. Types & Interfaces | 2 | ~150 | 30-45 min | 15-20 min | ~60 min |
| 2. Base Serializer | 3 | ~120 | 45-60 min | 20-30 min | ~80 min |
| 3. Paragraph & Heading | 3 | ~180 | 45-60 min | 20-30 min | ~80 min |
| 4. List & Quote | 3 | ~200 | 45-60 min | 20-30 min | ~80 min |
| 5. Link Node | 2 | ~100 | 30-45 min | 15-20 min | ~55 min |
| 6. RichText & Integration | 4 | ~150 | 45-60 min | 20-30 min | ~80 min |
| **TOTAL** | **17** | **~900** | **4-5.5h** | **2-2.5h** | **6-8h** |

---

## ✅ Atomic Approach Benefits

### For Developers

- 🎯 **Clear focus**: One thing at a time
- 🧪 **Testable**: Each commit validated
- 📝 **Documented**: Clear commit messages

### For Reviewers

- ⚡ **Fast review**: 15-30 min per commit
- 🔍 **Focused**: Single responsibility to check
- ✅ **Quality**: Easier to spot issues

### For the Project

- 🔄 **Rollback-safe**: Revert without breaking
- 📚 **Historical**: Clear progression in git history
- 🏗️ **Maintainable**: Easy to understand later

---

## 📝 Best Practices

### Commit Messages

Format:
```
type(scope): short description (max 50 chars)

- Point 1: detail
- Point 2: detail
- Point 3: justification if needed

Part of Phase 2 - Commit X/6
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

### Review Checklist

Before committing:

- [ ] Code follows project style guide
- [ ] All tests pass
- [ ] Types are correct
- [ ] No console.logs or debug code
- [ ] Documentation updated if needed

---

## ⚠️ Important Points

### Do's

- ✅ Follow the commit order (dependencies)
- ✅ Validate after each commit
- ✅ Write tests alongside code
- ✅ Use provided commit messages as template
- ✅ Study Payload Lexical JSON structure before starting

### Don'ts

- ❌ Skip commits or combine them
- ❌ Commit without running validations
- ❌ Change files from previous commits (unless fixing a bug)
- ❌ Add features not in the spec (code blocks = Phase 3, images = Phase 4)

---

## 📋 Lexical JSON Structure Reference

### Root Node

```json
{
  "root": {
    "type": "root",
    "children": [/* child nodes */],
    "direction": "ltr",
    "format": "",
    "indent": 0,
    "version": 1
  }
}
```

### Paragraph Node

```json
{
  "type": "paragraph",
  "children": [/* text nodes */],
  "direction": "ltr",
  "format": "",
  "indent": 0,
  "version": 1
}
```

### Heading Node

```json
{
  "type": "heading",
  "tag": "h2",
  "children": [/* text nodes */],
  "direction": "ltr",
  "format": "",
  "indent": 0,
  "version": 1
}
```

### Text Node

```json
{
  "type": "text",
  "text": "Hello world",
  "format": 1,  // Bitmask: 1=bold, 2=italic, 4=strikethrough, 8=underline, 16=code
  "mode": "normal",
  "style": "",
  "detail": 0,
  "version": 1
}
```

### List Node

```json
{
  "type": "list",
  "listType": "bullet",  // "bullet" | "number" | "check"
  "tag": "ul",
  "children": [/* listitem nodes */],
  "start": 1,
  "version": 1
}
```

### ListItem Node

```json
{
  "type": "listitem",
  "children": [/* text or nested list nodes */],
  "checked": false,
  "value": 1,
  "version": 1
}
```

### Quote Node

```json
{
  "type": "quote",
  "children": [/* paragraph nodes */],
  "direction": "ltr",
  "format": "",
  "indent": 0,
  "version": 1
}
```

### Link Node

```json
{
  "type": "link",
  "fields": {
    "url": "https://example.com",
    "newTab": true,
    "linkType": "custom"  // "custom" | "internal"
  },
  "children": [/* text nodes */],
  "version": 1
}
```

---

## ❓ FAQ

**Q: What if a commit is too big?**
A: Split it into smaller commits (update this plan)

**Q: What if I need to fix a previous commit?**
A: Fix in place if not pushed, or create a fixup commit

**Q: Can I change the commit order?**
A: Only if dependencies allow. Update this plan if needed.

**Q: What if tests fail?**
A: Don't commit until they pass. Fix the code or update tests.

**Q: How do I handle code blocks?**
A: Render them as plain `<pre><code>` for now. Phase 3 adds syntax highlighting.

**Q: Should I add the @tailwindcss/typography plugin?**
A: Check if it's already installed. If not, add it in Commit 6.

---

**Plan Generated**: 2025-12-09
**Total Commits**: 6
**Estimated Duration**: 6-8 hours
