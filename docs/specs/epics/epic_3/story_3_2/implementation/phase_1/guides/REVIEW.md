# Code Review Guide - Phase 1: Tailwind CSS 4 Foundation

**Phase**: 1 of 4
**Purpose**: Guide for reviewing Phase 1 implementation

---

## Review Overview

This phase adds Tailwind CSS 4 to the project. Review focus areas:

1. **Dependencies**: Correct packages and versions
2. **Configuration**: PostCSS setup is minimal and correct
3. **CSS**: Global styles follow best practices
4. **Integration**: Layout properly imports CSS
5. **Build**: No regressions

---

## Commit-by-Commit Review

### Commit 1: Install Tailwind CSS 4

**Files to Review**:
- `package.json`
- `pnpm-lock.yaml`
- `postcss.config.mjs`

#### package.json Review

**Check dependencies added**:

```json
{
  "dependencies": {
    "tailwindcss": "^4.0.0"  // ✅ Should be 4.x
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0"  // ✅ Should match tailwindcss version
  }
}
```

**Review Checklist**:
- [ ] `tailwindcss` is in `dependencies` (not devDependencies)
- [ ] `@tailwindcss/postcss` is in `devDependencies`
- [ ] Versions are `^4.0.0` or later stable release
- [ ] No duplicate entries
- [ ] No unrelated changes

#### postcss.config.mjs Review

**Expected Content**:

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
```

**Review Checklist**:
- [ ] Uses ES modules (`export default`)
- [ ] Has JSDoc type annotation
- [ ] Only includes `@tailwindcss/postcss` plugin
- [ ] No autoprefixer (included in Tailwind v4)
- [ ] No cssnano (handled by Next.js)

**Common Issues to Flag**:
- ❌ Using `module.exports` instead of `export default`
- ❌ Including unnecessary plugins
- ❌ Wrong plugin name (`tailwindcss/postcss` vs `@tailwindcss/postcss`)

---

### Commit 2: Create globals.css

**Files to Review**:
- `src/app/globals.css`

#### globals.css Review

**Expected Structure**:

```css
/* Comment header explaining purpose */

@import "tailwindcss";  /* ✅ CSS-first import for v4 */

@layer base {
  /* Base styles */
}
```

**Review Checklist**:
- [ ] Uses `@import "tailwindcss"` (v4 syntax)
- [ ] NOT using old `@tailwind` directives
- [ ] Has descriptive comment header
- [ ] Base layer customizations are minimal
- [ ] Focus styles include `:focus-visible`
- [ ] No color definitions (Phase 3)
- [ ] No font definitions (Phase 3)

**Accessibility Check**:
- [ ] `:focus-visible` has visible outline
- [ ] Outline offset provides spacing
- [ ] No `outline: none` without alternative

**Common Issues to Flag**:
- ❌ Using `@tailwind base; @tailwind components; @tailwind utilities;` (v3 syntax)
- ❌ Adding custom colors or fonts (Phase 3)
- ❌ Removing focus indicators
- ❌ Overly complex base styles

---

### Commit 3: Integrate in Layout

**Files to Review**:
- `src/app/[locale]/layout.tsx`

#### layout.tsx Review

**Expected Change**:

```typescript
import '@/app/globals.css'  // ✅ First import
import { NextIntlClientProvider } from 'next-intl'
// ... rest unchanged
```

**Review Checklist**:
- [ ] Import is at the top of file
- [ ] Uses `@/app/globals.css` path alias
- [ ] No other changes to the file
- [ ] Existing functionality preserved

**Common Issues to Flag**:
- ❌ Import not at top
- ❌ Relative path instead of alias
- ❌ Unrelated changes in this commit

---

## Functional Review

### Build Verification

```bash
# Reviewer should run:
pnpm build

# Expected: Build succeeds without warnings
```

**Check for**:
- [ ] No CSS compilation errors
- [ ] No PostCSS warnings
- [ ] Build time reasonable (~similar to before)

### Runtime Verification

```bash
# Start dev server
pnpm dev
```

**Check for**:
- [ ] Server starts without errors
- [ ] No console errors in browser
- [ ] Page renders at `/fr` and `/en`

### Tailwind Functionality

Add temporary test to verify (or ask implementer to demo):

```tsx
<div className="bg-blue-500 text-white p-4 rounded">
  Test
</div>
```

**Check for**:
- [ ] Blue background appears
- [ ] White text visible
- [ ] Padding and rounded corners applied

---

## Non-Regression Checks

### Admin Panel

Navigate to `http://localhost:3000/admin`:

- [ ] Admin login page loads
- [ ] Admin dashboard works (if logged in)
- [ ] No visual changes to admin UI
- [ ] No console errors

### Existing Pages

Navigate to `http://localhost:3000/fr`:

- [ ] Page loads correctly
- [ ] i18n still working
- [ ] No visual regressions (except Tailwind reset)

---

## Code Quality

### TypeScript

```bash
# Run type check
pnpm exec tsc --noEmit
```

- [ ] No type errors

### Linting

```bash
# Run linter
pnpm lint
```

- [ ] No linting errors
- [ ] No new warnings

### Dead Code

```bash
# Check for unused code
pnpm knip
```

- [ ] No new unused exports
- [ ] No unused dependencies

---

## Security Review

### Dependencies

- [ ] `tailwindcss` is from official npm package
- [ ] `@tailwindcss/postcss` is from official Tailwind org
- [ ] No typosquatting concerns

### No Sensitive Data

- [ ] No credentials in committed files
- [ ] No environment variables exposed

---

## Performance Considerations

### Bundle Size

- [ ] CSS bundle size is reasonable
- [ ] No unnecessary CSS included

### Build Time

- [ ] Build time not significantly increased
- [ ] PostCSS processing is efficient

---

## Review Decision Matrix

| Criteria | Pass | Needs Work |
|----------|------|------------|
| Dependencies correct | ⬜ | ⬜ |
| PostCSS config minimal | ⬜ | ⬜ |
| globals.css follows v4 syntax | ⬜ | ⬜ |
| Layout import correct | ⬜ | ⬜ |
| Build succeeds | ⬜ | ⬜ |
| No admin regression | ⬜ | ⬜ |
| Tailwind classes work | ⬜ | ⬜ |
| Code quality passes | ⬜ | ⬜ |

---

## Approval Criteria

**Approve if**:
- All checklist items pass
- Build succeeds
- No regressions
- Code follows conventions

**Request changes if**:
- Build fails
- Wrong Tailwind syntax (v3 instead of v4)
- Missing or incorrect dependencies
- Unrelated changes included

**Discuss if**:
- Alternative approaches considered
- Performance concerns
- Future compatibility questions

---

## Review Comments Templates

### Approval Comment

```
LGTM! ✅

Phase 1 implementation looks good:
- Tailwind CSS 4 correctly installed
- PostCSS config is minimal and correct
- globals.css uses v4 CSS-first syntax
- Layout integration is clean
- Build verified, no regressions

Ready for Phase 2.
```

### Request Changes Comment

```
Changes requested:

1. [File]: [Issue]
   - Expected: [what should be]
   - Found: [what was found]
   - Fix: [how to fix]

Please address and re-request review.
```

---

## Post-Review Actions

After approval:

1. Merge/squash commits if needed
2. Update EPIC_TRACKING.md
3. Proceed to Phase 2 documentation review
