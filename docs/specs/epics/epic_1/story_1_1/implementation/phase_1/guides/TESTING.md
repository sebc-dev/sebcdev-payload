# Phase 1 - Testing Guide

Complete testing strategy for Phase 1: Repository Creation from Template.

---

## 🎯 Testing Strategy

Phase 1 focuses on **infrastructure setup**, not code implementation. Testing is primarily **manual verification** of:

1. **Repository Creation**: GitHub repository exists with correct configuration
2. **File Integrity**: All template files present and unmodified
3. **Dependency Installation**: All packages installed successfully
4. **TypeScript Configuration**: Types compile correctly
5. **Environment Setup**: Development environment ready for Phase 2

**Testing Type**: Manual validation
**Automation Level**: Command-line verification scripts
**Coverage Goal**: 100% of setup steps verified

---

## 📋 Test Levels

### Level 1: Repository Verification (GitHub)
**Purpose**: Verify repository exists and is configured correctly

**What to test**:
- Repository created from correct template
- Repository accessible with correct permissions
- Template files visible in GitHub UI
- No sensitive data exposed

**Duration**: 5-10 minutes

---

### Level 2: Local Clone Verification
**Purpose**: Verify repository cloned correctly and structure intact

**What to test**:
- All files present locally
- Git configuration correct
- File integrity (no corruption)
- Structure matches template

**Duration**: 10-15 minutes

---

### Level 3: Dependency & Build Verification
**Purpose**: Verify development environment is functional

**What to test**:
- Dependencies installed successfully
- No critical vulnerabilities
- TypeScript compiles
- Lock file created

**Duration**: 15-20 minutes

---

## 🧪 Manual Test Procedures

### Test Suite 1: Repository Creation Validation

**Prerequisites**: GitHub account authenticated

#### Test 1.1: Repository Exists

**Objective**: Verify repository was created successfully

**Steps**:
```bash
# 1. Check repository exists
gh repo view [username]/sebcdev-payload

# 2. Open in browser
gh repo view [username]/sebcdev-payload --web
```

**Expected Result**:
- ✅ Repository page loads
- ✅ Shows "generated from payloadcms/payload"
- ✅ Repository name is `sebcdev-payload`

**Pass Criteria**:
- [ ] Repository visible on GitHub
- [ ] Correct name and description
- [ ] Shows template source

---

#### Test 1.2: Repository Configuration

**Objective**: Verify repository settings are correct

**Steps**:
```bash
# Get repository metadata
gh api repos/[username]/sebcdev-payload | jq '{
  name,
  description,
  private,
  has_issues,
  has_wiki,
  default_branch
}'
```

**Expected Result**:
```json
{
  "name": "sebcdev-payload",
  "description": "Payload CMS application on Cloudflare Workers with D1 and R2",
  "private": true/false,
  "has_issues": true,
  "has_wiki": false,
  "default_branch": "main"
}
```

**Pass Criteria**:
- [ ] Name is correct
- [ ] Description is appropriate
- [ ] Visibility matches expectation
- [ ] Default branch is main/master

---

#### Test 1.3: Template Files Present (GitHub UI)

**Objective**: Verify all critical files exist in GitHub

**Steps**:
1. Navigate to repository on GitHub
2. Check each critical file is visible:

**Expected Files**:
- [ ] `README.md`
- [ ] `package.json`
- [ ] `wrangler.toml`
- [ ] `payload.config.ts` (in src/)
- [ ] `next.config.mjs`
- [ ] `open-next.config.ts`
- [ ] `tsconfig.json`
- [ ] `.gitignore`
- [ ] `src/app/` directory
- [ ] `src/collections/` directory
- [ ] `src/migrations/` directory

**Pass Criteria**:
- [ ] All files visible in GitHub UI
- [ ] Directory structure matches template

---

#### Test 1.4: Security Check (No Secrets)

**Objective**: Ensure no sensitive data in repository

**Steps**:
```bash
# Search for .env files in GitHub
gh api repos/[username]/sebcdev-payload/contents | jq '.[].name' | grep -i env

# Should have no results or only .env.example
```

**Expected Result**:
- No `.env` files
- No `.env.local` files
- Only `.env.example` permitted (if present)

**Pass Criteria**:
- [ ] No `.env` files in repository
- [ ] `.gitignore` excludes `.env*`
- [ ] No API keys or secrets visible

---

### Test Suite 2: Local Clone Validation

**Prerequisites**: Git and GitHub CLI configured

#### Test 2.1: Repository Clone

**Objective**: Clone repository successfully

**Steps**:
```bash
# Navigate to workspace
cd ~/projects  # Or your preferred location

# Clone repository
git clone https://github.com/[username]/sebcdev-payload.git

# Navigate to repository
cd sebcdev-payload

# Verify clone successful
git status
```

**Expected Result**:
```
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

**Pass Criteria**:
- [ ] Clone completed without errors
- [ ] Directory created
- [ ] Git status shows clean working tree
- [ ] On default branch

---

#### Test 2.2: File Count and Structure

**Objective**: Verify all files cloned correctly

**Steps**:
```bash
# Count total files (excluding .git)
find . -type f -not -path "./.git/*" | wc -l

# List directory structure (first 2 levels)
tree -L 2 -a || find . -maxdepth 2 -type d

# Verify critical directories exist
test -d src && echo "✅ src/" || echo "❌ Missing src/"
test -d src/app && echo "✅ src/app/" || echo "❌ Missing src/app/"
test -d src/collections && echo "✅ src/collections/" || echo "❌ Missing"
test -d src/migrations && echo "✅ src/migrations/" || echo "❌ Missing"
test -d public && echo "✅ public/" || echo "❌ Missing"
```

**Expected Result**:
- 50-100+ files
- All critical directories present

**Pass Criteria**:
- [ ] File count matches expected range
- [ ] All critical directories present
- [ ] Structure matches template

---

#### Test 2.3: Configuration Files Integrity

**Objective**: Verify configuration files are intact

**Steps**:
```bash
# Check each critical file exists and has content
for file in wrangler.toml payload.config.ts next.config.mjs open-next.config.ts package.json tsconfig.json; do
  if [ -f "$file" ] || [ -f "src/$file" ]; then
    echo "✅ $file exists"
    wc -l "$file" 2>/dev/null || wc -l "src/$file"
  else
    echo "❌ $file missing"
  fi
done
```

**Expected Result**:
- All files exist
- Each file has reasonable line count (not empty)

**Pass Criteria**:
- [ ] `wrangler.toml` exists (~30-50 lines)
- [ ] `payload.config.ts` exists (~50-150 lines)
- [ ] `next.config.mjs` exists (~20-50 lines)
- [ ] `open-next.config.ts` exists (~20-50 lines)
- [ ] `package.json` exists (~50-100 lines)
- [ ] `tsconfig.json` exists (~20-40 lines)

---

#### Test 2.4: wrangler.toml Configuration

**Objective**: Verify Cloudflare configuration is valid

**Steps**:
```bash
# Display wrangler.toml
cat wrangler.toml

# Check for critical sections
grep "name =" wrangler.toml
grep "nodejs_compat" wrangler.toml
grep "d1_databases" wrangler.toml
grep "r2_buckets" wrangler.toml
```

**Expected Result**:
- File contains worker name
- Contains `compatibility_flags = ["nodejs_compat"]`
- Contains `[[d1_databases]]` section
- Contains `[[r2_buckets]]` section

**Pass Criteria**:
- [ ] Worker name defined
- [ ] nodejs_compat flag present (required for Payload)
- [ ] D1 database binding configured
- [ ] R2 bucket binding configured
- [ ] Binding names match payload.config.ts

---

#### Test 2.5: package.json Dependencies

**Objective**: Verify package.json contains expected dependencies

**Steps**:
```bash
# Check for critical dependencies
cat package.json | jq '.dependencies | keys'

# Verify specific packages
for pkg in payload next react @opennextjs/cloudflare wrangler; do
  if cat package.json | jq -e ".dependencies[\"$pkg\"] or .devDependencies[\"$pkg\"]" > /dev/null; then
    echo "✅ $pkg present"
  else
    echo "❌ $pkg missing"
  fi
done

# Check Payload adapters
grep -E "@payloadcms/db-|@payloadcms/storage-" package.json
```

**Expected Result**:
All critical packages present

**Pass Criteria**:
- [ ] `payload` dependency present
- [ ] `@payloadcms/db-sqlite` or `@payloadcms/db-d1-sqlite` present
- [ ] `@payloadcms/storage-r2` present
- [ ] `next` dependency present (v15+)
- [ ] `@opennextjs/cloudflare` present
- [ ] `wrangler` present
- [ ] `typescript` present

---

### Test Suite 3: Dependency Installation Validation

**Prerequisites**: Node.js 18+ and pnpm installed

#### Test 3.1: Dependency Installation

**Objective**: Install all dependencies successfully

**Steps**:
```bash
# Check Node.js version
node --version  # Should be v18.x or v20.x+

# Check pnpm version
pnpm --version  # Should be v8.x+

# Install dependencies
pnpm install

# Verify installation complete
echo "Exit code: $?"  # Should be 0
```

**Expected Result**:
```
Packages: +XXX
+++++++++++++++++++++++++++++++++
Progress: resolved XXX, reused XXX, downloaded X, added XXX, done

Done in Xs
```

**Pass Criteria**:
- [ ] Installation completes without errors
- [ ] Exit code is 0
- [ ] No critical peer dependency errors
- [ ] All packages resolved

---

#### Test 3.2: Lock File Verification

**Objective**: Verify lock file created correctly

**Steps**:
```bash
# Verify lock file exists
test -f pnpm-lock.yaml && echo "✅ Lock file exists" || echo "❌ Missing"

# Verify node_modules created
test -d node_modules && echo "✅ node_modules exists" || echo "❌ Missing"

# Count installed packages
ls node_modules | wc -l

# Check git status
git status | grep pnpm-lock.yaml
```

**Expected Result**:
- Lock file exists
- node_modules directory exists with 500+ packages
- Lock file shows as untracked or staged in git

**Pass Criteria**:
- [ ] `pnpm-lock.yaml` exists
- [ ] `node_modules/` exists
- [ ] Lock file tracked by git
- [ ] node_modules NOT tracked (in .gitignore)

---

#### Test 3.3: Critical Package Verification

**Objective**: Verify all critical packages installed

**Steps**:
```bash
# List all dependencies
pnpm list --depth=0

# Check specific critical packages
pnpm list payload
pnpm list next
pnpm list @payloadcms/db-sqlite || pnpm list @payloadcms/db-d1-sqlite
pnpm list @payloadcms/storage-r2
pnpm list @opennextjs/cloudflare
pnpm list wrangler
pnpm list typescript
```

**Expected Result**:
Each package shows version installed

**Pass Criteria**:
- [ ] `payload@3.x+` installed
- [ ] `next@15.x+` installed
- [ ] DB adapter installed
- [ ] Storage adapter installed
- [ ] OpenNext adapter installed
- [ ] Wrangler installed
- [ ] TypeScript installed

---

#### Test 3.4: Security Audit

**Objective**: Check for security vulnerabilities

**Steps**:
```bash
# Run security audit
pnpm audit

# Get summary
pnpm audit --json | jq '.metadata'
```

**Expected Result**:
```
X vulnerabilities found
  Low: X
  Moderate: X
  High: 0
  Critical: 0
```

**Pass Criteria**:
- [ ] No critical vulnerabilities
- [ ] No high vulnerabilities (or acceptable/documented)
- [ ] Low/moderate vulnerabilities documented
- [ ] Plan to fix vulnerabilities in Story 1.3 (if any)

---

### Test Suite 4: TypeScript & Build Validation

**Prerequisites**: Dependencies installed

#### Test 4.1: TypeScript Compilation

**Objective**: Verify TypeScript setup is correct

**Steps**:
```bash
# Run TypeScript compiler (no emit, just check)
pnpm tsc --noEmit

# Note exit code and output
```

**Expected Result** (one of):
1. **Ideal**: No errors
2. **Acceptable**: Only errors about missing Cloudflare bindings (fixed in Phase 2)
3. **Unacceptable**: Syntax errors, configuration errors

**Pass Criteria**:
- [ ] TypeScript runs without configuration errors
- [ ] No syntax errors in template files
- [ ] Errors only related to missing runtime (Cloudflare bindings) are acceptable
- [ ] Can proceed to Phase 2

**Example acceptable error**:
```
src/app/api/[...slug]/route.ts:10:20 - error TS2304: Cannot find name 'DB'.
```
(This will be resolved when Cloudflare bindings are available in Phase 2)

---

#### Test 4.2: Payload Type Generation (Optional)

**Objective**: Verify type generation command works

**Steps**:
```bash
# Attempt to generate Payload types
pnpm generate:types:payload || echo "⚠️ Expected to fail without database"

# Check if command is defined
pnpm run generate:types:payload --help 2>/dev/null || echo "Script exists"
```

**Expected Result**:
- Command exists (may fail without database connection)
- Failure is expected until Phase 2

**Pass Criteria**:
- [ ] Script defined in package.json
- [ ] Command is callable (even if it fails)
- [ ] No syntax errors in script

---

#### Test 4.3: Build Verification (Optional)

**Objective**: Verify build process is configured

**Steps**:
```bash
# Attempt to build
pnpm build || echo "⚠️ Build may fail until Cloudflare bindings exist"

# This is informational - build doesn't need to succeed in Phase 1
```

**Expected Result**:
- Build process starts
- May fail due to missing Cloudflare bindings (expected)

**Pass Criteria**:
- [ ] Build command exists
- [ ] Build process initiates
- [ ] Errors are related to missing infrastructure (not configuration)

---

## 📊 Test Summary & Coverage

### Test Coverage by Category

| Category | Tests | Manual/Auto | Duration |
|----------|-------|-------------|----------|
| Repository Creation | 4 tests | Manual | 5-10 min |
| Local Clone | 5 tests | Manual + CLI | 10-15 min |
| Dependencies | 4 tests | CLI | 15-20 min |
| TypeScript/Build | 3 tests | CLI | 5-10 min |
| **TOTAL** | **16 tests** | **Mixed** | **35-55 min** |

### Coverage Goals

- **Repository Setup**: 100% (all creation steps verified)
- **File Integrity**: 100% (all critical files checked)
- **Dependencies**: 100% (all packages verified installed)
- **TypeScript**: Validated (compilation checked, runtime errors expected)

---

## ✅ Testing Checklist

Complete this checklist to validate Phase 1:

### Repository Verification
- [ ] Test 1.1: Repository exists ✅
- [ ] Test 1.2: Configuration correct ✅
- [ ] Test 1.3: Template files present ✅
- [ ] Test 1.4: No security issues ✅

### Clone Verification
- [ ] Test 2.1: Clone successful ✅
- [ ] Test 2.2: File count matches ✅
- [ ] Test 2.3: Configuration files intact ✅
- [ ] Test 2.4: wrangler.toml valid ✅
- [ ] Test 2.5: package.json valid ✅

### Dependency Verification
- [ ] Test 3.1: Install successful ✅
- [ ] Test 3.2: Lock file created ✅
- [ ] Test 3.3: Packages verified ✅
- [ ] Test 3.4: Security audit passed ✅

### TypeScript/Build Verification
- [ ] Test 4.1: TypeScript compiles ✅
- [ ] Test 4.2: Type generation script exists ✅
- [ ] Test 4.3: Build process configured ✅

---

## 🐛 Troubleshooting Test Failures

### Test 1.X Failures (Repository)

**Symptom**: Repository not found or inaccessible

**Debug**:
```bash
gh auth status
gh repo list --limit 5
```

**Fix**: Verify GitHub authentication and repository URL

---

### Test 2.X Failures (Clone)

**Symptom**: Clone fails or files missing

**Debug**:
```bash
git clone --verbose https://github.com/[username]/sebcdev-payload.git
ls -la sebcdev-payload
```

**Fix**: Check network connection, repository access, disk space

---

### Test 3.X Failures (Dependencies)

**Symptom**: Installation fails or packages missing

**Debug**:
```bash
node --version  # Check Node.js version
pnpm --version  # Check pnpm version
pnpm store prune  # Clear cache
pnpm install --force  # Force reinstall
```

**Fix**: Update Node.js/pnpm, clear cache, check network

---

### Test 4.X Failures (TypeScript)

**Symptom**: TypeScript shows unexpected errors

**Debug**:
```bash
pnpm tsc --noEmit --listFiles  # See what files are being checked
cat tsconfig.json  # Verify configuration
```

**Fix**: Verify tsconfig.json, check for template corruption

---

## 🤖 Automated Test Script (Optional)

Create a test script to automate validation:

```bash
#!/bin/bash
# phase1-validation.sh

echo "🧪 Phase 1 Validation Script"
echo "=============================="

# Test 1: Repository exists
echo "Test 1: Repository exists"
gh repo view ${GITHUB_USER}/sebcdev-payload > /dev/null 2>&1 && echo "✅ Pass" || echo "❌ Fail"

# Test 2: Local clone exists
echo "Test 2: Local repository"
test -d sebcdev-payload && echo "✅ Pass" || echo "❌ Fail"

# Test 3: Critical files exist
echo "Test 3: Critical files"
test -f sebcdev-payload/wrangler.toml && \
test -f sebcdev-payload/src/payload.config.ts && \
test -f sebcdev-payload/package.json && \
echo "✅ Pass" || echo "❌ Fail"

# Test 4: Dependencies installed
echo "Test 4: Dependencies"
test -d sebcdev-payload/node_modules && \
test -f sebcdev-payload/pnpm-lock.yaml && \
echo "✅ Pass" || echo "❌ Fail"

# Test 5: TypeScript
echo "Test 5: TypeScript"
cd sebcdev-payload && pnpm tsc --noEmit && echo "✅ Pass" || echo "⚠️  Check errors"

echo "=============================="
echo "✅ Phase 1 validation complete"
```

**Usage**:
```bash
chmod +x phase1-validation.sh
./phase1-validation.sh
```

---

## ❓ FAQ

**Q: Do I need to run all tests?**
A: Yes, all tests are critical for ensuring Phase 2 can proceed.

**Q: What if TypeScript shows errors?**
A: Errors about Cloudflare bindings are expected. Syntax or configuration errors are not.

**Q: Should tests pass before Phase 2?**
A: Yes. All repository, clone, and dependency tests must pass.

**Q: Can I automate these tests?**
A: Yes, use the provided script or create your own CI pipeline.

**Q: How often should I run tests?**
A: Once after completing all 3 commits. Re-run if making any changes.

---

## 📝 Test Report Template

Document test results:

```markdown
## Phase 1 Test Report

**Tested by**: [Name]
**Date**: [Date]
**Environment**:
- OS: [macOS/Linux/Windows]
- Node.js: [version]
- pnpm: [version]

### Test Results

| Test Suite | Tests | Passed | Failed | Notes |
|------------|-------|--------|--------|-------|
| Repository | 4 | 4 | 0 | All passed |
| Clone | 5 | 5 | 0 | All passed |
| Dependencies | 4 | 4 | 0 | All passed |
| TypeScript | 3 | 3 | 0 | Expected errors only |
| **TOTAL** | **16** | **16** | **0** | **✅ All tests passed** |

### Issues Found

- [List any issues, even if resolved]

### Recommendations

- [Any suggestions for improvement]

**Status**: ✅ Ready for Phase 2
```

---

**Testing complete! Phase 1 validated! 🎉**
