# Phase 1: Commit Checklist - Workflow Foundation & Dependabot

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Phase**: 1 of 8
**Total Commits**: 4

---

## Checklist Overview

Use this checklist to track progress through each atomic commit. Each commit should be independently valid and the codebase should remain functional after each commit.

---

## Commit 1: Initialize Quality-Gate Workflow

### Pre-Commit Checklist

- [ ] Read IMPLEMENTATION_PLAN.md Commit 1 section
- [ ] Verify `.github` directory doesn't already exist (or is empty)
- [ ] Have SHA values ready for actions (verified from GitHub releases)

### Implementation Checklist

- [ ] Create `.github/workflows/` directory

  ```bash
  mkdir -p .github/workflows
  ```

- [ ] Create `quality-gate.yml` file with:
  - [ ] `name: Quality Gate`
  - [ ] `on: workflow_dispatch` with `run_mutation_tests` input
  - [ ] `jobs.quality-gate` job definition
  - [ ] `runs-on: ubuntu-latest`

- [ ] Add Checkout step:
  - [ ] Action: `actions/checkout`
  - [ ] SHA: `1af3b93b6815bc44a9784bd300feb67ff0d1eeb3`
  - [ ] Version comment: `# v6.0.0`
  - [ ] Option: `fetch-depth: 0`

- [ ] Add pnpm Setup step:
  - [ ] Action: `pnpm/action-setup`
  - [ ] SHA: `41ff72655975bd51cab0327fa583b6e92b6d3061`
  - [ ] Version comment: `# v4.2.0`
  - [ ] Option: `version: 9`

- [ ] Add Node.js Setup step:
  - [ ] Action: `actions/setup-node`
  - [ ] SHA: `2028fbc5c25fe9cf00d9f06a71cc4710d4507903`
  - [ ] Version comment: `# v6.0.0`
  - [ ] Options: `node-version: '20'`, `cache: 'pnpm'`

- [ ] Add Install Dependencies step:
  - [ ] Command: `pnpm install --frozen-lockfile`

- [ ] Add Placeholder step with notice messages

### Validation Checklist

- [ ] YAML syntax valid (no red squiggles in VS Code)
- [ ] All SHA values are exactly 40 characters
- [ ] All version comments match SHA versions
- [ ] File saved without trailing whitespace

### Commit Checklist

- [ ] Stage file: `git add .github/workflows/quality-gate.yml`
- [ ] Verify staged changes: `git diff --cached`
- [ ] Commit with message:

  ```
  feat(ci): initialize quality-gate workflow with SHA-pinned actions

  - Create .github/workflows/quality-gate.yml with workflow_dispatch trigger
  - Add checkout action pinned by SHA (v6.0.0)
  - Add setup-node action pinned by SHA (v6.0.0)
  - Add pnpm action-setup pinned by SHA (v4.2.0)
  - Configure Node.js 20.x with pnpm caching
  - Add placeholder for future quality checks
  ```

### Post-Commit Verification

- [ ] `git log -1` shows correct commit message
- [ ] `git show --stat` shows only `quality-gate.yml` file
- [ ] No uncommitted changes: `git status` is clean

---

## Commit 2: Configure Dependabot

### Pre-Commit Checklist

- [ ] Commit 1 is complete and verified
- [ ] Read IMPLEMENTATION_PLAN.md Commit 2 section
- [ ] Know your GitHub username for reviewer field

### Implementation Checklist

- [ ] Create `dependabot.yml` file in `.github/`:
  - [ ] `version: 2`
  - [ ] `updates` array with two entries

- [ ] Configure `github-actions` ecosystem:
  - [ ] `package-ecosystem: "github-actions"`
  - [ ] `directory: "/"`
  - [ ] `schedule.interval: "weekly"`
  - [ ] `schedule.day: "monday"`
  - [ ] `schedule.time: "09:00"`
  - [ ] `schedule.timezone: "Europe/Paris"`
  - [ ] `open-pull-requests-limit: 10`
  - [ ] `commit-message.prefix: "ci"`
  - [ ] `labels` array with "dependencies", "github-actions"
  - [ ] `reviewers` array with your username

- [ ] Configure `npm` ecosystem:
  - [ ] `package-ecosystem: "npm"`
  - [ ] `directory: "/"`
  - [ ] `schedule.interval: "weekly"`
  - [ ] `schedule.day: "monday"`
  - [ ] `schedule.time: "09:00"`
  - [ ] `schedule.timezone: "Europe/Paris"`
  - [ ] `open-pull-requests-limit: 10`
  - [ ] `commit-message.prefix: "deps"`
  - [ ] `labels` array with "dependencies", "npm"
  - [ ] `reviewers` array with your username
  - [ ] `groups.minor-and-patch` configuration
  - [ ] `groups.payload` for Payload CMS packages
  - [ ] `groups.dev-tools` for development dependencies
  - [ ] `ignore` for major version updates

### Validation Checklist

- [ ] YAML syntax valid
- [ ] Both ecosystems have complete configuration
- [ ] Reviewer username is correct (not placeholder)
- [ ] Groups are properly defined
- [ ] Ignore rules are in place

### Commit Checklist

- [ ] Stage file: `git add .github/dependabot.yml`
- [ ] Verify staged changes: `git diff --cached`
- [ ] Commit with message:

  ```
  feat(ci): configure dependabot for actions and npm packages

  - Create .github/dependabot.yml for automated dependency updates
  - Configure weekly schedule for github-actions ecosystem
  - Configure weekly schedule for npm packages
  - Group minor/patch updates to reduce PR noise
  - Set open-pull-requests-limit to 10
  ```

### Post-Commit Verification

- [ ] `git log -1` shows correct commit message
- [ ] `git show --stat` shows only `dependabot.yml` file
- [ ] No uncommitted changes

---

## Commit 3: Add Permissions and Concurrency

### Pre-Commit Checklist

- [ ] Commits 1-2 are complete and verified
- [ ] Read IMPLEMENTATION_PLAN.md Commit 3 section
- [ ] Understand GITHUB_TOKEN permissions model

### Implementation Checklist

- [ ] Open `quality-gate.yml` for editing

- [ ] Add `permissions` block after `on:`:
  - [ ] `contents: read` (only permission needed)
  - [ ] Comments explaining future permissions

- [ ] Add `concurrency` block after `permissions`:
  - [ ] `group: quality-gate-${{ github.workflow }}-${{ github.ref }}`
  - [ ] `cancel-in-progress: true`

- [ ] Verify workflow structure:
  - [ ] `name` at top
  - [ ] `on` with workflow_dispatch
  - [ ] `permissions` block
  - [ ] `concurrency` block
  - [ ] `jobs` at bottom

### Validation Checklist

- [ ] YAML syntax still valid
- [ ] Permissions block has `contents: read` only
- [ ] Concurrency group uses correct variables
- [ ] No duplicate keys in YAML

### Commit Checklist

- [ ] Stage file: `git add .github/workflows/quality-gate.yml`
- [ ] Verify staged changes: `git diff --cached`
- [ ] Commit with message:

  ```
  feat(ci): add GITHUB_TOKEN permissions and concurrency config

  - Add workflow-level permissions block (contents: read)
  - Add concurrency group to cancel redundant runs
  - Follow least privilege principle for security
  ```

### Post-Commit Verification

- [ ] `git log -1` shows correct commit message
- [ ] `git show` shows permissions and concurrency additions
- [ ] No uncommitted changes

---

## Commit 4: Update Documentation

### Pre-Commit Checklist

- [ ] Commits 1-3 are complete and verified
- [ ] Read IMPLEMENTATION_PLAN.md Commit 4 section
- [ ] Review current CLAUDE.md content

### Implementation Checklist

- [ ] Open `CLAUDE.md` for review

- [ ] Verify CI/CD section exists and includes:
  - [ ] Quality Gate Workflow description
  - [ ] Manual trigger strategy mention
  - [ ] Local checks before push
  - [ ] Reference to CI-CD-Security.md

- [ ] If documentation needs updates:
  - [ ] Add manual workflow trigger instructions
  - [ ] Update any outdated references
  - [ ] Ensure consistency with new workflow

- [ ] If no changes needed:
  - [ ] Document why in commit message
  - [ ] Consider adding a comment to existing docs

### Validation Checklist

- [ ] CLAUDE.md accurately describes the workflow
- [ ] No broken internal links
- [ ] Formatting is consistent with rest of file
- [ ] No placeholder text left

### Commit Checklist

- [ ] Stage file: `git add CLAUDE.md`
- [ ] Verify staged changes: `git diff --cached`
- [ ] Commit with message:

  ```
  docs(ci): update CLAUDE.md with quality gate workflow documentation

  - Add section on manual workflow trigger process
  - Document quality gate strategy and phases
  - Add reference to CI-CD-Security.md
  ```

### Post-Commit Verification

- [ ] `git log -1` shows correct commit message
- [ ] All 4 commits are in history: `git log --oneline -4`
- [ ] No uncommitted changes

---

## Phase Completion Checklist

### Files Created/Modified

- [ ] `.github/workflows/quality-gate.yml` - Created
- [ ] `.github/dependabot.yml` - Created
- [ ] `CLAUDE.md` - Verified/Updated

### Functional Verification

- [ ] Push to GitHub: `git push origin story_1_3`
- [ ] Navigate to GitHub Actions tab
- [ ] Verify "Quality Gate" workflow is visible
- [ ] Click "Run workflow" button
- [ ] Select branch and run workflow
- [ ] Verify workflow completes successfully (green check)
- [ ] Verify pnpm cache is utilized (check logs)

### Dependabot Verification

- [ ] Navigate to repository Settings > Security > Dependabot
- [ ] Verify Dependabot is enabled
- [ ] Navigate to Insights > Dependency graph > Dependabot
- [ ] Verify both ecosystems are listed

### Documentation Verification

- [ ] CLAUDE.md reflects current workflow configuration
- [ ] No outdated references

### Phase Sign-Off

- [ ] All 4 commits completed
- [ ] Workflow runs successfully
- [ ] Dependabot configured
- [ ] Documentation updated

**Phase 1 Status**: [ ] COMPLETE

---

## Quick Reference: SHA Values

| Action               | Version | SHA                                        |
| -------------------- | ------- | ------------------------------------------ |
| `actions/checkout`   | v6.0.0  | `1af3b93b6815bc44a9784bd300feb67ff0d1eeb3` |
| `actions/setup-node` | v6.0.0  | `2028fbc5c25fe9cf00d9f06a71cc4710d4507903` |
| `pnpm/action-setup`  | v4.2.0  | `41ff72655975bd51cab0327fa583b6e92b6d3061` |

---

## Quick Reference: Commit Messages

```bash
# Commit 1
git commit -m "feat(ci): initialize quality-gate workflow with SHA-pinned actions"

# Commit 2
git commit -m "feat(ci): configure dependabot for actions and npm packages"

# Commit 3
git commit -m "feat(ci): add GITHUB_TOKEN permissions and concurrency config"

# Commit 4
git commit -m "docs(ci): update CLAUDE.md with quality gate workflow documentation"
```

---

**Document Created**: 2025-11-28
**Last Updated**: 2025-11-28
