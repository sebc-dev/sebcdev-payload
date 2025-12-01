# Phase 8: Implementation Plan - Stryker Mutation Testing

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Phase**: 8 of 8
**PRD Reference**: ENF6 - CA8 (Phase 3 - Advanced)

---

## 📋 Overview

Ce plan détaille l'implémentation de Stryker Mutator pour le mutation testing dans le pipeline Quality Gate. Stryker vérifie la qualité des tests en introduisant des mutations dans le code source et en validant que les tests détectent ces changements.

### Objectif Principal

Garantir que les tests générés par IA (ou manuellement) sont effectivement capables de détecter des bugs, pas simplement de passer "pour faire vert".

---

## 🔧 Technical Architecture

### Stryker avec Vitest Runner

```
┌─────────────────────────────────────────────────────────────┐
│                    Stryker Mutator                          │
│                                                             │
│  1. Parse source files (src/lib/**)                        │
│  2. Generate mutants (change operators, values, etc.)       │
│  3. Run tests for each mutant                               │
│  4. Report killed vs survived mutants                       │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │  Source     │ →  │   Mutant    │ →  │   Vitest    │    │
│  │  Code       │    │   Code      │    │   Runner    │    │
│  └─────────────┘    └─────────────┘    └─────────────┘    │
│                                                             │
│  Output: Mutation Score = Killed / Total Mutants           │
└─────────────────────────────────────────────────────────────┘
```

### Modules Ciblés

| Module                    | Raison                                           |
| ------------------------- | ------------------------------------------------ |
| `src/lib/**/*.ts`         | Utilitaires critiques partagés                   |
| `src/utilities/**/*.ts`   | Fonctions helper réutilisables                   |
| `!**/*.test.ts`           | Exclusion des fichiers de test                   |
| `!**/*.spec.ts`           | Exclusion des fichiers de spec                   |
| `!**/payload-types.ts`    | Exclusion des types générés                      |

---

## 📝 Commit-by-Commit Implementation

### Commit 1: Install Stryker Dependencies

**Message**: `✨ feat(ci): install Stryker mutation testing dependencies`

**Changes**:

1. **package.json** - Ajouter les dépendances de développement:
   ```json
   {
     "devDependencies": {
       "@stryker-mutator/core": "^8.7.1",
       "@stryker-mutator/vitest-runner": "^8.7.1"
     }
   }
   ```

2. Exécuter `pnpm install`

**Validation**:
```bash
pnpm list @stryker-mutator/core @stryker-mutator/vitest-runner
```

---

### Commit 2: Create Stryker Configuration

**Message**: `🔧 config(stryker): add mutation testing configuration for critical modules`

**File**: `stryker.config.mjs`

```javascript
// stryker.config.mjs
/**
 * Stryker Mutation Testing Configuration
 *
 * Purpose: Validate test quality by introducing mutations
 * Target: Critical modules only (src/lib/, src/utilities/)
 *
 * @see https://stryker-mutator.io/docs/stryker-js/configuration
 */

/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  // Package manager
  packageManager: 'pnpm',

  // Test runner - Vitest integration
  testRunner: 'vitest',

  // Files to mutate (production code only, critical modules)
  mutate: [
    'src/lib/**/*.ts',
    'src/utilities/**/*.ts',
    // Exclusions
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.d.ts',
    '!src/payload-types.ts',
  ],

  // Coverage analysis strategy
  // 'perTest' runs only tests covering each mutant (faster)
  coverageAnalysis: 'perTest',

  // Output reporters
  reporters: ['html', 'clear-text', 'progress', 'json'],

  // HTML report location
  htmlReporter: {
    fileName: 'reports/mutation/mutation-report.html',
  },

  // JSON report for CI processing
  jsonReporter: {
    fileName: 'reports/mutation/mutation-report.json',
  },

  // Quality thresholds
  thresholds: {
    high: 80,   // Green: >= 80% mutation score
    low: 60,    // Yellow: >= 60% mutation score
    break: 50,  // Build fails if < 50%
  },

  // Performance optimizations
  concurrency: 4,              // Parallel test runners
  timeoutMS: 10000,            // 10s per test
  timeoutFactor: 1.5,          // Multiply original test time
  maxTestRunnerReuse: 20,      // Reuse runners to avoid memory leaks

  // Incremental mode for faster subsequent runs
  incremental: true,
  incrementalFile: 'reports/mutation/stryker-incremental.json',

  // Ignore static mutants (executed during file load)
  ignoreStatic: true,

  // Temp directory for mutation work
  tempDirName: '.stryker-tmp',
  cleanTempDir: true,

  // Vitest specific configuration
  vitest: {
    configFile: 'vitest.config.mts',
    dir: undefined, // Use default test directory
  },

  // Plugins to load
  plugins: ['@stryker-mutator/vitest-runner'],

  // Disable checkers for speed (TypeScript checked in build step)
  checkers: [],

  // Mutator configuration
  mutator: {
    // Exclude specific mutation types if needed
    excludedMutations: [
      // Uncomment to exclude specific mutators:
      // 'StringLiteral',      // Don't mutate string literals
      // 'BooleanLiteral',     // Don't mutate boolean literals
    ],
  },
};
```

**Validation**:
```bash
# Verify config is valid
npx stryker run --dryRunOnly
```

---

### Commit 3: Add Package.json Script

**Message**: `📦 chore(scripts): add stryker npm script`

**Changes to package.json**:
```json
{
  "scripts": {
    "stryker": "stryker run",
    "stryker:incremental": "stryker run --incremental",
    "stryker:dry": "stryker run --dryRunOnly"
  }
}
```

**Validation**:
```bash
pnpm stryker:dry
```

---

### Commit 4: Integrate Stryker into Quality Gate Workflow

**Message**: `🔧 ci(quality-gate): add optional Stryker mutation testing step`

**Changes to `.github/workflows/quality-gate.yml`**:

```yaml
name: Quality Gate

on:
  pull_request:
    branches: [main]
  workflow_dispatch:
    inputs:
      run_mutation_tests:
        description: 'Run Stryker mutation testing (CPU intensive, ~10-15 min)'
        required: false
        default: false
        type: boolean

jobs:
  quality-gate:
    name: Quality Checks
    runs-on: ubuntu-latest

    # ... existing steps ...

    steps:
      # ... existing steps (checkout, setup, lint, build, etc.) ...

      # ============================================
      # LAYER 5: Mutation Testing (Optional)
      # ============================================

      - name: Stryker Mutation Testing
        if: ${{ github.event.inputs.run_mutation_tests == 'true' }}
        run: |
          echo "## 🧬 Mutation Testing Report" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY

          # Run Stryker with incremental mode
          pnpm stryker:incremental || STRYKER_EXIT_CODE=$?

          # Extract mutation score from JSON report
          if [ -f "reports/mutation/mutation-report.json" ]; then
            MUTATION_SCORE=$(jq -r '.schemaVersion' reports/mutation/mutation-report.json 2>/dev/null || echo "N/A")
            echo "**Mutation Score**: See HTML report for details" >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
          fi

          # Link to HTML report (artifact)
          echo "📊 Full HTML report available in artifacts" >> $GITHUB_STEP_SUMMARY

          exit ${STRYKER_EXIT_CODE:-0}

      - name: Upload Mutation Report
        if: ${{ github.event.inputs.run_mutation_tests == 'true' && always() }}
        uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4.6.2
        with:
          name: mutation-report
          path: reports/mutation/
          retention-days: 14

      # ============================================
      # Summary
      # ============================================

      - name: Quality Gate Summary
        run: |
          echo "::notice::✅ Layer 1: Supply Chain Security (Socket Firewall)"
          echo "::notice::✅ Layer 2: Code Quality (ESLint, Prettier, Knip, Type Sync)"
          echo "::notice::✅ Layer 3: Build Validation (Next.js No-DB Mode)"
          echo "::notice::✅ Layer 4: Architecture Validation (dependency-cruiser)"
          if [ "${{ github.event.inputs.run_mutation_tests }}" == "true" ]; then
            echo "::notice::✅ Layer 5: Mutation Testing (Stryker)"
          else
            echo "::notice::⏭️ Layer 5: Mutation Testing (Skipped - enable via workflow_dispatch)"
          fi
```

**Validation**:
- Déclencher le workflow manuellement avec `run_mutation_tests: true`
- Vérifier que Stryker s'exécute et génère un rapport

---

### Commit 5: Configure Incremental Cache & Reports Directory

**Message**: `🔧 config: setup Stryker reports directory and gitignore`

**Changes**:

1. **Create reports directory structure**:
   ```bash
   mkdir -p reports/mutation
   echo "*.html" > reports/mutation/.gitkeep
   ```

2. **Update .gitignore**:
   ```gitignore
   # Stryker mutation testing
   .stryker-tmp/
   reports/mutation/*.html
   reports/mutation/*.json
   !reports/mutation/.gitkeep
   ```

3. **Cache configuration for CI** (in workflow):
   ```yaml
   - name: Cache Stryker Incremental Results
     if: ${{ github.event.inputs.run_mutation_tests == 'true' }}
     uses: actions/cache@5a3ec84eff668545956fd18022155c47e93e2684 # v4.2.3
     with:
       path: reports/mutation/stryker-incremental.json
       key: stryker-${{ runner.os }}-${{ hashFiles('src/lib/**/*.ts', 'src/utilities/**/*.ts') }}
       restore-keys: |
         stryker-${{ runner.os }}-
   ```

**Validation**:
```bash
# First run - creates incremental file
pnpm stryker:incremental

# Second run - should be faster
pnpm stryker:incremental

# Verify incremental file exists
ls -la reports/mutation/stryker-incremental.json
```

---

## 🧪 Testing Strategy

### Local Testing

```bash
# 1. Dry run (validate config without running mutations)
pnpm stryker:dry

# 2. Full run on limited scope
npx stryker run --mutate "src/lib/utils.ts"

# 3. Full run with incremental
pnpm stryker:incremental

# 4. View HTML report
open reports/mutation/mutation-report.html
```

### CI Testing

1. Déclencher workflow via `workflow_dispatch`
2. Activer l'input `run_mutation_tests`
3. Vérifier les logs Stryker
4. Télécharger l'artifact `mutation-report`

### Interpreting Results

| Status   | Meaning                                    | Action                        |
| -------- | ------------------------------------------ | ----------------------------- |
| Killed   | Test detected the mutation ✅              | Good - test is effective      |
| Survived | Test didn't detect the mutation ⚠️        | Improve test coverage         |
| Timeout  | Test took too long with mutation           | Usually OK, can indicate issue |
| No Coverage | No test covers this code                | Add tests or exclude from mutate |

---

## ⚠️ Risk Mitigation

### Performance Concerns

**Risk**: Mutation testing is CPU-intensive (10-30 min)

**Mitigations**:
1. **Optional execution**: Via `workflow_dispatch` input, not automatic
2. **Targeted scope**: Only `src/lib/` and `src/utilities/`, not entire codebase
3. **Incremental mode**: Cache previous results, only test changed files
4. **Concurrency**: 4 parallel runners
5. **`coverageAnalysis: 'perTest'`**: Only runs tests that cover each mutant

### False Positives

**Risk**: Mutations in logging or UI code may not matter

**Mitigations**:
1. **Exclude string literals** if too noisy: `excludedMutations: ['StringLiteral']`
2. **Targeted mutate patterns**: Focus on business logic
3. **`ignoreStatic: true`**: Ignore code executed during module load

### Initial Low Score

**Risk**: First run may show low mutation score

**Mitigations**:
1. **`break: 50`**: Generous initial threshold
2. **Progressive improvement**: Raise thresholds over time
3. **Focus on critical paths**: Improve tests for killed/survived ratio

---

## 📊 Expected Metrics

| Metric              | Target     | Rationale                              |
| ------------------- | ---------- | -------------------------------------- |
| Mutation Score      | > 50%      | Initial threshold, raise over time     |
| Execution Time      | < 15 min   | Acceptable for optional CI step        |
| Survived Mutants    | < 50%      | Most mutations should be caught        |
| No Coverage Mutants | Minimize   | Indicates untested code                |

---

## 🔗 Dependencies & Prerequisites

### Required Before This Phase

- [x] Phase 1: Workflow Foundation (workflow exists)
- [x] Phase 5: Build Validation (tests must pass)
- [x] Unit tests exist in `tests/unit/`

### External Dependencies

| Package                          | Version | Purpose                    |
| -------------------------------- | ------- | -------------------------- |
| `@stryker-mutator/core`          | ^8.7.1  | Core mutation engine       |
| `@stryker-mutator/vitest-runner` | ^8.7.1  | Vitest test runner adapter |

---

## 📚 References

- [Stryker Mutator Docs](https://stryker-mutator.io/docs/)
- [Vitest Runner Config](https://stryker-mutator.io/docs/stryker-js/vitest-runner)
- [Mutation Testing Theory](https://stryker-mutator.io/docs/mutation-testing-elements/what-is-mutation-testing)
- [CI-CD Security Architecture](../../../../CI-CD-Security.md) - Section 9.1

---

**Implementation Plan Created**: 2025-12-01
**Last Updated**: 2025-12-01
