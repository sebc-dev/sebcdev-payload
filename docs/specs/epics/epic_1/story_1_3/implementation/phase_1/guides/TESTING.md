# Phase 1: Testing Guide - Workflow Foundation & Dependabot

**Story**: 1.3 - Pipeline "Quality Gate" (AI-Shield)
**Phase**: 1 of 8
**Testing Focus**: Workflow execution, YAML validation, configuration verification

---

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Local Testing](#local-testing)
3. [GitHub Integration Testing](#github-integration-testing)
4. [Dependabot Testing](#dependabot-testing)
5. [Troubleshooting Test Failures](#troubleshooting-test-failures)

---

## Testing Overview

### Test Categories for Phase 1

| Category | Type | Description |
|----------|------|-------------|
| YAML Validation | Local | Syntax and structure verification |
| SHA Verification | Local | Action SHA pinning validation |
| Workflow Execution | GitHub | Manual trigger and completion |
| Dependency Caching | GitHub | pnpm cache functionality |
| Dependabot Integration | GitHub | Configuration recognition |

### Test Priority Matrix

| Test | Priority | Blocking | Automated |
|------|----------|----------|-----------|
| YAML syntax valid | Critical | Yes | Yes |
| SHA format correct | Critical | Yes | Yes |
| Workflow triggers | Critical | Yes | Manual |
| Workflow completes | Critical | Yes | Manual |
| pnpm cache works | High | No | Auto |
| Dependabot detected | Medium | No | Auto |

---

## Local Testing

### Test 1: YAML Syntax Validation

**Purpose**: Ensure YAML files are syntactically correct before pushing.

#### Method 1: Python YAML Parser

```bash
# Test quality-gate.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/quality-gate.yml'))" && echo "quality-gate.yml: VALID"

# Test dependabot.yml
python3 -c "import yaml; yaml.safe_load(open('.github/dependabot.yml'))" && echo "dependabot.yml: VALID"

# One-liner for both
python3 -c "import yaml; [yaml.safe_load(open(f)) for f in ['.github/workflows/quality-gate.yml', '.github/dependabot.yml']]" && echo "All YAML files valid"
```

#### Method 2: yamllint (if installed)

```bash
# Install yamllint
pip install yamllint

# Validate files
yamllint .github/workflows/quality-gate.yml
yamllint .github/dependabot.yml
```

#### Method 3: Online Validator

If local tools unavailable:
1. Copy YAML content
2. Paste to https://www.yamllint.com/
3. Verify no errors

#### Expected Result

```
quality-gate.yml: VALID
dependabot.yml: VALID
```

---

### Test 2: SHA Format Verification

**Purpose**: Ensure all action references use proper 40-character SHA.

#### Test Script

```bash
#!/bin/bash
# test-sha-format.sh

WORKFLOW_FILE=".github/workflows/quality-gate.yml"

echo "=== SHA Format Verification ==="

# Count SHA-pinned actions
SHA_COUNT=$(grep -c '@[a-f0-9]\{40\}' "$WORKFLOW_FILE")
echo "SHA-pinned actions found: $SHA_COUNT"

# List all action references
echo ""
echo "Action references:"
grep 'uses:' "$WORKFLOW_FILE"

# Check for tag references (should be none)
echo ""
echo "Tag references (should be empty):"
grep -E 'uses:.*@v[0-9]' "$WORKFLOW_FILE" || echo "  None found (OK)"

# Verify SHA length
echo ""
echo "SHA length verification:"
grep -oP '@[a-f0-9]+' "$WORKFLOW_FILE" | while read sha; do
    len=${#sha}
    if [ $len -eq 41 ]; then  # 40 + @ prefix
        echo "  $sha - VALID (40 chars)"
    else
        echo "  $sha - INVALID ($(($len-1)) chars, expected 40)"
    fi
done

# Expected: 3 SHA-pinned actions
if [ "$SHA_COUNT" -eq 3 ]; then
    echo ""
    echo "=== PASS: All 3 actions are SHA-pinned ==="
else
    echo ""
    echo "=== FAIL: Expected 3 SHA-pinned actions, found $SHA_COUNT ==="
    exit 1
fi
```

#### Expected Result

```
=== SHA Format Verification ===
SHA-pinned actions found: 3

Action references:
        uses: actions/checkout@1af3b93b6815bc44a9784bd300feb67ff0d1eeb3  # v6.0.0
        uses: pnpm/action-setup@41ff72655975bd51cab0327fa583b6e92b6d3061  # v4.2.0
        uses: actions/setup-node@2028fbc5c25fe9cf00d9f06a71cc4710d4507903  # v6.0.0

Tag references (should be empty):
  None found (OK)

SHA length verification:
  @1af3b93b6815bc44a9784bd300feb67ff0d1eeb3 - VALID (40 chars)
  @41ff72655975bd51cab0327fa583b6e92b6d3061 - VALID (40 chars)
  @2028fbc5c25fe9cf00d9f06a71cc4710d4507903 - VALID (40 chars)

=== PASS: All 3 actions are SHA-pinned ===
```

---

### Test 3: Permissions Verification

**Purpose**: Ensure permissions follow least privilege principle.

#### Test Script

```bash
#!/bin/bash
# test-permissions.sh

WORKFLOW_FILE=".github/workflows/quality-gate.yml"

echo "=== Permissions Verification ==="

# Check permissions block exists
if grep -q '^permissions:' "$WORKFLOW_FILE"; then
    echo "Permissions block: FOUND"
else
    echo "Permissions block: MISSING"
    exit 1
fi

# List permissions
echo ""
echo "Defined permissions:"
grep -A10 '^permissions:' "$WORKFLOW_FILE" | grep -E '^\s+\w+:' | head -5

# Check for write permissions
echo ""
echo "Write permissions (should be none or only comments):"
grep -n 'write' "$WORKFLOW_FILE" | grep -v '#' || echo "  None found (OK)"

# Verify contents: read exists
if grep -qE '^\s+contents:\s*read' "$WORKFLOW_FILE"; then
    echo ""
    echo "=== PASS: Minimal permissions configured ==="
else
    echo ""
    echo "=== WARNING: contents: read not found ==="
fi
```

#### Expected Result

```
=== Permissions Verification ===
Permissions block: FOUND

Defined permissions:
  contents: read

Write permissions (should be none or only comments):
  None found (OK)

=== PASS: Minimal permissions configured ===
```

---

### Test 4: Concurrency Verification

**Purpose**: Ensure concurrency configuration prevents redundant runs.

#### Test Script

```bash
#!/bin/bash
# test-concurrency.sh

WORKFLOW_FILE=".github/workflows/quality-gate.yml"

echo "=== Concurrency Verification ==="

# Check concurrency block exists
if grep -q '^concurrency:' "$WORKFLOW_FILE"; then
    echo "Concurrency block: FOUND"
    grep -A3 '^concurrency:' "$WORKFLOW_FILE"
else
    echo "Concurrency block: MISSING"
    exit 1
fi

# Verify cancel-in-progress
if grep -q 'cancel-in-progress: true' "$WORKFLOW_FILE"; then
    echo ""
    echo "=== PASS: Concurrency with cancel-in-progress configured ==="
else
    echo ""
    echo "=== WARNING: cancel-in-progress not set to true ==="
fi
```

---

### Test 5: Dependabot Configuration Verification

**Purpose**: Verify Dependabot configuration is complete.

#### Test Script

```bash
#!/bin/bash
# test-dependabot.sh

DEPENDABOT_FILE=".github/dependabot.yml"

echo "=== Dependabot Configuration Verification ==="

# Check file exists
if [ ! -f "$DEPENDABOT_FILE" ]; then
    echo "File not found: $DEPENDABOT_FILE"
    exit 1
fi

# Check version
if grep -q '^version: 2' "$DEPENDABOT_FILE"; then
    echo "Version: 2 (OK)"
else
    echo "Version: INCORRECT (expected 2)"
    exit 1
fi

# Count ecosystems
ECOSYSTEM_COUNT=$(grep -c 'package-ecosystem:' "$DEPENDABOT_FILE")
echo "Ecosystems configured: $ECOSYSTEM_COUNT"

# Check for github-actions
if grep -q 'package-ecosystem: "github-actions"' "$DEPENDABOT_FILE"; then
    echo "  - github-actions: FOUND"
else
    echo "  - github-actions: MISSING"
fi

# Check for npm
if grep -q 'package-ecosystem: "npm"' "$DEPENDABOT_FILE"; then
    echo "  - npm: FOUND"
else
    echo "  - npm: MISSING"
fi

# Check for groups
if grep -q 'groups:' "$DEPENDABOT_FILE"; then
    echo "Groups configured: YES"
else
    echo "Groups configured: NO"
fi

if [ "$ECOSYSTEM_COUNT" -ge 2 ]; then
    echo ""
    echo "=== PASS: Dependabot properly configured ==="
else
    echo ""
    echo "=== FAIL: Expected at least 2 ecosystems ==="
    exit 1
fi
```

---

## GitHub Integration Testing

### Test 6: Workflow Manual Trigger

**Purpose**: Verify workflow can be triggered and runs successfully.

#### Steps

1. **Push to GitHub**
   ```bash
   git push origin story_1_3
   ```

2. **Navigate to Actions**
   - Go to repository on GitHub
   - Click "Actions" tab
   - Look for "Quality Gate" in workflow list

3. **Trigger Workflow**
   - Click "Quality Gate" workflow
   - Click "Run workflow" dropdown
   - Select branch: `story_1_3`
   - Leave "Run Stryker mutation tests" unchecked
   - Click "Run workflow"

4. **Verify Execution**
   - Wait for workflow to start (refresh if needed)
   - Click on the running workflow
   - Monitor each step

#### Expected Results

| Step | Expected Status | Duration |
|------|-----------------|----------|
| Checkout repository | Success | ~5s |
| Setup pnpm | Success | ~10s |
| Setup Node.js | Success | ~30s |
| Install dependencies | Success | ~30s (cache miss) or ~5s (cache hit) |
| Placeholder | Success | ~1s |

#### Success Indicators

- [ ] Workflow appears in Actions list
- [ ] "Run workflow" button is available
- [ ] Workflow starts within 30 seconds
- [ ] All steps show green checkmarks
- [ ] Total duration < 2 minutes
- [ ] Placeholder step shows notice messages

---

### Test 7: pnpm Cache Verification

**Purpose**: Verify pnpm cache is working correctly.

#### First Run (Cache Miss)

Expected log output in "Setup Node.js" step:
```
Cache not found for input keys: ...
```

Expected log output in "Install dependencies" step:
```
Packages are up to date
```

#### Second Run (Cache Hit)

Expected log output in "Setup Node.js" step:
```
Cache restored from key: ...
```

Expected log output in "Install dependencies" step:
```
Packages are up to date
(Faster execution time)
```

#### Verification

1. Run workflow twice
2. Compare execution times
3. Look for "Cache restored" message

---

### Test 8: Workflow Concurrency

**Purpose**: Verify concurrent runs are cancelled.

#### Steps

1. Trigger workflow manually
2. Immediately trigger another workflow on same branch
3. Verify first run is cancelled

#### Expected Result

- First run shows "Cancelled" status
- Second run completes successfully

---

## Dependabot Testing

### Test 9: Dependabot Recognition

**Purpose**: Verify GitHub recognizes Dependabot configuration.

#### Steps

1. **Navigate to Dependabot**
   - Go to repository Settings
   - Click "Code security and analysis"
   - OR: Go to Insights > Dependency graph > Dependabot

2. **Verify Configuration**
   - Look for "Dependabot version updates" section
   - Should show both ecosystems

#### Expected Result

```
Dependabot version updates

github-actions
  Schedule: weekly (Monday at 09:00)
  Target: /

npm
  Schedule: weekly (Monday at 09:00)
  Target: /
```

### Test 10: Dependabot First Run

**Purpose**: Verify Dependabot creates PRs (may need to wait).

#### Note

Dependabot runs on schedule. To test immediately:

1. Go to Insights > Dependency graph > Dependabot
2. Click "Check for updates" (if available)
3. Or wait until next Monday 09:00 Paris time

#### Expected Result

- Dependabot PRs appear (if updates available)
- PRs follow configured grouping
- Labels are applied correctly

---

## Troubleshooting Test Failures

### YAML Validation Failures

| Error | Cause | Solution |
|-------|-------|----------|
| `expected <block end>` | Indentation error | Check spaces (2 per level) |
| `mapping values are not allowed` | Missing colon | Add colon after key |
| `found character that cannot start` | Tab character | Replace tabs with spaces |

### SHA Verification Failures

| Error | Cause | Solution |
|-------|-------|----------|
| SHA too short | Using shortened SHA | Get full 40-char SHA |
| Invalid characters | Typo in SHA | Copy SHA from releases page |
| Version mismatch | Wrong SHA for version | Verify SHA on GitHub releases |

### Workflow Execution Failures

| Step | Error | Solution |
|------|-------|----------|
| Checkout | "Resource not accessible" | Check repository permissions |
| Setup pnpm | "Version not found" | Verify pnpm version exists |
| Setup Node | "Version not found" | Use valid Node.js version |
| Install | "Lockfile mismatch" | Run `pnpm install` locally first |

### Dependabot Not Working

| Symptom | Cause | Solution |
|---------|-------|----------|
| Not showing in settings | File not pushed | Verify file exists on GitHub |
| Not creating PRs | No updates available | Normal if dependencies current |
| Wrong schedule | Timezone issue | Verify timezone format |

---

## Test Summary Checklist

### Local Tests

- [ ] Test 1: YAML syntax validation - PASS
- [ ] Test 2: SHA format verification - PASS
- [ ] Test 3: Permissions verification - PASS
- [ ] Test 4: Concurrency verification - PASS
- [ ] Test 5: Dependabot configuration - PASS

### GitHub Tests

- [ ] Test 6: Workflow manual trigger - PASS
- [ ] Test 7: pnpm cache verification - PASS
- [ ] Test 8: Workflow concurrency - PASS
- [ ] Test 9: Dependabot recognition - PASS
- [ ] Test 10: Dependabot first run - PASS (or N/A if no updates)

### Overall Phase 1 Testing Status

**Status**: [ ] COMPLETE

**Notes**: _Add any observations or issues encountered_

---

## Quick Test Commands Reference

```bash
# YAML validation
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/quality-gate.yml'))"
python3 -c "import yaml; yaml.safe_load(open('.github/dependabot.yml'))"

# SHA count
grep -c '@[a-f0-9]\{40\}' .github/workflows/quality-gate.yml

# Permissions check
grep -A5 '^permissions:' .github/workflows/quality-gate.yml

# Concurrency check
grep -A3 '^concurrency:' .github/workflows/quality-gate.yml

# Push and test
git push origin story_1_3
```

---

**Document Created**: 2025-11-28
**Last Updated**: 2025-11-28
