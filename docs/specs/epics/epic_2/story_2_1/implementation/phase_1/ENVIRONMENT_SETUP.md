# Phase 1: i18n Configuration - Environment Setup

## Prerequisites

This document outlines the environment requirements and setup steps needed before implementing Phase 1.

---

## System Requirements

### Required Software

| Software | Minimum Version | Check Command    | Notes           |
| -------- | --------------- | ---------------- | --------------- |
| Node.js  | 18.x            | `node --version` | LTS recommended |
| pnpm     | 8.x             | `pnpm --version` | Package manager |
| Git      | 2.x             | `git --version`  | Version control |

### Recommended Tools

| Tool              | Purpose             | Installation                               |
| ----------------- | ------------------- | ------------------------------------------ |
| VS Code           | IDE                 | [Download](https://code.visualstudio.com/) |
| Payload Extension | Payload CMS support | VS Code marketplace                        |

---

## Project Setup

### 1. Clone and Install

If starting fresh:

```bash
# Clone repository
git clone <repository-url>
cd sebcdev-payload

# Install dependencies
pnpm install
```

### 2. Verify Installation

```bash
# Check all dependencies are installed
pnpm install --frozen-lockfile

# Verify TypeScript compilation
pnpm tsc --noEmit
```

### 3. Environment Variables

Ensure `.env` file exists with required variables:

```bash
# Check .env exists
cat .env

# Required variables
PAYLOAD_SECRET=<your-secret>
```

If missing, copy from example:

```bash
cp .env.example .env
# Edit .env with your values
```

---

## Branch Setup

### Create Feature Branch (Recommended)

```bash
# Ensure you're on the epic branch
git checkout epic/epic-2-cms-core

# Pull latest changes
git pull origin epic/epic-2-cms-core

# Create feature branch for this phase (optional)
git checkout -b feature/story-2.1-phase-1-i18n
```

### Or Work Directly on Epic Branch

```bash
# Switch to epic branch
git checkout epic/epic-2-cms-core

# Pull latest
git pull origin epic/epic-2-cms-core
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
3. If first time, create admin user

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

---

## File Locations

### Files to Modify in This Phase

| File                | Location                | Action                  |
| ------------------- | ----------------------- | ----------------------- |
| `payload.config.ts` | `src/payload.config.ts` | Add localization config |
| `payload-types.ts`  | `src/payload-types.ts`  | Regenerate (automated)  |

### Reference Files

| File       | Location                                         | Purpose             |
| ---------- | ------------------------------------------------ | ------------------- |
| CLAUDE.md  | `./CLAUDE.md`                                    | Project conventions |
| PRD.md     | `docs/specs/PRD.md`                              | Requirements        |
| Story Spec | `docs/specs/epics/epic_2/story_2_1/story_2.1.md` | Story details       |

---

## IDE Configuration

### VS Code Settings (Recommended)

Create or update `.vscode/settings.json`:

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

---

## Cloudflare Bindings (Context)

This project uses Cloudflare Workers with D1 and R2 bindings. For Phase 1 (i18n configuration), these bindings are not directly affected, but understanding the setup helps:

### wrangler.jsonc

The Cloudflare configuration is in `wrangler.jsonc`:

```jsonc
{
  "name": "sebcdev-payload",
  "d1_databases": [
    {
      "binding": "D1",
      "database_name": "sebcdev-payload",
      "database_id": "...",
    },
  ],
  "r2_buckets": [
    {
      "binding": "R2",
      "bucket_name": "sebcdev-payload-media",
    },
  ],
}
```

### Local Development

During `pnpm dev`, Wrangler automatically provides local bindings for D1 and R2.

---

## Troubleshooting Setup

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

### Issue: Cloudflare binding errors

```bash
# Verify wrangler configuration
pnpm exec wrangler d1 list

# Check environment
echo $CLOUDFLARE_ENV
```

---

## Pre-Implementation Checklist

Before starting implementation, verify:

- [ ] Node.js 18+ installed
- [ ] pnpm installed and working
- [ ] Git configured with correct credentials
- [ ] Repository cloned and dependencies installed
- [ ] `.env` file configured
- [ ] `pnpm dev` starts successfully
- [ ] Admin panel accessible at `/admin`
- [ ] `pnpm generate:types:payload` works
- [ ] `pnpm build` succeeds
- [ ] On correct Git branch

---

## Quick Commands Reference

```bash
# Setup
pnpm install              # Install dependencies
cp .env.example .env      # Create env file

# Development
pnpm dev                  # Start dev server
pnpm build               # Build project
pnpm lint                # Run linter

# Types
pnpm generate:types:payload    # Generate Payload types
pnpm generate:types           # Generate all types

# Git
git checkout epic/epic-2-cms-core
git pull origin epic/epic-2-cms-core
git status
```

---

## Next Steps

Once environment is verified:

1. Review [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
2. Follow [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md)
3. Validate with [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)

---

**Environment Status**: READY FOR IMPLEMENTATION
