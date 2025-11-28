# Infrastructure Cloudflare - Référence

Ce document centralise les informations de l'infrastructure Cloudflare pour le projet sebcdev-payload.

---

## Ressources Cloudflare

### Worker

| Propriété | Valeur |
|-----------|--------|
| **Name** | `sebcdev-payload` |
| **URL** | `https://sebcdev-payload.<account>.workers.dev` |
| **Compatibility Date** | `2025-11-27` |
| **Compatibility Flags** | `nodejs_compat`, `global_fetch_strictly_public` |

### D1 Database

| Propriété | Valeur |
|-----------|--------|
| **Database Name** | `sebcdev` |
| **Database ID** | `d558666f-e7e9-4ff7-a972-dbc0d8bea923` |
| **Binding** | `D1` |
| **Remote** | `true` |

### R2 Bucket

| Propriété | Valeur |
|-----------|--------|
| **Bucket Name** | `sebcdev-payload-cache` |
| **Binding** | `R2` |
| **Preview Bucket** | `sebcdev-payload-cache` |

---

## Variables d'Environnement

### Requises

| Variable | Description | Où la définir |
|----------|-------------|---------------|
| `PAYLOAD_SECRET` | Secret Payload CMS (32+ chars) | `wrangler secret put PAYLOAD_SECRET` |

### Optionnelles

| Variable | Description | Défaut |
|----------|-------------|--------|
| `CLOUDFLARE_ENV` | Environnement cible | `production` |
| `NODE_ENV` | Mode Node.js | `production` |

### Fichier Local (`.dev.vars`)

Pour le développement local, créer `.dev.vars` à la racine :

```bash
PAYLOAD_SECRET=votre-secret-de-32-caracteres-minimum
```

> **Important** : `.dev.vars` est dans `.gitignore` - ne jamais committer de secrets.

---

## Commandes Essentielles

### Authentification

```bash
# Se connecter à Cloudflare
pnpm wrangler login

# Vérifier l'authentification
pnpm wrangler whoami
```

### Déploiement

```bash
# Déployer en production
pnpm deploy

# Ou manuellement
pnpm wrangler deploy

# Dry-run (validation sans déploiement)
pnpm wrangler deploy --dry-run
```

### Secrets

```bash
# Ajouter un secret
pnpm wrangler secret put PAYLOAD_SECRET

# Lister les secrets
pnpm wrangler secret list

# Supprimer un secret
pnpm wrangler secret delete PAYLOAD_SECRET
```

### Database (D1)

```bash
# Lister les bases de données
pnpm wrangler d1 list

# Exécuter une requête
pnpm wrangler d1 execute sebcdev --command "SELECT name FROM sqlite_master WHERE type='table'"

# Lister les tables Payload
pnpm wrangler d1 execute sebcdev --command "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"

# Appliquer les migrations
pnpm payload migrate
```

### Storage (R2)

```bash
# Lister les buckets
pnpm wrangler r2 bucket list

# Lister les objets dans le bucket
pnpm wrangler r2 object list sebcdev-payload-cache

# Upload un fichier
pnpm wrangler r2 object put sebcdev-payload-cache/test.txt --file=./test.txt
```

### Logs

```bash
# Voir les logs en temps réel
pnpm wrangler tail

# Filtrer par statut
pnpm wrangler tail --status error
```

---

## Configuration Wrangler

Le fichier `wrangler.jsonc` contient la configuration complète :

```jsonc
{
  "name": "sebcdev-payload",
  "main": ".open-next/worker.js",
  "compatibility_date": "2025-11-27",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "d1_databases": [
    {
      "binding": "D1",
      "database_id": "d558666f-e7e9-4ff7-a972-dbc0d8bea923",
      "database_name": "sebcdev",
      "remote": true
    }
  ],
  "r2_buckets": [
    {
      "binding": "R2",
      "bucket_name": "sebcdev-payload-cache"
    }
  ]
}
```

---

## Accès Dashboard Cloudflare

- **Workers & Pages** : https://dash.cloudflare.com/?to=/:account/workers-and-pages
- **D1 Databases** : https://dash.cloudflare.com/?to=/:account/workers/d1
- **R2 Storage** : https://dash.cloudflare.com/?to=/:account/r2

---

## Troubleshooting Rapide

### Worker ne répond pas

```bash
# Vérifier le déploiement
pnpm wrangler deployments list

# Voir les logs d'erreur
pnpm wrangler tail --status error
```

### Erreur de binding D1

```bash
# Vérifier que la DB existe
pnpm wrangler d1 list

# Vérifier l'ID dans wrangler.jsonc
grep -A3 "d1_databases" wrangler.jsonc
```

### Erreur de binding R2

```bash
# Vérifier que le bucket existe
pnpm wrangler r2 bucket list

# Vérifier le nom dans wrangler.jsonc
grep -A3 "r2_buckets" wrangler.jsonc
```

### Secret manquant

```bash
# Vérifier les secrets configurés
pnpm wrangler secret list

# Ajouter le secret manquant
pnpm wrangler secret put PAYLOAD_SECRET
```

---

**Dernière mise à jour** : 2025-11-28
