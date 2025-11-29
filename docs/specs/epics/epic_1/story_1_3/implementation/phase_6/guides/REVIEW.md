# Code Review Guide - Phase 6: Architecture Validation

**Phase**: Architecture Validation (dependency-cruiser)
**Purpose**: Commit-by-commit review guide for code reviewers

---

## Review Overview

This phase adds architecture validation to the CI pipeline. The review focuses on:

1. Correct tool installation and configuration
2. Appropriate architecture rules for Next.js 15 + Payload CMS
3. Proper CI integration with actionable output
4. Documentation updates

---

## General Review Principles

### What to Look For

- [ ] **Correctness**: Rules detect real architectural violations
- [ ] **No False Positives**: Legitimate code patterns are not flagged
- [ ] **Performance**: Analysis completes in reasonable time (< 30s)
- [ ] **Maintainability**: Configuration is clear and documented
- [ ] **CI Integration**: Output is useful in GitHub Actions

### Red Flags

- Rules that block framework conventions (Next.js pages, layouts)
- Missing exclusions for generated files
- Overly broad rules that catch everything
- Hard-coded paths that won't work in CI

---

## Commit 1 Review: Installation and Setup

### Files to Review

| File | Review Focus |
|------|--------------|
| `package.json` | Correct script definitions |
| `.dependency-cruiser.cjs` | Valid minimal configuration |
| `pnpm-lock.yaml` | Clean dependency addition |

### Checklist

#### package.json

- [ ] `dependency-cruiser` added to `devDependencies`
- [ ] Version is recent (v16.x or higher recommended)
- [ ] Scripts are correctly named:
  - [ ] `depcruise` - runs validation
  - [ ] `depcruise:report` - generates HTML report
- [ ] Script commands use correct paths (`src`)
- [ ] Script commands reference config file correctly

Example of correct scripts:

```json
{
  "scripts": {
    "depcruise": "depcruise src --config .dependency-cruiser.cjs",
    "depcruise:report": "depcruise src --config .dependency-cruiser.cjs --output-type html > depcruise-report.html"
  }
}
```

#### .dependency-cruiser.cjs

- [ ] Uses CommonJS format (`.cjs` extension)
- [ ] Has JSDoc type annotation for IDE support
- [ ] `doNotFollow` excludes `node_modules`
- [ ] `tsPreCompilationDeps` is `true` (for TypeScript support)
- [ ] `tsConfig` points to correct file

Example of correct minimal config:

```javascript
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
  },
}
```

### Questions to Ask

1. Does `pnpm depcruise` run successfully?
2. Is the output format appropriate?
3. Are there any warnings during installation?

---

## Commit 2 Review: Architecture Rules

### Files to Review

| File | Review Focus |
|------|--------------|
| `.dependency-cruiser.cjs` | Rule definitions and exclusions |

### Checklist

#### Rule: no-server-in-client

- [ ] Severity is `error` (blocks CI)
- [ ] `from` path targets client components correctly
- [ ] `from.pathNot` excludes server components:
  - [ ] `.server.tsx` files
  - [ ] `layout.tsx` files
  - [ ] `page.tsx` files
  - [ ] `loading.tsx` files
  - [ ] `error.tsx` files
  - [ ] `not-found.tsx` files
- [ ] `to` path blocks server-only imports:
  - [ ] `src/collections/` (Payload)
  - [ ] `payload.config.ts`
  - [ ] `.server.` files

#### Rule: no-circular

- [ ] Severity is `error` (blocks CI)
- [ ] `dependencyTypesNot: ['type-only']` excludes type imports
- [ ] Does not flag legitimate circular type references

#### Rule: no-orphans (if included)

- [ ] Severity is `warn` (informational only)
- [ ] Excludes test files (`.test.ts`, `.spec.ts`)
- [ ] Excludes type declarations (`.d.ts`)
- [ ] Excludes mock files

#### Rule: no-deprecated (if included)

- [ ] Severity is `warn` (informational only)
- [ ] Correctly identifies deprecated modules

#### Exclusions

- [ ] `node_modules` excluded from analysis
- [ ] `.next` and `.open-next` excluded
- [ ] `src/payload-types.ts` excluded (generated file)
- [ ] `drizzle/migrations` excluded
- [ ] `coverage`, `dist`, `build` excluded

#### Caching

- [ ] Cache is enabled
- [ ] Cache folder is in `node_modules/.cache/`
- [ ] Cache strategy is `content` (not timestamp)

### Questions to Ask

1. Are the rules too strict? Will they block legitimate patterns?
2. Are the rules too loose? Will they miss real violations?
3. Is the Next.js App Router pattern correctly handled?
4. Are Payload CMS specifics accounted for?

---

## Commit 3 Review: Baseline (Conditional)

### Scenario A: No Baseline Needed

#### Files to Review

| File | Review Focus |
|------|--------------|
| `.gitignore` | Report file excluded |

#### Checklist

- [ ] `depcruise-report.html` added to `.gitignore`
- [ ] Commit message confirms clean architecture
- [ ] No `.dependency-cruiser-known-violations.json` created

### Scenario B: Baseline Created

#### Files to Review

| File | Review Focus |
|------|--------------|
| `.dependency-cruiser.cjs` | Baseline reference added |
| `.dependency-cruiser-known-violations.json` | Valid JSON, real violations |
| `.gitignore` | Report file excluded |

#### Checklist

- [ ] Baseline JSON is valid and parseable
- [ ] `knownViolationsPath` added to config options
- [ ] Baseline contains only existing violations (not new ones)
- [ ] Number of violations is documented in commit message
- [ ] `depcruise-report.html` added to `.gitignore`

### Questions to Ask

1. If baseline exists, are the violations legitimate technical debt?
2. Is there a plan to address baselined violations?
3. Could any baselined violations be fixed immediately?

---

## Commit 4 Review: CI Integration

### Files to Review

| File | Review Focus |
|------|--------------|
| `.github/workflows/quality-gate.yml` | Step placement and output |
| `CLAUDE.md` | Documentation accuracy |

### Checklist

#### Workflow Step

- [ ] Step is placed after build validation (Layer 3)
- [ ] Step has descriptive `name`
- [ ] Step has unique `id` for referencing
- [ ] Output is written to `$GITHUB_STEP_SUMMARY`
- [ ] Success path shows positive message
- [ ] Failure path shows violation details
- [ ] Exit code is correct:
  - [ ] `exit 0` on success
  - [ ] `exit 1` on failure
- [ ] Output is captured with `tee` for summary
- [ ] Markdown formatting is correct (code blocks, headers)

Example of correct step:

```yaml
- name: dependency-cruiser - Architecture Validation
  id: depcruise
  run: |
    echo "## Architecture Validation" >> $GITHUB_STEP_SUMMARY
    if pnpm exec depcruise src --config .dependency-cruiser.cjs --output-type err-long 2>&1 | tee depcruise-output.txt; then
      echo "### :white_check_mark: No violations" >> $GITHUB_STEP_SUMMARY
    else
      echo "### :x: Violations found" >> $GITHUB_STEP_SUMMARY
      cat depcruise-output.txt >> $GITHUB_STEP_SUMMARY
      exit 1
    fi
```

#### Quality Gate Summary Update

- [ ] Summary includes Layer 2+ (Architecture Validation)
- [ ] Emoji indicates status (checkmark for enabled)
- [ ] Coming soon items updated if applicable

#### CLAUDE.md Documentation

- [ ] Commands are accurate
- [ ] Placement is logical (Code Quality or new section)
- [ ] Examples are runnable

### Questions to Ask

1. Is the GitHub Step Summary readable and actionable?
2. Will developers understand how to fix violations from the output?
3. Is the step placement logical in the workflow?

---

## Final Review Checklist

Before approving the PR:

### Functionality

- [ ] `pnpm depcruise` works locally
- [ ] CI workflow passes
- [ ] GitHub Step Summary is generated correctly
- [ ] No false positives on existing code

### Code Quality

- [ ] Configuration is well-structured
- [ ] Rules are appropriately scoped
- [ ] Exclusions are justified and documented
- [ ] Error messages are helpful

### Documentation

- [ ] CLAUDE.md updated with new commands
- [ ] Commit messages follow gitmoji convention
- [ ] Technical debt is documented (if baseline exists)

### Testing

- [ ] Phase author verified locally
- [ ] CI workflow triggered and passed
- [ ] GitHub Actions summary reviewed

---

## Review Feedback Templates

### Approval

```markdown
Approved

The dependency-cruiser configuration looks solid:
- Rules correctly target Next.js 15 + Payload CMS architecture
- Exclusions are appropriate for generated files
- CI integration produces actionable output

No issues found.
```

### Request Changes

```markdown
Changes Requested

Please address the following:

1. **Rule: no-server-in-client**
   - Missing exclusion for `error.tsx` which uses client boundary
   - Consider: `pathNot: ['error\\.tsx$']`

2. **Workflow step**
   - Output format should use code blocks for readability
   - Add: echo "\`\`\`" before/after violation output

3. **Documentation**
   - CLAUDE.md section should be under "Code Quality"
```

### Comment

```markdown
**Question**: The `no-orphans` rule is set to `warn`. Should this be `error` to ensure we don't accumulate dead code?

Currently this would allow orphan modules to exist without blocking CI. Let me know if this is intentional.
```

---

## Time Estimates

| Commit | Review Time | Notes |
|--------|-------------|-------|
| Commit 1 | 10-15 min | Straightforward installation |
| Commit 2 | 20-30 min | Careful rule review needed |
| Commit 3 | 5-15 min | Depends on baseline complexity |
| Commit 4 | 15-20 min | Workflow syntax review |

**Total Review Time**: 50-80 minutes

---

**Review Guide Created**: 2025-11-29
**Last Updated**: 2025-11-29
