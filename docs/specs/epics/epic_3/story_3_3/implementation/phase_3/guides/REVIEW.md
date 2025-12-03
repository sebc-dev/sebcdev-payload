# Code Review Guide: Phase 3 - Footer Component

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 3 of 5

---

## Review Overview

This guide helps reviewers evaluate the Footer component implementation. The phase consists of 4 atomic commits, each independently reviewable.

### Review Time Estimate

| Commit | Time |
|--------|------|
| 1. i18n keys | 5-10 min |
| 2. Footer component | 15-20 min |
| 3. Barrel export | 2-5 min |
| 4. Layout integration | 10-15 min |
| **Total** | **30-50 min** |

---

## Commit 1: Add Footer i18n Keys

### What to Review

**Files**: `messages/fr.json`, `messages/en.json`

### Checklist

- [ ] **JSON Validity**: Both files parse without errors
- [ ] **Namespace**: Uses `footer` namespace (lowercase)
- [ ] **Key Structure**: Follows existing patterns
- [ ] **French Quality**: Translations are proper French
- [ ] **English Quality**: Translations are proper English
- [ ] **Placeholder**: `{year}` placeholder in copyright string

### Key Questions

1. Are the translations accurate and natural-sounding?
2. Is the namespace consistent with other i18n keys?
3. Is the structure easy to extend for future footer content?

### Expected Structure

```json
{
  "footer": {
    "tagline": "...",
    "copyright": "© {year} ...",
    "links": {
      "articles": "...",
      "contact": "..."
    }
  }
}
```

### Red Flags

- Missing `{year}` placeholder
- Inconsistent key naming (camelCase vs snake_case)
- Duplicate keys from other namespaces

---

## Commit 2: Create Footer Component

### What to Review

**File**: `src/components/layout/Footer.tsx`

### Architecture Review

- [ ] **Component Type**: Server Component (no `'use client'`)
- [ ] **Import Sources**: Correct paths for Link, useTranslations
- [ ] **Export**: Named export `Footer`

### Code Quality Review

- [ ] **JSDoc Comment**: Describes component purpose
- [ ] **TypeScript**: No type errors
- [ ] **No Props**: Component doesn't need props (or has className prop)

### Styling Review

- [ ] **Design Tokens**: Uses Tailwind CSS variables (not hardcoded colors)
- [ ] **Responsive**: Has mobile and desktop layouts
- [ ] **Consistency**: Matches Header styling approach

### Expected Classes

| Element | Classes |
|---------|---------|
| `<footer>` | `border-t border-border bg-card` |
| Container | `container mx-auto max-w-6xl px-4 py-8` |
| Flex wrapper | `flex flex-col lg:flex-row` |
| Site name | `text-lg font-bold text-foreground` |
| Tagline | `text-sm text-muted-foreground` |
| Links | `text-sm text-muted-foreground hover:text-foreground` |
| Copyright | `text-xs text-muted-foreground` |

### Semantic HTML Review

- [ ] **Footer Element**: Uses `<footer>` (not `<div>`)
- [ ] **Nav Element**: Uses `<nav>` for links section
- [ ] **Paragraph Tags**: Uses `<p>` for text content

### i18n Review

- [ ] **Namespace**: `useTranslations('footer')`
- [ ] **Key Access**: Dot notation for nested keys (`t('links.articles')`)
- [ ] **Interpolation**: Year passed to copyright (`t('copyright', { year })`)

### Link Review

- [ ] **Internal Link**: Uses `Link` from `@/i18n/routing`
- [ ] **External Link**: Uses `<a>` for mailto
- [ ] **Href Values**: Correct paths (`/articles`, `mailto:...`)

### Red Flags

- Hardcoded colors (e.g., `bg-gray-800`)
- Missing responsive breakpoints
- Using `<div>` instead of semantic elements
- Missing `transition-colors` on links
- Wrong import path for Link component

### Code Example Reference

```tsx
// Good: Server Component with correct imports
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()
  // ...
}
```

---

## Commit 3: Export Footer from Barrel

### What to Review

**File**: `src/components/layout/index.ts`

### Checklist

- [ ] **Export Added**: `export { Footer } from './Footer'`
- [ ] **Alphabetical Order**: Exports sorted alphabetically
- [ ] **No Duplicates**: No duplicate exports
- [ ] **Consistent Style**: Matches existing export pattern

### Expected Result

```typescript
export { Footer } from './Footer'
export { Header } from './Header'
export { Logo } from './Logo'
export { Navigation } from './Navigation'
```

### Red Flags

- Default export instead of named export
- Re-exporting with different name
- Breaking existing exports

---

## Commit 4: Integrate Footer into Frontend Layout

### What to Review

**File**: `src/app/[locale]/(frontend)/layout.tsx`

### Import Review

- [ ] **Footer Import**: Added to existing import statement
- [ ] **Import Order**: Alphabetical within destructure

### Layout Structure Review

- [ ] **Wrapper Added**: `<div className="flex min-h-screen flex-col">`
- [ ] **Main Updated**: Changed from `min-h-screen` to `flex-1`
- [ ] **Footer Positioned**: After `<main>`, inside wrapper

### Sticky Footer Pattern

The layout should follow this pattern:

```tsx
return (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
)
```

### Checklist

- [ ] **Container**: Has `min-h-screen` for full viewport height
- [ ] **Flexbox**: Uses `flex flex-col` for vertical stacking
- [ ] **Main Flex**: Uses `flex-1` to grow and push footer down
- [ ] **No Fragment**: If using wrapper div, remove `<>` fragment

### Red Flags

- Footer inside `<main>` instead of sibling
- Missing `flex-1` on main (footer won't stick to bottom)
- Missing `min-h-screen` on wrapper
- Keeping `min-h-screen` on main (conflicts with flex-1)

---

## Cross-Commit Review

### Consistency Checks

- [ ] **Naming**: Footer component name matches export and import
- [ ] **i18n Keys**: Keys used in Footer match keys in message files
- [ ] **Styling**: Footer follows same patterns as Header

### Integration Checks

- [ ] **Build**: `pnpm build` succeeds
- [ ] **Lint**: `pnpm lint` passes
- [ ] **Types**: No TypeScript errors

---

## Visual Review Checklist

After code review, verify visually:

### Desktop (≥1024px)

- [ ] Footer at bottom of page
- [ ] Content spread horizontally
- [ ] Site name on left
- [ ] Links visible and clickable
- [ ] Copyright centered below

### Mobile (<1024px)

- [ ] Footer at bottom of page
- [ ] Content stacked vertically
- [ ] All content centered
- [ ] Links stacked vertically
- [ ] No horizontal overflow

### Both Viewports

- [ ] Border visible at top
- [ ] Background color correct
- [ ] Links have hover states
- [ ] Text readable (contrast)

---

## Accessibility Review

### Semantic Structure

- [ ] `<footer>` element used (implicit `role="contentinfo"`)
- [ ] `<nav>` element for navigation links
- [ ] Links have descriptive text

### Keyboard Navigation

- [ ] Links focusable with Tab
- [ ] Focus visible on links
- [ ] Logical tab order

### Screen Reader

- [ ] Footer announced as contentinfo landmark
- [ ] Links announced with text

### Color Contrast

- [ ] Text meets WCAG AA (4.5:1 minimum)
- [ ] Links distinguishable from regular text

---

## Common Issues & Fixes

### Issue: Footer Not at Bottom

**Symptom**: Footer in middle of page with short content

**Fix**: Verify sticky footer pattern:
```tsx
<div className="flex min-h-screen flex-col">
  <Header />
  <main className="flex-1">{children}</main>
  <Footer />
</div>
```

### Issue: Translation Not Showing

**Symptom**: Shows key like "footer.tagline" instead of text

**Fix**:
1. Verify key exists in message files
2. Check namespace matches (`'footer'` not `'Footer'`)
3. Ensure dev server restarted after adding keys

### Issue: Year Not Dynamic

**Symptom**: Year is hardcoded or missing

**Fix**: Use `new Date().getFullYear()`:
```tsx
const currentYear = new Date().getFullYear()
// Then: t('copyright', { year: currentYear })
```

---

## Approval Criteria

### Must Have

- [ ] Build succeeds
- [ ] Lint passes
- [ ] Footer visible on all frontend pages
- [ ] i18n working (FR/EN)
- [ ] Links functional
- [ ] Responsive layout works

### Should Have

- [ ] Semantic HTML
- [ ] Accessible
- [ ] Matches design spec
- [ ] Clean code structure

### Nice to Have

- [ ] Comprehensive JSDoc
- [ ] Unit tests (Phase 5)

---

## Review Decision

| Decision | Criteria |
|----------|----------|
| **Approve** | All "Must Have" criteria met, code is clean |
| **Request Changes** | Missing "Must Have" criteria or significant issues |
| **Comment** | Minor suggestions, approve after acknowledgment |

---

**Document Created**: 2025-12-03
**Last Updated**: 2025-12-03
