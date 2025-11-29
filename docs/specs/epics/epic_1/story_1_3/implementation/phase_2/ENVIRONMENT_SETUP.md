# Phase 2: Environment Setup - Supply Chain Security (Socket.dev)

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Phase**: 2 of 8

---

## Prerequisites

### Required Access

| Requirement              | Status      | Notes                                  |
| ------------------------ | ----------- | -------------------------------------- |
| GitHub repository access | Required    | Push access to repository              |
| Socket.dev account       | Optional    | Free tier available, enhances features |
| Socket.dev GitHub App    | Recommended | Install for full PR integration        |

### Local Development Environment

| Tool    | Minimum Version | Purpose                               |
| ------- | --------------- | ------------------------------------- |
| Node.js | 20.x            | Runtime                               |
| pnpm    | 9.x             | Package manager                       |
| Git     | 2.x             | Version control                       |
| VS Code | Latest          | YAML editing with syntax highlighting |

---

## Socket.dev Account Setup (Optional but Recommended)

### Why Create an Account?

While Socket.dev works without an account, creating one enables:

- Custom security policies at organization level
- Detailed scan history and analytics
- Custom ignore rules that persist across PRs
- API access for programmatic scanning

### Account Creation Steps

1. **Navigate to Socket.dev**

   ```
   https://socket.dev/
   ```

2. **Sign in with GitHub**
   - Click "Sign in" or "Get Started"
   - Authorize with your GitHub account
   - Select repositories to monitor

3. **Organization Setup** (if applicable)
   - Navigate to Settings > Organization
   - Configure organization-wide policies
   - Add team members if needed

---

## GitHub App Installation

### Why Install the GitHub App?

The Socket.dev GitHub App provides:

- Automatic PR comments with scan results
- Dependency overview in repository
- `@SocketSecurity ignore` command support
- Check run status updates

### Installation Steps

1. **Access GitHub Marketplace**

   ```
   https://github.com/apps/socket-security
   ```

2. **Install for Repository**
   - Click "Install"
   - Select your organization or personal account
   - Choose "Only select repositories"
   - Select the `sebcdev-payload` repository
   - Click "Install"

3. **Verify Installation**
   - Navigate to repository Settings > Integrations
   - Confirm "Socket Security" appears in installed apps

### Permissions Granted

The Socket.dev app requires these permissions:

| Permission    | Level      | Purpose                                  |
| ------------- | ---------- | ---------------------------------------- |
| Contents      | Read       | Analyze package.json and lockfile        |
| Pull Requests | Read/Write | Post comments and update status          |
| Issues        | Read/Write | Handle `@SocketSecurity ignore` commands |
| Checks        | Read/Write | Create check runs for scans              |

---

## Local Verification

### Verify Phase 1 Completion

Before starting Phase 2, confirm Phase 1 is complete:

```bash
# Check workflow file exists
ls -la .github/workflows/quality-gate.yml

# Expected output:
# -rw-r--r-- 1 user user 1234 Nov 28 12:00 .github/workflows/quality-gate.yml

# Verify workflow structure
cat .github/workflows/quality-gate.yml | head -20
```

### Verify YAML Tools

```bash
# Check yq is available (optional but helpful)
yq --version

# Or use Node.js YAML parser
npx yaml lint socket.yml
```

### VS Code Extensions

Install these extensions for better YAML editing:

| Extension      | ID                             | Purpose                      |
| -------------- | ------------------------------ | ---------------------------- |
| YAML           | `redhat.vscode-yaml`           | YAML language support        |
| GitHub Actions | `github.vscode-github-actions` | Workflow syntax highlighting |

---

## SHA Verification Process

### Why Verify SHAs?

SHA pinning prevents supply chain attacks via compromised GitHub Actions. Always verify SHAs before using them.

### Verification Steps

1. **Get the SHA for a Release Tag**

   ```bash
   # For Socket.dev action
   curl -s https://api.github.com/repos/SocketDev/socket-security-action/git/refs/tags/v2.0.1 | jq -r '.object.sha'

   # Expected output: 6f55d8fa2cebd6ef40fad5e1dea9ae0edbe4ee13
   ```

2. **Cross-Reference with Release Page**
   - Navigate to: `https://github.com/SocketDev/socket-security-action/releases/tag/v2.0.1`
   - Click on the commit hash in the release
   - Verify it matches the full SHA

3. **Document the SHA**
   - Always include version comment next to SHA
   - Example: `@6f55d8fa2cebd6ef40fad5e1dea9ae0edbe4ee13  # v2.0.1`

### Current Phase SHAs

| Action                             | Version | SHA (verified 2025-11-28)                  |
| ---------------------------------- | ------- | ------------------------------------------ |
| `SocketDev/socket-security-action` | v2.0.1  | `6f55d8fa2cebd6ef40fad5e1dea9ae0edbe4ee13` |

---

## Environment Variables

### CI Environment

These environment variables are available in the GitHub Actions workflow:

| Variable            | Source    | Purpose                       |
| ------------------- | --------- | ----------------------------- |
| `GITHUB_TOKEN`      | Automatic | Authentication for GitHub API |
| `GITHUB_REPOSITORY` | Automatic | Repository name (owner/repo)  |
| `GITHUB_REF`        | Automatic | Git reference (branch/tag)    |

### Local Testing (Optional)

If you want to test Socket.dev locally:

```bash
# Install Socket CLI (optional)
npm install -g @socketsecurity/cli

# Run local scan
socket scan .

# Or use npx without global install
npx @socketsecurity/cli scan .
```

---

## Network Requirements

### Outbound Connections

The Socket.dev action requires outbound HTTPS access to:

| Domain               | Purpose                  |
| -------------------- | ------------------------ |
| `api.socket.dev`     | Socket.dev API           |
| `socket.dev`         | Socket.dev web interface |
| `github.com`         | GitHub API               |
| `registry.npmjs.org` | NPM package metadata     |

### Corporate Proxy Considerations

If your CI runners are behind a corporate proxy:

1. Ensure proxy allows connections to domains above
2. Set `HTTP_PROXY` and `HTTPS_PROXY` environment variables if needed
3. Socket.dev action respects standard proxy environment variables

---

## Troubleshooting Setup Issues

### Issue: GitHub App Not Appearing

**Symptom**: Socket.dev app not showing in repository integrations

**Solution**:

1. Re-visit `https://github.com/apps/socket-security`
2. Click "Configure"
3. Ensure repository is in selected list
4. Re-install if necessary

### Issue: Action Fails with Permission Error

**Symptom**: "Resource not accessible by integration"

**Solution**:

1. Verify workflow permissions:
   ```yaml
   permissions:
     contents: read
     issues: write
     pull-requests: write
   ```
2. If using organization, check org-level workflow permissions
3. Navigate to Settings > Actions > General > Workflow permissions

### Issue: Scan Returns No Results

**Symptom**: Socket.dev step passes but shows no analysis

**Solution**:

1. Verify `socket.yml` exists at repository root
2. Check `triggerPaths` includes your lockfile
3. Ensure lockfile is not in `projectIgnorePaths`

### Issue: Rate Limiting

**Symptom**: "API rate limit exceeded"

**Solution**:

1. Create Socket.dev account for higher limits
2. Add `SOCKET_SECURITY_API_KEY` secret if using API key
3. Contact Socket.dev support for enterprise limits

---

## Security Best Practices

### Secrets Management

- Never commit API keys or tokens to repository
- Use GitHub Secrets for sensitive values
- Rotate API keys periodically

### Workflow Security

- Always pin actions by SHA, not tag
- Review action source code before using
- Enable GitHub's Dependabot for action updates

### Repository Settings

Recommended security settings:

| Setting           | Location            | Recommended Value          |
| ----------------- | ------------------- | -------------------------- |
| Branch protection | Settings > Branches | Enable for main            |
| Required checks   | Branch protection   | Add "Quality Gate"         |
| Signed commits    | Branch protection   | Recommended for production |

---

## Quick Verification Checklist

Before starting implementation:

- [ ] Phase 1 workflow file exists
- [ ] GitHub Actions tab accessible
- [ ] Workflow can be manually triggered
- [ ] (Optional) Socket.dev account created
- [ ] (Optional) Socket.dev GitHub App installed
- [ ] VS Code YAML extension installed
- [ ] SHA values verified and documented

---

**Document Created**: 2025-11-28
**Last Updated**: 2025-11-28
