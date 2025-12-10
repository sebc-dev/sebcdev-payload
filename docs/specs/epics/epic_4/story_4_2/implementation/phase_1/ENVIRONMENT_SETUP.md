# Phase 1: TOC Data Extraction - Environment Setup

**Story**: 4.2 - Table des Matières (TOC) & Progression
**Phase**: 1 - TOC Data Extraction

---

## Prerequisites

### Required Software

| Software | Version | Check Command |
|----------|---------|---------------|
| Node.js | 20.x+ | `node --version` |
| pnpm | 9.x+ | `pnpm --version` |
| Git | 2.x+ | `git --version` |

### Verify Installation

```bash
# Check all prerequisites
node --version    # Should be v20.x or higher
pnpm --version    # Should be v9.x or higher
git --version     # Should be v2.x or higher
```

---

## Project Setup

### 1. Clone/Update Repository

```bash
# If starting fresh
git clone <repository-url>
cd sebcdev-payload

# If already cloned, ensure up to date
git fetch origin
git checkout main
git pull origin main
```

### 2. Install Dependencies

```bash
pnpm install
```

**Expected Output**: No errors, all dependencies installed.

### 3. Verify TypeScript Setup

```bash
# Check TypeScript compiles
pnpm exec tsc --noEmit
```

**Expected Output**: No errors or warnings.

### 4. Verify Testing Setup

```bash
# Run existing unit tests to ensure Vitest works
pnpm test:unit
```

**Expected Output**: All tests pass.

---

## Branch Setup

### Create Feature Branch

```bash
# Ensure you're on latest main
git checkout main
git pull origin main

# Create feature branch for Phase 1
git checkout -b feature/story-4.2-phase-1
```

### Verify Branch

```bash
git branch --show-current
# Should output: feature/story-4.2-phase-1
```

---

## IDE Setup

### VS Code (Recommended)

**Required Extensions**:
- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense

**Recommended Settings** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### Path Aliases

Ensure your IDE recognizes the TypeScript path aliases:

| Alias | Maps To |
|-------|---------|
| `@/*` | `./src/*` |
| `@payload-config` | `./src/payload.config.ts` |

These are configured in `tsconfig.json` and should work automatically.

---

## Directory Structure

### Existing Structure (Relevant Files)

```
src/
├── components/
│   └── richtext/
│       ├── nodes/
│       │   └── Heading.tsx      # Current slugify location
│       └── types.ts             # Lexical type definitions
├── lib/
│   ├── constants.ts
│   ├── utils.ts
│   ├── logger.ts
│   └── seo/                     # Reference for module structure
│       ├── types.ts
│       ├── article-metadata.ts
│       └── index.ts
```

### Target Structure (After Phase 1)

```
src/
├── components/
│   └── richtext/
│       ├── nodes/
│       │   └── Heading.tsx      # Modified: imports slugify from @/lib/toc
│       └── types.ts
├── lib/
│   ├── toc/                     # NEW: TOC module
│   │   ├── types.ts             # TOCHeading, TOCData types
│   │   ├── slugify.ts           # Shared slugify utility
│   │   ├── extract-headings.ts  # extractTOCHeadings function
│   │   └── index.ts             # Barrel exports
│   └── ...existing files

tests/
└── unit/
    └── lib/
        └── toc/                 # NEW: TOC tests
            └── extract-headings.spec.ts
```

---

## Configuration Files

### TypeScript (`tsconfig.json`)

No changes required. Current configuration supports:
- Strict mode enabled
- Path aliases configured
- ES2022 target

### Vitest (`vitest.config.ts`)

No changes required. Current configuration includes:
- jsdom environment for DOM testing
- Path aliases mirrored from tsconfig
- Coverage reporting enabled

### ESLint

No changes required. Current rules apply to new files automatically.

---

## Environment Variables

This phase does **not** require any environment variables. All functionality is pure TypeScript/JavaScript without external dependencies.

### Verification

```bash
# Not required, but if you want to verify .env setup:
cat .env.example
```

---

## Pre-Implementation Verification

Run this checklist to ensure environment is ready:

```bash
# 1. Verify on correct branch
git branch --show-current
# Expected: feature/story-4.2-phase-1

# 2. Verify dependencies installed
pnpm install

# 3. Verify TypeScript compiles
pnpm exec tsc --noEmit

# 4. Verify linting passes
pnpm lint

# 5. Verify tests run
pnpm test:unit

# 6. Verify dev server starts (optional)
pnpm dev
# Visit http://localhost:3000
```

### Expected Results

- [ ] On `feature/story-4.2-phase-1` branch
- [ ] Dependencies installed (no errors)
- [ ] TypeScript compiles (no errors)
- [ ] ESLint passes (no errors)
- [ ] Unit tests pass (all green)
- [ ] Dev server starts (optional, for integration testing)

---

## Troubleshooting

### Common Issues

#### Issue: `pnpm install` fails

```bash
# Clear pnpm cache and reinstall
pnpm store prune
rm -rf node_modules
pnpm install
```

#### Issue: TypeScript path aliases not working

```bash
# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P > "TypeScript: Restart TS Server"

# Or verify tsconfig.json has paths configured
cat tsconfig.json | grep -A5 '"paths"'
```

#### Issue: Tests fail with module not found

```bash
# Ensure vitest config mirrors tsconfig paths
cat vitest.config.ts | grep -A10 'alias'

# Clear vitest cache
pnpm test:unit --clearCache
```

#### Issue: ESLint errors on new files

```bash
# Run eslint fix
pnpm lint --fix

# Or check specific file
pnpm exec eslint src/lib/toc/types.ts
```

---

## Quick Reference Commands

| Task | Command |
|------|---------|
| Install dependencies | `pnpm install` |
| Type check | `pnpm exec tsc --noEmit` |
| Lint | `pnpm lint` |
| Lint with fix | `pnpm lint --fix` |
| Run unit tests | `pnpm test:unit` |
| Run specific test | `pnpm test:unit tests/unit/lib/toc/` |
| Start dev server | `pnpm dev` |
| Check branch | `git branch --show-current` |
| View git status | `git status` |

---

## Next Steps

Once environment is verified:

1. Read [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for commit strategy
2. Follow [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) for step-by-step implementation

---

**Setup Guide Generated**: 2025-12-10
**Last Updated**: 2025-12-10
