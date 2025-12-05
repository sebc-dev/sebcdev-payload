# Phase 2: Review Guide

**Phase**: CI E2E Tests

---

## Review Checklist

### YAML Syntax
- [ ] Indentation correcte (2 espaces)
- [ ] Actions SHA pinnées (pas de tags)
- [ ] Pas de secrets hardcodés

### Workflow Logic
- [ ] E2E tests APRÈS Next.js Build
- [ ] Cache AVANT Install
- [ ] Artifacts APRÈS E2E Tests
- [ ] Conditions `if` correctes

### Security
- [ ] Actions avec SHA complet (pas de `@v4`)
- [ ] PAYLOAD_SECRET avec fallback
- [ ] Pas de permissions excessives

---

## Code Review Points

### Commit 1: Playwright Install

```yaml
# ✅ GOOD - avec dépendances système
- name: Install Playwright Browsers
  run: pnpm exec playwright install --with-deps chromium

# ❌ BAD - sans dépendances système (peut échouer en CI)
- name: Install Playwright Browsers
  run: pnpm exec playwright install chromium
```

### Commit 2: E2E Tests

```yaml
# ✅ GOOD - timeout et env configurés
- name: E2E Tests
  env:
    PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET || env.PAYLOAD_SECRET_CI }}
  run: pnpm test:e2e
  timeout-minutes: 10

# ❌ BAD - pas de timeout (peut bloquer indéfiniment)
- name: E2E Tests
  run: pnpm test:e2e
```

### Commit 3: Artifacts Upload

```yaml
# ✅ GOOD - SHA pinnée, condition failure
- name: Upload E2E Test Artifacts
  if: failure()
  uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4.6.2
  with:
    name: playwright-report
    path: |
      test-results/
      playwright-report/
    retention-days: 7

# ❌ BAD - pas de SHA, toujours upload
- name: Upload E2E Test Artifacts
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: test-results/
```

### Commit 4: Browser Caching

```yaml
# ✅ GOOD - cache basé sur version, condition skip
- name: Cache Playwright Browsers
  uses: actions/cache@5a3ec84eff668545956fd18022155c47e93e2684 # v4.2.3
  id: playwright-cache
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ steps.playwright-version.outputs.version }}

- name: Install Playwright Browsers
  if: steps.playwright-cache.outputs.cache-hit != 'true'
  run: pnpm exec playwright install --with-deps chromium

# ❌ BAD - clé statique, pas de skip
- name: Cache Playwright Browsers
  uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-cache

- name: Install Playwright Browsers
  run: pnpm exec playwright install --with-deps chromium
```

---

## Testing the Changes

### Local Validation
```bash
# Vérifier E2E localement
pnpm test:e2e

# Vérifier les paths d'artifacts
ls -la test-results/ playwright-report/
```

### CI Validation
1. Push sur branche feature
2. Ouvrir PR vers main
3. Vérifier :
   - Playwright s'installe
   - Tests E2E s'exécutent
   - Cache fonctionne (second run)
   - Artifacts uploadés si échec

---

## Common Issues

### Issue: E2E tests passent localement mais échouent en CI

**Causes possibles**:
- Race conditions (parallélisation)
- Timeouts insuffisants
- Sélecteurs fragiles

**Solutions**:
- Utiliser `workers: 1` en CI
- Augmenter les timeouts
- Utiliser des sélecteurs data-testid

### Issue: Server ne démarre pas

**Causes possibles**:
- PAYLOAD_SECRET manquant
- Port déjà utilisé
- Build incomplet

**Solutions**:
- Vérifier PAYLOAD_SECRET fallback
- Utiliser `reuseExistingServer: false`
- S'assurer que le build est AVANT les E2E

### Issue: Cache pas utilisé

**Causes possibles**:
- Clé incorrecte
- Path incorrect
- Cache expiré

**Solutions**:
- Vérifier la clé (version Playwright)
- Vérifier le path (`~/.cache/ms-playwright`)
- Le cache expire après 7 jours

---

## Approval Criteria

### Required
- [ ] Tests E2E passent en CI
- [ ] Pas de régressions
- [ ] Artifacts uploadés si échec
- [ ] Cache fonctionne

### Performance
- [ ] Installation Playwright < 2 min (sans cache)
- [ ] Tests E2E < 5 min
- [ ] Cache réduit le temps (second run)

---

**Review Guide Created**: 2025-12-05
