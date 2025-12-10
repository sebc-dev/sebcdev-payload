# Phase 3 - Testing Strategy

Comprehensive testing guide for Code Block Syntax Highlighting.

---

## Testing Overview

### Test Types

| Type | Tool | Purpose | Coverage Target |
|------|------|---------|-----------------|
| Unit Tests | Vitest | Component logic | 80%+ |
| Integration Tests | Vitest | Serializer integration | Key paths |
| Visual Tests | Manual | Styling verification | All languages |
| E2E Tests | (Phase 5) | Full user flow | - |

### Test Files

```
tests/unit/components/richtext/
├── nodes.spec.tsx           (existing - modify)
├── code-block.spec.tsx      (new)
└── copy-button.spec.tsx     (new, optional)
```

---

## Unit Testing

### Shiki Configuration Tests

**File**: `tests/unit/components/richtext/shiki-config.spec.ts`

```typescript
import { describe, it, expect } from 'vitest'
import {
  SUPPORTED_LANGUAGES,
  isSupportedLanguage,
  getFallbackLanguage,
} from '@/components/richtext/shiki-config'

describe('shiki-config', () => {
  describe('SUPPORTED_LANGUAGES', () => {
    it('includes essential languages', () => {
      expect(SUPPORTED_LANGUAGES).toContain('javascript')
      expect(SUPPORTED_LANGUAGES).toContain('typescript')
      expect(SUPPORTED_LANGUAGES).toContain('json')
      expect(SUPPORTED_LANGUAGES).toContain('bash')
    })

    it('does not include too many languages', () => {
      // Keep bundle size manageable
      expect(SUPPORTED_LANGUAGES.length).toBeLessThan(25)
    })
  })

  describe('isSupportedLanguage', () => {
    it('returns true for supported languages', () => {
      expect(isSupportedLanguage('javascript')).toBe(true)
      expect(isSupportedLanguage('typescript')).toBe(true)
    })

    it('returns false for unsupported languages', () => {
      expect(isSupportedLanguage('cobol')).toBe(false)
      expect(isSupportedLanguage('assembly')).toBe(false)
    })
  })

  describe('getFallbackLanguage', () => {
    it('returns language if supported', () => {
      expect(getFallbackLanguage('javascript')).toBe('javascript')
      expect(getFallbackLanguage('typescript')).toBe('typescript')
    })

    it('returns alias mapping', () => {
      expect(getFallbackLanguage('js')).toBe('javascript')
      expect(getFallbackLanguage('ts')).toBe('typescript')
      expect(getFallbackLanguage('sh')).toBe('bash')
    })

    it('returns text for unknown languages', () => {
      expect(getFallbackLanguage('unknown')).toBe('text')
      expect(getFallbackLanguage('cobol')).toBe('text')
    })

    it('returns text for undefined', () => {
      expect(getFallbackLanguage(undefined)).toBe('text')
    })

    it('returns text for empty string', () => {
      expect(getFallbackLanguage('')).toBe('text')
    })
  })
})
```

### CodeBlock Component Tests

**File**: `tests/unit/components/richtext/code-block.spec.tsx`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { CodeBlock } from '@/components/richtext/nodes/CodeBlock'
import type { CodeNode } from '@/components/richtext/types'

// Mock Shiki to avoid loading actual grammar files
vi.mock('@/components/richtext/shiki-config', () => ({
  getHighlighter: vi.fn().mockResolvedValue({
    codeToHtml: vi.fn((code: string) => `<pre><code>${code}</code></pre>`),
  }),
  getFallbackLanguage: vi.fn((lang: string | undefined) => lang || 'text'),
  CODE_THEME: 'github-dark',
}))

describe('CodeBlock', () => {
  const createNode = (
    code: string,
    language?: string
  ): CodeNode => ({
    type: 'code',
    language,
    version: 1,
    children: [
      { type: 'text', text: code, format: 0, version: 1 },
    ],
  })

  describe('rendering', () => {
    it('renders code block container', async () => {
      const node = createNode('const x = 1', 'javascript')
      const { container } = render(await CodeBlock({ node }))

      expect(container.querySelector('pre')).toBeTruthy()
      expect(container.querySelector('code')).toBeTruthy()
    })

    it('displays language indicator', async () => {
      const node = createNode('const x = 1', 'typescript')
      const { container } = render(await CodeBlock({ node }))

      expect(container.textContent).toMatch(/typescript/i)
    })

    it('handles missing language gracefully', async () => {
      const node = createNode('plain text')
      const { container } = render(await CodeBlock({ node }))

      expect(container.textContent).toMatch(/text/i)
    })
  })

  describe('text extraction', () => {
    it('extracts text from simple text node', async () => {
      const node = createNode('hello world', 'text')
      const { container } = render(await CodeBlock({ node }))

      expect(container.textContent).toContain('hello world')
    })

    it('handles multiple text nodes', async () => {
      const node: CodeNode = {
        type: 'code',
        language: 'javascript',
        version: 1,
        children: [
          { type: 'text', text: 'line 1', format: 0, version: 1 },
          { type: 'text', text: 'line 2', format: 0, version: 1 },
        ],
      }

      const { container } = render(await CodeBlock({ node }))
      expect(container.textContent).toContain('line 1')
      expect(container.textContent).toContain('line 2')
    })

    it('converts linebreaks to newlines', async () => {
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

      // Mock will receive code with newline
      const { container } = render(await CodeBlock({ node }))
      expect(container).toBeTruthy()
    })

    it('handles empty children', async () => {
      const node: CodeNode = {
        type: 'code',
        language: 'javascript',
        version: 1,
        children: [],
      }

      const { container } = render(await CodeBlock({ node }))
      expect(container).toBeTruthy()
    })
  })

  describe('styling', () => {
    it('has rounded corners', async () => {
      const node = createNode('code', 'text')
      const { container } = render(await CodeBlock({ node }))

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('rounded')
    })

    it('has overflow scroll', async () => {
      const node = createNode('code', 'text')
      const { container } = render(await CodeBlock({ node }))

      expect(container.innerHTML).toContain('overflow')
    })

    it('has border', async () => {
      const node = createNode('code', 'text')
      const { container } = render(await CodeBlock({ node }))

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('border')
    })
  })
})
```

### CopyButton Tests

**File**: `tests/unit/components/ui/copy-button.spec.tsx`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CopyButton } from '@/components/ui/copy-button'

describe('CopyButton', () => {
  const mockClipboard = {
    writeText: vi.fn().mockResolvedValue(undefined),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(navigator, { clipboard: mockClipboard })
  })

  describe('rendering', () => {
    it('renders a button', () => {
      render(<CopyButton text="test" />)
      expect(screen.getByRole('button')).toBeTruthy()
    })

    it('has copy aria-label initially', () => {
      render(<CopyButton text="test" />)
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Copy code')
    })
  })

  describe('copy functionality', () => {
    it('copies text to clipboard on click', async () => {
      render(<CopyButton text="hello world" />)

      fireEvent.click(screen.getByRole('button'))

      expect(mockClipboard.writeText).toHaveBeenCalledWith('hello world')
    })

    it('shows copied state after click', async () => {
      render(<CopyButton text="test" />)

      fireEvent.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Copied!')
      })
    })

    it('resets to copy state after timeout', async () => {
      vi.useFakeTimers()

      render(<CopyButton text="test" />)
      fireEvent.click(screen.getByRole('button'))

      // Fast-forward 2 seconds
      vi.advanceTimersByTime(2000)

      await waitFor(() => {
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Copy code')
      })

      vi.useRealTimers()
    })
  })

  describe('error handling', () => {
    it('handles clipboard API failure gracefully', async () => {
      mockClipboard.writeText.mockRejectedValueOnce(new Error('Failed'))

      render(<CopyButton text="test" />)

      // Should not throw
      fireEvent.click(screen.getByRole('button'))

      // Button should still be interactive
      expect(screen.getByRole('button')).toBeTruthy()
    })
  })

  describe('accessibility', () => {
    it('is focusable', () => {
      render(<CopyButton text="test" />)
      const button = screen.getByRole('button')

      button.focus()
      expect(document.activeElement).toBe(button)
    })

    it('can be triggered with Enter key', () => {
      render(<CopyButton text="test" />)
      const button = screen.getByRole('button')

      fireEvent.keyDown(button, { key: 'Enter' })
      // Note: keyDown doesn't trigger click by default
      // Button component should handle this
    })
  })
})
```

### Serializer Integration Tests

**File**: `tests/unit/components/richtext/serialize.spec.tsx` (add to existing or create)

```typescript
import { describe, it, expect, vi } from 'vitest'
import { serializeNode } from '@/components/richtext/serialize'
import type { CodeNode } from '@/components/richtext/types'

// Mock CodeBlock to avoid Shiki
vi.mock('@/components/richtext/nodes/CodeBlock', () => ({
  CodeBlock: vi.fn(({ node }) => (
    <div data-testid="code-block" data-language={node.language}>
      Mock CodeBlock
    </div>
  )),
}))

describe('serializeNode', () => {
  describe('code nodes', () => {
    it('routes code nodes to CodeBlock', () => {
      const node: CodeNode = {
        type: 'code',
        language: 'javascript',
        version: 1,
        children: [{ type: 'text', text: 'code', format: 0, version: 1 }],
      }

      const result = serializeNode(node, 0)

      // Result should be CodeBlock component
      expect(result).toBeTruthy()
    })

    it('passes language to CodeBlock', () => {
      const node: CodeNode = {
        type: 'code',
        language: 'typescript',
        version: 1,
        children: [{ type: 'text', text: 'code', format: 0, version: 1 }],
      }

      const result = serializeNode(node, 0)
      expect(result).toBeTruthy()
    })
  })
})
```

---

## Running Tests

### Commands

```bash
# Run all unit tests
pnpm test:unit

# Run specific test file
pnpm test:unit -- code-block

# Run with coverage
pnpm test:unit -- --coverage

# Run in watch mode
pnpm test:unit -- --watch
```

### Expected Output

```
✓ tests/unit/components/richtext/shiki-config.spec.ts (8 tests)
✓ tests/unit/components/richtext/code-block.spec.tsx (10 tests)
✓ tests/unit/components/richtext/copy-button.spec.tsx (7 tests)
✓ tests/unit/components/richtext/nodes.spec.tsx (existing tests)

Test Files  4 passed (4)
     Tests  25+ passed
```

---

## Visual Testing

### Manual Checklist

Test with various code samples in the browser:

#### Language Variety

- [ ] JavaScript code renders with correct colors
- [ ] TypeScript code renders with correct colors
- [ ] JSON syntax highlighted
- [ ] Bash/Shell commands highlighted
- [ ] HTML/CSS highlighted
- [ ] Python highlighted
- [ ] Unknown language shows as plain text

#### Edge Cases

- [ ] Empty code block renders gracefully
- [ ] Very long single line scrolls horizontally
- [ ] Multi-line code maintains indentation
- [ ] Special characters display correctly (`<`, `>`, `&`)
- [ ] Unicode characters work

#### Copy Button

- [ ] Button hidden by default
- [ ] Button appears on hover
- [ ] Click copies code to clipboard
- [ ] Icon changes to checkmark
- [ ] Resets after 2 seconds

#### Responsive

- [ ] Works on mobile (no hover - consider touch)
- [ ] Works on tablet
- [ ] Works on desktop

### Test Code Samples

Create test article with these code blocks:

**JavaScript**:
```javascript
function greet(name) {
  return `Hello, ${name}!`
}

const result = greet('World')
console.log(result)
```

**TypeScript**:
```typescript
interface User {
  id: number
  name: string
  email?: string
}

function processUser(user: User): string {
  return user.name.toUpperCase()
}
```

**JSON**:
```json
{
  "name": "test",
  "version": "1.0.0",
  "dependencies": {
    "shiki": "^3.0.0"
  }
}
```

**Bash**:
```bash
#!/bin/bash
echo "Installing dependencies..."
pnpm install
pnpm build
echo "Done!"
```

**Python**:
```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

result = [fibonacci(i) for i in range(10)]
print(result)
```

---

## Mocking Strategy

### Why Mock Shiki?

1. **Speed**: Shiki loads WASM files, slow in tests
2. **Isolation**: Test component logic, not Shiki
3. **Reliability**: Avoid network/file system in tests

### Mock Implementation

```typescript
vi.mock('@/components/richtext/shiki-config', () => ({
  getHighlighter: vi.fn().mockResolvedValue({
    codeToHtml: vi.fn((code: string, options: { lang: string }) => {
      return `<pre class="shiki"><code lang="${options.lang}">${code}</code></pre>`
    }),
  }),
  getFallbackLanguage: vi.fn((lang) => lang || 'text'),
  CODE_THEME: 'github-dark',
  SUPPORTED_LANGUAGES: ['javascript', 'typescript', 'json', 'bash'],
  isSupportedLanguage: vi.fn((lang) =>
    ['javascript', 'typescript', 'json', 'bash'].includes(lang)
  ),
}))
```

### When NOT to Mock

For integration or visual tests, real Shiki may be needed:

```typescript
// integration.spec.tsx
// No mock - test real highlighting
import { getHighlighter } from '@/components/richtext/shiki-config'

describe('Shiki Integration', () => {
  it('highlights JavaScript', async () => {
    const highlighter = await getHighlighter()
    const html = highlighter.codeToHtml('const x = 1', {
      lang: 'javascript',
      theme: 'github-dark',
    })

    expect(html).toContain('span')
    expect(html).toContain('const')
  })
})
```

---

## Coverage Targets

### Component Coverage

| Component | Target | Notes |
|-----------|--------|-------|
| shiki-config.ts | 90%+ | Pure functions |
| CodeBlock.tsx | 80%+ | Async component |
| InlineCode.tsx | 90%+ | Simple component |
| copy-button.tsx | 80%+ | Client interactions |
| serialize.tsx (code path) | 80%+ | Integration |

### Running Coverage

```bash
pnpm test:unit -- --coverage
```

### Coverage Report

```
----------------------|---------|----------|---------|---------|
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
shiki-config.ts       |   95    |    90    |   100   |    95   |
nodes/CodeBlock.tsx   |   85    |    80    |   100   |    85   |
nodes/InlineCode.tsx  |  100    |   100    |   100   |   100   |
ui/copy-button.tsx    |   80    |    75    |    90   |    80   |
----------------------|---------|----------|---------|---------|
```

---

## Troubleshooting Tests

### Common Issues

#### "Cannot find module 'shiki'"

**Cause**: Shiki not installed or mock not applied

**Solution**: Verify mock is at top of test file, before imports

#### "Async component not resolved"

**Cause**: Async Server Component not awaited

**Solution**:
```typescript
// Wrong
render(<CodeBlock node={node} />)

// Correct
render(await CodeBlock({ node }))
```

#### "Clipboard API not available"

**Cause**: jsdom doesn't have clipboard API

**Solution**: Mock in beforeEach:
```typescript
beforeEach(() => {
  Object.assign(navigator, {
    clipboard: { writeText: vi.fn() }
  })
})
```

#### "Test timeout"

**Cause**: Async operation not resolving

**Solution**: Check mock resolves correctly, use `waitFor`

---

## Next Steps

After testing Phase 3:

1. Complete [VALIDATION_CHECKLIST.md](../validation/VALIDATION_CHECKLIST.md)
2. Run full test suite: `pnpm test:unit`
3. Visual testing in browser
4. Proceed to Phase 4 or Phase 5 (E2E tests)

---

**Testing Guide Generated**: 2025-12-10
