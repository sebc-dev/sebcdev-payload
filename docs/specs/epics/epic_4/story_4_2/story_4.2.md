# Story 4.2 - Table des Matières (TOC) & Progression

**Epic**: Epic 4 - Article Reading Experience
**Status**: 📋 PLANNING
**Created**: 2025-12-10

---

## Story Definition (from PRD)

> **En tant que** Lecteur, **je veux** voir une barre de progression de lecture en haut de page et une Table des Matières cliquable, **afin de** me repérer dans les contenus longs.

---

## Story Objective

Améliorer l'expérience de lecture des articles techniques longs en fournissant deux outils de navigation essentiels :

1. **Barre de progression de lecture** : Un indicateur visuel sticky en haut de page qui montre la progression de lecture en temps réel
2. **Table des Matières (TOC)** : Une liste cliquable générée automatiquement depuis les headings (h2, h3) de l'article

Ces fonctionnalités permettent aux lecteurs de :
- Se situer dans un article long
- Naviguer rapidement vers une section spécifique
- Estimer le temps restant de lecture

---

## Acceptance Criteria

### AC1: Barre de progression de lecture (EF8 - CA1)
- [ ] Une barre de progression est affichée en position sticky en haut de la fenêtre
- [ ] La progression (0-100%) se met à jour en temps réel lors du défilement
- [ ] La barre utilise la couleur accent primaire (`#14B8A6` / teal)
- [ ] L'implémentation respecte `prefers-reduced-motion` (animations désactivées si pref active)
- [ ] La barre est accessible (aria-label, role="progressbar")

### AC2: Table des Matières (EF2 - CA2)
- [ ] Le système génère automatiquement une TOC basée sur la hiérarchie des titres (h2, h3)
- [ ] Chaque entrée de la TOC est cliquable et navigue vers la section correspondante
- [ ] Le défilement vers la section est smooth (scroll-behavior: smooth)
- [ ] La section active est visuellement mise en évidence dans la TOC

### AC3: Responsive Design (UX_UI_Spec Section 6)
- [ ] **Mobile (< 768px)** : TOC accessible via bouton → modal/Sheet
- [ ] **Tablette (768px - 1024px)** : TOC via bouton → modal
- [ ] **Desktop (≥ 1024px)** : TOC sticky à droite, visible en permanence

### AC4: Intégration avec l'architecture existante
- [ ] Les IDs des headings utilisent le `slugify()` existant dans `Heading.tsx`
- [ ] La TOC est générée côté serveur (extraction des headings du Lexical JSON)
- [ ] Les interactions (scroll tracking, click navigation) sont gérées côté client

### AC5: Performance & Accessibilité
- [ ] Pas de layout shift (CLS) lors de l'affichage de la barre de progression
- [ ] Navigation clavier fonctionnelle (Tab, Enter sur les entrées TOC)
- [ ] Lecteur d'écran : landmarks appropriés, aria-current pour section active
- [ ] Performance : utilisation de `requestAnimationFrame` pour le scroll tracking

---

## Technical Requirements

### Components to Create

1. **ReadingProgressBar** (Client Component)
   - Hook `useScrollProgress()` pour tracking de la progression
   - Barre horizontale sticky avec animation fluide
   - Support `prefers-reduced-motion`

2. **TableOfContents** (Client Component)
   - Props: `headings: TOCHeading[]` (données extraites côté serveur)
   - Tracking de la section active via Intersection Observer
   - Smooth scroll vers les sections

3. **TOCExtractor** (Server utility)
   - Extraction des headings h2/h3 du contenu Lexical
   - Génération des IDs (réutilise `slugify`)
   - Calcul optionnel du temps de lecture par section

4. **MobileTOC** (Client Component)
   - Bouton d'ouverture avec icône
   - Modal/Sheet shadcn/ui pour afficher la TOC
   - Fermeture automatique après navigation

### Layout Changes

- Mise à jour du layout de la page article pour supporter le 3-column layout desktop
- Intégration de la barre de progression dans le layout global ou la page article

### Dependencies

- **shadcn/ui**: Sheet (pour mobile TOC), Progress (pour la barre)
- **Intersection Observer API**: Pour tracking de la section active
- **Hooks React**: `useRef`, `useState`, `useEffect`, scroll handling

---

## Reference Documents

### UX/UI Specifications
- Section 5.2: Flux 2 - Lecture d'un Article
- Section 6.2: Layout par Point de Rupture - Page Article
- Section 8.2: Composant TableOfContents
- Section 8.3: Composant ReadingProgressBar

### PRD Requirements
- **EF2 - CA2**: TOC auto-générée depuis h2/h3
- **EF8 - CA1**: Barre de progression sticky

### Architecture
- Heading.tsx: `slugify()` et génération d'IDs existants
- RichText.tsx: Serializer Lexical actuel
- Article page: Layout actuel sans TOC

---

## Dependencies

### Internal Dependencies
- **Story 4.1** (COMPLETED): Le rendu article doit être fonctionnel avec les headings qui ont des IDs

### External Dependencies
- shadcn/ui components (already installed)
- Intersection Observer API (native browser)

---

## Out of Scope (V1)

- Temps de lecture par section (affiché dans la TOC) - peut être ajouté post-V1
- Collapse/expand des sous-sections dans la TOC
- Persistance de la position de lecture
- Highlighting du texte lu

---

## Notes Techniques

### Extraction des Headings

```typescript
interface TOCHeading {
  id: string       // Généré via slugify()
  text: string     // Texte plain du heading
  level: 2 | 3     // h2 ou h3
}
```

Le Lexical JSON contient des nodes de type `heading` avec un `tag` (h2, h3, etc.) et des `children` (texte). L'extraction peut se faire via une fonction récursive qui traverse le JSON.

### Scroll Progress Calculation

```typescript
const progress = (scrollY / (documentHeight - windowHeight)) * 100
```

Le calcul doit tenir compte de la hauteur de l'article uniquement, pas de la page entière si le footer est long.

### Section Active Tracking

Utilisation de l'Intersection Observer avec un `rootMargin` pour détecter quelle section est actuellement visible. La section dont le heading est le plus proche du haut de la viewport est considérée comme active.

---

## Success Metrics

- [ ] Test E2E: navigation TOC fonctionne (click → scroll vers section)
- [ ] Test E2E: barre de progression se met à jour au scroll
- [ ] Lighthouse: pas de régression performance (CLS < 0.1)
- [ ] Test A11y: pas d'erreurs axe-core sur les nouveaux composants
