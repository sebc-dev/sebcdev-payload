# Phase 3: Review Guide

**Phase**: E2E Test Maintenance & Documentation

---

## Review Checklist

### Test Modifications
- [ ] Tests still validate their intended purpose
- [ ] Skip conditions are appropriate
- [ ] No false positives introduced
- [ ] Code is clean and readable

### Documentation
- [ ] Markdown syntax correct
- [ ] Information is accurate
- [ ] Consistent with existing style
- [ ] No typos or errors

---

## Code Review Points

### Commit 1: Resilient Tests

```typescript
// ✅ GOOD - graceful skip with explanation
test('code elements use JetBrains Mono font', async ({ page }) => {
  await page.goto('/fr')
  const code = page.locator('code').first()
  const codeCount = await code.count()

  if (codeCount === 0) {
    test.skip(true, 'No code elements found on homepage')
    return
  }

  const fontFamily = await code.evaluate((el) =>
    window.getComputedStyle(el).fontFamily
  )
  expect(fontFamily.toLowerCase()).toContain('jetbrains')
})

// ❌ BAD - silent skip without explanation
test('code elements use JetBrains Mono font', async ({ page }) => {
  await page.goto('/fr')
  const code = page.locator('code').first()
  if (await code.count() === 0) return  // Silent skip - not clear why
  // ...
})

// ❌ BAD - hard assertion that can fail
test('code elements use JetBrains Mono font', async ({ page }) => {
  await page.goto('/fr')
  const code = page.locator('code').first()
  expect(await code.count()).toBeGreaterThan(0)  // Fails if no <code>
  // ...
})
```

### Commit 2: CI-CD-Security.md

```markdown
<!-- ✅ GOOD - consistent with existing format -->
## Layer 2b: Test Execution

### Unit Tests
- **Tool**: Vitest
- **Command**: `pnpm test:unit`
- **Purpose**: Validate isolated functions and utilities

### Integration Tests
- **Tool**: Vitest
- **Command**: `pnpm test:int`
- **Purpose**: Test Payload API interactions

<!-- ❌ BAD - inconsistent format -->
## Tests

We run unit tests and integration tests.

The commands are:
- unit: pnpm test:unit
- int: pnpm test:int
```

### Commit 3: CLAUDE.md

```markdown
<!-- ✅ GOOD - clear layer ordering -->
**Layers exécutés :**

1. **Supply Chain Security** : Socket.dev
2. **Code Quality** : ESLint, Prettier, Knip, Type Sync
3. **Unit & Integration Tests** : Vitest
4. **Build Validation** : Next.js Build
5. **E2E Tests** : Playwright
6. **Architecture** : dependency-cruiser
7. **Mutation Testing** : Stryker (optional)

<!-- ❌ BAD - no layer numbers, unclear order -->
The CI runs:
- ESLint
- Tests
- Build
- More tests
- Architecture checks
```

---

## Documentation Standards

### Markdown Guidelines
- Use ATX-style headers (`#`, `##`, `###`)
- Code blocks with language specifier
- Tables for structured data
- Consistent bullet point style

### Content Guidelines
- Be concise but complete
- Use examples where helpful
- Link to related documentation
- Keep formatting consistent with existing docs

---

## Testing the Changes

### Test Modifications
```bash
# Run the modified test file
pnpm exec playwright test tests/e2e/design-system.e2e.spec.ts

# Verify skip message appears when appropriate
pnpm exec playwright test tests/e2e/design-system.e2e.spec.ts --reporter=list
```

### Documentation
- Preview Markdown locally
- Check links work
- Verify code blocks render correctly

---

## Common Issues

### Issue: Test Still Fails

**Causes**:
- Skip condition not reached
- Other assertion failing
- Timing issue

**Solution**:
- Add logging to debug
- Check page state when test runs
- Verify skip condition is correct

### Issue: Documentation Out of Sync

**Causes**:
- Workflow changed after docs written
- Copy-paste errors

**Solution**:
- Cross-reference with actual workflow
- Run the documented commands to verify

---

## Approval Criteria

### Required
- [ ] Tests pass locally
- [ ] Tests pass in CI (when merged)
- [ ] Documentation accurate
- [ ] No regressions

### Quality
- [ ] Code is readable
- [ ] Documentation is clear
- [ ] Consistent with project style

---

**Review Guide Created**: 2025-12-05
