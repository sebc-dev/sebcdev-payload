# Phase 1: Environment Setup - Workflow Foundation & Dependabot

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Phase**: 1 of 8

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [GitHub Repository Configuration](#github-repository-configuration)
4. [Tool Versions](#tool-versions)
5. [Verification Steps](#verification-steps)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

| Tool | Minimum Version | Purpose | Check Command |
|------|-----------------|---------|---------------|
| Node.js | 20.9.0 | Runtime environment | `node --version` |
| pnpm | 9.0.0 | Package manager | `pnpm --version` |
| Git | 2.40.0 | Version control | `git --version` |
| VS Code | Latest | Editor with YAML support | `code --version` |

### Required Access

| Resource | Access Level | Purpose |
|----------|--------------|---------|
| GitHub Repository | Write | Push workflow files |
| GitHub Actions | Enabled | Run workflows |
| GitHub Dependabot | Enabled | Automated updates |

### VS Code Extensions (Recommended)

| Extension | ID | Purpose |
|-----------|-----|---------|
| YAML | `redhat.vscode-yaml` | YAML syntax highlighting and validation |
| GitHub Actions | `github.vscode-github-actions` | Workflow syntax support |
| GitLens | `eamodio.gitlens` | Git history and blame |

Install all recommended extensions:
```bash
code --install-extension redhat.vscode-yaml
code --install-extension github.vscode-github-actions
code --install-extension eamodio.gitlens
```

---

## Local Development Setup

### Step 1: Verify Node.js and pnpm

```bash
# Check Node.js version (should be 20.x or higher)
node --version
# Expected: v20.x.x or higher

# Check pnpm version (should be 9.x)
pnpm --version
# Expected: 9.x.x

# If pnpm is not installed
npm install -g pnpm@9
```

### Step 2: Verify Project Dependencies

```bash
# Ensure dependencies are installed
pnpm install

# Verify installation
pnpm list --depth=0
```

### Step 3: Verify Git Configuration

```bash
# Check Git version
git --version
# Expected: git version 2.40.0 or higher

# Verify remote configuration
git remote -v
# Should show origin pointing to GitHub repository

# Verify current branch
git branch --show-current
# Should be: story_1_3 (or your working branch)
```

### Step 4: Create GitHub Directory Structure

```bash
# Create .github directories if they don't exist
mkdir -p .github/workflows

# Verify structure
ls -la .github/
```

---

## GitHub Repository Configuration

### Verify Repository Settings

Navigate to your GitHub repository and verify:

#### 1. Actions Permissions

**Path**: Settings > Actions > General

- [ ] **Actions permissions**: "Allow all actions and reusable workflows" or at minimum "Allow actions created by GitHub"
- [ ] **Workflow permissions**: "Read repository contents and packages permissions"
- [ ] **Allow GitHub Actions to create and approve pull requests**: Optional (not needed for Phase 1)

#### 2. Branch Protection (Optional for Phase 1)

**Path**: Settings > Branches > Branch protection rules

For `main` branch (can be configured after Phase 1 is complete):
- [ ] Require status checks to pass before merging
- [ ] Require the "Quality Gate" workflow to pass

#### 3. Dependabot Configuration

**Path**: Settings > Security > Code security and analysis

- [ ] **Dependabot alerts**: Enabled (recommended)
- [ ] **Dependabot security updates**: Enabled (recommended)
- [ ] **Dependabot version updates**: Will be automatically enabled when `dependabot.yml` is pushed

---

## Tool Versions

### GitHub Actions SHA References

These SHA values must be used for action pinning. Verify they are current:

| Action | Version | SHA | Verify Link |
|--------|---------|-----|-------------|
| `actions/checkout` | v6.0.0 | `1af3b93b6815bc44a9784bd300feb67ff0d1eeb3` | [Releases](https://github.com/actions/checkout/releases) |
| `actions/setup-node` | v6.0.0 | `2028fbc5c25fe9cf00d9f06a71cc4710d4507903` | [Releases](https://github.com/actions/setup-node/releases) |
| `pnpm/action-setup` | v4.2.0 | `41ff72655975bd51cab0327fa583b6e92b6d3061` | [Releases](https://github.com/pnpm/action-setup/releases) |

### How to Verify SHA Values

1. Go to the action's GitHub repository
2. Click on "Releases" in the right sidebar
3. Find the version you want (e.g., v4.2.2)
4. Click on the version tag
5. Copy the full commit SHA (40 characters)

Example for `actions/checkout@v6.0.0`:
```
https://github.com/actions/checkout/releases/tag/v6.0.0
→ Commit: 1af3b93b6815bc44a9784bd300feb67ff0d1eeb3
```

### Updating SHA Values

If newer versions are available, update both the SHA and the version comment:

```yaml
# Before
- uses: actions/checkout@1af3b93b6815bc44a9784bd300feb67ff0d1eeb3  # v6.0.0

# After (example with hypothetical v6.1.0)
- uses: actions/checkout@abc123def456789abc123def456789abc123def4  # v6.1.0
```

---

## Verification Steps

### Pre-Implementation Verification

Run these checks before starting implementation:

```bash
# 1. Verify clean working directory
git status
# Should show no uncommitted changes (or only expected ones)

# 2. Verify you're on the correct branch
git branch --show-current
# Expected: story_1_3

# 3. Verify dependencies are installed
pnpm install

# 4. Verify .github directory exists or can be created
ls -la .github 2>/dev/null || echo "Directory will be created"

# 5. Verify no existing workflow with same name
ls -la .github/workflows/quality-gate.yml 2>/dev/null || echo "File does not exist (OK)"
```

### Post-Implementation Verification

Run these checks after completing Phase 1:

```bash
# 1. Verify files were created
ls -la .github/workflows/quality-gate.yml
ls -la .github/dependabot.yml

# 2. Validate YAML syntax
cat .github/workflows/quality-gate.yml | python3 -c "import sys, yaml; yaml.safe_load(sys.stdin)" && echo "YAML valid"
cat .github/dependabot.yml | python3 -c "import sys, yaml; yaml.safe_load(sys.stdin)" && echo "YAML valid"

# 3. Verify SHA pinning (should return 3 matches)
grep -c '@[a-f0-9]\{40\}' .github/workflows/quality-gate.yml
# Expected: 3

# 4. Verify all commits
git log --oneline -4
# Should show 4 commits from Phase 1
```

---

## Troubleshooting

### Common Issues

#### Issue: YAML Syntax Error

**Symptom**: VS Code shows red squiggles in YAML file

**Solution**:
1. Check indentation (must use spaces, not tabs)
2. Verify all keys have values
3. Check for missing colons or quotes
4. Use online YAML validator: https://www.yamllint.com/

#### Issue: Workflow Not Visible in Actions Tab

**Symptom**: After pushing, workflow doesn't appear in GitHub Actions

**Solution**:
1. Verify file is in correct path: `.github/workflows/quality-gate.yml`
2. Check file has been pushed: `git log --oneline -1`
3. Verify YAML is valid (invalid YAML won't appear)
4. Check Actions permissions in repository settings

#### Issue: Workflow Fails at Checkout

**Symptom**: Workflow fails with "Resource not accessible by integration"

**Solution**:
1. Check repository permissions in Settings > Actions
2. Verify `permissions: contents: read` is in workflow
3. Ensure repository is not restricted by organization policies

#### Issue: pnpm Cache Not Working

**Symptom**: "Cache not found" in workflow logs

**Solution**:
1. This is normal for first run
2. Subsequent runs should show "Cache restored"
3. Verify `cache: 'pnpm'` is in setup-node step

#### Issue: Dependabot Not Creating PRs

**Symptom**: No Dependabot PRs appear after pushing `dependabot.yml`

**Solution**:
1. Wait for next scheduled run (Monday 09:00 Paris time)
2. Check Insights > Dependency graph > Dependabot for status
3. Verify repository has no organization restrictions on Dependabot
4. Check Dependabot logs in Security tab

#### Issue: SHA Value Incorrect

**Symptom**: Workflow fails with "Unable to resolve action"

**Solution**:
1. Verify SHA is exactly 40 characters
2. Check SHA matches the correct version
3. Go to action's releases page and verify SHA
4. Common mistake: using shortened SHA (7 chars) instead of full SHA

---

## Environment Variables Reference

### Workflow Environment Variables

These environment variables are available in the workflow:

| Variable | Description | Example |
|----------|-------------|---------|
| `${{ github.workflow }}` | Workflow name | "Quality Gate" |
| `${{ github.ref }}` | Branch/tag reference | "refs/heads/story_1_3" |
| `${{ github.sha }}` | Commit SHA | "abc123..." |
| `${{ github.actor }}` | User who triggered | "username" |
| `${{ runner.os }}` | Runner OS | "Linux" |

### Secrets Available

For Phase 1, no secrets are required. Future phases will need:

| Secret | Phase | Purpose |
|--------|-------|---------|
| `GITHUB_TOKEN` | Auto-provided | Repository access (read) |
| `CLOUDFLARE_API_TOKEN` | Phase 2+ | Cloudflare deployment (OIDC preferred) |
| `ADMIN_EMAIL` | Phase 7 | Lighthouse admin auth |
| `ADMIN_PASSWORD` | Phase 7 | Lighthouse admin auth |

---

## Quick Reference Commands

```bash
# Verify environment
node --version && pnpm --version && git --version

# Check branch
git branch --show-current

# Validate YAML files
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/quality-gate.yml'))"
python3 -c "import yaml; yaml.safe_load(open('.github/dependabot.yml'))"

# Count SHA pins
grep -c '@[a-f0-9]\{40\}' .github/workflows/quality-gate.yml

# View recent commits
git log --oneline -5

# Push to GitHub
git push origin story_1_3
```

---

**Document Created**: 2025-11-28
**Last Updated**: 2025-11-28
