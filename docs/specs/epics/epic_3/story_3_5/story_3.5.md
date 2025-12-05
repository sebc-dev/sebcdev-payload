# Story 3.5 - Homepage Implementation

**Epic**: 3 - Frontend Core & Design System
**Status**: NOT STARTED
**Created**: 2025-12-05

---

## Story Description

**En tant qu'** Utilisateur,
**Je veux** voir une page d'accueil attrayante présentant l'article le plus récent en vedette et une grille d'articles récents,
**Afin de** découvrir rapidement le contenu du blog et accéder aux articles qui m'intéressent.

---

## Story Objectives

Cette story implémente la page d'accueil (Homepage) de sebc.dev :

1. **Article vedette** : Le dernier article publié affiché en grand format (fait office de Hero)
2. **Grille d'articles récents** : 6 articles suivants affichés en grille responsive
3. **CTA "Voir tous les articles"** : Bouton de redirection vers le Hub de Recherche
4. **Empty State** : Gestion de l'état vide (aucun article publié)
5. **Métadonnées complètes** : Affichage de toutes les infos pertinentes sur chaque carte

---

## Acceptance Criteria

### AC1: Article Vedette (Featured Article)
- [ ] L'article le plus récent est affiché en carte pleine largeur en tête de page
- [ ] La carte contient : Image de couverture (ratio 16:9), Titre (H1), Extrait, Métadonnées
- [ ] Un bouton CTA "Lire l'article" redirige vers la page article
- [ ] L'image a un effet de zoom subtil au hover (scale 1.05)
- [ ] La carte a une légère élévation au hover (shadow + scale 1.02)

### AC2: Grille d'Articles Récents
- [ ] 6 articles suivants affichés sous l'article vedette
- [ ] Layout responsive : 3 colonnes (desktop), 2 colonnes (tablette), 1 colonne (mobile)
- [ ] Gap entre les cartes : 24px (desktop), 20px (tablette), 16px (mobile)
- [ ] Titre de section "Articles récents" visible au-dessus de la grille

### AC3: Carte d'Article (ArticleCard)
- [ ] Chaque carte affiche : Image de couverture, Titre, Extrait (2-3 lignes max)
- [ ] Métadonnées visibles : Badge catégorie (avec icône et couleur), Temps de lecture
- [ ] Métadonnées visibles : Date de publication (format relatif), Badge niveau de complexité
- [ ] Tags affichés (max 3) sous forme de pills cliquables
- [ ] Click sur la carte navigue vers `/[locale]/articles/[slug]`
- [ ] Click sur un tag navigue vers le Hub avec filtre `?tags=X`
- [ ] Click sur la catégorie navigue vers le Hub avec filtre `?category=X`

### AC4: Bouton CTA "Voir tous les articles"
- [ ] Bouton visible et centré après la grille d'articles
- [ ] Style : Bouton primaire (teal) avec icône flèche
- [ ] Click redirige vers `/[locale]/articles` (Hub de Recherche)

### AC5: Empty State (État Vide)
- [ ] Message d'accueil affiché si aucun article publié
- [ ] Texte : "Bienvenue sur sebc.dev ! Aucun article n'a encore été publié."
- [ ] CTA "Créer un article" visible UNIQUEMENT si utilisateur authentifié (cookie `payload-token`)
- [ ] CTA redirige vers `/admin/collections/posts/create`

### AC6: Data Fetching & Performance
- [ ] Données récupérées via Payload Local API (`payload.find`)
- [ ] Query : `collection: 'posts'`, `limit: 7`, `sort: '-publishedAt'`, `where: { _status: 'published' }`
- [ ] Depth: 2 pour inclure les relations (category, tags)
- [ ] Page est un Server Component (RSC) - pas de "use client"

### AC7: SEO & Metadata
- [ ] Titre de page : "Accueil | sebc.dev" (FR) / "Home | sebc.dev" (EN)
- [ ] Meta description appropriée en FR et EN
- [ ] Balises `hreflang` pour les deux langues
- [ ] Canonical URL correcte

### AC8: Accessibilité
- [ ] Structure sémantique HTML (`<main>`, `<section>`, `<article>`)
- [ ] Headings hiérarchiques (H1 pour vedette, H2 pour "Articles récents", H3 pour titres cartes)
- [ ] Images avec attribut `alt` descriptif
- [ ] Contrastes WCAG AA respectés
- [ ] Navigation clavier fonctionnelle sur tous les éléments interactifs

---

## Technical Requirements

### Dependencies
- **Story 3.1** (i18n Routing): COMPLETED - Provides locale context and routing
- **Story 3.2** (Design System): COMPLETED - Provides Tailwind, shadcn/ui, design tokens
- **Story 3.3** (Layout Global): IN PROGRESS - Provides Header/Footer wrapper
- **Epic 2** (CMS Collections): REQUIRED - Posts collection must exist with proper fields

### Components to Create

| Component | Type | File Path | Description |
|-----------|------|-----------|-------------|
| `FeaturedArticleCard` | RSC | `src/components/articles/FeaturedArticleCard.tsx` | Carte large pour article vedette |
| `ArticleCard` | RSC | `src/components/articles/ArticleCard.tsx` | Carte standard pour grille |
| `ArticleGrid` | RSC | `src/components/articles/ArticleGrid.tsx` | Conteneur grille responsive |
| `EmptyState` | RSC | `src/components/EmptyState.tsx` | État vide avec CTA conditionnel |
| `CategoryBadge` | RSC | `src/components/articles/CategoryBadge.tsx` | Badge catégorie avec icône/couleur |
| `ComplexityBadge` | RSC | `src/components/articles/ComplexityBadge.tsx` | Badge niveau de complexité |
| `TagPill` | RSC | `src/components/articles/TagPill.tsx` | Pill cliquable pour les tags |
| `RelativeDate` | Client | `src/components/RelativeDate.tsx` | Date relative localisée |

### shadcn/ui Components Required
- `Button` - Pour CTA "Voir tous les articles" et "Lire l'article"
- `Card` - Base pour ArticleCard et FeaturedArticleCard
- `Badge` - Pour catégorie, complexité, tags

### i18n Keys Required
```json
{
  "homepage": {
    "recentArticles": "Articles récents",
    "viewAllArticles": "Voir tous les articles",
    "readArticle": "Lire l'article",
    "minRead": "{minutes} min de lecture",
    "emptyState": {
      "title": "Bienvenue sur sebc.dev !",
      "description": "Aucun article n'a encore été publié.",
      "cta": "Créer un article"
    }
  },
  "article": {
    "publishedAgo": "Il y a {time}",
    "complexity": {
      "beginner": "Débutant",
      "intermediate": "Intermédiaire",
      "advanced": "Avancé"
    }
  }
}
```

### File Structure
```
src/
├── app/
│   └── [locale]/
│       └── (frontend)/
│           └── page.tsx (MODIFIED - Homepage implementation)
├── components/
│   ├── articles/
│   │   ├── FeaturedArticleCard.tsx (NEW)
│   │   ├── ArticleCard.tsx (NEW)
│   │   ├── ArticleGrid.tsx (NEW)
│   │   ├── CategoryBadge.tsx (NEW)
│   │   ├── ComplexityBadge.tsx (NEW)
│   │   ├── TagPill.tsx (NEW)
│   │   └── index.ts (barrel export)
│   ├── EmptyState.tsx (NEW)
│   └── RelativeDate.tsx (NEW)
messages/
├── fr.json (MODIFIED - add homepage keys)
└── en.json (MODIFIED - add homepage keys)
```

---

## Design Specifications

### Article Vedette (Desktop)
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                    🖼️ IMAGE DE COUVERTURE                           │
│                       (100% width, 16:9, max-h 400px)                │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [🎓 Tutoriel]  •  8 min  •  Il y a 2 jours  •  [Intermédiaire]     │
│                                                                      │
│  Titre de l'Article Vedette en H1                                   │
│  ═══════════════════════════════════════                            │
│                                                                      │
│  Extrait de l'article qui donne envie de lire la suite avec         │
│  suffisamment de contexte pour comprendre le sujet abordé...        │
│                                                                      │
│  [React]  [Next.js]  [TypeScript]                                   │
│                                                                      │
│                                           [Lire l'article →]        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Grille d'Articles (Desktop - 3 colonnes)
```
┌────────────────────────────────────────────────────────────────────┐
│                        Articles récents                             │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │   🖼️ Image       │  │   🖼️ Image       │  │   🖼️ Image       │  │
│  │                  │  │                  │  │                  │  │
│  │ [📰 Actualités]  │  │ [🔬 Décryptage]  │  │ [📊 Étude]       │  │
│  │ Titre article    │  │ Titre article    │  │ Titre article    │  │
│  │ Extrait...       │  │ Extrait...       │  │ Extrait...       │  │
│  │                  │  │                  │  │                  │  │
│  │ 5 min • 3j       │  │ 7 min • 5j       │  │ 4 min • 1sem     │  │
│  │ [Débutant]       │  │ [Avancé]         │  │ [Intermédiaire]  │  │
│  │ [tag1] [tag2]    │  │ [tag1]           │  │ [tag1] [tag2]    │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │   🖼️ Image       │  │   🖼️ Image       │  │   🖼️ Image       │  │
│  │                  │  │                  │  │                  │  │
│  │ [📋 REX]         │  │ [🎓 Tutoriel]    │  │ [📰 Actualités]  │  │
│  │ Titre article    │  │ Titre article    │  │ Titre article    │  │
│  │ Extrait...       │  │ Extrait...       │  │ Extrait...       │  │
│  │                  │  │                  │  │                  │  │
│  │ 6 min • 1sem     │  │ 3 min • 2sem     │  │ 9 min • 2sem     │  │
│  │ [Débutant]       │  │ [Intermédiaire]  │  │ [Avancé]         │  │
│  │ [tag1]           │  │ [tag1] [tag2]    │  │ [tag1]           │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                     │
│                  ┌─────────────────────────────┐                    │
│                  │   Voir tous les articles →  │                    │
│                  └─────────────────────────────┘                    │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### Empty State
```
┌────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                              📝                                     │
│                                                                     │
│                   Bienvenue sur sebc.dev !                          │
│                                                                     │
│            Aucun article n'a encore été publié.                     │
│        C'est le moment de créer votre premier contenu.              │
│                                                                     │
│                  ┌─────────────────────────────┐                    │
│                  │     Créer un article →      │                    │
│                  └─────────────────────────────┘                    │
│                  (visible uniquement si authentifié)                │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

| Breakpoint | Colonnes Grille | Gap | Image Vedette |
|------------|-----------------|-----|---------------|
| Desktop (≥1024px) | 3 | 24px (gap-6) | max-h-400px |
| Tablette (768-1023px) | 2 | 20px (gap-5) | max-h-300px |
| Mobile (<768px) | 1 | 16px (gap-4) | max-h-200px |

### Color Tokens (from Story 3.2)
- **Background**: `bg-background` (#1A1D23 - anthracite)
- **Card Background**: `bg-card` (#23272F)
- **Card Border**: `border-border` (#454545)
- **Primary (CTA)**: `bg-primary` (#0D9488 - teal)
- **Text Primary**: `text-foreground` (#FAFAFA)
- **Text Secondary**: `text-muted-foreground` (#A6A6A6)

### Complexity Badge Colors
- **Débutant**: `bg-green-600/20 text-green-400` + 📗
- **Intermédiaire**: `bg-orange-600/20 text-orange-400` + 📕
- **Avancé**: `bg-red-600/20 text-red-400` + 📘

---

## Data Model

### Article (Post) Structure Expected
```typescript
interface Post {
  id: string
  title: string // localized
  slug: string // localized
  excerpt: string // localized
  content: RichText // localized (Lexical)
  publishedAt: string // ISO date
  readingTime: number // minutes
  complexity: 'beginner' | 'intermediate' | 'advanced'
  coverImage: Media | null
  category: Category
  tags: Tag[]
  _status: 'draft' | 'published'
}

interface Category {
  id: string
  title: string // localized
  slug: string
  color: string // HEX
  icon: string // emoji or icon name
}

interface Tag {
  id: string
  title: string // localized
  slug: string
}
```

---

## User Flows

### Flow 1: Découverte depuis la Homepage
1. Utilisateur arrive sur `/fr` (ou `/en`)
2. Voit l'article vedette en grand format
3. Scroll pour voir la grille d'articles récents
4. Click sur une carte → Navigation vers la page article

### Flow 2: Navigation vers le Hub
1. Utilisateur sur la homepage
2. Scroll jusqu'au bouton "Voir tous les articles"
3. Click sur le bouton → Navigation vers `/[locale]/articles`

### Flow 3: Filtrage par Tag/Catégorie
1. Utilisateur sur la homepage
2. Click sur un tag (ex: "React") dans une carte
3. Navigation vers `/[locale]/articles?tags=react`
4. Hub affiche les articles filtrés par ce tag

### Flow 4: Empty State (Admin)
1. Utilisateur authentifié arrive sur homepage vide
2. Voit le message d'accueil avec CTA "Créer un article"
3. Click sur CTA → Navigation vers `/admin/collections/posts/create`

---

## Testing Requirements

### Unit Tests (Vitest)
- [ ] `CategoryBadge` renders with correct color and icon
- [ ] `ComplexityBadge` renders correct label and style per level
- [ ] `TagPill` renders and handles click
- [ ] `RelativeDate` formats dates correctly in FR and EN

### E2E Tests (Playwright)
- [ ] Homepage loads with article vedette when articles exist
- [ ] Homepage shows empty state when no articles
- [ ] Article grid displays correct number of articles
- [ ] Click on article card navigates to article page
- [ ] Click on tag navigates to Hub with filter
- [ ] Click on category navigates to Hub with filter
- [ ] CTA "Voir tous les articles" navigates to Hub
- [ ] Empty state CTA visible only when authenticated
- [ ] Responsive layout works on mobile, tablet, desktop

### Accessibility Tests
- [ ] axe-core audit passes (no violations)
- [ ] Headings hierarchy correct (H1 → H2 → H3)
- [ ] All images have alt text
- [ ] Focus visible on all interactive elements
- [ ] Keyboard navigation works

---

## Out of Scope (V1)

- Pagination sur la homepage (seulement 7 articles affichés)
- Filtres sur la homepage (disponibles sur le Hub uniquement)
- Section "Articles par catégorie"
- Recommandations personnalisées
- Animation de chargement skeleton (sera ajoutée post-V1)

---

## Risks & Mitigations

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Collection Posts pas encore créée | Bloquant | Moyenne | Dépendance explicite sur Epic 2 |
| Images non optimisées (slow LCP) | Moyen | Moyenne | Utiliser next/image avec Cloudflare loader |
| Trop de données fetchées | Faible | Faible | Limiter depth et sélectionner les champs |

---

## Related Documents

- [PRD.md](../../../../PRD.md) - EF9: Page d'Accueil
- [UX_UI_Spec.md](../../../../UX_UI_Spec.md) - Section 8.6: Page d'Accueil
- [Architecture_technique.md](../../../../Architecture_technique.md) - Composant HomePage
- [Story 3.2](../story_3_2/story_3.2.md) - Design System (dependency)
- [Story 3.3](../story_3_3/story_3.3.md) - Layout Global (dependency)

---

## Implementation Phases

Cette story sera implémentée en **3 phases** :

### Phase 1: Composants de Base
- Créer les composants atomiques (CategoryBadge, ComplexityBadge, TagPill, RelativeDate)
- Créer le composant ArticleCard
- Ajouter les clés i18n

### Phase 2: Homepage Structure
- Créer le composant FeaturedArticleCard
- Créer le composant ArticleGrid
- Implémenter la page Homepage avec data fetching
- Créer le composant EmptyState

### Phase 3: Polish & Tests
- Ajouter les animations hover
- Optimiser les images (next/image)
- Écrire les tests E2E
- Valider l'accessibilité

---

**Story Created**: 2025-12-05
**Last Updated**: 2025-12-05
