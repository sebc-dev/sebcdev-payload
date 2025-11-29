# Phase 2: Implementation Plan - Supply Chain Security (Socket.dev)

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Phase**: 2 of 8
**Total Commits**: 4
**Estimated Duration**: 1-2 days

---

## Implementation Strategy

### Atomic Commit Principles

Each commit in this phase follows atomic commit principles:
- **Single Responsibility**: One logical change per commit
- **Type-Safe**: Codebase remains valid after each commit
- **Reviewable**: Changes can be understood in 15-30 minutes
- **Revertable**: Each commit can be reverted independently

### Commit Sequence

```
Commit 1: socket.yml Configuration (Foundation)
    │
    ▼
Commit 2: Workflow Integration (Action Step)
    │
    ▼
Commit 3: Security & License Policies (Hardening)
    │
    ▼
Commit 4: Documentation (Completeness)
```

### Why This Order?

1. **Configuration First**: The `socket.yml` file must exist before the action runs
2. **Basic Integration**: Get the action running with minimal config
3. **Policy Hardening**: Add security policies after confirming basic function
4. **Documentation Last**: Document the final, validated configuration

---

## Commit 1: Create socket.yml Configuration

### Objective

Create the Socket.dev configuration file with v2 schema, establishing the foundation for all security policies.

### Files Changed

| File | Action | Lines |
|------|--------|-------|
| `socket.yml` | Create | ~30 |

### Implementation Details

```yaml
# socket.yml
# Socket.dev Configuration (v2)
# Documentation: https://docs.socket.dev/docs/socket-yml

version: 2

# Exclude test fixtures and documentation from scanning
projectIgnorePaths:
  - "tests/**"
  - "docs/**"
  - "**/__tests__/**"
  - "**/fixtures/**"

# Only trigger scans when dependency files change
triggerPaths:
  - "package.json"
  - "**/package.json"
  - "pnpm-lock.yaml"
  - "socket.yml"

# Enable GitHub App features
githubApp:
  enabled: true
  dependencyOverviewEnabled: true
```

### Technical Rationale

**`version: 2`**: Required for advanced features like `licensePolicies` and structured `issueRules`.

**`projectIgnorePaths`**: Prevents false positives from test fixtures that may intentionally contain problematic dependencies for security testing.

**`triggerPaths`**: Critical for monorepo efficiency. Changes to source code (`.ts`, `.tsx`) don't need dependency scanning - only lockfile changes do.

**`githubApp.enabled`**: Enables PR commenting and dependency overview features.

### Validation Criteria

- [ ] File is valid YAML (no syntax errors)
- [ ] Version is exactly `2` (not `"2"` as string)
- [ ] All paths use forward slashes (cross-platform)
- [ ] File is at repository root level

### Expected Behavior

After this commit, Socket.dev will:
- Recognize the project as configured
- Exclude test directories from scanning
- Only scan when dependencies change

---

## Commit 2: Add Socket.dev Step to Workflow

### Objective

Integrate Socket.dev action into the quality-gate workflow, enabling automated security scanning.

### Files Changed

| File | Action | Lines |
|------|--------|-------|
| `.github/workflows/quality-gate.yml` | Modify | ~15 |

### Implementation Details

Add the Socket.dev step after dependency installation:

```yaml
# In .github/workflows/quality-gate.yml

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      issues: write         # For Socket.dev comments
      pull-requests: write  # For Socket.dev PR updates

    steps:
      # ... existing checkout and setup steps ...

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      # ============================================
      # LAYER 1: Supply Chain Security
      # ============================================

      - name: Socket.dev Security Scan
        uses: SocketDev/socket-security-action@6f55d8fa2cebd6ef40fad5e1dea9ae0edbe4ee13  # v2.0.1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
        continue-on-error: true  # Don't block workflow if service unavailable
```

### SHA Verification

**Action**: `SocketDev/socket-security-action`
**Version**: v2.0.1
**SHA**: `6f55d8fa2cebd6ef40fad5e1dea9ae0edbe4ee13`

To verify:
```bash
# Check the SHA for v2.0.1 release
curl -s https://api.github.com/repos/SocketDev/socket-security-action/git/refs/tags/v2.0.1
```

### Technical Rationale

**Permissions**: `issues: write` and `pull-requests: write` are required for Socket.dev to post comments and update PR status checks.

**`continue-on-error: true`**: Socket.dev is a third-party service. If their infrastructure is temporarily unavailable, we don't want to block all PRs. Security is important, but availability of the development process is also critical.

**Position After Install**: Socket.dev analyzes the lockfile, which is checked out during `pnpm install`. It must run after dependencies are installed.

### Validation Criteria

- [ ] SHA is exactly 40 characters
- [ ] Permissions include `issues: write` and `pull-requests: write`
- [ ] Step is positioned after `pnpm install`
- [ ] `continue-on-error: true` is set

### Expected Behavior

After this commit:
- Workflow will attempt to run Socket.dev scan
- Scan results will appear in PR checks (if PR context)
- Workflow continues even if Socket.dev fails

---

## Commit 3: Configure Security and License Policies

### Objective

Harden the Socket.dev configuration with explicit security rules and license compliance policies.

### Files Changed

| File | Action | Lines |
|------|--------|-------|
| `socket.yml` | Modify | ~25 |

### Implementation Details

Expand `socket.yml` with security and license policies:

```yaml
# socket.yml (expanded)
version: 2

projectIgnorePaths:
  - "tests/**"
  - "docs/**"
  - "**/__tests__/**"
  - "**/fixtures/**"

triggerPaths:
  - "package.json"
  - "**/package.json"
  - "pnpm-lock.yaml"
  - "socket.yml"

# Issue-specific rule configuration
# Set to false to disable specific checks
issueRules:
  # Keep these enabled (critical security)
  # malware: true (default)
  # typosquatting: true (default)

  # Disable if causing false positives on legitimate build tools
  # unsafe-eval: false  # Uncomment if bundler uses eval()

githubApp:
  enabled: true
  dependencyOverviewEnabled: true

# License compliance - block viral licenses
licensePolicies:
  deny:
    - "GPL-2.0-only"
    - "GPL-2.0-or-later"
    - "GPL-3.0-only"
    - "GPL-3.0-or-later"
    - "AGPL-3.0-only"
    - "AGPL-3.0-or-later"
```

### Security Policy Decisions

| Policy | Decision | Justification |
|--------|----------|---------------|
| Malware | BLOCK (default) | Non-negotiable |
| Typosquatting | BLOCK (default) | Almost always malicious |
| Install Scripts | Default (warn) | Some legit packages use them |
| Native Code | Default (warn) | esbuild, fsevents are legit |
| Unmaintained | Default (monitor) | Tech debt, not active threat |
| GPL/AGPL | BLOCK (explicit) | Legal compliance |

### License Policy Rationale

**GPL/AGPL Denied**: These "copyleft" licenses require derivative works to be open-sourced. For a commercial project, incorporating GPL code could legally require open-sourcing the entire application.

**MIT/Apache/BSD Allowed**: These permissive licenses allow commercial use without restrictions.

### Validation Criteria

- [ ] `licensePolicies.deny` includes all GPL variants
- [ ] `issueRules` section exists (even if empty)
- [ ] All YAML syntax is valid
- [ ] No duplicate keys

### Expected Behavior

After this commit:
- Any package with GPL/AGPL license will block PRs
- Security issues follow configured severity levels
- False positives can be addressed via `@SocketSecurity ignore`

---

## Commit 4: Document Socket.dev Workflow

### Objective

Create documentation explaining the Socket.dev integration, ignore workflow, and security policies.

### Files Changed

| File | Action | Lines |
|------|--------|-------|
| `docs/guides/socket-security.md` | Create | ~80 |

### Implementation Details

Create a developer guide:

```markdown
# Socket.dev Security Guide

## Overview

This project uses Socket.dev for supply chain security. Socket.dev analyzes npm packages for malicious behavior, not just known CVEs.

## What Gets Scanned

Socket.dev scans:
- `package.json` dependencies
- `pnpm-lock.yaml` lockfile
- All transitive dependencies

## Security Levels

| Level | Meaning | Action Required |
|-------|---------|-----------------|
| **Block** | Critical security issue | Must be resolved before merge |
| **Warn** | Potential concern | Review and decide |
| **Monitor** | Informational | No action required |

## Handling Alerts

### Blocked Package

If a legitimate package is blocked:

1. Review the alert reason
2. If it's a false positive, add a PR comment:
   ```
   @SocketSecurity ignore <package>@<version>
   ```
3. Explain why it's acceptable in your comment
4. Socket.dev will re-scan and allow the package

### License Violations

This project blocks GPL/AGPL licenses for legal compliance. If you need a GPL package:

1. Find an MIT/Apache alternative
2. If no alternative exists, consult with the tech lead

## Configuration

Configuration is in `socket.yml` at the repository root. See [socket.yml reference](https://docs.socket.dev/docs/socket-yml).

## Troubleshooting

### Scan Takes Too Long

The `triggerPaths` configuration ensures Socket only scans when dependency files change. If scans are slow:

1. Check that you're not modifying `pnpm-lock.yaml` unnecessarily
2. Consider if the dependency tree has grown significantly

### False Positives

If you consistently get false positives on specific packages:

1. Document the package in a PR with `@SocketSecurity ignore`
2. Consider adding to `issueRules` in `socket.yml` for project-wide exceptions
```

### Validation Criteria

- [ ] File exists at `docs/guides/socket-security.md`
- [ ] Includes ignore workflow documentation
- [ ] Includes license policy explanation
- [ ] All internal links work

### Expected Behavior

After this commit:
- Developers have clear guidance on Socket.dev
- Ignore workflow is documented
- License policy is explained

---

## Post-Implementation Validation

### Functional Tests

1. **Trigger Workflow**
   ```bash
   git push origin story_1_3
   # Navigate to GitHub Actions
   # Run "Quality Gate" workflow
   ```

2. **Verify Socket.dev Step**
   - Check workflow logs for "Socket.dev Security Scan" step
   - Verify step completes (green or yellow, not red)
   - Check for scan output in logs

3. **Test Ignore Mechanism** (optional)
   - Create test PR with known flagged package
   - Post `@SocketSecurity ignore` comment
   - Verify re-scan and status update

### Performance Validation

- [ ] Socket.dev step completes in < 30 seconds
- [ ] No impact on overall workflow time (< 2 minutes total)

### Security Validation

- [ ] Current codebase has no blocking alerts
- [ ] License policy test: attempt to add GPL package (should fail)

---

## Rollback Plan

If issues are discovered after implementation:

### Immediate Rollback

1. Remove Socket.dev step from workflow:
   ```bash
   git revert <commit-2-sha>
   git push
   ```

2. Workflow continues without Socket scanning

### Partial Rollback

1. Set `continue-on-error: true` (already configured)
2. Disable blocking in Socket.dev dashboard
3. Keep scanning for visibility without blocking

---

## Next Phase Preparation

After completing Phase 2, Phase 3 (Code Quality - ESLint/Prettier) can begin. The quality-gate workflow is now:

```yaml
steps:
  - checkout
  - setup pnpm
  - setup node
  - install dependencies
  - Socket.dev scan        # Added in Phase 2
  # - ESLint/Prettier      # Phase 3
  # - Knip                 # Phase 4
  # - Build                # Phase 5
```

---

**Document Created**: 2025-11-28
**Last Updated**: 2025-11-28
**Created By**: Claude Code (phase-doc-generator)
