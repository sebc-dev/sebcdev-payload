# Phase 5 - Checklist per Commit

This document provides a detailed checklist for each atomic commit of Phase 5.

---

## Commit 1: Add Next.js Build Step

**Files**: `.github/workflows/quality-gate.yml`
**Estimated Duration**: 15-20 minutes

### Implementation Tasks

- [ ] Open `.github/workflows/quality-gate.yml`
- [ ] Locate the placeholder step "Placeholder - Quality checks coming soon"
- [ ] Replace placeholder with actual build step
- [ ] Add Next.js Build step with correct command
- [ ] Configure PAYLOAD_SECRET environment variable
- [ ] Ensure step is positioned after Type Sync step

### Code to Add

Add this step in the workflow, replacing the placeholder:

```yaml
# ============================================
# LAYER 3: Build Validation
# ============================================

- name: Next.js Build (No-DB Mode)
  run: pnpm exec next build --experimental-build-mode compile
  env:
    PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET || 'ci-build-dummy-secret-32-chars-minimum!!' }}
```

### Validation

```bash
# Local validation - test the build command
pnpm exec next build --experimental-build-mode compile

# Verify workflow syntax (if actionlint installed)
actionlint .github/workflows/quality-gate.yml

# After pushing, trigger the workflow
gh workflow run quality-gate.yml
```

**Expected Result**:

- Local build completes successfully
- Workflow syntax is valid
- CI workflow shows "Next.js Build (No-DB Mode)" step passing

### Review Checklist

#### Build Configuration

- [ ] Command is `pnpm exec next build --experimental-build-mode compile`
- [ ] Uses `exec` to run next directly (avoids npm script overhead)
- [ ] Flag `--experimental-build-mode compile` is present

#### Environment Variables

- [ ] `PAYLOAD_SECRET` uses secrets context: `${{ secrets.PAYLOAD_SECRET || 'fallback' }}`
- [ ] Fallback secret is at least 32 characters
- [ ] No DATABASE_URI needed (compile mode doesn't require it)

#### Workflow Structure

- [ ] Step is in LAYER 3 section (after LAYER 2)
- [ ] Proper comment header: `# LAYER 3: Build Validation`
- [ ] Placeholder step is removed or replaced

#### Code Quality

- [ ] YAML syntax is valid (proper indentation)
- [ ] Consistent with existing workflow style
- [ ] No hardcoded secrets

### Commit Message

```bash
git add .github/workflows/quality-gate.yml
git commit -m "$(cat <<'EOF'
ci(quality-gate): add Next.js build validation (no-DB mode)

- Add build step with --experimental-build-mode compile flag
- Configure PAYLOAD_SECRET for Payload CMS initialization
- Replace placeholder step with actual Layer 3 validation
- Validates TypeScript compilation without D1 database

Part of Phase 5 - Commit 1/2

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Commit 2: Add Next.js Build Caching

**Files**: `.github/workflows/quality-gate.yml`
**Estimated Duration**: 15-20 minutes

### Implementation Tasks

- [ ] Add cache restore step before the build step
- [ ] Configure cache key with source file hashes
- [ ] Add restore-keys for partial cache hits
- [ ] Verify cache path is `.next/cache`

### Code to Add

Add this step BEFORE the "Next.js Build" step:

```yaml
- name: Cache Next.js Build
  uses: actions/cache@5a3ec84eff668545956fd18022155c47e93e2684 # v4.2.3
  with:
    path: .next/cache
    key: nextjs-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}-${{ hashFiles('**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx') }}
    restore-keys: |
      nextjs-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}-
      nextjs-${{ runner.os }}-
```

### SHA Pin Verification

Verify the actions/cache SHA is correct:

```bash
# Get the SHA for actions/cache@v4.2.3
# Visit: https://github.com/actions/cache/releases/tag/v4.2.3
# Or check: https://github.com/actions/cache/commit/5a3ec84eff668545956fd18022155c47e93e2684
```

### Validation

```bash
# Trigger workflow and check cache behavior
gh workflow run quality-gate.yml

# Wait for completion
gh run list --workflow=quality-gate.yml --limit=1

# Check the run details for cache hit/miss
gh run view <run-id> --log
```

**Expected Result**:

- First run shows "Cache not found"
- Second run shows "Cache hit" or "Cache restored"
- Build time reduced on cache hit

### Review Checklist

#### Cache Configuration

- [ ] Cache action is SHA-pinned: `actions/cache@5a3ec84eff668545956fd18022155c47e93e2684`
- [ ] Cache path is `.next/cache` (not entire .next folder)
- [ ] Cache key includes `runner.os` for OS-specific caching
- [ ] Cache key includes `hashFiles('pnpm-lock.yaml')` for dependency changes
- [ ] Cache key includes source file hash for code changes

#### Restore Keys

- [ ] restore-keys configured for partial matches
- [ ] Fallback chain: specific → general
- [ ] No trailing slashes or syntax errors

#### Step Positioning

- [ ] Cache restore step is BEFORE build step
- [ ] Cache is part of LAYER 3 section
- [ ] Comments explain the caching purpose

#### Security

- [ ] SHA pin matches v4.2.3 release
- [ ] No sensitive data in cache keys
- [ ] Cache path doesn't include secrets or env files

### Commit Message

```bash
git add .github/workflows/quality-gate.yml
git commit -m "$(cat <<'EOF'
ci(quality-gate): add Next.js build caching for faster CI

- Cache .next/cache directory between workflow runs
- Configure cache key based on OS, lockfile, and source hashes
- Add restore-keys for partial cache hits from previous runs
- Reduces build time by ~50% on cache hits

Part of Phase 5 - Commit 2/2

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Final Phase Validation

After all commits:

### Complete Phase Checklist

- [ ] Both commits completed and pushed
- [ ] Local build passes: `pnpm build`
- [ ] TypeScript check passes: `pnpm exec tsc --noEmit`
- [ ] Linter passes: `pnpm lint`
- [ ] CI workflow runs successfully
- [ ] Build step shows in workflow run
- [ ] Cache behavior verified (hit on second run)
- [ ] VALIDATION_CHECKLIST.md completed

### Final Validation Commands

```bash
# Run full local build
pnpm build

# Run linter
pnpm lint

# Trigger CI workflow
gh workflow run quality-gate.yml

# Check workflow status
gh run list --workflow=quality-gate.yml --limit=1

# View workflow run details
gh run view <run-id>
```

**Phase 5 is complete when all checkboxes are checked!**
