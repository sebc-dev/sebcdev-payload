# Phase 3 - Environment Setup

This guide covers all environment setup needed for Phase 3 (E2E Tests & Final Validation).

---

## 📋 Prerequisites

### Previous Phases

- [x] Phase 1 completed (Media Collection Enhancement)
- [x] Phase 2 completed (Integration Tests R2)
- [ ] All previous tests passing
- [ ] Media collection with R2 plugin functional

### Tools Required

- [ ] Node.js 18+ installed
- [ ] pnpm installed
- [ ] Git installed
- [ ] Chromium browser (for Playwright)
- [ ] Cloudflare account (for preview deployment)

### Services Required

- [ ] Cloudflare D1 database provisioned
- [ ] Cloudflare R2 bucket provisioned (`sebcdev-payload-cache`)
- [ ] Wrangler CLI configured (`npx wrangler login`)
- [ ] Development server running (for E2E tests)

---

## 📦 Dependencies Installation

### Install Playwright

Playwright should already be installed from project setup, but verify:

```bash
# Check if Playwright is installed
pnpm list @playwright/test

# If not installed, add it
pnpm add -D @playwright/test

# Install Playwright browsers
pnpm exec playwright install chromium

# Verify installation
pnpm exec playwright --version
```

**Expected output**: `Version 1.x.x`

### Install axe-core for Accessibility Testing

```bash
# Install axe-core Playwright integration
pnpm add -D @axe-core/playwright

# Verify installation
pnpm list @axe-core/playwright
```

**Packages added**:
- `@playwright/test` - E2E testing framework
- `@axe-core/playwright` - Accessibility testing with axe-core

### Verify Installation

```bash
# Check Playwright test command works
pnpm test:e2e --help

# Should show Playwright CLI help
```

---

## 🔧 Environment Variables

### Required Variables

Phase 3 uses the same environment variables as previous phases. Verify your `.env.local` file:

```env
# Payload CMS
PAYLOAD_SECRET=your-secret-here

# Cloudflare (for preview deployment)
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token

# Optional: Preview environment
CLOUDFLARE_ENV=preview
```

### Variable Descriptions

| Variable              | Description                          | Example                          | Required |
| --------------------- | ------------------------------------ | -------------------------------- | -------- |
| `PAYLOAD_SECRET`      | Payload CMS encryption secret        | `random-secret-32-chars`         | Yes      |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID        | `abc123def456`                   | Yes (for deploy) |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare API token with Workers/D1/R2 permissions | `your-api-token` | Yes (for deploy) |
| `CLOUDFLARE_ENV`      | Deployment environment               | `preview` or `production`        | No       |

### Environment-Specific Configuration

**Development (E2E tests)**:
- Uses Wrangler simulated R2 (`.wrangler/state/r2`)
- Uses local D1 database (`.wrangler/state/v3/d1`)
- Development server runs on `http://localhost:3000`

**Preview (manual validation)**:
- Uses real Cloudflare R2 bucket
- Uses preview D1 database
- Deployed to `https://sebcdev-payload-preview.workers.dev`

---

## 🗄️ External Services Setup

### Playwright Test Environment

**Purpose**: E2E testing with Chromium browser

**Setup Steps**:

1. Verify Playwright configuration exists:
   ```bash
   cat playwright.config.ts
   ```

2. Check test directory structure:
   ```bash
   ls tests/e2e/
   ```

3. Verify test fixtures directory:
   ```bash
   mkdir -p tests/fixtures
   ```

4. Create test image fixtures (if not exist):
   ```bash
   # Create a minimal valid PNG (1x1 pixel)
   # This is a base64-encoded 1x1 transparent PNG
   echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > tests/fixtures/test-image.png
   ```

**Verification**:
```bash
# Run Playwright in dry-run mode
pnpm test:e2e --list

# Should show available E2E tests
```

**Expected Output**: List of test files (even if none exist yet)

---

### Cloudflare Preview Environment

**Purpose**: Production-like testing with real R2 bucket

**Setup Steps**:

1. **Login to Wrangler** (if not already):
   ```bash
   pnpm exec wrangler login
   ```
   - Opens browser for Cloudflare authentication
   - Grants Wrangler access to your account

2. **Verify Wrangler configuration**:
   ```bash
   cat wrangler.jsonc
   ```
   - Check `r2_buckets` binding exists
   - Check `d1_databases` binding exists

3. **Verify R2 bucket exists**:
   ```bash
   pnpm exec wrangler r2 bucket list
   ```
   **Expected**: `sebcdev-payload-cache` in the list

4. **Verify D1 database exists**:
   ```bash
   pnpm exec wrangler d1 list
   ```
   **Expected**: `sebcdev-payload-db` in the list

5. **Run migrations on preview database** (if needed):
   ```bash
   pnpm exec wrangler d1 migrations apply sebcdev-payload-db --env preview
   ```

**Verification**:
```bash
# Build project
pnpm build

# Deploy to preview (dry-run)
pnpm exec wrangler deploy --env preview --dry-run

# Should show deployment plan without actually deploying
```

**Expected Output**: Deployment configuration preview

---

## ✅ Connection Tests

### Test Development Server

```bash
# Start development server
pnpm dev

# In another terminal, verify server is running
curl http://localhost:3000/api/health || echo "Server not running"
```

**Expected Result**: HTTP 200 or 404 (endpoint may not exist, but server responds)

### Test Playwright Can Access Dev Server

```bash
# Create a simple test to verify Playwright setup
cat > tests/e2e/smoke.e2e.spec.ts << 'EOF'
import { test, expect } from '@playwright/test'

test('dev server is accessible', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await expect(page).toHaveTitle(/Payload/)
})
EOF

# Run the smoke test
pnpm test:e2e tests/e2e/smoke.e2e.spec.ts

# Clean up smoke test
rm tests/e2e/smoke.e2e.spec.ts
```

**Expected Result**: Test passes, Playwright can access dev server

### Test Preview Deployment (After First Deploy)

```bash
# Deploy to preview
pnpm exec wrangler deploy --env preview

# Test preview URL
curl -I https://sebcdev-payload-preview.workers.dev/admin

# Should return HTTP 200 or 302 (redirect to login)
```

**Expected Result**: HTTP response (200 or 302), preview deployment accessible

---

## 🚨 Troubleshooting

### Issue: Playwright not found

**Symptoms**:
- `pnpm test:e2e` fails with "playwright not found"
- Missing `@playwright/test` package

**Solutions**:
1. Install Playwright:
   ```bash
   pnpm add -D @playwright/test
   ```

2. Install browsers:
   ```bash
   pnpm exec playwright install chromium
   ```

**Verify Fix**:
```bash
pnpm exec playwright --version
```

---

### Issue: Chromium browser not installed

**Symptoms**:
- E2E tests fail with "Executable doesn't exist"
- Missing Chromium browser

**Solutions**:
1. Install Chromium:
   ```bash
   pnpm exec playwright install chromium
   ```

2. If still fails, install system dependencies:
   ```bash
   pnpm exec playwright install-deps chromium
   ```

**Verify Fix**:
```bash
pnpm exec playwright install --dry-run
# Should show Chromium already installed
```

---

### Issue: axe-core not found

**Symptoms**:
- Import error: `Cannot find module '@axe-core/playwright'`

**Solutions**:
1. Install axe-core:
   ```bash
   pnpm add -D @axe-core/playwright
   ```

**Verify Fix**:
```bash
pnpm list @axe-core/playwright
```

---

### Issue: Development server not accessible during E2E tests

**Symptoms**:
- E2E tests timeout waiting for `http://localhost:3000`
- Connection refused errors

**Solutions**:
1. Verify dev server is running:
   ```bash
   pnpm dev
   ```

2. Check Playwright config `webServer` option (should auto-start):
   ```typescript
   // playwright.config.ts
   export default defineConfig({
     webServer: {
       command: 'pnpm dev',
       port: 3000,
       reuseExistingServer: true,
     },
   })
   ```

3. Manually start dev server in separate terminal before running tests

**Verify Fix**:
```bash
curl http://localhost:3000
# Should return HTML or JSON response
```

---

### Issue: Preview deployment fails

**Symptoms**:
- `wrangler deploy` fails with authentication error
- "Error: Not logged in" or "Invalid API token"

**Solutions**:
1. Login to Wrangler:
   ```bash
   pnpm exec wrangler login
   ```

2. Verify API token has correct permissions:
   - Workers Scripts: Edit
   - D1: Edit
   - R2: Edit

3. Check `CLOUDFLARE_ACCOUNT_ID` is correct:
   ```bash
   echo $CLOUDFLARE_ACCOUNT_ID
   # Should match your Cloudflare account ID
   ```

**Verify Fix**:
```bash
pnpm exec wrangler whoami
# Should show your Cloudflare account
```

---

### Issue: R2 bucket not accessible in preview

**Symptoms**:
- Upload works locally but fails in preview
- "Bucket not found" error

**Solutions**:
1. Verify R2 bucket exists:
   ```bash
   pnpm exec wrangler r2 bucket list
   ```

2. Check `wrangler.jsonc` binding matches bucket name:
   ```jsonc
   "r2_buckets": [
     {
       "binding": "R2",
       "bucket_name": "sebcdev-payload-cache",
       "preview_bucket_name": "sebcdev-payload-cache"
     }
   ]
   ```

3. Verify bucket is in same account as deployment

**Verify Fix**:
```bash
# List objects in bucket (should work even if empty)
pnpm exec wrangler r2 object list sebcdev-payload-cache
```

---

### Issue: E2E tests are flaky (sometimes pass, sometimes fail)

**Symptoms**:
- Tests pass/fail randomly
- Timeout errors inconsistently

**Solutions**:
1. Use proper wait strategies:
   ```typescript
   // Bad: arbitrary timeout
   await page.waitForTimeout(1000)

   // Good: wait for specific element
   await page.waitForSelector('[data-testid="upload-success"]')
   ```

2. Increase test timeout if needed:
   ```typescript
   test('slow operation', async ({ page }) => {
     test.setTimeout(60000) // 60 seconds
     // ... test code
   })
   ```

3. Ensure test isolation (cleanup between tests):
   ```typescript
   test.afterEach(async ({ page }) => {
     // Clean up test data
   })
   ```

**Verify Fix**:
```bash
# Run tests multiple times to verify stability
for i in {1..5}; do pnpm test:e2e; done
# All runs should pass
```

---

## 📝 Setup Checklist

Complete this checklist before starting implementation:

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] pnpm installed
- [ ] Git repository initialized
- [ ] Previous phases (1-2) completed

### Dependencies
- [ ] `@playwright/test` installed
- [ ] `@axe-core/playwright` installed
- [ ] Chromium browser installed
- [ ] Test fixtures directory created

### Environment Variables
- [ ] `.env.local` configured
- [ ] `PAYLOAD_SECRET` set
- [ ] `CLOUDFLARE_ACCOUNT_ID` set (for deploy)
- [ ] `CLOUDFLARE_API_TOKEN` set (for deploy)

### Services
- [ ] Development server runs successfully
- [ ] Playwright can access dev server
- [ ] Wrangler logged in
- [ ] R2 bucket accessible
- [ ] D1 database accessible

### Connection Tests
- [ ] Dev server test passes
- [ ] Playwright smoke test passes
- [ ] Wrangler can list R2 buckets
- [ ] Wrangler can list D1 databases

**Environment is ready! 🚀**

---

## 🎯 Next Steps

After completing this setup:

1. Read [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
2. Follow [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) for implementation
3. Use [guides/TESTING.md](./guides/TESTING.md) for E2E testing best practices
4. Refer to this document if environment issues arise

---

## 📚 References

### Playwright Documentation
- [Playwright Getting Started](https://playwright.dev/docs/intro)
- [Playwright Configuration](https://playwright.dev/docs/test-configuration)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

### axe-core Documentation
- [axe-core Playwright Integration](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Cloudflare Documentation
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [R2 Documentation](https://developers.cloudflare.com/r2/)
- [D1 Documentation](https://developers.cloudflare.com/d1/)
- [Workers Deploy](https://developers.cloudflare.com/workers/wrangler/commands/#deploy)
