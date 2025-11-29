# Phase 3 - Code Review Guide

Complete guide for reviewing the Phase 3 implementation (Code Quality: Linting & Formatting).

---

## Review Objective

Validate that the implementation:

- Configures Prettier with Tailwind plugin correctly
- Enhances ESLint config without breaking existing rules
- Integrates both tools into CI/CD workflow
- Documents configuration for developers
- Follows project standards

---

## Review Approach

Phase 3 is split into **4 atomic commits**. You can:

**Option A: Commit-by-commit review** (recommended)

- Easier to digest (15-30 min per commit)
- Progressive validation
- Targeted feedback

**Option B: Global review at once**

- Faster (~1.5h total)
- Immediate overview
- Requires more focus

**Estimated Total Time**: 1-2h

---

## Commit-by-Commit Review

### Commit 1: Prettier Configuration

**Files**: `prettier.config.mjs`, `.prettierignore`, `package.json` (~50 lines)
**Duration**: 15-20 minutes

#### Review Checklist

##### Configuration File

- [ ] `prettier.config.mjs` uses ESM syntax (`export default`)
- [ ] Plugin array includes `prettier-plugin-tailwindcss`
- [ ] Options are reasonable (semi, singleQuote, tabWidth, etc.)
- [ ] Config matches project conventions

##### Ignore File

- [ ] `.prettierignore` includes all generated files
- [ ] Build directories excluded (`.next/`, `.open-next/`)
- [ ] `payload-types.ts` explicitly ignored
- [ ] Migration files ignored

##### Package.json

- [ ] `prettier-plugin-tailwindcss` in devDependencies
- [ ] `format` script added
- [ ] `format:check` script added

#### Technical Validation

```bash
pnpm exec prettier --check .
pnpm format
pnpm format:check
```

**Expected Result**: All files pass format check

#### Questions to Ask

1. Are the Prettier options consistent with team preferences?
2. Are all generated files properly ignored?
3. Does the Tailwind plugin work (test on a component with classes)?

---

### Commit 2: ESLint Configuration Enhancement

**Files**: `eslint.config.mjs`, `package.json` (~80 lines)
**Duration**: 20-30 minutes

#### Review Checklist

##### Configuration File

- [ ] `eslint-config-prettier` installed
- [ ] `...compat.extends('prettier')` is **LAST** in array
- [ ] Existing rules preserved
- [ ] Ignores array includes generated files:
  - [ ] `.next/`
  - [ ] `.open-next/`
  - [ ] `node_modules/`
  - [ ] `src/payload-types.ts`
  - [ ] `drizzle/migrations/`

##### Compatibility

- [ ] No conflicts between ESLint and Prettier
- [ ] TypeScript rules still work
- [ ] Next.js rules still work

##### Package.json

- [ ] `eslint-config-prettier` in devDependencies

#### Technical Validation

```bash
pnpm lint
pnpm exec eslint . --cache --cache-location .eslintcache
ls -la .eslintcache
```

**Expected Result**: Lint passes, cache file created

#### Questions to Ask

1. Is `eslint-config-prettier` definitely last in the config?
2. Are all generated files properly ignored?
3. Does caching work correctly?

---

### Commit 3: Workflow Integration

**Files**: `.github/workflows/quality-gate.yml` (~40 lines)
**Duration**: 15-20 minutes

#### Review Checklist

##### ESLint Step

- [ ] Step named clearly ("ESLint")
- [ ] Command: `pnpm lint --format stylish`
- [ ] `continue-on-error: false` (blocking)
- [ ] Positioned after Socket.dev

##### Prettier Step

- [ ] Step named clearly ("Prettier Check")
- [ ] Command: `pnpm exec prettier --check .`
- [ ] `continue-on-error: false` (blocking)
- [ ] Positioned after ESLint

##### Workflow Structure

- [ ] YAML syntax valid
- [ ] Proper indentation
- [ ] Layer comment updated (LAYER 2: Code Quality)
- [ ] Placeholder message updated

#### Technical Validation

```bash
# Validate YAML
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/quality-gate.yml'))"

# Local test
pnpm lint && pnpm format:check
```

**Expected Result**: YAML valid, both checks pass

#### Questions to Ask

1. Is the step order logical?
2. Should these be blocking or warnings?
3. Is the format output suitable for GitHub annotations?

---

### Commit 4: Documentation Update

**Files**: `docs/guides/linting-formatting.md` (~100 lines)
**Duration**: 10-15 minutes

#### Review Checklist

##### Content Accuracy

- [ ] Commands are correct and work
- [ ] File paths are accurate
- [ ] Configuration options documented correctly
- [ ] IDE integration instructions work

##### Completeness

- [ ] ESLint configuration explained
- [ ] Prettier configuration explained
- [ ] Troubleshooting section included
- [ ] IDE setup covered (VS Code at minimum)

##### Quality

- [ ] Clear and readable
- [ ] Examples are copy-pasteable
- [ ] No typos or broken links

#### Technical Validation

```bash
# Verify commands work
pnpm lint
pnpm format:check
pnpm format
```

**Expected Result**: All documented commands work

#### Questions to Ask

1. Would a new developer understand the setup?
2. Are the troubleshooting tips accurate?
3. Is anything missing that should be documented?

---

## Global Validation

After reviewing all commits:

### Architecture & Design

- [ ] Clear separation between ESLint (quality) and Prettier (formatting)
- [ ] `eslint-config-prettier` properly disables conflicts
- [ ] Generated files consistently ignored in both tools
- [ ] CI integration follows established patterns

### Code Quality

- [ ] Configuration files are clean and readable
- [ ] Comments explain non-obvious choices
- [ ] No redundant configuration

### Integration

- [ ] Works with existing codebase
- [ ] No breaking changes to current lint rules
- [ ] CI workflow runs successfully
- [ ] IDE integration works (if tested)

### Performance

- [ ] ESLint caching enabled
- [ ] Reasonable set of ignore patterns
- [ ] No unnecessary file processing

### Documentation

- [ ] Developer guide is complete
- [ ] Commands are accurate
- [ ] Troubleshooting is helpful

---

## Feedback Template

Use this template for feedback:

```markdown
## Review Feedback - Phase 3

**Reviewer**: [Name]
**Date**: [Date]
**Commits Reviewed**: [list or "all"]

### Strengths

- [What was done well]
- [Highlight good practices]

### Required Changes

1. **[File/Area]**: [Issue description]
   - **Why**: [Explanation]
   - **Suggestion**: [How to fix]

### Suggestions (Optional)

- [Nice-to-have improvements]
- [Alternative approaches to consider]

### Verdict

- [ ] **APPROVED** - Ready to merge
- [ ] **CHANGES REQUESTED** - Needs fixes
- [ ] **REJECTED** - Major rework needed

### Next Steps

[What should happen next]
```

---

## Review Actions

### If Approved

1. Merge the commits
2. Update phase status to COMPLETED
3. Archive review notes
4. Run Quality Gate workflow to verify

### If Changes Requested

1. Create detailed feedback (use template)
2. Discuss with developer
3. Re-review after fixes

### If Rejected

1. Document major issues
2. Schedule discussion
3. Plan rework strategy

---

## FAQ

**Q: What if I see formatting issues in existing files?**
A: The format command should fix them. If committed as part of Commit 1, that's expected.

**Q: Should I test the CI workflow?**
A: If possible, yes. Push and run manually to verify integration.

**Q: What if ESLint rules conflict with team preferences?**
A: Discuss and adjust. Rules can be customized in the config.

**Q: Is Tailwind class ordering mandatory?**
A: With the plugin, yes. It's automatic and consistent.

---

**Document Created**: 2025-11-29
**Last Updated**: 2025-11-29
