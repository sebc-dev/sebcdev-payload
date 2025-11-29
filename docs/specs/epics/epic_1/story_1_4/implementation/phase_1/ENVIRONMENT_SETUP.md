# Phase 1 - Environment Setup

This guide covers all environment setup needed for Phase 1: Branch Protection & Quality Gate Enforcement.

---

## Prerequisites

### Previous Phases

- [x] Story 1.3 Phase 1+ completed (quality-gate workflow exists)
- [x] Story 1.2 completed (local development environment)
- [x] Story 1.1 completed (GitHub repository exists)

### Access Requirements

- [ ] **GitHub Admin Access**: Required to configure branch protection
- [ ] **GitHub CLI (`gh`)**: Installed and authenticated for verification
- [ ] **Git**: Configured with push access to the repository

### Tools Required

- [ ] Web browser (for GitHub Settings UI)
- [ ] Git (version 2.x+)
- [ ] GitHub CLI (`gh`) (version 2.x+, optional but recommended)
- [ ] Terminal/Command line

---

## Verify Access

### Check GitHub Admin Access

1. Navigate to the repository on GitHub
2. Look for "Settings" tab in the top navigation
3. If visible, you have admin access

**If "Settings" is not visible**:

- Request admin access from repository owner
- Or have an admin configure branch protection

### Check GitHub CLI Authentication

```bash
# Verify gh is installed
gh --version
# Expected: gh version 2.x.x

# Check authentication status
gh auth status
# Expected: Logged in to github.com as <username>

# If not authenticated
gh auth login
```

### Check Git Configuration

```bash
# Verify git is configured
git config --get user.name
git config --get user.email

# Verify push access
git remote -v
# Expected: Shows origin with push access
```

---

## Required Files

### Quality Gate Workflow

Verify the quality-gate workflow exists (prerequisite from Story 1.3):

```bash
# Check workflow file exists
ls -la .github/workflows/quality-gate.yml

# Verify workflow is valid
cat .github/workflows/quality-gate.yml | head -20
```

**Expected Output**:

```yaml
name: Quality Gate

on:
  workflow_dispatch:

jobs:
  quality-gate:
    name: Quality Checks
    ...
```

### Note the Job Name

The branch protection rule requires the exact job name. Find it in the workflow:

```bash
# Extract job name
grep -A1 "^jobs:" .github/workflows/quality-gate.yml
```

**Typical job name**: `Quality Checks` (display name) or `quality-gate` (job id)

In GitHub's status checks, this appears as: `Quality Checks / Quality Gate`

---

## GitHub Repository Settings

### Branch Settings Location

```
Repository > Settings > Branches
```

### Status Checks Discovery

GitHub discovers status checks after they have run at least once. Ensure:

```bash
# Run quality-gate at least once
# Go to: Actions > Quality Gate > Run workflow

# Or verify it has run before
gh run list --workflow=quality-gate.yml --limit=1
```

If quality-gate has never run, the status check won't appear in the dropdown.

---

## Environment Variables

### No Environment Variables Required

This phase is configuration-focused and doesn't require environment variables.

### For Reference (Quality Gate Workflow)

The quality-gate workflow uses these variables (configured in Story 1.3):

| Variable             | Description            | Required For      |
| -------------------- | ---------------------- | ----------------- |
| `PAYLOAD_SECRET`     | Payload CMS secret     | CI build          |
| `HAS_PAYLOAD_SECRET` | Check if secret exists | Conditional logic |

These are already configured in GitHub Secrets from Story 1.3.

---

## Connection Tests

### Test GitHub Access

```bash
# Test repository access
gh repo view --json name,defaultBranchRef

# Expected output includes:
# "name": "sebcdev-payload"
# "defaultBranchRef": { "name": "main" }
```

### Test Workflow Access

```bash
# List workflows
gh workflow list

# Expected: Shows Quality Gate workflow
```

### Test Branch Access

```bash
# Check current branch
git branch --show-current

# Verify main exists
git branch -a | grep main
```

---

## Troubleshooting

### Issue: "Settings" Tab Not Visible

**Symptoms**:

- Cannot see "Settings" in repository navigation
- Cannot access branch protection rules

**Solutions**:

1. Request admin access from repository owner
2. Have an existing admin configure branch protection
3. Fork the repository (for personal testing only)

**Verify Fix**:

- "Settings" tab becomes visible after access is granted

---

### Issue: Status Check Not Appearing

**Symptoms**:

- `quality-gate` not in the status check dropdown
- Cannot select required status check

**Solutions**:

1. Run the quality-gate workflow at least once:
   ```bash
   gh workflow run quality-gate.yml
   ```
2. Wait for the workflow to complete
3. Refresh the branch protection settings page
4. Search for the exact job name (try variations):
   - `quality-gate`
   - `Quality Checks`
   - `Quality Checks / Quality Gate`

**Verify Fix**:

```bash
# Check workflow has run
gh run list --workflow=quality-gate.yml --limit=1

# Should show at least one run
```

---

### Issue: GitHub CLI Not Authenticated

**Symptoms**:

- `gh: command not found`
- `gh: not logged in`

**Solutions**:

1. Install GitHub CLI:

   ```bash
   # macOS
   brew install gh

   # Linux
   sudo apt install gh

   # Windows
   winget install GitHub.cli
   ```

2. Authenticate:
   ```bash
   gh auth login
   # Follow prompts to authenticate with browser
   ```

**Verify Fix**:

```bash
gh auth status
# Should show: Logged in to github.com
```

---

### Issue: Cannot Push to Repository

**Symptoms**:

- Git push fails with permission error
- `remote: Permission denied`

**Solutions**:

1. Check SSH key is configured:
   ```bash
   ssh -T git@github.com
   ```
2. Or use HTTPS with token:
   ```bash
   gh auth setup-git
   ```

**Verify Fix**:

```bash
git push origin --dry-run
# Should succeed (or only fail due to branch protection)
```

---

## Setup Checklist

Complete this checklist before starting implementation:

- [ ] GitHub admin access verified
- [ ] GitHub CLI installed and authenticated
- [ ] Git configured with push access
- [ ] Quality-gate workflow exists
- [ ] Quality-gate has run at least once
- [ ] Can access Settings > Branches

**Environment is ready!**

---

## Quick Reference

### GitHub UI Path

```
Repository > Settings > Branches > Branch protection rules > Add rule
```

### Useful Commands

```bash
# Check auth
gh auth status

# List workflows
gh workflow list

# Run quality-gate
gh workflow run quality-gate.yml

# Check workflow runs
gh run list --workflow=quality-gate.yml

# View PR status
gh pr view
```

### Documentation Links

- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [GitHub CLI Manual](https://cli.github.com/manual/)
- [CI-CD-Security.md](../../../../../CI-CD-Security.md)
