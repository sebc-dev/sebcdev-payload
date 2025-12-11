# Phase 1: Package Installation & Collection Configuration

**Story**: Story 4.3 - Live Preview
**Epic**: Epic 4 - Article Reading Experience
**Phase**: 1 of 3
**Status**: NOT STARTED

---

## Phase Overview

### Objective

Install the `@payloadcms/live-preview-react` package and configure the Articles collection with Live Preview URL generation and responsive breakpoints.

### User Value

This phase enables the Live Preview panel to appear in Payload Admin when editing articles. Authors will see a split view layout with the form on the left and a preview panel on the right (empty until Phase 3 integration).

### Deliverables

| # | Deliverable | Description | Verification |
|---|-------------|-------------|--------------|
| 1 | Package Installed | `@payloadcms/live-preview-react` added to dependencies | `pnpm list @payloadcms/live-preview-react` |
| 2 | Collection Config | Articles collection has `livePreview` configuration | Manual inspection in admin panel |
| 3 | Bilingual URLs | Preview URL generates with correct locale (FR/EN) | Test in admin with both locales |
| 4 | Responsive Breakpoints | Mobile, Tablet, Desktop breakpoints configured | Breakpoint selector visible in admin |

---

## Quick Navigation

### Documentation Files

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Atomic commit breakdown | Before starting implementation |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) | Step-by-step checklist per commit | During implementation |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Environment configuration | Before starting Phase 1 |
| [guides/REVIEW.md](./guides/REVIEW.md) | Code review guidelines | When reviewing PRs |
| [guides/TESTING.md](./guides/TESTING.md) | Testing strategy | When writing/running tests |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Final validation | After all commits completed |

### Related Documentation

| Document | Location |
|----------|----------|
| Story Specification | [story_4.3.md](../../story_4.3.md) |
| Phases Plan | [PHASES_PLAN.md](../PHASES_PLAN.md) |
| Epic Tracking | [EPIC_TRACKING.md](../../../EPIC_TRACKING.md) |
| Technical Architecture | [Architecture_technique.md](../../../../../../Architecture_technique.md) |

---

## Implementation Summary

### Atomic Commits (3 commits)

| # | Commit | Files Changed | Est. Time |
|---|--------|---------------|-----------|
| 1 | Install @payloadcms/live-preview-react package | `package.json`, `pnpm-lock.yaml` | 15 min |
| 2 | Add livePreview configuration to Articles collection | `src/collections/Articles.ts` | 30 min |
| 3 | Add NEXT_PUBLIC_SERVER_URL environment variable | `.env.example`, `.env` | 15 min |

**Total Estimated Time**: 1 hour (development) + 30 min (testing)

### Files Affected

```
package.json                    # Add dependency
pnpm-lock.yaml                  # Lock file update (auto-generated)
src/collections/Articles.ts     # Add livePreview config to admin section
.env.example                    # Document new env var
.env                            # Add local dev value
```

---

## Prerequisites

### Before Starting

- [ ] Story 4.1 (Article Rendering) infrastructure in place
- [ ] Story 4.2 (TOC & Progress) can be in progress (independent)
- [ ] Development environment set up (see [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md))
- [ ] Payload Admin accessible at `/admin`

### Technical Requirements

- Node.js 20+
- pnpm 9+
- Payload CMS 3.65.x
- Next.js 15.x

---

## Success Criteria

### Phase Completion Requirements

| Criterion | Verification Method |
|-----------|---------------------|
| Package installed without conflicts | `pnpm install` succeeds |
| TypeScript compiles | `pnpm exec tsc --noEmit` |
| Admin panel loads | Navigate to `/admin` |
| Live Preview panel visible | Open article edit page, see split view |
| Preview URL correct | Check iframe src in DevTools |
| Breakpoints work | Click breakpoint selector in admin |

### Acceptance Criteria Covered

From Story 4.3 specification:

- **TA1**: Installation du package `@payloadcms/live-preview-react` (MUST)
- **TA2**: Configuration de `livePreview.url` dans la collection Articles (MUST)

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Package version incompatibility | Low | Medium | Verify Payload 3.65.x compatibility |
| Type definition conflicts | Low | Low | Use exact types from Payload |
| Build failure | Low | Medium | Test build after each commit |

---

## Next Phase

After completing Phase 1, proceed to:

**Phase 2: RefreshRouteOnSave Component Implementation**
- Creates the client-side component
- Listens for Payload Admin messages
- Triggers route refreshes

---

## Workflow Checklist

### Implementation Flow

```
1. Read ENVIRONMENT_SETUP.md
   ↓
2. Read IMPLEMENTATION_PLAN.md
   ↓
3. For each commit:
   a. Follow COMMIT_CHECKLIST.md
   b. Run tests (see guides/TESTING.md)
   c. Self-review (see guides/REVIEW.md)
   d. Commit with gitmoji
   ↓
4. Run validation/VALIDATION_CHECKLIST.md
   ↓
5. Update EPIC_TRACKING.md progress
```

---

**Phase Created**: 2025-12-11
**Phase Version**: 1.0
**Generated by**: Claude Code (phase-doc-generator skill)
