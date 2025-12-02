# Phase 3 - App Directory Restructure

**Status**: NOT STARTED
**Started**: -
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

Restructure the Next.js App Router directory to introduce the `[locale]` dynamic segment, enabling locale-aware routing for the frontend. This phase migrates existing pages and layouts while preserving the Payload admin panel routes unchanged.

### Scope

- Create `src/app/[locale]/layout.tsx` with `NextIntlClientProvider` and dynamic `<html lang>`
- Create `src/app/[locale]/(frontend)/layout.tsx` migrated from existing layout
- Create `src/app/[locale]/(frontend)/page.tsx` migrated from existing homepage
- Move `styles.css` to the new location
- Delete old `src/app/(frontend)/` files after migration
- Configure `generateStaticParams()` for static locale paths
- Ensure Payload admin panel remains accessible at `/admin`

### Out of Scope (Phase 4)

- E2E tests for routing (Phase 4)
- Integration tests (Phase 4)
- Cloudflare Workers validation (Phase 4)

---

## Dependencies

### Required Before Phase 3

| Dependency | Status | Description |
|------------|--------|-------------|
| Phase 1: Foundation | COMPLETED | `next-intl` installed, i18n config files created |
| Phase 2: Middleware | COMPLETED | Middleware routing, cookie persistence |

### Files from Previous Phases

| File | Phase | Purpose |
|------|-------|---------|
| `src/i18n/config.ts` | 1 | Locale definitions |
| `src/i18n/routing.ts` | 1 | Routing configuration with `generateStaticParams` helper |
| `src/i18n/request.ts` | 1 | Server-side request config |
| `messages/fr.json` | 1 | French translations |
| `messages/en.json` | 1 | English translations |
| `middleware.ts` | 2 | Locale detection and routing |

---

## Available Documents

| Document | Description | For Who | Duration |
|----------|-------------|---------|----------|
| **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** | Atomic strategy in 5 commits | Developer | 20 min |
| **[COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md)** | Detailed checklist per commit | Developer | Reference |
| **[ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)** | Pre-phase verification | DevOps/Dev | 10 min |
| **[guides/REVIEW.md](./guides/REVIEW.md)** | Code review guide | Reviewer | 30 min |
| **[guides/TESTING.md](./guides/TESTING.md)** | Testing guide (manual + integration) | QA/Dev | 20 min |
| **[validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md)** | Final validation checklist | Tech Lead | 25 min |

---

## Implementation Workflow

### Step 1: Pre-Implementation Verification

```bash
# Verify Phase 1 & 2 are complete
cat docs/specs/epics/epic_3/story_3_1/implementation/phase_1/validation/VALIDATION_CHECKLIST.md
cat docs/specs/epics/epic_3/story_3_1/implementation/phase_2/validation/VALIDATION_CHECKLIST.md

# Verify i18n config exists
ls -la src/i18n/
cat src/i18n/config.ts

# Verify middleware is working
cat middleware.ts

# Verify current app structure
ls -la src/app/(frontend)/

# Read environment setup
cat docs/specs/epics/epic_3/story_3_1/implementation/phase_3/ENVIRONMENT_SETUP.md
```

### Step 2: Atomic Implementation (5 commits)

```bash
# Follow IMPLEMENTATION_PLAN.md for strategy overview
cat docs/specs/epics/epic_3/story_3_1/implementation/phase_3/IMPLEMENTATION_PLAN.md

# Commit 1: Create [locale] root layout with NextIntlClientProvider
cat docs/specs/epics/epic_3/story_3_1/implementation/phase_3/COMMIT_CHECKLIST.md # Section Commit 1

# Commit 2: Create [locale]/(frontend) layout
cat docs/specs/epics/epic_3/story_3_1/implementation/phase_3/COMMIT_CHECKLIST.md # Section Commit 2

# Commit 3: Migrate homepage to [locale]/(frontend)/page.tsx
cat docs/specs/epics/epic_3/story_3_1/implementation/phase_3/COMMIT_CHECKLIST.md # Section Commit 3

# Commit 4: Move styles.css to new location
cat docs/specs/epics/epic_3/story_3_1/implementation/phase_3/COMMIT_CHECKLIST.md # Section Commit 4

# Commit 5: Clean up old files and verify routes
cat docs/specs/epics/epic_3/story_3_1/implementation/phase_3/COMMIT_CHECKLIST.md # Section Commit 5
```

### Step 3: Validation

```bash
# Type-checking
pnpm exec tsc --noEmit

# Linting
pnpm lint

# Build verification
pnpm build

# Manual testing (dev server)
pnpm dev

# Then test in browser:
# - http://localhost:3000/ → should redirect to /fr
# - http://localhost:3000/fr → French homepage
# - http://localhost:3000/en → English homepage
# - http://localhost:3000/admin → Payload admin (unchanged)

# Code review guide
cat docs/specs/epics/epic_3/story_3_1/implementation/phase_3/guides/REVIEW.md

# Final validation
cat docs/specs/epics/epic_3/story_3_1/implementation/phase_3/validation/VALIDATION_CHECKLIST.md
```

---

## Use Cases by Profile

### Developer

**Goal**: Implement the phase step-by-step

1. Read IMPLEMENTATION_PLAN.md (20 min)
2. Follow ENVIRONMENT_SETUP.md for pre-checks
3. Follow COMMIT_CHECKLIST.md for each commit
4. Validate after each commit (`pnpm exec tsc --noEmit && pnpm lint`)
5. Run build after all commits (`pnpm build`)
6. Use TESTING.md for manual verification

### Code Reviewer

**Goal**: Review the implementation efficiently

1. Read IMPLEMENTATION_PLAN.md to understand strategy
2. Use guides/REVIEW.md for commit-by-commit review
3. Verify routing works correctly (no 404s)
4. Check against VALIDATION_CHECKLIST.md

### Tech Lead / Project Manager

**Goal**: Track progress and quality

1. Check INDEX.md for status
2. Review IMPLEMENTATION_PLAN.md for metrics
3. Use VALIDATION_CHECKLIST.md for final approval
4. Verify admin panel still works

### Architect / Senior Dev

**Goal**: Ensure architectural consistency

1. Review IMPLEMENTATION_PLAN.md for design decisions
2. Verify `NextIntlClientProvider` placement is correct
3. Check `generateStaticParams` implementation
4. Validate no breaking changes to Payload routes

---

## Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| **Total Commits** | 5 | - |
| **Implementation Time** | 2-3h | - |
| **Review Time** | 45-60min | - |
| **Files Changed** | ~8 | - |
| **Type Safety** | 100% | - |
| **Build Success** | Required | - |

---

## Risk Assessment

### High Risk Items

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Routes break | Medium | High | Test each route after migration |
| Admin panel affected | Low | Critical | Verify /admin immediately |
| Build fails | Medium | High | Validate TypeScript after each commit |
| Styles lost | Low | Medium | Copy styles.css before deletion |

### Rollback Strategy

If issues occur:

```bash
# Revert last commit
git revert HEAD

# Or revert multiple commits to before Phase 3
git log --oneline -10  # Find commit before Phase 3
git revert HEAD~N..HEAD  # N = number of commits to revert
```

---

## FAQ

**Q: Why 5 commits for this phase?**
A: Phase 3 involves structural changes that are risky. Breaking into 5 commits allows:
1. Incremental validation
2. Easy rollback if something breaks
3. Clear separation of concerns (layout vs page vs cleanup)

**Q: Should I delete old files first or last?**
A: Last (Commit 5). This ensures everything works before removing the old code.

**Q: What if the build fails after migration?**
A: Check TypeScript errors first. Common issues:
- Missing imports in new files
- Wrong relative paths
- Missing `generateStaticParams` export

**Q: Will the middleware still work?**
A: Yes. The middleware redirects to `/{locale}/*` paths, which the new `[locale]` segment handles.

**Q: Can I test during migration?**
A: Yes, but expect temporary 404s until all files are migrated. Use git stash if needed to test.

---

## Important Links

- [PHASES_PLAN.md](../PHASES_PLAN.md) - Full story phases overview
- [Story 3.1 Specification](../../story_3.1.md) - Story requirements
- [next-intl App Router Layout](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing)
- [EPIC_TRACKING.md](../../../EPIC_TRACKING.md) - Epic progress tracking
- [Phase 2: Middleware](../phase_2/) - Previous phase
- [Phase 4: Validation](../phase_4/) - Next phase (after this one)
