# Story 3.4 - CI Tests Integration & E2E Test Maintenance

## Phases Plan

**Story Reference**: Epic 3 Story 3.4
**Created**: 2025-12-05
**Total Phases**: 3
**Estimated Commits**: 8-12
**Complexity**: Medium

---

## Story Overview

### Objectives
1. Intégrer les tests unitaires, d'intégration et E2E au workflow CI quality-gate.yml
2. Nettoyer les tests E2E obsolètes
3. Valider que le pipeline complet fonctionne

### Context
Le workflow CI actuel (`quality-gate.yml`) contient uniquement des validations statiques :
- Socket.dev (supply chain security)
- ESLint, Prettier, Knip (code quality)
- Type Sync (Payload types)
- Next.js Build (compilation)
- dependency-cruiser (architecture)
- Stryker (mutation testing, optionnel)

**Manquant** : Exécution des tests (unitaires, intégration, E2E)

### Current Test Suite
```
tests/
├── unit/
│   ├── ensurePublishedAt.spec.ts
│   ├── calculateReadingTime.spec.ts
│   ├── lucide-icons.spec.ts
│   ├── serializeError.spec.ts
│   ├── blocks.spec.ts
│   ├── media-helpers.spec.ts
│   └── validators.spec.ts
├── int/
│   ├── articles.int.spec.ts
│   ├── api.int.spec.ts
│   └── media-r2.int.spec.ts
└── e2e/
    ├── admin-media.e2e.spec.ts
    ├── frontend.e2e.spec.ts
    ├── design-system.e2e.spec.ts
    └── navigation.e2e.spec.ts
```

---

## Phase Breakdown

### Phase 1: CI Workflow - Unit & Integration Tests
**Objective**: Ajouter l'exécution des tests unitaires et d'intégration au workflow CI

**Deliverables**:
- Step "Unit Tests" dans quality-gate.yml (Layer 2)
- Step "Integration Tests" dans quality-gate.yml (Layer 2)
- Génération de rapport de couverture (summary)

**Files Affected**:
- `.github/workflows/quality-gate.yml`

**Commits** (~3):
1. `test(ci): add unit tests step to quality-gate workflow`
2. `test(ci): add integration tests step to quality-gate workflow`
3. `test(ci): add coverage summary to test output`

**Risk**: Low - Tests unitaires et d'intégration sont déjà fonctionnels localement

**Success Criteria**:
- [ ] `pnpm test:unit` exécuté dans CI
- [ ] `pnpm test:int` exécuté dans CI avec PAYLOAD_SECRET
- [ ] Workflow échoue si les tests échouent

---

### Phase 2: CI Workflow - E2E Tests
**Objective**: Ajouter l'exécution des tests E2E au workflow CI

**Deliverables**:
- Installation des browsers Playwright en CI
- Step "E2E Tests" dans quality-gate.yml (Layer 3, après build)
- Upload des artifacts en cas d'échec
- Cache des browsers Playwright

**Files Affected**:
- `.github/workflows/quality-gate.yml`

**Commits** (~4):
1. `test(ci): add Playwright browsers installation step`
2. `test(ci): add E2E tests step after Next.js build`
3. `test(ci): configure E2E test artifacts upload on failure`
4. `test(ci): add Playwright browsers caching for faster CI`

**Risk**: Medium - E2E tests peuvent être flaky, nécessitent serveur de dev

**Dependencies**:
- Phase 1 (tests unitaires/intégration d'abord)
- Next.js Build step (doit passer avant E2E)

**Technical Notes**:
- Playwright webServer config démarre automatiquement le serveur de dev
- Timeout recommandé: 10 minutes pour les E2E
- Artifacts: `test-results/` et `playwright-report/`

**Success Criteria**:
- [ ] Browsers Playwright installés en CI
- [ ] `pnpm test:e2e` exécuté après le build
- [ ] Artifacts uploadés en cas d'échec
- [ ] Cache des browsers fonctionnel

---

### Phase 3: E2E Test Maintenance & Documentation
**Objective**: Nettoyer les tests E2E obsolètes et mettre à jour la documentation

**Deliverables**:
- Révision de `design-system.e2e.spec.ts` pour tests pérennes
- Mise à jour de la documentation CI (CLAUDE.md, CI-CD-Security.md)
- Validation que tous les tests passent

**Files Affected**:
- `tests/e2e/design-system.e2e.spec.ts`
- `docs/specs/CI-CD-Security.md`
- `CLAUDE.md`

**Commits** (~4):
1. `test(e2e): make design-system tests resilient to homepage changes`
2. `docs(ci): document test integration in CI-CD-Security.md`
3. `docs: update CLAUDE.md with test CI commands`
4. `test(ci): validate complete quality-gate pipeline`

**Risk**: Low - Documentation et ajustements mineurs

**E2E Tests Review**:

| Test File | Test Name | Decision | Reason |
|-----------|-----------|----------|--------|
| design-system | headings use Nunito Sans | KEEP | Pérenne, teste la config Tailwind |
| design-system | code uses JetBrains Mono | MODIFY | Ajouter `.count() > 0` fallback |
| design-system | focus rings visible | KEEP | Pérenne, a11y |
| design-system | axe-core audits | KEEP | Pérenne, a11y obligatoire |
| design-system | dark color-scheme | KEEP | Pérenne, design system |
| design-system | admin panel isolation | KEEP | Pérenne, séparation admin/frontend |

**Success Criteria**:
- [ ] Tous les tests E2E passent localement
- [ ] Tous les tests E2E passent en CI
- [ ] Documentation à jour
- [ ] Pas de tests obsolètes ou flaky

---

## Implementation Order

```
Phase 1: CI Unit & Integration Tests
    │
    ├── Low risk, quick win
    │
    ▼
Phase 2: CI E2E Tests
    │
    ├── Depends on Phase 1
    ├── Requires build step completion
    │
    ▼
Phase 3: E2E Maintenance & Documentation
    │
    └── Final polish and validation
```

---

## Timeline Estimation

| Phase | Commits | Complexity | Risk |
|-------|---------|------------|------|
| Phase 1 | 3 | Low | Low |
| Phase 2 | 4 | Medium | Medium |
| Phase 3 | 4 | Low | Low |
| **Total** | **11** | **Medium** | **Low-Medium** |

---

## Risk Assessment

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| E2E tests flaky en CI | Medium | Medium | Retry mechanism, stable selectors |
| Playwright install slow | Low | Low | Cache browsers |
| Dev server startup timeout | Medium | Low | Increase webServer timeout |
| PAYLOAD_SECRET missing | High | Low | Fallback CI secret generation |

### Mitigation Strategies

1. **Flaky Tests**: Utiliser `test.retry(2)` dans playwright.config.ts
2. **Slow CI**: Cache les browsers Playwright entre les runs
3. **Timeouts**: Configurer des timeouts généreux (10 minutes pour E2E)
4. **Artifacts**: Toujours uploader traces/screenshots en cas d'échec

---

## Testing Strategy

### Local Validation (Before Each Phase)
```bash
# Phase 1 validation
pnpm test:unit
pnpm test:int

# Phase 2 validation
pnpm test:e2e

# Phase 3 validation
pnpm test  # All tests
```

### CI Validation
- Créer une PR vers main après chaque phase
- Vérifier que le workflow quality-gate.yml passe
- Monitorer les temps d'exécution

---

## Quality Gate Updates

### Before Story 3.4
```
Layer 1: Supply Chain Security (Socket)
Layer 2: Code Quality (ESLint, Prettier, Knip, Type Sync)
Layer 3: Build Validation (Next.js Build)
Layer 4: Architecture (dependency-cruiser)
Layer 5: Mutation Testing (Stryker, optional)
```

### After Story 3.4
```
Layer 1: Supply Chain Security (Socket)
Layer 2: Code Quality (ESLint, Prettier, Knip, Type Sync)
Layer 2b: Unit & Integration Tests (NEW)
Layer 3: Build Validation (Next.js Build)
Layer 3b: E2E Tests (NEW)
Layer 4: Architecture (dependency-cruiser)
Layer 5: Mutation Testing (Stryker, optional)
```

---

## Workflow Summary (Final State)

```yaml
# quality-gate.yml (simplified)
jobs:
  quality-gate:
    steps:
      # Setup
      - Checkout
      - Setup pnpm/Node.js

      # Layer 1: Supply Chain
      - Socket Firewall
      - Install dependencies

      # Layer 2: Code Quality
      - ESLint
      - Prettier
      - Knip
      - Type Sync
      - Unit Tests        # NEW
      - Integration Tests # NEW

      # Layer 3: Build
      - Next.js Build
      - Install Playwright # NEW
      - E2E Tests          # NEW

      # Layer 4: Architecture
      - dependency-cruiser

      # Layer 5: Mutation (optional)
      - Stryker
```

---

## Next Steps

After completing Story 3.4:
1. Mark Story 3.4 as COMPLETED in EPIC_TRACKING.md
2. Verify CI pipeline runs successfully on PRs
3. Continue with remaining Epic 3 work (Story 3.2 Phase 4, Story 3.3 implementation)

---

## Related Documents

- [Story Specification](../story_3.4.md)
- [CI-CD-Security.md](../../../../../CI-CD-Security.md)
- [EPIC_TRACKING.md](../../EPIC_TRACKING.md)
- [Playwright Configuration](../../../../../playwright.config.ts)
- [Vitest Configuration](../../../../../vitest.config.ts)

---

**Plan Created**: 2025-12-05
**Last Updated**: 2025-12-05
