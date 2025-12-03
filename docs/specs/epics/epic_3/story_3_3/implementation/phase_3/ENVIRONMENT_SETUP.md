# Environment Setup: Phase 3 - Footer Component

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 3 of 5

---

## Prerequisites

### Required Completions

Before starting Phase 3, ensure:

- [x] **Phase 1**: shadcn/ui Components installed (DropdownMenu, Sheet)
- [x] **Phase 2**: Header & Desktop Navigation complete
- [x] **Story 3.2**: Design System integrated (Tailwind 4, design tokens)
- [x] **Story 3.1**: i18n Routing functional (next-intl)

### Verify Prerequisites

```bash
# Check Phase 2 completion
ls src/components/layout/Header.tsx  # Should exist
ls src/components/layout/Navigation.tsx  # Should exist
ls src/components/layout/Logo.tsx  # Should exist

# Check design system
ls src/app/globals.css  # Should contain design tokens

# Check i18n
ls messages/fr.json  # Should exist
ls messages/en.json  # Should exist
```

---

## Environment Verification

### 1. Node.js Version

```bash
node --version
# Expected: v20.x or v22.x
```

### 2. Package Manager

```bash
pnpm --version
# Expected: 9.x
```

### 3. Dependencies Check

```bash
# Verify key dependencies
pnpm list next next-intl @radix-ui/react-dropdown-menu

# Expected output should show:
# - next@15.x
# - next-intl@3.x
# - @radix-ui/react-dropdown-menu (from shadcn/ui)
```

### 4. Build Verification

```bash
# Ensure project builds successfully
pnpm build

# Should complete without errors
```

---

## Branch Setup

### Option 1: Continue on Planning Branch

```bash
# Check current branch
git branch --show-current
# Expected: epic-3-story-3.3-planning

# Ensure clean state
git status
# Should show: "nothing to commit, working tree clean"
# Or only untracked files that aren't relevant
```

### Option 2: Create Feature Branch

```bash
# Create from current branch
git checkout -b feat/story-3.3-phase-3-footer

# Or create from main
git checkout main
git pull origin main
git checkout -b feat/story-3.3-phase-3-footer
```

---

## Project Structure Verification

### Existing Layout Components

```
src/components/layout/
├── Header.tsx      ✅ Created in Phase 2
├── Logo.tsx        ✅ Created in Phase 2
├── Navigation.tsx  ✅ Created in Phase 2
├── index.ts        ✅ Barrel exports
└── Footer.tsx      ❌ To be created in this phase
```

### Existing i18n Messages

Verify navigation keys exist:

```bash
# Check French messages
cat messages/fr.json | grep -A 5 '"navigation"'

# Check English messages
cat messages/en.json | grep -A 5 '"navigation"'
```

### Current Layout Structure

```
src/app/[locale]/(frontend)/
├── layout.tsx      ← Will be modified to add Footer
└── page.tsx        ← Homepage
```

---

## Development Server

### Start Development

```bash
# Clean start (recommended)
pnpm devsafe

# Or standard start
pnpm dev
```

### Verify Dev Server

1. Open http://localhost:3000/fr
2. Verify Header is visible
3. Verify navigation works
4. Note: Footer not yet visible (will be added)

---

## IDE Setup

### VS Code Extensions (Recommended)

- **Tailwind CSS IntelliSense**: Autocomplete for Tailwind classes
- **ESLint**: Linting integration
- **TypeScript Vue Plugin (Volar)**: Better TypeScript support
- **Prettier**: Code formatting

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

---

## Key Files Reference

### Files to Modify

| File | Purpose |
|------|---------|
| `messages/fr.json` | Add footer translations (FR) |
| `messages/en.json` | Add footer translations (EN) |
| `src/components/layout/index.ts` | Add Footer export |
| `src/app/[locale]/(frontend)/layout.tsx` | Integrate Footer |

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/layout/Footer.tsx` | Footer component |

### Reference Files (Read-Only)

| File | Purpose |
|------|---------|
| `src/components/layout/Header.tsx` | Reference for styling patterns |
| `src/app/globals.css` | Design tokens reference |
| `src/i18n/routing.ts` | Link component import path |

---

## Design Token Reference

### Colors (from globals.css)

```css
/* Footer will use these tokens */
--card: /* Card background color */
--card-foreground: /* Card text color */
--border: /* Border color */
--muted-foreground: /* Muted text (tagline, links) */
--foreground: /* Primary text (site name) */
```

### Tailwind Classes for Footer

```css
/* Background */
bg-card

/* Border */
border-t border-border

/* Text */
text-foreground      /* Site name */
text-muted-foreground /* Tagline, links */
text-xs              /* Copyright */
text-sm              /* Links */

/* Hover */
hover:text-foreground /* Link hover state */

/* Layout */
flex flex-col        /* Mobile: vertical stack */
lg:flex-row          /* Desktop: horizontal */
items-center         /* Mobile: center */
lg:items-start       /* Desktop: align top */
lg:justify-between   /* Desktop: spread */
```

---

## Quick Start Checklist

Before starting implementation:

- [ ] On correct branch
- [ ] Working directory clean
- [ ] `pnpm build` succeeds
- [ ] Dev server starts without errors
- [ ] Header visible in browser
- [ ] Phase 2 components exist

Ready to implement? Proceed to [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md).

---

## Troubleshooting

### Build Fails

```bash
# Clean and rebuild
rm -rf .next .open-next
pnpm install
pnpm build
```

### Missing Dependencies

```bash
# Reinstall all dependencies
rm -rf node_modules
pnpm install
```

### TypeScript Errors

```bash
# Generate types
pnpm generate:types:payload

# Check TypeScript
pnpm exec tsc --noEmit
```

### i18n Not Working

```bash
# Verify message files exist
ls messages/

# Check next-intl config
cat src/i18n/request.ts
```

---

## Contact & Support

If you encounter issues:

1. Check the [PHASES_PLAN.md](../PHASES_PLAN.md) for context
2. Review [Phase 2 INDEX.md](../phase_2/INDEX.md) for similar patterns
3. Consult [Story 3.3 spec](../../story_3.3.md) for requirements

---

**Document Created**: 2025-12-03
**Last Updated**: 2025-12-03
