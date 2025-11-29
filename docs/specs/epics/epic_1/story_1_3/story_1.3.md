# Story 1.3 - Pipeline "Quality Gate" (AI-Shield)

**Epic**: Epic 1 - Foundation & Cloudflare Architecture
**Story ID**: 1.3
**Status**: 📋 PLANNING
**Created**: 2025-11-28

---

## 📖 Story Description

### User Story

**En tant que** Lead Tech,
**Je veux** configurer un workflow GitHub Actions exhaustif comprenant :

1. **Socket.dev** (Sécurité Supply Chain)
2. **Knip** (Nettoyage code mort)
3. **Dependency Cruiser** (Validation architecture)
4. **Stryker** (Mutation Testing sur modules critiques)
5. **Lighthouse CI** (Audit Performance & SEO bloquant)
6. **ESLint/Prettier** & Sync des Types Payload

**Afin de** garantir une base de code saine, sécurisée et performante avant toute fusion.

### Business Value

Cette story implémente le pipeline CI/CD "AI-Shield" qui protège le projet contre :

- **Supply Chain Attacks** : Injection de dépendances malveillantes via hallucinations IA
- **Code Quality Drift** : Accumulation de code mort, imports cassés, violations d'architecture
- **Régressions de Performance** : Dégradation des Core Web Vitals et de l'accessibilité
- **Tests Superficiels** : Détection des tests "faux positifs" via mutation testing

### Target Users

- Lead Tech / Développeur principal
- Contributeurs futurs (qualité garantie dès le premier commit)

---

## ✅ Acceptance Criteria

### From PRD (ENF6 - Souveraineté du Code & Sécurité Supply Chain)

#### Phase 1 - MVP (Essentials)

- **CA1 (Sécurité Supply Chain)** : Action **Socket.dev** avec politique de sécurité différenciée :
  - **BLOCK** : Malware connu, typosquatting, scripts d'installation suspects (frontend)
  - **WARN** : Télémétrie, code natif (esbuild, fsevents légitimes)
  - **MONITOR** : Paquets non maintenus (> 2 ans)
- **CA1b (Conformité Licence)** : Politique de licence deny list pour bloquer les licences virales (`GPL-3.0`, `AGPL-3.0`)
- **CA1c (Configuration socket.yml v2)** : Fichier de configuration avec `triggerPaths` et `projectIgnorePaths`
- **CA2 (Hygiène)** : Action **Knip** configurée pour Next.js 15 + Payload CMS :
  - Points d'entrée explicites : `payload.config.ts`, `middleware.ts`, `instrumentation.ts`
  - Exclusion des types générés (`payload-types.ts`) et migrations Drizzle
  - Mode `--production` en CI
- **CA3 (Type Sync)** : Vérification stricte des types Payload (`payload-types.ts` synchronisé)
- **CA4 (Build)** : Validation `next build --experimental-build-mode compile` sans DB
- **CA5 (Style)** : Prettier + plugin Tailwind (ordre déterministe)

#### Phase 2 - Enhanced (Monitoring & Performance)

- **CA6 (A11y)** : Tests Playwright + `axe-core` (WCAG 2.1 AA sur FR/EN)
- **CA7 (Architecture)** : Intégration de **dependency-cruiser** pour interdire les imports non conformes
- **CA9 (Performance Shield)** : Intégration de **Lighthouse CI** avec assertions sur métriques brutes :
  - **LCP** : warn > 2500ms, error > 4000ms
  - **CLS** : warn > 0.1, error > 0.25
  - **TBT** : warn > 200ms, error > 600ms
  - **FCP** : warn > 1800ms, error > 3000ms
  - **Accessibilité** : score = 100
  - **SEO** : score = 100

#### Phase 3 - Advanced (Robustness)

- **CA8 (Robustesse des Tests)** : Intégration de **Stryker** (Mutation Testing) sur fichiers critiques (`src/lib/`, Server Actions)

#### Sécurité Pipeline

- SHA Pinning des actions GitHub tierces (immuabilité cryptographique)
- OIDC pour authentification Cloudflare (élimine secrets statiques) - Phase 2
- Permissions GITHUB_TOKEN en read-only par défaut
- Dependabot pour maintenance automatique des dépendances

---

## 🔧 Technical Requirements

### Tools to Configure

| Tool                      | Purpose                                     | Phase |
| ------------------------- | ------------------------------------------- | ----- |
| **Socket.dev**            | Supply chain security (behavioral analysis) | 1     |
| **Knip**                  | Dead code detection, unused dependencies    | 1     |
| **ESLint 9**              | Code linting (Flat Config)                  | 1     |
| **Prettier**              | Code formatting + Tailwind ordering         | 1     |
| **Type Sync**             | Payload types validation                    | 1     |
| **Next.js Build**         | No-DB build validation                      | 1     |
| **dependency-cruiser**    | Architecture validation                     | 2     |
| **Playwright + axe-core** | E2E + Accessibility testing                 | 2     |
| **Lighthouse CI**         | Performance & SEO auditing                  | 2     |
| **Stryker**               | Mutation testing                            | 3     |
| **Dependabot**            | Automated dependency updates                | 1     |

### Files to Create/Modify

#### New Files

- `.github/workflows/quality-gate.yml` - Main CI workflow
- `.github/dependabot.yml` - Dependency update config
- `socket.yml` - Socket.dev configuration (v2)
- `knip.json` - Knip configuration
- `.dependency-cruiser.cjs` - Architecture rules
- `lighthouserc.js` - Lighthouse CI config
- `stryker.config.mjs` - Mutation testing config
- `scripts/lighthouse-auth.js` - Puppeteer auth script (optional)

#### Modified Files

- `eslint.config.mjs` - ESLint 9 Flat Config updates
- `prettier.config.mjs` - Prettier + Tailwind plugin
- `package.json` - New dev dependencies and scripts

### Dependencies to Add

```json
{
  "devDependencies": {
    "@axe-core/playwright": "^4.x",
    "@lhci/cli": "^0.14.x",
    "@stryker-mutator/core": "^8.x",
    "@stryker-mutator/vitest-runner": "^8.x",
    "dependency-cruiser": "^16.x",
    "knip": "^5.x",
    "prettier-plugin-tailwindcss": "^0.6.x"
  }
}
```

---

## 📊 Complexity Assessment

### Story Complexity: 🟠 **Complex** (7-8 phases)

**Factors**:

- **Multiple independent tools** : 10+ outils à configurer
- **Layered architecture** : 4 couches de défense (supply chain, quality, build, identity)
- **Configuration files** : 8+ nouveaux fichiers de configuration
- **Integration complexity** : Interactions entre outils (ESLint cache, Lighthouse wait-for-url)
- **Testing requirements** : Validation de chaque outil individuellement

### Risk Assessment

| Risk                                        | Level     | Mitigation                                  |
| ------------------------------------------- | --------- | ------------------------------------------- |
| Socket.dev false positives                  | 🟡 Medium | Configure `@SocketSecurity ignore` workflow |
| Knip false positives on Next.js conventions | 🟡 Medium | Explicit entry points in knip.json          |
| Lighthouse flakiness in CI                  | 🟡 Medium | numberOfRuns: 3, raw metrics assertions     |
| Stryker CPU-intensive                       | 🟢 Low    | Optional via workflow_dispatch input        |
| D1 not available in CI                      | 🟢 Low    | `--experimental-build-mode compile`         |

---

## 🔗 Dependencies

### Story Dependencies

- **Story 1.1** ✅ COMPLETED : Infrastructure provisionnée (GitHub repo exists)
- **Story 1.2** ✅ COMPLETED : Environnement local fonctionnel

### External Dependencies

- **GitHub Account** : Repository access for Actions
- **Socket.dev Account** : Free tier available for supply chain scanning
- **Cloudflare Account** : For OIDC authentication (Phase 2)

### Blocks

- **Story 1.4** : Depends on this story (deployment gated by Quality Gate)

---

## 📚 Reference Documents

- **CI/CD Security Architecture** : `docs/specs/CI-CD-Security.md`
- **Socket.dev CI** : `docs/tech/github/socket-dev-CI.md`
- **Knip CI** : `docs/tech/github/knip-CI.md`
- **Lighthouse CLI** : `docs/tech/github/lighthouse-cli-CI.md`
- **ESLint/Prettier CI** : `docs/tech/github/eslint-prettier-CI.md`
- **dependency-cruiser CI** : `docs/tech/github/dependency-cruiser-CI.md`

---

## 🎯 Success Metrics

- [ ] All quality checks pass on a clean codebase
- [ ] No false positives blocking legitimate code
- [ ] Workflow execution time < 10 minutes (without Stryker)
- [ ] Branch protection configured to require quality-gate status
- [ ] Documentation for manual workflow trigger process

---

**Story Extracted From**: PRD.md (lines 301-311)
**Created By**: Claude Code (story-phase-planner skill)
