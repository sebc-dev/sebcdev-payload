# Phase 3 - Code Review Guide

Guide for reviewing code changes in Phase 3 (Code Block Syntax Highlighting).

---

## Review Strategy

### Commit-by-Commit Review

Each commit should be reviewed independently. Total review time: ~1.5 hours.

| Commit | Focus Areas | Time |
|--------|-------------|------|
| 1. Shiki Config | Bundle selection, language set | 15 min |
| 2. CodeBlock | Async component, text extraction | 20 min |
| 3. InlineCode | Styling consistency | 10 min |
| 4. CopyButton | Client component, clipboard API | 15 min |
| 5. Integration | Serializer update, tests | 20 min |

---

## Commit 1: Shiki Configuration

### Files to Review

- `package.json` - New dependency
- `src/components/richtext/shiki-config.ts` - Configuration

### Review Checklist

#### Package.json

- [ ] `shiki` version is `^3.0.0` or higher
- [ ] No unnecessary peer dependencies added
- [ ] No security vulnerabilities (check `pnpm audit`)

#### shiki-config.ts

**Bundle Selection**:

```typescript
// Must use web bundle for Edge compatibility
import { createHighlighter } from 'shiki/bundle/web'
```

- [ ] Uses `shiki/bundle/web` (NOT `shiki` or `shiki/bundle/full`)

**Language Set**:

- [ ] Languages limited to essential set (~15-20 max)
- [ ] Includes: javascript, typescript, json, bash, html, css
- [ ] Does NOT include: exotic languages that bloat bundle

**Theme**:

- [ ] Theme is `github-dark` or similar dark theme
- [ ] Single theme (not multiple)

**Caching**:

```typescript
let highlighterPromise: Promise<Highlighter> | null = null

export async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({ ... })
  }
  return highlighterPromise
}
```

- [ ] Highlighter is cached (singleton pattern)
- [ ] Promise cached, not resolved value
- [ ] No memory leaks

**Type Safety**:

- [ ] All functions have return types
- [ ] `BundledLanguage` type used for language validation
- [ ] No `any` types

**Language Aliases**:

- [ ] Common aliases handled (js→javascript, ts→typescript)
- [ ] Fallback to 'text' for unknown languages

### Questions to Ask

1. Is the bundle size acceptable? (~100-200KB added)
2. Are all necessary languages included?
3. Will the singleton pattern work with Edge runtime?

---

## Commit 2: CodeBlock Component

### Files to Review

- `src/components/richtext/nodes/CodeBlock.tsx` - Main component
- `src/components/richtext/nodes/index.ts` - Export

### Review Checklist

#### Component Structure

**Server Component**:

```typescript
// Must NOT have "use client"
export async function CodeBlock({ node }: CodeBlockProps) { ... }
```

- [ ] No "use client" directive
- [ ] Function is async
- [ ] Proper TypeScript types

**Text Extraction**:

```typescript
function extractText(children: LexicalNode[]): string {
  // Must handle all node types
}
```

- [ ] Handles `text` nodes
- [ ] Handles `linebreak` nodes (converts to `\n`)
- [ ] Handles nested children recursively
- [ ] Returns empty string for unknown nodes (graceful)

**Shiki Integration**:

```typescript
const highlighter = await getHighlighter()
const html = highlighter.codeToHtml(code, { lang, theme })
```

- [ ] Awaits highlighter properly
- [ ] Passes language and theme
- [ ] Uses `getFallbackLanguage` for safety

**HTML Injection**:

```typescript
<div dangerouslySetInnerHTML={{ __html: html }} />
```

- [ ] `dangerouslySetInnerHTML` is acceptable (Shiki output is trusted)
- [ ] No user input directly in HTML

**Styling**:

- [ ] Uses Design System classes (`bg-muted`, `border-border`, etc.)
- [ ] Has rounded corners (`rounded-lg`)
- [ ] Has overflow scroll (`overflow-x-auto`)
- [ ] Language indicator styled appropriately

**Accessibility**:

- [ ] Code block is readable by screen readers
- [ ] No `aria-hidden` on code content
- [ ] Proper semantic HTML (`<pre><code>`)

### Questions to Ask

1. Does `extractText` handle all Lexical node types we might encounter?
2. Is the styling consistent with the Design System?
3. Will long code lines scroll horizontally?

---

## Commit 3: InlineCode Component

### Files to Review

- `src/components/richtext/serialize.tsx` - Updated styling
- `src/components/richtext/nodes/InlineCode.tsx` - (if created)

### Review Checklist

**Styling Consistency**:

- [ ] Background color matches CodeBlock
- [ ] Font is JetBrains Mono (`font-mono`)
- [ ] Padding appropriate for inline (`px-1.5 py-0.5`)
- [ ] Border radius matches Design System

**Doesn't Break Flow**:

- [ ] Inline code doesn't cause line breaks
- [ ] Vertical alignment is correct
- [ ] Works within paragraphs

**Optional Component**:

If a dedicated component was created:

- [ ] Exported from `nodes/index.ts`
- [ ] Used in `serializeText`

### Questions to Ask

1. Is the inline code visually consistent with code blocks?
2. Does it work well in both short and long paragraphs?

---

## Commit 4: CopyButton Component

### Files to Review

- `src/components/ui/copy-button.tsx` - New component
- `src/components/richtext/nodes/CodeBlock.tsx` - Integration

### Review Checklist

#### CopyButton Component

**Client Component**:

```typescript
'use client'
```

- [ ] Has "use client" directive
- [ ] Only client-side APIs used

**Clipboard API**:

```typescript
await navigator.clipboard.writeText(text)
```

- [ ] Uses modern Clipboard API
- [ ] Wrapped in try/catch for error handling
- [ ] Graceful fallback (or clear error)

**State Management**:

- [ ] `copied` state with `useState`
- [ ] State resets after timeout (2 seconds)
- [ ] No state leaks (cleanup on unmount)

**Icons**:

- [ ] Uses Lucide icons (`Copy`, `Check`)
- [ ] Check icon has success color (`text-green-500`)
- [ ] Icons same size (`h-4 w-4`)

**Accessibility**:

- [ ] `aria-label` present
- [ ] `aria-label` updates on copy ("Copied!")
- [ ] Focus visible (`focus:ring`)
- [ ] Works with keyboard

#### Integration in CodeBlock

**Visibility**:

```typescript
<CopyButton className="opacity-0 group-hover:opacity-100 transition-opacity" />
```

- [ ] Hidden by default
- [ ] Shows on hover (`group-hover`)
- [ ] Smooth transition

**Code Passed**:

- [ ] Full code text passed to button
- [ ] Not just visible portion

### Questions to Ask

1. Does the copy button work on mobile (no hover)?
2. Is error handling user-friendly?
3. Does the timeout cleanup correctly?

---

## Commit 5: Integration & Tests

### Files to Review

- `src/components/richtext/serialize.tsx` - Updated
- `tests/unit/components/richtext/code-block.spec.tsx` - New tests

### Review Checklist

#### Serializer Update

**Placeholder Removed**:

```typescript
// OLD - should be removed
case 'code':
  return (
    <pre className="...">
      <code>{...}</code>
    </pre>
  )
```

- [ ] Old placeholder code completely removed
- [ ] No commented-out code left

**CodeBlock Used**:

```typescript
case 'code':
  return <CodeBlock key={index} node={node as CodeNode} />
```

- [ ] Import added for CodeBlock
- [ ] Type cast to CodeNode
- [ ] Key prop passed

#### Unit Tests

**Mocking**:

```typescript
vi.mock('@/components/richtext/shiki-config', () => ({
  getHighlighter: vi.fn().mockResolvedValue({ ... }),
  // ...
}))
```

- [ ] Shiki properly mocked
- [ ] No real network calls in tests
- [ ] Mock returns valid structure

**Test Coverage**:

- [ ] Basic rendering test
- [ ] Language indicator test
- [ ] Missing language handling
- [ ] Text extraction from children

**Async Handling**:

```typescript
render(await CodeBlock({ node }))
```

- [ ] Async components awaited in tests
- [ ] No unhandled promise rejections

### Questions to Ask

1. Are all edge cases covered in tests?
2. Does the build still succeed?
3. Have you visually tested with real content?

---

## Cross-Cutting Concerns

### Bundle Size

Check bundle size impact:

```bash
# Before implementation
pnpm build
# Note the output size

# After implementation
pnpm build
# Compare sizes
```

- [ ] Total impact < 200KB
- [ ] No unnecessary code included

### Edge Runtime Compatibility

- [ ] No Node.js-only APIs used
- [ ] Works on Cloudflare Workers
- [ ] Tested with `pnpm preview` if possible

### Design System Consistency

- [ ] Colors match existing components
- [ ] Spacing consistent (m-4, p-4, etc.)
- [ ] Border radius uniform
- [ ] Font family correct (JetBrains Mono)

### Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Color contrast sufficient
- [ ] Focus states visible

---

## Red Flags

### Immediate Rejection

If you see any of these, request changes:

1. **`shiki` instead of `shiki/bundle/web`** - Bundle too large
2. **`"use client"` on CodeBlock** - Should be server component
3. **No error handling on clipboard** - Will crash on unsupported browsers
4. **`any` types** - Type safety compromised
5. **No language fallback** - Will crash on unknown languages
6. **Console.log statements** - Debug code left in

### Discussion Points

These warrant discussion but may be acceptable:

1. **Large language set** - Consider reducing if bundle is too big
2. **Custom styling** - Ensure matches Design System
3. **Missing tests** - Add before merging if time permits

---

## Approval Criteria

### Must Have (Blocking)

- [ ] TypeScript compiles without errors
- [ ] All existing tests pass
- [ ] New tests pass
- [ ] Build succeeds
- [ ] No "use client" on CodeBlock
- [ ] Shiki web bundle used
- [ ] Language fallback implemented

### Should Have (Non-Blocking)

- [ ] Test coverage > 80%
- [ ] Visual inspection completed
- [ ] Documentation updated
- [ ] Commit messages follow convention

### Nice to Have

- [ ] Performance metrics measured
- [ ] Accessibility audit passed
- [ ] Bundle size under 150KB impact

---

## Review Template

Copy this template for your review:

```markdown
## Code Review: Phase 3 - Commit X

### Summary
[Brief description of changes]

### Checklist
- [ ] Type safety
- [ ] Error handling
- [ ] Styling consistency
- [ ] Accessibility
- [ ] Tests

### Concerns
[List any concerns]

### Suggestions
[List any suggestions]

### Verdict
- [ ] Approved
- [ ] Approved with minor changes
- [ ] Request changes
```

---

**Review Guide Generated**: 2025-12-10
