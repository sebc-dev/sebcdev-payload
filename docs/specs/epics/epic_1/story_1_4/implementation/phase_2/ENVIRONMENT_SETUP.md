# Phase 2: Environment Setup - Deployment Workflow Creation

This guide covers all environment configuration needed to implement Phase 2.

---

## Prerequisites

### Phase 1 Completion

Before starting Phase 2, ensure Phase 1 is complete:

- [ ] Branch protection is configured on `main`
- [ ] Quality Gate is required for merges
- [ ] Force pushes are blocked

### Local Environment

- [ ] Node.js 20.x installed
- [ ] pnpm 9.x installed
- [ ] Git configured with commit signing (optional)
- [ ] VS Code or editor with YAML support

### Cloudflare Account

- [ ] Cloudflare account created
- [ ] Worker already deployed (from Story 1.1)
- [ ] D1 database created and bound to Worker
- [ ] R2 bucket created and bound to Worker (if using media)

---

## GitHub Secrets Configuration

### Required Secrets

Navigate to: **Repository > Settings > Secrets and variables > Actions**

| Secret Name           | Description                            | How to Get                        |
| --------------------- | -------------------------------------- | --------------------------------- |
| CLOUDFLARE_API_TOKEN  | API token for Workers and D1 access    | Cloudflare Dashboard > API Tokens |
| CLOUDFLARE_ACCOUNT_ID | Your Cloudflare account identifier     | Cloudflare Dashboard > Overview   |
| PAYLOAD_SECRET        | Payload CMS encryption key (32+ chars) | Generate or use existing          |

### Creating Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click on your profile icon > **My Profile**
3. Select **API Tokens** from the left sidebar
4. Click **Create Token**
5. Select **Create Custom Token**

Configure the token with these permissions:

| Permission Category | Resource         | Permission |
| ------------------- | ---------------- | ---------- |
| Account             | Workers Scripts  | Edit       |
| Account             | D1               | Edit       |
| Account             | Account Settings | Read       |

**Zone permissions** (if using custom domain):

| Permission Category | Resource | Permission |
| ------------------- | -------- | ---------- |
| Zone                | Zone     | Read       |
| Zone                | DNS      | Edit       |

6. Set **Account Resources** to include your account
7. Click **Continue to Summary**
8. Click **Create Token**
9. **Copy the token immediately** - it won't be shown again

### Finding Account ID

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select any zone or go to **Workers & Pages**
3. Look in the right sidebar for **Account ID**
4. Copy the value (32 character hex string)

### Adding Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings > Secrets and variables > Actions**
3. Click **New repository secret**
4. For each secret:
   - Enter the **Name** exactly as shown above
   - Paste the **Value**
   - Click **Add secret**

### Verifying Secrets

After adding secrets, verify they appear in the list:

```
Repository secrets:
✅ CLOUDFLARE_ACCOUNT_ID
✅ CLOUDFLARE_API_TOKEN
✅ PAYLOAD_SECRET
```

---

## Local Development Setup

### Wrangler Authentication

For local testing, authenticate wrangler:

```bash
# Login to Cloudflare (opens browser)
pnpm exec wrangler login

# Verify authentication
pnpm exec wrangler whoami
```

Expected output:

```
 ⛅️ wrangler 3.x.x
-------------------
Getting User settings...
👋 You are logged in with an OAuth Token, associated with the email: your-email@example.com!
```

### Environment Variables

Create or update `.env` for local development:

```bash
# .env (local development only - never commit!)
PAYLOAD_SECRET=your-development-secret-32-chars-minimum
```

### Test Migration Locally

Before implementing CI migrations, test locally:

```bash
# Generate types (ensures config is valid)
pnpm generate:types:payload

# Run migrations against local D1
pnpm payload migrate

# Verify migration succeeded
pnpm exec wrangler d1 execute DB_NAME --command "SELECT name FROM sqlite_master WHERE type='table';"
```

### Test Deployment Locally

Test deployment without CI:

```bash
# Build the application
pnpm build

# Deploy to Cloudflare (requires wrangler login)
pnpm exec wrangler deploy

# Verify deployment
curl -s -o /dev/null -w "%{http_code}" https://your-worker.your-subdomain.workers.dev
```

---

## Workflow Development Setup

### Branch Strategy

```
main (protected)
  └── feature/story-1.4-phase-2
        ├── commit 1: deploy job skeleton
        ├── commit 2: D1 migrations
        ├── commit 3: wrangler deploy
        └── commit 4: validation & docs
```

Create the feature branch:

```bash
git checkout main
git pull origin main
git checkout -b feature/story-1.4-phase-2
```

### Workflow File Location

The workflow file is at:

```
.github/workflows/quality-gate.yml
```

### YAML Validation

Install YAML lint extension in VS Code or use:

```bash
# Install yamllint (optional)
pip install yamllint

# Validate workflow file
yamllint .github/workflows/quality-gate.yml
```

### GitHub Actions Extension

For VS Code, install the **GitHub Actions** extension:

- Provides syntax highlighting for workflows
- Shows inline validation errors
- Autocomplete for action inputs

---

## Testing Configuration

### Manual Workflow Dispatch

To test the workflow before merging:

1. Push your branch to GitHub
2. Go to **Actions > Quality Gate**
3. Click **Run workflow**
4. Select your branch from the dropdown
5. Click **Run workflow**
6. Monitor the job execution

### Debugging Workflow Issues

If the workflow fails:

1. Click on the failed job
2. Expand the failed step
3. Review the error message
4. Check the **Annotations** section for details

Common issues:

- **YAML syntax error**: Check indentation (2 spaces)
- **Secret not found**: Verify secret name matches exactly
- **Permission denied**: Check token permissions

### Local Workflow Testing with Act

Optional: Use [act](https://github.com/nektos/act) for local workflow testing:

```bash
# Install act
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run workflow locally (requires Docker)
act -j deploy --secret-file .secrets

# Note: Create .secrets file with test values
# CLOUDFLARE_API_TOKEN=test
# CLOUDFLARE_ACCOUNT_ID=test
# PAYLOAD_SECRET=test-secret-at-least-32-characters
```

---

## Cloudflare Configuration Verification

### Wrangler Configuration

Verify `wrangler.jsonc` has correct bindings:

```jsonc
{
  "name": "your-worker-name",
  "main": ".open-next/worker.js",
  "compatibility_date": "2024-01-01",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "your-db-name",
      "database_id": "your-database-id",
    },
  ],
  "r2_buckets": [
    {
      "binding": "MEDIA",
      "bucket_name": "your-bucket-name",
    },
  ],
}
```

### D1 Database Verification

```bash
# List D1 databases
pnpm exec wrangler d1 list

# Check database info
pnpm exec wrangler d1 info your-db-name

# List tables (should show Payload tables)
pnpm exec wrangler d1 execute your-db-name --command "SELECT name FROM sqlite_master WHERE type='table';"
```

### Worker Verification

```bash
# List deployments
pnpm exec wrangler deployments list

# Check current deployment
pnpm exec wrangler deployments view
```

---

## Troubleshooting Setup Issues

### API Token Issues

**Error**: `Authentication error`

- Verify token is copied correctly (no trailing spaces)
- Check token hasn't expired
- Ensure token has required permissions

**Error**: `Authorization error`

- Token permissions don't match required actions
- Regenerate token with correct permissions

### D1 Migration Issues

**Error**: `Database not found`

- Check database name in `wrangler.jsonc`
- Verify D1 binding is correct
- Run `pnpm exec wrangler d1 list` to see available databases

**Error**: `Migration failed`

- Check migration SQL syntax
- Verify previous migrations completed
- Check for conflicting schema changes

### Workflow Dispatch Issues

**Error**: `Workflow does not exist`

- Ensure workflow file is committed to the branch
- Check file path: `.github/workflows/quality-gate.yml`

**Error**: `Required status check missing`

- The job name must match the branch protection rule
- Ensure job `quality-gate` exists and is named correctly

---

## Environment Checklist

Before starting implementation, verify:

### Secrets

- [ ] CLOUDFLARE_API_TOKEN is set and valid
- [ ] CLOUDFLARE_ACCOUNT_ID is set and correct
- [ ] PAYLOAD_SECRET is set

### Local Tools

- [ ] wrangler login completed
- [ ] `pnpm payload migrate` works locally
- [ ] `pnpm exec wrangler deploy` works locally

### Repository

- [ ] Feature branch created
- [ ] quality-gate.yml accessible
- [ ] Branch protection configured (Phase 1)

### Cloudflare

- [ ] Worker exists and is accessible
- [ ] D1 database is bound
- [ ] API token has required permissions

---

**Setup Guide Created**: 2025-11-29
**Last Updated**: 2025-11-29
