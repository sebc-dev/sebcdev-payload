# Deployment Guide

## Overview

This project uses GitHub Actions to deploy to Cloudflare Workers. Deployments are triggered automatically after the Quality Gate passes on the `main` branch.

## Deployment Pipeline

```
Quality Gate (all checks) → D1 Migrations → Wrangler Deploy → Validation
```

### Trigger Conditions

| Trigger         | Deploys to | Notes                            |
| --------------- | ---------- | -------------------------------- |
| Push to `main`  | Production | After Quality Gate passes        |
| Manual dispatch | Production | Can trigger from any branch      |
| Pull Request    | None       | Quality Gate only, no deployment |

## Required Secrets

Configure these in GitHub Repository Settings > Secrets:

| Secret                  | Description                          | Required |
| ----------------------- | ------------------------------------ | -------- |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare API token with Workers/D1 | Yes      |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account identifier        | Yes      |
| `PAYLOAD_SECRET`        | Payload CMS secret (32+ chars)       | Yes      |

### Cloudflare API Token Permissions

The API token needs these permissions:

- **Account > Workers Scripts > Edit**
- **Account > D1 > Edit**
- **Account > Account Settings > Read** (optional, for account ID lookup)

## API Token Security Best Practices

### Token Scope (Principle of Least Privilege)

Configure your Cloudflare API Token with minimal required permissions:

| Permission                        | Level | Required For          |
| --------------------------------- | ----- | --------------------- |
| Account > Workers Scripts > Edit  | Yes   | Deploy Workers        |
| Account > D1 > Edit               | Yes   | Run migrations        |
| Account > Account Settings > Read | No    | Optional (account ID) |

**Do NOT grant**:

- Zone-level permissions (unless using custom domains)
- Account > Workers KV > Edit (unless using KV)
- Account > Workers R2 > Edit (unless bucket permissions needed)

### Token Rotation

Rotate your API Token periodically (recommended: every 90 days).

**Rotation Steps**:

1. **Create new token** (Cloudflare Dashboard > API Tokens > Create Token)
2. **Update GitHub Secret** (Settings > Secrets > CLOUDFLARE_API_TOKEN)
3. **Test deployment** (trigger workflow on test branch)
4. **Revoke old token** (Cloudflare Dashboard > API Tokens > ... > Delete)

**Emergency Rotation** (if token compromised):

1. Immediately revoke compromised token in Cloudflare Dashboard
2. Create new token with same permissions
3. Update GitHub Secret
4. Audit recent deployments for unauthorized changes

### Token Audit

Check token usage in Cloudflare Dashboard:

- **Audit Logs**: Account > Audit Log
- **Filter by**: API Token name or action type

### Future: OIDC Migration

> **Note**: `wrangler-action` does not currently support OIDC authentication (as of November 2025).
>
> **Tracking**: https://github.com/cloudflare/wrangler-action
>
> When OIDC becomes available:
>
> - Add `id-token: write` permission to workflow
> - Remove `apiToken` from wrangler-action configuration
> - Delete CLOUDFLARE_API_TOKEN from GitHub Secrets

## Deployment Process

### 1. D1 Migrations

Migrations run automatically before deployment:

```bash
pnpm payload migrate
```

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

## Extended Rollback Guide

### Method 1: Wrangler CLI (Recommended)

The recommended approach for most rollback scenarios:

```bash
# List recent deployments
pnpm exec wrangler deployments list

# View deployment details
pnpm exec wrangler deployments view <deployment-id>

# Rollback to specific deployment
pnpm exec wrangler rollback <deployment-id>

# Rollback to previous deployment (most recent before current)
pnpm exec wrangler rollback
```

This method is fastest and maintains an audit trail in Cloudflare.

### Method 2: Cloudflare Dashboard

For visual rollback or when CLI is unavailable:

1. Go to **Workers & Pages** > Select your Worker
2. Click **Deployments** tab
3. Find the deployment to restore
4. Click **...** menu > **Rollback to this deployment**
5. Confirm rollback

The Dashboard provides visibility into deployment details and status.

### Method 3: Git Revert + Redeploy

For code-level rollback with audit trail:

```bash
# Identify the commit to revert to
git log --oneline -10

# Revert to specific commit
git revert <commit-sha>

# Push and trigger deployment
git push origin main
```

This approach creates a new commit with reversed changes, providing full git history.

### Rollback Considerations

Choose the right rollback method based on your scenario:

| Scenario                   | Recommended Method  | Notes                           |
| -------------------------- | ------------------- | ------------------------------- |
| Bad deployment (same code) | Wrangler CLI        | Fastest, no code change         |
| Code bug introduced        | Git revert          | Creates audit trail             |
| Database migration issue   | Manual intervention | Migrations cannot auto-rollback |
| Emergency (site down)      | Dashboard           | Fastest UI access               |

### Database Migration Rollback

> **Warning**: D1 migrations do NOT auto-rollback on deployment failure.

If a migration causes issues:

1. **Create reverse migration**: `pnpm payload migrate:create`
2. **Write SQL to undo changes** in new migration file
3. **Deploy** to apply reverse migration

For critical production issues:

1. Rollback deployment to previous version (using CLI or Dashboard)
2. Manually fix database via Cloudflare Dashboard > D1
3. Create and deploy reverse migration

## See Also

- [CI-CD-Security.md](/docs/specs/CI-CD-Security.md) - Security architecture
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
