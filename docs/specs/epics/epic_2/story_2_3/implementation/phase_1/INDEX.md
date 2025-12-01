# Phase 1 : CodeBlock Definition

## Navigation Hub

| Document                                                            | Description                                    |
| ------------------------------------------------------------------- | ---------------------------------------------- |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)                  | Strategie commits atomiques et ordre execution |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md)                        | Checklist detaillee par commit                 |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)                      | Configuration environnement de developpement   |
| [guides/REVIEW.md](./guides/REVIEW.md)                              | Guide de revue de code commit par commit       |
| [guides/TESTING.md](./guides/TESTING.md)                            | Strategie de tests et validation               |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Checklist finale de validation          |

---

## Phase Overview

| Field              | Value                                         |
| ------------------ | --------------------------------------------- |
| **Phase**          | 1 of 4                                        |
| **Story**          | 2.3 - Editeur Lexical & Seed Data             |
| **Epic**           | Epic 2 - Content Management System (CMS) Core |
| **Status**         | READY FOR IMPLEMENTATION                      |
| **Estimated Time** | 1-2 days                                      |
| **Commits**        | 3 atomic commits                              |
| **Risk Level**     | Low                                           |

---

## Objective

Creer la definition du bloc de code personnalise pour l'editeur Lexical, avec support de la selection de langage de programmation. Ce bloc sera utilise dans Phase 2 avec `BlocksFeature`.

### Goals

1. Definir le block `CodeBlock` avec champs `language` et `code`
2. Supporter 10 langages de programmation (TypeScript, JavaScript, Python, etc.)
3. Creer un barrel export pour les blocks
4. Ecrire des tests unitaires validant la structure du bloc

### Non-Goals (Out of Scope)

- Configuration de l'editeur Lexical (Phase 2)
- Integration dans `payload.config.ts` (Phase 2)
- Script de seed categories (Phase 3)
- Tests E2E (Phase 4)
- Rendu frontend du code avec syntax highlighting (Epic 3)

---

## Key Deliverables

| Deliverable                           | Status  | Commit |
| ------------------------------------- | ------- | ------ |
| Definition CodeBlock avec 10 langages | Pending | #1     |
| Barrel export `src/blocks/index.ts`   | Pending | #2     |
| Tests unitaires structure bloc        | Pending | #3     |

---

## Files Affected

| File                        | Action | Changes                            |
| --------------------------- | ------ | ---------------------------------- |
| `src/blocks/CodeBlock.ts`   | Create | Definition du bloc code            |
| `src/blocks/index.ts`       | Create | Barrel export pour les blocks      |
| `tests/unit/blocks.spec.ts` | Create | Tests unitaires structure du bloc  |

---

## Dependencies

### Prerequisites

| Dependency                    | Status    | Notes                                      |
| ----------------------------- | --------- | ------------------------------------------ |
| Payload CMS 3.0               | INSTALLED | Version avec support Lexical natif         |
| @payloadcms/richtext-lexical  | INSTALLED | Package richtext Lexical                   |
| Vitest                        | INSTALLED | Framework de test                          |

### Blockers

Aucun bloqueur identifie. Cette phase est independante et peut demarrer immediatement.

---

## Technical Context

### Payload Block Type

Un `Block` dans Payload est une structure reutilisable avec des champs definis. Pour Lexical, les blocks sont utilises avec `BlocksFeature` pour ajouter du contenu structure dans l'editeur rich text.

```typescript
import type { Block } from 'payload'

const ExampleBlock: Block = {
  slug: 'example',           // Identifiant unique
  interfaceName: 'Example',  // Nom de l'interface TypeScript generee
  labels: {
    singular: 'Example',
    plural: 'Examples',
  },
  fields: [
    // Champs du bloc
  ],
}
```

### Target State After Phase 1

```typescript
// src/blocks/CodeBlock.ts
import type { Block } from 'payload'

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

### Langages Supportes

| Langage    | Value        | Use Case                           |
| ---------- | ------------ | ---------------------------------- |
| TypeScript | `typescript` | Code TypeScript/React              |
| JavaScript | `javascript` | Code JS vanilla                    |
| Python     | `python`     | Scripts, data science              |
| Bash       | `bash`       | Commands shell, scripts            |
| JSON       | `json`       | Configuration, API responses       |
| HTML       | `html`       | Markup, templates                  |
| CSS        | `css`        | Styles, exemples design            |
| SQL        | `sql`        | Queries base de donnees            |
| Go         | `go`         | Code Go/Golang                     |
| Rust       | `rust`       | Code Rust                          |

---

## Success Criteria

### Must Have

- [ ] CodeBlock definition creee avec tous les champs requis
- [ ] 10 langages de programmation supportes
- [ ] Barrel export fonctionnel (`src/blocks/index.ts`)
- [ ] Tests unitaires passent

### Quality Gates

- [ ] `pnpm lint` passe sans erreur
- [ ] `pnpm build` passe sans erreur
- [ ] Pas d'erreurs TypeScript dans l'IDE
- [ ] Structure du bloc validee par tests unitaires

---

## Risk Assessment

| Risk                    | Probability | Impact | Mitigation                      |
| ----------------------- | ----------- | ------ | ------------------------------- |
| Type incompatibility    | Low         | Low    | Follow Payload Block type       |
| Missing language option | Low         | Low    | Start with essential languages  |
| Import path issues      | Low         | Low    | Use relative imports            |

---

## Quick Reference

### Commands

```bash
# Linting
pnpm lint

# Build pour validation
pnpm build

# Tests unitaires
pnpm test:unit

# Generer les types (apres Phase 2)
pnpm generate:types:payload
```

### Key Files

- Block definition: `src/blocks/CodeBlock.ts`
- Barrel export: `src/blocks/index.ts`
- Tests: `tests/unit/blocks.spec.ts`
- Config (Phase 2): `src/payload.config.ts`

---

## Next Steps

1. Lire [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) pour comprendre la strategie de commits
2. Configurer l'environnement avec [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
3. Suivre la checklist [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) pour chaque commit
4. Valider avec [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)

---

## Related Documents

| Document                                      | Description                       |
| --------------------------------------------- | --------------------------------- |
| [Story 2.3 Specification](../../story_2.3.md) | User story et acceptance criteria |
| [PHASES_PLAN.md](../PHASES_PLAN.md)           | Plan global des 4 phases          |
| [EPIC_TRACKING.md](../../../EPIC_TRACKING.md) | Tracking Epic 2                   |
| [Phase 2 INDEX](../phase_2/INDEX.md)          | Lexical Editor Configuration      |

---

## References

- [Payload CMS Block Type](https://payloadcms.com/docs/fields/blocks)
- [Payload Lexical BlocksFeature](https://payloadcms.com/docs/rich-text/custom-features)
- [Payload Code Field](https://payloadcms.com/docs/fields/code)
