# Phase 8: Commit Checklist - Stryker Mutation Testing

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Phase**: 8 of 8

---

## 📋 Pre-Implementation Checklist

Before starting implementation, verify:

- [ ] Node.js 20+ installed
- [ ] pnpm 9+ installed
- [ ] Unit tests exist in `tests/unit/` directory
- [ ] `vitest.config.mts` is properly configured
- [ ] Phase 1-5 of Story 1.3 are completed (workflow foundation, tests pass)

---

## Commit 1: Install Stryker Dependencies

### Commit Message
```
✨ feat(ci): install Stryker mutation testing dependencies

Add @stryker-mutator/core and @stryker-mutator/vitest-runner for
mutation testing capability. This enables validation of test quality
by introducing code mutations and verifying tests detect them.

Part of ENF6 Phase 3 - Advanced (CA8)
```

### Pre-Commit Checklist

- [ ] Read current `package.json` devDependencies
- [ ] Verify no conflicting Stryker packages already installed

### Implementation Steps

1. [ ] Add dependencies to package.json:
   ```bash
   pnpm add -D @stryker-mutator/core @stryker-mutator/vitest-runner
   ```

2. [ ] Verify installation:
   ```bash
   pnpm list @stryker-mutator/core @stryker-mutator/vitest-runner
   ```

### Post-Commit Validation

- [ ] `pnpm install` completes without errors
- [ ] No peer dependency warnings for Stryker
- [ ] `npx stryker --version` shows installed version

### Files Changed

- [ ] `package.json` (devDependencies added)
- [ ] `pnpm-lock.yaml` (lockfile updated)

---

## Commit 2: Create Stryker Configuration

### Commit Message
```
🔧 config(stryker): add mutation testing configuration for critical modules

Configure Stryker with:
- Vitest runner integration
- Targeted mutation on src/lib/ and src/utilities/
- Incremental mode for faster subsequent runs
- Quality thresholds (high: 80, low: 60, break: 50)
- HTML and JSON reporters
```

### Pre-Commit Checklist

- [ ] Review existing `vitest.config.mts` for compatibility
- [ ] Identify critical modules to mutate (`src/lib/`, `src/utilities/`)
- [ ] Verify test files are properly excluded from mutation

### Implementation Steps

1. [ ] Create `stryker.config.mjs` at project root
2. [ ] Configure mutate patterns:
   ```javascript
   mutate: [
     'src/lib/**/*.ts',
     'src/utilities/**/*.ts',
     '!src/**/*.test.ts',
     '!src/**/*.spec.ts',
     '!src/payload-types.ts',
   ]
   ```
3. [ ] Set thresholds:
   ```javascript
   thresholds: {
     high: 80,
     low: 60,
     break: 50,
   }
   ```
4. [ ] Enable incremental mode:
   ```javascript
   incremental: true,
   incrementalFile: 'reports/mutation/stryker-incremental.json',
   ```

### Post-Commit Validation

- [ ] `npx stryker run --dryRunOnly` completes without errors
- [ ] Configuration file is valid JavaScript ESM

### Files Changed

- [ ] `stryker.config.mjs` (new file)

---

## Commit 3: Add Package.json Scripts

### Commit Message
```
📦 chore(scripts): add stryker npm scripts for mutation testing

Add convenience scripts:
- stryker: Full mutation test run
- stryker:incremental: Run with cached results
- stryker:dry: Validate config without mutations
```

### Pre-Commit Checklist

- [ ] Review existing scripts in package.json
- [ ] Ensure no naming conflicts

### Implementation Steps

1. [ ] Add scripts to package.json:
   ```json
   {
     "scripts": {
       "stryker": "stryker run",
       "stryker:incremental": "stryker run --incremental",
       "stryker:dry": "stryker run --dryRunOnly"
     }
   }
   ```

### Post-Commit Validation

- [ ] `pnpm stryker:dry` runs without errors
- [ ] `pnpm stryker --help` shows Stryker CLI help

### Files Changed

- [ ] `package.json` (scripts section)

---

## Commit 4: Integrate Stryker into Quality Gate Workflow

### Commit Message
```
🔧 ci(quality-gate): add optional Stryker mutation testing step

Add mutation testing as Layer 5 of the AI-Shield pipeline:
- Triggered via workflow_dispatch input (run_mutation_tests)
- Uploads HTML report as artifact
- Includes incremental cache for faster runs
- Reports summary in GitHub Job Summary
```

### Pre-Commit Checklist

- [ ] Review current `.github/workflows/quality-gate.yml` structure
- [ ] Verify `workflow_dispatch` section exists
- [ ] Plan artifact upload configuration

### Implementation Steps

1. [ ] Add `run_mutation_tests` input to workflow_dispatch:
   ```yaml
   inputs:
     run_mutation_tests:
       description: 'Run Stryker mutation testing (CPU intensive)'
       required: false
       default: false
       type: boolean
   ```

2. [ ] Add Stryker cache step:
   ```yaml
   - name: Cache Stryker Incremental Results
     if: ${{ github.event.inputs.run_mutation_tests == 'true' }}
     uses: actions/cache@5a3ec84eff668545956fd18022155c47e93e2684 # v4.2.3
     with:
       path: reports/mutation/stryker-incremental.json
       key: stryker-${{ runner.os }}-${{ hashFiles('src/lib/**/*.ts') }}
       restore-keys: stryker-${{ runner.os }}-
   ```

3. [ ] Add Stryker execution step:
   ```yaml
   - name: Stryker Mutation Testing
     if: ${{ github.event.inputs.run_mutation_tests == 'true' }}
     run: |
       echo "## 🧬 Mutation Testing Report" >> $GITHUB_STEP_SUMMARY
       pnpm stryker:incremental
       echo "📊 Full report in artifacts" >> $GITHUB_STEP_SUMMARY
   ```

4. [ ] Add artifact upload step:
   ```yaml
   - name: Upload Mutation Report
     if: ${{ github.event.inputs.run_mutation_tests == 'true' && always() }}
     uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4.6.2
     with:
       name: mutation-report
       path: reports/mutation/
       retention-days: 14
   ```

5. [ ] Update summary step to include Layer 5

### Post-Commit Validation

- [ ] Workflow YAML is valid (use GitHub Actions validator)
- [ ] Manual trigger shows `run_mutation_tests` checkbox
- [ ] Test with `run_mutation_tests: false` (should skip Stryker)

### Files Changed

- [ ] `.github/workflows/quality-gate.yml`

---

## Commit 5: Setup Reports Directory and Documentation

### Commit Message
```
📝 docs(stryker): add reports directory and update documentation

- Create reports/mutation/ directory with .gitkeep
- Update .gitignore for Stryker artifacts
- Document Stryker configuration in CI-CD-Security.md
```

### Pre-Commit Checklist

- [ ] Review current .gitignore rules
- [ ] Check CI-CD-Security.md section 9.1 content

### Implementation Steps

1. [ ] Create reports directory:
   ```bash
   mkdir -p reports/mutation
   touch reports/mutation/.gitkeep
   ```

2. [ ] Update .gitignore:
   ```gitignore
   # Stryker mutation testing
   .stryker-tmp/
   reports/mutation/*.html
   reports/mutation/*.json
   !reports/mutation/.gitkeep
   ```

3. [ ] Update CI-CD-Security.md section 9.1 with:
   - Configuration details
   - Usage instructions
   - Threshold rationale

### Post-Commit Validation

- [ ] `reports/mutation/.gitkeep` exists
- [ ] `.gitignore` excludes Stryker output files
- [ ] Documentation is accurate

### Files Changed

- [ ] `reports/mutation/.gitkeep` (new)
- [ ] `.gitignore` (modified)
- [ ] `docs/specs/CI-CD-Security.md` (modified, if needed)

---

## 🏁 Post-Phase Validation

After all commits are completed:

### Functional Validation

- [ ] `pnpm stryker:dry` validates configuration
- [ ] `pnpm stryker` runs and generates reports
- [ ] HTML report opens in browser correctly
- [ ] Incremental mode works (second run is faster)

### CI Validation

- [ ] Trigger workflow with `run_mutation_tests: true`
- [ ] Verify Stryker step runs
- [ ] Verify artifact is uploaded
- [ ] Verify GitHub Job Summary shows mutation report

### Documentation Validation

- [ ] CLAUDE.md mentions Stryker (if applicable)
- [ ] CI-CD-Security.md section 9.1 is up to date
- [ ] All commit messages follow Gitmoji convention

---

## 📊 Success Metrics

| Metric              | Target   | Actual |
| ------------------- | -------- | ------ |
| Mutation Score      | > 50%    | ___    |
| Execution Time      | < 15 min | ___    |
| Commits Completed   | 5        | ___    |
| All Tests Pass      | Yes      | ___    |

---

**Checklist Created**: 2025-12-01
**Last Updated**: 2025-12-01
