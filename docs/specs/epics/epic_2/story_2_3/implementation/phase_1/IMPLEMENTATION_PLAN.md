# Implementation Plan - Phase 1 : CodeBlock Definition

## Document Metadata

| Field              | Value                                |
| ------------------ | ------------------------------------ |
| **Phase**          | 1 - CodeBlock Definition             |
| **Story**          | 2.3 - Editeur Lexical & Seed Data    |
| **Epic**           | Epic 2 - CMS Core                    |
| **Total Commits**  | 3                                    |
| **Estimated Time** | 1-2 days                             |
| **Complexity**     | Low                                  |

---

## Atomic Commit Strategy

Cette phase utilise **3 commits atomiques** suivant le principe de responsabilite unique :

| Commit | Focus                                        | Size Est.  | Review Time |
| ------ | -------------------------------------------- | ---------- | ----------- |
| #1     | Create CodeBlock definition with languages   | ~60 lines  | 15 min      |
| #2     | Create blocks barrel export                  | ~10 lines  | 5 min       |
| #3     | Add CodeBlock structure validation tests     | ~80 lines  | 20 min      |

**Total**: ~150 lines | ~40 min review time

---

## Commit Order & Dependencies

```
Commit #1: CodeBlock Definition
    |
    | (Block defini avec tous les champs)
    v
Commit #2: Barrel Export
    |
    | (Export centralise)
    v
Commit #3: Unit Tests
    |
    | (Tests de validation structure)
    v
[PHASE 1 DONE]
```

### Parallelization

Aucune parallelisation possible - chaque commit depend du precedent.

---

## Commit #1 : Create CodeBlock Definition with Language Selection

### Objective

Creer la definition complete du bloc CodeBlock avec le champ `language` (select) et le champ `code` (code field).

### Rationale

- Le bloc `CodeBlock` est une unite reutilisable dans Payload
- Le champ `language` permet de selectionner le langage pour le syntax highlighting frontend
- Le champ `code` utilise le type `code` de Payload avec editeur Monaco

### Files to Create

| File                      | Changes                                    |
| ------------------------- | ------------------------------------------ |
| `src/blocks/CodeBlock.ts` | Definition complete du bloc avec 10 langages |

### Implementation Details

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

### Commit Message

```
feat(blocks): create CodeBlock definition with language selection

Add CodeBlock for Lexical editor with:
- language select field (10 programming languages)
- code field with Monaco editor
- TypeScript as default language

Supported languages: TypeScript, JavaScript, Python, Bash, JSON, HTML, CSS, SQL, Go, Rust

Story: 2.3 Phase 1 Commit 1/3
```

### Validation Checklist

- [ ] File `src/blocks/CodeBlock.ts` created
- [ ] Block slug is `code`
- [ ] interfaceName is `CodeBlock`
- [ ] Field `language` is select with 10 options
- [ ] Field `code` is type `code` with required: true
- [ ] TypeScript syntax valid (no red squiggles in IDE)
- [ ] JSDoc comment present

---

## Commit #2 : Create Blocks Barrel Export

### Objective

Creer un fichier barrel export pour centraliser les exports des blocks.

### Rationale

- Pattern standard pour organiser les exports
- Facilite les imports dans `payload.config.ts`
- Permet d'ajouter facilement d'autres blocks a l'avenir

### Files to Create

| File                  | Changes                              |
| --------------------- | ------------------------------------ |
| `src/blocks/index.ts` | Barrel export pour tous les blocks   |

### Implementation Details

```typescript
// src/blocks/index.ts
export { CodeBlock } from './CodeBlock'
```

### Commit Message

```
feat(blocks): create blocks barrel export

Add centralized export file for Payload blocks.
Follows project convention for module exports.

Story: 2.3 Phase 1 Commit 2/3
```

### Validation Checklist

- [ ] File `src/blocks/index.ts` created
- [ ] CodeBlock exported correctly
- [ ] Import works: `import { CodeBlock } from '@/blocks'`
- [ ] No TypeScript errors

---

## Commit #3 : Add CodeBlock Structure Validation Tests

### Objective

Ecrire des tests unitaires validant la structure du CodeBlock.

### Rationale

- Valider que le bloc a la bonne structure
- Verifier les 10 langages supportes
- Assurer la non-regression lors de modifications futures

### Files to Create

| File                        | Changes                              |
| --------------------------- | ------------------------------------ |
| `tests/unit/blocks.spec.ts` | Tests unitaires pour CodeBlock       |

### Implementation Details

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

### Commit Message

```
test(unit): add CodeBlock structure validation tests

Validate CodeBlock definition:
- Correct slug and interfaceName
- Language field with 10 options
- Code field with proper config
- Labels and default values

Story: 2.3 Phase 1 Commit 3/3
```

### Validation Checklist

- [ ] File `tests/unit/blocks.spec.ts` created
- [ ] All tests pass with `pnpm test:unit`
- [ ] Coverage includes CodeBlock structure
- [ ] No TypeScript errors in tests

---

## Implementation Sequence Summary

```
Day 1 (Morning):
|-- Commit #1: CodeBlock Definition (~45 min)
|   |-- Create src/blocks directory
|   |-- Create CodeBlock.ts with all fields
|   |-- Verify TypeScript syntax
|   +-- Local validation
|
+-- Commit #2: Barrel Export (~15 min)
    |-- Create index.ts
    |-- Export CodeBlock
    +-- Verify import path works

Day 1 (Afternoon):
+-- Commit #3: Unit Tests (~60 min)
    |-- Create blocks.spec.ts
    |-- Write structure validation tests
    |-- Run tests
    +-- Fix any issues

Total: ~2 hours implementation + testing
```

---

## Rollback Strategy

En cas de probleme, chaque commit peut etre annule individuellement :

```bash
# Voir les commits de la phase
git log --oneline -3

# Rollback du dernier commit uniquement
git revert HEAD

# Rollback complet de la phase (si necessaire)
git revert HEAD~2..HEAD
```

### Safe Rollback Points

| After Commit | State                    | Rollback Safe? |
| ------------ | ------------------------ | -------------- |
| #1           | CodeBlock created        | Yes            |
| #2           | Barrel export added      | Yes            |
| #3           | Tests added              | Yes            |

---

## Quality Gates per Commit

| Commit | Validation Command                | Expected Result      |
| ------ | --------------------------------- | -------------------- |
| #1     | TypeScript check in IDE           | No errors            |
| #2     | `pnpm lint`                       | No errors            |
| #3     | `pnpm test:unit`                  | All tests pass       |

---

## Next Phase Preview

**Phase 2 : Lexical Editor Configuration** utilisera le CodeBlock defini ici pour :

- Configurer `lexicalEditor()` avec `BlocksFeature`
- Ajouter `BlockquoteFeature` et `UploadFeature`
- Regenerer les types TypeScript

---

## References

| Document                                     | Purpose                           |
| -------------------------------------------- | --------------------------------- |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) | Checklist detaillee par commit    |
| [guides/TESTING.md](./guides/TESTING.md)     | Strategie de tests                |
| [Payload Block Docs](https://payloadcms.com/docs/fields/blocks) | Documentation blocks |
| [Payload Code Field](https://payloadcms.com/docs/fields/code)   | Documentation code field |
