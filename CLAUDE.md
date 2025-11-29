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
pnpm test:int               # Run integration tests (Vitest)
pnpm test:e2e               # Run E2E tests (Playwright)
pnpm test                   # Run all tests

# Code Quality
pnpm lint                   # ESLint

# Type Generation
pnpm generate:types         # Generate both Cloudflare and Payload types
pnpm generate:types:payload # Generate Payload types only

# Database
pnpm payload migrate:create # Create new migration
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

### Quality Gate Workflow

Le projet utilise un pipeline CI/CD "AI-Shield" avec validation multi-couches pour détecter les hallucinations IA et garantir la qualité du code.

**Stratégie de déclenchement** : Workflows déclenchés **manuellement** (`workflow_dispatch`) mais **obligatoires** pour merger via branch protection.

```bash
# Checks locaux avant push (recommandé)
pnpm lint                    # ESLint + Prettier
pnpm generate:types:payload  # Sync types Payload → TypeScript
pnpm build                   # Next.js build (no-DB mode)
pnpm test                    # Tests unitaires + E2E
```

### GitHub Actions Workflow

Déclenchement manuel via : **Actions > Quality Gate > Run workflow** (sélectionner la branche)

**Supply Chain Security :**

- **Socket.dev** : Bloque les paquets malveillants/suspects (typosquatting, installation scripts)
- **SHA Pinning** : Actions GitHub tierces épinglées par SHA complet
- **Dependabot** : Maintenance automatique des dépendances et actions

**Code Quality Gates :**

- **Knip** : Détecte le code mort et imports non utilisés (hallucinations IA)
- **Type Sync** : Vérifie la cohérence Payload ↔ TypeScript (`payload-types.ts`)
- **ESLint + Prettier** : Formatage et linting strict (includes Tailwind class ordering)
- **dependency-cruiser** : Validation architecture (interdiction imports serveur ↔ client)

**Build & Tests :**

- **Next.js Build** : `next build --experimental-build-mode compile` (sans connexion D1)
- **Vitest** : Tests unitaires et d'intégration
- **Playwright + axe-core** : Tests E2E et accessibilité WCAG 2.1 AA (FR/EN)
- **Stryker** : Mutation testing sur modules critiques (optionnel via input)

**Performance & Déploiement :**

- **Lighthouse CI** : Budgets performance (≥90), A11y (=100), SEO (=100)
- **OIDC Cloudflare** : Authentification sans secrets statiques
- **Permissions** : GITHUB_TOKEN en read-only par défaut (least privilege)

> **Documentation complète :** [CI-CD Security Architecture](docs/specs/CI-CD-Security.md)

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

### Integration Tests (`tests/int/*.int.spec.ts`)

- Use Vitest with jsdom environment
- Access Payload API directly via `getPayload()`
- Run with: `pnpm test:int`

### E2E Tests (`tests/e2e/*.e2e.spec.ts`)

- Use Playwright with Chromium
- Dev server starts automatically
- Run with: `pnpm test:e2e`

## TypeScript Paths

- `@/*` maps to `./src/*`
- `@payload-config` maps to `./src/payload.config.ts`

## Environment

- Requires `PAYLOAD_SECRET` environment variable
- `CLOUDFLARE_ENV` controls deployment environment
- Uses `.env` files (see `.env.example`)
