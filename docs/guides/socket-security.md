# Socket.dev Security Guide

## Overview

This project uses Socket.dev for supply chain security. Socket.dev analyzes npm packages for malicious behavior, not just known CVEs.

## What Gets Scanned

- `package.json` dependencies
- `pnpm-lock.yaml` lockfile
- All transitive dependencies

## Security Levels

| Level       | Meaning                 | Action                    |
| ----------- | ----------------------- | ------------------------- |
| **Block**   | Critical security issue | Must resolve before merge |
| **Warn**    | Potential concern       | Review and decide         |
| **Monitor** | Informational           | No action required        |

## Handling Alerts

### Blocked Package

If a legitimate package is blocked:

1. Review the alert reason in the PR check
2. If it's a false positive, add a PR comment:
   ```
   @SocketSecurity ignore <package>@<version>
   ```
3. Explain why it's acceptable
4. Socket.dev will re-scan and allow the package

### License Violations

This project blocks GPL/AGPL licenses for legal compliance.

If you need a GPL package:

1. Find an MIT/Apache alternative first
2. If no alternative exists, consult with tech lead

## Configuration

- Config file: `socket.yml` (repository root)
- Reference: [Socket.dev docs](https://docs.socket.dev/docs/socket-yml)

## Troubleshooting

### Scan Timeout

Socket.dev scans only when `triggerPaths` files change:

- `package.json`
- `pnpm-lock.yaml`
- `socket.yml`

If scans are slow, check if your lockfile is unusually large.

### Persistent False Positives

For repeated false positives on specific packages:

1. Document with `@SocketSecurity ignore` in a PR
2. Consider adding to `issueRules` in `socket.yml`
