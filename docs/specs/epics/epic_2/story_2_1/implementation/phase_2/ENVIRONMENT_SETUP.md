# Phase 2: Categories & Tags Collections - Environment Setup

## Prerequisites

This document outlines the environment requirements and setup steps needed before implementing Phase 2.

---

## Phase 1 Completion Required

Before starting Phase 2, **Phase 1 must be complete**. Verify:

### Phase 1 Verification Checklist

```bash
# Verify i18n configuration exists
grep -A 8 "localization:" src/payload.config.ts
```

**Expected output**:

```typescript
localization: {
  locales: [
    { label: 'Francais', code: 'fr' },
    { label: 'English', code: 'en' },
  ],
  defaultLocale: 'fr',
  fallback: true,
},
```

```bash
# Verify locale type in payload-types.ts
grep "locale:" src/payload-types.ts
```

**Expected output**:

```typescript
locale: 'fr' | 'en'
```

### Phase 1 Requirements

- [ ] `localization` block present in `payload.config.ts`
- [ ] FR set as default locale
- [ ] EN as secondary locale
- [ ] Fallback enabled
- [ ] Types generated with locale support
- [ ] Language toggle visible in admin UI

**If Phase 1 is not complete**, run:

```bash
/generate-phase-doc Epic 2 Story 2.1 Phase 1
```

---

## System Requirements

### Required Software

| Software | Minimum Version | Check Command    | Notes           |
| -------- | --------------- | ---------------- | --------------- |
| Node.js  | 18.x            | `node --version` | LTS recommended |
| pnpm     | 8.x             | `pnpm --version` | Package manager |
| Git      | 2.x             | `git --version`  | Version control |

### Cloudflare Tools

| Tool     | Purpose              | Check Command                  |
| -------- | -------------------- | ------------------------------ |
| Wrangler | Local D1/R2 bindings | `pnpm exec wrangler --version` |

---

## Project Setup

### 1. Verify Installation

```bash
# Check all dependencies are installed
pnpm install --frozen-lockfile

# Verify TypeScript compilation
pnpm tsc --noEmit
```

### 2. Environment Variables

Ensure `.env` file exists with required variables:

```bash
# Check .env exists
cat .env

# Required variables
PAYLOAD_SECRET=<your-secret>
```

### 3. Verify Dev Server

```bash
# Start development server
pnpm dev

# Expected: Server starts on http://localhost:3000
```

---

## Branch Setup

### Continue on Epic Branch (Recommended)

```bash
# Ensure you're on the epic branch
git checkout epic/epic-2-cms-core

# Pull latest changes (includes Phase 1)
git pull origin epic/epic-2-cms-core

# Verify Phase 1 commits are present
git log --oneline -3
# Should show Phase 1 commits
```

### Or Create Feature Branch

```bash
# Create feature branch for Phase 2
git checkout epic/epic-2-cms-core
git checkout -b feature/story-2.1-phase-2-categories-tags
```

---

## Verify Development Environment

### 1. Start Development Server

```bash
pnpm dev
```

**Expected Output**:

```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
  - Environments: .env

 ✓ Starting...
 ✓ Ready in X.Xs
```

### 2. Access Admin Panel

1. Open browser: `http://localhost:3000/admin`
2. Login page should display
3. Login with admin credentials
4. Verify: Language toggle visible in header
5. Verify: Collections sidebar shows Users, Media

### 3. Verify Type Generation

```bash
pnpm generate:types:payload
```

**Expected Output**:

```
Generated types written to src/payload-types.ts
```

### 4. Verify Build

```bash
pnpm build
```

**Expected**: Build completes without errors

### 5. Verify Migrations Work

```bash
# List existing migrations
ls -la src/migrations/

# Verify migration command is available
pnpm payload migrate --help
```

---

## File Locations

### Files to Create in This Phase

| File             | Location                        | Action               |
| ---------------- | ------------------------------- | -------------------- |
| `Categories.ts`  | `src/collections/Categories.ts` | Create               |
| `Tags.ts`        | `src/collections/Tags.ts`       | Create               |
| `index.ts`       | `src/collections/index.ts`      | Create               |
| `*_migration.ts` | `src/migrations/`               | Generate (automated) |

### Files to Modify in This Phase

| File                | Location                | Action                  |
| ------------------- | ----------------------- | ----------------------- |
| `payload.config.ts` | `src/payload.config.ts` | Modify imports & config |
| `payload-types.ts`  | `src/payload-types.ts`  | Regenerate (automated)  |

### Reference Files

| File           | Location                                                    | Purpose             |
| -------------- | ----------------------------------------------------------- | ------------------- |
| CLAUDE.md      | `./CLAUDE.md`                                               | Project conventions |
| PRD.md         | `docs/specs/PRD.md`                                         | Requirements        |
| Story Spec     | `docs/specs/epics/epic_2/story_2_1/story_2.1.md`            | Story details       |
| Phase 1 Docs   | `docs/specs/epics/epic_2/story_2_1/implementation/phase_1/` | Phase 1 reference   |
| Existing Users | `src/collections/Users.ts`                                  | Collection example  |
| Existing Media | `src/collections/Media.ts`                                  | Collection example  |

---

## Existing Collections Reference

### Review Users Collection

```bash
cat src/collections/Users.ts
```

Use this as a reference for collection structure.

### Review Media Collection

```bash
cat src/collections/Media.ts
```

Note: Media uses upload functionality - not needed for Categories/Tags.

---

## IDE Configuration

### VS Code Settings (Recommended)

Ensure `.vscode/settings.json` includes:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### Recommended Extensions

- **ESLint**: `dbaeumer.vscode-eslint`
- **Prettier**: `esbenp.prettier-vscode`
- **TypeScript**: Built-in
- **Payload CMS** (if available)

---

## Cloudflare Context

This project uses Cloudflare Workers with D1 and R2 bindings.

### D1 Database

Phase 2 creates new tables in D1:

- `categories` table
- `tags` table
- Localization tables (handled by Payload)

### Verify D1 Bindings

```bash
# List D1 databases
pnpm exec wrangler d1 list

# Expected: Shows your database
```

### Local Development

During `pnpm dev`, Wrangler automatically provides local D1 bindings. Migrations apply to the local database.

---

## Troubleshooting Setup

### Issue: Phase 1 Not Complete

**Symptom**: `localization` not found in config

**Solution**:

```bash
# Complete Phase 1 first
cat docs/specs/epics/epic_2/story_2_1/implementation/phase_1/COMMIT_CHECKLIST.md
```

### Issue: pnpm install fails

```bash
# Clear cache and retry
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: Dev server won't start

```bash
# Check for port conflicts
lsof -i :3000

# Kill existing process if needed
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

### Issue: TypeScript errors

```bash
# Clear TypeScript cache
rm -rf .next node_modules/.cache

# Reinstall and rebuild
pnpm install
pnpm build
```

### Issue: Wrangler/D1 errors

```bash
# Verify Cloudflare bindings
pnpm exec wrangler d1 list

# Check environment
echo $CLOUDFLARE_ENV

# Regenerate Cloudflare types
pnpm generate:types
```

### Issue: Migration command not found

```bash
# Verify Payload CLI is available
pnpm payload --help

# If not, ensure dependencies are installed
pnpm install
```

---

## Collections Folder Structure

### Current Structure (Before Phase 2)

```
src/collections/
├── Users.ts
└── Media.ts
```

### Target Structure (After Phase 2)

```
src/collections/
├── index.ts       # Barrel export (new)
├── Users.ts
├── Media.ts
├── Categories.ts  # New
└── Tags.ts        # New
```

---

## Pre-Implementation Checklist

Before starting implementation, verify:

- [ ] Phase 1 is complete (i18n configured)
- [ ] Node.js 18+ installed
- [ ] pnpm installed and working
- [ ] Git configured with correct credentials
- [ ] Repository cloned and dependencies installed
- [ ] `.env` file configured
- [ ] `pnpm dev` starts successfully
- [ ] Admin panel accessible at `/admin`
- [ ] Language toggle visible in admin
- [ ] `pnpm generate:types:payload` works
- [ ] `pnpm build` succeeds
- [ ] On correct Git branch
- [ ] Wrangler/D1 bindings working

---

## Quick Commands Reference

```bash
# Setup
pnpm install              # Install dependencies

# Development
pnpm dev                  # Start dev server
pnpm build               # Build project
pnpm lint                # Run linter

# Types
pnpm generate:types:payload    # Generate Payload types
pnpm tsc --noEmit             # Type check

# Migrations
pnpm payload migrate:create   # Create migration
pnpm payload migrate          # Apply migrations

# Git
git checkout epic/epic-2-cms-core
git pull origin epic/epic-2-cms-core
git status
git log --oneline -5

# Cloudflare
pnpm exec wrangler d1 list    # List D1 databases
```

---

## Next Steps

Once environment is verified:

1. Review [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
2. Follow [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md)
3. Validate with [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)

---

**Environment Status**: READY FOR IMPLEMENTATION
