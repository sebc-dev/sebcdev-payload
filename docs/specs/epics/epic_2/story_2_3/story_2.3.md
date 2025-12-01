# Story 2.3: Éditeur Lexical & Seed Data

## Story Overview

| Attribute    | Value                                         |
| ------------ | --------------------------------------------- |
| **Epic**     | Epic 2 - Content Management System (CMS) Core |
| **Story ID** | 2.3                                           |
| **Title**    | Éditeur Lexical & Seed Data                   |
| **Status**   | PLANNING                                      |
| **Created**  | 2025-12-01                                    |

## User Story

**En tant qu'** Auteur,
**Je veux** disposer d'un éditeur Lexical configuré avec les blocs "Code", "Citation" et "Image", et exécuter un script de seed pour créer les 9 catégories canoniques,
**Afin de** commencer à rédiger du contenu structuré immédiatement.

## Context

Cette story finalise la configuration du CMS en enrichissant l'éditeur Lexical avec les fonctionnalités nécessaires pour un blog technique (blocs de code avec syntax highlighting, citations, images inline) et en initialisant les données de référence (9 catégories canoniques) via un script de seed.

### Current State

- Payload CMS 3.0 déployé sur Cloudflare Workers
- Collections existantes: `Users`, `Media`, `Categories`, `Tags`, `Articles`
- Configuration i18n activée (FR/EN)
- Éditeur Lexical configuré avec les fonctionnalités par défaut (`lexicalEditor()`)
- Pas de script de seed pour les catégories
- Pas de configuration avancée de l'éditeur (blocs Code, Citation, Upload)

### Target State

- Éditeur Lexical enrichi avec:
  - **BlockQuoteFeature**: Citations stylisées
  - **UploadFeature**: Images inline avec relation Media
  - **BlocksFeature**: Blocs de code avec syntax highlighting
- Script de seed créant les 9 catégories canoniques avec:
  - Noms FR/EN localisés
  - Couleurs HEX distinctes
  - Icônes Lucide assignées
- Commande npm pour exécuter le seed
- Tests validant la configuration

## Requirements from PRD

### Functional Requirements

**EF1 - Gestion de Contenu (Auteur Unique)**

- CA3: Un script de "seed" initialise la base de données avec les 9 catégories canoniques (Actualités, Tutoriel, Rétrospective, etc.) définies dans la stratégie de contenu.

**EF2 - Expérience d'Édition Riche & Structurée**

- CA1: L'éditeur supporte le texte riche, les blocs de code, les citations et les uploads d'images.
- CA2: Le système génère automatiquement une Table des Matières (TOC) basée sur la hiérarchie des titres (h2, h3) du JSON Lexical.

**EF7 - Identité Visuelle Dynamique**

- CA1: La collection "Catégories" inclut des champs de configuration visuelle (Sélecteur de couleur HEX, Icône).

### Non-Functional Requirements

**ENF3 - Intégrité des Données**

- CA3: Le schéma Payload est la "Single Source of Truth"; les modifications de schéma SQL se font exclusivement via les migrations générées par Payload.

## Acceptance Criteria

### AC1: Configuration Lexical Editor

- [ ] Éditeur configuré avec `BlockQuoteFeature` pour les citations
- [ ] Éditeur configuré avec `UploadFeature` pour les images inline (relation Media)
- [ ] Éditeur configuré avec `BlocksFeature` pour les blocs de code
- [ ] Blocs de code supportent la sélection de langage (JavaScript, TypeScript, Python, etc.)
- [ ] Configuration appliquée globalement dans `payload.config.ts`

### AC2: Blocs de Code

- [ ] Bloc "Code" disponible dans l'éditeur Lexical
- [ ] Champ `language` pour sélectionner le langage de programmation
- [ ] Champ `code` pour le contenu du code
- [ ] Support des langages: JavaScript, TypeScript, Python, Bash, JSON, HTML, CSS, SQL, Go, Rust
- [ ] Preview du bloc dans l'admin

### AC3: Script de Seed Categories

- [ ] Script créant les 9 catégories canoniques
- [ ] Noms localisés FR/EN pour chaque catégorie
- [ ] Couleurs HEX distinctes assignées
- [ ] Icônes Lucide assignées (depuis la liste validée)
- [ ] Script idempotent (ne crée pas de doublons)
- [ ] Commande `pnpm db:seed` disponible

### AC4: Catégories Canoniques (9)

Les 9 catégories à créer avec leurs métadonnées:

| Slug          | FR                   | EN                | Couleur   | Icône             |
| ------------- | -------------------- | ----------------- | --------- | ----------------- |
| actualites    | Actualités           | News              | `#3B82F6` | newspaper         |
| tutoriel      | Tutoriel             | Tutorial          | `#06B6D4` | graduation-cap    |
| retrospective | Rétrospective        | Retrospective     | `#F59E0B` | history           |
| guide         | Guide                | Guide             | `#10B981` | book-open         |
| analyse       | Analyse              | Analysis          | `#6366F1` | microscope        |
| opinion       | Opinion              | Opinion           | `#EC4899` | message-circle    |
| ressources    | Ressources           | Resources         | `#8B5CF6` | library           |
| projet        | Projet               | Project           | `#F97316` | folder-kanban     |
| veille        | Veille Technologique | Technology Watch  | `#14B8A6` | radar             |

### AC5: Tests

- [ ] Test unitaire validant la configuration Lexical
- [ ] Test d'intégration validant le script de seed
- [ ] Test E2E validant la création d'article avec blocs Code/Citation/Image

### AC6: Types TypeScript

- [ ] `pnpm generate:types:payload` exécuté sans erreur
- [ ] Types générés incluent les blocs Lexical personnalisés
- [ ] Types incluent les options de langage pour CodeBlock

## Technical Specifications

### Lexical Editor Configuration

```typescript
// payload.config.ts
import {
  lexicalEditor,
  BlockQuoteFeature,
  UploadFeature,
  BlocksFeature,
  HeadingFeature,
} from '@payloadcms/richtext-lexical'

export default buildConfig({
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      HeadingFeature({
        enabledHeadingSizes: ['h2', 'h3', 'h4'],
      }),
      BlockQuoteFeature(),
      UploadFeature({
        collections: {
          media: {
            fields: [
              {
                name: 'caption',
                type: 'text',
                localized: true,
              },
            ],
          },
        },
      }),
      BlocksFeature({
        blocks: [CodeBlock],
      }),
    ],
  }),
  // ...
})
```

### CodeBlock Definition

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
        language: 'typescript', // Default syntax highlighting
      },
    },
  ],
}
```

### Seed Script Structure

```typescript
// src/seed/categories.ts
import type { Payload } from 'payload'

export const CANONICAL_CATEGORIES = [
  {
    slug: 'actualites',
    name: { fr: 'Actualités', en: 'News' },
    description: { fr: 'Veille techno et tendances', en: 'Tech news and trends' },
    color: '#3B82F6',
    icon: 'newspaper',
  },
  // ... 8 autres catégories
]

export async function seedCategories(payload: Payload): Promise<void> {
  for (const category of CANONICAL_CATEGORIES) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: category.slug } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'categories',
        data: {
          slug: category.slug,
          name: category.name.fr, // Default locale
          description: category.description?.fr,
          color: category.color,
          icon: category.icon,
        },
        locale: 'fr',
      })

      // Update EN locale
      // ...
    }
  }
}
```

### Files to Create/Modify

| File                              | Action   | Description                              |
| --------------------------------- | -------- | ---------------------------------------- |
| `src/payload.config.ts`           | Modify   | Configure Lexical editor with features   |
| `src/blocks/CodeBlock.ts`         | Create   | CodeBlock definition for Lexical         |
| `src/blocks/index.ts`             | Create   | Blocks barrel export                     |
| `src/seed/categories.ts`          | Create   | Categories seed data and function        |
| `src/seed/index.ts`               | Create   | Seed orchestrator                        |
| `src/seed/run-seed.ts`            | Create   | Seed script entry point                  |
| `package.json`                    | Modify   | Add `db:seed` script                     |
| `src/payload-types.ts`            | Regen    | Updated types with CodeBlock             |
| `tests/unit/seed.spec.ts`         | Create   | Seed function unit tests                 |
| `tests/int/lexical.int.spec.ts`   | Create   | Lexical configuration integration tests  |
| `tests/e2e/editor.e2e.spec.ts`    | Create   | E2E tests for editor features            |

## Dependencies

### Prerequisites

- Story 2.1 completed (Collections Blog & i18n)
- Story 2.2 completed (R2 Validation - for UploadFeature)
- Categories collection exists with color/icon fields

### Blocks

- Epic 3 (Frontend) - will consume Lexical JSON for rendering
- Epic 4 (Article Reading Experience) - TOC generation from Lexical headings

## Risks & Mitigations

| Risk                                    | Impact | Probability | Mitigation                                        |
| --------------------------------------- | ------ | ----------- | ------------------------------------------------- |
| Lexical feature compatibility Workers   | High   | Low         | Test in preview environment before merge          |
| Seed script migration conflicts         | Medium | Medium      | Run seed after migrations, idempotent design      |
| CodeBlock syntax highlighting in admin  | Low    | Medium      | Use Payload's built-in code field                 |
| UploadFeature bundle size impact        | Medium | Low         | Monitor bundle size, lazy load if needed          |

## Testing Strategy

### Unit Tests

- Seed function with mocked Payload
- CodeBlock validation
- Category data structure validation

### Integration Tests

- Create article with CodeBlock
- Create article with BlockQuote
- Create article with inline image (UploadFeature)
- Seed script execution (idempotency)
- Lexical JSON structure validation

### E2E Tests

- Admin: Insert code block, select language, add code
- Admin: Insert blockquote with text
- Admin: Insert inline image from Media library
- Admin: Verify categories exist after seed
- Frontend (future): Render article with code blocks

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Lexical editor shows Code, Quote, Upload options
- [ ] 9 categories exist in database with correct metadata
- [ ] `pnpm db:seed` runs without errors
- [ ] Seed is idempotent (can run multiple times safely)
- [ ] Types generated and synchronized
- [ ] Integration tests passing
- [ ] No TypeScript errors
- [ ] Code reviewed
- [ ] Bundle size validated (< 2 Mo Worker limit)

## References

- [Payload CMS Lexical Editor](https://payloadcms.com/docs/rich-text/lexical)
- [Payload Official Features](https://payloadcms.com/docs/rich-text/official-features)
- [Payload BlocksFeature](https://payloadcms.com/docs/rich-text/custom-features)
- [PRD.md - EF1, EF2, EF7](../../PRD.md)
- [UX_UI_Spec.md - Catégories Canoniques](../../UX_UI_Spec.md)
- [Story 2.1 - Categories Collection](../story_2_1/story_2.1.md)
