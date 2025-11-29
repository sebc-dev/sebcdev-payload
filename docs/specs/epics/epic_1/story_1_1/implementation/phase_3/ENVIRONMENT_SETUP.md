# Phase 3 - Environment Setup

This guide covers environment prerequisites and setup verification for Phase 3.

---

## 📋 Prerequisites

### Previous Phases

- [x] **Phase 1 completed**: Repository created from template with all files
- [x] **Phase 2 completed**: Cloudflare infrastructure deployed (Worker, D1, R2)

### Tools Required

- [x] **Wrangler CLI** (version 3.0+)
  - Used for: D1 queries, R2 operations, Worker logs, secret management
  - Install: `npm install -g wrangler`
  - Verify: `wrangler --version`

- [x] **curl** or **httpie** (for HTTP testing)
  - Used for: Testing Worker endpoints
  - Verify: `curl --version`

- [x] **Git** (version 2.30+)
  - Used for: Committing documentation
  - Verify: `git --version`

- [x] **Web Browser** (Chrome, Firefox, or Safari)
  - Used for: Manual testing of admin panel and homepage
  - Required: Developer tools enabled

- [x] **Text Editor** with Markdown support
  - Used for: Writing documentation
  - Recommended: VS Code, Cursor, Zed

### Access Required

- [x] **Cloudflare Account Access**
  - Dashboard access: https://dash.cloudflare.com
  - Permissions: View Workers, D1, R2
  - Account ID documented from Phase 2

- [x] **Wrangler CLI Authenticated**
  - Execute: `wrangler whoami`
  - Expected: Shows your Cloudflare account email

- [x] **Repository Write Access**
  - Ability to commit documentation to repository
  - Execute: `git remote -v`

---

## 📦 No New Dependencies

Phase 3 requires **no new package installations**. All required tools should already be available from Phase 2.

### Verify Existing Setup

```bash
# Verify Wrangler CLI is authenticated
wrangler whoami
# Expected: Account email and account ID

# Verify Wrangler version
wrangler --version
# Expected: 3.0.0 or higher

# Verify Git is configured
git config user.name
git config user.email
# Expected: Your name and email

# Verify curl is available
curl --version
# Expected: curl version information
```

---

## 🔧 Environment Variables

### No New Environment Variables Required

Phase 3 uses the same environment configuration as Phase 2:

- `PAYLOAD_SECRET`: Already set in Cloudflare Workers (via `wrangler secret put`)
- `.dev.vars`: Already configured for local development

### Verify Environment Configuration

```bash
# Verify wrangler.toml exists and has correct bindings
cat wrangler.toml

# Verify .dev.vars exists (for local development reference)
ls -la .dev.vars
# Note: This file should exist but may be in .gitignore

# Check Cloudflare secrets (does not reveal values)
wrangler secret list
# Expected: Shows list of configured secrets (e.g., PAYLOAD_SECRET)
```

---

## 🗄️ Infrastructure Resources (From Phase 2)

These resources should already exist from Phase 2 deployment:

### Cloudflare Worker

- **Name**: `[project-name]` or as configured in `wrangler.toml`
- **URL**: `https://[worker-name].[account-subdomain].workers.dev`
- **Status**: Should be "Active" in Cloudflare dashboard

**Verify**:

```bash
# Check Worker status via curl
curl -I https://[worker-url]
# Expected: HTTP 200 or valid response

# View Worker logs (optional, to check for errors)
wrangler tail [worker-name] --format=pretty
```

### Cloudflare D1 Database

- **Name**: `[project-name]-db` or as configured in `wrangler.toml`
- **Binding**: `DB` (referenced in code)

**Verify**:

```bash
# List D1 databases
wrangler d1 list
# Expected: Shows your database

# Query database to verify it's accessible
wrangler d1 execute [db-name] --command "SELECT name FROM sqlite_master WHERE type='table'"
# Expected: List of Payload tables (users, media, payload_migrations, etc.)
```

### Cloudflare R2 Bucket

- **Name**: `[project-name]-media` or as configured in `wrangler.toml`
- **Binding**: `MEDIA_BUCKET` (referenced in code)

**Verify**:

```bash
# List R2 buckets
wrangler r2 bucket list
# Expected: Shows your bucket

# List objects in bucket (may be empty)
wrangler r2 object list [bucket-name]
# Expected: Success (even if no objects yet)
```

---

## ✅ Pre-Phase Verification Checklist

Complete this checklist before starting Phase 3 implementation:

### Tools Verification

- [ ] Wrangler CLI installed and authenticated
- [ ] curl or httpie available for HTTP testing
- [ ] Git configured with user name and email
- [ ] Web browser with developer tools
- [ ] Text editor ready for writing documentation

### Access Verification

- [ ] Can access Cloudflare dashboard
- [ ] Can execute `wrangler whoami` successfully
- [ ] Can commit to repository (git push permissions)
- [ ] Have account ID documented (from Phase 2)

### Infrastructure Verification

- [ ] Worker is deployed and accessible
  - Execute: `curl -I https://[worker-url]`
- [ ] D1 database exists and has tables
  - Execute: `wrangler d1 execute [db-name] --command "SELECT COUNT(*) FROM sqlite_master WHERE type='table'"`
  - Expected: At least 3 tables (Payload core tables)
- [ ] R2 bucket exists and is accessible
  - Execute: `wrangler r2 bucket list`
- [ ] `wrangler.toml` has correct bindings
  - Manually review file for D1 and R2 bindings

### Configuration Verification

- [ ] `wrangler.toml` exists in project root
- [ ] Bindings section includes D1 database
- [ ] Bindings section includes R2 bucket
- [ ] Environment variables configured (check with `wrangler secret list`)

---

## 🚨 Troubleshooting Pre-Phase Issues

### Issue: Wrangler CLI not authenticated

**Symptoms**: `wrangler whoami` returns error

**Solution**:

```bash
# Authenticate Wrangler
wrangler login

# Verify authentication
wrangler whoami
```

### Issue: Infrastructure not accessible

**Symptoms**: curl to Worker URL fails, D1 queries error, R2 bucket not found

**Solution**:

- Review Phase 2 deployment logs for errors
- Check Cloudflare dashboard to verify resources exist
- Verify `wrangler.toml` bindings match actual resource names
- Do not proceed to Phase 3 until Phase 2 infrastructure is functional

**Check**:

```bash
# Verify Worker deployment
wrangler deployments list [worker-name]

# Check D1 database info
wrangler d1 info [db-name]

# Verify R2 bucket
wrangler r2 bucket list
```

### Issue: Missing account ID or resource names

**Symptoms**: Don't know Worker URL, D1 name, or R2 bucket name

**Solution**:

```bash
# Get account ID
wrangler whoami
# Shows account ID

# List Workers
wrangler deployments list

# List D1 databases
wrangler d1 list

# List R2 buckets
wrangler r2 bucket list

# Review wrangler.toml for configured names
cat wrangler.toml
```

### Issue: Git not configured

**Symptoms**: `git commit` fails with identity errors

**Solution**:

```bash
# Configure Git
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Verify configuration
git config user.name
git config user.email
```

---

## 📝 Documentation Workspace Setup

Create a clean workspace for documentation:

```bash
# Ensure you're in project root
cd /home/negus/dev/sebcdev-payload

# Create docs/deployment directory if it doesn't exist
mkdir -p docs/deployment

# Verify directory structure
ls -la docs/
# Expected: docs/ directory exists

# Phase 3 will create these files in docs/deployment/:
# - infrastructure-verification.md
# - cloudflare-setup.md
# - infrastructure.md
# - troubleshooting.md
```

---

## 🎯 Ready to Start

When all items in the Pre-Phase Verification Checklist are complete:

✅ **You are ready to begin Phase 3 implementation!**

Proceed to:

1. Read [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for the atomic commit strategy
2. Follow [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) for step-by-step instructions
3. Use [guides/TESTING.md](./guides/TESTING.md) for verification procedures

---

## 📚 Reference

- [Phase 2 Documentation](../phase_2/INDEX.md) - Previous phase
- [PHASES_PLAN.md](../PHASES_PLAN.md) - Overall story planning
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Dashboard](https://dash.cloudflare.com)
