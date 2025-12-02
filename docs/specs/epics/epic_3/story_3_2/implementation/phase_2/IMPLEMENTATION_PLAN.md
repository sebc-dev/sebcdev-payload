# Phase 2: Implementation Plan

**Phase**: shadcn/ui & Utility Functions
**Story**: 3.2 - Integration Design System (Dark Mode)
**Commits**: 4 atomic commits
**Estimated Duration**: 2-4 hours

---

## Implementation Strategy

This phase follows a **bottom-up approach**:

1. **Dependencies first**: Install utility packages
2. **Core utilities**: Create `cn()` function
3. **Configuration**: Initialize shadcn/ui
4. **Validation**: Add and integrate Button component

---

## Commit Sequence

```
Commit 1: Install utility dependencies
    │
    ▼
Commit 2: Create cn() utility function
    │
    ▼
Commit 3: Initialize shadcn/ui configuration
    │
    ▼
Commit 4: Add Button component and integrate
```

---

## Commit 1: Install Utility Dependencies

### Objective

Install the core utility packages required for shadcn/ui and class management.

### Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modify | Add clsx, tailwind-merge, class-variance-authority |

### Commands

```bash
# Install dependencies
pnpm add clsx tailwind-merge class-variance-authority

# Verify installation
pnpm list clsx tailwind-merge class-variance-authority
```

### Dependencies Added

| Package | Version | Purpose |
|---------|---------|---------|
| `clsx` | ^2.x | Conditional class names utility |
| `tailwind-merge` | ^2.x | Intelligently merge Tailwind CSS classes |
| `class-variance-authority` | ^0.7.x | Component variant management |

### Validation

- [ ] `pnpm install` succeeds
- [ ] Dependencies appear in `package.json`
- [ ] No version conflicts

### Commit Message

```
chore(deps): add shadcn/ui utility dependencies

- Add clsx for conditional class names
- Add tailwind-merge for intelligent class merging
- Add class-variance-authority for variant management

These utilities are prerequisites for shadcn/ui components.
```

### Estimated LOC

~10 lines (package.json changes)

### Estimated Time

5-10 minutes

---

## Commit 2: Create cn() Utility Function

### Objective

Create the `cn()` utility function that combines `clsx` and `tailwind-merge` for optimal class handling.

### Changes

| File | Action | Description |
|------|--------|-------------|
| `src/lib/utils.ts` | Create | cn() utility function |

### Implementation

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines clsx and tailwind-merge for optimal class handling.
 *
 * Features:
 * - Conditional classes via clsx
 * - Intelligent Tailwind class merging (last wins for conflicts)
 * - Type-safe with ClassValue
 *
 * @example
 * cn('px-2 py-1', isActive && 'bg-primary', className)
 * cn('text-red-500', 'text-blue-500') // Returns 'text-blue-500'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Why This Pattern?

1. **clsx**: Handles conditional classes (`isActive && 'class'`)
2. **tailwind-merge**: Resolves conflicts (`text-red-500` + `text-blue-500` = `text-blue-500`)
3. **Combined**: Best of both worlds for component development

### Validation

- [ ] File created at `src/lib/utils.ts`
- [ ] TypeScript compiles without errors
- [ ] Path alias `@/lib/utils` works

### Commit Message

```
feat(lib): add cn() utility function

Create utility function combining clsx and tailwind-merge for
optimal Tailwind CSS class handling in components.

- Conditional class support via clsx
- Intelligent conflict resolution via tailwind-merge
- Type-safe with ClassValue type
```

### Estimated LOC

~15 lines

### Estimated Time

10-15 minutes

---

## Commit 3: Initialize shadcn/ui Configuration

### Objective

Create the `components.json` configuration file for shadcn/ui with dark mode settings.

### Changes

| File | Action | Description |
|------|--------|-------------|
| `components.json` | Create | shadcn/ui configuration |

### Configuration

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "slate",
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

### Configuration Choices Explained

| Setting | Value | Reason |
|---------|-------|--------|
| `style` | "new-york" | Modern, clean aesthetic matching our design |
| `rsc` | true | React Server Components support (Next.js 15) |
| `tsx` | true | TypeScript components |
| `baseColor` | "slate" | Close to our anthracite color palette |
| `cssVariables` | true | Enable CSS variables for theming |
| `iconLibrary` | "lucide" | Lightweight, consistent icons |

### Important Notes

- **No CLI init needed**: Manual configuration avoids interactive prompts
- **Path aliases**: Must match tsconfig.json exactly
- **CSS path**: Points to existing globals.css from Phase 1

### Validation

- [ ] File created at project root
- [ ] JSON is valid (no syntax errors)
- [ ] Aliases match tsconfig.json paths

### Commit Message

```
chore(shadcn): add components.json configuration

Configure shadcn/ui for the project:
- new-york style for modern aesthetics
- RSC support enabled for Next.js 15
- CSS variables enabled for dark mode theming
- Path aliases configured to match tsconfig.json
- Lucide icons as icon library
```

### Estimated LOC

~25-30 lines

### Estimated Time

15-20 minutes

---

## Commit 4: Add Button Component and Integrate

### Objective

Add the first shadcn/ui component (Button) and integrate it into the homepage for validation.

### Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/ui/button.tsx` | Create | Button component |
| `src/app/[locale]/(frontend)/page.tsx` | Modify | Use Button component |

### Button Component

The Button component will be created based on shadcn/ui's new-york style with the following variants:

```typescript
// src/components/ui/button.tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

### Dependencies to Add

```bash
# Radix UI Slot is required for Button asChild prop
pnpm add @radix-ui/react-slot
```

### Homepage Integration

```typescript
// In src/app/[locale]/(frontend)/page.tsx
import { Button } from '@/components/ui/button'

// Add in the component JSX
<div className="flex gap-4 mt-8">
  <Button>Primary Button</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
</div>
```

### Validation

- [ ] Button component created
- [ ] `@radix-ui/react-slot` installed
- [ ] Button renders in homepage
- [ ] All variants display correctly
- [ ] Hover/focus states work
- [ ] Build succeeds

### Commit Message

```
feat(ui): add Button component from shadcn/ui

- Create Button component with all variants (default, secondary,
  outline, ghost, destructive, link)
- Add size variants (default, sm, lg, icon)
- Support asChild prop via @radix-ui/react-slot
- Integrate Button in homepage for visual validation

This establishes the foundation for the component library.
```

### Estimated LOC

~80 lines (Button: ~60, page changes: ~20)

### Estimated Time

30-45 minutes

---

## Post-Implementation Checklist

After completing all commits:

### Verification Commands

```bash
# Build verification
pnpm build

# Lint verification
pnpm lint

# Type check (implicit in build)
pnpm exec tsc --noEmit

# Dev server test
pnpm dev
```

### Visual Verification

1. Open `http://localhost:3000/fr`
2. Verify Button renders correctly
3. Test all button variants
4. Check hover states
5. Check focus states (keyboard navigation)
6. Verify no console errors

### Git Operations

```bash
# View all commits for this phase
git log --oneline -4

# Verify no uncommitted changes
git status
```

---

## Rollback Strategy

If issues occur, rollback options by commit:

| Commit | Rollback Command | Impact |
|--------|------------------|--------|
| 4 | `git revert HEAD` | Remove Button, restore page |
| 3 | `git revert HEAD~1` | Remove components.json |
| 2 | `git revert HEAD~2` | Remove cn() utility |
| 1 | `git revert HEAD~3` | Remove dependencies |

### Full Phase Rollback

```bash
# Revert all 4 commits
git revert HEAD~3..HEAD

# Or reset to pre-phase state (destructive)
git reset --hard <pre-phase-commit-sha>
```

---

## Dependencies Graph

```
@radix-ui/react-slot (new)
    │
    └── Button component
            │
            ├── buttonVariants (cva)
            │       │
            │       └── class-variance-authority (new)
            │
            └── cn()
                    │
                    ├── clsx (new)
                    │
                    └── tailwind-merge (new)
```

---

## Success Metrics

| Metric | Target | Verification |
|--------|--------|--------------|
| Build Success | Pass | `pnpm build` exits 0 |
| Lint Clean | 0 errors | `pnpm lint` exits 0 |
| Type Check | 0 errors | `tsc --noEmit` exits 0 |
| Button Renders | Visual | Manual check in browser |
| Variants Work | All 6 | Visual check per variant |
| Focus States | Visible | Keyboard navigation test |

---

## Related Documents

- [INDEX.md](./INDEX.md) - Phase overview
- [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) - Detailed per-commit checklist
- [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) - Environment requirements
- [guides/REVIEW.md](./guides/REVIEW.md) - Code review guide
- [guides/TESTING.md](./guides/TESTING.md) - Testing strategy

---

**Implementation Plan Status**: READY
**Created**: 2025-12-02
**Last Updated**: 2025-12-02
