# Phase 1: Composants Atomiques - Navigation Hub

**Story**: 3.5 - Homepage Implementation
**Phase**: 1 of 3
**Status**: NOT STARTED
**Estimated Commits**: 5

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

Creer les composants atomiques reusables pour l'affichage des articles sur la homepage et dans le futur Hub de Recherche.

### Scope

Cette phase implemente les composants de base qui seront utilises par les phases suivantes:

1. **CategoryBadge**: Badge avec icone et couleur pour les categories
2. **ComplexityBadge**: Badge de niveau de difficulte (Debutant/Intermediaire/Avance)
3. **TagPill**: Pill cliquable pour les tags d'articles
4. **RelativeDate**: Composant client pour afficher les dates relatives localisees
5. **ArticleCard**: Carte standard pour la grille d'articles

### Components Created

| Component | Type | File Path |
|-----------|------|-----------|
| `CategoryBadge` | RSC | `src/components/articles/CategoryBadge.tsx` |
| `ComplexityBadge` | RSC | `src/components/articles/ComplexityBadge.tsx` |
| `TagPill` | RSC | `src/components/articles/TagPill.tsx` |
| `RelativeDate` | Client | `src/components/RelativeDate.tsx` |
| `ArticleCard` | RSC | `src/components/articles/ArticleCard.tsx` |
| Barrel Export | - | `src/components/articles/index.ts` |

### i18n Keys Added

```json
{
  "homepage": {
    "recentArticles": "Articles recents",
    "viewAllArticles": "Voir tous les articles",
    "readArticle": "Lire l'article",
    "minRead": "{minutes} min de lecture"
  },
  "article": {
    "publishedAgo": "Il y a {time}",
    "complexity": {
      "beginner": "Debutant",
      "intermediate": "Intermediaire",
      "advanced": "Avance"
    }
  }
}
```

---

## Dependencies

### Required Before Starting

- [x] Story 3.1 (i18n Routing): COMPLETED - Provides locale context
- [x] Story 3.2 (Design System): COMPLETED - Provides Tailwind, shadcn/ui, design tokens
- [ ] Epic 2 (CMS Collections): Posts collection must exist with proper fields

### shadcn/ui Components Required

- `Badge` - Base for CategoryBadge, ComplexityBadge, TagPill
- `Card` - Base for ArticleCard (will be added if not present)

---

## Success Criteria

- [ ] Tous les composants sont type-safe (TypeScript strict)
- [ ] Tous les composants supportent les locales FR/EN
- [ ] Les badges respectent la charte graphique (couleurs, border-radius)
- [ ] Les composants sont accessibles (focus visible, aria-labels)
- [ ] Les tests unitaires passent avec >80% coverage
- [ ] Le build Next.js passe sans erreur

---

## Estimated Effort

| Metric | Value |
|--------|-------|
| **Commits** | 5 |
| **Lines of Code** | ~400-500 |
| **Implementation Time** | 2-3 hours |
| **Review Time** | 30-45 min |
| **Testing Time** | 1-1.5 hours |

---

## Next Phase

Une fois cette phase completee, passer a [Phase 2: Homepage Structure](../phase_2/INDEX.md) pour implementer:
- FeaturedArticleCard
- ArticleGrid
- EmptyState
- Page Homepage avec data fetching
