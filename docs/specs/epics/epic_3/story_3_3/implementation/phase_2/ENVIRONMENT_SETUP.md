# Phase 2: Environment Setup - Header & Desktop Navigation

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 2 of 5

This document describes the environment requirements and setup needed before implementing Phase 2.

---

## Prerequisites Verification

### Required Software

| Software | Version | Check Command |
|----------|---------|---------------|
| Node.js | >=18.18.0 | `node --version` |
| pnpm | >=8.0.0 | `pnpm --version` |
| Git | >=2.0.0 | `git --version` |

### Phase 1 Completion

Phase 2 requires Phase 1 to be complete. Verify:

```bash
# Check DropdownMenu component exists
ls src/components/ui/dropdown-menu.tsx

# Check Sheet component exists (used in Phase 4)
ls src/components/ui/sheet.tsx

# Both should exist and have content
wc -l src/components/ui/dropdown-menu.tsx src/components/ui/sheet.tsx
```

**Expected**: Both files exist with ~100+ lines each.

---

## Project Dependencies

### Required Packages

Verify these packages are installed:

```bash
# Check next-intl (for i18n)
grep "next-intl" package.json

# Check Radix UI dropdown (from Phase 1)
grep "@radix-ui/react-dropdown-menu" package.json

# Check class-variance-authority (for cn utility)
grep "class-variance-authority" package.json

# Check clsx (for cn utility)
grep "clsx" package.json
```

### Add lucide-react (if not installed)

The Navigation component uses icons from lucide-react:

```bash
# Check if installed
grep "lucide-react" package.json

# If not installed, add it
pnpm add lucide-react
```

---

## i18n Configuration

### Verify next-intl Setup

```bash
# Check i18n config exists
ls src/i18n/

# Expected files:
# - routing.ts (or routing.tsx)
# - request.ts
```

### Verify Routing Exports

The Navigation component uses `Link` and `usePathname` from next-intl routing:

```bash
# Check routing exports
grep -E "export.*Link|export.*usePathname" src/i18n/routing.ts
```

If these exports are missing, you need to create them. See [next-intl createNavigation docs](https://next-intl-docs.vercel.app/docs/routing/navigation).

### Expected routing.ts Structure

```typescript
// src/i18n/routing.ts
import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
})

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
```

### Verify Message Files

```bash
# Check message files exist
ls messages/

# Expected:
# - fr.json
# - en.json

# Verify JSON is valid
cat messages/fr.json | jq . > /dev/null && echo "FR valid"
cat messages/en.json | jq . > /dev/null && echo "EN valid"
```

---

## Project Structure Verification

### Existing Directories

```bash
# Check these directories exist
ls -la src/components/ui/
ls -la src/lib/
ls -la src/i18n/
ls -la messages/
```

### Create Layout Directory

```bash
# Create the layout components directory
mkdir -p src/components/layout

# Verify
ls src/components/
# Should include: layout/ ui/
```

### Verify utils.ts

The components use the `cn` utility function:

```bash
# Check utils exists
cat src/lib/utils.ts
```

**Expected content**:

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## Tailwind Configuration

### Verify Tailwind v4 Setup

```bash
# Check globals.css has Tailwind imports
head -20 src/styles/globals.css
```

**Expected**: Should include `@import "tailwindcss"` or similar v4 syntax.

### Verify Design Tokens

Check that the required CSS variables exist:

```bash
# Check for color variables
grep -E "(--background|--foreground|--primary|--muted|--accent|--border|--popover)" src/styles/globals.css | head -20
```

### Required CSS Variables

The Header components use these variables:

| Variable | Usage | Expected Value (Dark Mode) |
|----------|-------|---------------------------|
| `--background` | Header background | ~#1A1D23 |
| `--foreground` | Text color | ~#F9FAFB |
| `--primary` | Active links | ~#14B8A6 |
| `--muted-foreground` | Inactive links | ~#9CA3AF |
| `--accent` | Hover background | ~#374151 |
| `--border` | Header border | ~#374151 |
| `--popover` | Dropdown background | ~#2D3748 |

### Container Configuration

Verify container class is configured:

```bash
# Check for container configuration
grep -A5 "container" tailwind.config.ts 2>/dev/null || echo "Check tailwind config"
```

If using Tailwind v4, container may be auto-configured. Test with:

```bash
# Start dev server and check if .container class works
pnpm dev
# Inspect element with class="container" in browser
```

---

## Environment Configuration

### Node.js Environment

```bash
# If using nvm
nvm use

# If using fnm
fnm use

# Verify version
node --version
# Expected: v18.x.x or v20.x.x or v22.x.x
```

### Install Dependencies

```bash
# Clean install
pnpm install

# Verify no dependency issues
pnpm audit
```

---

## Git State Verification

### Branch State

```bash
# Verify you're on the correct branch
git branch --show-current
# Expected: epic-3-story-3.3-planning (or similar feature branch)

# Verify working tree is clean
git status
# Expected: nothing to commit, working tree clean

# Verify Phase 1 commits exist
git log --oneline -5
# Should see Phase 1 commits
```

### Sync with Remote

```bash
# Fetch latest from remote
git fetch origin

# Check if behind
git status
# If behind, consider: git pull --rebase origin <branch>
```

---

## Build State Verification

### Run Full Build

```bash
# Full build
pnpm build
# Expected: Build succeeds without errors

# Type check
pnpm exec tsc --noEmit
# Expected: No errors

# Lint check
pnpm lint
# Expected: No errors (warnings acceptable)
```

---

## Development Server Test

### Start Dev Server

```bash
pnpm dev
```

### Verify Endpoints

Navigate to and verify:

| URL | Expected |
|-----|----------|
| `http://localhost:3000/fr` | French homepage loads |
| `http://localhost:3000/en` | English homepage loads |
| `http://localhost:3000/admin` | Admin panel loads |

### Check Console

- [ ] No errors in browser console
- [ ] No hydration warnings
- [ ] Server responds correctly

Stop the server with `Ctrl+C`.

---

## IDE Setup (Recommended)

### VS Code Extensions

Recommended for this phase:

1. **Tailwind CSS IntelliSense** - For Tailwind class autocomplete
2. **ES7+ React/Redux/React-Native snippets** - For React snippets
3. **Pretty TypeScript Errors** - For readable TS errors
4. **next-intl** - For i18n key autocomplete (if available)

### VS Code Settings

Ensure TypeScript uses workspace version:

```json
// .vscode/settings.json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.formatOnSave": true
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

# 4. Verify Phase 1 complete
ls src/components/ui/dropdown-menu.tsx

# 5. Create layout directory
mkdir -p src/components/layout

# 6. Verify lucide-react
grep "lucide-react" package.json || pnpm add lucide-react

# 7. Verify i18n routing
grep "usePathname" src/i18n/routing.ts

# 8. Verify build works
pnpm build

# 9. Verify lint works
pnpm lint

# 10. Verify git state
git status
git branch --show-current
```

All commands should succeed without errors.

---

## Troubleshooting

### Issue: lucide-react not found

```bash
# Install lucide icons
pnpm add lucide-react

# Verify
grep "lucide-react" package.json
```

### Issue: usePathname not exported from routing

```bash
# Check next-intl version
grep "next-intl" package.json

# Update routing.ts to export navigation utilities
# See next-intl docs for createNavigation
```

### Issue: Container class not working

For Tailwind v4, check if `@plugin` is configured or use responsive padding:

```tsx
// Alternative to container
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

### Issue: i18n messages not loading

```bash
# Verify message provider in root layout
grep -r "NextIntlClientProvider" src/app/

# Check message files are valid JSON
cat messages/fr.json | jq .
```

### Issue: CSS variables not defined

```bash
# Check globals.css has theme variables
grep -E "^--" src/styles/globals.css

# Ensure dark mode class is applied
grep "dark" src/app/layout.tsx
```

---

## Ready to Start?

Before proceeding to implementation:

1. [ ] Phase 1 complete (DropdownMenu, Sheet exist)
2. [ ] Build succeeds
3. [ ] Lint passes
4. [ ] Git working tree is clean
5. [ ] On correct feature branch
6. [ ] lucide-react installed
7. [ ] i18n routing exports Link and usePathname
8. [ ] Layout directory created

If all items are checked, proceed to [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md).

---

**Document Created**: 2025-12-03
**Last Updated**: 2025-12-03
