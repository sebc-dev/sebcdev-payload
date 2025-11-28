# Phase 2 - Environment Setup

This guide covers all environment setup needed for Phase 2 - Cloudflare Infrastructure Deployment.

---

## 📋 Prerequisites

### Previous Phases

- [ ] **Phase 1 completed and validated**
  - Repository created from template
  - All template files present locally
  - Can run `pnpm install` successfully
  - Repository cloned to local machine

### Tools Required

- [ ] **Node.js** (version 18.17.0+)
  - Check: `node --version`
  - Install: [nodejs.org](https://nodejs.org/)

- [ ] **pnpm** (version 8.0.0+)
  - Check: `pnpm --version`
  - Install: `npm install -g pnpm`

- [ ] **Wrangler CLI** (version 3.0.0+)
  - Check: `wrangler --version`
  - Install: `pnpm add -g wrangler` or use package.json version

- [ ] **Git** (version 2.30.0+)
  - Check: `git --version`
  - Required for version control

- [ ] **curl** or **httpie** (for testing HTTP endpoints)
  - Check: `curl --version`
  - Pre-installed on most systems

### Accounts Required

- [ ] **Cloudflare Account** (free or paid tier)
  - Sign up: [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
  - Free tier includes: Workers (100k requests/day), D1 (5 databases), R2 (10 GB/month)
  - Verify email and complete account setup

- [ ] **GitHub Account** (for repository management)
  - Should already have from Phase 1
  - Verify: can access repository

### Permissions Required

- [ ] **Cloudflare Account Permissions**:
  - Workers: Create and manage Workers
  - D1: Create and manage databases
  - R2: Create and manage buckets
  - Check: Account Home > Members (should be Account Owner or have Workers permissions)

---

## 📦 Dependencies Installation

### Install Project Dependencies

```bash
# Navigate to project directory
cd /path/to/sebcdev-payload

# Install all dependencies (if not already done in Phase 1)
pnpm install

# Expected output: Dependencies installed successfully
```

### Verify Wrangler Installation

```bash
# Check Wrangler version
wrangler --version

# Expected output: ⛅️ wrangler 3.x.x or higher

# If not installed or outdated, install globally
pnpm add -g wrangler@latest

# Or use the version in package.json
pnpm exec wrangler --version
```

**Packages added** (should already be in package.json from template):
- `wrangler` - Cloudflare Workers CLI for deployment and management
- `@cloudflare/workers-types` - TypeScript types for Workers runtime
- `@payloadcms/db-d1-sqlite` - Payload adapter for Cloudflare D1
- `@payloadcms/storage-r2` - Payload plugin for Cloudflare R2
- `@opennextjs/cloudflare` - Next.js adapter for Cloudflare Workers

### Verify Installation

```bash
# Verify Node.js
node --version
# Expected: v18.17.0 or higher

# Verify pnpm
pnpm --version
# Expected: 8.x.x or higher

# Verify Wrangler
wrangler --version
# Expected: 3.x.x or higher

# Verify Git
git --version
# Expected: 2.x.x or higher

# Verify project dependencies
pnpm list --depth=0
# Expected: Shows all project dependencies including wrangler
```

---

## 🔧 Cloudflare Account Setup

### Step 1: Create Cloudflare Account

If you don't have a Cloudflare account:

1. Navigate to [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. Enter email and create password
3. Verify email address (check inbox)
4. Complete account setup wizard
5. Skip adding a domain (not needed for Workers)

### Step 2: Verify Account Quotas

Check your account quotas before provisioning:

1. Navigate to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Go to **Workers & Pages** > **Overview**
3. Check quotas:
   - **Workers**: Free tier = 100,000 requests/day (sufficient for development)
   - **Workers**: Paid tier = 10 million requests/month ($5/month)

4. Go to **R2** > **Overview**
   - **R2**: Free tier = 10 GB storage/month (sufficient for development)

5. Go to **D1** (under Workers & Pages sidebar)
   - **D1**: Free tier = 5 databases, 5 GB total storage (sufficient for development)

**Recommendation**: Free tier is sufficient for Phase 2 development and testing. Consider upgrading later for production workloads.

### Step 3: Find Account ID

You'll need your Cloudflare Account ID for documentation:

1. Navigate to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click on **Workers & Pages** in sidebar
3. Look for **Account ID** in the sidebar or account overview
4. Copy and save your Account ID (format: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

**Account ID Location**:
- Dashboard URL: `dash.cloudflare.com/<account-id>/...`
- Or: Account Home > Right sidebar under "Account ID"

---

## 🔑 Wrangler Authentication

### Authenticate Wrangler CLI

```bash
# Login to Cloudflare via Wrangler
wrangler login

# Expected:
# 1. Browser window opens automatically
# 2. Cloudflare login page appears
# 3. Authorize Wrangler to access your account
# 4. Browser shows "Success! You are now logged in."
# 5. Terminal shows: Successfully logged in.
```

**Verification**:
```bash
# Verify authentication
wrangler whoami

# Expected output:
# 👋 You are logged in with an OAuth Token, associated with the email '<your-email>@example.com'!
# ┌──────────────────────────────────┬──────────────────────────────────┐
# │ Account Name                     │ Account ID                       │
# ├──────────────────────────────────┼──────────────────────────────────┤
# │ <Your Account Name>              │ <your-account-id>                │
# └──────────────────────────────────┴──────────────────────────────────┘
```

**Save this information**:
- Account Name: `___________________________`
- Account ID: `___________________________`
- Email: `___________________________`

---

## 🗄️ Environment Variables

### Required Variables for Phase 2

#### Local Development (.dev.vars)

Create `.dev.vars` file in project root:

```env
# Payload CMS Secret (local development)
# Generate a strong random string (32+ characters)
PAYLOAD_SECRET=your-local-secret-here-change-this-value
```

**Generate a strong secret**:
```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 2: Using OpenSSL
openssl rand -base64 32

# Option 3: Using online generator
# Visit: https://generate-secret.vercel.app/32
```

**Example .dev.vars**:
```env
PAYLOAD_SECRET=kJ8vN2mP9qR3sT7uV4wX1yZ5aB6cD0eF8gH2iJ4kL9mN
```

#### Production Secrets (Wrangler Secrets)

For production deployment (set in Commit 5):

```bash
# Set PAYLOAD_SECRET for production
wrangler secret put PAYLOAD_SECRET

# Prompt: Enter a secret value:
# Paste your production secret (different from local!)
# Expected: ✅ Success! Uploaded secret PAYLOAD_SECRET
```

**Important**:
- Use **different** secrets for local (.dev.vars) and production (Wrangler secrets)
- **Never** commit `.dev.vars` to git (should be in `.gitignore`)
- **Never** commit Wrangler secrets to git (managed via Wrangler CLI)

### Variable Descriptions

| Variable | Description | Example | Required | Where Set |
|----------|-------------|---------|----------|-----------|
| `PAYLOAD_SECRET` | Encryption key for Payload CMS (JWT, cookies) | `kJ8vN2mP9qR3...` | Yes | .dev.vars (local), wrangler secret (prod) |

---

## 🗄️ Cloudflare Services Setup

### D1 Database (Commit 2)

**Purpose**: Cloudflare D1 provides a distributed SQLite database for Payload CMS data storage.

**Setup Steps** (performed in Commit 2):
1. Authenticate Wrangler (must be done first)
2. Create D1 database: `wrangler d1 create sebcdev-payload-db`
3. Capture database ID from output
4. Verify in dashboard: Workers & Pages > D1

**Verification**:
```bash
# List D1 databases
wrangler d1 list

# Expected: Shows sebcdev-payload-db

# Test database connectivity
wrangler d1 execute sebcdev-payload-db --command "SELECT 1 as test"

# Expected: Returns { test: 1 }
```

**Expected Output After Creation**:
```
✅ Successfully created DB 'sebcdev-payload-db'

[[d1_databases]]
binding = "DB"
database_name = "sebcdev-payload-db"
database_id = "<your-database-id-here>"
```

**Document these values**:
- Database Name: `sebcdev-payload-db`
- Database ID: `_______________________________`

---

### R2 Bucket (Commit 3)

**Purpose**: Cloudflare R2 provides S3-compatible object storage for Payload CMS media uploads.

**Setup Steps** (performed in Commit 3):
1. Authenticate Wrangler (must be done first)
2. Create R2 bucket: `wrangler r2 bucket create sebcdev-payload-media`
3. Verify in dashboard: R2 > Buckets

**Verification**:
```bash
# List R2 buckets
wrangler r2 bucket list

# Expected: Shows sebcdev-payload-media

# Test bucket access (list objects - empty)
wrangler r2 object list sebcdev-payload-media

# Expected: Empty list (no objects yet)
```

**Expected Output After Creation**:
```
✅ Created bucket 'sebcdev-payload-media'
```

**Document these values**:
- Bucket Name: `sebcdev-payload-media`

---

### Cloudflare Worker (Commit 5)

**Purpose**: Cloudflare Worker runs the Next.js + Payload CMS application on the edge network.

**Setup Steps** (performed in Commit 5):
1. Configure bindings in `wrangler.toml` (Commit 4)
2. Set PAYLOAD_SECRET as Wrangler secret
3. Deploy: `wrangler deploy`
4. Verify in dashboard: Workers & Pages > sebcdev-payload

**Verification**:
```bash
# Deploy (dry-run first to test)
wrangler deploy --dry-run

# Expected: Dry-run succeeds, shows bindings

# Actual deployment
wrangler deploy

# Expected: Worker deployed, URL shown

# Test Worker
curl -I https://<worker-url>.workers.dev

# Expected: HTTP/2 200 OK
```

**Expected Output After Deployment**:
```
✨ Uploaded sebcdev-payload
✨ Published sebcdev-payload
  https://<worker-name>.<subdomain>.workers.dev
```

**Document these values**:
- Worker Name: `sebcdev-payload`
- Worker URL: `_______________________________`

---

## ✅ Connection Tests

### Test Wrangler Authentication

```bash
wrangler whoami

# Expected output:
# 👋 You are logged in with an OAuth Token
# Account Name: <your-account>
# Account ID: <your-account-id>
```

**Success Criteria**: Shows your account email and ID

---

### Test D1 Database (After Commit 2)

```bash
# Create test database (example - you'll create sebcdev-payload-db in Commit 2)
wrangler d1 create test-db

# Query test database
wrangler d1 execute test-db --command "SELECT 'Hello D1' as message"

# Expected output:
# ┌───────────┐
# │ message   │
# ├───────────┤
# │ Hello D1  │
# └───────────┘

# Clean up test database
wrangler d1 delete test-db
```

**Success Criteria**: Query executes and returns results

---

### Test R2 Bucket (After Commit 3)

```bash
# Create test bucket (example - you'll create sebcdev-payload-media in Commit 3)
wrangler r2 bucket create test-bucket

# List buckets
wrangler r2 bucket list

# Expected: Shows test-bucket

# Clean up test bucket
wrangler r2 bucket delete test-bucket
```

**Success Criteria**: Bucket appears in list

---

### Test Worker Deployment (After Commit 5)

```bash
# Test HTTP response
curl -I https://<your-worker-url>.workers.dev

# Expected output:
# HTTP/2 200
# content-type: text/html
# ...

# Test in browser
# Navigate to: https://<your-worker-url>.workers.dev
# Expected: Homepage loads successfully
```

**Success Criteria**: Worker responds with 200 OK, homepage loads

---

## 🚨 Troubleshooting

### Issue: Wrangler login fails

**Symptoms**:
- `wrangler login` opens browser but authorization fails
- Error: "Failed to open a browser"

**Solutions**:
1. **Manual OAuth flow**:
   ```bash
   wrangler login --browser=false
   
   # Follow URL shown in terminal
   # Authorize in browser manually
   ```

2. **Check browser settings**: Allow pop-ups for cloudflare.com

3. **Use API token** (alternative):
   ```bash
   # Generate API token in Cloudflare dashboard
   # Account Home > API Tokens > Create Token
   # Use "Edit Cloudflare Workers" template
   
   # Set environment variable
   export CLOUDFLARE_API_TOKEN=your-token-here
   
   # Wrangler will use token automatically
   ```

**Verify Fix**:
```bash
wrangler whoami
# Should show account details
```

---

### Issue: Permission denied errors

**Symptoms**:
- Error: "You do not have permission to access this resource"
- Cannot create D1 database or R2 bucket

**Solutions**:
1. **Verify account permissions**:
   - Go to Account Home > Members
   - Ensure you are "Account Owner" or have Workers permissions

2. **Check account status**:
   - Verify email confirmed
   - Check for account restrictions

3. **Use correct account**:
   ```bash
   wrangler whoami
   # Verify you're logged into the correct account
   ```

**Verify Fix**:
```bash
wrangler d1 list
# Should show existing databases (if any) without errors
```

---

### Issue: Quota limits reached

**Symptoms**:
- Error: "You have reached your quota for D1 databases"
- Error: "R2 storage limit exceeded"

**Solutions**:
1. **Check current usage**:
   - Dashboard > Workers & Pages > D1 (shows database count)
   - Dashboard > R2 (shows storage usage)

2. **Delete unused resources**:
   ```bash
   # List and delete old D1 databases
   wrangler d1 list
   wrangler d1 delete <old-database-name>
   
   # List and delete old R2 buckets
   wrangler r2 bucket list
   wrangler r2 bucket delete <old-bucket-name>
   ```

3. **Upgrade plan** (if needed):
   - Free tier: 5 D1 databases, 10 GB R2
   - Workers Paid ($5/mo): More resources available
   - Consider Workers Paid for production workloads

**Verify Fix**:
```bash
wrangler d1 list
# Should show available quota
```

---

### Issue: Network connectivity issues

**Symptoms**:
- Wrangler commands timeout
- Error: "Failed to connect to Cloudflare API"

**Solutions**:
1. **Check internet connection**:
   ```bash
   ping cloudflare.com
   # Should respond
   ```

2. **Check Cloudflare status**:
   - Visit: [www.cloudflarestatus.com](https://www.cloudflarestatus.com)
   - Verify API is operational

3. **Check proxy/firewall**:
   - Corporate networks may block Wrangler
   - Try from different network

4. **Retry with verbose output**:
   ```bash
   WRANGLER_LOG=debug wrangler whoami
   # Shows detailed error information
   ```

**Verify Fix**:
```bash
wrangler whoami
# Should complete successfully
```

---

### Issue: .dev.vars not loading

**Symptoms**:
- Local development fails
- Error: "PAYLOAD_SECRET is required"

**Solutions**:
1. **Verify .dev.vars exists**:
   ```bash
   ls -la .dev.vars
   # Should show file
   
   cat .dev.vars
   # Should show PAYLOAD_SECRET=...
   ```

2. **Check file format**:
   ```env
   # Correct format (no spaces around =)
   PAYLOAD_SECRET=your-secret-here
   
   # Incorrect format
   PAYLOAD_SECRET = your-secret-here  ❌
   ```

3. **Restart development server**:
   ```bash
   # Stop: Ctrl+C
   pnpm dev
   ```

**Verify Fix**:
```bash
pnpm dev
# Should start without errors
```

---

## 📝 Setup Checklist

Complete this checklist before starting Phase 2 implementation:

### Tools & Accounts

- [ ] Node.js 18.17.0+ installed
- [ ] pnpm 8.0.0+ installed
- [ ] Wrangler 3.0.0+ installed
- [ ] Git installed and configured
- [ ] Cloudflare account created and verified
- [ ] GitHub account accessible

### Wrangler Authentication

- [ ] `wrangler login` completed successfully
- [ ] `wrangler whoami` shows correct account
- [ ] Account ID documented
- [ ] Account has Workers, D1, R2 permissions

### Environment Files

- [ ] `.dev.vars` file created
- [ ] `PAYLOAD_SECRET` set in `.dev.vars` (32+ chars)
- [ ] `.dev.vars` listed in `.gitignore`
- [ ] Can run `pnpm install` successfully

### Quota Verification

- [ ] D1 quota available (free tier: 5 databases)
- [ ] R2 quota available (free tier: 10 GB)
- [ ] Workers quota available (free tier: 100k requests/day)

### Repository

- [ ] Phase 1 completed (repository exists locally)
- [ ] Can run `pnpm dev` locally (optional test)
- [ ] All template files present

**Environment is ready when all checkboxes are checked! 🚀**

---

## 📊 Environment Summary

Document your environment details:

| Component | Version/Status | Notes |
|-----------|----------------|-------|
| Node.js | _________ | Min: 18.17.0 |
| pnpm | _________ | Min: 8.0.0 |
| Wrangler | _________ | Min: 3.0.0 |
| Cloudflare Account | ✅ / ❌ | Account ID: _________ |
| D1 Quota | ___/5 used | Free tier limit |
| R2 Quota | ___/10 GB used | Free tier limit |
| Workers Quota | Free / Paid | Plan type |

**Next Step**: Proceed to Commit 1 (Wrangler Authentication) using COMMIT_CHECKLIST.md
