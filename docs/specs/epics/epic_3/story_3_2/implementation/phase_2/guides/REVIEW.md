# Phase 2: Code Review Guide

**Phase**: shadcn/ui & Utility Functions
**Story**: 3.2 - Integration Design System (Dark Mode)

---

## Review Overview

This guide provides structured review criteria for each commit in Phase 2. Use this during:

- Self-review before committing
- Peer code review
- PR review

---

## General Review Criteria

### For All Commits

| Criterion | Description | Priority |
|-----------|-------------|----------|
| **TypeScript** | No type errors, proper types used | High |
| **Imports** | Use path aliases (@/) consistently | High |
| **Formatting** | Prettier-formatted | Medium |
| **Linting** | No ESLint errors/warnings | High |
| **Naming** | Clear, consistent naming conventions | Medium |
| **Comments** | JSDoc for public functions | Low |

### Code Quality Standards

- No `any` types (use proper typing)
- No unused imports or variables
- Consistent quote style (single quotes)
- Trailing commas in multiline structures
- Consistent indentation (2 spaces)

---

## Commit 1: Install Utility Dependencies

### Review Focus

**Primary**: Dependency management

### Checklist

#### package.json Changes

- [ ] `clsx` added to dependencies (not devDependencies)
- [ ] `tailwind-merge` added to dependencies
- [ ] `class-variance-authority` added to dependencies
- [ ] Version ranges are appropriate (`^2.x` style)
- [ ] No typos in package names
- [ ] No duplicate entries

#### Lockfile

- [ ] `pnpm-lock.yaml` updated
- [ ] No integrity errors
- [ ] No unexpected dependency changes

#### Verification Commands

```bash
# Verify package.json
cat package.json | grep -E "clsx|tailwind-merge|class-variance-authority"

# Verify installation
pnpm list clsx tailwind-merge class-variance-authority

# Check for vulnerabilities
pnpm audit
```

### Common Issues

| Issue | How to Spot | Fix |
|-------|-------------|-----|
| Wrong dependency type | Package in devDependencies | Move to dependencies |
| Missing lockfile update | Old lockfile | Run `pnpm install` |
| Version conflict | Peer dependency warning | Check compatibility |

---

## Commit 2: Create cn() Utility Function

### Review Focus

**Primary**: Code quality and TypeScript correctness

### Checklist

#### File: `src/lib/utils.ts`

- [ ] File location is correct (`src/lib/utils.ts`)
- [ ] Imports use correct package names
- [ ] `ClassValue` type is imported
- [ ] Function is exported
- [ ] Function name is `cn` (lowercase)
- [ ] Rest parameters used (`...inputs`)
- [ ] Return type is inferred (string)
- [ ] JSDoc comment present and accurate

#### TypeScript

- [ ] No type errors
- [ ] Proper import syntax
- [ ] Type annotations where helpful

#### Code Quality

```typescript
// Good
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Bad - Don't do these
import clsx from 'clsx' // Wrong import style
export const cn = (...inputs: any[]) => // Using any
function cn() { // Not exported
```

### Verification Commands

```bash
# Type check
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Verify export
node -e "import('@/lib/utils').then(m => console.log(typeof m.cn))"
```

### Common Issues

| Issue | How to Spot | Fix |
|-------|-------------|-----|
| Wrong import style | Default vs named import | Use named import for clsx |
| Missing type import | Type error on ClassValue | Import `type ClassValue` |
| Function not exported | Import fails | Add `export` keyword |

---

## Commit 3: Initialize shadcn/ui Configuration

### Review Focus

**Primary**: Configuration correctness

### Checklist

#### File: `components.json`

- [ ] File location is project root
- [ ] Valid JSON syntax
- [ ] `$schema` URL is correct
- [ ] `style` is `"new-york"`
- [ ] `rsc` is `true` (for RSC support)
- [ ] `tsx` is `true`
- [ ] CSS path is `"src/app/globals.css"`
- [ ] `baseColor` is `"slate"`
- [ ] `cssVariables` is `true`
- [ ] All aliases match tsconfig.json paths
- [ ] `iconLibrary` is `"lucide"`

#### Configuration Values

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",           // Not "default"
  "rsc": true,                   // Not false
  "tsx": true,                   // Not false
  "tailwind": {
    "config": "",                // Empty string, not path
    "css": "src/app/globals.css",// Correct path
    "baseColor": "slate",        // Not "zinc" or other
    "cssVariables": true         // Not false
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

### Verification Commands

```bash
# Validate JSON
node -e "JSON.parse(require('fs').readFileSync('components.json', 'utf8'))"

# Check file exists
ls -la components.json

# Verify against tsconfig paths
cat tsconfig.json | grep -A5 '"paths"'
```

### Common Issues

| Issue | How to Spot | Fix |
|-------|-------------|-----|
| Invalid JSON | Parse error | Check for trailing commas, quotes |
| Wrong CSS path | File not found warning | Update path to match actual location |
| Mismatched aliases | Import errors later | Match tsconfig.json exactly |

---

## Commit 4: Add Button Component and Integrate

### Review Focus

**Primary**: Component quality, integration, accessibility

### Checklist

#### File: `src/components/ui/button.tsx`

##### Structure

- [ ] File location is `src/components/ui/button.tsx`
- [ ] Uses `'use client'` if needed (check if using client hooks)
- [ ] Imports are organized (external, internal, types)
- [ ] Component is forwardRef for proper ref handling
- [ ] displayName is set
- [ ] Both component and variants are exported

##### TypeScript

- [ ] Props interface extends `ButtonHTMLAttributes`
- [ ] Props interface extends `VariantProps`
- [ ] `asChild` prop is typed as `boolean`
- [ ] Ref type is `HTMLButtonElement`
- [ ] No `any` types

##### CVA Configuration

- [ ] Base classes are comprehensive
- [ ] All 6 variants defined (default, destructive, outline, secondary, ghost, link)
- [ ] All 4 sizes defined (default, sm, lg, icon)
- [ ] Default variants specified
- [ ] Classes follow Tailwind conventions

##### Accessibility

- [ ] Focus styles included (`focus-visible:`)
- [ ] Disabled state styled
- [ ] Button element used (not div)
- [ ] SVG handling for icons

#### File: `src/app/[locale]/(frontend)/page.tsx`

##### Integration

- [ ] Button imported from `@/components/ui/button`
- [ ] Multiple variants demonstrated
- [ ] Multiple sizes demonstrated
- [ ] Semantic HTML structure
- [ ] Accessible layout (flex gap)

##### Code Example Review

```typescript
// Good
import { Button } from '@/components/ui/button'

<div className="flex flex-wrap gap-4">
  <Button>Default</Button>
  <Button variant="secondary">Secondary</Button>
</div>

// Bad
import Button from '@/components/ui/button'  // Wrong export
<div>
  <Button></Button>  // No text = not accessible
</div>
```

#### Dependency: `@radix-ui/react-slot`

- [ ] Added to dependencies in package.json
- [ ] Imported in Button component
- [ ] Used correctly with `asChild` prop

### Verification Commands

```bash
# Type check
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Build
pnpm build

# Visual verification
pnpm dev
# Then open http://localhost:3000/fr
```

### Visual Review Checklist

When viewing in browser:

- [ ] All 6 variants render visually distinct
- [ ] All sizes render at correct dimensions
- [ ] Hover states work (color change)
- [ ] Focus ring visible (Tab key)
- [ ] Disabled state visually different
- [ ] No layout shift on hover
- [ ] Text is readable on all variants

### Common Issues

| Issue | How to Spot | Fix |
|-------|-------------|-----|
| Missing forwardRef | Ref warning in console | Wrap component with forwardRef |
| Wrong import path | Module not found | Use @/components/ui/button |
| No focus styles | Invisible on Tab | Add focus-visible classes |
| Missing displayName | DevTools show anonymous | Set Button.displayName |

---

## Accessibility Review

### Button Component

| Criterion | Requirement | Check |
|-----------|-------------|-------|
| Focus indicator | Visible ring on focus | Tab through buttons |
| Keyboard operation | Space/Enter triggers click | Test manually |
| Disabled state | Visually distinct, not focusable | Tab should skip |
| Color contrast | 4.5:1 for text | Use contrast checker |
| Touch target | 44x44px minimum | Measure in DevTools |

### Verification

```bash
# Run axe accessibility audit (if configured)
pnpm test:e2e -- --grep "accessibility"
```

---

## Performance Review

### Bundle Impact

| Package | Approx Size (gzipped) | Acceptable |
|---------|----------------------|------------|
| clsx | ~0.5KB | Yes |
| tailwind-merge | ~5KB | Yes |
| class-variance-authority | ~2KB | Yes |
| @radix-ui/react-slot | ~1KB | Yes |

**Total estimated impact**: ~8-10KB gzipped

### Verification

```bash
# Check bundle size (after build)
pnpm build
ls -la .next/static/chunks/*.js | head -10
```

---

## Security Review

### Checklist

- [ ] No hardcoded secrets in code
- [ ] No eval() or similar dangerous functions
- [ ] Dependencies are from trusted sources
- [ ] No XSS vulnerabilities in component props

### Verification

```bash
# Check for vulnerabilities
pnpm audit
```

---

## PR Review Template

Use this template when creating/reviewing the Phase 2 PR:

```markdown
## Phase 2: shadcn/ui & Utility Functions

### Changes
- [ ] Installed utility dependencies (clsx, tailwind-merge, cva)
- [ ] Created cn() utility function
- [ ] Added shadcn/ui configuration (components.json)
- [ ] Added Button component
- [ ] Integrated Button in homepage

### Review Checklist
- [ ] TypeScript: No errors (`pnpm exec tsc --noEmit`)
- [ ] Linting: Clean (`pnpm lint`)
- [ ] Build: Passes (`pnpm build`)
- [ ] Visual: Button renders correctly
- [ ] A11y: Focus states work, keyboard navigation works

### Testing Done
- [ ] Verified all button variants render
- [ ] Verified all button sizes render
- [ ] Tested hover states
- [ ] Tested focus states
- [ ] Tested keyboard navigation
- [ ] Verified no console errors

### Screenshots
[Add screenshots of button variants]
```

---

## Review Sign-off

After review, the reviewer should:

1. **Approve** if all checks pass
2. **Request changes** with specific feedback if issues found
3. **Comment** for non-blocking suggestions

### Approval Criteria

- All verification commands pass
- No TypeScript errors
- No lint errors
- Build succeeds
- Visual verification passes
- Accessibility checks pass

---

**Review Guide Status**: READY FOR USE
**Created**: 2025-12-02
**Last Updated**: 2025-12-02
