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
