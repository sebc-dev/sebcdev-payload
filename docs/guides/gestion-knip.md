# **Stratégies Avancées de Gestion de la Dette Technique et Analyse de Dépendances avec Knip : Protocoles d'Intégration Continue et Gouvernance de Code**

## **Résumé Exécutif**

Dans l'écosystème contemporain du développement JavaScript et TypeScript, la complexité croissante des chaînes d'outils (toolchains), l'adoption généralisée des architectures monorepo et l'utilisation de frameworks méta (tels que Next.js, Remix ou Vite) ont exacerbé le problème de la "dette de code morte". Les fichiers inutilisés, les exports orphelins et les dépendances obsolètes ne sont pas simplement des artefacts inesthétiques ; ils représentent une charge cognitive tangible pour les développeurs, ralentissent les pipelines d'intégration continue (CI/CD), augmentent la surface d'attaque de sécurité et dégradent les temps de construction.1  
Knip s'est imposé comme l'outil de référence pour cartographier le graphe de dépendances d'un projet et identifier ces éléments superflus. Cependant, son intégration dans un flux de travail quotidien ("daily workflow") présente des défis significatifs, notamment la gestion des faux positifs générés par des outils à configuration dynamique comme TailwindCSS, la prise en compte des dépendances planifiées pour un usage futur, et la nécessité d'établir une "baseline" pour ignorer temporairement la dette existante tout en prévenant les régressions.3  
Ce rapport propose une analyse exhaustive des méthodologies pour intégrer Knip de manière pérenne. Il détaille les mécanismes architecturaux de l'outil, fournit des solutions techniques précises pour les configurations TailwindCSS et PostCSS (v3 et v4), et définit des protocoles de gouvernance pour gérer les exceptions temporaires sans compromettre la qualité à long terme du code source.

## ---

**1\. Fondements Théoriques et Architecture de l'Analyse Statique**

Pour maîtriser l'utilisation de Knip et résoudre les cas complexes de faux positifs ou de dépendances futures, il est impératif de comprendre comment l'outil perçoit et analyse la structure d'un projet. Contrairement aux outils de linting traditionnels qui analysent les fichiers de manière isolée (par exemple, ESLint), Knip adopte une approche holistique basée sur la théorie des graphes.3

### **1.1 Le Graphe d'Accessibilité (Reachability Graph)**

Le cœur du fonctionnement de Knip repose sur la construction d'un graphe de dépendances complet partant de points d'entrée définis explicitement.

#### **1.1.1 Le Concept de Fichiers d'Entrée (Entry Files)**

L'analyse débute par la définition des "fichiers d'entrée". Ce sont les racines de l'arbre de dépendances : les fichiers qui sont implicitement utilisés parce qu'ils constituent l'interface publique d'une bibliothèque, les scripts exécutables d'une application, ou les fichiers de configuration des outils de développement.5  
Dans une configuration par défaut, Knip identifie automatiquement certains fichiers standards (index.ts, main.js, package.json). Cependant, la précision de l'analyse dépend entièrement de l'exhaustivité de cette liste. Si un fichier est utilisé par le système (par exemple, une page générée dynamiquement par un framework comme Astro ou Next.js) mais n'est pas déclaré comme point d'entrée et n'est importé par aucun autre fichier, Knip le considérera comme "inutilisé".7

#### **1.1.2 Traversée de l'Arbre Syntaxique Abstrait (AST)**

Une fois les points d'entrée identifiés, Knip analyse le code source en construisant un Arbre Syntaxique Abstrait (AST). Il traverse cet arbre à la recherche de déclarations d'importation (import, require, import()) et d'exportation. Cette méthode statique est puissante mais présente des limites inhérentes face aux résolutions dynamiques.4  
C'est ici que réside la source principale des "faux positifs" mentionnés dans la requête utilisateur : si une dépendance comme TailwindCSS est utilisée via une détection de contenu (scanning) de fichiers HTML ou via une directive CSS, il n'existe pas de lien d'importation explicite dans l'AST JavaScript que Knip puisse suivre naturellement. Le graphe est donc brisé, et la dépendance apparaît comme orpheline.

### **1.2 Le Rôle Critique des Plugins et Compilateurs**

Pour combler les lacunes de l'analyse statique standard, Knip utilise une architecture extensible basée sur des plugins et des compilateurs.

* **Plugins :** Un plugin dans Knip a pour fonction principale de connecter des îlots isolés au graphe principal. Par exemple, le plugin TailwindCSS sait que tailwind.config.js est un point d'entrée (et ne doit donc pas être supprimé) et il sait comment parser ce fichier pour y trouver des références à d'autres plugins ou fichiers.8  
* **Compilateurs :** Ils permettent à Knip de "lire" des fichiers non-JavaScript (comme .vue, .svelte, ou .css) et de les transformer virtuellement en modules JavaScript contenant des imports, rendant ainsi les dépendances visibles au graphe.10

La gestion quotidienne de Knip consiste donc moins à configurer l'outil lui-même qu'à configurer correctement ces adaptateurs pour qu'ils reflètent fidèlement l'architecture réelle du projet.

## ---

**2\. Gestion des Faux Positifs : Le Cas Complexe de TailwindCSS et PostCSS**

L'une des frictions les plus courantes lors de l'adoption de Knip, explicitement soulignée dans la problématique utilisateur, concerne les outils de styling comme TailwindCSS. Ces outils fonctionnent souvent en "dehors" du graphe de modules JavaScript classique, ce qui conduit Knip à signaler faussement leurs dépendances comme inutilisées.

### **2.1 Analyse et Résolution pour TailwindCSS**

La stratégie de résolution dépend fortement de la version de Tailwind utilisée (v3 ou v4), car l'architecture de configuration a radicalement changé.

#### **2.1.1 TailwindCSS v3 : Configuration JavaScript**

Dans la version 3, la configuration réside principalement dans tailwind.config.js. Knip inclut un plugin natif pour détecter ce fichier.8  
**Problème courant :** Même avec le plugin activé, certaines dépendances référencées dans le tableau plugins de la configuration peuvent être signalées comme inutilisées si elles sont appelées via des chaînes de caractères complexes ou des fonctions require dynamiques que le parseur statique de Knip ne résout pas.  
**Solution :**

1. **Vérification de l'activation :** Assurez-vous que tailwindcss est présent dans le package.json. Le plugin s'active automatiquement.9  
2. **Point d'entrée explicite :** Si le fichier de configuration est situé dans un dossier non standard, il faut l'ajouter manuellement aux entrées :  
   JSON  
   {  
     "entry": \["src/index.ts", "config/tailwind.config.js"\]  
   }

.6  
3\. Référencement explicite des plugins : Si un plugin Tailwind est utilisé mais non détecté (faux positif), la méthode recommandée "pour le moment" est de l'ajouter à ignoreDependencies. Cependant, pour le long terme, il est préférable de s'assurer que le fichier de config est bien parsé.

#### **2.1.2 TailwindCSS v4 : Le Défi des Directives CSS**

TailwindCSS v4 introduit une configuration "CSS-first" utilisant les directives @import "tailwindcss" et @plugin "nom-du-plugin". C'est un changement de paradigme majeur qui rend le plugin Knip standard (conçu pour JS/TS) inefficace pour détecter ces dépendances.10  
**Le Problème Technique :** Knip ne scanne pas nativement les fichiers .css pour y chercher des dépendances. Par conséquent, des paquets comme @tailwindcss/typography ou daisyui déclarés uniquement dans le CSS seront marqués comme "Unused dependencies".10  
Protocole de Résolution (Solution Long Terme) :  
Au lieu d'ignorer ces dépendances (ce qui masquerait le problème), il faut instruire Knip sur la manière de lire ces directives. La solution optimale consiste à implémenter un compilateur personnalisé dans knip.ts.  
Ce compilateur transforme à la volée les directives CSS en imports JavaScript virtuels que Knip peut comprendre.

TypeScript

// knip.ts  
import type { KnipConfig } from "knip";

export default {  
  // 1\. Inclure les fichiers CSS dans le scope du projet  
  project: \["src/\*\*/\*.{ts,tsx,css}"\],   
    
  // 2\. Définir un compilateur pour les fichiers CSS  
  compilers: {  
    css: (text) \=\> {  
      // Regex pour capturer @import "pkg" ou @plugin "pkg"  
      // Cette regex identifie les directives spécifiques de Tailwind v4  
      const matches \= \[...text.matchAll(/@(?:import|plugin)\\s+\["'\](\[^"'\]+)\["'\]/g)\];  
        
      // Transformation en imports ES modules fictifs  
      // Knip verra ainsi: import 'tailwindcss'; import 'daisyui';  
      return matches.map((\[\_, match\]) \=\> \`import '${match}';\`).join("\\n");  
    },  
  },  
} satisfies KnipConfig;

10  
Cette approche est supérieure à l'ignorance des dépendances car elle maintient une véritable vérification : si vous supprimez @plugin "daisyui" de votre CSS, Knip vous signalera correctement que le paquet daisyui est devenu inutile. C'est la définition même de "bien l'utiliser sur le long terme".

### **2.2 La Gestion de PostCSS**

PostCSS souffre de problèmes similaires, exacerbés par la transition récente vers @tailwindcss/postcss.  
Le Conflit de Version :  
De nombreux projets rencontrent des erreurs ou des faux positifs lors de la migration, car l'ancienne méthode require('tailwindcss') dans postcss.config.js est remplacée par le paquet @tailwindcss/postcss.13  
**Stratégie de Configuration :**

1. **Ciblage du Config :** Assurez-vous que Knip localise votre fichier PostCSS. Le plugin PostCSS cherche par défaut postcss.config.js, .postcssrc, etc. Si votre config est ailleurs, surchargez le plugin :  
   JSON  
   {  
     "postcss": {  
       "config": \["tools/postcss.config.js"\],  
       "entry": \["\*\*/\*.css"\] // Scanne aussi les CSS pour les @import  
     }  
   }

.15  
2\. Faux Positifs Persistants : Si des plugins PostCSS comme autoprefixer sont signalés comme inutilisés alors qu'ils sont présents dans la config, cela indique souvent que Knip n'arrive pas à parser la syntaxe d'export du fichier de config (par exemple, si elle est dynamique). Dans ce cas précis, l'ajout à ignoreDependencies est acceptable temporairement, mais la solution propre est de simplifier la config PostCSS ou d'écrire un resolver personnalisé dans un plugin Knip local.9

## ---

**3\. Gestion Temporelle : Dépendances Futures et "Ignorance" Provisoire**

La requête utilisateur soulève un point crucial de la gestion de projet réelle : comment gérer les dépendances ajoutées aujourd'hui pour une fonctionnalité qui sera développée "demain", ou les cas que l'on souhaite ignorer "pour le moment" tout en gardant une trace.

### **3.1 Le Concept de Dépendances "Spéculatives" (Futures)**

Il est fréquent d'installer une bibliothèque (ex: @tanstack/react-query) en prévision d'un sprint à venir. Knip, étant strict, la signalera immédiatement comme "Unused".  
**La Mauvaise Pratique :** Laisser la CI échouer ou commenter la ligne dans package.json.  
**La Bonne Pratique (Protocole Long Terme) :** Utiliser ignoreDependencies de manière documentée. L'utilisation d'un fichier de configuration dynamique (knip.ts) est ici supérieure au JSON car elle permet les commentaires contextuels.

TypeScript

// knip.ts  
export default {  
  ignoreDependencies: Intégration prévue pour le module de paiement  
    "@stripe/stripe-js",  
      
    // NOTE: Requis par l'environnement de déploiement, non importé explicitement  
    "cross-env"   
  \]  
};

16  
Cette approche satisfait le besoin de "ne pas prendre en compte pour le moment" tout en documentant explicitement la raison, facilitant ainsi le nettoyage futur (si le Sprint 42 passe et que la dépendance n'est toujours pas utilisée, le commentaire rappellera pourquoi elle est là).

### **3.2 Stratégies de "Baseline" pour la Dette Existante**

Lorsqu'on intègre Knip dans un projet existant (brownfield project), le rapport initial peut révéler des centaines de problèmes. Il est irréaliste de tout corriger immédiatement, mais il est critique de ne pas bloquer le développement quotidien. C'est ici qu'intervient la notion de "Baseline" (ligne de base).  
Knip ne possède pas de commande native \--generate-baseline comme PHPStan, mais nous pouvons émuler ce comportement efficacement.

#### **Stratégie A : Le "Geler" via le Reporter JSON (Recommandée pour CI/CD)**

Cette méthode permet d'ignorer *tous* les problèmes actuels sans modifier le fichier de configuration knip.json avec des centaines d'exclusions, ce qui garderait la configuration propre.  
**Protocole :**

1. **Génération de la Baseline :** Exécutez Knip et sauvegardez le résultat dans un fichier JSON de référence.  
   Bash  
   knip \--reporter json \> knip-baseline.json

   Ce fichier représente l'état "accepté" de la dette technique à l'instant T.17  
2. **Comparaison Différentielle en CI :** Dans votre pipeline d'intégration continue, au lieu de vérifier si Knip renvoie zéro erreur, vous vérifiez si Knip renvoie de *nouvelles* erreurs par rapport à la baseline.  
   Un script simple (Node.js) peut comparer le rapport courant avec la baseline :  
   * Si une erreur est dans current et dans baseline \-\> **Ignorer** (C'est un problème connu).  
   * Si une erreur est dans current mais PAS dans baseline \-\> **Échec** (C'est une régression ou une nouvelle dépendance inutilisée).  
   * Si une erreur est dans baseline mais PAS dans current \-\> **Succès/Info** (Félicitations, une dette a été remboursée. Il faut mettre à jour la baseline).

Cette approche répond parfaitement à la demande de "gérer dans la vie de tous les jours" sans être submergé par le passé, tout en assurant que "l'avenir" reste propre.

#### **Stratégie B : La Configuration Progressive des Règles**

Une alternative plus légère consiste à jouer sur les niveaux de sévérité des règles (rules).  
Vous pouvez configurer Knip pour qu'il ne fasse qu'avertir (warn) pour les fichiers et exports inutilisés (souvent nombreux dans les vieux projets et risqués à supprimer), mais qu'il soit strict (error) pour les dépendances (plus faciles à gérer et critiques pour la sécurité/performance).

JSON

{  
  "rules": {  
    "files": "warn",        // Affiche les fichiers inutilisés mais ne casse pas la CI  
    "exports": "warn",      // Idem pour les exports  
    "dependencies": "error", // Strict : aucune dépendance inutile n'est tolérée  
    "unlisted": "error"      // Strict : toutes les dépendances doivent être déclarées  
  }  
}

18  
Cela permet une adoption progressive : on arrête l'hémorragie sur les dépendances (le plus important pour le bundle size) tout en gardant la dette de code sous surveillance.

## ---

**4\. Tableau Comparatif des Stratégies d'Exclusion**

Pour gérer les cas positifs que l'on souhaite ignorer temporairement, plusieurs mécanismes existent. Le choix dépend de la nature de l'exclusion.

| Mécanisme | Cas d'Usage Idéal | Avantage | Inconvénient |
| :---- | :---- | :---- | :---- |
| **ignore (Glob)** | Fichiers legacy, dossiers générés (dist, coverage) | Simple, supporte les wildcards. | Exclut *l'affichage* de l'erreur, mais le fichier est toujours analysé s'il est référencé. Peut masquer des problèmes réels. 6 |
| **ignoreDependencies** | Dépendances futures, outils globaux, faux positifs de plugins | Cible précise par nom de package. | Risque d'oublier de nettoyer la liste si la dépendance n'est jamais utilisée. 16 |
| **ignoreBinaries** | Outils CLI utilisés dans des scripts shell non parsés | Évite les faux positifs sur les outils système. | Nécessite une maintenance manuelle. 16 |
| **JSDoc @public** | Exports spécifiques dans une librairie | Indique explicitement l'intention publique d'une fonction. | Nécessite de modifier le code source. 7 |
| **Baseline JSON** | Dette massive existante à l'initialisation | Ne pollue pas la config, permet une "ratchet" (amélioration continue). | Complexifie légèrement le pipeline CI. 17 |

## ---

**5\. Intégration dans le Flux de Travail Quotidien (Daily Workflow)**

Pour que Knip soit efficace sur le long terme, il ne doit pas être un outil qu'on lance une fois par mois, mais une barrière de qualité invisible et rapide.

### **5.1 Optimisation de la Performance**

Dans les grands projets, l'analyse peut être lente. Pour un usage quotidien (pre-commit ou CI rapide) :

* **Cache :** Utilisez le flag \--cache pour accélérer les exécutions successives. Knip met en cache le graphe de dépendances et ne recalcule que ce qui a changé.19  
* **Mode Production :** Utilisez \--production pour l'analyse quotidienne. Cela ignore les fichiers de test et les devDependencies, se concentrant sur ce qui impacte l'utilisateur final (le bundle de production). C'est souvent suffisant pour la "vie de tous les jours".20  
  Bash  
  knip \--production \--strict

### **5.2 Flux de Nettoyage (Refactoring Routine)**

L'utilisateur souhaite "bien l'utiliser sur le long terme". Cela implique un rituel de maintenance.

1. **L'Auto-Fix Prudent :** Knip propose une option \--fix.  
   * *Danger :* Ne jamais l'exécuter aveuglément en CI.  
   * *Protocole :* Une fois par sprint, un développeur doit exécuter knip \--fix localement. Cela supprime automatiquement les exports inutilisés et nettoie le package.json. Les changements doivent être revus via git diff avant commit.21  
2. **La Règle du Boy Scout :** Si un développeur travaille sur un fichier qui est dans la liste ignore, il doit essayer de corriger les problèmes Knip de ce fichier et de le retirer de la liste. C'est ainsi qu'on résorbe la dette progressivement.

## ---

**6\. Cas Spécifiques et Architectures Complexes**

### **6.1 Monorepos et Workspaces**

Dans une architecture monorepo (NX, Turborepo, Yarn Workspaces), la gestion des dépendances est délicate. Une dépendance peut être installée à la racine mais utilisée dans un package enfant.  
Problème : Knip peut signaler une dépendance racine comme inutilisée si elle n'est utilisée que dans les workspaces.  
Solution :

* Utiliser le flag \--strict force Knip à vérifier que chaque workspace déclare ses propres dépendances. C'est la meilleure pratique pour le long terme afin d'éviter les "dépendances fantômes" qui cassent lors du déploiement isolé d'un service.20  
* Configurer workspaces correctement dans package.json ou knip.json est essentiel pour que Knip comprenne la topologie du projet.23

### **6.2 Alias de Chemin (Path Aliases)**

Si votre projet utilise des alias (ex: @components/Button) définis dans Webpack ou Vite mais *pas* dans tsconfig.json, Knip ne pourra pas résoudre les imports, générant des faux positifs "Unresolved import".24  
**Solution :** Toujours synchroniser les alias dans tsconfig.json (section paths). C'est une bonne pratique TypeScript générale qui bénéficie à Knip. Si impossible, utilisez la propriété paths dans knip.json pour mapper manuellement les alias.16

## ---

**Conclusion**

Gérer Knip au quotidien demande de passer d'une vision binaire ("ça passe ou ça casse") à une vision nuancée de la gestion de la dette.  
Pour répondre précisément à la demande de l'utilisateur :

1. **Pour Tailwind/PostCSS (Faux positifs) :** Ne pas se contenter d'ignorer. Utiliser les **compilateurs personnalisés** (notamment pour la v4) et vérifier les **points d'entrée** des configurations pour garantir que l'usage est réellement détecté. C'est la seule façon de garantir l'intégrité à long terme.  
2. **Pour les dépendances futures :** Utiliser ignoreDependencies avec parcimonie et **toujours accompagné d'un commentaire** explicatif dans un fichier de configuration TypeScript (knip.ts).  
3. **Pour les cas "positifs mais ignorés pour le moment" :** Adopter la stratégie de la **Baseline JSON** en CI. Cela fige la dette actuelle sans empêcher l'ajout de nouveau code propre, transformant la correction de la dette en une tâche de fond plutôt qu'un blocage immédiat.

En appliquant ces protocoles, Knip cesse d'être un outil de contrainte pour devenir un assistant architectural, garantissant que chaque ligne de code et chaque octet de dépendance justifie sa présence dans le projet.

#### **Sources des citations**

1. Knip: The Ultimate Tool to Detect Unused Code and Dependencies in JavaScript & TypeScript \- fireup.pro, consulté le décembre 2, 2025, [https://fireup.pro/news/knip-the-ultimate-tool-to-detect-unused-code-and-dependencies-in-javascript-typescript](https://fireup.pro/news/knip-the-ultimate-tool-to-detect-unused-code-and-dependencies-in-javascript-typescript)  
2. How I Cleaned Up Our Codebase With Knip, And Why You Should Too \- DEV Community, consulté le décembre 2, 2025, [https://dev.to/rkhaslarov/how-i-cleaned-up-our-codebase-with-knip-and-why-you-should-too-41mg](https://dev.to/rkhaslarov/how-i-cleaned-up-our-codebase-with-knip-and-why-you-should-too-41mg)  
3. Knip: An Automated Tool For Finding Unused Files, Exports, And Dependencies, consulté le décembre 2, 2025, [https://www.smashingmagazine.com/2023/08/knip-automated-tool-find-unused-files-exports-dependencies/](https://www.smashingmagazine.com/2023/08/knip-automated-tool-find-unused-files-exports-dependencies/)  
4. FAQ | Knip, consulté le décembre 2, 2025, [https://knip.dev/reference/faq](https://knip.dev/reference/faq)  
5. Plugins | Knip, consulté le décembre 2, 2025, [https://knip.dev/explanations/plugins](https://knip.dev/explanations/plugins)  
6. Configuring Project Files | Knip, consulté le décembre 2, 2025, [https://knip.dev/guides/configuring-project-files](https://knip.dev/guides/configuring-project-files)  
7. Handling Issues | Knip, consulté le décembre 2, 2025, [https://knip.dev/guides/handling-issues](https://knip.dev/guides/handling-issues)  
8. documentation-plugins-about-plugins--page, consulté le décembre 2, 2025, [https://english.hi.is/themes/custom/volcano/design-system/storybook-static/iframe.html?path=/story/documentation-plugins-about-plugins--page](https://english.hi.is/themes/custom/volcano/design-system/storybook-static/iframe.html?path=/story/documentation-plugins-about-plugins--page)  
9. Writing A Plugin \- Knip, consulté le décembre 2, 2025, [https://knip.dev/writing-a-plugin](https://knip.dev/writing-a-plugin)  
10. fix-knip-false-positives-tailwindcss-v4.mdx \- GitHub, consulté le décembre 2, 2025, [https://github.com/jimmy-guzman/jimmy.codes/blob/main/src/content/posts/fix-knip-false-positives-tailwindcss-v4.mdx](https://github.com/jimmy-guzman/jimmy.codes/blob/main/src/content/posts/fix-knip-false-positives-tailwindcss-v4.mdx)  
11. Tailwind | Knip, consulté le décembre 2, 2025, [https://knip.dev/reference/plugins/tailwind](https://knip.dev/reference/plugins/tailwind)  
12. Plugins (119) \- Knip, consulté le décembre 2, 2025, [https://knip.dev/reference/plugins](https://knip.dev/reference/plugins)  
13. How to fix Tailwind PostCSS plugin error? \- Stack Overflow, consulté le décembre 2, 2025, [https://stackoverflow.com/questions/79498214/how-to-fix-tailwind-postcss-plugin-error](https://stackoverflow.com/questions/79498214/how-to-fix-tailwind-postcss-plugin-error)  
14. Solving the Tailwind CSS, PostCSS, and Yarn Error Nightmare: A Deep-Dive Guide for Modern Frontend Teams | by Claus Rainer Anton Nisslmüller | Muzli, consulté le décembre 2, 2025, [https://medium.muz.li/solving-the-tailwind-css-postcss-and-yarn-error-nightmare-a-deep-dive-guide-for-modern-frontend-719188c14148](https://medium.muz.li/solving-the-tailwind-css-postcss-and-yarn-error-nightmare-a-deep-dive-guide-for-modern-frontend-719188c14148)  
15. PostCSS | Knip, consulté le décembre 2, 2025, [https://knip.dev/reference/plugins/postcss](https://knip.dev/reference/plugins/postcss)  
16. Configuration | Knip, consulté le décembre 2, 2025, [https://knip.dev/reference/configuration](https://knip.dev/reference/configuration)  
17. Reporters & Preprocessors \- Knip, consulté le décembre 2, 2025, [https://knip.dev/features/reporters](https://knip.dev/features/reporters)  
18. Rules & Filters | Knip, consulté le décembre 2, 2025, [https://knip.dev/features/rules-and-filters](https://knip.dev/features/rules-and-filters)  
19. Performance | Knip, consulté le décembre 2, 2025, [https://knip.dev/guides/performance](https://knip.dev/guides/performance)  
20. Production Mode | Knip, consulté le décembre 2, 2025, [https://knip.dev/features/production-mode](https://knip.dev/features/production-mode)  
21. Auto-fix | Knip, consulté le décembre 2, 2025, [https://knip.dev/features/auto-fix](https://knip.dev/features/auto-fix)  
22. Unused dependencies | Knip, consulté le décembre 2, 2025, [https://knip.dev/typescript/unused-dependencies](https://knip.dev/typescript/unused-dependencies)  
23. Monorepos & Workspaces | Knip, consulté le décembre 2, 2025, [https://knip.dev/features/monorepos-and-workspaces](https://knip.dev/features/monorepos-and-workspaces)  
24. Troubleshooting | Knip, consulté le décembre 2, 2025, [https://knip.dev/guides/troubleshooting](https://knip.dev/guides/troubleshooting)