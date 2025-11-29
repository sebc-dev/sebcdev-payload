# Phase 2: Code Review Guide - Deployment Workflow Creation

This guide helps reviewers evaluate the Phase 2 implementation commit by commit.

---

## Review Principles

### Focus Areas for CI/CD Code

1. **Security**: Secrets handling, permissions, SHA pinning
2. **Reliability**: Error handling, retry logic, graceful failures
3. **Maintainability**: Clear structure, documentation, naming
4. **Traceability**: Logging, annotations, summaries

### Time Estimates

| Commit    | Estimated Review Time |
| --------- | --------------------- |
| 1         | 15 minutes            |
| 2         | 15 minutes            |
| 3         | 20 minutes            |
| 4         | 30 minutes            |
| **Total** | ~80 minutes           |

---

## Commit 1 Review: Deploy Job Skeleton

### Security Checklist

- [ ] **Permissions are minimal**: Only `contents: read` for checkout
- [ ] **SHA pinning**: All actions use full SHA, not tags
- [ ] **No secrets exposed**: No hardcoded values or echo of secrets

### Structure Checklist

- [ ] **Job placement**: After `quality-gate` job
- [ ] **Dependency**: `needs: [quality-gate]` is correct
- [ ] **Conditional**: `if:` condition is appropriate

### Questions to Ask

1. Is the `if:` condition correct for deployment triggers?
   - Should deploy on `main` branch pushes
   - Should deploy on manual workflow dispatch
   - Should NOT deploy on PR events

2. Are the SHA versions current?
   - Check if newer versions exist for actions/checkout
   - Check if newer versions exist for pnpm/action-setup
   - Check if newer versions exist for actions/setup-node

3. Is the job naming consistent?
   - Job key: `deploy`
   - Job name: "Deploy to Cloudflare"

### Example Correct Implementation

```yaml
deploy:
  name: Deploy to Cloudflare
  needs: [quality-gate]
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main' || github.event_name == 'workflow_dispatch'

  permissions:
    contents: read

  steps:
    - name: Checkout repository
      uses: actions/checkout@1af3b93b6815bc44a9784bd300feb67ff0d1eeb3 # v6.0.0
```

---

## Commit 2 Review: D1 Migration Step

### Security Checklist

- [ ] **Secrets properly referenced**: Uses `${{ secrets.NAME }}` syntax
- [ ] **No secret echo**: Secrets are not printed to logs
- [ ] **Environment isolation**: Secrets are scoped to the step

### Reliability Checklist

- [ ] **Error handling**: Step will fail on migration error
- [ ] **Logging**: Migration output is visible for debugging
- [ ] **Clear success indicator**: Notice annotation on completion

### Questions to Ask

1. Are all required secrets used?
   - CLOUDFLARE_API_TOKEN
   - CLOUDFLARE_ACCOUNT_ID
   - PAYLOAD_SECRET

2. Is the migration command correct?
   - Should be `pnpm payload migrate`
   - Not `pnpm payload migrate:create` (that creates new migrations)

3. What happens if migrations fail?
   - Step should exit with non-zero code
   - Deployment should NOT proceed

### Example Correct Implementation

```yaml
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
```

### Red Flags

- **Never**: `echo $CLOUDFLARE_API_TOKEN`
- **Never**: `run: pnpm payload migrate --token ${{ secrets.CLOUDFLARE_API_TOKEN }}`
- **Never**: Hard-coded credentials

---

## Commit 3 Review: Wrangler Deploy Integration

### Security Checklist

- [ ] **SHA pinned**: wrangler-action uses full SHA
- [ ] **Secrets via inputs**: Not environment variables where possible
- [ ] **Minimal permissions**: No unnecessary permissions added

### Reliability Checklist

- [ ] **Step has ID**: `id: deploy` for output reference
- [ ] **Output captured**: deployment-url is accessible
- [ ] **Summary created**: GitHub Step Summary is populated

### Questions to Ask

1. Is the wrangler-action version current and SHA-pinned?
   - Check: `cloudflare/wrangler-action@SHA # version comment`

2. Is the deploy command correct?
   - `command: deploy` uses wrangler deploy
   - Respects `wrangler.jsonc` configuration

3. Is the Step Summary properly formatted?
   - Uses markdown syntax
   - Includes deployment URL
   - Includes commit SHA for traceability

### Example Correct Implementation

```yaml
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
```

### Red Flags

- **Never**: Using version tags (`@v3` instead of SHA)
- **Never**: Hardcoding the deployment URL
- **Never**: Missing `id:` on deploy step (breaks output reference)

---

## Commit 4 Review: Validation & Documentation

### Workflow Changes Review

#### Wait-for-URL Step

- [ ] **Retry logic**: Reasonable limits (30 retries x 2s = 60s)
- [ ] **Timeout**: Not too short (< 30s) or too long (> 120s)
- [ ] **Exit codes**: 0 on success, 1 on failure
- [ ] **Error annotation**: `::error::` on timeout

#### Smoke Test Step

- [ ] **Endpoints tested**: Homepage and admin panel
- [ ] **Expected codes**: 200 for homepage, 200 or 302 for admin
- [ ] **Non-blocking warnings**: Uses `::warning::` not `::error::` for unexpected codes
- [ ] **Grouped output**: Uses `::group::` for organization

### Questions to Ask - Workflow

1. Is the retry logic appropriate?
   - Too few retries may fail on slow propagation
   - Too many retries waste CI time

2. Are the smoke tests comprehensive enough?
   - Testing key endpoints
   - Handling expected status codes

3. What happens if smoke tests fail?
   - Should be warnings, not errors (deployment already happened)
   - Or should they fail the deployment?

### Documentation Review

#### Structure

- [ ] **Overview section**: Clear explanation of deployment pipeline
- [ ] **Required secrets**: All secrets documented
- [ ] **Permissions**: API token permissions documented
- [ ] **Manual deployment**: Commands for manual deployment
- [ ] **Troubleshooting**: Common issues and solutions
- [ ] **Rollback**: Clear rollback procedure

#### Accuracy

- [ ] **Commands are correct**: Test each command mentioned
- [ ] **Links work**: All external links are valid
- [ ] **Consistent naming**: Secret names match workflow

### Questions to Ask - Documentation

1. Can a new developer follow this guide successfully?
2. Are error scenarios covered in troubleshooting?
3. Is the rollback procedure tested?

### Example Correct Implementation - Wait for URL

```yaml
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
```

---

## Cross-Commit Review Points

### Consistency Check

After reviewing all commits, verify:

- [ ] All actions use same SHA pinning style
- [ ] All steps use consistent naming pattern
- [ ] All secrets are referenced consistently
- [ ] Logging/annotation style is consistent

### Integration Check

- [ ] Deploy job correctly depends on quality-gate
- [ ] Migration runs before deploy
- [ ] Validation runs after deploy
- [ ] Summary shows complete deployment info

### Security Final Check

- [ ] No secrets in logs
- [ ] No hardcoded credentials
- [ ] Minimal permissions
- [ ] SHA pinning throughout

---

## Approval Criteria

### Must Have

- [ ] All security checklists pass
- [ ] All reliability checklists pass
- [ ] No hardcoded secrets or credentials
- [ ] SHA pinning on all actions
- [ ] Documentation is accurate

### Nice to Have

- [ ] Comprehensive smoke tests
- [ ] Detailed troubleshooting guide
- [ ] Performance optimization notes

### Blocking Issues

These issues MUST be fixed before approval:

1. **Security**: Any secret exposure or missing permissions
2. **Correctness**: Wrong commands or broken syntax
3. **Reliability**: Missing error handling on critical steps

---

## Review Workflow

### Before Starting

1. Read the IMPLEMENTATION_PLAN.md
2. Understand the phase objectives
3. Check Phase 1 is complete

### During Review

1. Review each commit independently
2. Use the checklists in this document
3. Note questions and concerns
4. Test workflow if possible

### After Review

1. Approve or request changes
2. Document any concerns
3. Verify fixes if changes requested

---

**Review Guide Created**: 2025-11-29
**Last Updated**: 2025-11-29
