# Phase 1 : Media Collection Enhancement

## Navigation Hub

| Document                                                | Description                                      |
| ------------------------------------------------------- | ------------------------------------------------ |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)      | Strategie commits atomiques et ordre execution   |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md)            | Checklist detaillee par commit                   |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)          | Configuration environnement de developpement     |
| [guides/REVIEW.md](./guides/REVIEW.md)                  | Guide de revue de code commit par commit         |
| [guides/TESTING.md](./guides/TESTING.md)                | Strategie de tests et validation                 |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Checklist finale de validation     |

---

## Phase Overview

| Field              | Value                                               |
| ------------------ | --------------------------------------------------- |
| **Phase**          | 1 of 3                                              |
| **Story**          | 2.2 - Validation du Stockage R2                     |
| **Epic**           | Epic 2 - Content Management System (CMS) Core       |
| **Status**         | READY FOR IMPLEMENTATION                            |
| **Estimated Time** | 1-2 days                                            |
| **Commits**        | 4 atomic commits                                    |
| **Risk Level**     | Low                                                 |

---

## Objective

Enrichir la collection Media avec des champs metadata supplementaires pour une meilleure gestion des fichiers uploades via R2. Cette phase prepare le terrain pour les tests d'integration (Phase 2) et E2E (Phase 3).

### Goals

1. Ajouter des champs metadata read-only (mimeType affiche, filesize, dimensions)
2. Configurer les contraintes d'upload (taille max, types autorises)
3. Implementer un hook `afterChange` pour extraction/validation des metadata
4. Regenerer les types TypeScript Payload

### Non-Goals (Out of Scope)

- Tests d'integration R2 (Phase 2)
- Tests E2E admin (Phase 3)
- Transformation/crop d'images (Epic 6)
- Upload multi-fichiers
- Presigned URLs pour gros fichiers

---

## Key Deliverables

| Deliverable                          | Status  | Commit |
| ------------------------------------ | ------- | ------ |
| Champs metadata dans Media collection| Pending | #1     |
| Configuration upload avec contraintes| Pending | #2     |
| Hook afterChange pour metadata       | Pending | #3     |
| Types TypeScript regeneres           | Pending | #4     |

---

## Files Affected

| File                              | Action | Changes                                    |
| --------------------------------- | ------ | ------------------------------------------ |
| `src/collections/Media.ts`        | Modify | Enrichir avec metadata fields et hooks     |
| `src/payload-types.ts`            | Regen  | Types generes automatiquement              |

---

## Dependencies

### Prerequisites

| Dependency                    | Status    | Notes                                |
| ----------------------------- | --------- | ------------------------------------ |
| Story 2.1 (partiel)           | AVAILABLE | Collection Media de base existe      |
| `@payloadcms/storage-r2`      | INSTALLED | Plugin R2 configure                  |
| Wrangler R2 binding           | CONFIGURED| `wrangler.jsonc` avec bucket R2      |

### Blockers

Aucun bloqueur identifie. La collection Media existe et le plugin R2 est fonctionnel.

---

## Technical Context

### Current State of Media Collection

```typescript
// src/collections/Media.ts (actuel)
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    crop: false,      // Workers limitation (no sharp)
    focalPoint: false,
  },
}
```

### Target State After Phase 1

```typescript
// src/collections/Media.ts (apres Phase 1)
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
      admin: {
        description: 'Optional caption for the media',
      },
    },
  ],
  upload: {
    crop: false,
    focalPoint: false,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
    filesizeLimit: 10 * 1024 * 1024, // 10 MB
  },
  hooks: {
    afterChange: [logMediaUpload],
  },
}
```

### R2 Constraints to Consider

| Constraint                    | Value                | Impact                              |
| ----------------------------- | -------------------- | ----------------------------------- |
| Max upload via Workers binding| 100 MiB (Free tier)  | 10 MB limit suffisant pour blog     |
| Sharp on Workers              | Not available        | crop/focalPoint disabled            |
| Object metadata size          | 8,192 bytes          | Alt text et captions OK             |

---

## Success Criteria

### Must Have

- [ ] Collection Media accepte uploads avec nouveaux champs
- [ ] Contraintes de taille (10 MB) et MIME types appliquees
- [ ] Hook afterChange execute sans erreur apres upload
- [ ] Types TypeScript generes et coherents

### Quality Gates

- [ ] `pnpm generate:types:payload` execute sans erreur
- [ ] `pnpm build` passe sans erreur
- [ ] `pnpm lint` passe sans warning
- [ ] Pas de regression sur fonctionnalites existantes

---

## Risk Assessment

| Risk                          | Probability | Impact | Mitigation                          |
| ----------------------------- | ----------- | ------ | ----------------------------------- |
| Fields cassent donnees existantes | Low     | Medium | Collection vide, pas de migration   |
| Hook ralentit upload          | Low         | Low    | Hook simple, logging uniquement     |
| Types incorrects              | Low         | Medium | Regeneration automatique Payload    |

---

## Quick Reference

### Commands

```bash
# Regenerer les types Payload
pnpm generate:types:payload

# Build pour validation
pnpm build

# Linting
pnpm lint

# Demarrer le serveur de dev
pnpm dev
```

### Key Files

- Collection: `src/collections/Media.ts`
- Types: `src/payload-types.ts`
- Config: `src/payload.config.ts`
- R2 Binding: `wrangler.jsonc`

---

## Next Steps

1. Lire [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) pour comprendre la strategie de commits
2. Configurer l'environnement avec [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
3. Suivre la checklist [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) pour chaque commit
4. Valider avec [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)

---

## Related Documents

| Document                                          | Description                    |
| ------------------------------------------------- | ------------------------------ |
| [Story 2.2 Specification](../../story_2.2.md)     | User story et acceptance criteria |
| [PHASES_PLAN.md](../PHASES_PLAN.md)               | Plan global des 3 phases       |
| [EPIC_TRACKING.md](../../../EPIC_TRACKING.md)     | Tracking Epic 2                |
| [Media.ts](../../../../../../../src/collections/Media.ts) | Collection actuelle   |
