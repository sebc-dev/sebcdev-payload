# Phase 1: Environment Setup

**Phase**: Environment Validation & Type Synchronization
**Story**: 1.2 - Récupération & Configuration Locale

This document describes the prerequisites and environment configuration required before starting Phase 1 implementation.

---

## Prerequisites

### Required Software

| Software | Required Version     | Check Command        | Notes                       |
| -------- | -------------------- | -------------------- | --------------------------- |
| Node.js  | ^18.20.2 or >=20.9.0 | `node --version`     | LTS recommended             |
| pnpm     | ^9 or ^10            | `pnpm --version`     | Package manager             |
| Git      | Any recent           | `git --version`      | Version control             |
| Wrangler | ~4.42.0              | `wrangler --version` | Cloudflare CLI (in devDeps) |

### Verify Installation

```bash
# Check Node.js version
node --version
# Expected: v18.x.x or v20.x.x or higher

# Check pnpm version
pnpm --version
# Expected: 9.x.x or 10.x.x

# Check Git
git --version
# Expected: git version 2.x.x

# Check Wrangler (via npx from devDependencies)
npx wrangler --version
# Expected: ⛅️ wrangler 4.42.x
```

### Install Missing Software

**Node.js** (via nvm):

```bash
# Install nvm (if not installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js 20
nvm install 20
nvm use 20
```

**pnpm**:

```bash
# Install pnpm globally
npm install -g pnpm

# Or via corepack (Node.js 16.10+)
corepack enable
corepack prepare pnpm@latest --activate
```

---

## Project Dependencies

### Verify Dependencies Installed

```bash
# Check if node_modules exists
ls -la node_modules | head -5

# If not installed, run:
pnpm install
```

### Key Dependencies

| Dependency                 | Version | Purpose             |
| -------------------------- | ------- | ------------------- |
| `next`                     | 15.4.7  | React framework     |
| `payload`                  | 3.63.0  | CMS                 |
| `@payloadcms/db-d1-sqlite` | 3.63.0  | D1 database adapter |
| `@payloadcms/storage-r2`   | 3.63.0  | R2 storage adapter  |
| `wrangler`                 | ~4.42.0 | Cloudflare CLI      |
| `typescript`               | 5.7.3   | TypeScript compiler |

---

## Cloudflare Configuration

### Required Cloudflare Resources

This phase assumes Story 1.1 has been completed and the following resources exist:

| Resource    | Name                    | Status      |
| ----------- | ----------------------- | ----------- |
| D1 Database | `sebcdev`               | Provisioned |
| R2 Bucket   | `sebcdev-payload-cache` | Provisioned |
| Worker      | `sebcdev-payload`       | Deployed    |

### Wrangler Configuration

The `wrangler.jsonc` file should contain:

```jsonc
{
  "name": "sebcdev-payload",
  "compatibility_date": "2025-11-27",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "d1_databases": [
    {
      "binding": "D1",
      "database_id": "d558666f-e7e9-4ff7-a972-dbc0d8bea923",
      "database_name": "sebcdev",
      "remote": true,
    },
  ],
  "r2_buckets": [
    {
      "binding": "R2",
      "bucket_name": "sebcdev-payload-cache",
      "preview_bucket_name": "sebcdev-payload-cache",
    },
  ],
}
```

### Wrangler Authentication

```bash
# Check current authentication status
wrangler whoami

# If not authenticated, login:
wrangler login
# This will open a browser for OAuth authentication
```

---

## Environment Variables

### Required Environment File

The `.env` file must exist with the following variables:

```env
# Required
PAYLOAD_SECRET=your-secret-key-here

# Optional (for production)
# DATABASE_URI=... (not needed for D1)
```

### Verify Environment File

```bash
# Check .env exists
ls -la .env

# Check PAYLOAD_SECRET is set (without revealing value)
grep "PAYLOAD_SECRET" .env | cut -d'=' -f1
```

### Generate PAYLOAD_SECRET (if needed)

```bash
# Generate a secure random string
openssl rand -hex 32
# Copy output to .env as PAYLOAD_SECRET value
```

### Environment File Template

If `.env` doesn't exist, copy from template:

```bash
# Copy template
cp .env.example .env

# Edit and set PAYLOAD_SECRET
nano .env
# or
code .env
```

---

## Project Structure

### Key Files for This Phase

```
/home/negus/dev/sebcdev-payload/
├── .env                    # Environment variables (verify exists)
├── .env.example            # Template (reference)
├── wrangler.jsonc          # Cloudflare bindings (verify config)
├── cloudflare-env.d.ts     # Generated Cloudflare types (will regenerate)
├── tsconfig.json           # TypeScript configuration (verify)
├── package.json            # Dependencies and scripts (reference)
└── src/
    ├── payload.config.ts   # Payload configuration (reference)
    └── payload-types.ts    # Generated Payload types (will regenerate)
```

### Verify Project Structure

```bash
# Check key files exist
ls -la .env wrangler.jsonc cloudflare-env.d.ts tsconfig.json package.json

# Check src directory
ls -la src/payload.config.ts src/payload-types.ts
```

---

## Network Requirements

### Local Ports

| Port | Service            | Usage       |
| ---- | ------------------ | ----------- |
| 3000 | Next.js Dev Server | Application |

### Check Port Availability

```bash
# Check if port 3000 is available
lsof -i :3000

# If in use, kill the process
kill -9 <PID>

# Or use alternative port
PORT=3001 pnpm dev
```

### Internet Connection

Required for:

- Wrangler authentication check
- Remote D1 database access (if testing remote)
- npm package resolution (if needed)

---

## IDE Setup (Recommended)

### VSCode Extensions

For the best development experience, install these extensions:

| Extension    | ID                          | Purpose          |
| ------------ | --------------------------- | ---------------- |
| ESLint       | `dbaeumer.vscode-eslint`    | Linting          |
| Prettier     | `esbenp.prettier-vscode`    | Formatting       |
| TypeScript   | Built-in                    | Type checking    |
| Tailwind CSS | `bradlc.vscode-tailwindcss` | CSS IntelliSense |

### VSCode Settings

Recommended `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

---

## Pre-Phase Verification Script

Run this script to verify all prerequisites:

```bash
#!/bin/bash
echo "=== Phase 1 Environment Verification ==="
echo ""

# Check Node.js
echo "Node.js version:"
node --version

# Check pnpm
echo ""
echo "pnpm version:"
pnpm --version

# Check Git
echo ""
echo "Git version:"
git --version

# Check Wrangler
echo ""
echo "Wrangler version:"
npx wrangler --version 2>/dev/null || echo "Wrangler not found in devDeps"

# Check .env
echo ""
echo ".env file:"
if [ -f .env ]; then
  echo "EXISTS"
  grep "PAYLOAD_SECRET" .env | cut -d'=' -f1 && echo "  ✓ PAYLOAD_SECRET defined"
else
  echo "MISSING - create from .env.example"
fi

# Check wrangler.jsonc
echo ""
echo "wrangler.jsonc:"
if [ -f wrangler.jsonc ]; then
  echo "EXISTS"
  grep -q "D1" wrangler.jsonc && echo "  ✓ D1 binding found"
  grep -q "R2" wrangler.jsonc && echo "  ✓ R2 binding found"
else
  echo "MISSING"
fi

# Check node_modules
echo ""
echo "node_modules:"
if [ -d node_modules ]; then
  echo "EXISTS (dependencies installed)"
else
  echo "MISSING - run: pnpm install"
fi

# Check Wrangler auth
echo ""
echo "Wrangler authentication:"
wrangler whoami 2>/dev/null | head -5 || echo "Not authenticated - run: wrangler login"

echo ""
echo "=== Verification Complete ==="
```

Save as `verify-env.sh` and run:

```bash
chmod +x verify-env.sh
./verify-env.sh
```

---

## Troubleshooting Setup Issues

### Node.js Version Mismatch

```bash
# Use nvm to switch versions
nvm use 20

# Or install correct version
nvm install 20.9.0
```

### pnpm Not Found

```bash
# Install via npm
npm install -g pnpm

# Or via corepack
corepack enable
```

### Dependencies Not Installed

```bash
# Clear and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Wrangler Auth Issues

```bash
# Clear credentials
rm -rf ~/.wrangler

# Re-authenticate
wrangler login
```

### Environment File Missing

```bash
# Copy from example
cp .env.example .env

# Generate secret
echo "PAYLOAD_SECRET=$(openssl rand -hex 32)" >> .env
```

---

## Ready to Start

Once all prerequisites are verified:

1. ✅ Node.js installed (correct version)
2. ✅ pnpm installed
3. ✅ Dependencies installed (`node_modules` exists)
4. ✅ `.env` file exists with `PAYLOAD_SECRET`
5. ✅ `wrangler.jsonc` configured with D1 and R2 bindings
6. ✅ Wrangler authenticated (or ready to authenticate)
7. ✅ Port 3000 available

**You are ready to proceed to [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)**

---

**Setup Guide Created**: 2025-11-28
**Last Updated**: 2025-11-28
**Created by**: Claude Code (phase-doc-generator skill)
