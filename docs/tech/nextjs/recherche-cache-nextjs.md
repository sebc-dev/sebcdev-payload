

# **Architecture de Recherche et de Cache pour Next.js 15 et Payload CMS 3.0 : Rapport de Recherche Approfondi**

## **1\. Synthèse Exécutive et Définition du Paradigme Architectural**

### **1.1. Le Contexte du Projet et la Dualité des Exigences**

La conception d'une architecture web moderne utilisant **Next.js 15** (App Router) et **Payload CMS 3.0** impose une réflexion approfondie sur la gestion de l'état et du rendu. La demande actuelle met en lumière une tension fondamentale, souvent qualifiée de "Paradoxe du Rendu Dynamique", entre deux impératifs fonctionnels majeurs définis dans le Product Requirement Document (PRD) :

1. **Recherche Instantanée avec Synchronisation URL (EF4/CA2) :** L'expérience utilisateur exige une réactivité immédiate lors du filtrage ou de la recherche de contenu. Chaque interaction doit se refléter dans l'URL pour garantir la partageabilité, la persistance de l'état et l'optimisation pour les moteurs de recherche (SEO).  
2. **Mise en Cache Agressive (ENF2/CA4) :** L'architecture doit minimiser la charge serveur et les coûts de lecture en base de données (Cloudflare D1), en maximisant l'utilisation du rendu statique (ISR \- Incremental Static Regeneration) et du cache de données pour optimiser les Core Web Vitals, spécifiquement le *Time to First Byte* (TTFB) et le *Largest Contentful Paint* (LCP).

Le risque identifié est techniquement fondé : dans le modèle de composants serveur (RSC) de Next.js, l'accès aux searchParams est une opération qui bascule automatiquement le rendu de la route entière en mode dynamique ("opt-out of static rendering"). Si la recherche est traitée intégralement côté serveur via l'API locale de Payload (payload.find), chaque frappe au clavier ou modification de filtre invalide le cache de la route, engendrant une surcharge potentielle et une dégradation de l'expérience utilisateur due à la latence réseau.1

### **1.2. Portée de l'Analyse et Méthodologie**

Ce rapport explore en détail les implications techniques de trois stratégies architecturales pour résoudre ce conflit : la recherche purement côté serveur (Full Server-Side), la recherche côté client (Client-Side via Index JSON), et une approche hybride sophistiquée exploitant **Nuqs**, les **Server Actions**, et les frontières de **Suspense**.  
L'analyse s'appuie sur une étude rigoureuse des mécanismes internes de Next.js 15 (y compris le Partial Prerendering), des spécificités de Payload CMS 3.0 (Local API, Hooks), et des contraintes de l'infrastructure Cloudflare D1 (latence, FTS5). L'objectif est de fournir une recommandation prescriptive permettant de concilier l'instantanéité de l'interface avec la robustesse du cache serveur.  
---

## **2\. Fondamentaux Techniques et Mécanismes de Rendu sous Next.js 15**

Pour arbitrer efficacement entre les stratégies EF4 et ENF2, il est impératif de déconstruire la manière dont Next.js 15 gère l'intersection entre les données dynamiques d'URL et les stratégies de mise en cache.

### **2.1. La Dynamique des searchParams et l'Invalidation du Cache**

Dans l'architecture App Router, la propriété searchParams injectée dans les composants de page (page.tsx) agit comme un déclencheur de rendu dynamique. Contrairement aux paramètres de route (ex: \[slug\]) qui peuvent être connus au moment du build via generateStaticParams, les paramètres de recherche sont, par définition, inconnus avant l'exécution de la requête.4

#### **Le Piège de la Dé-optimisation Globale**

Lorsqu'un composant serveur accède directement à la prop searchParams sans précaution architecturale, Next.js désactive le rendu statique pour l'ensemble de la route. Cela signifie que le HTML n'est plus généré au moment du build (SSG) ni mis à jour périodiquement (ISR), mais regénéré à chaque requête entrante (SSR).

TypeScript

// Exemple d'anti-pattern brisant le cache statique (ENF2)  
export default async function Page({ searchParams }: { searchParams: Promise\<{ q: string }\> }) {  
  const { q } \= await searchParams; // L'accès force le rendu dynamique  
  const results \= await payload.find({ where: { title: { like: q } } });  
  return \<ResultList data={results} /\>;  
}

Dans ce scénario, le "Static Shell" (l'enveloppe statique comprenant le header, le footer et la mise en page) ne peut pas être servi depuis le cache CDN, car le serveur doit attendre la résolution des searchParams et des données associées avant d'envoyer le moindre octet de HTML. Cela contredit directement l'exigence de cache agressif.1

### **2.2. Partial Prerendering (PPR) et l'Architecture Suspense**

La réponse de Next.js 15 à ce dilemme réside dans l'adoption du **Partial Prerendering (PPR)** et l'utilisation stratégique des frontières Suspense. Cette approche permet de diviser une route unique en deux zones distinctes :

1. **La Coquille Statique (Static Shell) :** Cette partie de l'interface, qui ne dépend pas des données de la requête (comme la navigation ou la structure de la page), est pré-rendue au moment du build et servie instantanément.  
2. **Les Trous Dynamiques (Dynamic Holes) :** Les composants qui dépendent des searchParams sont enveloppés dans un composant \<Suspense\>. Lors de la requête, le serveur envoie immédiatement la coquille statique, puis "stream" le contenu dynamique (les résultats de recherche) dès qu'il est prêt, remplaçant le fallback de chargement.3

Cette distinction est cruciale pour notre architecture : elle permet de maintenir un cache agressif sur la structure de la page (ENF2) tout en autorisant une interactivité dynamique pour la recherche (EF4).

### **2.3. Spécificités de Payload CMS : Local API vs Cache de Données**

L'utilisation de l'API locale de Payload (payload.find) présente un avantage de performance significatif par rapport à une API REST ou GraphQL externe, car elle supprime la latence HTTP en exécutant directement les requêtes en base de données au sein du même processus Node.js.8  
Cependant, contrairement à la fonction fetch native de Next.js qui dispose d'un mécanisme de mise en cache automatique (Data Cache), les appels directs en base de données via Payload ne sont pas cachés par défaut. Pour bénéficier du cache ISR ou de la réutilisation des données entre les rendus, il est nécessaire d'envelopper ces appels dans la fonction unstable\_cache (ou la directive 'use cache' en Next.js 15\) et de définir explicitement des clés et des tags de cache (revalidateTag).9  
Cette contrainte technique complexifie la recherche serveur : il est impossible de cacher efficacement toutes les combinaisons possibles de termes de recherche. Le cache serveur est donc pertinent pour les listes filtrées statiques (ex: "Tous les articles de la catégorie Blog"), mais inefficace pour une recherche textuelle libre.1  
---

## **3\. Analyse Comparative des Stratégies de Recherche**

Cette section évalue les trois architectures proposées à l'aune des exigences de performance (D1 Latence), de scalabilité (Payload CMS) et d'expérience utilisateur (Next.js/Nuqs).

### **3.1. Stratégie A : Recherche Full Server-Side (Payload \+ D1)**

Cette approche classique consiste à effectuer une navigation complète ou une mise à jour du composant serveur à chaque modification des critères de recherche. Le serveur reçoit les nouveaux paramètres, interroge Cloudflare D1 via Payload, et renvoie le nouveau HTML ou le Payload RSC.

#### **Limitations Critiques avec Cloudflare D1**

Le PRD spécifie l'utilisation de Cloudflare D1 (SQLite distribué). Bien que performante pour les lectures locales une fois en cache, D1 présente des latences de "Cold Start" et de réseau non négligeables lorsqu'elle est interrogée depuis des Workers non co-localisés. Des latences de 200ms à 800ms ont été rapportées pour des requêtes simples.13 Pour une recherche dite "instantanée" (feedback \< 100ms), cette latence intrinsèque constitue un obstacle majeur.

#### **Le Problème de la Recherche Textuelle (LIKE vs FTS5)**

Par défaut, une recherche via payload.find utilisera probablement une clause SQL LIKE %query%. Sur une base de données SQLite, cette opération force un scan complet de la table (Full Table Scan), dont la complexité algorithmique est linéaire O(N). Si le catalogue contient 1000 articles, l'impact est minime. À 50 000 articles, la requête peut prendre plusieurs centaines de millisecondes, bloquant le thread du Worker.16  
L'optimisation requiert l'utilisation de l'extension **FTS5** (Full-Text Search 5\) de SQLite, qui utilise des index inversés pour une recherche ultra-rapide. Cependant, Drizzle ORM, utilisé par Payload, ne supporte pas encore nativement la définition de tables virtuelles FTS5 dans son schéma TypeScript standard. L'implémentation nécessite des migrations SQL manuelles et des requêtes brutes, complexifiant la maintenance.18

### **3.2. Stratégie B : Recherche Client-Side (Index JSON \+ Fuse.js)**

Cette stratégie déporte l'intégralité de la logique de recherche dans le navigateur. Au chargement de la page, un fichier JSON contenant l'index des contenus est téléchargé, et la librairie **Fuse.js** effectue les recherches en mémoire.

#### **Analyse de Dimensionnement et Performance**

La viabilité de cette approche dépend strictement du volume de données.

* **Estimation de la charge utile :** Pour 1000 articles avec des champs indexés limités (Titre, Slug, Résumé court), la taille du fichier JSON brut avoisine les 300-400 KB. Après compression Gzip/Brotli, ce poids descend aux alentours de 80-100 KB, ce qui est acceptable pour une connexion 4G standard.21  
* **Performance Algorithmique :** Fuse.js est extrêmement performant sur des jeux de données de cette taille. Des benchmarks montrent des temps de réponse inférieurs à 50ms pour des recherches floues (fuzzy search) sur des collections de 100 000 enregistrements simples. Pour 1000 enregistrements, la réponse est perçue comme instantanée (\< 5ms).23

#### **Avantages Architecturaux**

Cette approche résout élégamment le conflit EF4/ENF2. La page serveur reste totalement statique (cacheable à l'infini) car elle ne dépend d'aucun paramètre de recherche dynamique. L'interactivité est gérée uniquement côté client, offrant une réactivité sans égale et soulageant totalement la base de données D1 des requêtes de recherche coûteuses.25

### **3.3. Stratégie C : Architecture Hybride (Nuqs \+ Server Actions \+ Suspense)**

C'est l'approche recommandée pour les applications à fort volume de données, cherchant à combiner la puissance du serveur avec la fluidité du client.

#### **Le Rôle Pivot de Nuqs (Next-Use-Query-State)**

La librairie **Nuqs** est essentielle pour synchroniser l'état de l'application avec l'URL sans provoquer de rechargements de page destructifs. Elle offre deux fonctionnalités clés :

1. **Shallow Routing et Debounce :** Elle permet de mettre à jour l'URL (?q=...) en mode "shallow" (sans exécuter les loaders serveur) ou avec un délai (debounce), évitant de surcharger le serveur à chaque frappe.27  
2. **Type-Safety Côté Serveur :** Nuqs propose des utilitaires comme createSearchParamsCache qui permettent de valider et typer les paramètres de recherche directement dans les composants serveur, sécurisant ainsi l'accès aux données.29

#### **Implémentation avec Suspense et Streaming**

Dans ce modèle, la recherche déclenche une mise à jour de l'URL qui, à son tour, invalide une partie spécifique de l'arbre de composants serveur. En isolant la liste de résultats dans un composant enveloppé par \<Suspense key={query}\>, on permet à Next.js de :

* Afficher immédiatement un état de chargement (Skeleton) dédié à la liste.  
* Lancer la requête Payload/D1 en arrière-plan.  
* Mettre à jour uniquement la zone de résultats une fois les données disponibles, sans toucher au reste de l'interface.31

---

## **4\. Recommandation Architecturale Détaillée**

Sur la base de l'analyse ci-dessus et des contraintes spécifiques du PRD, voici la stratégie recommandée, modulée selon la volumétrie attendue du projet.

### **4.1. Arbre de Décision Basé sur la Volumétrie**

| Critère | Stratégie B : Client-Side (JSON) | Stratégie C : Hybride (Server-Side) |
| :---- | :---- | :---- |
| **Seuil de Volume** | **\< 2 000 Documents** | **\> 2 000 Documents** |
| **Latence Perçue** | Instantanée (\< 10ms) | Dépendante du réseau (\~100-300ms) |
| **Charge Base de Données** | Nulle (Fichiers statiques) | Linéaire (1 requête par recherche) |
| **Coût Infrastructure** | Très Faible (Bande passante CDN) | Variable (Temps CPU Workers \+ Lectures D1) |
| **Complexité Code** | Moyenne (Gestion Index \+ Fuse.js) | Élevée (Suspense, FTS5, Debounce) |
| **Fraîcheur Données** | Dépend du re-build/ISR (ex: 1h) | Temps réel (Toujours à jour) |

### **4.2. Scénario Recommandé : L'Approche Hybride Progressive**

Pour un projet visant la scalabilité et la robustesse, l'approche **Hybride** (Stratégie C) est la plus pérenne, car elle ne souffre pas de limite dure sur la taille du catalogue. Cependant, pour garantir l'aspect "Instantané" (EF4) malgré la latence de D1, elle doit être implémentée avec une rigueur extrême.

#### **Architecture du Composant de Recherche**

L'implémentation doit dissocier la barre de recherche (Client Component) de l'affichage des résultats (Server Component), reliés par l'URL via Nuqs.  
1\. Le Contrôleur Client (Barre de Recherche) :  
Ce composant utilise nuqs pour gérer l'entrée utilisateur. Il est crucial d'utiliser l'option shallow: false (ou une navigation via router) combinée à un throttle ou debounce pour limiter la fréquence des requêtes serveur.

TypeScript

// components/SearchBar.tsx  
'use client';  
import { useQueryState, parseAsString } from 'nuqs';

export function SearchBar() {  
  const \[query, setQuery\] \= useQueryState('q', parseAsString  
   .withDefault('')  
   .withOptions({  
      shallow: false, // Déclenche une mise à jour serveur  
      throttleMs: 300, // Limite la fréquence des requêtes (Anti-Surcharge)  
      history: 'replace' // Évite de polluer l'historique navigateur  
    })  
  );

  return (  
    \<input  
      value={query}  
      onChange={e \=\> setQuery(e.target.value |

| null)}  
      placeholder="Rechercher..."  
    /\>  
  );  
}

27  
2\. La Page Serveur (Static Shell) :  
La page principale doit rester statique autant que possible. Elle ne doit pas consommer directement les searchParams pour éviter le "bailout" global. Elle délègue cette responsabilité à un composant enfant isolé via Suspense.

TypeScript

// app/page.tsx  
import { Suspense } from 'react';  
import { SearchBar } from '@/components/SearchBar';  
import { SearchResults } from '@/components/SearchResults';  
import { ResultsSkeleton } from '@/components/ResultsSkeleton';

// searchParams est une Promise en Next.js 15  
type PageProps \= {  
  searchParams: Promise\<{ q?: string }\>;  
};

export default async function Page({ searchParams }: PageProps) {  
  // Extraction sécurisée de la clé pour Suspense  
  const { q } \= await searchParams;  
  const queryKey \= q |

| 'default';

  return (  
    \<main\>  
      \<header\>  
        \<h1\>Catalogue\</h1\> {/\* Rendu statique (Static Shell) \*/}  
        \<SearchBar /\>  
      \</header\>  
        
      {/\* Isolation du rendu dynamique \*/}  
      \<Suspense key={queryKey} fallback={\<ResultsSkeleton /\>}\>  
        \<SearchResults query={q} /\>  
      \</Suspense\>  
    \</main\>  
  );  
}

Ce pattern assure que le header et le layout sont envoyés instantanément (ENF2), tandis que les résultats chargent en parallèle.6  
3\. Le Consommateur Serveur (Résultats) :  
C'est ici que la logique métier réside. Ce composant interroge Payload/D1.

TypeScript

// components/SearchResults.tsx  
import { getPayload } from 'payload';  
import config from '@payload-config';  
import { searchParamsCache } from '@/lib/searchParams'; // Nuqs server cache

export async function SearchResults({ query }: { query?: string }) {  
  // Validation des params côté serveur  
  const parsedQuery \= searchParamsCache.parse({ q: query }).q;  
    
  if (\!parsedQuery) return null;

  const payload \= await getPayload({ config });  
    
  // Appel optimisé à la base de données (voir section D1 FTS5)  
  const results \= await payload.find({  
    collection: 'posts',  
    where: {  
       // Logique de recherche (idéalement déléguée à une vue SQL FTS5)  
    }  
  });

  return \<List items={results.docs} /\>;  
}

10  
---

## **5\. Optimisation Avancée : Cloudflare D1 et Full-Text Search (FTS5)**

Pour que la stratégie hybride soit performante, l'optimisation de la couche de données est non-négociable. La latence inhérente aux Workers Cloudflare nécessite que la requête SQL soit exécutée en quelques millisecondes.

### **5.1. Migration vers FTS5 sur D1**

Comme identifié, Drizzle ORM ne gère pas nativement les tables virtuelles FTS5. Il est impératif de contourner cette limitation pour éviter les scans de table lents (LIKE).  
**Protocole de mise en œuvre FTS5 :**

1. Ne déclarez pas la table FTS5 dans le fichier schema.ts de Drizzle (car Drizzle tenterait de créer une table standard).  
2. Créez un fichier de migration SQL manuel (ex: migrations/0001\_add\_fts.sql) contenant les instructions brutes :

SQL

\-- Création de la table virtuelle FTS5  
CREATE VIRTUAL TABLE posts\_fts USING fts5(  
    title,   
    content,   
    slug,   
    content='posts', \-- Contenu externe (Contentless table ou External Content)  
    content\_rowid='id'  
);

\-- Triggers pour la synchronisation automatique (Crucial pour Payload)  
CREATE TRIGGER posts\_ai AFTER INSERT ON posts BEGIN  
  INSERT INTO posts\_fts(rowid, title, content, slug) VALUES (new.id, new.title, new.content, new.slug);  
END;  
CREATE TRIGGER posts\_ad AFTER DELETE ON posts BEGIN  
  INSERT INTO posts\_fts(posts\_fts, rowid, title, content, slug) VALUES('delete', old.id, old.title, old.content, old.slug);  
END;  
CREATE TRIGGER posts\_au AFTER UPDATE ON posts BEGIN  
  INSERT INTO posts\_fts(posts\_fts, rowid, title, content, slug) VALUES('delete', old.id, old.title, old.content, old.slug);  
  INSERT INTO posts\_fts(rowid, title, content, slug) VALUES (new.id, new.title, new.content, new.slug);  
END;

Cette configuration permet à Payload d'écrire dans la table posts standard via Drizzle, tandis que SQLite gère automatiquement la mise à jour de l'index de recherche en arrière-plan.19

### **5.2. Interrogation FTS5 via Drizzle**

Pour interroger cet index depuis Payload ou une Server Action, utilisez l'opérateur sql de Drizzle pour exécuter une requête brute optimisée :

TypeScript

import { sql } from 'drizzle-orm';

// Dans votre fonction de recherche  
const searchResults \= await db.run(  
  sql\`SELECT \* FROM posts\_fts WHERE posts\_fts MATCH ${sanitizedQuery} ORDER BY rank\`  
);

Cette méthode exploite la puissance native de SQLite, garantissant des temps de réponse de l'ordre de 1 à 10ms, compensant ainsi la latence réseau.18  
---

## **6\. Synthèse des Recommandations et Plan d'Intégration**

### **6.1. Tableau Comparatif des Impacts**

| Dimension | Approche Standard (Full Server) | Approche Recommandée (Hybride Nuqs+FTS) |
| :---- | :---- | :---- |
| **Expérience Utilisateur** | Rechargements visibles, latence élevée. | Navigation fluide, feedback visuel immédiat (Skeleton). |
| **Performance (CWV)** | FCP/LCP dégradés (blocage serveur). | FCP optimal (Static Shell), LCP rapide (Streaming). |
| **Cache (Next.js)** | Route entière "Dynamique" (Opt-out). | Route "Statique" avec trous dynamiques (PPR). |
| **Base de Données** | Surcharge possible (Thundering Herd). | Requêtes optimisées (FTS5) et limitées (Debounce). |

### **6.2. Feuille de Route Technique**

1. **Initialisation Nuqs :** Installer nuqs et configurer le NuqsAdapter dans le layout.tsx racine pour activer l'intégration avec le routeur Next.js.28  
2. **Refactoring Page :** Restructurer la page de recherche pour isoler les composants dépendants des searchParams derrière des frontières Suspense.  
3. **Migration Base de Données :** Implémenter les migrations SQL manuelles pour activer FTS5 sur la base D1 de production.  
4. **Optimisation Payload :** Créer un endpoint ou une Server Action dédiée qui interroge la table virtuelle FTS5 au lieu de passer par l'abstraction standard payload.find si la performance l'exige.

### **6.3. Conclusion**

L'architecture hybride proposée, combinant **Nuqs** pour la gestion d'état d'URL, **Suspense** pour le rendu progressif, et **SQLite FTS5** pour la performance brute, constitue la réponse la plus robuste aux exigences contradictoires du PRD. Elle permet de respecter l'impératif de cache agressif pour la structure globale du site tout en offrant une expérience de recherche riche et performante, sans sacrifier la scalabilité future du projet. Si le volume de contenu reste modeste (\< 2000 articles), l'option "Client-Side" reste une alternative valide et plus simple à mettre en œuvre, mais l'option hybride est le standard industriel pour les applications Next.js modernes.

#### **Sources des citations**

1. Guides: Caching \- Next.js, consulté le novembre 26, 2025, [https://nextjs.org/docs/app/guides/caching](https://nextjs.org/docs/app/guides/caching)  
2. Static and Dynamic Rendering \- App Router \- Next.js, consulté le novembre 26, 2025, [https://nextjs.org/learn/dashboard-app/static-and-dynamic-rendering](https://nextjs.org/learn/dashboard-app/static-and-dynamic-rendering)  
3. Getting Started: Partial Prerendering \- Next.js, consulté le novembre 26, 2025, [https://nextjs.org/docs/15/app/getting-started/partial-prerendering](https://nextjs.org/docs/15/app/getting-started/partial-prerendering)  
4. Functions: generateStaticParams \- Next.js, consulté le novembre 26, 2025, [https://nextjs.org/docs/app/api-reference/functions/generate-static-params](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)  
5. Functions: useSearchParams | Next.js, consulté le novembre 26, 2025, [https://nextjs.org/docs/app/api-reference/functions/use-search-params](https://nextjs.org/docs/app/api-reference/functions/use-search-params)  
6. Missing Suspense boundary with useSearchParams \- Next.js, consulté le novembre 26, 2025, [https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout](https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout)  
7. Getting Started: Cache Components \- Next.js, consulté le novembre 26, 2025, [https://nextjs.org/docs/app/getting-started/cache-components](https://nextjs.org/docs/app/getting-started/cache-components)  
8. Local API | Documentation \- Payload CMS, consulté le novembre 26, 2025, [https://payloadcms.com/docs/local-api/overview](https://payloadcms.com/docs/local-api/overview)  
9. How to Speed Up Your Payload CMS Site With unstable\_cache | Build with Matija, consulté le novembre 26, 2025, [https://www.buildwithmatija.com/blog/how-to-speed-up-your-payload-cms-site-with-unstable\_cache](https://www.buildwithmatija.com/blog/how-to-speed-up-your-payload-cms-site-with-unstable_cache)  
10. How do i use the local api with tag revalidation in next 30 beta \- Payload CMS, consulté le novembre 26, 2025, [https://payloadcms.com/community-help/discord/how-do-i-use-the-local-api-with-tag-revalidation-in-next-30-beta](https://payloadcms.com/community-help/discord/how-do-i-use-the-local-api-with-tag-revalidation-in-next-30-beta)  
11. Getting Started: Caching and Revalidating \- Next.js, consulté le novembre 26, 2025, [https://nextjs.org/docs/app/getting-started/caching-and-revalidating](https://nextjs.org/docs/app/getting-started/caching-and-revalidating)  
12. Is unstable\_cache still the best way to cache Payload data? : r/PayloadCMS \- Reddit, consulté le novembre 26, 2025, [https://www.reddit.com/r/PayloadCMS/comments/1m95mrb/is\_unstable\_cache\_still\_the\_best\_way\_to\_cache/](https://www.reddit.com/r/PayloadCMS/comments/1m95mrb/is_unstable_cache_still_the_best_way_to_cache/)  
13. Journey to Optimize Cloudflare D1 Database Queries | Hacker News, consulté le novembre 26, 2025, [https://news.ycombinator.com/item?id=43572511](https://news.ycombinator.com/item?id=43572511)  
14. D1 latency from worker high \- Cloudflare Community, consulté le novembre 26, 2025, [https://community.cloudflare.com/t/d1-latency-from-worker-high/582711](https://community.cloudflare.com/t/d1-latency-from-worker-high/582711)  
15. Cloudflare Pages \+ D1 has way higher latency than expected \- Developers, consulté le novembre 26, 2025, [https://community.cloudflare.com/t/cloudflare-pages-d1-has-way-higher-latency-than-expected/728285](https://community.cloudflare.com/t/cloudflare-pages-d1-has-way-higher-latency-than-expected/728285)  
16. Benchmarks \- Drizzle ORM, consulté le novembre 26, 2025, [https://orm.drizzle.team/benchmarks](https://orm.drizzle.team/benchmarks)  
17. Realistic evaluation of FTS5 overhead compared to LIKE : r/sqlite \- Reddit, consulté le novembre 26, 2025, [https://www.reddit.com/r/sqlite/comments/1434mgl/realistic\_evaluation\_of\_fts5\_overhead\_compared\_to/](https://www.reddit.com/r/sqlite/comments/1434mgl/realistic_evaluation_of_fts5_overhead_compared_to/)  
18. delucis/astro-db-fts: Example of using SQLite FTS5 with Astro DB \- GitHub, consulté le novembre 26, 2025, [https://github.com/delucis/astro-db-fts](https://github.com/delucis/astro-db-fts)  
19. How can I create a virtual table with sqlite? \- Drizzle Team \- Answer Overflow, consulté le novembre 26, 2025, [https://www.answeroverflow.com/m/1146392232509833256](https://www.answeroverflow.com/m/1146392232509833256)  
20. \[FEATURE\]: sqlite CREATE VIRTUAL TABLE and R\*Tree extension · Issue \#2046 \- GitHub, consulté le novembre 26, 2025, [https://github.com/drizzle-team/drizzle-orm/issues/2046](https://github.com/drizzle-team/drizzle-orm/issues/2046)  
21. Benchmark against competition · Issue \#136 \- GitHub, consulté le novembre 26, 2025, [https://github.com/tinysearch/tinysearch/issues/136](https://github.com/tinysearch/tinysearch/issues/136)  
22. Maximum json size for response to the browser \- Stack Overflow, consulté le novembre 26, 2025, [https://stackoverflow.com/questions/8937516/maximum-json-size-for-response-to-the-browser](https://stackoverflow.com/questions/8937516/maximum-json-size-for-response-to-the-browser)  
23. A Deep Dive into Fuse.js: Advanced Use Cases and Benchmarking \- DEV Community, consulté le novembre 26, 2025, [https://dev.to/koushikmaratha/a-deep-dive-into-fusejs-advanced-use-cases-and-benchmarking-357p](https://dev.to/koushikmaratha/a-deep-dive-into-fusejs-advanced-use-cases-and-benchmarking-357p)  
24. fuse.js takes 10+ seconds with semi-long queries \- Stack Overflow, consulté le novembre 26, 2025, [https://stackoverflow.com/questions/70984437/fuse-js-takes-10-seconds-with-semi-long-queries](https://stackoverflow.com/questions/70984437/fuse-js-takes-10-seconds-with-semi-long-queries)  
25. Filtering and Search, Client-Side vs. Server-Side | by Erik Minasian | Medium, consulté le novembre 26, 2025, [https://medium.com/@eminasian/filtering-and-search-client-side-vs-server-side-a9084bbcbf74](https://medium.com/@eminasian/filtering-and-search-client-side-vs-server-side-a9084bbcbf74)  
26. Client side vs Server side search : r/nextjs \- Reddit, consulté le novembre 26, 2025, [https://www.reddit.com/r/nextjs/comments/191oa4f/client\_side\_vs\_server\_side\_search/](https://www.reddit.com/r/nextjs/comments/191oa4f/client_side_vs_server_side_search/)  
27. Why You Should Use nuqs: Smarter URL State Management for React & Next.js \- Medium, consulté le novembre 26, 2025, [https://medium.com/@ruverd/why-you-should-use-nuqs-smarter-url-state-management-for-react-next-js-26a8b51ca1ac](https://medium.com/@ruverd/why-you-should-use-nuqs-smarter-url-state-management-for-react-next-js-26a8b51ca1ac)  
28. 47ng/nuqs: Type-safe search params state manager for React frameworks \- Like useState, but stored in the URL query string. \- GitHub, consulté le novembre 26, 2025, [https://github.com/47ng/nuqs](https://github.com/47ng/nuqs)  
29. Managing search parameters in Next.js with nuqs \- LogRocket Blog, consulté le novembre 26, 2025, [https://blog.logrocket.com/managing-search-parameters-next-js-nuqs/](https://blog.logrocket.com/managing-search-parameters-next-js-nuqs/)  
30. Server-Side usage \- nuqs, consulté le novembre 26, 2025, [https://nuqs.dev/docs/server-side](https://nuqs.dev/docs/server-side)  
31. Next.js 16 cache components: How to retrigger Suspense boundary when searchParams change? : r/nextjs \- Reddit, consulté le novembre 26, 2025, [https://www.reddit.com/r/nextjs/comments/1oi2062/nextjs\_16\_cache\_components\_how\_to\_retrigger/](https://www.reddit.com/r/nextjs/comments/1oi2062/nextjs_16_cache_components_how_to_retrigger/)  
32. How to update query param in Next js 14 app directory like \- Stack Overflow, consulté le novembre 26, 2025, [https://stackoverflow.com/questions/77896076/how-to-update-query-param-in-next-js-14-app-directory-like-input-type-text-on](https://stackoverflow.com/questions/77896076/how-to-update-query-param-in-next-js-14-app-directory-like-input-type-text-on)  
33. SQLite FTS5 Extension, consulté le novembre 26, 2025, [https://sqlite.org/fts5.html](https://sqlite.org/fts5.html)  
34. Getting started with SQLite Full-text Search By Examples, consulté le novembre 26, 2025, [https://www.sqlitetutorial.net/sqlite-full-text-search/](https://www.sqlitetutorial.net/sqlite-full-text-search/)