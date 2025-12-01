# Phase 8: Code Review Guide - Stryker Mutation Testing

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Phase**: 8 of 8

---

## 📋 Review Overview

This guide provides a checklist for reviewing the Stryker mutation testing implementation. Use this during code review to ensure quality and consistency.

---

## 🔍 Review Checklist

### 1. Stryker Configuration (`stryker.config.mjs`)

#### Structure & Syntax

- [ ] File uses ESM syntax (`export default`)
- [ ] JSDoc type annotation present for autocomplete
- [ ] All options are documented with comments
- [ ] No deprecated options used

#### Mutate Patterns

- [ ] `mutate` array targets correct directories:
  - `src/lib/**/*.ts` ✓
  - `src/utilities/**/*.ts` ✓
- [ ] Exclusions are correct:
  - `!src/**/*.test.ts` - No test files
  - `!src/**/*.spec.ts` - No spec files
  - `!src/payload-types.ts` - No generated types
  - `!src/**/*.d.ts` - No declaration files

#### Performance Settings

- [ ] `coverageAnalysis: 'perTest'` for efficiency
- [ ] `concurrency` is reasonable (2-4)
- [ ] `timeoutMS` and `timeoutFactor` are set
- [ ] `incremental: true` for CI caching
- [ ] `maxTestRunnerReuse` prevents memory leaks

#### Thresholds

- [ ] `break: 50` - Generous for initial adoption
- [ ] `low: 60` - Warning threshold
- [ ] `high: 80` - Success threshold
- [ ] Thresholds are documented in comments

#### Reporters

- [ ] `html` reporter for human review
- [ ] `json` reporter for CI processing
- [ ] `clear-text` for console output
- [ ] `progress` for live feedback
- [ ] Report paths are in `reports/mutation/`

### 2. Package.json Changes

#### Dependencies

- [ ] `@stryker-mutator/core` is in devDependencies
- [ ] `@stryker-mutator/vitest-runner` is in devDependencies
- [ ] Versions are pinned (not `latest`)
- [ ] No unnecessary Stryker plugins added

#### Scripts

- [ ] `stryker` script runs `stryker run`
- [ ] `stryker:incremental` includes `--incremental`
- [ ] `stryker:dry` includes `--dryRunOnly`
- [ ] Scripts follow project naming conventions

### 3. GitHub Workflow Changes

#### Workflow Dispatch Input

- [ ] `run_mutation_tests` input is `boolean` type
- [ ] Description clearly states "CPU intensive"
- [ ] Default is `false` (opt-in, not opt-out)

#### Stryker Step

- [ ] Condition `if: ${{ github.event.inputs.run_mutation_tests == 'true' }}`
- [ ] Uses `pnpm stryker:incremental` (not `pnpm stryker`)
- [ ] Writes to `$GITHUB_STEP_SUMMARY`
- [ ] Handles exit codes appropriately

#### Cache Configuration

- [ ] Cache path: `reports/mutation/stryker-incremental.json`
- [ ] Cache key includes OS and source file hashes
- [ ] `restore-keys` allows partial cache hits
- [ ] Cache step is conditional on `run_mutation_tests`

#### Artifact Upload

- [ ] Upload action is SHA-pinned
- [ ] `if: always()` ensures upload even on failure
- [ ] `retention-days: 14` is reasonable
- [ ] Artifact name is descriptive (`mutation-report`)

#### Summary Update

- [ ] Layer 5 (Stryker) mentioned in summary
- [ ] Conditional message for skipped vs run

### 4. .gitignore Changes

- [ ] `.stryker-tmp/` excluded
- [ ] `reports/mutation/*.html` excluded
- [ ] `reports/mutation/*.json` excluded
- [ ] `!reports/mutation/.gitkeep` included

### 5. Directory Structure

- [ ] `reports/mutation/` directory exists
- [ ] `.gitkeep` file present
- [ ] No actual reports committed

---

## 🎯 Quality Criteria

### Security Considerations

- [ ] No secrets or tokens in configuration
- [ ] No hardcoded paths that could leak info
- [ ] Artifact retention is reasonable (not permanent)

### Performance Considerations

- [ ] Mutate scope is limited to critical modules
- [ ] Incremental mode is enabled
- [ ] Concurrency is reasonable for CI runners
- [ ] Timeout settings prevent runaway processes

### Maintainability

- [ ] Configuration is well-documented
- [ ] Scripts are intuitive (`stryker:dry` vs `stryker`)
- [ ] Workflow conditions are clear
- [ ] Error handling is present

### Compatibility

- [ ] Works with existing `vitest.config.mts`
- [ ] Doesn't conflict with existing test scripts
- [ ] Integrates with existing workflow structure

---

## 📝 Review Comments Template

Use these templates for common review feedback:

### Configuration Issue
```markdown
**Config**: Consider adjusting `{option}` to `{value}` because {reason}.

Reference: [Stryker Configuration](https://stryker-mutator.io/docs/stryker-js/configuration)
```

### Missing Exclusion
```markdown
**Scope**: The pattern `{pattern}` should be added to exclusions to avoid mutating {reason}.

Example:
```js
mutate: [
  // ... existing
  '!{pattern}',
]
```
```

### Performance Concern
```markdown
**Performance**: This configuration may cause slow CI runs because {reason}.

Suggestion: {mitigation}
```

### Missing Test
```markdown
**Testing**: Please add a test to verify {scenario}.

Example test:
```bash
{command}
```
```

---

## ✅ Approval Criteria

The PR can be approved when:

1. **All checklist items are satisfied** ✓
2. **Local testing successful**:
   - `pnpm stryker:dry` passes
   - `pnpm stryker` generates reports
3. **CI testing successful**:
   - Workflow runs with input enabled
   - Artifact is uploaded
4. **Documentation is complete**:
   - Configuration is commented
   - README/CLAUDE.md updated if needed
5. **No security concerns**:
   - No secrets exposed
   - Artifact retention is limited

---

## 🔄 Post-Merge Verification

After merging, verify:

1. [ ] Dependabot creates update PRs for Stryker packages
2. [ ] First real workflow run succeeds
3. [ ] Mutation report is accessible via artifacts
4. [ ] Score meets initial threshold (> 50%)

---

**Review Guide Created**: 2025-12-01
**Last Updated**: 2025-12-01
