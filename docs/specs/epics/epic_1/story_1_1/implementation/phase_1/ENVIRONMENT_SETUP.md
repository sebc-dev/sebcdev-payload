# Phase 1 - Environment Setup

This guide covers all environment setup needed for Phase 1: Repository Creation from Template.

---

## 📋 Prerequisites

### Previous Phases

- None (This is the first phase of the first story)

### Tools Required

- [ ] **Git** (version 2.30+)
  - Check: `git --version`
  - Install: https://git-scm.com/downloads

- [ ] **GitHub Account**
  - Sign up: https://github.com/signup
  - Verify you can log in

- [ ] **GitHub CLI** (`gh`) - **Recommended**
  - Check: `gh --version`
  - Install: https://cli.github.com/
  - Purpose: Easier repository management and verification

- [ ] **Node.js** (version 18.x or 20.x+)
  - Check: `node --version`
  - Install: https://nodejs.org/ (LTS version recommended)
  - **Important**: Payload CMS requires Node 18+

- [ ] **pnpm** (version 8.x+) - **Recommended package manager**
  - Check: `pnpm --version`
  - Install: `npm install -g pnpm`
  - Alternative: Can use npm or yarn, but pnpm is recommended

- [ ] **Text Editor / IDE**
  - VS Code (recommended): https://code.visualstudio.com/
  - Or any editor of your choice

### System Requirements

- [ ] **Operating System**: macOS, Linux, or Windows (with WSL2 recommended)
- [ ] **Disk Space**: At least 2 GB free (for repository + node_modules)
- [ ] **RAM**: 4 GB minimum, 8 GB recommended
- [ ] **Internet Connection**: Stable connection for cloning and installing dependencies

---

## 🔧 Environment Setup

### 1. Git Configuration

Verify Git is configured with your identity:

```bash
# Check current configuration
git config --global user.name
git config --global user.email

# If not set, configure:
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 2. GitHub Authentication

Set up authentication for GitHub access:

**Option A: GitHub CLI (Recommended)**
```bash
# Authenticate with GitHub
gh auth login

# Follow the prompts:
# - Select "GitHub.com"
# - Select "HTTPS" or "SSH" (HTTPS is easier)
# - Authenticate via browser

# Verify authentication
gh auth status
```

**Option B: SSH Key (Alternative)**
```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your.email@example.com"

# Start SSH agent
eval "$(ssh-agent -s)"

# Add SSH key
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub
# Add this key to GitHub: Settings → SSH and GPG keys → New SSH key

# Test connection
ssh -T git@github.com
```

**Option C: Personal Access Token (Alternative)**
```bash
# Generate token at: https://github.com/settings/tokens
# Select scopes: repo, workflow

# Use token as password when cloning HTTPS URLs
# Or configure Git credential helper:
git config --global credential.helper store
```

### 3. Node.js Version Verification

Ensure you have the correct Node.js version:

```bash
# Check version
node --version

# Should output v18.x.x or v20.x.x or higher
```

**If version is too old**:

**Using nvm (Node Version Manager) - Recommended**:
```bash
# Install nvm: https://github.com/nvm-sh/nvm

# Install Node.js 20 LTS
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node --version
```

**Using official installer**:
- Download from https://nodejs.org/
- Install the LTS version

### 4. Package Manager Installation

Install pnpm (recommended for this project):

```bash
# Install pnpm globally
npm install -g pnpm

# Verify installation
pnpm --version

# Should output 8.x.x or higher
```

**Why pnpm?**
- Faster than npm
- More efficient disk space usage
- Better dependency resolution
- Used by Payload CMS team

---

## 🌐 GitHub Access Verification

Verify you have access to create repositories:

```bash
# Check GitHub authentication
gh auth status

# List your repositories (should work without errors)
gh repo list --limit 5

# Check your GitHub username
gh api user --jq .login
```

**Expected Output**: Your GitHub username and authentication confirmation

---

## 📦 Template Access Verification

Verify you can access the Payload CMS template:

**Via Browser**:
1. Navigate to: https://github.com/payloadcms/payload
2. Go to: `templates/` directory
3. Locate: `with-cloudflare-d1` template
4. Verify template README is visible

**Via GitHub CLI**:
```bash
# View template repository
gh repo view payloadcms/payload

# Browse template files
gh browse payloadcms/payload -- /tree/main/templates/with-cloudflare-d1
```

---

## 🗂️ Workspace Preparation

Create a dedicated workspace for the project:

```bash
# Create a projects directory (if it doesn't exist)
mkdir -p ~/projects
cd ~/projects

# Or use your preferred location
# cd /path/to/your/workspace

# Verify you're in the right location
pwd
```

**Recommendation**: Use a path without spaces for better compatibility with build tools.

---

## ✅ Pre-Flight Checklist

Before starting Phase 1 implementation, verify all prerequisites:

### Tools Installed
- [ ] Git installed and version ≥ 2.30
- [ ] GitHub account created and accessible
- [ ] GitHub CLI (`gh`) installed (or SSH/token configured)
- [ ] Node.js installed and version ≥ 18.x
- [ ] pnpm installed and version ≥ 8.x
- [ ] Text editor/IDE ready

### Git Configuration
- [ ] Git user.name configured
- [ ] Git user.email configured
- [ ] Git credential helper configured (or SSH)

### GitHub Authentication
- [ ] GitHub CLI authenticated (`gh auth status` succeeds)
- [ ] Can list repositories (`gh repo list` works)
- [ ] Can access Payload CMS template repository

### Workspace
- [ ] Workspace directory created
- [ ] Sufficient disk space (≥ 2 GB free)
- [ ] Terminal open in workspace directory

### Internet Connection
- [ ] Stable internet connection available
- [ ] Can access github.com
- [ ] Can access npmjs.com (for package downloads)

---

## 🚨 Troubleshooting

### Issue: Git Not Installed

**Symptoms**: `git: command not found`

**Solutions**:

**macOS**:
```bash
# Install via Xcode Command Line Tools
xcode-select --install

# Or via Homebrew
brew install git
```

**Linux (Ubuntu/Debian)**:
```bash
sudo apt update
sudo apt install git
```

**Windows**:
- Download from https://git-scm.com/download/win
- Or use WSL2 with Linux installation method

**Verify**:
```bash
git --version
```

---

### Issue: GitHub CLI Authentication Fails

**Symptoms**: `gh auth status` shows "You are not logged in"

**Solutions**:

1. **Re-authenticate**:
   ```bash
   gh auth logout
   gh auth login
   ```

2. **Choose browser authentication** (easiest method)

3. **If browser doesn't open**, choose "Paste an authentication token" and:
   - Generate token at https://github.com/settings/tokens
   - Select scopes: `repo`, `read:org`, `workflow`
   - Paste token when prompted

**Verify**:
```bash
gh auth status
```

---

### Issue: Wrong Node.js Version

**Symptoms**: `node --version` shows v16.x or older

**Solutions**:

**Using nvm (recommended)**:
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc  # or ~/.zshrc

# Install Node.js 20
nvm install 20
nvm use 20
nvm alias default 20
```

**Using official installer**:
- Download from https://nodejs.org/
- Install LTS version (20.x)

**Verify**:
```bash
node --version  # Should be v20.x.x or v18.x.x
```

---

### Issue: pnpm Command Not Found

**Symptoms**: `pnpm: command not found`

**Solutions**:

```bash
# Install pnpm globally via npm
npm install -g pnpm

# If npm not found, install Node.js first

# Alternative: Install via standalone script
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Reload shell
source ~/.bashrc  # or ~/.zshrc
```

**Verify**:
```bash
pnpm --version
```

---

### Issue: Cannot Access Payload CMS Template

**Symptoms**: 404 error or template not found

**Solutions**:

1. **Verify template path**:
   - Navigate to: https://github.com/payloadcms/payload/tree/main/templates
   - Check if `with-cloudflare-d1` exists

2. **Check for template rename**:
   - Template names may change
   - Look for "cloudflare" in template list
   - Check Payload CMS documentation: https://payloadcms.com/docs

3. **Use alternative template** (if official one is unavailable):
   - Document which template you used
   - Verify it includes D1 and R2 support

**Verify**:
```bash
gh repo view payloadcms/payload
```

---

### Issue: Insufficient Disk Space

**Symptoms**: "No space left on device" during clone or install

**Solutions**:

1. **Check available space**:
   ```bash
   df -h
   ```

2. **Free up space**:
   ```bash
   # Clear package manager cache
   pnpm store prune
   npm cache clean --force

   # Remove old node_modules directories
   find ~ -name "node_modules" -type d -prune -print | wc -l
   # Manually remove old projects' node_modules if needed
   ```

3. **Use different directory** (on drive with more space)

**Verify**:
```bash
df -h  # Check you have at least 2 GB free
```

---

## 📝 Environment Setup Checklist

Complete this checklist before starting Commit 1:

### Installation
- [ ] Git installed and working
- [ ] GitHub account accessible
- [ ] GitHub CLI configured and authenticated
- [ ] Node.js version ≥ 18.x
- [ ] pnpm version ≥ 8.x
- [ ] Text editor ready

### Configuration
- [ ] Git user.name set
- [ ] Git user.email set
- [ ] GitHub authentication working
- [ ] Can create repositories (verify permissions)

### Workspace
- [ ] Workspace directory created
- [ ] Terminal open in workspace
- [ ] Disk space sufficient (≥ 2 GB)

### Network
- [ ] Internet connection stable
- [ ] Can access github.com
- [ ] Can access npmjs.com
- [ ] Can access Payload CMS template

### Verification Commands
```bash
# Run all these - they should all succeed
git --version
node --version
pnpm --version
gh auth status
gh repo list --limit 1
df -h | grep -E "/$"  # Check disk space
```

**All checks passed? Environment is ready! 🚀**

---

## 🔗 Reference Links

### Official Documentation
- [Git Documentation](https://git-scm.com/doc)
- [GitHub CLI Manual](https://cli.github.com/manual/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [pnpm Documentation](https://pnpm.io/)
- [Payload CMS Documentation](https://payloadcms.com/docs)

### Templates
- [Payload CMS Templates](https://github.com/payloadcms/payload/tree/main/templates)
- [Cloudflare D1 Template](https://github.com/payloadcms/payload/tree/main/templates/with-cloudflare-d1)

### Installation Guides
- [nvm Installation](https://github.com/nvm-sh/nvm#installing-and-updating)
- [GitHub CLI Installation](https://github.com/cli/cli#installation)
- [pnpm Installation](https://pnpm.io/installation)

---

**Environment setup complete! Proceed to IMPLEMENTATION_PLAN.md** 🎯
