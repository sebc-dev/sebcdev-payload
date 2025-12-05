# Phase 3: Code Review Guide - Polish & Tests

**Story**: 3.5 - Homepage Implementation
**Phase**: 3 of 3

---

## Review Focus

Cette phase finalise l'implementation avec des optimisations et tests. La review doit verifier:

1. **Performance**: Animations GPU-accelerated, images optimisees
2. **Accessibility**: prefers-reduced-motion, focus visible
3. **Test Quality**: Couverture adequate, tests fiables

---

## Review by Commit

### Commit 1: Image Optimization

#### Custom Loader Review

```typescript
// GOOD: Handle different URL types
if (src.startsWith('http://') || src.startsWith('https://')) {
  // External URL handling
}
return `${src}?w=${width}&q=${quality || 75}` // Local fallback

// BAD: Only handle external URLs
if (src.startsWith('http')) {
  return src
}
// No fallback for local URLs
```

#### Next.js Config Review

```typescript
// GOOD: Specific remote patterns
remotePatterns: [
  { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
  { protocol: 'https', hostname: '*.r2.dev' },
]

// BAD: Too permissive
remotePatterns: [
  { protocol: 'https', hostname: '*' }, // Allows all domains
]
```

#### Checklist
- [ ] Loader handles external URLs
- [ ] Loader handles local URLs
- [ ] Remote patterns are specific
- [ ] No security risks in patterns
- [ ] Build passes with new config

---

### Commit 2: Hover Animations

#### Performance Review

```typescript
// GOOD: GPU-accelerated transforms
'transform-gpu transition-all duration-200 ease-out'

// BAD: Properties that trigger layout
'transition-all width-auto' // width triggers layout recalc
```

```typescript
// GOOD: Motion-safe prefix
'motion-safe:hover:scale-[1.02]'

// BAD: No reduced-motion support
'hover:scale-[1.02]'
```

#### Timing Review

| Component | Duration | Acceptable Range |
|-----------|----------|------------------|
| ArticleCard | 200ms | 150-250ms |
| FeaturedArticleCard | 300ms | 250-350ms |

```typescript
// GOOD: Consistent easing
'ease-out' // Smooth deceleration

// AVOID: Inconsistent or harsh easing
'ease-in' // Feels slow to start
'linear' // Feels mechanical
```

#### Checklist
- [ ] `transform-gpu` present
- [ ] `motion-safe:` prefix used
- [ ] Timing is appropriate
- [ ] Easing is consistent
- [ ] No layout-triggering properties

---

### Commit 3: E2E Tests

#### Test Quality Review

```typescript
// GOOD: Handles both states (with/without data)
const h1 = page.locator('h1')
if (await h1.count() > 0) {
  await expect(h1).toBeVisible()
}

// BAD: Assumes data always exists
await expect(page.locator('h1')).toBeVisible() // Fails if empty
```

```typescript
// GOOD: Specific selectors
page.getByRole('link', { name: /Lire l'article/i })
page.getByRole('heading', { name: /Articles récents/i })

// BAD: Brittle selectors
page.locator('.article-card') // Class names can change
page.locator('div:nth-child(2)') // Position-dependent
```

```typescript
// GOOD: Localized assertions
test('FR homepage', async ({ page }) => {
  await page.goto('/fr')
  await expect(page).toHaveTitle(/Accueil/)
})

test('EN homepage', async ({ page }) => {
  await page.goto('/en')
  await expect(page).toHaveTitle(/Home/)
})

// BAD: Hardcoded language
await expect(page).toHaveTitle('Accueil') // Exact match fragile
```

#### Responsive Tests Review

```typescript
// GOOD: Standard viewport sizes
{ width: 375, height: 667 }  // iPhone SE
{ width: 768, height: 1024 } // iPad
{ width: 1280, height: 800 } // Desktop

// BAD: Non-standard sizes that might hide issues
{ width: 400, height: 700 } // Between breakpoints
```

#### Checklist
- [ ] Tests handle empty state
- [ ] Tests handle populated state
- [ ] Selectors use role/name (accessible)
- [ ] Viewport sizes are standard
- [ ] Tests are language-aware
- [ ] No flaky assertions

---

### Commit 4: Accessibility Tests

#### axe-core Review

```typescript
// GOOD: Filter critical/serious only
const violations = results.violations.filter(
  (v) => v.impact === 'critical' || v.impact === 'serious'
)
expect(violations).toHaveLength(0)

// BAD: Fail on any violation (too strict for initial)
expect(results.violations).toHaveLength(0)
```

```typescript
// GOOD: Specific WCAG tags
.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])

// BAD: All rules (includes best practices)
// May fail on non-critical issues
```

#### Focus Indicator Test Review

```typescript
// GOOD: Check for outline OR box-shadow
const hasFocusIndicator =
  (styles.outline && styles.outline !== 'none') ||
  (styles.boxShadow && styles.boxShadow !== 'none')

// BAD: Only check outline
expect(styles.outline).not.toBe('none')
// Misses box-shadow focus rings (common in Tailwind)
```

#### Checklist
- [ ] WCAG tags are appropriate (AA level)
- [ ] Critical/serious violations only
- [ ] Focus tests are comprehensive
- [ ] Heading hierarchy checked
- [ ] Alt text verified

---

## Common Review Issues

### False Positives in a11y Tests

```typescript
// Issue: Decorative images flagged
<img src="/icon.svg" alt="" role="presentation" />

// Solution: Ensure role="presentation" or aria-hidden="true"
```

### Flaky Tests

```typescript
// Issue: Race condition
await page.click('button')
await expect(page).toHaveURL('/articles') // Might fail

// Solution: Wait for navigation
await page.click('button')
await page.waitForURL('/articles')
await expect(page).toHaveURL('/articles')
```

### Animation Test Issues

```typescript
// Issue: Animation not complete when checking
await page.hover('.card')
// Transform might still be animating

// Solution: Wait for animation
await page.hover('.card')
await page.waitForTimeout(300) // Animation duration
```

---

## Performance Review Criteria

### Animation Performance

Run Lighthouse or DevTools Performance:
- [ ] Animations run at 60fps
- [ ] No main thread blocking during hover
- [ ] No layout shifts (CLS = 0)

### Image Performance

- [ ] Images load with appropriate size
- [ ] No oversized images downloaded
- [ ] Priority flag on hero image

---

## Approval Criteria

### Must Have
- [ ] All tests pass
- [ ] No critical a11y violations
- [ ] Build passes
- [ ] Animations respect reduced-motion

### Should Have
- [ ] 90%+ test coverage of functionality
- [ ] Lighthouse Accessibility > 95

### Nice to Have
- [ ] Performance score > 90
- [ ] No moderate a11y violations
