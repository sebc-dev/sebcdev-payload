# Phase 2: CI E2E Tests

**Story**: 3.4 - CI Tests Integration & E2E Test Maintenance
**Phase**: 2 of 3
**Status**: COMPLETED
**Estimated Commits**: 4

---

## Phase Overview

### Objective
Ajouter l'exécution des tests E2E (Playwright) au workflow CI `quality-gate.yml`.

### Deliverables
1. Installation des browsers Playwright en CI
2. Step "E2E Tests" après le build Next.js
3. Upload des artifacts (traces/screenshots) en cas d'échec
4. Cache des browsers Playwright pour accélérer les runs

### Success Criteria
- [ ] Browsers Playwright installés en CI
- [ ] `pnpm test:e2e` exécuté après le build Next.js
- [ ] Artifacts uploadés en cas d'échec
- [ ] Cache des browsers fonctionnel

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
# 1. Vérifier que Phase 1 est complétée

# 2. Vérifier que les tests E2E passent localement
pnpm test:e2e

# 3. Modifier le workflow CI
# Suivre COMMIT_CHECKLIST.md pour chaque commit

# 4. Valider
# Suivre validation/VALIDATION_CHECKLIST.md
```

---

## Dependencies

### Required Before This Phase
- **Phase 1** complétée (tests unitaires et intégration dans CI)
- Tests E2E fonctionnels (`tests/e2e/*.e2e.spec.ts`)
- Configuration Playwright (`playwright.config.ts`)

### Technical Dependencies
- Next.js Build step doit passer AVANT les tests E2E
- Le serveur de dev doit démarrer (webServer config Playwright)

---

**Phase Created**: 2025-12-05
