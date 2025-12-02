# Commit Checklist - Phase 3: Design Tokens & Visual Migration

**Story**: 3.2 - Integration Design System (Dark Mode)
**Phase**: 3 of 4
**Total Commits**: 5

---

## How to Use This Document

For each commit:

1. Read the commit description and requirements
2. Implement the changes as specified
3. Complete ALL checklist items before committing
4. Run the validation commands
5. Create the commit with the provided message

**Important**: Do not proceed to the next commit until all checklist items are checked.

---

## Commit 1: Configure CSS Variables (Design Tokens)

### Description

Add shadcn/ui-compatible CSS variables with the "Anthracite & Vert Canard" color palette.

### Pre-Commit Checks

- [ ] Read current globals.css content
- [ ] Understand HSL format requirements (no `hsl()` wrapper)

### Implementation Checklist

- [ ] Add `:root` CSS variables in `@layer base`
- [ ] Define `--background: 222 16% 12%` (Anthracite)
- [ ] Define `--foreground: 210 40% 98%` (Off-white)
- [ ] Define `--card: 222 16% 18%` (Card background)
- [ ] Define `--primary: 174 72% 40%` (Teal accent)
- [ ] Define `--muted-foreground: 215 14% 65%` (Secondary text)
- [ ] Define `--destructive: 0 72% 67%` (Red)
- [ ] Define `--border: 217 19% 27%` (Borders)
- [ ] Define `--ring: 174 72% 40%` (Focus ring)
- [ ] Define `--radius: 0.5rem` (Border radius)
- [ ] Add `color-scheme: dark` to html
- [ ] Add `@apply bg-background text-foreground` to body
- [ ] Update focus-visible styles with ring utilities

### Validation Commands

```bash
# Check for syntax errors
pnpm build

# Verify dev server works
pnpm dev
# Visit http://localhost:3000 - should show dark background
```

### Visual Verification

- [ ] Page background is dark (#1A1D23)
- [ ] Text is light colored (#F7FAFC)
- [ ] No CSS console errors

### Files Changed

- [ ] `src/app/globals.css`

### Commit Command

```bash
git add src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(design-system): add CSS variables for Anthracite & Vert Canard theme

- Add shadcn/ui compatible CSS variables in HSL format
- Define color tokens: background, foreground, primary, etc.
- Set --radius for consistent border radius
- Apply dark theme as default via body styles
- Maintain accessibility focus styles

EOF
)"
```

---

## Commit 2: Configure Nunito Sans Font

### Description

Add Nunito Sans as the primary font using next/font/google.

### Pre-Commit Checks

- [ ] Commit 1 completed and verified
- [ ] Understand next/font API

### Implementation Checklist

- [ ] Import `Nunito_Sans` from `next/font/google`
- [ ] Configure with `subsets: ['latin']`
- [ ] Configure with `variable: '--font-sans'`
- [ ] Configure with `display: 'swap'`
- [ ] Include weights: 400, 600, 700
- [ ] Apply variable class to `<html>` element
- [ ] Add `font-sans` class to `<body>`
- [ ] Update globals.css with `@theme` section for `--font-sans`

### Validation Commands

```bash
# Build to verify no errors
pnpm build

# Start dev server
pnpm dev
# Visit http://localhost:3000
```

### Visual Verification

- [ ] Text renders in Nunito Sans font
- [ ] Check DevTools computed font-family
- [ ] Font files loaded in Network tab

### Files Changed

- [ ] `src/app/[locale]/layout.tsx`
- [ ] `src/app/globals.css`

### Commit Command

```bash
git add src/app/[locale]/layout.tsx src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(typography): configure Nunito Sans as primary font

- Add Nunito Sans via next/font/google
- Configure CSS variable --font-sans
- Apply font to body via font-sans class
- Include weights 400, 600, 700 for body and headings
- Use display: swap for fast initial render

EOF
)"
```

---

## Commit 3: Configure JetBrains Mono Font

### Description

Add JetBrains Mono as the monospace font for code elements.

### Pre-Commit Checks

- [ ] Commit 2 completed and verified
- [ ] Nunito Sans working correctly

### Implementation Checklist

- [ ] Import `JetBrains_Mono` from `next/font/google`
- [ ] Configure with `subsets: ['latin']`
- [ ] Configure with `variable: '--font-mono'`
- [ ] Configure with `display: 'swap'`
- [ ] Include weights: 400, 500
- [ ] Add variable class to `<html>` (alongside Nunito Sans)
- [ ] Update globals.css `@theme` with `--font-mono`

### Validation Commands

```bash
# Build to verify no errors
pnpm build

# Lint check
pnpm lint
```

### Visual Verification

- [ ] Both font variables applied to html
- [ ] `font-mono` utility class available
- [ ] Test with temporary `<code className="font-mono">` element

### Files Changed

- [ ] `src/app/[locale]/layout.tsx`
- [ ] `src/app/globals.css`

### Commit Command

```bash
git add src/app/[locale]/layout.tsx src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(typography): add JetBrains Mono for code elements

- Add JetBrains Mono via next/font/google
- Configure CSS variable --font-mono
- Include weights 400, 500 for code display
- Extend Tailwind theme with font-mono utility

EOF
)"
```

---

## Commit 4: Migrate Homepage to Tailwind Classes

### Description

Replace CSS class selectors with Tailwind utility classes on the homepage.

### Pre-Commit Checks

- [ ] Commit 3 completed and verified
- [ ] Both fonts working correctly
- [ ] Take screenshot of current homepage for comparison

### Implementation Checklist

**Container & Layout**
- [ ] Replace `.home` with `flex min-h-screen flex-col items-center justify-between p-6 sm:p-11 max-w-4xl mx-auto`

**Content Section**
- [ ] Replace `.content` with `flex flex-col items-center justify-center flex-grow`
- [ ] Replace `.content h1` with `my-6 sm:my-10 text-3xl sm:text-4xl lg:text-5xl font-bold text-center`

**Links Section**
- [ ] Replace `.links` with `flex items-center gap-3`
- [ ] Replace `.admin` styles with `no-underline px-3 py-1.5 rounded bg-foreground text-background hover:bg-foreground/90 transition-colors`
- [ ] Replace `.docs` styles with `no-underline px-3 py-1.5 rounded bg-background text-foreground border border-border hover:bg-muted transition-colors`

**Footer Section**
- [ ] Replace `.footer` with `flex items-center gap-2 flex-col lg:flex-row mt-8`
- [ ] Replace `.footer p` with `m-0 text-muted-foreground`
- [ ] Replace `.codeLink` with `no-underline px-2 py-0.5 bg-muted rounded font-mono text-sm`

**Buttons Demo**
- [ ] Verify Button component section still works
- [ ] Ensure section has proper spacing classes

### Validation Commands

```bash
# Build to verify no errors
pnpm build

# Lint check
pnpm lint

# Type check
pnpm exec tsc --noEmit
```

### Visual Verification

- [ ] Homepage layout matches previous design
- [ ] Colors use design tokens correctly
- [ ] Responsive breakpoints work (resize browser)
- [ ] Hover states work on links
- [ ] Button variants display correctly
- [ ] No CSS class names from styles.css remain

### Files Changed

- [ ] `src/app/[locale]/(frontend)/page.tsx`

### Commit Command

```bash
git add src/app/[locale]/(frontend)/page.tsx
git commit -m "$(cat <<'EOF'
refactor(homepage): migrate from CSS to Tailwind utilities

- Replace .home, .content, .links classes with Tailwind utilities
- Apply design tokens (bg-background, text-foreground, etc.)
- Add responsive breakpoints (sm:, lg:)
- Maintain Button variants demo section
- Add hover states with transitions

EOF
)"
```

---

## Commit 5: Delete styles.css & Cleanup

### Description

Remove the legacy styles.css file and update the frontend layout.

### Pre-Commit Checks

- [ ] Commit 4 completed and verified
- [ ] Homepage renders correctly without styles.css
- [ ] All CSS classes migrated to Tailwind

### Implementation Checklist

**Delete styles.css**
- [ ] Delete `src/app/[locale]/(frontend)/styles.css`

**Update layout.tsx**
- [ ] Remove `import './styles.css'`
- [ ] Add `min-h-screen` class to `<main>` element
- [ ] Verify no other imports reference styles.css

**Final Verification**
- [ ] No files import styles.css
- [ ] No references to styles.css in codebase

### Validation Commands

```bash
# Verify file is deleted
ls src/app/[locale]/(frontend)/styles.css
# Should return: No such file or directory

# Build to verify no missing imports
pnpm build

# Full lint check
pnpm lint

# Type check
pnpm exec tsc --noEmit

# Check for dead code
pnpm knip
```

### Visual Verification

- [ ] Homepage renders correctly
- [ ] No console errors
- [ ] All styling intact
- [ ] Dev server works without errors

### Files Changed

- [ ] `src/app/[locale]/(frontend)/styles.css` (deleted)
- [ ] `src/app/[locale]/(frontend)/layout.tsx`

### Commit Command

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore(cleanup): delete legacy styles.css

- Remove src/app/[locale]/(frontend)/styles.css
- Remove import from frontend layout.tsx
- All styles now use Tailwind utilities
- Add min-h-screen to main element

BREAKING CHANGE: styles.css removed, use Tailwind classes instead

EOF
)"
```

---

## Post-Phase Checklist

After completing all 5 commits:

### Code Quality

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] `pnpm exec tsc --noEmit` passes
- [ ] No console errors in browser

### Visual Quality

- [ ] Background color is #1A1D23 (anthracite)
- [ ] Text color is #F7FAFC (off-white)
- [ ] Primary accent is #14B8A6 (teal)
- [ ] Nunito Sans loads for body text
- [ ] JetBrains Mono available for code
- [ ] Button variants display correctly
- [ ] Responsive design works

### Files Summary

| File | Status |
|------|--------|
| `src/app/globals.css` | Modified (CSS variables + fonts) |
| `src/app/[locale]/layout.tsx` | Modified (fonts configuration) |
| `src/app/[locale]/(frontend)/layout.tsx` | Modified (removed import) |
| `src/app/[locale]/(frontend)/page.tsx` | Modified (Tailwind migration) |
| `src/app/[locale]/(frontend)/styles.css` | Deleted |

### Git Log Verification

```bash
git log --oneline -5
# Should show 5 commits from this phase
```

Expected output:
```
abc1234 chore(cleanup): delete legacy styles.css
def5678 refactor(homepage): migrate from CSS to Tailwind utilities
ghi9012 feat(typography): add JetBrains Mono for code elements
jkl3456 feat(typography): configure Nunito Sans as primary font
mno7890 feat(design-system): add CSS variables for Anthracite & Vert Canard theme
```

---

## Troubleshooting Quick Reference

### CSS Variables Not Working

```bash
# Check if variables are defined
grep -r "--background" src/app/globals.css
# Should show HSL value without hsl() wrapper
```

### Fonts Not Loading

```bash
# Check font imports
grep -r "next/font/google" src/app/
# Should show Nunito_Sans and JetBrains_Mono imports
```

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next
pnpm build
```

### Missing Tailwind Classes

```bash
# Verify Tailwind is processing
pnpm dev
# Check browser devtools for compiled CSS
```

---

## Next Steps

1. Complete `validation/VALIDATION_CHECKLIST.md`
2. Update `EPIC_TRACKING.md` with phase completion
3. Create Pull Request for code review
4. Proceed to Phase 4 after merge
