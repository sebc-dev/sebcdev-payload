# Story 3.2 - Phases Implementation Plan

**Story**: Intégration Design System (Dark Mode)
**Epic**: 3 - Frontend Core & Design System
**Created**: 2025-12-02
**Status**: 📋 PLANNING

---

## 📖 Story Overview

### Original Story Specification

**Location**: `docs/specs/epics/epic_3/story_3_2/story_3.2.md`

**Story Objective**: Installer Tailwind CSS 4 et shadcn/ui, puis appliquer la charte graphique "Anthracite & Vert Canard" pour établir l'identité visuelle du blog sebc.dev. Cette story transforme le template Payload par défaut en une interface dark mode moderne avec des design tokens cohérents.

**Acceptance Criteria**:

- Tailwind CSS 4 installé et fonctionnel avec PostCSS
- shadcn/ui initialisé avec thème dark mode par défaut
- Design tokens configurés (couleurs, typographie, espacements)
- Polices Nunito Sans et JetBrains Mono via next/font
- CSS vanilla migré vers Tailwind utilities
- Homepage affichant la nouvelle charte graphique
- Contrastes WCAG 2.1 AA validés

**User Value**: Les développeurs disposent d'un système de design cohérent et accessible pour construire l'interface du blog. Les utilisateurs bénéficient d'une expérience visuelle moderne et confortable en mode sombre.

---

## 🎯 Phase Breakdown Strategy

### Why 4 Phases?

Cette story est décomposée en **4 phases atomiques** basée sur:

✅ **Technical dependencies**: Tailwind doit être installé avant shadcn/ui, les tokens avant la migration
✅ **Risk mitigation**: Chaque phase est testable indépendamment, rollback facile
✅ **Incremental value**: Phase 1 = build fonctionne, Phase 2 = composants dispo, Phase 3 = visuels, Phase 4 = validation
✅ **Team capacity**: Phases de 1-2 jours, reviewable en <1h
✅ **Testing strategy**: Tests visuels après chaque phase

### Atomic Phase Principles

Chaque phase suit ces principes:

- **Independent**: Peut être implémentée et testée séparément
- **Deliverable**: Produit une fonctionnalité tangible
- **Sized appropriately**: 1-2 jours de travail
- **Low coupling**: Dépendances minimales entre phases
- **High cohesion**: Tout le travail sert un objectif unique

### Implementation Approach

```
Phase 1: Foundation (Tailwind + PostCSS)
    │
    ▼
Phase 2: Component System (shadcn/ui + utilities)
    │
    ▼
Phase 3: Design Tokens (couleurs, typo, CSS migration)
    │
    ▼
Phase 4: Validation (A11y, tests, cleanup)
```

---

## 📦 Phases Summary

### Phase 1: Tailwind CSS 4 Foundation

**Objective**: Installer et configurer Tailwind CSS 4 avec PostCSS pour Next.js 15.

**Scope**:
- Installation des dépendances Tailwind CSS 4
- Configuration PostCSS
- Création du fichier CSS global avec imports Tailwind
- Intégration dans le layout Next.js
- Vérification du build

**Dependencies**:
- Story 3.1 ✅ (structure `[locale]` en place)

**Key Deliverables**:
- [ ] `tailwindcss` et `@tailwindcss/postcss` installés
- [ ] `postcss.config.mjs` créé
- [ ] `src/app/globals.css` avec imports Tailwind
- [ ] Layout modifié pour importer globals.css
- [ ] Build Next.js réussit

**Files Affected** (~5 files):

| File | Action | Purpose |
|------|--------|---------|
| `package.json` | Modify | Add Tailwind dependencies |
| `postcss.config.mjs` | Create | PostCSS configuration |
| `src/app/globals.css` | Create | Tailwind imports + base styles |
| `src/app/[locale]/layout.tsx` | Modify | Import globals.css |
| `next.config.ts` | Verify | Ensure no conflicts |

**Estimated Complexity**: Low
**Estimated Duration**: 1 day (3-4 commits)
**Risk Level**: 🟢 Low

**Success Criteria**:
- [ ] `pnpm install` succeeds
- [ ] `pnpm build` succeeds without CSS errors
- [ ] `pnpm dev` shows Tailwind classes working
- [ ] No console errors

**Technical Notes**:
- Tailwind v4 utilise `@import "tailwindcss"` (CSS-first)
- PostCSS config minimal: `@tailwindcss/postcss` plugin
- Pas besoin de `tailwind.config.ts` pour config de base
- Les design tokens seront ajoutés en Phase 3

---

### Phase 2: shadcn/ui & Utility Functions

**Objective**: Initialiser shadcn/ui et créer les utilitaires nécessaires (cn, cva).

**Scope**:
- Initialisation shadcn/ui avec CLI
- Configuration du `components.json`
- Création de la fonction `cn()` (clsx + tailwind-merge)
- Installation des dépendances utilitaires
- Ajout d'un composant Button pour validation

**Dependencies**:
- Phase 1 (Tailwind installé)

**Key Deliverables**:
- [ ] `components.json` configuré pour dark mode
- [ ] `src/lib/utils.ts` avec fonction `cn()`
- [ ] Dépendances: `clsx`, `tailwind-merge`, `class-variance-authority`
- [ ] `src/components/ui/button.tsx` installé
- [ ] Button utilisable dans la homepage

**Files Affected** (~6 files):

| File | Action | Purpose |
|------|--------|---------|
| `package.json` | Modify | Add utility dependencies |
| `components.json` | Create | shadcn/ui configuration |
| `src/lib/utils.ts` | Create | cn() utility function |
| `tsconfig.json` | Verify | Path aliases for @/components |
| `src/components/ui/button.tsx` | Create | First shadcn component |
| `src/app/[locale]/(frontend)/page.tsx` | Modify | Use Button component |

**Estimated Complexity**: Low-Medium
**Estimated Duration**: 1 day (3-4 commits)
**Risk Level**: 🟢 Low

**Risk Factors**:
- shadcn CLI peut échouer si chemins incorrects
- Compatibilité React 19 à vérifier

**Mitigation Strategies**:
- Vérifier les path aliases avant init
- Utiliser --overwrite si nécessaire
- Tester le Button immédiatement après installation

**Success Criteria**:
- [ ] `npx shadcn@latest init` réussit
- [ ] `npx shadcn@latest add button` réussit
- [ ] Button s'affiche correctement dans la page
- [ ] `cn()` fonctionne avec Tailwind classes
- [ ] Build réussit

**Technical Notes**:
- shadcn/ui copie les composants localement (pas de dépendance runtime)
- Utiliser le style "new-york" pour un look moderne
- Base color: "slate" (proche de notre anthracite)
- CSS variables: enabled (pour dark mode)

---

### Phase 3: Design Tokens & Visual Migration

**Objective**: Configurer les design tokens de la charte graphique et migrer le CSS existant.

**Scope**:
- Définition des CSS variables (couleurs, rayons, etc.)
- Configuration des polices via next/font
- Migration du CSS vanilla vers Tailwind utilities
- Application des tokens sur la homepage
- Suppression de l'ancien fichier CSS

**Dependencies**:
- Phase 1 (Tailwind)
- Phase 2 (shadcn/ui tokens structure)

**Key Deliverables**:
- [ ] CSS variables définies dans globals.css
- [ ] Polices Nunito Sans et JetBrains Mono configurées
- [ ] Homepage migrée vers Tailwind classes
- [ ] `styles.css` supprimé
- [ ] Visuels conformes à la charte

**Files Affected** (~6 files):

| File | Action | Purpose |
|------|--------|---------|
| `src/app/globals.css` | Modify | Add design tokens (CSS vars) |
| `src/app/[locale]/layout.tsx` | Modify | Add fonts via next/font |
| `src/app/[locale]/(frontend)/layout.tsx` | Modify | Remove styles.css import |
| `src/app/[locale]/(frontend)/page.tsx` | Modify | Migrate to Tailwind classes |
| `src/app/[locale]/(frontend)/styles.css` | Delete | No longer needed |

**Estimated Complexity**: Medium
**Estimated Duration**: 1.5 days (4-5 commits)
**Risk Level**: 🟡 Medium

**Risk Factors**:
- Migration CSS peut casser des styles
- Polices peuvent augmenter le bundle
- Couleurs peuvent avoir des problèmes de contraste

**Mitigation Strategies**:
- Comparer visuellement avant/après migration
- Utiliser `next/font` avec display: swap
- Vérifier contrastes avec outils WCAG

**Success Criteria**:
- [ ] Homepage affiche les couleurs Anthracite & Vert Canard
- [ ] Polices Nunito Sans et JetBrains Mono chargées
- [ ] Pas de régression visuelle majeure
- [ ] `styles.css` supprimé sans erreurs
- [ ] Build réussit

**Technical Notes**:

**Design Tokens (CSS Variables)**:
```css
:root {
  --background: 222 16% 12%;       /* #1A1D23 */
  --foreground: 210 40% 98%;       /* #F7FAFC */
  --card: 222 16% 18%;             /* #2D3748 */
  --primary: 174 72% 40%;          /* #14B8A6 */
  --muted-foreground: 215 14% 65%; /* #A0AEC0 */
  --destructive: 0 72% 67%;        /* #F56565 */
  --border: 217 19% 27%;           /* #374151 */
  --ring: 174 72% 40%;             /* #14B8A6 */
}
```

**Fonts Configuration**:
```typescript
import { Nunito_Sans, JetBrains_Mono } from 'next/font/google'

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})
```

---

### Phase 4: Accessibility Validation & Cleanup

**Objective**: Valider l'accessibilité, finaliser la configuration et nettoyer le code.

**Scope**:
- Audit des contrastes WCAG 2.1 AA
- Tests visuels E2E
- Vérification du panneau admin (pas de régression)
- Documentation des tokens
- Cleanup du code inutilisé

**Dependencies**:
- Phases 1-3 (implémentation complète)

**Key Deliverables**:
- [ ] Tous les contrastes ≥ 4.5:1 (texte) et ≥ 3:1 (UI)
- [ ] Test E2E visuel passant
- [ ] Admin panel non affecté
- [ ] Pas de code mort (Knip clean)
- [ ] Documentation inline des tokens

**Files Affected** (~4 files):

| File | Action | Purpose |
|------|--------|---------|
| `src/app/globals.css` | Modify | Add comments, final adjustments |
| `tests/e2e/frontend.e2e.spec.ts` | Modify | Update visual tests |
| `tests/e2e/design-system.e2e.spec.ts` | Create | Design system validation |
| `package.json` | Verify | No unused deps |

**Estimated Complexity**: Low
**Estimated Duration**: 0.5-1 day (2-3 commits)
**Risk Level**: 🟢 Low

**Success Criteria**:
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Tous les tests E2E passent
- [ ] `/admin` fonctionne normalement
- [ ] `pnpm knip` ne détecte pas de code mort
- [ ] `pnpm build` réussit
- [ ] CSS bundle < 50KB gzipped

**Technical Notes**:
- Utiliser axe-core pour l'audit a11y automatisé
- Tester les focus states (ring visible)
- Vérifier que les couleurs primaires ont assez de contraste

---

## 🔄 Implementation Order & Dependencies

### Dependency Graph

```
Phase 1 (Tailwind Foundation)
    │
    ▼
Phase 2 (shadcn/ui Setup)
    │
    ▼
Phase 3 (Design Tokens & Migration)
    │
    ▼
Phase 4 (Validation & Cleanup)
```

### Critical Path

**Must follow this order**:
1. Phase 1 → Phase 2 → Phase 3 → Phase 4

**No parallelization possible**: Chaque phase dépend de la précédente.

### Blocking Dependencies

| Phase | Blocks | Reason |
|-------|--------|--------|
| Phase 1 | Phase 2 | shadcn/ui requiert Tailwind |
| Phase 2 | Phase 3 | Tokens utilisent structure shadcn |
| Phase 3 | Phase 4 | Validation requiert visuels complets |

---

## 📊 Timeline & Resource Estimation

### Overall Estimates

| Metric | Estimate | Notes |
|--------|----------|-------|
| **Total Phases** | 4 | Atomic, séquentielles |
| **Total Duration** | 4-5 jours | Sequential implementation |
| **Total Commits** | ~12-16 | Across all phases |
| **Total Files** | ~10 new/modified | Mostly config + CSS |
| **Test Coverage Target** | >80% | Visual + a11y |

### Per-Phase Timeline

| Phase | Duration | Commits | Start After | Blocks |
|-------|----------|---------|-------------|--------|
| 1. Tailwind Foundation | 1d | 3-4 | - | Phase 2 |
| 2. shadcn/ui Setup | 1d | 3-4 | Phase 1 | Phase 3 |
| 3. Design Tokens & Migration | 1.5d | 4-5 | Phase 2 | Phase 4 |
| 4. Validation & Cleanup | 0.5-1d | 2-3 | Phase 3 | - |

### Resource Requirements

**Team Composition**:
- 1 developer: Frontend/CSS expertise
- 1 reviewer: Design system knowledge

**External Dependencies**:
- Tailwind CSS 4.x (npm)
- shadcn/ui CLI (npx)
- Google Fonts (next/font)

---

## ⚠️ Risk Assessment

### High-Risk Areas

**Phase 3: Design Tokens & Migration** 🟡

- **Risk**: Migration CSS peut casser des styles existants
- **Impact**: Régression visuelle sur la homepage
- **Mitigation**: Comparer screenshots avant/après, migration incrémentale
- **Contingency**: Revert to vanilla CSS si échec critique

### Overall Story Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Tailwind v4 breaking changes | Low | Medium | Suivre la doc officielle |
| shadcn/ui React 19 incompatible | Low | High | Vérifier compatibility |
| Contraste insuffisant | Medium | Medium | Ajuster tokens si needed |
| Admin panel régression | Low | High | Ne pas toucher `/admin` styles |

### Risk Mitigation Summary

1. **Test incrementally**: Build après chaque phase
2. **Visual comparison**: Screenshots avant/après
3. **Isolate admin**: Ne jamais modifier les styles admin
4. **WCAG tools**: Utiliser des outils de vérification de contraste

---

## 🧪 Testing Strategy

### Test Coverage by Phase

| Phase | Unit Tests | Integration Tests | E2E Tests |
|-------|------------|-------------------|-----------|
| 1. Tailwind | - | Build validation | - |
| 2. shadcn/ui | - | Component render | - |
| 3. Design Tokens | - | Visual validation | - |
| 4. Validation | - | A11y audit | Visual E2E |

### Test Milestones

- **After Phase 1**: `pnpm build` réussit, Tailwind classes fonctionnent
- **After Phase 2**: Button component s'affiche correctement
- **After Phase 3**: Homepage conforme à la charte graphique
- **After Phase 4**: Tous les tests E2E passent, Lighthouse a11y ≥ 95

### Quality Gates

Chaque phase doit passer:
- [ ] Build Next.js réussit (`pnpm build`)
- [ ] Linter sans erreurs (`pnpm lint`)
- [ ] TypeScript sans erreurs
- [ ] Code review approuvé
- [ ] Visual inspection OK

### E2E Test Scenarios (Phase 4)

```typescript
// tests/e2e/design-system.e2e.spec.ts
describe('Design System', () => {
  test('homepage displays correct brand colors', async ({ page }) => {
    await page.goto('/fr')
    const body = page.locator('body')
    // Verify background color is anthracite
    await expect(body).toHaveCSS('background-color', 'rgb(26, 29, 35)')
  })

  test('fonts are loaded correctly', async ({ page }) => {
    await page.goto('/fr')
    const h1 = page.locator('h1')
    await expect(h1).toHaveCSS('font-family', /Nunito Sans/)
  })

  test('primary button uses teal accent', async ({ page }) => {
    await page.goto('/fr')
    const button = page.locator('button.primary')
    await expect(button).toHaveCSS('background-color', 'rgb(20, 184, 166)')
  })

  test('contrast meets WCAG AA', async ({ page }) => {
    await page.goto('/fr')
    // Use axe-core for automated accessibility testing
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toHaveLength(0)
  })
})
```

---

## 📝 Phase Documentation Strategy

### Documentation to Generate per Phase

Pour chaque phase, utiliser le skill `phase-doc-generator` pour créer:

1. INDEX.md
2. IMPLEMENTATION_PLAN.md
3. COMMIT_CHECKLIST.md
4. ENVIRONMENT_SETUP.md
5. guides/REVIEW.md
6. guides/TESTING.md
7. validation/VALIDATION_CHECKLIST.md

**Estimated documentation**: ~3400 lines per phase × 4 phases = **~13,600 lines**

### Story-Level Documentation

**Ce document** (PHASES_PLAN.md):
- Vue d'ensemble stratégique
- Coordination des phases
- Dépendances cross-phase
- Timeline globale

**Documentation par phase** (générée séparément):
- Détails d'implémentation tactiques
- Checklists commit par commit
- Validations techniques spécifiques

---

## 🚀 Next Steps

### Immediate Actions

1. **Review this plan** with the team
   - Valider le découpage en 4 phases
   - Ajuster les estimations si nécessaire
   - Identifier les risques manqués

2. **Generate detailed documentation for Phase 1**
   - Utiliser: `/generate-phase-doc Epic 3 Story 3.2 Phase 1`
   - Ou demander: "Generate implementation docs for Phase 1"

3. **Start Implementation**
   - Suivre IMPLEMENTATION_PLAN.md
   - Utiliser COMMIT_CHECKLIST.md pour chaque commit
   - Valider après chaque phase

### Implementation Workflow

Pour chaque phase:

1. **Plan** (si pas fait):
   - Lire PHASES_PLAN.md pour overview
   - Générer docs détaillées avec `phase-doc-generator`

2. **Implement**:
   - Suivre IMPLEMENTATION_PLAN.md
   - Utiliser COMMIT_CHECKLIST.md
   - Valider après chaque commit

3. **Review**:
   - Utiliser guides/REVIEW.md
   - Vérifier tous les critères de succès

4. **Validate**:
   - Compléter validation/VALIDATION_CHECKLIST.md
   - Mettre à jour ce plan avec métriques réelles

5. **Move to next phase**:
   - Répéter le processus

### Progress Tracking

Mettre à jour ce document au fur et à mesure:

- [ ] Phase 1: Tailwind Foundation - ⬜ Not Started
- [ ] Phase 2: shadcn/ui Setup - ⬜ Not Started
- [ ] Phase 3: Design Tokens & Migration - ⬜ Not Started
- [ ] Phase 4: Validation & Cleanup - ⬜ Not Started

---

## 📊 Success Metrics

### Story Completion Criteria

Cette story est considérée complète quand:

- [ ] Les 4 phases implémentées et validées
- [ ] Tous les critères d'acceptation de la spec respectés
- [ ] Contrastes WCAG 2.1 AA validés
- [ ] Pas de bugs critiques
- [ ] Build réussit sur Cloudflare Workers
- [ ] Admin panel non affecté

### Quality Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Build Success | ✅ | - |
| Lighthouse Performance | ≥ 90 | - |
| Lighthouse Accessibility | ≥ 95 | - |
| CSS Bundle Size | < 50KB gzip | - |
| WCAG Contrast AA | 100% | - |
| E2E Tests Pass | 100% | - |

---

## 📚 Reference Documents

### Story Specification
- Story spec: `docs/specs/epics/epic_3/story_3_2/story_3.2.md`

### Related Documentation
- [UX_UI_Spec.md](../../../../UX_UI_Spec.md) - Section 7: Design System
- [PRD.md](../../../../PRD.md) - Story 3.2 description
- [EPIC_TRACKING.md](../../EPIC_TRACKING.md) - Epic 3 progress

### External References
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [next/font Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [WCAG 2.1 Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

### Generated Phase Documentation

- Phase 1: `implementation/phase_1/INDEX.md` (à générer)
- Phase 2: `implementation/phase_2/INDEX.md` (à générer)
- Phase 3: `implementation/phase_3/INDEX.md` (à générer)
- Phase 4: `implementation/phase_4/INDEX.md` (à générer)

---

**Plan Created**: 2025-12-02
**Last Updated**: 2025-12-02
**Created by**: Claude Code (story-phase-planner skill)
**Story Status**: 📋 PLANNING
