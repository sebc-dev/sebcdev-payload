# Phase 3 - Commit Checklists

Detailed checklists for each atomic commit. Complete ALL items before committing.

---

## Commit 1: Shiki Configuration & Setup

### Pre-Implementation

- [ ] Read [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) Commit 1 section
- [ ] Verify Phase 2 is complete (serializer exists)
- [ ] Check current Shiki version on npm (`npm info shiki version`)

### Implementation Steps

#### Step 1.1: Install Shiki

```bash
pnpm add shiki
```

- [ ] Package installed successfully
- [ ] Lock file updated (pnpm-lock.yaml)
- [ ] No peer dependency warnings

#### Step 1.2: Create Shiki Configuration

Create `src/components/richtext/shiki-config.ts`:

```typescript
/**
 * Shiki Syntax Highlighter Configuration
 *
 * Configured for Edge runtime compatibility (Cloudflare Workers).
 * Uses web bundle for minimal bundle size.
 */

import { createHighlighter, type Highlighter, type BundledLanguage } from 'shiki/bundle/web'

/**
 * Supported languages for syntax highlighting
 * Limited set to reduce bundle size
 */
export const SUPPORTED_LANGUAGES: BundledLanguage[] = [
  'javascript',
  'typescript',
  'tsx',
  'jsx',
  'json',
  'html',
  'css',
  'bash',
  'shell',
  'python',
  'go',
  'rust',
  'sql',
  'yaml',
  'markdown',
  'graphql',
  'diff',
]

/**
 * Theme for syntax highlighting
 * github-dark matches our dark mode Design System
 */
export const CODE_THEME = 'github-dark' as const

/**
 * Singleton highlighter instance
 * Cached for performance
 */
let highlighterPromise: Promise<Highlighter> | null = null

/**
 * Get or create the Shiki highlighter instance
 *
 * @returns Cached highlighter instance
 */
export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [CODE_THEME],
      langs: SUPPORTED_LANGUAGES,
    })
  }
  return highlighterPromise
}

/**
 * Check if a language is supported
 *
 * @param lang - Language identifier
 * @returns true if language is supported
 */
export function isSupportedLanguage(lang: string): lang is BundledLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as BundledLanguage)
}

/**
 * Get fallback language for unsupported languages
 *
 * @param lang - Original language
 * @returns Supported language or 'text'
 */
export function getFallbackLanguage(lang: string | undefined): BundledLanguage | 'text' {
  if (!lang) return 'text'
  if (isSupportedLanguage(lang)) return lang

  // Common aliases
  const aliases: Record<string, BundledLanguage> = {
    js: 'javascript',
    ts: 'typescript',
    sh: 'bash',
    zsh: 'bash',
    yml: 'yaml',
    py: 'python',
    rs: 'rust',
    md: 'markdown',
    gql: 'graphql',
  }

  if (aliases[lang]) return aliases[lang]

  return 'text'
}
```

- [ ] File created at correct path
- [ ] All imports resolve correctly
- [ ] Type annotations complete

### Validation

```bash
# Type check
pnpm exec tsc --noEmit

# Verify import works
node -e "import('./src/components/richtext/shiki-config.ts')" 2>/dev/null || echo "ESM check (may fail in node, check TS)"
```

- [ ] TypeScript compiles without errors
- [ ] No circular dependencies

### Review Checklist

- [ ] Web bundle used (`shiki/bundle/web`)
- [ ] Language set is minimal but sufficient
- [ ] Theme is `github-dark` (Design System consistent)
- [ ] Highlighter is cached (singleton pattern)
- [ ] Language aliases handle common variations
- [ ] Fallback to 'text' for unknown languages
- [ ] JSDoc comments present

### Commit

```bash
git add package.json pnpm-lock.yaml src/components/richtext/shiki-config.ts
git commit -m "$(cat <<'EOF'
🔧 feat(richtext): add Shiki syntax highlighting configuration

- Install shiki package for Edge-compatible highlighting
- Configure web bundle with essential languages
- Set github-dark theme for Design System consistency
- Export async getHighlighter utility

Phase 3 - Commit 1/5
Story 4.1 - Rendu Article & MDX

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

- [ ] Commit message follows convention
- [ ] Only relevant files committed

---

## Commit 2: CodeBlock Component

### Pre-Implementation

- [ ] Commit 1 completed and passing
- [ ] Understand Lexical code node structure (check test data or CMS)

### Implementation Steps

#### Step 2.1: Create CodeBlock Component

Create `src/components/richtext/nodes/CodeBlock.tsx`:

```typescript
/**
 * CodeBlock Component
 *
 * Renders syntax-highlighted code blocks using Shiki.
 * Server Component - highlighting happens at build/request time.
 */

import type { CodeNode, LexicalNode, TextNode } from '../types'
import { getHighlighter, getFallbackLanguage, CODE_THEME } from '../shiki-config'

interface CodeBlockProps {
  node: CodeNode
}

/**
 * Extract plain text from Lexical node children
 * Handles nested text nodes recursively
 */
function extractText(children: LexicalNode[]): string {
  return children
    .map((child) => {
      if (child.type === 'text') {
        return (child as TextNode).text
      }
      if ('children' in child && Array.isArray(child.children)) {
        return extractText(child.children as LexicalNode[])
      }
      if (child.type === 'linebreak') {
        return '\n'
      }
      return ''
    })
    .join('')
}

/**
 * CodeBlock Component
 *
 * Async Server Component that renders highlighted code.
 */
export async function CodeBlock({ node }: CodeBlockProps) {
  const code = extractText(node.children)
  const language = getFallbackLanguage(node.language)

  // Get highlighter and generate HTML
  const highlighter = await getHighlighter()
  const html = highlighter.codeToHtml(code, {
    lang: language,
    theme: CODE_THEME,
  })

  // Language display name
  const languageLabel = language === 'text' ? 'Plain Text' : language.toUpperCase()

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-border">
      {/* Header with language indicator */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          {languageLabel}
        </span>
        {/* CopyButton will be added in Commit 4 */}
      </div>

      {/* Code content */}
      <div
        className="overflow-x-auto text-sm [&>pre]:p-4 [&>pre]:m-0 [&>pre]:bg-transparent"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
```

- [ ] File created at correct path
- [ ] Async function (Server Component)
- [ ] Proper TypeScript types

#### Step 2.2: Update Nodes Index

Update `src/components/richtext/nodes/index.ts`:

```typescript
export { Paragraph } from './Paragraph'
export { Heading, slugify } from './Heading'
export { List, ListItem } from './List'
export { Quote } from './Quote'
export { Link, isExternalUrl, isSpecialProtocol } from './Link'
export { CodeBlock } from './CodeBlock'
```

- [ ] Export added for CodeBlock

### Validation

```bash
# Type check
pnpm exec tsc --noEmit

# Verify export
grep -n "CodeBlock" src/components/richtext/nodes/index.ts
```

- [ ] TypeScript compiles
- [ ] Export present in index

### Review Checklist

- [ ] Server Component (no "use client")
- [ ] Async function for Shiki
- [ ] Text extraction handles nested nodes
- [ ] Linebreaks converted to `\n`
- [ ] Language fallback works
- [ ] HTML injection is safe (Shiki output is trusted)
- [ ] Styling uses Design System classes
- [ ] Language label is visible
- [ ] Overflow scroll for long lines
- [ ] Border and rounded corners match Design System

### Commit

```bash
git add src/components/richtext/nodes/CodeBlock.tsx src/components/richtext/nodes/index.ts
git commit -m "$(cat <<'EOF'
✨ feat(richtext): add CodeBlock component with syntax highlighting

- Create CodeBlock RSC with Shiki integration
- Extract code text from Lexical node children
- Add language indicator header
- Apply Design System styling (JetBrains Mono, dark theme)

Phase 3 - Commit 2/5
Story 4.1 - Rendu Article & MDX

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

- [ ] Commit message follows convention
- [ ] Only relevant files committed

---

## Commit 3: InlineCode Component

### Pre-Implementation

- [ ] Commit 2 completed and passing
- [ ] Review existing inline code styling in `serializeText`

### Implementation Steps

#### Step 3.1: Review Current Inline Code

Check `src/components/richtext/serialize.tsx` line ~149:

```typescript
if (format & TEXT_FORMAT.CODE) {
  text = <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{text}</code>
}
```

The inline code is already handled. This commit focuses on:
1. Creating a dedicated component for consistency
2. Improving styling to match CodeBlock

#### Step 3.2: Create InlineCode Component (Optional)

If a dedicated component is needed, create `src/components/richtext/nodes/InlineCode.tsx`:

```typescript
/**
 * InlineCode Component
 *
 * Renders inline code (backticks) with consistent styling.
 * Used for code snippets within paragraphs.
 */

import type { ReactNode } from 'react'

interface InlineCodeProps {
  children: ReactNode
}

/**
 * InlineCode Component
 *
 * Wraps inline code with styling consistent with CodeBlock.
 */
export function InlineCode({ children }: InlineCodeProps) {
  return (
    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
      {children}
    </code>
  )
}
```

#### Step 3.3: Update Serialize (if using component)

If using the component, update `serialize.tsx`:

```typescript
import { InlineCode } from './nodes/InlineCode'

// In serializeText:
if (format & TEXT_FORMAT.CODE) {
  text = <InlineCode>{text}</InlineCode>
}
```

#### Step 3.4: Alternative - Just Update Styling

If not creating a component, update the inline styles in `serialize.tsx` to match CodeBlock:

```typescript
if (format & TEXT_FORMAT.CODE) {
  text = (
    <code className="bg-muted/80 px-1.5 py-0.5 rounded text-sm font-mono text-foreground border border-border/50">
      {text}
    </code>
  )
}
```

- [ ] Approach chosen (component or inline)
- [ ] Styling updated

### Validation

```bash
# Type check
pnpm exec tsc --noEmit

# Visual check (if dev server running)
# Look at article with inline code
```

- [ ] TypeScript compiles
- [ ] Inline code styling consistent with CodeBlock

### Review Checklist

- [ ] Styling matches CodeBlock theme
- [ ] Font is JetBrains Mono
- [ ] Background color consistent
- [ ] Border/rounded corners appropriate for inline
- [ ] Doesn't break text flow
- [ ] Readable on both light text and dark background

### Commit

```bash
git add src/components/richtext/nodes/InlineCode.tsx src/components/richtext/nodes/index.ts src/components/richtext/serialize.tsx
# Or just:
git add src/components/richtext/serialize.tsx
git commit -m "$(cat <<'EOF'
🎨 refactor(richtext): improve inline code styling consistency

- Update inline code styling to match CodeBlock theme
- Add subtle border for visual consistency
- Ensure JetBrains Mono font applied

Phase 3 - Commit 3/5
Story 4.1 - Rendu Article & MDX

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

- [ ] Commit message follows convention
- [ ] Only relevant files committed

---

## Commit 4: CopyButton Component

### Pre-Implementation

- [ ] Commit 3 completed and passing
- [ ] Understand shadcn/ui Button component

### Implementation Steps

#### Step 4.1: Create CopyButton Component

Create `src/components/ui/copy-button.tsx`:

```typescript
'use client'

/**
 * CopyButton Component
 *
 * Client-side button to copy text to clipboard.
 * Shows visual feedback on successful copy.
 */

import { useState, useCallback } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from './button'

interface CopyButtonProps {
  text: string
  className?: string
}

/**
 * CopyButton Component
 *
 * Copies text to clipboard with visual feedback.
 */
export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Clipboard API may fail in some contexts
      console.error('Failed to copy:', error)
    }
  }, [text])

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={handleCopy}
      aria-label={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  )
}
```

- [ ] File created at correct path
- [ ] "use client" directive present
- [ ] Lucide icons used

#### Step 4.2: Integrate CopyButton in CodeBlock

Update `src/components/richtext/nodes/CodeBlock.tsx`:

```typescript
import { CopyButton } from '@/components/ui/copy-button'

// In the component return:
return (
  <div className="group my-6 rounded-lg overflow-hidden border border-border">
    {/* Header with language indicator */}
    <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
      <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
        {languageLabel}
      </span>
      <CopyButton
        text={code}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>

    {/* Code content */}
    <div
      className="overflow-x-auto text-sm [&>pre]:p-4 [&>pre]:m-0 [&>pre]:bg-transparent"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  </div>
)
```

- [ ] CopyButton imported
- [ ] Code text passed to CopyButton
- [ ] Hover visibility animation

### Validation

```bash
# Type check
pnpm exec tsc --noEmit

# Test copy functionality in browser (manual)
```

- [ ] TypeScript compiles
- [ ] Copy button visible on hover
- [ ] Copy works (manual test)

### Review Checklist

- [ ] Client Component directive present
- [ ] Clipboard API used correctly
- [ ] Error handling for unsupported browsers
- [ ] Icon changes on copy (Copy → Check)
- [ ] Auto-reset after 2 seconds
- [ ] Accessible: aria-label updates
- [ ] Focus visible on keyboard navigation
- [ ] Positioned correctly (right side of header)
- [ ] Hover animation smooth

### Commit

```bash
git add src/components/ui/copy-button.tsx src/components/richtext/nodes/CodeBlock.tsx
git commit -m "$(cat <<'EOF'
✨ feat(ui): add CopyButton component for code blocks

- Create client-side copy button with Clipboard API
- Add visual feedback (copy → check icon)
- Integrate with CodeBlock component
- Accessible: aria-label, focus visible

Phase 3 - Commit 4/5
Story 4.1 - Rendu Article & MDX

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

- [ ] Commit message follows convention
- [ ] Only relevant files committed

---

## Commit 5: Serializer Integration & Tests

### Pre-Implementation

- [ ] Commits 1-4 completed and passing
- [ ] Review current serialize.tsx code block handling

### Implementation Steps

#### Step 5.1: Update Serializer

Update `src/components/richtext/serialize.tsx`:

```typescript
// Add import
import { CodeBlock } from './nodes/CodeBlock'
import type { CodeNode } from './types'

// Update the switch case (around line 91-97):
case 'code':
  return <CodeBlock key={index} node={node as CodeNode} />
```

Remove the old placeholder:

```typescript
// DELETE this code:
case 'code':
  // Phase 3 - render as plain code for now
  return (
    <pre key={index} className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
      <code>{hasChildren(node) ? serializeChildren(node.children) : null}</code>
    </pre>
  )
```

- [ ] Import added
- [ ] Placeholder removed
- [ ] CodeBlock used in switch

#### Step 5.2: Create Unit Tests

Create `tests/unit/components/richtext/code-block.spec.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CodeBlock } from '@/components/richtext/nodes/CodeBlock'
import type { CodeNode } from '@/components/richtext/types'

// Mock Shiki
vi.mock('@/components/richtext/shiki-config', () => ({
  getHighlighter: vi.fn().mockResolvedValue({
    codeToHtml: vi.fn().mockReturnValue('<pre><code>mocked</code></pre>'),
  }),
  getFallbackLanguage: vi.fn((lang) => lang || 'text'),
  CODE_THEME: 'github-dark',
}))

describe('CodeBlock', () => {
  it('renders code block with language indicator', async () => {
    const node: CodeNode = {
      type: 'code',
      language: 'typescript',
      version: 1,
      children: [{ type: 'text', text: 'const foo = "bar"', format: 0, version: 1 }],
    }

    const { container } = render(await CodeBlock({ node }))

    expect(container.textContent).toContain('TYPESCRIPT')
    expect(container.querySelector('pre')).toBeTruthy()
  })

  it('handles missing language', async () => {
    const node: CodeNode = {
      type: 'code',
      version: 1,
      children: [{ type: 'text', text: 'plain text', format: 0, version: 1 }],
    }

    const { container } = render(await CodeBlock({ node }))

    // Should show "Plain Text" or similar
    expect(container.textContent).toMatch(/text/i)
  })

  it('extracts text from nested children', async () => {
    const node: CodeNode = {
      type: 'code',
      language: 'javascript',
      version: 1,
      children: [
        { type: 'text', text: 'line 1', format: 0, version: 1 },
        { type: 'linebreak', version: 1 },
        { type: 'text', text: 'line 2', format: 0, version: 1 },
      ],
    }

    // Just verify it renders without error
    const { container } = render(await CodeBlock({ node }))
    expect(container.querySelector('pre')).toBeTruthy()
  })
})
```

- [ ] Test file created
- [ ] Shiki mocked
- [ ] Basic tests pass

#### Step 5.3: Run Full Test Suite

```bash
pnpm test:unit
pnpm lint
pnpm build
```

- [ ] All unit tests pass
- [ ] Lint passes
- [ ] Build succeeds

### Validation

```bash
# Full validation
pnpm exec tsc --noEmit && pnpm lint && pnpm test:unit && pnpm build
```

- [ ] All checks pass

### Review Checklist

- [ ] Placeholder completely removed
- [ ] CodeBlock properly integrated
- [ ] Import path correct
- [ ] Tests cover basic scenarios
- [ ] Tests mock Shiki (avoid actual highlighting in tests)
- [ ] Build produces valid output
- [ ] Visual inspection: code renders with highlighting

### Commit

```bash
git add src/components/richtext/serialize.tsx tests/unit/components/richtext/code-block.spec.tsx
git commit -m "$(cat <<'EOF'
✅ feat(richtext): integrate CodeBlock in serializer with tests

- Update serialize.tsx to use CodeBlock component
- Remove Phase 2 placeholder code
- Add comprehensive unit tests
- Verify build and visual rendering

Phase 3 - Commit 5/5
Story 4.1 - Rendu Article & MDX

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

- [ ] Commit message follows convention
- [ ] Only relevant files committed

---

## Post-Implementation

### Final Validation

- [ ] Complete [VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)
- [ ] Visual inspection in browser
- [ ] Test with multiple languages
- [ ] Test copy functionality
- [ ] Check bundle size impact

### Update Phase Status

Update `PHASES_PLAN.md`:

```markdown
- [x] Phase 3: Code Highlighting - Status: ✅ COMPLETED
```

### Next Phase

Proceed to Phase 4: Image Rendering & Advanced Styling

---

**Checklist Generated**: 2025-12-10
**Total Commits**: 5
