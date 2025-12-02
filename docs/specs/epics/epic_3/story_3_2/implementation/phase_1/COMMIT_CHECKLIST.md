# Commit Checklist - Phase 1: Tailwind CSS 4 Foundation

**Phase**: 1 of 4
**Total Commits**: 3
**Estimated Time**: ~50 minutes

---

## How to Use This Checklist

1. Complete each commit in order
2. Check off items as you complete them
3. Run verification commands after each commit
4. Do not proceed to next commit until current is verified

---

## Commit 1: Install Tailwind CSS 4

**Objective**: Add Tailwind CSS 4 dependencies and create PostCSS configuration

### Pre-Commit Checklist

- [ ] Working directory is clean (`git status`)
- [ ] On correct branch (`epic-3-story-3-2-phase1` or feature branch)
- [ ] Node.js ≥ 20.9.0 installed

### Implementation Steps

- [ ] **Step 1.1**: Install Tailwind CSS
  ```bash
  pnpm add tailwindcss@^4.0.0
  ```

- [ ] **Step 1.2**: Install PostCSS plugin
  ```bash
  pnpm add -D @tailwindcss/postcss@^4.0.0
  ```

- [ ] **Step 1.3**: Create `postcss.config.mjs`
  ```javascript
  /** @type {import('postcss-load-config').Config} */
  const config = {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  }

  export default config
  ```

### Verification

- [ ] Run: `pnpm list tailwindcss` → Shows `tailwindcss@4.x.x`
- [ ] Run: `pnpm list @tailwindcss/postcss` → Shows `@tailwindcss/postcss@4.x.x`
- [ ] File exists: `postcss.config.mjs`
- [ ] Config valid: `node -e "import('./postcss.config.mjs')"`

### Files to Stage

```bash
git add package.json pnpm-lock.yaml postcss.config.mjs
```

### Commit Command

```bash
git commit -m "$(cat <<'EOF'
🔧 chore(deps): install Tailwind CSS 4 and PostCSS plugin

- Add tailwindcss@^4.0.0 as dependency
- Add @tailwindcss/postcss@^4.0.0 as devDependency
- Create postcss.config.mjs with minimal configuration

Phase 1, Commit 1/3 - Story 3.2 Design System

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Post-Commit Verification

- [ ] `git log -1` shows correct commit message
- [ ] `git status` shows clean working directory

---

## Commit 2: Create globals.css

**Objective**: Create global CSS file with Tailwind imports and base styles

### Pre-Commit Checklist

- [ ] Commit 1 completed and verified
- [ ] Working directory is clean

### Implementation Steps

- [ ] **Step 2.1**: Create `src/app/globals.css`
  ```css
  /**
   * Global Styles - Tailwind CSS 4
   *
   * This file imports Tailwind CSS and defines base layer customizations.
   * Design tokens will be added in Phase 3.
   *
   * @see https://tailwindcss.com/docs/v4-beta
   */

  /* Tailwind CSS 4 - CSS-first import */
  @import "tailwindcss";

  /*
   * Base layer customizations
   * These apply to the base HTML elements
   */
  @layer base {
    /* Smooth scrolling for the entire page */
    html {
      scroll-behavior: smooth;
    }

    /* Ensure full height for app shell */
    html,
    body {
      height: 100%;
    }

    /* Remove default margins */
    body {
      margin: 0;
    }

    /* Responsive images by default */
    img {
      max-width: 100%;
      height: auto;
      display: block;
    }

    /* Focus visible for accessibility */
    :focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }
  }
  ```

### Verification

- [ ] File exists: `src/app/globals.css`
- [ ] File contains `@import "tailwindcss"`
- [ ] File contains `@layer base`

### Files to Stage

```bash
git add src/app/globals.css
```

### Commit Command

```bash
git commit -m "$(cat <<'EOF'
🎨 feat(styles): create globals.css with Tailwind CSS 4 imports

- Add Tailwind CSS 4 import using CSS-first approach
- Define base layer with accessibility defaults
- Set up smooth scrolling and responsive images
- Prepare structure for design tokens (Phase 3)

Phase 1, Commit 2/3 - Story 3.2 Design System

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Post-Commit Verification

- [ ] `git log -1` shows correct commit message
- [ ] `git status` shows clean working directory

---

## Commit 3: Integrate in Layout

**Objective**: Import globals.css in root layout and verify build

### Pre-Commit Checklist

- [ ] Commits 1-2 completed and verified
- [ ] Working directory is clean

### Implementation Steps

- [ ] **Step 3.1**: Edit `src/app/[locale]/layout.tsx`

  Add at the very top of the file (before other imports):
  ```typescript
  import '@/app/globals.css'
  ```

### Verification

- [ ] Import added to `src/app/[locale]/layout.tsx`
- [ ] Run: `pnpm lint` → No errors
- [ ] Run: `pnpm build` → Build succeeds
- [ ] Run: `pnpm dev` → Dev server starts

### Runtime Test (Manual)

- [ ] Open http://localhost:3000/fr
- [ ] Page loads without errors
- [ ] Browser console has no CSS errors
- [ ] Admin panel (http://localhost:3000/admin) works normally

### Optional: Visual Verification

Add temporary test to `src/app/[locale]/(frontend)/page.tsx`:
```tsx
<div className="bg-blue-500 text-white p-4 rounded m-4">
  Tailwind CSS 4 is working!
</div>
```

- [ ] Blue box with white text appears
- [ ] Remove test code after verification

### Files to Stage

```bash
git add src/app/[locale]/layout.tsx
```

### Commit Command

```bash
git commit -m "$(cat <<'EOF'
✨ feat(layout): integrate Tailwind CSS in root layout

- Import globals.css in locale layout
- Tailwind CSS 4 now active for all frontend pages
- Build verified successfully

Phase 1, Commit 3/3 - Story 3.2 Design System

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Post-Commit Verification

- [ ] `git log -1` shows correct commit message
- [ ] `git status` shows clean working directory
- [ ] `pnpm build` succeeds

---

## Phase Completion Checklist

### All Commits Done

- [ ] Commit 1: Install Tailwind CSS 4 ✅
- [ ] Commit 2: Create globals.css ✅
- [ ] Commit 3: Integrate in layout ✅

### Final Verification

- [ ] `pnpm install` → No errors
- [ ] `pnpm lint` → No errors
- [ ] `pnpm build` → Build succeeds
- [ ] `pnpm dev` → Server starts
- [ ] Tailwind classes work in browser
- [ ] Admin panel unaffected

### Files Created/Modified

| File | Status |
|------|--------|
| `package.json` | ✅ Modified |
| `pnpm-lock.yaml` | ✅ Modified |
| `postcss.config.mjs` | ✅ Created |
| `src/app/globals.css` | ✅ Created |
| `src/app/[locale]/layout.tsx` | ✅ Modified |

### Update Tracking

- [ ] Update [EPIC_TRACKING.md](../../../EPIC_TRACKING.md):
  - Story 3.2 Progress: `1/4 (Phase 2 📋)`
- [ ] Mark Phase 1 as complete in [PHASES_PLAN.md](../PHASES_PLAN.md)

---

## Troubleshooting

### Build Fails with CSS Error

```bash
# Check PostCSS config syntax
node -e "import('./postcss.config.mjs')"

# Verify Tailwind installed correctly
pnpm list tailwindcss

# Try clean build
rm -rf .next && pnpm build
```

### Tailwind Classes Not Working

```bash
# Verify globals.css has correct import
cat src/app/globals.css | grep "@import"

# Verify layout imports globals.css
cat src/app/[locale]/layout.tsx | grep "globals.css"

# Check for PostCSS processing
# Add a simple utility class and inspect in browser
```

### Admin Panel Broken

```bash
# globals.css should NOT affect admin
# Check that globals.css only imports Tailwind, no custom styles yet
# Admin uses its own CSS (Payload UI)
```

---

## Next Steps

After completing all commits:

1. Complete [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)
2. Update EPIC_TRACKING.md with Phase 1 completion
3. Proceed to Phase 2: shadcn/ui & Utility Functions
