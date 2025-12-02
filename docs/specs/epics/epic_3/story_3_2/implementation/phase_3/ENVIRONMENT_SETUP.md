# Environment Setup - Phase 3: Design Tokens & Visual Migration

**Story**: 3.2 - Integration Design System (Dark Mode)
**Phase**: 3 of 4

---

## Prerequisites

### Required Completed Phases

Before starting Phase 3, ensure these phases are complete:

| Phase | Status | Verification Command |
|-------|--------|---------------------|
| Phase 1: Tailwind CSS 4 | Required | `grep -r "@import 'tailwindcss'" src/app/globals.css` |
| Phase 2: shadcn/ui | Required | `ls src/components/ui/button.tsx` |

### System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18.x | 20.x+ |
| pnpm | 8.x | 9.x |
| Git | 2.30+ | Latest |

---

## Environment Verification

Run these commands to verify your environment is ready:

### 1. Check Node.js Version

```bash
node --version
# Expected: v18.x.x or higher
```

### 2. Check pnpm Version

```bash
pnpm --version
# Expected: 8.x.x or higher
```

### 3. Verify Dependencies Installed

```bash
pnpm install
# Should complete without errors
```

### 4. Verify Build Works

```bash
pnpm build
# Should complete successfully
```

### 5. Verify Tailwind CSS Working

```bash
# Check Tailwind import exists
grep -r "@import 'tailwindcss'" src/app/globals.css
# Expected: @import 'tailwindcss';

# Start dev server and check
pnpm dev
# Visit http://localhost:3000 - Tailwind classes should work
```

### 6. Verify shadcn/ui Setup

```bash
# Check components.json exists
cat components.json
# Expected: JSON configuration for shadcn/ui

# Check Button component exists
ls src/components/ui/button.tsx
# Expected: File exists

# Check cn utility exists
cat src/lib/utils.ts
# Expected: cn() function with clsx and tailwind-merge
```

---

## Git Branch Setup

### Create Feature Branch

```bash
# Ensure you're on the latest main (or story branch)
git checkout main
git pull origin main

# Create and switch to phase branch
git checkout -b epic-3-story-3-2-phase3

# Verify branch
git branch
# Expected: * epic-3-story-3-2-phase3
```

### Alternative: Continue from Phase 2 Branch

If building sequentially:

```bash
# If Phase 2 is merged to main
git checkout main
git pull origin main
git checkout -b epic-3-story-3-2-phase3

# If continuing directly from Phase 2 branch (not merged yet)
git checkout epic-3-story-3-2-phase2
git checkout -b epic-3-story-3-2-phase3
```

---

## Project Structure Reference

### Current Structure (After Phase 2)

```
src/
├── app/
│   ├── globals.css              # Tailwind imports (Phase 1)
│   └── [locale]/
│       ├── layout.tsx           # Root locale layout
│       ├── (frontend)/
│       │   ├── layout.tsx       # Frontend layout (imports styles.css)
│       │   ├── page.tsx         # Homepage (uses CSS classes)
│       │   └── styles.css       # Legacy CSS (to be deleted)
│       └── (payload)/
│           └── ...
├── components/
│   └── ui/
│       └── button.tsx           # shadcn/ui Button (Phase 2)
├── lib/
│   └── utils.ts                 # cn() utility (Phase 2)
└── ...
```

### Target Structure (After Phase 3)

```
src/
├── app/
│   ├── globals.css              # CSS variables + fonts
│   └── [locale]/
│       ├── layout.tsx           # Fonts via next/font
│       ├── (frontend)/
│       │   ├── layout.tsx       # No styles.css import
│       │   └── page.tsx         # Tailwind utilities
│       └── (payload)/
│           └── ...
├── components/
│   └── ui/
│       └── button.tsx           # shadcn/ui Button
├── lib/
│   └── utils.ts                 # cn() utility
└── ...

# DELETED:
# - src/app/[locale]/(frontend)/styles.css
```

---

## Design Token Reference

Keep this reference handy during implementation:

### Color Palette (HSL Format)

```css
/* Primary Colors */
--background: 222 16% 12%;       /* #1A1D23 - Anthracite */
--foreground: 210 40% 98%;       /* #F7FAFC - Off-white */

/* Card Colors */
--card: 222 16% 18%;             /* #2D3748 */
--card-foreground: 210 40% 98%;

/* Primary Accent */
--primary: 174 72% 40%;          /* #14B8A6 - Teal */
--primary-foreground: 210 40% 98%;

/* Secondary */
--secondary: 217 19% 27%;        /* #374151 */
--secondary-foreground: 210 40% 98%;

/* Muted */
--muted: 217 19% 27%;
--muted-foreground: 215 14% 65%; /* #A0AEC0 */

/* Destructive */
--destructive: 0 72% 67%;        /* #F56565 */
--destructive-foreground: 210 40% 98%;

/* UI Elements */
--border: 217 19% 27%;           /* #374151 */
--input: 217 19% 27%;
--ring: 174 72% 40%;             /* #14B8A6 */

/* Border Radius */
--radius: 0.5rem;
```

### Typography

| Font | CSS Variable | Usage |
|------|--------------|-------|
| Nunito Sans | `--font-sans` | Body, headings |
| JetBrains Mono | `--font-mono` | Code elements |

---

## Development Tools

### Recommended VS Code Extensions

| Extension | Purpose |
|-----------|---------|
| Tailwind CSS IntelliSense | Autocomplete for Tailwind classes |
| PostCSS Language Support | CSS syntax highlighting |
| ESLint | Code linting |
| Prettier | Code formatting |

### Browser DevTools

Use these for visual verification:

1. **Elements tab**: Inspect computed styles
2. **Network tab**: Verify font loading
3. **Console tab**: Check for CSS errors

---

## Common Commands Reference

### Development

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Code Quality

```bash
# Run linter
pnpm lint

# Type check
pnpm exec tsc --noEmit

# Check for dead code
pnpm knip
```

### Git

```bash
# Stage changes
git add <file>

# Commit with message
git commit -m "message"

# View status
git status

# View recent commits
git log --oneline -5
```

---

## Troubleshooting Common Issues

### Issue: Tailwind Classes Not Working

**Symptom**: Tailwind utility classes have no effect

**Solution**:
```bash
# Verify Tailwind is imported
cat src/app/globals.css | head -20

# Clear cache and restart
rm -rf .next
pnpm dev
```

### Issue: Build Fails

**Symptom**: `pnpm build` returns errors

**Solution**:
```bash
# Check for TypeScript errors
pnpm exec tsc --noEmit

# Check for lint errors
pnpm lint

# Clear cache
rm -rf .next node_modules/.cache
pnpm install
pnpm build
```

### Issue: Fonts Not Loading

**Symptom**: System font appears instead of Google Font

**Solution**:
1. Check Network tab for font file requests
2. Verify CSS variable applied to `<html>`
3. Check for conflicting font-family in globals.css

### Issue: CSS Variables Undefined

**Symptom**: Colors show browser defaults

**Solution**:
```bash
# Check CSS variable syntax
grep -A5 ":root" src/app/globals.css
# Ensure HSL values don't have hsl() wrapper
```

---

## Environment Checklist

Complete this checklist before starting implementation:

### Prerequisites

- [ ] Node.js 18+ installed
- [ ] pnpm 8+ installed
- [ ] Repository cloned
- [ ] Dependencies installed (`pnpm install`)

### Phase 1 & 2 Verification

- [ ] `pnpm build` succeeds
- [ ] Tailwind CSS working (test with utility class)
- [ ] Button component renders
- [ ] `cn()` utility available

### Git Setup

- [ ] On correct branch (`epic-3-story-3-2-phase3`)
- [ ] Working directory clean (`git status`)
- [ ] Latest changes pulled

### Development Environment

- [ ] VS Code (or preferred editor) open
- [ ] Terminal ready
- [ ] Browser DevTools accessible

---

## Quick Start Commands

```bash
# One-liner to verify everything is ready
pnpm install && pnpm build && pnpm lint && echo "Environment ready!"

# Start development
pnpm dev

# Open in browser
# http://localhost:3000
```

---

## Next Steps

Once environment is verified:

1. Open `IMPLEMENTATION_PLAN.md`
2. Start with Commit 1: Configure CSS Variables
3. Use `COMMIT_CHECKLIST.md` for each commit

Good luck with Phase 3!
