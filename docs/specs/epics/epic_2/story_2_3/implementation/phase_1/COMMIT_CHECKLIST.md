# Commit Checklist - Phase 1 : CodeBlock Definition

## Overview

| Commit | Title                                         | Status  |
| ------ | --------------------------------------------- | ------- |
| #1     | Create CodeBlock definition with languages    | Pending |
| #2     | Create blocks barrel export                   | Pending |
| #3     | Add CodeBlock structure validation tests      | Pending |

---

## Commit #1 : Create CodeBlock Definition

### Pre-Commit Checklist

- [ ] Verify `src/blocks` directory doesn't exist yet
- [ ] Confirm Payload CMS is installed (`@payloadcms/richtext-lexical`)
- [ ] IDE TypeScript extension is active

### Implementation Steps

1. **Create blocks directory**

   ```bash
   mkdir -p src/blocks
   ```

2. **Create CodeBlock.ts**

   ```typescript
   // src/blocks/CodeBlock.ts
   import type { Block } from 'payload'

   /**
    * CodeBlock for Lexical editor.
    * Allows inserting code snippets with language selection.
    * Used with BlocksFeature in payload.config.ts.
    */
   export const CodeBlock: Block = {
     slug: 'code',
     interfaceName: 'CodeBlock',
     labels: {
       singular: 'Code Block',
       plural: 'Code Blocks',
     },
     fields: [
       {
         name: 'language',
         type: 'select',
         defaultValue: 'typescript',
         required: true,
         options: [
           { label: 'TypeScript', value: 'typescript' },
           { label: 'JavaScript', value: 'javascript' },
           { label: 'Python', value: 'python' },
           { label: 'Bash', value: 'bash' },
           { label: 'JSON', value: 'json' },
           { label: 'HTML', value: 'html' },
           { label: 'CSS', value: 'css' },
           { label: 'SQL', value: 'sql' },
           { label: 'Go', value: 'go' },
           { label: 'Rust', value: 'rust' },
         ],
       },
       {
         name: 'code',
         type: 'code',
         required: true,
         admin: {
           language: 'typescript',
         },
       },
     ],
   }
   ```

3. **Verify TypeScript**

   - Open file in IDE
   - Confirm no red squiggles
   - Hover over `Block` type to verify import

### Post-Implementation Validation

- [ ] File `src/blocks/CodeBlock.ts` exists
- [ ] Import `Block` from `payload` works
- [ ] Block has slug `code`
- [ ] Block has interfaceName `CodeBlock`
- [ ] Field `language` is select with 10 options
- [ ] Field `code` is type `code` with required: true
- [ ] Admin config has `language: 'typescript'`
- [ ] JSDoc comment present
- [ ] No TypeScript errors in IDE

### Commit Command

```bash
git add src/blocks/CodeBlock.ts
git commit -m "$(cat <<'EOF'
feat(blocks): create CodeBlock definition with language selection

Add CodeBlock for Lexical editor with:
- language select field (10 programming languages)
- code field with Monaco editor
- TypeScript as default language

Supported languages: TypeScript, JavaScript, Python, Bash, JSON, HTML, CSS, SQL, Go, Rust

Story: 2.3 Phase 1 Commit 1/3

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Commit #2 : Create Blocks Barrel Export

### Pre-Commit Checklist

- [ ] Commit #1 completed and verified
- [ ] `src/blocks/CodeBlock.ts` exists

### Implementation Steps

1. **Create index.ts**

   ```typescript
   // src/blocks/index.ts
   export { CodeBlock } from './CodeBlock'
   ```

2. **Verify import works**

   ```typescript
   // Test in any file temporarily:
   import { CodeBlock } from '@/blocks'
   console.log(CodeBlock.slug) // Should be 'code'
   ```

### Post-Implementation Validation

- [ ] File `src/blocks/index.ts` exists
- [ ] Export statement is correct
- [ ] Import `{ CodeBlock } from '@/blocks'` works
- [ ] No TypeScript errors
- [ ] `pnpm lint` passes

### Commit Command

```bash
git add src/blocks/index.ts
git commit -m "$(cat <<'EOF'
feat(blocks): create blocks barrel export

Add centralized export file for Payload blocks.
Follows project convention for module exports.

Story: 2.3 Phase 1 Commit 2/3

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Commit #3 : Add CodeBlock Structure Validation Tests

### Pre-Commit Checklist

- [ ] Commits #1 and #2 completed
- [ ] Import path `@/blocks` works
- [ ] Vitest is configured in project

### Implementation Steps

1. **Create test file**

   ```typescript
   // tests/unit/blocks.spec.ts
   import { describe, it, expect } from 'vitest'
   import { CodeBlock } from '@/blocks'

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

2. **Run tests**

   ```bash
   pnpm test:unit tests/unit/blocks.spec.ts
   ```

3. **Verify all pass**

   ```
   ✓ CodeBlock > should have correct slug
   ✓ CodeBlock > should have correct interfaceName
   ✓ CodeBlock > should have correct labels
   ✓ CodeBlock > should have language field as first field
   ✓ CodeBlock > should support 10 programming languages
   ✓ CodeBlock > should have code field as second field
   ✓ CodeBlock > should have admin language config on code field
   ```

### Post-Implementation Validation

- [ ] File `tests/unit/blocks.spec.ts` exists
- [ ] All 7 tests pass
- [ ] No TypeScript errors in test file
- [ ] `pnpm lint` passes
- [ ] `pnpm test:unit` passes

### Commit Command

```bash
git add tests/unit/blocks.spec.ts
git commit -m "$(cat <<'EOF'
test(unit): add CodeBlock structure validation tests

Validate CodeBlock definition:
- Correct slug and interfaceName
- Language field with 10 options
- Code field with proper config
- Labels and default values

Story: 2.3 Phase 1 Commit 3/3

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Phase Completion Checklist

### Files Created

- [ ] `src/blocks/CodeBlock.ts` - CodeBlock definition
- [ ] `src/blocks/index.ts` - Barrel export
- [ ] `tests/unit/blocks.spec.ts` - Unit tests

### Quality Gates

- [ ] `pnpm lint` passes
- [ ] `pnpm test:unit` passes
- [ ] `pnpm build` passes
- [ ] No TypeScript errors

### Git Status

- [ ] All 3 commits created with proper messages
- [ ] All commits follow gitmoji convention
- [ ] No uncommitted changes

### Documentation

- [ ] EPIC_TRACKING.md updated (Phase 1 marked complete)
- [ ] No TODO comments left in code

---

## Troubleshooting

### Issue: Import `@/blocks` not working

**Solution**: Verify `tsconfig.json` has path alias:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: TypeScript error on `Block` type

**Solution**: Check Payload version and import:

```typescript
// Correct import
import type { Block } from 'payload'

// NOT from richtext-lexical
// import type { Block } from '@payloadcms/richtext-lexical' // WRONG
```

### Issue: Test fails on options length

**Solution**: Verify all 10 languages are in the options array:

```typescript
options: [
  { label: 'TypeScript', value: 'typescript' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'Bash', value: 'bash' },
  { label: 'JSON', value: 'json' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'SQL', value: 'sql' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
]
```

---

## Next Steps After Phase 1

1. **Phase 2**: Configure Lexical Editor with BlocksFeature
2. **Update EPIC_TRACKING.md**: Mark Phase 1 as completed
3. **Generate Phase 2 docs**: `/generate-phase-doc Epic 2 Story 2.3 Phase 2`
