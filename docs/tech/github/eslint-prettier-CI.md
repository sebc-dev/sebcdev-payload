# **Excellence Opérationnelle dans l'Analyse Statique : Architecture Optimale des Flux de Travail ESLint et Prettier pour Next.js 15 et Payload CMS 3.0**

## **Sommaire Exécutif**

L'année 2025 marque un point d'inflexion critique dans l'écosystème JavaScript, caractérisé par la convergence de trois évolutions majeures : l'adoption généralisée du système "Flat Config" d'ESLint (v9), la maturation de l'architecture App Router dans Next.js 15, et l'émergence de Payload CMS 3.0 comme solution "code-first" native. Pour les architectes logiciels et les ingénieurs DevOps, ces changements rendent obsolètes les configurations traditionnelles basées sur .eslintrc et .prettierrc. Ce rapport de recherche propose une analyse exhaustive et une stratégie de mise en œuvre pour orchestrer ces outils au sein de GitHub Actions. L'objectif est de dépasser la simple "vérification de syntaxe" pour établir un pipeline de qualité de code qui soit performant, déterministe et sécurisé contre les attaques de la chaîne d'approvisionnement logicielle.  
L'analyse démontre que l'approche historique consistant à imbriquer Prettier dans ESLint est non seulement inefficace sur le plan computationnel, mais aussi conceptuellement erronée dans une architecture moderne. Nous préconisons une séparation stricte des préoccupations, soutenue par une stratégie de mise en cache granulaire et une sécurité renforcée au niveau des scripts CI/CD.  
---

## **1. Fondements Théoriques de l'Analyse Statique Moderne**

Pour prétendre à une expertise sur le sujet, il est impératif de déconstruire les mécanismes sous-jacents des outils d'analyse statique. La confusion fréquente entre le formatage de code et l'analyse de qualité (linting) a conduit à des décennies de configurations sous-optimales, consommant inutilement des cycles CPU et cognitives.

### **1.1 La Dichotomie entre Formatage (AST Printing) et Linting (AST Analysis)**

Au cœur du débat se trouve la manipulation de l'Arbre Syntaxique Abstrait (Abstract Syntax Tree - AST). Bien que Prettier et ESLint opèrent tous deux sur l'AST, leurs objectifs et méthodes divergent radicalement.  
Prettier : Le "Printer" Opiniâtre  
Prettier fonctionne comme un "imprimeur" d'AST. Lorsqu'il traite un fichier, il le parse en un AST, ignore complètement le formatage d'origine, puis réimprime le code à partir de zéro en suivant un ensemble de règles strictes et minimalistes. Ce processus est binaire : soit le code correspond à la sortie de Prettier, soit il ne correspond pas. Prettier ne se soucie pas de la sémantique du code ni de sa validité logique. Sa valeur réside dans la suppression totale du "bikeshedding" (débats futiles sur le style) au sein des équipes de développement.
ESLint : L'Analyste Sémantique  
ESLint, en revanche, traverse l'AST pour identifier des motifs problématiques qui pourraient indiquer des bugs logiques, des problèmes de sécurité ou des mauvaises pratiques. Bien qu'ESLint possède historiquement des règles de formatage (comme indent ou semi), son moteur est conçu pour l'analyse contextuelle.  
L'Anti-Patron de l'Intégration (The Integration Anti-Pattern)  
Une pratique courante, mais désormais obsolète, consistait à utiliser des plugins comme eslint-plugin-prettier pour exécuter Prettier à l'intérieur du processus ESLint. Cette approche présente deux défauts majeurs identifiés dans la recherche :

1. **Surcharge de Performance :** Chaque fichier doit être parsé deux fois (une fois par ESLint, une fois par Prettier) et sérialisé, ce qui double effectivement le temps d'exécution du linting. Dans un environnement CI facturé à la minute comme GitHub Actions, cette inefficacité est coûteuse.
2. **Pollution Visuelle :** Les erreurs de formatage sont, par définition, toujours auto-corrigibles. Les mélanger avec des erreurs logiques (bugs potentiels) dans les rapports d'erreurs dilue l'attention des développeurs et rend le triage des problèmes critiques plus difficile.

La recommandation experte pour 2025 est donc sans équivoque : exécuter Prettier et ESLint comme deux processus distincts et parallèles. ESLint doit être configuré avec eslint-config-prettier pour désactiver explicitement toutes les règles de conflit, laissant Prettier seul maître du style visuel.

### **1.2 La Révolution du "Flat Config" (ESLint 9)**

ESLint 9 a introduit le changement le plus disruptif de l'histoire de l'outil : le système de configuration plat (eslint.config.mjs). Ce changement n'est pas simplement syntaxique, il est architectural.  
L'ancien système (.eslintrc) reposait sur une "cascade" de configurations, où les fichiers de configuration étaient fusionnés en fonction de la hiérarchie des dossiers. Ce système impliquait également un résolveur de modules personnalisé qui causait de fréquents problèmes avec les gestionnaires de paquets modernes comme pnpm ou dans les contextes de monorepo.  
Le nouveau système "Flat Config" repose sur un tableau unique d'objets de configuration, traité de manière séquentielle. Cette approche offre plusieurs avantages critiques pour les projets complexes comme ceux utilisant Next.js et Payload CMS :

* **Déterminisme :** Les règles s'appliquent en fonction de l'ordre dans le tableau, éliminant l'ambiguïté des "extends" imbriqués.  
* **Résolution Native :** Le chargement des plugins utilise la résolution de modules native de Node.js, ce qui simplifie considérablement la gestion des dépendances dans les architectures modernes.
* **Scope Explicite :** Chaque objet de configuration définit explicitement les fichiers auxquels il s'applique via la propriété files, supprimant la confusion autour des overrides et ignorePatterns globaux.

Pour un projet Next.js 15, l'adoption de Flat Config est impérative, car l'écosystème (notamment typescript-eslint v8+) migre agressivement vers ce standard, rendant les configurations héritées de plus en plus difficiles à maintenir.
---

## **2. Architecture de Configuration pour l'Écosystème Next.js 15 et Payload CMS 3.0**

L'intégration de Payload CMS 3.0 dans une application Next.js 15 App Router crée un environnement hybride complexe. Payload CMS, étant "code-first", partage le même contexte TypeScript que l'application frontale, mais exécute une grande partie de son code côté serveur (Node.js). Cela nécessite une stratégie de linting nuancée.

### **2.1 Le Défi de la Compatibilité Next.js 15**

Une friction majeure identifiée dans la recherche actuelle réside dans le fait que Next.js 15 (bien qu'étant la version la plus récente) continue de fournir des configurations ESLint (eslint-config-next) basées sur l'ancien format .eslintrc. Tenter d'utiliser directement ces configurations dans un fichier eslint.config.mjs provoquera des erreurs, car le format attendu n'est pas respecté.
De plus, un bug spécifique a été identifié lors de l'utilisation d'ESLint 9 avec les plugins Next.js : l'erreur "The Next.js plugin was not detected in your ESLint configuration". Cela survient car l'ancien système de plugins s'appuyait sur des noms de chaînes de caractères, tandis que le nouveau système exige des objets plugins importés. 
Pour contourner ces limitations sans sacrifier la modernité d'ESLint 9, l'utilisation de l'utilitaire FlatCompat du package @eslint/eslintrc est requise pour "traduire" les règles héritées de Next.js en objets Flat Config compatibles.

### **2.2 Stratégie de Typage et Payload CMS**

Payload CMS 3.0 génère automatiquement des types TypeScript (payload-types.ts) basés sur la configuration des collections. Ce fichier peut rapidement atteindre des milliers de lignes de définitions de types complexes.

* **Optimisation Critique :** Il est impératif d'exclure payload-types.ts de l'analyse ESLint. Linter ce fichier généré consomme énormément de ressources CPU pour une valeur nulle, car le code n'est pas destiné à être édité manuellement.11  
* **Contexte Serveur vs Client :** Payload utilise des fichiers de configuration (payload.config.ts) qui s'exécutent dans un environnement Node.js. Les règles strictes de Next.js concernant l'utilisation de console.log ou d'autres API serveur doivent être assouplies pour ces fichiers spécifiques via des objets de configuration ciblés.

### **2.3 Composition Optimale de eslint.config.mjs**

La configuration recommandée adopte une approche "hybride", mélangeant des configurations natives (pour JS et TS) et des configurations adaptées (pour Next.js).  
**Tableau 1 : Matrice de Configuration ESLint pour Next.js 15 + Payload 3.0**

| Composant | Source / Plugin | Rôle Technique | Stratégie d'Implémentation |
| :---- | :---- | :---- | :---- |
| **Base JS** | @eslint/js | Règles syntaxiques fondamentales (recommandées). | Importation native js.configs.recommended. |
| **TypeScript** | typescript-eslint | Analyse statique typée (nécessaire pour Payload). | Importation native tseslint.configs.recommended. Utiliser projectService pour la performance. |
| **Next.js Framework** | @next/eslint-plugin-next | Règles spécifiques à l'App Router et aux Core Web Vitals. | Utilisation de FlatCompat pour charger next/core-web-vitals. |
| **React** | eslint-plugin-react | Bonnes pratiques React (Hooks, JSX). | Configuration native (v7.35+ supporte Flat Config). |
| **Formatage** | eslint-config-prettier | Désactivation des conflits de style. | Doit être placé **en dernier** dans le tableau pour surcharger les précédents. |
| **Payload Config** | Règles manuelles | Validation logique spécifique au CMS. | Overrides ciblés sur src/payload.config.ts. |

L'implémentation technique doit également gérer l'importation correcte des plugins pour éviter les erreurs de redéfinition. Il est recommandé de mapper manuellement le plugin @next/next dans l'objet de configuration pour garantir sa détection par les règles héritées.
---

## **3. Mise en Œuvre Pratique : Configuration des Fichiers**

Cette section détaille le contenu exact des fichiers de configuration pour atteindre l'état de l'art.

### **3.1 Le Fichier eslint.config.mjs**

L'utilisation de l'extension .mjs est cruciale pour forcer le mode ESM, aligné avec next.config.mjs.


```javascript
import { FlatCompat } from '@eslint/eslintrc';  
import js from '@eslint/js';  
import typescriptEslint from 'typescript-eslint';  
import prettierConfig from 'eslint-config-prettier';  
import path from 'path';  
import { fileURLToPath } from 'url';

// Nécessaire pour émuler __dirname dans un contexte ESM pour FlatCompat  
const __filename = fileURLToPath(import.meta.url);  
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({  
  baseDirectory: __dirname,  
});

export default [  
  // 1. Ignorances Globales : La première ligne de défense pour la performance  
  {  
    ignores: [  
        ".next/**",  
        "node_modules/**",  
        "build/**",  
        "dist/**",  
        "**/*.d.ts",  
        "src/payload-types.ts", // Optimisation Payload : ignorer les types générés  
        "coverage/**"  
    ],  
  },

  // 2. Configuration de Base JavaScript  
  js.configs.recommended,

  // 3. Configuration TypeScript  
 ...typescriptEslint.configs.recommended,

  // 4. Configuration Next.js (via couche de compatibilité)  
  // L'utilisation de compat.extends est nécessaire tant que Next.js n'exporte pas de Flat Config natif  
 ...compat.extends('next/core-web-vitals'),

  // 5. Overrides Spécifiques  
  {  
    files: ["src/payload.config.ts", "src/scripts/*.ts"],  
    rules: {  
      "no-console": "off", // Les scripts serveur Payload nécessitent souvent des logs  
      "no-process-env": "off" // Payload repose sur les variables d'environnement  
    }  
  },  
  {  
    // Correction du bug de détection de plugin Next.js dans ESLint 9  
    // On réassigne explicitement le plugin si nécessaire par les règles importées  
    plugins: {  
        // La définition des plugins est gérée implicitement par compat.extends,  
        // mais des ajustements manuels peuvent être requis selon la version exacte.  
    }  
  },

  // 6. Prettier (DOIT être en dernier pour écraser les conflits)  
  prettierConfig,  
];
```
### **3.2 Configuration Prettier Déterministe**

Pour Prettier, la stabilité est primordiale. L'utilisation d'un fichier de configuration dynamique (prettier.config.mjs) permet l'intégration propre de plugins comme Tailwind CSS, omniprésent dans l'écosystème Next.js.

```javascript
// prettier.config.mjs  
/** @type {import("prettier").Config} */  
const config = {  
  semi: false,          // Tendance moderne : moins de bruit visuel  
  singleQuote: true,    // Standard dans l'écosystème React  
  tabWidth: 2,  
  trailingComma: 'all', // Critique pour réduire les diffs git lors d'ajouts de propriétés  
  printWidth: 100,      // Adapté aux écrans larges modernes  
  plugins: ['prettier-plugin-tailwindcss'], // Tri automatique des classes Tailwind  
};

export default config;
```
Le Piège du .prettierignore :  
Une erreur fréquente est de supposer que Prettier suivra .gitignore parfaitement en CI. Cependant, lors des étapes de build, des fichiers générés (comme ceux de Next.js ou Payload) peuvent apparaître avant l'étape de formatage. Il est crucial d'avoir un .prettierignore explicite qui exclut src/payload-types.ts et les dossiers de build pour éviter des échecs de CI sur des fichiers que les développeurs ne contrôlent pas.
---

## **4. Architecture CI/CD dans GitHub Actions**

L'intégration continue est le lieu où la théorie rencontre la réalité économique et opérationnelle. Une configuration naïve exécutant npm install suivi de npm run lint à chaque Push est financièrement irresponsable et techniquement inefficace.

### **4.1 Stratégie de Gestion des Dépendances (npm vs pnpm)**

Pour un projet Next.js/Payload moderne, l'utilisation de pnpm est fortement recommandée par rapport à npm ou yarn. L'analyse comparative montre que pnpm utilise un stockage adressable par contenu, ce qui le rend beaucoup plus rapide et économe en espace disque dans les environnements CI éphémères.  
Configuration Optimale du Setup Node :  
L'action actions/setup-node version 4 intègre désormais une gestion de cache native sophistiquée. Il est préférable d'utiliser cette fonctionnalité plutôt que de configurer manuellement actions/cache pour les node_modules, car elle gère automatiquement la rotation des clés de cache en fonction du fichier lock.

```yaml
- uses: pnpm/action-setup@v4  
  with:  
    version: 9  
- uses: actions/setup-node@v4  
  with:  
    node-version: '20'  
    cache: 'pnpm' # Active le cache natif ultra-rapide
```
### **4.2 La Stratégie de Cache pour Prettier : Un Contre-Intuitif**

C'est ici que l'expertise se distingue des guides standards. Prettier v3 a introduit un flag --cache. Cependant, son utilisation en CI est problématique. Par défaut, le cache de Prettier utilise les métadonnées de fichier (date de modification - mtime) pour invalider le cache. Or, l'action actions/checkout de GitHub réécrit les timestamps de tous les fichiers à l'heure du checkout, invalidant *de facto* le cache de Prettier à chaque exécution, rendant la sauvegarde/restauration du cache (qui prend du temps réseau) inutilement coûteuse.
**Recommandation Experte :**

1. **Pour les petits/moyens projets (< 5000 fichiers) :** Ne pas utiliser le cache Prettier en CI. Prettier est extrêmement rapide. Le temps gagné par le cache est souvent annulé par le temps de téléchargement de l'artefact de cache.  
2. **Pour les grands monorepos :** Si le cache est nécessaire, il faut utiliser la stratégie --cache-strategy content. Cela force Prettier à hasher le contenu des fichiers plutôt que de se fier aux dates. C'est plus intensif en CPU, mais c'est la seule façon d'avoir un cache fiable en CI.

### **4.3 La Stratégie de Cache pour ESLint**

Contrairement à Prettier, ESLint est lent, surtout avec des règles TypeScript activées. Le cache est ici obligatoire. ESLint supporte un cache basé sur le contenu.  
Implémentation Robuste :  
Il faut configurer actions/cache pour persister le dossier .eslintcache. La clé de cache doit être composite : elle doit inclure le hash du fichier lock (car une mise à jour d'ESLint invalide le cache) ET un hash global des fichiers sources pour maximiser les chances de "hit" partiel via restore-keys.

```yaml
- name: Restore ESLint Cache  
  uses: actions/cache@v4  
  with:  
    path:.eslintcache  
    # Clé primaire : dépendances + contenu source exact (peu probable de hit)  
    key: ${{ runner.os }}-eslint-${{ hashFiles('pnpm-lock.yaml') }}-${{ hashFiles('**/*.[jt]s', '**/*.[jt]sx') }}  
    # Clés de repli : récupérer le cache de la branche main même si le code a changé  
    restore-keys: |  
      ${{ runner.os }}-eslint-${{ hashFiles('pnpm-lock.yaml') }}-
```
Cette configuration permet à ESLint de ne vérifier que les fichiers modifiés par rapport au cache de la branche principale, accélérant drastiquement le linting des PRs.

### **4.4 Optimisation et Sécurité : Le Cas "Changed Files"**

Une optimisation populaire consiste à ne linter que les fichiers modifiés dans la PR. Cependant, les recherches récentes ont mis en lumière une faille de sécurité critique liée à l'action tierce tj-actions/changed-files, qui a été compromise par une attaque de la chaîne d'approvisionnement.  
L'Approche Sécurisée Native :  
Plutôt que de dépendre d'une action tierce opaque, l'expert utilise un script shell natif utilisant git diff. C'est plus sûr, plus rapide, et ne nécessite aucune dépendance externe.

```bash
# Récupération de la branche cible pour comparaison  
git fetch origin main:main  
# Identification des fichiers modifiés  
CHANGED_FILES=$(git diff --name-only main...HEAD -- '*.ts' '*.tsx' '*.js' '*.mjs')

if; then  
  echo "Linting changed files: $CHANGED_FILES"  
  pnpm exec eslint $CHANGED_FILES  
else  
  echo "No relevant files changed."  
fi
```
Cette méthode élimine complètement le risque de supply chain attack associé aux actions de détection de fichiers, tout en garantissant que seuls les fichiers pertinents sont analysés.
---

## **5. Expérience Développeur Avancée : Feedback Loops**

Un pipeline CI qui échoue avec un log de 10 000 lignes est inutile. L'excellence opérationnelle exige que le feedback soit précis et contextuel.

### **5.1 Problem Matchers**

GitHub Actions supporte les "Problem Matchers", qui parsent la sortie console pour créer des annotations directement sur les fichiers modifiés dans l'interface de Pull Request ("Files Changed").  
L'action setup-node inclut des matchers par défaut, mais ils échouent souvent si la sortie d'ESLint n'est pas formatée correctement.

* **Impératif :** Toujours exécuter ESLint avec --format stylish. Les formats JSON ou custom casseront les matchers par défaut, obligeant le développeur à fouiller dans les logs bruts.

### **5.2 Reviewdog : L'Annotation Automatisée**

Pour aller plus loin, l'intégration de reviewdog permet de poster les erreurs de linting sous forme de commentaires de revue de code. Cela transforme le linter en un "membre de l'équipe" virtuel.

```yaml
- uses: reviewdog/action-eslint@v1  
  with:  
    reporter: github-pr-review  
    filter_mode: added # Ne commente que sur les nouvelles lignes, pas sur la dette technique existante
```
Cette configuration réduit la charge cognitive des revues humaines en déléguant la pédanterie syntaxique au bot.  
---

## **6. Sécurité et Durcissement de la Chaîne d'Approvisionnement**

Dans le contexte actuel de cybermenaces, configurer un linter ne se limite pas au code. Il faut sécuriser le pipeline lui-même.

### **6.1 Pinning des Actions**

L'incident tj-actions 21 nous rappelle que les tags de version (ex: @v4) sont mutables. Un attaquant peut écraser un tag pour injecter du code malveillant.

* **Bonne Pratique :** Pour un projet PRD sensible, toutes les actions tierces doivent être épinglées par leur SHA de commit (immutable), et non par leur tag.  
  * *Risqué :* uses: actions/checkout@v4  
  * *Sécurisé :* uses: actions/checkout@b4ffde65f4633668241c76fb52110029404006d3

### **6.2 Lockfiles et Scripts**

L'utilisation de pnpm install --frozen-lockfile (ou npm ci) est non-négociable. Elle garantit que les dépendances installées en CI sont bit-pour-bit identiques à celles testées localement, prévenant les dérives de version accidentelles ou malveillantes.  
---

## **7. Workflow Complet : Le Fichier lint.yml Définitif**

En synthétisant l'ensemble de ces recherches, voici le fichier de workflow optimal pour votre projet.

```yaml
name: Quality Assurance

on:  
  push:  
    branches: [main] # Nécessaire pour mettre à jour le cache de référence  
  pull_request:  
    types: [opened, synchronize, reopened]

permissions:  
  contents: read  
  checks: write # Nécessaire pour les annotations  
  pull-requests: write # Nécessaire si on utilise reviewdog

jobs:  
  quality-check:  
    name: Code Quality & Style  
    runs-on: ubuntu-latest  
    steps:  
      - name: Checkout Code  
        uses: actions/checkout@v4  
        with:  
          fetch-depth: 0 # Important pour la détection des fichiers modifiés

      - name: Setup Node & pnpm  
        uses: pnpm/action-setup@v4  
        with:  
          version: 9

      - name: Setup Node.js  
        uses: actions/setup-node@v4  
        with:  
          node-version: '20'  
          cache: 'pnpm'

      - name: Install Dependencies  
        run: pnpm install --frozen-lockfile

      - name: Restore ESLint Cache  
        uses: actions/cache@v4  
        with:  
          path:.eslintcache  
          key: ${{ runner.os }}-eslint-${{ hashFiles('pnpm-lock.yaml') }}-${{ hashFiles('**/*.[jt]s', '**/*.[jt]sx') }}  
          restore-keys: |  
            ${{ runner.os }}-eslint-${{ hashFiles('pnpm-lock.yaml') }}-

      - name: Type Check (TypeScript)  
        # ESLint ne vérifie pas tout. TSC est le filet de sécurité ultime.  
        # On n'émet pas de fichiers, on vérifie juste la validité des types Payload/Next.  
        run: pnpm exec tsc --noEmit

      - name: Prettier Check  
        # Pas de cache ici (voir section 4.2). Échec rapide si le formatage est incorrect.  
        run: pnpm exec prettier. --check

      - name: ESLint Check  
        # Exécution sur tout le projet avec cache pour la consistance.  
        # --max-warnings=0 assure le zéro tolérance.  
        run: pnpm exec eslint. --max-warnings=0 --cache --cache-location.eslintcache --format stylish
```
---

## **8. Conclusion**

L'expertise dans la configuration d'ESLint et Prettier pour Next.js 15 et Payload CMS 3.0 ne réside pas dans la complexité des règles, mais dans l'intelligence de l'architecture. En adoptant le format **Flat Config** malgré les défis de transition, en **séparant strictement** le formatage du linting, en utilisant des stratégies de **cache nuancées** (agressif pour ESLint, prudent pour Prettier), et en **sécurisant nativement** la détection des fichiers modifiés, on transforme une contrainte technique en un avantage compétitif. Ce pipeline n'est pas seulement "configuré" ; il est conçu pour l'échelle, la vélocité et la sécurité, répondant ainsi aux exigences les plus strictes d'un projet en production.

#### **Sources des citations**

1. Prettier vs ESLint: Choosing the Right Tool for Code Quality - Better Stack, consulté le novembre 27, 2025, [https://betterstack.com/community/guides/scaling-nodejs/prettier-vs-eslint/](https://betterstack.com/community/guides/scaling-nodejs/prettier-vs-eslint/)  
2. You Probably Don't Need eslint-config-prettier or eslint-plugin-prettier - Josh Goldberg, consulté le novembre 27, 2025, [https://www.joshuakgoldberg.com/blog/you-probably-dont-need-eslint-config-prettier-or-eslint-plugin-prettier/](https://www.joshuakgoldberg.com/blog/you-probably-dont-need-eslint-config-prettier-or-eslint-plugin-prettier/)  
3. What's the difference between prettier-eslint, eslint-plugin-prettier and eslint-config-prettier? - Stack Overflow, consulté le novembre 27, 2025, [https://stackoverflow.com/questions/44690308/whats-the-difference-between-prettier-eslint-eslint-plugin-prettier-and-eslint](https://stackoverflow.com/questions/44690308/whats-the-difference-between-prettier-eslint-eslint-plugin-prettier-and-eslint)  
4. ESLint plugin for Prettier formatting - GitHub, consulté le novembre 27, 2025, [https://github.com/prettier/eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)  
5. Configuration Files - ESLint - Pluggable JavaScript Linter, consulté le novembre 27, 2025, [https://eslint.org/docs/latest/use/configure/configuration-files](https://eslint.org/docs/latest/use/configure/configuration-files)  
6. Eslint flat config and new system an ultimate deep dive 2023 | by Mohamed Lamine Allal, consulté le novembre 27, 2025, [https://allalmohamedlamine.medium.com/eslint-flat-config-and-new-system-an-ultimate-deep-dive-2023-46aa151cbf2b](https://allalmohamedlamine.medium.com/eslint-flat-config-and-new-system-an-ultimate-deep-dive-2023-46aa151cbf2b)  
7. Evolving flat config with extends - ESLint - Pluggable JavaScript Linter, consulté le novembre 27, 2025, [https://eslint.org/blog/2025/03/flat-config-extends-define-config-global-ignores/](https://eslint.org/blog/2025/03/flat-config-extends-define-config-global-ignores/)  
8. Linting setup using ESLint 9 flat config - Next.js 15 Tutorial | chris.lu, consulté le novembre 27, 2025, [https://chris.lu/web_development/tutorials/next-js-static-first-mdx-starterkit/linting-setup-using-eslint](https://chris.lu/web_development/tutorials/next-js-static-first-mdx-starterkit/linting-setup-using-eslint)  
9. Fixing Next.js ESLint Errors with Flat Config in ESLint 9 | by Mohammad Noushad Siddiqi, consulté le novembre 27, 2025, [https://medium.com/@mdnoushadsiddiqi/fixing-next-js-eslint-errors-with-flat-config-in-eslint-9-f622d4570af0](https://medium.com/@mdnoushadsiddiqi/fixing-next-js-eslint-errors-with-flat-config-in-eslint-9-f622d4570af0)  
10. Proper eslint configuration under NextJS 15 - Stack Overflow, consulté le novembre 27, 2025, [https://stackoverflow.com/questions/79119287/proper-eslint-configuration-under-nextjs-15](https://stackoverflow.com/questions/79119287/proper-eslint-configuration-under-nextjs-15)  
11. Generating TypeScript Interfaces | Documentation - Payload CMS, consulté le novembre 27, 2025, [https://payloadcms.com/docs/typescript/generating-types](https://payloadcms.com/docs/typescript/generating-types)  
12. The Payload Config | Documentation, consulté le novembre 27, 2025, [https://payloadcms.com/docs/configuration/overview](https://payloadcms.com/docs/configuration/overview)  
13. NextJS, Payload, and TypeScript in a Single Express Server Boilerplate | Blog, consulté le novembre 27, 2025, [https://payloadcms.com/posts/blog/nextjs-payload-typescript-single-express-server-boilerplate](https://payloadcms.com/posts/blog/nextjs-payload-typescript-single-express-server-boilerplate)  
14. [cache issue] Prettier does not recheck files which used to be in .prettierignore #18016, consulté le novembre 27, 2025, [https://github.com/prettier/prettier/issues/18016](https://github.com/prettier/prettier/issues/18016)  
15. Setup Node.js environment · Actions · GitHub Marketplace, consulté le novembre 27, 2025, [https://github.com/marketplace/actions/setup-node-js-environment](https://github.com/marketplace/actions/setup-node-js-environment)  
16. actions/setup-node: Set up your GitHub Actions workflow with a specific version of node.js, consulté le novembre 27, 2025, [https://github.com/actions/setup-node](https://github.com/actions/setup-node)  
17. Content-based cache still checks modified times · Issue #17278 - GitHub, consulté le novembre 27, 2025, [https://github.com/prettier/prettier/issues/17278](https://github.com/prettier/prettier/issues/17278)  
18. Prettier's CLI: A Performance Deep Dive, consulté le novembre 27, 2025, [https://prettier.io/blog/2023/11/30/cli-deep-dive.html](https://prettier.io/blog/2023/11/30/cli-deep-dive.html)  
19. Dependency caching reference - GitHub Docs, consulté le novembre 27, 2025, [https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching)  
20. Cache · Actions · GitHub Marketplace, consulté le novembre 27, 2025, [https://github.com/marketplace/actions/cache](https://github.com/marketplace/actions/cache)  
21. Reconstructing the TJ Actions Changed Files GitHub Actions Compromise - Snyk, consulté le novembre 27, 2025, [https://snyk.io/blog/reconstructing-tj-actions-changed-files-github-actions-compromise/](https://snyk.io/blog/reconstructing-tj-actions-changed-files-github-actions-compromise/)  
22. Popular GitHub Action tj-actions/changed-files is compromised | Semgrep, consulté le novembre 27, 2025, [https://semgrep.dev/blog/2025/popular-github-action-tj-actionschanged-files-is-compromised/](https://semgrep.dev/blog/2025/popular-github-action-tj-actionschanged-files-is-compromised/)  
23. Enable eslint only for edited files - javascript - Stack Overflow, consulté le novembre 27, 2025, [https://stackoverflow.com/questions/54511168/enable-eslint-only-for-edited-files](https://stackoverflow.com/questions/54511168/enable-eslint-only-for-edited-files)  
24. Problem Matchers with GitHub Actions | Belated Blog, consulté le novembre 27, 2025, [https://christopher.xyz/2023/04/04/github-actions-problem-matchers.html](https://christopher.xyz/2023/04/04/github-actions-problem-matchers.html)  
25. configure reviewdog for eslint using github actions - Revath S Kumar, consulté le novembre 27, 2025, [https://blog.revathskumar.com/2022/10/github-configure-reviewdog-using-github-actions.html](https://blog.revathskumar.com/2022/10/github-configure-reviewdog-using-github-actions.html)