# Story 1.4 - Phases Implementation Plan

**Story**: Adaptation du Pipeline de Déploiement
**Epic**: Epic 1 - Foundation & Cloudflare Architecture
**Created**: 2025-11-29
**Status**: In Progress (Phase 2 Completed)

---

## Story Overview

### Original Story Specification

**Location**: `docs/specs/epics/epic_1/story_1_4/story_1.4.md`

**Story Objective**: Conditionner le déploiement Cloudflare (`wrangler deploy`) à la réussite préalable de la "Quality Gate" et configurer une pipeline de déploiement sécurisée avec authentification OIDC. Cette story établit le dernier maillon de la chaîne de sécurité CI/CD, garantissant qu'aucun code non validé ne peut atteindre la production.

**Acceptance Criteria**:

- CA1: Branch Protection Configuration
- CA2: Deployment Workflow Integration
- CA3: Cloudflare OIDC Authentication
- CA4: Wrangler Deploy Integration
- CA5: Deployment Validation
- CA6: Rollback Strategy Documentation

**User Value**: Protection absolue contre les déploiements de code non conforme, traçabilité complète des déploiements, et élimination des risques liés aux secrets statiques via OIDC.

---

## Phase Breakdown Strategy

### Why 4 Phases?

Cette story est décomposée en **4 phases atomiques** basées sur:

**Technical dependencies**: Configuration progressive depuis les protections jusqu'au déploiement complet
**Risk mitigation**: Chaque phase est testable indépendamment
**Incremental value**: Dès Phase 1, la branche est protégée; Phase 2 ajoute le déploiement basique
**PRD Alignment**: Respecte la stratégie "Quality Gate obligatoire" de ENF6
**Testing strategy**: Chaque phase peut être validée sur une branche de test

### Atomic Phase Principles

Chaque phase suit ces principes:

- **Independent**: Peut être implémentée et testée séparément
- **Deliverable**: Produit une fonctionnalité CI tangible et vérifiable
- **Sized appropriately**: 1-2 jours de travail par phase
- **Low coupling**: Dépendances minimales entre phases
- **High cohesion**: Chaque phase configure un aspect spécifique du pipeline

### Implementation Approach

```
[Phase 1] → [Phase 2] → [Phase 3] → [Phase 4]
    ↓           ↓           ↓           ↓
Branch      Deploy      OIDC        Docs &
Protection  Workflow    Auth        Validation
```

### Complexity Assessment

**Story Complexity**: Medium (4 phases)

- Configuration workflow principalement
- Pas de code applicatif nouveau
- Intégration avec services externes (Cloudflare, GitHub)
- Documentation importante requise

---

## Phases Summary

### Phase 1: Branch Protection & Quality Gate Enforcement

**Objective**: Configurer les règles de protection de branche GitHub pour rendre le Quality Gate obligatoire avant tout merge vers `main`.

**Scope**:

- Configuration des branch protection rules via GitHub UI
- Documentation de la configuration (pour reproductibilité)
- Script/guide de vérification de la configuration
- Test de la protection (tentative de merge sans quality-gate)

**Dependencies**:

- Story 1.3 Phase 1+ (Quality Gate workflow doit exister)

**Key Deliverables**:

- [ ] Branch protection rules configurées sur `main`
- [ ] Documentation des règles dans `docs/guides/`
- [ ] Vérification que les merges directs sont bloqués
- [ ] Vérification que `quality-gate` est requis

**Files Affected** (~2 files):

- `docs/guides/BRANCH_PROTECTION.md` (new)
- `docs/specs/epics/epic_1/story_1_4/implementation/phase_1/` (validation docs)

**Estimated Complexity**: Low
**Estimated Duration**: 0.5-1 day (2-3 commits)
**Risk Level**: Low

**Success Criteria**:

- [ ] Impossible de merger une PR sans `quality-gate` passing
- [ ] Force push bloqué sur `main`
- [ ] Documentation complète et reproductible

**Technical Notes**:

- Configuration via GitHub Settings > Branches > Branch protection rules
- Status check requis: `quality-gate` (job name from workflow)
- Possibilité d'ajouter `deploy` comme status check plus tard (Phase 2)
- Ne nécessite PAS de code, seulement de la configuration UI + documentation

---

### Phase 2: Deployment Workflow Creation

**Objective**: Créer le workflow de déploiement qui s'exécute uniquement après la réussite du Quality Gate, en utilisant d'abord l'API Token existant.

**Scope**:

- Extension de `quality-gate.yml` avec un job `deploy`
- Configuration `needs: [quality-gate]` pour garantir l'ordre
- Intégration de `wrangler deploy` avec Cloudflare
- Exécution des migrations D1 avant déploiement
- Ajout du pattern `wait-for-url` pour validation

**Dependencies**:

- Phase 1 (Branch protection configurée)
- Cloudflare API Token dans GitHub Secrets

**Key Deliverables**:

- [ ] Job `deploy` ajouté à `quality-gate.yml`
- [ ] Migrations D1 exécutées (`pnpm payload migrate`)
- [ ] `wrangler deploy` intégré avec API Token
- [ ] Wait-for-url validation après déploiement
- [ ] URL de déploiement dans GitHub Summary

**Files Affected** (~3 files):

- `.github/workflows/quality-gate.yml` (modified - add deploy job)
- `package.json` (ajout scripts si nécessaire)
- `docs/guides/DEPLOYMENT.md` (new)

**Estimated Complexity**: Medium
**Estimated Duration**: 1-2 days (3-4 commits)
**Risk Level**: Medium

**Risk Factors**:

- Migrations D1 peuvent échouer
- Temps de propagation Cloudflare variable

**Mitigation Strategies**:

- Dry-run migrations en local avant push
- Timeout généreux pour wait-for-url (60s+)
- Continue-on-error pour le smoke test initial

**Success Criteria**:

- [ ] Job `deploy` s'exécute uniquement si `quality-gate` passe
- [ ] Migrations D1 exécutées avec succès
- [ ] Site accessible après déploiement
- [ ] URL visible dans GitHub Actions Summary

**Technical Notes**:

- Utiliser `CLOUDFLARE_API_TOKEN` et `CLOUDFLARE_ACCOUNT_ID` secrets
- Wrangler action: `cloudflare/wrangler-action@v3`
- Variable `PAYLOAD_SECRET` nécessaire pour les migrations
- Le job `deploy` hérite des permissions du workflow

---

### Phase 3: OIDC Authentication Migration

**Objective**: Migrer de l'API Token statique vers l'authentification OIDC pour éliminer les secrets longue durée.

**Scope**:

- Configuration de l'Identity Provider Cloudflare
- Mise à jour du workflow avec `id-token: write` permission
- Modification du job deploy pour utiliser OIDC
- Fallback gracieux si OIDC non configuré
- Test de l'authentification OIDC

**Dependencies**:

- Phase 2 (Deployment workflow fonctionnel)
- Accès admin au compte Cloudflare

**Key Deliverables**:

- [ ] Guide de configuration OIDC Cloudflare
- [ ] Workflow mis à jour avec `id-token: write`
- [ ] Job deploy utilisant OIDC (ou fallback API Token)
- [ ] Validation que le déploiement fonctionne avec OIDC

**Files Affected** (~3 files):

- `.github/workflows/quality-gate.yml` (modified - OIDC permissions)
- `docs/guides/CLOUDFLARE_OIDC.md` (new)
- `docs/guides/DEPLOYMENT.md` (updated)

**Estimated Complexity**: Medium
**Estimated Duration**: 1-2 days (3-4 commits)
**Risk Level**: Medium

**Risk Factors**:

- Configuration OIDC côté Cloudflare peut être complexe
- Permissions JWT peuvent être mal configurées

**Mitigation Strategies**:

- Fallback conditionnel: si OIDC échoue, utiliser API Token
- Documentation pas-à-pas avec screenshots
- Test sur branche feature avant merge

**Success Criteria**:

- [ ] Déploiement réussi via OIDC (sans API Token)
- [ ] Logs montrent l'utilisation du JWT éphémère
- [ ] Documentation OIDC complète et testée

**Technical Notes**:

- Cloudflare OIDC provider: `https://cloudflare.com/cdn-cgi/access/oidc`
- Audience: `cloudflare-workers`
- Claims requis: `iss`, `sub`, `aud`, `exp`
- Token lifetime: ~1h (suffisant pour un déploiement)
- Référence: docs/specs/CI-CD-Security.md Section 5.1

---

### Phase 4: Validation & Rollback Documentation

**Objective**: Finaliser la pipeline avec des validations supplémentaires, documenter la stratégie de rollback, et créer un guide complet du workflow développeur.

**Scope**:

- Ajout de smoke tests post-déploiement
- Documentation de la stratégie de rollback
- Guide du workflow développeur complet
- Mise à jour du CLAUDE.md avec les nouvelles commandes
- Validation E2E du pipeline complet

**Dependencies**:

- Phase 3 (OIDC configuré)

**Key Deliverables**:

- [ ] Smoke test validant les endpoints critiques
- [ ] Documentation rollback (manuel via Cloudflare dashboard)
- [ ] Guide workflow développeur
- [ ] CLAUDE.md mis à jour
- [ ] Pipeline validé de bout en bout

**Files Affected** (~5 files):

- `.github/workflows/quality-gate.yml` (modified - smoke tests)
- `docs/guides/ROLLBACK.md` (new)
- `docs/guides/DEVELOPER_WORKFLOW.md` (new or updated)
- `CLAUDE.md` (updated - CI/CD section)
- `docs/specs/epics/epic_1/story_1_4/` (validation docs)

**Estimated Complexity**: Low
**Estimated Duration**: 1 day (2-3 commits)
**Risk Level**: Low

**Success Criteria**:

- [ ] Smoke tests vérifient `/` et `/admin` accessibles
- [ ] Documentation rollback claire et testée
- [ ] Workflow développeur documenté de bout en bout
- [ ] CLAUDE.md reflète les nouveaux workflows

**Technical Notes**:

- Smoke test: simple curl avec retry
- Rollback: via Cloudflare Dashboard > Workers > Deployments
- Ne pas implémenter de rollback automatique (out of scope)
- Focus sur la documentation et la maintenabilité

---

## Implementation Order & Dependencies

### Dependency Graph

```
Phase 1 (Branch Protection)
    ↓
Phase 2 (Deploy Workflow)
    ↓
Phase 3 (OIDC Migration)
    ↓
Phase 4 (Validation & Docs)
```

### Critical Path

**Strict sequential order required**:

1. Phase 1 → Phase 2 → Phase 3 → Phase 4

Chaque phase dépend de la précédente car:

- Phase 2 teste sur une branche protégée (Phase 1)
- Phase 3 modifie le workflow créé en Phase 2
- Phase 4 documente l'ensemble du système

### Blocking Dependencies

**Phase 1 blocks**:

- Phase 2: Le déploiement doit être testé avec branch protection active

**Phase 2 blocks**:

- Phase 3: L'OIDC remplace l'API Token configuré en Phase 2

**Phase 3 blocks**:

- Phase 4: La documentation finale doit refléter la configuration OIDC

---

## Timeline & Resource Estimation

### Overall Estimates

| Metric                   | Estimate            | Notes                          |
| ------------------------ | ------------------- | ------------------------------ |
| **Total Phases**         | 4                   | Sequential, tight dependencies |
| **Total Duration**       | 4-6 days            | Sequential implementation      |
| **Total Commits**        | ~10-14              | Across all phases              |
| **Total Files**          | ~8 new, ~3 modified | Mostly documentation           |
| **Test Coverage Target** | N/A                 | Infrastructure/config story    |

### Per-Phase Timeline

| Phase | Name              | Duration | Commits | Start After | Blocks  |
| ----- | ----------------- | -------- | ------- | ----------- | ------- |
| 1     | Branch Protection | 0.5-1d   | 2-3     | Story 1.3   | Phase 2 |
| 2     | Deploy Workflow   | 1-2d     | 3-4     | Phase 1     | Phase 3 |
| 3     | OIDC Migration    | 1-2d     | 3-4     | Phase 2     | Phase 4 |
| 4     | Validation & Docs | 1d       | 2-3     | Phase 3     | -       |

### Resource Requirements

**Team Composition**:

- 1 developer: DevOps/CI-CD expertise
- Admin access: GitHub repository settings
- Admin access: Cloudflare account (for OIDC)

**External Dependencies**:

- Cloudflare Account: API Token (Phase 2), OIDC (Phase 3)
- GitHub Settings: Branch protection configuration
- Story 1.3: Quality Gate workflow functional

---

## Risk Assessment

### High-Risk Phases

**Phase 3: OIDC Migration**

- **Risk**: Configuration OIDC complexe, permissions mal configurées
- **Impact**: Déploiement échoue, fallback sur API Token nécessaire
- **Mitigation**: Fallback conditionnel, documentation détaillée
- **Contingency**: Garder API Token comme backup permanent

**Phase 2: Deploy Workflow**

- **Risk**: Migrations D1 échouent, propagation Cloudflare lente
- **Impact**: Déploiement en attente ou échoue
- **Mitigation**: Dry-run migrations, timeouts généreux
- **Contingency**: Manual deployment via CLI si workflow échoue

### Overall Story Risks

| Risk                          | Likelihood | Impact | Mitigation                            |
| ----------------------------- | ---------- | ------ | ------------------------------------- |
| OIDC configuration failure    | Medium     | Medium | API Token fallback                    |
| Migration D1 failure          | Low        | High   | Dry-run, manual rollback              |
| Cloudflare propagation delays | Medium     | Low    | Generous timeouts, retry logic        |
| Branch protection blocks dev  | Low        | Medium | Clear documentation, bypass for admin |

---

## Testing Strategy

### Test Coverage by Phase

| Phase              | Unit Tests | Integration Tests       | E2E Tests     |
| ------------------ | ---------- | ----------------------- | ------------- |
| 1. Branch Protect  | N/A        | Manual PR test          | -             |
| 2. Deploy Workflow | N/A        | Workflow execution test | Smoke test    |
| 3. OIDC Migration  | N/A        | OIDC auth test          | Deploy test   |
| 4. Validation      | N/A        | Full pipeline test      | All endpoints |

### Test Milestones

- **After Phase 1**: PR cannot merge without quality-gate
- **After Phase 2**: Successful deployment to Cloudflare
- **After Phase 3**: Deployment via OIDC (no static secrets)
- **After Phase 4**: Complete pipeline validation

### Quality Gates

Each phase must pass:

- [ ] Configuration/code changes applied successfully
- [ ] Manual verification of expected behavior
- [ ] Documentation complete and accurate
- [ ] No regression in existing functionality

---

## Phase Documentation Strategy

### Documentation to Generate per Phase

For each phase, use the `phase-doc-generator` skill to create:

1. INDEX.md
2. IMPLEMENTATION_PLAN.md
3. COMMIT_CHECKLIST.md
4. ENVIRONMENT_SETUP.md
5. guides/REVIEW.md
6. guides/TESTING.md
7. validation/VALIDATION_CHECKLIST.md

**Estimated documentation**: ~3000 lines per phase x 4 phases = **~12,000 lines**

### Story-Level Documentation

**This document** (PHASES_PLAN.md):

- Strategic overview
- Phase coordination
- Cross-phase dependencies
- Overall timeline

**Phase-level documentation** (generated separately):

- Tactical implementation details
- Commit-by-commit checklists
- Specific technical validations

---

## Next Steps

### Immediate Actions

1. **Review this plan** with the team
   - Validate phase breakdown makes sense
   - Adjust estimates if needed
   - Confirm Cloudflare access for OIDC

2. **Verify prerequisites**

   ```bash
   # Check Story 1.3 status
   cat docs/specs/epics/epic_1/EPIC_TRACKING.md | grep "Story 1.3"

   # Verify quality-gate.yml exists
   ls -la .github/workflows/quality-gate.yml

   # Check Cloudflare wrangler config
   cat wrangler.jsonc | head -20
   ```

3. **Generate detailed documentation for Phase 1**
   - Use command: `/generate-phase-doc Epic 1 Story 1.4 Phase 1`
   - Or request: "Generate implementation docs for Phase 1 of Story 1.4"

### Implementation Workflow

For each phase:

1. **Plan** (if not done):
   - Read PHASES_PLAN.md for phase overview
   - Generate detailed docs with `phase-doc-generator`

2. **Implement**:
   - Follow IMPLEMENTATION_PLAN.md
   - Use COMMIT_CHECKLIST.md for each commit
   - Validate after each commit

3. **Review**:
   - Use guides/REVIEW.md
   - Ensure all success criteria met

4. **Validate**:
   - Complete validation/VALIDATION_CHECKLIST.md
   - Update this plan with actual metrics

5. **Move to next phase**:
   - Repeat process for next phase

### Progress Tracking

Update this document as phases complete:

- [x] Phase 1: Branch Protection & Quality Gate Enforcement - Status: ✅ COMPLETED, Actual duration: ~1h, Notes: Branch protection configured via GitHub UI, documentation created
- [x] Phase 2: Deployment Workflow Creation - Status: ✅ COMPLETED, Actual duration: ~30min, Notes: 4 commits, deploy job with D1 migrations, wrangler deploy, validation
- [ ] Phase 3: OIDC Authentication Migration - Status: 📋 NOT STARTED, Actual duration: \_, Notes: \_
- [ ] Phase 4: Validation & Rollback Documentation - Status: 📋 NOT STARTED, Actual duration: \_, Notes: \_

---

## Success Metrics

### Story Completion Criteria

This story is considered complete when:

- [ ] All 4 phases implemented and validated
- [ ] Branch protection active and tested
- [ ] Deployment workflow functional (via OIDC preferred)
- [ ] Documentation complete (Branch protection, OIDC, Rollback, Workflow)
- [ ] CLAUDE.md updated with new CI/CD commands
- [ ] No static API tokens required (OIDC fully functional)

### Quality Metrics

| Metric                    | Target                      | Actual |
| ------------------------- | --------------------------- | ------ |
| Deployment Success Rate   | > 95%                       | -      |
| Time to Deploy            | < 5 min                     | -      |
| OIDC Adoption             | 100%                        | -      |
| Documentation Coverage    | 100% of acceptance criteria | -      |
| Zero unauthorized deploys | 100%                        | -      |

---

## Reference Documents

### Story Specification

- Original spec: `docs/specs/epics/epic_1/story_1_4/story_1.4.md`

### Related Documentation

- **PRD**: `docs/specs/PRD.md` - Story 1.4 (lines 307-308)
- **CI-CD Security**: `docs/specs/CI-CD-Security.md` - Sections 5, 11
- **Quality Gate**: `.github/workflows/quality-gate.yml`
- **Wrangler Config**: `wrangler.jsonc`

### External Documentation

- Cloudflare OIDC: https://developers.cloudflare.com/workers/wrangler/ci-cd/github-actions/#oidc
- GitHub Branch Protection: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches
- Wrangler Action: https://github.com/cloudflare/wrangler-action

### Generated Phase Documentation

- Phase 1: `docs/specs/epics/epic_1/story_1_4/implementation/phase_1/INDEX.md` (to generate)
- Phase 2: `docs/specs/epics/epic_1/story_1_4/implementation/phase_2/INDEX.md` (to generate)
- Phase 3: `docs/specs/epics/epic_1/story_1_4/implementation/phase_3/INDEX.md` (to generate)
- Phase 4: `docs/specs/epics/epic_1/story_1_4/implementation/phase_4/INDEX.md` (to generate)

---

**Plan Created**: 2025-11-29
**Last Updated**: 2025-11-29
**Created by**: Claude Code (story-phase-planner skill)
**Story Status**: In Progress (2/4 Phases Completed)
