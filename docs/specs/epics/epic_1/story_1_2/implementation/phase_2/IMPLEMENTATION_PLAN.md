# Phase 2: Implementation Plan

**Phase**: Developer Documentation & Onboarding Guide
**Story**: 1.2 - Récupération & Configuration Locale
**Commits**: 4 atomic commits
**Duration**: 0.5 days (~3 hours)

---

## Overview

This implementation plan details the atomic commit strategy for creating developer documentation. Each commit is designed to be:

- **Focused**: Single responsibility (one or two related files)
- **Verifiable**: Can be tested independently
- **Reversible**: Easy to rollback if needed
- **Progressive**: Builds on previous commits

---

## Pre-Implementation Checklist

Before starting, verify:

- [ ] Phase 1 completed (environment validation passed)
- [ ] Development server starts correctly (`pnpm dev`)
- [ ] TypeScript compilation passes (`npx tsc --noEmit`)
- [ ] ESLint validation passes (`pnpm lint`)
- [ ] Working directory: `/home/negus/dev/sebcdev-payload`
- [ ] Access to all configuration files (package.json, .env.example, etc.)

---

## Commit 2.1: Create Quick-Start Guide

### Objective

Create a comprehensive quick-start guide enabling new developers to set up their local environment in under 15 minutes.

### Duration

~45 minutes

### Tasks

#### Task 2.1.1: Create Documentation Directory

```bash
# Create docs/development directory if not exists
mkdir -p docs/development
```

#### Task 2.1.2: Create QUICKSTART.md

Create `docs/development/QUICKSTART.md` with the following structure:

```markdown
# Quick-Start Guide

## Prerequisites

### Required Software

- Node.js ^18.20.2 or >=20.9.0
- pnpm ^9 or ^10
- Git

### Cloudflare Account

- Active Cloudflare account
- Wrangler CLI access

## Setup Steps

### 1. Clone Repository

[Instructions...]

### 2. Install Dependencies

[Instructions...]

### 3. Configure Environment

[Instructions...]

### 4. Generate Types

[Instructions...]

### 5. Start Development Server

[Instructions...]

### 6. Verify Setup

[Instructions...]

## Expected Output

[Screenshots/examples...]

## Next Steps

[Links to other docs...]
```

**Content Requirements**:

- Step-by-step numbered instructions
- Copy-paste ready commands
- Expected output for each step
- Verification steps
- Time estimates per section
- Links to troubleshooting guide

#### Task 2.1.3: Verify Quick-Start Guide

```bash
# Verify the file was created correctly
cat docs/development/QUICKSTART.md | head -50

# Check for broken links (if any internal)
grep -E "\[.*\]\(.*\)" docs/development/QUICKSTART.md
```

### File Content Template

````markdown
# Quick-Start Guide

Get your local development environment running in under 15 minutes.

---

## Prerequisites

### Required Software

| Software | Version              | Check Command    |
| -------- | -------------------- | ---------------- |
| Node.js  | ^18.20.2 or >=20.9.0 | `node --version` |
| pnpm     | ^9 or ^10            | `pnpm --version` |
| Git      | Any recent           | `git --version`  |

**Install Node.js**: [nodejs.org](https://nodejs.org/) or use [nvm](https://github.com/nvm-sh/nvm)

**Install pnpm**:

```bash
npm install -g pnpm
```
````

### Cloudflare Account

You need access to the project's Cloudflare account for Wrangler authentication.

---

## Setup Steps

### Step 1: Clone the Repository (2 min)

```bash
git clone <repository-url>
cd sebcdev-payload
```

### Step 2: Install Dependencies (3 min)

```bash
pnpm install
```

**Expected Output**:

```
Packages: +XXX
Progress: resolved XXX, reused XXX, downloaded X, added XXX, done
```

### Step 3: Configure Environment (2 min)

```bash
# Copy environment template
cp .env.example .env

# Generate a secure PAYLOAD_SECRET (32+ characters)
# On Linux/macOS:
openssl rand -base64 32

# Add the generated secret to .env
# PAYLOAD_SECRET=<your-generated-secret>
```

**Required Variables**:
| Variable | Description | Required |
|----------|-------------|----------|
| PAYLOAD_SECRET | JWT secret for auth | Yes |

### Step 4: Authenticate with Cloudflare (2 min)

```bash
wrangler login
```

This opens a browser window for Cloudflare authentication.

**Verify Authentication**:

```bash
wrangler whoami
```

### Step 5: Generate Types (1 min)

```bash
pnpm generate:types
```

This generates:

- `cloudflare-env.d.ts` - Cloudflare bindings types
- `src/payload-types.ts` - Payload CMS types

### Step 6: Start Development Server (1 min)

```bash
pnpm dev
```

**Expected Output**:

```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000

 ✓ Ready in X.Xs
```

### Step 7: Verify Setup (2 min)

1. **Homepage**: Open http://localhost:3000
2. **Admin Panel**: Open http://localhost:3000/admin
3. **Console**: Check browser DevTools for errors

---

## Verification Checklist

- [ ] `pnpm install` completed without errors
- [ ] `.env` file created with `PAYLOAD_SECRET`
- [ ] `wrangler whoami` shows your account
- [ ] `pnpm generate:types` completed
- [ ] `pnpm dev` starts successfully
- [ ] Homepage loads at localhost:3000
- [ ] Admin panel loads at localhost:3000/admin

---

## Troubleshooting

Common issues? See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## Next Steps

- [Commands Reference](./COMMANDS.md) - All available scripts
- [Environment Variables](./ENVIRONMENT.md) - Detailed env var documentation
- [IDE Setup](./IDE_SETUP.md) - Configure your editor

---

**Total Setup Time**: ~15 minutes

```

### Verification

- [ ] `docs/development/QUICKSTART.md` created
- [ ] All 7 setup steps documented
- [ ] Commands are copy-paste ready
- [ ] Expected outputs included
- [ ] Links to other docs added
- [ ] Verification checklist included

### Commit Message

```

📝 Add quick-start guide for developer onboarding

- Create docs/development/QUICKSTART.md
- Document 7-step setup process
- Include prerequisites and verification steps
- Add troubleshooting links and next steps

Part of Story 1.2 Phase 2: Developer Documentation

````

### Files Changed

| File | Status |
|------|--------|
| `docs/development/QUICKSTART.md` | Created |

---

## Commit 2.2: Create Commands and Environment Reference

### Objective

Document all pnpm scripts and environment variables for quick reference.

### Duration

~45 minutes

### Tasks

#### Task 2.2.1: Create COMMANDS.md

Create `docs/development/COMMANDS.md` with all scripts from `package.json`.

**Content Structure**:
```markdown
# Commands Reference

## Development
- pnpm dev
- pnpm devsafe

## Build & Deploy
- pnpm build
- pnpm deploy
- pnpm preview

## Testing
- pnpm test
- pnpm test:int
- pnpm test:e2e

## Code Quality
- pnpm lint

## Type Generation
- pnpm generate:types
- pnpm generate:types:payload
- pnpm generate:types:cloudflare

## Database
- pnpm payload migrate
- pnpm payload migrate:create
````

#### Task 2.2.2: Create ENVIRONMENT.md

Create `docs/development/ENVIRONMENT.md` with all environment variables.

**Content Structure**:

```markdown
# Environment Variables

## Required Variables

- PAYLOAD_SECRET

## Optional Variables

- CLOUDFLARE_ENV
- NODE_ENV

## File Locations

- .env (local, gitignored)
- .env.example (template, committed)
```

#### Task 2.2.3: Cross-Reference with package.json

```bash
# List all scripts from package.json
cat package.json | jq '.scripts'

# Verify all scripts are documented
```

### File Content Templates

**COMMANDS.md**:

````markdown
# Commands Reference

Complete reference for all available pnpm scripts.

---

## Development

### Start Development Server

```bash
pnpm dev
```
````

Starts the Next.js development server with Wrangler bindings.

- **URL**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **Hot Reload**: Enabled

### Clean Start

```bash
pnpm devsafe
```

Removes `.next` and `.open-next` directories before starting. Use when experiencing cache issues.

---

## Build & Deploy

### Build Application

```bash
pnpm build
```

Creates a production build of the Next.js application.

### Deploy to Cloudflare

```bash
pnpm deploy
```

Runs migrations and deploys to Cloudflare Workers.

### Local Preview

```bash
pnpm preview
```

Preview the Cloudflare deployment locally.

---

## Testing

### Run All Tests

```bash
pnpm test
```

Runs both integration and E2E tests.

### Integration Tests

```bash
pnpm test:int
```

Runs Vitest integration tests (`tests/int/*.int.spec.ts`).

### E2E Tests

```bash
pnpm test:e2e
```

Runs Playwright E2E tests (`tests/e2e/*.e2e.spec.ts`).

---

## Code Quality

### Lint Code

```bash
pnpm lint
```

Runs ESLint on the codebase.

---

## Type Generation

### Generate All Types

```bash
pnpm generate:types
```

Generates both Cloudflare and Payload types.

### Payload Types Only

```bash
pnpm generate:types:payload
```

Regenerates `src/payload-types.ts` from collection definitions.

### Cloudflare Types Only

```bash
pnpm generate:types:cloudflare
```

Regenerates `cloudflare-env.d.ts` from `wrangler.jsonc`.

---

## Database

### Run Migrations

```bash
pnpm payload migrate
```

Applies pending database migrations.

### Create Migration

```bash
pnpm payload migrate:create
```

Creates a new migration file.

---

## Quick Reference Table

| Command               | Description      | When to Use          |
| --------------------- | ---------------- | -------------------- |
| `pnpm dev`            | Start dev server | Daily development    |
| `pnpm devsafe`        | Clean start      | Cache issues         |
| `pnpm build`          | Production build | Before deploy        |
| `pnpm deploy`         | Deploy to CF     | Production release   |
| `pnpm test`           | All tests        | Before commit        |
| `pnpm lint`           | Check code       | Before commit        |
| `pnpm generate:types` | Regen types      | After schema changes |

---

## See Also

- [Quick-Start Guide](./QUICKSTART.md)
- [Environment Variables](./ENVIRONMENT.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

````

**ENVIRONMENT.md**:
```markdown
# Environment Variables

Complete reference for environment configuration.

---

## Overview

Environment variables are stored in `.env` file (not committed to git).

**Template Location**: `.env.example`

---

## Required Variables

### PAYLOAD_SECRET

**Required**: Yes

JWT secret key for authentication. Must be at least 32 characters.

```bash
# Generate a secure secret
openssl rand -base64 32
````

**Example**:

```env
PAYLOAD_SECRET=your-super-secret-key-at-least-32-chars
```

---

## Optional Variables

### CLOUDFLARE_ENV

**Required**: No
**Default**: Not set (uses default bindings)

Controls which Cloudflare environment to use.

```env
CLOUDFLARE_ENV=production
```

### NODE_ENV

**Required**: No
**Default**: `development`

Node.js environment mode.

```env
NODE_ENV=production
```

---

## File Locations

| File           | Purpose           | Git Status |
| -------------- | ----------------- | ---------- |
| `.env`         | Local environment | Ignored    |
| `.env.example` | Template          | Committed  |

---

## Setup Instructions

1. Copy the template:

   ```bash
   cp .env.example .env
   ```

2. Generate and set `PAYLOAD_SECRET`:

   ```bash
   openssl rand -base64 32
   ```

3. Add to `.env`:
   ```env
   PAYLOAD_SECRET=<generated-value>
   ```

---

## Security Notes

- **Never commit `.env`** - Contains secrets
- **Rotate secrets regularly** - Update PAYLOAD_SECRET periodically
- **Use strong secrets** - Minimum 32 characters, randomly generated

---

## Cloudflare Bindings

Cloudflare bindings (D1, R2) are configured in `wrangler.jsonc`, not environment variables.

See `wrangler.jsonc` for:

- D1 database binding
- R2 bucket binding

---

## See Also

- [Quick-Start Guide](./QUICKSTART.md)
- [Commands Reference](./COMMANDS.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

```

### Verification

- [ ] `docs/development/COMMANDS.md` created
- [ ] All scripts from package.json documented
- [ ] `docs/development/ENVIRONMENT.md` created
- [ ] All env vars from .env.example documented
- [ ] Usage examples included
- [ ] Cross-references added

### Commit Message

```

📝 Add commands reference and environment variables documentation

- Create docs/development/COMMANDS.md with all pnpm scripts
- Create docs/development/ENVIRONMENT.md with env var reference
- Document required vs optional variables
- Include usage examples and quick reference table

Part of Story 1.2 Phase 2: Developer Documentation

````

### Files Changed

| File | Status |
|------|--------|
| `docs/development/COMMANDS.md` | Created |
| `docs/development/ENVIRONMENT.md` | Created |

---

## Commit 2.3: Create Troubleshooting and IDE Setup Guides

### Objective

Document solutions to common issues and IDE configuration for optimal development experience.

### Duration

~45 minutes

### Tasks

#### Task 2.3.1: Create TROUBLESHOOTING.md

Create `docs/development/TROUBLESHOOTING.md` with common issues and solutions.

**Content Structure**:
```markdown
# Troubleshooting Guide

## Authentication Issues
- Wrangler not logged in
- Token expired

## Database Issues
- D1 connection errors
- Migration problems

## Development Server Issues
- Port in use
- Server won't start

## TypeScript Issues
- Type errors after update
- Missing types

## Build Issues
- Build failures
- Memory issues
````

#### Task 2.3.2: Create IDE_SETUP.md

Create `docs/development/IDE_SETUP.md` with VSCode configuration.

**Content Structure**:

```markdown
# IDE Setup

## VSCode Configuration

- Recommended settings
- Workspace settings

## Recommended Extensions

- ESLint
- Prettier
- TypeScript
- Tailwind CSS

## Keyboard Shortcuts

- Format on save
- Quick fixes
```

### File Content Templates

**TROUBLESHOOTING.md**:

````markdown
# Troubleshooting Guide

Solutions to common development issues.

---

## Authentication Issues

### Wrangler Not Authenticated

**Symptom**: Commands fail with authentication errors

**Solution**:

```bash
wrangler login
```
````

Then verify:

```bash
wrangler whoami
```

### Token Expired

**Symptom**: `Token expired` or `unauthorized` errors

**Solution**:

```bash
# Clear credentials
rm -rf ~/.wrangler

# Re-login
wrangler login
```

---

## Database Issues

### D1 Connection Error

**Symptom**: Database queries fail locally

**Solution**:

1. Verify binding in `wrangler.jsonc`:

   ```json
   "d1_databases": [{ "binding": "D1", ... }]
   ```

2. Test connection:

   ```bash
   wrangler d1 execute D1 --command "SELECT 1" --local
   ```

3. If needed, reset local database:
   ```bash
   rm -rf .wrangler/state/v3/d1/
   pnpm payload migrate
   ```

### Migration Errors

**Symptom**: Migrations fail to apply

**Solution**:

```bash
# Check migration status
pnpm payload migrate:status

# Force run migrations
pnpm payload migrate
```

---

## Development Server Issues

### Port 3000 Already in Use

**Symptom**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:

```bash
# Find process using port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

### Server Won't Start

**Symptom**: Dev server crashes on startup

**Solution**:

1. Clean caches:

   ```bash
   pnpm devsafe
   ```

2. Verify types:

   ```bash
   pnpm generate:types
   npx tsc --noEmit
   ```

3. Check `.env` file exists with `PAYLOAD_SECRET`

### Hot Reload Not Working

**Symptom**: Changes not reflected without restart

**Solution**:

```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
pnpm dev
```

---

## TypeScript Issues

### Type Errors After Schema Change

**Symptom**: TypeScript errors related to Payload types

**Solution**:

```bash
# Regenerate Payload types
pnpm generate:types:payload

# Verify no errors
npx tsc --noEmit
```

### Missing Cloudflare Types

**Symptom**: `D1Database` or `R2Bucket` not found

**Solution**:

```bash
# Regenerate Cloudflare types
pnpm generate:types:cloudflare
```

### General Type Errors

**Symptom**: Multiple TypeScript errors

**Solution**:

```bash
# Clear cache and regenerate
rm -rf node_modules/.cache
pnpm generate:types
npx tsc --noEmit 2>&1 | head -50
```

---

## Build Issues

### Build Fails

**Symptom**: `pnpm build` fails

**Solution**:

1. Check for TypeScript errors:

   ```bash
   npx tsc --noEmit
   ```

2. Check for lint errors:

   ```bash
   pnpm lint
   ```

3. Clear cache and rebuild:
   ```bash
   rm -rf .next
   pnpm build
   ```

### Out of Memory

**Symptom**: `JavaScript heap out of memory`

**Solution**:

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

---

## ESLint Issues

### ESLint Errors

**Symptom**: Lint errors blocking commit

**Solution**:

```bash
# Run with fix
pnpm lint --fix

# Or fix specific file
pnpm eslint --fix src/path/to/file.ts
```

---

## Quick Reference

| Issue         | Quick Fix                       |
| ------------- | ------------------------------- |
| Wrangler auth | `wrangler login`                |
| Port in use   | `kill -9 $(lsof -t -i:3000)`    |
| Type errors   | `pnpm generate:types`           |
| Cache issues  | `pnpm devsafe`                  |
| Lint errors   | `pnpm lint --fix`               |
| D1 issues     | Check `wrangler.jsonc` bindings |

---

## Getting Help

If issues persist:

1. Check the [Payload CMS Docs](https://payloadcms.com/docs)
2. Check the [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
3. Ask in project Slack/Discord
4. Create an issue on GitHub

---

## See Also

- [Quick-Start Guide](./QUICKSTART.md)
- [Commands Reference](./COMMANDS.md)
- [IDE Setup](./IDE_SETUP.md)

````

**IDE_SETUP.md**:
```markdown
# IDE Setup

Configure your development environment for optimal productivity.

---

## VSCode (Recommended)

### Workspace Settings

Create or update `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
````

---

## Recommended Extensions

### Essential

| Extension  | ID                       | Purpose       |
| ---------- | ------------------------ | ------------- |
| ESLint     | `dbaeumer.vscode-eslint` | Linting       |
| Prettier   | `esbenp.prettier-vscode` | Formatting    |
| TypeScript | Built-in                 | Type checking |

### Highly Recommended

| Extension                 | ID                          | Purpose            |
| ------------------------- | --------------------------- | ------------------ |
| Tailwind CSS IntelliSense | `bradlc.vscode-tailwindcss` | CSS autocomplete   |
| Pretty TypeScript Errors  | `yoavbls.pretty-ts-errors`  | Readable TS errors |
| GitLens                   | `eamodio.gitlens`           | Git history        |
| Error Lens                | `usernamehw.errorlens`      | Inline errors      |

### Optional

| Extension      | ID                       | Purpose       |
| -------------- | ------------------------ | ------------- |
| GitHub Copilot | `github.copilot`         | AI assistance |
| Import Cost    | `wix.vscode-import-cost` | Bundle size   |
| Todo Tree      | `gruntfuggly.todo-tree`  | TODO tracking |

### Install All at Once

```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension yoavbls.pretty-ts-errors
code --install-extension eamodio.gitlens
code --install-extension usernamehw.errorlens
```

---

## Keyboard Shortcuts

### Recommended Custom Shortcuts

Add to `keybindings.json`:

```json
[
  {
    "key": "ctrl+shift+f",
    "command": "editor.action.formatDocument"
  },
  {
    "key": "ctrl+.",
    "command": "editor.action.quickFix"
  }
]
```

### Useful Built-in Shortcuts

| Shortcut       | Action               |
| -------------- | -------------------- |
| `Ctrl+P`       | Quick file open      |
| `Ctrl+Shift+P` | Command palette      |
| `F12`          | Go to definition     |
| `Shift+F12`    | Find all references  |
| `Ctrl+Space`   | Trigger autocomplete |
| `Ctrl+.`       | Quick fix            |
| `F2`           | Rename symbol        |

---

## TypeScript Configuration

VSCode uses the project's `tsconfig.json` automatically.

For best experience:

1. Ensure TypeScript version matches project
2. Enable strict mode in tsconfig
3. Use relative imports for better navigation

---

## Debugging

### Launch Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["dev"],
      "skipFiles": ["<node_internals>/**"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Browser DevTools

For frontend debugging:

1. Open DevTools (F12)
2. Use Sources tab for breakpoints
3. Use React DevTools extension for component inspection

---

## Terminal Integration

### Recommended Terminal

Use VSCode integrated terminal for:

- Consistent environment
- Quick command access
- Output linking

### Shell Configuration

If using bash/zsh, add to profile:

```bash
# NVM auto-use
autoload -U add-zsh-hook
load-nvmrc() {
  if [[ -f .nvmrc && -r .nvmrc ]]; then
    nvm use
  fi
}
add-zsh-hook chpwd load-nvmrc
```

---

## See Also

- [Quick-Start Guide](./QUICKSTART.md)
- [Commands Reference](./COMMANDS.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

```

### Verification

- [ ] `docs/development/TROUBLESHOOTING.md` created
- [ ] Common issues covered (auth, database, server, types, build)
- [ ] Solutions are actionable with commands
- [ ] `docs/development/IDE_SETUP.md` created
- [ ] VSCode settings documented
- [ ] Extensions list included
- [ ] Cross-references added

### Commit Message

```

📝 Add troubleshooting guide and IDE setup documentation

- Create docs/development/TROUBLESHOOTING.md with common issues
- Create docs/development/IDE_SETUP.md with VSCode configuration
- Document auth, database, server, and TypeScript issues
- List recommended extensions and settings

Part of Story 1.2 Phase 2: Developer Documentation

````

### Files Changed

| File | Status |
|------|--------|
| `docs/development/TROUBLESHOOTING.md` | Created |
| `docs/development/IDE_SETUP.md` | Created |

---

## Commit 2.4: Final Review and CLAUDE.md Update

### Objective

Review all documentation for accuracy and consistency, update CLAUDE.md if needed, and mark story as complete.

### Duration

~30 minutes

### Tasks

#### Task 2.4.1: Review All Documentation

```bash
# List all created documentation
ls -la docs/development/

# Check for broken internal links
for f in docs/development/*.md; do
  echo "=== $f ==="
  grep -E "\[.*\]\(\..*\)" "$f" | head -10
done
````

**Review Checklist**:

- [ ] QUICKSTART.md - Steps are accurate
- [ ] COMMANDS.md - All scripts documented
- [ ] ENVIRONMENT.md - All vars documented
- [ ] TROUBLESHOOTING.md - Solutions are valid
- [ ] IDE_SETUP.md - Settings are current

#### Task 2.4.2: Update CLAUDE.md (If Needed)

Review `CLAUDE.md` and update if:

- New commands discovered during Phase 1
- Additional workflow tips
- Missing documentation links

**Potential Updates**:

```markdown
## Developer Documentation

For detailed setup instructions, see:

- [Quick-Start Guide](docs/development/QUICKSTART.md)
- [Commands Reference](docs/development/COMMANDS.md)
- [Troubleshooting](docs/development/TROUBLESHOOTING.md)
```

#### Task 2.4.3: Add Cross-References

Ensure all documentation files reference each other appropriately.

#### Task 2.4.4: Update EPIC_TRACKING.md

Update the epic tracking file:

```bash
# View current status
cat docs/specs/epics/epic_1/EPIC_TRACKING.md | grep -A5 "Story 1.2"
```

**Updates Required**:

- Story 1.2 Status: ✅ COMPLETED
- Progress: 2/2
- Recent Updates: Add Phase 2 completion entry

#### Task 2.4.5: Update PHASES_PLAN.md

Update the phases plan file with Phase 2 completion:

```markdown
- [x] **Phase 2: Developer Documentation** - Status: ✅ COMPLETED
  - Actual duration: ~3 hours
  - Actual commits: 4
  - Notes: All documentation created
```

### Verification

- [ ] All documentation reviewed for accuracy
- [ ] No broken internal links
- [ ] CLAUDE.md updated (if needed)
- [ ] Cross-references added
- [ ] EPIC_TRACKING.md updated
- [ ] PHASES_PLAN.md updated
- [ ] Story 1.2 marked as COMPLETED

### Commit Message

```
📝 Complete Story 1.2 documentation and update tracking

- Review and finalize all developer documentation
- Update CLAUDE.md with documentation links (if needed)
- Update EPIC_TRACKING.md with Story 1.2 completion
- Mark Phase 2 as completed in PHASES_PLAN.md

Story 1.2 Phase 2 COMPLETE
Story 1.2 COMPLETE
```

### Files Changed

| File                                                              | Status               |
| ----------------------------------------------------------------- | -------------------- |
| `CLAUDE.md`                                                       | Modified (if needed) |
| `docs/specs/epics/epic_1/EPIC_TRACKING.md`                        | Modified             |
| `docs/specs/epics/epic_1/story_1_2/implementation/PHASES_PLAN.md` | Modified             |

---

## Post-Implementation Tasks

### Update Tracking

After completing all commits:

1. **Update PHASES_PLAN.md**:
   - Mark Phase 2 as completed
   - Add actual duration and notes

2. **Update EPIC_TRACKING.md**:
   - Update Story 1.2 progress to 2/2
   - Update Story 1.2 status to ✅ COMPLETED
   - Add recent updates entry

3. **Update story_1.2.md**:
   - Mark all acceptance criteria as complete
   - Update status to ✅ COMPLETED

### Validation Summary

Complete the [validation/VALIDATION_CHECKLIST.md](./validation/VALIDATION_CHECKLIST.md) to confirm all criteria are met.

### Next Steps

1. Story 1.2 Complete
2. Proceed to Story 1.3: Pipeline "Quality Gate" (AI-Shield)
3. Run: `/plan-story Epic 1 Story 1.3`

---

## Summary

| Commit    | Objective                | Duration        | Files   |
| --------- | ------------------------ | --------------- | ------- |
| 2.1       | Quick-start guide        | 45 min          | 1       |
| 2.2       | Commands & env reference | 45 min          | 2       |
| 2.3       | Troubleshooting & IDE    | 45 min          | 2       |
| 2.4       | Review & update tracking | 30 min          | 2-3     |
| **Total** |                          | **~2.75 hours** | **7-8** |

---

**Plan Created**: 2025-11-28
**Last Updated**: 2025-11-28
**Created by**: Claude Code (phase-doc-generator skill)
