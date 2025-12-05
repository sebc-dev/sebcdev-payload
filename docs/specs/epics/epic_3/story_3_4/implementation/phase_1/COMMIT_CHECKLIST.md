# Phase 1: Commit Checklist

**Phase**: CI Unit & Integration Tests
**Total Commits**: 3

---

## Commit 1: Add Unit Tests Step

### Pre-commit
- [x] Tests unitaires passent localement: `pnpm test:unit`
- [x] Workflow actuel est valide (pas d'erreurs de syntaxe YAML)

### Changes
- [x] Ajouter step "Unit Tests" dans `.github/workflows/quality-gate.yml`
- [x] Positionner après "Knip - Dead Code Detection"
- [x] Utiliser `run: pnpm test:unit`

### Post-commit
- [x] Syntaxe YAML valide
- [x] Commit message: `✅ test(ci): add unit tests step to quality-gate workflow`

### Commit Command
```bash
git add .github/workflows/quality-gate.yml
git commit -m "$(cat <<'EOF'
✅ test(ci): add unit tests step to quality-gate workflow

Add unit tests execution to the quality-gate CI workflow.
Tests run after Knip dead code detection in Layer 2 (Code Quality).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Commit 2: Add Integration Tests Step

### Pre-commit
- [x] Tests d'intégration passent localement: `pnpm test:int`
- [x] Commit 1 appliqué

### Changes
- [x] Ajouter step "Integration Tests" dans `.github/workflows/quality-gate.yml`
- [x] Positionner après "Unit Tests"
- [x] Ajouter `env.PAYLOAD_SECRET` avec fallback CI secret
- [x] Utiliser `run: pnpm test:int`

### Post-commit
- [x] Syntaxe YAML valide
- [x] PAYLOAD_SECRET référencé correctement
- [x] Commit message: `✅ test(ci): add integration tests step to quality-gate workflow`

### Commit Command
```bash
git add .github/workflows/quality-gate.yml
git commit -m "$(cat <<'EOF'
✅ test(ci): add integration tests step to quality-gate workflow

Add integration tests execution to the quality-gate CI workflow.
Uses PAYLOAD_SECRET with CI fallback for Payload initialization.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Commit 3: Add Coverage Summary

### Pre-commit
- [x] Commits 1 et 2 appliqués
- [x] Vérifier que vitest génère `coverage/coverage-summary.json`
- [x] `pnpm test:unit --coverage` génère le fichier

### Changes
- [x] Modifier step "Unit Tests" pour ajouter `--coverage`
- [x] Ajouter step "Coverage Summary" avec `if: always()`
- [x] Parser JSON avec `jq` pour afficher dans Job Summary

### Post-commit
- [x] Syntaxe YAML valide
- [x] Script bash correct (pas d'erreurs de syntaxe)
- [x] Commit message: `✅ test(ci): add coverage summary output for unit tests`

### Commit Command
```bash
git add .github/workflows/quality-gate.yml
git commit -m "$(cat <<'EOF'
✅ test(ci): add coverage summary output for unit tests

Add coverage reporting to the unit tests step.
Coverage summary is displayed in GitHub Job Summary.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Phase Completion

### Final Validation
- [x] Tous les commits appliqués
- [x] Workflow YAML syntaxiquement correct
- [x] Tests locaux passent toujours
- [x] PR créée ou prête à créer

### Files Modified
- `.github/workflows/quality-gate.yml`

### Next Steps
- [x] Passer à Phase 2: CI E2E Tests
- [x] Tous les commits appliqués avec succès

---

**Checklist Created**: 2025-12-05
