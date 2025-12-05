# Phase 2: Commit Checklist

**Phase**: CI E2E Tests
**Total Commits**: 4

---

## Commit 1: Install Playwright Browsers

### Pre-commit
- [ ] Phase 1 complétée
- [ ] Tests E2E passent localement: `pnpm test:e2e`
- [ ] playwright.config.ts a webServer configuré

### Changes
- [ ] Ajouter step "Install Playwright Browsers"
- [ ] Positionner après "Next.js Build (No-DB Mode)"
- [ ] Utiliser `pnpm exec playwright install --with-deps chromium`

### Post-commit
- [ ] Syntaxe YAML valide
- [ ] Commit message correct

### Commit Command
```bash
git add .github/workflows/quality-gate.yml
git commit -m "$(cat <<'EOF'
✅ test(ci): add Playwright browsers installation step

Install Chromium browser for E2E tests in CI.
Uses --with-deps to install required system dependencies.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Commit 2: Add E2E Tests Step

### Pre-commit
- [ ] Commit 1 appliqué
- [ ] Tests E2E passent localement

### Changes
- [ ] Ajouter step "E2E Tests"
- [ ] Positionner après "Install Playwright Browsers"
- [ ] Ajouter `env.PAYLOAD_SECRET` avec fallback
- [ ] Ajouter `timeout-minutes: 10`
- [ ] Utiliser `run: pnpm test:e2e`

### Post-commit
- [ ] Syntaxe YAML valide
- [ ] Timeout configuré
- [ ] Commit message correct

### Commit Command
```bash
git add .github/workflows/quality-gate.yml
git commit -m "$(cat <<'EOF'
✅ test(ci): add E2E tests step after Next.js build

Execute Playwright E2E tests in CI after build completion.
Includes 10-minute timeout and PAYLOAD_SECRET for dev server.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Commit 3: Add E2E Artifacts Upload

### Pre-commit
- [ ] Commits 1 et 2 appliqués
- [ ] Vérifier les paths d'artifacts: `test-results/`, `playwright-report/`

### Changes
- [ ] Ajouter step "Upload E2E Test Artifacts"
- [ ] Positionner après "E2E Tests"
- [ ] Configurer `if: failure()`
- [ ] Ajouter les paths `test-results/` et `playwright-report/`
- [ ] Configurer `retention-days: 7`

### Post-commit
- [ ] Syntaxe YAML valide
- [ ] Action SHA pinnée
- [ ] Commit message correct

### Commit Command
```bash
git add .github/workflows/quality-gate.yml
git commit -m "$(cat <<'EOF'
✅ test(ci): configure E2E test artifacts upload on failure

Upload Playwright traces, screenshots, and HTML report when tests fail.
Artifacts retained for 7 days to aid debugging.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Commit 4: Add Playwright Browser Caching

### Pre-commit
- [ ] Commits 1, 2, et 3 appliqués
- [ ] Vérifier la version Playwright: `pnpm exec playwright --version`

### Changes
- [ ] Ajouter step "Get Playwright Version" AVANT Install
- [ ] Ajouter step "Cache Playwright Browsers" avec actions/cache
- [ ] Modifier step "Install Playwright Browsers" avec `if: steps.playwright-cache.outputs.cache-hit != 'true'`
- [ ] Key basée sur la version Playwright

### Post-commit
- [ ] Syntaxe YAML valide
- [ ] Cache key correcte
- [ ] Condition if correcte
- [ ] Commit message correct

### Commit Command
```bash
git add .github/workflows/quality-gate.yml
git commit -m "$(cat <<'EOF'
✅ test(ci): add Playwright browsers caching for faster CI

Cache Playwright browsers based on version to speed up CI runs.
Skips installation when cache is present (~1-2 min saved).

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
- [ ] Tests E2E passent en CI
- [ ] Cache fonctionne (vérifier second run)
- [ ] Artifacts uploadés si échec

### Files Modified
- `.github/workflows/quality-gate.yml`

### Next Steps
- Passer à Phase 3: E2E Test Maintenance & Documentation

---

**Checklist Created**: 2025-12-05
