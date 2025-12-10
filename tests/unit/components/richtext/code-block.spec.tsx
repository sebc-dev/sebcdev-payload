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
  CopyButton: ({ text }: { text: string }) => (
    <button type="button" data-testid="copy-button" data-text={text}>
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

    expect(container.textContent).toContain('TYPESCRIPT')
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
    expect(container.querySelector('pre')).toBeTruthy()
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
    expect(copyButton?.getAttribute('data-text')).toBe('const x = 1')
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

  it('renders uppercase language label', async () => {
    const node: CodeNode = {
      type: 'code',
      language: 'python',
      version: 1,
      children: [{ type: 'text', text: 'print("hello")', format: 0, version: 1 }],
    }

    const { container } = render(await CodeBlock({ node }))

    expect(container.textContent).toContain('PYTHON')
  })
})
