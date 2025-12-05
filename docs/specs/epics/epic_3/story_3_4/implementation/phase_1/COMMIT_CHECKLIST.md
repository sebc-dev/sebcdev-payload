# Phase 1: Commit Checklist

**Phase**: CI Unit & Integration Tests
**Total Commits**: 3

---

## Commit 1: Add Unit Tests Step

### Pre-commit
- [ ] Tests unitaires passent localement: `pnpm test:unit`
- [ ] Workflow actuel est valide (pas d'erreurs de syntaxe YAML)

### Changes
- [ ] Ajouter step "Unit Tests" dans `.github/workflows/quality-gate.yml`
- [ ] Positionner après "Knip - Dead Code Detection"
- [ ] Utiliser `run: pnpm test:unit`

### Post-commit
- [ ] Syntaxe YAML valide
- [ ] Commit message: `✅ test(ci): add unit tests step to quality-gate workflow`

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
- [ ] Tests d'intégration passent localement: `pnpm test:int`
- [ ] Commit 1 appliqué

### Changes
- [ ] Ajouter step "Integration Tests" dans `.github/workflows/quality-gate.yml`
- [ ] Positionner après "Unit Tests"
- [ ] Ajouter `env.PAYLOAD_SECRET` avec fallback CI secret
- [ ] Utiliser `run: pnpm test:int`

### Post-commit
- [ ] Syntaxe YAML valide
- [ ] PAYLOAD_SECRET référencé correctement
- [ ] Commit message: `✅ test(ci): add integration tests step to quality-gate workflow`

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
- [ ] Commits 1 et 2 appliqués
- [ ] Vérifier que vitest génère `coverage/coverage-summary.json`
- [ ] `pnpm test:unit --coverage` génère le fichier

### Changes
- [ ] Modifier step "Unit Tests" pour ajouter `--coverage`
- [ ] Ajouter step "Coverage Summary" avec `if: always()`
- [ ] Parser JSON avec `jq` pour afficher dans Job Summary

### Post-commit
- [ ] Syntaxe YAML valide
- [ ] Script bash correct (pas d'erreurs de syntaxe)
- [ ] Commit message: `✅ test(ci): add coverage summary output for unit tests`

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
- [ ] Tous les commits appliqués
- [ ] Workflow YAML syntaxiquement correct
- [ ] Tests locaux passent toujours
- [ ] PR créée ou prête à créer

### Files Modified
- `.github/workflows/quality-gate.yml`

### Next Steps
- Passer à Phase 2: CI E2E Tests
- OU créer PR pour validation CI

---

**Checklist Created**: 2025-12-05
