# Code Review Guide - Phase 1 : Media Collection Enhancement

## Overview

Ce guide aide les reviewers a evaluer chaque commit de la Phase 1.
Chaque section correspond a un commit et liste les points cles a verifier.

---

## Review Principles

### Commit-by-Commit Review

Chaque commit doit etre revise independamment :
- Un commit = une responsabilite unique
- Chaque commit doit etre fonctionnel (pas de code casse)
- Les messages de commit doivent etre descriptifs

### Focus Areas

| Priority | Area                    | Description                           |
| -------- | ----------------------- | ------------------------------------- |
| High     | Security                | Validation MIME types, size limits    |
| High     | Type Safety             | Types Payload corrects                |
| Medium   | Code Style              | Conventions du projet                 |
| Medium   | Performance             | Pas de hooks bloquants                |
| Low      | Documentation           | Commentaires si necessaire            |

---

## Commit #1 Review : Add Metadata Fields

### Files Changed

- `src/collections/Media.ts`

### Review Checklist

#### Field Definition

- [ ] **Field name** : `caption` (snake_case avoided, camelCase used)
- [ ] **Field type** : `textarea` (appropriate for longer text)
- [ ] **Required** : Not set (optional field) - correct
- [ ] **Admin config** : Description presente et utile

#### Code Quality

```typescript
// Expected structure
{
  name: 'caption',
  type: 'textarea',
  admin: {
    description: 'Optional caption displayed below the media',
  },
},
```

- [ ] Indentation coherente (2 espaces)
- [ ] Virgule trailing apres l'objet
- [ ] Pas de proprietes superflues

#### Questions for Reviewer

1. Le nom `caption` est-il semantiquement correct ?
2. Le type `textarea` est-il approprie vs `text` ou `richText` ?
3. La description admin est-elle claire pour l'editeur ?

### Approval Criteria

| Criteria              | Required | Notes                              |
| --------------------- | -------- | ---------------------------------- |
| Syntax valid          | Yes      | No TypeScript errors               |
| Field properly typed  | Yes      | `textarea` is correct              |
| No breaking changes   | Yes      | `alt` field unchanged              |
| Commit message format | Yes      | Gitmoji + description              |

---

## Commit #2 Review : Configure Upload Constraints

### Files Changed

- `src/collections/Media.ts`

### Review Checklist

#### MIME Types Configuration

```typescript
mimeTypes: [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
],
```

- [ ] **JPEG** : `image/jpeg` (not `image/jpg`)
- [ ] **PNG** : `image/png`
- [ ] **WebP** : `image/webp` (modern format)
- [ ] **GIF** : `image/gif` (animated images)
- [ ] **SVG** : `image/svg+xml` (vector graphics)

#### Security Review

| Check                           | Status | Notes                              |
| ------------------------------- | ------ | ---------------------------------- |
| No `application/*` types        | [ ]    | Security: no executables           |
| No `video/*` types              | [ ]    | Out of scope for V1                |
| No `*/*` wildcard               | [ ]    | Must be explicit                   |
| SVG allowed but controlled      | [ ]    | SVG can contain scripts            |

> **Note sur SVG** : SVG peut contenir du JavaScript malveillant. Payload sanitize par defaut, mais verifier que CSP est configure si SVG est rendu inline.

#### File Size Limit

```typescript
filesizeLimit: 10 * 1024 * 1024, // 10 MB
```

- [ ] Valeur = 10485760 bytes (10 MB)
- [ ] Commentaire explicatif present
- [ ] Sous la limite R2 Workers (100 MiB)

#### Questions for Reviewer

1. Les types MIME couvrent-ils tous les besoins du blog ?
2. 10 MB est-il suffisant pour les images HD ?
3. SVG doit-il etre autorise ? (risque XSS)

### Approval Criteria

| Criteria                | Required | Notes                              |
| ----------------------- | -------- | ---------------------------------- |
| Security types only     | Yes      | No dangerous MIME types            |
| Size limit reasonable   | Yes      | Under R2 Workers limit             |
| No syntax errors        | Yes      | Array and number valid             |
| Commit message format   | Yes      | Security focus mentioned           |

---

## Commit #3 Review : Add afterChange Hook

### Files Changed

- `src/collections/Media.ts`

### Review Checklist

#### Import Statement

```typescript
import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'
```

- [ ] Import `type` utilise (type-only import)
- [ ] `CollectionAfterChangeHook` importe
- [ ] `CollectionConfig` toujours importe

#### Hook Function Definition

```typescript
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
```

##### Type Safety

- [ ] Type `CollectionAfterChangeHook` explicite
- [ ] Destructuring correct (`doc`, `operation`, `req`)
- [ ] Retourne `doc` (required by Payload)

##### Logic Review

- [ ] Filtre sur `operation === 'create'` uniquement
- [ ] Ne modifie pas `doc` (logging only)
- [ ] Pas de `await` bloquant (async mais no-op)

##### Logging Review

- [ ] Utilise `req.payload.logger` (pas `console.log`)
- [ ] Format structure (objet, pas string)
- [ ] Niveau `info` approprie (pas `warn` ou `error`)
- [ ] Donnees loguees non sensibles

#### Hook Registration

```typescript
hooks: {
  afterChange: [logMediaUpload],
},
```

- [ ] Array syntax (permet plusieurs hooks)
- [ ] Hook reference correcte (pas d'appel de fonction)

#### Performance Considerations

| Check                           | Status | Notes                              |
| ------------------------------- | ------ | ---------------------------------- |
| Hook is non-blocking            | [ ]    | No heavy computation               |
| No external API calls           | [ ]    | Logging only                       |
| No database queries             | [ ]    | Uses existing doc data             |
| No file system operations       | [ ]    | Workers-compatible                 |

#### Questions for Reviewer

1. Le logging est-il suffisant pour debugging ?
2. Faut-il logger aussi les `update` operations ?
3. Les donnees loguees sont-elles GDPR-compliant ?

### Approval Criteria

| Criteria                | Required | Notes                              |
| ----------------------- | -------- | ---------------------------------- |
| Type-safe hook          | Yes      | CollectionAfterChangeHook          |
| Returns doc unchanged   | Yes      | Required by Payload                |
| Uses structured logger  | Yes      | Not console.log                    |
| Non-blocking            | Yes      | No heavy operations                |
| Commit message format   | Yes      | Gitmoji + description              |

---

## Commit #4 Review : Regenerate Types

### Files Changed

- `src/payload-types.ts`

### Review Checklist

#### Generated Types Validation

```typescript
// Expected in Media interface
export interface Media {
  id: string
  alt: string
  caption?: string | null  // NEW
  // ... auto-generated fields
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
  width?: number | null
  height?: number | null
  url?: string | null
  updatedAt: string
  createdAt: string
}
```

- [ ] `caption` field present avec type `string | null`
- [ ] `caption` est optionnel (`?`)
- [ ] Autres champs auto-generes presents

#### Build Verification

- [ ] `pnpm generate:types:payload` a reussi
- [ ] `pnpm build` passe sans erreur
- [ ] `pnpm lint` passe sans warning

#### Questions for Reviewer

1. Les types generes correspondent-ils au schema ?
2. Y a-t-il des types inattendus ou manquants ?

### Approval Criteria

| Criteria                | Required | Notes                              |
| ----------------------- | -------- | ---------------------------------- |
| Types regenerated       | Yes      | File should be modified            |
| caption field present   | Yes      | With correct type                  |
| Build passes            | Yes      | No compilation errors              |
| Lint passes             | Yes      | No warnings                        |
| Commit message format   | Yes      | Chore prefix for types             |

---

## Full Phase Review

### Final Checklist

#### Code Quality

- [ ] Tous les 4 commits respectent les conventions
- [ ] Pas de `console.log` dans le code
- [ ] Pas de code commente
- [ ] Pas de TODO non resolu

#### Functional Completeness

- [ ] Collection Media a le champ `caption`
- [ ] Upload contraint par MIME types
- [ ] Upload contraint par taille (10 MB)
- [ ] Hook de logging fonctionnel
- [ ] Types TypeScript a jour

#### Security

- [ ] Pas de types MIME dangereux autorises
- [ ] Limite de taille raisonnable
- [ ] Pas de donnees sensibles dans les logs

#### Performance

- [ ] Hook non-bloquant
- [ ] Pas de requetes supplementaires dans le hook

---

## Review Comments Templates

### Approval

```
LGTM! Phase 1 complete with all 4 commits properly structured.

Validated:
- [ ] Field definitions correct
- [ ] Security constraints in place
- [ ] Hook properly typed and non-blocking
- [ ] Types regenerated successfully
```

### Request Changes

```
Changes requested on Commit #X:

**Issue**: [Description]
**Expected**: [What should be done]
**Suggestion**: [Code or approach]

Please address and re-request review.
```

### Minor Suggestions (Non-Blocking)

```
Approved with minor suggestions:

**Commit #X**: Consider [suggestion]
**Commit #Y**: Nit: [minor improvement]

These are not blocking - merge at your discretion.
```

---

## References

- [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) - Implementation details
- [COMMIT_CHECKLIST.md](../COMMIT_CHECKLIST.md) - Commit checklist
- [Payload Hooks Documentation](https://payloadcms.com/docs/hooks/overview)
- [Payload Upload Configuration](https://payloadcms.com/docs/upload/overview)
