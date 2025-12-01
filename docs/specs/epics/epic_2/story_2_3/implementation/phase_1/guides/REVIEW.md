# Code Review Guide - Phase 1 : CodeBlock Definition

## Review Overview

| Metric           | Value               |
| ---------------- | ------------------- |
| Total Commits    | 3                   |
| Total Files      | 3                   |
| Estimated Lines  | ~150                |
| Review Time      | ~40 minutes         |
| Risk Level       | Low                 |

---

## Commit-by-Commit Review

### Commit #1 : Create CodeBlock Definition

**File**: `src/blocks/CodeBlock.ts`
**Lines**: ~60

#### Review Checklist

- [ ] **Type Import**: Verify `Block` is imported from `payload` (not `@payloadcms/richtext-lexical`)
- [ ] **Slug**: Confirm slug is `code` (lowercase, no spaces)
- [ ] **InterfaceName**: Verify `CodeBlock` matches TypeScript conventions (PascalCase)
- [ ] **Labels**: Check singular/plural labels are correct
- [ ] **Language Field**:
  - [ ] Type is `select`
  - [ ] `required: true`
  - [ ] `defaultValue: 'typescript'`
  - [ ] Exactly 10 options
  - [ ] All options have `label` and `value`
- [ ] **Code Field**:
  - [ ] Type is `code`
  - [ ] `required: true`
  - [ ] `admin.language: 'typescript'`
- [ ] **JSDoc**: Documentation comment present

#### Code Quality Points

```typescript
// GOOD: Correct import
import type { Block } from 'payload'

// BAD: Wrong import source
// import type { Block } from '@payloadcms/richtext-lexical'
```

```typescript
// GOOD: Options with label/value objects
options: [
  { label: 'TypeScript', value: 'typescript' },
  // ...
]

// BAD: String-only options (less accessible)
// options: ['typescript', 'javascript', ...]
```

#### Security Considerations

- No security concerns for this commit
- Block definition is purely structural

#### Performance Considerations

- No performance concerns
- Block is lightweight (no runtime logic)

---

### Commit #2 : Create Blocks Barrel Export

**File**: `src/blocks/index.ts`
**Lines**: ~10

#### Review Checklist

- [ ] **Export Statement**: Uses named export `{ CodeBlock }`
- [ ] **Import Path**: Relative path `./CodeBlock` is correct
- [ ] **No Default Export**: Only named exports (project convention)

#### Code Quality Points

```typescript
// GOOD: Named re-export
export { CodeBlock } from './CodeBlock'

// BAD: Import then re-export (unnecessary)
// import { CodeBlock } from './CodeBlock'
// export { CodeBlock }

// BAD: Default export (breaks tree-shaking)
// export default CodeBlock
```

#### Future Extensibility

When adding new blocks, simply add to the barrel:

```typescript
export { CodeBlock } from './CodeBlock'
export { QuoteBlock } from './QuoteBlock'  // Future
export { ImageBlock } from './ImageBlock'  // Future
```

---

### Commit #3 : Add CodeBlock Structure Validation Tests

**File**: `tests/unit/blocks.spec.ts`
**Lines**: ~80

#### Review Checklist

- [ ] **Test Structure**: Uses `describe`/`it` pattern
- [ ] **Import**: Imports from `@/blocks` path alias
- [ ] **Coverage**: Tests all key properties:
  - [ ] `slug`
  - [ ] `interfaceName`
  - [ ] `labels`
  - [ ] Language field structure
  - [ ] 10 languages present
  - [ ] Code field structure
  - [ ] Admin config
- [ ] **Assertions**: Uses `expect` with appropriate matchers
- [ ] **Type Safety**: Type guards for conditional checks

#### Code Quality Points

```typescript
// GOOD: Type guard for optional properties
if ('options' in languageField) {
  expect(languageField.options).toHaveLength(10)
}

// BAD: Direct access without type guard
// expect(languageField.options).toHaveLength(10)  // TypeScript error
```

```typescript
// GOOD: Test specific values
expect(CodeBlock.slug).toBe('code')

// BAD: Truthy check only
// expect(CodeBlock.slug).toBeTruthy()
```

#### Test Quality

| Test                              | Verifies                     | Priority |
| --------------------------------- | ---------------------------- | -------- |
| should have correct slug          | Block identifier             | Critical |
| should have correct interfaceName | TypeScript type name         | Critical |
| should have correct labels        | Admin UI display             | High     |
| should have language field        | Select field structure       | Critical |
| should support 10 languages       | All language options         | Critical |
| should have code field            | Code field structure         | Critical |
| should have admin config          | Monaco editor config         | Medium   |

---

## Cross-Commit Review

### Consistency Checks

- [ ] All files use consistent import style (named imports)
- [ ] All files use consistent quotes (single quotes)
- [ ] All files formatted with Prettier
- [ ] No TODO comments left behind

### Path Alias Verification

```bash
# Verify @/blocks resolves correctly
grep -r "from '@/blocks'" tests/
# Should find: tests/unit/blocks.spec.ts
```

### TypeScript Verification

```bash
# No TypeScript errors
pnpm build
# Expected: Build succeeds
```

---

## Common Issues to Watch

### Issue #1: Wrong Import Source

```typescript
// WRONG - Don't import Block from richtext-lexical
import type { Block } from '@payloadcms/richtext-lexical'

// CORRECT - Import from payload core
import type { Block } from 'payload'
```

### Issue #2: Missing Required Fields

```typescript
// WRONG - Missing required on code field
{
  name: 'code',
  type: 'code',
  // missing required: true
}

// CORRECT
{
  name: 'code',
  type: 'code',
  required: true,
}
```

### Issue #3: Inconsistent Naming

```typescript
// WRONG - Inconsistent casing
slug: 'Code',           // Should be lowercase
interfaceName: 'codeBlock',  // Should be PascalCase

// CORRECT
slug: 'code',
interfaceName: 'CodeBlock',
```

---

## Review Approval Criteria

### Must Pass

- [ ] All TypeScript compiles without errors
- [ ] All unit tests pass
- [ ] Linting passes
- [ ] Commit messages follow gitmoji convention
- [ ] No security vulnerabilities introduced

### Should Pass

- [ ] Code follows project conventions
- [ ] JSDoc comments present on exports
- [ ] Tests cover all critical functionality

### Nice to Have

- [ ] Test coverage > 90%
- [ ] No complex logic (keep it simple)

---

## Post-Review Actions

### If Approved

1. Merge commits to feature branch
2. Update EPIC_TRACKING.md
3. Generate Phase 2 documentation

### If Changes Requested

1. Address review comments
2. Amend commits if needed (single logical change per commit)
3. Re-request review

---

## Review Sign-Off

| Reviewer         | Status   | Date |
| ---------------- | -------- | ---- |
| [Reviewer Name]  | Pending  | -    |

### Approval Notes

```
[Space for reviewer comments]
```
