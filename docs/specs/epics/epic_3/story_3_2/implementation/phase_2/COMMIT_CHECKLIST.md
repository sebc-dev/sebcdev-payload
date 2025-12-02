# Phase 2: Commit Checklist

**Phase**: shadcn/ui & Utility Functions
**Story**: 3.2 - Integration Design System (Dark Mode)
**Total Commits**: 4

---

## How to Use This Checklist

1. Complete each commit section in order
2. Check off items as you complete them
3. Run verification commands before committing
4. Use the provided commit messages
5. Move to the next commit only after all checks pass

---

## Commit 1: Install Utility Dependencies

### Pre-Commit Checks

- [ ] Phase 1 is completed and merged
- [ ] Currently on correct branch (`git branch --show-current`)
- [ ] Working directory is clean (`git status`)

### Implementation Steps

1. **Install dependencies**

   ```bash
   pnpm add clsx tailwind-merge class-variance-authority
   ```

2. **Verify installation**

   ```bash
   pnpm list clsx tailwind-merge class-variance-authority
   ```

### Verification Checklist

- [ ] `package.json` contains `clsx` dependency
- [ ] `package.json` contains `tailwind-merge` dependency
- [ ] `package.json` contains `class-variance-authority` dependency
- [ ] `pnpm-lock.yaml` updated
- [ ] No peer dependency warnings

### Commit Steps

```bash
# Stage changes
git add package.json pnpm-lock.yaml

# Verify staged files
git status

# Commit with gitmoji
git commit -m "$(cat <<'EOF'
chore(deps): add shadcn/ui utility dependencies

- Add clsx for conditional class names
- Add tailwind-merge for intelligent class merging
- Add class-variance-authority for variant management

These utilities are prerequisites for shadcn/ui components.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Post-Commit Verification

- [ ] Commit created successfully
- [ ] `git log -1` shows correct message
- [ ] Build still works: `pnpm build`

---

## Commit 2: Create cn() Utility Function

### Pre-Commit Checks

- [ ] Commit 1 completed
- [ ] Dependencies installed and available

### Implementation Steps

1. **Create utility file**

   Create `src/lib/utils.ts`:

   ```typescript
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

2. **Verify TypeScript compilation**

   ```bash
   pnpm exec tsc --noEmit
   ```

3. **Test import works**

   ```bash
   # Quick test in Node REPL (optional)
   node --experimental-specifier-resolution=node -e "import('@/lib/utils').then(m => console.log(typeof m.cn))"
   ```

### Verification Checklist

- [ ] File exists at `src/lib/utils.ts`
- [ ] TypeScript compiles without errors
- [ ] Function exports `cn`
- [ ] JSDoc comments included
- [ ] No ESLint warnings: `pnpm lint`

### Commit Steps

```bash
# Stage the new file
git add src/lib/utils.ts

# Verify staged files
git status

# Commit with gitmoji
git commit -m "$(cat <<'EOF'
feat(lib): add cn() utility function

Create utility function combining clsx and tailwind-merge for
optimal Tailwind CSS class handling in components.

- Conditional class support via clsx
- Intelligent conflict resolution via tailwind-merge
- Type-safe with ClassValue type

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Post-Commit Verification

- [ ] Commit created successfully
- [ ] `git log -1` shows correct message
- [ ] Build still works: `pnpm build`

---

## Commit 3: Initialize shadcn/ui Configuration

### Pre-Commit Checks

- [ ] Commit 2 completed
- [ ] `cn()` function available at `@/lib/utils`

### Implementation Steps

1. **Create components.json**

   Create `components.json` at project root:

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

2. **Create components directory structure**

   ```bash
   mkdir -p src/components/ui
   ```

3. **Verify JSON syntax**

   ```bash
   node -e "JSON.parse(require('fs').readFileSync('components.json', 'utf8'))"
   ```

### Verification Checklist

- [ ] File exists at `components.json` (project root)
- [ ] JSON is valid (no syntax errors)
- [ ] `style` is `"new-york"`
- [ ] `rsc` is `true`
- [ ] `css` path matches existing globals.css
- [ ] Aliases match tsconfig.json paths exactly
- [ ] Directory `src/components/ui` exists

### Commit Steps

```bash
# Stage the new file
git add components.json

# Verify staged files
git status

# Commit with gitmoji
git commit -m "$(cat <<'EOF'
chore(shadcn): add components.json configuration

Configure shadcn/ui for the project:
- new-york style for modern aesthetics
- RSC support enabled for Next.js 15
- CSS variables enabled for dark mode theming
- Path aliases configured to match tsconfig.json
- Lucide icons as icon library

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Post-Commit Verification

- [ ] Commit created successfully
- [ ] `git log -1` shows correct message
- [ ] Build still works: `pnpm build`

---

## Commit 4: Add Button Component and Integrate

### Pre-Commit Checks

- [ ] Commit 3 completed
- [ ] `components.json` exists and is valid
- [ ] `cn()` function available

### Implementation Steps

1. **Install Radix UI Slot dependency**

   ```bash
   pnpm add @radix-ui/react-slot
   ```

2. **Create Button component**

   Create `src/components/ui/button.tsx`:

   ```typescript
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

3. **Update homepage to use Button**

   In `src/app/[locale]/(frontend)/page.tsx`, add:

   ```typescript
   import { Button } from '@/components/ui/button'

   // Inside the component JSX, add a section to showcase buttons:
   <section className="mt-8 space-y-4">
     <h2 className="text-xl font-semibold">Button Variants</h2>
     <div className="flex flex-wrap gap-4">
       <Button>Default</Button>
       <Button variant="secondary">Secondary</Button>
       <Button variant="outline">Outline</Button>
       <Button variant="ghost">Ghost</Button>
       <Button variant="destructive">Destructive</Button>
       <Button variant="link">Link</Button>
     </div>
     <div className="flex flex-wrap gap-4">
       <Button size="sm">Small</Button>
       <Button size="default">Default</Button>
       <Button size="lg">Large</Button>
     </div>
   </section>
   ```

4. **Verify compilation**

   ```bash
   pnpm exec tsc --noEmit
   ```

5. **Verify build**

   ```bash
   pnpm build
   ```

6. **Visual verification**

   ```bash
   pnpm dev
   # Open http://localhost:3000/fr and verify buttons render
   ```

### Verification Checklist

- [ ] `@radix-ui/react-slot` installed
- [ ] Button component exists at `src/components/ui/button.tsx`
- [ ] TypeScript compiles without errors
- [ ] ESLint passes: `pnpm lint`
- [ ] Build succeeds: `pnpm build`
- [ ] Dev server shows buttons at `http://localhost:3000/fr`
- [ ] All 6 variants render correctly
- [ ] All 3 sizes render correctly
- [ ] Hover states work
- [ ] Focus ring visible (keyboard navigation)
- [ ] No console errors

### Commit Steps

```bash
# Stage all changes
git add package.json pnpm-lock.yaml src/components/ui/button.tsx src/app/\[locale\]/\(frontend\)/page.tsx

# Verify staged files
git status

# Commit with gitmoji
git commit -m "$(cat <<'EOF'
feat(ui): add Button component from shadcn/ui

- Create Button component with all variants (default, secondary,
  outline, ghost, destructive, link)
- Add size variants (default, sm, lg, icon)
- Support asChild prop via @radix-ui/react-slot
- Integrate Button in homepage for visual validation

This establishes the foundation for the component library.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Post-Commit Verification

- [ ] Commit created successfully
- [ ] `git log -1` shows correct message
- [ ] Build still works: `pnpm build`
- [ ] Buttons visible in browser

---

## Phase Completion Checklist

After all 4 commits:

### Git Verification

```bash
# View all phase commits
git log --oneline -4

# Expected output (newest first):
# abc1234 feat(ui): add Button component from shadcn/ui
# def5678 chore(shadcn): add components.json configuration
# ghi9012 feat(lib): add cn() utility function
# jkl3456 chore(deps): add shadcn/ui utility dependencies
```

### Technical Verification

- [ ] All 4 commits present
- [ ] Build succeeds: `pnpm build`
- [ ] Lint passes: `pnpm lint`
- [ ] No TypeScript errors: `pnpm exec tsc --noEmit`
- [ ] Dev server works: `pnpm dev`

### Functional Verification

- [ ] Button component renders
- [ ] All variants work (6 variants)
- [ ] All sizes work (4 sizes)
- [ ] Hover states visible
- [ ] Focus states visible
- [ ] No console errors
- [ ] No visual regressions

### Files Created

- [ ] `src/lib/utils.ts`
- [ ] `components.json`
- [ ] `src/components/ui/button.tsx`

### Files Modified

- [ ] `package.json` (dependencies added)
- [ ] `src/app/[locale]/(frontend)/page.tsx` (Button integration)

### Dependencies Added

- [ ] `clsx`
- [ ] `tailwind-merge`
- [ ] `class-variance-authority`
- [ ] `@radix-ui/react-slot`

---

## Troubleshooting

### Issue: TypeScript can't find `@/lib/utils`

**Solution**: Verify tsconfig.json has correct path aliases:

```json
"paths": {
  "@/*": ["./src/*"]
}
```

### Issue: Button styles not applying

**Solution**: Ensure globals.css has Tailwind imports and is imported in layout.

### Issue: Radix Slot not working

**Solution**: Verify `@radix-ui/react-slot` is installed:

```bash
pnpm list @radix-ui/react-slot
```

### Issue: Build fails with CSS errors

**Solution**: Check that `src/app/globals.css` exists with proper Tailwind imports.

### Issue: Focus ring not visible

**Solution**: CSS variables for `ring` color may not be defined. Will be added in Phase 3 with design tokens.

---

## Next Phase

After completing Phase 2, proceed to:

**Phase 3: Design Tokens & Visual Migration**

- Generate documentation: `/generate-phase-doc Epic 3 Story 3.2 Phase 3`
- Or ask: "Generate implementation docs for Phase 3"

---

**Checklist Status**: READY FOR USE
**Created**: 2025-12-02
**Last Updated**: 2025-12-02
