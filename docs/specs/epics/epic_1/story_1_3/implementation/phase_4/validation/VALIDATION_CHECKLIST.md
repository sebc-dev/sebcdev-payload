# Phase 4 - Final Validation Checklist

**Phase**: Dead Code Detection & Type Sync
**Validator**: Tech Lead / Senior Developer
**Estimated Time**: 30-45 minutes

---

## Validation Overview

This checklist ensures Phase 4 implementation is complete, correct, and production-ready. Complete all sections before marking the phase as done.

---

## Section 1: Files Created/Modified

### New Files

- [ ] `knip.json` exists at repository root
- [ ] `docs/guides/dead-code-detection.md` exists

### Modified Files

- [ ] `package.json` has Knip scripts
- [ ] `.github/workflows/quality-gate.yml` has Knip and Type Sync steps

### File Content Verification

```bash
# Verify all files exist
ls -la knip.json
ls -la docs/guides/dead-code-detection.md
cat package.json | grep -A2 '"knip"'
```

---

## Section 2: Knip Configuration

### Configuration Correctness

- [ ] `$schema` reference is correct
- [ ] All entry points are listed:
  - [ ] `next.config.ts`
  - [ ] `payload.config.ts` or `src/payload.config.ts`
  - [ ] `src/middleware.ts` (if exists)
  - [ ] `src/instrumentation.ts` (if exists)
- [ ] Ignore patterns include:
  - [ ] `src/payload-types.ts`
  - [ ] `public/**`
- [ ] Exclude patterns include:
  - [ ] `drizzle/migrations/**`
  - [ ] `drizzle/meta/**`
- [ ] `ignoreDependencies` includes type-only packages

### Functional Testing

```bash
# Run Knip in production mode
pnpm exec knip --production
```

**Expected**: No errors, no false positives

| Result                                    | Status |
| ----------------------------------------- | ------ |
| Command exits with code 0                 | [ ]    |
| No Next.js pages reported as unused       | [ ]    |
| No Payload collections reported as unused | [ ]    |
| No legitimate exports marked as unused    | [ ]    |

---

## Section 3: Package.json Scripts

### Scripts Added

```bash
cat package.json | grep -E '"knip|knip:production"'
```

**Expected**:

```json
"knip": "knip",
"knip:production": "knip --production"
```

### Scripts Work

```bash
pnpm knip --help
pnpm knip:production
```

| Script                 | Works | Notes |
| ---------------------- | ----- | ----- |
| `pnpm knip`            | [ ]   |       |
| `pnpm knip:production` | [ ]   |       |

---

## Section 4: Workflow Integration

### YAML Syntax

```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/quality-gate.yml'))"
```

**Expected**: No output (valid YAML)

### Step Presence

Verify the following steps exist in quality-gate.yml:

- [ ] `Knip - Dead Code Detection`
- [ ] `Generate Payload Types`
- [ ] `Verify Type Sync`

### Step Order

```bash
grep -E "^      - name:" .github/workflows/quality-gate.yml
```

**Expected Order**:

1. Checkout repository
2. Setup pnpm
3. Setup Node.js
4. Install dependencies
5. Socket.dev Security Scan
6. ESLint
7. Prettier Check
8. **Knip - Dead Code Detection**
9. **Generate Payload Types**
10. **Verify Type Sync**
11. Placeholder (future steps)

### Step Configuration

| Step                   | Has Error Handling         | Correct Command      |
| ---------------------- | -------------------------- | -------------------- |
| Knip                   | [ ] No continue-on-error   | [ ] `--production`   |
| Generate Payload Types | [ ] Has PAYLOAD_SECRET env | [ ] Correct fallback |
| Verify Type Sync       | [ ] Has exit 1 on failure  | [ ] Clear message    |

---

## Section 5: Type Sync Validation

### Environment Variable

```bash
# Check workflow has correct secret handling
grep -A3 "Generate Payload Types" .github/workflows/quality-gate.yml
```

**Expected**:

- Uses `${{ secrets.PAYLOAD_SECRET }}`
- Has fallback of at least 32 characters

### Type Generation

```bash
pnpm generate:types:payload
```

| Result                     | Status |
| -------------------------- | ------ |
| Command succeeds           | [ ]    |
| `payload-types.ts` updated | [ ]    |
| No errors in output        | [ ]    |

### Sync Check

```bash
git diff --exit-code src/payload-types.ts && echo "✅ Synced" || echo "❌ Not synced"
```

**Expected**: ✅ Synced

---

## Section 6: CI Integration Testing

### Manual Workflow Trigger

1. Push changes to branch
2. Navigate to Actions tab
3. Select "Quality Gate" workflow
4. Click "Run workflow"
5. Select branch
6. Click "Run workflow" button

### CI Results

| Step                       | Passes | Time |
| -------------------------- | ------ | ---- |
| Socket.dev Security Scan   | [ ]    |      |
| ESLint                     | [ ]    |      |
| Prettier Check             | [ ]    |      |
| Knip - Dead Code Detection | [ ]    |      |
| Generate Payload Types     | [ ]    |      |
| Verify Type Sync           | [ ]    |      |

### Error Messages

If any step fails, verify:

- [ ] Error message is clear and actionable
- [ ] Developer knows what to do to fix
- [ ] No secrets exposed in logs

---

## Section 7: Documentation

### Guide Completeness

- [ ] `docs/guides/dead-code-detection.md` exists
- [ ] Contains Knip configuration explanation
- [ ] Contains Type Sync workflow explanation
- [ ] Has troubleshooting section
- [ ] All commands work when copy-pasted

### Documentation Accuracy

```bash
# Verify commands from documentation work
pnpm exec knip
pnpm exec knip --production
pnpm generate:types:payload
git diff --exit-code src/payload-types.ts
```

| Command from Docs             | Works |
| ----------------------------- | ----- |
| `pnpm exec knip`              | [ ]   |
| `pnpm exec knip --production` | [ ]   |
| `pnpm generate:types:payload` | [ ]   |
| `git diff` command            | [ ]   |

---

## Section 8: Security Verification

### Secret Handling

- [ ] No real secrets in workflow file
- [ ] Fallback secret is generic (not real)
- [ ] PAYLOAD_SECRET not logged

### Check Workflow for Leaks

```bash
# Should return nothing sensitive
grep -E "(secret|token|password|key)" .github/workflows/quality-gate.yml
```

**Verify**: Only references to `${{ secrets.* }}`, no actual values

---

## Section 9: Acceptance Criteria

From PHASES_PLAN.md, Phase 4 must satisfy:

### CA2 (Hygiène) - Knip Configuration

- [ ] Knip configured for Next.js 15 + Payload CMS
- [ ] Entry points explicit: `payload.config.ts`, `middleware.ts`, etc.
- [ ] Generated types excluded (`payload-types.ts`)
- [ ] Migrations excluded (`drizzle/migrations/**`)
- [ ] Mode `--production` in CI

### CA3 (Type Sync) - Type Validation

- [ ] Type generation step in workflow
- [ ] Sync check step in workflow
- [ ] Clear error message if out of sync
- [ ] Workflow fails if types not synchronized

---

## Section 10: Performance

### Knip Execution Time

```bash
time pnpm exec knip --production
```

| Metric          | Target | Actual |
| --------------- | ------ | ------ |
| Production mode | < 15s  |        |
| Full mode       | < 30s  |        |

### CI Execution Time

| Step            | Target | Actual |
| --------------- | ------ | ------ |
| Knip            | < 30s  |        |
| Type Generation | < 15s  |        |
| Type Sync Check | < 5s   |        |

---

## Section 11: Regression Check

### Previous Phases Still Work

```bash
# Phase 3: ESLint/Prettier
pnpm lint
pnpm format:check

# Full quality gate
pnpm lint && pnpm format:check && pnpm exec knip --production
```

| Check           | Passes |
| --------------- | ------ |
| ESLint          | [ ]    |
| Prettier        | [ ]    |
| Knip            | [ ]    |
| Type Generation | [ ]    |
| Type Sync       | [ ]    |

---

## Section 12: Final Sign-Off

### Commit History

```bash
git log --oneline -4
```

**Expected**: 4 commits with Gitmoji prefixes

- [ ] 🔍 Add Knip configuration for dead code detection
- [ ] 👷 Add Knip step to quality-gate workflow
- [ ] 🔒 Add Payload type sync validation to CI
- [ ] 📝 Add dead code detection and type sync documentation

### Branch State

- [ ] All changes committed
- [ ] No uncommitted files: `git status` is clean
- [ ] Branch pushed to remote

---

## Validation Summary

### Critical Items (All Must Pass)

| Item                       | Status |
| -------------------------- | ------ |
| Knip configuration correct | [ ]    |
| No false positives         | [ ]    |
| Type sync validation works | [ ]    |
| CI workflow passes         | [ ]    |
| No security issues         | [ ]    |

### Phase Completion

- [ ] All 4 commits completed
- [ ] All validation items passed
- [ ] CI integration tested and working
- [ ] Documentation complete and accurate

**Phase 4 Status**: [ ] **COMPLETE**

---

## Sign-Off

| Role      | Name | Date | Signature |
| --------- | ---- | ---- | --------- |
| Developer |      |      |           |
| Reviewer  |      |      |           |
| Tech Lead |      |      |           |

---

## Next Steps

After Phase 4 is validated:

1. Update EPIC_TRACKING.md with Phase 4 completion
2. Begin Phase 5 (Build Validation - No-DB Mode)
3. Generate Phase 5 documentation: `/generate-phase-doc Epic 1 Story 1.3 Phase 5`

---

**Document Created**: 2025-11-29
**Last Updated**: 2025-11-29
