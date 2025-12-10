# Story 4.2 - Phases Implementation Plan

**Story**: Table des Matières (TOC) & Progression
**Epic**: Epic 4 - Article Reading Experience
**Created**: 2025-12-10
**Status**: 📋 PLANNING

---

## 📖 Story Overview

### Original Story Specification

**Location**: `docs/specs/epics/epic_4/story_4_2/story_4.2.md`

**Story Objective**: Améliorer l'expérience de lecture des articles techniques longs en fournissant deux outils de navigation essentiels : une barre de progression de lecture sticky et une Table des Matières (TOC) cliquable générée automatiquement depuis les headings de l'article.

**Acceptance Criteria**:

- AC1: Barre de progression sticky qui se met à jour en temps réel lors du défilement
- AC2: TOC auto-générée depuis les headings h2/h3 avec navigation cliquable
- AC3: Design responsive (modal mobile, sticky sidebar desktop)
- AC4: Intégration avec l'architecture Lexical/headings existante
- AC5: Conformité performance (CLS < 0.1) et accessibilité (WCAG 2.1 AA)

**User Value**: Les lecteurs (développeurs mid-level, juniors, indie hackers) pourront naviguer efficacement dans les articles techniques longs, se repérer via la progression visuelle, et sauter directement aux sections qui les intéressent via la TOC.

---

## 🎯 Phase Breakdown Strategy

### Why 4 Phases?

This story is decomposed into **4 atomic phases** based on:

✅ **Technical dependencies**: L'extraction des headings (données) doit précéder les composants UI qui consomment ces données. La barre de progression est indépendante de la TOC.

✅ **Risk mitigation**: La phase 1 (extraction) valide le parsing Lexical. Les phases 2 et 3 (Progress Bar et TOC) peuvent être développées en parallèle. La phase 4 assemble et teste l'ensemble.

✅ **Incremental value**: Chaque phase livre une fonctionnalité testable :
- Phase 1: Fonction utilitaire réutilisable
- Phase 2: Barre de progression fonctionnelle
- Phase 3: TOC complète (desktop + mobile)
- Phase 4: Intégration finale avec tests E2E

✅ **Team capacity**: Phases de 2-4 jours, taille optimale pour review et intégration continue.

✅ **Testing strategy**: Les phases 1-3 peuvent avoir des tests unitaires/integration. La phase 4 ajoute les tests E2E.

### Atomic Phase Principles

Each phase follows these principles:

- **Independent**: Peut être implémenté et testé séparément
- **Deliverable**: Produit une fonctionnalité tangible et testable
- **Sized appropriately**: 2-4 jours de travail par phase
- **Low coupling**: Dépendances minimales entre phases
- **High cohesion**: Tout le travail dans une phase sert un objectif unique

### Implementation Approach

```
[Phase 1] → [Phase 2] → [Phase 4]
    ↓          ↑           ↑
    └──────────┴→ [Phase 3]┘
       (parallel)
```

- Phase 1: Foundation (extraction des données)
- Phase 2: Reading Progress Bar (UI + interactions)
- Phase 3: Table of Contents (UI + interactions, mobile + desktop)
- Phase 4: Integration & Testing (assemblage, layout, E2E)

---

## 📦 Phases Summary

### Phase 1: TOC Data Extraction

**Objective**: Créer l'utilitaire d'extraction des headings du contenu Lexical pour alimenter la TOC.

**Scope**:

- Fonction `extractTOCHeadings()` pour parser le Lexical JSON
- Types TypeScript pour les données TOC
- Réutilisation de `slugify()` existant
- Tests unitaires de l'extraction

**Dependencies**:

- None (Foundation phase)

**Key Deliverables**:

- [ ] Type `TOCHeading` et `TOCData` définis
- [ ] Fonction `extractTOCHeadings(content: LexicalContent): TOCHeading[]`
- [ ] Tests unitaires couvrant différents cas (h2 only, h2+h3, empty, nested)
- [ ] Export depuis `@/lib/toc`

**Files Affected** (~5 files):

- `src/lib/toc/types.ts` (new)
- `src/lib/toc/extract-headings.ts` (new)
- `src/lib/toc/index.ts` (new)
- `tests/unit/lib/toc/extract-headings.spec.ts` (new)
- `src/components/richtext/nodes/Heading.tsx` (modify - export slugify)

**Estimated Complexity**: Low

**Estimated Duration**: 1-2 days (3-4 commits)

**Risk Level**: 🟢 Low

**Risk Factors**: Aucun - parsing JSON simple basé sur structure Lexical connue.

**Mitigation Strategies**: N/A

**Success Criteria**:

- [ ] `extractTOCHeadings` retourne les headings h2/h3 avec id et text
- [ ] Les IDs générés correspondent à ceux du composant Heading existant
- [ ] Tests: 100% des cas edge couverts (5+ tests)

**Technical Notes**:

- Le Lexical JSON a une structure `{ root: { children: [...] } }` avec des nodes de type `heading`
- La fonction `slugify()` existe déjà dans `Heading.tsx` - la déplacer dans un fichier partagé
- Supporter la profondeur h2 et h3 uniquement (h4+ ignorés pour simplifier la TOC)

---

### Phase 2: Reading Progress Bar

**Objective**: Implémenter la barre de progression de lecture sticky qui indique la progression de lecture en temps réel.

**Scope**:

- Hook `useReadingProgress()` pour tracker le scroll
- Composant `ReadingProgressBar` avec styling
- Support `prefers-reduced-motion`
- Accessibilité (role, aria-label)

**Dependencies**:

- None (peut être développé en parallèle de Phase 1)

**Key Deliverables**:

- [ ] Hook `useReadingProgress()` avec calcul de progression
- [ ] Composant `ReadingProgressBar` accessible et stylé
- [ ] Support reduced motion (désactivation des transitions)
- [ ] Tests unitaires du hook
- [ ] Tests d'intégration du composant

**Files Affected** (~6 files):

- `src/hooks/use-reading-progress.ts` (new)
- `src/components/articles/ReadingProgressBar.tsx` (new)
- `src/components/articles/index.ts` (modify - add export)
- `tests/unit/hooks/use-reading-progress.spec.ts` (new)
- `tests/unit/components/articles/ReadingProgressBar.spec.tsx` (new)

**Estimated Complexity**: Medium

**Estimated Duration**: 2-3 days (4-5 commits)

**Risk Level**: 🟡 Medium

**Risk Factors**:

- Calcul de la hauteur de document vs hauteur article
- Performance du scroll listener (throttling/RAF)
- CLS potentiel si mal positionné

**Mitigation Strategies**:

- Utiliser `requestAnimationFrame` pour throttling natif
- Réserver l'espace avec une hauteur fixe (pas de layout shift)
- Tester sur différentes tailles d'articles

**Success Criteria**:

- [ ] Progression 0% en haut, 100% en bas de l'article
- [ ] Mise à jour fluide sans janking
- [ ] Lighthouse CLS < 0.1 (pas de régression)
- [ ] Tests: hook + composant (4+ tests)

**Technical Notes**:

- La barre doit tracker la progression de l'article, pas de la page entière
- Utiliser `getBoundingClientRect()` de l'élément article plutôt que `document.body.scrollHeight`
- Hauteur recommandée: 3px pour être visible sans être intrusif
- Couleur: `var(--primary)` (teal #14B8A6)

---

### Phase 3: Table of Contents Component

**Objective**: Créer le composant Table des Matières avec support desktop (sticky sidebar) et mobile (modal/Sheet).

**Scope**:

- Composant `TableOfContents` avec tracking section active
- Composant `MobileTOC` avec Sheet shadcn/ui
- Hook `useActiveSection()` avec Intersection Observer
- Navigation smooth scroll
- Tests unitaires et d'intégration

**Dependencies**:

- Requires Phase 1 (extraction des headings)

**Key Deliverables**:

- [ ] Hook `useActiveSection()` avec Intersection Observer
- [ ] Composant `TableOfContents` desktop (sticky)
- [ ] Composant `MobileTOC` avec Sheet et bouton
- [ ] Navigation smooth scroll vers sections
- [ ] Highlighting de la section active
- [ ] Tests unitaires et d'intégration

**Files Affected** (~10 files):

- `src/hooks/use-active-section.ts` (new)
- `src/components/articles/TableOfContents.tsx` (new)
- `src/components/articles/MobileTOC.tsx` (new)
- `src/components/articles/TOCLink.tsx` (new)
- `src/components/articles/index.ts` (modify)
- `tests/unit/hooks/use-active-section.spec.ts` (new)
- `tests/unit/components/articles/TableOfContents.spec.tsx` (new)
- `tests/unit/components/articles/MobileTOC.spec.tsx` (new)

**Estimated Complexity**: Medium-High

**Estimated Duration**: 3-4 days (6-8 commits)

**Risk Level**: 🟡 Medium

**Risk Factors**:

- Intersection Observer threshold tuning
- Performance avec beaucoup de sections
- UX du bouton mobile (position, accessibilité)
- Fermeture automatique après navigation mobile

**Mitigation Strategies**:

- Threshold de 0.3-0.5 pour detection précoce
- Memoization des handlers avec useCallback
- Position du bouton: fixed bottom-right avec z-index approprié
- Auto-close Sheet après click sur lien

**Success Criteria**:

- [ ] Desktop: TOC sticky à droite, largeur ~200px
- [ ] Mobile: Bouton visible, Sheet s'ouvre correctement
- [ ] Section active highlightée en temps réel
- [ ] Click → smooth scroll → section visible
- [ ] Tests: hooks + composants (6+ tests)

**Technical Notes**:

- Utiliser le composant Sheet de shadcn/ui (déjà installé)
- Le bouton mobile peut utiliser l'icône `List` de Lucide
- `scroll-behavior: smooth` est déjà supporté par les browsers modernes
- L'ID des sections doit matcher ceux générés par `slugify()` dans Heading.tsx
- Indentation visuelle pour h3 (sous h2)

---

### Phase 4: Integration & E2E Testing

**Objective**: Intégrer les composants dans la page article, ajuster le layout, et valider avec tests E2E.

**Scope**:

- Intégration dans la page article
- Layout 3-colonnes desktop (vide | contenu | TOC)
- Responsive adjustments
- Tests E2E complets
- Tests d'accessibilité axe-core

**Dependencies**:

- Requires Phase 1, Phase 2, Phase 3

**Key Deliverables**:

- [ ] Page article mise à jour avec Progress Bar et TOC
- [ ] Layout responsive 3-colonnes
- [ ] Tests E2E: navigation TOC, scroll progression
- [ ] Tests accessibilité: pas d'erreurs axe-core
- [ ] Documentation des composants (JSDoc)

**Files Affected** (~6 files):

- `src/app/[locale]/(frontend)/articles/[slug]/page.tsx` (modify)
- `src/app/[locale]/(frontend)/articles/[slug]/layout.tsx` (new or modify)
- `tests/e2e/articles/toc-navigation.e2e.spec.ts` (new)
- `tests/e2e/articles/reading-progress.e2e.spec.ts` (new)
- `messages/en.json` (modify - add TOC translations)
- `messages/fr.json` (modify - add TOC translations)

**Estimated Complexity**: Medium

**Estimated Duration**: 2-3 days (4-6 commits)

**Risk Level**: 🟡 Medium

**Risk Factors**:

- Layout shift lors du passage mobile → desktop
- Conflits CSS avec le layout existant
- Timing des tests E2E (scroll async)

**Mitigation Strategies**:

- Utiliser CSS Grid pour le layout 3-colonnes
- Tests E2E avec `waitForSelector` et timeouts appropriés
- Tester sur différentes tailles de viewport

**Success Criteria**:

- [ ] E2E: click TOC → scroll vers section
- [ ] E2E: scroll → barre de progression mise à jour
- [ ] Lighthouse: pas de régression (Performance ≥ 90, CLS < 0.1)
- [ ] axe-core: 0 erreurs sur la page article
- [ ] Tests: 4+ tests E2E passants

**Technical Notes**:

- L'extraction des headings doit se faire côté serveur (dans le RSC)
- Les composants ReadingProgressBar et TOC sont des Client Components
- Le layout desktop peut utiliser `grid-cols-[1fr_minmax(0,65ch)_200px]`
- Ajouter les traductions: "Table des matières", "Contents", etc.

---

## 🔄 Implementation Order & Dependencies

### Dependency Graph

```
Phase 1 (TOC Extraction)
    ↓
    ├────────────────────────────┐
    ↓                            ↓
Phase 2 (Progress Bar)     Phase 3 (TOC Component)
    │                            │
    ↓                            ↓
    └────────────────────────────┘
                  ↓
           Phase 4 (Integration)
```

### Critical Path

**Must follow this order**:

1. Phase 1 → Phase 3 (TOC data needed for TOC component)
2. Phases 2 + 3 → Phase 4 (all components needed for integration)

**Can be parallelized**:

- Phase 2 and Phase 3 (independent, can work simultaneously after Phase 1)

### Blocking Dependencies

**Phase 1 blocks**:

- Phase 3: Requires `extractTOCHeadings()` function
- Phase 4: Indirectly (via Phase 3)

**Phases 2 & 3 block**:

- Phase 4: Both components needed for final integration

---

## 📊 Timeline & Resource Estimation

### Overall Estimates

| Metric                   | Estimate          | Notes                              |
| ------------------------ | ----------------- | ---------------------------------- |
| **Total Phases**         | 4                 | Atomic, independent phases         |
| **Total Duration**       | 8-12 days         | Based on sequential implementation |
| **Parallel Duration**    | 6-9 days          | If phases 2, 3 parallelized        |
| **Total Commits**        | ~17-23            | Across all phases                  |
| **Total Files**          | ~18 new, ~5 mod   | Estimated                          |
| **Test Coverage Target** | >80%              | Unit + Integration                 |

### Per-Phase Timeline

| Phase     | Duration | Commits | Start After | Blocks     |
| --------- | -------- | ------- | ----------- | ---------- |
| 1. TOC Extraction | 1-2d | 3-4 | - | Phase 3, 4 |
| 2. Progress Bar | 2-3d | 4-5 | - | Phase 4 |
| 3. TOC Component | 3-4d | 6-8 | Phase 1 | Phase 4 |
| 4. Integration | 2-3d | 4-6 | Phase 2, 3 | - |

### Resource Requirements

**Team Composition**:

- 1 developer: Frontend React/TypeScript
- 1 reviewer: Code review + accessibility validation

**External Dependencies**:

- shadcn/ui Sheet component: Already installed
- Intersection Observer API: Native browser (no polyfill needed for modern browsers)

---

## ⚠️ Risk Assessment

### High-Risk Phases

**Phase 3: TOC Component** 🟡

- **Risk**: Complexité de l'Intersection Observer + UX mobile
- **Impact**: Retard de 1-2 jours si le threshold tuning est difficile
- **Mitigation**: Commencer par desktop, itérer sur mobile
- **Contingency**: Utiliser une librairie externe si nécessaire (react-scrollspy)

### Overall Story Risks

| Risk     | Likelihood   | Impact       | Mitigation |
| -------- | ------------ | ------------ | ---------- |
| CLS régression | Low | High | Tests Lighthouse dans CI |
| Performance scroll | Medium | Medium | RAF throttling, memoization |
| A11y issues | Low | High | Tests axe-core obligatoires |
| Mobile UX | Medium | Medium | Tests manuels + E2E |

---

## 🧪 Testing Strategy

### Test Coverage by Phase

| Phase       | Unit Tests | Integration Tests | E2E Tests  |
| ----------- | ---------- | ----------------- | ---------- |
| 1. TOC Extraction | 5 tests | - | - |
| 2. Progress Bar | 4 tests | 2 tests | - |
| 3. TOC Component | 6 tests | 3 tests | - |
| 4. Integration | - | - | 4 tests |

### Test Milestones

- **After Phase 1**: Extraction testée avec différents contenus Lexical
- **After Phase 2**: Progress bar fonctionne en isolation
- **After Phase 3**: TOC complète avec tracking section active
- **After Phase 4**: Parcours complet E2E validé

### Quality Gates

Each phase must pass:

- [ ] All unit tests (>80% coverage)
- [ ] All integration tests
- [ ] ESLint with no errors
- [ ] Type checking (strict TypeScript)
- [ ] Code review approved

---

## 📝 Phase Documentation Strategy

### Documentation to Generate per Phase

For each phase, use the `phase-doc-generator` skill to create:

1. INDEX.md
2. IMPLEMENTATION_PLAN.md (atomic commits)
3. COMMIT_CHECKLIST.md
4. ENVIRONMENT_SETUP.md
5. guides/REVIEW.md
6. guides/TESTING.md
7. validation/VALIDATION_CHECKLIST.md

**Estimated documentation**: ~3400 lines per phase × 4 phases = **~13,600 lines**

### Story-Level Documentation

**This document** (PHASES_PLAN.md):

- Strategic overview
- Phase coordination
- Cross-phase dependencies
- Overall timeline

**Phase-level documentation** (generated separately):

- Tactical implementation details
- Commit-by-commit checklists
- Specific technical validations

---

## 🚀 Next Steps

### Immediate Actions

1. **Review this plan** with the team
   - Validate phase breakdown makes sense
   - Adjust estimates if needed
   - Identify any missing phases or dependencies

2. **Set up project structure**
   ```bash
   mkdir -p docs/specs/epics/epic_4/story_4_2/implementation/phase_1
   mkdir -p docs/specs/epics/epic_4/story_4_2/implementation/phase_2
   mkdir -p docs/specs/epics/epic_4/story_4_2/implementation/phase_3
   mkdir -p docs/specs/epics/epic_4/story_4_2/implementation/phase_4
   ```

3. **Generate detailed documentation for Phase 1**
   - Use command: `/generate-phase-doc`
   - Or request: "Generate implementation docs for Phase 1 of Story 4.2"
   - Provide this PHASES_PLAN.md as context

### Implementation Workflow

For each phase:

1. **Plan** (if not done):
   - Read PHASES_PLAN.md for phase overview
   - Generate detailed docs with `phase-doc-generator`

2. **Implement**:
   - Follow IMPLEMENTATION_PLAN.md
   - Use COMMIT_CHECKLIST.md for each commit
   - Validate after each commit

3. **Review**:
   - Use guides/REVIEW.md
   - Ensure all success criteria met

4. **Validate**:
   - Complete validation/VALIDATION_CHECKLIST.md
   - Update this plan with actual metrics

5. **Move to next phase**:
   - Repeat process for next phase

### Progress Tracking

Update this document as phases complete:

- [ ] Phase 1: TOC Extraction - Status, Actual duration, Notes
- [ ] Phase 2: Progress Bar - Status, Actual duration, Notes
- [ ] Phase 3: TOC Component - Status, Actual duration, Notes
- [ ] Phase 4: Integration - Status, Actual duration, Notes

---

## 📊 Success Metrics

### Story Completion Criteria

This story is considered complete when:

- [ ] All 4 phases implemented and validated
- [ ] All acceptance criteria from original spec met
- [ ] Test coverage >80% achieved
- [ ] No critical bugs remaining
- [ ] Documentation complete and reviewed
- [ ] Deployed to staging environment
- [ ] Lighthouse scores maintained (Performance ≥ 90, CLS < 0.1)

### Quality Metrics

| Metric               | Target               | Actual |
| -------------------- | -------------------- | ------ |
| Test Coverage        | >80%                 | -      |
| Type Safety          | 100% strict          | -      |
| Code Review Approval | 100%                 | -      |
| Lighthouse Performance | ≥90 | - |
| CLS | <0.1 | - |
| axe-core errors | 0 | - |

---

## 📚 Reference Documents

### Story Specification

- Original spec: `docs/specs/epics/epic_4/story_4_2/story_4.2.md`

### Related Documentation

- Epic overview: `docs/specs/epics/epic_4/EPIC_TRACKING.md`
- Previous stories: Story 4.1 (Rendu Article & MDX)
- PRD: `docs/specs/PRD.md` (EF2, EF8)
- UX/UI Spec: `docs/specs/UX_UI_Spec.md` (Sections 5.2, 6.2, 8.2, 8.3)
- Architecture: `docs/specs/Architecture_technique.md`

### Technical References

- Existing code: `src/components/richtext/nodes/Heading.tsx` (slugify)
- Existing code: `src/app/[locale]/(frontend)/articles/[slug]/page.tsx` (article page)
- shadcn/ui: Sheet component documentation

### Generated Phase Documentation

- Phase 1: `docs/specs/epics/epic_4/story_4_2/implementation/phase_1/INDEX.md`
- Phase 2: `docs/specs/epics/epic_4/story_4_2/implementation/phase_2/INDEX.md`
- Phase 3: `docs/specs/epics/epic_4/story_4_2/implementation/phase_3/INDEX.md`
- Phase 4: `docs/specs/epics/epic_4/story_4_2/implementation/phase_4/INDEX.md`

---

**Plan Created**: 2025-12-10
**Last Updated**: 2025-12-10
**Created by**: Claude Code (story-phase-planner skill)
**Story Status**: 📋 PLANNING
