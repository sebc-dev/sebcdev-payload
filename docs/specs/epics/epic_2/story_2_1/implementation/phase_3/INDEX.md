# Phase 3 - Articles Collection

**Status**: 🚧 IN PROGRESS
**Started**: 2025-11-30
**Target Completion**: TBD
**Current Commit**: 4/5

---

## 📋 Quick Navigation

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
    └── TESTING.MD (testing guide)
```

---

## 🎯 Phase Objective

Créer la collection **Articles** complète avec tous les champs requis, les relations vers d'autres collections (Categories, Tags, Media, Users), le hook de calcul automatique du temps de lecture, les champs SEO localisés, et un workflow de statut (draft/published/archived).

Cette phase est le cœur du système de blog, permettant aux auteurs de créer, éditer et publier des articles techniques en français et en anglais avec une expérience d'édition riche et structurée.

### Scope

- ✅ Hook `calculateReadingTime` pour calcul automatique du temps de lecture
- ✅ Collection `Articles` avec structure de base (titre, contenu, excerpt, slug)
- ✅ Relations vers Categories (1:N), Tags (N:N), Media (featuredImage), Users (author)
- ✅ Groupe SEO localisé (metaTitle, metaDescription)
- ✅ Workflow de statut (draft, published, archived)
- ✅ Champs metadata (publishedAt, readingTime)
- ✅ Migration D1 générée et appliquée
- ✅ Tests d'intégration complets

---

## 📚 Available Documents

| Document                                                                       | Description                              | For Who    | Duration  |
| ------------------------------------------------------------------------------ | ---------------------------------------- | ---------- | --------- |
| **🎯 [VALIDATION_REPORT_SUMMARY.md](./VALIDATION_REPORT_SUMMARY.md)** ⭐     | **READ THIS FIRST** - Validation report & corrections | Everyone | **10 min** |
| **[CODE_EXAMPLES_CORRECTED.md](./CODE_EXAMPLES_CORRECTED.md)** ⭐             | **Corrected code examples** (all files)  | Developer  | 20 min    |
| **[POST_IMPLEMENTATION_VALIDATION.md](./POST_IMPLEMENTATION_VALIDATION.md)** ⭐ | **Post-implementation checklist**      | Tech Lead  | 30 min    |
| **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** ✅                      | Atomic strategy in 5 commits (corrected) | Developer  | 15 min    |
| **[COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md)** ✅                            | Detailed checklist per commit (corrected)| Developer  | Reference |
| **[ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)**                             | Environment variables & setup            | DevOps/Dev | 10 min    |
| **[guides/REVIEW.md](./guides/REVIEW.md)**                                     | Code review guide                        | Reviewer   | 20 min    |
| **[guides/TESTING.md](./guides/TESTING.md)** ✅                                | Testing guide + Security section (corrected) | QA/Dev | 25 min  |
| **[validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)** | Final validation checklist               | Tech Lead  | 30 min    |

**Legend**: ⭐ = New corrected documents | ✅ = Updated with corrections

---

## 🔄 Implementation Workflow

### Step 1: Initial Setup

```bash
# Read the PHASES_PLAN.md
cat docs/specs/epics/epic_2/story_2_1/implementation/PHASES_PLAN.md

# Read the atomic implementation plan for this phase
cat docs/specs/epics/epic_2/story_2_1/implementation/phase_3/IMPLEMENTATION_PLAN.md

# Setup environment
cat docs/specs/epics/epic_2/story_2_1/implementation/phase_3/ENVIRONMENT_SETUP.md
```

### Step 2: Atomic Implementation (5 commits)

```bash
# Commit 1: Create calculateReadingTime hook
cat docs/specs/epics/epic_2/story_2_1/implementation/phase_3/COMMIT_CHECKLIST.md # Section Commit 1

# Commit 2: Create Articles collection base structure
cat docs/specs/epics/epic_2/story_2_1/implementation/phase_3/COMMIT_CHECKLIST.md # Section Commit 2

# Commit 3: Add relations and SEO fields to Articles
cat docs/specs/epics/epic_2/story_2_1/implementation/phase_3/COMMIT_CHECKLIST.md # Section Commit 3

# Commit 4: Add hooks and status workflow to Articles
cat docs/specs/epics/epic_2/story_2_1/implementation/phase_3/COMMIT_CHECKLIST.md # Section Commit 4

# Commit 5: Add Articles collection integration tests
cat docs/specs/epics/epic_2/story_2_1/implementation/phase_3/COMMIT_CHECKLIST.md # Section Commit 5
```

### Step 3: Validation

```bash
# Run tests
pnpm test:int

# Type-checking
pnpm exec tsc --noEmit

# Code review
cat docs/specs/epics/epic_2/story_2_1/implementation/phase_3/guides/REVIEW.md

# Final validation
cat docs/specs/epics/epic_2/story_2_1/implementation/phase_3/validation/VALIDATION_CHECKLIST.md
```

---

## 🎯 Use Cases by Profile

### 🧑‍💻 Developer

**Goal**: Implement the phase step-by-step

1. Read IMPLEMENTATION_PLAN.md (15 min)
2. Follow COMMIT_CHECKLIST.md for each commit
3. Validate after each commit
4. Use TESTING.md to write tests

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
2. Check ENVIRONMENT_SETUP.md for dependencies
3. Validate against project standards

---

## 📊 Metrics

| Metric                  | Target   | Actual |
| ----------------------- | -------- | ------ |
| **Total Commits**       | 5        | 4/5    |
| **Implementation Time** | 5-6.5h   | ~3h    |
| **Review Time**         | 3-4h     | -      |
| **Test Coverage**       | >80%     | 100%   |
| **Type Safety**         | 100%     | ✅     |

---

## ❓ FAQ

**Q: Can I implement multiple commits at once?**
A: Not recommended. Atomic commits allow for easier review and rollback.

**Q: What if I find an issue in a previous commit?**
A: Fix it in the current branch, then consider if it needs a separate commit.

**Q: How do I handle merge conflicts?**
A: Follow the atomic approach - resolve conflicts commit by commit.

**Q: Can I skip tests?**
A: No. Tests ensure each commit is validated and safe.

**Q: Why is the hook created before the collection?**
A: The hook is a reusable utility that can be tested independently. Creating it first allows us to reference it when building the collection, and it can be validated in isolation.

---

## 🔗 Important Links

- [PHASES_PLAN.md](../PHASES_PLAN.md) - Complete phase breakdown
- [Story 2.1 Specification](../../story_2.1.md) - Story details
- [Epic 2 Tracking](../../../EPIC_TRACKING.md) - Epic progress
- [Previous Phase: Phase 2](../phase_2/INDEX.md) - Categories & Tags
- [Next Phase: Phase 4](../phase_4/INDEX.md) - Pages Collection
- [Payload Collections Documentation](https://payloadcms.com/docs/configuration/collections)
- [Payload Hooks Documentation](https://payloadcms.com/docs/hooks/overview)
- [Payload Lexical Editor](https://payloadcms.com/docs/rich-text/lexical)
