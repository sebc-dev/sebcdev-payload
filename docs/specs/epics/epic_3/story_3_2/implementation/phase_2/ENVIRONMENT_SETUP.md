# Phase 2: Environment Setup

**Phase**: shadcn/ui & Utility Functions
**Story**: 3.2 - Integration Design System (Dark Mode)

---

## Prerequisites

Before starting Phase 2, ensure the following:

### Phase 1 Completion

- [ ] Tailwind CSS 4 installed
- [ ] `postcss.config.mjs` exists and configured
- [ ] `src/app/globals.css` has Tailwind imports
- [ ] `pnpm build` succeeds
- [ ] `pnpm dev` works without errors

### Development Environment

| Requirement | Minimum Version | Check Command |
|-------------|-----------------|---------------|
| Node.js | 18.20.2 or 20.9.0+ | `node -v` |
| pnpm | 9.x or 10.x | `pnpm -v` |
| Git | 2.x | `git --version` |

### Verify Current State

```bash
# Check Node.js version
node -v

# Check pnpm version
pnpm -v

# Verify Phase 1 completion
pnpm build

# Verify current branch
git branch --show-current
```

---

## Environment Variables

### No New Variables Required

Phase 2 does not require any new environment variables. The existing configuration from Phase 1 is sufficient.

### Existing Variables (Reference)

| Variable | Purpose | Location |
|----------|---------|----------|
| `PAYLOAD_SECRET` | Payload CMS secret | `.env` |
| `CLOUDFLARE_ENV` | Deployment environment | `.env` |

---

## Branch Setup

### Create Feature Branch

```bash
# Ensure you're on the latest main
git checkout main
git pull origin main

# Create phase branch
git checkout -b epic-3-story-3-2-phase2

# Verify branch
git branch --show-current
# Expected: epic-3-story-3-2-phase2
```

### If Continuing from Phase 1

```bash
# If Phase 1 was merged to main
git checkout main
git pull origin main
git checkout -b epic-3-story-3-2-phase2

# If Phase 1 is still in a feature branch
git checkout epic-3-story-3-2-phase1
git checkout -b epic-3-story-3-2-phase2
```

---

## Project Structure Verification

### Existing Structure (from Phase 1)

```
sebcdev-payload/
├── package.json              # Contains Tailwind deps
├── postcss.config.mjs        # PostCSS configuration
├── tsconfig.json             # TypeScript config with paths
├── src/
│   ├── app/
│   │   ├── globals.css       # Tailwind imports
│   │   └── [locale]/
│   │       └── layout.tsx    # Imports globals.css
│   └── lib/
│       ├── lucide-icons.ts   # Existing utility
│       ├── validators.ts     # Existing utility
│       └── logger.ts         # Existing utility
└── ...
```

### Expected Structure After Phase 2

```
sebcdev-payload/
├── package.json              # + clsx, tailwind-merge, cva, radix-slot
├── postcss.config.mjs
├── tsconfig.json
├── components.json           # NEW: shadcn/ui config
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   └── [locale]/
│   │       ├── layout.tsx
│   │       └── (frontend)/
│   │           └── page.tsx  # MODIFIED: Uses Button
│   ├── components/
│   │   └── ui/
│   │       └── button.tsx    # NEW: Button component
│   └── lib/
│       ├── utils.ts          # NEW: cn() utility
│       ├── lucide-icons.ts
│       ├── validators.ts
│       └── logger.ts
└── ...
```

---

## Dependencies Installation

### New Dependencies for Phase 2

| Package | Version | Type | Purpose |
|---------|---------|------|---------|
| `clsx` | ^2.x | prod | Conditional classes |
| `tailwind-merge` | ^2.x | prod | Class merging |
| `class-variance-authority` | ^0.7.x | prod | Variant management |
| `@radix-ui/react-slot` | latest | prod | Slot component |

### Installation Command

```bash
# Install all at once
pnpm add clsx tailwind-merge class-variance-authority @radix-ui/react-slot

# Verify installation
pnpm list clsx tailwind-merge class-variance-authority @radix-ui/react-slot
```

---

## TypeScript Configuration

### Verify Path Aliases

The `tsconfig.json` should have these path aliases (already configured):

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

### Required Aliases for shadcn/ui

These paths will be used by shadcn/ui components:

| Alias | Path | Usage |
|-------|------|-------|
| `@/components` | `./src/components` | All components |
| `@/components/ui` | `./src/components/ui` | shadcn/ui components |
| `@/lib/utils` | `./src/lib/utils.ts` | cn() utility |
| `@/lib` | `./src/lib` | Utility functions |
| `@/hooks` | `./src/hooks` | Custom hooks (future) |

All these are covered by the existing `@/*` alias.

---

## IDE Configuration

### VS Code Extensions (Recommended)

| Extension | Purpose |
|-----------|---------|
| ESLint | Linting |
| Prettier | Formatting |
| Tailwind CSS IntelliSense | Tailwind autocomplete |
| TypeScript | TypeScript support |

### VS Code Settings

Add to `.vscode/settings.json` (if not already present):

```json
{
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

This enables Tailwind CSS IntelliSense inside `cn()` and `cva()` functions.

---

## Pre-Implementation Verification

### Run These Commands

```bash
# 1. Clean install
pnpm install

# 2. Verify build works
pnpm build

# 3. Check for TypeScript errors
pnpm exec tsc --noEmit

# 4. Run linter
pnpm lint

# 5. Start dev server
pnpm dev
```

### Expected Results

| Command | Expected Result |
|---------|-----------------|
| `pnpm install` | Exit code 0, no errors |
| `pnpm build` | Exit code 0, builds successfully |
| `tsc --noEmit` | Exit code 0, no type errors |
| `pnpm lint` | Exit code 0, no lint errors |
| `pnpm dev` | Server starts on localhost:3000 |

---

## Directory Creation

### Create Required Directories

```bash
# Create components/ui directory for shadcn components
mkdir -p src/components/ui

# Create hooks directory for future use
mkdir -p src/hooks

# Verify creation
ls -la src/components/
ls -la src/hooks/
```

---

## Troubleshooting

### Issue: `pnpm install` fails

**Symptoms**: Dependency resolution errors

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: TypeScript path alias not working

**Symptoms**: "Cannot find module '@/lib/utils'"

**Solution**:
1. Verify `tsconfig.json` has correct paths
2. Restart TypeScript server in VS Code (`Cmd+Shift+P` > "TypeScript: Restart TS Server")
3. Ensure `baseUrl` is set to `"."`

### Issue: Tailwind classes not applying

**Symptoms**: Tailwind classes have no effect

**Solution**:
1. Verify `globals.css` has `@import "tailwindcss"`
2. Verify `globals.css` is imported in layout
3. Check PostCSS config is correct
4. Restart dev server

### Issue: Git branch issues

**Symptoms**: Can't create branch, conflicts

**Solution**:
```bash
# Stash any changes
git stash

# Fetch latest
git fetch origin

# Reset to main
git checkout main
git reset --hard origin/main

# Create new branch
git checkout -b epic-3-story-3-2-phase2
```

---

## Environment Checklist

Before starting implementation, verify:

### Tools & Versions

- [ ] Node.js 18.20.2+ or 20.9.0+
- [ ] pnpm 9.x or 10.x
- [ ] Git 2.x

### Project State

- [ ] Phase 1 completed
- [ ] All dependencies installed
- [ ] Build succeeds
- [ ] Dev server works
- [ ] Correct branch created

### Configuration

- [ ] `tsconfig.json` has path aliases
- [ ] `postcss.config.mjs` exists
- [ ] `globals.css` has Tailwind imports
- [ ] VS Code extensions installed (optional)

### Directories

- [ ] `src/components/ui/` exists
- [ ] `src/hooks/` exists (optional for now)

---

## Ready to Implement?

Once all checkboxes above are completed, you're ready to start Phase 2 implementation.

Proceed to:
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) - For detailed implementation steps
- [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) - For commit-by-commit checklist

---

**Environment Setup Status**: READY
**Created**: 2025-12-02
**Last Updated**: 2025-12-02
