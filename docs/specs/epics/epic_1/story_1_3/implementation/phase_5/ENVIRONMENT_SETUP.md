# Phase 5 - Environment Setup

This guide covers all environment setup needed for Phase 5.

---

## Prerequisites

### Previous Phases

- [x] Phase 1 completed: Workflow foundation exists
- [x] Phase 2 completed: Socket.dev configured
- [x] Phase 3 completed: ESLint/Prettier configured
- [x] Phase 4 completed: Knip and Type Sync configured

### Tools Required

- [x] Node.js 20+ (already in workflow)
- [x] pnpm 9+ (already in workflow)
- [x] Next.js 15 (already in project)
- [x] GitHub CLI (`gh`) for workflow testing

### Services Required

- [x] GitHub repository with Actions enabled
- [x] GitHub Secrets access (for PAYLOAD_SECRET)

---

## Dependencies Installation

### No New Packages Required

Phase 5 uses existing dependencies:

- `next` (already installed)
- `cross-env` (already installed for local builds)

**Verification**:

```bash
# Check Next.js version
pnpm exec next --version
# Expected: Next.js 15.x.x

# Check build command works locally
pnpm exec next build --experimental-build-mode compile
```

---

## Environment Variables

### CI Environment Variables

The workflow uses these environment variables:

```yaml
# In .github/workflows/quality-gate.yml
env:
  PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET || 'ci-build-dummy-secret-32-chars-minimum!!' }}
```

### Variable Descriptions

| Variable         | Description                | Example                              | Required |
| ---------------- | -------------------------- | ------------------------------------ | -------- |
| `PAYLOAD_SECRET` | Secret key for Payload CMS | `your-32-char-secret-key-here-min!!` | Yes      |

### GitHub Secrets Configuration

If `PAYLOAD_SECRET` is not already configured in GitHub Secrets:

1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `PAYLOAD_SECRET`
4. Value: Generate with `openssl rand -hex 32`
5. Click "Add secret"

**Note**: The workflow has a fallback value for CI builds, so this is optional but recommended.

---

## Local Development Setup

### Verify Build Works Locally

Before modifying the workflow, ensure the build works locally:

```bash
# Full build (same as pnpm build)
pnpm build

# Or just Next.js compile mode (what CI will run)
pnpm exec next build --experimental-build-mode compile
```

### Expected Output

```
▲ Next.js 15.x.x

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (X/X)
 ✓ Collecting build traces
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    ...      ...
├ ○ /admin                               ...      ...
└ ...
```

---

## CI/CD Configuration

### GitHub Actions Workflow

The workflow file already exists at `.github/workflows/quality-gate.yml`.

Phase 5 modifications:

1. Add Next.js build step
2. Add build caching step

### Workflow Permissions

Current permissions (sufficient for Phase 5):

```yaml
permissions:
  contents: read
  issues: write # For Socket.dev
  pull-requests: write # For Socket.dev
```

No additional permissions needed for build validation.

---

## Troubleshooting

### Issue: Build fails with "Cannot find module"

**Symptoms**:

- Error: `Cannot find module '@/...'`
- Error: `Module not found: Can't resolve '...'`

**Solutions**:

1. Run `pnpm install` to ensure dependencies are installed
2. Check `tsconfig.json` paths configuration
3. Verify the module exists in the codebase

**Verify Fix**:

```bash
pnpm install
pnpm exec tsc --noEmit
pnpm build
```

---

### Issue: PAYLOAD_SECRET validation fails

**Symptoms**:

- Error: `PAYLOAD_SECRET must be at least 32 characters`
- Build fails during Payload initialization

**Solutions**:

1. Ensure fallback secret is at least 32 characters
2. Configure GitHub Secret with proper value
3. Check workflow uses `${{ secrets.PAYLOAD_SECRET || 'fallback' }}`

**Verify Fix**:

```bash
# Test locally with explicit secret
PAYLOAD_SECRET="test-secret-that-is-32-chars-long!!" pnpm build
```

---

### Issue: Cache not working

**Symptoms**:

- Cache shows "Cache not found" on every run
- Build time doesn't improve on second run

**Solutions**:

1. Verify cache key syntax is correct
2. Check `.next/cache` directory is created during build
3. Ensure hashFiles patterns match actual files

**Verify Fix**:

```bash
# Check if .next/cache exists after build
pnpm build
ls -la .next/cache
```

---

## Setup Checklist

Complete this checklist before starting implementation:

- [x] Node.js 20+ available
- [x] pnpm 9+ available
- [x] Phase 1-4 completed
- [x] Local build passes
- [ ] GitHub Secrets configured (optional - has fallback)
- [x] GitHub CLI installed for testing
- [ ] Workflow file accessible

**Environment is ready!**
