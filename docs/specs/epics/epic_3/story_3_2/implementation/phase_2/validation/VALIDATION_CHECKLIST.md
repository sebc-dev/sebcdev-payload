# Phase 2: Validation Checklist

**Phase**: shadcn/ui & Utility Functions
**Story**: 3.2 - Integration Design System (Dark Mode)

---

## Validation Overview

This checklist ensures Phase 2 is fully complete and ready for Phase 3. Complete all sections before marking the phase as done.

---

## 1. Pre-Validation Requirements

### All Commits Completed

- [ ] Commit 1: Install utility dependencies
- [ ] Commit 2: Create cn() utility function
- [ ] Commit 3: Initialize shadcn/ui configuration
- [ ] Commit 4: Add Button component and integrate

### Git State

```bash
# Verify commits
git log --oneline -4

# Expected (4 commits, newest first):
# abc1234 feat(ui): add Button component from shadcn/ui
# def5678 chore(shadcn): add components.json configuration
# ghi9012 feat(lib): add cn() utility function
# jkl3456 chore(deps): add shadcn/ui utility dependencies
```

- [ ] 4 commits present
- [ ] Working directory clean (`git status`)
- [ ] No uncommitted changes

---

## 2. Technical Validation

### 2.1 Build Verification

```bash
pnpm build
```

- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] No compilation warnings
- [ ] Exit code is 0

### 2.2 Lint Verification

```bash
pnpm lint
```

- [ ] Lint passes
- [ ] No ESLint errors
- [ ] No ESLint warnings
- [ ] Exit code is 0

### 2.3 Type Check Verification

```bash
pnpm exec tsc --noEmit
```

- [ ] Type check passes
- [ ] No type errors
- [ ] Exit code is 0

### 2.4 Dead Code Check

```bash
pnpm knip
```

- [ ] No unused exports
- [ ] No unused dependencies
- [ ] No unused files

---

## 3. Dependency Validation

### 3.1 Dependencies Installed

```bash
pnpm list clsx tailwind-merge class-variance-authority @radix-ui/react-slot
```

| Package | Installed | Version OK |
|---------|-----------|------------|
| `clsx` | [ ] | [ ] ^2.x |
| `tailwind-merge` | [ ] | [ ] ^2.x |
| `class-variance-authority` | [ ] | [ ] ^0.7.x |
| `@radix-ui/react-slot` | [ ] | [ ] latest |

### 3.2 No Vulnerabilities

```bash
pnpm audit
```

- [ ] No critical vulnerabilities
- [ ] No high vulnerabilities
- [ ] Or all vulnerabilities documented and accepted

---

## 4. File Structure Validation

### 4.1 Files Created

| File | Exists | Content OK |
|------|--------|------------|
| `components.json` | [ ] | [ ] |
| `src/lib/utils.ts` | [ ] | [ ] |
| `src/components/ui/button.tsx` | [ ] | [ ] |

### 4.2 Files Modified

| File | Modified | Changes OK |
|------|----------|------------|
| `package.json` | [ ] | [ ] |
| `src/app/[locale]/(frontend)/page.tsx` | [ ] | [ ] |

### 4.3 Directory Structure

```bash
ls -la src/components/ui/
ls -la src/lib/
```

- [ ] `src/components/ui/` directory exists
- [ ] `src/lib/utils.ts` exists
- [ ] No unexpected files

---

## 5. Configuration Validation

### 5.1 components.json

```bash
cat components.json
```

Verify each setting:

| Setting | Expected Value | Correct |
|---------|----------------|---------|
| `style` | `"new-york"` | [ ] |
| `rsc` | `true` | [ ] |
| `tsx` | `true` | [ ] |
| `tailwind.css` | `"src/app/globals.css"` | [ ] |
| `tailwind.baseColor` | `"slate"` | [ ] |
| `tailwind.cssVariables` | `true` | [ ] |
| `aliases.components` | `"@/components"` | [ ] |
| `aliases.utils` | `"@/lib/utils"` | [ ] |
| `aliases.ui` | `"@/components/ui"` | [ ] |
| `iconLibrary` | `"lucide"` | [ ] |

### 5.2 Path Alias Verification

```bash
# Test that imports work
pnpm exec tsc --noEmit
```

- [ ] `@/lib/utils` resolves correctly
- [ ] `@/components/ui/button` resolves correctly

---

## 6. Functional Validation

### 6.1 cn() Utility Function

Test in Node REPL or create a simple test:

```typescript
import { cn } from '@/lib/utils'

// Test 1: Basic merge
console.log(cn('foo', 'bar')) // Expected: 'foo bar'

// Test 2: Conditional
console.log(cn('foo', true && 'bar')) // Expected: 'foo bar'

// Test 3: Tailwind merge
console.log(cn('px-2', 'px-4')) // Expected: 'px-4'
```

- [ ] Basic merge works
- [ ] Conditional classes work
- [ ] Tailwind class merging works
- [ ] No runtime errors

### 6.2 Button Component

Start dev server and verify:

```bash
pnpm dev
# Open http://localhost:3000/fr
```

| Variant | Renders | Hover | Focus |
|---------|---------|-------|-------|
| Default | [ ] | [ ] | [ ] |
| Secondary | [ ] | [ ] | [ ] |
| Outline | [ ] | [ ] | [ ] |
| Ghost | [ ] | [ ] | [ ] |
| Destructive | [ ] | [ ] | [ ] |
| Link | [ ] | [ ] | [ ] |

| Size | Renders | Correct Height |
|------|---------|----------------|
| Small (sm) | [ ] | [ ] h-8 |
| Default | [ ] | [ ] h-9 |
| Large (lg) | [ ] | [ ] h-10 |
| Icon | [ ] | [ ] h-9 w-9 |

### 6.3 Button Props

- [ ] `className` prop works (custom classes apply)
- [ ] `disabled` prop works (button is disabled)
- [ ] `onClick` prop works (handler fires)
- [ ] `type` prop works (form submission)
- [ ] `asChild` prop works (renders as child element)

---

## 7. Visual Validation

### 7.1 Browser Testing

Test in at least one browser:

| Browser | Buttons Render | Styles Correct |
|---------|----------------|----------------|
| Chrome | [ ] | [ ] |
| Firefox | [ ] (optional) | [ ] |
| Safari | [ ] (optional) | [ ] |

### 7.2 Visual Inspection

- [ ] Buttons are visually distinct by variant
- [ ] Sizes are clearly different
- [ ] Colors match expected design (will be refined in Phase 3)
- [ ] No layout shifts
- [ ] No clipping or overflow issues

### 7.3 Screenshot Evidence

Take screenshots for documentation:

- [ ] All variants displayed
- [ ] All sizes displayed
- [ ] Hover state
- [ ] Focus state

---

## 8. Accessibility Validation

### 8.1 Keyboard Navigation

```
1. Open http://localhost:3000/fr
2. Press Tab to navigate
3. Verify buttons receive focus
4. Press Enter/Space to activate
```

- [ ] All buttons are focusable via Tab
- [ ] Focus ring is visible
- [ ] Enter key activates button
- [ ] Space key activates button
- [ ] Disabled buttons are skipped

### 8.2 Screen Reader Testing

(Optional but recommended)

- [ ] Buttons announced correctly
- [ ] Variant not announced (visual only)
- [ ] Button text is clear

### 8.3 Automated Accessibility

```bash
pnpm test:e2e -- -g "accessibility"
```

- [ ] axe-core audit passes
- [ ] No WCAG violations related to buttons

---

## 9. Performance Validation

### 9.1 Bundle Size

After build:

```bash
pnpm build
ls -lh .next/static/chunks/*.js
```

- [ ] No unexpectedly large chunks
- [ ] Total added size < 15KB gzipped

### 9.2 Runtime Performance

- [ ] No console warnings about performance
- [ ] No hydration mismatches
- [ ] Buttons respond immediately to interaction

---

## 10. Test Validation

### 10.1 Unit Tests

```bash
pnpm test:unit
```

- [ ] cn() tests pass
- [ ] Button tests pass (if written)
- [ ] No failing tests

### 10.2 E2E Tests

```bash
pnpm test:e2e
```

- [ ] Existing E2E tests still pass
- [ ] No regressions

---

## 11. Documentation Validation

### 11.1 Phase Documentation Complete

| Document | Created | Reviewed |
|----------|---------|----------|
| INDEX.md | [ ] | [ ] |
| IMPLEMENTATION_PLAN.md | [ ] | [ ] |
| COMMIT_CHECKLIST.md | [ ] | [ ] |
| ENVIRONMENT_SETUP.md | [ ] | [ ] |
| guides/REVIEW.md | [ ] | [ ] |
| guides/TESTING.md | [ ] | [ ] |
| validation/VALIDATION_CHECKLIST.md | [ ] | [ ] |

### 11.2 Code Comments

- [ ] `cn()` function has JSDoc
- [ ] Button component has displayName
- [ ] No placeholder comments remain

---

## 12. Integration Validation

### 12.1 No Admin Panel Regression

```bash
pnpm dev
# Open http://localhost:3000/admin
```

- [ ] Admin panel loads
- [ ] Admin styles not affected
- [ ] No console errors in admin

### 12.2 No i18n Regression

```bash
# Test both locales
curl -I http://localhost:3000/fr
curl -I http://localhost:3000/en
```

- [ ] French locale works
- [ ] English locale works
- [ ] No 404 errors

---

## 13. Cleanup Validation

### 13.1 No Debug Code

- [ ] No `console.log` statements
- [ ] No `debugger` statements
- [ ] No commented-out code

### 13.2 No Temporary Files

- [ ] No `.bak` files
- [ ] No `.tmp` files
- [ ] No test files in wrong location

---

## 14. Sign-Off

### Validation Complete

| Validator | Date | Signature |
|-----------|------|-----------|
| Developer | | |
| Reviewer | | (optional) |

### Summary

| Category | Status |
|----------|--------|
| Technical | [ ] Pass |
| Functional | [ ] Pass |
| Visual | [ ] Pass |
| Accessibility | [ ] Pass |
| Performance | [ ] Pass |
| Tests | [ ] Pass |
| Documentation | [ ] Pass |

### Final Checklist

- [ ] All validation sections complete
- [ ] All checkboxes checked
- [ ] Phase 2 is ready for merge
- [ ] Ready to proceed to Phase 3

---

## Post-Validation Actions

### 1. Update EPIC_TRACKING.md

Update the tracking document with:

```markdown
- [x] Phase 2: shadcn/ui Setup - Completed YYYY-MM-DD
```

### 2. Create PR (if using PRs)

```bash
gh pr create --title "feat(design-system): Phase 2 - shadcn/ui & Utility Functions" --body "..."
```

### 3. Merge to Main

```bash
# After PR approval
git checkout main
git pull origin main
git merge epic-3-story-3-2-phase2
git push origin main
```

### 4. Generate Phase 3 Documentation

```
/generate-phase-doc Epic 3 Story 3.2 Phase 3
```

---

## Troubleshooting Failed Validation

### Build Fails

1. Check TypeScript errors: `pnpm exec tsc --noEmit`
2. Check for missing imports
3. Verify path aliases in tsconfig.json

### Buttons Don't Render

1. Check if Button is imported correctly
2. Check if globals.css has Tailwind imports
3. Check console for errors

### Focus Ring Not Visible

1. CSS variables for `ring` may not be defined
2. Will be addressed in Phase 3 with design tokens
3. Acceptable for now

### Tests Fail

1. Check test setup configuration
2. Verify path aliases work in test environment
3. Check for React 19 compatibility issues

---

**Validation Checklist Status**: READY FOR USE
**Created**: 2025-12-02
**Last Updated**: 2025-12-02
