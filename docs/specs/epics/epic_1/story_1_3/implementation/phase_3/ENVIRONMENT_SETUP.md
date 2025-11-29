# Phase 3 - Environment Setup

This guide covers all environment setup needed for Phase 3 (Code Quality: Linting & Formatting).

---

## Prerequisites

### Previous Phases

- [x] Phase 1 completed (quality-gate.yml foundation)
- [x] Phase 2 completed (Socket.dev configured)

### Tools Required

- [x] Node.js 20+ (already installed)
- [x] pnpm 9+ (already installed)
- [x] ESLint 9+ (already in devDependencies)
- [x] Prettier 3+ (already in devDependencies)

### Services Required

- [x] GitHub Actions enabled
- [x] Repository access configured

---

## Dependencies Installation

### Install New Packages

```bash
# Install Prettier Tailwind plugin
pnpm add -D prettier-plugin-tailwindcss

# Install ESLint Prettier config
pnpm add -D eslint-config-prettier
```

**Packages added**:

- `prettier-plugin-tailwindcss` - Sorts Tailwind CSS classes in consistent order
- `eslint-config-prettier` - Disables ESLint rules that conflict with Prettier

### Verify Installation

```bash
# Check packages are installed
pnpm list prettier-plugin-tailwindcss eslint-config-prettier

# Verify versions
cat package.json | grep -E "(prettier|eslint)"
```

**Expected Output**:

```
prettier-plugin-tailwindcss 0.x.x
eslint-config-prettier 9.x.x
```

---

## Configuration Files

### Prettier Configuration

**File**: `prettier.config.mjs`
**Location**: Repository root

```javascript
/** @type {import("prettier").Config} */
const config = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss'],
}

export default config
```

### Prettier Ignore

**File**: `.prettierignore`
**Location**: Repository root

```
# Build outputs
.next/
.open-next/
dist/
build/

# Dependencies
node_modules/

# Generated files
src/payload-types.ts
pnpm-lock.yaml

# Cloudflare
.wrangler/
cloudflare-env.d.ts

# Database
drizzle/migrations/

# IDE
.idea/
.vscode/
```

### ESLint Configuration

**File**: `eslint.config.mjs`
**Location**: Repository root (modify existing)

Key additions:

- Add `...compat.extends('prettier')` **last** in array
- Add generated files to ignores

---

## Environment Variables

No new environment variables required for Phase 3.

Existing variables remain unchanged:

- `PAYLOAD_SECRET` - Used by Payload CMS
- `CLOUDFLARE_ENV` - Used for deployment

---

## Package.json Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

**Existing scripts** (no changes needed):

- `lint` - Already configured for ESLint

---

## IDE Setup (Optional but Recommended)

### VS Code

1. Install extensions:
   - ESLint (`dbaeumer.vscode-eslint`)
   - Prettier (`esbenp.prettier-vscode`)

2. Create/update `.vscode/settings.json`:
   ```json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": "explicit"
     },
     "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
   }
   ```

### WebStorm / IntelliJ

1. Enable ESLint: `Settings > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint`
2. Enable Prettier: `Settings > Languages & Frameworks > JavaScript > Prettier`
3. Set Prettier as default formatter
4. Enable "Run on save"

---

## Validation Tests

### Test Prettier

```bash
# Check all files
pnpm exec prettier --check .

# Format all files
pnpm format

# Check specific file
pnpm exec prettier --check src/app/page.tsx
```

**Expected Result**: No errors or files listed that need formatting

### Test ESLint

```bash
# Run lint
pnpm lint

# With cache
pnpm exec eslint . --cache --cache-location .eslintcache

# Check specific file
pnpm exec eslint src/app/page.tsx
```

**Expected Result**: No errors (warnings are OK)

### Test Integration

```bash
# Run both checks (as CI will)
pnpm lint && pnpm format:check
```

**Expected Result**: Both pass without errors

---

## Troubleshooting

### Issue: Prettier and ESLint Report Conflicting Errors

**Symptoms**:

- ESLint says add semicolon, Prettier says remove it
- Formatting keeps changing back and forth

**Solutions**:

1. Ensure `eslint-config-prettier` is installed
2. Verify it's **last** in ESLint config extends array
3. Restart your IDE

**Verify Fix**:

```bash
pnpm lint && pnpm format:check
```

---

### Issue: ESLint Cache Not Working

**Symptoms**:

- ESLint runs slowly every time
- No `.eslintcache` file created

**Solutions**:

1. Run with cache flag explicitly:
   ```bash
   pnpm exec eslint . --cache --cache-location .eslintcache
   ```
2. Add `.eslintcache` to `.gitignore`

**Verify Fix**:

```bash
ls -la .eslintcache
```

---

### Issue: Prettier Plugin Not Working

**Symptoms**:

- Tailwind classes not sorted
- Plugin errors in output

**Solutions**:

1. Verify plugin is installed:
   ```bash
   pnpm list prettier-plugin-tailwindcss
   ```
2. Check config syntax:
   ```bash
   node -e "import('./prettier.config.mjs').then(c => console.log(c.default))"
   ```
3. Reinstall if needed:
   ```bash
   pnpm add -D prettier-plugin-tailwindcss
   ```

---

### Issue: Generated Files Being Linted

**Symptoms**:

- Errors in `payload-types.ts`
- Lint errors in migration files

**Solutions**:

1. Add to `eslint.config.mjs` ignores:
   ```javascript
   {
     ignores: [
       'src/payload-types.ts',
       'drizzle/migrations/',
     ],
   }
   ```
2. Add to `.prettierignore`

**Verify Fix**:

```bash
pnpm lint
pnpm format:check
```

---

## Setup Checklist

Complete this checklist before starting implementation:

- [ ] All prerequisites met
- [ ] `prettier-plugin-tailwindcss` installed
- [ ] `eslint-config-prettier` installed
- [ ] IDE extensions installed (optional)
- [ ] Validation tests pass
- [ ] No lint errors on existing codebase

**Environment is ready!**

---

**Document Created**: 2025-11-29
**Last Updated**: 2025-11-29
