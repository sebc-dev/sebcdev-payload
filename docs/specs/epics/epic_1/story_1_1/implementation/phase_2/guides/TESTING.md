# Phase 2 - Testing Guide

Complete testing strategy for Phase 2 - Cloudflare Infrastructure Deployment.

---

## 🎯 Testing Strategy

Phase 2 focuses on **infrastructure provisioning and deployment**, not code implementation. Testing is primarily **manual verification** of Cloudflare resources and application accessibility.

**Testing Layers**:

1. **Infrastructure Tests**: Verify Cloudflare resources created (D1, R2, Worker)
2. **Connectivity Tests**: Verify bindings and network accessibility
3. **Application Tests**: Verify deployed application responds correctly
4. **Security Tests**: Verify secrets management and access control

**Target**: 100% infrastructure verification (all resources functional)
**Estimated Test Duration**: 30-45 minutes

---

## 🏗️ Infrastructure Tests

### Purpose

Verify that all Cloudflare infrastructure components are provisioned correctly.

### Test 1: Wrangler Authentication

**Objective**: Verify Wrangler CLI is authenticated with correct Cloudflare account

```bash
# Run authentication test
wrangler whoami

# Expected output:
# 👋 You are logged in with an OAuth Token
# Account Name: <your-account-name>
# Account ID: <your-account-id>
```

**Success Criteria**:

- [ ] Command succeeds without errors
- [ ] Shows correct account email
- [ ] Shows correct account ID (matches documentation)

**Failure Actions**:

- If command fails: Re-authenticate with `wrangler login`
- If wrong account: Logout and login to correct account

---

### Test 2: D1 Database Provisioned

**Objective**: Verify D1 database exists and is queryable

```bash
# List D1 databases
wrangler d1 list

# Expected output: Shows sebcdev-payload-db in list

# Test database connectivity
wrangler d1 execute sebcdev-payload-db --command "SELECT 1 as test"

# Expected output:
# ┌──────┐
# │ test │
# ├──────┤
# │ 1    │
# └──────┘
```

**Success Criteria**:

- [ ] Database appears in `wrangler d1 list`
- [ ] Database name matches expected: `sebcdev-payload-db`
- [ ] Test query executes successfully
- [ ] Query returns expected result: `{ test: 1 }`

**Failure Actions**:

- If database not found: Re-run Commit 2 (D1 provisioning)
- If query fails: Check database status in Cloudflare dashboard

**Cloudflare Dashboard Verification**:

1. Navigate to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Go to **Workers & Pages** > **D1**
3. Verify `sebcdev-payload-db` appears in list
4. Verify database status is "Ready"

---

### Test 3: R2 Bucket Provisioned

**Objective**: Verify R2 bucket exists and is accessible

```bash
# List R2 buckets
wrangler r2 bucket list

# Expected output: Shows sebcdev-payload-media in list

# Test bucket access (list objects - should be empty)
wrangler r2 object list sebcdev-payload-media

# Expected output: Empty list or "No objects found"
```

**Success Criteria**:

- [ ] Bucket appears in `wrangler r2 bucket list`
- [ ] Bucket name matches expected: `sebcdev-payload-media`
- [ ] Can list objects without errors (empty is OK)

**Failure Actions**:

- If bucket not found: Re-run Commit 3 (R2 provisioning)
- If access denied: Check account permissions

**Cloudflare Dashboard Verification**:

1. Navigate to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Go to **R2** > **Buckets**
3. Verify `sebcdev-payload-media` appears in list
4. Verify bucket status is "Active"

---

### Test 4: Worker Deployed

**Objective**: Verify Cloudflare Worker is deployed and active

```bash
# Check Worker status (via deployment)
wrangler deployments list

# Expected output: Shows recent deployment with timestamp

# Alternative: Use Wrangler to get Worker info
wrangler deployments list --name sebcdev-payload
```

**Success Criteria**:

- [ ] Worker deployment visible
- [ ] Deployment timestamp is recent (within last hour)
- [ ] Deployment status is "Active"

**Cloudflare Dashboard Verification**:

1. Navigate to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Go to **Workers & Pages** > **Overview**
3. Find `sebcdev-payload` in Workers list
4. Verify status shows "Active"
5. Verify recent deployment visible

---

## 🔗 Connectivity Tests

### Purpose

Verify that Worker can connect to D1 database and R2 bucket via bindings.

### Test 5: Bindings Configuration

**Objective**: Verify `wrangler.toml` has correct bindings configuration

```bash
# Validate configuration with dry-run
wrangler deploy --dry-run

# Expected output:
# Your worker has access to the following bindings:
# - D1 Databases:
#   - DB: sebcdev-payload-db (<database-id>)
# - R2 Buckets:
#   - MEDIA_BUCKET: sebcdev-payload-media
```

**Success Criteria**:

- [ ] Dry-run succeeds without errors
- [ ] D1 binding shows correct database name and ID
- [ ] R2 binding shows correct bucket name
- [ ] No warnings about missing bindings

**Failure Actions**:

- If dry-run fails: Check `wrangler.toml` syntax
- If bindings missing: Re-run Commit 4 (bindings configuration)
- If database_id mismatch: Update `wrangler.toml` with correct ID from Commit 2

---

### Test 6: Worker HTTP Connectivity

**Objective**: Verify Worker responds to HTTP requests

```bash
# Test HTTP response
curl -I https://<worker-url>.workers.dev

# Expected output:
# HTTP/2 200
# date: <timestamp>
# content-type: text/html
# cf-ray: <cloudflare-ray-id>
# ...

# Test with verbose output (optional)
curl -v https://<worker-url>.workers.dev
```

**Success Criteria**:

- [ ] HTTP status code is 200 OK
- [ ] Response has `cf-ray` header (confirms Cloudflare serving)
- [ ] Response has `content-type: text/html`
- [ ] No 500 or 502 errors

**Failure Actions**:

- If 500 error: Check Worker logs with `wrangler tail`
- If 502 error: Worker may be crashing, check logs for errors
- If timeout: Check Cloudflare status page

---

## 🌐 Application Tests

### Purpose

Verify the deployed Next.js + Payload CMS application is functional.

### Test 7: Homepage Accessibility

**Objective**: Verify application homepage loads successfully

**Manual Test Steps**:

1. Open browser (Chrome, Firefox, or Safari)
2. Navigate to: `https://<worker-url>.workers.dev`
3. Wait for page to load (may take 2-5 seconds on first request - cold start)
4. Verify page loads without errors

**Success Criteria**:

- [ ] Homepage loads and displays content
- [ ] No JavaScript errors in browser console (F12)
- [ ] No network errors (check Network tab)
- [ ] Page renders correctly (no broken layout)
- [ ] Response time < 5 seconds (first load)

**Browser Console Check**:

```javascript
// Open browser console (F12), check for errors
// Should see no red error messages
// Warnings (yellow) are acceptable if not critical
```

**Failure Actions**:

- If blank page: Check browser console for JavaScript errors
- If 404: Verify Worker URL is correct
- If slow (>10s): Check Worker logs for cold start issues

---

### Test 8: Admin Panel Accessibility

**Objective**: Verify Payload CMS admin panel is accessible

**Manual Test Steps**:

1. Open browser
2. Navigate to: `https://<worker-url>.workers.dev/admin`
3. Wait for admin panel to load
4. Verify login screen appears

**Success Criteria**:

- [ ] Admin panel loads
- [ ] Payload CMS branding visible
- [ ] Login form displays (username and password fields)
- [ ] No JavaScript errors in browser console
- [ ] No network errors
- [ ] Page renders correctly

**Login Screen Elements**:

- [ ] Payload logo or branding
- [ ] Email/username input field
- [ ] Password input field
- [ ] Login button
- [ ] "Forgot password?" link (if applicable)

**Failure Actions**:

- If 404: Admin route may not be configured, check Next.js routes
- If blank: Check console for errors, verify Payload config
- If 500: Check Worker logs for backend errors

---

### Test 9: API Routes Accessibility (Optional)

**Objective**: Verify Payload API routes are accessible

```bash
# Test API health check (if available)
curl https://<worker-url>.workers.dev/api

# Expected: 200 OK or redirect (depending on Payload config)

# Test API GraphQL endpoint (if enabled)
curl https://<worker-url>.workers.dev/api/graphql

# Expected: 200 OK or "POST required" message
```

**Success Criteria**:

- [ ] API endpoints respond (200 or appropriate status)
- [ ] No 500 errors
- [ ] CORS headers present if needed

**Note**: Full API functionality testing is part of Phase 3.

---

## 🔍 Database Migration Tests

### Purpose

Verify database migrations executed successfully and tables created.

### Test 10: Verify Migrations Applied

**Objective**: Verify Payload CMS migrations created database tables

```bash
# List applied migrations
wrangler d1 migrations list sebcdev-payload-db

# Expected output: Shows list of migrations with timestamps

# Query database to verify tables exist
wrangler d1 execute sebcdev-payload-db --command "SELECT name FROM sqlite_master WHERE type='table'"

# Expected output: Shows Payload tables (users, media, payload_preferences, etc.)
```

**Success Criteria**:

- [ ] Migrations list shows applied migrations
- [ ] Database has Payload core tables
- [ ] No migration errors in Worker logs

**Expected Tables** (Payload core):

- `users` - User accounts
- `media` - Uploaded media files
- `payload_preferences` - User preferences
- `payload_migrations` - Migration tracking
- (plus any custom collections)

**Failure Actions**:

- If no migrations: Check Worker logs for migration errors
- If tables missing: Migrations may have failed, check error logs
- If migration errors: Review migration SQL and Payload config

---

### Test 11: Worker Logs Verification

**Objective**: Verify Worker logs show successful startup and no critical errors

```bash
# Tail Worker logs (run in separate terminal)
wrangler tail

# Then access the application in browser
# Watch logs for requests and errors
```

**Success Criteria**:

- [ ] Logs show incoming HTTP requests
- [ ] No 500 Internal Server errors
- [ ] No database connection errors
- [ ] No binding errors ("DB is not defined")
- [ ] Payload CMS initialization logs visible

**Expected Log Patterns**:

```
GET https://<worker-url>.workers.dev/ - 200 OK
GET https://<worker-url>.workers.dev/admin - 200 OK
Payload CMS initialized successfully
```

**Critical Errors to Watch For**:

- ❌ "DB is not defined" → Bindings not configured
- ❌ "Failed to connect to database" → D1 issue
- ❌ "PAYLOAD_SECRET is required" → Secret not set
- ❌ "500 Internal Server Error" → Application crash

**Failure Actions**:

- If binding errors: Re-check `wrangler.toml` (Commit 4)
- If secret errors: Re-run `wrangler secret put PAYLOAD_SECRET`
- If crashes: Review error stack trace, check code compatibility

---

## 🔒 Security Tests

### Purpose

Verify secrets are managed securely and not exposed.

### Test 12: Verify Secrets Not in Git

**Objective**: Ensure no secrets committed to git repository

```bash
# Check .dev.vars is gitignored
git check-ignore .dev.vars

# Expected output: .dev.vars

# Search git history for secret leaks
git log --all --full-history --source -- .dev.vars

# Expected: Only shows .gitignore entry, no actual secrets

# Check wrangler.toml for hardcoded secrets (should have none)
cat wrangler.toml | grep -i "secret\|password\|key"

# Expected: No secret values, only binding configurations
```

**Success Criteria**:

- [ ] `.dev.vars` is gitignored
- [ ] No `PAYLOAD_SECRET` values in git history
- [ ] No secrets in `wrangler.toml`
- [ ] Secrets managed via `wrangler secret put`

**Failure Actions**:

- If secrets in git: Remove from history (dangerous!), rotate secrets
- If .dev.vars not ignored: Add to .gitignore immediately

---

### Test 13: Verify Wrangler Secrets Set

**Objective**: Verify production secrets are configured via Wrangler

```bash
# List Wrangler secrets (values not shown)
wrangler secret list

# Expected output: Shows secret names (not values)
# - PAYLOAD_SECRET
```

**Success Criteria**:

- [ ] `PAYLOAD_SECRET` appears in secret list
- [ ] Secret values are NOT displayed (security)
- [ ] Secret is set for correct Worker

**Failure Actions**:

- If secret missing: Re-run `wrangler secret put PAYLOAD_SECRET`

---

## ✅ Complete Testing Checklist

Run through this checklist to verify Phase 2 deployment:

### Infrastructure Provisioning

- [ ] **Test 1**: Wrangler authentication successful
- [ ] **Test 2**: D1 database exists and queryable
- [ ] **Test 3**: R2 bucket exists and accessible
- [ ] **Test 4**: Worker deployed and active

### Connectivity

- [ ] **Test 5**: Bindings configured correctly (dry-run passes)
- [ ] **Test 6**: Worker responds to HTTP requests (200 OK)

### Application

- [ ] **Test 7**: Homepage loads successfully
- [ ] **Test 8**: Admin panel accessible (login screen visible)
- [ ] **Test 9**: API routes respond (optional)

### Database

- [ ] **Test 10**: Migrations applied, tables created
- [ ] **Test 11**: Worker logs show no critical errors

### Security

- [ ] **Test 12**: No secrets in git history
- [ ] **Test 13**: Wrangler secrets configured

---

## 📊 Testing Summary

After completing all tests, document results:

| Test                 | Status  | Notes                         |
| -------------------- | ------- | ----------------------------- |
| 1. Wrangler Auth     | ✅ / ❌ | Account ID: **\_\_\_**        |
| 2. D1 Database       | ✅ / ❌ | Database: sebcdev-payload-db  |
| 3. R2 Bucket         | ✅ / ❌ | Bucket: sebcdev-payload-media |
| 4. Worker Deployed   | ✅ / ❌ | URL: **\_\_\_**               |
| 5. Bindings Config   | ✅ / ❌ | Dry-run: Pass/Fail            |
| 6. HTTP Connectivity | ✅ / ❌ | Response: 200 OK              |
| 7. Homepage          | ✅ / ❌ | Load time: \_\_\_s            |
| 8. Admin Panel       | ✅ / ❌ | Login screen: Yes/No          |
| 9. API Routes        | ✅ / ❌ | Optional                      |
| 10. Migrations       | ✅ / ❌ | Tables: \_\_\_                |
| 11. Worker Logs      | ✅ / ❌ | Errors: 0                     |
| 12. Git Secrets      | ✅ / ❌ | Clean: Yes/No                 |
| 13. Wrangler Secrets | ✅ / ❌ | PAYLOAD_SECRET: Set           |

**Overall Pass Rate**: \_\_\_/13 tests passed

---

## 🚨 Common Issues & Troubleshooting

### Issue: Worker returns 500 error

**Symptoms**:

- `curl` returns HTTP 500
- Browser shows "Internal Server Error"
- Worker logs show error stack traces

**Troubleshooting Steps**:

1. Check Worker logs: `wrangler tail`
2. Look for specific error messages
3. Common causes:
   - Missing bindings (DB, MEDIA_BUCKET)
   - PAYLOAD_SECRET not set
   - Migration failures
   - Code compatibility issues

**Solutions**:

- Missing bindings: Re-check `wrangler.toml` and redeploy
- Missing secret: `wrangler secret put PAYLOAD_SECRET`
- Migration errors: Check migration SQL compatibility with D1

---

### Issue: Homepage loads but admin panel shows 404

**Symptoms**:

- `/` route works
- `/admin` shows 404 Not Found

**Troubleshooting Steps**:

1. Verify admin route in Next.js app directory
2. Check build output includes admin files
3. Review `next.config.mjs` for route configuration

**Solutions**:

- Verify Payload config includes `admin` route
- Check OpenNext build includes admin assets
- Redeploy after fixing configuration

---

### Issue: Database migrations don't run

**Symptoms**:

- Worker logs show "migrations pending"
- Database has no tables
- Admin panel shows database errors

**Troubleshooting Steps**:

1. Check Worker logs for migration errors
2. Query database: `wrangler d1 execute <db> --command "SELECT name FROM sqlite_master WHERE type='table'"`
3. Check migration files in `src/migrations/`

**Solutions**:

- Migrations may run on first admin panel access (trigger by visiting `/admin`)
- Manually run migrations via Payload CLI if needed
- Check D1 compatibility with migration SQL

---

### Issue: Worker logs show binding errors

**Symptoms**:

- Error: "DB is not defined"
- Error: "MEDIA_BUCKET is not defined"

**Troubleshooting Steps**:

1. Check `wrangler.toml` bindings configuration
2. Verify database_id and bucket_name are correct
3. Run `wrangler deploy --dry-run` to validate

**Solutions**:

- Update `wrangler.toml` with correct bindings (Commit 4)
- Verify binding names match code expectations (`DB`, `MEDIA_BUCKET`)
- Redeploy after fixing bindings

---

## ❓ FAQ

**Q: How long should the first page load take?**
A: First request may take 2-5 seconds (cold start). Subsequent requests should be <1 second.

**Q: What if some tests fail?**
A: Identify which commit caused the failure and re-review/re-implement that commit.

**Q: Can I test locally before deploying?**
A: Yes! Use `wrangler dev` to test with remote D1/R2 bindings locally.

**Q: Should I test in production or staging?**
A: For Phase 2, deploying to default Worker environment is fine. Consider staging for later phases.

**Q: How do I verify migrations without querying the database?**
A: Visit the admin panel (`/admin`) - if it loads without database errors, migrations likely succeeded.

---

**Testing Complete**: All tests passed? Mark Phase 2 as VALIDATED and proceed to Phase 3! 🎉
