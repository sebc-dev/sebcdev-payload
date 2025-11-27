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
