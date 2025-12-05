# Phase 1: Testing Guide

**Phase**: CI Unit & Integration Tests

---

## Test Strategy

### What We're Testing
- L'intégration des tests unitaires dans le workflow CI
- L'intégration des tests d'intégration dans le workflow CI
- La génération du rapport de couverture

### What We're NOT Testing
- Les tests eux-mêmes (déjà couverts par les test suites)
- Le workflow de déploiement
- Les tests E2E (Phase 2)

---

## Local Testing

### Before Any Changes

```bash
# Établir la baseline - tous les tests doivent passer
pnpm test:unit
pnpm test:int

# Vérifier la génération de coverage
pnpm test:unit --coverage
ls -la coverage/
# Doit contenir: coverage-summary.json
```

### After Each Commit

```bash
# Valider que les tests passent toujours
pnpm test:unit
pnpm test:int

# Valider la syntaxe YAML
npx yaml-lint .github/workflows/quality-gate.yml
```

---

## CI Testing

### Trigger the Workflow

**Option 1: Pull Request**
```bash
# Créer une branche
git checkout -b feat/story-3.4-ci-tests

# Commiter les changements
# ... suivre COMMIT_CHECKLIST.md

# Pusher
git push -u origin feat/story-3.4-ci-tests

# Ouvrir une PR vers main
# Le workflow se déclenchera automatiquement
```

**Option 2: Manual Dispatch**
1. Aller sur GitHub Actions
2. Sélectionner "Quality Gate"
3. Cliquer "Run workflow"
4. Sélectionner la branche

### Verify Workflow Execution

1. **Check Unit Tests Step**
   - Status: ✅ Success
   - Logs: Tests exécutés, tous passent
   - Duration: < 1 minute

2. **Check Integration Tests Step**
   - Status: ✅ Success
   - Logs: Tests exécutés avec PAYLOAD_SECRET
   - Duration: < 1 minute

3. **Check Coverage Summary**
   - Status: ✅ Success (même si tests échouent)
   - Job Summary: Table de couverture affichée

---

## Expected Results

### Unit Tests Output (Logs)

```
> pnpm test:unit --coverage

 ✓ tests/unit/ensurePublishedAt.spec.ts (3 tests)
 ✓ tests/unit/calculateReadingTime.spec.ts (5 tests)
 ✓ tests/unit/lucide-icons.spec.ts (2 tests)
 ...

 Test Files  7 passed
 Tests       25 passed
 Duration    2.5s

Coverage:
  Lines:      85%
  Statements: 84%
  Functions:  90%
  Branches:   78%
```

### Integration Tests Output (Logs)

```
> pnpm test:int

 ✓ tests/int/articles.int.spec.ts (4 tests)
 ✓ tests/int/api.int.spec.ts (3 tests)
 ✓ tests/int/media-r2.int.spec.ts (2 tests)

 Test Files  3 passed
 Tests       9 passed
 Duration    5.2s
```

### Job Summary Output

```markdown
## Unit Test Coverage

| Metric | Coverage |
|--------|----------|
| Lines | 85% |
| Statements | 84% |
| Functions | 90% |
| Branches | 78% |
```

---

## Failure Scenarios

### Scenario 1: Unit Test Fails

**Expected Behavior**:
- Step "Unit Tests" shows ❌
- Workflow stops
- Coverage Summary still runs (if: always())
- PR blocked

**Verification**:
```bash
# Locally introduce a failing test
# Edit a test to fail, then run:
pnpm test:unit
# Expected: Test fails
```

### Scenario 2: Integration Test Fails

**Expected Behavior**:
- Step "Integration Tests" shows ❌
- Workflow stops
- PR blocked

**Verification**:
```bash
# Skip a required mock, then run:
pnpm test:int
# Expected: Test fails due to missing dependency
```

### Scenario 3: PAYLOAD_SECRET Missing

**Expected Behavior**:
- CI fallback secret is generated
- Tests use the fallback
- Tests pass

**Verification**:
- Remove PAYLOAD_SECRET from GitHub Secrets (if testing)
- Or verify the existing fallback mechanism works

---

## Rollback Testing

### If Phase 1 Causes Issues

```bash
# Revert all Phase 1 commits
git revert HEAD~3..HEAD

# Or comment out the new steps temporarily
# Edit .github/workflows/quality-gate.yml:
# - name: Unit Tests
#   run: pnpm test:unit
```

---

## Performance Baseline

### Expected Durations

| Step | Expected Duration |
|------|-------------------|
| Unit Tests | < 30s |
| Coverage Summary | < 5s |
| Integration Tests | < 60s |
| **Total Added** | **< 2 minutes** |

### If Too Slow

1. Check for slow tests
2. Consider test parallelization
3. Review test setup/teardown

---

**Testing Guide Created**: 2025-12-05
