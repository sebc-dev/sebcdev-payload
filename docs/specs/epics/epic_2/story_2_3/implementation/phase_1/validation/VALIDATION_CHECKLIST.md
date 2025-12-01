# Validation Checklist - Phase 1 : CodeBlock Definition

## Phase Completion Criteria

| Criterion                        | Status  | Validated By |
| -------------------------------- | ------- | ------------ |
| All commits merged               | Pending | Git log      |
| All files created                | Pending | File system  |
| All tests passing                | Pending | Vitest       |
| Build succeeds                   | Pending | pnpm build   |
| Lint passes                      | Pending | pnpm lint    |
| No TypeScript errors             | Pending | IDE/Build    |

---

## File Validation

### Created Files

| File                        | Exists? | Content Valid? |
| --------------------------- | ------- | -------------- |
| `src/blocks/CodeBlock.ts`   | [ ]     | [ ]            |
| `src/blocks/index.ts`       | [ ]     | [ ]            |
| `tests/unit/blocks.spec.ts` | [ ]     | [ ]            |

### Verification Commands

```bash
# Check files exist
ls -la src/blocks/
ls -la tests/unit/blocks.spec.ts

# Expected output:
# src/blocks/CodeBlock.ts
# src/blocks/index.ts
# tests/unit/blocks.spec.ts
```

---

## Code Quality Validation

### Linting

```bash
pnpm lint
```

**Expected**: No errors or warnings

- [ ] ESLint passes
- [ ] Prettier formatting correct
- [ ] No unused imports
- [ ] No unused variables

### TypeScript

```bash
pnpm build
```

**Expected**: Build succeeds without type errors

- [ ] All types resolve correctly
- [ ] Block type matches Payload interface
- [ ] No `any` types used
- [ ] Import paths resolve

---

## Test Validation

### Run Tests

```bash
pnpm test:unit tests/unit/blocks.spec.ts
```

### Expected Results

| Test Name                                   | Status  |
| ------------------------------------------- | ------- |
| should have correct slug                    | [ ]     |
| should have correct interfaceName           | [ ]     |
| should have correct labels                  | [ ]     |
| should have language field as first field   | [ ]     |
| should support 10 programming languages     | [ ]     |
| should have code field as second field      | [ ]     |
| should have admin language config on code   | [ ]     |

**All 7 tests must pass.**

---

## CodeBlock Structure Validation

### Block Metadata

- [ ] `slug` is `code`
- [ ] `interfaceName` is `CodeBlock`
- [ ] `labels.singular` is `Code Block`
- [ ] `labels.plural` is `Code Blocks`

### Language Field

- [ ] Name is `language`
- [ ] Type is `select`
- [ ] Required is `true`
- [ ] Default value is `typescript`
- [ ] Has exactly 10 options

### Language Options

| Language   | Value        | Present? |
| ---------- | ------------ | -------- |
| TypeScript | `typescript` | [ ]      |
| JavaScript | `javascript` | [ ]      |
| Python     | `python`     | [ ]      |
| Bash       | `bash`       | [ ]      |
| JSON       | `json`       | [ ]      |
| HTML       | `html`       | [ ]      |
| CSS        | `css`        | [ ]      |
| SQL        | `sql`        | [ ]      |
| Go         | `go`         | [ ]      |
| Rust       | `rust`       | [ ]      |

### Code Field

- [ ] Name is `code`
- [ ] Type is `code`
- [ ] Required is `true`
- [ ] Admin language is `typescript`

---

## Import Validation

### Test Import Paths

```typescript
// This import should work without errors
import { CodeBlock } from '@/blocks'
```

### Verification

```bash
# Create temporary test
echo "import { CodeBlock } from '@/blocks'; console.log(CodeBlock.slug)" > /tmp/test-import.ts

# Run TypeScript check (should succeed)
npx tsc --noEmit /tmp/test-import.ts --skipLibCheck --esModuleInterop --moduleResolution node --baseUrl . --paths '{"@/*":["./src/*"]}'
```

---

## Git Validation

### Commits

```bash
git log --oneline -3
```

**Expected**: 3 commits with proper messages

| Commit | Message Pattern                                      | Present? |
| ------ | ---------------------------------------------------- | -------- |
| #1     | `feat(blocks): create CodeBlock definition...`       | [ ]      |
| #2     | `feat(blocks): create blocks barrel export`          | [ ]      |
| #3     | `test(unit): add CodeBlock structure validation...`  | [ ]      |

### Commit Message Format

Each commit should follow gitmoji convention:

- [ ] Starts with gitmoji (feat, test, etc.)
- [ ] Has scope in parentheses `(blocks)`
- [ ] Has descriptive title
- [ ] Includes story reference
- [ ] Has Co-Authored-By line

### No Uncommitted Changes

```bash
git status
```

**Expected**: Clean working tree

---

## Full Project Validation

### Build

```bash
pnpm build
```

**Expected**: Build succeeds

- [ ] No errors
- [ ] No warnings (or expected warnings only)
- [ ] Build completes in reasonable time

### All Tests

```bash
pnpm test:unit
```

**Expected**: All unit tests pass

- [ ] No failed tests
- [ ] No skipped tests (without reason)

### Full Test Suite

```bash
pnpm test
```

**Expected**: All tests pass (unit + integration + e2e)

---

## Acceptance Criteria Validation

From Story 2.3:

### AC2: Blocs de Code (Phase 1 Scope)

- [ ] Bloc "Code" definition created (`CodeBlock`)
- [ ] Champ `language` pour selectionner le langage
- [ ] Champ `code` pour le contenu du code
- [ ] Support des 10 langages: JavaScript, TypeScript, Python, Bash, JSON, HTML, CSS, SQL, Go, Rust

**Note**: Integration with Lexical editor (BlocksFeature) is in Phase 2.

---

## Phase Sign-Off

### Developer Checklist

- [ ] All commits created and pushed
- [ ] All tests passing
- [ ] Build succeeds
- [ ] Code reviewed (self-review minimum)
- [ ] EPIC_TRACKING.md updated

### Reviewer Checklist

- [ ] Code follows project conventions
- [ ] Tests are comprehensive
- [ ] No security concerns
- [ ] Documentation is complete

---

## Next Steps

After Phase 1 validation is complete:

1. **Update Tracking**

   ```bash
   # Update EPIC_TRACKING.md
   # Change Story 2.3 progress from 0/4 to 1/4
   ```

2. **Generate Phase 2 Docs**

   ```bash
   /generate-phase-doc Epic 2 Story 2.3 Phase 2
   ```

3. **Start Phase 2**

   - Configure Lexical editor with BlocksFeature
   - Add BlockquoteFeature and UploadFeature
   - Regenerate TypeScript types

---

## Validation Summary

| Category       | Items | Passed | Failed |
| -------------- | ----- | ------ | ------ |
| Files Created  | 3     | [ ]    | [ ]    |
| Code Quality   | 2     | [ ]    | [ ]    |
| Tests          | 7     | [ ]    | [ ]    |
| Git            | 3     | [ ]    | [ ]    |
| Build          | 1     | [ ]    | [ ]    |
| **Total**      | 16    | [ ]    | [ ]    |

### Final Status

- [ ] **PHASE 1 VALIDATED** - Ready for Phase 2

---

## Validation Date

| Field              | Value |
| ------------------ | ----- |
| Validated By       |       |
| Validation Date    |       |
| Notes              |       |
