# Phase 1: Commit Checklist - shadcn/ui Navigation Components

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 1 of 5
**Total Commits**: 3

Use this checklist during implementation. Check off items as you complete them.

---

## Pre-Implementation Checklist

Before starting any commits, verify:

- [ ] On correct branch: `git branch --show-current`
- [ ] Working tree clean: `git status`
- [ ] Dependencies up to date: `pnpm install`
- [ ] Build passes: `pnpm build`
- [ ] Read [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)

---

## Commit 1: Install DropdownMenu Component

### Pre-Commit

- [ ] Verify shadcn/ui is initialized: `cat components.json`
- [ ] Check existing UI components: `ls src/components/ui/`

### Implementation

```bash
# Execute the shadcn CLI command
pnpm dlx shadcn@latest add dropdown-menu
```

### Post-Command Verification

- [ ] File created: `src/components/ui/dropdown-menu.tsx`
- [ ] Package added: `grep "@radix-ui/react-dropdown-menu" package.json`
- [ ] Install dependencies: `pnpm install`

### Quality Checks

- [ ] TypeScript passes: `pnpm exec tsc --noEmit`
- [ ] Lint passes: `pnpm lint`
- [ ] Build passes: `pnpm build`

### Commit

```bash
# Stage changes
git add src/components/ui/dropdown-menu.tsx package.json pnpm-lock.yaml

# Commit with message
git commit -m "$(cat <<'EOF'
feat(ui): add shadcn/ui DropdownMenu component

- Install DropdownMenu via shadcn CLI
- Add @radix-ui/react-dropdown-menu dependency
- Prerequisite for navigation category/level dropdowns (Story 3.3)

Part of: Epic 3, Story 3.3, Phase 1 (commit 1/3)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Post-Commit Verification

- [ ] Commit created: `git log -1 --oneline`
- [ ] Clean working tree: `git status`

---

## Commit 2: Install Sheet Component

### Pre-Commit

- [ ] Previous commit successful: `git log -1 --oneline`
- [ ] Working tree clean: `git status`

### Implementation

```bash
# Execute the shadcn CLI command
pnpm dlx shadcn@latest add sheet
```

### Post-Command Verification

- [ ] File created: `src/components/ui/sheet.tsx`
- [ ] Package added: `grep "@radix-ui/react-dialog" package.json`
- [ ] Install dependencies: `pnpm install`

### Quality Checks

- [ ] TypeScript passes: `pnpm exec tsc --noEmit`
- [ ] Lint passes: `pnpm lint`
- [ ] Build passes: `pnpm build`

### Commit

```bash
# Stage changes
git add src/components/ui/sheet.tsx package.json pnpm-lock.yaml

# Commit with message
git commit -m "$(cat <<'EOF'
feat(ui): add shadcn/ui Sheet component

- Install Sheet via shadcn CLI
- Add @radix-ui/react-dialog dependency
- Prerequisite for mobile hamburger menu (Story 3.3)

Part of: Epic 3, Story 3.3, Phase 1 (commit 2/3)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Post-Commit Verification

- [ ] Commit created: `git log -1 --oneline`
- [ ] Clean working tree: `git status`

---

## Commit 3: Verify Integration & Documentation

### Pre-Commit

- [ ] Previous commits successful: `git log -2 --oneline`
- [ ] Working tree clean: `git status`

### Verification Steps

#### Build Verification

```bash
# Full build
pnpm build

# Full lint
pnpm lint

# Type check
pnpm exec tsc --noEmit
```

- [ ] Build succeeds
- [ ] Lint passes
- [ ] Types check passes

#### Component Verification

```bash
# Verify both components exist
ls -la src/components/ui/dropdown-menu.tsx
ls -la src/components/ui/sheet.tsx

# Verify dependencies
grep -E "@radix-ui/react-(dropdown-menu|dialog)" package.json
```

- [ ] dropdown-menu.tsx exists
- [ ] sheet.tsx exists
- [ ] Both Radix dependencies in package.json

#### Functional Verification (Manual)

Start dev server and verify:

```bash
pnpm dev
```

- [ ] Homepage loads: `http://localhost:3000/fr`
- [ ] Admin loads: `http://localhost:3000/admin`
- [ ] No console errors

#### Optional: Component Render Test

Create temporary test file (DELETE AFTER):

```tsx
// src/app/[locale]/(frontend)/test-ui/page.tsx
'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

export default function TestUIPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">UI Components Test</h1>

      <section>
        <h2 className="text-xl mb-4">DropdownMenu</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open Dropdown</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      <section>
        <h2 className="text-xl mb-4">Sheet</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open Sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
            <p>Sheet content goes here.</p>
          </SheetContent>
        </Sheet>
      </section>
    </div>
  )
}
```

Test at: `http://localhost:3000/fr/test-ui`

- [ ] DropdownMenu opens on click
- [ ] DropdownMenu closes on click outside
- [ ] Sheet opens on click
- [ ] Sheet closes on X or click outside
- [ ] Keyboard navigation works (Tab, Enter, Escape)

**IMPORTANT**: Delete test file before committing!

```bash
rm -rf src/app/[locale]/\(frontend\)/test-ui
```

### Commit (Documentation Only - If Changes Made)

If you updated any documentation:

```bash
git add .
git commit -m "$(cat <<'EOF'
chore(ui): verify shadcn/ui components integration

- Verify DropdownMenu and Sheet work together
- Confirm build succeeds
- No conflicts with Payload admin panel

Completes: Epic 3, Story 3.3, Phase 1 (commit 3/3)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

If no changes needed, skip this commit.

---

## Phase Completion Checklist

### All Commits Done

- [ ] 2-3 commits created for this phase
- [ ] All commits follow conventional commit format
- [ ] Working tree clean: `git status`

### Final Build Verification

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] `pnpm exec tsc --noEmit` passes

### Components Ready for Use

- [ ] `dropdown-menu.tsx` in `src/components/ui/`
- [ ] `sheet.tsx` in `src/components/ui/`
- [ ] Both import correctly

### No Regressions

- [ ] Homepage works
- [ ] Admin panel works
- [ ] No new errors in console

### Documentation Updates

- [ ] Update PHASES_PLAN.md progress checkbox
- [ ] Complete [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)

---

## Troubleshooting During Implementation

### shadcn CLI asks for configuration

If prompted, use these settings:

```
? Which style would you like to use? New York
? Which color would you like to use as base color? Neutral
? Would you like to use CSS variables for colors? yes
```

### Package already exists error

```bash
# If component already exists, force overwrite
pnpm dlx shadcn@latest add dropdown-menu --overwrite
```

### TypeScript errors after installation

```bash
# Try regenerating types
pnpm generate:types

# If still failing, check tsconfig paths
cat tsconfig.json | grep -A5 "paths"
```

### Build fails with import errors

```bash
# Verify the alias works
grep -r "@/components/ui" src/

# Check if file exists
ls src/components/ui/
```

---

## Quick Reference Commands

```bash
# Check current state
git status
git log --oneline -5

# Run quality checks
pnpm build
pnpm lint
pnpm exec tsc --noEmit

# Add shadcn components
pnpm dlx shadcn@latest add <component-name>

# Check installed components
ls src/components/ui/

# Check dependencies
grep "@radix-ui" package.json
```

---

**Document Created**: 2025-12-03
**Last Updated**: 2025-12-03
