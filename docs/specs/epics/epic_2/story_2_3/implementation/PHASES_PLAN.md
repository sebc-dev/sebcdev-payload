# Story 2.3: Éditeur Lexical & Seed Data

## PHASES PLAN - Strategic Implementation Overview

**Story Reference**: Epic 2 - Story 2.3
**Created**: 2025-12-01
**Total Phases**: 4
**Estimated Duration**: 5-7 days
**Estimated Commits**: 12-16

---

## Executive Summary

Cette story finalise le CMS en configurant l'éditeur Lexical avec les fonctionnalités avancées (Code blocks, Citations, Images inline) et en initialisant les 9 catégories canoniques via un script de seed. L'implémentation est décomposée en 4 phases progressives, chacune livrant une fonctionnalité testable indépendamment.

### Phase Overview

| Phase | Title                              | Duration | Commits | Risk   | Dependencies |
| ----- | ---------------------------------- | -------- | ------- | ------ | ------------ |
| 1     | CodeBlock Definition               | 1-2 days | 3-4     | Low    | None         |
| 2     | Lexical Editor Configuration       | 1-2 days | 3-4     | Medium | Phase 1      |
| 3     | Categories Seed Script             | 1-2 days | 3-4     | Low    | None         |
| 4     | Integration Tests & Validation     | 1-2 days | 3-4     | Medium | All phases   |

### Critical Path

```
Phase 1 (CodeBlock)
    │
    v
Phase 2 (Lexical Config) ──────────────────────────┐
                                                   │
Phase 3 (Seed Script) ─────────────────────────────> Phase 4 (Integration)
```

**Note**: Phase 1 et Phase 3 peuvent être exécutées en parallèle car elles sont indépendantes.

---

## Phase 1: CodeBlock Definition

### Objective

Créer la définition du bloc de code personnalisé pour l'éditeur Lexical, avec support de la sélection de langage de programmation.

### Scope

- Définition du block `CodeBlock` avec champs language et code
- Support des langages: TypeScript, JavaScript, Python, Bash, JSON, HTML, CSS, SQL, Go, Rust
- Barrel export pour les blocks
- Tests unitaires de validation

### Deliverables

1. `src/blocks/CodeBlock.ts` - Définition du bloc
2. `src/blocks/index.ts` - Barrel export
3. Tests unitaires pour la structure du bloc

### Files Affected

| File                          | Action | Description                         |
| ----------------------------- | ------ | ----------------------------------- |
| `src/blocks/CodeBlock.ts`     | Create | CodeBlock definition                |
| `src/blocks/index.ts`         | Create | Blocks barrel export                |
| `tests/unit/blocks.spec.ts`   | Create | Block structure validation tests    |

### Technical Details

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

### Success Criteria

- [ ] CodeBlock définition créée avec tous les champs requis
- [ ] 10 langages de programmation supportés
- [ ] Barrel export fonctionnel
- [ ] Tests unitaires passent
- [ ] Pas d'erreurs TypeScript

### Estimated Commits

1. `feat(blocks): create CodeBlock definition with language selection`
2. `feat(blocks): create blocks barrel export`
3. `test(unit): add CodeBlock structure validation tests`

### Risk Assessment

| Risk                    | Impact | Probability | Mitigation                      |
| ----------------------- | ------ | ----------- | ------------------------------- |
| Type incompatibility    | Low    | Low         | Follow Payload Block type       |
| Missing language option | Low    | Low         | Start with essential languages  |

### Duration

**Estimated**: 1-2 days
**Complexity**: Low

---

## Phase 2: Lexical Editor Configuration

### Objective

Configurer l'éditeur Lexical global avec les features avancées: BlockQuoteFeature, UploadFeature, et BlocksFeature (avec CodeBlock).

### Scope

- Configuration `lexicalEditor()` dans `payload.config.ts`
- Activation de `BlockQuoteFeature` pour les citations
- Activation de `UploadFeature` avec champ caption localisé
- Activation de `BlocksFeature` avec CodeBlock
- Configuration de `HeadingFeature` pour TOC (h2, h3, h4)
- Régénération des types TypeScript

### Deliverables

1. Configuration Lexical mise à jour dans `payload.config.ts`
2. Types TypeScript régénérés
3. Vérification dans l'admin UI

### Files Affected

| File                    | Action     | Description                              |
| ----------------------- | ---------- | ---------------------------------------- |
| `src/payload.config.ts` | Modify     | Configure Lexical editor with features   |
| `src/payload-types.ts`  | Regenerate | Updated types with Lexical blocks        |

### Technical Details

```typescript
// src/payload.config.ts
import {
  lexicalEditor,
  BlockQuoteFeature,
  UploadFeature,
  BlocksFeature,
  HeadingFeature,
} from '@payloadcms/richtext-lexical'
import { CodeBlock } from './blocks'

export default buildConfig({
  // ...existing config
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
                admin: {
                  description: 'Image caption (localized)',
                },
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
  // ...rest of config
})
```

### Success Criteria

- [ ] Lexical editor configuré avec toutes les features
- [ ] BlockQuoteFeature visible dans l'éditeur (bouton citation)
- [ ] UploadFeature permet d'insérer des images avec caption
- [ ] BlocksFeature affiche CodeBlock dans le menu
- [ ] HeadingFeature limité à h2, h3, h4
- [ ] Types régénérés incluent CodeBlock
- [ ] Pas d'erreurs runtime dans l'admin

### Estimated Commits

1. `feat(editor): configure Lexical with BlockQuoteFeature`
2. `feat(editor): add UploadFeature with caption field`
3. `feat(editor): add BlocksFeature with CodeBlock`
4. `chore(types): regenerate Payload types with Lexical blocks`

### Risk Assessment

| Risk                             | Impact | Probability | Mitigation                            |
| -------------------------------- | ------ | ----------- | ------------------------------------- |
| Feature import errors            | Medium | Medium      | Check @payloadcms/richtext-lexical    |
| Bundle size increase             | Medium | Low         | Monitor with `pnpm build`             |
| Workers compatibility            | High   | Low         | Test in preview before merge          |

### Dependencies

- Phase 1 (CodeBlock definition)

### Duration

**Estimated**: 1-2 days
**Complexity**: Medium

---

## Phase 3: Categories Seed Script

### Objective

Créer un script de seed idempotent pour initialiser les 9 catégories canoniques avec leurs métadonnées localisées (FR/EN), couleurs et icônes.

### Scope

- Définition des 9 catégories canoniques avec métadonnées
- Script de seed idempotent (vérifie existence avant création)
- Support des locales FR/EN
- Commande npm `pnpm db:seed`
- Tests unitaires du script

### Deliverables

1. `src/seed/categories.ts` - Données et fonction de seed
2. `src/seed/index.ts` - Orchestrateur de seed
3. `src/seed/run-seed.ts` - Point d'entrée script
4. Commande `pnpm db:seed` dans package.json
5. Tests unitaires

### Files Affected

| File                           | Action | Description                       |
| ------------------------------ | ------ | --------------------------------- |
| `src/seed/categories.ts`       | Create | Categories data and seed function |
| `src/seed/index.ts`            | Create | Seed orchestrator                 |
| `src/seed/run-seed.ts`         | Create | Script entry point                |
| `package.json`                 | Modify | Add db:seed script                |
| `tests/unit/seed.spec.ts`      | Create | Seed function unit tests          |

### Technical Details

**Catégories Canoniques (9)**:

```typescript
// src/seed/categories.ts
export const CANONICAL_CATEGORIES = [
  {
    slug: 'actualites',
    name: { fr: 'Actualités', en: 'News' },
    description: {
      fr: 'Veille technologique et tendances du secteur',
      en: 'Technology news and industry trends',
    },
    color: '#3B82F6', // Blue
    icon: 'newspaper',
  },
  {
    slug: 'tutoriel',
    name: { fr: 'Tutoriel', en: 'Tutorial' },
    description: {
      fr: 'Guides pratiques pas-à-pas',
      en: 'Step-by-step practical guides',
    },
    color: '#06B6D4', // Cyan
    icon: 'graduation-cap',
  },
  {
    slug: 'retrospective',
    name: { fr: 'Rétrospective', en: 'Retrospective' },
    description: {
      fr: 'Retours d\'expérience et analyses post-projet',
      en: 'Experience feedback and post-project analysis',
    },
    color: '#F59E0B', // Amber
    icon: 'history',
  },
  {
    slug: 'guide',
    name: { fr: 'Guide', en: 'Guide' },
    description: {
      fr: 'Guides de référence et bonnes pratiques',
      en: 'Reference guides and best practices',
    },
    color: '#10B981', // Emerald
    icon: 'book-open',
  },
  {
    slug: 'analyse',
    name: { fr: 'Analyse', en: 'Analysis' },
    description: {
      fr: 'Analyses approfondies et études techniques',
      en: 'In-depth analysis and technical studies',
    },
    color: '#6366F1', // Indigo
    icon: 'microscope',
  },
  {
    slug: 'opinion',
    name: { fr: 'Opinion', en: 'Opinion' },
    description: {
      fr: 'Points de vue et réflexions personnelles',
      en: 'Perspectives and personal reflections',
    },
    color: '#EC4899', // Pink
    icon: 'message-circle',
  },
  {
    slug: 'ressources',
    name: { fr: 'Ressources', en: 'Resources' },
    description: {
      fr: 'Outils, bibliothèques et références utiles',
      en: 'Useful tools, libraries and references',
    },
    color: '#8B5CF6', // Violet
    icon: 'library',
  },
  {
    slug: 'projet',
    name: { fr: 'Projet', en: 'Project' },
    description: {
      fr: 'Présentations de projets et side projects',
      en: 'Project showcases and side projects',
    },
    color: '#F97316', // Orange
    icon: 'folder-kanban',
  },
  {
    slug: 'veille',
    name: { fr: 'Veille Technologique', en: 'Technology Watch' },
    description: {
      fr: 'Surveillance des innovations et nouvelles technologies',
      en: 'Monitoring innovations and new technologies',
    },
    color: '#14B8A6', // Teal (accent principal)
    icon: 'radar',
  },
] as const
```

**Script de Seed**:

```typescript
// src/seed/categories.ts
import type { Payload } from 'payload'

export async function seedCategories(payload: Payload): Promise<{
  created: number
  skipped: number
}> {
  let created = 0
  let skipped = 0

  for (const category of CANONICAL_CATEGORIES) {
    // Check if category already exists
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: category.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`⏭️  Category "${category.slug}" already exists, skipping`)
      skipped++
      continue
    }

    // Create category with FR locale (default)
    const created = await payload.create({
      collection: 'categories',
      data: {
        slug: category.slug,
        name: category.name.fr,
        description: category.description.fr,
        color: category.color,
        icon: category.icon,
      },
      locale: 'fr',
    })

    // Update EN locale
    await payload.update({
      collection: 'categories',
      id: created.id,
      data: {
        name: category.name.en,
        description: category.description.en,
      },
      locale: 'en',
    })

    console.log(`✅ Created category "${category.slug}"`)
    created++
  }

  return { created, skipped }
}
```

**Package.json Script**:

```json
{
  "scripts": {
    "db:seed": "tsx src/seed/run-seed.ts"
  }
}
```

### Success Criteria

- [ ] 9 catégories définies avec métadonnées complètes
- [ ] Script de seed idempotent (ne crée pas de doublons)
- [ ] Locales FR et EN correctement définies
- [ ] Couleurs HEX valides
- [ ] Icônes Lucide valides (depuis la liste existante)
- [ ] Commande `pnpm db:seed` fonctionne
- [ ] Tests unitaires passent

### Estimated Commits

1. `feat(seed): create categories seed data with FR/EN locales`
2. `feat(seed): implement idempotent seed function`
3. `feat(seed): add run-seed script and npm command`
4. `test(unit): add seed function unit tests`

### Risk Assessment

| Risk                     | Impact | Probability | Mitigation                          |
| ------------------------ | ------ | ----------- | ----------------------------------- |
| Duplicate categories     | Medium | Low         | Idempotent design (check existence) |
| Invalid icon names       | Low    | Low         | Use validated Lucide icon list      |
| Locale update failures   | Medium | Low         | Transaction or sequential updates   |

### Dependencies

- Story 2.1 Phase 2 (Categories collection exists)

### Duration

**Estimated**: 1-2 days
**Complexity**: Low

---

## Phase 4: Integration Tests & Validation

### Objective

Valider l'intégration complète de l'éditeur Lexical et du script de seed avec des tests d'intégration et E2E.

### Scope

- Tests d'intégration pour la configuration Lexical
- Tests d'intégration pour le script de seed
- Tests E2E pour l'utilisation des blocs dans l'admin
- Validation manuelle documentée
- Quality gate validation

### Deliverables

1. Tests d'intégration Lexical
2. Tests d'intégration seed
3. Tests E2E éditeur
4. Rapport de validation

### Files Affected

| File                                  | Action | Description                       |
| ------------------------------------- | ------ | --------------------------------- |
| `tests/int/lexical.int.spec.ts`       | Create | Lexical integration tests         |
| `tests/int/seed.int.spec.ts`          | Create | Seed script integration tests     |
| `tests/e2e/editor.e2e.spec.ts`        | Create | E2E tests for editor features     |

### Test Scenarios

**Integration Tests - Lexical**:

```typescript
// tests/int/lexical.int.spec.ts
describe('Lexical Editor Configuration', () => {
  it('should create article with CodeBlock')
  it('should create article with BlockQuote')
  it('should create article with inline image (UploadFeature)')
  it('should extract headings for TOC generation')
  it('should support multiple CodeBlocks in single article')
})
```

**Integration Tests - Seed**:

```typescript
// tests/int/seed.int.spec.ts
describe('Categories Seed', () => {
  it('should create all 9 canonical categories')
  it('should be idempotent (no duplicates on re-run)')
  it('should have correct FR locale values')
  it('should have correct EN locale values')
  it('should have valid colors and icons')
})
```

**E2E Tests**:

```typescript
// tests/e2e/editor.e2e.spec.ts
describe('Lexical Editor E2E', () => {
  it('should insert code block with language selection')
  it('should insert blockquote')
  it('should insert image from media library')
  it('should save article with mixed content')
})
```

### Success Criteria

- [ ] Tous les tests d'intégration passent
- [ ] Tous les tests E2E passent
- [ ] `pnpm lint` passe
- [ ] `pnpm build` réussit
- [ ] `pnpm test` passe
- [ ] Bundle size < 2 Mo (Worker limit)
- [ ] Validation manuelle complète
- [ ] Documentation mise à jour

### Estimated Commits

1. `test(int): add Lexical editor integration tests`
2. `test(int): add seed script integration tests`
3. `test(e2e): add editor features E2E tests`
4. `docs: add validation report for Story 2.3`

### Risk Assessment

| Risk                  | Impact | Probability | Mitigation                 |
| --------------------- | ------ | ----------- | -------------------------- |
| E2E test flakiness    | Medium | Medium      | Retry logic, stable waits  |
| Integration issues    | High   | Low         | Thorough testing           |
| Bundle size exceeded  | High   | Low         | Monitor during build       |

### Dependencies

- All previous phases (1-3)

### Duration

**Estimated**: 1-2 days
**Complexity**: Medium

---

## Implementation Order & Dependencies

### Dependency Graph

```
                    ┌──────────────────────────────────────┐
                    │                                      │
                    v                                      │
┌─────────────┐   ┌─────────────────────┐                 │
│  Phase 1    │──>│     Phase 2         │                 │
│  CodeBlock  │   │  Lexical Config     │─────────────────┤
│  (1-2 days) │   │    (1-2 days)       │                 │
└─────────────┘   └─────────────────────┘                 │
                                                          │
┌─────────────────────┐                    ┌──────────────┴───────┐
│     Phase 3         │                    │      Phase 4         │
│   Seed Script       │───────────────────>│   Integration        │
│    (1-2 days)       │                    │    (1-2 days)        │
└─────────────────────┘                    └──────────────────────┘
```

### Recommended Sequence

1. **Phase 1 & 3** (CodeBlock + Seed) - Peuvent être parallélisées
2. **Phase 2** (Lexical Config) - Requiert Phase 1
3. **Phase 4** (Integration) - Final validation

### Parallelization Opportunities

- **Phase 1** (CodeBlock) et **Phase 3** (Seed Script) sont indépendantes et peuvent être développées en parallèle
- Tests d'intégration peuvent être écrits incrémentalement pendant chaque phase

---

## Timeline & Resource Estimation

### Timeline

```
Day 1-2:
├── Phase 1: CodeBlock Definition
└── Phase 3: Seed Script (parallel)

Day 3-4:
├── Phase 2: Lexical Editor Configuration
└── Phase 3: Complete if not finished

Day 5-6:
├── Phase 4: Integration Tests
└── Phase 4: E2E Tests & Validation
```

### Resource Summary

| Resource      | Allocation |
| ------------- | ---------- |
| Developer     | 1 FTE      |
| Duration      | 5-7 days   |
| Total Commits | 12-16      |

### Effort Distribution

| Phase                        | Effort % | Days |
| ---------------------------- | -------- | ---- |
| Phase 1 - CodeBlock          | 20%      | 1-2  |
| Phase 2 - Lexical Config     | 30%      | 1-2  |
| Phase 3 - Seed Script        | 25%      | 1-2  |
| Phase 4 - Integration        | 25%      | 1-2  |

---

## Risk Assessment

### Overall Risk Profile

| Category  | Level  | Notes                                   |
| --------- | ------ | --------------------------------------- |
| Technical | Medium | Lexical features, Workers compatibility |
| Schedule  | Low    | Well-defined scope, parallelizable      |
| Quality   | Low    | Strong testing strategy                 |

### Top Risks

1. **Lexical Feature Compatibility** (Medium)
   - Features may not work on Cloudflare Workers
   - Mitigation: Test in preview environment before merge

2. **Bundle Size Impact** (Medium)
   - BlocksFeature adds code to bundle
   - Mitigation: Monitor with `pnpm build`, lazy load if needed

3. **Seed Script Failures** (Low)
   - Database state inconsistencies
   - Mitigation: Idempotent design, transaction wrapping

### Risk Mitigation Strategy

- Test all features in Cloudflare preview environment
- Monitor bundle size after each phase
- Use idempotent patterns for seed scripts
- Comprehensive test coverage

---

## Testing Strategy

### Test Pyramid

```
           /\
          /  \     E2E Tests (Phase 4)
         /    \    - Admin UI editor features
        /──────\   - Full workflow tests
       /        \
      /          \  Integration Tests (Each Phase)
     /            \ - Lexical JSON creation
    /──────────────\ - Seed script execution
   /                \ - Collection CRUD with blocks
  /                  \
 /                    \ Unit Tests (Phase 1, 3)
/______________________\ - CodeBlock structure
                         - Seed data validation
```

### Test Categories

**Unit Tests**:
- CodeBlock definition validation
- Seed data structure
- Language options completeness

**Integration Tests**:
- Create article with CodeBlock
- Create article with BlockQuote
- Create article with UploadFeature
- Seed execution and idempotency
- Locale handling in seed

**E2E Tests**:
- Insert code block via admin UI
- Insert blockquote via admin UI
- Insert image via admin UI
- Verify categories after seed

### Coverage Goals

| Category          | Target                            |
| ----------------- | --------------------------------- |
| Unit Tests        | 100% of blocks and seed data      |
| Integration Tests | All Lexical features + seed       |
| E2E Tests         | Core editor workflows             |

---

## Phase Documentation Strategy

### Document Generation

For each phase, generate detailed documentation using `/generate-phase-doc`:

```bash
/generate-phase-doc Epic 2 Story 2.3 Phase 1
/generate-phase-doc Epic 2 Story 2.3 Phase 2
/generate-phase-doc Epic 2 Story 2.3 Phase 3
/generate-phase-doc Epic 2 Story 2.3 Phase 4
```

### Generated Documents (per phase)

```
phase_X/
├── INDEX.md                    # Phase overview
├── IMPLEMENTATION_PLAN.md      # Atomic commit details
├── COMMIT_CHECKLIST.md         # Step-by-step checklist
├── ENVIRONMENT_SETUP.md        # Prerequisites
├── guides/
│   ├── REVIEW.md               # Code review guide
│   └── TESTING.md              # Testing instructions
└── validation/
    └── VALIDATION_CHECKLIST.md # Completion criteria
```

---

## Next Steps

### Immediate Actions

1. **Generate Phase 1 Documentation**

   ```bash
   /generate-phase-doc Epic 2 Story 2.3 Phase 1
   ```

2. **Review and Validate Plan**
   - Confirm phase breakdown
   - Adjust estimates if needed
   - Identify any missing requirements

3. **Start Implementation**
   - Follow Phase 1 commit checklist
   - Update EPIC_TRACKING.md as phases complete

### Progress Tracking

Update `EPIC_TRACKING.md` as each phase completes:

```markdown
| Story | Title                       | Status      | Phases | Progress |
| ----- | --------------------------- | ----------- | ------ | -------- |
| 2.3   | Éditeur Lexical & Seed Data | IN PROGRESS | 4      | X/4      |
```

---

## References

- [Story Specification](../story_2.3.md)
- [Epic Tracking](../../EPIC_TRACKING.md)
- [PRD](../../../../PRD.md)
- [Payload Lexical Editor](https://payloadcms.com/docs/rich-text/lexical)
- [Payload Official Features](https://payloadcms.com/docs/rich-text/official-features)
- [Payload BlocksFeature](https://payloadcms.com/docs/rich-text/custom-features)
- [UX_UI_Spec - Categories](../../../../UX_UI_Spec.md)

---

**Plan Status**: READY FOR IMPLEMENTATION
**Next Action**: Generate Phase 1 documentation with `/generate-phase-doc Epic 2 Story 2.3 Phase 1`
