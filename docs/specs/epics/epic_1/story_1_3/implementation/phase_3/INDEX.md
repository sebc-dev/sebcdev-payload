# Phase 3 - Code Quality: Linting & Formatting

**Status**: IN PROGRESS
**Started**: 2025-11-29
**Target Completion**: TBD

---

## Quick Navigation

### Documentation Structure

```
phase_3/
├── INDEX.md (this file)
├── IMPLEMENTATION_PLAN.md (atomic strategy + commits)
├── COMMIT_CHECKLIST.md (checklist per commit)
├── ENVIRONMENT_SETUP.md (environment setup)
├── validation/
│   └── VALIDATION_CHECKLIST.md
└── guides/
    ├── REVIEW.md (code review guide)
    └── TESTING.md (testing guide)
```

---

## Phase Objective

Configure ESLint 9 (Flat Config) and Prettier with the Tailwind plugin to ensure consistent code formatting and quality across the codebase. This phase establishes automated linting in the CI/CD pipeline with GitHub annotations for immediate feedback.

### Scope

- Validate and enhance ESLint 9 Flat Config for Next.js 15 + Payload CMS
- Create Prettier configuration with `prettier-plugin-tailwindcss`
- Configure ESLint cache for CI performance
- Strict separation of ESLint and Prettier (no `eslint-plugin-prettier`)
- Integrate both tools into quality-gate workflow with GitHub annotations
- Exclude generated files (`payload-types.ts`) from linting

---

## Available Documents

| Document                                                                       | Description                        | For Who    | Duration  |
| ------------------------------------------------------------------------------ | ---------------------------------- | ---------- | --------- |
| **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)**                         | Atomic strategy in 4 commits       | Developer  | 15 min    |
| **[COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md)**                               | Detailed checklist per commit      | Developer  | Reference |
| **[ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)**                             | Environment variables & setup      | DevOps/Dev | 10 min    |
| **[guides/REVIEW.md](./guides/REVIEW.md)**                                     | Code review guide                  | Reviewer   | 20 min    |
| **[guides/TESTING.md](./guides/TESTING.md)**                                   | Testing guide (unit + integration) | QA/Dev     | 20 min    |
| **[validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)** | Final validation checklist         | Tech Lead  | 30 min    |

---

## Implementation Workflow

### Step 1: Initial Setup

```bash
# Read the PHASES_PLAN.md
cat docs/specs/epics/epic_1/story_1_3/implementation/PHASES_PLAN.md

# Read the atomic implementation plan for this phase
cat docs/specs/epics/epic_1/story_1_3/implementation/phase_3/IMPLEMENTATION_PLAN.md

# Setup environment
cat docs/specs/epics/epic_1/story_1_3/implementation/phase_3/ENVIRONMENT_SETUP.md
```

### Step 2: Atomic Implementation (4 commits)

```bash
# Commit 1: Prettier Configuration
cat docs/specs/epics/epic_1/story_1_3/implementation/phase_3/COMMIT_CHECKLIST.md # Section Commit 1

# Commit 2: ESLint Configuration Enhancement
cat docs/specs/epics/epic_1/story_1_3/implementation/phase_3/COMMIT_CHECKLIST.md # Section Commit 2

# Commit 3: Workflow Integration
cat docs/specs/epics/epic_1/story_1_3/implementation/phase_3/COMMIT_CHECKLIST.md # Section Commit 3

# Commit 4: Documentation Update
cat docs/specs/epics/epic_1/story_1_3/implementation/phase_3/COMMIT_CHECKLIST.md # Section Commit 4
```

### Step 3: Validation

```bash
# Run linter
pnpm lint

# Run Prettier check
pnpm exec prettier --check .

# Type-checking
pnpm exec tsc --noEmit

# Final validation
cat docs/specs/epics/epic_1/story_1_3/implementation/phase_3/validation/VALIDATION_CHECKLIST.md
```

---

## Use Cases by Profile

### Developer

**Goal**: Implement the phase step-by-step

1. Read IMPLEMENTATION_PLAN.md (15 min)
2. Follow COMMIT_CHECKLIST.md for each commit
3. Validate after each commit
4. Use TESTING.md to verify configuration

### Code Reviewer

**Goal**: Review the implementation efficiently

1. Read IMPLEMENTATION_PLAN.md to understand strategy
2. Use guides/REVIEW.md for commit-by-commit review
3. Verify against VALIDATION_CHECKLIST.md

### Tech Lead / Project Manager

**Goal**: Track progress and quality

1. Check INDEX.md for status
2. Review IMPLEMENTATION_PLAN.md for metrics
3. Use VALIDATION_CHECKLIST.md for final approval

### Architect / Senior Dev

**Goal**: Ensure architectural consistency

1. Review IMPLEMENTATION_PLAN.md for design decisions
2. Check ENVIRONMENT_SETUP.md for dependencies
3. Validate against project standards

---

## Metrics

| Metric                  | Target | Actual |
| ----------------------- | ------ | ------ |
| **Total Commits**       | 4      | -      |
| **Implementation Time** | 2-3h   | -      |
| **Review Time**         | 1-2h   | -      |
| **Lint Errors**         | 0      | -      |
| **Format Errors**       | 0      | -      |

---

## FAQ

**Q: Why separate ESLint and Prettier?**
A: Mixing them causes conflicts. ESLint handles code quality, Prettier handles formatting. `eslint-config-prettier` disables conflicting rules.

**Q: Why use `prettier-plugin-tailwindcss`?**
A: It automatically sorts Tailwind CSS classes in a consistent, recommended order.

**Q: What files are excluded from linting?**
A: `payload-types.ts` (generated), `.next/`, `node_modules/`, and other build artifacts.

**Q: How does CI caching work for ESLint?**
A: ESLint's `--cache` flag stores results in `.eslintcache`. We persist this between CI runs.

---

## Important Links

- [ESLint 9 Flat Config Docs](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [Prettier Plugin Tailwind](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- [Previous Phase (Phase 2)](../phase_2/INDEX.md)
- [Next Phase (Phase 4)](../phase_4/INDEX.md)
- [CI-CD Security Spec](../../../../../CI-CD-Security.md)

---

**Document Created**: 2025-11-29
**Last Updated**: 2025-11-29
