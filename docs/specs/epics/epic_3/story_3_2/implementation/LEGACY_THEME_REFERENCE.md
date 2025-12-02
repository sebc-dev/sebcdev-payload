# Legacy Theme Reference

**Source**: `src/app/globals copy.css`
**Purpose**: Reference document for Phase 3 implementation
**Status**: EXTRACTED - Ready for Phase 3

---

## Overview

This document extracts the design tokens and configuration from the legacy theme file for use in Phase 3 (Design Tokens & Visual Migration).

---

## 1. Color System

### 1.1 Primitive Colors (OKLCH Format)

```css
/* Primary - Vert Canard / Teal */
--color-primary: oklch(0.7038 0.123 182.5025);
--color-primary-light: oklch(0.7845 0.1325 181.912);

/* Secondary - Blue-violet */
--color-secondary: oklch(0.5544 0.0407 257.4166);

/* Destructive - Red */
--color-destructive: oklch(0.577 0.245 27.325);
--color-destructive-dark: oklch(0.5771 0.2152 27.325);
```

### 1.2 Neutral Scale - Light Mode

```css
--neutral-0: oklch(1 0 0);              /* Pure white */
--neutral-50: oklch(0.985 0 0);
--neutral-100: oklch(0.9821 0 0);
--neutral-200: oklch(0.97 0 0);
--neutral-300: oklch(0.9276 0.0058 264.5313);
--neutral-400: oklch(0.922 0 0);
--neutral-500: oklch(0.7549 0.0133 255.525);
--neutral-600: oklch(0.708 0 0);
--neutral-700: oklch(0.556 0 0);
--neutral-800: oklch(0.2378 0.013 258.3717);  /* Dark anthracite */
--neutral-900: oklch(0.205 0 0);
--neutral-950: oklch(0.145 0 0);
```

### 1.3 Neutral Scale - Dark Mode

```css
--neutral-dark-100: oklch(0.6466 0.0156 268.4177);
--neutral-dark-200: oklch(0.5382 0.0163 268.3646);
--neutral-dark-300: oklch(0.4819 0.0168 268.3248);
--neutral-dark-400: oklch(0.3632 0.0148 264.3729);
--neutral-dark-500: oklch(0.2966 0.0117 264.3808);  /* Main background */
--neutral-dark-600: oklch(0.2871 0.0147 256.7905);
--neutral-dark-700: oklch(0.2744 0.0132 253.0412);  /* Card background */
--neutral-dark-800: oklch(0.269 0 0);
```

---

## 2. Semantic Tokens

### 2.1 Light Theme

```css
:root {
  /* Core */
  --background: var(--neutral-0);
  --foreground: var(--neutral-800);

  /* Surfaces */
  --surface-base: var(--neutral-100);
  --surface-foreground: var(--neutral-950);
  --card: var(--surface-base);
  --card-foreground: var(--surface-foreground);
  --popover: var(--surface-base);
  --popover-foreground: var(--surface-foreground);

  /* Interactive */
  --primary: var(--color-primary);
  --primary-foreground: var(--neutral-50);
  --secondary: var(--color-secondary);
  --secondary-foreground: var(--neutral-300);
  --accent: var(--color-primary);
  --accent-foreground: var(--neutral-50);
  --destructive: var(--color-destructive);
  --destructive-foreground: var(--neutral-0);

  /* UI Elements */
  --muted: var(--neutral-200);
  --muted-foreground: var(--neutral-700);
  --border: var(--neutral-400);
  --input: var(--neutral-400);
  --ring: var(--neutral-600);
}
```

### 2.2 Dark Theme

```css
.dark {
  /* Core */
  --background: var(--neutral-dark-500);
  --foreground: var(--neutral-500);

  /* Surfaces */
  --surface-base: var(--neutral-dark-600);
  --surface-foreground: var(--neutral-500);
  --card: var(--neutral-dark-700);
  --card-foreground: var(--surface-foreground);
  --popover: var(--surface-base);
  --popover-foreground: var(--surface-foreground);

  /* Interactive */
  --primary: var(--color-primary);
  --primary-foreground: var(--neutral-800);
  --secondary: var(--color-secondary);
  --secondary-foreground: var(--neutral-0);
  --accent: var(--color-primary);
  --accent-foreground: var(--neutral-800);
  --destructive: var(--color-destructive-dark);
  --destructive-foreground: var(--neutral-50);

  /* UI Elements */
  --muted: var(--neutral-dark-400);
  --muted-foreground: var(--neutral-dark-200);
  --border: var(--neutral-dark-400);
  --input: var(--neutral-dark-400);
  --ring: var(--color-primary-light);
}
```

---

## 3. Sidebar Configuration

### 3.1 Light Theme Sidebar

```css
--sidebar: var(--neutral-50);
--sidebar-foreground: var(--neutral-950);
--sidebar-primary: var(--neutral-900);
--sidebar-primary-foreground: var(--neutral-50);
--sidebar-accent: var(--neutral-200);
--sidebar-accent-foreground: var(--neutral-900);
--sidebar-border: var(--neutral-400);
--sidebar-ring: var(--neutral-600);
```

### 3.2 Dark Theme Sidebar

```css
--sidebar: var(--surface-base);
--sidebar-foreground: var(--neutral-500);
--sidebar-primary: var(--color-primary);
--sidebar-primary-foreground: var(--neutral-dark-400);
--sidebar-accent: var(--neutral-dark-800);
--sidebar-accent-foreground: var(--neutral-500);
--sidebar-border: var(--neutral-dark-400);
--sidebar-ring: var(--color-primary-light);
```

---

## 4. Typography

```css
--font-sans: Nunito Sans, ui-sans-serif, sans-serif, system-ui;
--font-serif: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
--font-mono: JetBrains Mono, ui-monospace, monospace;
--tracking-normal: 0em;
```

---

## 5. Spacing & Border Radius

```css
/* Base spacing unit */
--spacing: 0.25rem;

/* Border radius scale */
--radius: 0.4rem;
--radius-sm: calc(var(--radius) - 4px);
--radius-md: calc(var(--radius) - 2px);
--radius-lg: var(--radius);
--radius-xl: calc(var(--radius) + 4px);
```

---

## 6. Shadow System

### 6.1 Shadow Configuration

```css
--shadow-base-color: oklch(0 0 0);
--shadow-x: 0;
--shadow-y: 1px;
--shadow-blur: 3px;
--shadow-spread: 0px;
--shadow-opacity: 0.1;
```

### 6.2 Shadow Presets

```css
--shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
--shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
--shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
--shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
--shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);
--shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);
--shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);
--shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
```

---

## 7. Chart Colors

```css
--chart-1: var(--color-primary);
--chart-2: var(--color-primary-light);
--chart-3: var(--color-secondary);
--chart-4: var(--neutral-dark-300);
--chart-5: var(--neutral-dark-100);
```

---

## 8. Tailwind CSS 4 Theme Mapping

The legacy theme uses `@theme inline` for Tailwind CSS 4 integration:

```css
@theme inline {
  /* Colors */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* Sidebar Colors */
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  /* Chart Colors */
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  /* Typography */
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  /* Border Radius */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  /* Shadows */
  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}
```

---

## 9. Dark Mode Variant

```css
@custom-variant dark (&:is(.dark *));
```

This enables the `dark:` variant in Tailwind classes when an ancestor has the `.dark` class.

---

## 10. Accessibility Features

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**WCAG Reference**: Success Criterion 2.3.3: Animation from Interactions

---

## 11. External Dependencies

### tw-animate-css

```css
@import 'tw-animate-css';
```

This package provides animation utilities. Needs to be evaluated for Phase 3:
- Check if needed for current features
- Consider bundle size impact
- May be deferred to later phase if animations aren't critical

---

## 12. Migration Notes for Phase 3

### What to Keep

1. **OKLCH Color Format** - Modern, better for perceptual uniformity
2. **Primitive + Semantic Token Pattern** - Clean separation of concerns
3. **Complete shadcn/ui Variable Set** - Full compatibility
4. **@theme inline** - Proper Tailwind CSS 4 integration
5. **Dark Mode Structure** - `.dark` class approach
6. **Accessibility Features** - reduced-motion support
7. **Typography Stack** - Nunito Sans + JetBrains Mono

### What to Adapt

1. **Remove Light Theme** (V1 is dark-only)
   - Keep `.dark` as the default (or use `:root` directly)
   - Remove light theme variables to reduce bundle

2. **Simplify Neutral Scale**
   - Only need dark mode neutrals
   - Can remove light mode `--neutral-*` variables

3. **Evaluate tw-animate-css**
   - May not be needed in V1
   - Can add later if animations are required

### Color Mapping to UX_UI_Spec

| Legacy Token | UX_UI_Spec Color | Hex Equivalent |
|--------------|------------------|----------------|
| `--neutral-dark-500` | Background Primary | ~#1A1D23 |
| `--neutral-dark-700` | Background Secondary | ~#2D3748 |
| `--color-primary` | Accent Primary | ~#14B8A6 |
| `--neutral-500` | Foreground Primary | ~#F7FAFC |
| `--neutral-dark-200` | Foreground Muted | ~#A0AEC0 |
| `--color-destructive` | Destructive | ~#F56565 |

---

## 13. Phase 3 Implementation Checklist

Based on this legacy theme, Phase 3 should:

- [ ] Copy relevant CSS variables to `globals.css`
- [ ] Set up dark mode as default (V1 is dark-only)
- [ ] Configure `@theme inline` block for Tailwind CSS 4
- [ ] Add `@custom-variant dark` for dark mode classes
- [ ] Configure fonts via `next/font` (Nunito Sans, JetBrains Mono)
- [ ] Add reduced-motion accessibility support
- [ ] Verify color contrast meets WCAG 2.1 AA
- [ ] Remove unused light mode variables
- [ ] Evaluate tw-animate-css necessity

---

**Document Status**: COMPLETE
**Created**: 2025-12-02
**Source File**: `src/app/globals copy.css`
