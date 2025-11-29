# Phase 3: Implementation Plan - Security Best Practices & Validation

**Phase**: 3 of 3 (active)
**Estimated Duration**: 0.5-1 day
**Estimated Commits**: 3
**Complexity**: Low

---

## Implementation Strategy

### Approach

This phase follows a **documentation-first** strategy:

1. Extend existing DEPLOYMENT.md with security practices and rollback details
2. Create comprehensive developer workflow guide
3. Update CLAUDE.md and add OIDC future tracking note

### Atomic Commit Principles

Each commit in this phase:

- Adds complete documentation for one topic
- Is self-contained and reviewable
- Can be reviewed independently in 15-30 minutes
- Maintains document consistency

---

## Commit 1: Extend DEPLOYMENT.md (Security + Rollback)

### Objective

Add comprehensive API Token security section and extend rollback documentation with CLI commands and Dashboard instructions.

### Changes

**File**: `docs/guides/DEPLOYMENT.md`

Add after the existing "Required Secrets" section:

````markdown
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

## Extended Rollback Guide

### Method 1: Wrangler CLI (Recommended)

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
````

### Method 2: Cloudflare Dashboard

1. Go to **Workers & Pages** > Select your Worker
2. Click **Deployments** tab
3. Find the deployment to restore
4. Click **...** menu > **Rollback to this deployment**
5. Confirm rollback

### Method 3: Git Revert + Redeploy

For code-level rollback:

```bash
# Identify the commit to revert to
git log --oneline -10

# Revert to specific commit
git revert <commit-sha>

# Push and trigger deployment
git push origin main
```

### Rollback Considerations

| Scenario                   | Recommended Method  | Notes                           |
| -------------------------- | ------------------- | ------------------------------- |
| Bad deployment (same code) | Wrangler CLI        | Fastest, no code change         |
| Code bug introduced        | Git revert          | Creates audit trail             |
| Database migration issue   | Manual intervention | Migrations cannot auto-rollback |
| Emergency (site down)      | Dashboard           | Fastest UI access               |

### Database Migration Rollback

> **Warning**: D1 migrations do NOT auto-rollback.

If a migration causes issues:

1. **Create reverse migration**: `pnpm payload migrate:create`
2. **Write SQL to undo changes** in new migration file
3. **Deploy** to apply reverse migration

For critical production issues:

1. Rollback deployment to previous version
2. Manually fix database via Cloudflare Dashboard > D1

```

### Verification Steps

1. Review extended DEPLOYMENT.md for accuracy
2. Test rollback commands locally (dry-run)
3. Verify Cloudflare Dashboard instructions match current UI

### Commit Message

```

📝 Extend DEPLOYMENT.md with security practices and rollback guide

- Add API Token security section (scope, rotation, audit)
- Add OIDC future migration note with tracking URL
- Extend rollback documentation (CLI, Dashboard, Git revert)
- Add database migration rollback considerations

Phase 3 Commit 1/3 - Story 1.4

````

### Estimated Size

- Lines added: ~100
- Files changed: 1
- Review time: 20 minutes

---

## Commit 2: Create DEVELOPER_WORKFLOW.md

### Objective

Create a comprehensive guide documenting the end-to-end developer workflow from local development to production deployment.

### Changes

**File**: `docs/guides/DEVELOPER_WORKFLOW.md` (new)

```markdown
# Developer Workflow Guide

## Overview

This guide documents the complete developer workflow for this project, from local development to production deployment.

## Workflow Diagram

````

Local Development
↓
Git Commit
↓
Push to Branch
↓
Create Pull Request
↓
┌──────────────────────┐
│ Quality Gate (Auto) │ ← Triggered on PR
│ - Socket.dev scan │
│ - ESLint/Prettier │
│ - Knip dead code │
│ - Type sync check │
│ - Next.js build │
│ - Architecture │
└──────────────────────┘
↓ (must pass)
Code Review
↓
Merge to main
↓
┌──────────────────────┐
│ Deploy Job (Auto) │ ← Triggered on main
│ - D1 migrations │
│ - Wrangler deploy │
│ - Wait-for-URL │
│ - Smoke tests │
└──────────────────────┘
↓
Production Live

````

## 1. Local Development

### Setup

```bash
# Clone repository
git clone <repo-url>
cd sebcdev-payload

# Install dependencies
pnpm install

# Start development server
pnpm dev
````

### Available Commands

| Command               | Description                 |
| --------------------- | --------------------------- |
| `pnpm dev`            | Start dev server (Wrangler) |
| `pnpm devsafe`        | Clean start (removes .next) |
| `pnpm build`          | Build Next.js application   |
| `pnpm lint`           | Run ESLint                  |
| `pnpm generate:types` | Generate all types          |
| `pnpm test:int`       | Run integration tests       |
| `pnpm test:e2e`       | Run E2E tests               |

### Pre-Commit Checklist

Before committing, run:

```bash
pnpm lint                    # Fix linting issues
pnpm generate:types:payload  # Sync Payload types
pnpm build                   # Verify build works
```

## 2. Git Workflow

### Branch Naming

```
feature/<description>    # New features
fix/<description>        # Bug fixes
docs/<description>       # Documentation only
refactor/<description>   # Code refactoring
```

### Commit Messages

Use [Gitmoji](https://gitmoji.dev/) format:

```
<emoji> <message>

Examples:
✨ Add user authentication
🐛 Fix login redirect loop
📝 Update API documentation
♻️ Refactor database queries
```

### Creating a PR

1. Push your branch: `git push origin feature/my-feature`
2. Create PR via GitHub UI or CLI: `gh pr create`
3. Fill in PR template with description and test plan
4. Wait for Quality Gate to pass

## 3. Quality Gate

The Quality Gate runs automatically on every PR targeting `main`.

### Checks Performed

| Check        | Tool               | Failure Means               |
| ------------ | ------------------ | --------------------------- |
| Supply Chain | Socket.dev         | Suspicious package detected |
| Linting      | ESLint             | Code style violations       |
| Formatting   | Prettier           | Formatting inconsistencies  |
| Dead Code    | Knip               | Unused exports/imports      |
| Type Sync    | Payload CLI        | Types out of sync           |
| Build        | Next.js            | Compilation errors          |
| Architecture | dependency-cruiser | Forbidden imports           |

### If Quality Gate Fails

1. Click on the failed check in GitHub
2. Read the error message
3. Fix locally and push
4. Quality Gate re-runs automatically

### Manual Trigger

For `workflow_dispatch` enabled workflows:

1. Go to Actions tab
2. Select "Quality Gate"
3. Click "Run workflow"
4. Select your branch

## 4. Code Review

### Reviewer Checklist

- [ ] Code follows project conventions
- [ ] No security vulnerabilities introduced
- [ ] Tests cover new functionality
- [ ] Documentation updated if needed
- [ ] Commit messages follow Gitmoji format

### Merging

After approval:

1. Ensure branch is up-to-date with main
2. Squash and merge (or merge commit based on preference)
3. Delete feature branch

## 5. Deployment

Deployment triggers automatically when:

- Quality Gate passes on `main` branch
- Push to `main` (after merge)

### What Happens

1. **D1 Migrations**: `pnpm payload migrate`
2. **Build**: `pnpm build` (via OpenNext)
3. **Deploy**: `wrangler deploy`
4. **Validate**: Wait-for-URL + Smoke tests

### Monitoring Deployment

- **GitHub Actions**: Actions tab > Quality Gate workflow
- **Cloudflare Dashboard**: Workers & Pages > Your Worker

### Deployment URL

After successful deployment:

- Check GitHub Actions Summary for deployment URL
- Visit Cloudflare Dashboard for deployment details

## 6. Troubleshooting

### Common Issues

| Issue                | Solution                          |
| -------------------- | --------------------------------- |
| Quality Gate timeout | Re-run workflow                   |
| Type sync failure    | Run `pnpm generate:types:payload` |
| Build fails in CI    | Check for env var differences     |
| Deploy fails         | Check Cloudflare API Token        |
| Site not accessible  | Wait 1-2 min for propagation      |

### Getting Help

- Check existing documentation in `docs/`
- Review CI-CD-Security.md for pipeline details
- Check Cloudflare status page for outages

## Quick Reference

```bash
# Daily workflow
git checkout -b feature/my-feature
# ... make changes ...
pnpm lint && pnpm build
git add . && git commit -m "✨ Add feature"
git push origin feature/my-feature
gh pr create

# After merge
git checkout main
git pull origin main
# Deployment happens automatically
```

## See Also

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment details and rollback
- [CI-CD-Security.md](/docs/specs/CI-CD-Security.md) - Security architecture
- [CLAUDE.md](/CLAUDE.md) - Project overview and commands

```

### Verification Steps

1. Verify workflow matches actual pipeline behavior
2. Test commands in development environment
3. Ensure links to other docs work

### Commit Message

```

📝 Create DEVELOPER_WORKFLOW.md guide

- Document complete workflow (dev → deploy)
- Add workflow diagram and pre-commit checklist
- Document Quality Gate checks and troubleshooting
- Add quick reference commands

Phase 3 Commit 2/3 - Story 1.4

````

### Estimated Size

- Lines added: ~200
- Files changed: 1 (new file)
- Review time: 30 minutes

---

## Commit 3: Update CLAUDE.md + Finalize

### Objective

Update CLAUDE.md with comprehensive CI/CD section and ensure all documentation cross-references are correct.

### Changes

**File**: `CLAUDE.md`

Update the "CI/CD Pipeline & Security" section with more comprehensive information:

```markdown
## CI/CD Pipeline & Security

### Quality Gate Workflow

Le projet utilise un pipeline CI/CD "AI-Shield" avec validation multi-couches pour détecter les hallucinations IA et garantir la qualité du code.

**Stratégie de déclenchement**:
- `pull_request` sur main: Exécution automatique
- `workflow_dispatch`: Déclenchement manuel disponible

```bash
# Checks locaux avant push (recommandé)
pnpm lint                    # ESLint + Prettier
pnpm generate:types:payload  # Sync types Payload → TypeScript
pnpm build                   # Next.js build (no-DB mode)
pnpm test                    # Tests unitaires + E2E
````

### Deployment Pipeline

Déploiement automatique après Quality Gate sur `main`:

```bash
# Pipeline de déploiement
Quality Gate → D1 Migrations → Wrangler Deploy → Validation
```

**Commandes de déploiement manuel**:

```bash
# Exécuter les migrations
pnpm payload migrate

# Déployer manuellement
pnpm exec wrangler deploy

# Lister les déploiements
pnpm exec wrangler deployments list

# Rollback
pnpm exec wrangler rollback [deployment-id]
```

### Authentication (API Token)

Le déploiement utilise un API Token Cloudflare via GitHub Secrets:

- `CLOUDFLARE_API_TOKEN`: Token avec permissions Workers + D1
- `CLOUDFLARE_ACCOUNT_ID`: Identifiant du compte

> **Note**: OIDC n'est pas encore supporté par wrangler-action.
> Tracking: https://github.com/cloudflare/wrangler-action

### Documentation

- [DEPLOYMENT.md](/docs/guides/DEPLOYMENT.md) - Guide de déploiement complet
- [DEVELOPER_WORKFLOW.md](/docs/guides/DEVELOPER_WORKFLOW.md) - Workflow développeur
- [CI-CD-Security.md](/docs/specs/CI-CD-Security.md) - Architecture de sécurité

```

### Verification Steps

1. Verify CLAUDE.md format consistency
2. Verify all referenced docs exist
3. Test linked URLs

### Commit Message

```

📝 Update CLAUDE.md with comprehensive CI/CD section

- Expand CI/CD Pipeline & Security section
- Add deployment commands and rollback
- Add OIDC tracking note
- Link to new documentation

Phase 3 Commit 3/3 - Story 1.4

```

### Estimated Size

- Lines added: ~50
- Files changed: 1
- Review time: 15 minutes

---

## Implementation Order Summary

```

Commit 1: DEPLOYMENT.md (security + rollback)
↓ (extends existing doc)
Commit 2: DEVELOPER_WORKFLOW.md (new)
↓ (creates workflow guide)
Commit 3: CLAUDE.md + finalize
↓ (updates project overview)
Phase 3 Complete

```

---

## Rollback Strategy

If any commit introduces issues:

1. **Documentation error**: Fix in subsequent commit
2. **Broken links**: Verify paths and fix
3. **Format issues**: Adjust markdown formatting

Each commit is documentation-only, so rollback is straightforward.

---

## Post-Implementation

After all 3 commits are complete:

1. Create PR from feature branch to main
2. Ensure Quality Gate passes
3. Review documentation for accuracy
4. Merge PR
5. Update EPIC_TRACKING.md with Phase 3 completion
6. Mark Story 1.4 as completed (3/3 active phases)

---

**Plan Created**: 2025-11-29
**Last Updated**: 2025-11-29
```
