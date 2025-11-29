# Phase 3 - Final Validation Checklist

Complete validation checklist before marking Phase 3 as complete.

---

## 1. Commits and Structure

- [ ] All 4 atomic commits completed
- [ ] Commits follow Gitmoji naming convention
- [ ] Commit order is logical (Prettier → ESLint → Workflow → Docs)
- [ ] Each commit is focused (single responsibility)
- [ ] Git history is clean

**Verification**:

```bash
git log --oneline -4
```

---

## 2. Prettier Configuration

- [ ] `prettier.config.mjs` exists at repository root
- [ ] Uses ESM syntax (`export default`)
- [ ] `prettier-plugin-tailwindcss` configured
- [ ] Options match project conventions
- [ ] `.prettierignore` exists with correct patterns

**Verification**:

```bash
# Check config loads
node -e "import('./prettier.config.mjs').then(c => console.log(c.default))"

# Check formatting passes
pnpm format:check
```

---

## 3. ESLint Configuration

- [ ] `eslint.config.mjs` updated
- [ ] `eslint-config-prettier` is **LAST** in extends array
- [ ] All existing rules preserved
- [ ] Generated files in ignores array
- [ ] No TypeScript errors in config

**Verification**:

```bash
# Check lint passes
pnpm lint

# Check cache works
pnpm exec eslint . --cache --cache-location .eslintcache
ls -la .eslintcache
```

---

## 4. No Conflicts

- [ ] ESLint and Prettier do not conflict
- [ ] No formatting rules in ESLint (disabled by prettier config)
- [ ] Both tools can run in sequence

**Verification**:

```bash
# Run both tools
pnpm lint && pnpm format:check

# Should complete without conflicts
```

---

## 5. Ignore Patterns

- [ ] `src/payload-types.ts` ignored by ESLint
- [ ] `src/payload-types.ts` ignored by Prettier
- [ ] `.next/` ignored by both
- [ ] `drizzle/migrations/` ignored by both
- [ ] `node_modules/` ignored by both

**Verification**:

```bash
# Files should not be processed
pnpm exec eslint src/payload-types.ts 2>&1 || echo "Expected: ignored"
pnpm exec prettier --check src/payload-types.ts 2>&1 || echo "Expected: ignored"
```

---

## 6. Package.json Scripts

- [ ] `format` script exists
- [ ] `format:check` script exists
- [ ] `lint` script unchanged (still works)
- [ ] Dependencies updated in devDependencies

**Verification**:

```bash
# Check scripts exist
cat package.json | grep -E '"format|"lint'

# Run scripts
pnpm format --help
pnpm format:check --help
pnpm lint --help
```

---

## 7. CI Workflow Integration

- [ ] ESLint step added to quality-gate.yml
- [ ] Prettier Check step added to quality-gate.yml
- [ ] Both steps positioned after Socket.dev
- [ ] `continue-on-error: false` for both (blocking)
- [ ] YAML syntax valid

**Verification**:

```bash
# Check YAML valid
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/quality-gate.yml')); print('OK')"

# Check steps exist
grep -A2 "ESLint" .github/workflows/quality-gate.yml
grep -A2 "Prettier" .github/workflows/quality-gate.yml
```

---

## 8. Documentation

- [ ] `docs/guides/linting-formatting.md` exists
- [ ] Commands are accurate and work
- [ ] IDE integration documented
- [ ] Troubleshooting section included
- [ ] No broken links

**Verification**:

```bash
# Check file exists
ls -la docs/guides/linting-formatting.md

# Verify documented commands work
pnpm lint
pnpm format:check
pnpm format
```

---

## 9. Tailwind Plugin

- [ ] Plugin installed (`prettier-plugin-tailwindcss`)
- [ ] Classes get sorted correctly
- [ ] No errors in plugin loading

**Verification**:

```bash
# Check plugin installed
pnpm list prettier-plugin-tailwindcss

# Test class ordering (manual test)
# Create file with unordered classes, run prettier, verify order
```

---

## 10. CI/CD Functional Test

- [ ] Push changes to branch
- [ ] Run Quality Gate workflow manually
- [ ] ESLint step passes (green)
- [ ] Prettier step passes (green)
- [ ] No unexpected failures

**Verification**:

```bash
# Push and test in GitHub
git push origin story_1_3
# Then run workflow manually in GitHub Actions
```

---

## Validation Commands Summary

Run all these commands before final approval:

```bash
# 1. Check TypeScript
pnpm exec tsc --noEmit

# 2. Check linting
pnpm lint

# 3. Check formatting
pnpm format:check

# 4. Verify configs load
node -e "import('./prettier.config.mjs').then(c => console.log('Prettier OK'))"
node -e "import('./eslint.config.mjs').then(c => console.log('ESLint OK'))"

# 5. Verify YAML
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/quality-gate.yml')); print('YAML OK')"

# 6. Verify no conflicts
pnpm lint && pnpm format:check && echo "No conflicts!"
```

**All must pass with no errors.**

---

## Success Metrics

| Metric        | Target | Actual | Status |
| ------------- | ------ | ------ | ------ |
| Commits       | 4      | -      | ⏳     |
| Lint Errors   | 0      | -      | ⏳     |
| Format Errors | 0      | -      | ⏳     |
| Config Errors | 0      | -      | ⏳     |
| CI Status     | ✅     | -      | ⏳     |

---

## Final Verdict

Select one:

- [ ] **APPROVED** - Phase 3 is complete and ready
- [ ] **CHANGES REQUESTED** - Issues to fix:
  - [List issues]
- [ ] **REJECTED** - Major rework needed:
  - [List major issues]

---

## Next Steps

### If Approved

1. [ ] Update INDEX.md status to COMPLETED
2. [ ] Update EPIC_TRACKING.md progress (3/8)
3. [ ] Merge phase branch to main (or continue to Phase 4)
4. [ ] Prepare for Phase 4 (Knip/Type Sync)

### If Changes Requested

1. [ ] Address all feedback items
2. [ ] Re-run validation
3. [ ] Request re-review

### If Rejected

1. [ ] Document issues
2. [ ] Plan rework
3. [ ] Schedule review

---

**Validation completed by**: [Name]
**Date**: [Date]
**Notes**: [Additional notes]

---

**Document Created**: 2025-11-29
**Last Updated**: 2025-11-29
