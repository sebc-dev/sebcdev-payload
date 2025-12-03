# Phase 1: Implementation Plan - shadcn/ui Navigation Components

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 1 of 5
**Commits**: 3 atomic commits
**Estimated Duration**: 2-3 hours

---

## Overview

This phase installs two essential shadcn/ui components:
1. **DropdownMenu** - For category and level navigation dropdowns
2. **Sheet** - For mobile hamburger menu (slide-in panel)

Both components are prerequisites for subsequent phases and introduce no breaking changes to existing code.

---

## Atomic Commit Strategy

### Why 3 Commits?

| Commit | Responsibility | Rationale |
|--------|---------------|-----------|
| 1 | DropdownMenu | Single component, testable independently |
| 2 | Sheet | Single component, different Radix dependency |
| 3 | Integration verification | Ensures both work together, build passes |

Each commit is:
- **Independently reversible**: Can revert without breaking other changes
- **Testable**: Can verify functionality after each commit
- **Focused**: Single responsibility principle
- **Small**: <100 lines of actual code changes

---

## Commit 1: Install DropdownMenu Component

### Objective

Add the shadcn/ui DropdownMenu component for navigation dropdowns.

### Command

```bash
# Install via shadcn CLI (recommended)
pnpm dlx shadcn@latest add dropdown-menu
```

### Files Created/Modified

| File | Action | Description |
|------|--------|-------------|
| `src/components/ui/dropdown-menu.tsx` | Create | DropdownMenu component (~150 lines) |
| `package.json` | Modify | Add `@radix-ui/react-dropdown-menu` |

### Expected Dependencies Added

```json
{
  "@radix-ui/react-dropdown-menu": "^2.1.4"
}
```

### Verification Steps

```bash
# 1. Verify file created
ls -la src/components/ui/dropdown-menu.tsx

# 2. Verify package added
grep "@radix-ui/react-dropdown-menu" package.json

# 3. Install dependencies
pnpm install

# 4. TypeScript check
pnpm exec tsc --noEmit

# 5. Build check
pnpm build
```

### Success Criteria

- [ ] `dropdown-menu.tsx` exists in `src/components/ui/`
- [ ] TypeScript compiles without errors
- [ ] Build succeeds

### Commit Message

```
feat(ui): add shadcn/ui DropdownMenu component

- Install DropdownMenu via shadcn CLI
- Add @radix-ui/react-dropdown-menu dependency
- Prerequisite for navigation category/level dropdowns (Story 3.3)

Part of: Epic 3, Story 3.3, Phase 1 (commit 1/3)
```

### Rollback Command

```bash
# If needed, revert this commit
rm src/components/ui/dropdown-menu.tsx
pnpm remove @radix-ui/react-dropdown-menu
```

---

## Commit 2: Install Sheet Component

### Objective

Add the shadcn/ui Sheet component for mobile navigation menu.

### Command

```bash
# Install via shadcn CLI
pnpm dlx shadcn@latest add sheet
```

### Files Created/Modified

| File | Action | Description |
|------|--------|-------------|
| `src/components/ui/sheet.tsx` | Create | Sheet component (~130 lines) |
| `package.json` | Modify | Add `@radix-ui/react-dialog` |

### Expected Dependencies Added

```json
{
  "@radix-ui/react-dialog": "^1.1.4"
}
```

### Verification Steps

```bash
# 1. Verify file created
ls -la src/components/ui/sheet.tsx

# 2. Verify package added
grep "@radix-ui/react-dialog" package.json

# 3. Install dependencies
pnpm install

# 4. TypeScript check
pnpm exec tsc --noEmit

# 5. Build check
pnpm build
```

### Success Criteria

- [ ] `sheet.tsx` exists in `src/components/ui/`
- [ ] TypeScript compiles without errors
- [ ] Build succeeds

### Commit Message

```
feat(ui): add shadcn/ui Sheet component

- Install Sheet via shadcn CLI
- Add @radix-ui/react-dialog dependency
- Prerequisite for mobile hamburger menu (Story 3.3)

Part of: Epic 3, Story 3.3, Phase 1 (commit 2/3)
```

### Rollback Command

```bash
# If needed, revert this commit
rm src/components/ui/sheet.tsx
pnpm remove @radix-ui/react-dialog
```

---

## Commit 3: Verify Integration & Update Documentation

### Objective

Final verification that all components work together and the build passes.

### Verification Steps

```bash
# 1. Full build verification
pnpm build

# 2. Lint check
pnpm lint

# 3. Type check
pnpm exec tsc --noEmit

# 4. Verify no conflicts with admin panel
# Start dev server and check /admin loads
pnpm dev
# Navigate to http://localhost:3000/admin
```

### Optional: Create Test Component

If you want to verify components render correctly, create a temporary test page:

```tsx
// src/app/[locale]/(frontend)/test-ui/page.tsx (TEMPORARY - DELETE AFTER TESTING)
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

      {/* Test DropdownMenu */}
      <section>
        <h2 className="text-xl mb-4">DropdownMenu</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open Dropdown</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
            <DropdownMenuItem>Item 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      {/* Test Sheet */}
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

**Important**: Delete this test page after verification. Do NOT commit it.

### Success Criteria

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] Admin panel loads without errors
- [ ] No TypeScript errors
- [ ] Components render correctly (if test page used)

### Commit Message

```
chore(ui): verify shadcn/ui components integration

- Verify DropdownMenu and Sheet work together
- Confirm build succeeds
- No conflicts with Payload admin panel

Completes: Epic 3, Story 3.3, Phase 1 (commit 3/3)
```

---

## Post-Implementation Checklist

After all 3 commits, verify:

### Build & Quality

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] `pnpm exec tsc --noEmit` passes
- [ ] No console errors in browser

### Components Available

- [ ] `src/components/ui/dropdown-menu.tsx` exists
- [ ] `src/components/ui/sheet.tsx` exists
- [ ] Both can be imported: `import { X } from '@/components/ui/X'`

### No Regressions

- [ ] Homepage loads (`/fr`, `/en`)
- [ ] Admin panel loads (`/admin`)
- [ ] Existing Button component works

### Documentation

- [ ] This phase marked as complete in PHASES_PLAN.md
- [ ] EPIC_TRACKING.md updated (if applicable)

---

## Component Reference

### DropdownMenu Exports

After installation, the following are available:

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from '@/components/ui/dropdown-menu'
```

### Sheet Exports

After installation, the following are available:

```tsx
import {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
```

---

## Troubleshooting

### Issue: shadcn CLI not found

```bash
# Solution: Use pnpm dlx to run shadcn directly
pnpm dlx shadcn@latest add dropdown-menu
```

### Issue: Radix version conflict

```bash
# Solution: Check existing Radix packages
pnpm list | grep radix

# If conflicts, try:
pnpm install --force
```

### Issue: Tailwind v4 CSS variables not applied

```bash
# Solution: Verify components.json has correct cssVariables config
cat components.json | grep cssVariables
# Should show: "cssVariables": true
```

### Issue: Build fails with type errors

```bash
# Solution: Check TypeScript version compatibility
pnpm exec tsc --version

# Ensure tsconfig.json has correct paths
cat tsconfig.json | grep "@/components"
```

---

## Next Steps

After completing Phase 1:

1. **Mark phase complete** in `PHASES_PLAN.md`
2. **Update EPIC_TRACKING.md** if required
3. **Proceed to Phase 2**: Header & Desktop Navigation
   - Location: `implementation/phase_2/INDEX.md`
   - Uses: DropdownMenu from this phase

---

## Time Estimates

| Activity | Time |
|----------|------|
| Commit 1: DropdownMenu | 30-45 min |
| Commit 2: Sheet | 30-45 min |
| Commit 3: Verification | 30-45 min |
| **Total** | **2-3 hours** |

---

**Document Created**: 2025-12-03
**Last Updated**: 2025-12-03
