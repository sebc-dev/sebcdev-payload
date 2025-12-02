# Code Review Guide - Phase 3: Design Tokens & Visual Migration

**Story**: 3.2 - Integration Design System (Dark Mode)
**Phase**: 3 of 4

---

## Review Overview

This guide helps reviewers evaluate the Phase 3 implementation effectively. Each commit should be reviewed against the criteria below.

### Review Time Estimate

| Commit | Estimated Review Time |
|--------|----------------------|
| 1. CSS Variables | 10-15 min |
| 2. Nunito Sans Font | 5-10 min |
| 3. JetBrains Mono Font | 5 min |
| 4. Homepage Migration | 15-20 min |
| 5. Cleanup | 5 min |
| **Total** | **40-55 min** |

---

## Commit-by-Commit Review

### Commit 1: Configure CSS Variables (Design Tokens)

**File**: `src/app/globals.css`

#### Critical Checks

- [ ] **HSL Format Correct**: Values use `222 16% 12%` format, NOT `hsl(222, 16%, 12%)`
- [ ] **All Required Variables Defined**: Check for all shadcn/ui variables
- [ ] **Correct Color Values**: Match against design spec

#### Variable Checklist

```
Required CSS Variables:
- [ ] --background       (222 16% 12%)
- [ ] --foreground       (210 40% 98%)
- [ ] --card             (222 16% 18%)
- [ ] --card-foreground  (210 40% 98%)
- [ ] --popover          (222 16% 18%)
- [ ] --popover-foreground (210 40% 98%)
- [ ] --primary          (174 72% 40%)
- [ ] --primary-foreground (210 40% 98%)
- [ ] --secondary        (217 19% 27%)
- [ ] --secondary-foreground (210 40% 98%)
- [ ] --muted            (217 19% 27%)
- [ ] --muted-foreground (215 14% 65%)
- [ ] --accent           (217 19% 27%)
- [ ] --accent-foreground (210 40% 98%)
- [ ] --destructive      (0 72% 67%)
- [ ] --destructive-foreground (210 40% 98%)
- [ ] --border           (217 19% 27%)
- [ ] --input            (217 19% 27%)
- [ ] --ring             (174 72% 40%)
- [ ] --radius           (0.5rem)
```

#### Code Quality

- [ ] Variables are in `@layer base` under `:root`
- [ ] `color-scheme: dark` set on html
- [ ] Body has `@apply bg-background text-foreground`
- [ ] Focus styles use ring utilities
- [ ] Comments explain design token purpose

#### Accessibility

- [ ] Focus visible styles maintained
- [ ] Ring color uses --ring variable

#### Red Flags

- Hardcoded hex values instead of CSS variables
- Missing required shadcn/ui variables
- `hsl()` wrapper around values (breaks Tailwind opacity)

---

### Commit 2: Configure Nunito Sans Font

**File**: `src/app/[locale]/layout.tsx`, `src/app/globals.css`

#### Critical Checks

- [ ] **Correct Import**: `Nunito_Sans` from `next/font/google`
- [ ] **CSS Variable**: `variable: '--font-sans'`
- [ ] **Display Swap**: `display: 'swap'` for fast render
- [ ] **Weights Included**: 400, 600, 700

#### Configuration Check

```tsx
// Expected configuration
const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '600', '700'],
})
```

#### HTML Application

- [ ] CSS variable class applied to `<html>`: `className={nunitoSans.variable}`
- [ ] `font-sans` class on `<body>`

#### CSS Theme Extension

- [ ] `@theme` section in globals.css defines `--font-sans`

#### Performance

- [ ] Only necessary weights included (not all available)
- [ ] `display: 'swap'` prevents FOIT (Flash of Invisible Text)

#### Red Flags

- Missing `display: 'swap'`
- All weights included unnecessarily
- Variable not applied to html element

---

### Commit 3: Configure JetBrains Mono Font

**File**: `src/app/[locale]/layout.tsx`, `src/app/globals.css`

#### Critical Checks

- [ ] **Correct Import**: `JetBrains_Mono` from `next/font/google`
- [ ] **CSS Variable**: `variable: '--font-mono'`
- [ ] **Display Swap**: `display: 'swap'`
- [ ] **Weights Included**: 400, 500

#### Configuration Check

```tsx
// Expected configuration
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
})
```

#### HTML Application

- [ ] Both font variables in `<html>`: `className={\`${nunitoSans.variable} ${jetbrainsMono.variable}\`}`

#### CSS Theme Extension

- [ ] `@theme` section defines both `--font-sans` and `--font-mono`

#### Red Flags

- Missing JetBrains Mono import
- Only one font variable applied to html
- Ligatures not considered (optional but noteworthy)

---

### Commit 4: Migrate Homepage to Tailwind Classes

**File**: `src/app/[locale]/(frontend)/page.tsx`

#### Critical Checks

- [ ] **No CSS Class Names**: `.home`, `.content`, `.links`, etc. removed
- [ ] **Tailwind Utilities**: All styling via utility classes
- [ ] **Design Tokens Used**: `bg-background`, `text-foreground`, etc.
- [ ] **Responsive Design**: `sm:`, `lg:` breakpoints applied

#### Layout Structure Review

```tsx
// Container
<div className="flex min-h-screen flex-col items-center justify-between p-6 sm:p-11 max-w-4xl mx-auto">

// Content section
<div className="flex flex-col items-center justify-center flex-grow">

// Heading
<h1 className="my-6 sm:my-10 text-3xl sm:text-4xl lg:text-5xl font-bold text-center">

// Links container
<div className="flex items-center gap-3">

// Admin link
<a className="no-underline px-3 py-1.5 rounded bg-foreground text-background hover:bg-foreground/90 transition-colors">

// Docs link
<a className="no-underline px-3 py-1.5 rounded bg-background text-foreground border border-border hover:bg-muted transition-colors">

// Footer
<div className="flex items-center gap-2 flex-col lg:flex-row mt-8">
```

#### Visual Parity Check

- [ ] Layout matches previous design
- [ ] Spacing is proportional
- [ ] Colors match design tokens
- [ ] Responsive behavior preserved

#### Accessibility

- [ ] Interactive elements have hover states
- [ ] Links have sufficient contrast
- [ ] Focus states work (via globals.css)

#### Code Quality

- [ ] No inline styles
- [ ] Consistent class ordering (layout → spacing → typography → colors)
- [ ] Button component unchanged (from Phase 2)

#### Red Flags

- Mix of CSS class names and Tailwind utilities
- Hardcoded colors instead of design tokens
- Missing responsive breakpoints
- Removed functionality during migration

---

### Commit 5: Delete styles.css & Cleanup

**Files**: Delete `src/app/[locale]/(frontend)/styles.css`, Modify `src/app/[locale]/(frontend)/layout.tsx`

#### Critical Checks

- [ ] **styles.css Deleted**: File no longer exists
- [ ] **Import Removed**: No `import './styles.css'` in layout.tsx
- [ ] **No References**: No other files import styles.css

#### Layout.tsx Review

```tsx
// REMOVED
// import './styles.css'

// ADDED
<main className="min-h-screen">{children}</main>
```

#### Verification

- [ ] Build succeeds without styles.css
- [ ] No console errors about missing file
- [ ] Lint passes

#### Red Flags

- styles.css not deleted
- Import statement still present
- Other files still reference styles.css

---

## Overall Phase Review

### Code Quality Checklist

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] `pnpm exec tsc --noEmit` passes
- [ ] No console errors in browser

### Visual Quality Checklist

- [ ] Background is anthracite (#1A1D23)
- [ ] Text is off-white (#F7FAFC)
- [ ] Primary accent is teal (#14B8A6)
- [ ] Nunito Sans renders for body text
- [ ] JetBrains Mono available for code
- [ ] Button variants display correctly
- [ ] Responsive breakpoints work

### Accessibility Checklist

- [ ] Focus indicators visible
- [ ] Text contrast sufficient (WCAG AA)
- [ ] Interactive elements have hover states

### Performance Checklist

- [ ] Fonts use `display: swap`
- [ ] Only necessary font weights loaded
- [ ] No unnecessary CSS

---

## Review Comments Template

Use these templates for consistent review feedback:

### Approval

```
Approved

All checks pass:
- CSS variables correctly defined
- Fonts properly configured
- Homepage migrated to Tailwind
- styles.css cleaned up

Visual verification confirms design spec compliance.
```

### Request Changes

```
Changes Requested

Issues found:
1. [ ] [Describe issue]
2. [ ] [Describe issue]

Suggestions:
- [Suggestion]

Please address before approval.
```

### Comment

```
Comment

Observation (non-blocking):
- [Observation]

Consider for future:
- [Suggestion]
```

---

## Common Review Findings

### Frequent Issues

1. **HSL Format**: Using `hsl()` wrapper instead of raw values
2. **Missing Variables**: Not all shadcn/ui variables defined
3. **Font Weights**: Including unnecessary weights
4. **Hardcoded Colors**: Using hex instead of CSS variables
5. **Missing Responsive**: No mobile breakpoints

### Best Practices to Verify

1. CSS variables use descriptive names
2. Font loading optimized with `display: swap`
3. Tailwind class ordering consistent
4. Design tokens used throughout
5. Accessibility maintained

---

## Post-Review Checklist

After review completion:

- [ ] All commits reviewed
- [ ] Build verified locally
- [ ] Visual verification done
- [ ] Review comments submitted
- [ ] PR approved or changes requested
