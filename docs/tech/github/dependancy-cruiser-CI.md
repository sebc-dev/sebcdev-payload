# **Gouvernance Architecturale et Intégrité Structurelle : Le Guide Définitif de Dependency Cruiser sous GitHub Actions**

## **Chapitre 1 : L'Impératif de la Validation Architecturale Continue**

L'érosion architecturale représente l'une des menaces les plus insidieuses pour la pérennité des systèmes logiciels modernes. Contrairement aux bugs fonctionnels qui se manifestent par des erreurs explicites, la dégradation structurelle est silencieuse. Elle s'accumule sous la forme de couplages non désirés, de cycles de dépendances et de violations des frontières modulaires, transformant progressivement un système flexible en un monolithe rigide et fragile. Dans le contexte du développement logiciel distribué, où plusieurs équipes contribuent à une base de code partagée, la simple discipline humaine ne suffit plus à garantir le respect des modèles architecturaux tels que la Clean Architecture, l'Architecture Hexagonale ou le Domain-Driven Design (DDD).  
Ce rapport technique propose une analyse exhaustive de l'implémentation de **Dependency Cruiser**, un outil de validation de dépendances de pointe, au sein d'un pipeline d'Intégration Continue (CI) GitHub Actions. L'objectif est de dépasser l'utilisation triviale de l'outil pour établir une véritable "Quality Gate" architecturale. Nous explorerons les mécanismes internes de l'analyse de graphes, les stratégies de configuration avancées pour des scénarios complexes, et les méthodologies d'optimisation nécessaires pour maintenir des temps de feedback courts dans des environnements à haute fréquence de déploiement.

### **1.1 La Nature du Problème : Entropie et Graphes de Dépendances**

Fondamentalement, tout projet logiciel peut être modélisé comme un graphe orienté $G = (V, E)$, où $V$ représente les modules (fichiers, paquets) et $E$ les relations de dépendance (imports, require). Une architecture saine se caractérise souvent par un Graphe Acyclique Dirigé (DAG). L'introduction de cycles ($A \rightarrow B \rightarrow A$) crée des Composantes Fortement Connexes (SCC) qui empêchent l'isolation des modules, rendant les tests unitaires difficiles et le "tree-shaking" inefficace.  
Les outils de linter traditionnels (ESLint) analysent le code via un Arbre Syntaxique Abstrait (AST) limité à la portée d'un seul fichier. Ils sont aveugles aux effets de bord topologiques. Dependency Cruiser comble cette lacune en construisant le modèle complet du graphe de dépendances du projet, permettant d'appliquer des prédicats logiques sur les relations entre les nœuds plutôt que sur la syntaxe interne des nœuds eux-mêmes.

### **1.2 Pourquoi Dependency Cruiser dans GitHub Actions?**

L'intégration dans GitHub Actions ne doit pas être vue comme une simple tâche d'automatisation, mais comme l'application du principe de "Shift-Left" à l'architecture. En déplaçant la validation structurelle du tableau blanc vers le pipeline de Pull Request (PR), on transforme des règles implicites ("le domaine ne doit pas importer l'infrastructure") en contraintes explicites et bloquantes.  
L'analyse comparative des solutions disponibles met en évidence la supériorité de Dependency Cruiser pour cet usage spécifique :

| Critère d'Évaluation    | Dependency Cruiser                   | ESLint (plugin-import) | Madge             | Nx / Turbo (Graph)  |
| :---------------------- | :----------------------------------- | :--------------------- | :---------------- | :------------------ |
| **Portée d'Analyse**    | Graphe Global                        | Fichier Local          | Graphe Global     | Limites de Paquets  |
| **Granularité**         | Fichier / Dossier / Module           | Fichier                | Fichier           | Projet / Lib        |
| **Langage de Règles**   | JSON/JS (Regex complet)              | Règles statiques       | Pas de validation | tags (scope:domain) |
| **Détection de Cycles** | Configurable (Sévérité)              | Faible / Inexistant    | Visualisation     | Oui (Paquets)       |
| **Support CI**          | Codes de sortie, JUnit, Markdown     | Natif                  | Basique           | Natif               |
| **Performance**         | Mécanisme de Cache & Parallélisation | Rapide (Incremental)   | Moyen             | Très Rapide         |

## L'analyse suggère que pour un projet de PRD complexe, seul Dependency Cruiser offre la granularité nécessaire pour valider les règles intra-paquet et inter-modules avec une précision chirurgicale.

## **Chapitre 2 : Architecture de Configuration et Règles Sémantiques**

La puissance de Dependency Cruiser réside entièrement dans sa configuration. Une configuration par défaut est un bon point de départ, mais elle est insuffisante pour un projet à ambition industrielle. Pour devenir un expert, il faut maîtriser la création de règles sémantiques qui traduisent les intentions architecturales en expressions régulières et en contraintes logiques.

### **2.1 Initialisation et Structure du Fichier de Configuration**

Il est impératif d'utiliser le format JavaScript (.dependency-cruiser.js) plutôt que JSON. Cela permet l'utilisation de commentaires, de variables dynamiques et de logique conditionnelle, essentiels pour maintenir une configuration complexe lisible.  
Le fichier exporte un objet contenant deux clés principales : forbidden (les règles d'interdiction) et options (le comportement du moteur). Une troisième clé, allowed, existe pour une approche en liste blanche ("allow-list"), mais l'expérience montre que cette approche est trop rigide pour la plupart des projets agiles. L'approche "interdire les mauvais modèles" (forbidden) est généralement plus maintenable.

### **2.2 Anatomie d'une Règle Avancée**

Une règle dans Dependency Cruiser est composée d'un nom, d'une sévérité, d'un commentaire explicatif, et de deux clauses de filtrage : from (source) et to (cible).  
L'expertise se révèle dans l'utilisation des capacités avancées de filtrage :

- **path** : Regex standard sur le chemin du fichier.
- **pathNot** : Exclusion par Regex.
- **dependencyTypes** : Permet de cibler spécifiquement les npm-dev (devDependencies), local, ou core (modules Node.js).
- **via** : Permet de détecter les dépendances transitives, crucial pour interdire non seulement l'import direct, mais aussi l'import indirect à travers une chaîne de modules.

#### **Cas d'Étude : Isolation du Cœur de Métier (Domain Layer)**

Dans une architecture hexagonale, le domaine ne doit dépendre de rien d'autre que de lui-même. Il ne doit pas importer de librairies tierces (sauf utilitaires purs comme Lodash/Ramda) ni de couches d'infrastructure.

```javascript
//.dependency-cruiser.js - Configuration Expert
module.exports = {
  forbidden: {
    name: 'domain-no-framework-coupling',
    severity: 'error',
    comment:
      'Le Domaine doit rester agnostique du framework (pas de React, Angular, NestJS dans le domaine).',
    from: { path: '^src/domain' },
    to: {
      path: 'node_modules',
      // Regex capturant les frameworks courants
      path: '(react|angular|vue|nestjs|express|fastify)',
    },
  },
}
```

Cette configuration illustre une compréhension nuancée : on n'interdit pas _tous_ les node_modules (car le domaine peut avoir besoin de zod ou decimal.js), mais on cible spécifiquement les frameworks qui coupleraient le métier à une technologie d'implémentation.

### **2.3 Gestion des Dépendances Circulaires : Au-delà du Binaire**

La détection de cycles est souvent binaire : il y en a ou il n'y en a pas. Cependant, dans un projet réel, certains cycles sont plus tolérables que d'autres. Dependency Cruiser permet une finesse de configuration.

1. Cycles de Runtime vs Cycles de Type (TypeScript) :  
   En TypeScript, deux fichiers peuvent s'importer mutuellement uniquement pour des définitions de types (interface, type). Cela ne cause pas de problème d'exécution car ces imports disparaissent à la compilation.  
   Optimisation : Configurer la règle pour ignorer les imports type-only. Cela réduit le bruit et se concentre sur les vrais problèmes architecturaux.

```javascript
 {
   name: 'no-circular',
   severity: 'error',
   from: {},
   to: {
     circular: true,
     // Ignore les cycles qui ne sont QUE des types
     dependencyTypesNot: ['type-only']
   }
 }
```

2. Cycles dans les Tests :  
   Il est fréquent qu'un fichier de test importe le module testé, et que le module testé importe (accidentellement ou non) un utilitaire utilisé aussi par le test. Bien que ce soit un code smell, bloquer la CI pour cela peut être contre-productif au début. On peut exclure les fichiers \*.spec.ts de la règle de circularité stricte.

---

## **Chapitre 3 : Intégration dans GitHub Actions - Le Pipeline Optimal**

L'intégration technique dans GitHub Actions nécessite une attention particulière à la performance, à la gestion des erreurs et à la restitution de l'information. Un simple run: npx depcruise est insuffisant pour un environnement de production.

### **3.1 Définition du Workflow YAML**

Le fichier de workflow suivant représente l'état de l'art pour une intégration robuste. Il inclut la gestion du cache, la séparation des préoccupations (validation vs reporting) et la gestion des échecs.

```yaml
name: 'Architecture & Quality Gate'

on:
  pull_request:
    branches: ['main', 'develop']
    paths:
      - 'src/**'
      - 'package.json'
      - 'package-lock.json'
      - '.dependency-cruiser.js'
  push:
    branches: ['main']

permissions:
  contents: read
  pull-requests: write # Nécessaire pour commenter sur la PR

jobs:
  architectural-validation:
    name: 'Dependency Graph Validation'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      # Optimisation 1 : Cache NPM et Node Setup
      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      # Optimisation 2 : Installation Rapide
      # 'npm ci' est strictement déterministe, essentiel pour la reproductibilité du graphe.
      - name: Install Dependencies
        run: npm ci --prefer-offline --no-audit

      # Optimisation 3 : Compilation Typescript (Conditionnelle)
      # Dependency Cruiser utilise tsc pour résoudre les imports. Si les fichiers JS
      # ne sont pas émis, l'étape de build explicite n'est pas toujours requise,
      # mais 'tsc --noEmit' peut préchauffer le cache TS.
      - name: Type Check (Pre-requisite)
        run: npx tsc --noEmit

      # Cœur du système : Validation avec Baseline
      - name: Run Dependency Cruiser
        id: depcruise
        continue-on-error: true # On capture l'erreur pour un traitement personnalisé
        run: |
          npx depcruise src \  
            --config.dependency-cruiser.js \  
            --known-violations.dependency-cruiser-known-violations.json \  
            --output-type json \  
            --output-to depcruise-report.json

      # Génération d'un résumé lisible pour la console
      - name: Display Text Summary
        if: steps.depcruise.outcome == 'failure'
        run: |
          npx depcruise-fmt depcruise-report.json --output-type text

      # Intégration Expert : Injection dans le GitHub Summary
      - name: Create Job Summary
        run: |
          echo "## 🏗️ Rapport d'Architecture" >> $GITHUB_STEP_SUMMARY  
          echo "" >> $GITHUB_STEP_SUMMARY  
          npx depcruise-fmt depcruise-report.json --output-type markdown >> $GITHUB_STEP_SUMMARY

      # Gestion explicite de l'échec
      - name: Check for Failure
        if: steps.depcruise.outcome == 'failure'
        run: exit 1
```

### **3.2 Analyse des Composants du Workflow**

#### **La Stratégie d'Installation (npm ci)**

L'utilisation de npm ci est critique. Dependency Cruiser résout les dépendances en se basant sur ce qui est présent dans node_modules et sur la configuration TypeScript. Une divergence de version mineure dans une librairie tierce (autorisée par npm install mais verrouillée par npm ci) pourrait théoriquement changer la résolution des modules si des exports conditionnels sont utilisés, bien que l'impact soit surtout sur la reproductibilité et la vitesse.

#### **Le Flag --known-violations (La Baseline)**

L'introduction de règles architecturales strictes sur un projet existant ("Brownfield project") génère inévitablement des milliers d'erreurs. Bloquer la PR immédiatement paralyse l'équipe. La fonctionnalité de baseline est la clé de voûte de l'adoption.

1. On génère un cliché des erreurs actuelles : npx depcruise src --output-type json >.dependency-cruiser-known-violations.json.
2. On passe ce fichier à la commande de validation.
3. Le système passe au vert tant que _nouvelles_ violations ne sont pas ajoutées. Les anciennes sont ignorées silencieusement.
4. Cela permet de "geler" la dette technique et de la rembourser progressivement, sans empêcher le développement de nouvelles fonctionnalités.

---

## **Chapitre 4 : Optimisations de Performance et Passage à l'Échelle**

Sur des projets de grande taille (Monorepo, > 10 000 fichiers), l'analyse de dépendances peut devenir un goulot d'étranglement dans la CI, prenant plusieurs minutes. Pour un expert, optimiser ce temps d'exécution est une priorité.

### **4.1 Réglage fin du moteur de résolution TypeScript**

Dependency Cruiser délègue la résolution des modules TypeScript au compilateur TS lui-même (ou une version allégée).

- **Problème :** Par défaut, pour supporter les "Path Aliases" (ex: @domain/user), l'outil doit charger la config TS. Si tsPreCompilationDeps est activé (vrai par défaut pour la précision), l'analyse est lente.
- **Optimisation :** Si le projet n'utilise pas de syntaxe exotique nécessitant une pré-compilation complète, on peut désactiver cette option ou utiliser swc (Speedy Web Compiler) si compatible avec les plugins futurs.
- **Configuration :**
  ```javascript
  options: {
    tsPreCompilationDeps: false, // Gain de performance majeur, risque mineur de faux négatifs sur imports dynamiques
    tsConfig: {
      fileName: './tsconfig.json'
    }
  }
  ```

### **4.2 Exclusion Stratégique (doNotFollow vs exclude)**

Il est crucial de comprendre la distinction entre exclude (ne pas scanner le fichier du tout) et doNotFollow (scanner le fichier, l'ajouter au graphe, mais ne pas analyser ses propres dépendances).

- **Bonne Pratique :** Pour les node_modules, on utilise toujours doNotFollow. On veut savoir que notre code importe react, mais on se fiche de savoir ce que react importe.
- **Piège à Éviter :** Exclure trop agressivement dist ou build via .gitignore ne suffit pas toujours si l'outil est configuré pour suivre les fichiers ignorés par git. Il faut configurer explicitement exclude dans .dependency-cruiser.js pour éviter de scanner les artefacts de build générés, ce qui doublerait le temps d'analyse et créerait des faux positifs.

### **4.3 Stratégies pour Monorepos (Nx, Turbo, Lerna)**

Dans un contexte de monorepo, scanner l'intégralité du dépôt à chaque changement d'un seul paquet est inefficace.  
Approche "Sharding" avec Nx :  
Si vous utilisez Nx, vous pouvez définir une cible depcruise dans chaque project.json.

```json
// project.json (libs/my-lib)
"targets": {
  "depcruise": {
    "executor": "nx:run-commands",
    "options": {
      "command": "npx depcruise src --config../../.dependency-cruiser.js"
    }
  }
}
```

## Ensuite, dans GitHub Actions, utilisez nx affected --target=depcruise. Nx ne lancera l'analyse que pour les projets modifiés par la PR et leurs dépendants. C'est l'optimisation ultime pour les grands projets, réduisant le temps de CI de linéaire (taille totale) à logarithmique (taille du changement).

## **Chapitre 5 : Visualisation Avancée et Rapports Décisionnels**

Un rapport textuel d'erreur est utile pour le développeur qui a cassé le build, mais il est inutile pour l'architecte qui veut comprendre la structure. L'intégration optimale dans GitHub Actions inclut la génération d'artefacts visuels.

### **5.1 Génération de Graphes SVG Ciblés**

Générer un graphe complet (dependency-graph.svg) sur un gros projet produit souvent une image illisible ("Spaghetti code"). Pour être expert, il faut générer des vues en coupe.  
**Snippet pour GitHub Actions (Graphes thématiques) :**

```yaml
      - name: Generate High-Level Architecture Graph
        run: |
          # On ne garde que les dossiers de premier niveau pour une vue d'ensemble (High Level Design)
          npx depcruise src \
            --include-only "^src/[^/]+$" \
            --collapse "^src/[^/]+" \
            --output-type dot \

| dot -T svg > architecture-high-level.svg
```

L'utilisation de --collapse est une technique puissante. Elle regroupe tous les fichiers d'un dossier en une seule boîte. Cela permet de visualiser les dépendances entre _modules_ (Domain -> Infra) plutôt qu'entre fichiers, rendant le diagramme immédiatement compréhensible pour les parties prenantes non techniques.

### **5.2 Intégration de Mermaid.js dans les Pull Requests**

GitHub supporte le rendu des diagrammes Mermaid.js nativement dans les fichiers Markdown. Dependency Cruiser possède un reporter expérimental ou via plugin pour sortir du Mermaid.  
**Workflow pour Commentaire PR :**

1. Générer le graphe des fichiers touchés par la PR.
2. Le convertir en syntaxe Mermaid.
3. Poster un commentaire sur la PR avec le bloc code.

```
// Script personnalisé 'scripts/pr-graph.js' pour générer du Mermaid ciblé
const { cruise } = require('dependency-cruiser');
const { execSync } = require('child_process');

// Récupérer les fichiers modifiés via git
const changedFiles = execSync('git diff --name-only origin/main...HEAD').toString().split('\n').filter(f => f.startsWith('src/'));

if (changedFiles.length > 0) {
  const result = cruise(changedFiles, {
    // Options de focus pour voir le contexte immédiat des changements
    focus: true,
    maxDepth: 1
  });
  // Conversion JSON result -> Mermaid syntax (simplifiée)
  //... logique de conversion...
  console.log(mermaidOutput);
}
```

## Cette approche contextuelle fournit une "preuve visuelle" de l'impact des changements directement dans la conversation de la PR, facilitant la revue de code.

## **Chapitre 6 : Pièges à Éviter et Bonnes Pratiques de Terrain**

L'expérience démontre que l'échec de l'adoption de Dependency Cruiser vient rarement de la technologie, mais de sa mauvaise application.

### **6.1 Le Piège des "Barrel Files" (Index.ts)**

Un anti-pattern courant en TypeScript est l'abus des fichiers index.ts qui ré-exportent tout le contenu d'un dossier.

- **Le Problème :** Si le module A importe Shared/index.ts pour utiliser Util1, et que Shared/index.ts exporte aussi Util2 qui dépend d'une grosse librairie, Dependency Cruiser peut voir une dépendance de A vers cette grosse librairie (transitivement), même si Util1 est pur. Cela crée des cycles artificiels et alourdit le graphe.
- **La Solution Expert :** Configurer Dependency Cruiser pour analyser les "Re-exports" intelligemment, mais surtout, éduquer l'équipe à éviter les imports massifs. Une règle peut être configurée pour interdire l'import de index.ts si on se trouve dans le même module parent ("Intra-module direct imports preferred").

### **6.2 La Gestion des Alias (Paths)**

Les alias (@/components/...) simplifient les imports mais peuvent masquer la structure réelle des dossiers.

- **Bonne Pratique :** Dependency Cruiser résout les alias via tsconfig.json. Assurez-vous que la configuration CI pointe vers le bon fichier tsconfig. Si vous avez un tsconfig.app.json et un tsconfig.spec.json, créez un tsconfig.depcruise.json unifié qui englobe tout pour l'analyse, sinon vous aurez des erreurs de résolution ("module not found") silencieuses ou bloquantes.

### **6.3 Faux sentiment de sécurité avec les dynamic imports**

## Les imports dynamiques (await import('./module')) sont souvent utilisés pour le Code Splitting. Dependency Cruiser les détecte, mais il est important de vérifier la configuration moduleSystems. Assurez-vous que es6, cjs et amd (si applicable) sont activés pour ne rien rater.

## **Chapitre 7 : Étendre les Capacités - Scripting et Plugins**

Pour devenir un véritable expert, il faut savoir quand la configuration déclarative atteint ses limites. Dependency Cruiser expose une API JavaScript complète.

### **7.1 Validation de Licences en Profondeur**

Outre l'architecture, le PRD peut imposer des contraintes légales. Dependency Cruiser peut scanner les package.json des dépendances.

- **Cas d'usage :** Interdire strictement les licences virales (GPL) dans le code qui sera distribué.
- **Implémentation :**
  ```javascript
  {
    name: 'license-check',
    severity: 'error',
    from: {},
    to: {
      licenseNot: "MIT|ISC|Apache-2.0",
      // Exclure les devDependencies car elles ne sont pas shippées
      dependencyTypesNot: ["npm-dev"]
    }
  }
  ```
  Cette règle transforme votre outil d'architecture en outil de conformité légale automatisée.

### **7.2 Métriques Personnalisées et Tableaux de Bord**

En utilisant l'option --output-type json, on peut extraire des métriques brutes : nombre de modules, densité du graphe, nombre de cycles, coefficient d'instabilité (I).  
Un script post-traitement dans GitHub Actions peut parser ce JSON et envoyer ces métriques à un système de monitoring (Datadog, SonarQube via API générique).  
Cela permet de tracer des courbes de tendance : "La modularité du projet s'améliore-t-elle ou se dégrade-t-elle au fil des sprints?" C'est un argument puissant pour les leads techniques lors des négociations de budget de refactoring.

---

## **Conclusion et Synthèse**

Configurer Dependency Cruiser de manière optimale pour le projet de ce PRD dans GitHub Actions est un exercice qui dépasse la simple syntaxe YAML. C'est une démarche structurante qui définit les règles du jeu pour l'équipe de développement.  
En résumé, l'approche experte repose sur quatre piliers :

1. **Précision Sémantique :** Des règles qui reflètent l'architecture métier (Domain, Infra, UI) et non juste la structure de fichiers.
2. **Pragmatisme de la Baseline :** L'utilisation de --known-violations pour gérer la dette technique sans bloquer le flux de valeur.
3. **Visibilité :** La génération de graphes ciblés et de résumés Markdown directement dans l'interface GitHub pour fermer la boucle de feedback.
4. **Performance :** L'utilisation stratégique de npm ci, du cache, et des exclusions pour maintenir une CI rapide.

En implémentant ces recommandations, vous transformez un simple outil d'analyse statique en un gardien infatigable de l'intégrité architecturale, garantissant que le logiciel livré correspond réellement à la vision conçue, commit après commit.
