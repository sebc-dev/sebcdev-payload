# Phase 2: Implementation Plan

**Phase**: CI E2E Tests
**Commits**: 4
**Risk**: Medium

---

## Commit Sequence

### Commit 1: Install Playwright Browsers
**Message**: `✅ test(ci): add Playwright browsers installation step`

**Files Modified**:
- `.github/workflows/quality-gate.yml`

**Changes**:
```yaml
# Add after "Next.js Build (No-DB Mode)" step (Layer 3: Build Validation)

- name: Install Playwright Browsers
  run: pnpm exec playwright install --with-deps chromium
```

**Position in Workflow**: After Next.js Build, before E2E Tests

**Rationale**:
- `--with-deps` installe les dépendances système requises
- `chromium` seulement (pas webkit/firefox) pour accélérer l'installation
- Doit être APRÈS le build car les tests E2E nécessitent l'app buildée

---

### Commit 2: Add E2E Tests Step
**Message**: `✅ test(ci): add E2E tests step after Next.js build`

**Files Modified**:
- `.github/workflows/quality-gate.yml`

**Changes**:
```yaml
# Add after "Install Playwright Browsers" step

- name: E2E Tests
  env:
    PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET || env.PAYLOAD_SECRET_CI }}
  run: pnpm test:e2e
  timeout-minutes: 10
```

**Position in Workflow**: After Playwright install, before dependency-cruiser

**Rationale**:
- `timeout-minutes: 10` pour éviter les tests qui hangent
- PAYLOAD_SECRET requis car le serveur de dev démarre Payload
- Playwright webServer config démarre automatiquement le serveur

---

### Commit 3: Add E2E Artifacts Upload
**Message**: `✅ test(ci): configure E2E test artifacts upload on failure`

**Files Modified**:
- `.github/workflows/quality-gate.yml`

**Changes**:
```yaml
# Add after "E2E Tests" step

- name: Upload E2E Test Artifacts
  if: failure()
  uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4.6.2
  with:
    name: playwright-report
    path: |
      test-results/
      playwright-report/
    retention-days: 7
```

**Rationale**:
- `if: failure()` pour uploader seulement si les tests échouent
- Inclut traces, screenshots, et rapport HTML
- 7 jours de rétention (suffisant pour debug)
- SHA pinning pour la sécurité

---

### Commit 4: Add Playwright Browser Caching
**Message**: `✅ test(ci): add Playwright browsers caching for faster CI`

**Files Modified**:
- `.github/workflows/quality-gate.yml`

**Changes**:
```yaml
# Add BEFORE "Install Playwright Browsers" step

- name: Get Playwright Version
  id: playwright-version
  run: echo "version=$(pnpm exec playwright --version | head -1)" >> $GITHUB_OUTPUT

- name: Cache Playwright Browsers
  uses: actions/cache@5a3ec84eff668545956fd18022155c47e93e2684 # v4.2.3
  id: playwright-cache
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ steps.playwright-version.outputs.version }}

- name: Install Playwright Browsers
  if: steps.playwright-cache.outputs.cache-hit != 'true'
  run: pnpm exec playwright install --with-deps chromium
```

**Rationale**:
- Cache basé sur la version de Playwright
- Skip l'installation si le cache est présent
- Économise ~1-2 minutes par run

---

## Final Workflow Structure (After Phase 2)

```yaml
# ============================================
# LAYER 3: Build Validation
# ============================================

- name: Cache Next.js Build
  # ... existing cache step

- name: Next.js Build (No-DB Mode)
  run: pnpm exec next build --experimental-build-mode compile
  env:
    PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET || env.PAYLOAD_SECRET_CI }}

# NEW: E2E Tests (Phase 2)
- name: Get Playwright Version
  id: playwright-version
  run: echo "version=$(pnpm exec playwright --version | head -1)" >> $GITHUB_OUTPUT

- name: Cache Playwright Browsers
  uses: actions/cache@5a3ec84eff668545956fd18022155c47e93e2684 # v4.2.3
  id: playwright-cache
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ steps.playwright-version.outputs.version }}

- name: Install Playwright Browsers
  if: steps.playwright-cache.outputs.cache-hit != 'true'
  run: pnpm exec playwright install --with-deps chromium

- name: E2E Tests
  env:
    PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET || env.PAYLOAD_SECRET_CI }}
  run: pnpm test:e2e
  timeout-minutes: 10

- name: Upload E2E Test Artifacts
  if: failure()
  uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4.6.2
  with:
    name: playwright-report
    path: |
      test-results/
      playwright-report/
    retention-days: 7

# ============================================
# LAYER 4: Architecture Validation
# ============================================
- name: dependency-cruiser - Architecture Validation
  # ... existing step
```

---

## Validation Points

### After Commit 1
- [ ] Playwright browsers s'installent en CI
- [ ] Installation complète sans erreur

### After Commit 2
- [ ] `pnpm test:e2e` s'exécute en CI
- [ ] Serveur de dev démarre automatiquement
- [ ] Tests E2E passent

### After Commit 3
- [ ] Si tests échouent, artifacts sont uploadés
- [ ] Rapport accessible dans les artifacts

### After Commit 4
- [ ] Cache est créé au premier run
- [ ] Cache est réutilisé aux runs suivants
- [ ] Installation skippée si cache présent

---

## Technical Notes

### Playwright webServer Configuration
Le fichier `playwright.config.ts` doit avoir :
```typescript
webServer: {
  command: 'pnpm dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
  timeout: 120 * 1000, // 2 minutes pour démarrer
}
```

### Why After Build?
- Le webServer démarre le serveur de dev
- Le serveur de dev utilise le build Next.js
- Sans le build, le serveur serait plus lent à démarrer

### Browser Selection
- Chromium seulement (pas webkit/firefox)
- Suffisant pour les tests de régression
- Réduit le temps d'installation et d'exécution

---

## Rollback Strategy

Si issues:
1. Commenter les steps E2E temporairement
2. Les tests continuent de passer localement
3. Pas d'impact sur les autres layers du workflow

---

**Plan Created**: 2025-12-05
