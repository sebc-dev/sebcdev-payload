# Phase 8: Validation Checklist - Stryker Mutation Testing

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Phase**: 8 of 8
**Validator**: _________________
**Date**: _________________

---

## 📋 Validation Overview

This checklist validates that the Stryker mutation testing integration is complete and functional. All items must pass before the phase can be marked as complete.

---

## ✅ Pre-Validation Requirements

Before running validation, ensure:

- [ ] All 5 commits from COMMIT_CHECKLIST.md are merged
- [ ] Branch is up-to-date with main
- [ ] Local environment matches ENVIRONMENT_SETUP.md
- [ ] No pending changes in working directory

---

## 1️⃣ Installation Validation

### Dependencies Installed

```bash
# Check Stryker packages are installed
pnpm list @stryker-mutator/core @stryker-mutator/vitest-runner
```

**Expected**: Both packages listed with versions.

- [ ] `@stryker-mutator/core` installed
- [ ] `@stryker-mutator/vitest-runner` installed
- [ ] No peer dependency warnings

### Version Check

```bash
npx stryker --version
```

**Expected**: Version 8.x.x

- [ ] Stryker CLI accessible
- [ ] Version is 8.x or higher

---

## 2️⃣ Configuration Validation

### File Exists

```bash
ls -la stryker.config.mjs
```

- [ ] `stryker.config.mjs` exists at project root

### Configuration Valid

```bash
pnpm stryker:dry
```

**Expected**: "Stryker done without errors"

- [ ] Dry run completes successfully
- [ ] No configuration errors
- [ ] Tests are discovered

### Mutate Patterns Correct

```bash
npx stryker run --dryRunOnly --logLevel debug 2>&1 | grep -i "found.*mutant"
```

- [ ] Mutants found in `src/lib/`
- [ ] Mutants found in `src/utilities/` (if exists)
- [ ] No mutants in test files
- [ ] No mutants in `payload-types.ts`

---

## 3️⃣ Script Validation

### Scripts Exist

```bash
cat package.json | grep -A5 '"scripts"' | grep stryker
```

- [ ] `stryker` script exists
- [ ] `stryker:incremental` script exists
- [ ] `stryker:dry` script exists

### Scripts Execute

```bash
# Test dry run script
pnpm stryker:dry

# Should show help, not run tests
pnpm stryker --help
```

- [ ] `pnpm stryker:dry` executes successfully
- [ ] Scripts use correct flags

---

## 4️⃣ Mutation Run Validation

### Full Mutation Run

```bash
# Run mutation testing (may take 5-15 minutes)
pnpm stryker
```

- [ ] Mutation run starts
- [ ] Progress is displayed
- [ ] Run completes (success or threshold failure)

### Mutation Score

**Recorded Score**: ______%

- [ ] Score is calculated
- [ ] Score displayed in console
- [ ] Score meets threshold (> 50%)

### Reports Generated

```bash
ls -la reports/mutation/
```

- [ ] `mutation-report.html` exists
- [ ] `mutation-report.json` exists
- [ ] `stryker-incremental.json` exists (after incremental run)

### HTML Report

```bash
# Open report (adjust for your OS)
open reports/mutation/mutation-report.html
```

- [ ] Report opens in browser
- [ ] Files are listed
- [ ] Mutant details visible
- [ ] Score summary displayed

---

## 5️⃣ Incremental Mode Validation

### First Run (Baseline)

```bash
# Clear incremental cache
rm -f reports/mutation/stryker-incremental.json

# Run with incremental
pnpm stryker:incremental
```

**First Run Time**: ______ seconds

- [ ] Incremental file created
- [ ] Run completes

### Second Run (Cached)

```bash
pnpm stryker:incremental
```

**Second Run Time**: ______ seconds

- [ ] Second run is faster than first
- [ ] Incremental cache used
- [ ] Results consistent

---

## 6️⃣ CI Workflow Validation

### Input Configuration

1. Go to GitHub Actions
2. Select "Quality Gate" workflow
3. Click "Run workflow"

- [ ] `run_mutation_tests` checkbox visible
- [ ] Description mentions "CPU intensive"
- [ ] Default is unchecked (false)

### Workflow Run (Disabled)

1. Run workflow with `run_mutation_tests: false`
2. Monitor execution

- [ ] Stryker step is skipped
- [ ] Workflow completes successfully
- [ ] Summary mentions "Skipped"

### Workflow Run (Enabled)

1. Run workflow with `run_mutation_tests: true`
2. Monitor execution

**CI Execution Time**: ______ minutes

- [ ] Stryker step runs
- [ ] Progress visible in logs
- [ ] Step completes (pass or threshold fail)

### Artifact Upload

After workflow completes:

- [ ] `mutation-report` artifact visible
- [ ] Artifact downloadable
- [ ] Contains HTML and JSON reports

### Job Summary

- [ ] Mutation section in summary
- [ ] Link to artifact mentioned
- [ ] Layer 5 status updated

---

## 7️⃣ .gitignore Validation

### Exclusions Configured

```bash
cat .gitignore | grep -i stryker
cat .gitignore | grep -i mutation
```

- [ ] `.stryker-tmp/` excluded
- [ ] `reports/mutation/*.html` excluded
- [ ] `reports/mutation/*.json` excluded
- [ ] `!reports/mutation/.gitkeep` included

### Git Status Clean

```bash
# After running Stryker
git status
```

- [ ] No Stryker output files in git status
- [ ] `.stryker-tmp/` not tracked
- [ ] Reports not tracked

---

## 8️⃣ Documentation Validation

### Phase Documentation Complete

- [ ] `INDEX.md` exists and accurate
- [ ] `IMPLEMENTATION_PLAN.md` exists and complete
- [ ] `COMMIT_CHECKLIST.md` exists and accurate
- [ ] `ENVIRONMENT_SETUP.md` exists and tested
- [ ] `guides/TESTING.md` exists and helpful
- [ ] `guides/REVIEW.md` exists and complete
- [ ] `validation/VALIDATION_CHECKLIST.md` exists (this file)

### Project Documentation Updated

- [ ] CI-CD-Security.md section 9.1 accurate
- [ ] CLAUDE.md mentions Stryker (if applicable)

---

## 📊 Final Metrics

| Metric               | Expected  | Actual    | Pass |
| -------------------- | --------- | --------- | ---- |
| Mutation Score       | > 50%     | ______%   | ⬜   |
| Local Execution Time | < 15 min  | ______ min| ⬜   |
| CI Execution Time    | < 20 min  | ______ min| ⬜   |
| Incremental Speedup  | > 30%     | ______%   | ⬜   |
| Surviving Mutants    | < 50%     | ______%   | ⬜   |

---

## 🏁 Phase Completion Criteria

### All Must Pass

- [ ] All validation sections completed
- [ ] Mutation score meets threshold (> 50%)
- [ ] CI workflow runs correctly
- [ ] Reports are generated and accessible
- [ ] Documentation is complete

### Sign-off

**Validation Status**: ⬜ PASSED / ⬜ FAILED

**Validator Signature**: _________________________

**Date**: _________________________

**Notes**:
```
_____________________________________________
_____________________________________________
_____________________________________________
```

---

## 📝 Post-Validation Actions

If validation passed:

1. [ ] Update EPIC_TRACKING.md - Phase 8 status to ✅ COMPLETED
2. [ ] Update PHASES_PLAN.md progress tracking
3. [ ] Notify team of completion
4. [ ] Create PR for next steps (if any)

If validation failed:

1. [ ] Document failure reasons above
2. [ ] Create issues for fixes
3. [ ] Re-run validation after fixes

---

**Validation Checklist Created**: 2025-12-01
**Last Updated**: 2025-12-01
