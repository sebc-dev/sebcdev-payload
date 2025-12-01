# Phase 1 - Environment Setup

This guide covers all environment setup needed for Phase 1.

---

## 📋 Prerequisites

### Previous Phases

- [x] No previous phases required (Phase 1 is first)

### Tools Required

- [x] Node.js (v18.20.2+ or v20.9.0+)
- [x] pnpm (v9 or v10)
- [x] Git
- [x] IDE with TypeScript support (VS Code recommended)

### Project State

- [x] Project cloned from repository
- [x] On correct branch (`epic-3-story-3-1` or feature branch)
- [x] Previous commits up to date with main

---

## 📦 Dependencies Installation

### Verify Current State

Before starting, ensure your environment is clean:

```bash
# Check Node.js version
node --version
# Expected: v18.x.x or v20.x.x

# Check pnpm version
pnpm --version
# Expected: 9.x.x or 10.x.x

# Clean install existing dependencies
pnpm install
```

### Install New Package

Phase 1 adds a single new dependency:

```bash
pnpm add next-intl@^4
```

**Package added**:

- `next-intl` (v4.x) - Internationalization library for Next.js App Router

### Verify Installation

```bash
# Check package is installed
pnpm list next-intl

# Expected output:
# next-intl@4.x.x
```

---

## 🔧 No Environment Variables Required

Phase 1 does not require any new environment variables. The i18n configuration is static and compiled into the bundle.

**Existing environment**:
- `PAYLOAD_SECRET` - Already configured (no changes)
- Cloudflare bindings - Already configured (no changes)

---

## 📁 Directory Structure Setup

### Create i18n Directory

```bash
mkdir -p src/i18n
```

### Create Messages Directory

```bash
mkdir -p messages
```

### Expected Structure After Phase 1

```
project-root/
├── messages/
│   ├── fr.json          # French translations
│   └── en.json          # English translations
├── src/
│   └── i18n/
│       ├── config.ts    # Locale definitions
│       ├── routing.ts   # Routing configuration
│       └── request.ts   # Server request config
├── global.d.ts          # Type augmentation
└── ...existing files
```

---

## 🔍 TypeScript Configuration

### Verify tsconfig.json

Ensure your `tsconfig.json` has these settings (should already be present):

```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "strict": true
  }
}
```

### Check Configuration

```bash
# Verify TypeScript is working
pnpm exec tsc --noEmit
```

**Expected Result**: No errors (existing codebase should compile)

---

## 🧪 Verification Commands

### Quick Health Check

Run these commands to verify your environment is ready:

```bash
# 1. Verify Node.js
node --version

# 2. Verify pnpm
pnpm --version

# 3. Verify dependencies
pnpm install

# 4. Verify TypeScript
pnpm exec tsc --noEmit

# 5. Verify linting
pnpm lint

# 6. Verify build (optional, slower)
pnpm build
```

All commands should complete without errors.

---

## 🚨 Troubleshooting

### Issue: pnpm install fails

**Symptoms**:
- Network errors
- Peer dependency conflicts

**Solutions**:

1. Clear pnpm cache:
   ```bash
   pnpm store prune
   ```

2. Try fresh install:
   ```bash
   rm -rf node_modules
   rm pnpm-lock.yaml
   pnpm install
   ```

3. Check npm registry access:
   ```bash
   pnpm ping
   ```

---

### Issue: TypeScript errors on fresh clone

**Symptoms**:
- `Cannot find module '@/*'`
- Path resolution errors

**Solutions**:

1. Ensure types are generated:
   ```bash
   pnpm generate:types
   ```

2. Check tsconfig.json paths:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

3. Restart TypeScript server in IDE

---

### Issue: next-intl version mismatch

**Symptoms**:
- Type errors from next-intl
- Missing exports

**Solutions**:

1. Check installed version:
   ```bash
   pnpm list next-intl
   ```

2. If v3.x, upgrade:
   ```bash
   pnpm add next-intl@^4
   ```

3. If v5.x (future), downgrade:
   ```bash
   pnpm add next-intl@^4
   ```

---

### Issue: IDE not recognizing new files

**Symptoms**:
- Import errors in IDE but `tsc` works
- Autocomplete not working

**Solutions**:

1. Restart TypeScript server:
   - VS Code: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"

2. Reload window:
   - VS Code: `Cmd/Ctrl + Shift + P` → "Developer: Reload Window"

---

## 📝 Setup Checklist

Complete this checklist before starting implementation:

- [ ] Node.js v18+ or v20+ installed
- [ ] pnpm v9+ installed
- [ ] Project dependencies installed (`pnpm install`)
- [ ] TypeScript compiles (`pnpm exec tsc --noEmit`)
- [ ] Linter passes (`pnpm lint`)
- [ ] `src/i18n/` directory ready to create
- [ ] `messages/` directory ready to create

**Environment is ready!** 🚀

---

## 🔗 Reference Links

- [next-intl Installation](https://next-intl.dev/docs/getting-started/app-router)
- [Node.js Downloads](https://nodejs.org/)
- [pnpm Installation](https://pnpm.io/installation)
- [TypeScript Configuration](https://www.typescriptlang.org/tsconfig)
