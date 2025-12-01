# Testing Guide - Phase 1 : CodeBlock Definition

## Test Strategy Overview

| Test Type      | Scope                    | Tools          | Phase    |
| -------------- | ------------------------ | -------------- | -------- |
| Unit Tests     | Block structure          | Vitest         | Phase 1  |
| Integration    | Lexical with blocks      | Vitest + Payload | Phase 4  |
| E2E            | Admin UI editor          | Playwright     | Phase 4  |

**Phase 1 Focus**: Unit tests only - validate CodeBlock structure.

---

## Unit Tests

### Test File Location

```
tests/unit/blocks.spec.ts
```

### Test Coverage Goals

| Component              | Coverage Target | Priority |
| ---------------------- | --------------- | -------- |
| CodeBlock.slug         | 100%            | Critical |
| CodeBlock.interfaceName| 100%            | Critical |
| CodeBlock.labels       | 100%            | High     |
| CodeBlock.fields       | 100%            | Critical |
| Language options       | 100%            | Critical |

### Test Cases

#### 1. Block Metadata Tests

```typescript
describe('CodeBlock', () => {
  it('should have correct slug', () => {
    expect(CodeBlock.slug).toBe('code')
  })

  it('should have correct interfaceName', () => {
    expect(CodeBlock.interfaceName).toBe('CodeBlock')
  })

  it('should have correct labels', () => {
    expect(CodeBlock.labels).toEqual({
      singular: 'Code Block',
      plural: 'Code Blocks',
    })
  })
})
```

**What These Test**:

- `slug`: Unique identifier used in database and API
- `interfaceName`: TypeScript type name in generated types
- `labels`: Admin UI display strings

#### 2. Language Field Tests

```typescript
describe('CodeBlock language field', () => {
  it('should have language field as first field', () => {
    const languageField = CodeBlock.fields[0]
    expect(languageField).toMatchObject({
      name: 'language',
      type: 'select',
      required: true,
      defaultValue: 'typescript',
    })
  })

  it('should support 10 programming languages', () => {
    const languageField = CodeBlock.fields[0]
    if ('options' in languageField) {
      expect(languageField.options).toHaveLength(10)

      const expectedLanguages = [
        'typescript',
        'javascript',
        'python',
        'bash',
        'json',
        'html',
        'css',
        'sql',
        'go',
        'rust',
      ]

      const values = languageField.options.map((opt) =>
        typeof opt === 'string' ? opt : opt.value
      )

      expectedLanguages.forEach((lang) => {
        expect(values).toContain(lang)
      })
    }
  })
})
```

**What These Test**:

- Field is correctly configured as select type
- Field is required (cannot be empty)
- TypeScript is the default language
- All 10 programming languages are available

#### 3. Code Field Tests

```typescript
describe('CodeBlock code field', () => {
  it('should have code field as second field', () => {
    const codeField = CodeBlock.fields[1]
    expect(codeField).toMatchObject({
      name: 'code',
      type: 'code',
      required: true,
    })
  })

  it('should have admin language config on code field', () => {
    const codeField = CodeBlock.fields[1]
    if ('admin' in codeField && codeField.admin) {
      expect(codeField.admin).toHaveProperty('language', 'typescript')
    }
  })
})
```

**What These Test**:

- Code field uses Payload's `code` type (Monaco editor)
- Field is required (content cannot be empty)
- Admin panel shows TypeScript syntax highlighting by default

---

## Running Tests

### Run All Unit Tests

```bash
pnpm test:unit
```

### Run Specific Test File

```bash
pnpm test:unit tests/unit/blocks.spec.ts
```

### Run Tests in Watch Mode

```bash
pnpm test:unit --watch
```

### Run Tests with Coverage

```bash
pnpm test:coverage
```

---

## Expected Test Output

### Successful Run

```
 ✓ tests/unit/blocks.spec.ts (7)
   ✓ CodeBlock (7)
     ✓ should have correct slug
     ✓ should have correct interfaceName
     ✓ should have correct labels
     ✓ should have language field as first field
     ✓ should support 10 programming languages
     ✓ should have code field as second field
     ✓ should have admin language config on code field

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  10:30:00
   Duration  234ms
```

### Failed Test Example

```
 ✗ tests/unit/blocks.spec.ts (7)
   ✓ CodeBlock (6)
     ✓ should have correct slug
     ✓ should have correct interfaceName
     ✓ should have correct labels
     ✓ should have language field as first field
     ✗ should support 10 programming languages
       AssertionError: expected 9 to be 10

       Expected: 10
       Received: 9
```

**Debug Steps**:

1. Check `CodeBlock.ts` for missing language
2. Verify all 10 options are present in array
3. Re-run test

---

## Test Helpers

### Type-Safe Field Access

```typescript
import type { SelectField, CodeField } from 'payload'

// Helper to safely access field options
function getFieldOptions(field: unknown): string[] {
  if (
    typeof field === 'object' &&
    field !== null &&
    'options' in field &&
    Array.isArray((field as SelectField).options)
  ) {
    return (field as SelectField).options.map((opt) =>
      typeof opt === 'string' ? opt : opt.value
    )
  }
  return []
}

// Usage in test
it('should have all languages', () => {
  const options = getFieldOptions(CodeBlock.fields[0])
  expect(options).toContain('typescript')
})
```

### Snapshot Testing (Optional)

```typescript
it('should match snapshot', () => {
  expect(CodeBlock).toMatchSnapshot()
})
```

**Note**: Use sparingly - structural tests are preferred.

---

## Integration with CI/CD

### GitHub Actions Integration

Tests run automatically on:

- Pull request to `main`
- Push to feature branches

### Quality Gate Requirements

| Check              | Requirement          |
| ------------------ | -------------------- |
| Unit tests pass    | All tests must pass  |
| Linting            | No errors            |
| TypeScript         | No type errors       |
| Build              | Must succeed         |

---

## Debugging Tests

### Common Issues

#### Issue: Cannot find module '@/blocks'

**Solution**: Check path alias in `vitest.config.ts`:

```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

#### Issue: Type errors in test

**Solution**: Ensure types are imported correctly:

```typescript
// Import types explicitly
import type { Block, SelectField, CodeField } from 'payload'
```

#### Issue: Test times out

**Solution**: Unit tests should be fast (<100ms). If slow:

1. Check for async operations
2. Verify no network calls
3. Ensure no file I/O

---

## Future Testing (Phase 4)

### Integration Tests

```typescript
// tests/int/lexical.int.spec.ts (Phase 4)
describe('Lexical with CodeBlock', () => {
  it('should create article with CodeBlock', async () => {
    const article = await payload.create({
      collection: 'articles',
      data: {
        title: 'Test Article',
        content: {
          root: {
            children: [
              {
                type: 'block',
                blockType: 'code',
                fields: {
                  language: 'typescript',
                  code: 'const x = 1',
                },
              },
            ],
          },
        },
      },
    })

    expect(article.content.root.children[0].blockType).toBe('code')
  })
})
```

### E2E Tests

```typescript
// tests/e2e/editor.e2e.spec.ts (Phase 4)
test('should insert code block in editor', async ({ page }) => {
  await page.goto('/admin/collections/articles/create')
  await page.click('[data-lexical-editor]')
  await page.click('[aria-label="Insert block"]')
  await page.click('[data-block-type="code"]')

  await expect(page.locator('[data-block="code"]')).toBeVisible()
})
```

---

## Test Maintenance

### When to Update Tests

- [ ] CodeBlock fields change
- [ ] New language added
- [ ] Labels modified
- [ ] Field order changes

### Test Review Checklist

- [ ] Tests cover all critical paths
- [ ] Tests are independent (no shared state)
- [ ] Tests are fast (<100ms each)
- [ ] Tests have descriptive names
- [ ] No skipped tests without reason
