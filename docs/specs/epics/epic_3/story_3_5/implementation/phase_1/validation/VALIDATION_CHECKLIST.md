# Phase 1: Validation Checklist - Composants Atomiques

**Story**: 3.5 - Homepage Implementation
**Phase**: 1 of 3

---

## Pre-Validation Requirements

Avant de valider cette phase, s'assurer que:
- [ ] Tous les 5 commits sont completes
- [ ] Pas de commits WIP ou fixes en attente
- [ ] Branche a jour avec main

---

## Build Validation

### TypeScript Compilation

```bash
pnpm exec tsc --noEmit
```

- [ ] **PASS** - Aucune erreur TypeScript
- [ ] Pas de `any` implicites
- [ ] Pas de warnings `@ts-ignore`

### ESLint

```bash
pnpm lint
```

- [ ] **PASS** - Aucune erreur lint
- [ ] Pas de warnings ignores

### Next.js Build

```bash
pnpm build
```

- [ ] **PASS** - Build complete sans erreur
- [ ] Pas de warnings de build critiques
- [ ] Taille du bundle raisonnable

---

## Functional Validation

### i18n Keys (Commit 1)

| Check | FR | EN |
|-------|----|----|
| `homepage.recentArticles` | [ ] | [ ] |
| `homepage.viewAllArticles` | [ ] | [ ] |
| `homepage.readArticle` | [ ] | [ ] |
| `homepage.minRead` | [ ] | [ ] |
| `homepage.emptyState.title` | [ ] | [ ] |
| `homepage.emptyState.description` | [ ] | [ ] |
| `homepage.emptyState.cta` | [ ] | [ ] |
| `article.publishedAgo` | [ ] | [ ] |
| `article.complexity.beginner` | [ ] | [ ] |
| `article.complexity.intermediate` | [ ] | [ ] |
| `article.complexity.advanced` | [ ] | [ ] |

### CategoryBadge (Commit 2)

- [ ] Affiche le titre de la categorie
- [ ] Affiche l'icone si presente
- [ ] Couleur dynamique appliquee
- [ ] Navigation vers Hub avec `?category=X`
- [ ] Mode non-cliquable fonctionne

### ComplexityBadge (Commit 3)

- [ ] Niveau "beginner" - couleur verte
- [ ] Niveau "intermediate" - couleur orange
- [ ] Niveau "advanced" - couleur rouge
- [ ] Labels traduits en FR
- [ ] Labels traduits en EN

### TagPill (Commit 3)

- [ ] Affiche le titre du tag
- [ ] Navigation vers Hub avec `?tags=X`
- [ ] stopPropagation fonctionne

### RelativeDate (Commit 4)

- [ ] Affiche temps relatif en FR
- [ ] Affiche temps relatif en EN
- [ ] Element `<time>` avec `datetime`
- [ ] Tooltip avec date complete

### ArticleCard (Commit 5)

- [ ] Image de couverture affichee
- [ ] Fallback si pas d'image
- [ ] Titre avec line-clamp
- [ ] Extrait avec line-clamp
- [ ] CategoryBadge present
- [ ] ComplexityBadge present
- [ ] RelativeDate present
- [ ] Tags limites a 3
- [ ] Hover effect sur carte
- [ ] Hover effect sur image
- [ ] Navigation vers article

---

## Accessibility Validation

### Keyboard Navigation

- [ ] Tous les elements interactifs sont focusables
- [ ] Focus visible sur tous les elements
- [ ] Tab order logique

### Screen Reader

- [ ] `aria-hidden` sur icones decoratives
- [ ] Element `<time>` semantique
- [ ] Element `<article>` semantique
- [ ] Textes alternatifs sur images

### Color Contrast (WCAG AA)

| Element | Foreground | Background | Ratio | Pass |
|---------|------------|------------|-------|------|
| Beginner badge | green-400 | green-600/20 | 4.5:1+ | [ ] |
| Intermediate badge | orange-400 | orange-600/20 | 4.5:1+ | [ ] |
| Advanced badge | red-400 | red-600/20 | 4.5:1+ | [ ] |
| Muted text | muted-foreground | background | 4.5:1+ | [ ] |

---

## Unit Test Validation

```bash
pnpm test:unit -- --coverage
```

### Coverage Report

| Component | Statements | Branches | Functions | Lines | Pass |
|-----------|------------|----------|-----------|-------|------|
| CategoryBadge | >90% | >85% | >90% | >90% | [ ] |
| ComplexityBadge | >90% | >85% | >90% | >90% | [ ] |
| TagPill | >90% | >85% | >90% | >90% | [ ] |
| RelativeDate | >80% | >75% | >80% | >80% | [ ] |

### Test Results

- [ ] Tous les tests passent
- [ ] Pas de tests skipped
- [ ] Coverage globale > 80%

---

## Code Quality Validation

### File Structure

```
src/components/
├── articles/
│   ├── index.ts             [ ]
│   ├── CategoryBadge.tsx    [ ]
│   ├── ComplexityBadge.tsx  [ ]
│   ├── TagPill.tsx          [ ]
│   └── ArticleCard.tsx      [ ]
└── RelativeDate.tsx         [ ]
```

### Barrel Export

Verifier `src/components/articles/index.ts`:
```typescript
export { CategoryBadge } from './CategoryBadge'     // [ ]
export { ComplexityBadge } from './ComplexityBadge' // [ ]
export { TagPill } from './TagPill'                 // [ ]
export { ArticleCard } from './ArticleCard'         // [ ]
export { RelativeDate } from '../RelativeDate'      // [ ]
```

### Type Definitions

- [ ] Interfaces exportees si necessaires
- [ ] Types stricts (pas de `any`)
- [ ] Props bien documentees

---

## Performance Validation

### Bundle Size

```bash
pnpm build
# Verifier la taille du bundle dans .next/analyze (si configure)
```

- [ ] Composants < 5KB chacun (gzipped)
- [ ] Pas d'imports circulaires
- [ ] Tree-shaking fonctionne

### Image Optimization

- [ ] `next/image` utilise
- [ ] `sizes` attribute present
- [ ] Aspect ratio preserve

---

## Integration Validation

### Import Test

Creer un fichier temporaire pour tester les imports:

```typescript
// test-imports.ts
import {
  CategoryBadge,
  ComplexityBadge,
  TagPill,
  ArticleCard,
  RelativeDate,
} from '@/components/articles'

// Si pas d'erreur TypeScript, les exports sont corrects
```

### Dev Server Test

```bash
pnpm dev
# Naviguer vers localhost:3000
```

- [ ] Pas d'erreurs dans la console
- [ ] Pas de hydration mismatch

---

## Documentation Validation

### README/Comments

- [ ] Chaque composant a un commentaire JSDoc
- [ ] Props documentees
- [ ] Exemples d'utilisation fournis

### Storybook (si configure)

- [ ] Stories pour chaque composant
- [ ] Tous les variants couverts

---

## Sign-Off Checklist

### Developer

- [ ] Tous les checks ci-dessus passent
- [ ] Code revue par soi-meme
- [ ] Tests manuels effectues

### Reviewer

- [ ] Code revue completee
- [ ] Pas de blockers identifies
- [ ] Approuve pour merge

---

## Phase Completion

### Final Status

| Metric | Status |
|--------|--------|
| TypeScript | [ ] PASS |
| ESLint | [ ] PASS |
| Build | [ ] PASS |
| Unit Tests | [ ] PASS |
| Accessibility | [ ] PASS |
| Code Quality | [ ] PASS |

### Ready for Phase 2?

- [ ] **OUI** - Tous les checks passent, passer a Phase 2
- [ ] **NON** - Issues a resoudre avant de continuer

### Notes

```
[Ajouter des notes sur les issues rencontrees ou decisions prises]
```

---

## Rollback Plan

Si des problemes majeurs sont decouverts apres merge:

```bash
# Identifier le commit problematique
git log --oneline

# Revert le commit specifique
git revert <commit-hash>

# Ou revert toute la phase (5 commits)
git revert HEAD~5..HEAD
```
