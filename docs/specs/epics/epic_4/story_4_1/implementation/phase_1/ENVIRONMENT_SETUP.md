# Phase 1 - Environment Setup

**Phase**: Article Page Route & Basic Layout

This document describes how to set up your development environment before implementing Phase 1.

---

## Prerequisites

### Required Tools

| Tool | Version | Check Command |
|------|---------|---------------|
| Node.js | 20.x or 22.x | `node --version` |
| pnpm | 9.x+ | `pnpm --version` |
| Git | 2.x+ | `git --version` |

### Required Access

- [ ] Local development environment set up
- [ ] Access to Payload admin panel
- [ ] `.env` file configured (from `.env.example`)

---

## Environment Variables

### Required Variables

Verify these are set in your `.env` file:

```bash
# Required for Payload
PAYLOAD_SECRET=your-secret-here

# Optional but recommended
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Verify Environment

```bash
# Check env file exists
ls -la .env

# Verify PAYLOAD_SECRET is set (don't print value)
grep "PAYLOAD_SECRET" .env
```

---

## Project Setup

### 1. Install Dependencies

```bash
# Install all dependencies
pnpm install
```

### 2. Generate Types

```bash
# Generate Payload types
pnpm generate:types:payload

# Verify types generated
ls -la src/payload-types.ts
```

### 3. Verify Build

```bash
# Clean build to ensure fresh state
pnpm devsafe

# Or manually:
rm -rf .next .open-next
pnpm build
```

---

## Database Setup

### Local Development (SQLite/D1)

This project uses Cloudflare D1 (SQLite) for database. For local development, Wrangler handles the bindings automatically.

### Verify Database Connection

```bash
# Start dev server
pnpm dev

# Visit Payload admin
# http://localhost:3000/admin
```

If you can access the admin panel and see collections, the database is working.

---

## Test Data Requirements

### Required: At Least One Published Article

For testing the article page, you need at least one published article in the CMS.

#### Create Test Article via Admin

1. Go to `http://localhost:3000/admin`
2. Navigate to **Articles** collection
3. Click **Create New**
4. Fill in required fields:
   - **Title**: "Test Article for Phase 1"
   - **Slug**: "test-article-phase-1"
   - **Excerpt**: "This is a test article for Phase 1 development"
   - **Category**: Select any category
   - **Tags**: Add 2-3 tags
   - **Complexity**: Select any level
   - **Status**: Set to **Published**
   - **Content**: Add some test text (Lexical editor)
5. **Save** the article

#### Verify Article Exists

```bash
# Start dev server if not running
pnpm dev

# The article should be accessible at:
# http://localhost:3000/fr/articles/test-article-phase-1
# (Will 404 until Phase 1 is implemented)
```

### Alternative: Use Seed Script

If the project has a seed script:

```bash
# Check if seed script exists
pnpm seed --help

# Run seed if available
pnpm seed
```

---

## IDE Setup

### VS Code (Recommended)

#### Required Extensions

- **ESLint**: For linting errors inline
- **Prettier**: For code formatting
- **Tailwind CSS IntelliSense**: For Tailwind autocomplete

#### Recommended Extensions

- **TypeScript Importer**: Auto-import suggestions
- **Error Lens**: Inline error display
- **GitLens**: Git blame and history

#### Settings

Add to `.vscode/settings.json` (if not present):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "non-relative"
}
```

### Other IDEs

Ensure you have:
- TypeScript language server
- ESLint integration
- Prettier integration

---

## Git Setup

### Verify Branch

```bash
# Check current branch
git branch --show-current

# Should be on feature branch, e.g.:
# epic/article-render-mdx
# feat/story-4.1-phase-1
```

### Create Feature Branch (if needed)

```bash
# From main or epic branch
git checkout -b feat/story-4.1-phase-1
```

### Verify Clean State

```bash
# No uncommitted changes
git status

# Should show:
# nothing to commit, working tree clean
```

---

## Verification Checklist

Before starting implementation, verify:

### Environment

- [ ] Node.js 20.x or 22.x installed
- [ ] pnpm 9.x+ installed
- [ ] `.env` file exists with `PAYLOAD_SECRET`
- [ ] Dependencies installed (`pnpm install`)

### Types & Build

- [ ] Payload types generated (`pnpm generate:types:payload`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Dev server starts (`pnpm dev`)

### Database & Content

- [ ] Can access Payload admin (`/admin`)
- [ ] At least one published article exists
- [ ] Article has category and tags

### Git

- [ ] On correct branch
- [ ] Working tree clean
- [ ] Remote is up to date

### IDE

- [ ] TypeScript errors visible
- [ ] ESLint errors visible
- [ ] Autocomplete working

---

## Quick Start Commands

```bash
# Full setup from scratch
pnpm install
pnpm generate:types:payload
pnpm dev

# Open in browser
# Admin: http://localhost:3000/admin
# Homepage: http://localhost:3000/fr
```

---

## Troubleshooting

### Common Issues

#### "PAYLOAD_SECRET is required"

```bash
# Check .env exists
cat .env | grep PAYLOAD_SECRET

# If missing, create from example
cp .env.example .env
# Then edit and set PAYLOAD_SECRET
```

#### TypeScript errors on `@/payload-types`

```bash
# Regenerate types
pnpm generate:types:payload
```

#### "Module not found" errors

```bash
# Clean install
rm -rf node_modules
pnpm install
```

#### Build fails with "database" errors

The build uses `NO_DB_BUILD=true` mode. If you see database errors during build, ensure you're using the correct build command:

```bash
pnpm build
# This sets NO_DB_BUILD=true automatically
```

#### Port 3000 already in use

```bash
# Find process using port 3000
lsof -i :3000

# Kill it or use different port
PORT=3001 pnpm dev
```

---

## Next Steps

Once environment is verified:

1. Open [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
2. Start with Commit 1
3. Use [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) during implementation

---

**Setup Guide Generated**: 2025-12-09
