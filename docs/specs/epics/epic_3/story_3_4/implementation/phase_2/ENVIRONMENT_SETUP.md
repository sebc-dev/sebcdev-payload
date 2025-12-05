# Phase 2: Environment Setup

**Phase**: CI E2E Tests

---

## Prerequisites

### Local Development
- Node.js 20+
- pnpm 9+
- Playwright browsers installés

### CI Environment
- `ubuntu-latest` runner
- Node.js 20
- pnpm 9
- Chromium (installé par Playwright)

---

## Playwright Configuration

### Verify playwright.config.ts

```bash
# Check webServer configuration
cat playwright.config.ts | grep -A 10 webServer
```

### Expected Configuration
```typescript
// playwright.config.ts
export default defineConfig({
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
```

### Key Settings for CI
- `reuseExistingServer: !process.env.CI` - En CI, démarre toujours un nouveau serveur
- `timeout: 120000` - 2 minutes pour démarrer le serveur
- Un seul projet (chromium) pour la vitesse

---

## Local Testing

### Install Browsers Locally
```bash
# Installer tous les browsers (dev)
pnpm exec playwright install

# Ou seulement chromium
pnpm exec playwright install chromium
```

### Run E2E Tests
```bash
# Tous les tests
pnpm test:e2e

# Avec UI
pnpm exec playwright test --ui

# Un seul fichier
pnpm exec playwright test tests/e2e/navigation.e2e.spec.ts
```

### Verify Test Output Directories
```bash
# Après un échec de test
ls -la test-results/
ls -la playwright-report/
```

---

## CI Environment Variables

### Required
| Variable | Source | Description |
|----------|--------|-------------|
| `PAYLOAD_SECRET` | Secret OR Fallback | Pour démarrer le serveur de dev |
| `CI` | Auto | Défini automatiquement par GitHub Actions |

### Playwright Auto-Detection
Playwright détecte `CI=true` et ajuste son comportement :
- Désactive `reuseExistingServer`
- Active les retries par défaut
- Désactive la parallélisation (configurable)

---

## Cache Configuration

### Playwright Cache Path
```
~/.cache/ms-playwright/
```

### Cache Key Strategy
```yaml
key: playwright-${{ runner.os }}-${{ steps.playwright-version.outputs.version }}
```

La clé inclut :
- OS (ubuntu-latest)
- Version de Playwright

### Invalidation
Le cache s'invalide quand :
- La version de Playwright change
- Le cache expire (7 jours par défaut GitHub Actions)

---

## Artifact Configuration

### Paths to Upload
```yaml
path: |
  test-results/
  playwright-report/
```

### Contents
- `test-results/`: Traces, screenshots, videos par test
- `playwright-report/`: Rapport HTML interactif

### Retention
- 7 jours (configurable via `retention-days`)

---

## Troubleshooting

### Browser Installation Fails

**Error**: `Failed to download chromium`

**Solutions**:
1. Vérifier la connectivité réseau
2. Utiliser `--with-deps` pour les dépendances système
3. Augmenter le timeout

### E2E Tests Timeout

**Error**: `Timeout waiting for server`

**Solutions**:
1. Augmenter `webServer.timeout` dans playwright.config.ts
2. Vérifier que le build Next.js est complet
3. Vérifier PAYLOAD_SECRET

### Server Doesn't Start

**Error**: `Server not reachable at http://localhost:3000`

**Solutions**:
1. Vérifier la commande `webServer.command`
2. Vérifier le port (`webServer.url`)
3. Regarder les logs du serveur de dev

### Tests Flaky en CI

**Solutions**:
1. Ajouter `test.retry(2)` dans playwright.config.ts
2. Utiliser des sélecteurs stables
3. Ajouter des waits explicites (`waitForSelector`)

---

## Performance Optimization

### Browser Selection
```yaml
# Seulement chromium (recommandé pour CI)
run: pnpm exec playwright install --with-deps chromium

# Tous les browsers (plus complet mais plus lent)
run: pnpm exec playwright install --with-deps
```

### Parallelization
```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 1 : undefined,
  // 1 worker en CI pour éviter les race conditions
})
```

### Caching
Le cache des browsers économise ~1-2 minutes par run.

---

**Setup Guide Created**: 2025-12-05
