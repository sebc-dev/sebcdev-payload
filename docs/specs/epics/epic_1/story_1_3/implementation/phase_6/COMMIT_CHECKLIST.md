# Commit Checklist - Phase 6: Architecture Validation

**Phase**: Architecture Validation (dependency-cruiser)
**Total Commits**: 4
**Use this checklist**: Before and after each commit

---

## Pre-Commit Global Checklist

Before starting ANY commit in this phase:

- [ ] On correct branch (`story_1_3` or feature branch)
- [ ] Working directory is clean (`git status`)
- [ ] Latest changes pulled (`git pull origin story_1_3`)
- [ ] Dependencies installed (`pnpm install`)
- [ ] Build passes (`pnpm build`)

---

## Commit 1: Install and Configure dependency-cruiser

### Pre-Implementation Checklist

- [ ] Verify no existing `.dependency-cruiser.*` files
- [ ] Check current devDependencies for conflicts
- [ ] Confirm Node.js version >= 18 (required by dependency-cruiser)

### Implementation Checklist

- [ ] Install dependency-cruiser

  ```bash
  pnpm add -D dependency-cruiser
  ```

- [ ] Verify installation

  ```bash
  pnpm exec depcruise --version
  # Expected: v16.x.x or higher
  ```

- [ ] Add npm scripts to package.json

  ```json
  "depcruise": "depcruise src --config .dependency-cruiser.cjs",
  "depcruise:report": "depcruise src --config .dependency-cruiser.cjs --output-type html > depcruise-report.html"
  ```

- [ ] Create `.dependency-cruiser.cjs` with minimal config:

  ```javascript
  /** @type {import('dependency-cruiser').IConfiguration} */
  module.exports = {
    forbidden: [],
    options: {
      doNotFollow: { path: 'node_modules' },
      tsPreCompilationDeps: true,
      tsConfig: { fileName: 'tsconfig.json' },
      enhancedResolveOptions: {
        exportsFields: ['exports'],
        conditionNames: ['import', 'require', 'node', 'default'],
      },
    },
  }
  ```

### Validation Checklist

- [ ] Run `pnpm depcruise` - should complete without errors
- [ ] Run `pnpm lint` - no ESLint errors
- [ ] Run `pnpm build` - build still passes
- [ ] Verify `pnpm-lock.yaml` updated correctly

### Files Changed

- [ ] `package.json` (2 script additions + 1 devDependency)
- [ ] `.dependency-cruiser.cjs` (new file)
- [ ] `pnpm-lock.yaml` (auto-updated)

### Commit Command

```bash
git add package.json .dependency-cruiser.cjs pnpm-lock.yaml
git commit -m "$(cat <<'EOF'
🔧 Install and configure dependency-cruiser

- Add dependency-cruiser as dev dependency
- Create minimal .dependency-cruiser.cjs configuration
- Add depcruise and depcruise:report npm scripts

This enables architecture validation for the codebase.
The rules will be added in the next commit.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Commit 2: Add Architecture Validation Rules

### Pre-Implementation Checklist

- [ ] Commit 1 is complete and pushed
- [ ] `pnpm depcruise` runs successfully
- [ ] Understand Next.js App Router file conventions

### Implementation Checklist

- [ ] Update `.dependency-cruiser.cjs` with forbidden rules:
  - [ ] `no-server-in-client` rule configured
  - [ ] `no-circular` rule configured
  - [ ] `no-orphans` rule configured (warn)
  - [ ] `no-deprecated` rule configured (warn)

- [ ] Configure exclusions:
  - [ ] `node_modules` excluded
  - [ ] `.next` and `.open-next` excluded
  - [ ] `src/payload-types.ts` excluded
  - [ ] `drizzle/migrations` excluded
  - [ ] `coverage`, `dist`, `build` excluded

- [ ] Enable caching:

  ```javascript
  cache: {
    folder: 'node_modules/.cache/dependency-cruiser',
    strategy: 'content',
  }
  ```

### Validation Checklist

- [ ] Run `pnpm depcruise` - note any violations
- [ ] Check violation types:
  - [ ] `error` violations require fixing or baseline
  - [ ] `warn` violations are informational
- [ ] Generate HTML report: `pnpm depcruise:report`
- [ ] Open `depcruise-report.html` in browser to visualize dependencies

### Files Changed

- [ ] `.dependency-cruiser.cjs` (rules added)

### Commit Command

```bash
git add .dependency-cruiser.cjs
git commit -m "$(cat <<'EOF'
🏗️ Add architecture validation rules for dependency-cruiser

Add rules to enforce Next.js 15 + Payload CMS architecture:
- no-server-in-client: Block server imports in client components
- no-circular: Detect circular dependencies (except type-only)
- no-orphans: Warn about unreachable modules
- no-deprecated: Warn about deprecated dependencies

Configure exclusions for generated files (payload-types.ts),
build artifacts (.next, .open-next), and test files.

Enable caching for improved CI performance.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Commit 3: Generate Baseline (Conditional)

### Decision Point

Run `pnpm depcruise` and check output:

- **If NO violations (exit code 0)**: Skip baseline creation
- **If violations exist (exit code 1)**: Create baseline

### Scenario A: No Violations (Clean Architecture)

#### Implementation Checklist

- [x] Add to `.gitignore`:

  ```gitignore
  # Dependency cruiser reports (generated, not committed)
  depcruise-report.html
  ```

#### Validation Checklist

- [x] Confirm `pnpm depcruise` passes
- [x] No `.dependency-cruiser-known-violations.json` created

#### Files Changed

- [x] `.gitignore` (1 line improved for clarity)

#### Commit Command

```bash
git add .gitignore
git commit -m "$(cat <<'EOF'
🎉 Confirm clean architecture - no baseline needed

The codebase has no existing architectural violations.
No baseline file is required.

Add depcruise-report.html to .gitignore for local reports.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Scenario B: Violations Exist (Baseline Required)

#### Implementation Checklist

- [ ] Generate baseline JSON:

  ```bash
  pnpm exec depcruise src --config .dependency-cruiser.cjs --output-type json > .dependency-cruiser-known-violations.json
  ```

- [ ] Update `.dependency-cruiser.cjs` to reference baseline:

  ```javascript
  options: {
    // ... existing options
    knownViolationsPath: '.dependency-cruiser-known-violations.json',
  }
  ```

- [ ] Add to `.gitignore`:

  ```gitignore
  # Dependency cruiser reports (generated, not committed)
  depcruise-report.html
  ```

#### Validation Checklist

- [ ] Verify baseline file is valid JSON
- [ ] Run `pnpm depcruise` - should now pass (violations are baselined)
- [ ] Count violations in baseline for documentation:

  ```bash
  cat .dependency-cruiser-known-violations.json | grep '"rule":' | wc -l
  ```

#### Files Changed

- [ ] `.dependency-cruiser.cjs` (knownViolationsPath added)
- [ ] `.dependency-cruiser-known-violations.json` (new file)
- [ ] `.gitignore` (1 line added)

#### Commit Command

```bash
git add .dependency-cruiser.cjs .dependency-cruiser-known-violations.json .gitignore
git commit -m "$(cat <<'EOF'
📸 Generate baseline for existing architecture violations

Create .dependency-cruiser-known-violations.json to freeze
existing technical debt. This allows CI to pass while we
progressively fix violations.

New violations will still be blocked.
Add depcruise-report.html to .gitignore.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Commit 4: Integrate into CI Workflow

### Pre-Implementation Checklist

- [ ] Previous commits are complete
- [ ] `pnpm depcruise` passes locally
- [ ] Understand current workflow structure in `.github/workflows/quality-gate.yml`

### Implementation Checklist

- [ ] Add dependency-cruiser step to `quality-gate.yml`:

  Location: After build step, before Quality Gate Summary

  ```yaml
  # ============================================
  # LAYER 2+: Architecture Validation
  # ============================================

  - name: dependency-cruiser - Architecture Validation
    id: depcruise
    run: |
      echo "## Architecture Validation" >> $GITHUB_STEP_SUMMARY
      echo "" >> $GITHUB_STEP_SUMMARY

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

- [ ] Update Quality Gate Summary step:

  ```yaml
  - name: Quality Gate Summary
    run: |
      echo "::notice::✅ Layer 1: Supply Chain Security (Socket Firewall)"
      echo "::notice::✅ Layer 2: Code Quality (ESLint, Prettier, Knip, Type Sync)"
      echo "::notice::✅ Layer 2+: Architecture Validation (dependency-cruiser)"
      echo "::notice::✅ Layer 3: Build Validation (Next.js No-DB Mode)"
      echo "::notice::⏳ Coming: Lighthouse CI, Stryker"
  ```

- [ ] Update CLAUDE.md with commands:

  Add to Common Commands section or create new Architecture section:

  ````markdown
  # Architecture Validation

  ```bash
  pnpm depcruise           # Run architecture validation
  pnpm depcruise:report    # Generate HTML report
  ```
  ````

  ```

  ```

### Validation Checklist

- [ ] Verify YAML syntax is valid:

  ```bash
  # Optional: Use yamllint or similar
  cat .github/workflows/quality-gate.yml | head -50
  ```

- [ ] Run `pnpm depcruise` one more time locally
- [ ] Verify CLAUDE.md changes are correct

### Files Changed

- [ ] `.github/workflows/quality-gate.yml` (step added + summary updated)
- [ ] `CLAUDE.md` (commands documented)

### Commit Command

```bash
git add .github/workflows/quality-gate.yml CLAUDE.md
git commit -m "$(cat <<'EOF'
🚨 Integrate dependency-cruiser into CI workflow

Add architecture validation step to quality-gate.yml:
- Run after build validation (Layer 2+)
- Generate GitHub Job Summary with results
- Fail workflow on new violations

Update Quality Gate Summary to reflect new layer.
Document depcruise commands in CLAUDE.md.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Post-Commit Global Checklist

After ALL commits are complete:

- [ ] Push all commits to remote

  ```bash
  git push origin story_1_3
  ```

- [ ] Trigger quality-gate workflow manually in GitHub Actions

- [ ] Verify workflow passes

- [ ] Check GitHub Job Summary shows Architecture Validation section

- [ ] Review any warnings in the output

- [ ] Update PHASES_PLAN.md progress tracking:

  ```markdown
  - [x] Phase 6: Architecture Validation (dependency-cruiser) - Status: COMPLETED, Actual duration: Xh, Notes: Y violations baselined
  ```

---

## Troubleshooting

### Common Issues

#### Issue: "Cannot find module 'typescript'"

**Solution**: Ensure TypeScript is installed

```bash
pnpm add -D typescript
```

#### Issue: "Could not find tsconfig.json"

**Solution**: Verify path in config matches actual file

```javascript
tsConfig: {
  fileName: './tsconfig.json',
}
```

#### Issue: Too many violations

**Solution**: Use baseline approach (Commit 3 Scenario B)

#### Issue: Rule triggers on legitimate code

**Solution**: Add exclusion pattern to rule

```javascript
from: {
  pathNot: ['specific-file-to-exclude.ts'],
}
```

---

## Quick Reference

### Essential Commands

| Command                         | Purpose                                  |
| ------------------------------- | ---------------------------------------- |
| `pnpm depcruise`                | Run architecture validation              |
| `pnpm depcruise:report`         | Generate HTML visualization              |
| `pnpm exec depcruise --version` | Check version                            |
| `pnpm exec depcruise --init`    | Generate default config (reference only) |

### Exit Codes

| Code | Meaning             |
| ---- | ------------------- |
| 0    | No violations       |
| 1    | Violations found    |
| 2    | Configuration error |

---

**Checklist Created**: 2025-11-29
**Last Updated**: 2025-11-29
