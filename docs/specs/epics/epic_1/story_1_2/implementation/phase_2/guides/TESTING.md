# Phase 2: Testing Guide

**Phase**: Developer Documentation & Onboarding Guide
**Story**: 1.2 - Récupération & Configuration Locale

This guide describes how to test and validate the documentation created in Phase 2.

---

## Testing Overview

Phase 2 produces **documentation only** - no code changes. Testing focuses on:

- **Content Accuracy**: Information is correct and up-to-date
- **Usability**: Documentation is easy to follow
- **Completeness**: All required sections present
- **Link Validity**: All links work correctly
- **Command Verification**: All commands execute successfully

---

## Testing Strategy

### Test Types for Documentation

| Test Type | Purpose | Method |
|-----------|---------|--------|
| **Content Review** | Verify accuracy | Manual review |
| **Link Testing** | Verify all links work | Automated + manual |
| **Command Testing** | Verify commands work | Execute in terminal |
| **Walkthrough Testing** | Verify usability | Follow guide step-by-step |
| **Cross-Reference Testing** | Verify consistency | Compare with source files |

---

## Test 1: Content Accuracy

### QUICKSTART.md Testing

#### Prerequisites Verification

```bash
# Verify Node.js version requirement matches package.json
cat package.json | jq '.engines'

# Compare with documented version in QUICKSTART.md
grep -A5 "Node.js" docs/development/QUICKSTART.md
```

#### Command Verification

Test each documented command:

```bash
# Test Step 2: Install dependencies
pnpm install  # Should work without errors

# Test Step 5: Generate types
pnpm generate:types  # Should complete successfully

# Test Step 6: Start development server
pnpm dev  # Should start successfully
# (Stop with Ctrl+C after verification)
```

### COMMANDS.md Testing

#### Cross-Reference with package.json

```bash
# Get all scripts from package.json
cat package.json | jq -r '.scripts | keys[]' | sort

# Get all documented commands (manual: extract from COMMANDS.md)
# Verify each script is documented
```

#### Test Each Documented Command

```bash
# Test development commands
pnpm dev           # Should start dev server
pnpm devsafe       # Should clean and start

# Test type generation
pnpm generate:types            # Should generate types
pnpm generate:types:cloudflare # Should generate CF types
pnpm generate:types:payload    # Should generate Payload types

# Test code quality
pnpm lint          # Should run ESLint

# Test testing commands (if tests exist)
pnpm test          # Run all tests
pnpm test:int      # Run integration tests
pnpm test:e2e      # Run E2E tests
```

### ENVIRONMENT.md Testing

#### Cross-Reference with .env.example

```bash
# Get all variables from .env.example
cat .env.example | grep -v "^#" | grep "="

# Compare with documented variables in ENVIRONMENT.md
grep -E "^### " docs/development/ENVIRONMENT.md
```

#### Verify Required Variables

```bash
# Check PAYLOAD_SECRET is documented as required
grep -A5 "PAYLOAD_SECRET" docs/development/ENVIRONMENT.md
```

### TROUBLESHOOTING.md Testing

#### Verify Solution Commands Work

```bash
# Test Wrangler auth check
wrangler whoami

# Test D1 connection (if environment is set up)
wrangler d1 execute D1 --command "SELECT 1" --local

# Test type regeneration
pnpm generate:types
npx tsc --noEmit

# Test clean start
pnpm devsafe
```

### IDE_SETUP.md Testing

#### Verify Extension IDs

```bash
# Test extension install commands (don't actually install, just verify IDs)
# Each extension ID should be valid on VS Code marketplace
code --list-extensions  # Compare with documented extensions
```

#### Verify Settings

- Open `.vscode/settings.json` (if exists) and compare with documented settings
- Ensure documented settings are valid JSON

---

## Test 2: Link Testing

### Automated Link Check

```bash
# Check for internal links
grep -rE "\[.*\]\(\./.*\)" docs/development/

# Verify each linked file exists
for link in $(grep -oE "\./[A-Z_]+\.md" docs/development/*.md | sort | uniq); do
  file="docs/development/${link#./}"
  if [ -f "$file" ]; then
    echo "OK: $file"
  else
    echo "MISSING: $file"
  fi
done
```

### Manual Link Verification

Check each document for:
- [ ] QUICKSTART.md links work
- [ ] COMMANDS.md links work
- [ ] ENVIRONMENT.md links work
- [ ] TROUBLESHOOTING.md links work
- [ ] IDE_SETUP.md links work

---

## Test 3: Walkthrough Testing

### Quick-Start Walkthrough

The most important test: **follow the QUICKSTART.md guide from scratch**.

#### Simulated New Developer Setup

If possible, test on a clean environment:

1. Clone repository fresh
2. Follow QUICKSTART.md step by step
3. Note any unclear instructions
4. Note any missing steps
5. Measure actual time vs documented time (15 min)

#### Checklist Walkthrough

If clean environment not available, mentally walk through:

- [ ] Step 1: Clone - Command clear and complete?
- [ ] Step 2: Install - Expected output accurate?
- [ ] Step 3: Configure - Instructions complete?
- [ ] Step 4: Authenticate - Process clear?
- [ ] Step 5: Types - Command works?
- [ ] Step 6: Start - Server starts?
- [ ] Step 7: Verify - Verification steps clear?

### Troubleshooting Walkthrough

For each documented issue in TROUBLESHOOTING.md:

1. Simulate the issue (if safe to do so)
2. Follow the documented solution
3. Verify the solution works
4. Note any unclear instructions

---

## Test 4: Cross-Reference Testing

### Consistency Check

Ensure information is consistent across documents:

```bash
# Check version numbers are consistent
grep -rE "(Node\.?js|pnpm).*[0-9]" docs/development/

# Check command names are consistent
grep -rE "pnpm (dev|build|test|lint)" docs/development/
```

### Source File Comparison

| Document | Compare With |
|----------|--------------|
| QUICKSTART.md | .env.example, package.json |
| COMMANDS.md | package.json scripts |
| ENVIRONMENT.md | .env.example |
| TROUBLESHOOTING.md | Real error messages |
| IDE_SETUP.md | .vscode/settings.json |

---

## Test 5: Formatting Tests

### Markdown Validation

```bash
# Check Markdown formatting (if markdownlint is available)
# npx markdownlint docs/development/*.md

# Manual checks:
# - Headers properly nested
# - Code blocks have language identifiers
# - Tables are properly formatted
# - Lists are consistent
```

### Visual Verification

Open each file in VSCode with Markdown preview:
- [ ] Headers render correctly
- [ ] Code blocks are highlighted
- [ ] Tables render properly
- [ ] Links are clickable

---

## Test Results Template

### Test Results: Phase 2 Documentation

**Date**: YYYY-MM-DD
**Tester**: [Name]

#### QUICKSTART.md

| Test | Result | Notes |
|------|--------|-------|
| Prerequisites accurate | PASS/FAIL | |
| Commands work | PASS/FAIL | |
| Expected outputs match | PASS/FAIL | |
| Links work | PASS/FAIL | |
| Walkthrough successful | PASS/FAIL | |

#### COMMANDS.md

| Test | Result | Notes |
|------|--------|-------|
| All scripts documented | PASS/FAIL | |
| Commands work | PASS/FAIL | |
| Descriptions accurate | PASS/FAIL | |
| Links work | PASS/FAIL | |

#### ENVIRONMENT.md

| Test | Result | Notes |
|------|--------|-------|
| All vars documented | PASS/FAIL | |
| Required vs optional clear | PASS/FAIL | |
| Setup instructions work | PASS/FAIL | |
| Links work | PASS/FAIL | |

#### TROUBLESHOOTING.md

| Test | Result | Notes |
|------|--------|-------|
| Solutions work | PASS/FAIL | |
| Commands accurate | PASS/FAIL | |
| Common issues covered | PASS/FAIL | |
| Links work | PASS/FAIL | |

#### IDE_SETUP.md

| Test | Result | Notes |
|------|--------|-------|
| Settings valid | PASS/FAIL | |
| Extension IDs correct | PASS/FAIL | |
| Install command works | PASS/FAIL | |
| Links work | PASS/FAIL | |

#### Overall

| Metric | Result |
|--------|--------|
| All tests passed | YES/NO |
| Blocking issues | 0/X |
| Minor issues | 0/X |
| Ready for approval | YES/NO |

---

## Acceptance Criteria Testing

### Story 1.2 AC6 Verification

| Acceptance Criterion | Test | Status |
|---------------------|------|--------|
| Guide de démarrage rapide | QUICKSTART.md exists and is complete | [ ] |
| Liste des commandes | COMMANDS.md has all scripts | [ ] |
| Procédure de résolution | TROUBLESHOOTING.md covers common issues | [ ] |
| Configuration IDE | IDE_SETUP.md has VSCode setup | [ ] |

### Success Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| New developer setup time | < 15 minutes | TBD |
| Commands documented | 100% | TBD |
| Env vars documented | 100% | TBD |
| Issues covered | Top 5 | TBD |

---

## Test Execution Commands

### Quick Test Suite

```bash
# Run all verification commands
echo "=== Testing Documentation ===" && \
echo "1. Checking file existence..." && \
ls -la docs/development/*.md && \
echo "2. Checking internal links..." && \
grep -rE "\./[A-Z_]+\.md" docs/development/*.md && \
echo "3. Checking package.json sync..." && \
cat package.json | jq -r '.scripts | keys[]' | wc -l && \
echo "4. Testing key commands..." && \
pnpm generate:types && \
npx tsc --noEmit && \
pnpm lint && \
echo "=== All basic tests passed ==="
```

### Development Server Test

```bash
# Start dev server and verify
pnpm dev &
DEV_PID=$!
sleep 10
curl -I http://localhost:3000 && echo "Homepage: OK"
curl -I http://localhost:3000/admin && echo "Admin: OK"
kill $DEV_PID
```

---

## Issues and Resolutions

### Common Documentation Issues

| Issue | Resolution |
|-------|------------|
| Outdated command | Update to match package.json |
| Missing variable | Add to ENVIRONMENT.md |
| Broken link | Fix path or remove link |
| Wrong version | Update to match package.json |

### Issue Tracking

Document any issues found during testing:

```markdown
### Issue 1: [Title]
- **File**: docs/development/XXXX.md
- **Section**: [Section name]
- **Issue**: [Description]
- **Resolution**: [Fix applied]
- **Status**: Fixed/Pending
```

---

**Guide Created**: 2025-11-28
**Last Updated**: 2025-11-28
**Created by**: Claude Code (phase-doc-generator skill)
