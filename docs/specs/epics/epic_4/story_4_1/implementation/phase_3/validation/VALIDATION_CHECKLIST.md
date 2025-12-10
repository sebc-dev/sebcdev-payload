# Phase 3 - Final Validation Checklist

Complete this checklist after implementing all commits to validate Phase 3 is complete.

---

## Pre-Validation

### All Commits Complete

- [ ] Commit 1: Shiki Configuration - MERGED
- [ ] Commit 2: CodeBlock Component - MERGED
- [ ] Commit 3: InlineCode Component - MERGED
- [ ] Commit 4: CopyButton Component - MERGED
- [ ] Commit 5: Integration & Tests - MERGED

### Clean State

```bash
# Verify no uncommitted changes
git status
```

- [ ] Working directory clean
- [ ] All changes committed
- [ ] Branch up to date

---

## Automated Validation

### Run All Checks

```bash
# Full validation suite
pnpm exec tsc --noEmit && pnpm lint && pnpm test:unit && pnpm build
```

- [ ] TypeScript compiles without errors
- [ ] Lint passes without warnings
- [ ] All unit tests pass
- [ ] Build succeeds

### Individual Checks

```bash
# TypeScript
pnpm exec tsc --noEmit
```
- [ ] No type errors

```bash
# Lint
pnpm lint
```
- [ ] No lint errors
- [ ] No lint warnings (or documented exceptions)

```bash
# Unit Tests
pnpm test:unit
```
- [ ] All tests pass
- [ ] No skipped tests
- [ ] Coverage meets target (80%+)

```bash
# Build
pnpm build
```
- [ ] Build completes successfully
- [ ] No build warnings

---

## Bundle Size Validation

### Check Impact

```bash
# Build and check output size
pnpm build

# Check for large chunks
ls -la .next/static/chunks/ | head -20
```

- [ ] Total bundle size increase < 200KB
- [ ] No unexpectedly large chunks
- [ ] Shiki web bundle used (not full)

### Verify Shiki Bundle

```bash
# Check what's imported
grep -r "from 'shiki'" src/
```

- [ ] All imports use `shiki/bundle/web`
- [ ] No direct `shiki` imports (would pull full bundle)

---

## Functional Validation

### Code Block Rendering

Test with development server:

```bash
pnpm dev
# Navigate to article with code blocks
```

- [ ] Code blocks render (not JSON)
- [ ] Syntax highlighting visible
- [ ] Language indicator shows correct language
- [ ] Border and rounded corners match Design System
- [ ] Horizontal scroll works for long lines

### Language Support

Test each supported language:

| Language | Renders | Highlighted |
|----------|---------|-------------|
| JavaScript | [ ] | [ ] |
| TypeScript | [ ] | [ ] |
| TSX/JSX | [ ] | [ ] |
| JSON | [ ] | [ ] |
| HTML | [ ] | [ ] |
| CSS | [ ] | [ ] |
| Bash/Shell | [ ] | [ ] |
| Python | [ ] | [ ] |
| Go | [ ] | [ ] |
| Rust | [ ] | [ ] |
| SQL | [ ] | [ ] |
| YAML | [ ] | [ ] |

### Unknown Languages

- [ ] Unknown language defaults to plain text
- [ ] No errors in console
- [ ] No visual breakage

### Inline Code

- [ ] Inline code (`backticks`) styled correctly
- [ ] Consistent with code block theme
- [ ] Doesn't break text flow

### Copy Button

- [ ] Button hidden by default
- [ ] Button appears on hover
- [ ] Click triggers copy
- [ ] Visual feedback (icon changes to check)
- [ ] State resets after ~2 seconds
- [ ] Copied text is complete (all lines)

---

## Visual Validation

### Design System Consistency

| Element | Expected | Actual |
|---------|----------|--------|
| Code font | JetBrains Mono | [ ] |
| Background | Dark (github-dark) | [ ] |
| Border | `border-border` | [ ] |
| Rounded corners | `rounded-lg` | [ ] |
| Language indicator | Muted foreground | [ ] |
| Header background | `bg-muted/50` | [ ] |

### Theme Verification

```bash
# Check theme in config
grep "CODE_THEME" src/components/richtext/shiki-config.ts
```

- [ ] Theme is `github-dark` (or similar dark theme)
- [ ] Theme matches overall site dark mode

### Responsive Design

| Viewport | Works |
|----------|-------|
| Mobile (375px) | [ ] |
| Tablet (768px) | [ ] |
| Desktop (1280px) | [ ] |

- [ ] Code doesn't overflow viewport
- [ ] Horizontal scroll accessible on mobile
- [ ] Copy button usable on touch devices

---

## Accessibility Validation

### Screen Reader

- [ ] Code content readable
- [ ] Language announced
- [ ] Copy button has aria-label

### Keyboard Navigation

- [ ] Copy button focusable
- [ ] Focus visible indicator
- [ ] Button activatable with Enter/Space

### Color Contrast

- [ ] Code text readable on dark background
- [ ] Language indicator readable
- [ ] Copy button icon visible

---

## Performance Validation

### Build Time

```bash
time pnpm build
```

- [ ] Build time reasonable (< 2 minutes)
- [ ] No build-time errors

### Runtime Performance

- [ ] Code blocks render quickly
- [ ] No visible flash/FOUC
- [ ] Scrolling is smooth
- [ ] No memory leaks (copy button)

### Lighthouse (Optional)

```bash
# Run in production mode
pnpm build && pnpm start
# Run Lighthouse audit
```

- [ ] Performance score maintained
- [ ] No significant regression

---

## Edge Runtime Validation

### Cloudflare Compatibility

```bash
# Preview on Cloudflare (if available)
pnpm preview
```

- [ ] No runtime errors
- [ ] Code blocks render correctly
- [ ] Copy works in preview

### WASM Loading

- [ ] Shiki WASM loads correctly
- [ ] No "cannot find module" errors
- [ ] Works without Node.js APIs

---

## Documentation Validation

### Files Complete

- [ ] INDEX.md complete and accurate
- [ ] IMPLEMENTATION_PLAN.md complete
- [ ] COMMIT_CHECKLIST.md complete
- [ ] ENVIRONMENT_SETUP.md complete
- [ ] guides/REVIEW.md complete
- [ ] guides/TESTING.md complete
- [ ] validation/VALIDATION_CHECKLIST.md complete

### Links Work

- [ ] All internal links resolve
- [ ] No broken links in docs

### Update PHASES_PLAN.md

```bash
# Update status in PHASES_PLAN.md
```

Change:
```markdown
- [ ] Phase 3: Code Highlighting - Status: 📋 PENDING
```

To:
```markdown
- [x] Phase 3: Code Highlighting - Status: ✅ COMPLETED
```

- [ ] PHASES_PLAN.md updated

---

## Final Checklist

### Must Pass (Blocking)

- [ ] TypeScript compiles
- [ ] All unit tests pass
- [ ] Build succeeds
- [ ] Code blocks render with highlighting
- [ ] Copy button works
- [ ] No console errors
- [ ] Design System consistent

### Should Pass (Non-Blocking)

- [ ] Coverage > 80%
- [ ] Bundle size < 200KB added
- [ ] Visual tests pass
- [ ] Accessibility basics met

### Nice to Have

- [ ] Lighthouse audit passed
- [ ] Performance benchmarks met
- [ ] Edge preview tested

---

## Sign-Off

### Phase Complete

**Date**: ____________

**Implementer**: ____________

**Reviewer**: ____________

### Notes

[Add any notes about issues encountered, decisions made, or follow-up tasks]

### Next Phase

- [ ] Proceed to Phase 4: Image Rendering & Advanced Styling
- [ ] Or skip to Phase 5: SEO & E2E Tests

---

## Validation Commands Summary

```bash
# Quick validation
pnpm exec tsc --noEmit && pnpm lint && pnpm test:unit

# Full validation
pnpm exec tsc --noEmit && pnpm lint && pnpm test:unit && pnpm build

# Visual validation
pnpm dev
# Open http://localhost:3000/articles/[test-article]

# Edge preview (if available)
pnpm preview
```

---

**Validation Checklist Generated**: 2025-12-10
