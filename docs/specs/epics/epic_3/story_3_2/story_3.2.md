# Story 3.2: Intégration Design System (Dark Mode)

## Story Overview

**Epic**: 3 - Frontend Core & Design System
**Story**: 3.2 - Intégration Design System (Dark Mode)
**Status**: 📋 PLANNING
**Created**: 2025-12-02

---

## Original Specification (from PRD)

> **En tant que** Développeur, **je veux** installer **Tailwind 4** et **shadcn/ui** et appliquer la charte graphique "Neutral Gray & Teal", **afin de** remplacer le style par défaut du template par l'identité de la marque.

---

## Story Objectives

1. **Installer et configurer Tailwind CSS 4** avec PostCSS
2. **Installer et configurer shadcn/ui** pour les composants React
3. **Définir les design tokens** de la charte graphique "Neutral Gray & Teal"
4. **Configurer les polices** Nunito Sans et JetBrains Mono
5. **Migrer le CSS existant** vers Tailwind
6. **Valider l'accessibilité** (WCAG 2.1 AA - contrastes)

---

## Acceptance Criteria

### Functional Requirements

- [ ] **AC-1**: Tailwind CSS 4 est installé et fonctionnel
- [ ] **AC-2**: shadcn/ui est installé avec le thème dark mode par défaut
- [ ] **AC-3**: Les design tokens sont configurés selon la charte graphique
- [ ] **AC-4**: Les polices Nunito Sans et JetBrains Mono sont chargées via `next/font`
- [ ] **AC-5**: Le CSS vanilla existant est migré vers Tailwind utilities
- [ ] **AC-6**: La homepage affiche les nouvelles couleurs et typographie
- [ ] **AC-7**: Le mode dark est activé par défaut (pas de toggle en V1)

### Non-Functional Requirements

- [ ] **NFR-1**: Contrastes WCAG 2.1 AA validés (≥4.5:1 pour texte, ≥3:1 pour UI)
- [ ] **NFR-2**: Pas de régression visuelle sur le panneau admin Payload
- [ ] **NFR-3**: Bundle CSS < 50KB gzipped
- [ ] **NFR-4**: Build Next.js réussit sans erreurs
- [ ] **NFR-5**: Compatible Cloudflare Workers (pas de Node.js APIs)

---

## Technical Requirements

### Dependencies to Add

```json
{
  "dependencies": {
    "tailwindcss": "^4.0.0",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "class-variance-authority": "^0.7.x"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0"
  }
}
```

### Design Tokens (Charte Graphique)

| Token | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| Background Primary | `#1F1F1F` | `--background` | Fond principal (gris neutre) |
| Background Secondary | `#2E2E2E` | `--card` | Cartes, panneaux |
| Accent Primary | `#14B8A6` | `--primary` | Teal (liens, boutons) |
| Foreground Primary | `#FAFAFA` | `--foreground` | Texte principal (blanc pur) |
| Foreground Muted | `#A6A6A6` | `--muted-foreground` | Texte secondaire |
| Destructive | `#F56565` | `--destructive` | Erreurs, actions destructives |
| Success | `#48BB78` | `--success` | Confirmations |
| Border | `#454545` | `--border` | Bordures (gris neutre) |
| Ring | `#14B8A6` | `--ring` | Focus ring |
| Border Radius | `0.375rem` | `--radius` | 6px - arrondis subtils |

> **Note**: Les gris utilisent une saturation de 0% (neutres purs) pour éviter les teintes bleutées.

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Headings | Nunito Sans | 600-700 | H1: 36px, H2: 30px, H3: 24px |
| Body | Nunito Sans | 400 | 16px, line-height: 1.6 |
| Code | JetBrains Mono | 400 | 14px |

---

## Dependencies

### Internal Dependencies

- **Story 3.1** (i18n) ✅ COMPLETED - Structure `[locale]` en place
- **Epic 1** (Infrastructure) ✅ COMPLETED - Cloudflare setup

### External Dependencies

- Tailwind CSS 4.x (stable release)
- shadcn/ui (React 19 compatible)
- next/font (built-in Next.js)

---

## Files Affected (Estimated)

### New Files (~10)
- `postcss.config.mjs`
- `src/app/globals.css` (Tailwind imports + tokens)
- `components.json` (shadcn config)
- `src/lib/utils.ts` (cn utility)
- `src/components/ui/button.tsx` (first shadcn component)

### Modified Files (~5)
- `package.json` (dependencies)
- `src/app/[locale]/layout.tsx` (fonts, globals.css)
- `src/app/[locale]/(frontend)/layout.tsx` (remove styles.css import)
- `src/app/[locale]/(frontend)/page.tsx` (Tailwind classes)
- `tailwind.config.ts` (if using config file approach)

### Deleted Files (~1)
- `src/app/[locale]/(frontend)/styles.css` (migrated to Tailwind)

---

## Out of Scope

- Light/Dark mode toggle (V1 is dark-only)
- Full component library (only Button for validation)
- Animation system (Story 3.3+)
- Responsive breakpoints customization (use Tailwind defaults)

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Build Success | ✅ No errors |
| Lighthouse Performance | ≥ 90 |
| CSS Bundle Size | < 50KB gzipped |
| WCAG Contrast | AA compliant |
| Visual Regression | None on admin |

---

## Related Documents

- [UX_UI_Spec.md](../../../UX_UI_Spec.md) - Section 7: Design System
- [EPIC_TRACKING.md](../EPIC_TRACKING.md) - Epic 3 tracking
- [Story 3.1](../story_3_1/story_3.1.md) - i18n implementation (prerequisite)

---

## Notes

### Tailwind CSS 4 Specifics

Tailwind v4 utilise une approche CSS-first avec `@import "tailwindcss"` plutôt que les directives `@tailwind`. La configuration peut être faite directement en CSS avec `@theme`.

### shadcn/ui Integration

shadcn/ui n'est pas une dépendance npm classique mais un système de copie de composants. L'initialisation crée un `components.json` et permet d'ajouter des composants individuellement.

### Dark Mode Strategy

En V1, le dark mode est le seul mode (pas de toggle). La classe `dark` sera ajoutée sur `<html>` et les CSS variables seront configurées pour le thème sombre uniquement.
