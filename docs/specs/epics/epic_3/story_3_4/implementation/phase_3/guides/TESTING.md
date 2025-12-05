# Phase 3: Testing Guide

**Phase**: E2E Test Maintenance & Documentation

---

## Test Strategy

### What We're Testing
- Resilience des tests E2E aux changements de contenu
- Exactitude de la documentation
- Pipeline CI complet

### What We're NOT Testing
- Fonctionnalité des tests (déjà couverte)
- Workflow CI lui-même (Phases 1 et 2)

---

## Local Testing

### Before Changes

```bash
# Établir la baseline
pnpm test:e2e

# Vérifier le test spécifique
pnpm exec playwright test tests/e2e/design-system.e2e.spec.ts --reporter=list
```

### After Commit 1 (Resilient Tests)

```bash
# Test normal - devrait passer
pnpm exec playwright test tests/e2e/design-system.e2e.spec.ts

# Vérifier le comportement de skip
# 1. Le test passe si <code> existe
# 2. Le test skip si <code> n'existe pas

# Pour tester le skip (temporairement):
# - Modifier la homepage pour retirer <code>
# - Exécuter le test
# - Vérifier qu'il skip avec le bon message
# - Revert les changements
```

### After Commits 2-3 (Documentation)

```bash
# Vérifier que les commandes documentées fonctionnent
pnpm lint
pnpm test:unit
pnpm test:int
pnpm build
pnpm test:e2e
pnpm depcruise

# Toutes doivent passer ✓
```

### Final Validation (Commit 4)

```bash
# Pipeline complet local
pnpm lint && \
pnpm test:unit && \
pnpm test:int && \
pnpm build && \
pnpm test:e2e && \
pnpm depcruise

# Si tout passe, prêt pour CI
```

---

## Expected Results

### Resilient Test Output

**With `<code>` element present:**
```
  ✓ code elements use JetBrains Mono font (1.2s)
```

**Without `<code>` element:**
```
  - code elements use JetBrains Mono font (skipped)
    └─ No code elements found on homepage
```

### Full Pipeline Output

```bash
> pnpm lint
✓ No ESLint errors

> pnpm test:unit
✓ 7 test files passed

> pnpm test:int
✓ 3 test files passed

> pnpm build
✓ Build completed

> pnpm test:e2e
✓ 4 test files passed

> pnpm depcruise
✓ No violations
```

---

## CI Testing

### Verify Complete Pipeline

1. **Push changes to feature branch**
2. **Open/Update PR**
3. **Monitor workflow execution**

### Check Each Layer

| Layer | Expected Status | Check |
|-------|----------------|-------|
| Supply Chain | ✓ Pass | Socket scan clean |
| Code Quality | ✓ Pass | ESLint, Prettier, Knip |
| Unit Tests | ✓ Pass | All tests pass |
| Integration Tests | ✓ Pass | All tests pass |
| Build | ✓ Pass | Next.js compiles |
| E2E Tests | ✓ Pass | Playwright tests pass |
| Architecture | ✓ Pass | No violations |

### Timing Expectations

| Step | Expected Duration |
|------|-------------------|
| Setup | ~1 min |
| Layer 1-2 | ~2 min |
| Unit/Int Tests | ~1 min |
| Build | ~2 min |
| E2E Tests | ~5 min |
| Architecture | ~30s |
| **Total** | **< 15 min** |

---

## Failure Scenarios

### Scenario 1: Resilient Test Still Fails

**Expected**: Test skips gracefully
**Actual**: Test fails

**Debug Steps**:
1. Check if selector is correct: `page.locator('code')`
2. Verify skip condition: `if (codeCount === 0)`
3. Check for other assertions in the test
4. Review test logs for actual error

### Scenario 2: Documentation Commands Fail

**Expected**: `pnpm test:unit` works
**Actual**: Command not found

**Debug Steps**:
1. Verify package.json scripts
2. Check for typos in documentation
3. Ensure dependencies are installed

### Scenario 3: CI Fails After Documentation Update

**Expected**: No change to CI behavior
**Actual**: CI fails

**Debug Steps**:
1. Documentation changes shouldn't affect CI
2. Check if other files were modified
3. Verify workflow YAML unchanged

---

## Test Coverage

### Phase 3 Coverage

| Change | Tested By |
|--------|-----------|
| Resilient test modification | `pnpm test:e2e` |
| CI-CD-Security.md | Manual review |
| CLAUDE.md | Manual review |
| Pipeline validation | Full CI run |

### What's Not Covered

- Markdown rendering (manual verification)
- Link validation in docs (manual verification)

---

## Documentation Verification

### CI-CD-Security.md Checklist
- [ ] Layer 2b section added
- [ ] Layer 3b section added
- [ ] Commands are correct
- [ ] Consistent with actual workflow

### CLAUDE.md Checklist
- [ ] Layer numbering updated
- [ ] Commands list updated
- [ ] Order matches workflow
- [ ] No outdated information

---

## Rollback Plan

### If Tests Break

```bash
# Revert test changes
git checkout HEAD~1 -- tests/e2e/design-system.e2e.spec.ts
```

### If Documentation Wrong

```bash
# Revert documentation
git checkout HEAD~1 -- docs/specs/CI-CD-Security.md
git checkout HEAD~1 -- CLAUDE.md
```

---

**Testing Guide Created**: 2025-12-05
