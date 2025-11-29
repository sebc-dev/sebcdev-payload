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

### Cloudflare Account

You need access to the project's Cloudflare account for Wrangler authentication.

---

## Setup Steps

### Step 1: Clone the Repository (2 min)

```bash
git clone <repository-url>
cd sebcdev-payload
```

**Expected Output**:

```
Cloning into 'sebcdev-payload'...
remote: Counting objects: ...
Unpacking objects: 100% (...)
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

**Note**: This may take 2-3 minutes on first install.

### Step 3: Configure Environment (2 min)

```bash
# Copy environment template
cp .env.example .env

# Generate a secure PAYLOAD_SECRET (32+ characters)
# On Linux/macOS:
openssl rand -base64 32

# On Windows (PowerShell):
# $bytes = [byte[]][char[]][char]::ConvertFromUtf32(0); Get-Random -Minimum 0 -Maximum 256 | ForEach-Object { $bytes += @([byte]$_) }; [System.Convert]::ToBase64String($bytes[0..31])
```

Edit `.env` and add the generated secret:

```bash
# Edit with your preferred editor
nano .env
# or
code .env
```

**Set this variable**:

```env
PAYLOAD_SECRET=<your-generated-secret>
```

**Required Variables**:
| Variable | Description | Required |
|----------|-------------|----------|
| PAYLOAD_SECRET | JWT secret for auth | Yes |

### Step 4: Authenticate with Cloudflare (2 min)

```bash
wrangler login
```

This opens a browser window for Cloudflare authentication. Authorize the CLI to access your account.

**Verify Authentication**:

```bash
wrangler whoami
```

**Expected Output**:

```
✓ Logged in to Cloudflare account <your-email>
```

### Step 5: Generate Types (1 min)

```bash
pnpm generate:types
```

This generates:

- `cloudflare-env.d.ts` - Cloudflare bindings types
- `src/payload-types.ts` - Payload CMS types

**Expected Output**:

```
✓ Generated cloudflare-env.d.ts
✓ Generated src/payload-types.ts
```

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

**Note**: The first startup may take 10-15 seconds as dependencies are bundled.

### Step 7: Verify Setup (2 min)

1. **Homepage**: Open [http://localhost:3000](http://localhost:3000) in your browser
   - Should show the home page

2. **Admin Panel**: Open [http://localhost:3000/admin](http://localhost:3000/admin)
   - Should show login page or dashboard

3. **Console**: Check browser DevTools (F12) for errors
   - Should be clean with no red errors

---

## Verification Checklist

After completing all steps, verify:

- [ ] `pnpm install` completed without errors
- [ ] `.env` file created with `PAYLOAD_SECRET` set
- [ ] `wrangler whoami` shows your Cloudflare account
- [ ] `pnpm generate:types` completed successfully
- [ ] `pnpm dev` starts without errors
- [ ] Homepage loads at http://localhost:3000
- [ ] Admin panel loads at http://localhost:3000/admin
- [ ] Browser DevTools console has no errors

---

## Troubleshooting

If you encounter any issues, check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common problems and solutions.

---

## Next Steps

After successful setup, explore these guides:

- [Commands Reference](./COMMANDS.md) - Learn all available scripts
- [Environment Variables](./ENVIRONMENT.md) - Detailed env var documentation
- [IDE Setup](./IDE_SETUP.md) - Configure your editor for optimal development

---

**Total Setup Time**: ~15 minutes

Last Updated: 2025-11-28
