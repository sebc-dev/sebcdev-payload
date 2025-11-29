# Phase 2: Implementation Plan - Deployment Workflow Creation

**Phase**: 2 of 4
**Estimated Duration**: 1-2 days
**Estimated Commits**: 4
**Complexity**: Medium

---

## Implementation Strategy

### Approach

This phase follows an **incremental enhancement** strategy:

1. Add minimal deploy job skeleton (validates workflow syntax)
2. Add D1 migration step (critical for database state)
3. Integrate wrangler deploy (actual deployment)
4. Add validation and documentation (production readiness)

### Atomic Commit Principles

Each commit in this phase:

- Adds exactly one piece of functionality
- Maintains workflow validity (no broken syntax)
- Can be reviewed independently in 15-30 minutes
- Includes any necessary environment/secret documentation

---

## Commit 1: Add Deploy Job Skeleton

### Objective

Add a minimal `deploy` job to `quality-gate.yml` that depends on the `quality-gate` job passing. This establishes the workflow structure without deployment logic.

### Changes

**File**: `.github/workflows/quality-gate.yml`

```yaml
# Add after the quality-gate job (at the end of file)

# ============================================
# DEPLOYMENT: Cloudflare Workers
# ============================================

deploy:
  name: Deploy to Cloudflare
  needs: [quality-gate]
  runs-on: ubuntu-latest
  # Only deploy on main branch pushes or manual dispatch
  if: github.ref == 'refs/heads/main' || github.event_name == 'workflow_dispatch'

  permissions:
    contents: read

  steps:
    - name: Checkout repository
      uses: actions/checkout@1af3b93b6815bc44a9784bd300feb67ff0d1eeb3 # v6.0.0

    - name: Setup pnpm
      uses: pnpm/action-setup@41ff72655975bd51cab0327fa583b6e92b6d3061 # v4.2.0
      with:
        version: 9

    - name: Setup Node.js
      uses: actions/setup-node@2028fbc5c25fe9cf00d9f06a71cc4710d4507903 # v6.0.0
      with:
        node-version: '20'
        cache: 'pnpm'

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Deploy Placeholder
      run: echo "Deployment steps will be added in subsequent commits"
```

### Verification Steps

1. Run workflow locally with `act` (if available) or push to test branch
2. Verify workflow syntax is valid: no YAML errors
3. Verify `deploy` job appears in GitHub Actions UI
4. Verify `deploy` job waits for `quality-gate` to complete

### Commit Message

```
🔧 Add deploy job skeleton to quality-gate workflow

- Add deploy job with needs: [quality-gate] dependency
- Configure conditional execution (main branch or manual)
- Setup Node.js and pnpm for deployment steps
- Placeholder for actual deployment logic

Phase 2 Commit 1/4 - Story 1.4
```

### Estimated Size

- Lines added: ~30
- Files changed: 1
- Review time: 15 minutes

---

## Commit 2: Add D1 Migration Step

### Objective

Add the D1 database migration step that must run before deployment. This ensures the database schema is updated before new code is deployed.

### Changes

**File**: `.github/workflows/quality-gate.yml`

```yaml
# Replace the "Deploy Placeholder" step with:

- name: Run D1 Migrations
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET }}
  run: |
    echo "::group::Running D1 Migrations"
    pnpm payload migrate
    echo "::endgroup::"
    echo "::notice::✅ D1 migrations completed successfully"

- name: Deploy Placeholder
  run: echo "Wrangler deploy will be added in next commit"
```

### Prerequisites

Ensure these secrets exist in GitHub repository settings:

- `CLOUDFLARE_API_TOKEN` - API token with D1 write permissions
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account identifier
- `PAYLOAD_SECRET` - Payload CMS secret (already should exist)

### Verification Steps

1. Verify secrets are configured in repository settings
2. Test migration command locally: `pnpm payload migrate`
3. Push to test branch and verify migrations run
4. Check GitHub Actions logs for migration output

### Commit Message

```
🔧 Add D1 migration step to deploy job

- Execute payload migrate before deployment
- Configure Cloudflare credentials from secrets
- Add grouped logging for migration output
- Add notice annotation for successful completion

Phase 2 Commit 2/4 - Story 1.4
```

### Estimated Size

- Lines added: ~20
- Files changed: 1
- Review time: 15 minutes

---

## Commit 3: Add Wrangler Deploy Integration

### Objective

Integrate the `cloudflare/wrangler-action` to perform the actual deployment to Cloudflare Workers after migrations complete.

### Changes

**File**: `.github/workflows/quality-gate.yml`

```yaml
# Replace the "Deploy Placeholder" step with:

- name: Deploy to Cloudflare Workers
  id: deploy
  uses: cloudflare/wrangler-action@da0e0c8a2bcd5e5090940ea90e4d2a5cbb3b232c # v3.14.0
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    command: deploy
  env:
    PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET }}

- name: Output Deployment URL
  run: |
    echo "## Deployment Successful" >> $GITHUB_STEP_SUMMARY
    echo "" >> $GITHUB_STEP_SUMMARY
    echo "**URL**: ${{ steps.deploy.outputs.deployment-url }}" >> $GITHUB_STEP_SUMMARY
    echo "" >> $GITHUB_STEP_SUMMARY
    echo "**Commit**: ${{ github.sha }}" >> $GITHUB_STEP_SUMMARY
```

### Technical Notes

- Use SHA-pinned version of wrangler-action for security
- The `deployment-url` output comes from wrangler-action
- GitHub Step Summary provides deployment visibility
- PAYLOAD_SECRET needed for runtime environment

### Verification Steps

1. Verify wrangler-action SHA matches v3.14.0 (or latest)
2. Test deployment on a feature branch first
3. Verify deployment URL appears in GitHub Summary
4. Verify site is accessible at deployment URL

### Commit Message

```
🚀 Add wrangler deploy integration

- Integrate cloudflare/wrangler-action@v3 (SHA-pinned)
- Configure API token and account ID from secrets
- Output deployment URL to GitHub Step Summary
- Include commit SHA for traceability

Phase 2 Commit 3/4 - Story 1.4
```

### Estimated Size

- Lines added: ~25
- Files changed: 1
- Review time: 20 minutes

---

## Commit 4: Add Deployment Validation & Documentation

### Objective

Add post-deployment validation (wait-for-url pattern) and create the deployment documentation guide.

### Changes

#### File 1: `.github/workflows/quality-gate.yml`

```yaml
# Add after "Output Deployment URL" step:

- name: Wait for Deployment Availability
  run: |
    URL="${{ steps.deploy.outputs.deployment-url }}"
    echo "Waiting for $URL to become available..."

    MAX_RETRIES=30
    RETRY_INTERVAL=2

    for i in $(seq 1 $MAX_RETRIES); do
      if curl -s -f -o /dev/null "$URL"; then
        echo "::notice::✅ Deployment is live at $URL"
        exit 0
      fi
      echo "Attempt $i/$MAX_RETRIES - Waiting ${RETRY_INTERVAL}s..."
      sleep $RETRY_INTERVAL
    done

    echo "::error::Deployment URL not reachable after $((MAX_RETRIES * RETRY_INTERVAL))s"
    exit 1

- name: Smoke Test
  run: |
    URL="${{ steps.deploy.outputs.deployment-url }}"

    echo "::group::Testing Homepage"
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
    if [ "$HTTP_STATUS" = "200" ]; then
      echo "✅ Homepage returned 200 OK"
    else
      echo "::warning::Homepage returned $HTTP_STATUS (expected 200)"
    fi
    echo "::endgroup::"

    echo "::group::Testing Admin Panel"
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL/admin")
    if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "302" ]; then
      echo "✅ Admin panel accessible (status: $HTTP_STATUS)"
    else
      echo "::warning::Admin panel returned $HTTP_STATUS"
    fi
    echo "::endgroup::"
```

#### File 2: `docs/guides/DEPLOYMENT.md` (new file)

```markdown
# Deployment Guide

## Overview

This project uses GitHub Actions to deploy to Cloudflare Workers. Deployments are
triggered automatically after the Quality Gate passes on the `main` branch.

## Deployment Pipeline
```

Quality Gate (all checks) → D1 Migrations → Wrangler Deploy → Validation

````

### Trigger Conditions

| Trigger             | Deploys to     | Notes                              |
| ------------------- | -------------- | ---------------------------------- |
| Push to `main`      | Production     | After Quality Gate passes          |
| Manual dispatch     | Production     | Can trigger from any branch        |
| Pull Request        | None           | Quality Gate only, no deployment   |

## Required Secrets

Configure these in GitHub Repository Settings > Secrets:

| Secret                 | Description                          | Required |
| ---------------------- | ------------------------------------ | -------- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Workers/D1 | Yes      |
| `CLOUDFLARE_ACCOUNT_ID`| Cloudflare account identifier        | Yes      |
| `PAYLOAD_SECRET`       | Payload CMS secret (32+ chars)       | Yes      |

### Cloudflare API Token Permissions

The API token needs these permissions:
- **Account > Workers Scripts > Edit**
- **Account > D1 > Edit**
- **Account > Account Settings > Read** (optional, for account ID lookup)

## Deployment Process

### 1. D1 Migrations

Migrations run automatically before deployment:

```bash
pnpm payload migrate
````

To test migrations locally:

```bash
# Generate migration files
pnpm payload migrate:create

# Run migrations against local D1
pnpm payload migrate
```

### 2. Wrangler Deploy

The deployment uses `wrangler deploy` which:

- Bundles the Next.js application via OpenNext
- Uploads to Cloudflare Workers
- Configures D1 bindings
- Returns the deployment URL

### 3. Validation

Post-deployment validation includes:

- **Wait-for-URL**: Polls deployment URL until accessible (max 60s)
- **Smoke Test**: Verifies homepage and admin panel respond

## Manual Deployment

For emergency deployments or debugging:

```bash
# Set environment variables
export CLOUDFLARE_API_TOKEN="your-token"
export CLOUDFLARE_ACCOUNT_ID="your-account-id"

# Run migrations
pnpm payload migrate

# Deploy
pnpm exec wrangler deploy
```

## Monitoring Deployments

### GitHub Actions

- View workflow runs: Actions tab > Quality Gate
- Deployment URL: In job summary after successful deploy
- Logs: Click on individual job steps

### Cloudflare Dashboard

- Workers & Pages > Your Worker > Deployments
- View deployment history
- Rollback to previous versions

## Troubleshooting

### Deployment Fails

1. **Check migrations**: Run locally to verify they pass
2. **Check secrets**: Ensure all required secrets are configured
3. **Check permissions**: Verify API token has correct permissions
4. **Check build**: Ensure `pnpm build` passes locally

### Site Not Accessible

1. **Wait for propagation**: DNS/edge propagation can take 1-2 minutes
2. **Check Worker logs**: Cloudflare Dashboard > Workers > Logs
3. **Check D1 bindings**: Verify database is bound correctly

### Rollback

To rollback to a previous deployment:

1. Go to Cloudflare Dashboard > Workers & Pages
2. Select your Worker
3. Go to Deployments tab
4. Click "Rollback" on the desired version

Or via CLI:

```bash
# List deployments
pnpm exec wrangler deployments list

# Rollback to specific deployment
pnpm exec wrangler rollback <deployment-id>
```

## See Also

- [CI-CD-Security.md](/docs/specs/CI-CD-Security.md) - Security architecture
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)

```

### Verification Steps

1. Trigger a full deployment on test branch
2. Verify wait-for-url correctly polls the deployment
3. Verify smoke tests run and report results
4. Review DEPLOYMENT.md for accuracy

### Commit Message

```

📝 Add deployment validation and documentation

- Add wait-for-url pattern with retry logic
- Add smoke tests for homepage and admin panel
- Create comprehensive DEPLOYMENT.md guide
- Document secrets, process, and troubleshooting

Phase 2 Commit 4/4 - Story 1.4

```

### Estimated Size

- Lines added: ~150
- Files changed: 2
- Review time: 30 minutes

---

## Implementation Order Summary

```

Commit 1: Deploy job skeleton
↓ (validates workflow structure)
Commit 2: D1 migration step
↓ (ensures database readiness)
Commit 3: Wrangler deploy
↓ (actual deployment)
Commit 4: Validation & docs
↓ (production readiness)
Phase 2 Complete

```

---

## Rollback Strategy

If any commit introduces issues:

1. **Workflow syntax error**: Fix in subsequent commit or revert
2. **Migration failure**: Check migration scripts, fix and re-run
3. **Deploy failure**: Check API token permissions, wrangler config
4. **Validation failure**: Adjust timeouts, fix smoke test expectations

Each commit is atomic, so reverting specific changes is straightforward.

---

## Post-Implementation

After all 4 commits are complete:

1. Create PR from feature branch to main
2. Ensure all Quality Gate checks pass
3. Trigger manual workflow dispatch to test deployment
4. Verify deployment URL and smoke tests
5. Update EPIC_TRACKING.md with Phase 2 completion

---

**Plan Created**: 2025-11-29
**Last Updated**: 2025-11-29
```
