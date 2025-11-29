# Branch Protection Guide

## Overview

This project enforces branch protection rules on the `main` branch to ensure all code passes the Quality Gate pipeline before reaching production. This is part of the "AI-Shield" defense strategy defined in [CI-CD-Security.md](../specs/CI-CD-Security.md).

**Key Principle**: No code can be merged to `main` without passing all quality checks.

## Quick Reference

| Setting               | Value            | Purpose                     |
| --------------------- | ---------------- | --------------------------- |
| Protected Branch      | `main`           | Production branch           |
| Required Status Check | `Quality Checks` | Quality Gate workflow job   |
| PR Required           | Yes              | Enforce code review process |
| Force Push            | Blocked          | Prevent history rewriting   |
| Admin Bypass          | Allowed          | Emergency access            |

## Configuration

### Prerequisites

- Admin access to the GitHub repository
- Quality Gate workflow (`quality-gate.yml`) must exist and have run at least once

### Step-by-Step Setup

#### 1. Navigate to Branch Protection Settings

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Branches** in the left sidebar
4. Click **Add branch protection rule** (or edit existing)

#### 2. Configure Branch Name Pattern

- Enter `main` as the branch name pattern
- This protects only the main production branch

#### 3. Enable Pull Request Requirements

| Setting                               | Value       | Notes                            |
| ------------------------------------- | ----------- | -------------------------------- |
| Require a pull request before merging | **Enabled** | Core requirement                 |
| Required approvals                    | 0           | Solo dev project                 |
| Dismiss stale reviews                 | Disabled    | Not needed for solo dev workflow |
| Require approval of most recent push  | Disabled    | Not needed for solo dev workflow |

#### 4. Configure Status Checks (Critical)

| Setting                           | Recommended      | Notes                    |
| --------------------------------- | ---------------- | ------------------------ |
| Require status checks to pass     | **Enabled**      | **Core requirement**     |
| Require branches to be up to date | **Enabled**      | Prevents merge conflicts |
| Required checks                   | `Quality Checks` | Search for this job name |

**Important**: The status check name is `Quality Checks` (the job display name from `quality-gate.yml`). You must run the workflow at least once before it appears in the search.

#### 5. Configure Additional Protection

| Setting                         | Value       | Notes                            |
| ------------------------------- | ----------- | -------------------------------- |
| Require conversation resolution | Disabled    | Not needed for solo dev workflow |
| Block force pushes              | **Enabled** | Protect git history              |
| Require linear history          | Optional    | Prevents merge commits           |

> **Note**: The "Do not allow bypassing the above settings" option may not be available depending on your GitHub plan. Admin bypass is allowed by default.

#### 6. Save Configuration

- Click **Create** or **Save changes**
- Verify the rule appears in the branch protection list

## Required Status Checks

### Quality Gate Workflow

| Check Name       | Workflow File                        | Purpose                             |
| ---------------- | ------------------------------------ | ----------------------------------- |
| `Quality Checks` | `.github/workflows/quality-gate.yml` | Multi-layer code quality validation |

The Quality Gate validates:

1. **Layer 1 - Supply Chain**: Socket.dev firewall scans dependencies
2. **Layer 2 - Code Quality**: ESLint, Prettier, Knip (dead code detection)
3. **Layer 3 - Type Safety**: TypeScript compilation, Payload types sync
4. **Layer 4 - Architecture**: dependency-cruiser validates import boundaries
5. **Layer 5 - Build**: Next.js build validation
6. **Layer 6 - Tests**: Vitest unit/integration tests, Playwright E2E tests

### Running the Quality Gate

The workflow is triggered manually:

1. Go to **Actions** tab in GitHub
2. Select **Quality Gate** workflow
3. Click **Run workflow**
4. Select the branch to validate
5. Wait for completion

## Rationale

### Why Require Quality Gate?

| Risk                    | Mitigation                         |
| ----------------------- | ---------------------------------- |
| AI hallucinations       | Knip detects unused code/imports   |
| Type drift              | Payload types sync verification    |
| Broken builds           | Next.js build validation           |
| Security issues         | Socket.dev supply chain protection |
| Architecture violations | dependency-cruiser validation      |

### Why Allow Admin Bypass?

Admin bypass is allowed for **emergency situations only**:

- Critical security patches that need immediate deployment
- CI/CD pipeline itself is broken and needs fixing
- Time-sensitive fixes where waiting for CI would cause significant damage

**Important**: Admin bypass should be rare and documented. Create a follow-up issue to address why the bypass was needed.

## Troubleshooting

### Status Check Not Appearing

**Problem**: Can't find `Quality Checks` in the status check search.

**Solution**: The workflow must run at least once before it appears.

1. Go to Actions > Quality Gate > Run workflow
2. Run on any branch
3. Return to branch protection settings
4. Search for `Quality Checks` again

### Merge Blocked Unexpectedly

**Problem**: PR shows merge blocked but you believe checks passed.

**Possible Causes**:

1. **Branch not up to date**: Click "Update branch" to merge latest main
2. **Check not run**: Manually trigger Quality Gate workflow
3. **Workflow failed**: Check workflow logs for errors

**Diagnosis**:

```bash
# Check PR status via CLI
gh pr view --json statusCheckRollup,mergeable

# List all checks
gh pr checks
```

### Admin Bypass Usage

**When to use**: Only for emergencies documented above.

**How to use**:

1. As an admin, click "Merge" even if checks are failing
2. GitHub will show a warning - confirm the bypass
3. **Immediately** create an issue documenting why bypass was needed

**After bypass**:

- Investigate why the bypass was necessary
- Fix underlying issues
- Ensure it doesn't happen again

## Verification

To verify branch protection is working correctly:

```bash
# 1. Create a test branch
git checkout -b test-branch-protection

# 2. Make a small change
echo "# Test" > test-file.md
git add test-file.md
git commit -m "test: Verify branch protection"

# 3. Attempt direct push to main (should fail)
git push origin test-branch-protection:main
# Expected: Error - protected branch rules

# 4. Push to test branch and create PR
git push origin test-branch-protection
gh pr create --title "test: Branch protection verification" --body "Testing protection rules"

# 5. Check PR status (should be blocked)
gh pr view --json mergeable
# Expected: BLOCKED (missing Quality Checks)

# 6. Run Quality Gate, then check again
# After workflow passes: MERGEABLE

# 7. Cleanup
gh pr close --delete-branch
```

## References

- [CI-CD-Security.md](../specs/CI-CD-Security.md) - Full security architecture
- [Quality Gate Workflow](../../.github/workflows/quality-gate.yml) - Workflow source
- [GitHub Branch Protection Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [ENF6 - AI-Shield Strategy](../specs/PRD.md) - Product requirement

---

**Last Updated**: 2025-11-29
**Part of**: Story 1.4 - Pipeline de Déploiement (Phase 1)
