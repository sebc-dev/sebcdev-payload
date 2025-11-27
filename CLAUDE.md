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

## CI/CD Pipeline & Security

### Quality Gate Workflow

Le projet utilise un pipeline CI/CD "AI-Shield" avec validation multi-couches pour détecter les hallucinations IA et garantir la qualité du code.

```bash
# Checks locaux avant push (recommandé)
pnpm lint                    # ESLint + Prettier
pnpm generate:types:payload  # Sync types Payload → TypeScript
pnpm build                   # Next.js build (no-DB mode)
pnpm test                    # Tests unitaires + E2E
```

### GitHub Actions Workflow

Tous les pushs/PRs déclenchent automatiquement les checks suivants :

**Phase 1 (MVP) - Essentials :**
- **Socket.dev** : Bloque les paquets malveillants/suspects (typosquatting, installation scripts)
- **Knip** : Détecte le code mort et imports non utilisés (hallucinations IA)
- **Type Sync** : Vérifie la cohérence Payload ↔ TypeScript (`payload-types.ts`)
- **ESLint + Prettier** : Formatage et linting strict (includes Tailwind class ordering)
- **Next.js Build** : `next build --experimental-build-mode compile` (sans connexion D1)

**Phase 2 (Enhanced) - Monitoring & Performance :**
- **Lighthouse CI** : Budgets performance (>90), A11y (100), SEO (100)
- **dependency-cruiser** : Validation architecture (interdiction imports serveur ↔ client)
- **Playwright + axe-core** : Tests accessibilité WCAG 2.1 AA (FR/EN)
- **OIDC Cloudflare** : Authentification sans secrets statiques

**Phase 3 (Advanced) - Robustness :**
- **Stryker** : Mutation testing sur modules critiques (`src/lib/`, Server Actions)

### Security Best Practices

- **SHA Pinning** : Actions GitHub tierces épinglées par SHA complet (immuabilité cryptographique)
- **OIDC** : Authentification Cloudflare sans secrets statiques (Phase 2)
- **Permissions** : GITHUB_TOKEN en read-only par défaut (least privilege)
- **Dependabot** : Maintenance automatique des dépendances et actions

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
