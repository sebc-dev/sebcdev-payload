# Phase 2: Code Review Guide - Supply Chain Security (Socket.dev)

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Phase**: 2 of 8

---

## Review Scope

This guide helps reviewers validate the Phase 2 implementation. Each commit should be reviewed independently to ensure:

- Correct configuration syntax
- Security best practices
- Documentation completeness

---

## Commit 1 Review: socket.yml Configuration

### Files to Review

| File         | Focus Areas                                |
| ------------ | ------------------------------------------ |
| `socket.yml` | Schema version, path patterns, YAML syntax |

### Review Checklist

#### Schema Version

- [ ] `version: 2` is present and is a number (not `"2"`)
- [ ] File is at repository root (same level as `package.json`)

#### Path Patterns

- [ ] `projectIgnorePaths` excludes test directories
- [ ] `projectIgnorePaths` excludes documentation
- [ ] `triggerPaths` includes `package.json`
- [ ] `triggerPaths` includes `pnpm-lock.yaml`
- [ ] All paths use forward slashes (cross-platform)

#### YAML Syntax

- [ ] No duplicate keys
- [ ] Proper indentation (2 spaces)
- [ ] Arrays use `-` prefix correctly
- [ ] No trailing whitespace

#### GitHub App Section

- [ ] `githubApp.enabled: true`
- [ ] `dependencyOverviewEnabled: true`

### Common Issues to Flag

| Issue                                       | Severity | Resolution         |
| ------------------------------------------- | -------- | ------------------ |
| Wrong version format (`"2"` instead of `2`) | High     | Fix schema version |
| Missing `pnpm-lock.yaml` in triggerPaths    | Medium   | Add lockfile path  |
| Overly broad ignore patterns                | Medium   | Be more specific   |

### Example Valid Configuration

```yaml
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

---

## Commit 2 Review: Workflow Integration

### Files to Review

| File                                 | Focus Areas                          |
| ------------------------------------ | ------------------------------------ |
| `.github/workflows/quality-gate.yml` | SHA pinning, permissions, step order |

### Review Checklist

#### SHA Pinning

- [ ] Action uses full SHA (40 characters)
- [ ] Version comment matches SHA version
- [ ] SHA is correct for specified version

Expected:

```yaml
uses: SocketDev/socket-security-action@6f55d8fa2cebd6ef40fad5e1dea9ae0edbe4ee13 # v2.0.1
```

#### Permissions

- [ ] `contents: read` is present
- [ ] `issues: write` is present (for PR comments)
- [ ] `pull-requests: write` is present (for status updates)
- [ ] No excessive permissions (no `contents: write`)

#### Step Configuration

- [ ] `continue-on-error: true` is set
- [ ] `github-token` uses `${{ secrets.GITHUB_TOKEN }}`
- [ ] Step is positioned after `pnpm install`
- [ ] Step has descriptive name

#### Step Order Verification

- [ ] Checkout first
- [ ] pnpm setup second
- [ ] Node.js setup third
- [ ] Dependency install fourth
- [ ] Socket.dev scan fifth (after install)

### Common Issues to Flag

| Issue                       | Severity | Resolution               |
| --------------------------- | -------- | ------------------------ |
| SHA not 40 characters       | Critical | Get correct SHA          |
| Missing `continue-on-error` | High     | Add for resilience       |
| Wrong permissions           | High     | Add required permissions |
| Step before install         | Medium   | Move after pnpm install  |

### Example Valid Step

```yaml
jobs:
  quality-gate:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      issues: write
      pull-requests: write

    steps:
      # ... setup steps ...

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Socket.dev Security Scan
        uses: SocketDev/socket-security-action@6f55d8fa2cebd6ef40fad5e1dea9ae0edbe4ee13 # v2.0.1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
        continue-on-error: true
```

---

## Commit 3 Review: Security Policies

### Files to Review

| File         | Focus Areas                   |
| ------------ | ----------------------------- |
| `socket.yml` | License policies, issue rules |

### Review Checklist

#### License Policies

- [ ] `licensePolicies.deny` array exists
- [ ] GPL-2.0 variants blocked
- [ ] GPL-3.0 variants blocked
- [ ] AGPL-3.0 variants blocked
- [ ] License identifiers use SPDX format

#### Issue Rules

- [ ] `issueRules` section exists
- [ ] Default rules (malware, typosquatting) not disabled
- [ ] Any disabled rules have justification comment

#### SPDX License Identifiers

Verify license identifiers are correct SPDX format:

| Correct            | Incorrect |
| ------------------ | --------- |
| `GPL-2.0-only`     | `GPL2`    |
| `GPL-3.0-or-later` | `GPLv3`   |
| `AGPL-3.0-only`    | `AGPL`    |

### Common Issues to Flag

| Issue                  | Severity | Resolution            |
| ---------------------- | -------- | --------------------- |
| Wrong license format   | High     | Use SPDX identifiers  |
| Missing GPL variant    | Medium   | Add missing license   |
| Critical rule disabled | High     | Require justification |

### Example Valid Policies

```yaml
issueRules:
  # Default rules enabled
  # unsafe-eval: false  # Only if needed

licensePolicies:
  deny:
    - 'GPL-2.0-only'
    - 'GPL-2.0-or-later'
    - 'GPL-3.0-only'
    - 'GPL-3.0-or-later'
    - 'AGPL-3.0-only'
    - 'AGPL-3.0-or-later'
```

---

## Commit 4 Review: Documentation

### Files to Review

| File                             | Focus Areas                      |
| -------------------------------- | -------------------------------- |
| `docs/guides/socket-security.md` | Accuracy, completeness, examples |

### Review Checklist

#### Content Accuracy

- [ ] Security levels correctly described
- [ ] Ignore workflow correctly documented
- [ ] License policy matches `socket.yml`
- [ ] All examples are accurate and copyable

#### Completeness

- [ ] Overview section present
- [ ] What gets scanned section present
- [ ] Security levels table present
- [ ] Handling alerts section present
- [ ] Troubleshooting section present

#### Quality

- [ ] Markdown renders correctly
- [ ] No broken links
- [ ] Examples use proper formatting
- [ ] Code blocks have language specified

### Common Issues to Flag

| Issue                     | Severity | Resolution                 |
| ------------------------- | -------- | -------------------------- |
| Incorrect ignore syntax   | High     | Fix example                |
| Missing troubleshooting   | Medium   | Add section                |
| Outdated config reference | Medium   | Update to match socket.yml |

### Example Valid Documentation Structure

```markdown
# Socket.dev Security Guide

## Overview

[Brief description]

## What Gets Scanned

[List of scanned files]

## Security Levels

[Table of Block/Warn/Monitor]

## Handling Alerts

### Blocked Package

[Steps with @SocketSecurity ignore example]

### License Violations

[Explanation of policy]

## Configuration

[Reference to socket.yml]

## Troubleshooting

[Common issues and solutions]
```

---

## Cross-Commit Review

### Consistency Checks

After all 4 commits, verify:

- [ ] `socket.yml` configuration matches documentation
- [ ] Workflow references correct `socket.yml` location
- [ ] Documentation examples match actual commands
- [ ] All license policies are consistent across files

### Integration Verification

- [ ] Run workflow manually after all commits
- [ ] Verify Socket.dev step appears in logs
- [ ] Confirm no blocking alerts on clean codebase
- [ ] Test that documentation is findable

---

## Security Review Emphasis

### Critical Security Points

1. **SHA Pinning**: Verify SHA is from official release
2. **Permissions**: Ensure least-privilege principle
3. **License Policy**: Verify GPL/AGPL blocking
4. **No Secrets in Code**: No API keys or tokens committed

### Red Flags to Watch For

| Red Flag                     | Why It's Concerning         |
| ---------------------------- | --------------------------- |
| Tag instead of SHA           | Mutable reference           |
| `contents: write` permission | Excessive access            |
| Disabled malware detection   | Removes critical protection |
| API key in `socket.yml`      | Secret exposure             |

---

## Approval Criteria

### Commit-Level Approval

Each commit can be approved if:

- [ ] All checklist items pass
- [ ] No critical issues found
- [ ] Security best practices followed

### Phase-Level Approval

Phase 2 can be approved if:

- [ ] All 4 commits reviewed and approved
- [ ] Workflow runs successfully
- [ ] Socket.dev scan completes without blocking alerts
- [ ] Documentation is accurate and complete

---

**Document Created**: 2025-11-28
**Last Updated**: 2025-11-28
