# Phase 1: Validation Checklist - Workflow Foundation & Dependabot

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Phase**: 1 of 8
**Validation Date**: **\*\***\_\_\_**\*\***
**Validated By**: **\*\***\_\_\_**\*\***

---

## Validation Overview

This checklist ensures Phase 1 implementation meets all acceptance criteria before proceeding to subsequent phases.

### Validation Categories

| Category      | Weight   | Pass Criteria                      |
| ------------- | -------- | ---------------------------------- |
| Files Created | Critical | All required files exist           |
| Security      | Critical | SHA pinning, permissions correct   |
| Functionality | Critical | Workflow executes successfully     |
| Configuration | High     | Dependabot, concurrency configured |
| Documentation | Medium   | CLAUDE.md updated                  |

---

## Section 1: Files Created

### 1.1 Workflow File

**File**: `.github/workflows/quality-gate.yml`

- [ ] File exists at correct path
- [ ] File is not empty
- [ ] File size is reasonable (> 500 bytes)

**Verification Command**:

```bash
ls -la .github/workflows/quality-gate.yml
```

**Expected**: File exists with size ~1-2 KB

### 1.2 Dependabot File

**File**: `.github/dependabot.yml`

- [ ] File exists at correct path
- [ ] File is not empty
- [ ] File contains both ecosystems

**Verification Command**:

```bash
ls -la .github/dependabot.yml
grep -c 'package-ecosystem' .github/dependabot.yml
```

**Expected**: File exists, count = 2

### 1.3 Documentation Update

**File**: `CLAUDE.md`

- [ ] File contains Quality Gate documentation
- [ ] Manual trigger process documented
- [ ] Reference to CI-CD-Security.md present

**Verification Command**:

```bash
grep -c "Quality Gate" CLAUDE.md
grep -c "workflow_dispatch" CLAUDE.md
```

**Expected**: At least 1 match for each

---

## Section 2: Security Validation

### 2.1 SHA Pinning

All GitHub Actions must use full 40-character SHA references.

| Action               | SHA                                        | Version | Status |
| -------------------- | ------------------------------------------ | ------- | ------ |
| `actions/checkout`   | `1af3b93b6815bc44a9784bd300feb67ff0d1eeb3` | v6.0.0  | [ ]    |
| `pnpm/action-setup`  | `41ff72655975bd51cab0327fa583b6e92b6d3061` | v4.2.0  | [ ]    |
| `actions/setup-node` | `2028fbc5c25fe9cf00d9f06a71cc4710d4507903` | v6.0.0  | [ ]    |

**Verification Command**:

```bash
# Count SHA pins (expected: 3)
grep -c '@[a-f0-9]\{40\}' .github/workflows/quality-gate.yml

# Verify no tag references
grep -E '@v[0-9]' .github/workflows/quality-gate.yml || echo "No tag references (OK)"
```

**Validation Criteria**:

- [ ] Exactly 3 SHA-pinned actions
- [ ] No `@v4` or similar tag references
- [ ] Version comments match SHA versions

### 2.2 Permissions

GITHUB_TOKEN must follow least privilege principle.

**Verification Command**:

```bash
grep -A3 '^permissions:' .github/workflows/quality-gate.yml
```

**Expected Output**:

```yaml
permissions:
  contents: read
```

**Validation Criteria**:

- [ ] `permissions` block exists
- [ ] Only `contents: read` is active
- [ ] No `write` permissions (except in comments)

### 2.3 No Secrets in Code

**Verification Command**:

```bash
# Check for hardcoded secrets (should return nothing)
grep -rE '(sk-|api_key|password|secret).*=' .github/ || echo "No hardcoded secrets (OK)"
```

**Validation Criteria**:

- [ ] No hardcoded API keys
- [ ] No hardcoded passwords
- [ ] Secrets only via `${{ secrets.* }}`

---

## Section 3: Configuration Validation

### 3.1 Workflow Trigger

**Verification Command**:

```bash
grep -A10 '^on:' .github/workflows/quality-gate.yml
```

**Validation Criteria**:

- [ ] `workflow_dispatch` trigger configured
- [ ] `run_mutation_tests` input defined
- [ ] Input has default value `false`
- [ ] Input type is `boolean`

### 3.2 Concurrency Control

**Verification Command**:

```bash
grep -A3 '^concurrency:' .github/workflows/quality-gate.yml
```

**Expected Output**:

```yaml
concurrency:
  group: quality-gate-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

**Validation Criteria**:

- [ ] `concurrency` block exists
- [ ] Group uses workflow and ref variables
- [ ] `cancel-in-progress: true` is set

### 3.3 Job Configuration

**Verification Command**:

```bash
grep -E '(runs-on|node-version|cache)' .github/workflows/quality-gate.yml
```

**Validation Criteria**:

- [ ] `runs-on: ubuntu-latest`
- [ ] `node-version: '20'`
- [ ] `cache: 'pnpm'`

### 3.4 Dependabot Ecosystems

**Verification Command**:

```bash
grep -A20 'package-ecosystem: "github-actions"' .github/dependabot.yml
grep -A30 'package-ecosystem: "npm"' .github/dependabot.yml
```

**Validation Criteria**:

- [ ] `github-actions` ecosystem configured
- [ ] `npm` ecosystem configured
- [ ] Weekly schedule for both
- [ ] PR limit set (10)
- [ ] Groups configured for npm updates

---

## Section 4: Functional Validation

### 4.1 YAML Syntax

**Verification Command**:

```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/quality-gate.yml'))" && echo "VALID"
python3 -c "import yaml; yaml.safe_load(open('.github/dependabot.yml'))" && echo "VALID"
```

**Validation Criteria**:

- [ ] quality-gate.yml is valid YAML
- [ ] dependabot.yml is valid YAML
- [ ] No syntax errors

### 4.2 Workflow Execution (GitHub)

**Steps**:

1. Push changes to GitHub
2. Go to Actions tab
3. Click "Quality Gate" workflow
4. Click "Run workflow"
5. Select branch and run
6. Monitor execution

**Validation Criteria**:

- [ ] Workflow appears in Actions list
- [ ] Manual trigger works
- [ ] Checkout step succeeds
- [ ] pnpm setup succeeds
- [ ] Node.js setup succeeds
- [ ] Dependency install succeeds
- [ ] Placeholder step shows notices
- [ ] Total execution < 2 minutes

### 4.3 Cache Functionality

**Steps**:

1. Run workflow twice
2. Check logs for cache messages

**Validation Criteria**:

- [ ] First run: "Cache not found" is OK
- [ ] Second run: "Cache restored" appears
- [ ] Second run is faster

### 4.4 Concurrency Cancellation

**Steps**:

1. Trigger workflow
2. Immediately trigger another
3. Verify first is cancelled

**Validation Criteria**:

- [ ] First run shows "Cancelled" status
- [ ] Second run completes successfully

---

## Section 5: Documentation Validation

### 5.1 CLAUDE.md Accuracy

Review CLAUDE.md for accuracy against actual implementation.

**Validation Criteria**:

- [ ] CI/CD section exists
- [ ] Quality Gate workflow described
- [ ] Manual trigger strategy documented
- [ ] Local checks listed
- [ ] No placeholder text
- [ ] Links are valid

### 5.2 Commit History

**Verification Command**:

```bash
git log --oneline -4
```

**Expected**: 4 commits following convention:

1. `feat(ci): initialize quality-gate workflow...`
2. `feat(ci): configure dependabot...`
3. `feat(ci): add GITHUB_TOKEN permissions...`
4. `docs(ci): update CLAUDE.md...`

**Validation Criteria**:

- [ ] 4 commits for Phase 1
- [ ] Commit messages follow convention
- [ ] Commits are atomic (single responsibility)
- [ ] No squashed or merged commits

---

## Section 6: Acceptance Criteria Mapping

### Story 1.3 Phase 1 Acceptance Criteria

| Criteria            | Description                          | Status |
| ------------------- | ------------------------------------ | ------ |
| Workflow Foundation | Manual trigger via workflow_dispatch | [ ]    |
| SHA Pinning         | All actions pinned by SHA            | [ ]    |
| Dependabot          | Configured for actions and npm       | [ ]    |
| Permissions         | Least privilege (contents: read)     | [ ]    |
| Concurrency         | Cancel redundant runs                | [ ]    |
| Documentation       | CLAUDE.md updated                    | [ ]    |

---

## Section 7: Sign-Off

### Pre-Sign-Off Checklist

Before signing off, verify:

- [ ] All Section 1 items pass (Files Created)
- [ ] All Section 2 items pass (Security)
- [ ] All Section 3 items pass (Configuration)
- [ ] All Section 4 items pass (Functionality)
- [ ] All Section 5 items pass (Documentation)
- [ ] All Section 6 items pass (Acceptance Criteria)

### Validation Summary

| Section       | Items  | Passed   | Failed   |
| ------------- | ------ | -------- | -------- |
| Files Created | 3      | \_\_     | \_\_     |
| Security      | 6      | \_\_     | \_\_     |
| Configuration | 10     | \_\_     | \_\_     |
| Functionality | 12     | \_\_     | \_\_     |
| Documentation | 8      | \_\_     | \_\_     |
| **Total**     | **39** | **\_\_** | **\_\_** |

### Issues Found

| Issue # | Description | Severity | Resolution |
| ------- | ----------- | -------- | ---------- |
| 1       |             |          |            |
| 2       |             |          |            |
| 3       |             |          |            |

### Sign-Off

**Phase 1 Status**: [ ] APPROVED / [ ] NEEDS REWORK

**Validator**: **\*\***\_\_\_**\*\***

**Date**: **\*\***\_\_\_**\*\***

**Notes**:

```
[Add any additional notes or observations here]
```

---

## Quick Validation Script

Run this script for automated validation:

```bash
#!/bin/bash
# validate-phase1.sh

echo "=== Phase 1 Validation ==="
echo ""

# Files
echo "1. Files Check"
[ -f ".github/workflows/quality-gate.yml" ] && echo "  quality-gate.yml: EXISTS" || echo "  quality-gate.yml: MISSING"
[ -f ".github/dependabot.yml" ] && echo "  dependabot.yml: EXISTS" || echo "  dependabot.yml: MISSING"
echo ""

# SHA Pinning
echo "2. SHA Pinning"
SHA_COUNT=$(grep -c '@[a-f0-9]\{40\}' .github/workflows/quality-gate.yml 2>/dev/null || echo 0)
echo "  SHA-pinned actions: $SHA_COUNT (expected: 3)"
echo ""

# Permissions
echo "3. Permissions"
grep -q 'contents: read' .github/workflows/quality-gate.yml && echo "  contents: read - FOUND" || echo "  contents: read - MISSING"
echo ""

# Concurrency
echo "4. Concurrency"
grep -q 'cancel-in-progress: true' .github/workflows/quality-gate.yml && echo "  cancel-in-progress: FOUND" || echo "  cancel-in-progress: MISSING"
echo ""

# YAML Validation
echo "5. YAML Validation"
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/quality-gate.yml'))" 2>/dev/null && echo "  quality-gate.yml: VALID" || echo "  quality-gate.yml: INVALID"
python3 -c "import yaml; yaml.safe_load(open('.github/dependabot.yml'))" 2>/dev/null && echo "  dependabot.yml: VALID" || echo "  dependabot.yml: INVALID"
echo ""

# Dependabot ecosystems
echo "6. Dependabot Ecosystems"
ECOSYSTEM_COUNT=$(grep -c 'package-ecosystem' .github/dependabot.yml 2>/dev/null || echo 0)
echo "  Ecosystems configured: $ECOSYSTEM_COUNT (expected: 2)"
echo ""

# Summary
echo "=== Validation Complete ==="
```

---

## Next Steps After Validation

1. **If APPROVED**:
   - Update PHASES_PLAN.md with actual duration
   - Mark Phase 1 as COMPLETE in tracking
   - Proceed to Phase 2 (Socket.dev) or Phase 3 (ESLint/Prettier)

2. **If NEEDS REWORK**:
   - Document specific issues in table above
   - Create fix commits (maintain atomic structure)
   - Re-run validation

---

**Document Created**: 2025-11-28
**Last Updated**: 2025-11-28
