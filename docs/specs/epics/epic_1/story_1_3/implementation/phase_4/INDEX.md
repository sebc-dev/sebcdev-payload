# Phase 4 - Code Quality: Dead Code & Type Sync

**Status**: NOT STARTED
**Started**: TBD
**Target Completion**: TBD

---

## Quick Navigation

### Documentation Structure

```
phase_4/
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

Configure **Knip** for dead code detection and implement **Payload type synchronization** validation to ensure the codebase remains clean and type-safe. This phase targets AI-generated code hallucinations by detecting unused files, exports, and dependencies, while ensuring Payload CMS types stay synchronized with collections configuration.

### Scope

- Install and configure Knip for Next.js 15 + Payload CMS 3.0
- Define explicit entry points for convention-based frameworks
- Exclude generated files and migrations from analysis
- Create type sync validation script for `payload-types.ts`
- Integrate both tools into quality-gate workflow
- Configure caching for CI performance

### Acceptance Criteria Addressed

- **CA2 (Hygiène)**: Knip configuré pour Next.js 15 + Payload CMS avec points d'entrée explicites
- **CA3 (Type Sync)**: Vérification stricte des types Payload (`payload-types.ts` synchronisé)

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
cat docs/specs/epics/epic_1/story_1_3/implementation/phase_4/IMPLEMENTATION_PLAN.md

# Setup environment
cat docs/specs/epics/epic_1/story_1_3/implementation/phase_4/ENVIRONMENT_SETUP.md
```

### Step 2: Atomic Implementation (4 commits)

```bash
# Commit 1: Knip Configuration
cat docs/specs/epics/epic_1/story_1_3/implementation/phase_4/COMMIT_CHECKLIST.md # Section Commit 1

# Commit 2: Knip Workflow Integration
cat docs/specs/epics/epic_1/story_1_3/implementation/phase_4/COMMIT_CHECKLIST.md # Section Commit 2

# Commit 3: Type Sync Validation
cat docs/specs/epics/epic_1/story_1_3/implementation/phase_4/COMMIT_CHECKLIST.md # Section Commit 3

# Commit 4: Documentation
cat docs/specs/epics/epic_1/story_1_3/implementation/phase_4/COMMIT_CHECKLIST.md # Section Commit 4
```

### Step 3: Validation

```bash
# Run Knip analysis
pnpm exec knip --production

# Generate and verify Payload types
pnpm generate:types:payload
git diff --exit-code src/payload-types.ts

# Type-checking
pnpm exec tsc --noEmit

# Final validation
cat docs/specs/epics/epic_1/story_1_3/implementation/phase_4/validation/VALIDATION_CHECKLIST.md
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
| **Knip Errors**         | 0      | -      |
| **Type Sync Errors**    | 0      | -      |

---

## FAQ

**Q: What is Knip and why do we need it?**
A: Knip detects dead code (unused files, exports, dependencies) that often accumulates from AI-generated code. It catches hallucinations where code is generated but never used.

**Q: Why are Next.js conventions tricky for Knip?**
A: Next.js uses "convention over configuration" - files like `page.tsx`, `layout.tsx` are auto-discovered by the framework but appear as dead code to static analyzers since nothing imports them directly.

**Q: What is type sync validation?**
A: Payload CMS generates TypeScript types from your collections. Type sync ensures these types are regenerated before CI so any drift between config and types is caught.

**Q: What files does Knip ignore?**
A: Generated files (`payload-types.ts`), migrations (`drizzle/migrations/`), and assets (`public/`).

**Q: Why use `--production` mode?**
A: Production mode ignores test files and devDependencies, focusing analysis on what ships to production.

---

## Important Links

- [Knip Documentation](https://knip.dev/)
- [Knip Next.js Plugin](https://knip.dev/reference/plugins/next)
- [Previous Phase (Phase 3)](../phase_3/INDEX.md)
- [Next Phase (Phase 5)](../phase_5/INDEX.md)
- [CI-CD Security Spec](../../../../../CI-CD-Security.md)
- [Knip CI Documentation](../../../../../tech/github/knip-CI.md)

---

**Document Created**: 2025-11-29
**Last Updated**: 2025-11-29
