# Phase 1 - Atomic Implementation Plan

**Objective**: Configure GitHub branch protection rules to enforce Quality Gate checks before any code can be merged to `main`.

---

## Overview

### Why an Atomic Approach?

The implementation is split into **3 independent commits** to:

- **Facilitate review** - Each commit focuses on a single responsibility
- **Enable rollback** - Configuration changes can be reverted step by step
- **Progressive validation** - Each commit can be tested independently
- **Clear documentation** - Each step is documented for reproducibility

### Global Strategy

```
[Commit 1]        →    [Commit 2]        →    [Commit 3]
     ↓                      ↓                      ↓
 Configure            Document              Verify & Test
 Protection           Settings              Configuration
```

### Phase Characteristics

This phase is **configuration-focused** (no code changes):

- UI-based configuration in GitHub Settings
- Documentation creation in `docs/guides/`
- Manual verification of protection rules

---

## The 3 Atomic Commits

### Commit 1: Configure Branch Protection Rules

**Files**: GitHub Settings (UI) - no files modified
**Size**: N/A (UI configuration)
**Duration**: 15-20 min (implementation) + 10 min (review)

**Content**:

- Navigate to repository Settings > Branches
- Create branch protection rule for `main`
- Enable required status checks (`quality-gate`)
- Enable "Require a pull request before merging"
- Enable "Require review from Code Owners" (optional)
- Disable force pushes and deletions
- Save configuration

**Configuration Settings**:

| Setting                               | Value                      | Justification                  |
| ------------------------------------- | -------------------------- | ------------------------------ |
| Branch name pattern                   | `main`                     | Protect main production branch |
| Require a pull request before merging | Enabled                    | Enforce code review            |
| Require approvals                     | 1+ (optional for solo dev) | Quality control                |
| Dismiss stale reviews                 | Enabled                    | Ensure fresh approval          |
| Require status checks to pass         | Enabled                    | **Core requirement**           |
| Status checks: `quality-gate`         | Required                   | Link to CI-CD-Security.md      |
| Require branches to be up to date     | Enabled                    | Prevent merge conflicts        |
| Require conversation resolution       | Enabled                    | Address all feedback           |
| Do not allow bypassing                | Disabled                   | Allow admin emergency access   |
| Allow force pushes                    | Disabled                   | Prevent history rewriting      |
| Allow deletions                       | Disabled                   | Prevent branch deletion        |

**Why it's atomic**:

- Single responsibility: Configure protection rules
- Independent: Requires no code changes
- Testable: Can verify immediately in GitHub UI

**Technical Validation**:

```bash
# No CLI validation - verify in GitHub UI:
# Settings > Branches > Branch protection rules
# Verify "main" rule exists with correct settings
```

**Expected Result**: Branch protection rule created and visible in GitHub Settings.

**Review Criteria**:

- [ ] Rule targets `main` branch
- [ ] Status check `quality-gate` is required
- [ ] PR requirement is enabled
- [ ] Force push is disabled

---

### Commit 2: Create Branch Protection Documentation

**Files**: `docs/guides/BRANCH_PROTECTION.md` (new)
**Size**: ~150 lines
**Duration**: 20-30 min (implementation) + 15 min (review)

**Content**:

- Document the branch protection configuration
- Include step-by-step setup instructions for reproducibility
- Document the required status checks
- Explain the rationale for each setting
- Add troubleshooting section

**Documentation Sections**:

1. **Overview**: Purpose of branch protection
2. **Configuration**: Step-by-step setup guide with screenshots placeholders
3. **Required Status Checks**: List of required workflows
4. **Rationale**: Why each setting is configured
5. **Troubleshooting**: Common issues and solutions
6. **References**: Links to GitHub docs and CI-CD-Security.md

**Why it's atomic**:

- Single responsibility: Create documentation
- Independent: Documentation only, no configuration changes
- Testable: Verify markdown renders correctly

**Technical Validation**:

```bash
# Verify file exists and renders
cat docs/guides/BRANCH_PROTECTION.md

# Check for broken links
pnpm exec prettier --check docs/guides/BRANCH_PROTECTION.md
```

**Expected Result**: Complete documentation file with all sections.

**Review Criteria**:

- [ ] All settings documented
- [ ] Step-by-step instructions are clear
- [ ] Rationale is explained
- [ ] Links are valid
- [ ] Markdown renders correctly

---

### Commit 3: Verification Script & Test PR

**Files**: None (manual verification process)
**Size**: N/A
**Duration**: 15-20 min (implementation) + 10 min (review)

**Content**:

- Create a test branch to verify protection
- Attempt to push directly to `main` (should fail)
- Create a PR without running quality-gate
- Verify merge is blocked
- Run quality-gate workflow manually
- Verify merge becomes available
- Document test results

**Verification Steps**:

```bash
# Step 1: Create test branch
git checkout -b test-branch-protection
echo "# Test file" > test-protection.md
git add test-protection.md
git commit -m "test: Verify branch protection"

# Step 2: Attempt direct push (should fail)
git push origin test-branch-protection:main
# Expected: Error - protected branch rules

# Step 3: Push to test branch
git push origin test-branch-protection

# Step 4: Create PR (via GitHub UI or gh CLI)
gh pr create --title "test: Branch protection verification" --body "Testing branch protection rules"

# Step 5: Verify merge is blocked (check GitHub UI)
# Status: "Required status check 'quality-gate' has not been run"

# Step 6: Run quality-gate manually
# GitHub Actions > Quality Gate > Run workflow (select test branch)

# Step 7: Verify merge is now available
gh pr checks

# Step 8: Close PR without merging (cleanup)
gh pr close --delete-branch
```

**Why it's atomic**:

- Single responsibility: Verify configuration works
- Independent: Testing only, no permanent changes
- Testable: Produces clear pass/fail result

**Technical Validation**:

```bash
# Check PR status
gh pr view --json statusCheckRollup

# Verify quality-gate is listed as required
gh pr checks | grep "quality-gate"
```

**Expected Result**:

- Direct push to `main` fails
- PR without quality-gate cannot merge
- PR with passing quality-gate can merge

**Review Criteria**:

- [ ] Direct push to main fails
- [ ] PR is blocked without quality-gate
- [ ] PR is unblocked after quality-gate passes
- [ ] Test PR closed and cleaned up

---

## Implementation Workflow

### Step-by-Step

1. **Read specification**: Understand requirements from PHASES_PLAN.md
2. **Verify access**: Confirm admin access to repository settings
3. **Configure protection** (Commit 1): Apply settings in GitHub UI
4. **Validate configuration** (Commit 1): Verify in Settings
5. **Create documentation** (Commit 2): Write BRANCH_PROTECTION.md
6. **Validate documentation** (Commit 2): Check markdown formatting
7. **Test protection** (Commit 3): Run verification steps
8. **Cleanup** (Commit 3): Close test PR
9. **Final validation**: Complete VALIDATION_CHECKLIST.md

### Validation at Each Step

After Commit 1:

```bash
# Verify in GitHub UI
# Settings > Branches > Branch protection rules
# Check "main" rule exists
```

After Commit 2:

```bash
# Verify documentation
cat docs/guides/BRANCH_PROTECTION.md
pnpm lint
```

After Commit 3:

```bash
# Verify test results
gh pr list --state closed | grep "protection"
```

---

## Commit Metrics

| Commit                  | Files  | Lines    | Implementation | Review    | Total    |
| ----------------------- | ------ | -------- | -------------- | --------- | -------- |
| 1. Configure Protection | 0 (UI) | N/A      | 20 min         | 10 min    | 30 min   |
| 2. Documentation        | 1      | ~150     | 30 min         | 15 min    | 45 min   |
| 3. Verification         | 0      | N/A      | 20 min         | 10 min    | 30 min   |
| **TOTAL**               | **1**  | **~150** | **1h10**       | **35min** | **1h45** |

---

## Atomic Approach Benefits

### For Developers

- **Clear focus**: One configuration area at a time
- **Testable**: Each step can be verified immediately
- **Documented**: Clear records of changes

### For Reviewers

- **Fast review**: 10-15 min per commit
- **Focused**: Single responsibility to check
- **Verifiable**: Can test protection themselves

### For the Project

- **Rollback-safe**: Can revert documentation without losing protection
- **Auditable**: Clear change history
- **Reproducible**: Documentation enables recreation

---

## Best Practices

### Commit Messages

Format:

```
type(scope): short description (max 50 chars)

- Point 1: detail
- Point 2: detail
- Point 3: justification if needed

Part of Phase 1 - Commit X/3
```

**Commit 1**:

```
chore(ci): configure branch protection for main

- Require quality-gate status check before merge
- Enable PR requirement with review
- Block force pushes and direct commits
- Align with CI-CD-Security.md requirements

Part of Phase 1 - Commit 1/3
```

**Commit 2**:

```
docs(guides): add branch protection documentation

- Document all protection settings
- Include step-by-step setup guide
- Add troubleshooting section
- Reference CI-CD-Security.md

Part of Phase 1 - Commit 2/3
```

**Commit 3**:

```
test(ci): verify branch protection configuration

- Test direct push rejection
- Verify PR blocking without quality-gate
- Confirm merge enabled after passing checks
- Clean up test PR

Part of Phase 1 - Commit 3/3
```

---

## Important Points

### Do's

- Configure protection via GitHub UI (auditable)
- Document all settings for reproducibility
- Test protection with a real PR
- Clean up test artifacts

### Don'ts

- Don't disable protection once enabled
- Don't skip verification steps
- Don't leave test PRs open
- Don't bypass protection for normal changes

---

## FAQ

**Q: What if the quality-gate workflow name changes?**
A: Update the required status check in branch protection settings and documentation.

**Q: Can I add more status checks later?**
A: Yes, branch protection rules can be updated at any time.

**Q: What if I need to merge urgently without quality-gate?**
A: Admins can temporarily bypass, but this should be rare and documented.

**Q: Is this configuration tracked in version control?**
A: No, GitHub branch protection is UI/API only. Documentation in `docs/guides/BRANCH_PROTECTION.md` provides reproducibility.
