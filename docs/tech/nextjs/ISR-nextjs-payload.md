# **Rapport d'Analyse Architecturale : Optimisation de la Régénération Statique Incrémentale (ISR) via Next.js et Payload CMS**

## **1. Introduction : Le Paradigme de la Haute Fréquence dans le Jamstack**

L'évolution des architectures web découplées, souvent regroupées sous le terme "Jamstack" ou "Architecture Composable", a atteint un point d'inflexion critique. Historiquement, la promesse de ces architectures reposait sur la pré-génération statique (Static Site Generation - SSG), offrant des performances de lecture inégalées et une sécurité accrue. Cependant, ce modèle souffrait d'une rigidité inhérente : le temps de compilation augmentait linéairement avec le nombre de pages, rendant les mises à jour de contenu lentes et coûteuses pour les grands corpus documentaires.  
L'avènement de la Régénération Statique Incrémentale (ISR) a introduit une souplesse nécessaire, permettant de mettre à jour des pages individuelles sans reconstruire l'intégralité du site. Néanmoins, l'approche traditionnelle de l'ISR, basée sur une invalidation temporelle (Time-Based Revalidation, ex: revalidate: 60), présente une limitation majeure pour les exigences modernes de "Time-to-Value" (TTV) : elle introduit une fenêtre de latence durant laquelle l'utilisateur final continue de consommer un contenu périmé, même après qu'une modification a été validée dans le CMS.  
Le présent rapport analyse une architecture spécifique conçue pour éliminer cette latence et garantir un TTV inférieur à 60 secondes. Cette architecture repose sur une inversion de contrôle : l'abandon de l'invalidation temporelle au profit d'une **invalidation événementielle stricte** (On-Demand Revalidation). Elle s'articule autour de trois piliers technologiques :

1. **Next.js (App Router)** : Utilisé pour son système de cache de données agressif (unstable_cache / use cache).  
2. **Payload CMS (v3.0)** : Agissant comme la source de vérité et le chef d'orchestre des événements de changement (afterChange).  
3. **L'Infrastructure de Cache** : Le mécanisme de propagation et de cohérence, particulièrement critique dans les environnements distribués comme le Edge.

L'analyse qui suit décompose chaque couche de cette "stack", explorant les mécanismes internes, les défis de synchronisation, et les stratégies avancées pour garantir que la promesse de performance ne se fasse pas au détriment de la fraîcheur des données.  
---

## **2. Architecture de Mise en Cache dans Next.js : Mécanismes et Évolution**

Pour comprendre comment garantir la fraîcheur du contenu, il est impératif de disséquer le fonctionnement du *Data Cache* de Next.js. Contrairement aux caches HTTP traditionnels (CDN) qui opèrent sur les réponses complètes, le Data Cache de Next.js opère au niveau des fonctions et des requêtes de données, permettant une granularité fine indispensable à l'ISR moderne.

### **2.1 La Persistance Agressive : De unstable_cache à use cache**

L'architecture proposée repose sur une utilisation "agressive" du cache. Dans ce contexte, "agressif" signifie que la durée de vie (TTL) des données mises en cache est définie théoriquement à l'infini (revalidate: false ou Infinity). Le système ne doit jamais invalider le cache de lui-même ; il attend un signal explicite.

#### **2.1.1 Le Fonctionnement de unstable_cache**

La fonction unstable_cache a été le pivot de cette stratégie dans les versions Next.js 13 et 14. Elle permet d'envelopper n'importe quelle opération asynchrone coûteuse (comme une requête base de données via l'API locale de Payload) pour en mémoriser le résultat.  
Le mécanisme interne repose sur la sérialisation des entrées (arguments) et de la sortie.

| Composant | Rôle dans le Cache |
| :---- | :---- |
| **Clé Composite** | Une combinaison des keyParts (arguments explicites) et d'un hachage de la fonction elle-même assure l'unicité de l'entrée. |
| **Tags (Balises)** | Les métadonnées cruciales pour l'invalidation. Contrairement aux clés, les tags permettent de grouper des entrées disparates (ex: tous les articles d'un auteur) pour une purge collective. |
| **Sérialisation** | unstable_cache impose que les données retournées soient sérialisables en JSON. Cela exclut les instances de classes complexes ou les fonctions, une limitation importante lors de l'interaction avec des ORM ou des CMS retournant des objets riches. |

L'utilisation de unstable_cache garantit que l'appel à la base de données de Payload n'est effectué qu'une seule fois par déploiement, tant qu'aucune invalidation n'est demandée. Pour une architecture visant un TTV < 60s, c'est la première moitié de l'équation : la performance de lecture est maximale car servie depuis le système de fichiers ou un stockage clé-valeur (KV).

#### **2.1.2 La Transition vers la Directive use cache**

Avec l'arrivée de Next.js 15, unstable_cache est marqué comme "Legacy" 3, remplacé par la directive use cache. Cette évolution n'est pas seulement syntaxique ; elle modifie profondément l'architecture sous-jacente.

* **Intégration au Compilateur** : use cache est une directive de compilateur (similaire à use client ou use server). Elle permet à Next.js de comprendre l'arbre de dépendances des données automatiquement.  
* **Sérialisation Avancée** : Contrairement à la limite JSON de unstable_cache, use cache utilise le format de sérialisation des *React Server Components* (Flight Data). Cela permet de mettre en cache des structures plus complexes, y compris des éléments JSX pré-rendus, ce qui peut encore accélérer le rendu final.2  
* **Capture Automatique des Scopes** : Là où unstable_cache exigeait de passer manuellement toutes les dépendances dans le tableau keyParts (source fréquente de bugs si une variable externe était oubliée), use cache capture automatiquement les variables de la fermeture (closure), garantissant que la clé de cache est toujours correcte par rapport aux données utilisées.

**Implication pour le Projet** : Bien que la demande mentionne unstable_cache, une architecture pérenne doit prévoir la migration vers use cache. Cela simplifiera le code d'intégration avec Payload en supprimant la gestion manuelle des clés, tout en conservant la logique de tags (cacheTag) qui reste identique.

### **2.2 Granularité et Taxonomie des Tags**

L'efficacité de l'invalidation "On-Demand" repose entièrement sur la qualité de la taxonomie des tags. Une mauvaise stratégie de taggage conduit soit à du contenu périmé (sous-invalidation), soit à une surcharge du serveur (sur-invalidation).  
Dans le contexte de Payload CMS, nous identifions trois niveaux de tags nécessaires pour une précision chirurgicale :

1. **Tags de Collection (Global)** :  
   * *Format* : collection-[slug] (ex: collection-posts).  
   * *Usage* : Invalider les listes, les pages d'index, les flux RSS. Une création ou suppression de document doit déclencher ce tag.  
2. **Tags de Document (Spécifique)** :  
   * *Format* : [collection]-[id] (ex: post-12345) ou [collection]-[slug] (ex: post-mon-article).  
   * *Usage* : Invalider la page de détail d'un document spécifique. Une mise à jour de contenu (correction de typo) ne doit déclencher que ce tag.  
3. **Tags Relationnels (Graph)** :  
   * *Format* : relation-[id] (ex: author-987).  
   * *Usage* : Si un document "Auteur" est modifié, tous les "Articles" référençant cet auteur doivent être invalidés. C'est ici que réside la complexité : Payload doit savoir quels caches dépendent de l'auteur.

L'utilisation agressive du cache impose que *chaque* requête de données soit taguée. Une requête sans tag dans un système à cache infini devient une donnée "zombie" : impossible à tuer (invalider) sans redéployer l'application ou vider l'intégralité du cache.  
---

## **3. Payload CMS v3.0 : Le Moteur d'Orchestration**

Payload CMS v3.0 introduit un changement paradigmatique en permettant son exécution native au sein de l'application Next.js, éliminant le besoin d'un serveur Express séparé. Cette fusion architecturale est le catalyseur qui permet d'atteindre les objectifs de performance.

### **3.1 L'API Locale : Suppression de la Latence Réseau**

Dans une architecture CMS headless classique ("tête coupée"), le frontend (Next.js) communique avec le backend (CMS) via HTTP (REST ou GraphQL). Même sur un réseau interne rapide, cette communication implique :

1. Sérialisation de la requête.  
2. Handshake TCP/TLS.  
3. Latence réseau.  
4. Désérialisation et authentification sur le serveur CMS.  
5. Exécution de la requête DB.  
6. Sérialisation de la réponse et retour.

Avec l'**API Locale** de Payload (payload.find, payload.findByID), intégrée directement dans les Server Components ou les fonctions de cache de Next.js, les étapes 1, 2, 3, 4 et 6 sont éliminées ou drastiquement réduites.6  
L'appel à payload.find() est une invocation de fonction JavaScript directe qui exécute la requête Mongoose ou Drizzle (ORM) contre la base de données.  
Gain de TTV : En supprimant la latence HTTP (souvent 50-200ms par requête interne), on réduit le temps de génération initial de la page (le "MISS" du cache). Cela signifie que lorsqu'une invalidation se produit, la régénération de la page est beaucoup plus rapide, réduisant la fenêtre pendant laquelle le serveur est sous charge.

### **3.2 Le Cycle de Vie des Hooks : afterChange**

Le pivot de l'invalidation est le Hook afterChange. C'est le seul endroit où l'application a une connaissance contextuelle complète : "Qu'est-ce qui a changé?", "Quelle était l'ancienne valeur?", "Quelle est la nouvelle valeur?".

#### **3.2.1 Analyse du Flux d'Exécution**

Le Hook afterChange reçoit un objet contenant doc (nouveau document), previousDoc (ancien document), et req (la requête).7  
Une implémentation naïve invaliderait le cache à chaque exécution du hook. Cependant, pour une architecture robuste, une logique conditionnelle complexe est requise, notamment pour gérer les états de publication.  
Le Défi des "Drafts" (Brouillons) :  
Payload gère un système de versions. Lorsqu'un utilisateur clique sur "Sauvegarder en brouillon", le hook afterChange est déclenché.

* *Problème* : Si nous invalidons le cache public (SSR) sur une sauvegarde de brouillon, le site public risque d'afficher des données incomplètes ou de planter si le brouillon brise des contrats de type. Ou pire, il régénère la page avec les *anciennes* données publiques (car le brouillon n'est pas public), gaspillant des ressources de calcul (rebuild inutile).  
* *Solution* : Le hook doit vérifier strictement le champ _status. L'invalidation ne doit être déclenchée que si :  
  1. Le document passe de l'état draft à published.  
  2. Le document est déjà published et une modification est sauvegardée directement.  
  3. Le document passe de published à archived (dépublication).

Une subtilité identifiée dans les discussions techniques 9 est la difficulté de détecter la transition exacte "Draft -> Published" car previousDoc peut pointer vers la dernière version sauvegardée (qui était peut-être déjà un brouillon) et non la version publiée en ligne. L'accès au contexte de la requête (req.context) ou la comparaison avec les versions en base de données peut être nécessaire pour une précision absolue.

#### **3.2.2 La Problématique de la Transaction Database**

Un point critique pour le TTV < 60s est la **condition de course (Race Condition)** entre la transaction de base de données et l'invalidation du cache.
Séquence potentiellement problématique :

1. Payload initie une transaction DB pour sauvegarder le post.  
2. Le Hook afterChange est déclenché *à l'intérieur* ou juste avant la fin de la transaction.  
3. Le Hook appelle revalidateTag('posts').  
4. Next.js reçoit l'ordre d'invalidation.  
5. Next.js déclenche immédiatement une régénération en arrière-plan (si une requête arrive).  
6. La fonction de régénération appelle payload.find().  
7. **Risque** : Si la transaction de l'étape 1 n'est pas encore "commited" (validée) au niveau de la base de données, la lecture de l'étape 6 peut récupérer l'ancienne donnée (isolation des transactions).  
8. Résultat : Le cache est mis à jour avec... la vieille donnée. L'invalidation a échoué silencieusement.

Pour atténuer ce risque, Payload propose des hooks afterOperation ou l'utilisation de req.transaction pour s'assurer que les effets de bord (side effects) comme l'invalidation ne se produisent qu'après le commit réussi. Alternativement, le modèle "Stale-While-Revalidate" de Next.js ajoute souvent un léger délai naturel qui masque ce problème, mais dans des systèmes à haute performance, l'utilisation de hooks afterCommit (proposés ou simulés) est recommandée.  
---

## **4. Stratégie d'Intégration et Cohérence des Données**

L'intégration entre Next.js et Payload ne se limite pas à des appels de fonctions ; c'est une synchronisation d'états distribués.

### **4.1 Implémentation du Modèle de Revalidation**

Pour garantir le contrat de fraîcheur, le code d'intégration doit être robuste. Voici une structure de référence pour le hook d'invalidation, intégrant les meilleures pratiques identifiées.

#### **Tableau de Décision d'Invalidation**

| État Précédent | Nouvel État | Action Cache | Justification |
| :---- | :---- | :---- | :---- |
| N/A (Création) | Published | revalidateTag('collection') | Nouvel élément dans les listes. |
| Draft | Draft | Aucune | Changement invisible au public. |
| Published | Published | revalidateTag('doc-id'), revalidateTag('collection') | Mise à jour de contenu visible. |
| Published | Draft/Archived | revalidateTag('doc-id'), revalidateTag('collection') | Retrait de contenu (404 ou masquage). |
| Draft | Published | revalidateTag('doc-id'), revalidateTag('collection') | Publication (mise en ligne). |

Cette logique doit être codée dans un utilitaire partagé pour éviter la duplication et les erreurs humaines.

### **4.2 L'Impact des Relations (Cascading Invalidation)**

Lorsque le projet utilise des relations (ex: champs relationship ou upload dans Payload), la notion de "fraîcheur" s'étend. Si une image est mise à jour dans la médiathèque, toutes les pages utilisant cette image doivent-elles être régénérées?  
Avec l'utilisation agressive (unstable_cache), la réponse est **oui**. Si l'URL de l'image ne change pas mais que son contenu change (remplacement de fichier), le CDN peut servir la nouvelle image, mais si Next.js a mis en cache les métadonnées de l'image (alt text, dimensions pour next/image), ces métadonnées seront périmées.  
Le hook afterChange de la collection media doit donc potentiellement invalider des tags globaux ou faire une recherche inversée (reverse lookup) pour trouver quels documents utilisent ce média. C'est une opération coûteuse. Une stratégie plus performante consiste à versionner les URLs des assets, rendant l'invalidation du contenu HTML moins critique pour les changements de médias purement visuels.  
---

## **5. Infrastructure et Distribution : Le Défi Cloudflare / OpenNext**

C'est ici que l'analyse devient critique. Si le projet est déployé sur Vercel, l'infrastructure gère nativement la cohérence du cache via un système propriétaire. Cependant, de nombreux projets Payload/Next.js migrent vers des architectures auto-hébergées ou basées sur **OpenNext** (pour déployer sur AWS Lambda ou Cloudflare Workers) pour des raisons de coût et de contrôle.  
Le déploiement sur **Cloudflare Workers** via OpenNext introduit un défi technique majeur pour la garantie "< 60s Time-to-Value" : la **cohérence éventuelle** (Eventual Consistency) du stockage KV.

### **5.1 Le Problème de la Cohérence KV**

Par défaut, OpenNext sur Cloudflare utilise **Workers KV** pour stocker les pages mises en cache (HTML/JSON).

* **Performance** : KV est extrêmement rapide en lecture (Edge caching).  
* **Limitation** : KV est "eventually consistent". Lorsqu'une clé est écrite (mise à jour du cache après revalidation), la propagation de ce changement à tous les nœuds du réseau mondial de Cloudflare peut prendre jusqu'à **60 secondes**.

**Scénario de Périphérie** :

1. Un éditeur modifie un article (Hook afterChange déclenché).  
2. Le hook appelle revalidateTag.  
3. Le serveur (ou Worker) régénère la page et écrit le nouveau HTML dans KV.  
4. Un utilisateur à Tokyo demande la page 10 secondes plus tard.  
5. À cause de la latence de propagation KV, le nœud de Tokyo voit encore l'ancienne valeur dans KV.  
6. L'utilisateur reçoit l'ancienne page.

Ce scénario viole le contrat de fraîcheur immédiate souvent attendu après une action explicite de revalidation.

### **5.2 La Solution Architecturale : Le "Tag Cache" D1 / Durable Objects**

Pour résoudre ce problème, OpenNext a développé une architecture de cache à deux niveaux, distinguant le stockage du contenu (Incremental Cache) du stockage de l'état de validité (Tag Cache).

#### **L'Architecture de Contournement**

1. **Incremental Cache (Le Contenu)** : Stocké dans **R2** (Object Storage) ou KV. R2 est souvent préféré pour éviter les limites de taille de KV et réduire les coûts, bien qu'il soit légèrement plus lent (compensé par un cache mémoire local).  
2. **Tag Cache (La Vérité)** : Stocké dans **D1** (Base de données SQL distribuée de Cloudflare) ou des **Durable Objects**.  
   * *Propriété Clé* : D1 et les Durable Objects offrent une **cohérence forte** (strong consistency) ou séquentielle. Une écriture est immédiatement visible par les lectures suivantes qui utilisent le même contexte de session.

#### **Le Flux de Lecture Optimisé**

Lorsqu'une requête arrive pour une page utilisant unstable_cache avec des tags :

1. **Vérification des Tags (Strong Consistency)** : Le système consulte d'abord le *Tag Cache* (D1/DO) pour récupérer le timestamp de la dernière invalidation ("Quand le tag posts a-t-il été invalidé pour la dernière fois?").  
2. **Vérification du Contenu** : Il récupère l'entrée de cache (HTML) depuis l'Incremental Cache (KV/R2). Ce fichier contient des métadonnées, notamment sa date de génération (lastModified).  
3. **Comparaison Logique** :  
   * Si Timestamp_Invalidation_Tag > Timestamp_Generation_Fichier : Le fichier est déclaré **PÉRIMÉ (Stale)**, même si le KV le renvoie comme "actuel".  
   * Le système force alors une régénération immédiate (appel à Payload), ignorant le contenu du cache KV/R2.

Grâce à ce mécanisme ingénieux, le système ne dépend pas de la vitesse de propagation du KV pour la *validité*, mais uniquement pour la *disponibilité*. L'état de validité est, lui, propagé instantanément via D1/DO.

### **5.3 Configuration Recommandée pour TTV < 60s sur Cloudflare**

Basé sur les recherches techniques 13, la configuration optimale pour ce projet sur OpenNext est :

| Composant | Technologie Recommandée | Justification |
| :---- | :---- | :---- |
| **Incremental Cache** | **R2** (+ Cache Régional en Mémoire) | Stockage fiable, moins cher que KV, contourne les limites de taille (2MB/25MB). Le cache régional compense la latence S3. |
| **Tag Cache** | **Durable Objects (DO)** | Offre la latence la plus faible et la meilleure cohérence pour les compteurs d'invalidation. Évite les contentions de verrouillage de D1 sur les très forts trafics. |
| **Queue** | **Durable Objects Queue** | Pour sérialiser les demandes de régénération et éviter l'effet "Thundering Herd" (voir section suivante). |

Cette configuration permet de respecter strictement le TTV < 60s, car l'invalidation (écriture dans le DO) est atomique et immédiate.  
---

## **6. Analyse des Risques et Performance Opérationnelle**

L'implémentation de cette architecture comporte des risques opérationnels qu'il convient de mitiger.

### **6.1 L'Effet "Thundering Herd" (Troupeau en Furie)**

L'invalidation par tag est puissante mais dangereuse. Si un tag global (ex: global-nav) est utilisé sur toutes les pages du site (via le Header/Footer) et qu'il est invalidé (modification d'un lien dans le menu), **l'intégralité du cache du site est marquée comme périmée instantanément**.  
Si le site reçoit 10 000 requêtes/seconde à ce moment précis :

1. Les 10 000 requêtes constatent que le cache est périmé.  
2. Sans protection, elles pourraient toutes tenter de régénérer les pages simultanément, pilonnant l'API Locale de Payload et la base de données.

**Stratégie de Mitigation** :

* **Stale-While-Revalidate** : Next.js est conçu pour servir la version périmée *une dernière fois* tout en déclenchant *une seule* régénération en arrière-plan.
* **OpenNext Queue** : L'utilisation de la file d'attente (Queue) mentionnée supra est vitale ici. Elle déduplique les demandes de régénération. Si 100 requêtes demandent la régénération de la page "Accueil", une seule tâche est ajoutée à la file.

### **6.2 Sécurité des Données Cachées**

L'utilisation de unstable_cache stocke le résultat en clair (JSON/HTML) dans le stockage partagé. Il est impératif de ne **jamais** inclure de données spécifiques à un utilisateur (PII, Panier, Préférences) dans une réponse mise en cache via cette méthode.  
Pour le contenu mixte (ex: une page d'article statique avec une barre "Utilisateur connecté"), l'architecture doit utiliser :

* Soit le rendu côté client (Client Components) pour la partie utilisateur, récupérant les données via un fetch séparé non mis en cache.  
* Soit, avec Next.js 15, la directive use cache: private ou les Cookies dynamiques pour sortir du cache partagé.2

### **6.3 Observabilité**

Le débogage de l'ISR est notoirement difficile. Un tag a-t-il été invalidé? Pourquoi la page est-elle toujours ancienne?  
Il est recommandé d'implémenter un système de logs structurés dans le Hook afterChange et d'utiliser les en-têtes de réponse de Next.js (x-nextjs-cache) pour diagnostiquer l'état du cache (HIT, MISS, STALE) en production.  
---

## **7. Synthèse et Recommandations**

L'objectif de garantir un Time-to-Value inférieur à 60 secondes avec une utilisation agressive du cache Next.js est réalisable, mais requiert une rigueur architecturale dépassant la simple configuration par défaut.  
L'analyse conclut sur les recommandations suivantes pour la stack du projet :

1. **Adoption de l'API Locale** : Utiliser exclusivement l'API Locale de Payload dans les fonctions de données de Next.js pour supprimer la latence I/O et maximiser la vitesse de régénération.  
2. **Migration vers use cache** : Préparer la transition de unstable_cache vers use cache pour bénéficier de la sérialisation native React et d'une meilleure stabilité à long terme.  
3. **Rigueur des Hooks** : Implémenter une logique conditionnelle stricte dans afterChange pour gérer les états de publication et éviter les invalidations sur les brouillons.  
4. **Architecture OpenNext (si hors Vercel)** : Si déploiement sur Cloudflare, refuser l'utilisation de KV seul pour les tags. Adopter impérativement le modèle **Incremental Cache (R2) + Tag Cache (Durable Objects)** pour garantir la cohérence immédiate de l'invalidation et respecter le SLA de 60s.  
5. **Granularité des Tags** : Définir une taxonomie de tags précise (Collection vs Document vs Relation) pour minimiser l'impact des invalidations sur la charge serveur.

Cette architecture transforme Payload et Next.js en un système temps-réel hybride, alliant la scalabilité du statique à l'agilité du dynamique, au prix d'une complexité infrastructurelle accrue qu'il convient de maîtriser.

#### **Sources des citations**

1. Functions: unstable_cache | Next.js, consulté le novembre 27, 2025, [https://nextjs.org/docs/app/api-reference/functions/unstable_cache](https://nextjs.org/docs/app/api-reference/functions/unstable_cache)  
2. Directives: use cache | Next.js, consulté le novembre 27, 2025, [https://nextjs.org/docs/app/api-reference/directives/use-cache](https://nextjs.org/docs/app/api-reference/directives/use-cache)  
3. Should I use unstable_cache or "use cache" : r/nextjs - Reddit, consulté le novembre 27, 2025, [https://www.reddit.com/r/nextjs/comments/1hzjuih/should_i_use_unstable_cache_or_use_cache/](https://www.reddit.com/r/nextjs/comments/1hzjuih/should_i_use_unstable_cache_or_use_cache/)  
4. Getting Started: Caching and Revalidating - Next.js, consulté le novembre 27, 2025, [https://nextjs.org/docs/app/getting-started/caching-and-revalidating](https://nextjs.org/docs/app/getting-started/caching-and-revalidating)  
5. How to Speed Up Your Payload CMS Site With unstable_cache | Build with Matija, consulté le novembre 27, 2025, [https://www.buildwithmatija.com/blog/how-to-speed-up-your-payload-cms-site-with-unstable_cache](https://www.buildwithmatija.com/blog/how-to-speed-up-your-payload-cms-site-with-unstable_cache)  
6. Local API | Documentation - Payload CMS, consulté le novembre 27, 2025, [https://payloadcms.com/docs/local-api/overview](https://payloadcms.com/docs/local-api/overview)  
7. Field Hooks | Documentation - Payload CMS, consulté le novembre 27, 2025, [https://payloadcms.com/docs/hooks/fields](https://payloadcms.com/docs/hooks/fields)  
8. Collection Hooks | Documentation - Payload CMS, consulté le novembre 27, 2025, [https://payloadcms.com/docs/hooks/collections](https://payloadcms.com/docs/hooks/collections)  
9. afterChange collection hook and drafts · payloadcms payload · Discussion #4616 - GitHub, consulté le novembre 27, 2025, [https://github.com/payloadcms/payload/discussions/4616](https://github.com/payloadcms/payload/discussions/4616)  
10. Caching - OpenNext, consulté le novembre 27, 2025, [https://opennext.js.org/cloudflare/former-releases/0.3/caching](https://opennext.js.org/cloudflare/former-releases/0.3/caching)  
11. Worker KV is a good product : r/CloudFlare - Reddit, consulté le novembre 27, 2025, [https://www.reddit.com/r/CloudFlare/comments/1isyqpn/worker_kv_is_a_good_product/](https://www.reddit.com/r/CloudFlare/comments/1isyqpn/worker_kv_is_a_good_product/)  
12. How KV works · Cloudflare Workers KV docs, consulté le novembre 27, 2025, [https://developers.cloudflare.com/kv/concepts/how-kv-works/](https://developers.cloudflare.com/kv/concepts/how-kv-works/)  
13. Caching - OpenNext, consulté le novembre 27, 2025, [https://opennext.js.org/cloudflare/caching](https://opennext.js.org/cloudflare/caching)  
14. Perf - OpenNext, consulté le novembre 27, 2025, [https://opennext.js.org/cloudflare/perf](https://opennext.js.org/cloudflare/perf)  
15. Sequential consistency without borders: how D1 implements global read replication, consulté le novembre 27, 2025, [https://blog.cloudflare.com/d1-read-replication-beta/](https://blog.cloudflare.com/d1-read-replication-beta/)  
16. Choosing a data or storage product. · Cloudflare Workers docs, consulté le novembre 27, 2025, [https://developers.cloudflare.com/workers/platform/storage-options/](https://developers.cloudflare.com/workers/platform/storage-options/)