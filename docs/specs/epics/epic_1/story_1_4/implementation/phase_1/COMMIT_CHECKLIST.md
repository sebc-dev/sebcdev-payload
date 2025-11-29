# Phase 1 - Checklist per Commit

This document provides a detailed checklist for each atomic commit of Phase 1: Branch Protection & Quality Gate Enforcement.

---

## Commit 1: Configure Branch Protection Rules

**Files**: GitHub Settings (UI configuration)
**Estimated Duration**: 15-20 minutes

### Implementation Tasks

#### Navigate to Settings

- [ ] Go to repository on GitHub
- [ ] Click "Settings" tab (requires admin access)
- [ ] Click "Branches" in the left sidebar
- [ ] Click "Add branch protection rule" (or edit existing)

#### Configure Branch Name Pattern

- [ ] Enter `main` as the branch name pattern
- [ ] Verify pattern matches your main branch

#### Enable Pull Request Requirements

- [ ] Check "Require a pull request before merging"
- [ ] (Optional) Set "Required number of approvals before merging" to 1
- [ ] Check "Dismiss stale pull request approvals when new commits are pushed"
- [ ] (Optional) Check "Require review from Code Owners"
- [ ] Check "Require approval of the most recent reviewable push"

#### Configure Status Checks

- [ ] Check "Require status checks to pass before merging"
- [ ] Check "Require branches to be up to date before merging"
- [ ] In the search box, search for `quality-gate`
- [ ] Select "Quality Checks / Quality Gate" (or the exact job name)
- [ ] Verify status check is added to required list

#### Block Dangerous Operations

- [ ] Check "Require conversation resolution before merging"
- [ ] Ensure "Do not allow bypassing the above settings" is **UNCHECKED** (allows admin emergency access)
- [ ] Ensure "Restrict who can push to matching branches" is configured if needed
- [ ] Check "Block force pushes"
- [ ] Check "Require linear history" (optional, prevents merge commits)

#### Save Configuration

- [ ] Click "Create" or "Save changes"
- [ ] Verify rule appears in the branch protection list
- [ ] Verify settings are correctly saved

### Validation

```bash
# No CLI validation - verify in GitHub UI:
# Settings > Branches > Branch protection rules
# Click on "main" rule to verify all settings
```

**Expected Result**: Branch protection rule for `main` is visible with all settings correctly configured.

### Review Checklist

#### Configuration Correctness

- [ ] Rule targets `main` branch exactly
- [ ] Status check `quality-gate` (or full job name) is required
- [ ] PR requirement is enabled
- [ ] Stale review dismissal is enabled
- [ ] Up-to-date branch requirement is enabled

#### Security Settings

- [ ] Force push is blocked
- [ ] Branch deletion is blocked (if applicable)
- [ ] Admin bypass is allowed (for emergencies)

#### Alignment with CI-CD-Security.md

- [ ] Configuration matches ENF6 requirements
- [ ] Status check aligns with quality-gate workflow

### Commit Message

```bash
# No git commit for this step - UI configuration only
# Document the configuration completion
```

---

## Commit 2: Create Branch Protection Documentation

**Files**: `docs/guides/BRANCH_PROTECTION.md`
**Estimated Duration**: 20-30 minutes

### Implementation Tasks

#### Create Documentation File

- [ ] Create `docs/guides/` directory if it doesn't exist
- [ ] Create `BRANCH_PROTECTION.md` file
- [ ] Add document header with metadata

#### Write Overview Section

- [ ] Explain purpose of branch protection
- [ ] Link to CI-CD-Security.md
- [ ] Describe the "AI-Shield" quality gate strategy

#### Document Configuration Steps

- [ ] Write step-by-step setup instructions
- [ ] Include all settings from Commit 1
- [ ] Add notes for each setting explaining the rationale
- [ ] Consider adding placeholder for screenshots

#### Document Required Status Checks

- [ ] List the `quality-gate` workflow
- [ ] Explain what quality-gate validates
- [ ] Link to workflow file location

#### Add Troubleshooting Section

- [ ] Common issue: Status check not appearing
- [ ] Common issue: Merge blocked unexpectedly
- [ ] Common issue: Admin bypass usage

#### Add References

- [ ] Link to GitHub documentation
- [ ] Link to CI-CD-Security.md
- [ ] Link to quality-gate.yml

### Validation

```bash
# Verify file exists
ls -la docs/guides/BRANCH_PROTECTION.md

# Check markdown formatting
pnpm exec prettier --check docs/guides/BRANCH_PROTECTION.md

# Preview (optional)
# Use VS Code preview or GitHub markdown preview
```

**Expected Result**: Complete documentation file that accurately describes the branch protection configuration.

### Review Checklist

#### Content Completeness

- [ ] Overview section present
- [ ] All settings documented
- [ ] Step-by-step instructions are clear
- [ ] Troubleshooting section included
- [ ] References section present

#### Documentation Quality

- [ ] Clear and concise language
- [ ] Consistent formatting
- [ ] No typos or grammatical errors
- [ ] Links are valid (relative paths)
- [ ] Code blocks properly formatted

#### Accuracy

- [ ] Settings match actual configuration
- [ ] Workflow name is correct
- [ ] Rationale explanations are accurate

### Commit Message

```bash
git add docs/guides/BRANCH_PROTECTION.md
git commit -m "docs(guides): add branch protection documentation

- Document all protection settings for main branch
- Include step-by-step setup guide for reproducibility
- Add troubleshooting section for common issues
- Reference CI-CD-Security.md and quality-gate workflow

Part of Phase 1 - Commit 2/3"
```

---

## Commit 3: Verification & Test PR

**Files**: None (manual verification process)
**Estimated Duration**: 15-20 minutes

### Implementation Tasks

#### Prepare Test Environment

- [ ] Ensure you're on a clean branch (not main)
- [ ] Create a new test branch

```bash
git checkout main
git pull origin main
git checkout -b test-branch-protection
```

#### Test Direct Push Block

- [ ] Create a test file
- [ ] Attempt to push directly to main
- [ ] Verify push is rejected

```bash
echo "# Test file for branch protection" > test-protection.md
git add test-protection.md
git commit -m "test: Verify branch protection blocks direct push"

# This should fail
git push origin test-branch-protection:main
```

**Expected Error**:

```
remote: error: GH006: Protected branch update failed for refs/heads/main.
remote: error: Required status check "quality-gate" is expected.
```

#### Push to Test Branch

- [ ] Push to the test branch instead

```bash
git push origin test-branch-protection
```

#### Create Test PR

- [ ] Create a PR targeting main

```bash
gh pr create \
  --title "test: Branch protection verification" \
  --body "Testing that branch protection rules are correctly configured.

## Test Objectives
- [ ] Verify merge is blocked without quality-gate
- [ ] Verify merge is enabled after quality-gate passes

This PR will be closed without merging."
```

#### Verify Merge is Blocked

- [ ] Check PR status in GitHub UI
- [ ] Verify "Merge" button is disabled
- [ ] Verify message indicates missing `quality-gate` check

```bash
# Check PR status
gh pr view --json statusCheckRollup,mergeable

# Expected: mergeable = BLOCKED, missing quality-gate
```

#### Run Quality Gate

- [ ] Go to Actions tab in GitHub
- [ ] Find "Quality Gate" workflow
- [ ] Click "Run workflow"
- [ ] Select `test-branch-protection` branch
- [ ] Wait for workflow to complete

#### Verify Merge is Enabled

- [ ] Check PR status after workflow passes
- [ ] Verify "Merge" button is now enabled
- [ ] Verify all checks are green

```bash
gh pr checks
# Expected: All checks passing including quality-gate
```

#### Cleanup

- [ ] Close the PR without merging
- [ ] Delete the test branch

```bash
gh pr close --delete-branch
git checkout main
```

### Validation

```bash
# Verify test branch is deleted
git branch -a | grep test-branch-protection
# Expected: No output (branch deleted)

# Verify PR is closed
gh pr list --state closed | grep "protection"
# Expected: Shows the closed test PR
```

**Expected Result**:

- Direct push to `main` was rejected
- PR without quality-gate could not be merged
- PR with passing quality-gate could be merged
- Test artifacts cleaned up

### Review Checklist

#### Test Execution

- [ ] Direct push rejection verified
- [ ] PR blocking verified
- [ ] Quality-gate run successfully
- [ ] Merge enablement verified
- [ ] Cleanup completed

#### Evidence

- [ ] Error message captured for direct push
- [ ] PR status captured showing blocked state
- [ ] PR checks captured showing all green

#### Cleanup Verification

- [ ] Test branch deleted
- [ ] Test PR closed
- [ ] No leftover artifacts

### Commit Message

```bash
# No code commit - document test results in PR or notes
# Update phase documentation with test results if needed
```

---

## Final Phase Validation

After all commits:

### Complete Phase Checklist

- [ ] Commit 1: Branch protection configured
- [ ] Commit 2: Documentation created and committed
- [ ] Commit 3: Verification completed
- [ ] All tests passed
- [ ] Documentation is accurate
- [ ] VALIDATION_CHECKLIST.md completed

### Final Validation Commands

```bash
# Verify documentation exists
cat docs/guides/BRANCH_PROTECTION.md

# Verify lint passes
pnpm lint

# Verify Prettier passes
pnpm exec prettier --check .

# List closed PRs to confirm test
gh pr list --state closed | head -5
```

**Phase 1 is complete when all checkboxes are checked!**

---

## Quick Reference

### GitHub UI Navigation

1. Repository > Settings
2. Left sidebar > Branches
3. Branch protection rules > Add/Edit

### Required Status Checks

| Check Name       | Source           | Required |
| ---------------- | ---------------- | -------- |
| `Quality Checks` | quality-gate.yml | Yes      |

### Emergency Bypass

If admin bypass is needed:

1. Document the reason
2. Use the bypass sparingly
3. Create follow-up to fix the blocking issue
