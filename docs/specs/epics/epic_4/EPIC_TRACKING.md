# Epic 4 - Article Reading Experience

**Status**: 📋 PLANNING
**Created**: 2025-12-09
**Target Completion**: TBD

---

## 📖 Epic Overview

### Description

Cet epic vise à offrir un confort de lecture optimal pour les articles techniques. L'objectif est de transformer le contenu stocké dans Payload CMS en une expérience de lecture immersive et professionnelle, avec un rendu riche du contenu (code syntax-highlighted, images, mise en forme), une navigation intuitive dans les articles longs (Table des Matières, barre de progression), et une prévisualisation en temps réel pour l'auteur.

### Epic Objectives

- Implémenter le rendu des articles avec support complet du contenu riche (MDX/Lexical)
- Fournir une syntax highlighting performante pour les blocs de code
- Créer une Table des Matières (TOC) dynamique générée depuis la hiérarchie des titres
- Ajouter une barre de progression de lecture pour les articles longs
- Configurer le Live Preview de Payload pour une édition WYSIWYG

### User Value

Les lecteurs (développeurs mid-level, juniors, indie hackers) pourront consommer du contenu technique de qualité avec un confort de lecture optimal : navigation facilitée dans les articles longs, code syntax-highlighted lisible, et repères visuels de progression. L'auteur bénéficiera d'une expérience d'édition moderne avec prévisualisation en temps réel.

---

## 📚 Stories in This Epic

This epic contains **3 stories** as defined in the PRD:

| Story | Title | Description | Status | Phases | Progress |
|-------|-------|-------------|--------|--------|----------|
| 4.1 | Rendu Article & MDX | Affichage du contenu riche (code syntax-highlighted, images, mise en forme) via React Server Components | 🚧 IN PROGRESS | 5 | 0/5 |
| 4.2 | Table des Matières (TOC) & Progression | Barre de progression de lecture sticky et Table des Matières cliquable pour navigation | 🚧 IN PROGRESS | 4 | 0/4 |
| 4.3 | Live Preview | Mode prévisualisation temps réel Payload avec écran scindé pour l'auteur | 🚧 IN PROGRESS | 3 | 0/3 |

**Columns Explained**:

- **Story**: Reference ID (e.g., 4.1, 4.2)
- **Title**: Story name from PRD
- **Description**: One-line summary of what the story delivers
- **Status**: 📋 NOT STARTED → 🚧 IN PROGRESS → ✅ COMPLETED
- **Phases**: Number of phases when story is planned (empty until /plan-story is run)
- **Progress**: Completed phases out of total (e.g., "2/5" = 2 of 5 phases done)

---

## 🎯 Story Management

### How Stories Progress

For each story in the epic:

1. **Plan Phase** (use `/plan-story`)
   - Story spec created: `story_4_Y/story_4.Y.md`
   - Phases plan created: `story_4_Y/implementation/PHASES_PLAN.md`
   - Update this table: Set **Phases** column to phase count (e.g., "5")
   - Update **Status** to 🚧 IN PROGRESS

2. **Implement Phases** (use `phase-doc-generator` + `phase-implementer`)
   - Generate detailed phase docs
   - Implement phases one at a time
   - Update **Progress** column as each phase completes (e.g., "1/5" → "2/5" → ...)

3. **Complete Story**
   - All phases completed
   - Update **Status** to ✅ COMPLETED
   - Update **Progress** to final (e.g., "5/5")

### Quick Actions

```bash
# Initialize a story in this epic
/plan-story Epic 4 Story 4.1

# Generate docs for a phase
/generate-phase-doc Epic 4 Story 4.1 Phase 1

# Check epic progress at any time
cat docs/specs/epics/epic_4/EPIC_TRACKING.md
```

---

## 📊 Epic-Level Metrics

### Progress Summary

- **Stories Started**: 3 / 3
- **Stories Completed**: 0 / 3
- **Total Phases**: 12 (Story 4.1: 5, Story 4.2: 4, Story 4.3: 3)
- **Phases Completed**: 0 / 12

**Completion**: 0%

### Timeline

- **Epic Created**: 2025-12-09
- **Expected Start**: 2025-12-09
- **Expected Completion**: TBD
- **Actual Completion**: TBD

---

## 🔄 Epic Dependencies

### Dependencies Between Stories

- **Story 4.1 → Story 4.2**: Le rendu article doit être fonctionnel avant d'implémenter la TOC (qui parse les headings du contenu rendu)
- **Story 4.1 → Story 4.3**: Le rendu article doit être en place pour que le Live Preview ait quelque chose à prévisualiser
- **Story 4.2 et 4.3**: Peuvent être développées en parallèle une fois Story 4.1 terminée

### External Dependencies

- **Epic 2 (CMS Core)**: Les collections Articles doivent être configurées avec l'éditeur Lexical
- **Epic 3 (Frontend Core)**: Le Design System (Tailwind 4 + shadcn/ui) et le routing i18n doivent être en place
- **Payload CMS**: Support du Live Preview API
- **Shiki/Prism**: Librairie de syntax highlighting compatible Edge/Workers

### Technical Prerequisites

- Collection `Articles` avec champs localisés et éditeur Lexical configuré
- Layout global et routing i18n fonctionnels
- Design tokens (couleurs, typographie) définis

---

## 📝 Status Updates

Track epic-level milestones here:

- [ ] **Milestone 1**: Story 4.1 (Rendu Article) complétée - Target: TBD
- [ ] **Milestone 2**: Story 4.2 (TOC & Progression) complétée - Target: TBD
- [ ] **Milestone 3**: Story 4.3 (Live Preview) complétée - Target: TBD
- [ ] **Milestone 4**: Epic 4 complète avec tests E2E - Target: TBD

### Recent Updates

| Date | Update |
|------|--------|
| 2025-12-11 | Story 4.3 Phase 1 documentation generated (7 files) |
| 2025-12-11 | Story 4.3 planifiée en 3 phases (Live Preview) |
| 2025-12-10 | Story 4.2 planifiée en 4 phases (TOC & Progression) |
| 2025-12-09 | Phase 2 documentation generated (7 files) |
| 2025-12-09 | Phase 1 documentation generated (7 files) |
| 2025-12-09 | Story 4.1 planifiée en 5 phases |
| 2025-12-09 | Epic 4 initialisé, structure créée |

---

## 🔗 Reference Documents

### Story Specifications

- Story 4.1: `docs/specs/epics/epic_4/story_4_1/story_4.1.md` (created via /plan-story)
- Story 4.2: `docs/specs/epics/epic_4/story_4_2/story_4.2.md`
- Story 4.3: `docs/specs/epics/epic_4/story_4_3/story_4.3.md`

### Phase Plans

- Story 4.1: `docs/specs/epics/epic_4/story_4_1/implementation/PHASES_PLAN.md`
- Story 4.2: `docs/specs/epics/epic_4/story_4_2/implementation/PHASES_PLAN.md`
- Story 4.3: `docs/specs/epics/epic_4/story_4_3/implementation/PHASES_PLAN.md`

### Related Documentation

- PRD: `docs/specs/PRD.md` (Section Epic 4)
- Brief: `docs/specs/Brief.md`
- Concept: `docs/specs/Concept.md`

### Technical References

- EF2 (Expérience d'Édition Riche & Structurée): TOC auto-générée, temps de lecture
- EF6 (Live Preview): Split View, mise à jour temps réel
- EF8 (UX de Lecture): Barre de progression, cartes articles
- ENF2 (Performance & Web Vitals): LCP < 2.5s, CLS < 0.1

---

## 📋 Checklist

### Epic Setup

- [x] EPIC_TRACKING.md created
- [x] All stories from PRD added to table
- [x] Dependencies documented
- [ ] Team assigned

### During Epic Execution

- [x] First story planned (/plan-story)
- [x] Second story planned (Story 4.2)
- [x] Third story planned (Story 4.3)
- [ ] First phase completed
- [ ] First story validated
- [ ] Metrics updated

### Epic Completion

- [x] All stories planned (3/3 done)
- [ ] All stories in progress
- [ ] All stories completed
- [ ] Final review done
- [ ] Ready for deployment

---

**Epic Initialized**: 2025-12-09
**Last Updated**: 2025-12-11
**Created by**: Claude Code (epic-initializer skill)
