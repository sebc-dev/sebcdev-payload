# Phase 2: Commit Checklist

**Phase**: CI E2E Tests
**Total Commits**: 4

---

## Commit 1: Install Playwright Browsers

### Pre-commit
- [x] Phase 1 complétée
- [x] Tests E2E passent localement: `pnpm test:e2e`
- [x] playwright.config.ts a webServer configuré

### Changes
- [x] Ajouter step "Install Playwright Browsers"
- [x] Positionner après "Next.js Build (No-DB Mode)"
- [x] Utiliser `pnpm exec playwright install --with-deps chromium`

### Post-commit
- [x] Syntaxe YAML valide
- [x] Commit message correct

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
- [x] Commit 1 appliqué
- [x] Tests E2E passent localement

### Changes
- [x] Ajouter step "E2E Tests"
- [x] Positionner après "Install Playwright Browsers"
- [x] Ajouter `env.PAYLOAD_SECRET` avec fallback
- [x] Ajouter `timeout-minutes: 10`
- [x] Utiliser `run: pnpm test:e2e`

### Post-commit
- [x] Syntaxe YAML valide
- [x] Timeout configuré
- [x] Commit message correct

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
- [x] Commits 1 et 2 appliqués
- [x] Vérifier les paths d'artifacts: `test-results/`, `playwright-report/`

### Changes
- [x] Ajouter step "Upload E2E Test Artifacts"
- [x] Positionner après "E2E Tests"
- [x] Configurer `if: failure()`
- [x] Ajouter les paths `test-results/` et `playwright-report/`
- [x] Configurer `retention-days: 7`

### Post-commit
- [x] Syntaxe YAML valide
- [x] Action SHA pinnée
- [x] Commit message correct

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
- [x] Commits 1, 2, et 3 appliqués
- [x] Vérifier la version Playwright: `pnpm exec playwright --version`

### Changes
- [x] Ajouter step "Get Playwright Version" AVANT Install
- [x] Ajouter step "Cache Playwright Browsers" avec actions/cache
- [x] Modifier step "Install Playwright Browsers" avec `if: steps.playwright-cache.outputs.cache-hit != 'true'`
- [x] Key basée sur la version Playwright

### Post-commit
- [x] Syntaxe YAML valide
- [x] Cache key correcte
- [x] Condition if correcte
- [x] Commit message correct

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
- [x] Tous les commits appliqués
- [x] Workflow YAML syntaxiquement correct
- [x] Tests E2E passent en CI
- [x] Cache fonctionne (vérifier second run)
- [x] Artifacts uploadés si échec

### Files Modified
- `.github/workflows/quality-gate.yml`

### Next Steps
- [x] Passer à Phase 3: E2E Test Maintenance & Documentation
- [x] Tous les commits appliqués avec succès

---

**Checklist Created**: 2025-12-05
