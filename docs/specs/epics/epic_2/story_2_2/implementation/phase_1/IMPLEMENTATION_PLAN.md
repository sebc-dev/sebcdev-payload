# Implementation Plan - Phase 1 : Media Collection Enhancement

## Document Metadata

| Field              | Value                                    |
| ------------------ | ---------------------------------------- |
| **Phase**          | 1 - Media Collection Enhancement         |
| **Story**          | 2.2 - Validation du Stockage R2          |
| **Epic**           | Epic 2 - CMS Core                        |
| **Total Commits**  | 4                                        |
| **Estimated Time** | 1-2 days                                 |
| **Complexity**     | Low                                      |

---

## Atomic Commit Strategy

Cette phase utilise **4 commits atomiques** suivant le principe de responsabilite unique :

| Commit | Focus                                    | Size Est. | Review Time |
| ------ | ---------------------------------------- | --------- | ----------- |
| #1     | Add metadata fields to Media collection  | ~50 lines | 15 min      |
| #2     | Configure upload constraints             | ~30 lines | 10 min      |
| #3     | Add afterChange hook for logging         | ~60 lines | 20 min      |
| #4     | Regenerate types and final validation    | ~20 lines | 10 min      |

**Total**: ~160 lines | ~55 min review time

---

## Commit Order & Dependencies

```
Commit #1: Metadata Fields
    │
    │ (Base fields en place)
    ▼
Commit #2: Upload Constraints
    │
    │ (Configuration complete)
    ▼
Commit #3: afterChange Hook
    │
    │ (Logique post-upload)
    ▼
Commit #4: Types & Validation
    │
    │ (Phase complete)
    ▼
[PHASE 1 DONE]
```

### Parallelization

Aucune parallelisation possible - chaque commit depend du precedent.

---

## Commit #1 : Add Metadata Fields to Media Collection

### Objective

Ajouter les champs `caption` pour enrichir les metadata de la collection Media.

### Rationale

Le champ `alt` existe deja. On ajoute `caption` pour permettre des descriptions plus longues. Les champs `mimeType`, `filesize`, `width`, `height` sont **automatiquement geres par Payload** via le systeme d'upload - pas besoin de les ajouter manuellement.

### Files to Modify

| File                       | Changes                              |
| -------------------------- | ------------------------------------ |
| `src/collections/Media.ts` | Ajouter champ `caption`              |

### Implementation Details

```typescript
// src/collections/Media.ts
import type { CollectionConfig } from 'payload'

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
    // NEW: Caption field for longer descriptions
    {
      name: 'caption',
      type: 'textarea',
      admin: {
        description: 'Optional caption displayed below the media',
      },
    },
  ],
  upload: {
    crop: false,
    focalPoint: false,
  },
}
```

### Commit Message

```
✨ feat(media): add caption field to Media collection

Add optional caption textarea field for richer media descriptions.
Payload automatically handles mimeType, filesize, width, height via upload config.

Story: 2.2 Phase 1 Commit 1/4
```

### Validation Checklist

- [ ] Field `caption` ajoute avec type `textarea`
- [ ] Admin description presente
- [ ] Syntaxe TypeScript valide
- [ ] Pas de breaking changes sur `alt` field

---

## Commit #2 : Configure Upload Constraints

### Objective

Ajouter les contraintes d'upload : types MIME autorises et limite de taille fichier.

### Rationale

- **mimeTypes** : Restreindre aux formats images web courants pour securite
- **filesizeLimit** : 10 MB suffisant pour images blog, reste sous la limite R2 Workers (100 MiB)

### Files to Modify

| File                       | Changes                              |
| -------------------------- | ------------------------------------ |
| `src/collections/Media.ts` | Configurer `upload.mimeTypes` et `filesizeLimit` |

### Implementation Details

```typescript
// src/collections/Media.ts - upload section
upload: {
  crop: false,
  focalPoint: false,
  // NEW: MIME type restrictions
  mimeTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ],
  // NEW: File size limit (10 MB)
  filesizeLimit: 10 * 1024 * 1024,
},
```

### Security Considerations

| MIME Type        | Allowed | Reason                              |
| ---------------- | ------- | ----------------------------------- |
| `image/jpeg`     | Yes     | Standard photo format               |
| `image/png`      | Yes     | Screenshots, graphics with alpha    |
| `image/webp`     | Yes     | Modern optimized format             |
| `image/gif`      | Yes     | Animated images                     |
| `image/svg+xml`  | Yes     | Vector graphics, icons              |
| `application/*`  | No      | Security risk (executables, etc.)   |
| `video/*`        | No      | Out of scope for V1                 |

### Commit Message

```
🔒 feat(media): configure upload constraints for security

Add MIME type whitelist (jpeg, png, webp, gif, svg) and 10MB size limit.
Ensures only safe image formats are accepted, staying under R2 Workers binding limit.

Story: 2.2 Phase 1 Commit 2/4
```

### Validation Checklist

- [ ] `mimeTypes` array with 5 image types
- [ ] `filesizeLimit` set to 10 MB (10485760 bytes)
- [ ] `crop` and `focalPoint` remain `false`
- [ ] No syntax errors

---

## Commit #3 : Add afterChange Hook for Logging

### Objective

Implementer un hook `afterChange` qui log les uploads reussis pour validation et debugging.

### Rationale

- Facilite le debugging pendant le developpement
- Prepare le terrain pour les tests d'integration (Phase 2)
- Utilise le logger structure du projet

### Files to Modify

| File                       | Changes                              |
| -------------------------- | ------------------------------------ |
| `src/collections/Media.ts` | Ajouter hook `afterChange`           |

### Implementation Details

```typescript
// src/collections/Media.ts
import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

/**
 * Hook to log successful media uploads for debugging and validation.
 * Logs key metadata: id, filename, mimeType, filesize.
 */
const logMediaUpload: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation === 'create') {
    req.payload.logger.info({
      msg: 'Media uploaded successfully',
      mediaId: doc.id,
      filename: doc.filename,
      mimeType: doc.mimeType,
      filesize: doc.filesize,
    })
  }

  return doc
}

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
        description: 'Optional caption displayed below the media',
      },
    },
  ],
  upload: {
    crop: false,
    focalPoint: false,
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ],
    filesizeLimit: 10 * 1024 * 1024,
  },
  hooks: {
    afterChange: [logMediaUpload],
  },
}
```

### Hook Behavior

| Operation | Action                                    |
| --------- | ----------------------------------------- |
| `create`  | Log media metadata (id, filename, etc.)   |
| `update`  | No logging (skip)                         |
| `delete`  | Not triggered by afterChange              |

### Commit Message

```
✨ feat(media): add afterChange hook for upload logging

Implement structured logging hook that captures media metadata on upload.
Logs mediaId, filename, mimeType, and filesize for debugging and validation.

Story: 2.2 Phase 1 Commit 3/4
```

### Validation Checklist

- [ ] Hook function defined with correct types
- [ ] Only logs on `create` operation
- [ ] Uses `req.payload.logger.info` (structured logging)
- [ ] Returns `doc` unchanged
- [ ] Hook registered in `hooks.afterChange` array

---

## Commit #4 : Regenerate Types and Final Validation

### Objective

Regenerer les types TypeScript Payload et valider que tout compile correctement.

### Rationale

- Types doivent refleter les nouveaux champs
- Validation finale avant de passer a Phase 2

### Commands to Run

```bash
# Regenerer les types Payload
pnpm generate:types:payload

# Verifier la compilation TypeScript
pnpm build

# Verifier le linting
pnpm lint
```

### Expected Changes to payload-types.ts

```typescript
// src/payload-types.ts (generated)
export interface Media {
  id: string
  alt: string
  caption?: string | null  // NEW
  // ... autres champs auto-generes par Payload
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
  width?: number | null
  height?: number | null
  // ...
}
```

### Commit Message

```
🔧 chore(types): regenerate payload types for Media collection

Run generate:types:payload after Media collection enhancement.
Types now include caption field and all upload metadata.

Story: 2.2 Phase 1 Commit 4/4
```

### Validation Checklist

- [ ] `pnpm generate:types:payload` succeeds
- [ ] `src/payload-types.ts` updated with new fields
- [ ] `pnpm build` passes without errors
- [ ] `pnpm lint` passes without warnings
- [ ] No TypeScript errors in IDE

---

## Implementation Sequence Summary

```
Day 1 (Morning):
├── Commit #1: Metadata fields (~30 min)
│   ├── Add caption field
│   ├── Verify syntax
│   └── Local test
│
└── Commit #2: Upload constraints (~20 min)
    ├── Add mimeTypes array
    ├── Set filesizeLimit
    └── Verify constraints

Day 1 (Afternoon):
├── Commit #3: afterChange hook (~45 min)
│   ├── Implement hook function
│   ├── Test logging output
│   └── Verify hook execution
│
└── Commit #4: Types & validation (~30 min)
    ├── Regenerate types
    ├── Run build
    ├── Run lint
    └── Final validation

Total: ~2 hours implementation + testing
```

---

## Rollback Strategy

En cas de probleme, chaque commit peut etre annule individuellement :

```bash
# Voir les commits de la phase
git log --oneline -4

# Rollback du dernier commit uniquement
git revert HEAD

# Rollback complet de la phase (si necessaire)
git revert HEAD~3..HEAD
```

### Safe Rollback Points

| After Commit | State                    | Rollback Safe? |
| ------------ | ------------------------ | -------------- |
| #1           | Fields added             | Yes            |
| #2           | Constraints added        | Yes            |
| #3           | Hook added               | Yes            |
| #4           | Types regenerated        | Yes            |

---

## Quality Gates per Commit

| Commit | Validation Command              | Expected Result      |
| ------ | ------------------------------- | -------------------- |
| #1     | TypeScript syntax check         | No errors            |
| #2     | TypeScript syntax check         | No errors            |
| #3     | TypeScript syntax check         | No errors            |
| #4     | `pnpm build && pnpm lint`       | Success              |

---

## Next Phase Preview

**Phase 2 : Integration Tests R2** utilisera la collection Media enrichie pour :
- Tests CRUD via Payload API
- Validation du stockage R2
- Tests de gestion d'erreurs

---

## References

| Document                                 | Purpose                           |
| ---------------------------------------- | --------------------------------- |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) | Checklist detaillee par commit |
| [guides/TESTING.md](./guides/TESTING.md) | Strategie de tests                |
| [Payload Upload Docs](https://payloadcms.com/docs/upload/overview) | Configuration upload |
| [Payload Hooks Docs](https://payloadcms.com/docs/hooks/overview) | Documentation hooks |
