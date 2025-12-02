# Epic 3: Frontend Core & Design System

## Epic Overview

**Status**: PLANNING
**Created**: 2025-12-01
**Target Completion**: TBD

### Description

Construire l'identité visuelle et la navigation bilingue du blog. Cet epic établit les fondations frontend avec le routing i18n, le design system "Dark Mode sophistiqué" et le layout global de navigation.

### Objectives

1. Implémenter le routing i18n avec `next-intl` pour une navigation bilingue (FR/EN)
2. Intégrer Tailwind 4 et shadcn/ui avec la charte graphique "Anthracite & Vert Canard"
3. Créer le layout global (Header, Footer) avec sélecteur de langue fonctionnel

### User Value

- **Utilisateurs**: Navigation fluide dans leur langue préférée avec une interface moderne et accessible
- **Développeurs**: Base de composants réutilisables et cohérents pour le développement futur
- **SEO**: URLs localisées et structure sémantique optimisée pour l'indexation multilingue

---

## Stories

| Story | Title | Description | Status | Phases | Progress |
|-------|-------|-------------|--------|--------|----------|
| 3.1 | Routing i18n & Middleware | Implémenter le routing bilingue avec `next-intl`, URLs localisées (`/fr`, `/en`) et persistance de la préférence utilisateur | COMPLETED | 4 | 4/4 ✅ |
| 3.2 | Intégration Design System (Dark Mode) | Installer Tailwind 4 et shadcn/ui, appliquer la charte graphique "Anthracite & Vert Canard" | IN PROGRESS | 4 | 3/4 (Phase 4 📋) |
| 3.3 | Layout Global & Navigation | Créer Header et Footer cohérents avec sélecteur de langue fonctionnel | NOT STARTED | - | 0/0 |

---

## Story Management

### Workflow

1. **Plan Story**: Use `/plan-story Epic 3 Story 3.X` to create story specification and phases
2. **Generate Phase Docs**: Use `/generate-phase-doc Epic 3 Story 3.X Phase Y` for each phase
3. **Implement**: Use `phase-implementer` agent to implement one commit at a time
4. **Update Tracking**: Mark phases and stories as completed in this document

### Status Legend

- **NOT STARTED**: Story not yet planned
- **IN PROGRESS**: Story planned and implementation started
- **COMPLETED**: All phases completed and validated

---

## Metrics

### Progress Summary

- **Stories Started**: 2/3
- **Stories Completed**: 1/3
- **Total Phases**: 8 (4 + 4)
- **Phases Completed**: 7 (4 + 3)

### Timeline

- **Epic Created**: 2025-12-01
- **Expected Start**: TBD
- **Target Completion**: TBD

---

## Dependencies

### Story Dependencies

```
Story 3.1 (i18n Routing)
    └── Story 3.3 (Layout) - needs i18n context for language switcher

Story 3.2 (Design System)
    └── Story 3.3 (Layout) - needs design tokens and components
```

### External Dependencies

| Dependency | Type | Status | Notes |
|------------|------|--------|-------|
| Epic 1 (Foundation) | Epic | COMPLETED | Cloudflare infrastructure required |
| Epic 2 (CMS Core) | Epic | IN PROGRESS | Collections needed for content rendering |
| Tailwind 4 | Package | Available | CSS framework |
| shadcn/ui | Package | Available | Component library |
| next-intl | Package | Available | i18n library for Next.js |

---

## Status Updates

### Milestones

| Milestone | Target Date | Status | Notes |
|-----------|-------------|--------|-------|
| i18n Routing functional | TBD | PENDING | Story 3.1 |
| Design System integrated | TBD | PENDING | Story 3.2 |
| Layout complete | TBD | PENDING | Story 3.3 |
| Epic 3 Complete | TBD | PENDING | All stories validated |

### Recent Updates

| Date | Update |
|------|--------|
| 2025-12-02 | Story 3.2 Phase 3 COMPLETED: Design tokens & visual migration (5 commits) |
| 2025-12-02 | Story 3.2 Phase 2 COMPLETED: shadcn/ui & utility functions |
| 2025-12-02 | Story 3.2 Phase 1 COMPLETED: Tailwind CSS 4 foundation |
| 2025-12-02 | Story 3.2 planned: 4 phases (~12-16 commits), design system setup |
| 2025-12-02 | Story 3.1 marked as COMPLETED (i18n routing fully functional) |
| 2025-12-01 | Story 3.1 Phase 1 documentation generated (7 files, ~145 lines implementation) |
| 2025-12-01 | Story 3.1 planned: 4 phases, ~12-16 commits |
| 2025-12-01 | Epic initialized with 3 stories from PRD |

---

## Reference Documents

### Specifications

- [PRD.md](../../../PRD.md) - Product Requirements Document
- [Brief.md](../../../Brief.md) - Project Brief
- [Concept.md](../../../Concept.md) - Project Concept

### Design Guidelines

- **Primary Background**: `#1A1D23` (Anthracite)
- **Accent Color**: `#14B8A6` (Vert Canard)
- **Typography**: Inter/Nunito Sans (body), JetBrains Mono (code)
- **Target**: WCAG 2.1 AA compliance

### Story Specifications

- Story 3.1: [story_3_1/story_3.1.md](story_3_1/story_3.1.md) ✅
- Story 3.2: [story_3_2/story_3.2.md](story_3_2/story_3.2.md) 🚧
- Story 3.3: `story_3_3/story_3.3.md` (pending)

---

## Checklists

### Epic Setup

- [x] Epic directory created
- [x] EPIC_TRACKING.md initialized
- [x] Stories extracted from PRD
- [x] Dependencies documented
- [x] First story planned

### Epic Completion

- [ ] All stories completed
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Epic status set to COMPLETED

---

## Quick Commands

```bash
# Plan stories
/plan-story Epic 3 Story 3.1
/plan-story Epic 3 Story 3.2
/plan-story Epic 3 Story 3.3

# Generate phase docs (after planning)
/generate-phase-doc Epic 3 Story 3.1 Phase 1

# Check epic status
cat docs/specs/epics/epic_3/EPIC_TRACKING.md

# View story specs
ls docs/specs/epics/epic_3/story_3_*/
```
