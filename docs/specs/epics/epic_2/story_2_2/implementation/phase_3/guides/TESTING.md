# Phase 3 - Testing Guide

Complete E2E testing strategy for Phase 3 (Admin Media Upload E2E).

---

## 🎯 Testing Strategy

Phase 3 focuses exclusively on **End-to-End (E2E) testing** using Playwright to validate the admin media workflow from a user's perspective.

**Test Layers**:
1. **E2E Tests** (Phase 3): Full user workflows in browser
2. **Integration Tests** (Phase 2): Already complete, R2 operations validated
3. **Unit Tests** (N/A): Not applicable for this phase

**Target Coverage**: All critical admin media paths (upload, view, edit, delete)

**Estimated Test Count**: 5-7 E2E tests

---

## 🎭 E2E Tests with Playwright

### Purpose

Test complete user workflows in a real browser environment:
- Admin authentication
- Media upload via form
- Media gallery navigation
- Media edit/delete operations
- Error handling and accessibility

### Running E2E Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e tests/e2e/admin-media.e2e.spec.ts

# Run in headed mode (see browser)
pnpm test:e2e --headed

# Run in debug mode (interactive)
pnpm test:e2e --debug

# Run with specific browser
pnpm test:e2e --project=chromium

# Generate test report
pnpm test:e2e --reporter=html
```

### Expected Results

```
Running 7 tests using 1 worker

  ✓ Admin Media Upload E2E
    ✓ should upload image via admin form (5s)
    ✓ should display uploaded image in gallery (3s)
    ✓ should edit media metadata (4s)
    ✓ should delete media (3s)
    ✓ should handle upload errors gracefully (2s)
    ✓ should be accessible (WCAG 2.1 AA) (3s)
    ✓ should support keyboard navigation (2s)

  7 passed (22s)
```

**Coverage Goal**: All critical admin media paths tested

### Test Files Structure

```
tests/
├── e2e/
│   └── admin-media.e2e.spec.ts      # Admin media workflow E2E tests
├── fixtures/
│   ├── test-image.png               # Valid PNG for testing
│   └── test-image-large.png         # Large file for size tests
└── helpers/
    └── auth.helpers.ts              # Authentication helpers (if needed)
```

---

## 📝 Writing E2E Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Admin Media Upload E2E', () => {
  // Setup before each test
  test.beforeEach(async ({ page }) => {
    // Navigate to admin login
    await page.goto('/admin')

    // Authenticate (replace with actual auth flow)
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password')
    await page.click('[type="submit"]')

    // Wait for dashboard
    await page.waitForSelector('[data-testid="dashboard"]')

    // Navigate to media collection
    await page.goto('/admin/collections/media')
  })

  test('should upload image via admin form', async ({ page }) => {
    // Click "Create New" button
    await page.click('[href="/admin/collections/media/create"]')

    // Wait for form to load
    await page.waitForSelector('form')

    // Upload file
    const fileInput = await page.locator('input[type="file"]')
    await fileInput.setInputFiles('tests/fixtures/test-image.png')

    // Fill optional fields
    await page.fill('[name="alt"]', 'Test image description')

    // Submit form
    await page.click('[type="submit"]')

    // Wait for success message
    await page.waitForSelector('[data-testid="success-message"]')

    // Verify redirect to media list
    await expect(page).toHaveURL(/\/admin\/collections\/media$/)

    // Verify image appears in gallery
    const mediaItem = await page.locator('[data-testid="media-item"]').first()
    await expect(mediaItem).toBeVisible()
  })

  test('should be accessible (WCAG 2.1 AA)', async ({ page }) => {
    // Navigate to upload form
    await page.goto('/admin/collections/media/create')

    // Run accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    // Assert no violations
    expect(accessibilityScanResults.violations).toEqual([])
  })
})
```

### Playwright Best Practices

#### 1. Use Proper Wait Strategies

❌ **Bad**: Arbitrary timeouts
```typescript
await page.waitForTimeout(2000) // Flaky!
```

✅ **Good**: Wait for specific elements or states
```typescript
// Wait for element to be visible
await page.waitForSelector('[data-testid="upload-success"]')

// Wait for navigation
await page.waitForURL(/\/admin\/collections\/media$/)

// Wait for network request
await page.waitForResponse(response =>
  response.url().includes('/api/media') && response.status() === 200
)
```

#### 2. Use Stable Locators

❌ **Bad**: Brittle CSS selectors
```typescript
await page.click('.btn.btn-primary.upload-btn') // Breaks if classes change
```

✅ **Good**: Semantic or data-testid selectors
```typescript
// data-testid attribute (best)
await page.click('[data-testid="upload-button"]')

// Role-based (good)
await page.click('button[type="submit"]')

// Text-based (acceptable)
await page.click('text=Upload File')
```

#### 3. Use Playwright Assertions

❌ **Bad**: Manual assertions
```typescript
const isVisible = await page.locator('[data-testid="item"]').isVisible()
expect(isVisible).toBe(true) // No auto-retry
```

✅ **Good**: Playwright assertions (auto-retry)
```typescript
await expect(page.locator('[data-testid="item"]')).toBeVisible()
```

#### 4. Ensure Test Isolation

✅ **Good**: Clean state for each test
```typescript
test.beforeEach(async ({ page }) => {
  // Reset to known state
  await page.goto('/admin')
  await authenticateUser(page)
})

test.afterEach(async ({ page }) => {
  // Clean up test data (if needed)
  await deleteTestMedia(page)
})
```

#### 5. Handle Asynchronous Operations

✅ **Good**: Wait for upload completion
```typescript
// Start upload
await page.setInputFiles('input[type="file"]', 'test-image.png')

// Wait for progress indicator to disappear
await page.waitForSelector('[data-testid="upload-progress"]', { state: 'hidden' })

// Wait for success message
await page.waitForSelector('[data-testid="success-message"]')
```

---

## ♿ Accessibility Testing

### Using axe-core with Playwright

```typescript
import AxeBuilder from '@axe-core/playwright'

test('should meet WCAG 2.1 AA standards', async ({ page }) => {
  // Navigate to page
  await page.goto('/admin/collections/media/create')

  // Run accessibility scan
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])  // WCAG 2.1 Level A and AA
    .analyze()

  // Assert no violations
  expect(results.violations).toEqual([])
})
```

### Excluding Specific Rules (if justified)

```typescript
const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa'])
  .disableRules(['color-contrast'])  // Only if justified and documented!
  .analyze()
```

**Important**: Only disable rules if you have a valid reason and document why.

### Handling Violations

If violations are found:

1. **Review violations**:
   ```typescript
   console.log('Violations found:', results.violations)
   ```

2. **Fix accessibility issues** in the application code
3. **Re-run tests** to verify fixes
4. **Document** any known limitations that can't be fixed

---

## 🐛 Debugging E2E Tests

### Run in Headed Mode

```bash
# See browser while tests run
pnpm test:e2e --headed
```

### Interactive Debug Mode

```bash
# Pause execution at breakpoints
pnpm test:e2e --debug
```

```typescript
test('debugging test', async ({ page }) => {
  await page.goto('/admin')
  await page.pause() // Opens Playwright Inspector
  // Continue step-by-step
})
```

### Screenshots and Videos

Playwright automatically captures screenshots on failure (configured in `playwright.config.ts`).

```typescript
// Manual screenshot
await page.screenshot({ path: 'screenshot.png' })

// Screenshot of specific element
await page.locator('[data-testid="upload-form"]').screenshot({ path: 'form.png' })
```

### View Test Results

```bash
# Generate HTML report
pnpm test:e2e --reporter=html

# Open report
pnpm exec playwright show-report
```

### Common Issues

#### Issue: Test timeout

**Symptoms**: `Test timeout of 30000ms exceeded`

**Solutions**:
1. Increase test timeout:
   ```typescript
   test('slow operation', async ({ page }) => {
     test.setTimeout(60000) // 60 seconds
     // ...
   })
   ```

2. Check wait strategies (use `waitForSelector` instead of `waitForTimeout`)

3. Verify dev server is running and accessible

#### Issue: Element not found

**Symptoms**: `Error: Locator [...] not found`

**Solutions**:
1. Verify selector is correct (inspect element in browser)
2. Wait for element to appear:
   ```typescript
   await page.waitForSelector('[data-testid="element"]')
   ```
3. Check if element is inside iframe:
   ```typescript
   const frame = page.frameLocator('iframe[name="payload"]')
   await frame.locator('[data-testid="element"]').click()
   ```

#### Issue: Flaky tests (sometimes pass, sometimes fail)

**Symptoms**: Inconsistent test results

**Solutions**:
1. Replace `waitForTimeout` with `waitForSelector`
2. Ensure test isolation (cleanup in `afterEach`)
3. Wait for network requests:
   ```typescript
   await page.waitForResponse(response =>
     response.url().includes('/api/media')
   )
   ```
4. Use Playwright auto-retry assertions

---

## 🎯 Test Coverage

### What to Test

✅ **Do test**:
- Critical user workflows (upload, edit, delete)
- Error handling (invalid files, network errors)
- Accessibility (WCAG 2.1 AA compliance)
- Keyboard navigation
- Form validation

❌ **Don't test**:
- Framework internals (Payload CMS, Next.js)
- Third-party libraries (Cloudflare R2 SDK)
- Implementation details (internal state)

### E2E Test Checklist

For admin media workflow:

- [ ] **Upload workflow**
  - [ ] Navigate to create form
  - [ ] Upload valid file
  - [ ] Fill optional fields
  - [ ] Submit form
  - [ ] Verify success message
  - [ ] Verify redirect to gallery
- [ ] **Gallery display**
  - [ ] View uploaded media in list
  - [ ] Thumbnails render correctly
  - [ ] Metadata displayed (filename, size, etc.)
- [ ] **Edit workflow**
  - [ ] Navigate to edit form
  - [ ] Update fields (alt text)
  - [ ] Save changes
  - [ ] Verify changes persisted
- [ ] **Delete workflow**
  - [ ] Delete media from gallery
  - [ ] Confirm deletion
  - [ ] Verify media removed
- [ ] **Error handling**
  - [ ] Upload invalid file type
  - [ ] Upload file exceeding size limit
  - [ ] Verify error messages
- [ ] **Accessibility**
  - [ ] WCAG 2.1 AA compliance
  - [ ] Keyboard navigation
  - [ ] Screen reader compatibility

---

## 📊 Coverage Report

Playwright doesn't generate code coverage by default, but tracks test results.

### View Test Report

```bash
# Run tests with HTML reporter
pnpm test:e2e --reporter=html

# Open report
pnpm exec playwright show-report
```

### Coverage Goals

| Area                | Target             | Actual |
| ------------------- | ------------------ | ------ |
| Upload workflow     | 100% tested        | -      |
| Edit workflow       | 100% tested        | -      |
| Delete workflow     | 100% tested        | -      |
| Error scenarios     | Major errors tested | -     |
| Accessibility       | WCAG 2.1 AA passed | -      |

---

## 🤖 CI/CD Integration

### GitHub Actions

E2E tests run automatically in CI:

```yaml
# .github/workflows/quality-gate.yml (excerpt)
- name: Run E2E tests
  run: pnpm test:e2e
  env:
    CI: true
```

### CI Environment

- **Browser**: Chromium (headless)
- **Server**: Auto-started by Playwright config
- **Database**: Wrangler-simulated D1
- **R2**: Wrangler-simulated R2

### Required Checks

All PRs must:

- [ ] Pass all E2E tests
- [ ] No test failures
- [ ] No accessibility violations
- [ ] Tests complete in <5 minutes

---

## ✅ Testing Checklist

Before merging Phase 3:

### E2E Tests
- [ ] All E2E tests pass locally
- [ ] All E2E tests pass in CI
- [ ] No flaky tests (run multiple times)
- [ ] Tests complete in reasonable time (<5 min)

### Accessibility
- [ ] Accessibility tests pass
- [ ] No WCAG 2.1 AA violations
- [ ] Keyboard navigation tested
- [ ] Error messages accessible

### Debugging
- [ ] Tests run in headed mode successfully
- [ ] Screenshots captured on failure
- [ ] Test report generated and reviewed

### CI Integration
- [ ] E2E tests pass in GitHub Actions
- [ ] No test timeouts in CI
- [ ] Test results visible in PR

---

## 📝 Best Practices

### Writing Tests

✅ **Do**:
- Test user behavior, not implementation
- Use descriptive test names ("should upload image via admin form")
- One assertion per test (when possible)
- Test happy path AND error cases
- Ensure test isolation (independent tests)

❌ **Don't**:
- Test framework internals
- Over-mock (test real UI interactions)
- Write flaky tests (use proper waits)
- Ignore failing tests (fix or remove)
- Hardcode delays (`waitForTimeout`)

### Test Naming

Use descriptive names that explain the behavior:

```typescript
// Good
test('should upload image via admin form')
test('should display error message when file is too large')
test('should be accessible for keyboard navigation')

// Bad
test('upload test')
test('test 1')
test('it works')
```

### Test Organization

```typescript
test.describe('Admin Media Upload E2E', () => {
  test.describe('Upload Operations', () => {
    test('should upload image via admin form')
    test('should handle upload progress indicator')
  })

  test.describe('Error Handling', () => {
    test('should display error for invalid file type')
    test('should display error for file size limit')
  })

  test.describe('Accessibility', () => {
    test('should be accessible (WCAG 2.1 AA)')
    test('should support keyboard navigation')
  })
})
```

---

## ❓ FAQ

**Q: How long should E2E tests take?**
A: Ideally <5 minutes for the full suite. Individual tests: 2-10 seconds.

**Q: Should I use page object pattern?**
A: For complex UIs, yes. For simple tests, inline locators are fine.

**Q: What if Payload admin UI changes?**
A: Update locators in tests. Using `data-testid` attributes makes this easier.

**Q: Can I run E2E tests in parallel?**
A: Yes, configure in `playwright.config.ts`. Ensure tests are isolated.

**Q: Should I test in all browsers (Chrome, Firefox, Safari)?**
A: For CI, Chromium is sufficient. For production, test in major browsers periodically.

**Q: What if accessibility tests fail?**
A: Fix accessibility issues in the application. Don't disable rules unless justified.

**Q: How do I test file uploads?**
A: Use `page.setInputFiles('input[type="file"]', 'path/to/file.png')`

**Q: Should I test Payload CMS admin UI internals?**
A: No. Test user-facing workflows, not framework implementation details.

---

## 🎓 Resources

### Playwright Documentation
- [Playwright Getting Started](https://playwright.dev/docs/intro)
- [Writing Tests](https://playwright.dev/docs/writing-tests)
- [Assertions](https://playwright.dev/docs/test-assertions)
- [Locators](https://playwright.dev/docs/locators)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging](https://playwright.dev/docs/debug)

### Accessibility Testing
- [axe-core Playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Accessible Forms](https://www.w3.org/WAI/tutorials/forms/)

### Project-Specific
- [Payload Admin Documentation](https://payloadcms.com/docs/admin/overview)
- [Playwright Config](../../../../playwright.config.ts)
- [Test Fixtures](../../../../tests/fixtures/)

---

**Happy testing! 🧪**
