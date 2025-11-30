# Story 2.2 : Validation du Stockage R2

## Story Overview

| Field            | Value                                                   |
| ---------------- | ------------------------------------------------------- |
| **Story ID**     | 2.2                                                     |
| **Epic**         | Epic 2 - Content Management System (CMS) Core           |
| **Title**        | Validation du Stockage R2                               |
| **Status**       | PLANNED                                                 |
| **Created**      | 2025-11-30                                              |
| **Dependencies** | Story 2.1 (partiel - collection Media existe)           |
| **Complexity**   | Medium                                                  |
| **Risk Level**   | Medium (integration Cloudflare Workers + R2)            |

---

## User Story

**En tant qu'** Auteur,
**je veux** uploader une image test depuis le panneau admin et verifier sa presence dans le bucket R2,
**afin de** valider que le plugin Cloud Storage est correctement configure par le template.

---

## Context

### Technical Background

Le projet utilise Cloudflare R2 comme stockage media via le plugin `@payloadcms/storage-r2`. La configuration actuelle dans `payload.config.ts` active deja le plugin R2 :

```typescript
plugins: [
  r2Storage({
    bucket: cloudflare.env.R2,
    collections: { media: true },
  }),
]
```

Le bucket R2 est configure dans `wrangler.jsonc` :

```jsonc
"r2_buckets": [
  {
    "binding": "R2",
    "bucket_name": "sebcdev-payload-cache",
    "preview_bucket_name": "sebcdev-payload-cache"
  }
]
```

### Cloudflare R2 Technical Specifications

Source: [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)

#### Limitations Workers Binding API

| Constraint                    | Value                                           | Impact                                          |
| ----------------------------- | ----------------------------------------------- | ----------------------------------------------- |
| Max upload via binding        | 100 MiB (Free), 200 MiB (Business), 500 MiB (Enterprise) | Images blog < 10 MB generalement OK |
| Max object size               | 5 TiB                                           | Non limitant pour medias web                    |
| Object key length             | 1,024 bytes                                     | Noms fichiers standards OK                      |
| Object metadata size          | 8,192 bytes                                     | Alt text, MIME types OK                         |

#### Operations R2 Bucket

| Operation  | Method              | Description                                  |
| ---------- | ------------------- | -------------------------------------------- |
| PUT        | `bucket.put(key, data, options)` | Upload fichier vers R2             |
| GET        | `bucket.get(key)`   | Recuperer fichier depuis R2                  |
| HEAD       | `bucket.head(key)`  | Recuperer metadata sans contenu              |
| DELETE     | `bucket.delete(key)`| Supprimer fichier                            |
| LIST       | `bucket.list(options)` | Lister objets avec pagination             |

#### Configuration CORS (si acces direct bucket)

```json
[
  {
    "AllowedOrigins": ["https://yourdomain.com", "http://localhost:3000"],
    "AllowedMethods": ["GET", "PUT", "DELETE"],
    "AllowedHeaders": ["Content-Type", "Authorization"],
    "ExposeHeaders": ["ETag", "Content-Length"],
    "MaxAgeSeconds": 3600
  }
]
```

### Current State

- **Media Collection** : Existe dans `src/collections/Media.ts`
- **R2 Plugin** : Configure dans `payload.config.ts`
- **Wrangler Binding** : Configure dans `wrangler.jsonc`
- **Constraints Workers** : `crop: false`, `focalPoint: false` (sharp non disponible)

### What Needs Validation

1. Upload fonctionne depuis Payload Admin
2. Fichier physiquement present dans R2
3. URL accessible pour lecture
4. Metadata correctement stockees
5. Integration avec collection Media

---

## Acceptance Criteria

### CA1 : Upload depuis le Back-office

**Given** un utilisateur authentifie sur `/admin`
**When** il uploade une image via la collection Media
**Then** l'upload se complete sans erreur et l'image est visible dans la liste Media

**Validation** :
- [ ] Formulaire d'upload accessible
- [ ] Progress bar visible pendant upload
- [ ] Confirmation apres upload reussi
- [ ] Image affichee dans la galerie Media

### CA2 : Presence dans le bucket R2

**Given** une image uploadee via Payload Admin
**When** on verifie le bucket R2 (via Dashboard Cloudflare ou CLI)
**Then** le fichier existe avec le bon nom et la bonne taille

**Validation** :
- [ ] Fichier present dans R2 bucket
- [ ] Nom de fichier correspond (avec prefixe/path Payload)
- [ ] Taille fichier coherente
- [ ] MIME type correct

### CA3 : Accessibilite URL

**Given** une image stockee dans R2
**When** on accede a l'URL depuis le frontend
**Then** l'image est servie correctement avec les bons headers

**Validation** :
- [ ] URL generee par Payload fonctionne
- [ ] Headers `Content-Type` corrects
- [ ] Cache headers presents (si configures)
- [ ] Pas d'erreur CORS en local

### CA4 : Metadata stockees

**Given** une image uploadee avec alt text
**When** on consulte l'enregistrement Media
**Then** toutes les metadata sont correctement persistees

**Validation** :
- [ ] Alt text sauvegarde en D1
- [ ] Dimensions images (si extraites)
- [ ] Filename original
- [ ] URL R2 reference

### CA5 : Operations CRUD completes

**Given** une image existante dans Media
**When** on effectue des operations CRUD
**Then** toutes les operations se refletent dans R2

**Validation** :
- [ ] Create : Nouveau fichier dans R2
- [ ] Read : Fichier accessible
- [ ] Update : Remplacement fichier fonctionne
- [ ] Delete : Fichier supprime de R2

---

## Technical Requirements

### Files to Create/Modify

| File                                    | Action   | Purpose                              |
| --------------------------------------- | -------- | ------------------------------------ |
| `src/collections/Media.ts`              | Modify   | Enrichir avec metadata supplementaires |
| `tests/int/media-r2.int.spec.ts`        | Create   | Tests integration upload R2          |
| `tests/e2e/admin-media.e2e.spec.ts`     | Create   | Test E2E upload via admin            |

### Dependencies

| Package                     | Version  | Purpose                    |
| --------------------------- | -------- | -------------------------- |
| `@payloadcms/storage-r2`    | Installed| Plugin stockage R2         |
| `@cloudflare/workers-types` | Installed| Types R2Bucket             |

### Environment Requirements

```bash
# Variables necessaires (deja configurees)
CLOUDFLARE_ACCOUNT_ID=xxx
CLOUDFLARE_API_TOKEN=xxx  # Pour deploiement

# Wrangler local (automatique via getPlatformProxy)
# R2 binding disponible via cloudflare.env.R2
```

---

## Technical Constraints

### Workers Limitations

1. **Sharp non disponible** : Pas de crop/resize cote serveur
   - Solution : Utiliser Cloudflare Images pour transformation
   - Actuel : `crop: false`, `focalPoint: false` dans Media

2. **Upload size via binding** : 100 MiB max (Free tier)
   - Solution future : Presigned URLs pour gros fichiers
   - Actuel : Suffisant pour images blog optimisees

3. **Local development** : Wrangler simule R2 localement
   - Attention : Comportement peut differer en prod
   - Test : Valider en preview Cloudflare

### CORS Considerations

Si acces direct au bucket R2 necessaire (pas via Worker) :
- Configurer CORS policy sur le bucket
- Exposer headers necessaires (`ETag`, `Content-Length`)

### Security

- Acces R2 uniquement via Worker (pas de public bucket)
- Authentification Payload requise pour upload
- Validation MIME types cote serveur

---

## Out of Scope

Les elements suivants ne font PAS partie de cette story :

1. **Transformation images** (crop, resize) - Sera Epic 6 Story 6.2
2. **Optimisation Cloudflare Images** - Sera Epic 6 Story 6.2
3. **Upload multi-fichiers** - Fonctionnalite future
4. **Presigned URLs** - Si necessaire pour gros fichiers
5. **Public bucket access** - Securite via Worker uniquement

---

## Risks and Mitigations

| Risk                                    | Probability | Impact | Mitigation                              |
| --------------------------------------- | ----------- | ------ | --------------------------------------- |
| Plugin R2 incompatible Workers          | Low         | High   | Deja teste dans template officiel       |
| CORS issues en local                    | Medium      | Medium | Utiliser wrangler dev avec bindings     |
| Difference local/prod                   | Medium      | Medium | Tester en preview avant merge           |
| Upload timeout gros fichiers            | Low         | Low    | Limiter taille upload a 10 MB pour V1   |

---

## Test Strategy

### Unit Tests

Pas de tests unitaires specifiques - logique dans plugin Payload

### Integration Tests

```typescript
// tests/int/media-r2.int.spec.ts
describe('Media R2 Storage', () => {
  it('should upload file to R2 via Payload API')
  it('should retrieve uploaded file metadata')
  it('should delete file from R2 when media deleted')
  it('should handle upload errors gracefully')
})
```

### E2E Tests

```typescript
// tests/e2e/admin-media.e2e.spec.ts
describe('Admin Media Upload', () => {
  it('should upload image via admin panel')
  it('should display uploaded image in media library')
  it('should allow downloading uploaded file')
})
```

### Manual Validation

1. Upload image test via `/admin/collections/media/create`
2. Verifier dans Cloudflare Dashboard R2
3. Acceder URL image depuis navigateur
4. Supprimer image et verifier suppression R2

---

## Success Metrics

| Metric                        | Target    | Measurement                          |
| ----------------------------- | --------- | ------------------------------------ |
| Upload success rate           | 100%      | Tests automatises                    |
| Upload time < 5 MB            | < 3s      | Performance test                     |
| R2 sync accuracy              | 100%      | Verification manuelle                |
| Zero CORS errors              | 0         | Console browser                      |

---

## References

### Cloudflare Documentation

- [R2 Getting Started](https://developers.cloudflare.com/r2/get-started/)
- [R2 Workers API Reference](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/)
- [R2 Limits](https://developers.cloudflare.com/r2/platform/limits/)
- [R2 CORS Configuration](https://developers.cloudflare.com/r2/buckets/cors/)
- [R2 Presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/)

### Payload CMS Documentation

- [Payload Storage Adapters](https://payloadcms.com/docs/plugins/cloud-storage)
- [Payload Upload Configuration](https://payloadcms.com/docs/upload/overview)

### Project Files

- [payload.config.ts](../../../../src/payload.config.ts) - Configuration R2 plugin
- [Media.ts](../../../../src/collections/Media.ts) - Collection Media
- [wrangler.jsonc](../../../../wrangler.jsonc) - R2 binding configuration

---

## Implementation Notes

### Plugin R2 Behavior

Le plugin `@payloadcms/storage-r2` :
1. Intercepte les uploads de la collection configuree
2. Stocke le fichier dans R2 via le binding
3. Sauvegarde l'URL R2 dans le document Payload
4. Gere la suppression automatique lors du delete

### URL Generation

Les URLs generees suivent le pattern :
```
/api/media/file/{filename}
```

Le Worker sert le fichier depuis R2 via le binding, pas d'acces direct au bucket.

### Local Development

En local avec `wrangler dev` :
- R2 simule localement dans `.wrangler/state/r2`
- Comportement identique a la production
- Pas besoin de bucket R2 reel pour dev
