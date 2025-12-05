# Phase 1: Implementation Plan

**Phase**: CI Unit & Integration Tests
**Commits**: 3
**Risk**: Low

---

## Commit Sequence

### Commit 1: Add Unit Tests Step
**Message**: `✅ test(ci): add unit tests step to quality-gate workflow`

**Files Modified**:
- `.github/workflows/quality-gate.yml`

**Changes**:
```yaml
# Add after "Knip - Dead Code Detection" step (Layer 2: Code Quality)

- name: Unit Tests
  run: pnpm test:unit
```

**Position in Workflow**: After Knip, before "Generate Payload Types"

**Rationale**: Tests unitaires sont rapides et ne nécessitent pas de secrets

---

### Commit 2: Add Integration Tests Step
**Message**: `✅ test(ci): add integration tests step to quality-gate workflow`

**Files Modified**:
- `.github/workflows/quality-gate.yml`

**Changes**:
```yaml
# Add after "Unit Tests" step

- name: Integration Tests
  env:
    PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET || env.PAYLOAD_SECRET_CI }}
  run: pnpm test:int
```

**Position in Workflow**: After Unit Tests, before "Generate Payload Types"

**Rationale**:
- Tests d'intégration peuvent nécessiter PAYLOAD_SECRET pour initialiser Payload
- Utilisent le fallback CI secret si le secret n'est pas configuré

---

### Commit 3: Add Coverage Summary
**Message**: `✅ test(ci): add coverage summary output for unit tests`

**Files Modified**:
- `.github/workflows/quality-gate.yml`

**Changes**:
```yaml
# Update Unit Tests step to include coverage
- name: Unit Tests
  run: pnpm test:unit --coverage

- name: Coverage Summary
  if: always()
  run: |
    if [ -f coverage/coverage-summary.json ]; then
      echo "## Unit Test Coverage" >> $GITHUB_STEP_SUMMARY
      echo "" >> $GITHUB_STEP_SUMMARY
      cat coverage/coverage-summary.json | jq -r '.total | "| Metric | Coverage |\n|--------|----------|\n| Lines | \(.lines.pct)% |\n| Statements | \(.statements.pct)% |\n| Functions | \(.functions.pct)% |\n| Branches | \(.branches.pct)% |"' >> $GITHUB_STEP_SUMMARY
    fi
```

**Rationale**:
- Affiche un résumé de couverture dans le Job Summary GitHub
- `if: always()` pour afficher même si les tests échouent
- Utilise `jq` pour parser le JSON (disponible sur ubuntu-latest)

---

## Final Workflow Structure (After Phase 1)

```yaml
# ============================================
# LAYER 2: Code Quality
# ============================================

- name: ESLint
  run: pnpm lint --format stylish

- name: Prettier Check
  run: pnpm exec prettier --check .

- name: Knip - Dead Code Detection
  run: pnpm exec knip --production

# NEW: Tests (Phase 1)
- name: Unit Tests
  run: pnpm test:unit --coverage

- name: Coverage Summary
  if: always()
  run: |
    if [ -f coverage/coverage-summary.json ]; then
      echo "## Unit Test Coverage" >> $GITHUB_STEP_SUMMARY
      # ... (coverage output)
    fi

- name: Integration Tests
  env:
    PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET || env.PAYLOAD_SECRET_CI }}
  run: pnpm test:int

# Existing steps continue...
- name: Generate Payload Types
  # ...
```

---

## Validation Points

### After Commit 1
- [ ] `pnpm test:unit` runs in CI
- [ ] Workflow fails if unit tests fail

### After Commit 2
- [ ] `pnpm test:int` runs in CI
- [ ] PAYLOAD_SECRET is available (or fallback works)
- [ ] Workflow fails if integration tests fail

### After Commit 3
- [ ] Coverage summary appears in Job Summary
- [ ] Coverage is displayed even if tests fail

---

## Rollback Strategy

If issues occur:
1. Revert the specific commit
2. Tests in CI can be temporarily skipped by commenting out steps
3. No breaking changes to existing workflow behavior

---

## Notes

### Why Layer 2 (Code Quality)?
- Tests unitaires et d'intégration valident la qualité du code
- Ils s'exécutent AVANT le build pour fail-fast
- Pas de dépendance au build Next.js

### PAYLOAD_SECRET Handling
- Le workflow génère déjà un CI fallback secret si non configuré
- Ce mécanisme est réutilisé pour les tests d'intégration
- Voir step "Generate CI Payload Secret" existant

### Coverage Configuration
- Vitest doit être configuré pour générer `coverage-summary.json`
- Vérifier `vitest.config.ts` pour la config coverage

---

**Plan Created**: 2025-12-05
