# Phase 1: Code Review Guide - shadcn/ui Navigation Components

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 1 of 5
**Commits to Review**: 3

This guide helps reviewers evaluate the implementation of Phase 1.

---

## Review Overview

### Phase Scope

This phase adds two shadcn/ui components:
1. **DropdownMenu** - For navigation dropdowns
2. **Sheet** - For mobile menu

### What to Look For

| Category | Priority | Focus Areas |
|----------|----------|-------------|
| File Structure | High | Correct location, naming |
| Dependencies | High | Correct packages, versions |
| Build Success | Critical | No breaking changes |
| Code Quality | Medium | TypeScript types, exports |

---

## Commit-by-Commit Review

### Commit 1: DropdownMenu Installation

#### Files to Review

1. **`src/components/ui/dropdown-menu.tsx`**
2. **`package.json`** (diff only)

#### Checklist

##### File Location & Naming

- [ ] Component is at `src/components/ui/dropdown-menu.tsx`
- [ ] File uses kebab-case naming (dropdown-menu, not DropdownMenu)
- [ ] File extension is `.tsx` (not `.ts` or `.jsx`)

##### Component Structure

- [ ] Uses `"use client"` directive at top (client component)
- [ ] Imports from `@radix-ui/react-dropdown-menu`
- [ ] Re-exports all necessary primitives
- [ ] Uses `cn()` utility for class merging

##### Expected Exports

Verify these exports exist:

```typescript
export {
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
}
```

- [ ] All expected exports are present

##### Styling

- [ ] Uses Tailwind CSS classes
- [ ] Uses CSS variables for colors (`bg-popover`, `text-popover-foreground`)
- [ ] Has dark mode support via CSS variables
- [ ] Includes animation classes (`animate-in`, `animate-out`)

##### package.json Changes

- [ ] Only `@radix-ui/react-dropdown-menu` added (or updated)
- [ ] Version is compatible (^2.x.x)
- [ ] No unrelated dependency changes

##### TypeScript

- [ ] No type errors: `pnpm exec tsc --noEmit`
- [ ] Props are properly typed
- [ ] Uses `React.ComponentPropsWithoutRef` for prop types

---

### Commit 2: Sheet Installation

#### Files to Review

1. **`src/components/ui/sheet.tsx`**
2. **`package.json`** (diff only)

#### Checklist

##### File Location & Naming

- [ ] Component is at `src/components/ui/sheet.tsx`
- [ ] File uses kebab-case naming
- [ ] File extension is `.tsx`

##### Component Structure

- [ ] Uses `"use client"` directive at top
- [ ] Imports from `@radix-ui/react-dialog`
- [ ] Re-exports all necessary primitives
- [ ] Uses `cn()` utility for class merging
- [ ] Uses `cva` (class-variance-authority) for variants

##### Expected Exports

Verify these exports exist:

```typescript
export {
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
}
```

- [ ] All expected exports are present

##### Sheet Variants

- [ ] Has `side` variant with: `top`, `bottom`, `left`, `right`
- [ ] Default side is `right` (for mobile menu)
- [ ] Variants use `cva()` from `class-variance-authority`

##### Styling

- [ ] Uses Tailwind CSS classes
- [ ] Uses CSS variables for colors
- [ ] Has dark mode support via CSS variables
- [ ] Includes animation classes for slide-in/out
- [ ] Has proper overlay styling (`bg-black/80` or similar)

##### package.json Changes

- [ ] Only `@radix-ui/react-dialog` added (or updated)
- [ ] Version is compatible (^1.x.x)
- [ ] No unrelated dependency changes

##### Accessibility

- [ ] SheetContent has proper ARIA attributes
- [ ] SheetTitle uses `DialogTitle` from Radix
- [ ] SheetDescription uses `DialogDescription` from Radix
- [ ] Close button has accessible label

##### TypeScript

- [ ] No type errors: `pnpm exec tsc --noEmit`
- [ ] Variant types are properly defined
- [ ] Uses `VariantProps<typeof sheetVariants>` for type safety

---

### Commit 3: Integration Verification

#### Verification Tasks

This commit may have no file changes - it's primarily for verification.

##### Build Verification

- [ ] `pnpm build` succeeds
- [ ] No warnings in build output
- [ ] Build time is reasonable (< 2 min)

##### Lint Verification

- [ ] `pnpm lint` passes
- [ ] No new lint warnings introduced

##### Type Verification

- [ ] `pnpm exec tsc --noEmit` passes
- [ ] No new type errors

##### Regression Testing

- [ ] Homepage loads (`/fr`, `/en`)
- [ ] Admin panel loads (`/admin`)
- [ ] Existing components still work

---

## Cross-Commit Review

### Overall Code Quality

#### Consistency

- [ ] Both components follow same patterns
- [ ] Same import style used
- [ ] Same export style used
- [ ] Consistent use of `cn()` utility

#### No Regressions

- [ ] Existing button.tsx unchanged
- [ ] No modifications to unrelated files
- [ ] Admin panel import map unchanged

#### Dependencies

```bash
# Verify only expected dependencies added
git diff HEAD~2..HEAD package.json | grep "+"
```

Expected additions:
- [ ] `@radix-ui/react-dropdown-menu`
- [ ] `@radix-ui/react-dialog`
- [ ] No unexpected dependencies

---

## Review Criteria

### MUST Have (Blocking)

| Criteria | Verification |
|----------|--------------|
| Build passes | `pnpm build` succeeds |
| Types check | `pnpm exec tsc --noEmit` passes |
| Lint passes | `pnpm lint` passes |
| Correct files | Both components in `src/components/ui/` |
| Correct dependencies | Only Radix packages added |

### SHOULD Have (Non-Blocking)

| Criteria | Verification |
|----------|--------------|
| Clean commit messages | Follow conventional commits |
| Proper exports | All primitives re-exported |
| CSS variables | Using design token variables |
| Animation | Smooth open/close transitions |

### NICE TO Have

| Criteria | Notes |
|----------|-------|
| Documentation | Component usage examples |
| Tests | Unit tests for components |

---

## Common Issues to Watch For

### Issue 1: Wrong Component Version

**Symptom**: API differences from documentation

**Check**:
```bash
grep "@radix-ui" package.json
```

**Expected**: Versions compatible with shadcn/ui latest

### Issue 2: Missing CSS Variables

**Symptom**: Components use hardcoded colors

**Check**: Look for variables like `bg-popover`, `text-popover-foreground`

**Fix**: Use CSS variables from design system

### Issue 3: Missing "use client" Directive

**Symptom**: Hydration errors in dev mode

**Check**: First line of each component file

**Fix**: Add `"use client"` directive

### Issue 4: Import Path Issues

**Symptom**: Build fails with module not found

**Check**:
```bash
grep -n "from '@/lib/utils'" src/components/ui/*.tsx
```

**Fix**: Ensure `@/lib/utils` alias works

### Issue 5: Unintended File Modifications

**Symptom**: Changes to unrelated files

**Check**:
```bash
git diff --name-only HEAD~3..HEAD
```

**Expected files only**:
- `src/components/ui/dropdown-menu.tsx`
- `src/components/ui/sheet.tsx`
- `package.json`
- `pnpm-lock.yaml`

---

## Review Commands Quick Reference

```bash
# View all changes in phase
git diff HEAD~3..HEAD

# View changed files only
git diff --name-only HEAD~3..HEAD

# View specific commit
git show HEAD~1

# View package.json changes
git diff HEAD~3..HEAD package.json

# Verify build
pnpm build

# Verify types
pnpm exec tsc --noEmit

# Verify lint
pnpm lint

# Check component file
cat src/components/ui/dropdown-menu.tsx | head -50
cat src/components/ui/sheet.tsx | head -50
```

---

## Approval Criteria

### Approve If

- [ ] All MUST Have criteria met
- [ ] Build, types, and lint pass
- [ ] No unrelated file changes
- [ ] Commit messages are clear

### Request Changes If

- [ ] Build fails
- [ ] Type errors present
- [ ] Wrong file locations
- [ ] Unrelated dependencies added
- [ ] Missing required exports

### Comment Only If

- [ ] Minor style suggestions
- [ ] Documentation improvements
- [ ] Optional enhancements

---

## Post-Review Actions

### If Approved

1. Merge/close PR
2. Update PHASES_PLAN.md with completion status
3. Proceed to Phase 2

### If Changes Requested

1. Author addresses feedback
2. Re-review changed commits
3. Re-run verification commands

---

**Document Created**: 2025-12-03
**Last Updated**: 2025-12-03
