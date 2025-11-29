# Implementation Plan - Phase 6: Architecture Validation

**Phase**: Architecture Validation (dependency-cruiser)
**Estimated Commits**: 4
**Estimated Duration**: 2-2.5 hours
**Complexity**: Medium

---

## Atomic Commit Strategy

This phase is broken down into **4 atomic commits**, each representing a single, reviewable, and reversible unit of work.

### Commit Principles Applied

- **Single Responsibility**: Each commit does ONE thing
- **Type-Safe**: TypeScript passes after each commit
- **Testable**: Validatable locally before pushing
- **Reviewable**: 15-45 minutes per commit review
- **Reversible**: Can revert any commit without breaking others

---

## Commit Sequence

```
┌─────────────────────────────────────────────────────────────┐
│ Commit 1: Install dependency-cruiser                        │
│           + Add npm script                                  │
│           + Create minimal config                           │
├─────────────────────────────────────────────────────────────┤
│ Commit 2: Add architecture validation rules                 │
│           + no-server-in-client rule                        │
│           + no-circular rule                                │
│           + Configure exclusions                            │
├─────────────────────────────────────────────────────────────┤
│ Commit 3: Generate baseline (if violations exist)           │
│           + Run initial analysis                            │
│           + Create known-violations file                    │
│           + Freeze existing technical debt                  │
├─────────────────────────────────────────────────────────────┤
│ Commit 4: Integrate into CI workflow                        │
│           + Add workflow step                               │
│           + Generate GitHub Job Summary                     │
│           + Update documentation                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Commit 1: Install and Configure dependency-cruiser

### Objective

Install dependency-cruiser as a dev dependency and create a minimal working configuration.

### Changes

| File                      | Action | Description                                    |
| ------------------------- | ------ | ---------------------------------------------- |
| `package.json`            | Modify | Add dependency-cruiser to devDependencies      |
| `package.json`            | Modify | Add `depcruise` and `depcruise:report` scripts |
| `.dependency-cruiser.cjs` | Create | Minimal configuration file                     |

### Implementation Details

#### 1. Install dependency-cruiser

```bash
pnpm add -D dependency-cruiser
```

#### 2. Add npm scripts to package.json

```json
{
  "scripts": {
    "depcruise": "depcruise src --config .dependency-cruiser.cjs",
    "depcruise:report": "depcruise src --config .dependency-cruiser.cjs --output-type html > depcruise-report.html"
  }
}
```

#### 3. Create minimal .dependency-cruiser.cjs

```javascript
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/(@[^/]+/[^/]+|[^/]+)',
      },
    },
  },
}
```

### Validation

```bash
# Verify installation
pnpm exec depcruise --version

# Run initial analysis (no rules yet, should pass)
pnpm depcruise
```

### Commit Message

```
🔧 Install and configure dependency-cruiser

- Add dependency-cruiser as dev dependency
- Create minimal .dependency-cruiser.cjs configuration
- Add depcruise and depcruise:report npm scripts

This enables architecture validation for the codebase.
The rules will be added in the next commit.
```

---

## Commit 2: Add Architecture Validation Rules

### Objective

Implement the core architecture rules to detect violations in Next.js 15 + Payload CMS architecture.

### Changes

| File                      | Action | Description         |
| ------------------------- | ------ | ------------------- |
| `.dependency-cruiser.cjs` | Modify | Add forbidden rules |

### Implementation Details

#### Update .dependency-cruiser.cjs with rules

```javascript
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    // Rule 1: Block server code in client components
    {
      name: 'no-server-in-client',
      comment: 'Server-only code should not be imported in client components',
      severity: 'error',
      from: {
        path: '^src/app/.*\\.tsx$',
        pathNot: [
          '\\.server\\.tsx$', // Exclude server components
          'layout\\.tsx$', // Layouts are server by default
          'page\\.tsx$', // Pages are server by default (unless 'use client')
          'loading\\.tsx$', // Loading is server
          'error\\.tsx$', // Error has its own client boundary
          'not-found\\.tsx$', // Not found is server
        ],
      },
      to: {
        path: [
          '^src/collections/', // Payload collections (server-only)
          '^src/.*\\.server\\.', // Explicit server files
          'payload\\.config\\.ts$', // Payload config
        ],
      },
    },

    // Rule 2: Detect circular dependencies
    {
      name: 'no-circular',
      comment: 'Circular dependencies lead to maintenance issues and potential runtime errors',
      severity: 'error',
      from: {},
      to: {
        circular: true,
        // Exclude type-only cycles (these are erased at compile time)
        dependencyTypesNot: ['type-only'],
      },
    },

    // Rule 3: No orphan modules (optional, warn only)
    {
      name: 'no-orphans',
      comment: 'Modules that are not reachable from any entry point',
      severity: 'warn',
      from: {
        orphan: true,
        pathNot: [
          '\\.d\\.ts$', // Type declarations
          '\\.test\\.ts$', // Test files
          '\\.spec\\.ts$', // Spec files
          '\\.e2e\\.spec\\.ts$', // E2E tests
          '__tests__/', // Test directories
          '__mocks__/', // Mock directories
          'tests/', // Test root directory
        ],
      },
      to: {},
    },

    // Rule 4: No deprecated dependencies
    {
      name: 'no-deprecated',
      comment: 'Deprecated modules should be replaced',
      severity: 'warn',
      from: {},
      to: {
        dependencyTypes: ['deprecated'],
      },
    },
  ],

  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    exclude: {
      path: [
        'node_modules',
        '\\.next',
        '\\.open-next',
        'coverage',
        'dist',
        'build',
        // Exclude generated files
        'src/payload-types\\.ts',
        // Exclude migrations (SQL files, not TS)
        'drizzle/migrations',
      ],
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/(@[^/]+/[^/]+|[^/]+)',
      },
      json: {
        highlight: true,
      },
    },
    cache: {
      folder: 'node_modules/.cache/dependency-cruiser',
      strategy: 'content',
    },
  },
}
```

### Validation

```bash
# Run with new rules (may show violations)
pnpm depcruise

# Generate HTML report for visualization
pnpm depcruise:report
# Open depcruise-report.html in browser
```

### Commit Message

```
🏗️ Add architecture validation rules for dependency-cruiser

Add rules to enforce Next.js 15 + Payload CMS architecture:
- no-server-in-client: Block server imports in client components
- no-circular: Detect circular dependencies (except type-only)
- no-orphans: Warn about unreachable modules
- no-deprecated: Warn about deprecated dependencies

Configure exclusions for generated files (payload-types.ts),
build artifacts (.next, .open-next), and test files.

Enable caching for improved CI performance.
```

---

## Commit 3: Generate Baseline for Existing Violations

### Objective

If the codebase has existing architectural violations, generate a baseline file to freeze technical debt and prevent new violations.

### Changes

| File                                        | Action             | Description                     |
| ------------------------------------------- | ------------------ | ------------------------------- |
| `.dependency-cruiser-known-violations.json` | Create (if needed) | Baseline of existing violations |
| `.dependency-cruiser.cjs`                   | Modify (if needed) | Reference baseline file         |
| `.gitignore`                                | Modify             | Add depcruise-report.html       |

### Implementation Details

#### 1. Check for existing violations

```bash
# Run analysis and capture result
pnpm depcruise 2>&1

# If violations exist, generate baseline
```

#### 2. Generate baseline (only if violations exist)

```bash
# Generate JSON output with violations
pnpm exec depcruise src --config .dependency-cruiser.cjs --output-type json > .dependency-cruiser-known-violations.json
```

#### 3. Update .gitignore

```gitignore
# Dependency cruiser reports (generated, not committed)
depcruise-report.html
```

#### 4. Update config to use baseline (if created)

Add to `.dependency-cruiser.cjs` options:

```javascript
options: {
  // ... existing options
  knownViolationsPath: '.dependency-cruiser-known-violations.json',
}
```

### Decision Point

- **If NO violations**: Skip baseline creation, proceed to Commit 4
- **If violations exist**: Create baseline to freeze debt, update config

### Validation

```bash
# With baseline, should pass (no NEW violations)
pnpm depcruise

# Verify baseline is not empty (if created)
cat .dependency-cruiser-known-violations.json | head -20
```

### Commit Message (if baseline needed)

```
📸 Generate baseline for existing architecture violations

Create .dependency-cruiser-known-violations.json to freeze
existing technical debt. This allows CI to pass while we
progressively fix violations.

New violations will still be blocked.
Add depcruise-report.html to .gitignore.
```

### Commit Message (if no baseline needed)

```
🎉 Confirm clean architecture - no baseline needed

The codebase has no existing architectural violations.
No baseline file is required.

Add depcruise-report.html to .gitignore for local reports.
```

---

## Commit 4: Integrate into CI Workflow

### Objective

Add dependency-cruiser step to the quality-gate workflow with GitHub Job Summary output.

### Changes

| File                                 | Action | Description                 |
| ------------------------------------ | ------ | --------------------------- |
| `.github/workflows/quality-gate.yml` | Modify | Add dependency-cruiser step |
| `CLAUDE.md`                          | Modify | Document depcruise commands |

### Implementation Details

#### 1. Update quality-gate.yml

Add after the build step (Layer 3) in the workflow:

```yaml
# ============================================
# LAYER 2+: Architecture Validation
# ============================================

- name: dependency-cruiser - Architecture Validation
  id: depcruise
  run: |
    echo "## Architecture Validation" >> $GITHUB_STEP_SUMMARY
    echo "" >> $GITHUB_STEP_SUMMARY

    # Run dependency-cruiser with JSON output
    if pnpm exec depcruise src --config .dependency-cruiser.cjs --output-type err-long 2>&1 | tee depcruise-output.txt; then
      echo "### :white_check_mark: No architectural violations detected" >> $GITHUB_STEP_SUMMARY
      echo "" >> $GITHUB_STEP_SUMMARY
      echo "All import boundaries and dependency rules are respected." >> $GITHUB_STEP_SUMMARY
    else
      echo "### :x: Architectural violations detected" >> $GITHUB_STEP_SUMMARY
      echo "" >> $GITHUB_STEP_SUMMARY
      echo "\`\`\`" >> $GITHUB_STEP_SUMMARY
      cat depcruise-output.txt >> $GITHUB_STEP_SUMMARY
      echo "\`\`\`" >> $GITHUB_STEP_SUMMARY
      exit 1
    fi
```

#### 2. Update Quality Gate Summary step

```yaml
- name: Quality Gate Summary
  run: |
    echo "::notice::Layer 1: Supply Chain Security (Socket Firewall)"
    echo "::notice::Layer 2: Code Quality (ESLint, Prettier, Knip, Type Sync)"
    echo "::notice::Layer 2+: Architecture Validation (dependency-cruiser)"
    echo "::notice::Layer 3: Build Validation (Next.js No-DB Mode)"
    echo "::notice::Coming: Lighthouse CI, Stryker"
```

#### 3. Update CLAUDE.md

Add to the Code Quality section:

````markdown
# Architecture Validation

```bash
pnpm depcruise           # Run architecture validation
pnpm depcruise:report    # Generate HTML report
```
````

````

### Validation

```bash
# Test locally before pushing
pnpm depcruise

# Verify workflow syntax
# Push to branch and trigger workflow manually
````

### Commit Message

```
:rotating_light: Integrate dependency-cruiser into CI workflow

Add architecture validation step to quality-gate.yml:
- Run after build validation (Layer 2+)
- Generate GitHub Job Summary with results
- Fail workflow on new violations

Update Quality Gate Summary to reflect new layer.
Document depcruise commands in CLAUDE.md.
```

---

## Post-Implementation Tasks

### Immediate

1. [ ] Push all commits to feature branch
2. [ ] Trigger quality-gate workflow manually
3. [ ] Verify GitHub Job Summary shows architecture report
4. [ ] Review any warnings in the output

### Follow-up

1. [ ] If baseline was created, plan violation cleanup
2. [ ] Consider adding more specific rules as codebase grows
3. [ ] Monitor for false positives in PRs

---

## Rollback Plan

If issues arise, rollback in reverse order:

1. **Revert Commit 4**: Remove CI integration
2. **Revert Commit 3**: Remove baseline (if created)
3. **Revert Commit 2**: Remove rules (keep minimal config)
4. **Revert Commit 1**: Remove dependency entirely

```bash
# Example: Full rollback
git revert HEAD~4..HEAD --no-commit
git commit -m "Revert Phase 6: dependency-cruiser integration"
```

---

## Success Metrics

| Metric                     | Target | Measurement                |
| -------------------------- | ------ | -------------------------- |
| New violations detected    | 0      | CI passes                  |
| CI execution time increase | < 30s  | Compare before/after       |
| False positives            | 0      | No manual overrides needed |
| GitHub Summary generated   | Yes    | Visible in Actions         |

---

**Plan Created**: 2025-11-29
**Last Updated**: 2025-11-29
