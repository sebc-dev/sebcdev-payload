# Phase 3 - Atomic Implementation Plan

**Objective**: Configure ESLint 9 and Prettier with Tailwind plugin for consistent code quality in CI/CD

---

## Overview

### Why an Atomic Approach?

The implementation is split into **4 independent commits** to:

- **Facilitate review** - Each commit focuses on a single tool
- **Enable rollback** - If Prettier config breaks something, revert without losing ESLint changes
- **Progressive validation** - Each tool validated independently before integration
- **Clear separation** - ESLint for code quality, Prettier for formatting

### Global Strategy

```
[Commit 1]     →    [Commit 2]      →    [Commit 3]        →    [Commit 4]
     ↓                   ↓                    ↓                     ↓
  Prettier           ESLint              Workflow               Docs
  Config            Enhancement         Integration            Update
     ↓                   ↓                    ↓                     ↓
  Format OK         Lint OK            CI validates          Complete
```

---

## The 4 Atomic Commits

### Commit 1: Prettier Configuration

**Files**: `prettier.config.mjs`, `package.json`, `.prettierignore`
**Size**: ~50 lines
**Duration**: 30-45 min (implementation) + 15-20 min (review)

**Content**:

- Create `prettier.config.mjs` with Tailwind plugin
- Add `prettier-plugin-tailwindcss` as devDependency
- Create `.prettierignore` for generated files
- Add `format` and `format:check` scripts to `package.json`

**Why it's atomic**:

- Single responsibility: Prettier setup only
- No ESLint changes (separate tools)
- Can be validated with `pnpm exec prettier --check .`

**Technical Validation**:

```bash
pnpm exec prettier --check .
```

**Expected Result**: All files pass format check (or list files that need formatting)

**Review Criteria**:

- [ ] Plugin configured correctly
- [ ] Ignore patterns match project structure
- [ ] No conflict with existing formatting

---

### Commit 2: ESLint Configuration Enhancement

**Files**: `eslint.config.mjs`, `package.json`
**Size**: ~80 lines
**Duration**: 45-60 min (implementation) + 20-30 min (review)

**Content**:

- Add `eslint-config-prettier` to disable conflicting rules
- Ensure `payload-types.ts` is ignored
- Configure cache directory for CI
- Verify all existing rules work with Next.js 15 + Payload

**Why it's atomic**:

- Single responsibility: ESLint enhancement only
- Depends on Commit 1 (prettier config exists)
- Can be validated with `pnpm lint`

**Technical Validation**:

```bash
pnpm lint
pnpm exec eslint . --cache --cache-location .eslintcache
```

**Expected Result**: No lint errors, cache file created

**Review Criteria**:

- [ ] `eslint-config-prettier` is last in extends
- [ ] Generated files properly ignored
- [ ] Cache configuration correct
- [ ] No TypeScript errors in config

---

### Commit 3: Workflow Integration

**Files**: `.github/workflows/quality-gate.yml`
**Size**: ~40 lines
**Duration**: 30-45 min (implementation) + 15-20 min (review)

**Content**:

- Add ESLint step with cache restore/save
- Add Prettier check step
- Configure GitHub Problem Matchers for annotations
- Position after Socket.dev, before build steps

**Why it's atomic**:

- Single responsibility: CI integration only
- Depends on Commits 1-2 (tools configured)
- Can be validated by running workflow manually

**Technical Validation**:

```bash
# Validate YAML syntax
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/quality-gate.yml'))"

# Dry run (local)
pnpm lint
pnpm exec prettier --check .
```

**Expected Result**: YAML valid, local checks pass

**Review Criteria**:

- [ ] Cache paths correct
- [ ] Problem Matchers configured
- [ ] Step order logical
- [ ] Permissions unchanged (already have contents: read)

---

### Commit 4: Documentation Update

**Files**: `CLAUDE.md`, `docs/guides/linting-formatting.md` (new)
**Size**: ~100 lines
**Duration**: 20-30 min (implementation) + 10-15 min (review)

**Content**:

- Update CLAUDE.md with lint/format commands
- Create developer guide for linting and formatting
- Document ESLint rules and Prettier config
- Add troubleshooting section

**Why it's atomic**:

- Single responsibility: Documentation only
- Depends on Commits 1-3 (tools working)
- Can be validated by reading docs

**Technical Validation**:

```bash
# Check markdown syntax
cat docs/guides/linting-formatting.md
```

**Expected Result**: Clear, accurate documentation

**Review Criteria**:

- [ ] Commands are accurate
- [ ] Examples work
- [ ] Troubleshooting covers common issues

---

## Implementation Workflow

### Step-by-Step

1. **Read specification**: Understand Phase 3 requirements
2. **Setup environment**: Follow ENVIRONMENT_SETUP.md
3. **Implement Commit 1**: Prettier configuration
4. **Validate Commit 1**: Run `pnpm exec prettier --check .`
5. **Commit Commit 1**: Use provided commit message
6. **Implement Commit 2**: ESLint enhancement
7. **Validate Commit 2**: Run `pnpm lint`
8. **Commit Commit 2**: Use provided commit message
9. **Implement Commit 3**: Workflow integration
10. **Validate Commit 3**: Check YAML syntax
11. **Commit Commit 3**: Use provided commit message
12. **Implement Commit 4**: Documentation
13. **Validate Commit 4**: Review docs
14. **Commit Commit 4**: Use provided commit message
15. **Final validation**: Complete VALIDATION_CHECKLIST.md

### Validation at Each Step

After each commit:

```bash
# TypeScript check
pnpm exec tsc --noEmit

# Linting
pnpm lint

# Prettier check
pnpm exec prettier --check .
```

All must pass before moving to next commit.

---

## Commit Metrics

| Commit                  | Files | Lines    | Implementation | Review | Total      |
| ----------------------- | ----- | -------- | -------------- | ------ | ---------- |
| 1. Prettier Config      | 3     | ~50      | 30 min         | 15 min | 45 min     |
| 2. ESLint Enhancement   | 2     | ~80      | 45 min         | 20 min | 65 min     |
| 3. Workflow Integration | 1     | ~40      | 30 min         | 15 min | 45 min     |
| 4. Documentation        | 2     | ~100     | 20 min         | 10 min | 30 min     |
| **TOTAL**               | **8** | **~270** | **2-2.5h**     | **1h** | **3-3.5h** |

---

## Atomic Approach Benefits

### For Developers

- **Clear focus**: One tool at a time
- **Easy testing**: Each commit validates independently
- **Safe rollback**: Revert single tool if issues arise

### For Reviewers

- **Fast review**: 15-30 min per commit
- **Focused**: Single responsibility per commit
- **Quality**: Easier to spot configuration issues

### For the Project

- **Rollback-safe**: Revert Prettier without losing ESLint
- **Historical**: Clear progression in git history
- **Maintainable**: Each config documented separately

---

## Best Practices

### Commit Messages (Gitmoji)

Format:

```
<gitmoji> <short description>

- Point 1: detail
- Point 2: detail
```

Examples:

- `🎨 Add Prettier configuration with Tailwind plugin`
- `🚨 Enhance ESLint config with eslint-config-prettier`
- `👷 Add ESLint and Prettier steps to quality-gate workflow`
- `📝 Add linting and formatting documentation`

### Review Checklist

Before committing:

- [ ] No console.logs or debug code
- [ ] Config files have no syntax errors
- [ ] All validation commands pass
- [ ] Documentation is accurate

---

## Important Points

### Do's

- Use `eslint-config-prettier` (disables conflicting rules)
- Exclude generated files (`payload-types.ts`)
- Enable caching in CI
- Use Problem Matchers for GitHub annotations

### Don'ts

- Don't use `eslint-plugin-prettier` (causes conflicts)
- Don't lint generated files
- Don't skip cache in CI (slow)
- Don't modify unrelated rules

---

## FAQ

**Q: What if Prettier and ESLint conflict?**
A: `eslint-config-prettier` must be last in ESLint config to disable conflicting rules.

**Q: Why cache ESLint in CI?**
A: ESLint cache stores results, making subsequent runs much faster.

**Q: Can I change the Prettier tab width?**
A: Yes, but keep it consistent. Current: 2 spaces (default).

**Q: What if linting fails on existing code?**
A: Fix the issues or add them to ignore list with justification.

---

**Document Created**: 2025-11-29
**Last Updated**: 2025-11-29
