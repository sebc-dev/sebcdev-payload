# Phase 3: Commit Checklist

**Phase**: E2E Test Maintenance & Documentation
**Total Commits**: 4

---

## Commit 1: Make Design System Tests Resilient

### Pre-commit
- [ ] Phases 1 et 2 complétées
- [ ] Identifier les tests fragiles dans design-system.e2e.spec.ts
- [ ] Comprendre pourquoi le test peut échouer

### Changes
- [ ] Modifier test "code uses JetBrains Mono font"
- [ ] Ajouter vérification `count() === 0` avec `test.skip()`
- [ ] S'assurer que le test passe quand `<code>` existe

### Post-commit
- [ ] Test passe localement
- [ ] Test skip gracefully si pas de `<code>`
- [ ] Commit message correct

### Commit Command
```bash
git add tests/e2e/design-system.e2e.spec.ts
git commit -m "$(cat <<'EOF'
✅ test(e2e): make design-system tests resilient to homepage changes

Skip JetBrains Mono font test if no code elements found.
Prevents false failures when homepage content changes.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Commit 2: Document Test Integration in CI-CD-Security.md

### Pre-commit
- [ ] Commit 1 appliqué
- [ ] Lire le fichier CI-CD-Security.md actuel
- [ ] Identifier où ajouter la documentation des tests

### Changes
- [ ] Ajouter section "Layer 2b: Test Execution"
- [ ] Documenter Unit Tests et Integration Tests
- [ ] Ajouter section "Layer 3b: E2E Tests"
- [ ] Documenter Playwright configuration et test files

### Post-commit
- [ ] Documentation claire et complète
- [ ] Pas d'erreurs de formatage Markdown
- [ ] Commit message correct

### Commit Command
```bash
git add docs/specs/CI-CD-Security.md
git commit -m "$(cat <<'EOF'
📝 docs(ci): document test integration in CI-CD-Security.md

Add documentation for:
- Layer 2b: Unit and Integration Tests (Vitest)
- Layer 3b: E2E Tests (Playwright)
- Test file purposes and CI configuration

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Commit 3: Update CLAUDE.md with CI Test Commands

### Pre-commit
- [ ] Commits 1 et 2 appliqués
- [ ] Lire la section CI/CD de CLAUDE.md
- [ ] Identifier les sections à mettre à jour

### Changes
- [ ] Mettre à jour "Quality Gate Workflow" avec les layers de tests
- [ ] Ajouter les commandes de test dans la liste des checks locaux
- [ ] S'assurer que l'ordre des layers est correct

### Post-commit
- [ ] Documentation cohérente avec le workflow actuel
- [ ] Commandes testables
- [ ] Commit message correct

### Commit Command
```bash
git add CLAUDE.md
git commit -m "$(cat <<'EOF'
📝 docs: update CLAUDE.md with test CI commands

Document unit, integration, and E2E test layers in Quality Gate.
Add test commands to local pre-push checklist.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Commit 4: Validate Complete Quality Gate Pipeline

### Pre-commit
- [ ] Commits 1, 2, et 3 appliqués
- [ ] Tous les tests passent localement

### Validation Steps
```bash
# 1. Run all local checks
pnpm lint
pnpm test:unit
pnpm test:int
pnpm build
pnpm test:e2e
pnpm depcruise

# 2. All should pass ✓
```

### CI Validation
- [ ] Push la branche
- [ ] Ouvrir/mettre à jour la PR
- [ ] Vérifier que le workflow complet passe
- [ ] Noter les temps d'exécution

### Post-validation
- [ ] Workflow CI passe complètement
- [ ] Temps total < 15 minutes
- [ ] Documenter les résultats

### Commit Command (validation commit - optional)
```bash
# Ce commit est optionnel - seulement si des ajustements sont nécessaires
git add .
git commit -m "$(cat <<'EOF'
✅ test(ci): validate complete quality-gate pipeline

Verify all quality gate layers execute successfully:
- Unit tests, Integration tests, E2E tests
- All existing layers (lint, build, architecture)
- Acceptable execution time

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Phase Completion

### Final Validation
- [ ] Tous les commits appliqués
- [ ] Tous les tests passent localement
- [ ] Workflow CI passe
- [ ] Documentation à jour

### Files Modified
- `tests/e2e/design-system.e2e.spec.ts`
- `docs/specs/CI-CD-Security.md`
- `CLAUDE.md`

### Story 3.4 Completion
- [ ] Marquer Story 3.4 comme COMPLETED dans EPIC_TRACKING.md
- [ ] Mettre à jour le progress (3/3 phases)

---

**Checklist Created**: 2025-12-05
