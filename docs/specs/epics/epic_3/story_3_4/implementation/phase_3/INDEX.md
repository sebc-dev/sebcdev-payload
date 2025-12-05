# Phase 3: E2E Test Maintenance & Documentation

**Story**: 3.4 - CI Tests Integration & E2E Test Maintenance
**Phase**: 3 of 3
**Status**: NOT STARTED
**Estimated Commits**: 4

---

## Phase Overview

### Objective
Nettoyer les tests E2E obsolètes et mettre à jour la documentation CI.

### Deliverables
1. Tests E2E résilients aux changements de contenu provisoire
2. Documentation CI mise à jour (CI-CD-Security.md)
3. CLAUDE.md mis à jour avec les nouvelles commandes CI
4. Validation complète du pipeline

### Success Criteria
- [ ] Tous les tests E2E passent localement et en CI
- [ ] Pas de tests dépendants de contenu provisoire
- [ ] Documentation à jour
- [ ] Pipeline Quality Gate complet et fonctionnel

---

## Phase Documents

| Document | Description |
|----------|-------------|
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Détail des commits et modifications |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) | Checklist par commit |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Configuration de l'environnement |
| [guides/REVIEW.md](./guides/REVIEW.md) | Guide de revue de code |
| [guides/TESTING.md](./guides/TESTING.md) | Stratégie de test |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Checklist de validation finale |

---

## Quick Start

```bash
# 1. Vérifier que Phases 1 et 2 sont complétées

# 2. Réviser les tests E2E
cat tests/e2e/design-system.e2e.spec.ts

# 3. Appliquer les modifications
# Suivre COMMIT_CHECKLIST.md pour chaque commit

# 4. Valider le pipeline complet
pnpm test  # unit + int + e2e
```

---

## Dependencies

### Required Before This Phase
- **Phase 1** complétée (tests unit/int dans CI)
- **Phase 2** complétée (tests E2E dans CI)
- Workflow quality-gate.yml fonctionnel

---

## E2E Tests to Review

| File | Test | Status | Action |
|------|------|--------|--------|
| `design-system.e2e.spec.ts` | code uses JetBrains Mono | MODIFY | Ajouter fallback si pas de `<code>` |
| `frontend.e2e.spec.ts` | all tests | KEEP | Tests stables |
| `navigation.e2e.spec.ts` | all tests | KEEP | Tests Story 3.3 |
| `admin-media.e2e.spec.ts` | all tests | KEEP | Tests Story 2.2 |

---

**Phase Created**: 2025-12-05
