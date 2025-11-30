# PHASES_PLAN.md - Story 2.2 : Validation du Stockage R2

## Document Metadata

| Field              | Value                                    |
| ------------------ | ---------------------------------------- |
| **Story**          | 2.2 - Validation du Stockage R2          |
| **Epic**           | Epic 2 - Content Management System Core  |
| **Created**        | 2025-11-30                               |
| **Status**         | PLANNED                                  |
| **Total Phases**   | 3                                        |
| **Estimated Days** | 4-5 days                                 |
| **Complexity**     | Medium                                   |

---

## Story Overview

### Objective

Valider que le plugin `@payloadcms/storage-r2` est correctement configure et fonctionne de bout en bout : upload depuis Payload Admin, stockage dans R2, et recuperation des fichiers.

### Key Deliverables

1. Collection Media enrichie avec metadata supplementaires
2. Tests d'integration validant le pipeline R2
3. Tests E2E validant l'experience utilisateur admin
4. Documentation des limitations et contraintes Workers

### Success Criteria

- [ ] Upload image via admin fonctionne sans erreur
- [ ] Fichier present et accessible dans R2
- [ ] Metadata correctement persistees en D1
- [ ] Operations CRUD completes fonctionnelles
- [ ] Tests automatises couvrant les scenarios critiques

---

## Phase Breakdown Strategy

### Rationale

Cette story est decomposee en **3 phases** car :

1. **Complexite Moyenne** : Integration existante, validation + enrichissement
2. **Risque Technique** : Differences potentielles local/production
3. **Dependance Tests** : Chaque phase valide une couche differente

### Phase Distribution

| Phase | Focus Area                  | Duration | Commits | Risk   |
| ----- | --------------------------- | -------- | ------- | ------ |
| 1     | Media Collection Enhancement| 1-2 days | 3-4     | Low    |
| 2     | Integration Tests R2        | 1-2 days | 3-4     | Medium |
| 3     | E2E Tests & Validation      | 1-2 days | 3-4     | Medium |

---

## Phases Summary

### Phase 1 : Media Collection Enhancement

**Objective** : Enrichir la collection Media avec des champs metadata supplementaires pour une meilleure gestion des fichiers.

**Scope** :
- Ajout champs metadata (mimeType affiché, filesize, dimensions si disponibles)
- Configuration upload constraints (taille max, types autorises)
- Hooks pour validation et processing

**Key Deliverables** :
- [ ] Champs metadata supplementaires dans Media collection
- [ ] Configuration upload avec contraintes
- [ ] Hook afterChange pour logging/validation
- [ ] Types TypeScript mis a jour

**Files Affected** :

| File                         | Action | Changes                           |
| ---------------------------- | ------ | --------------------------------- |
| `src/collections/Media.ts`   | Modify | Enrichir avec metadata fields     |
| `src/payload-types.ts`       | Regen  | Types generes automatiquement     |

**Technical Notes** :

```typescript
// Champs a ajouter dans Media.ts
{
  name: 'mimeType',
  type: 'text',
  admin: { readOnly: true },
},
{
  name: 'filesize',
  type: 'number',
  admin: { readOnly: true },
},
```

**Cloudflare R2 Considerations** :
- Max upload via Workers binding : 100 MiB (Free), 200 MiB (Business)
- Types MIME supportes : tous (validation cote Payload)
- Metadata object : max 8,192 bytes

**Dependencies** : None (Story 2.1 fournit la base)

**Risk Assessment** : Low
- Plugin R2 deja configure et fonctionnel
- Modifications incrementales sur collection existante

**Success Criteria** :
- [ ] Collection Media accepte uploads
- [ ] Metadata auto-populated apres upload
- [ ] Types TypeScript generes sans erreur
- [ ] Build passe sans erreur

**Estimated Commits** :

| # | Description                                    |
| - | ---------------------------------------------- |
| 1 | Add metadata fields to Media collection        |
| 2 | Configure upload constraints and validation    |
| 3 | Add afterChange hook for metadata extraction   |
| 4 | Regenerate types and update exports            |

---

### Phase 2 : Integration Tests R2

**Objective** : Creer des tests d'integration validant le pipeline complet upload/stockage/recuperation R2.

**Scope** :
- Tests Vitest pour operations CRUD Media
- Validation stockage R2 via API Payload
- Tests erreurs et edge cases

**Key Deliverables** :
- [ ] Suite de tests integration `media-r2.int.spec.ts`
- [ ] Helpers de test pour fichiers/uploads
- [ ] Coverage des operations CRUD
- [ ] Tests edge cases (erreurs, limites)

**Files Affected** :

| File                                | Action | Changes                        |
| ----------------------------------- | ------ | ------------------------------ |
| `tests/int/media-r2.int.spec.ts`    | Create | Tests integration R2           |
| `tests/helpers/media.helpers.ts`    | Create | Helpers upload pour tests      |

**Technical Notes** :

```typescript
// Structure test integration
describe('Media R2 Storage Integration', () => {
  describe('Upload Operations', () => {
    it('should upload image file to R2 via Payload API')
    it('should store correct metadata in database')
    it('should generate accessible URL')
  })

  describe('Retrieval Operations', () => {
    it('should retrieve file metadata')
    it('should serve file content via URL')
  })

  describe('Delete Operations', () => {
    it('should remove file from R2 on delete')
    it('should clean up database record')
  })

  describe('Error Handling', () => {
    it('should reject files exceeding size limit')
    it('should reject unsupported MIME types')
    it('should handle R2 errors gracefully')
  })
})
```

**Cloudflare R2 Test Considerations** :
- En local : Wrangler simule R2 dans `.wrangler/state/r2`
- Operations identiques a production
- Pas besoin de bucket reel pour tests

**R2 API Operations Used** :

| Operation | Payload Action | R2 Method           |
| --------- | -------------- | ------------------- |
| Create    | POST /media    | `bucket.put()`      |
| Read      | GET /media/:id | `bucket.get()`      |
| Delete    | DELETE /media  | `bucket.delete()`   |

**Dependencies** : Phase 1 (Media collection enrichie)

**Risk Assessment** : Medium
- Comportement local peut differer de production
- Timing operations async R2

**Success Criteria** :
- [ ] Tous les tests passent en local
- [ ] Coverage > 80% operations CRUD
- [ ] Tests edge cases implementes
- [ ] CI integration fonctionnelle

**Estimated Commits** :

| # | Description                                    |
| - | ---------------------------------------------- |
| 1 | Create test helpers for media uploads          |
| 2 | Implement upload integration tests             |
| 3 | Add retrieval and delete tests                 |
| 4 | Add error handling and edge case tests         |

---

### Phase 3 : E2E Tests & Final Validation

**Objective** : Valider l'experience utilisateur complete via tests E2E et effectuer la validation finale en environnement preview.

**Scope** :
- Tests Playwright pour workflow admin complet
- Validation accessibilite formulaire upload
- Test en environnement preview Cloudflare
- Documentation limitations

**Key Deliverables** :
- [ ] Suite E2E `admin-media.e2e.spec.ts`
- [ ] Tests accessibilite upload form
- [ ] Validation preview Cloudflare
- [ ] Documentation contraintes Workers

**Files Affected** :

| File                                   | Action | Changes                      |
| -------------------------------------- | ------ | ---------------------------- |
| `tests/e2e/admin-media.e2e.spec.ts`    | Create | Tests E2E admin media        |
| `docs/guides/media-r2-constraints.md`  | Create | Documentation limitations    |

**Technical Notes** :

```typescript
// Structure test E2E
describe('Admin Media Upload E2E', () => {
  test('should upload image via admin form', async ({ page }) => {
    // Navigate to media creation
    // Fill form with file
    // Verify upload success
    // Check image in gallery
  })

  test('should display upload progress', async ({ page }) => {
    // Upload larger file
    // Verify progress indicator
  })

  test('should handle upload errors gracefully', async ({ page }) => {
    // Try invalid file type
    // Verify error message
  })

  test('should be accessible (WCAG 2.1 AA)', async ({ page }) => {
    // axe-core validation
  })
})
```

**Cloudflare Preview Validation** :

```bash
# Deployer en preview
pnpm build
pnpm exec wrangler deploy --env preview

# Valider manuellement
# 1. Acceder /admin/collections/media/create
# 2. Uploader image test
# 3. Verifier dans Cloudflare Dashboard R2
# 4. Acceder URL image
```

**R2 Limitations to Document** :

| Limitation                    | Value           | Workaround                    |
| ----------------------------- | --------------- | ----------------------------- |
| Max upload via binding        | 100 MiB (Free)  | Presigned URLs pour > 100 MiB |
| No sharp on Workers           | N/A             | Cloudflare Images transform   |
| Local R2 simulation           | .wrangler/state | Test preview pour prod-like   |

**Dependencies** : Phase 2 (tests integration)

**Risk Assessment** : Medium
- E2E peuvent etre flaky sur upload
- Preview deployment necessaire

**Success Criteria** :
- [ ] Tests E2E passent en CI
- [ ] Accessibilite validee (axe-core)
- [ ] Preview deployment fonctionne
- [ ] Documentation complete

**Estimated Commits** :

| # | Description                                    |
| - | ---------------------------------------------- |
| 1 | Create E2E test suite for admin media          |
| 2 | Add accessibility tests for upload form        |
| 3 | Create media R2 constraints documentation      |
| 4 | Final validation and cleanup                   |

---

## Implementation Order & Dependencies

### Dependency Graph

```
Phase 1: Media Collection Enhancement
    |
    | (Media collection enrichie)
    v
Phase 2: Integration Tests R2
    |
    | (Tests backend valides)
    v
Phase 3: E2E Tests & Validation
    |
    | (Story complete)
    v
[DONE]
```

### Critical Path

```
[Phase 1] ──> [Phase 2] ──> [Phase 3]
   1-2d         1-2d         1-2d
```

**Total : 3-6 days** (parallelisation limitee due aux dependances)

### Parallelization Opportunities

| Can Parallelize?          | Phases   | Notes                           |
| ------------------------- | -------- | ------------------------------- |
| Media fields + Hooks      | 1.1, 1.2 | Dans Phase 1                    |
| Int tests + Helpers       | 2.1, 2.2 | Dans Phase 2                    |
| E2E + Docs                | 3.1, 3.3 | Dans Phase 3                    |

---

## Timeline & Resource Estimation

### Phase Timeline

| Phase | Start     | End       | Duration | Blocking? |
| ----- | --------- | --------- | -------- | --------- |
| 1     | Day 1     | Day 2     | 1-2 days | No        |
| 2     | Day 2     | Day 4     | 1-2 days | Yes (P1)  |
| 3     | Day 4     | Day 5     | 1-2 days | Yes (P2)  |

### Resource Requirements

| Resource                  | Phases | Notes                           |
| ------------------------- | ------ | ------------------------------- |
| Dev environment           | All    | Wrangler avec R2 local          |
| Cloudflare Dashboard      | 3      | Validation bucket R2            |
| Preview deployment        | 3      | Test environnement prod-like    |

---

## Risk Assessment

### Phase-Level Risks

| Phase | Risk                        | Probability | Impact | Mitigation                    |
| ----- | --------------------------- | ----------- | ------ | ----------------------------- |
| 1     | Fields break existing data  | Low         | Medium | Migration si necessaire       |
| 2     | Local R2 differs from prod  | Medium      | Medium | Test preview avant merge      |
| 3     | E2E flaky on uploads        | Medium      | Low    | Retry logic, larger timeouts  |

### Story-Level Risks

| Risk                            | Probability | Impact | Mitigation                        |
| ------------------------------- | ----------- | ------ | --------------------------------- |
| Plugin R2 bugs on Workers       | Low         | High   | Template officiel valide          |
| Upload timeouts gros fichiers   | Medium      | Medium | Limiter taille 10 MB V1           |
| CORS issues                     | Low         | Medium | Servir via Worker, pas direct R2  |

---

## Testing Strategy

### Test Pyramid

```
         /\
        /  \
       / E2E \       <- Phase 3: Admin workflow
      /------\
     /  INT   \      <- Phase 2: R2 operations
    /----------\
   /   UNIT     \    <- Minimal (plugin Payload)
  /--------------\
```

### Coverage Goals

| Test Type   | Coverage Target | Focus Area                      |
| ----------- | --------------- | ------------------------------- |
| Unit        | N/A             | Plugin Payload (externe)        |
| Integration | 80%             | CRUD operations, error handling |
| E2E         | Critical paths  | Upload workflow, accessibility  |

### Test Environment

| Environment | Purpose             | R2 Source                  |
| ----------- | ------------------- | -------------------------- |
| Local       | Development         | Wrangler simulated R2      |
| CI          | Automated tests     | Wrangler simulated R2      |
| Preview     | Production-like     | Real R2 bucket (preview)   |
| Production  | Live                | Real R2 bucket             |

---

## Phase Documentation Strategy

### Documentation to Generate per Phase

| Phase | Documents                      | Priority |
| ----- | ------------------------------ | -------- |
| 1     | INDEX, IMPLEMENTATION_PLAN, COMMIT_CHECKLIST | High |
| 2     | INDEX, IMPLEMENTATION_PLAN, TESTING, COMMIT_CHECKLIST | High |
| 3     | INDEX, IMPLEMENTATION_PLAN, VALIDATION_CHECKLIST, REVIEW | High |

### Documentation Templates

Utiliser `/generate-phase-doc` pour chaque phase avec :
- Implementation details specifiques
- Commit checklist detaillee
- Validation steps

---

## Quality Gates

### Per-Phase Quality Gates

| Phase | Quality Gate                                    |
| ----- | ----------------------------------------------- |
| 1     | Types regeneres, build passe, lint OK           |
| 2     | Tests integration passent, coverage > 80%       |
| 3     | E2E passent, a11y OK, preview valide            |

### Story Completion Checklist

- [ ] Tous les Acceptance Criteria valides
- [ ] Tests automatises passent (int + E2E)
- [ ] Preview deployment fonctionne
- [ ] Documentation complete
- [ ] EPIC_TRACKING.md mis a jour

---

## Next Steps

1. **Generer Phase 1 docs** : `/generate-phase-doc Epic 2 Story 2.2 Phase 1`
2. **Implementer Phase 1** : Enrichir Media collection
3. **Valider Phase 1** : Build + types OK
4. **Continuer Phase 2** : Tests integration
5. **Finaliser Phase 3** : E2E + validation preview

---

## References

### Cloudflare R2 Documentation

| Topic                    | URL                                                           |
| ------------------------ | ------------------------------------------------------------- |
| R2 Getting Started       | https://developers.cloudflare.com/r2/get-started/             |
| R2 Workers API           | https://developers.cloudflare.com/r2/api/workers/workers-api-reference/ |
| R2 Limits                | https://developers.cloudflare.com/r2/platform/limits/         |
| R2 CORS                  | https://developers.cloudflare.com/r2/buckets/cors/            |
| R2 Presigned URLs        | https://developers.cloudflare.com/r2/api/s3/presigned-urls/   |

### Project References

| Document                 | Path                                              |
| ------------------------ | ------------------------------------------------- |
| Story Specification      | `story_2_2/story_2.2.md`                          |
| Epic Tracking            | `../EPIC_TRACKING.md`                             |
| PRD                      | `../../../PRD.md`                                 |
| Media Collection         | `../../../../src/collections/Media.ts`            |
| Payload Config           | `../../../../src/payload.config.ts`               |

---

## Appendix: Cloudflare R2 Quick Reference

### R2 Bucket Methods

```typescript
interface R2Bucket {
  put(key: string, value: ReadableStream | ArrayBuffer | string | null, options?: R2PutOptions): Promise<R2Object | null>
  get(key: string, options?: R2GetOptions): Promise<R2ObjectBody | null>
  head(key: string): Promise<R2Object | null>
  delete(key: string): Promise<void>
  delete(keys: string[]): Promise<void>
  list(options?: R2ListOptions): Promise<R2Objects>
}
```

### R2Object Properties

```typescript
interface R2Object {
  key: string
  version: string
  size: number
  etag: string
  httpEtag: string
  uploaded: Date
  httpMetadata?: R2HTTPMetadata
  customMetadata?: Record<string, string>
}
```

### Wrangler R2 Commands

```bash
# List buckets
wrangler r2 bucket list

# List objects in bucket
wrangler r2 object list <bucket-name>

# Get object
wrangler r2 object get <bucket-name>/<key>

# Delete object
wrangler r2 object delete <bucket-name>/<key>
```
