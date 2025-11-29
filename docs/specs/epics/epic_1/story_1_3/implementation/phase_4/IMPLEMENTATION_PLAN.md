# Phase 4 - Atomic Implementation Plan

**Objective**: Configure Knip for dead code detection and implement Payload type synchronization validation

---

## Overview

### Why an Atomic Approach?

The implementation is split into **4 independent commits** to:

- **Facilitate review** - Each commit focuses on a single aspect (config vs CI vs types)
- **Enable rollback** - If Knip config causes false positives, revert without losing type sync
- **Progressive validation** - Knip validated locally before CI integration
- **Clear separation** - Dead code detection vs type synchronization

### Global Strategy

```
[Commit 1]     →    [Commit 2]      →    [Commit 3]        →    [Commit 4]
     ↓                   ↓                    ↓                     ↓
   Knip              Workflow            Type Sync               Docs
   Config           Integration         Validation              Update
     ↓                   ↓                    ↓                     ↓
 Config OK          CI runs            Types checked           Complete
```

---

## The 4 Atomic Commits

### Commit 1: Knip Configuration

**Files**: `knip.json`, `package.json`
**Size**: ~60 lines
**Duration**: 45-60 min (implementation) + 20-30 min (review)

**Content**:

- Create `knip.json` with Next.js 15 + Payload CMS configuration
- Define explicit entry points for convention-based frameworks
- Configure ignore patterns for generated files
- Add `knip` script to `package.json`

**Why it's atomic**:

- Single responsibility: Knip configuration only
- No CI changes (separate commit)
- Can be validated with `pnpm exec knip --production`

**Technical Validation**:

```bash
pnpm exec knip --production
```

**Expected Result**: No unused files/exports reported (or documented exceptions)

**Review Criteria**:

- [ ] Entry points cover all framework conventions
- [ ] Generated files properly excluded
- [ ] No false positives on legitimate code
- [ ] Configuration follows Knip best practices

---

### Commit 2: Knip Workflow Integration

**Files**: `.github/workflows/quality-gate.yml`
**Size**: ~20 lines
**Duration**: 20-30 min (implementation) + 15-20 min (review)

**Content**:

- Add Knip step to quality-gate workflow
- Configure `--production` mode for CI
- Add cache configuration for Knip
- Position after ESLint/Prettier, before build

**Why it's atomic**:

- Single responsibility: CI integration only
- Depends on Commit 1 (Knip configured)
- Can be validated by running workflow manually

**Technical Validation**:

```bash
# Validate YAML syntax
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/quality-gate.yml'))"

# Dry run (local)
pnpm exec knip --production
```

**Expected Result**: YAML valid, Knip passes locally

**Review Criteria**:

- [ ] Step positioned correctly in workflow
- [ ] Production mode enabled
- [ ] Cache configuration correct
- [ ] Error handling appropriate

---

### Commit 3: Type Sync Validation

**Files**: `.github/workflows/quality-gate.yml`
**Size**: ~30 lines
**Duration**: 30-45 min (implementation) + 15-20 min (review)

**Content**:

- Add type generation step to workflow
- Add type drift detection step
- Configure proper error messaging
- Ensure PAYLOAD_SECRET is available in CI

**Why it's atomic**:

- Single responsibility: Type synchronization only
- Independent from Knip (different validation)
- Can be validated by modifying types and checking diff

**Technical Validation**:

```bash
# Generate types locally
pnpm generate:types:payload

# Check for drift
git diff --exit-code src/payload-types.ts
```

**Expected Result**: Types match, no diff detected

**Review Criteria**:

- [ ] PAYLOAD_SECRET properly configured
- [ ] Error message is clear and actionable
- [ ] Step order is logical
- [ ] No secrets exposed in logs

---

### Commit 4: Documentation Update

**Files**: `CLAUDE.md`, `docs/guides/dead-code-detection.md` (new)
**Size**: ~120 lines
**Duration**: 25-35 min (implementation) + 10-15 min (review)

**Content**:

- Update CLAUDE.md with Knip commands
- Create developer guide for dead code detection
- Document Knip configuration and exceptions
- Add troubleshooting section

**Why it's atomic**:

- Single responsibility: Documentation only
- Depends on Commits 1-3 (tools working)
- Can be validated by reading docs

**Technical Validation**:

```bash
# Check markdown syntax
cat docs/guides/dead-code-detection.md
```

**Expected Result**: Clear, accurate documentation

**Review Criteria**:

- [ ] Commands are accurate
- [ ] Examples work
- [ ] Troubleshooting covers false positives
- [ ] Entry points explained

---

## Implementation Workflow

### Step-by-Step

1. **Read specification**: Understand Phase 4 requirements
2. **Setup environment**: Follow ENVIRONMENT_SETUP.md
3. **Implement Commit 1**: Knip configuration
4. **Validate Commit 1**: Run `pnpm exec knip --production`
5. **Commit Commit 1**: Use provided commit message
6. **Implement Commit 2**: Workflow integration for Knip
7. **Validate Commit 2**: Check YAML syntax
8. **Commit Commit 2**: Use provided commit message
9. **Implement Commit 3**: Type sync validation
10. **Validate Commit 3**: Run type generation
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

# Linting (from Phase 3)
pnpm lint

# Knip check (after Commit 1)
pnpm exec knip --production
```

All must pass before moving to next commit.

---

## Commit Metrics

| Commit                      | Files | Lines    | Implementation | Review | Total      |
| --------------------------- | ----- | -------- | -------------- | ------ | ---------- |
| 1. Knip Configuration       | 2     | ~60      | 45 min         | 20 min | 65 min     |
| 2. Workflow Integration     | 1     | ~20      | 20 min         | 15 min | 35 min     |
| 3. Type Sync Validation     | 1     | ~30      | 30 min         | 15 min | 45 min     |
| 4. Documentation            | 2     | ~120     | 25 min         | 10 min | 35 min     |
| **TOTAL**                   | **6** | **~230** | **2h**         | **1h** | **3h**     |

---

## Atomic Approach Benefits

### For Developers

- **Clear focus**: Knip config first, then CI, then types
- **Easy testing**: Each commit validates independently
- **Safe rollback**: Revert type sync without losing Knip

### For Reviewers

- **Fast review**: 15-30 min per commit
- **Focused**: Single responsibility per commit
- **Quality**: Easier to spot configuration issues

### For the Project

- **Rollback-safe**: Revert Knip without losing type sync
- **Historical**: Clear progression in git history
- **Maintainable**: Each tool documented separately

---

## Knip Configuration Deep Dive

### Entry Points Strategy

Knip needs to understand which files are "entry points" - files that the framework discovers by convention rather than explicit imports.

| Entry Point           | Purpose                            | Auto-Detected? |
| --------------------- | ---------------------------------- | -------------- |
| `next.config.ts`      | Next.js configuration              | ✅ Yes (plugin) |
| `payload.config.ts`   | Payload CMS entry                  | ❌ No (custom)  |
| `src/middleware.ts`   | Next.js middleware                 | ✅ Yes (plugin) |
| `src/instrumentation.ts` | OpenTelemetry hooks             | ⚠️ Sometimes    |
| `src/app/**/page.tsx` | Next.js pages                      | ✅ Yes (plugin) |
| `src/app/**/route.ts` | Next.js API routes                 | ✅ Yes (plugin) |

### Files to Ignore

| Pattern                  | Reason                               |
| ------------------------ | ------------------------------------ |
| `src/payload-types.ts`   | Auto-generated by Payload            |
| `drizzle/migrations/**`  | SQL files, never imported by code    |
| `public/**`              | Static assets, referenced by strings |
| `cloudflare-env.d.ts`    | Type declarations only               |

### Production Mode

Using `--production` in CI:

- ✅ Ignores test files
- ✅ Ignores devDependencies
- ✅ Faster execution
- ✅ Focuses on shipped code

---

## Type Sync Deep Dive

### Why Type Sync Matters

Payload CMS generates TypeScript types from your collections configuration. If you:

1. Add a new field to a collection
2. Forget to run `pnpm generate:types:payload`
3. Push to CI

The generated types won't match the actual config, causing potential runtime errors.

### Validation Strategy

```bash
# Step 1: Generate types in CI
pnpm generate:types:payload

# Step 2: Check for uncommitted changes
if git diff --exit-code src/payload-types.ts; then
  echo "✅ Types are synchronized"
else
  echo "❌ Types are out of sync. Run: pnpm generate:types:payload"
  exit 1
fi
```

### CI Environment

Type generation requires `PAYLOAD_SECRET` environment variable:

```yaml
env:
  PAYLOAD_SECRET: ${{ secrets.PAYLOAD_SECRET || 'ci-placeholder-secret-32-chars!!' }}
```

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

- `🔍 Add Knip configuration for dead code detection`
- `👷 Add Knip step to quality-gate workflow`
- `🔒 Add Payload type sync validation to CI`
- `📝 Add dead code detection documentation`

### Review Checklist

Before committing:

- [ ] No console.logs or debug code
- [ ] Config files have no syntax errors
- [ ] All validation commands pass
- [ ] Documentation is accurate

---

## Handling False Positives

### Common False Positives

1. **Next.js conventions** - Files like `page.tsx` appear unused
   - Solution: Knip's Next.js plugin auto-detects these

2. **Payload collections** - Collections appear unused
   - Solution: Add `payload.config.ts` as entry point

3. **Exported types** - Types exported but only used externally
   - Solution: Use `ignoreExportsUsedInFile` option

### Adding Exceptions

If Knip reports a false positive:

```json
{
  "ignoreDependencies": ["@cloudflare/workers-types"],
  "ignore": ["path/to/file.ts"]
}
```

Document each exception with a comment explaining why.

---

## FAQ

**Q: What if Knip finds real dead code?**
A: Remove it! Dead code is technical debt. If legitimate, add to ignore with justification.

**Q: Why cache Knip in CI?**
A: Knip performs expensive AST analysis. Caching speeds up subsequent runs.

**Q: Can I run Knip locally?**
A: Yes! Run `pnpm exec knip` for full analysis or `pnpm exec knip --production` to match CI.

**Q: What if type generation fails in CI?**
A: Ensure `PAYLOAD_SECRET` is at least 32 characters. Use a placeholder if needed.

---

**Document Created**: 2025-11-29
**Last Updated**: 2025-11-29
