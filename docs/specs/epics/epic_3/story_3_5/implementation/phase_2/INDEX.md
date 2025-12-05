# Phase 2: Homepage Structure - Navigation Hub

**Story**: 3.5 - Homepage Implementation
**Phase**: 2 of 3
**Status**: COMPLETED (5/5 commits)
**Estimated Commits**: 5
**Completed**: 2025-12-05

---

## Quick Links

| Document | Description |
|----------|-------------|
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Strategie de commits atomiques |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) | Checklist detaillee par commit |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Configuration de l'environnement |
| [guides/REVIEW.md](./guides/REVIEW.md) | Guide de revue de code |
| [guides/TESTING.md](./guides/TESTING.md) | Strategie de tests |
| [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) | Checklist de validation finale |

---

## Phase Overview

### Objective

Implementer la structure complete de la Homepage avec l'article vedette, la grille d'articles et l'etat vide.

### Scope

Cette phase construit sur les composants de la Phase 1 pour creer:

1. **FeaturedArticleCard**: Carte pleine largeur pour l'article vedette
2. **ArticleGrid**: Grille responsive pour les articles recents
3. **EmptyState**: Composant d'etat vide avec CTA conditionnel
4. **Homepage**: Page complete avec data fetching Payload

### Components Created

| Component | Type | File Path |
|-----------|------|-----------|
| `FeaturedArticleCard` | RSC | `src/components/articles/FeaturedArticleCard.tsx` |
| `ArticleGrid` | RSC | `src/components/articles/ArticleGrid.tsx` |
| `EmptyState` | RSC | `src/components/EmptyState.tsx` |

### Files Modified

| File | Change |
|------|--------|
| `src/app/[locale]/(frontend)/page.tsx` | Remplacer par Homepage complete |
| `src/components/articles/index.ts` | Ajouter nouveaux exports |

---

## Dependencies

### Required Before Starting

- [x] Phase 1 COMPLETED - Composants atomiques disponibles
- [x] Story 3.1 (i18n Routing): COMPLETED
- [x] Story 3.2 (Design System): COMPLETED
- [ ] Epic 2 (CMS Collections): Posts collection must exist

### Components from Phase 1

- `CategoryBadge` - Utilise dans FeaturedArticleCard
- `ComplexityBadge` - Utilise dans FeaturedArticleCard
- `TagPill` - Utilise dans FeaturedArticleCard
- `RelativeDate` - Utilise dans FeaturedArticleCard
- `ArticleCard` - Utilise dans ArticleGrid

---

## Design Specifications

### FeaturedArticleCard Layout

```
+--------------------------------------------------------------+
|                                                               |
|                    IMAGE DE COUVERTURE                        |
|                    (100% width, 16:9, max-h 400px)           |
|                                                               |
+--------------------------------------------------------------+
|                                                               |
|  [Category]  -  8 min  -  Il y a 2 jours  -  [Intermediaire] |
|                                                               |
|  Titre de l'Article Vedette en H1                            |
|  =========================================                    |
|                                                               |
|  Extrait de l'article qui donne envie de lire la suite...    |
|                                                               |
|  [React]  [Next.js]  [TypeScript]                            |
|                                                               |
|                                     [Lire l'article ->]       |
|                                                               |
+--------------------------------------------------------------+
```

### ArticleGrid Layout

| Breakpoint | Columns | Gap |
|------------|---------|-----|
| Desktop (>=1024px) | 3 | 24px (gap-6) |
| Tablet (768-1023px) | 2 | 20px (gap-5) |
| Mobile (<768px) | 1 | 16px (gap-4) |

---

## Data Fetching Strategy

### Payload Query

```typescript
const { docs: articles } = await payload.find({
  collection: 'posts',
  locale,
  limit: 7,
  sort: '-publishedAt',
  where: {
    _status: { equals: 'published' },
  },
  depth: 2,
})
```

### Data Flow

```
Page Load
    |
    v
payload.find() --- 7 articles max
    |
    v
articles.length === 0? --- YES --> EmptyState
    |
    NO
    v
Destructure: [featured, ...recent]
    |
    v
FeaturedArticleCard + ArticleGrid
```

---

## Success Criteria

- [x] Article vedette affiche en pleine largeur
- [x] Grille responsive fonctionne sur mobile/tablet/desktop
- [x] Empty state affiche si aucun article
- [x] CTA "Creer un article" visible uniquement si authentifie
- [x] Data fetching via Payload Local API
- [x] SEO metadata correcte (FR/EN)
- [x] Build Next.js passe sans erreur

---

## Estimated Effort

| Metric | Value |
|--------|-------|
| **Commits** | 5 |
| **Lines of Code** | ~500-600 |
| **Implementation Time** | 3-4 hours |
| **Review Time** | 45-60 min |
| **Testing Time** | 1-2 hours |

---

## Previous Phase

[Phase 1: Composants Atomiques](../phase_1/INDEX.md) - REQUIRED

---

## Next Phase

Une fois cette phase completee, passer a [Phase 3: Polish & Tests](../phase_3/INDEX.md) pour:
- Animations hover optimisees
- Tests E2E complets
- Validation accessibilite
- Optimisation images
