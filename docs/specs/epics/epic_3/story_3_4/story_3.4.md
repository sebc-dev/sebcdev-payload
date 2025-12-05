# Story 3.4 - CI Tests Integration & E2E Test Maintenance

**Epic**: 3 - Frontend Core & Design System
**Status**: NOT STARTED
**Created**: 2025-12-05

---

## Story Description

**En tant que** Lead Tech,
**Je veux** intégrer les tests unitaires, d'intégration et E2E au workflow CI, et maintenir la suite de tests E2E,
**Afin de** garantir la qualité du code et détecter les régressions avant merge.

---

## Story Objectives

Cette story complète le pipeline Quality Gate en ajoutant l'exécution des tests :

1. **Intégration CI des tests unitaires** (Vitest) dans le workflow quality-gate.yml
2. **Intégration CI des tests d'intégration** (Vitest) dans le workflow quality-gate.yml
3. **Intégration CI des tests E2E** (Playwright) dans le workflow quality-gate.yml
4. **Nettoyage des tests E2E obsolètes** suite aux évolutions de la Story 3.3
5. **Ajout de tests E2E manquants** pour les nouveaux composants (Header, Footer, Navigation, Mobile Menu)

---

## Acceptance Criteria

### AC1: Tests Unitaires dans CI
- [ ] Step "Unit Tests" ajouté au workflow quality-gate.yml (Layer 2: Code Quality)
- [ ] Exécution via `pnpm test:unit`
- [ ] Échec du workflow si les tests échouent
- [ ] Rapport de couverture généré (coverage summary dans les logs)

### AC2: Tests d'Intégration dans CI
- [ ] Step "Integration Tests" ajouté au workflow quality-gate.yml (Layer 2: Code Quality)
- [ ] Exécution via `pnpm test:int`
- [ ] Échec du workflow si les tests échouent

### AC3: Tests E2E dans CI
- [ ] Step "E2E Tests" ajouté au workflow quality-gate.yml (Layer 3: Build Validation)
- [ ] Exécution APRÈS le build Next.js (dépendance)
- [ ] Installation de Playwright browsers en CI
- [ ] Exécution via `pnpm test:e2e`
- [ ] Artifacts des traces/screenshots en cas d'échec
- [ ] Timeout approprié pour les tests E2E (5-10 minutes)

### AC4: Nettoyage des Tests E2E Obsolètes
- [ ] Identifier et supprimer les tests E2E qui testent du contenu provisoire
- [ ] Supprimer le test "Button variants" de la homepage (section de démonstration à retirer)
- [ ] Réviser les tests de `design-system.e2e.spec.ts` pour ne garder que les tests pérennes
- [ ] S'assurer que tous les tests E2E passent avant merge

### AC5: Tests E2E pour Story 3.3 (Navigation)
- [ ] Tests Header visibilité et sticky behavior (existants dans navigation.e2e.spec.ts)
- [ ] Tests Navigation desktop et mobile (existants)
- [ ] Tests Language Switcher fonctionnel (existants)
- [ ] Tests Mobile Menu (Sheet) open/close (existants)
- [ ] Tests Keyboard navigation (existants)
- [ ] Tests Skip Link (existants)
- [ ] Tests Footer visibility et liens (existants)
- [ ] Tests axe-core accessibilité (existants)

### AC6: Validation du Pipeline Complet
- [ ] Le workflow quality-gate.yml passe avec tous les tests
- [ ] Documentation mise à jour dans CLAUDE.md et docs/specs/CI-CD-Security.md
- [ ] Les tests n'ajoutent pas de temps excessif au pipeline (< 10 minutes total)

---

## Technical Requirements

### Dependencies
- **Story 3.1** (i18n Routing): COMPLETED - Requis pour les tests de localisation
- **Story 3.2** (Design System): IN PROGRESS - Requis pour les tests du design system
- **Story 3.3** (Layout Global): IN PROGRESS - Les composants à tester

### CI Workflow Modifications

```yaml
# Layer 2: Code Quality (après Knip, avant Build)
- name: Unit Tests
  run: pnpm test:unit

- name: Integration Tests
  env:
    PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET || env.PAYLOAD_SECRET_CI }}
  run: pnpm test:int

# Layer 3: Build Validation (après Next.js Build)
- name: Install Playwright Browsers
  run: pnpm exec playwright install --with-deps chromium

- name: E2E Tests
  env:
    PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET || env.PAYLOAD_SECRET_CI }}
  run: pnpm test:e2e

- name: Upload E2E Test Artifacts
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: test-results/
    retention-days: 7
```

### Tests E2E à Réviser

| Fichier | Test | Status | Action |
|---------|------|--------|--------|
| `frontend.e2e.spec.ts` | homepage loads | KEEP | Test pérenne |
| `frontend.e2e.spec.ts` | CSS variables defined | KEEP | Test pérenne |
| `frontend.e2e.spec.ts` | locale switching | KEEP | Test pérenne |
| `design-system.e2e.spec.ts` | headings use Nunito Sans | KEEP | Test pérenne |
| `design-system.e2e.spec.ts` | code uses JetBrains Mono | REVIEW | Le `<code>` dans "edit this page" peut changer |
| `design-system.e2e.spec.ts` | focus rings visible | KEEP | Test pérenne (a11y) |
| `design-system.e2e.spec.ts` | axe-core FR/EN | KEEP | Test pérenne (a11y) |
| `design-system.e2e.spec.ts` | dark color-scheme | KEEP | Test pérenne |
| `design-system.e2e.spec.ts` | CSS variables defined | KEEP | Test pérenne |
| `design-system.e2e.spec.ts` | admin panel isolation | KEEP | Test pérenne |
| `navigation.e2e.spec.ts` | (tous) | KEEP | Tests Story 3.3 |
| `admin-media.e2e.spec.ts` | (tous) | KEEP | Tests Story 2.2 |

### Homepage Provisoire à Nettoyer

La homepage actuelle (`src/app/[locale]/(frontend)/page.tsx`) contient du contenu de démonstration :
- Section "Variantes de boutons" (lignes 66-81) - **À SUPPRIMER ou DÉPLACER**
- Image Payload logo - **À REMPLACER par le vrai contenu**

**Note**: Le nettoyage de la homepage est hors scope de cette story (sera fait dans Epic 4 ou 5).
Les tests E2E doivent être écrits pour fonctionner avec la homepage finale, pas le contenu provisoire.

---

## File Changes

### Files to Modify
1. `.github/workflows/quality-gate.yml` - Ajouter steps de tests
2. `tests/e2e/design-system.e2e.spec.ts` - Réviser tests obsolètes
3. `docs/specs/CI-CD-Security.md` - Documenter l'ajout des tests
4. `CLAUDE.md` - Mettre à jour la documentation CI

### Files to Keep (Already Good)
- `tests/e2e/frontend.e2e.spec.ts` - Tests homepage basiques
- `tests/e2e/navigation.e2e.spec.ts` - Tests complets Story 3.3
- `tests/e2e/admin-media.e2e.spec.ts` - Tests admin media
- `tests/unit/*.spec.ts` - Tests unitaires
- `tests/int/*.int.spec.ts` - Tests d'intégration

---

## Risk Assessment

### Risques Techniques

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Tests E2E flaky en CI | Moyen | Moyenne | Retry mechanism, timeouts appropriés |
| Temps CI trop long | Faible | Faible | Cache Playwright browsers |
| Échec sur homepage provisoire | Moyen | Haute | Écrire tests résilients au contenu |

### Dépendances Critiques
- Les tests E2E nécessitent un serveur de dev qui démarre (webServer config Playwright)
- PAYLOAD_SECRET requis pour les tests d'intégration et E2E

---

## Testing Strategy

### Tests à Exécuter Localement Avant PR
```bash
pnpm test:unit      # Doit passer
pnpm test:int       # Doit passer
pnpm test:e2e       # Doit passer
pnpm lint           # Doit passer
pnpm build          # Doit passer
```

### Validation CI
- Créer une PR avec les modifications
- Vérifier que le workflow quality-gate.yml passe complètement
- Vérifier les temps d'exécution de chaque step

---

## Definition of Done

- [ ] Tous les tests (unit, int, e2e) exécutés dans CI
- [ ] Workflow quality-gate.yml passe sur PR
- [ ] Documentation mise à jour
- [ ] Aucun test E2E obsolète ou flaky
- [ ] Temps total CI < 15 minutes

---

## Related Documents

- [PRD.md](../../../../PRD.md) - ENF6 (AI-Shield CI/CD)
- [CI-CD-Security.md](../../../../CI-CD-Security.md) - Architecture de sécurité CI
- [EPIC_TRACKING.md](../../EPIC_TRACKING.md) - Epic 3 progress
- [Story 3.3](../story_3_3/story_3.3.md) - Layout & Navigation (source des tests E2E)

---

**Story Created**: 2025-12-05
**Last Updated**: 2025-12-05
