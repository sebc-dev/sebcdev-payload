# Phase 2: Testing Strategy - Deployment Workflow Creation

This guide covers testing strategies for the deployment workflow implementation.

---

## Testing Overview

### Testing Scope

Phase 2 is primarily infrastructure/CI code, which requires different testing approaches than application code:

| Component             | Test Type                | Environment    |
| --------------------- | ------------------------ | -------------- |
| Workflow syntax       | YAML validation          | Local          |
| Workflow execution    | Manual workflow dispatch | GitHub Actions |
| D1 migrations         | Local dry-run            | Local + CI     |
| Wrangler deployment   | Local + CI execution     | Local + CI     |
| Deployment validation | Smoke tests              | CI             |

### No Unit Tests Required

This phase does not include application code, so traditional unit tests are not applicable. Instead, we focus on:

1. **Syntax validation**: YAML and script correctness
2. **Integration testing**: Full workflow execution
3. **Smoke testing**: Post-deployment verification

---

## Local Testing

### YAML Syntax Validation

Before pushing any workflow changes:

```bash
# Option 1: yamllint (recommended)
pip install yamllint
yamllint .github/workflows/quality-gate.yml

# Option 2: yq validation
yq eval '.' .github/workflows/quality-gate.yml > /dev/null && echo "Valid YAML"

# Option 3: VS Code
# Install YAML extension + GitHub Actions extension
# Red squiggles indicate syntax errors
```

### Shell Script Validation

For the bash scripts in workflow steps:

```bash
# Create a test script from workflow step
cat > /tmp/test-wait.sh << 'EOF'
URL="https://example.com"
MAX_RETRIES=3
RETRY_INTERVAL=1

for i in $(seq 1 $MAX_RETRIES); do
  if curl -s -f -o /dev/null "$URL"; then
    echo "Success at attempt $i"
    exit 0
  fi
  echo "Attempt $i/$MAX_RETRIES - Waiting ${RETRY_INTERVAL}s..."
  sleep $RETRY_INTERVAL
done
exit 1
EOF

# Validate syntax
bash -n /tmp/test-wait.sh && echo "Syntax OK"

# Test execution
bash /tmp/test-wait.sh
```

### Migration Dry-Run

Test migrations locally before CI:

```bash
# Ensure wrangler is authenticated
pnpm exec wrangler whoami

# Run migrations locally
pnpm payload migrate

# Verify tables were created/updated
pnpm exec wrangler d1 execute DB_NAME --command "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
```

### Local Deployment Test

Test deployment without CI:

```bash
# Build the application
pnpm build

# Deploy manually
pnpm exec wrangler deploy

# Verify deployment
curl -I https://your-worker.your-subdomain.workers.dev
```

---

## CI Testing

### Workflow Dispatch Testing

Test the workflow on a feature branch:

1. **Push your changes**

   ```bash
   git push origin feature/story-1.4-phase-2
   ```

2. **Trigger workflow manually**
   - Go to **Actions > Quality Gate**
   - Click **Run workflow**
   - Select your branch
   - Click **Run workflow**

3. **Monitor execution**
   - Watch each job in real-time
   - Check step outputs
   - Review annotations and summaries

### Progressive Testing Strategy

Test each commit's changes before moving to the next:

#### After Commit 1 (Deploy Job Skeleton)

Verify:

- [ ] Workflow parses without errors
- [ ] Deploy job appears in workflow visualization
- [ ] Deploy job shows "waiting" until quality-gate completes
- [ ] Deploy job runs after quality-gate succeeds

Expected behavior:

```
quality-gate: ✅ Passed
deploy: ✅ Passed (placeholder only)
```

#### After Commit 2 (D1 Migrations)

Verify:

- [ ] Migrations execute in CI logs
- [ ] Migration output is grouped correctly
- [ ] Notice annotation appears on success
- [ ] Job fails if migrations fail

Expected behavior:

```
::group::Running D1 Migrations
... migration output ...
::endgroup::
::notice::✅ D1 migrations completed successfully
```

#### After Commit 3 (Wrangler Deploy)

Verify:

- [ ] Deployment executes successfully
- [ ] Deployment URL appears in step output
- [ ] GitHub Summary shows deployment info
- [ ] Site is accessible at deployment URL

Expected behavior:

```
Deployment URL: https://your-worker.your-subdomain.workers.dev
## Deployment Successful (in Summary)
```

#### After Commit 4 (Validation)

Verify:

- [ ] Wait-for-URL polls and succeeds
- [ ] Smoke tests execute
- [ ] Results appear in logs
- [ ] Documentation is complete

Expected behavior:

```
Waiting for https://... to become available...
Attempt 1/30 - Waiting 2s...
::notice::✅ Deployment is live at https://...
::group::Testing Homepage
✅ Homepage returned 200 OK
::endgroup::
```

---

## Integration Testing

### Full Pipeline Test

After all commits, test the complete pipeline:

1. **Create a test PR to main**

   ```bash
   gh pr create --title "Test: Phase 2 Deployment" --body "Testing deployment workflow"
   ```

2. **Trigger Quality Gate**
   - Go to Actions > Quality Gate
   - Run workflow on PR branch

3. **Verify pipeline sequence**
   - Quality Gate runs all checks
   - Deploy job waits for Quality Gate
   - Migrations run before deploy
   - Deployment completes
   - Validation passes

4. **Check deployment**
   - Visit deployment URL
   - Verify homepage loads
   - Verify admin panel loads
   - Check for console errors

### Failure Scenario Testing

Test that failures are handled correctly:

#### Migration Failure

1. Create an invalid migration (locally, don't commit)
2. Trigger workflow
3. Verify:
   - [ ] Migration step fails
   - [ ] Deploy step is skipped
   - [ ] Error message is clear

#### Deployment Failure

1. Temporarily use invalid credentials
2. Trigger workflow
3. Verify:
   - [ ] Deployment step fails
   - [ ] Validation step is skipped
   - [ ] Error message indicates credential issue

#### Validation Failure

1. Deploy a version that returns 500
2. Verify:
   - [ ] Wait-for-URL times out
   - [ ] Error annotation appears
   - [ ] Workflow fails

---

## Smoke Test Details

### Homepage Test

Tests that the root URL returns 200:

```bash
URL="https://your-deployment-url"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")

if [ "$HTTP_STATUS" = "200" ]; then
  echo "PASS: Homepage returned 200"
else
  echo "FAIL: Homepage returned $HTTP_STATUS"
fi
```

### Admin Panel Test

Tests that /admin returns 200 or 302 (redirect to login):

```bash
URL="https://your-deployment-url/admin"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")

if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "302" ]; then
  echo "PASS: Admin returned $HTTP_STATUS"
else
  echo "FAIL: Admin returned $HTTP_STATUS"
fi
```

### API Health Check (Optional)

If an API health endpoint exists:

```bash
URL="https://your-deployment-url/api/health"
RESPONSE=$(curl -s "$URL")

if echo "$RESPONSE" | grep -q '"status":"ok"'; then
  echo "PASS: API health check passed"
else
  echo "FAIL: API health check failed"
fi
```

---

## Monitoring Test Results

### GitHub Actions UI

1. **Job Summary**: Check for deployment URL and status
2. **Annotations**: Look for notices, warnings, errors
3. **Step Logs**: Expand individual steps for details

### Cloudflare Dashboard

1. **Workers & Pages**: View deployment history
2. **Logs**: Check for runtime errors
3. **Analytics**: Monitor request patterns

---

## Test Checklist Summary

### Before Pushing Each Commit

- [ ] YAML syntax valid (no linter errors)
- [ ] Shell scripts validated (`bash -n`)
- [ ] Local tests pass (migrations, deployment)

### After Each Commit Push

- [ ] Workflow runs without syntax errors
- [ ] New functionality works as expected
- [ ] Previous functionality still works
- [ ] Logs show expected output

### After All Commits

- [ ] Full pipeline executes successfully
- [ ] Deployment URL is accessible
- [ ] Homepage loads correctly
- [ ] Admin panel is accessible
- [ ] Documentation is accurate

### Failure Scenarios Tested

- [ ] Migration failure is handled
- [ ] Deployment failure is handled
- [ ] Validation timeout is handled
- [ ] Error messages are clear

---

## Troubleshooting Test Failures

### YAML Syntax Error

```
Error: .github/workflows/quality-gate.yml: error parsing
```

**Solution**: Check indentation (must be 2 spaces), check for missing colons or quotes.

### Secret Not Found

```
Error: Input required and not supplied: apiToken
```

**Solution**: Verify secret name matches exactly in GitHub Secrets.

### Migration Timeout

```
Error: D1 migration timed out
```

**Solution**: Check database connectivity, verify credentials, try manual migration.

### Deployment Failed

```
Error: wrangler deploy failed
```

**Solution**: Check API token permissions, verify wrangler.jsonc, try manual deploy.

### Validation Timeout

```
Error: Deployment URL not reachable after 60s
```

**Solution**: Increase timeout, check Cloudflare propagation, verify URL is correct.

---

**Testing Guide Created**: 2025-11-29
**Last Updated**: 2025-11-29
