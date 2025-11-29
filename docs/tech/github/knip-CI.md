# **Stratégies Avancées d'Analyse Statique et Optimisation CI/CD pour Architectures Next.js 15, Payload 3.0 et Monorepo**

## **Introduction et Contexte Architectural**

L'évolution des architectures web modernes vers des systèmes modulaires et distribués a considérablement accru la complexité de la gestion du cycle de vie logiciel. Dans ce contexte, l'adoption d'une stack technologique composée de **Next.js 15**, **Payload CMS 3.0**, orchestrée au sein d'un **Monorepo**, représente l'état de l'art du développement "Full Stack" en 2024 et 2025. Cependant, cette sophistication architecturale introduit une dette technique invisible : l'accumulation de code mort, de dépendances orphelines et d'exports inutilisés. Contrairement aux applications monolithiques traditionnelles où les points d'entrée sont statiques et bien définis, les frameworks modernes reposent massivement sur des conventions de nommage, des importations dynamiques et des mécanismes de "Tree-Shaking" au moment du build qui échappent souvent aux linters classiques.  
L'outil **Knip** s'est imposé comme la solution de référence pour répondre à ces problématiques d'analyse de graphe de dépendance.1 Cependant, son intégration "naïve" dans un écosystème aussi complexe que celui décrit (Next.js 15 + Payload 3.0) mène invariablement à des résultats frustrants : faux positifs massifs, temps d'exécution prohibitifs en CI, ou pire, suppression accidentelle de code critique nécessaire à la production. Ce rapport a pour vocation de déconstruire les mécanismes de Knip pour les aligner parfaitement avec les paradigmes de Next.js (App Router, Server Actions) et Payload (Config-based CMS), tout en fournissant une stratégie d'intégration GitHub Actions digne des standards de l'ingénierie DevOps avancée.  
Nous explorerons en profondeur comment transformer Knip d'un simple linter en un gardien de l'intégrité architecturale, capable de valider non seulement la propreté du code, mais aussi la cohérence des frontières entre les workspaces du monorepo et la validité des configurations de déploiement.

## **Fondamentaux de l'Analyse Statique dans un Contexte Monorepo**

L'analyse statique dans un monorepo ne peut être traitée comme la simple juxtaposition de plusieurs analyses de dépôts individuels. La dynamique des dépendances croisées, le partage de code via des alias de chemin (path aliases) et l'utilisation de gestionnaires de paquets modernes (pnpm, yarn workspaces, turborepo) imposent une configuration réfléchie.

### **La Topologie du Graphe de Dépendances**

Knip fonctionne en construisant un graphe complet des modules de votre projet. Il part d'un ensemble de fichiers d'entrée ("entry files") et suit récursivement toutes les instructions import, require et export pour déterminer quels fichiers sont atteignables et utilisés.1 Dans un monorepo, ce graphe traverse les frontières physiques des dossiers.  
Une erreur fondamentale consiste à laisser Knip deviner la structure. Bien que l'outil lise la propriété workspaces du package.json racine pour identifier les paquets membres 2, la résolution des modules entre ces workspaces est souvent source de friction. Si votre application Next.js (disons apps/web) importe un composant d'une librairie interne (packages/ui) via un alias défini dans tsconfig.json (par exemple @org/ui), Knip doit être capable de mapper cet alias vers le système de fichiers réel.  
L'analyse révèle que Knip optimise l'analyse en partageant les fichiers de plusieurs workspaces dans un programme TypeScript unique lorsque cela est possible.1 Cette approche, bien que performante, exige une synchronisation parfaite entre la configuration de Knip et celle de TypeScript.

### **Configuration des Workspaces et Isolation**

La structure de configuration de Knip dans un monorepo doit refléter la hiérarchie du projet tout en respectant la contrainte technique de l'outil qui ne supporte pas l'imbrication des configurations dans le fichier JSON lui-même.4  
Stratégie de définition optimale :  
Il est impératif de définir chaque workspace explicitement dans le knip.json racine. Cela permet une gestion centralisée des règles tout en autorisant des exceptions locales.

| Type de Workspace       | Rôle Architectural     | Stratégie Knip Recommandée                                                                               |
| :---------------------- | :--------------------- | :------------------------------------------------------------------------------------------------------- |
| **Application Next.js** | Consommateur final     | Mode Strict, focus sur les dependencies de production. Points d'entrée multiples (pages, API).           |
| **Payload CMS**         | Application/Backend    | Points d'entrée spécifiques (payload.config.ts). Gestion des types générés.                              |
| **Librairie UI/Shared** | Fournisseur de modules | includeEntryExports: true. Les exports sont publics par défaut, même si non utilisés par l'app actuelle. |
| **Tooling/Scripts**     | Utilitaire             | Souvent exclu du build de prod, mais inclus dans l'analyse de maintenance.                               |

Pour une isolation stricte, l'utilisation du drapeau --strict ou de la configuration "strict": true par workspace garantit que chaque paquet déclare bien ses propres dépendances et n'utilise pas celles hissées à la racine ("phantom dependencies").5 C'est crucial pour garantir que l'application Next.js fonctionnera une fois construite et isolée dans un conteneur Docker, par exemple.

### **Gestion des Alias de Chemin (Path Aliases)**

Les monorepos utilisent abondamment les alias pour simplifier les imports (ex: import Button from '@ui/Button' au lieu de ../../../packages/ui/src/Button). Knip tente de lire la propriété compilerOptions.paths du tsconfig.json, mais dans des configurations complexes (extends multiples, solution-style tsconfig), cette détection peut échouer.4  
Si Knip signale des "Unresolved imports" pour vos paquets internes, vous devez forcer la résolution via la propriété paths dans knip.json :

```json
{
  "workspaces": {
    "apps/web": {
      "paths": {
        "@ui/*": ["../../packages/ui/src/*"],
        "@utils/*": ["../../packages/utils/src/*"]
      }
    }
  }
}
```

_Notez que les chemins sont relatifs à la racine du workspace configuré, pas à la racine du monorepo._

## **Configuration Expert pour Next.js 15 (App Router)**

Next.js 15, avec son architecture App Router, repose sur une inversion de contrôle : ce n'est pas votre code qui appelle le framework, mais le framework qui appelle votre code via des fichiers aux noms conventionnels (page.tsx, layout.tsx, route.ts). Pour un analyseur statique, ces fichiers apparaissent comme des feuilles mortes dans l'arbre de dépendance, car aucun autre fichier de votre projet ne les importe explicitement.

### **Les Points d'Entrée Implicites**

Le plugin Next.js de Knip est conçu pour comprendre ces conventions.8 Cependant, avec l'introduction constante de nouvelles fonctionnalités dans Next.js 15 (comme les fichiers d'instrumentation ou les middlewares avancés), la configuration par défaut peut nécessiter des ajustements.  
L'analyse des snippets 8 permet d'identifier la liste critique des fichiers à protéger de l'élimination :

1. **Routes UI & API :** app/\*\*/{page,layout,loading,error,not-found,template,default,route}.{tsx,ts,jsx,js}.
2. **Configuration & Métadonnées :** next.config.{js,ts,mjs}, middleware.{js,ts}, app/robots.{ts,js}, app/sitemap.{ts,js}, app/manifest.{ts,js}.
3. **Observabilité (Crucial pour Next.js 15) :** instrumentation.{js,ts}. Ce fichier est souvent oublié par les configurations par défaut si sa localisation (racine vs src/) n'est pas standard.

**Optimisation :** Si votre projet utilise le dossier src/, assurez-vous que le plugin Next.js est configuré pour regarder dans src/ et non à la racine. Bien que le plugin tente de le détecter, l'expliciter évite des ambiguïtés.

```
"next": {
  "entry": [
    "next.config.{js,ts,mjs}",
    "src/app/**/*.{js,jsx,ts,tsx}",
    "src/instrumentation.ts",
    "src/middleware.ts"
  ]
}
```

### **Le Défi des Server Actions et des Exports de Configuration**

Next.js 15 permet d'exporter des configurations de route (export const dynamic = 'force-dynamic', export const revalidate = 3600) depuis les fichiers de page.10 Ces constantes sont consommées par le build system de Next.js. Si Knip n'est pas conscient de ce contexte, il marquera ces exports comme "Unused exports".  
Le plugin Next.js gère nativement ces exports spécifiques (metadata, generateMetadata, dynamic, revalidate, viewport).8 Cependant, si vous créez des abstractions (par exemple, un Higher-Order Component ou une fonction utilitaire qui génère ces configurations), Knip pourrait perdre la trace de l'utilisation.  
Bonne pratique : Gardez les exports de configuration Next.js le plus près possible du fichier page.tsx ou layout.tsx. Évitez de les ré-exporter à travers plusieurs couches de fichiers barils (barrel files), ce qui complique l'analyse et le tree-shaking.

### **"Unused Files" et le Dossier Public**

Les fichiers référencés uniquement dans le code JSX via des chaînes de caractères (ex: <Image src="/logo.png" />) échappent à l'analyse statique JavaScript. Bien que Knip se concentre sur le code, il peut signaler des scripts JS présents dans le dossier public s'ils sont considérés comme faisant partie du projet. Il est recommandé d'exclure totalement le dossier public de l'analyse project pour éviter ces faux positifs, car ces fichiers sont servis statiquement.

## **Intégration Profonde de Payload CMS 3.0**

Payload 3.0 révolutionne son architecture en s'intégrant nativement dans Next.js, supprimant la nécessité d'un serveur Node.js séparé.11 Cette fusion simplifie le déploiement mais entremêle le code "Backend CMS" avec le code "Frontend App".

### **Configuration du Noyau Payload**

Le point névralgique est le fichier payload.config.ts.13 Ce fichier est le point d'entrée absolu de toute la logique CMS. S'il n'est pas marqué comme entry, Knip considérera que toutes vos collections, tous vos hooks et toute votre logique d'accès sont inutilisés.  
Contrairement à Next.js, il n'existe pas de plugin Knip officiel standardisé pour Payload 3.0 documenté dans les snippets fournis, bien que des initiatives communautaires existent. Il faut donc configurer manuellement les entrées.  
**Points d'entrée critiques pour Payload :**

- payload.config.ts (Racine ou src/)
- src/payload.config.ts
- Les fichiers de composants Admin personnalisés s'ils sont importés dynamiquement (bien que Payload 3 favorise les imports statiques).

### **Gestion des Collections et Globals**

Les définitions de collections (ex: src/collections/Media.ts) sont importées dans le tableau collections de la configuration.
Piège à éviter : L'utilisation de scanners de système de fichiers pour charger les collections (ex: fs.readdirSync('./collections')). Cette technique, populaire dans les anciens projets Express, rend les dépendances invisibles pour Knip.  
Recommandation Expert : Utilisez toujours des imports statiques explicites dans payload.config.ts.

```
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'

export default buildConfig({
  collections: [Media, Pages], // Knip peut tracer ces références
  //...
})
```

Cela permet non seulement à Knip de fonctionner, mais optimise aussi le bundling avec Turbopack/Webpack inclus dans Next.js.

### **Types Générés et Fichiers Virtuels**

Payload génère automatiquement des interfaces TypeScript (souvent payload-types.ts) basées sur votre schéma.14 Ce fichier est crucial pour le typage dans l'application Next.js.  
Si ce fichier est généré dans un dossier ignoré (comme .next ou un dossier temp), Knip ne le verra pas, mais verra les imports qui y font référence, causant des erreurs "Unresolved import".  
Si ce fichier est dans src/ (recommandé), Knip le verra. Cependant, comme il est auto-généré, il peut contenir des types exportés mais jamais utilisés.  
Stratégie : Ajoutez le fichier de types générés à ignoreExportsUsedInFile ou excluez-le de l'analyse project si vous ne voulez pas nettoyer manuellement un fichier auto-généré.

```
{
  "ignore": ["src/payload-types.ts"]
}
```

## **Drizzle ORM et la Gestion de la Base de Données**

Dans l'architecture spécifiée, Drizzle ORM sert de pont vers la base de données. L'interaction entre Knip et Drizzle se cristallise autour de trois axes : la configuration, le schéma et les migrations.

### **Le Plugin Drizzle et la Configuration**

Knip détecte automatiquement drizzle-kit et active son plugin.15 Ce plugin marque drizzle.config.ts comme point d'entrée.16 C'est essentiel, car ce fichier référence l'emplacement de votre schéma.

### **Le Dilemme des Migrations**

Les fichiers de migration (générés par drizzle-kit generate) posent un problème conceptuel à l'analyse statique. Ce sont des fichiers SQL ou TS qui s'accumulent dans un dossier (ex: /drizzle), qui ne sont jamais importés par le code applicatif, mais qui sont critiques pour l'intégrité de la DB.
Knip, par défaut, les verra comme du code mort ("Unused files").  
Solution Optimale :  
Il faut exclure le dossier de migrations de l'analyse projet, tout en s'assurant que les scripts de migration (le code qui exécute les migrations) sont bien analysés.

```json
{
  "drizzle": {
    "config": ["drizzle.config.ts"]
  },
  "exclude": ["drizzle/migrations/**", "drizzle/meta/**"]
}
```

Si vous utilisez des migrations en TypeScript (pour les "Custom Migrations" supportées par Drizzle), vous pourriez vouloir les analyser. Dans ce cas, il faut les ajouter explicitement comme entry dans knip.json.

### **Cloudflare Workers et Edge Compatibility (Contexte Next.js 15)**

Bien que le prompt mentionne Next.js et Payload, l'utilisation de Drizzle suggère souvent une compatibilité avec des environnements Edge ou Serverless (comme Cloudflare D1 ou Neon).20 Si votre projet déploie des parties de l'application sur Cloudflare Workers (par exemple via un middleware séparé ou une API distincte dans le monorepo), la configuration des entrées change.  
Les Workers utilisent souvent un wrangler.toml ou wrangler.jsonc. Knip possède un plugin wrangler (non explicitement détaillé dans les snippets mais inférable via la liste des plugins 22). Si ce n'est pas le cas, assurez-vous que le point d'entrée défini dans wrangler.toml (généralement src/index.ts) est bien listé dans les entry de Knip.

## **Stratégie d'Intégration CI/CD (GitHub Actions)**

L'automatisation de Knip dans GitHub Actions est le levier qui transforme la théorie en pratique. Une exécution mal configurée ralentira les Pull Requests et sera désactivée par les développeurs frustrés. Une configuration optimale est rapide, précise et informative.

### **Workflow de Référence**

Le workflow doit être déclenché sur les pull_request et sur les pushs vers la branche principale (main).

```yaml
name: Code Health Analysis
on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  knip:
    name: Knip Analysis
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm' # Utilisation critique du cache pnpm

      - name: Install Dependencies
        run: pnpm install --frozen-lockfile

      - name: Restore Knip Cache
        uses: actions/cache@v4
        with:
          path: node_modules/.cache/knip
          key: knip-${{ runner.os }}-${{ hashFiles('**/pnpm-lock.yaml') }}-${{ github.sha }}
          restore-keys: |
            knip-${{ runner.os }}-${{ hashFiles('**/pnpm-lock.yaml') }}-

      - name: Run Knip Analysis
        id: knip-run
        run: pnpm knip --production --reporter json > knip-report.json
        continue-on-error: true

      - name: Annotate PR
        if: github.event_name == 'pull_request'
        uses: knip-reporter/action@v1 # Exemple théorique basé sur [26]/[26]
        with:
          report-json: knip-report.json
          token: ${{ secrets.GITHUB_TOKEN }}
```

### **Optimisation par le Caching**

Knip effectue un travail intensif d'analyse AST. Il dispose d'un cache interne (--cache).23 Pour que ce cache soit utile en CI (où les conteneurs sont éphémères), il doit être sauvegardé et restauré par actions/cache.25  
La clé de cache doit inclure le hash du lockfile (car si les dépendances changent, le graphe change) et idéalement un fallback sur les runs précédents.

### **Reporter : Visibilité et Actionnabilité**

L'affichage des résultats est crucial. Un log de 5000 lignes dans la console CI est inutile.  
L'intégration d'un reporter qui commente la PR est la meilleure pratique.

- **Knip Reporter Action :** Utilise l'API GitHub pour poster un résumé formaté (Tableau des fichiers inutilisés, exports morts).
- **Annotations GitHub :** Knip peut générer des annotations qui apparaissent directement dans l'onglet "Files changed" de la PR, soulignant le code mort en rouge.

### **Mode Production vs Mode Complet en CI**

Le rapport souligne l'importance du mode --production.

- **Pourquoi l'utiliser en CI?** Il ignore les fichiers de test, les stories storybook, et les devDependencies. Cela réduit drastiquement le temps d'analyse et se concentre sur ce qui impacte le bundle final.
- **Le compromis :** Si vous utilisez ce mode, le code mort dans vos tests ne sera pas détecté. Une stratégie hybride consiste à lancer --production sur les PRs (pour la vélocité) et une analyse complète en tâche de fond (cron job) ou avant une release majeure.

## **Performance et Gestion de la Mémoire**

Sur les gros monorepos, Knip peut consommer beaucoup de mémoire (OOM).

### **Debugging et Profiling**

Si Knip échoue avec JavaScript heap out of memory, augmentez la limite mémoire de Node : NODE_OPTIONS="--max-old-space-size=8192".  
Utilisez les drapeaux --performance et --debug pour identifier les goulots d'étranglement.24 Souvent, c'est un dossier node_modules mal exclu ou un fichier généré géant qui cause le ralentissement.

### **Isolation des Workspaces**

Par défaut, Knip analyse tout le monorepo en une fois pour résoudre les références croisées. Si la performance devient un problème critique, vous pouvez diviser l'analyse par workspace en utilisant la commande knip --workspace packages/ui. Cependant, cela peut réduire la précision de la détection des exports inutilisés (si ui exporte un composant utilisé uniquement par web, l'analyse isolée de ui le marquera comme inutilisé).

## **Synthèse de la Configuration Optimale (knip.json)**

Voici la configuration "Expert" qui synthétise toutes les contraintes de Next.js 15, Payload 3.0 et du Monorepo.

```json
{
  "$schema": "https://unpkg.com/knip@5/schema.json",
  "workspaces": {
    ".": {
      "entry": ["scripts/*.ts"],
      "project": ["scripts/**/*.ts"]
    },
    "apps/web": {
      "entry": [
        "next.config.ts",
        "payload.config.ts",
        "src/instrumentation.ts",
        "src/middleware.ts"
      ],
      "project": ["src/**/*.{ts,tsx}!"],
      "ignore": [
        "src/payload-types.ts",
        "public/**"
      ],
      "next": {
        "entry":
      },
      "drizzle": {
        "config": ["drizzle.config.ts"]
      }
    },
    "packages/ui": {
      "entry": ["src/index.ts"],
      "project": ["src/**/*.{ts,tsx}!"],
      "includeEntryExports": true // Crucial pour les librairies partagées
    },
    "packages/db": {
      "entry": ["src/index.ts", "src/schema.ts"],
      "project": ["src/**/*.ts!"],
      "ignore": ["drizzle/migrations/**"]
    }
  },
  "ignoreExportsUsedInFile": true,
  "compilers": {
    "css": "identity", // Gestion basique des imports CSS si nécessaire
    "mdx": "knip/compilers/mdx" // Si utilisation de MDX
  }
}
```

## **Conclusion**

L'intégration de Knip dans un environnement Next.js 15 et Payload 3.0 ne doit pas être vue comme une simple tâche de configuration, mais comme une démarche de gouvernance du code. En définissant explicitement les points d'entrée de ces frameworks "magiques" et en adoptant une stratégie de CI rigoureuse, vous transformez un outil d'analyse en un véritable levier de qualité logicielle. La clé réside dans la maintenance continue de ce fichier knip.json : à chaque fois qu'une nouvelle convention structurelle est introduite dans le projet (par exemple, l'ajout d'un dossier services/), elle doit être reflétée dans la configuration. C'est à ce prix que l'expert garantit une base de code saine, exempte de la pourriture logicielle qui menace inévitablement les projets de grande envergure.

#### **Sources des citations**

1. FAQ | Knip, consulté le novembre 26, 2025, [https://knip.dev/reference/faq](https://knip.dev/reference/faq)
2. Monorepos & Workspaces | Knip, consulté le novembre 26, 2025, [https://knip.dev/features/monorepos-and-workspaces](https://knip.dev/features/monorepos-and-workspaces)
3. How do I manage shared common packages in my yarn-workspace monorepo - Reddit, consulté le novembre 26, 2025, [https://www.reddit.com/r/node/comments/1ju6uov/how_do_i_manage_shared_common_packages_in_my/](https://www.reddit.com/r/node/comments/1ju6uov/how_do_i_manage_shared_common_packages_in_my/)
4. Configuration | Knip, consulté le novembre 26, 2025, [https://knip.dev/reference/configuration](https://knip.dev/reference/configuration)
5. Production Mode | Knip, consulté le novembre 26, 2025, [https://knip.dev/features/production-mode](https://knip.dev/features/production-mode)
6. Features | Knip, consulté le novembre 26, 2025, [https://knip.dev/overview/features](https://knip.dev/overview/features)
7. How to change the ts path aliases for an nx application - Stack Overflow, consulté le novembre 26, 2025, [https://stackoverflow.com/questions/70807080/how-to-change-the-ts-path-aliases-for-an-nx-application](https://stackoverflow.com/questions/70807080/how-to-change-the-ts-path-aliases-for-an-nx-application)
8. Next.js - Knip, consulté le novembre 26, 2025, [https://knip.dev/reference/plugins/next](https://knip.dev/reference/plugins/next)
9. VeriTeknik/pluggedin-app: The Crossroads for AI Data Exchanges. A unified, self-hostable web interface for discovering, configuring, and managing Model Context Protocol (MCP) servers—bringing together AI tools, workspaces, prompts, and logs from multiple MCP sources (Claude, Cursor, etc.) under one - GitHub, consulté le novembre 26, 2025, [https://github.com/VeriTeknik/pluggedin-app](https://github.com/VeriTeknik/pluggedin-app)
10. Next.js 15: App Router — A Complete Senior-Level Guide | by Liven Apps | Medium, consulté le novembre 26, 2025, [https://medium.com/@livenapps/next-js-15-app-router-a-complete-senior-level-guide-0554a2b820f7](https://medium.com/@livenapps/next-js-15-app-router-a-complete-senior-level-guide-0554a2b820f7)
11. Installation | Documentation - Payload CMS, consulté le novembre 26, 2025, [https://payloadcms.com/docs/getting-started/installation](https://payloadcms.com/docs/getting-started/installation)
12. 3.0 beta: Install Payload into any Next.js app with one line, consulté le novembre 26, 2025, [https://payloadcms.com/posts/blog/30-beta-install-payload-into-any-nextjs-app-with-one-line](https://payloadcms.com/posts/blog/30-beta-install-payload-into-any-nextjs-app-with-one-line)
13. The Payload Config | Documentation, consulté le novembre 26, 2025, [https://payloadcms.com/docs/configuration/overview](https://payloadcms.com/docs/configuration/overview)
14. How to set up and customize Collections - Payload CMS, consulté le novembre 26, 2025, [https://payloadcms.com/posts/guides/how-to-set-up-and-customize-collections](https://payloadcms.com/posts/guides/how-to-set-up-and-customize-collections)
15. Drizzle | Knip, consulté le novembre 26, 2025, [https://knip.dev/reference/plugins/drizzle](https://knip.dev/reference/plugins/drizzle)
16. Migrations with Drizzle Kit, consulté le novembre 26, 2025, [https://orm.drizzle.team/docs/kit-overview](https://orm.drizzle.team/docs/kit-overview)
17. Drizzle ORM - Hyperdrive - Cloudflare Docs, consulté le novembre 26, 2025, [https://developers.cloudflare.com/hyperdrive/examples/connect-to-mysql/mysql-drivers-and-libraries/drizzle-orm/](https://developers.cloudflare.com/hyperdrive/examples/connect-to-mysql/mysql-drivers-and-libraries/drizzle-orm/)
18. drizzle.config.ts - Drizzle ORM, consulté le novembre 26, 2025, [https://orm.drizzle.team/docs/drizzle-config-file](https://orm.drizzle.team/docs/drizzle-config-file)
19. Migrations - Drizzle ORM, consulté le novembre 26, 2025, [https://orm.drizzle.team/docs/migrations](https://orm.drizzle.team/docs/migrations)
20. Cloudflare D1 & Drizzle ORM: TypeScript Worker Tutorial | Full Stack Wizardry - Medium, consulté le novembre 26, 2025, [https://medium.com/full-stack-engineer/how-do-you-connect-drizzle-orm-to-a-cloudflare-d1-database-in-a-worker-1eff33177f73](https://medium.com/full-stack-engineer/how-do-you-connect-drizzle-orm-to-a-cloudflare-d1-database-in-a-worker-1eff33177f73)
21. Cloudflare Durable Objects - Drizzle ORM, consulté le novembre 26, 2025, [https://orm.drizzle.team/docs/connect-cloudflare-do](https://orm.drizzle.team/docs/connect-cloudflare-do)
22. Plugins (119) - Knip, consulté le novembre 26, 2025, [https://knip.dev/reference/plugins](https://knip.dev/reference/plugins)
23. Cache dependencies and build outputs in GitHub Actions, consulté le novembre 26, 2025, [https://github.com/actions/cache](https://github.com/actions/cache)
24. Performance | Knip, consulté le novembre 26, 2025, [https://knip.dev/guides/performance](https://knip.dev/guides/performance)
25. Dependency caching reference - GitHub Docs, consulté le novembre 26, 2025, [https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching)
26. Actions · GitHub Marketplace - Knip Reporter, consulté le novembre 26, 2025, [https://github.com/marketplace/actions/knip-reporter](https://github.com/marketplace/actions/knip-reporter)
27. Commenting a pull request in a GitHub action - Stack Overflow, consulté le novembre 26, 2025, [https://stackoverflow.com/questions/58066966/commenting-a-pull-request-in-a-github-action](https://stackoverflow.com/questions/58066966/commenting-a-pull-request-in-a-github-action)
