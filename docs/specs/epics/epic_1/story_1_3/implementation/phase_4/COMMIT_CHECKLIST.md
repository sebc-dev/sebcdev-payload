# Phase 4 - Commit Checklist: Dead Code & Type Sync

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Phase**: 4 of 8
**Total Commits**: 4

---

## Checklist Overview

Use this checklist to track progress through each atomic commit. Each commit should be independently valid and the codebase should remain functional after each commit.

---

## Commit 1: Knip Configuration

### Pre-Commit Checklist

- [ ] Read IMPLEMENTATION_PLAN.md Commit 1 section
- [ ] Verify Phase 3 is complete (ESLint/Prettier configured)
- [ ] Understand Knip entry points concept

### Implementation Checklist

- [ ] Install Knip:

  ```bash
  pnpm add -D knip
  ```

- [ ] Create `knip.json` at repository root:

  ```json
  {
    "$schema": "https://unpkg.com/knip@5/schema.json",
    "entry": [
      "next.config.ts",
      "payload.config.ts",
      "src/payload.config.ts",
      "src/instrumentation.ts",
      "src/middleware.ts"
    ],
    "project": ["src/**/*.{ts,tsx}"],
    "ignore": ["src/payload-types.ts", "public/**"],
    "ignoreDependencies": ["@cloudflare/workers-types"],
    "exclude": ["drizzle/migrations/**", "drizzle/meta/**"],
    "next": {
      "entry": []
    },
    "drizzle": {
      "config": ["drizzle.config.ts"]
    }
  }
  ```

- [ ] Add Knip script to `package.json`:

  ```json
  {
    "scripts": {
      "knip": "knip",
      "knip:production": "knip --production"
    }
  }
  ```

- [ ] Verify configuration structure:
  - [ ] `knip.json` is valid JSON
  - [ ] Entry points cover Payload and Next.js conventions
  - [ ] Generated files are in ignore list
  - [ ] Schema reference is correct

### Validation Checklist

- [ ] Run `pnpm exec knip --production` (should pass or show acceptable warnings)
- [ ] Run `pnpm exec knip` (full analysis - may show more items)
- [ ] No false positives on legitimate files
- [ ] Review any reported issues and either fix or add to ignore with justification

### Commit Checklist

- [ ] Stage files: `git add knip.json package.json pnpm-lock.yaml`
- [ ] Verify staged changes: `git diff --cached`
- [ ] Commit with message:

  ```
  🔍 Add Knip configuration for dead code detection

  - Create knip.json for Next.js 15 + Payload CMS
  - Configure entry points for convention-based files
  - Exclude generated files (payload-types.ts, migrations)
  - Add knip and knip:production scripts
  ```

### Post-Commit Verification

- [ ] `git log -1` shows correct commit message
- [ ] `git show --stat` shows correct files
- [ ] `pnpm exec knip --production` passes
- [ ] No uncommitted changes: `git status` is clean

---

## Commit 2: Knip Workflow Integration

### Pre-Commit Checklist

- [ ] Commit 1 is complete and verified
- [ ] Read IMPLEMENTATION_PLAN.md Commit 2 section
- [ ] Review current quality-gate.yml structure

### Implementation Checklist

- [ ] Open `.github/workflows/quality-gate.yml` for editing

- [ ] Add Knip step after ESLint/Prettier (in Layer 2):

  ```yaml
  # ============================================
  # LAYER 2: Code Quality (continued)
  # ============================================

  - name: Knip - Dead Code Detection
    run: pnpm exec knip --production
  ```

- [ ] Update placeholder message:

  ```yaml
  - name: Placeholder - Quality checks coming soon
    run: |
      echo "::notice::Phase 1-4 complete - Foundation + Socket.dev + ESLint/Prettier + Knip"
      echo "::notice::Future phases will add: Type Sync, Build, dependency-cruiser, etc."
  ```

- [ ] Verify step placement:
  - [ ] After Prettier Check step
  - [ ] Before placeholder/future steps
  - [ ] Proper YAML indentation
  - [ ] No `continue-on-error: true` (should fail if dead code found)

### Validation Checklist

- [ ] YAML syntax valid:
  ```bash
  python3 -c "import yaml; yaml.safe_load(open('.github/workflows/quality-gate.yml'))"
  ```
- [ ] Steps are in correct order
- [ ] No duplicate step names
- [ ] Run locally to confirm: `pnpm exec knip --production`

### Commit Checklist

- [ ] Stage file: `git add .github/workflows/quality-gate.yml`
- [ ] Verify staged changes: `git diff --cached`
- [ ] Commit with message:

  ```
  👷 Add Knip step to quality-gate workflow

  - Add Knip dead code detection step
  - Configure for production mode (ignores tests)
  - Position after ESLint/Prettier in Layer 2
  - Update placeholder message for Phase 4
  ```

### Post-Commit Verification

- [ ] `git log -1` shows correct commit message
- [ ] `git show` shows workflow changes
- [ ] YAML syntax valid
- [ ] No uncommitted changes

---

## Commit 3: Type Sync Validation

### Pre-Commit Checklist

- [ ] Commits 1-2 are complete and verified
- [ ] Read IMPLEMENTATION_PLAN.md Commit 3 section
- [ ] Understand Payload type generation

### Implementation Checklist

- [ ] Open `.github/workflows/quality-gate.yml` for editing

- [ ] Add Type Sync steps after Knip:

  ```yaml
  - name: Generate Payload Types
    env:
      PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET || 'ci-placeholder-secret-minimum-32chars!!' }}
    run: pnpm generate:types:payload

  - name: Verify Type Sync
    run: |
      if git diff --exit-code src/payload-types.ts; then
        echo "✅ Payload types are synchronized"
      else
        echo "❌ ERROR: Payload types are out of sync!"
        echo "Run 'pnpm generate:types:payload' and commit the changes"
        git diff src/payload-types.ts
        exit 1
      fi
  ```

- [ ] Update placeholder message:

  ```yaml
  - name: Placeholder - Quality checks coming soon
    run: |
      echo "::notice::Phase 1-4 complete - Foundation + Socket.dev + ESLint/Prettier + Knip + Type Sync"
      echo "::notice::Future phases will add: Build, dependency-cruiser, Lighthouse, Stryker"
  ```

- [ ] Verify implementation:
  - [ ] PAYLOAD_SECRET uses fallback for CI
  - [ ] Fallback secret is at least 32 characters
  - [ ] Error message is clear and actionable
  - [ ] `git diff` shows actual differences if sync fails

### Validation Checklist

- [ ] YAML syntax valid:
  ```bash
  python3 -c "import yaml; yaml.safe_load(open('.github/workflows/quality-gate.yml'))"
  ```
- [ ] Locally test type generation:
  ```bash
  pnpm generate:types:payload
  ```
- [ ] Locally test sync check:
  ```bash
  git diff --exit-code src/payload-types.ts && echo "✅ Synced" || echo "❌ Not synced"
  ```
- [ ] Ensure no secrets are exposed in logs

### Commit Checklist

- [ ] Stage file: `git add .github/workflows/quality-gate.yml`
- [ ] Verify staged changes: `git diff --cached`
- [ ] Commit with message:

  ```
  🔒 Add Payload type sync validation to CI

  - Add type generation step with PAYLOAD_SECRET
  - Add type drift detection with clear error messages
  - Use fallback secret for CI environments
  - Fail fast if types are out of sync
  ```

### Post-Commit Verification

- [ ] `git log -1` shows correct commit message
- [ ] `git show` shows workflow changes
- [ ] YAML syntax valid
- [ ] No uncommitted changes

---

## Commit 4: Documentation Update

### Pre-Commit Checklist

- [ ] Commits 1-3 are complete and verified
- [ ] Read IMPLEMENTATION_PLAN.md Commit 4 section
- [ ] Review existing CLAUDE.md structure

### Implementation Checklist

- [ ] Create `docs/guides/dead-code-detection.md`:

  ````markdown
  # Dead Code Detection & Type Sync Guide

  ## Overview

  This project uses **Knip** for dead code detection and **Payload type sync** validation
  to ensure code quality and type safety.

  ## Quick Commands

  ```bash
  # Run Knip (full analysis)
  pnpm exec knip

  # Run Knip (production mode - CI)
  pnpm exec knip --production

  # Generate Payload types
  pnpm generate:types:payload

  # Check if types are synced
  git diff --exit-code src/payload-types.ts
  ```

  ## Knip Configuration

  - **Config file**: `knip.json`
  - **Mode in CI**: `--production` (ignores tests and devDependencies)

  ### Entry Points

  Knip needs explicit entry points for convention-based frameworks:

  | Entry Point              | Framework   | Purpose             |
  | ------------------------ | ----------- | ------------------- |
  | `next.config.ts`         | Next.js     | Framework config    |
  | `payload.config.ts`      | Payload CMS | CMS entry point     |
  | `src/middleware.ts`      | Next.js     | Request middleware  |
  | `src/instrumentation.ts` | Next.js     | OpenTelemetry hooks |

  ### Ignored Files

  | Pattern                 | Reason                         |
  | ----------------------- | ------------------------------ |
  | `src/payload-types.ts`  | Auto-generated by Payload      |
  | `drizzle/migrations/**` | SQL migrations, never imported |
  | `public/**`             | Static assets                  |

  ## Payload Type Sync

  Payload CMS generates TypeScript types from your collection definitions.
  These types must stay synchronized with your config.

  ### When to Regenerate

  Regenerate types after:

  - Adding/removing collection fields
  - Changing field types
  - Modifying relationships
  - Updating hooks that affect types

  ### How to Regenerate

  ```bash
  pnpm generate:types:payload
  git add src/payload-types.ts
  git commit -m "🔧 Regenerate Payload types"
  ```

  ## Troubleshooting

  ### Knip Reports False Positives

  If Knip incorrectly reports files as unused:

  1. Check if it's a framework convention (should be auto-detected)
  2. Add to `entry` in `knip.json` if legitimately used
  3. Add to `ignore` with a comment explaining why

  Example:

  ```json
  {
    "entry": ["src/my-custom-entry.ts"],
    "ignore": ["src/special-case.ts"]
  }
  ```

  ### Knip is Slow

  Run in production mode (faster):

  ```bash
  pnpm exec knip --production
  ```

  ### Type Generation Fails

  Ensure `PAYLOAD_SECRET` is set:

  ```bash
  export PAYLOAD_SECRET="your-32-char-secret-here!!!!!!!"
  pnpm generate:types:payload
  ```

  ### Types Out of Sync in CI

  If CI reports "types are out of sync":

  ```bash
  pnpm generate:types:payload
  git add src/payload-types.ts
  git commit -m "🔧 Regenerate Payload types"
  git push
  ```
  ````

- [ ] Verify documentation:
  - [ ] Commands are accurate
  - [ ] Entry points match `knip.json`
  - [ ] Troubleshooting covers common issues

### Validation Checklist

- [ ] File exists at `docs/guides/dead-code-detection.md`
- [ ] Markdown renders correctly
- [ ] All commands are copy-pasteable and work
- [ ] No broken links

### Commit Checklist

- [ ] Stage files: `git add docs/guides/dead-code-detection.md`
- [ ] Verify staged changes: `git diff --cached`
- [ ] Commit with message:

  ```
  📝 Add dead code detection and type sync documentation

  - Create docs/guides/dead-code-detection.md
  - Document Knip configuration and entry points
  - Document Payload type sync workflow
  - Include troubleshooting section
  ```

### Post-Commit Verification

- [ ] `git log -1` shows correct commit message
- [ ] All 4 commits are in history: `git log --oneline -4`
- [ ] No uncommitted changes

---

## Phase Completion Checklist

### Files Created/Modified

- [ ] `knip.json` - Created with Next.js + Payload configuration
- [ ] `.github/workflows/quality-gate.yml` - Modified with Knip + Type Sync steps
- [ ] `docs/guides/dead-code-detection.md` - Created
- [ ] `package.json` - Modified with knip scripts

### Functional Verification

- [ ] `pnpm exec knip --production` passes with no errors
- [ ] `pnpm generate:types:payload` completes successfully
- [ ] `git diff --exit-code src/payload-types.ts` shows no changes
- [ ] Push to GitHub: `git push origin story_1_3`
- [ ] Navigate to GitHub Actions tab
- [ ] Click "Run workflow" on Quality Gate
- [ ] Verify Knip step completes (green)
- [ ] Verify Type Sync steps complete (green)

### Configuration Verification

- [ ] Entry points cover all framework conventions
- [ ] Generated files are properly ignored
- [ ] PAYLOAD_SECRET fallback works in CI
- [ ] No false positives blocking the pipeline

### Documentation Verification

- [ ] `docs/guides/dead-code-detection.md` exists
- [ ] Documentation is accurate for current config
- [ ] Entry points documented
- [ ] Type sync workflow documented

### Phase Sign-Off

- [ ] All 4 commits completed
- [ ] Knip working locally and in CI
- [ ] Type sync validation working in CI
- [ ] Documentation complete

**Phase 4 Status**: [ ] COMPLETE

---

## Quick Reference: Commit Messages (Gitmoji)

```bash
# Commit 1
git commit -m "🔍 Add Knip configuration for dead code detection"

# Commit 2
git commit -m "👷 Add Knip step to quality-gate workflow"

# Commit 3
git commit -m "🔒 Add Payload type sync validation to CI"

# Commit 4
git commit -m "📝 Add dead code detection and type sync documentation"
```

---

## Common Issues & Solutions

### Issue: Knip Reports Unused Dependencies

**Symptom**: Knip says `@cloudflare/workers-types` is unused

**Solution**: Add to `ignoreDependencies` in `knip.json`:

```json
{
  "ignoreDependencies": ["@cloudflare/workers-types"]
}
```

**Reason**: Type-only packages are used by TypeScript compiler, not runtime

---

### Issue: Knip Reports Unused Exports in Payload Collections

**Symptom**: Knip marks collection exports as unused

**Solution**: Ensure `payload.config.ts` is in `entry` array:

```json
{
  "entry": ["payload.config.ts", "src/payload.config.ts"]
}
```

**Reason**: Payload imports collections dynamically based on config

---

### Issue: Type Generation Needs Database

**Symptom**: `pnpm generate:types:payload` fails with DB error

**Solution**: Type generation should work without DB. If not:

1. Check if `PAYLOAD_SECRET` is set
2. Verify payload.config.ts doesn't require DB at import time

---

**Document Created**: 2025-11-29
**Last Updated**: 2025-11-29
