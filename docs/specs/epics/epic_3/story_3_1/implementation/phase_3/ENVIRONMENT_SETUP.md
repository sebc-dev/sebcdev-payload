# Phase 3 - Environment Setup

Pre-implementation verification and environment setup for Phase 3.

---

## Prerequisites

Before starting Phase 3, ensure the following are complete:

### Phase 1: Foundation (REQUIRED)

- [ ] `next-intl` package installed
- [ ] `src/i18n/config.ts` exists with locale definitions
- [ ] `src/i18n/routing.ts` exists with routing configuration
- [ ] `src/i18n/request.ts` exists with server request config
- [ ] `messages/fr.json` exists with French translations
- [ ] `messages/en.json` exists with English translations
- [ ] `global.d.ts` has TypeScript message types

**Verify**:

```bash
# Check package is installed
pnpm list next-intl

# Expected output: next-intl 4.x.x

# Check config files exist
ls -la src/i18n/

# Expected:
# config.ts
# routing.ts
# request.ts

# Check message files exist
ls -la messages/

# Expected:
# fr.json
# en.json
```

### Phase 2: Middleware (REQUIRED)

- [ ] `middleware.ts` exists at project root
- [ ] Middleware redirects `/` to `/{locale}`
- [ ] Cookie `NEXT_LOCALE` is set on first visit
- [ ] Admin routes (`/admin/*`) are not affected

**Verify**:

```bash
# Check middleware exists
cat middleware.ts

# Test middleware (start dev server)
pnpm dev

# In browser:
# 1. Visit http://localhost:3000/
# 2. Should redirect to /fr (or /en based on browser language)
# 3. Check cookie NEXT_LOCALE in DevTools
# 4. Visit http://localhost:3000/admin - should work
```

---

## Environment Verification

### 1. Package Versions

```bash
# Check Node.js version
node -v
# Expected: v20.x or v22.x

# Check pnpm version
pnpm -v
# Expected: 9.x

# Check Next.js version
pnpm list next
# Expected: next 15.x

# Check next-intl version
pnpm list next-intl
# Expected: next-intl 4.x
```

### 2. TypeScript Configuration

```bash
# Verify TypeScript compiles
pnpm exec tsc --noEmit

# Expected: No errors (or only warnings)
```

### 3. Current App Structure

```bash
# Check current frontend structure
ls -la src/app/\(frontend\)/

# Expected:
# layout.tsx
# page.tsx
# styles.css

# Check Payload structure (should not be modified)
ls -la src/app/\(payload\)/

# Expected:
# admin/
# api/
# layout.tsx
```

### 4. i18n Configuration Check

```bash
# Verify config exports
cat src/i18n/config.ts

# Expected exports:
# - locales = ['fr', 'en'] as const
# - Locale type
# - defaultLocale = 'fr'
# - isValidLocale function

# Verify routing config
cat src/i18n/routing.ts

# Expected:
# - routing with defineRouting
# - localePrefix: 'always'
# - middlewareMatcher
```

---

## Pre-Implementation Checklist

### Code Quality

- [ ] TypeScript compiles without errors: `pnpm exec tsc --noEmit`
- [ ] Linting passes: `pnpm lint`
- [ ] No uncommitted changes: `git status`

### Functional Verification

- [ ] Dev server starts: `pnpm dev`
- [ ] Homepage loads at old URL: `http://localhost:3000/`
- [ ] Admin panel works: `http://localhost:3000/admin`
- [ ] Middleware redirects `/` to `/fr` or `/en`

### Git State

```bash
# Check for uncommitted changes
git status

# Expected: working tree clean

# Check current branch
git branch

# Recommended: Create feature branch if not already
git checkout -b feature/story-3.1-phase-3

# Or verify you're on the correct branch
git branch --show-current
```

---

## Backup (Optional but Recommended)

Before making structural changes, optionally backup the current frontend files:

```bash
# Create a backup branch point
git stash  # If there are uncommitted changes
git tag phase-3-backup  # Mark current state

# Or simply note the commit hash
git log -1 --oneline
# Save this hash for easy rollback if needed
```

---

## Directory Structure Before Phase 3

```
src/
├── app/
│   ├── (frontend)/
│   │   ├── layout.tsx      # Current root layout with <html>
│   │   ├── page.tsx        # Current homepage
│   │   └── styles.css      # Current styles
│   └── (payload)/
│       ├── admin/          # Payload admin (DO NOT TOUCH)
│       ├── api/            # API routes (DO NOT TOUCH)
│       └── layout.tsx      # Payload layout (DO NOT TOUCH)
├── i18n/
│   ├── config.ts           # Phase 1
│   ├── routing.ts          # Phase 1
│   └── request.ts          # Phase 1
├── ...
├── middleware.ts           # Phase 2
└── messages/
    ├── fr.json             # Phase 1
    └── en.json             # Phase 1
```

---

## Expected Directory Structure After Phase 3

```
src/
├── app/
│   ├── [locale]/           # NEW: Dynamic locale segment
│   │   ├── layout.tsx      # NEW: Root locale layout with NextIntlClientProvider
│   │   └── (frontend)/     # NEW: Frontend route group
│   │       ├── layout.tsx  # MIGRATED: Frontend layout
│   │       ├── page.tsx    # MIGRATED: Homepage
│   │       └── styles.css  # MIGRATED: Styles
│   └── (payload)/          # UNCHANGED
│       ├── admin/
│       ├── api/
│       └── layout.tsx
├── i18n/
│   ├── config.ts
│   ├── routing.ts
│   └── request.ts
├── ...
├── middleware.ts
└── messages/
    ├── fr.json
    └── en.json
```

---

## Common Issues Before Starting

### Issue: TypeScript Errors

```bash
pnpm exec tsc --noEmit
# If errors appear, fix them before Phase 3
```

### Issue: Lint Errors

```bash
pnpm lint
# If errors appear, fix them before Phase 3
```

### Issue: Middleware Not Working

```bash
# Verify middleware file exists
cat middleware.ts

# Verify matcher pattern
# Should exclude /api, /admin, /_next, and files with extensions
```

### Issue: Messages Not Loading

```bash
# Verify message files are valid JSON
cat messages/fr.json | python3 -m json.tool
cat messages/en.json | python3 -m json.tool

# If errors, fix JSON syntax
```

---

## Ready to Start

Once all checks pass:

1. Read `IMPLEMENTATION_PLAN.md` for strategy overview
2. Follow `COMMIT_CHECKLIST.md` for each commit
3. Validate after each commit
4. Complete `VALIDATION_CHECKLIST.md` at the end

```bash
# Start implementation
cat docs/specs/epics/epic_3/story_3_1/implementation/phase_3/IMPLEMENTATION_PLAN.md
```
