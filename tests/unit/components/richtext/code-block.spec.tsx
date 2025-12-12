import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
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

// Mock CopyButton to avoid client component issues in tests
vi.mock('@/components/ui/copy-button', () => ({
  CopyButton: ({ copyFromDOM, text }: { copyFromDOM?: boolean; text?: string }) => (
    <button
      type="button"
      data-testid="copy-button"
      data-text={text}
      data-copy-from-dom={copyFromDOM}
    >
      Copy
    </button>
  ),
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

    expect(container.textContent).toContain('TypeScript')
    expect(container.querySelector('pre')).toBeTruthy()
  })

  it('handles missing language with "Plain Text" label', async () => {
    const node: CodeNode = {
      type: 'code',
      version: 1,
      children: [{ type: 'text', text: 'plain text', format: 0, version: 1 }],
    }

    const { container } = render(await CodeBlock({ node }))

    expect(container.textContent).toContain('Plain Text')
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

    const { container } = render(await CodeBlock({ node }))
    const copyButton = container.querySelector('[data-testid="copy-button"]')

    // Verify CopyButton uses DOM mode (will copy from the actual code in the DOM)
    expect(copyButton?.getAttribute('data-copy-from-dom')).toBe('true')
    expect(container.querySelector('pre')).toBeTruthy()
    // Verify container has the data attribute for copyFromDOM to work
    expect(container.querySelector('[data-code-container]')).toBeTruthy()
  })

  it('includes copy button with code text', async () => {
    const node: CodeNode = {
      type: 'code',
      language: 'typescript',
      version: 1,
      children: [{ type: 'text', text: 'const x = 1', format: 0, version: 1 }],
    }

    const { container } = render(await CodeBlock({ node }))
    const copyButton = container.querySelector('[data-testid="copy-button"]')

    expect(copyButton).toBeTruthy()
    // Verify CopyButton is in DOM mode (no text prop needed)
    expect(copyButton?.getAttribute('data-copy-from-dom')).toBe('true')
    // Verify pre/code structure exists (for copyFromDOM to work)
    expect(container.querySelector('pre code')).toBeTruthy()
  })

  it('applies correct container styling', async () => {
    const node: CodeNode = {
      type: 'code',
      language: 'javascript',
      version: 1,
      children: [{ type: 'text', text: 'code', format: 0, version: 1 }],
    }

    const { container } = render(await CodeBlock({ node }))
    const wrapper = container.firstElementChild

    expect(wrapper?.className).toContain('rounded-lg')
    expect(wrapper?.className).toContain('border')
    expect(wrapper?.className).toContain('my-6')
  })

  it('renders human-friendly language label', async () => {
    const node: CodeNode = {
      type: 'code',
      language: 'python',
      version: 1,
      children: [{ type: 'text', text: 'print("hello")', format: 0, version: 1 }],
    }

    const { container } = render(await CodeBlock({ node }))

    expect(container.textContent).toContain('Python')
  })
})
