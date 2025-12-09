# Phase 2 - Testing Guide

Complete testing strategy for Phase 2.

---

## 🎯 Testing Strategy

Phase 2 uses a multi-layered testing approach:

1. **Unit Tests**: Individual serializer functions and components
2. **Integration Tests**: RichText component with real Lexical content
3. **Visual Tests**: Manual inspection of rendered content

**Target Coverage**: >80%
**Estimated Test Count**: 30+ tests

---

## 🧪 Unit Tests

### Purpose

Test individual functions and components in isolation.

### Running Unit Tests

```bash
# Run all unit tests
pnpm test:unit

# Run specific test file
pnpm test:unit -- tests/unit/components/richtext/serialize.spec.ts

# Watch mode (during development)
pnpm test:unit -- --watch

# Coverage report
pnpm test:unit -- --coverage
```

### Expected Results

```
 ✓ tests/unit/components/richtext/serialize.spec.ts (15 tests)
 ✓ tests/unit/components/richtext/Paragraph.spec.ts (3 tests)
 ✓ tests/unit/components/richtext/Heading.spec.ts (6 tests)
 ✓ tests/unit/components/richtext/List.spec.ts (8 tests)
 ✓ tests/unit/components/richtext/Quote.spec.ts (3 tests)
 ✓ tests/unit/components/richtext/Link.spec.ts (7 tests)

Test Files  6 passed
Tests       42 passed
```

**Coverage Goal**: >80% for all new code

### Test Files Structure

```
tests/unit/components/richtext/
├── serialize.spec.ts     # Serializer functions
├── Paragraph.spec.ts     # Paragraph component
├── Heading.spec.ts       # Heading component + slugify
├── List.spec.ts          # List/ListItem components
├── Quote.spec.ts         # Quote component
└── Link.spec.ts          # Link component + helpers
```

### Adding New Unit Tests

1. Create test file: `tests/unit/components/richtext/[name].spec.ts`
2. Import function/component to test
3. Write test cases:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Paragraph } from '@/components/richtext/nodes/Paragraph'
import type { ParagraphNode } from '@/components/richtext/types'

describe('Paragraph', () => {
  it('renders paragraph element', () => {
    const node: ParagraphNode = {
      type: 'paragraph',
      version: 1,
      children: [{ type: 'text', text: 'Hello', format: 0, version: 1 }],
    }

    render(<Paragraph node={node} />)

    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Hello').closest('p')).toBeInTheDocument()
  })
})
```

---

## 📝 Test Cases by Component

### Serializer Tests (`serialize.spec.ts`)

```typescript
describe('serializeLexical', () => {
  // Entry point tests
  it('returns null for null content')
  it('returns null for undefined content')
  it('returns null for content without root')
  it('returns null for content without children')
  it('serializes single paragraph')
  it('serializes multiple paragraphs')
  it('handles nested content')
})

describe('serializeText', () => {
  // Text formatting tests
  it('renders plain text')
  it('renders bold text with <strong>')
  it('renders italic text with <em>')
  it('renders underline text with <u>')
  it('renders strikethrough text with <s>')
  it('renders inline code with <code>')
  it('renders subscript with <sub>')
  it('renders superscript with <sup>')
  it('renders combined bold and italic')
  it('renders all formats combined')
})

describe('serializeNode', () => {
  // Node routing tests
  it('routes paragraph to Paragraph component')
  it('routes heading to Heading component')
  it('routes list to List component')
  it('routes quote to Quote component')
  it('routes link to Link component')
  it('handles unknown node type')
  it('renders linebreak as <br>')
})
```

### Heading Tests (`Heading.spec.ts`)

```typescript
describe('Heading', () => {
  it('renders h1 tag for h1 type')
  it('renders h2 tag for h2 type')
  it('renders h3 tag for h3 type')
  it('generates id from text content')
  it('handles accented characters in id')
  it('handles special characters in id')
  it('renders anchor link')
  it('hides anchor link by default')
})

describe('slugify', () => {
  it('converts to lowercase')
  it('removes accents')
  it('replaces spaces with hyphens')
  it('removes special characters')
  it('handles multiple spaces')
  it('handles empty string')
})
```

### List Tests (`List.spec.ts`)

```typescript
describe('List', () => {
  it('renders ul for bullet list')
  it('renders ol for numbered list')
  it('applies list-disc for bullet')
  it('applies list-decimal for numbered')
  it('preserves start attribute')
  it('renders all list items')
})

describe('ListItem', () => {
  it('renders li element')
  it('renders text content')
  it('supports nested lists')
  it('removes bullet for nested parent')
})
```

### Quote Tests (`Quote.spec.ts`)

```typescript
describe('Quote', () => {
  it('renders blockquote element')
  it('applies border-left styling')
  it('renders children correctly')
  it('handles multiple paragraphs')
})
```

### Link Tests (`Link.spec.ts`)

```typescript
describe('Link', () => {
  it('renders anchor element')
  it('uses Next Link for internal URLs')
  it('uses regular anchor for external URLs')
  it('adds rel="noopener noreferrer" for external')
  it('opens external in new tab')
  it('handles mailto: links')
  it('handles tel: links')
})

describe('isExternalUrl', () => {
  it('returns false for relative URLs')
  it('returns false for hash URLs')
  it('returns false for mailto:')
  it('returns false for tel:')
  it('returns true for http URLs')
  it('returns true for https URLs')
})
```

---

## 🔗 Integration Tests

### Purpose

Test that the RichText component correctly renders complex Lexical content.

### Prerequisites

- [ ] Dev server running
- [ ] Test article with rich content exists

### Running Integration Tests

```bash
# Start dev server in background
pnpm dev &

# Run integration tests
pnpm test:int
```

### Integration Test Examples

```typescript
// tests/int/components/richtext.int.spec.ts
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { RichText } from '@/components/richtext'
import type { LexicalContent } from '@/components/richtext/types'

describe('RichText Integration', () => {
  it('renders complete article content', () => {
    const content: LexicalContent = {
      root: {
        type: 'root',
        version: 1,
        children: [
          {
            type: 'heading',
            tag: 'h2',
            version: 1,
            children: [{ type: 'text', text: 'Introduction', format: 0, version: 1 }],
          },
          {
            type: 'paragraph',
            version: 1,
            children: [
              { type: 'text', text: 'This is ', format: 0, version: 1 },
              { type: 'text', text: 'bold', format: 1, version: 1 },
              { type: 'text', text: ' text.', format: 0, version: 1 },
            ],
          },
        ],
      },
    }

    const { container } = render(<RichText content={content} />)

    expect(container.querySelector('h2')).toHaveTextContent('Introduction')
    expect(container.querySelector('strong')).toHaveTextContent('bold')
  })
})
```

---

## 📊 Coverage Report

### Generate Coverage

```bash
pnpm test:unit -- --coverage
```

### View Coverage

```bash
# Terminal report (default)
pnpm test:unit -- --coverage

# HTML report
pnpm test:unit -- --coverage --reporter=html

# Open coverage/index.html in browser
```

### Coverage Goals

| Area | Target | Current |
|------|--------|---------|
| serialize.tsx | >90% | - |
| types.ts | 100% | - |
| nodes/Paragraph.tsx | >80% | - |
| nodes/Heading.tsx | >80% | - |
| nodes/List.tsx | >80% | - |
| nodes/Quote.tsx | >80% | - |
| nodes/Link.tsx | >80% | - |
| RichText.tsx | >80% | - |
| **Overall** | >80% | - |

---

## 🎭 Mocking

### Mocking Next.js Link

```typescript
import { vi } from 'vitest'

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))
```

### Mocking Window Location

```typescript
beforeEach(() => {
  Object.defineProperty(window, 'location', {
    value: { origin: 'http://localhost:3000' },
    writable: true,
  })
})
```

### When to Mock

- ✅ Next.js components (Link, Image)
- ✅ window.location for URL tests
- ❌ Serializer functions (test the real thing)
- ❌ Node components (test with real DOM)

---

## 🐛 Debugging Tests

### Common Issues

#### Issue: Tests fail with "document is not defined"

**Solutions**:

1. Ensure vitest.config.mts has `environment: 'jsdom'`
2. Add `/// <reference types="@testing-library/jest-dom" />` to test file

#### Issue: Component not rendering

**Solutions**:

1. Check that all props are provided
2. Verify React is imported
3. Check for missing key props in lists

#### Issue: Async component tests timeout

**Solutions**:

1. Use `waitFor` for async assertions
2. Increase timeout: `it('test', async () => {}, 10000)`

### Debug Commands

```bash
# Run single test in verbose mode
pnpm test:unit -- --reporter=verbose tests/unit/components/richtext/serialize.spec.ts

# Run with debugger
node --inspect-brk node_modules/.bin/vitest run
```

---

## 🤖 CI/CD Automation

### GitHub Actions

Tests run automatically on:

- [x] Pull requests
- [x] Push to main branch

### CI Test Command

```yaml
# In .github/workflows/tests.yml
- name: Run Unit Tests
  run: pnpm test:unit -- --coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

### Required Checks

All PRs must:

- [x] Pass all unit tests
- [x] Meet coverage threshold (>80%)
- [x] Pass TypeScript type check
- [x] Pass linter

---

## ✅ Testing Checklist

Before merging:

- [ ] All unit tests pass
- [ ] Coverage >80%
- [ ] No skipped tests (unless justified)
- [ ] No console errors/warnings
- [ ] Tests run in CI successfully
- [ ] Visual inspection completed

---

## 📝 Best Practices

### Writing Tests

✅ **Do**:

- Test behavior, not implementation
- Use descriptive test names
- One assertion per test (when possible)
- Test edge cases (empty, null, nested)

❌ **Don't**:

- Test React internals
- Over-mock (test real code)
- Write flaky tests
- Ignore failing tests

### Test Naming

```typescript
// Pattern: [Unit] [Action/Condition] [Expected Result]
it('renders bold text with <strong> element')
it('returns null when content is undefined')
it('generates slug from heading text')
```

### Arrange-Act-Assert Pattern

```typescript
it('renders paragraph with text', () => {
  // Arrange
  const node: ParagraphNode = {
    type: 'paragraph',
    version: 1,
    children: [{ type: 'text', text: 'Hello', format: 0, version: 1 }],
  }

  // Act
  const { container } = render(<Paragraph node={node} />)

  // Assert
  expect(container.querySelector('p')).toHaveTextContent('Hello')
})
```

---

## 🧪 Sample Test Data

### Simple Paragraph

```typescript
const simpleParagraph: LexicalContent = {
  root: {
    type: 'root',
    version: 1,
    children: [
      {
        type: 'paragraph',
        version: 1,
        children: [{ type: 'text', text: 'Hello world', format: 0, version: 1 }],
      },
    ],
  },
}
```

### Formatted Text

```typescript
const formattedText: LexicalContent = {
  root: {
    type: 'root',
    version: 1,
    children: [
      {
        type: 'paragraph',
        version: 1,
        children: [
          { type: 'text', text: 'Normal ', format: 0, version: 1 },
          { type: 'text', text: 'bold', format: 1, version: 1 },
          { type: 'text', text: ' ', format: 0, version: 1 },
          { type: 'text', text: 'italic', format: 2, version: 1 },
          { type: 'text', text: ' ', format: 0, version: 1 },
          { type: 'text', text: 'both', format: 3, version: 1 },
        ],
      },
    ],
  },
}
```

### Nested List

```typescript
const nestedList: LexicalContent = {
  root: {
    type: 'root',
    version: 1,
    children: [
      {
        type: 'list',
        listType: 'bullet',
        tag: 'ul',
        version: 1,
        children: [
          {
            type: 'listitem',
            version: 1,
            children: [{ type: 'text', text: 'Item 1', format: 0, version: 1 }],
          },
          {
            type: 'listitem',
            version: 1,
            children: [
              { type: 'text', text: 'Item 2', format: 0, version: 1 },
              {
                type: 'list',
                listType: 'bullet',
                tag: 'ul',
                version: 1,
                children: [
                  {
                    type: 'listitem',
                    version: 1,
                    children: [{ type: 'text', text: 'Nested', format: 0, version: 1 }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
}
```

---

## ❓ FAQ

**Q: How much should I test?**
A: Aim for >80% coverage, focus on critical paths and edge cases.

**Q: Should I test private functions?**
A: Test through public API. If a function is important, export it.

**Q: Tests are slow, what to do?**
A: Run only affected tests during dev, full suite before commit.

**Q: Can I skip tests?**
A: Only with `it.skip` and a comment explaining why. Never leave permanently.

---

**Testing Guide Created**: 2025-12-09
**Last Updated**: 2025-12-09
