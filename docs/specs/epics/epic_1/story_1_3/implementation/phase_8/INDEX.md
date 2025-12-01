# Phase 8: Mutation Testing (Stryker)

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Phase**: 8 of 8
**Status**: 📋 READY FOR IMPLEMENTATION
**PRD Phase**: Phase 3 - Advanced (CA8)

---

## 📋 Quick Reference

| Attribute          | Value                                                 |
| ------------------ | ----------------------------------------------------- |
| **Objective**      | Configurer Stryker pour valider la qualité des tests  |
| **Duration**       | 1-2 days                                              |
| **Commits**        | 4-5                                                   |
| **Risk Level**     | 🟢 Low                                                |
| **Dependencies**   | Phase 1 (Workflow Foundation), Tests unitaires existants |
| **Blocks**         | None (final phase)                                    |

---

## 🎯 Phase Objective

Configurer **Stryker Mutator** pour le mutation testing sur les modules critiques du projet. Le mutation testing vérifie que les tests existants détectent réellement les bugs en introduisant des mutations (changements artificiels) dans le code source et en vérifiant que les tests échouent.

### Pourquoi le Mutation Testing?

Les tests générés par IA peuvent être des "faux positifs" - des tests qui passent toujours, même si la logique est cassée. Stryker altère le code source et vérifie que les tests échouent, garantissant ainsi la robustesse des tests.

**Exemple de mutation**:
```typescript
// Code original
function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// Mutation 1 : Stryker remplace '+' par '-'
function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum - item.price, 0) // ⚠️ Mutant
}
```

Si le test passe toujours après la mutation, c'est un **test superficiel**.

---

## 📦 Scope & Deliverables

### In Scope

- Installation de `@stryker-mutator/core` et `@stryker-mutator/vitest-runner`
- Configuration `stryker.config.mjs` ciblée sur modules critiques
- Input `run_mutation_tests` dans `workflow_dispatch` pour activation optionnelle
- Thresholds de couverture de mutation (high: 80, low: 60, break: 50)
- Mode incrémental pour accélérer les runs successifs
- Rapport dans GitHub Job Summary

### Out of Scope

- Mutation testing sur l'ensemble du codebase (trop CPU-intensif)
- Intégration avec dashboard Stryker externe
- Tests de mutation sur les composants UI (complexité)

---

## 📁 Files Affected

| File                                  | Action   | Description                              |
| ------------------------------------- | -------- | ---------------------------------------- |
| `stryker.config.mjs`                  | new      | Configuration Stryker avec Vitest runner |
| `.github/workflows/quality-gate.yml`  | modified | Ajout step Stryker conditionnel          |
| `package.json`                        | modified | Script `stryker` et dépendances dev      |
| `docs/specs/CI-CD-Security.md`        | modified | Documentation technique Stryker          |

---

## ✅ Success Criteria

- [ ] Stryker s'exécute correctement quand activé via `workflow_dispatch`
- [ ] Score de mutation > 50% sur les modules ciblés (`src/lib/`)
- [ ] Temps d'exécution < 15 minutes
- [ ] Rapport visible dans GitHub Actions Summary
- [ ] Aucune mutation non détectée dans les fonctions critiques
- [ ] Mode incrémental fonctionnel pour les runs successifs

---

## 🔗 Related Documentation

- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) - Plan d'implémentation détaillé
- [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) - Checklist par commit
- [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) - Configuration environnement
- [guides/TESTING.md](./guides/TESTING.md) - Guide de test
- [guides/REVIEW.md](./guides/REVIEW.md) - Guide de revue de code
- [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) - Checklist de validation

### External References

- [Stryker Mutator Documentation](https://stryker-mutator.io/docs/)
- [Stryker Vitest Runner](https://stryker-mutator.io/docs/stryker-js/vitest-runner)
- [CI-CD Security Architecture](../../../../CI-CD-Security.md) - Section 9.1

---

## 📊 Progress Tracking

| Commit | Description                          | Status |
| ------ | ------------------------------------ | ------ |
| 1      | Install Stryker dependencies         | ⬜     |
| 2      | Create stryker.config.mjs            | ⬜     |
| 3      | Add Stryker step to workflow         | ⬜     |
| 4      | Configure incremental mode & reports | ⬜     |
| 5      | Update documentation                 | ⬜     |

---

**Phase Created**: 2025-12-01
**Last Updated**: 2025-12-01
**Created by**: Claude Code (phase-doc-generator)
