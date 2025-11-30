# Commit Checklist - Phase 1 : Media Collection Enhancement

## Overview

Cette checklist guide l'implementation de chaque commit atomique de la Phase 1.
Suivez chaque section dans l'ordre pour garantir une implementation coherente.

---

## Pre-Implementation Checklist

Avant de commencer, verifier que :

- [ ] Branche `epic/epic-2-cms-core` active
- [ ] Derniere version du code (`git pull`)
- [ ] Environnement de dev fonctionnel (`pnpm dev` demarre)
- [ ] Aucun fichier non commite (`git status` propre)
- [ ] Documentation lue : [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)

---

## Commit #1 : Add Metadata Fields to Media Collection

### Status: [ ] Not Started | [ ] In Progress | [ ] Completed

### Pre-Commit Checks

- [ ] `src/collections/Media.ts` existe et est lisible
- [ ] Comprends la structure actuelle de la collection

### Implementation Steps

1. [ ] Ouvrir `src/collections/Media.ts`
2. [ ] Localiser le tableau `fields`
3. [ ] Ajouter le champ `caption` apres `alt` :

```typescript
{
  name: 'caption',
  type: 'textarea',
  admin: {
    description: 'Optional caption displayed below the media',
  },
},
```

4. [ ] Sauvegarder le fichier
5. [ ] Verifier la syntaxe (pas d'erreur dans l'IDE)

### Post-Implementation Validation

- [ ] Le fichier compile sans erreur TypeScript
- [ ] Structure JSON valide (pas de virgule manquante/superflue)
- [ ] Indentation coherente (2 espaces)

### Commit

```bash
git add src/collections/Media.ts
git commit -m "$(cat <<'EOF'
✨ feat(media): add caption field to Media collection

Add optional caption textarea field for richer media descriptions.
Payload automatically handles mimeType, filesize, width, height via upload config.

Story: 2.2 Phase 1 Commit 1/4

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Verification

- [ ] `git log -1` montre le bon message de commit
- [ ] `git diff HEAD~1` montre uniquement les changements attendus

---

## Commit #2 : Configure Upload Constraints

### Status: [ ] Not Started | [ ] In Progress | [ ] Completed

### Pre-Commit Checks

- [ ] Commit #1 complete et pousse
- [ ] `src/collections/Media.ts` contient le champ `caption`

### Implementation Steps

1. [ ] Ouvrir `src/collections/Media.ts`
2. [ ] Localiser la section `upload`
3. [ ] Ajouter les contraintes apres `focalPoint: false` :

```typescript
upload: {
  crop: false,
  focalPoint: false,
  // Add these lines:
  mimeTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ],
  filesizeLimit: 10 * 1024 * 1024, // 10 MB
},
```

4. [ ] Sauvegarder le fichier
5. [ ] Verifier la syntaxe

### Post-Implementation Validation

- [ ] Array `mimeTypes` contient 5 elements
- [ ] `filesizeLimit` = 10485760 (10 * 1024 * 1024)
- [ ] Commentaire explicatif present
- [ ] Pas d'erreur de syntaxe

### Commit

```bash
git add src/collections/Media.ts
git commit -m "$(cat <<'EOF'
🔒 feat(media): configure upload constraints for security

Add MIME type whitelist (jpeg, png, webp, gif, svg) and 10MB size limit.
Ensures only safe image formats are accepted, staying under R2 Workers binding limit.

Story: 2.2 Phase 1 Commit 2/4

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Verification

- [ ] `git log -1` montre le bon message
- [ ] `git diff HEAD~1` montre seulement les contraintes upload

---

## Commit #3 : Add afterChange Hook for Logging

### Status: [ ] Not Started | [ ] In Progress | [ ] Completed

### Pre-Commit Checks

- [ ] Commits #1 et #2 completes
- [ ] Configuration upload en place

### Implementation Steps

1. [ ] Ouvrir `src/collections/Media.ts`
2. [ ] Ajouter l'import du type hook en haut du fichier :

```typescript
import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'
```

3. [ ] Ajouter la fonction hook avant l'export :

```typescript
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
```

4. [ ] Ajouter la configuration hooks dans la collection :

```typescript
hooks: {
  afterChange: [logMediaUpload],
},
```

5. [ ] Sauvegarder le fichier
6. [ ] Verifier que tout compile

### Post-Implementation Validation

- [ ] Import `CollectionAfterChangeHook` present
- [ ] Fonction `logMediaUpload` definie
- [ ] Hook filtre sur `operation === 'create'`
- [ ] Utilise `req.payload.logger.info` (pas `console.log`)
- [ ] Retourne `doc` en fin de fonction
- [ ] Section `hooks` ajoutee dans la config

### Commit

```bash
git add src/collections/Media.ts
git commit -m "$(cat <<'EOF'
✨ feat(media): add afterChange hook for upload logging

Implement structured logging hook that captures media metadata on upload.
Logs mediaId, filename, mimeType, and filesize for debugging and validation.

Story: 2.2 Phase 1 Commit 3/4

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Verification

- [ ] `git log -1` montre le bon message
- [ ] `git diff HEAD~1` montre le hook et son integration

---

## Commit #4 : Regenerate Types and Final Validation

### Status: [ ] Not Started | [ ] In Progress | [ ] Completed

### Pre-Commit Checks

- [ ] Commits #1, #2, #3 completes
- [ ] Collection Media complete

### Implementation Steps

1. [ ] Regenerer les types Payload :

```bash
pnpm generate:types:payload
```

2. [ ] Verifier que les types sont generes :
   - [ ] `src/payload-types.ts` modifie
   - [ ] Interface `Media` contient `caption?: string | null`

3. [ ] Executer le build :

```bash
pnpm build
```

4. [ ] Executer le linting :

```bash
pnpm lint
```

5. [ ] Verifier le serveur de dev :

```bash
pnpm dev
# Acceder a /admin/collections/media
# Verifier que les nouveaux champs apparaissent
```

### Post-Implementation Validation

- [ ] `pnpm generate:types:payload` - SUCCESS
- [ ] `pnpm build` - SUCCESS (0 erreurs)
- [ ] `pnpm lint` - SUCCESS (0 warnings)
- [ ] Admin panel affiche le champ `caption`
- [ ] Upload constraint visible (si essai avec mauvais type)

### Commit

```bash
git add src/payload-types.ts
git commit -m "$(cat <<'EOF'
🔧 chore(types): regenerate payload types for Media collection

Run generate:types:payload after Media collection enhancement.
Types now include caption field and all upload metadata.

Story: 2.2 Phase 1 Commit 4/4

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Verification

- [ ] `git log -1` montre le bon message
- [ ] `git diff HEAD~1` montre les changements dans `payload-types.ts`

---

## Post-Phase Checklist

### Code Quality

- [ ] Tous les 4 commits completes
- [ ] `pnpm build` passe
- [ ] `pnpm lint` passe
- [ ] Pas de `console.log` dans le code

### Functional Validation

- [ ] Collection Media accessible dans Admin
- [ ] Champ `caption` visible dans le formulaire
- [ ] Upload d'une image JPEG fonctionne
- [ ] Upload d'un fichier .exe rejete
- [ ] Upload d'un fichier > 10MB rejete (si possible a tester)
- [ ] Logs visibles dans la console apres upload

### Documentation

- [ ] Commits messages suivent la convention Gitmoji
- [ ] Chaque commit reference "Story: 2.2 Phase 1 Commit X/4"

---

## Final State Check

### Files Modified

| File                       | Status    |
| -------------------------- | --------- |
| `src/collections/Media.ts` | Modified  |
| `src/payload-types.ts`     | Regenerated |

### Git Log Expected

```bash
git log --oneline -4

# Expected output (ordre inverse):
# abc1234 🔧 chore(types): regenerate payload types for Media collection
# def5678 ✨ feat(media): add afterChange hook for upload logging
# ghi9012 🔒 feat(media): configure upload constraints for security
# jkl3456 ✨ feat(media): add caption field to Media collection
```

### Ready for Phase 2

- [ ] Phase 1 complete et validee
- [ ] Push vers remote : `git push origin epic/epic-2-cms-core`
- [ ] Pret a commencer Phase 2 : Integration Tests R2

---

## Troubleshooting

### Erreur TypeScript apres ajout du hook

```
Type 'CollectionAfterChangeHook' is not assignable...
```

**Solution** : Verifier l'import exact :
```typescript
import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'
```

### Build echoue apres generate:types

```
Cannot find module '@payload-config'
```

**Solution** :
```bash
pnpm generate:types  # Regenerer tous les types
```

### Upload rejete sans message clair

**Verification** :
- Verifier que le MIME type est dans la liste
- Verifier que le fichier < 10MB
- Consulter les logs server (`pnpm dev`)

---

## References

- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) - Details techniques
- [guides/TESTING.md](./guides/TESTING.md) - Tests manuels
- [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) - Validation finale
