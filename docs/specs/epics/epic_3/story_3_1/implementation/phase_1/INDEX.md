# Phase 1 - Foundation: Configuration & Installation

**Status**: 🚧 NOT STARTED
**Started**: -
**Target Completion**: TBD

---

## 📋 Quick Navigation

### Documentation Structure

```
phase_1/
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

## 🎯 Phase Objective

Install `next-intl` and establish the foundational i18n configuration for the Next.js 15 App Router frontend. This phase creates the infrastructure needed for locale routing without touching the existing app directory structure.

### Scope

- ✅ Install `next-intl` package (v4.x for App Router support)
- ✅ Create i18n configuration files (`config.ts`, `routing.ts`, `request.ts`)
- ✅ Create minimal message files structure (FR/EN)
- ✅ Add TypeScript type definitions for messages
- ✅ Validate configuration compiles and lints correctly

### Out of Scope (Phase 2+)

- ❌ Middleware implementation (Phase 2)
- ❌ App directory restructuring with `[locale]` (Phase 3)
- ❌ E2E tests (Phase 4)

---

## 📚 Available Documents

| Document | Description | For Who | Duration |
|----------|-------------|---------|----------|
| **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** | Atomic strategy in 3 commits | Developer | 15 min |
| **[COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md)** | Detailed checklist per commit | Developer | Reference |
| **[ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)** | Package installation & setup | DevOps/Dev | 10 min |
| **[guides/REVIEW.md](./guides/REVIEW.md)** | Code review guide | Reviewer | 20 min |
| **[guides/TESTING.md](./guides/TESTING.md)** | Testing guide (config validation) | QA/Dev | 15 min |
| **[validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)** | Final validation checklist | Tech Lead | 20 min |

---

## 🔄 Implementation Workflow

### Step 1: Initial Setup

```bash
# Read the PHASES_PLAN.md
cat docs/specs/epics/epic_3/story_3_1/implementation/PHASES_PLAN.md

# Read the atomic implementation plan for this phase
cat docs/specs/epics/epic_3/story_3_1/implementation/phase_1/IMPLEMENTATION_PLAN.md

# Setup environment
cat docs/specs/epics/epic_3/story_3_1/implementation/phase_1/ENVIRONMENT_SETUP.md
```

### Step 2: Atomic Implementation (3 commits)

```bash
# Commit 1: Install next-intl package
cat docs/specs/epics/epic_3/story_3_1/implementation/phase_1/COMMIT_CHECKLIST.md # Section Commit 1

# Commit 2: Create i18n configuration files
cat docs/specs/epics/epic_3/story_3_1/implementation/phase_1/COMMIT_CHECKLIST.md # Section Commit 2

# Commit 3: Create message files and TypeScript types
cat docs/specs/epics/epic_3/story_3_1/implementation/phase_1/COMMIT_CHECKLIST.md # Section Commit 3
```

### Step 3: Validation

```bash
# Type-checking
pnpm exec tsc --noEmit

# Linting
pnpm lint

# Code review
cat docs/specs/epics/epic_3/story_3_1/implementation/phase_1/guides/REVIEW.md

# Final validation
cat docs/specs/epics/epic_3/story_3_1/implementation/phase_1/validation/VALIDATION_CHECKLIST.md
```

---

## 🎯 Use Cases by Profile

### 🧑‍💻 Developer

**Goal**: Implement the phase step-by-step

1. Read IMPLEMENTATION_PLAN.md (15 min)
2. Follow COMMIT_CHECKLIST.md for each commit
3. Validate after each commit (`pnpm exec tsc --noEmit && pnpm lint`)
4. Use TESTING.md to verify configuration

### 👀 Code Reviewer

**Goal**: Review the implementation efficiently

1. Read IMPLEMENTATION_PLAN.md to understand strategy
2. Use guides/REVIEW.md for commit-by-commit review
3. Verify against VALIDATION_CHECKLIST.md

### 📊 Tech Lead / Project Manager

**Goal**: Track progress and quality

1. Check INDEX.md for status
2. Review IMPLEMENTATION_PLAN.md for metrics
3. Use VALIDATION_CHECKLIST.md for final approval

### 🏗️ Architect / Senior Dev

**Goal**: Ensure architectural consistency

1. Review IMPLEMENTATION_PLAN.md for design decisions
2. Check that `next-intl` patterns match official docs
3. Validate Cloudflare Workers compatibility

---

## 📊 Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| **Total Commits** | 3 | - |
| **Implementation Time** | 1-2h | - |
| **Review Time** | 30-45min | - |
| **Test Coverage** | N/A (config only) | - |
| **Type Safety** | 100% | - |

---

## ❓ FAQ

**Q: Why only 3 commits for this phase?**
A: Phase 1 is foundational and simple. It only installs a package and creates configuration files. Three commits provide clear separation without artificial splitting.

**Q: Can I implement multiple commits at once?**
A: Not recommended. Atomic commits allow for easier review and rollback if something goes wrong.

**Q: What if `next-intl` has a newer version?**
A: Stick with v4.x as specified. Newer versions may have breaking changes with App Router async APIs.

**Q: What if I find an issue in a previous commit?**
A: Fix it in the current branch, then consider if it needs a separate commit.

**Q: Can I skip tests?**
A: Phase 1 has minimal testing (config validation only). Unit tests for message utilities are optional but recommended.

---

## 🔗 Important Links

- [PHASES_PLAN.md](../PHASES_PLAN.md) - Full story phases overview
- [Story 3.1 Specification](../../story_3.1.md) - Story requirements
- [next-intl App Router Docs](https://next-intl.dev/docs/getting-started/app-router)
- [EPIC_TRACKING.md](../../../EPIC_TRACKING.md) - Epic progress tracking
- [Phase 2: Middleware](../phase_2/) - Next phase (after this one)
