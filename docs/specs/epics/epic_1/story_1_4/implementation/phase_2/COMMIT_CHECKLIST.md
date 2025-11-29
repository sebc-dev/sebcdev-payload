# Phase 2: Commit Checklist - Deployment Workflow Creation

Use this checklist to verify each commit before pushing. Check off items as you complete them.

---

## Commit 1: Add Deploy Job Skeleton

### Pre-Implementation

- [ ] Read the current `quality-gate.yml` workflow
- [ ] Understand the existing job structure
- [ ] Verify branch protection is configured (Phase 1 complete)

### Implementation

- [ ] Add `deploy` job after `quality-gate` job
- [ ] Configure `needs: [quality-gate]` dependency
- [ ] Add conditional `if:` for main branch or workflow_dispatch
- [ ] Set minimal permissions (`contents: read`)
- [ ] Add checkout step with SHA-pinned action
- [ ] Add pnpm setup step with SHA-pinned action
- [ ] Add Node.js setup step with SHA-pinned action
- [ ] Add pnpm install step
- [ ] Add placeholder step for deployment

### Verification

- [ ] YAML syntax is valid (no red squiggles in editor)
- [ ] All action versions are SHA-pinned
- [ ] Job name is descriptive: "Deploy to Cloudflare"
- [ ] `needs` array includes `quality-gate`
- [ ] Conditional logic is correct for deployment triggers

### Post-Implementation

- [ ] Run `pnpm lint` - passes
- [ ] Run local YAML validation (optional: `yamllint`)
- [ ] Commit with message following convention

### Commit Message Template

```
🔧 Add deploy job skeleton to quality-gate workflow

- Add deploy job with needs: [quality-gate] dependency
- Configure conditional execution (main branch or manual)
- Setup Node.js and pnpm for deployment steps
- Placeholder for actual deployment logic

Phase 2 Commit 1/4 - Story 1.4
```

---

## Commit 2: Add D1 Migration Step

### Pre-Implementation

- [ ] Verify Cloudflare secrets exist in GitHub repository settings
- [ ] Test migration command locally: `pnpm payload migrate`
- [ ] Review migration files in `src/migrations/`

### Implementation

- [ ] Replace placeholder step with migration step
- [ ] Add environment variables for Cloudflare credentials
- [ ] Add PAYLOAD_SECRET environment variable
- [ ] Use `::group::` for log organization
- [ ] Add `::notice::` annotation for success
- [ ] Keep a new placeholder for deploy step

### Verification

- [ ] Environment variables use correct secret names
- [ ] Secrets referenced with `${{ secrets.SECRET_NAME }}` syntax
- [ ] Migration command is correct: `pnpm payload migrate`
- [ ] Log grouping is properly opened and closed
- [ ] YAML indentation is correct (2 spaces)

### Required Secrets Checklist

| Secret                | Configured |
| --------------------- | ---------- |
| CLOUDFLARE_API_TOKEN  | [ ]        |
| CLOUDFLARE_ACCOUNT_ID | [ ]        |
| PAYLOAD_SECRET        | [ ]        |

### Post-Implementation

- [ ] Run `pnpm lint` - passes
- [ ] Push to test branch and verify job runs
- [ ] Check GitHub Actions logs for migration output
- [ ] Commit with message following convention

### Commit Message Template

```
🔧 Add D1 migration step to deploy job

- Execute payload migrate before deployment
- Configure Cloudflare credentials from secrets
- Add grouped logging for migration output
- Add notice annotation for successful completion

Phase 2 Commit 2/4 - Story 1.4
```

---

## Commit 3: Add Wrangler Deploy Integration

### Pre-Implementation

- [ ] Find latest SHA for cloudflare/wrangler-action
- [ ] Review wrangler-action documentation
- [ ] Verify `wrangler.jsonc` configuration is correct
- [ ] Test deployment locally: `pnpm exec wrangler deploy`

### Implementation

- [ ] Remove placeholder step
- [ ] Add wrangler-action step with SHA-pinned version
- [ ] Configure apiToken and accountId inputs
- [ ] Set `command: deploy`
- [ ] Add id `deploy` for output reference
- [ ] Add PAYLOAD_SECRET to env
- [ ] Add GitHub Step Summary output step

### Verification

- [ ] Wrangler action is SHA-pinned (not version tag)
- [ ] Step has `id: deploy` for output reference
- [ ] Summary uses correct output: `${{ steps.deploy.outputs.deployment-url }}`
- [ ] PAYLOAD_SECRET is passed to wrangler environment
- [ ] Summary markdown is valid

### Wrangler Action SHA Verification

```bash
# Get SHA for a specific version tag
git ls-remote --tags https://github.com/cloudflare/wrangler-action.git | grep v3
```

### Post-Implementation

- [ ] Run `pnpm lint` - passes
- [ ] Push to test branch and trigger deployment
- [ ] Verify deployment URL appears in GitHub Summary
- [ ] Verify site is accessible at deployment URL
- [ ] Commit with message following convention

### Commit Message Template

```
🚀 Add wrangler deploy integration

- Integrate cloudflare/wrangler-action@v3 (SHA-pinned)
- Configure API token and account ID from secrets
- Output deployment URL to GitHub Step Summary
- Include commit SHA for traceability

Phase 2 Commit 3/4 - Story 1.4
```

---

## Commit 4: Add Deployment Validation & Documentation

### Pre-Implementation

- [ ] Review wait-for-url patterns in CI documentation
- [ ] Plan smoke test endpoints
- [ ] Outline DEPLOYMENT.md structure

### Implementation - Workflow

- [ ] Add "Wait for Deployment Availability" step
- [ ] Configure retry logic (30 retries x 2 seconds = 60s max)
- [ ] Add curl-based availability check
- [ ] Add success notice annotation
- [ ] Add error annotation on timeout
- [ ] Add "Smoke Test" step
- [ ] Test homepage (/) returns 200
- [ ] Test admin panel (/admin) returns 200 or 302
- [ ] Use log groups for organization

### Implementation - Documentation

- [ ] Create `docs/guides/DEPLOYMENT.md`
- [ ] Document deployment pipeline overview
- [ ] Document trigger conditions
- [ ] Document required secrets
- [ ] Document API token permissions
- [ ] Document deployment process steps
- [ ] Document manual deployment commands
- [ ] Document monitoring options
- [ ] Document troubleshooting guide
- [ ] Document rollback procedure

### Verification - Workflow

- [ ] Retry logic has reasonable limits (30 retries, 2s interval)
- [ ] Curl commands use correct flags (`-s -f -o /dev/null`)
- [ ] Exit codes are correct (0 for success, 1 for failure)
- [ ] Smoke tests handle expected status codes
- [ ] Warnings vs errors are used appropriately

### Verification - Documentation

- [ ] All code blocks have language tags
- [ ] All secrets are documented
- [ ] All commands are tested and correct
- [ ] Links to external docs are valid
- [ ] Troubleshooting covers common issues

### Post-Implementation

- [ ] Run `pnpm lint` - passes
- [ ] Push to test branch and trigger full deployment
- [ ] Verify wait-for-url polls correctly
- [ ] Verify smoke tests execute and report
- [ ] Review DEPLOYMENT.md in GitHub preview
- [ ] Commit with message following convention

### Commit Message Template

```
📝 Add deployment validation and documentation

- Add wait-for-url pattern with retry logic
- Add smoke tests for homepage and admin panel
- Create comprehensive DEPLOYMENT.md guide
- Document secrets, process, and troubleshooting

Phase 2 Commit 4/4 - Story 1.4
```

---

## Phase Completion Checklist

After all commits are merged:

### Functional Verification

- [ ] Deploy job executes only after quality-gate passes
- [ ] D1 migrations run successfully
- [ ] Wrangler deploy completes successfully
- [ ] Deployment URL is correct and accessible
- [ ] Wait-for-url validates deployment availability
- [ ] Smoke tests pass for homepage and admin
- [ ] GitHub Summary shows deployment details

### Documentation Verification

- [ ] DEPLOYMENT.md is accurate and complete
- [ ] All secrets are documented
- [ ] Troubleshooting guide is helpful
- [ ] Rollback procedure is documented

### Integration Verification

- [ ] Full pipeline works: Quality Gate -> Deploy
- [ ] Branch protection prevents direct pushes
- [ ] Manual workflow dispatch works
- [ ] Deployment time is acceptable (< 5 min)

### Update Tracking

- [ ] Update PHASES_PLAN.md progress section
- [ ] Update EPIC_TRACKING.md with Phase 2 completion
- [ ] Note actual duration vs estimated

---

## Quick Reference

### GitHub Actions Annotations

```yaml
# Notice (informational)
echo "::notice::Message"

# Warning (yellow)
echo "::warning::Message"

# Error (red, fails step)
echo "::error::Message"

# Group logs
echo "::group::Group Title"
# ... commands ...
echo "::endgroup::"
```

### Secrets Syntax

```yaml
# Reference a secret
${{ secrets.SECRET_NAME }}

# Use in env block
env:
  MY_VAR: ${{ secrets.SECRET_NAME }}
```

### Step Outputs

```yaml
# Set output in step
- id: my-step
  run: echo "result=value" >> $GITHUB_OUTPUT

# Use output in subsequent step
- run: echo "${{ steps.my-step.outputs.result }}"
```

### GitHub Step Summary

```yaml
# Append to summary
echo "## Title" >> $GITHUB_STEP_SUMMARY
echo "Content" >> $GITHUB_STEP_SUMMARY
```

---

**Checklist Created**: 2025-11-29
**Last Updated**: 2025-11-29
