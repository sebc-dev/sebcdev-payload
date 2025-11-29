# Phase 1 - Checklist per Commit

This document provides a detailed checklist for each atomic commit of Phase 1.

---

## 📋 Commit 1: Create GitHub Repository from Template

**Platform**: GitHub Web Interface
**Estimated Duration**: 20-30 minutes

### Implementation Tasks

- [ ] Navigate to Payload CMS templates: https://github.com/payloadcms/payload/tree/main/templates
- [ ] Locate the `with-cloudflare-d1` template
- [ ] Click "Use this template" button
- [ ] Select "Create a new repository"
- [ ] Configure repository settings:
  - [ ] Owner: [Your GitHub username/organization]
  - [ ] Repository name: `sebcdev-payload`
  - [ ] Description: "Payload CMS application on Cloudflare Workers with D1 and R2"
  - [ ] Visibility: ☐ Public / ☐ Private (choose one)
  - [ ] ✅ Include all branches: **Unchecked** (use main/default only)
- [ ] Click "Create repository from template"
- [ ] Wait for repository creation to complete
- [ ] Verify repository appears in your GitHub account

### Validation

```bash
# Verify repository exists via GitHub CLI
gh repo view [your-username]/sebcdev-payload

# Alternative: Check via browser
# Navigate to: https://github.com/[your-username]/sebcdev-payload
```

**Expected Result**:

- Repository visible on GitHub
- Shows "generated from payloadcms/payload" badge
- Contains all template files
- Default branch is `main` or `master`

### Review Checklist

#### Repository Configuration

- [ ] Repository name is exactly `sebcdev-payload` (or documented alternative)
- [ ] Description accurately describes the project
- [ ] Visibility setting is appropriate (Public recommended for open source)
- [ ] Repository is owned by correct account/organization
- [ ] Default branch is set (usually `main`)

#### Template Files Present

Verify these files exist via GitHub UI:

- [ ] `README.md` (template's original README)
- [ ] `package.json` (Payload CMS dependencies)
- [ ] `wrangler.toml` (Cloudflare configuration)
- [ ] `payload.config.ts` (Payload CMS configuration)
- [ ] `next.config.mjs` (Next.js configuration)
- [ ] `open-next.config.ts` (OpenNext adapter config)
- [ ] `tsconfig.json` (TypeScript configuration)
- [ ] `.gitignore` (proper ignores for Node.js, Next.js)
- [ ] `src/` directory visible

#### Security

- [ ] No `.env` files visible in repository
- [ ] No sensitive data in any file
- [ ] `.gitignore` properly configured

### Documentation

Document the following information for the team:

```markdown
## Commit 1 Results

**Repository URL**: https://github.com/[username]/sebcdev-payload
**Created**: [Date and time]
**Visibility**: [Public/Private]
**Template Version**: [Check template last update date]

**Notes**:

- [Any observations or issues encountered]
```

---

## 📋 Commit 2: Clone Repository and Verify Structure

**Location**: Local development machine
**Estimated Duration**: 20-30 minutes

### Prerequisites

- [ ] Git installed and configured
- [ ] GitHub authentication set up (SSH key or HTTPS token)
- [ ] GitHub CLI (`gh`) installed (optional but recommended)

### Implementation Tasks

- [ ] Open terminal in your development directory
- [ ] Clone repository:
  ```bash
  git clone https://github.com/[your-username]/sebcdev-payload.git
  ```
- [ ] Navigate to repository:
  ```bash
  cd sebcdev-payload
  ```
- [ ] Verify git status:
  ```bash
  git status
  ```
- [ ] List all files:
  ```bash
  ls -la
  ```
- [ ] Review directory structure:
  ```bash
  tree -L 2 -a  # If tree is installed
  # Or use: find . -maxdepth 2 -type d
  ```

### Key Files Verification

Check each of these critical files exists and review content:

```bash
# Core configuration files
test -f wrangler.toml && echo "✅ wrangler.toml exists" || echo "❌ Missing"
test -f payload.config.ts && echo "✅ payload.config.ts exists" || echo "❌ Missing"
test -f next.config.mjs && echo "✅ next.config.mjs exists" || echo "❌ Missing"
test -f open-next.config.ts && echo "✅ open-next.config.ts exists" || echo "❌ Missing"
test -f package.json && echo "✅ package.json exists" || echo "❌ Missing"
test -f tsconfig.json && echo "✅ tsconfig.json exists" || echo "❌ Missing"

# Source directories
test -d src && echo "✅ src/ directory exists" || echo "❌ Missing"
test -d src/app && echo "✅ src/app/ directory exists" || echo "❌ Missing"
test -d src/collections && echo "✅ src/collections/ directory exists" || echo "❌ Missing"
test -d src/migrations && echo "✅ src/migrations/ directory exists" || echo "❌ Missing"

# Documentation
test -f README.md && echo "✅ README.md exists" || echo "❌ Missing"

# Environment files (should NOT exist in repo)
! test -f .env && echo "✅ No .env file (correct)" || echo "⚠️  .env file present (should not be committed)"
```

### Review wrangler.toml

```bash
# Display wrangler.toml content
cat wrangler.toml
```

**Expected content** (verify these sections exist):

- [ ] `name =` (worker name, usually project name)
- [ ] `compatibility_flags = ["nodejs_compat"]` (required for Payload)
- [ ] `[[d1_databases]]` section (D1 binding configuration)
- [ ] `[[r2_buckets]]` section (R2 binding configuration)
- [ ] Database binding name (usually `DB` or `DATABASE`)
- [ ] R2 binding name (usually `MEDIA_BUCKET` or `R2`)

### Review payload.config.ts

```bash
# Display payload config
cat src/payload.config.ts
```

**Expected content**:

- [ ] Database adapter imported: `@payloadcms/db-sqlite` or `@payloadcms/db-d1-sqlite`
- [ ] Storage adapter imported: `@payloadcms/storage-r2`
- [ ] Collections defined (at least `Users`, `Media`)
- [ ] Sharp disabled or using compatible implementation
- [ ] Proper TypeScript types

### Review package.json

```bash
# Display package.json
cat package.json
```

**Expected dependencies** (verify presence):

- [ ] `payload` (latest version, likely 3.x+)
- [ ] `@payloadcms/db-sqlite` or `@payloadcms/db-d1-sqlite`
- [ ] `@payloadcms/storage-r2`
- [ ] `next` (version 15+)
- [ ] `react` and `react-dom` (version 19+)
- [ ] `@opennextjs/cloudflare`
- [ ] `wrangler` (Cloudflare CLI)

**Expected scripts**:

- [ ] `dev` (development server)
- [ ] `build` (production build)
- [ ] `deploy` (Cloudflare deployment)
- [ ] `generate:types` or similar (Payload type generation)

### Validation

```bash
# Count total files
find . -type f | wc -l

# Check git configuration
git config --list --local

# Verify remote
git remote -v

# Check branch
git branch -a

# Verify initial commit from template
git log --oneline --all
```

**Expected Result**:

- 50-100+ files present
- Git configured correctly
- Remote points to GitHub repository
- On `main` or `master` branch
- Initial commit from template visible

### Review Checklist

#### Directory Structure

- [ ] `src/app/` exists (Next.js App Router structure)
- [ ] `src/collections/` exists (Payload collections)
- [ ] `src/migrations/` exists (database migrations)
- [ ] `public/` exists (static assets)
- [ ] Configuration files at root level

#### Configuration Files

- [ ] `wrangler.toml` properly configured with nodejs_compat
- [ ] `payload.config.ts` has database and storage adapters
- [ ] `next.config.mjs` configured for OpenNext
- [ ] `open-next.config.ts` configured for Cloudflare
- [ ] `tsconfig.json` has proper paths and settings

#### Git Configuration

- [ ] Remote URL is correct
- [ ] On default branch
- [ ] No uncommitted changes (clean working directory)
- [ ] Git history shows template origin

#### Security Check

- [ ] `.gitignore` exists and includes:
  - [ ] `node_modules/`
  - [ ] `.env*` (but not `.env.example` if present)
  - [ ] `.next/`
  - [ ] `.open-next/`
  - [ ] `.wrangler/`
  - [ ] `dist/` or `build/`
- [ ] No `.env` files present in repository
- [ ] No secrets or API keys in any files

### Documentation

```markdown
## Commit 2 Results

**Clone Location**: [Full path to local repository]
**Total Files**: [Number from find command]
**Git Branch**: [Branch name]
**Template Version**: [Git log initial commit date]

**Key Files Verified**:

- ✅ wrangler.toml
- ✅ payload.config.ts
- ✅ next.config.mjs
- ✅ package.json
- [etc.]

**Issues Found**: [Any missing or unexpected files]
```

---

## 📋 Commit 3: Install Dependencies and Validate Setup

**Location**: Local repository
**Estimated Duration**: 30-60 minutes (depends on network speed)

### Prerequisites

- [ ] Node.js installed (version 18.x or 20.x+)
- [ ] pnpm installed (recommended) or npm/yarn
- [ ] Sufficient disk space (~500+ MB for node_modules)

### Verify Node.js Version

```bash
# Check Node.js version
node --version  # Should be v18.x or v20.x+

# Check pnpm version
pnpm --version  # Should be 8.x+

# If pnpm not installed:
# npm install -g pnpm
```

### Implementation Tasks

- [ ] Clean install dependencies:
  ```bash
  pnpm install
  ```
- [ ] Wait for installation to complete (may take 5-15 minutes)
- [ ] Verify lock file created:
  ```bash
  test -f pnpm-lock.yaml && echo "✅ Lock file created"
  ```
- [ ] Verify node_modules created:
  ```bash
  test -d node_modules && echo "✅ node_modules created"
  ```
- [ ] List installed packages:
  ```bash
  pnpm list --depth=0
  ```

### Validation

```bash
# Verify all dependencies installed
pnpm list

# Check for dependency issues
pnpm list --depth=0 | grep "UNMET"  # Should have no output

# Check for vulnerabilities (informational only)
pnpm audit

# Verify critical packages installed
pnpm list payload
pnpm list next
pnpm list @payloadcms/db-sqlite
pnpm list @payloadcms/storage-r2
pnpm list @opennextjs/cloudflare
pnpm list wrangler
```

**Expected Result**: All packages installed successfully, no UNMET peer dependencies errors

### TypeScript Validation

```bash
# Run TypeScript compiler check (no emit, just type checking)
pnpm tsc --noEmit

# Note: Some errors about Cloudflare bindings are expected until Phase 2
# The key is that the TypeScript setup itself works
```

**Expected Result**:

- TypeScript compiles successfully, OR
- Errors only related to missing Cloudflare bindings (which will be fixed in Phase 2)
- No syntax errors or configuration errors

### Generate Cloudflare Types (Optional)

```bash
# Generate Cloudflare environment types
# This may fail without wrangler configuration, but validates the command works
pnpm wrangler types || echo "⚠️ Expected - will work after Phase 2 Cloudflare setup"
```

### Generate Payload Types (Optional)

```bash
# Generate Payload types
# This may fail without database connection, but validates the command works
pnpm generate:types:payload || echo "⚠️ Expected - will work after Phase 2 database setup"
```

### Verify Build System (Optional)

```bash
# Attempt to verify build (may fail without Cloudflare bindings)
pnpm build || echo "⚠️ Build may fail until Cloudflare infrastructure exists (Phase 2)"

# This is informational - build doesn't need to succeed in Phase 1
```

### Review Checklist

#### Dependency Installation

- [ ] `pnpm install` completed without errors
- [ ] `node_modules/` directory created
- [ ] `pnpm-lock.yaml` created (critical - must be committed)
- [ ] No critical dependency conflicts
- [ ] No UNMET peer dependencies errors
- [ ] No high-severity security vulnerabilities (check `pnpm audit`)

#### Critical Packages Installed

Verify these key packages are in node_modules:

- [ ] `payload` (version 3.x+)
- [ ] `@payloadcms/db-sqlite` or `@payloadcms/db-d1-sqlite`
- [ ] `@payloadcms/storage-r2`
- [ ] `next` (version 15+)
- [ ] `react` (version 19+)
- [ ] `@opennextjs/cloudflare`
- [ ] `wrangler`
- [ ] `typescript`

#### TypeScript Configuration

- [ ] `pnpm tsc --noEmit` runs (errors about bindings are OK)
- [ ] No TypeScript configuration errors
- [ ] No syntax errors in template files
- [ ] Type checking validates project structure

#### File System

- [ ] `node_modules/` is NOT committed to git
- [ ] `pnpm-lock.yaml` IS ready to commit (tracked file)
- [ ] `.gitignore` properly excludes `node_modules/`
- [ ] Disk space sufficient (check with `df -h`)

#### Scripts Validation

Verify these scripts are callable (don't need to succeed, just exist):

```bash
pnpm run dev --help || echo "dev script exists"
pnpm run build --help || echo "build script exists"
pnpm run deploy --help || echo "deploy script exists"
```

### Documentation

```markdown
## Commit 3 Results

**Node.js Version**: [Output of node --version]
**pnpm Version**: [Output of pnpm --version]
**Installation Time**: [How long it took]
**Total Packages**: [Number from pnpm list]

**Key Packages Installed**:

- payload: [version]
- next: [version]
- @payloadcms/db-sqlite: [version]
- @opennextjs/storage-r2: [version]
- wrangler: [version]

**TypeScript Check**: [✅ Passed / ⚠️ Warnings / ❌ Errors]

**Issues Encountered**:

- [List any warnings or errors]
- [Note if they're expected (e.g., Cloudflare bindings missing)]
```

---

## ✅ Final Phase 1 Validation

After all 3 commits:

### Complete Phase Checklist

- [ ] ✅ Commit 1 completed: Repository created on GitHub
- [ ] ✅ Commit 2 completed: Repository cloned and verified
- [ ] ✅ Commit 3 completed: Dependencies installed and validated
- [ ] All key files present and reviewed
- [ ] Dependencies installed successfully
- [ ] TypeScript configuration working
- [ ] No sensitive data committed
- [ ] Documentation updated with repository details

### Final Validation Commands

Run all these to confirm Phase 1 success:

```bash
# Repository verification
gh repo view [username]/sebcdev-payload
git remote -v

# File structure verification
ls -la
test -f wrangler.toml && test -f payload.config.ts && test -f package.json && echo "✅ Key files present"

# Dependencies verification
test -d node_modules && test -f pnpm-lock.yaml && echo "✅ Dependencies installed"
pnpm list --depth=0

# TypeScript verification
pnpm tsc --noEmit || echo "⚠️ Check if errors are expected (Cloudflare bindings)"

# Git status
git status  # Should be clean, or only pnpm-lock.yaml to commit
```

### Git Commit (Commit 3)

If this is your first commit to the repository (after template creation):

```bash
# Stage lock file
git add pnpm-lock.yaml

# Commit
git commit -m "chore(setup): install dependencies and validate setup

- Install all npm dependencies via pnpm
- Generate pnpm-lock.yaml for reproducible installs
- Verify TypeScript configuration
- Validate project structure from template

Part of Phase 1 - Commit 3/3"

# Push to GitHub
git push origin main
```

---

## 📊 Phase 1 Summary

**When all checkboxes above are checked**, Phase 1 is complete! ✅

### Success Criteria Met

- [✓] GitHub repository created from official template
- [✓] Repository cloned locally
- [✓] All template files verified present
- [✓] Dependencies installed successfully
- [✓] TypeScript configuration validated
- [✓] Lock file committed for reproducibility
- [✓] No sensitive data exposed
- [✓] Ready for Phase 2 (Cloudflare infrastructure deployment)

### Next Steps

1. Complete `validation/VALIDATION_CHECKLIST.md`
2. Update Phase 1 INDEX.md status to ✅ COMPLETED
3. Document Phase 1 completion in EPIC_TRACKING.md
4. Proceed to **Phase 2: Cloudflare Infrastructure Deployment**

**Excellent work! The foundation is set. 🚀**
