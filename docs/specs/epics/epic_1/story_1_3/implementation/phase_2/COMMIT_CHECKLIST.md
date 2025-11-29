# Phase 2: Commit Checklist - Supply Chain Security (Socket.dev)

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Phase**: 2 of 8
**Total Commits**: 4

---

## Checklist Overview

Use this checklist to track progress through each atomic commit. Each commit should be independently valid and the codebase should remain functional after each commit.

---

## Commit 1: Create socket.yml Configuration

### Pre-Commit Checklist

- [ ] Read IMPLEMENTATION_PLAN.md Commit 1 section
- [ ] Verify Phase 1 is complete (quality-gate.yml exists)
- [ ] Understand Socket.dev v2 configuration schema

### Implementation Checklist

- [ ] Create `socket.yml` at repository root:

  ```yaml
  # socket.yml
  version: 2

  projectIgnorePaths:
    - 'tests/**'
    - 'docs/**'
    - '**/__tests__/**'
    - '**/fixtures/**'

  triggerPaths:
    - 'package.json'
    - '**/package.json'
    - 'pnpm-lock.yaml'
    - 'socket.yml'

  githubApp:
    enabled: true
    dependencyOverviewEnabled: true
  ```

- [ ] Verify file structure:
  - [ ] `version: 2` (number, not string)
  - [ ] `projectIgnorePaths` is an array
  - [ ] `triggerPaths` is an array
  - [ ] `githubApp` is an object with two keys

### Validation Checklist

- [ ] YAML syntax valid (use `yq` or VS Code YAML extension)
- [ ] File is at repository root (same level as `package.json`)
- [ ] All paths use forward slashes
- [ ] No trailing whitespace

### Commit Checklist

- [ ] Stage file: `git add socket.yml`
- [ ] Verify staged changes: `git diff --cached`
- [ ] Commit with message:

  ```
  feat(security): add socket.yml configuration for supply chain scanning

  - Create socket.yml with v2 schema
  - Configure projectIgnorePaths to exclude tests and docs
  - Configure triggerPaths for efficient scanning
  - Enable GitHub App integration
  ```

### Post-Commit Verification

- [ ] `git log -1` shows correct commit message
- [ ] `git show --stat` shows only `socket.yml` file
- [ ] No uncommitted changes: `git status` is clean

---

## Commit 2: Add Socket.dev Step to Workflow

### Pre-Commit Checklist

- [ ] Commit 1 is complete and verified
- [ ] Read IMPLEMENTATION_PLAN.md Commit 2 section
- [ ] Verify Socket.dev action SHA (see reference table below)

### Implementation Checklist

- [ ] Open `.github/workflows/quality-gate.yml` for editing

- [ ] Add permissions for Socket.dev (if not already present):

  ```yaml
  permissions:
    contents: read
    issues: write # For Socket.dev comments
    pull-requests: write # For Socket.dev PR updates
  ```

- [ ] Add Socket.dev step after `pnpm install`:

  ```yaml
  # ============================================
  # LAYER 1: Supply Chain Security
  # ============================================

  - name: Socket.dev Security Scan
    uses: SocketDev/socket-security-action@6f55d8fa2cebd6ef40fad5e1dea9ae0edbe4ee13 # v2.0.1
    with:
      github-token: ${{ secrets.GITHUB_TOKEN }}
    continue-on-error: true # Don't block if service unavailable
  ```

- [ ] Verify step placement:
  - [ ] After `pnpm install --frozen-lockfile`
  - [ ] Before any other quality checks

- [ ] Remove or update placeholder step if present

### Validation Checklist

- [ ] YAML syntax valid
- [ ] SHA is exactly 40 characters
- [ ] Version comment matches SHA (v2.0.1)
- [ ] `continue-on-error: true` is set
- [ ] Permissions include `issues: write` and `pull-requests: write`

### Commit Checklist

- [ ] Stage file: `git add .github/workflows/quality-gate.yml`
- [ ] Verify staged changes: `git diff --cached`
- [ ] Commit with message:

  ```
  feat(security): integrate Socket.dev supply chain scanning

  - Add Socket.dev security action pinned by SHA (v2.0.1)
  - Add required permissions for PR commenting
  - Configure continue-on-error for service resilience
  - Position scan after dependency installation
  ```

### Post-Commit Verification

- [ ] `git log -1` shows correct commit message
- [ ] `git show` shows workflow changes
- [ ] No uncommitted changes

---

## Commit 3: Configure Security and License Policies

### Pre-Commit Checklist

- [ ] Commits 1-2 are complete and verified
- [ ] Read IMPLEMENTATION_PLAN.md Commit 3 section
- [ ] Understand license policy implications

### Implementation Checklist

- [ ] Open `socket.yml` for editing

- [ ] Add `issueRules` section:

  ```yaml
  # Issue-specific rule configuration
  issueRules:
    # Default rules are enabled (malware, typosquatting)
    # Uncomment to disable if false positives occur:
    # unsafe-eval: false
  ```

- [ ] Add `licensePolicies` section:

  ```yaml
  # License compliance - block viral licenses
  licensePolicies:
    deny:
      - 'GPL-2.0-only'
      - 'GPL-2.0-or-later'
      - 'GPL-3.0-only'
      - 'GPL-3.0-or-later'
      - 'AGPL-3.0-only'
      - 'AGPL-3.0-or-later'
  ```

- [ ] Verify complete file structure:
  - [ ] `version: 2`
  - [ ] `projectIgnorePaths`
  - [ ] `triggerPaths`
  - [ ] `issueRules`
  - [ ] `githubApp`
  - [ ] `licensePolicies`

### Validation Checklist

- [ ] YAML syntax valid
- [ ] All license identifiers are SPDX standard format
- [ ] `licensePolicies.deny` is an array
- [ ] No duplicate keys in file

### Commit Checklist

- [ ] Stage file: `git add socket.yml`
- [ ] Verify staged changes: `git diff --cached`
- [ ] Commit with message:

  ```
  feat(security): configure Socket.dev security and license policies

  - Add issueRules section for granular control
  - Add licensePolicies to block GPL/AGPL licenses
  - Ensure legal compliance with license enforcement
  ```

### Post-Commit Verification

- [ ] `git log -1` shows correct commit message
- [ ] `git show` shows socket.yml changes
- [ ] No uncommitted changes

---

## Commit 4: Document Socket.dev Workflow

### Pre-Commit Checklist

- [ ] Commits 1-3 are complete and verified
- [ ] Read IMPLEMENTATION_PLAN.md Commit 4 section
- [ ] Review existing docs structure

### Implementation Checklist

- [ ] Create directory if needed:

  ```bash
  mkdir -p docs/guides
  ```

- [ ] Create `docs/guides/socket-security.md`:

  ```markdown
  # Socket.dev Security Guide

  ## Overview

  This project uses Socket.dev for supply chain security. Socket.dev analyzes npm packages for malicious behavior, not just known CVEs.

  ## What Gets Scanned

  - `package.json` dependencies
  - `pnpm-lock.yaml` lockfile
  - All transitive dependencies

  ## Security Levels

  | Level       | Meaning                 | Action                    |
  | ----------- | ----------------------- | ------------------------- |
  | **Block**   | Critical security issue | Must resolve before merge |
  | **Warn**    | Potential concern       | Review and decide         |
  | **Monitor** | Informational           | No action required        |

  ## Handling Alerts

  ### Blocked Package

  If a legitimate package is blocked:

  1. Review the alert reason in the PR check
  2. If it's a false positive, add a PR comment:
  ```

  @SocketSecurity ignore <package>@<version>

  ```
  3. Explain why it's acceptable
  4. Socket.dev will re-scan and allow the package

  ### License Violations

  This project blocks GPL/AGPL licenses for legal compliance.

  If you need a GPL package:
  1. Find an MIT/Apache alternative first
  2. If no alternative exists, consult with tech lead

  ## Configuration

  - Config file: `socket.yml` (repository root)
  - Reference: [Socket.dev docs](https://docs.socket.dev/docs/socket-yml)

  ## Troubleshooting

  ### Scan Timeout

  Socket.dev scans only when `triggerPaths` files change:
  - `package.json`
  - `pnpm-lock.yaml`
  - `socket.yml`

  If scans are slow, check if your lockfile is unusually large.

  ### Persistent False Positives

  For repeated false positives on specific packages:
  1. Document with `@SocketSecurity ignore` in a PR
  2. Consider adding to `issueRules` in `socket.yml`
  ```

### Validation Checklist

- [ ] File exists at `docs/guides/socket-security.md`
- [ ] Markdown renders correctly
- [ ] All examples are copy-pasteable
- [ ] External links work

### Commit Checklist

- [ ] Stage file: `git add docs/guides/socket-security.md`
- [ ] Verify staged changes: `git diff --cached`
- [ ] Commit with message:

  ```
  docs(security): add Socket.dev security guide for developers

  - Document Socket.dev integration and purpose
  - Explain security levels and alert handling
  - Document @SocketSecurity ignore workflow
  - Add license policy explanation and troubleshooting
  ```

### Post-Commit Verification

- [ ] `git log -1` shows correct commit message
- [ ] All 4 commits are in history: `git log --oneline -4`
- [ ] No uncommitted changes

---

## Phase Completion Checklist

### Files Created/Modified

- [ ] `socket.yml` - Created with full configuration
- [ ] `.github/workflows/quality-gate.yml` - Modified with Socket.dev step
- [ ] `docs/guides/socket-security.md` - Created

### Functional Verification

- [ ] Push to GitHub: `git push origin story_1_3`
- [ ] Navigate to GitHub Actions tab
- [ ] Click "Run workflow" on Quality Gate
- [ ] Verify Socket.dev step appears in logs
- [ ] Verify Socket.dev step completes (green or yellow)
- [ ] Check Socket.dev output for any alerts

### Security Verification

- [ ] No blocking alerts on current codebase
- [ ] Scan completes in < 30 seconds
- [ ] License policy is active (verify in Socket dashboard if available)

### Documentation Verification

- [ ] `docs/guides/socket-security.md` exists
- [ ] Documentation is accurate for current config
- [ ] Ignore workflow is documented

### Phase Sign-Off

- [ ] All 4 commits completed
- [ ] Socket.dev scanning works
- [ ] No false positives on clean codebase
- [ ] Documentation complete

**Phase 2 Status**: [ ] COMPLETE

---

## Quick Reference: SHA Values

| Action                             | Version | SHA                                        |
| ---------------------------------- | ------- | ------------------------------------------ |
| `SocketDev/socket-security-action` | v2.0.1  | `6f55d8fa2cebd6ef40fad5e1dea9ae0edbe4ee13` |

### How to Verify SHA

```bash
# Get the commit SHA for a specific tag
curl -s https://api.github.com/repos/SocketDev/socket-security-action/git/refs/tags/v2.0.1 | jq -r '.object.sha'
```

---

## Quick Reference: Commit Messages

```bash
# Commit 1
git commit -m "feat(security): add socket.yml configuration for supply chain scanning"

# Commit 2
git commit -m "feat(security): integrate Socket.dev supply chain scanning"

# Commit 3
git commit -m "feat(security): configure Socket.dev security and license policies"

# Commit 4
git commit -m "docs(security): add Socket.dev security guide for developers"
```

---

## Gitmoji Alternative

If using Gitmoji commit style:

```bash
# Commit 1
git commit -m "🔧 Add socket.yml configuration for supply chain scanning"

# Commit 2
git commit -m "🔒 Integrate Socket.dev supply chain scanning"

# Commit 3
git commit -m "🔒 Configure Socket.dev security and license policies"

# Commit 4
git commit -m "📝 Add Socket.dev security guide for developers"
```

---

**Document Created**: 2025-11-28
**Last Updated**: 2025-11-28
