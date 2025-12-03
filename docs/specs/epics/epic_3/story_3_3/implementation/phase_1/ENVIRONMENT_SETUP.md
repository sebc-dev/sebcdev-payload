# Phase 1: Environment Setup - shadcn/ui Navigation Components

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 1 of 5

This document describes the environment requirements and setup needed before implementing Phase 1.

---

## Prerequisites Verification

### Required Software

| Software | Version | Check Command |
|----------|---------|---------------|
| Node.js | >=18.18.0 | `node --version` |
| pnpm | >=8.0.0 | `pnpm --version` |
| Git | >=2.0.0 | `git --version` |

### Project Dependencies

Verify Story 3.2 (Design System) prerequisites are met:

```bash
# Check Tailwind CSS is configured
cat src/styles/globals.css | head -20

# Check shadcn/ui is initialized
cat components.json

# Check existing UI components
ls src/components/ui/
```

Expected output for `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

---

## Environment Configuration

### Node.js Environment

Ensure you're using the correct Node.js version:

```bash
# If using nvm
nvm use

# If using fnm
fnm use

# Verify version
node --version
# Expected: v18.x.x or v20.x.x or v22.x.x
```

### Package Manager

This project uses pnpm exclusively:

```bash
# Verify pnpm is installed
pnpm --version

# If not installed
npm install -g pnpm
```

### Install Dependencies

```bash
# Clean install
pnpm install

# Verify no dependency issues
pnpm audit
```

---

## Project State Verification

### Git State

```bash
# Verify you're on the correct branch
git branch --show-current
# Expected: epic-3-story-3.3-planning (or similar feature branch)

# Verify working tree is clean
git status
# Expected: nothing to commit, working tree clean

# Verify remote is up to date
git fetch origin
git status
```

### Build State

```bash
# Run full build
pnpm build

# Expected: Build succeeds without errors

# Run linter
pnpm lint

# Expected: No errors
```

### TypeScript State

```bash
# Type check
pnpm exec tsc --noEmit

# Expected: No errors
```

---

## Directory Structure Verification

Verify the expected structure exists:

```bash
# Check components/ui directory exists
ls -la src/components/ui/

# Expected files:
# - button.tsx (from Story 3.2)
```

### Create Missing Directories (if needed)

```bash
# If ui directory doesn't exist (unlikely if Story 3.2 is complete)
mkdir -p src/components/ui
```

---

## shadcn/ui Configuration

### Verify Configuration

```bash
# Check components.json exists and is valid
cat components.json | jq .

# Check the CSS variables are enabled
cat components.json | jq '.tailwind.cssVariables'
# Expected: true

# Check the style is set
cat components.json | jq '.style'
# Expected: "new-york"
```

### Test shadcn CLI

```bash
# Verify shadcn CLI works
pnpm dlx shadcn@latest --help

# Expected: Shows help menu with available commands
```

---

## Existing Components Inventory

Before adding new components, verify what already exists:

```bash
# List existing UI components
ls src/components/ui/

# Expected (minimum from Story 3.2):
# - button.tsx

# Check for any existing dropdown or sheet components
ls src/components/ui/ | grep -E "(dropdown|sheet)"
# Expected: No output (components don't exist yet)
```

---

## Radix UI Dependencies Check

Check for any existing Radix UI packages:

```bash
# List current Radix dependencies
pnpm list | grep "@radix-ui"

# Or check package.json directly
grep "@radix-ui" package.json
```

### Current Expected Radix Dependencies

After Story 3.2, you may have:
- `@radix-ui/react-slot` (used by Button)

After Phase 1, you will add:
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-dialog`

---

## Development Server Test

Verify the development environment works:

```bash
# Start development server
pnpm dev

# In another terminal, verify endpoints:
# - http://localhost:3000/fr (Homepage)
# - http://localhost:3000/admin (Admin panel)
```

Stop the server with `Ctrl+C` when done.

---

## Environment Variables

This phase doesn't require new environment variables. Verify existing ones:

```bash
# Check .env file exists
ls -la .env

# Verify required variables (example)
grep -E "^(PAYLOAD_SECRET|DATABASE_URL)" .env
```

---

## IDE Setup (Recommended)

### VS Code Extensions

Recommended extensions for this phase:

1. **Tailwind CSS IntelliSense** - For Tailwind class autocomplete
2. **ES7+ React/Redux/React-Native snippets** - For React snippets
3. **Pretty TypeScript Errors** - For readable TS errors

### VS Code Settings

Ensure TypeScript uses the workspace version:

```json
// .vscode/settings.json
{
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## Quick Setup Checklist

Run through this checklist before starting:

```bash
# 1. Verify Node.js version
node --version

# 2. Verify pnpm
pnpm --version

# 3. Install dependencies
pnpm install

# 4. Verify build works
pnpm build

# 5. Verify lint works
pnpm lint

# 6. Verify shadcn config
cat components.json

# 7. Verify git state
git status

# 8. Verify branch
git branch --show-current
```

All commands should succeed without errors.

---

## Troubleshooting

### Issue: pnpm not found

```bash
# Install pnpm globally
npm install -g pnpm

# Or use corepack (Node.js 16.10+)
corepack enable
corepack prepare pnpm@latest --activate
```

### Issue: Node.js version mismatch

```bash
# Install correct version with nvm
nvm install 20
nvm use 20

# Or with fnm
fnm install 20
fnm use 20
```

### Issue: Build fails

```bash
# Clean build artifacts
rm -rf .next .open-next

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Try build again
pnpm build
```

### Issue: components.json missing

If shadcn/ui wasn't initialized in Story 3.2:

```bash
# Initialize shadcn/ui
pnpm dlx shadcn@latest init

# Use these settings:
# Style: New York
# Base color: Neutral
# CSS variables: Yes
```

### Issue: TypeScript errors

```bash
# Generate types
pnpm generate:types

# If still failing, check tsconfig
cat tsconfig.json | jq '.compilerOptions.paths'
```

---

## Ready to Start?

Before proceeding to implementation:

1. [ ] All prerequisite checks pass
2. [ ] Build succeeds
3. [ ] Lint passes
4. [ ] Git working tree is clean
5. [ ] On correct feature branch
6. [ ] shadcn/ui is configured

If all items are checked, proceed to [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md).

---

**Document Created**: 2025-12-03
**Last Updated**: 2025-12-03
