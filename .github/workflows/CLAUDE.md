# GitHub Workflows

Architecture modulaire des workflows CI/CD pour optimiser les temps d'exécution.

## Vue d'ensemble

| Workflow | Fichier | Déclenchement | Requis pour merge |
|----------|---------|---------------|-------------------|
| **Core Checks** | `core-checks.yml` | Auto sur PR | Oui |
| **Tests** | `tests.yml` | Manuel | Oui |
| **Security** | `security.yml` | Manuel | Oui |
| **Architecture** | `architecture.yml` | Manuel | Oui |
| **Mutation Testing** | `mutation.yml` | Manuel | Non (optionnel) |
| **Full Quality Gate** | `full-quality-gate.yml` | Manuel | Orchestre tous |
| **Deploy** | `deploy.yml` | Manuel | N/A |

## Principe

**Seul `Core Checks` s'exécute automatiquement sur les PRs** pour un feedback rapide.
Les autres checks sont requis pour merger mais doivent être lancés manuellement.

## Workflows Détaillés

### core-checks.yml

**Déclenchement** : Auto sur PR vers `main` + `workflow_dispatch`

**Contenu** :
- ESLint
- Prettier
- Type Sync (génère et vérifie `payload-types.ts`)
- Next.js Build (mode compile, sans DB)

### tests.yml

**Déclenchement** : `workflow_dispatch` + `workflow_call`

**Jobs parallèles** :
- `unit-tests` : Vitest avec couverture
- `integration-tests` : Vitest (require PAYLOAD_SECRET)
- `e2e-tests` : Playwright Chromium

### security.yml

**Déclenchement** : `workflow_dispatch` + `workflow_call`

**Contenu** :
- Socket.dev (supply chain security)
- Knip (dead code detection)

**Permissions spéciales** : `issues: write`, `pull-requests: write` (pour Socket.dev)

### architecture.yml

**Déclenchement** : `workflow_dispatch` + `workflow_call`

**Contenu** :
- dependency-cruiser (validation architecture, imports serveur/client)

### mutation.yml

**Déclenchement** : `workflow_dispatch` + `workflow_call`

**Contenu** :
- Stryker mutation testing (mode incrémental)
- Upload rapport en artifact

**Inputs** :
- `report_retention_days` : 3, 5, 7, ou 14 jours

### full-quality-gate.yml

**Déclenchement** : `workflow_dispatch` uniquement

**Orchestre** (en parallèle) :
1. Core Checks
2. Security
3. Tests
4. Architecture
5. Mutation (optionnel)

**Job final** : `summary` - Vérifie que tous les checks requis ont passé.

**Inputs** :
- `run_mutation_tests` : boolean (default: false)
- `mutation_report_retention_days` : 3, 5, 7, ou 14 jours

### deploy.yml

**Déclenchement** : `workflow_dispatch` uniquement

**Étapes** :
1. D1 Migrations (`NODE_ENV=production`)
2. Wrangler Deploy
3. Wait for URL availability
4. Smoke tests (homepage + admin)

## Lancer les Workflows

```bash
# Via GitHub CLI
gh workflow run "Core Checks"
gh workflow run "Tests"
gh workflow run "Security"
gh workflow run "Architecture"
gh workflow run "Mutation Testing"
gh workflow run "Full Quality Gate"
gh workflow run "Deploy"

# Avec options
gh workflow run "Full Quality Gate" -f run_mutation_tests=true
gh workflow run "Mutation Testing" -f report_retention_days=7
```

## Sécurité

### Permissions (Least Privilege)

Tous les workflows déclarent des permissions explicites :
- `contents: read` (par défaut)
- `issues: write`, `pull-requests: write` (security.yml pour Socket.dev)

### Actions SHA-Pinned

Toutes les actions tierces sont épinglées par SHA complet :

```yaml
actions/checkout@1af3b93b6815bc44a9784bd300feb67ff0d1eeb3           # v6.0.0
actions/setup-node@2028fbc5c25fe9cf00d9f06a71cc4710d4507903         # v6.0.0
actions/cache@5a3ec84eff668545956fd18022155c47e93e2684              # v4.2.3
actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02    # v4.6.2
pnpm/action-setup@41ff72655975bd51cab0327fa583b6e92b6d3061          # v4.2.0
SocketDev/action@4337a545deecc20f19a909e52db7a2f6ba292f42           # v1.2.0
cloudflare/wrangler-action@392082e81ffbcb9ebdde27400634aa004b35ea37 # v3.14.0
```

### Secrets Requis

| Secret | Usage |
|--------|-------|
| `PAYLOAD_SECRET` | Payload CMS (fallback généré si absent) |
| `CLOUDFLARE_API_TOKEN` | Déploiement Cloudflare |
| `CLOUDFLARE_ACCOUNT_ID` | Déploiement Cloudflare |

## workflow_call

Les workflows suivants supportent `workflow_call` pour être appelés par `full-quality-gate.yml` :
- `tests.yml`
- `security.yml`
- `architecture.yml`
- `mutation.yml`

`core-checks.yml` supporte aussi `workflow_call` implicitement.

## Branch Protection

Configurer les status checks requis :
- `Core Checks / Core Checks`
- `Tests / Unit Tests`
- `Tests / Integration Tests`
- `Tests / E2E Tests`
- `Security / Security Checks`
- `Architecture / Architecture Validation`
