# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Payload CMS application deployed on Cloudflare Workers. Uses Next.js 15 with React 19, Cloudflare D1 (SQLite) for database, and R2 for media storage.

## Common Commands

```bash
# Development
pnpm dev                    # Start development server (binds to Cloudflare services via Wrangler)
pnpm devsafe                # Clean start (removes .next and .open-next)

# Build & Deploy
pnpm build                  # Build Next.js application
pnpm deploy                 # Run migrations and deploy to Cloudflare Workers
pnpm preview                # Local preview of Cloudflare deployment

# Testing
pnpm test:unit              # Run unit tests (Vitest)
pnpm test:int               # Run integration tests (Vitest)
pnpm test:e2e               # Run E2E tests (Playwright)
pnpm test                   # Run all tests

# Code Quality
pnpm lint                   # ESLint

# Architecture Validation
pnpm depcruise              # Run architecture validation
pnpm depcruise:report       # Generate HTML report

# Type Generation
pnpm generate:types         # Generate both Cloudflare and Payload types
pnpm generate:types:payload # Generate Payload types only

# Database
pnpm payload migrate:create # Create new migration

# Database Migrations (IMPORTANT)
# Local migrations (development SQLite):
pnpm payload migrate

# Remote migrations (production D1 - REQUIRES NODE_ENV=production):
NODE_ENV=production pnpm payload migrate
# Or use the deploy script which sets NODE_ENV automatically:
pnpm deploy:database
```

## Commit Conventions

Ce projet utilise [Gitmoji](https://gitmoji.dev/) pour préfixer les messages de commit avec des emojis significatifs.

### Format des commits

```
<gitmoji> <message>

Exemples:
✨ Ajout de la fonctionnalité de recherche
🐛 Correction du bug d'authentification
📝 Mise à jour de la documentation API
♻️ Refactorisation du système de cache
```

### Gitmojis courants

| Emoji | Code                      | Usage                                 |
| ----- | ------------------------- | ------------------------------------- |
| ✨    | `:sparkles:`              | Nouvelle fonctionnalité               |
| 🐛    | `:bug:`                   | Correction de bug                     |
| 📝    | `:memo:`                  | Documentation                         |
| ♻️    | `:recycle:`               | Refactorisation                       |
| ⚡️   | `:zap:`                   | Amélioration de performance           |
| 🎨    | `:art:`                   | Amélioration structure/format du code |
| ✅    | `:white_check_mark:`      | Ajout/mise à jour de tests            |
| 🔒    | `:lock:`                  | Correction de sécurité                |
| ⬆️    | `:arrow_up:`              | Mise à jour de dépendances            |
| 🔧    | `:wrench:`                | Configuration                         |
| 🚀    | `:rocket:`                | Déploiement                           |
| 💄    | `:lipstick:`              | UI/Style                              |
| 🚨    | `:rotating_light:`        | Correction warnings linter            |
| 🏗️    | `:building_construction:` | Changements architecturaux            |
| ♿️    | `:wheelchair:`            | Accessibilité                         |

> **Liste complète :** [docs/gitmoji.md](docs/gitmoji.md)

## CI/CD Pipeline & Security

### Stratégie de Workflows

Le projet utilise une **architecture modulaire** de workflows GitHub Actions pour optimiser les temps de CI :

| Workflow | Déclenchement | Contenu |
|----------|---------------|---------|
| **Core Checks** | Auto sur PR | ESLint, Prettier, Type Sync, Next.js Build |
| **Tests** | Manuel | Unit, Integration, E2E (Playwright) |
| **Security** | Manuel | Socket.dev, Knip (dead code) |
| **Architecture** | Manuel | dependency-cruiser |
| **Mutation** | Manuel | Stryker (optionnel) |
| **Quality Gate** | Manuel | Tous les checks requis |
| **Deploy** | Manuel | D1 Migrations + Cloudflare Workers |

**Principe** : Seuls les Core Checks s'exécutent automatiquement sur PR. Les autres checks sont requis pour merger mais doivent être lancés manuellement.

### Lancer les Workflows

```bash
# Via GitHub CLI
gh workflow run "Core Checks"           # ESLint, Prettier, Type Sync, Build
gh workflow run "Tests"                  # Unit, Integration, E2E
gh workflow run "Security"               # Socket.dev, Knip
gh workflow run "Architecture"           # dependency-cruiser
gh workflow run "Mutation Testing"       # Stryker
gh workflow run "Quality Gate"           # Tout sauf mutation
gh workflow run "Deploy"                 # Déploiement Cloudflare
```

Ou via l'interface : **Actions > [Workflow] > Run workflow**

### Checks Locaux (recommandés avant push)

```bash
pnpm lint                    # ESLint + Prettier
pnpm generate:types:payload  # Sync types Payload → TypeScript
pnpm test:unit               # Unit tests (Vitest)
pnpm test:int                # Integration tests (Vitest)
pnpm build                   # Next.js build (no-DB mode)
pnpm test:e2e                # E2E tests (Playwright)
pnpm depcruise               # Architecture validation
```

### Branch Protection

Les checks suivants sont **requis pour merger sur main** (via branch protection) :

- Core Checks (auto)
- Tests (manuel)
- Security (manuel)
- Architecture (manuel)

> **Tip** : Utiliser `gh workflow run "Quality Gate"` pour lancer tous les checks requis en une seule commande.

### Outils de Qualité

| Outil | But |
|-------|-----|
| **Socket.dev** | Supply chain security (paquets malveillants, typosquatting) |
| **Knip** | Détection code mort (anti-hallucination IA) |
| **ESLint + Prettier** | Linting et formatage (Tailwind class ordering) |
| **Type Sync** | Cohérence Payload ↔ TypeScript |
| **dependency-cruiser** | Validation architecture (imports serveur/client) |
| **Playwright** | Tests E2E et accessibilité WCAG 2.1 AA |
| **Stryker** | Mutation testing (qualité des tests) |

> **Documentation complète :** [CI-CD Security Architecture](docs/specs/CI-CD-Security.md)

### Deployment Pipeline

Déploiement **manuel uniquement** via le workflow Deploy :

```
Quality Gate ✓ → Deploy → D1 Migrations → Wrangler Deploy → Smoke Tests
```

**Commandes de déploiement manuel**:

```bash
# Exécuter les migrations D1
pnpm payload migrate

# Déployer manuellement
pnpm exec wrangler deploy

# Lister les déploiements récents
pnpm exec wrangler deployments list

# Voir les détails d'un déploiement
pnpm exec wrangler deployments view <deployment-id>

# Rollback à un déploiement spécifique
pnpm exec wrangler rollback <deployment-id>

# Rollback au déploiement précédent
pnpm exec wrangler rollback
```

Pour plus de détails, voir [DEPLOYMENT.md](docs/guides/DEPLOYMENT.md).

### Authentication & Secrets

Le déploiement utilise un **API Token Cloudflare** via GitHub Secrets:

- **CLOUDFLARE_API_TOKEN** : Token avec permissions Workers Scripts (Edit) + D1 (Edit)
- **CLOUDFLARE_ACCOUNT_ID** : Identifiant du compte Cloudflare

**Sécurité API Token** :

- Rotation recommandée tous les 90 jours
- Scope minimal (principle of least privilege)
- Audit disponible dans Cloudflare Dashboard > Audit Log

Pour les bonnes pratiques de rotation et d'audit, voir [DEPLOYMENT.md - API Token Security](docs/guides/DEPLOYMENT.md#api-token-security-best-practices).

> **Note**: OIDC n'est pas encore supporté par `wrangler-action` (à partir de novembre 2025).
> Tracking : https://github.com/cloudflare/wrangler-action

### Documentation

- [DEPLOYMENT.md](docs/guides/DEPLOYMENT.md) - Guide complet de déploiement et rollback
- [DEVELOPER_WORKFLOW.md](docs/guides/DEVELOPER_WORKFLOW.md) - Workflow développeur end-to-end
- [CI-CD Security Architecture](docs/specs/CI-CD-Security.md) - Architecture de sécurité détaillée

## Architecture

### Cloudflare Integration

- **D1**: SQLite database via `@payloadcms/db-d1-sqlite`
- **R2**: Media storage via `@payloadcms/storage-r2`
- **Wrangler**: Configuration in `wrangler.jsonc`, handles local bindings automatically
- **OpenNext**: Adapts Next.js for Cloudflare Workers (`open-next.config.ts`)

### Project Structure

```
src/
├── app/
│   ├── (frontend)/     # Public-facing pages
│   └── (payload)/      # Admin panel and API routes
│       ├── admin/      # Payload admin UI
│       └── api/        # REST and GraphQL endpoints
├── collections/        # Payload collection definitions
├── migrations/         # Database migrations
├── payload.config.ts   # Main Payload configuration
└── payload-types.ts    # Generated TypeScript types
```

### Key Files

- `src/payload.config.ts`: Central configuration for collections, database adapter, and plugins
- `wrangler.jsonc`: Cloudflare bindings (D1 database, R2 bucket)
- `cloudflare-env.d.ts`: Generated Cloudflare environment types

### Collections

- **Users**: Auth-enabled collection for admin access
- **Media**: Upload collection with R2 storage (image crop/focalPoint disabled due to Workers limitations)

## Testing

### Philosophie des Tests

**Les tests doivent valider le bon fonctionnement, pas juste passer.**

Quand un test échoue, il faut :

1. **Corriger l'application**, pas le test (sauf si le test est réellement incorrect)
2. **Ne jamais affaiblir les assertions** juste pour faire passer un test
3. **Les tests remontent les vrais problèmes** - c'est leur raison d'être

Exemple concret : Si un test WCAG échoue pour un problème de contraste, corriger les couleurs du composant, pas exclure l'élément du test.

### Unit Tests (`tests/unit/*.spec.ts`)

- Use Vitest with jsdom environment
- Test isolated functions and utilities
- No external dependencies (database, network)
- Run with: `pnpm test:unit`

### Integration Tests (`tests/int/*.int.spec.ts`)

- Use Vitest with jsdom environment
- Access Payload API directly via `getPayload()`
- Run with: `pnpm test:int`

### E2E Tests (`tests/e2e/*.e2e.spec.ts`)

- Use Playwright with Chromium
- Dev server starts automatically
- Run with: `pnpm test:e2e`

### E2E Tests avec données seedées (`tests/e2e/*-seeded.e2e.spec.ts`)

Les tests `-seeded` nécessitent des données dans la base :

```bash
# Seeder la base avant de lancer les tests
pnpm seed

# Lancer les tests E2E (incluant les tests seeded)
pnpm test:e2e

# Nettoyer et re-seeder si nécessaire
pnpm seed --clean
```

Ces tests vérifient le rendu avec de vraies données (articles, catégories, tags) et se skip automatiquement si la base est vide.

## TypeScript Paths

- `@/*` maps to `./src/*`
- `@payload-config` maps to `./src/payload.config.ts`

## Environment

- Requires `PAYLOAD_SECRET` environment variable
- `CLOUDFLARE_ENV` controls deployment environment
- Uses `.env` files (see `.env.example`)

## Development Stashes

### Placeholder Images for Visual Testing

Un stash contenant des images placeholder statiques pour tester visuellement les cards de la homepage sans avoir besoin d'images dans Payload.

```bash
# Appliquer le stash pour tester localement
git stash apply stash@{0}

# Contenu du stash:
# - src/app/[locale]/(frontend)/page.tsx  (code de mapping modifié)
# - public/placeholders/card-1.jpg à card-7.jpg (images 1200x675)

# Restaurer le code original après test
git checkout src/app/[locale]/(frontend)/page.tsx
rm -rf public/placeholders/
```

> **Note**: Ne pas committer ce stash. Usage local uniquement.
