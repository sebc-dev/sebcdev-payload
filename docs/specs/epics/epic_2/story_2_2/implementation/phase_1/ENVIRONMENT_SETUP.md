# Environment Setup - Phase 1 : Media Collection Enhancement

## Overview

Ce guide configure l'environnement de developpement pour implementer la Phase 1 de la Story 2.2.

---

## Prerequisites

### System Requirements

| Requirement        | Version     | Verification Command          |
| ------------------ | ----------- | ----------------------------- |
| Node.js            | >= 20.x     | `node --version`              |
| pnpm               | >= 8.x      | `pnpm --version`              |
| Git                | >= 2.x      | `git --version`               |
| Wrangler CLI       | >= 3.x      | `pnpm exec wrangler --version`|

### Project State

- [ ] Repository clone : `git clone <repo-url>`
- [ ] Dependencies installees : `pnpm install`
- [ ] Variables d'environnement configurees

---

## Environment Variables

### Required Variables

Creer ou verifier le fichier `.env` a la racine du projet :

```bash
# .env
PAYLOAD_SECRET=your-secret-key-min-32-chars

# Optional for local development (Wrangler handles bindings)
# CLOUDFLARE_ACCOUNT_ID=xxx
# CLOUDFLARE_API_TOKEN=xxx
```

### Generating PAYLOAD_SECRET

Si vous n'avez pas de secret :

```bash
# Generate a secure secret
openssl rand -base64 32
```

### Verification

```bash
# Verifier que .env est lu
pnpm dev
# Le serveur doit demarrer sans erreur "PAYLOAD_SECRET not found"
```

---

## Cloudflare Bindings

### Wrangler Configuration

Le fichier `wrangler.jsonc` configure les bindings R2 et D1 :

```jsonc
// wrangler.jsonc (existant)
{
  "name": "sebcdev-payload",
  "r2_buckets": [
    {
      "binding": "R2",
      "bucket_name": "sebcdev-payload-cache",
      "preview_bucket_name": "sebcdev-payload-cache"
    }
  ],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "sebcdev-payload-db",
      "database_id": "xxx"
    }
  ]
}
```

### Local R2 Simulation

En developpement local, Wrangler simule R2 automatiquement :

```bash
# Dossier de stockage local R2
.wrangler/state/r2/
```

Aucune configuration supplementaire requise pour le developpement local.

---

## Git Branch Setup

### Branch Strategy

```bash
# Verifier la branche actuelle
git branch --show-current

# Si pas sur la bonne branche
git checkout epic/epic-2-cms-core

# S'assurer d'etre a jour
git pull origin epic/epic-2-cms-core
```

### Clean Working Directory

```bash
# Verifier l'etat
git status

# Si fichiers non commites, stash ou commit
git stash  # ou git commit
```

---

## IDE Configuration

### VS Code (Recommended)

Extensions recommandees :

| Extension                    | Purpose                        |
| ---------------------------- | ------------------------------ |
| `dbaeumer.vscode-eslint`     | Linting en temps reel          |
| `esbenp.prettier-vscode`     | Formatage automatique          |
| `bradlc.vscode-tailwindcss`  | Autocomplete Tailwind          |
| `ms-vscode.vscode-typescript-next` | Support TypeScript 5.x   |

### Settings (`.vscode/settings.json`)

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## Development Server

### Starting the Server

```bash
# Methode standard
pnpm dev

# Methode "clean" (supprime caches)
pnpm devsafe
```

### Endpoints

| Endpoint                | Description                    |
| ----------------------- | ------------------------------ |
| `http://localhost:3000` | Frontend                       |
| `http://localhost:3000/admin` | Payload Admin Panel      |
| `http://localhost:3000/api` | Payload REST API           |

### First-Time Admin Setup

Si c'est la premiere fois :

1. Acceder a `http://localhost:3000/admin`
2. Creer un compte administrateur
3. Se connecter

---

## Testing the Current State

### Verify Media Collection Exists

```bash
# Via Admin Panel
# 1. Go to http://localhost:3000/admin
# 2. Check "Media" in sidebar
# 3. Verify you can access /admin/collections/media
```

### Verify R2 Binding

```bash
# Start dev server and check logs
pnpm dev

# Look for:
# - No "R2 binding not found" errors
# - Successful startup
```

### Test Current Upload (Before Changes)

1. Aller a `/admin/collections/media/create`
2. Uploader une image test
3. Verifier :
   - [ ] Upload reussit
   - [ ] Image visible dans la liste
   - [ ] Alt text sauvegarde

---

## File Structure Reference

### Files You'll Modify

```
src/
├── collections/
│   └── Media.ts          # <-- Main file to modify
└── payload-types.ts      # <-- Will be regenerated
```

### Current Media.ts Location

```bash
# Verify file exists
ls -la src/collections/Media.ts

# View current content
cat src/collections/Media.ts
```

---

## Common Commands Reference

### Development

```bash
# Start dev server
pnpm dev

# Clean start
pnpm devsafe

# Build
pnpm build
```

### Code Quality

```bash
# Lint
pnpm lint

# Format
pnpm format

# Type check
pnpm tsc --noEmit
```

### Type Generation

```bash
# Generate Payload types
pnpm generate:types:payload

# Generate all types (Payload + Cloudflare)
pnpm generate:types
```

### Git

```bash
# Status
git status

# Add specific file
git add src/collections/Media.ts

# Commit with message
git commit -m "message"

# View log
git log --oneline -5
```

---

## Troubleshooting

### "Cannot find module '@payload-config'"

```bash
# Regenerate all types
pnpm generate:types
```

### "PAYLOAD_SECRET is required"

```bash
# Verify .env file exists and contains PAYLOAD_SECRET
cat .env | grep PAYLOAD_SECRET
```

### Port 3000 Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

### Wrangler R2 Errors

```bash
# Clear local Wrangler state
rm -rf .wrangler/state

# Restart dev server
pnpm devsafe
```

### TypeScript Errors After Changes

```bash
# Full rebuild
pnpm generate:types
pnpm build
```

---

## Pre-Implementation Verification

Run this checklist before starting implementation :

```bash
# 1. Verify branch
git branch --show-current
# Expected: epic/epic-2-cms-core

# 2. Verify clean state
git status
# Expected: "nothing to commit, working tree clean"

# 3. Verify dev server starts
pnpm dev
# Expected: Server starts on localhost:3000

# 4. Verify admin access
# Go to http://localhost:3000/admin
# Expected: Login or admin panel loads

# 5. Verify Media collection
# Go to http://localhost:3000/admin/collections/media
# Expected: Media list page loads
```

---

## Ready to Implement?

Once all checks pass, proceed to :

1. [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) - Technical details
2. [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) - Step-by-step guide

---

## References

| Resource                                  | URL / Path                           |
| ----------------------------------------- | ------------------------------------ |
| Payload CMS Docs                          | https://payloadcms.com/docs          |
| Cloudflare R2 Docs                        | https://developers.cloudflare.com/r2 |
| Wrangler CLI Docs                         | https://developers.cloudflare.com/workers/wrangler |
| Project README                            | `/README.md`                         |
| Project CLAUDE.md                         | `/CLAUDE.md`                         |
