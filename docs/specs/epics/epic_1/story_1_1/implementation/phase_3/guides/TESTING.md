# Phase 3 - Testing Guide

Complete manual testing and verification strategy for Phase 3.

---

## 🎯 Testing Strategy

Phase 3 uses **manual verification testing** to validate that all infrastructure components are correctly configured and functional. This phase has no automated tests since it focuses on infrastructure verification and documentation.

**Testing Layers**:

1. **Infrastructure Connectivity**: Verify all Cloudflare components are accessible
2. **Configuration Validation**: Ensure bindings and settings are correct
3. **Documentation Accuracy**: Test that documented commands work
4. **Usability Testing**: Verify documentation is clear and complete

**Target**: 100% infrastructure components verified and functional

---

## 🧪 Manual Verification Tests

### Test Category 1: Cloudflare Worker Accessibility

**Purpose**: Verify the deployed Worker is accessible and responding to HTTP requests

**Prerequisites**:

- Worker deployed in Phase 2
- Worker URL known (from Phase 2 or Cloudflare dashboard)

**Test Steps**:

1. **Test Worker via curl**:

   ```bash
   curl -I https://[worker-url]
   ```

   **Expected Result**: HTTP response (200, 301, or other valid status - not timeout or connection refused)
   **Document**: Response status, headers, any errors

2. **Test Worker via browser**:
   - Open `https://[worker-url]` in web browser
   - **Expected Result**: Page loads (may be default Next.js page or custom content)
   - **Document**: Take screenshot, note any console errors in DevTools

3. **Check Worker logs**:

   ```bash
   wrangler tail [worker-name] --format=pretty
   ```

   - Make a request to Worker URL
   - **Expected Result**: Logs appear showing request processing
   - **Document**: Sample log output

**Success Criteria**:

- [ ] Worker responds to HTTP requests
- [ ] Browser can access Worker URL
- [ ] Logs show Worker is processing requests
- [ ] No critical errors in logs

---

### Test Category 2: D1 Database Connection

**Purpose**: Verify D1 database is accessible and contains expected Payload tables

**Prerequisites**:

- D1 database created in Phase 2
- Database name known
- Wrangler CLI authenticated

**Test Steps**:

1. **List D1 databases**:

   ```bash
   wrangler d1 list
   ```

   **Expected Result**: Your database appears in the list
   **Document**: Database name and ID

2. **Query database tables**:

   ```bash
   wrangler d1 execute [db-name] --command "SELECT name FROM sqlite_master WHERE type='table'"
   ```

   **Expected Result**: List of tables including:
   - `users` (Payload users collection)
   - `media` (Payload media collection)
   - `payload_migrations` (Payload migration tracking)
   - Other Payload core tables
     **Document**: Full list of tables

3. **Count rows in migrations table**:

   ```bash
   wrangler d1 execute [db-name] --command "SELECT COUNT(*) FROM payload_migrations"
   ```

   **Expected Result**: At least 1 migration (initial migration from Phase 2)
   **Document**: Migration count

4. **Verify database schema**:
   ```bash
   wrangler d1 execute [db-name] --command "SELECT sql FROM sqlite_master WHERE type='table' AND name='users'"
   ```
   **Expected Result**: SQL CREATE statement for users table
   **Document**: Schema looks correct (has expected columns)

**Success Criteria**:

- [ ] Database exists and is accessible
- [ ] Payload core tables are present
- [ ] Migrations have been applied
- [ ] Table schemas are correct

---

### Test Category 3: R2 Bucket Connection

**Purpose**: Verify R2 bucket is accessible and configured correctly

**Prerequisites**:

- R2 bucket created in Phase 2
- Bucket name known
- Wrangler CLI authenticated

**Test Steps**:

1. **List R2 buckets**:

   ```bash
   wrangler r2 bucket list
   ```

   **Expected Result**: Your media bucket appears in the list
   **Document**: Bucket name

2. **List objects in bucket**:

   ```bash
   wrangler r2 object list [bucket-name]
   ```

   **Expected Result**: Success (list may be empty if no uploads yet)
   **Document**: Object count, any existing objects

3. **Test upload (optional)**:

   ```bash
   echo "test" > test.txt
   wrangler r2 object put [bucket-name]/test.txt --file=test.txt
   wrangler r2 object list [bucket-name]
   ```

   **Expected Result**: test.txt appears in object list
   **Document**: Upload successful
   **Cleanup**: Delete test file after verification

4. **Verify bucket in Cloudflare dashboard**:
   - Navigate to Cloudflare dashboard > R2
   - Find your bucket
     **Expected Result**: Bucket visible with correct name
     **Document**: Screenshot of dashboard

**Success Criteria**:

- [ ] Bucket exists and is accessible
- [ ] Can list objects in bucket
- [ ] Can upload test object (if performing optional test)
- [ ] Bucket visible in Cloudflare dashboard

---

### Test Category 4: Bindings Configuration

**Purpose**: Verify bindings in `wrangler.toml` match actual Cloudflare resources

**Prerequisites**:

- `wrangler.toml` exists in project root
- Worker, D1, and R2 resources created

**Test Steps**:

1. **Review wrangler.toml bindings**:

   ```bash
   cat wrangler.toml
   ```

   **Expected Result**: File contains bindings for:
   - D1 database (binding name `DB`, database_name, database_id)
   - R2 bucket (binding name `MEDIA_BUCKET`, bucket_name)
     **Document**: Copy bindings section

2. **Verify D1 binding matches database**:

   ```bash
   # Get database ID from wrangler d1 list
   wrangler d1 list

   # Compare to database_id in wrangler.toml
   grep "database_id" wrangler.toml
   ```

   **Expected Result**: IDs match
   **Document**: Verification result

3. **Verify R2 binding matches bucket**:

   ```bash
   # Get bucket name from wrangler r2 bucket list
   wrangler r2 bucket list

   # Compare to bucket_name in wrangler.toml
   grep "bucket_name" wrangler.toml
   ```

   **Expected Result**: Names match
   **Document**: Verification result

4. **Check compatibility flags**:
   ```bash
   grep "compatibility_flags" wrangler.toml
   ```
   **Expected Result**: Contains `nodejs_compat` (required for Payload CMS)
   **Document**: Compatibility flags

**Success Criteria**:

- [ ] wrangler.toml has D1 binding with correct database ID
- [ ] wrangler.toml has R2 binding with correct bucket name
- [ ] Binding names match expected names (DB, MEDIA_BUCKET)
- [ ] Compatibility flags include nodejs_compat

---

### Test Category 5: Admin Panel Access

**Purpose**: Verify Payload CMS admin panel is accessible

**Prerequisites**:

- Worker deployed and accessible
- Payload CMS configured in Phase 2

**Test Steps**:

1. **Access admin login screen**:
   - Navigate to `https://[worker-url]/admin` in web browser
     **Expected Result**: Payload admin login screen appears
     **Document**: Screenshot of login screen

2. **Check browser console for errors**:
   - Open browser DevTools (F12)
   - Check Console tab
     **Expected Result**: No critical errors (warnings may be acceptable)
     **Document**: Any errors or warnings

3. **Verify admin panel routing**:
   - Try accessing `https://[worker-url]/admin/collections/users`
     **Expected Result**: Redirects to login (if not authenticated) or shows collection (if authenticated)
     **Document**: Behavior

4. **Check Network tab for API calls**:
   - Open DevTools > Network tab
   - Reload admin panel
     **Expected Result**: Successful API calls to `/api/*` endpoints
     **Document**: Any failed requests

**Success Criteria**:

- [ ] Admin panel login screen is accessible
- [ ] No critical console errors
- [ ] Routing works (redirects to login)
- [ ] API endpoints respond (visible in Network tab)

---

### Test Category 6: Homepage Verification

**Purpose**: Verify the application homepage loads correctly

**Prerequisites**:

- Worker deployed

**Test Steps**:

1. **Access homepage**:
   - Navigate to `https://[worker-url]/` in web browser
     **Expected Result**: Page loads (may be default Next.js page or custom homepage)
     **Document**: Screenshot

2. **Check browser console**:
   - Open DevTools > Console
     **Expected Result**: No critical errors
     **Document**: Any errors or warnings

3. **Check page performance**:
   - Open DevTools > Network tab
   - Reload page
   - Check total load time
     **Expected Result**: Page loads in reasonable time (< 5 seconds)
     **Document**: Load time

4. **Verify page renders expected content**:
   - Check if page shows expected layout/content
     **Expected Result**: Page renders without obvious issues
     **Document**: Note any rendering problems

**Success Criteria**:

- [ ] Homepage is accessible
- [ ] No critical console errors
- [ ] Page loads in reasonable time
- [ ] Content renders correctly

---

## 📊 Documentation Accuracy Testing

### Test Category 7: Verify Documented Commands

**Purpose**: Ensure all commands documented in Phase 3 work correctly

**Prerequisites**:

- All Phase 3 documentation files created

**Test Steps**:

1. **Test commands from infrastructure-verification.md**:
   - Execute each command documented
   - Verify outputs match documented expectations
     **Document**: Any discrepancies

2. **Test commands from cloudflare-setup.md**:
   - Test deployment commands (read-only operations)
   - Test migration commands (in dev environment if safe)
   - Test secret management commands (list only, not modify)
     **Document**: Command accuracy

3. **Test commands from troubleshooting.md**:
   - Test diagnostic commands
   - Verify they produce expected outputs
     **Document**: Command effectiveness

**Success Criteria**:

- [ ] All documented commands execute without errors
- [ ] Command outputs match documented expectations
- [ ] Commands use correct syntax
- [ ] Placeholders are clearly marked

---

## 📝 Usability Testing

### Test Category 8: Documentation Review by Peer

**Purpose**: Validate documentation is understandable by another team member

**Prerequisites**:

- All Phase 3 documentation complete

**Test Steps**:

1. **Have another team member read deployment guide**:
   - Ask them to review `cloudflare-setup.md`
   - Ask: "Can you understand the deployment process?"
     **Expected Result**: Documentation is clear without asking questions
     **Document**: Feedback

2. **Have peer locate infrastructure information**:
   - Ask them to find Worker URL using `infrastructure.md`
   - Ask them to find D1 database name
     **Expected Result**: Information is easy to locate
     **Document**: Feedback

3. **Have peer try to resolve a hypothetical issue using troubleshooting guide**:
   - Present a scenario: "Worker not responding"
   - Ask them to use troubleshooting.md to diagnose
     **Expected Result**: Can find relevant section and follow diagnostic steps
     **Document**: Feedback

**Success Criteria**:

- [ ] Peer can understand deployment process
- [ ] Peer can locate critical information
- [ ] Peer can use troubleshooting guide effectively
- [ ] Documentation requires minimal clarification

---

## 🐛 Known Limitations & Notes

### Expected Behaviors

**Cold Starts**: Cloudflare Workers may have cold start delays

- First request after idle may take 1-3 seconds
- Subsequent requests should be fast
- **This is normal** - document in troubleshooting guide if becomes an issue

**D1 Eventual Consistency**: D1 is eventually consistent

- Writes may not be immediately visible in queries
- For this phase, initial migrations should be fully applied
- **Normal behavior** - no action needed for Phase 3

**R2 Storage**: Bucket may be empty initially

- No media uploads yet (expected for this phase)
- Bucket should be accessible even if empty
- **Normal state** - document in verification report

---

## ✅ Testing Checklist

Complete this checklist as you perform manual verification:

### Infrastructure Connectivity

- [ ] Worker accessible via curl
- [ ] Worker accessible via browser
- [ ] Worker logs show activity
- [ ] D1 database listed and accessible
- [ ] D1 tables exist and have correct schema
- [ ] R2 bucket listed and accessible
- [ ] R2 bucket operations work (list objects)

### Configuration Validation

- [ ] wrangler.toml has D1 binding
- [ ] D1 binding uses correct database ID
- [ ] wrangler.toml has R2 binding
- [ ] R2 binding uses correct bucket name
- [ ] Compatibility flags include nodejs_compat
- [ ] Environment variables documented

### Application Functionality

- [ ] Admin panel login screen accessible
- [ ] No critical console errors in admin panel
- [ ] Homepage loads successfully
- [ ] No critical console errors on homepage
- [ ] API endpoints respond (visible in Network tab)

### Documentation Accuracy

- [ ] All documented commands tested and work
- [ ] Command outputs match documentation
- [ ] Placeholders clearly marked
- [ ] Screenshots are accurate and current

### Documentation Usability

- [ ] Peer review completed
- [ ] Documentation is clear and comprehensive
- [ ] Troubleshooting guide is effective
- [ ] README updates are helpful

---

## 📝 Test Report Template

After completing all tests, create a test report:

```markdown
# Phase 3 Verification Test Report

**Tester**: [Name]
**Date**: [Date]
**Environment**: Production (Cloudflare Workers)

## Infrastructure Verification

### Cloudflare Worker

- **Status**: ✅ Pass / ❌ Fail
- **URL**: https://[worker-url]
- **Response**: [HTTP status]
- **Notes**: [Any observations]

### D1 Database

- **Status**: ✅ Pass / ❌ Fail
- **Name**: [db-name]
- **Tables Found**: [count]
- **Notes**: [Any observations]

### R2 Bucket

- **Status**: ✅ Pass / ❌ Fail
- **Name**: [bucket-name]
- **Objects**: [count]
- **Notes**: [Any observations]

### Bindings

- **Status**: ✅ Pass / ❌ Fail
- **D1 Binding**: [verified match]
- **R2 Binding**: [verified match]
- **Notes**: [Any observations]

### Admin Panel

- **Status**: ✅ Pass / ❌ Fail
- **Login Screen**: [accessible/not accessible]
- **Console Errors**: [none/list errors]
- **Notes**: [Any observations]

## Documentation Testing

### Command Accuracy

- **Status**: ✅ Pass / ❌ Fail
- **Commands Tested**: [count]
- **Failed Commands**: [list if any]

### Usability Review

- **Reviewer**: [peer name]
- **Feedback**: [summary]
- **Improvements Needed**: [list if any]

## Overall Result

- [ ] ✅ **ALL TESTS PASSED** - Infrastructure verified and documented
- [ ] 🔧 **ISSUES FOUND** - See notes above
- [ ] ❌ **CRITICAL FAILURES** - Phase 2 infrastructure issues

## Next Steps

[What should happen next - e.g., merge documentation, fix issues, etc.]
```

---

## ❓ FAQ

**Q: What if a verification test fails?**
A: Document the failure in the verification report. Investigate if it's a Phase 2 deployment issue or configuration error. Do not proceed until critical issues are resolved.

**Q: How detailed should test documentation be?**
A: Include command outputs, screenshots, and any errors encountered. Documentation should be comprehensive enough for troubleshooting.

**Q: Should I test every command in the documentation?**
A: Test critical commands (deployments, database queries, bucket operations). Sample other commands for accuracy.

**Q: What if peer review identifies unclear documentation?**
A: Update documentation based on feedback. Re-review after changes.

**Q: Are automated tests required for Phase 3?**
A: No. Phase 3 focuses on manual verification and documentation. Automated tests will come in later stories for application functionality.

---

## 📚 Reference

- [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) - What to verify and document
- [COMMIT_CHECKLIST.md](../COMMIT_CHECKLIST.md) - Detailed verification steps
- [validation/VALIDATION_CHECKLIST.md](../validation/VALIDATION_CHECKLIST.md) - Final validation
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/) - Command reference
