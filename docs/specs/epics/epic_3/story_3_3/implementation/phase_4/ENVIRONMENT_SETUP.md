# Environment Setup: Phase 4 - Mobile Navigation & Language Switcher

**Story**: 3.3 - Layout Global & Navigation
**Phase**: 4 of 5

---

## Prerequisites

### Required Completions

Before starting Phase 4, ensure:

- [x] **Phase 1**: shadcn/ui Components installed (Sheet component)
- [x] **Phase 2**: Header & Desktop Navigation complete
- [x] **Phase 3**: Footer Component complete
- [x] **Story 3.2**: Design System integrated (Tailwind 4, design tokens)
- [x] **Story 3.1**: i18n Routing functional (next-intl)

### Verify Prerequisites

```bash
# Check Phase 3 completion
ls src/components/layout/Footer.tsx  # Should exist

# Check Sheet component (from Phase 1)
ls src/components/ui/sheet.tsx  # Should exist

# Check Header (from Phase 2)
ls src/components/layout/Header.tsx  # Should exist

# Check design system
ls src/app/globals.css  # Should contain design tokens

# Check i18n routing
ls src/i18n/routing.ts  # Should exist
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
pnpm list next next-intl @radix-ui/react-dialog lucide-react

# Expected output should show:
# - next@15.x
# - next-intl@3.x
# - @radix-ui/react-dialog (Sheet uses Dialog internally)
# - lucide-react (for Menu icon)
```

### 4. Lucide React Icons

If `lucide-react` is not installed:

```bash
pnpm add lucide-react
```

Verify installation:

```bash
pnpm list lucide-react
# Expected: lucide-react@0.x.x
```

### 5. Build Verification

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
git checkout -b feat/story-3.3-phase-4-mobile-nav

# Or create from main
git checkout main
git pull origin main
git checkout -b feat/story-3.3-phase-4-mobile-nav
```

---

## Project Structure Verification

### Existing Layout Components

```
src/components/layout/
├── Footer.tsx      ✅ Created in Phase 3
├── Header.tsx      ✅ Created in Phase 2
├── Logo.tsx        ✅ Created in Phase 2
├── Navigation.tsx  ✅ Created in Phase 2
├── index.ts        ✅ Barrel exports
├── LanguageSwitcher.tsx  ❌ To be created in this phase
└── MobileMenu.tsx        ❌ To be created in this phase
```

### Existing UI Components

```
src/components/ui/
├── button.tsx       ✅ From Story 3.2
├── dropdown-menu.tsx ✅ From Phase 1
└── sheet.tsx         ✅ From Phase 1 (REQUIRED)
```

### Verify Sheet Component

```bash
# Check Sheet component exists
cat src/components/ui/sheet.tsx | head -20

# Should see imports from @radix-ui/react-dialog
# and exports for Sheet, SheetTrigger, SheetContent, etc.
```

### Existing i18n Messages

Verify footer and navigation keys exist:

```bash
# Check French messages
cat messages/fr.json | grep -A 5 '"navigation"'
cat messages/fr.json | grep -A 5 '"footer"'

# Check English messages
cat messages/en.json | grep -A 5 '"navigation"'
cat messages/en.json | grep -A 5 '"footer"'
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
2. Verify Header is visible with navigation
3. Verify Footer is visible
4. Resize browser to mobile width (<1024px)
5. Note: No hamburger menu yet (will be added)

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
| `messages/fr.json` | Add language & mobileMenu translations (FR) |
| `messages/en.json` | Add language & mobileMenu translations (EN) |
| `src/components/layout/index.ts` | Add new exports |
| `src/components/layout/Header.tsx` | Integrate responsive navigation |

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/layout/LanguageSwitcher.tsx` | Language toggle component |
| `src/components/layout/MobileMenu.tsx` | Mobile navigation sheet |

### Reference Files (Read-Only)

| File | Purpose |
|------|---------|
| `src/components/layout/Header.tsx` | Existing header structure |
| `src/components/layout/Navigation.tsx` | Desktop navigation reference |
| `src/components/ui/sheet.tsx` | Sheet component API |
| `src/i18n/routing.ts` | Locale-aware Link component |
| `src/app/globals.css` | Design tokens reference |

---

## Design Token Reference

### Colors (from globals.css)

```css
/* Components will use these tokens */
--primary: /* Teal accent - active locale indicator */
--foreground: /* Primary text color */
--muted-foreground: /* Secondary text - inactive locale */
--background: /* Page background */
--accent: /* Hover background */
--border: /* Border color */
```

### Tailwind Classes for Phase 4

```css
/* Language Switcher */
text-primary            /* Active locale */
text-muted-foreground   /* Inactive locale */
hover:text-foreground   /* Hover on inactive */
transition-colors       /* Smooth color transition */

/* Mobile Menu Trigger */
h-10 w-10               /* Touch-friendly size (40px) */
rounded-md              /* Rounded corners */
hover:bg-accent         /* Hover background */
lg:hidden               /* Hidden on desktop */

/* Sheet Content */
w-[300px] sm:w-[350px]  /* Sheet width */
border-border           /* Divider lines */

/* Navigation Links in Sheet */
text-lg                 /* Larger touch targets */
text-foreground         /* Primary text */
hover:text-primary      /* Hover state */
```

### Responsive Breakpoint

```css
/* lg breakpoint = 1024px */
lg:hidden    /* Hide on ≥1024px */
lg:flex      /* Show flex on ≥1024px */
hidden lg:flex  /* Hidden below 1024px, flex above */
```

---

## Import Paths Reference

### Correct Import Paths

```tsx
// i18n-aware Link (for locale switching)
import { Link } from '@/i18n/routing'

// Hooks
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'

// UI Components
import { Sheet, SheetContent, SheetTrigger, ... } from '@/components/ui/sheet'

// Icons
import { Menu, X } from 'lucide-react'

// Layout components
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu } from './MobileMenu'
```

### Wrong Import Paths (Common Mistakes)

```tsx
// ❌ Wrong: Using next/link directly (won't handle locale)
import Link from 'next/link'

// ✅ Correct: Use i18n routing Link
import { Link } from '@/i18n/routing'

// ❌ Wrong: Importing from @radix-ui directly
import { Dialog } from '@radix-ui/react-dialog'

// ✅ Correct: Use our sheet component
import { Sheet } from '@/components/ui/sheet'
```

---

## Quick Start Checklist

Before starting implementation:

- [ ] On correct branch
- [ ] Working directory clean
- [ ] `pnpm build` succeeds
- [ ] Dev server starts without errors
- [ ] Header visible in browser
- [ ] Footer visible in browser
- [ ] Sheet component exists (`src/components/ui/sheet.tsx`)
- [ ] lucide-react installed
- [ ] Phase 3 components exist

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

### Missing Sheet Component

If `src/components/ui/sheet.tsx` doesn't exist:

```bash
# Install via shadcn CLI
npx shadcn@latest add sheet
```

### Missing lucide-react

```bash
# Install lucide-react
pnpm add lucide-react
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

### Sheet Not Opening

If Sheet component doesn't work:

1. Verify Radix Dialog dependencies installed
2. Check `@radix-ui/react-dialog` in package.json
3. Reinstall dependencies: `pnpm install`

---

## Testing Mobile Viewport

### Using Browser DevTools

1. Open Chrome/Firefox DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Select a mobile device (iPhone 12, Pixel 5, etc.)
4. Or set custom dimensions below 1024px width

### Common Test Viewports

| Device | Width | Height |
|--------|-------|--------|
| iPhone SE | 375px | 667px |
| iPhone 12 | 390px | 844px |
| Pixel 5 | 393px | 851px |
| iPad Mini | 768px | 1024px |
| Desktop (lg) | 1024px+ | Any |

### Breakpoint Testing

Test exactly at 1024px to verify behavior:
1. Set viewport to 1023px → Should show mobile (hamburger)
2. Set viewport to 1024px → Should show desktop (navigation)

---

## Contact & Support

If you encounter issues:

1. Check the [PHASES_PLAN.md](../PHASES_PLAN.md) for context
2. Review [Phase 3 INDEX.md](../phase_3/INDEX.md) for similar patterns
3. Consult [Story 3.3 spec](../../story_3.3.md) for requirements
4. Check [shadcn/ui Sheet docs](https://ui.shadcn.com/docs/components/sheet)
5. Check [next-intl Navigation docs](https://next-intl-docs.vercel.app/docs/routing/navigation)

---

**Document Created**: 2025-12-03
**Last Updated**: 2025-12-03
