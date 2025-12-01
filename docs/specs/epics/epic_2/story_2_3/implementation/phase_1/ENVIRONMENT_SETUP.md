# Environment Setup - Phase 1 : CodeBlock Definition

## Prerequisites

### Required Tools

| Tool       | Version  | Check Command        | Purpose                     |
| ---------- | -------- | -------------------- | --------------------------- |
| Node.js    | >= 20.x  | `node --version`     | JavaScript runtime          |
| pnpm       | >= 9.x   | `pnpm --version`     | Package manager             |
| Git        | >= 2.x   | `git --version`      | Version control             |
| VS Code    | Latest   | -                    | IDE (recommended)           |

### Required Dependencies

Ces dependances sont deja installees dans le projet :

| Package                       | Version | Purpose                        |
| ----------------------------- | ------- | ------------------------------ |
| `payload`                     | ^3.0.0  | Payload CMS core               |
| `@payloadcms/richtext-lexical`| ^3.0.0  | Lexical editor package         |
| `vitest`                      | ^2.0.0  | Test framework                 |
| `typescript`                  | ^5.0.0  | TypeScript compiler            |

---

## Setup Steps

### 1. Verify Project State

```bash
# Navigate to project root
cd /home/negus/dev/sebcdev-payload

# Verify on correct branch
git status

# Expected: On main branch or feature branch

# Pull latest changes
git pull origin main
```

### 2. Install Dependencies

```bash
# Install all dependencies
pnpm install

# Verify Payload is installed
pnpm list payload
```

### 3. Verify TypeScript Configuration

Check `tsconfig.json` has the correct path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@payload-config": ["./src/payload.config.ts"]
    }
  }
}
```

### 4. Verify Test Configuration

Check `vitest.config.ts` exists and has correct settings:

```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

---

## IDE Setup (VS Code)

### Recommended Extensions

| Extension                    | ID                                    | Purpose              |
| ---------------------------- | ------------------------------------- | -------------------- |
| ESLint                       | `dbaeumer.vscode-eslint`              | Linting              |
| Prettier                     | `esbenp.prettier-vscode`              | Code formatting      |
| TypeScript Vue Plugin (Volar)| `Vue.vscode-typescript-vue-plugin`    | TypeScript support   |
| Vitest                       | `vitest.explorer`                     | Test runner UI       |

### Workspace Settings

Creer ou mettre a jour `.vscode/settings.json` :

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## Directory Structure Before Phase 1

```
src/
|-- app/
|-- collections/
|   |-- index.ts
|   |-- Users.ts
|   |-- Media.ts
|   |-- Categories.ts
|   |-- Tags.ts
|   +-- Articles.ts
|-- migrations/
|-- payload.config.ts
+-- payload-types.ts

tests/
|-- unit/
|   +-- (existing tests)
|-- int/
+-- e2e/
```

## Directory Structure After Phase 1

```
src/
|-- app/
|-- blocks/              # NEW
|   |-- index.ts         # NEW - Barrel export
|   +-- CodeBlock.ts     # NEW - Block definition
|-- collections/
|-- migrations/
|-- payload.config.ts
+-- payload-types.ts

tests/
|-- unit/
|   |-- (existing tests)
|   +-- blocks.spec.ts   # NEW - Block tests
|-- int/
+-- e2e/
```

---

## Environment Variables

Aucune variable d'environnement specifique n'est requise pour Phase 1.

Les variables existantes du projet restent inchangees :

| Variable           | Required | Purpose                    |
| ------------------ | -------- | -------------------------- |
| `PAYLOAD_SECRET`   | Yes      | Payload encryption secret  |
| `CLOUDFLARE_ENV`   | No       | Cloudflare environment     |

---

## Pre-Implementation Verification

### Run These Commands

```bash
# 1. Verify TypeScript compiles
pnpm build
# Expected: Build succeeds

# 2. Verify linting passes
pnpm lint
# Expected: No errors

# 3. Verify tests pass
pnpm test:unit
# Expected: All existing tests pass

# 4. Verify types generate
pnpm generate:types:payload
# Expected: Types generate without errors
```

### Verify Import Paths

Create a temporary test file to verify path aliases work:

```typescript
// temp-test.ts (delete after verification)
import type { Block } from 'payload'

const testBlock: Block = {
  slug: 'test',
  fields: [],
}

console.log(testBlock.slug)
```

---

## Troubleshooting

### Issue: `pnpm install` fails

**Symptoms**: Dependency resolution errors

**Solution**:

```bash
# Clear pnpm cache
pnpm store prune

# Remove node_modules and reinstall
rm -rf node_modules
pnpm install
```

### Issue: TypeScript path alias not working

**Symptoms**: Cannot find module '@/...'

**Solution**: Check `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: Vitest not finding tests

**Symptoms**: No tests found

**Solution**: Check `vitest.config.ts` include pattern:

```typescript
test: {
  include: ['tests/**/*.spec.ts'],
}
```

### Issue: ESLint errors on new files

**Symptoms**: Linting fails on newly created files

**Solution**: Run format first:

```bash
pnpm format
pnpm lint
```

---

## Quick Start Commands

```bash
# Start development (not needed for Phase 1, but useful)
pnpm dev

# Run linting
pnpm lint

# Run unit tests
pnpm test:unit

# Run specific test file
pnpm test:unit tests/unit/blocks.spec.ts

# Build project
pnpm build

# Generate Payload types (after Phase 2)
pnpm generate:types:payload
```

---

## Next Steps

1. Read [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for commit strategy
2. Follow [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) for step-by-step implementation
3. Validate with [guides/TESTING.md](./guides/TESTING.md)
