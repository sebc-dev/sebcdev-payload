# Phase 2: Testing Guide - Supply Chain Security (Socket.dev)

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Phase**: 2 of 8

---

## Testing Overview

Phase 2 focuses on Socket.dev configuration and integration. Testing primarily involves:

- Configuration validation
- Workflow execution verification
- Security policy testing

There are no unit tests for this phase as it's configuration-only.

---

## Test Categories

| Category           | Type  | Automation           |
| ------------------ | ----- | -------------------- |
| YAML Syntax        | Local | Automated (linter)   |
| Workflow Execution | CI    | Manual trigger       |
| Security Policy    | CI    | Manual verification  |
| Ignore Mechanism   | CI    | Optional manual test |

---

## YAML Syntax Testing

### Local Validation

Before committing, validate YAML syntax locally:

```bash
# Using yq (recommended)
yq eval 'true' socket.yml && echo "Valid YAML"

# Using Node.js
npx yaml lint socket.yml

# Using Python
python -c "import yaml; yaml.safe_load(open('socket.yml'))"
```

### VS Code Validation

If using VS Code with YAML extension:

1. Open `socket.yml`
2. Check for red squiggles (syntax errors)
3. Hover over issues for details

### Expected Validation Output

```
# Valid file
$ yq eval 'true' socket.yml
true

# Invalid file example
$ yq eval 'true' socket.yml
Error: yaml: line 5: found character that cannot start any token
```

---

## Workflow Execution Testing

### Test 1: Manual Workflow Trigger

**Purpose**: Verify Socket.dev step executes correctly

**Steps**:

1. Push all commits to GitHub
2. Navigate to Actions tab
3. Select "Quality Gate" workflow
4. Click "Run workflow"
5. Select branch and run

**Expected Results**:

- [ ] Workflow starts successfully
- [ ] All setup steps complete (checkout, pnpm, node)
- [ ] Socket.dev step appears in job log
- [ ] Socket.dev step completes (green or yellow)
- [ ] No error messages in step output

### Test 2: Step Timing

**Purpose**: Verify Socket.dev doesn't slow down the pipeline

**Steps**:

1. Run workflow as in Test 1
2. Check Socket.dev step duration

**Expected Results**:

- [ ] Socket.dev step completes in < 30 seconds
- [ ] Total workflow time remains < 2 minutes

### Test 3: Cache Utilization

**Purpose**: Verify Socket CLI caching works

**Steps**:

1. Run workflow twice
2. Compare Socket.dev step logs between runs

**Expected Results**:

- [ ] Second run shows cache hit message
- [ ] Second run is faster for Socket step

---

## Security Policy Testing

### Test 4: Clean Codebase Scan

**Purpose**: Verify no false positives on existing dependencies

**Steps**:

1. Run workflow on current codebase
2. Review Socket.dev step output

**Expected Results**:

- [ ] No blocking alerts
- [ ] Any warnings are expected (review manually)
- [ ] Step passes (green or yellow, not red)

### Test 5: License Policy Verification

**Purpose**: Verify GPL/AGPL packages would be blocked

**Method**: Review-based (not automated)

**Verification Steps**:

1. Open `socket.yml`
2. Verify `licensePolicies.deny` includes:
   - `GPL-2.0-only`
   - `GPL-2.0-or-later`
   - `GPL-3.0-only`
   - `GPL-3.0-or-later`
   - `AGPL-3.0-only`
   - `AGPL-3.0-or-later`

**Expected Results**:

- [ ] All GPL variants listed
- [ ] All AGPL variants listed

### Test 6: License Policy Functional Test (Optional)

**Purpose**: Verify license blocking actually works

**Warning**: This test temporarily adds a GPL package. Revert immediately.

**Steps**:

```bash
# Create test branch
git checkout -b test/license-policy

# Add a GPL package (for testing only)
pnpm add --save-dev readline-sync  # GPL-3.0

# Commit and push
git add pnpm-lock.yaml package.json
git commit -m "test: verify GPL blocking"
git push origin test/license-policy

# Trigger workflow
# Check Socket.dev output for license alert
```

**Expected Results**:

- [ ] Socket.dev detects GPL license
- [ ] Alert shows blocking severity

**Cleanup**:

```bash
git checkout story_1_3
git branch -D test/license-policy
git push origin --delete test/license-policy
```

---

## Ignore Mechanism Testing (Optional)

### Test 7: @SocketSecurity Ignore Command

**Purpose**: Verify the ignore mechanism works

**Prerequisites**:

- Socket.dev GitHub App installed
- PR context (not just push)

**Steps**:

1. Create a PR with an alert-triggering package
2. Note the package name and version from alert
3. Post comment: `@SocketSecurity ignore <package>@<version>`
4. Wait for Socket.dev to re-scan

**Expected Results**:

- [ ] Socket.dev bot responds to comment
- [ ] Re-scan occurs
- [ ] Alert is ignored
- [ ] Check status updates

**Note**: This test is optional and requires a real PR context.

---

## Error Scenario Testing

### Test 8: Service Unavailability

**Purpose**: Verify `continue-on-error` works

**Method**: Review-based

**Verification**:

1. Check workflow file has `continue-on-error: true`
2. Confirm step is non-blocking

**Expected Behavior**:
If Socket.dev service is unavailable:

- [ ] Step completes with warning (yellow)
- [ ] Workflow continues to next step
- [ ] Overall workflow can still pass

### Test 9: Invalid Configuration

**Purpose**: Verify error handling for bad config

**Steps**:

```bash
# Create test branch
git checkout -b test/invalid-config

# Break socket.yml syntax
echo "version: invalid" > socket.yml

# Try to run locally
yq eval 'true' socket.yml
```

**Expected Results**:

- [ ] Local validation catches error
- [ ] Clear error message shown

**Cleanup**:

```bash
git checkout story_1_3
git branch -D test/invalid-config
```

---

## Integration Test Checklist

After all commits are complete, run this integration test:

### Pre-Test Checklist

- [ ] All 4 commits pushed to GitHub
- [ ] Branch is up to date

### Execution

- [ ] Trigger "Quality Gate" workflow manually
- [ ] Wait for completion

### Verification Points

- [ ] Workflow completes successfully
- [ ] Socket.dev step appears in logs
- [ ] Socket.dev analysis runs
- [ ] No blocking alerts on clean code
- [ ] Step duration < 30 seconds
- [ ] Total workflow duration < 2 minutes

### Post-Test

- [ ] Review any warnings in Socket.dev output
- [ ] Document any expected warnings

---

## Test Results Template

Use this template to document test results:

```markdown
## Phase 2 Test Results

**Date**: YYYY-MM-DD
**Tester**: [Name]
**Branch**: story_1_3
**Workflow Run**: [Link to run]

### YAML Syntax Tests

- [ ] socket.yml validates: PASS/FAIL
- [ ] quality-gate.yml validates: PASS/FAIL

### Workflow Execution Tests

- [ ] Test 1 (Manual Trigger): PASS/FAIL
- [ ] Test 2 (Timing): PASS/FAIL (Duration: \_\_s)
- [ ] Test 3 (Cache): PASS/FAIL

### Security Policy Tests

- [ ] Test 4 (Clean Scan): PASS/FAIL
- [ ] Test 5 (License Config): PASS/FAIL
- [ ] Test 6 (License Functional): PASS/FAIL/SKIPPED

### Error Scenario Tests

- [ ] Test 8 (continue-on-error): VERIFIED
- [ ] Test 9 (Invalid Config): PASS/FAIL

### Notes

[Any observations or issues]
```

---

## Troubleshooting Test Failures

### Socket.dev Step Fails

**Symptom**: Red X on Socket.dev step

**Diagnosis**:

1. Check step logs for error message
2. Common causes:
   - Invalid `socket.yml` syntax
   - Missing permissions
   - Service outage

**Resolution**:

- Fix configuration issue
- Verify permissions in workflow
- Check [Socket.dev status](https://status.socket.dev/)

### Workflow Doesn't Start

**Symptom**: Workflow not appearing in Actions tab

**Diagnosis**:

1. Check YAML syntax of workflow file
2. Verify file is in `.github/workflows/`
3. Check GitHub Actions is enabled

**Resolution**:

- Fix YAML syntax errors
- Move file to correct location
- Enable Actions in repository settings

### Unexpected Alerts

**Symptom**: Blocking alert on expected package

**Diagnosis**:

1. Review alert details
2. Check if legitimate concern or false positive

**Resolution**:

- If false positive: Use `@SocketSecurity ignore`
- If legitimate: Replace package or accept risk

---

## Performance Benchmarks

### Expected Timings

| Step            | Expected Duration | Warning Threshold |
| --------------- | ----------------- | ----------------- |
| Socket.dev Scan | < 30s             | > 60s             |
| Total Workflow  | < 2 min           | > 5 min           |

### Monitoring

Track these metrics over time:

- Socket.dev step duration
- Number of alerts per run
- Cache hit rate

---

**Document Created**: 2025-11-28
**Last Updated**: 2025-11-28
