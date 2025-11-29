# Phase 1 - Testing Guide

Complete testing strategy for Phase 1: Branch Protection & Quality Gate Enforcement.

---

## Testing Strategy

Phase 1 is a **configuration-focused phase** with no code changes. Testing consists of:

1. **Manual Verification**: Verify GitHub settings are correctly configured
2. **Integration Tests**: Test that branch protection blocks unauthorized changes
3. **End-to-End Tests**: Complete workflow from PR creation to merge block/enable

**Note**: No unit tests are applicable for this phase since there are no code changes.

---

## Manual Verification Tests

### Purpose

Verify that GitHub branch protection settings are correctly configured.

### Test 1: Verify Settings Exist

**Steps**:

1. Navigate to repository Settings
2. Click "Branches" in sidebar
3. Find `main` branch protection rule
4. Click to expand settings

**Expected Results**:

- [ ] Rule exists for `main` branch
- [ ] All settings are visible and configured

### Test 2: Verify Status Check Configuration

**Steps**:

1. In branch protection settings, find "Require status checks to pass"
2. Verify checkbox is enabled
3. Find the required status checks list
4. Verify `quality-gate` or `Quality Checks` is listed

**Expected Results**:

- [ ] Status checks requirement is enabled
- [ ] `quality-gate` is in the required list
- [ ] "Require branches to be up to date" is enabled

### Test 3: Verify Security Settings

**Steps**:

1. Scroll to "Rules applied to everyone including administrators"
2. Check force push and deletion settings

**Expected Results**:

- [ ] "Block force pushes" is enabled
- [ ] "Allow deletions" is disabled (or as intended)

---

## Integration Tests

### Purpose

Test that branch protection rules work as expected when triggered.

### Test A: Direct Push Block

**Objective**: Verify that direct pushes to `main` are blocked.

**Prerequisites**:

- [ ] Local repository cloned
- [ ] Push access to repository
- [ ] Branch protection configured

**Test Steps**:

```bash
# 1. Ensure you're on main
git checkout main
git pull origin main

# 2. Create a test file
echo "# Test direct push" > test-direct-push.md

# 3. Stage and commit
git add test-direct-push.md
git commit -m "test: Direct push test"

# 4. Attempt to push directly to main
git push origin main
```

**Expected Result**:

```
remote: error: GH006: Protected branch update failed for refs/heads/main.
remote: error: Required status check "Quality Checks" is expected.
To github.com:org/repo.git
 ! [remote rejected] main -> main (protected branch hook declined)
```

**Verification**:

- [ ] Push is rejected
- [ ] Error mentions protected branch
- [ ] Error mentions required status check

**Cleanup**:

```bash
# Revert the test commit
git reset --hard HEAD~1
```

---

### Test B: PR Block Without Quality Gate

**Objective**: Verify that PRs cannot merge without quality-gate passing.

**Prerequisites**:

- [ ] Branch protection configured
- [ ] GitHub CLI (`gh`) authenticated

**Test Steps**:

```bash
# 1. Create test branch
git checkout main
git pull origin main
git checkout -b test-pr-block

# 2. Create a simple change
echo "# Test PR blocking" > test-pr.md
git add test-pr.md
git commit -m "test: PR without quality-gate"

# 3. Push branch
git push origin test-pr-block

# 4. Create PR
gh pr create \
  --title "test: Verify PR blocks without quality-gate" \
  --body "This PR tests that merge is blocked without quality-gate passing."
```

**Expected Result**:

- PR is created successfully
- Merge button is disabled or shows warning
- Status shows "Required status check 'Quality Checks' has not been run yet"

**Verification**:

```bash
# Check PR status
gh pr view --json mergeable,mergeStateStatus

# Expected output:
# {
#   "mergeable": "UNKNOWN" or "BLOCKED",
#   "mergeStateStatus": "BLOCKED"
# }
```

- [ ] PR cannot be merged
- [ ] Missing status check is indicated
- [ ] Merge button is disabled

**Do NOT cleanup yet** - continue to Test C.

---

### Test C: PR Unblock After Quality Gate

**Objective**: Verify that PRs can merge after quality-gate passes.

**Prerequisites**:

- [ ] Test B completed (test PR exists)
- [ ] Access to run GitHub Actions

**Test Steps**:

```bash
# 1. Trigger quality-gate workflow on the test branch
# Via GitHub UI: Actions > Quality Gate > Run workflow > Select test-pr-block

# Or via CLI (if available):
gh workflow run quality-gate.yml --ref test-pr-block
```

**Wait for Workflow**:

```bash
# Monitor workflow status
gh run list --workflow=quality-gate.yml --limit=1

# Wait for completion (should show "completed")
```

**Verification**:

```bash
# Check PR status after workflow
gh pr view --json statusCheckRollup

# Look for quality-gate in the checks
gh pr checks
```

**Expected Result**:

- [ ] Quality-gate workflow completes successfully
- [ ] PR status shows all checks passing
- [ ] Merge button becomes enabled
- [ ] "Squash and merge" or "Merge" is clickable

**Cleanup**:

```bash
# Close PR without merging
gh pr close --delete-branch

# Return to main
git checkout main
```

---

## End-to-End Test Summary

### Complete Workflow Test

This test covers the full developer workflow:

```
[Create Branch] → [Make Change] → [Create PR] → [Blocked] → [Run QG] → [Unblocked] → [Merge or Close]
```

**Test Matrix**:

| Step | Action                | Expected Result    | Pass |
| ---- | --------------------- | ------------------ | ---- |
| 1    | Create feature branch | Branch created     | [ ]  |
| 2    | Commit changes        | Commit successful  | [ ]  |
| 3    | Push branch           | Push successful    | [ ]  |
| 4    | Create PR             | PR created         | [ ]  |
| 5    | Check merge status    | BLOCKED            | [ ]  |
| 6    | Run quality-gate      | Workflow triggered | [ ]  |
| 7    | Wait for completion   | Workflow passes    | [ ]  |
| 8    | Check merge status    | MERGEABLE          | [ ]  |
| 9    | Close PR              | PR closed          | [ ]  |
| 10   | Delete branch         | Branch deleted     | [ ]  |

---

## Test Execution Commands

### Quick Test Commands

```bash
# Check if branch is protected
gh api repos/:owner/:repo/branches/main/protection --jq '.required_status_checks.checks[].context'

# Check PR status
gh pr view --json mergeable,mergeStateStatus,statusCheckRollup

# Check specific checks
gh pr checks

# List required status checks
gh api repos/:owner/:repo/branches/main/protection --jq '.required_status_checks'
```

### Cleanup Commands

```bash
# Delete test branch locally
git branch -D test-pr-block

# Delete test branch remotely
git push origin --delete test-pr-block

# Close test PR
gh pr close <PR_NUMBER> --delete-branch
```

---

## Expected Test Results

### Success Criteria

| Test           | Criteria                        | Result |
| -------------- | ------------------------------- | ------ |
| Settings Exist | Branch rule for `main` visible  | [ ]    |
| Status Check   | `quality-gate` in required list | [ ]    |
| Direct Push    | Push rejected with error        | [ ]    |
| PR Block       | Merge blocked without QG        | [ ]    |
| PR Unblock     | Merge enabled after QG          | [ ]    |

### Failure Criteria

Tests fail if:

- Direct push to `main` succeeds
- PR can merge without quality-gate
- PR stays blocked after quality-gate passes
- Settings don't match requirements

---

## Debugging Tests

### Common Issues

#### Issue: Status Check Not Found

**Symptoms**:

- `quality-gate` not in required list
- Different name expected

**Solutions**:

1. Run quality-gate workflow at least once
2. Check exact job name in Actions
3. Update branch protection with correct name

```bash
# Find the exact check name
gh run view --job <job_id> --json name
```

#### Issue: Push Succeeds When Should Fail

**Symptoms**:

- Direct push to `main` works

**Solutions**:

1. Verify branch protection is enabled
2. Check if you're an admin bypassing
3. Verify rule targets `main` exactly

#### Issue: PR Shows Wrong Status

**Symptoms**:

- Status doesn't update after workflow

**Solutions**:

1. Refresh the PR page
2. Check workflow actually ran on correct branch
3. Verify workflow completed successfully

```bash
# Check workflow ran on correct ref
gh run list --workflow=quality-gate.yml --branch=test-pr-block
```

---

## CI/CD Integration

### No CI Tests for This Phase

This phase configures GitHub settings and doesn't include code that can be tested in CI.

### Future Phases

Phase 2+ will include CI-testable components:

- Deployment workflow tests
- OIDC authentication verification
- Smoke tests

---

## Test Checklist

Before completing Phase 1:

### Configuration Tests

- [ ] Branch protection rule exists
- [ ] Required status check is configured
- [ ] Force push is blocked

### Integration Tests

- [ ] Direct push fails with error
- [ ] PR is blocked without quality-gate
- [ ] PR is enabled after quality-gate

### Documentation Tests

- [ ] BRANCH_PROTECTION.md exists
- [ ] Documentation matches configuration
- [ ] All commands in docs work

### Cleanup

- [ ] No test branches remaining
- [ ] No test PRs open
- [ ] No test files committed

---

## Best Practices

### Testing Branch Protection

- **Always test on a new branch** - Never test on `main`
- **Clean up test artifacts** - Delete test branches and PRs
- **Document results** - Keep evidence of tests passing
- **Re-test after changes** - If settings change, re-run tests

### Test Naming

Use clear prefixes for test artifacts:

- Branches: `test-*`
- PRs: "test: [Description]"
- Commits: `test: [Description]`

### Evidence Collection

For audit purposes, capture:

- Screenshots of blocked merge
- Error messages from direct push
- PR status before and after quality-gate

---

## FAQ

**Q: How often should I test branch protection?**
A: After initial setup and after any configuration changes.

**Q: Can I skip the E2E test?**
A: Not recommended. The E2E test proves the configuration works in practice.

**Q: What if quality-gate is slow?**
A: That's expected. The workflow runs full checks. Be patient.

**Q: Should I merge the test PR?**
A: No. Close without merging to keep main clean.

**Q: Can I reuse test branches?**
A: Delete and create fresh branches for each test cycle to avoid cache issues.
