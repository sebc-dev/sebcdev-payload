# Phase 1: Implementation Plan - Workflow Foundation & Dependabot

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Phase**: 1 of 8
**Estimated Duration**: 1.5-2 hours
**Commits**: 4 atomic commits

---

## Table of Contents

1. [Implementation Overview](#implementation-overview)
2. [Commit 1: Initialize Quality-Gate Workflow](#commit-1-initialize-quality-gate-workflow)
3. [Commit 2: Configure Dependabot](#commit-2-configure-dependabot)
4. [Commit 3: Add Permissions and Concurrency](#commit-3-add-permissions-and-concurrency)
5. [Commit 4: Update Documentation](#commit-4-update-documentation)
6. [Post-Implementation Validation](#post-implementation-validation)

---

## Implementation Overview

### Commit Flow

```
Commit 1                    Commit 2                    Commit 3                    Commit 4
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ quality-gate.yml │  -->  │ dependabot.yml   │  -->  │ permissions &    │  -->  │ CLAUDE.md        │
│ - workflow_disp. │       │ - github-actions │       │ concurrency      │       │ documentation    │
│ - checkout       │       │ - npm packages   │       │ - contents: read │       │                  │
│ - setup-node     │       │ - grouping       │       │ - cancel-in-prog │       │                  │
│ - pnpm install   │       │                  │       │                  │       │                  │
└──────────────────┘       └──────────────────┘       └──────────────────┘       └──────────────────┘
```

### Files to Create/Modify

| File | Action | Commit |
|------|--------|--------|
| `.github/workflows/quality-gate.yml` | CREATE | 1, 3 |
| `.github/dependabot.yml` | CREATE | 2 |
| `CLAUDE.md` | MODIFY | 4 |

---

## Commit 1: Initialize Quality-Gate Workflow

### Commit Message

```
feat(ci): initialize quality-gate workflow with SHA-pinned actions

- Create .github/workflows/quality-gate.yml with workflow_dispatch trigger
- Add checkout action pinned by SHA (v4.2.2)
- Add setup-node action pinned by SHA (v4.1.0)
- Add pnpm action-setup pinned by SHA (v4.0.0)
- Configure Node.js 20.x with pnpm caching
- Add placeholder for future quality checks
```

### Files Changed

**CREATE**: `.github/workflows/quality-gate.yml`

### Implementation Details

#### Step 1: Create GitHub Workflows Directory

```bash
mkdir -p .github/workflows
```

#### Step 2: Create Workflow File

Create `.github/workflows/quality-gate.yml`:

```yaml
# .github/workflows/quality-gate.yml
# Quality Gate Pipeline - AI-Shield Defense Strategy
#
# Trigger: Manual via workflow_dispatch (mandatory for branch protection)
# Purpose: Multi-layer code quality validation before merge
#
# Documentation: docs/specs/CI-CD-Security.md

name: Quality Gate

on:
  workflow_dispatch:
    inputs:
      run_mutation_tests:
        description: 'Run Stryker mutation tests (slow, ~15min)'
        required: false
        type: boolean
        default: false

jobs:
  quality-gate:
    name: Quality Checks
    runs-on: ubuntu-latest

    steps:
      # ============================================
      # SETUP: Checkout & Dependencies
      # ============================================

      - name: Checkout repository
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4.2.2
        with:
          fetch-depth: 0  # Full history for git diff operations

      - name: Setup pnpm
        uses: pnpm/action-setup@fe02b34f77f8bc703788d5817da081398fad5dd2  # v4.0.0
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@39370e3970a6d050c480ffad4ff0ed4d3fdee5af  # v4.1.0
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      # ============================================
      # PLACEHOLDER: Quality Checks (Future Phases)
      # ============================================

      - name: Placeholder - Quality checks coming soon
        run: |
          echo "::notice::Phase 1 complete - Foundation workflow established"
          echo "::notice::Future phases will add: Socket.dev, Knip, ESLint, Build, etc."
```

#### Step 3: Verify SHA Values

Current SHA values (verified 2025-11):

| Action | Version | SHA |
|--------|---------|-----|
| `actions/checkout` | v4.2.2 | `11bd71901bbe5b1630ceea73d27597364c9af683` |
| `actions/setup-node` | v4.1.0 | `39370e3970a6d050c480ffad4ff0ed4d3fdee5af` |
| `pnpm/action-setup` | v4.0.0 | `fe02b34f77f8bc703788d5817da081398fad5dd2` |

**How to verify**: Go to the action's GitHub releases page and click on the commit SHA for the release tag.

### Validation Criteria

- [ ] File created at `.github/workflows/quality-gate.yml`
- [ ] YAML syntax is valid (no errors in VS Code)
- [ ] All actions use full SHA (40 characters)
- [ ] Version comments match SHA

### Estimated Time: 30-45 minutes

---

## Commit 2: Configure Dependabot

### Commit Message

```
feat(ci): configure dependabot for actions and npm packages

- Create .github/dependabot.yml for automated dependency updates
- Configure weekly schedule for github-actions ecosystem
- Configure weekly schedule for npm packages
- Group minor/patch updates to reduce PR noise
- Set open-pull-requests-limit to 10
```

### Files Changed

**CREATE**: `.github/dependabot.yml`

### Implementation Details

#### Step 1: Create Dependabot Configuration

Create `.github/dependabot.yml`:

```yaml
# .github/dependabot.yml
# Automated dependency maintenance for security and freshness
#
# Strategy:
# - Weekly schedule to avoid PR flood
# - Grouping of minor/patch updates
# - Separate tracking for GitHub Actions and npm
#
# Documentation: docs/specs/CI-CD-Security.md (Section 2.3)

version: 2

updates:
  # ============================================
  # GitHub Actions - SHA Pinned
  # ============================================
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "Europe/Paris"
    open-pull-requests-limit: 10
    commit-message:
      prefix: "ci"
      include: "scope"
    labels:
      - "dependencies"
      - "github-actions"
    reviewers:
      - "sebcdev"  # Update with actual GitHub username

  # ============================================
  # npm Packages
  # ============================================
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "Europe/Paris"
    open-pull-requests-limit: 10
    commit-message:
      prefix: "deps"
      include: "scope"
    labels:
      - "dependencies"
      - "npm"
    reviewers:
      - "sebcdev"  # Update with actual GitHub username
    groups:
      # Group minor and patch updates to reduce noise
      minor-and-patch:
        patterns:
          - "*"
        update-types:
          - "minor"
          - "patch"
      # Payload CMS updates grouped separately (may need testing)
      payload:
        patterns:
          - "@payloadcms/*"
          - "payload"
        update-types:
          - "minor"
          - "patch"
      # Development tools
      dev-tools:
        patterns:
          - "@types/*"
          - "eslint*"
          - "prettier*"
          - "typescript"
          - "vitest"
          - "@playwright/*"
        update-types:
          - "minor"
          - "patch"
    ignore:
      # Ignore major updates for stability (review manually)
      - dependency-name: "*"
        update-types: ["version-update:semver-major"]
```

### Validation Criteria

- [ ] File created at `.github/dependabot.yml`
- [ ] YAML syntax is valid
- [ ] Both `github-actions` and `npm` ecosystems configured
- [ ] Grouping strategy defined for reduced PR noise
- [ ] Reviewer username updated to actual GitHub username

### Estimated Time: 20-30 minutes

---

## Commit 3: Add Permissions and Concurrency

### Commit Message

```
feat(ci): add GITHUB_TOKEN permissions and concurrency config

- Add workflow-level permissions block (contents: read)
- Add concurrency group to cancel redundant runs
- Follow least privilege principle for security
```

### Files Changed

**MODIFY**: `.github/workflows/quality-gate.yml`

### Implementation Details

#### Step 1: Add Permissions Block

Add at the top of the workflow file, after `on:`:

```yaml
# Permissions: Least privilege principle
# Only request permissions actually needed by job steps
permissions:
  contents: read  # Required for checkout
  # Future phases may add:
  # pull-requests: write  # For status comments (Socket.dev)
  # issues: write         # For @SocketSecurity ignore mechanism

# Concurrency: Cancel redundant workflow runs
# Prevents resource waste when pushing multiple commits quickly
concurrency:
  group: quality-gate-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

#### Step 2: Complete Workflow File

The complete `.github/workflows/quality-gate.yml` after this commit:

```yaml
# .github/workflows/quality-gate.yml
# Quality Gate Pipeline - AI-Shield Defense Strategy
#
# Trigger: Manual via workflow_dispatch (mandatory for branch protection)
# Purpose: Multi-layer code quality validation before merge
#
# Documentation: docs/specs/CI-CD-Security.md

name: Quality Gate

on:
  workflow_dispatch:
    inputs:
      run_mutation_tests:
        description: 'Run Stryker mutation tests (slow, ~15min)'
        required: false
        type: boolean
        default: false

# Permissions: Least privilege principle
# Only request permissions actually needed by job steps
permissions:
  contents: read  # Required for checkout
  # Future phases may add:
  # pull-requests: write  # For status comments (Socket.dev)
  # issues: write         # For @SocketSecurity ignore mechanism

# Concurrency: Cancel redundant workflow runs
# Prevents resource waste when pushing multiple commits quickly
concurrency:
  group: quality-gate-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality-gate:
    name: Quality Checks
    runs-on: ubuntu-latest

    steps:
      # ============================================
      # SETUP: Checkout & Dependencies
      # ============================================

      - name: Checkout repository
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4.2.2
        with:
          fetch-depth: 0  # Full history for git diff operations

      - name: Setup pnpm
        uses: pnpm/action-setup@fe02b34f77f8bc703788d5817da081398fad5dd2  # v4.0.0
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@39370e3970a6d050c480ffad4ff0ed4d3fdee5af  # v4.1.0
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      # ============================================
      # PLACEHOLDER: Quality Checks (Future Phases)
      # ============================================

      - name: Placeholder - Quality checks coming soon
        run: |
          echo "::notice::Phase 1 complete - Foundation workflow established"
          echo "::notice::Future phases will add: Socket.dev, Knip, ESLint, Build, etc."
```

### Validation Criteria

- [ ] `permissions` block added at workflow level
- [ ] `contents: read` is the only active permission
- [ ] `concurrency` block added with cancel-in-progress
- [ ] Concurrency group uses workflow and ref for uniqueness

### Estimated Time: 15-20 minutes

---

## Commit 4: Update Documentation

### Commit Message

```
docs(ci): update CLAUDE.md with quality gate workflow documentation

- Add section on manual workflow trigger process
- Document quality gate strategy and phases
- Add reference to CI-CD-Security.md
```

### Files Changed

**MODIFY**: `CLAUDE.md`

### Implementation Details

#### Step 1: Update CLAUDE.md

The `CLAUDE.md` file already contains CI/CD documentation. Verify and update if needed the section about Quality Gate Workflow.

The existing content in CLAUDE.md already covers:
- Quality Gate Workflow description
- Manual trigger strategy (`workflow_dispatch`)
- Local checks before push
- Supply Chain Security (Socket.dev, SHA Pinning, Dependabot)
- Code Quality Gates

**If additional documentation is needed**, add clarification about:

```markdown
### Manual Workflow Trigger

The Quality Gate workflow is triggered **manually** via GitHub Actions UI:

1. Navigate to **Actions** tab in GitHub
2. Select **Quality Gate** workflow
3. Click **Run workflow**
4. Select the branch to validate
5. (Optional) Enable mutation tests checkbox
6. Click **Run workflow** button

This manual approach is intentional:
- Allows branch protection to require the check
- Avoids redundant runs on every push
- Enables optional slow checks (Stryker)
```

### Validation Criteria

- [ ] CLAUDE.md accurately reflects the workflow configuration
- [ ] Manual trigger process is documented
- [ ] References to CI-CD-Security.md are present

### Estimated Time: 15-20 minutes

---

## Post-Implementation Validation

### Local Validation

```bash
# 1. Verify YAML syntax
cat .github/workflows/quality-gate.yml | python3 -c "import sys, yaml; yaml.safe_load(sys.stdin)"
cat .github/dependabot.yml | python3 -c "import sys, yaml; yaml.safe_load(sys.stdin)"

# 2. Check SHA format (should be 40 characters)
grep -oP 'uses: [^@]+@[a-f0-9]{40}' .github/workflows/quality-gate.yml

# 3. Verify file structure
ls -la .github/
ls -la .github/workflows/
```

### GitHub Validation

After pushing to GitHub:

1. **Workflow Visibility**
   - [ ] Navigate to Actions tab
   - [ ] Verify "Quality Gate" workflow appears
   - [ ] Confirm "Run workflow" button is available

2. **Manual Trigger Test**
   - [ ] Click "Run workflow"
   - [ ] Select current branch
   - [ ] Verify workflow starts and completes successfully

3. **Dependabot Verification**
   - [ ] Navigate to Insights > Dependency graph > Dependabot
   - [ ] Verify both ecosystems are listed
   - [ ] Wait for first scheduled run (or manually trigger via Security tab)

### Success Metrics

| Metric | Target | Validation Method |
|--------|--------|-------------------|
| Workflow execution | < 2 min | Check Actions run duration |
| pnpm cache hit | Yes | Look for "Cache hit" in logs |
| Checkout complete | Yes | No errors in checkout step |
| Dependencies installed | Yes | No errors in install step |

---

## Rollback Plan

If issues are discovered after implementation:

### Quick Rollback

```bash
# Revert last commit
git revert HEAD

# Or revert specific commits
git revert <commit-sha>
```

### Full Phase Rollback

```bash
# Delete workflow files
rm -rf .github/workflows/quality-gate.yml
rm -rf .github/dependabot.yml

# Restore CLAUDE.md to previous state
git checkout HEAD~1 -- CLAUDE.md

# Commit rollback
git add -A
git commit -m "revert(ci): rollback phase 1 - workflow foundation"
```

---

## Next Steps

After completing Phase 1:

1. **Verify workflow runs successfully** via manual trigger
2. **Update PHASES_PLAN.md** with actual duration and notes
3. **Proceed to Phase 2** (Socket.dev) or Phase 3 (ESLint/Prettier)

Phase 2 and Phase 3 can be implemented in parallel since they only depend on Phase 1.

---

**Document Created**: 2025-11-28
**Last Updated**: 2025-11-28
