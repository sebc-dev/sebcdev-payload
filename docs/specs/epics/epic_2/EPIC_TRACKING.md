# Epic 2 : Content Management System (CMS) Core

## Epic Overview

**Status**: PLANNING
**Created**: 2025-11-29
**Target Completion**: -

### Description

Configurer le coeur metier du blog sur l'infrastructure Payload CMS. Cette epic couvre la mise en place des collections de contenu, l'internationalisation (i18n), la validation du stockage media sur R2, et la configuration de l'editeur Lexical avec les donnees initiales.

### Objectives

1. Creer les collections `Articles` et `Pages` avec support i18n natif
2. Valider l'integration du stockage R2 pour les medias
3. Configurer l'editeur Lexical avec les blocs necessaires (Code, Citation, Image)
4. Initialiser les donnees de reference (9 categories canoniques)

### User Value

En tant qu'auteur unique du blog, je veux disposer d'un systeme de gestion de contenu complet et bilingue, afin de pouvoir creer, editer et publier mes articles techniques en francais et en anglais avec une experience d'edition riche et structuree.

---

## Stories

| Story | Title                                     | Description                                                                                                                                                                | Status      | Phases | Progress |
| ----- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------ | -------- |
| 2.1   | Configuration des Collections Blog & i18n | Creer les collections `Articles` et `Pages` avec l'option `localized: true` sur les champs de contenu (Titre, Corps, SEO), afin de gerer le contenu en Francais et Anglais | PLANNED     | 5      | 0/5      |
| 2.2   | Validation du Stockage R2                 | Uploader une image test depuis le panneau admin et verifier sa presence dans le bucket R2, afin de valider que le plugin Cloud Storage est correctement configure          | PLANNED     | 3      | 0/3      |
| 2.3   | Editeur Lexical & Seed Data               | Disposer d'un editeur Lexical configure avec les blocs "Code", "Citation" et "Image", et executer un script de seed pour creer les 9 categories canoniques                 | NOT STARTED | -      | 0/0      |

---

## Story Management

### Workflow

1. **Planning**: Use `/plan-story Epic 2 Story 2.X` to create story specification and phases
2. **Documentation**: Use `/generate-phase-doc` to create detailed implementation docs for each phase
3. **Implementation**: Use `phase-implementer` agent to implement one commit at a time
4. **Completion**: Update this table as phases complete

### Story Status Values

- `NOT STARTED` - Story not yet planned
- `IN PROGRESS` - Story planned and implementation started
- `COMPLETED` - All phases completed and validated

---

## Epic-Level Metrics

| Metric            | Value |
| ----------------- | ----- |
| Total Stories     | 3     |
| Stories Started   | 2     |
| Stories Completed | 0     |
| Total Phases      | 8     |
| Phases Completed  | 0     |

---

## Dependencies

### Story Dependencies

```
Story 2.1 (Collections Blog & i18n)
    |
    v
Story 2.2 (Validation Stockage R2) [peut demarrer en parallele]
    |
    v
Story 2.3 (Editeur Lexical & Seed Data) [depend de 2.1 pour les collections]
```

### External Dependencies

| Dependency        | Status    | Notes                              |
| ----------------- | --------- | ---------------------------------- |
| Epic 1 Foundation | COMPLETED | Infrastructure Cloudflare deployee |
| Cloudflare D1     | AVAILABLE | Base de donnees provisionnee       |
| Cloudflare R2     | AVAILABLE | Bucket media provisionne           |
| Payload CMS 3.0   | INSTALLED | Template with-cloudflare-d1        |

---

## Status Updates

### Milestones

| Milestone              | Target Date | Status      |
| ---------------------- | ----------- | ----------- |
| Epic Planning Complete | -           | IN PROGRESS |
| Story 2.1 Complete     | -           | NOT STARTED |
| Story 2.2 Complete     | -           | NOT STARTED |
| Story 2.3 Complete     | -           | NOT STARTED |
| Epic Complete          | -           | NOT STARTED |

### Recent Updates

| Date       | Update                                                         |
| ---------- | -------------------------------------------------------------- |
| 2025-11-29 | Epic initialized - EPIC_TRACKING.md created                    |
| 2025-11-29 | Story 2.1 planned - 5 phases defined in PHASES_PLAN.md         |
| 2025-11-30 | Phase 3 documentation generated - Articles Collection (7 docs) |
| 2025-11-30 | Story 2.2 planned - 3 phases defined in PHASES_PLAN.md         |
| 2025-11-30 | Story 2.2 Phase 1 documentation generated (7 docs)             |

---

## Reference Documents

### Specifications

- [PRD.md](../../PRD.md) - Product Requirements Document
- [Brief.md](../../Brief.md) - Project Brief
- [Concept.md](../../Concept.md) - Vision and Content Architecture

### Story Specifications

_Links will be added as stories are planned_

- Story 2.1: [story_2_1/story_2.1.md](story_2_1/story_2.1.md) | [PHASES_PLAN.md](story_2_1/implementation/PHASES_PLAN.md)
  - Phase 1: [phase_1/INDEX.md](story_2_1/implementation/phase_1/INDEX.md) - i18n Configuration (documented)
  - Phase 2: [phase_2/INDEX.md](story_2_1/implementation/phase_2/INDEX.md) - Categories & Tags (documented)
  - Phase 3: [phase_3/INDEX.md](story_2_1/implementation/phase_3/INDEX.md) - Articles Collection (documented)
  - Phase 4: Pages Collection (pending)
  - Phase 5: Integration & Validation (pending)
- Story 2.2: [story_2_2/story_2.2.md](story_2_2/story_2.2.md) | [PHASES_PLAN.md](story_2_2/implementation/PHASES_PLAN.md)
  - Phase 1: [phase_1/INDEX.md](story_2_2/implementation/phase_1/INDEX.md) - Media Collection Enhancement (documented)
  - Phase 2: Integration Tests R2 (pending)
  - Phase 3: E2E Tests & Validation (pending)
- Story 2.3: `story_2_3/story_2.3.md` (pending)

### Technical References

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Payload i18n Configuration](https://payloadcms.com/docs/configuration/i18n)
- [Payload Lexical Editor](https://payloadcms.com/docs/rich-text/lexical)
- [Cloudflare R2 Storage](https://developers.cloudflare.com/r2/)

---

## Checklists

### Epic Setup Checklist

- [x] EPIC_TRACKING.md created
- [x] All stories from PRD listed
- [x] Dependencies documented
- [x] Git branch created (`epic/epic-2-cms-core`)
- [ ] Stories planned with `/plan-story`

### Epic Execution Checklist

- [ ] Story 2.1 planned and completed
- [ ] Story 2.2 planned and completed
- [ ] Story 2.3 planned and completed
- [ ] All tests passing
- [ ] Quality Gate validated

### Epic Completion Checklist

- [ ] All stories marked COMPLETED
- [ ] Metrics updated
- [ ] Final validation performed
- [ ] Epic status changed to COMPLETED

---

## Quick Actions

```bash
# Plan stories
/plan-story Epic 2 Story 2.1
/plan-story Epic 2 Story 2.2
/plan-story Epic 2 Story 2.3

# Generate phase documentation (after planning)
/generate-phase-doc Epic 2 Story 2.1 Phase 1

# Check epic status
cat docs/specs/epics/epic_2/EPIC_TRACKING.md

# View story specs
ls docs/specs/epics/epic_2/
```
