# Phase 1: Code Review Guide - Workflow Foundation & Dependabot

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Phase**: 1 of 8
**Review Focus**: GitHub Actions security, YAML best practices, SHA pinning

---

## Table of Contents

1. [Review Overview](#review-overview)
2. [Commit-by-Commit Review](#commit-by-commit-review)
3. [Security Review Checklist](#security-review-checklist)
4. [YAML Best Practices](#yaml-best-practices)
5. [Common Issues to Watch](#common-issues-to-watch)
6. [Approval Criteria](#approval-criteria)

---

## Review Overview

### Phase 1 Review Focus Areas

| Area          | Priority | Description                                |
| ------------- | -------- | ------------------------------------------ |
| SHA Pinning   | Critical | All actions must use full SHA, not tags    |
| Permissions   | Critical | Least privilege principle for GITHUB_TOKEN |
| YAML Syntax   | High     | Valid YAML, proper indentation             |
| Concurrency   | Medium   | Prevent redundant workflow runs            |
| Documentation | Medium   | Comments explain rationale                 |

### Review Time Estimate

| Commit                                | Estimated Review Time |
| ------------------------------------- | --------------------- |
| Commit 1: Workflow initialization     | 15-20 minutes         |
| Commit 2: Dependabot configuration    | 10-15 minutes         |
| Commit 3: Permissions and concurrency | 10-15 minutes         |
| Commit 4: Documentation update        | 5-10 minutes          |
| **Total**                             | **40-60 minutes**     |

---

## Commit-by-Commit Review

### Commit 1: Initialize Quality-Gate Workflow

**File**: `.github/workflows/quality-gate.yml`

#### Review Checklist

- [ ] **Workflow name** is descriptive: `name: Quality Gate`
- [ ] **Trigger** is `workflow_dispatch` only (manual trigger strategy)
- [ ] **Input** defined for future mutation tests:
  ```yaml
  inputs:
    run_mutation_tests:
      description: 'Run Stryker mutation tests (slow, ~15min)'
      required: false
      type: boolean
      default: false
  ```

#### SHA Pinning Verification

For each action, verify:

| Action               | Expected SHA                               | Expected Version |
| -------------------- | ------------------------------------------ | ---------------- |
| `actions/checkout`   | `1af3b93b6815bc44a9784bd300feb67ff0d1eeb3` | v6.0.0           |
| `pnpm/action-setup`  | `41ff72655975bd51cab0327fa583b6e92b6d3061` | v4.2.0           |
| `actions/setup-node` | `2028fbc5c25fe9cf00d9f06a71cc4710d4507903` | v6.0.0           |

**Verification steps**:

1. SHA is exactly 40 characters (not shortened)
2. Version comment matches the SHA
3. No `@v4` or `@main` references (must be SHA)

```yaml
# Correct
- uses: actions/checkout@1af3b93b6815bc44a9784bd300feb67ff0d1eeb3 # v6.0.0

# Incorrect - tag reference
- uses: actions/checkout@v6

# Incorrect - shortened SHA
- uses: actions/checkout@1af3b93
```

#### Job Configuration Review

- [ ] `runs-on: ubuntu-latest` is appropriate
- [ ] Job name is descriptive: `name: Quality Checks`
- [ ] `fetch-depth: 0` is set for full git history (needed for future phases)

#### Step Review

1. **Checkout step**:
   - [ ] Uses SHA-pinned action
   - [ ] `fetch-depth: 0` for full history

2. **pnpm Setup step**:
   - [ ] Uses SHA-pinned action
   - [ ] `version: 9` matches project requirements

3. **Node.js Setup step**:
   - [ ] Uses SHA-pinned action
   - [ ] `node-version: '20'` matches project engines
   - [ ] `cache: 'pnpm'` for dependency caching

4. **Install step**:
   - [ ] Uses `--frozen-lockfile` for reproducible builds
   - [ ] No additional flags that bypass lockfile

5. **Placeholder step**:
   - [ ] Uses `::notice::` for GitHub Actions annotations
   - [ ] Clearly indicates future work

---

### Commit 2: Configure Dependabot

**File**: `.github/dependabot.yml`

#### Review Checklist

- [ ] **Version** is `2` (required for modern features)
- [ ] **Both ecosystems** configured: `github-actions` and `npm`
- [ ] **Schedule** is reasonable (weekly, not daily)
- [ ] **Limits** are set to prevent PR flood

#### github-actions Ecosystem Review

```yaml
- package-ecosystem: 'github-actions'
  directory: '/'
  schedule:
    interval: 'weekly'
    day: 'monday'
    time: '09:00'
    timezone: 'Europe/Paris'
```

- [ ] Directory is `/` (root)
- [ ] Schedule is weekly (not daily)
- [ ] Timezone matches project location
- [ ] `open-pull-requests-limit: 10` is reasonable

#### npm Ecosystem Review

- [ ] Same schedule as github-actions (consistency)
- [ ] **Groups** are properly configured:
  - [ ] `minor-and-patch` for general updates
  - [ ] `payload` for Payload CMS packages
  - [ ] `dev-tools` for development dependencies
- [ ] **Ignore** major updates (require manual review)

```yaml
ignore:
  - dependency-name: '*'
    update-types: ['version-update:semver-major']
```

#### Labels and Reviewers

- [ ] Labels help categorize PRs: `dependencies`, ecosystem-specific
- [ ] Reviewer is set to actual GitHub username (not placeholder)
- [ ] Commit message prefixes follow project conventions (`ci`, `deps`)

---

### Commit 3: Add Permissions and Concurrency

**File**: `.github/workflows/quality-gate.yml` (modification)

#### Permissions Block Review

```yaml
permissions:
  contents: read
```

- [ ] **Only `contents: read`** is specified (least privilege)
- [ ] No `write` permissions (not needed for Phase 1)
- [ ] Comments explain future permissions (for reference)
- [ ] Block is placed **after `on:`** and **before `jobs:`**

#### Concurrency Block Review

```yaml
concurrency:
  group: quality-gate-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

- [ ] Group name is unique and descriptive
- [ ] Uses `${{ github.workflow }}` for workflow identification
- [ ] Uses `${{ github.ref }}` for branch isolation
- [ ] `cancel-in-progress: true` prevents redundant runs

#### Security Considerations

- [ ] No secrets referenced in workflow
- [ ] No `pull-requests: write` (not needed yet)
- [ ] No `issues: write` (not needed yet)
- [ ] GITHUB_TOKEN permissions are explicit (not inherited)

---

### Commit 4: Update Documentation

**File**: `CLAUDE.md` (modification)

#### Documentation Review

- [ ] CI/CD section accurately describes the workflow
- [ ] Manual trigger process is documented
- [ ] References to `CI-CD-Security.md` are present and correct
- [ ] No outdated information

#### Content Verification

- [ ] Quality Gate workflow description matches implementation
- [ ] Local checks before push are documented
- [ ] Workflow trigger strategy is explained
- [ ] No placeholder text remains

---

## Security Review Checklist

### Critical Security Items

| Item                                | Status | Notes                               |
| ----------------------------------- | ------ | ----------------------------------- |
| All actions use full SHA (40 chars) | [ ]    | Not tags or branches                |
| No secrets in workflow file         | [ ]    | Secrets only via `${{ secrets.* }}` |
| Permissions follow least privilege  | [ ]    | Only `contents: read`               |
| No `pull_request_target` trigger    | [ ]    | Security risk for public repos      |
| No inline scripts with user input   | [ ]    | Prevent injection                   |

### SHA Pinning Verification Commands

```bash
# Count SHA-pinned actions (should be 3)
grep -c '@[a-f0-9]\{40\}' .github/workflows/quality-gate.yml

# List all action references
grep 'uses:' .github/workflows/quality-gate.yml

# Verify no tag references
grep -E '@v[0-9]' .github/workflows/quality-gate.yml
# Should return nothing
```

### Permissions Verification

```bash
# Check permissions block exists
grep -A5 '^permissions:' .github/workflows/quality-gate.yml

# Verify only read permissions
grep 'write' .github/workflows/quality-gate.yml
# Should return nothing (or only in comments)
```

---

## YAML Best Practices

### Indentation Rules

- [ ] Use 2 spaces for indentation (not tabs)
- [ ] Consistent indentation throughout file
- [ ] No trailing whitespace

### Structure Rules

- [ ] Keys are lowercase with hyphens
- [ ] Strings are quoted when containing special characters
- [ ] Comments explain non-obvious choices

### Workflow-Specific Rules

- [ ] `name` at top level
- [ ] `on` before `permissions`
- [ ] `permissions` before `concurrency`
- [ ] `concurrency` before `jobs`
- [ ] Steps have descriptive names

---

## Common Issues to Watch

### Issue 1: Incorrect SHA Length

```yaml
# Wrong (7 characters)
- uses: actions/checkout@1af3b93

# Correct (40 characters)
- uses: actions/checkout@1af3b93b6815bc44a9784bd300feb67ff0d1eeb3
```

### Issue 2: Missing Version Comment

```yaml
# Wrong (no version comment)
- uses: actions/checkout@1af3b93b6815bc44a9784bd300feb67ff0d1eeb3

# Correct (version comment for maintainability)
- uses: actions/checkout@1af3b93b6815bc44a9784bd300feb67ff0d1eeb3 # v6.0.0
```

### Issue 3: Overly Permissive Permissions

```yaml
# Wrong (write permissions not needed)
permissions:
  contents: write
  pull-requests: write

# Correct (minimal permissions)
permissions:
  contents: read
```

### Issue 4: Tag Instead of SHA

```yaml
# Wrong (mutable tag)
- uses: actions/checkout@v6

# Correct (immutable SHA)
- uses: actions/checkout@1af3b93b6815bc44a9784bd300feb67ff0d1eeb3 # v6.0.0
```

### Issue 5: Missing Concurrency Control

```yaml
# Wrong (no concurrency control)
jobs:
  quality-gate:
    ...

# Correct (with concurrency)
concurrency:
  group: quality-gate-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality-gate:
    ...
```

---

## Approval Criteria

### Must Have (Blocking)

- [ ] All actions use full SHA pinning
- [ ] Permissions are minimal (`contents: read` only)
- [ ] YAML syntax is valid
- [ ] Concurrency control is configured
- [ ] No secrets exposed in workflow

### Should Have (Non-Blocking)

- [ ] Version comments match SHA versions
- [ ] Comments explain rationale
- [ ] Dependabot groups configured
- [ ] Documentation updated

### Nice to Have

- [ ] Consistent naming conventions
- [ ] Clear placeholder messages
- [ ] Timezone in Dependabot schedule

---

## Review Decision Matrix

| Criteria                 | Pass              | Fail              |
| ------------------------ | ----------------- | ----------------- |
| All SHA pins valid       | Approve           | Request changes   |
| Minimal permissions      | Approve           | Request changes   |
| Valid YAML               | Approve           | Request changes   |
| Concurrency configured   | Approve           | Request changes   |
| Version comments present | Approve (warning) | Approve (warning) |
| Documentation complete   | Approve           | Approve (comment) |

---

## Reviewer Notes Template

Use this template for PR review comments:

```markdown
## Phase 1 Review: Workflow Foundation & Dependabot

### Security Review

- [ ] SHA pinning verified
- [ ] Permissions are minimal
- [ ] No secrets exposed

### Configuration Review

- [ ] Workflow structure correct
- [ ] Dependabot configured properly
- [ ] Concurrency group defined

### Documentation Review

- [ ] CLAUDE.md updated
- [ ] Comments are clear

### Overall Assessment

- Status: [ ] Approved / [ ] Changes Requested
- Notes: [Add specific feedback here]
```

---

**Document Created**: 2025-11-28
**Last Updated**: 2025-11-28
