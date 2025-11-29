# Phase 2: Categories & Tags Collections

## Navigation Hub

| Document                                                                   | Description                                   | Status    |
| -------------------------------------------------------------------------- | --------------------------------------------- | --------- |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)                         | Atomic commit strategy and detailed breakdown | Required  |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md)                               | Step-by-step implementation checklist         | Required  |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)                             | Prerequisites and environment configuration   | Required  |
| [guides/REVIEW.md](./guides/REVIEW.md)                                     | Code review guidelines                        | Reference |
| [guides/TESTING.md](./guides/TESTING.md)                                   | Testing strategy and instructions             | Reference |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Final validation checklist                    | Required  |

---

## Phase Overview

| Attribute        | Value                                                         |
| ---------------- | ------------------------------------------------------------- |
| **Phase**        | 2 of 5                                                        |
| **Title**        | Categories & Tags Collections                                 |
| **Story**        | Epic 2 - Story 2.1: Configuration des Collections Blog & i18n |
| **Duration**     | 2 days                                                        |
| **Commits**      | 4                                                             |
| **Risk Level**   | Low                                                           |
| **Dependencies** | Phase 1 (i18n Configuration)                                  |

---

## Objective

Creer les collections taxonomiques (Categories et Tags) avec support i18n pour permettre la classification du contenu. Ces collections serviront de base pour les relations dans la collection Articles (Phase 3).

---

## Scope

### In Scope

- Creation de la collection `Categories` avec champs localises et visuels
- Creation de la collection `Tags` avec champs localises
- Fichier barrel export `src/collections/index.ts`
- Enregistrement des nouvelles collections dans `payload.config.ts`
- Generation et application de la migration D1
- Regeneration des types TypeScript

### Out of Scope

- Collection Articles (Phase 3)
- Collection Pages (Phase 4)
- Seed des 9 categories canoniques (Story 2.3)
- Configuration de l'editeur Lexical (Story 2.3)

---

## Deliverables

| Deliverable      | File(s)                         | Description                                |
| ---------------- | ------------------------------- | ------------------------------------------ |
| Categories       | `src/collections/Categories.ts` | Collection Categories avec i18n            |
| Tags             | `src/collections/Tags.ts`       | Collection Tags avec i18n                  |
| Barrel Export    | `src/collections/index.ts`      | Export centralise des collections          |
| Config Update    | `src/payload.config.ts`         | Enregistrement des nouvelles collections   |
| Migration        | `src/migrations/*.ts`           | Schema D1 pour Categories et Tags          |
| TypeScript Types | `src/payload-types.ts`          | Types regeneres avec nouvelles collections |

---

## Files Affected

| File                            | Action     | Lines (est.) | Description                            |
| ------------------------------- | ---------- | ------------ | -------------------------------------- |
| `src/collections/Categories.ts` | Create     | ~45          | Category collection with i18n & visual |
| `src/collections/Tags.ts`       | Create     | ~25          | Tag collection with i18n               |
| `src/collections/index.ts`      | Create     | ~10          | Barrel export for collections          |
| `src/payload.config.ts`         | Modify     | +5           | Register new collections               |
| `src/migrations/*.ts`           | Generate   | ~150         | Database migration                     |
| `src/payload-types.ts`          | Regenerate | ~100         | Updated types                          |

**Total Estimated Changes**: ~335 lines

---

## Technical Approach

### Categories Collection Schema

```typescript
// src/collections/Categories.ts
import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Category', plural: 'Categories' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'color'],
    group: 'Content',
    listSearchableFields: ['name', 'slug', 'description'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      index: true, // Payload best practice: index for query performance
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'color',
      type: 'text',
      validate: (value) => {
        if (!value) return true
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value) || 'Invalid hex color'
      },
    },
    {
      name: 'icon',
      type: 'text',
    },
  ],
}
```

### Tags Collection Schema

```typescript
// src/collections/Tags.ts
import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: { singular: 'Tag', plural: 'Tags' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: 'Content',
    listSearchableFields: ['name', 'slug'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      index: true, // Payload best practice: index for query performance
    },
  ],
}
```

### Key Decisions

1. **Localized Names**: Les noms de categories et tags sont traduits pour l'affichage frontend
2. **Non-localized Slugs**: Les slugs restent identiques dans toutes les langues pour les URLs
3. **Visual Fields**: Categories incluent couleur et icone pour l'identite visuelle
4. **Unique Constraints**: Les slugs doivent etre uniques pour eviter les conflits d'URL

---

## Atomic Commits

| #   | Commit Message                                                      | Files                     | Est. Time |
| --- | ------------------------------------------------------------------- | ------------------------- | --------- |
| 1   | `feat(collections): create Categories collection with i18n support` | Categories.ts             | 45 min    |
| 2   | `feat(collections): create Tags collection with i18n support`       | Tags.ts                   | 30 min    |
| 3   | `feat(collections): create barrel export and register in config`    | index.ts, payload.config  | 30 min    |
| 4   | `chore(db): generate and apply migration for Categories and Tags`   | migrations, payload-types | 45 min    |

**Total Estimated Time**: 2h30 implementation + 1h30 verification = 4 hours

---

## Success Criteria

### Functional

- [ ] Categories collection visible in admin panel
- [ ] Tags collection visible in admin panel
- [ ] Can create a category in FR
- [ ] Can view category in EN (fallback behavior works)
- [ ] Slug uniqueness enforced (duplicate slug rejected)
- [ ] Color field accepts hex values
- [ ] Icon field accepts text values

### Technical

- [ ] `pnpm generate:types:payload` executes without errors
- [ ] `pnpm build` succeeds
- [ ] Migration applies without errors (`pnpm payload migrate`)
- [ ] No TypeScript compilation errors
- [ ] `payload-types.ts` includes `Category` and `Tag` types

### Quality

- [ ] Code follows project conventions
- [ ] No linting errors (`pnpm lint`)
- [ ] Collections properly documented with admin descriptions

---

## Risk Assessment

| Risk                    | Impact | Probability | Mitigation                                     |
| ----------------------- | ------ | ----------- | ---------------------------------------------- |
| Migration failure       | High   | Medium      | Test migration locally, backup before applying |
| Slug collision handling | Medium | Low         | Add clear error messages, test uniqueness      |
| Type generation issues  | Medium | Low         | Clear cache before regenerating                |

---

## Dependencies

### Prerequisites

- [x] Phase 1 completed (i18n Configuration)
- [x] `localization` configured in payload.config.ts
- [x] Types generated with locale support

### Blocks

This phase blocks:

- Phase 3: Articles Collection (requires Categories & Tags for relations)

---

## Quick Start

### 1. Read Prerequisites

```bash
cat docs/specs/epics/epic_2/story_2_1/implementation/phase_2/ENVIRONMENT_SETUP.md
```

### 2. Follow Implementation

```bash
cat docs/specs/epics/epic_2/story_2_1/implementation/phase_2/COMMIT_CHECKLIST.md
```

### 3. Validate Completion

```bash
cat docs/specs/epics/epic_2/story_2_1/implementation/phase_2/validation/VALIDATION_CHECKLIST.md
```

---

## Commands Reference

```bash
# Development server
pnpm dev

# Generate types
pnpm generate:types:payload

# Create migration
pnpm payload migrate:create

# Apply migration
pnpm payload migrate

# Build verification
pnpm build

# Lint check
pnpm lint

# Type check
pnpm tsc --noEmit
```

---

## References

- [PHASES_PLAN.md](../PHASES_PLAN.md) - Strategic overview
- [Story 2.1 Spec](../../story_2.1.md) - Full story specification
- [Phase 1 Documentation](../phase_1/INDEX.md) - i18n Configuration
- [Payload Collections Documentation](https://payloadcms.com/docs/configuration/collections)
- [Payload Fields Documentation](https://payloadcms.com/docs/fields/overview)

---

## Next Phase

After completing Phase 2, proceed to:

**Phase 3: Articles Collection**

- Creates the main content collection with relations to Categories and Tags
- Includes reading time hook and SEO fields

```bash
/generate-phase-doc Epic 2 Story 2.1 Phase 3
```

---

**Phase Status**: READY FOR IMPLEMENTATION
