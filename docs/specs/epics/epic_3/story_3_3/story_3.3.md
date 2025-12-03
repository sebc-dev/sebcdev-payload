# Story 3.3 - Layout Global & Navigation

**Epic**: 3 - Frontend Core & Design System
**Status**: NOT STARTED
**Created**: 2025-12-03

---

## Story Description

**En tant qu'** Utilisateur,
**Je veux** voir un Header et un Footer cohérents sur toutes les pages, incluant un sélecteur de langue fonctionnel,
**Afin de** naviguer aisément dans le site.

---

## Story Objectives

Cette story implémente la structure de navigation globale du site sebc.dev :

1. **Header responsive** avec logo, navigation principale et sélecteur de langue
2. **Footer** avec liens utiles et informations de copyright
3. **Sélecteur de langue** fonctionnel (FR/EN) intégré au Header
4. **Navigation principale** vers les sections clés (Articles, Catégories, Niveaux)
5. **Cohérence visuelle** sur toutes les pages via le layout partagé

---

## Acceptance Criteria

### AC1: Header Component
- [ ] Le Header s'affiche sur toutes les pages frontend (`/[locale]/*`)
- [ ] Le Header contient : Logo (lien vers `/[locale]/`), Navigation, Sélecteur de langue
- [ ] Le Header est sticky en haut de page
- [ ] Le Header est responsive (hamburger menu sur mobile)
- [ ] Le Header respecte la charte graphique "Anthracite & Vert Canard"

### AC2: Navigation Principale
- [ ] Liens de navigation : Articles (`/[locale]/articles`), Catégories (dropdown), Niveaux (dropdown)
- [ ] Navigation accessible au clavier (tab navigation, focus states)
- [ ] Indicateur visuel pour la page active
- [ ] Dropdowns pour Catégories et Niveaux (V1: redirections vers Hub avec filtres)

### AC3: Sélecteur de Langue
- [ ] Toggle FR/EN visible dans le Header
- [ ] Changement de langue préserve la page actuelle
- [ ] Langue sélectionnée persistée via cookie (next-intl)
- [ ] URL mise à jour (`/fr/...` ↔ `/en/...`)

### AC4: Footer Component
- [ ] Le Footer s'affiche sur toutes les pages frontend
- [ ] Contenu : Copyright, liens de navigation secondaires
- [ ] Design cohérent avec le Header et la charte graphique
- [ ] Responsive (stack vertical sur mobile)

### AC5: Layout Integration
- [ ] Header et Footer intégrés dans le layout frontend (`app/[locale]/(frontend)/layout.tsx`)
- [ ] Structure sémantique HTML (`<header>`, `<main>`, `<footer>`)
- [ ] Pas de régression sur les pages existantes (Homepage, Admin)

### AC6: Accessibilité
- [ ] Navigation accessible au clavier (WCAG 2.1 AA)
- [ ] Skip link "Aller au contenu principal"
- [ ] ARIA landmarks appropriés (`role="navigation"`, `role="banner"`, `role="contentinfo"`)
- [ ] Contrastes conformes WCAG AA (4.5:1 texte, 3:1 UI)

---

## Technical Requirements

### Dependencies
- **Story 3.1** (i18n Routing): ✅ Completed - Provides locale context and routing
- **Story 3.2** (Design System): 🚧 In Progress (3/4 phases) - Provides Tailwind, shadcn/ui, design tokens

### Components to Create
1. `src/components/layout/Header.tsx` - Main header component
2. `src/components/layout/Footer.tsx` - Footer component
3. `src/components/layout/Navigation.tsx` - Navigation menu
4. `src/components/layout/LanguageSwitcher.tsx` - Language toggle
5. `src/components/layout/MobileMenu.tsx` - Mobile hamburger menu

### shadcn/ui Components to Add
- `DropdownMenu` - For Catégories and Niveaux dropdowns
- `Sheet` - For mobile menu (slide-in panel)
- `NavigationMenu` - For desktop navigation (optional, may use custom)

### i18n Keys Required
```json
{
  "navigation": {
    "home": "Accueil",
    "articles": "Articles",
    "categories": "Catégories",
    "levels": "Niveaux",
    "skipToContent": "Aller au contenu principal"
  },
  "footer": {
    "copyright": "© {year} sebc.dev. Tous droits réservés.",
    "madeWith": "Fait avec"
  },
  "language": {
    "switch": "Changer de langue",
    "fr": "Français",
    "en": "English"
  }
}
```

### File Structure
```
src/
├── components/
│   └── layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── Navigation.tsx
│       ├── LanguageSwitcher.tsx
│       ├── MobileMenu.tsx
│       └── index.ts (barrel export)
├── app/
│   └── [locale]/
│       └── (frontend)/
│           └── layout.tsx (modified - add Header/Footer)
messages/
├── fr.json (modified - add navigation keys)
└── en.json (modified - add navigation keys)
```

---

## Design Specifications

### Header Layout (Desktop ≥1024px)
```
┌────────────────────────────────────────────────────────────┐
│ [Logo] │ Articles │ Catégories ▾ │ Niveaux ▾ │    [FR/EN] │
└────────────────────────────────────────────────────────────┘
```

### Header Layout (Mobile <1024px)
```
┌────────────────────────────────────┐
│ [Logo]                      [☰]   │
└────────────────────────────────────┘
```

### Mobile Menu (Sheet)
```
┌────────────────────────────────────┐
│ [X Close]                          │
├────────────────────────────────────┤
│ Accueil                            │
│ Articles                           │
│ Catégories >                       │
│ Niveaux >                          │
├────────────────────────────────────┤
│ [FR] [EN]                          │
└────────────────────────────────────┘
```

### Footer Layout
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  sebc.dev                                                  │
│  Blog technique sur l'IA, l'UX et l'ingénierie logicielle │
│                                                            │
│  Articles • Catégories • Contact                          │
│                                                            │
│  © 2025 sebc.dev. Tous droits réservés.                   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Color Tokens (from Story 3.2)
- **Header Background**: `bg-background` (#1A1D23)
- **Header Border**: `border-border` (#374151)
- **Navigation Links**: `text-foreground` with `hover:text-primary`
- **Active Link**: `text-primary` (#14B8A6)
- **Footer Background**: `bg-card` (#2D3748) or `bg-background`

---

## User Flows

### Flow 1: Desktop Navigation
1. User lands on any page → Header visible at top (sticky)
2. User clicks "Articles" → Navigates to `/[locale]/articles`
3. User hovers "Catégories" → Dropdown appears with category list
4. User clicks category → Navigates to `/[locale]/articles?category=X`

### Flow 2: Language Switch
1. User on `/fr/articles` → Clicks "EN" in language switcher
2. URL updates to `/en/articles`
3. Page content refreshes with English translations
4. Language preference saved in cookie

### Flow 3: Mobile Navigation
1. User on mobile device → Sees hamburger menu icon
2. User taps hamburger → Sheet slides in from right
3. User taps "Articles" → Sheet closes, navigates to articles
4. User taps language toggle → Language changes, sheet closes

---

## Testing Requirements

### E2E Tests (Playwright)
- [ ] Header visible on all frontend pages
- [ ] Navigation links work correctly
- [ ] Language switcher changes locale and URL
- [ ] Mobile menu opens/closes correctly
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Skip link navigates to main content

### Accessibility Tests
- [ ] axe-core audit passes (no violations)
- [ ] Focus visible on all interactive elements
- [ ] ARIA landmarks present and correct
- [ ] Screen reader announces navigation correctly

### Visual Tests
- [ ] Header matches design spec on desktop
- [ ] Header matches design spec on mobile
- [ ] Footer matches design spec
- [ ] No layout shift on page load

---

## Out of Scope (V1)

- Search bar in header (Story 5.x)
- User account menu (post-V1)
- Breadcrumbs (may be added later)
- Notification badge
- Dark/Light mode toggle (dark mode only in V1)

---

## Related Documents

- [PRD.md](../../../../PRD.md) - Story 3.3 description
- [UX_UI_Spec.md](../../../../UX_UI_Spec.md) - Section 4: Navigation and Breadcrumbs
- [EPIC_TRACKING.md](../../EPIC_TRACKING.md) - Epic 3 progress
- [Story 3.1](../story_3_1/story_3.1.md) - i18n Routing (dependency)
- [Story 3.2](../story_3_2/story_3.2.md) - Design System (dependency)

---

**Story Created**: 2025-12-03
**Last Updated**: 2025-12-03
