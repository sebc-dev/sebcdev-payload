# Phase 2: Testing Guide

**Phase**: CI E2E Tests

---

## Test Strategy

### What We're Testing
- Installation de Playwright browsers en CI
- Exécution des tests E2E après le build
- Upload des artifacts en cas d'échec
- Caching des browsers

### What We're NOT Testing
- Les tests E2E eux-mêmes (déjà couverts)
- Les tests unitaires/intégration (Phase 1)
- Le nettoyage des tests (Phase 3)

---

## Local Testing

### Before Any Changes

```bash
# Établir la baseline
pnpm test:e2e
# Tous les tests doivent passer

# Vérifier les artifacts générés (simuler échec)
# Modifier un test pour échouer, puis:
pnpm test:e2e
ls -la test-results/
ls -la playwright-report/
```

### Verify Playwright Configuration

```bash
# Version Playwright
pnpm exec playwright --version

# Browsers installés
pnpm exec playwright show-browser-path chromium
```

---

## CI Testing

### First Run (No Cache)

1. **Push changes**
   ```bash
   git push origin feat/story-3.4-ci-tests
   ```

2. **Verify Steps Execute**
   - [ ] "Get Playwright Version" outputs version
   - [ ] "Cache Playwright Browsers" reports cache miss
   - [ ] "Install Playwright Browsers" runs
   - [ ] "E2E Tests" executes
   - [ ] "Upload E2E Test Artifacts" skipped (if tests pass)

3. **Check Timings**
   - Install: ~1-2 minutes
   - E2E Tests: ~3-5 minutes

### Second Run (With Cache)

1. **Re-run workflow** (sans changements)

2. **Verify Cache Hit**
   - [ ] "Cache Playwright Browsers" reports cache hit
   - [ ] "Install Playwright Browsers" skipped
   - [ ] E2E Tests run faster

### Failure Scenario

1. **Temporarily break a test**
   ```typescript
   // tests/e2e/frontend.e2e.spec.ts
   test('broken test', async ({ page }) => {
     await expect(page.locator('nonexistent')).toBeVisible()
   })
   ```

2. **Push and verify**
   - [ ] E2E Tests step fails
   - [ ] "Upload E2E Test Artifacts" runs
   - [ ] Artifacts available in workflow summary

3. **Revert the broken test**

---

## Expected Results

### E2E Tests Output (Logs)

```
> pnpm test:e2e

Running 4 test files using 1 worker

  frontend.e2e.spec.ts
    ✓ can go on homepage (2.1s)
    ✓ homepage uses design system CSS variables (1.8s)
    ✓ locale switching works (2.3s)

  navigation.e2e.spec.ts
    ✓ header is visible on French homepage (1.5s)
    ✓ header is visible on English homepage (1.4s)
    ...

  4 passed (45.2s)
```

### Cache Hit Output

```
Run actions/cache@v4
Cache restored successfully
Skipping browser install (cache hit)
```

### Artifacts Upload Output

```
Run actions/upload-artifact@v4
Uploading artifact 'playwright-report'
  test-results/
  playwright-report/
Artifact uploaded successfully
```

---

## Performance Baseline

### Expected Durations

| Step | First Run | Cached Run |
|------|-----------|------------|
| Get Playwright Version | < 5s | < 5s |
| Cache Playwright Browsers | < 10s | < 10s |
| Install Playwright Browsers | ~90s | Skipped |
| E2E Tests | ~180s | ~180s |
| Upload Artifacts | Skipped | Skipped |
| **Total E2E Phase** | **~5 min** | **~3 min** |

### If Too Slow

1. Réduire le nombre de tests E2E
2. Utiliser un seul browser (chromium)
3. Désactiver les retries si pas de flaky tests
4. Optimiser les timeouts dans les tests

---

## Failure Scenarios

### Scenario 1: Browser Install Fails

**Expected Behavior**:
- Step "Install Playwright Browsers" fails
- Workflow stops
- No E2E tests run

**Recovery**:
- Re-run workflow (peut être un problème réseau)
- Vérifier les logs pour l'erreur spécifique

### Scenario 2: Server Doesn't Start

**Expected Behavior**:
- Step "E2E Tests" fails avec timeout
- Artifacts uploadés (traces vides)

**Recovery**:
- Vérifier PAYLOAD_SECRET
- Vérifier que le build a réussi
- Augmenter `webServer.timeout`

### Scenario 3: Tests Flaky

**Expected Behavior**:
- Certains tests échouent de façon intermittente
- Artifacts montrent les différences

**Recovery**:
- Ajouter `test.retry(2)` dans playwright.config.ts
- Identifier et stabiliser les tests flaky
- Ajouter des waits explicites

---

## Rollback Testing

### If Phase 2 Causes Issues

```bash
# Option 1: Commenter les steps E2E
# Edit .github/workflows/quality-gate.yml et commenter:
# - Install Playwright Browsers
# - E2E Tests
# - Upload E2E Test Artifacts
# - Cache steps

# Option 2: Revert commits
git revert HEAD~4..HEAD
```

---

## Debug Tips

### View Artifacts

1. Go to workflow run
2. Scroll to "Artifacts" section
3. Download `playwright-report`
4. Extract and open `index.html`

### View Traces

```bash
# Locally after downloading artifacts
pnpm exec playwright show-trace test-results/*/trace.zip
```

### Reproduce CI Environment

```bash
# Simuler CI localement
CI=true pnpm test:e2e
```

---

**Testing Guide Created**: 2025-12-05
