# Phase 1: Testing Guide

**Phase**: Environment Validation & Type Synchronization
**Story**: 1.2 - Récupération & Configuration Locale

This guide describes the testing and validation procedures for Phase 1. Since this phase focuses on environment validation rather than feature development, testing is primarily manual verification.

---

## Testing Overview

### Phase Testing Characteristics

| Aspect              | Description                            |
| ------------------- | -------------------------------------- |
| **Type**            | Manual validation                      |
| **Automated Tests** | TypeScript compilation, ESLint         |
| **Focus**           | Environment configuration verification |
| **Duration**        | ~30 minutes total                      |

### Testing Goals

1. Verify Cloudflare CLI authentication works
2. Verify D1 database binding is accessible
3. Verify R2 storage binding is configured
4. Verify TypeScript types are synchronized
5. Verify development server starts correctly
6. Verify application is accessible

---

## Test Categories

### 1. Authentication Tests

#### Test 1.1: Wrangler CLI Authentication

**Objective**: Verify Wrangler can communicate with Cloudflare

**Procedure**:

```bash
wrangler whoami
```

**Expected Result**:

- Command executes without error
- Account information is displayed
- Account name and ID are shown

**Pass Criteria**:

- [ ] No authentication errors
- [ ] Account details visible
- [ ] CLI version displayed

**Failure Actions**:

```bash
# If not authenticated
wrangler login

# Follow browser authentication flow
```

---

### 2. Database Tests

#### Test 2.1: D1 Local Connection

**Objective**: Verify local D1 database is accessible

**Procedure**:

```bash
wrangler d1 execute D1 --command "SELECT name FROM sqlite_master WHERE type='table'" --local
```

**Expected Result**:

```
┌─────────────────────────────────┐
│ name                            │
├─────────────────────────────────┤
│ users                           │
│ media                           │
│ payload_locked_documents        │
│ payload_migrations              │
│ payload_preferences             │
│ _users_rels                     │
└─────────────────────────────────┘
```

**Pass Criteria**:

- [ ] Query executes without error
- [ ] Tables are listed
- [ ] Core Payload tables present (users, media, payload_migrations)

**Failure Actions**:

```bash
# Check binding name in wrangler.jsonc
cat wrangler.jsonc | grep -A5 "d1_databases"

# If no tables, run migrations
pnpm payload migrate
```

#### Test 2.2: D1 Table Structure

**Objective**: Verify Payload tables have correct structure

**Procedure**:

```bash
wrangler d1 execute D1 --command "PRAGMA table_info(users)" --local
```

**Expected Result**:

- Column definitions for users table
- Includes id, email, password fields

**Pass Criteria**:

- [ ] Table structure is valid
- [ ] Expected columns present

---

### 3. Storage Tests

#### Test 3.1: R2 Binding Configuration

**Objective**: Verify R2 bucket binding is configured

**Procedure**:

```bash
cat wrangler.jsonc | grep -A5 "r2_buckets"
```

**Expected Result**:

```json
"r2_buckets": [
  {
    "binding": "R2",
    "bucket_name": "sebcdev-payload-cache",
    ...
  }
]
```

**Pass Criteria**:

- [ ] R2 binding exists
- [ ] Binding name is "R2"
- [ ] Bucket name is correct

---

### 4. TypeScript Tests

#### Test 4.1: Type Generation - Cloudflare

**Objective**: Verify Cloudflare types generate correctly

**Procedure**:

```bash
pnpm generate:types:cloudflare
```

**Expected Result**:

```
 ⛅️ wrangler 4.x.x
──────────────────────
Generating project types...
✨ Types written to cloudflare-env.d.ts
```

**Pass Criteria**:

- [ ] Command completes without error
- [ ] cloudflare-env.d.ts is created/updated
- [ ] File contains CloudflareEnv interface

**Verification**:

```bash
cat cloudflare-env.d.ts | grep -A5 "interface CloudflareEnv"
```

#### Test 4.2: Type Generation - Payload

**Objective**: Verify Payload types generate correctly

**Procedure**:

```bash
pnpm generate:types:payload
```

**Expected Result**:

```
[XX:XX:XX] INFO: Generating Payload types...
[XX:XX:XX] INFO: Done.
```

**Pass Criteria**:

- [ ] Command completes without error
- [ ] src/payload-types.ts is created/updated
- [ ] File contains Config interface

**Verification**:

```bash
head -100 src/payload-types.ts | grep -E "(Config|User|Media)"
```

#### Test 4.3: TypeScript Compilation

**Objective**: Verify project compiles without type errors

**Procedure**:

```bash
npx tsc --noEmit
```

**Expected Result**:

- No output (success)
- Exit code 0

**Pass Criteria**:

- [ ] Command exits with code 0
- [ ] No type errors reported

**Failure Actions**:

```bash
# View specific errors
npx tsc --noEmit 2>&1 | head -50

# Fix errors in source files
# Re-run compilation
```

#### Test 4.4: ESLint Validation

**Objective**: Verify code passes linting rules

**Procedure**:

```bash
pnpm lint
```

**Expected Result**:

```
✔ No ESLint warnings or errors
```

**Pass Criteria**:

- [ ] Command exits successfully
- [ ] No lint errors
- [ ] Warnings are acceptable

**Failure Actions**:

```bash
# View specific errors
pnpm lint 2>&1 | head -50

# Auto-fix if possible
pnpm lint --fix
```

---

### 5. Application Tests

#### Test 5.1: Development Server Startup

**Objective**: Verify development server starts correctly

**Procedure**:

```bash
pnpm dev
```

**Expected Result**:

```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
  - Environments: .env

 ✓ Starting...
 ✓ Ready in X.Xs
```

**Pass Criteria**:

- [ ] Server starts without crash
- [ ] "Ready" message appears
- [ ] No critical errors in output
- [ ] Startup time < 30 seconds

**Metrics to Record**:

- Startup time: **\_** seconds
- Memory usage: **\_** MB (optional)

**Failure Actions**:

```bash
# Clean start
pnpm devsafe

# Check for port conflicts
lsof -i :3000

# Check logs for errors
pnpm dev 2>&1 | tee dev.log
```

#### Test 5.2: Homepage Accessibility

**Objective**: Verify homepage loads correctly

**Procedure**:

1. Open browser
2. Navigate to `http://localhost:3000`
3. Open DevTools (F12)
4. Check Console tab

**Expected Result**:

- Page loads
- Content renders
- No JavaScript errors in console

**Pass Criteria**:

- [ ] HTTP 200 response
- [ ] Page content visible
- [ ] No red errors in console
- [ ] No failed network requests

**Failure Actions**:

- Check terminal for server errors
- Check browser network tab for failed requests
- Verify database connection

#### Test 5.3: Admin Panel Accessibility

**Objective**: Verify admin panel is accessible

**Procedure**:

1. Navigate to `http://localhost:3000/admin`
2. Check page renders
3. Check DevTools console

**Expected Result**:

- Login screen appears
- UI components render
- No JavaScript errors

**Pass Criteria**:

- [ ] Admin route loads
- [ ] Login form visible
- [ ] No console errors
- [ ] Forms are interactive

**Failure Actions**:

- Check database connection
- Verify Payload configuration
- Check for missing dependencies

---

## Test Execution Summary

### Quick Test Commands

```bash
# All validation commands in sequence
echo "=== Phase 1 Testing ==="

echo "1. Wrangler Auth"
wrangler whoami

echo "2. D1 Database"
wrangler d1 execute D1 --command "SELECT name FROM sqlite_master WHERE type='table'" --local

echo "3. Type Generation"
pnpm generate:types

echo "4. TypeScript Check"
npx tsc --noEmit && echo "✓ TypeScript OK" || echo "✗ TypeScript FAILED"

echo "5. ESLint Check"
pnpm lint && echo "✓ ESLint OK" || echo "✗ ESLint FAILED"

echo "6. Dev Server (manual)"
echo "Run: pnpm dev"
echo "Then open: http://localhost:3000"
```

### Test Results Template

```markdown
# Phase 1 Test Results

**Date**: [YYYY-MM-DD]
**Tester**: [Name]

## Authentication Tests

- [ ] Test 1.1: Wrangler CLI Auth - [PASS/FAIL]

## Database Tests

- [ ] Test 2.1: D1 Local Connection - [PASS/FAIL]
- [ ] Test 2.2: D1 Table Structure - [PASS/FAIL]

## Storage Tests

- [ ] Test 3.1: R2 Binding Config - [PASS/FAIL]

## TypeScript Tests

- [ ] Test 4.1: Cloudflare Types - [PASS/FAIL]
- [ ] Test 4.2: Payload Types - [PASS/FAIL]
- [ ] Test 4.3: TypeScript Compilation - [PASS/FAIL]
- [ ] Test 4.4: ESLint Validation - [PASS/FAIL]

## Application Tests

- [ ] Test 5.1: Dev Server Startup - [PASS/FAIL]
- [ ] Test 5.2: Homepage Access - [PASS/FAIL]
- [ ] Test 5.3: Admin Panel Access - [PASS/FAIL]

## Metrics

- Server startup time: [X.X seconds]
- TypeScript errors: [0]
- ESLint errors: [0]

## Issues Found

- [None / List issues]

## Overall Status

[PASS / FAIL]
```

---

## Troubleshooting

### Common Test Failures

| Test            | Failure           | Solution                               |
| --------------- | ----------------- | -------------------------------------- |
| Wrangler Auth   | Not authenticated | `wrangler login`                       |
| D1 Connection   | No tables         | Run migrations: `pnpm payload migrate` |
| Type Generation | Command not found | `pnpm install`                         |
| TypeScript      | Type errors       | Fix errors, regenerate types           |
| ESLint          | Lint errors       | `pnpm lint --fix` or manual fix        |
| Dev Server      | Won't start       | `pnpm devsafe` (clean start)           |
| Homepage        | Won't load        | Check server terminal for errors       |
| Admin Panel     | Database error    | Check D1 connection                    |

### Debug Commands

```bash
# Check Wrangler version
npx wrangler --version

# Check Node.js version
node --version

# Check dependencies
pnpm list --depth=0

# Check local D1 state
ls -la .wrangler/state/v3/d1/

# Check Next.js cache
ls -la .next/

# View error logs
cat .next/trace 2>/dev/null | head -100
```

---

## Test Automation Notes

While Phase 1 testing is primarily manual, these tests could be automated in future:

### Potential Automation

1. **CI/CD Integration**: Run type checks and linting on every commit
2. **Health Checks**: Automated endpoint verification
3. **Database Verification**: Script to verify table structure

### Existing Automated Checks

```bash
# These are already automated via npm scripts:
pnpm generate:types    # Type generation
npx tsc --noEmit       # TypeScript check
pnpm lint              # ESLint check
```

---

**Testing Guide Created**: 2025-11-28
**Last Updated**: 2025-11-28
**Created by**: Claude Code (phase-doc-generator skill)
