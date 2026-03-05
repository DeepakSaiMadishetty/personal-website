# Phase 1: Vercel Migration - Research

**Researched:** 2026-03-04
**Domain:** Vercel CLI + GitHub Actions CI/CD + Vite SPA deployment
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**CI/CD approach:**
- Use Vercel CLI (`npx vercel --prod`) inside the existing GitHub Actions workflow — do not use Vercel's native GitHub integration or a third-party action
- Vercel handles the build (source code is passed to Vercel; it auto-detects Vite and runs `npm run build` on its infrastructure — no separate build step needed in the workflow)
- Store Vercel credentials as GitHub repository secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

**Branch → environment mapping:**
- `development` branch triggers the Vercel production deployment (same trigger as the current GitHub Pages workflow)
- `main` branch is a stable reference branch — not wired to any deployment
- Single deployment target: push to `development` = live on Vercel

**Vite base path:**
- Change `vite.config.js` `base` from `/personal-website/` to `/` — required for Vercel's root-path hosting

**GitHub Pages cleanup:**
- The old `deploy.yml` GitHub Pages steps (`upload-pages-artifact`, `deploy-pages`) are fully replaced — no parallel GitHub Pages deployment remains

### Claude's Discretion
- Custom domain setup (use auto-generated `*.vercel.app` URL for now)
- Preview deployments for other branches (not configured in v1)
- Exact Vercel project name and team settings

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SITE-01 | Site deployed on Vercel with a production URL | Vercel CLI `--prod` flag creates a production deployment linked to the project's production domain; a `*.vercel.app` URL is auto-assigned. |
| SITE-02 | Vite base path updated from `/personal-website/` to `/` for Vercel compatibility | One-line change in `vite.config.js`; root `/` is correct for Vercel's hosting model. SPA routing also requires a `vercel.json` rewrite rule. |
| SITE-03 | GitHub Actions deploy workflow updated to target Vercel (replaces GitHub Pages) | `deploy.yml` is replaced wholesale: remove `upload-pages-artifact` / `deploy-pages` steps, add Vercel CLI invocation with secrets. |
</phase_requirements>

---

## Summary

This phase migrates hosting from GitHub Pages (a static file host at a subpath `/personal-website/`) to Vercel (a root-path host with serverless capability). The work splits into three tightly coupled changes: (1) removing the GitHub Pages subpath from Vite, (2) adding a `vercel.json` SPA routing fallback, and (3) replacing the GitHub Actions deploy workflow with a Vercel CLI invocation.

The user-chosen approach — `npx vercel --prod` in GitHub Actions — is fully supported by Vercel's official CLI. The `--prod` flag is documented as valid for creating production deployments. Because `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are set as environment variables in the workflow, the CLI uses them automatically for project linking without any interactive prompts or a committed `.vercel/project.json` file.

The single non-obvious requirement is a `vercel.json` rewrite rule. Vercel's official Vite documentation explicitly states that deep linking (direct URL access to routes like `/about`) will 404 without a rewrite from `/(.*) → /index.html`. This is the most common production breakage for Vite SPAs on Vercel and must be addressed in this phase alongside the base path change.

**Primary recommendation:** Three file changes, one one-time Vercel project setup step. Total implementation is small but must include `vercel.json` for routing correctness, which is easy to miss.

---

## Standard Stack

### Core

| Library / Tool | Version | Purpose | Why Standard |
|---------------|---------|---------|--------------|
| Vercel CLI | latest (via `npm install --global vercel@latest` or `npx vercel`) | Authenticate, link project, deploy from CI | Official Vercel-supported path for CI/CD without native GitHub integration |
| Vercel | — (platform) | Build + host the Vite SPA | Chosen platform; auto-detects Vite, provides `*.vercel.app` production URL |

### Supporting

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `vercel.json` | Configure SPA routing rewrites | Required for any React Router SPA on Vercel — without it, direct URL access to routes returns 404 |
| GitHub Secrets | Store `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | CI/CD authentication without hardcoded credentials |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `npx vercel --prod` (user chose) | `vercel pull` + `vercel build` + `vercel deploy --prebuilt` | The prebuilt 3-step flow is Vercel's current recommended pattern for CI — it builds locally then uploads artifacts, skipping Vercel's build system. The user's simpler single-command approach passes source to Vercel which builds it. Both are valid; the simpler form is fine for a Vite SPA with no secrets needed at build time. |
| Manual project linking (local `vercel link`) | Set IDs via environment variables only | Using env vars `VERCEL_ORG_ID` + `VERCEL_PROJECT_ID` in the Actions workflow means NO `.vercel/project.json` needs to be committed or generated in CI — the CLI reads them from the environment automatically. |

---

## Architecture Patterns

### Recommended Project Structure Changes

```
project-root/
├── vercel.json          # NEW — SPA routing rewrite rule
├── vite.config.js       # MODIFY — base: '/personal-website/' → base: '/'
└── .github/
    └── workflows/
        └── deploy.yml   # REPLACE — GitHub Pages → Vercel CLI
```

No other files change. React Router uses relative paths; only Vite's `base` config affects asset URLs.

### Pattern 1: Vercel CLI Production Deployment in GitHub Actions

**What:** A single `npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}` command in a GitHub Actions step deploys to Vercel production. The CLI automatically reads `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` from the workflow-level `env` block.

**When to use:** When the user wants full control over CI without Vercel's native GitHub App integration, and does not need preview deployments per PR.

**GitHub Actions workflow (complete replacement for deploy.yml):**

```yaml
# Source: https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel
name: Deploy to Vercel

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

on:
  push:
    branches:
      - development

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Deploy to Vercel Production
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

**Key details:**
- `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` at the workflow `env` level are read by the CLI automatically — no `--scope` or `--project` flag needed
- `npm ci` is NOT needed because Vercel builds on its own infrastructure after receiving source — user's decision explicitly states "no separate build step"
- `actions/checkout@v4` and `actions/setup-node@v4` are kept for consistency with the existing workflow; `setup-node` is optional if only deploying source but harmless
- The `permissions: pages: write` and `id-token: write` blocks from the old workflow are NOT needed — remove them entirely
- The old two-job structure (build + deploy) collapses to a single job

### Pattern 2: SPA Routing Rewrite (vercel.json)

**What:** A `vercel.json` at the project root tells Vercel to serve `index.html` for any path that is not a static file, allowing React Router to handle client-side routing.

**When to use:** Any Vite SPA with React Router (or any client-side router) deployed to Vercel. Without this, direct URL navigation to `/about`, `/projects`, etc. returns a 404.

**Example:**

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Source: [Vercel official Vite docs — "Using Vite to make SPAs"](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas)

### Pattern 3: One-Time Vercel Project Setup (local, before CI works)

**What:** Before the workflow can deploy, the Vercel project must exist and its IDs must be known. This is a one-time local step, not part of the CI workflow.

**Steps (run once locally, not committed):**
```bash
# Install Vercel CLI locally
npm install --global vercel@latest

# Authenticate (opens browser)
vercel login

# Link the project (creates .vercel/project.json — do NOT commit this file)
vercel link

# Read the IDs from the generated file
cat .vercel/project.json
# → {"projectId":"prj_xxx","orgId":"team_xxx"}

# Add to GitHub: Settings > Secrets and Variables > Actions
# VERCEL_TOKEN: (from vercel.com/account/tokens)
# VERCEL_ORG_ID: orgId value from project.json
# VERCEL_PROJECT_ID: projectId value from project.json
```

The `.vercel/` directory is auto-added to `.gitignore` by the CLI. Do not commit it.

### Pattern 4: Vite Base Path Change

**What:** Remove the GitHub Pages subpath from Vite config.

**Before:**
```javascript
// vite.config.js (current)
export default defineConfig({
  plugins: [react()],
  base: '/personal-website/',
})
```

**After:**
```javascript
// vite.config.js (after change)
export default defineConfig({
  plugins: [react()],
  base: '/',
})
```

Or simply omit `base` entirely — Vite's default is `'/'`.

### Anti-Patterns to Avoid

- **Committing `.vercel/project.json`:** The CLI auto-gitignores this. If committed, `orgId` and `projectId` would be public. Use GitHub Secrets instead.
- **Keeping the GitHub Pages `permissions` block:** `pages: write` and `id-token: write` permissions are not needed for Vercel CLI deployments and should be removed to follow least-privilege.
- **Running `npm ci` + `npm run build` in CI before `vercel --prod`:** With the user's chosen approach, Vercel builds the project on its infrastructure. Running a local build first wastes CI time and the artifacts are ignored.
- **Forgetting `vercel.json`:** The most common omission. Without it, the homepage loads fine but any direct URL to a React Router route returns a Vercel 404 page.
- **Using `npx vercel --prod` without env vars set:** If `VERCEL_ORG_ID` or `VERCEL_PROJECT_ID` are missing, the CLI will attempt interactive prompts and hang in CI. Both must be set in the workflow `env` block.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SPA route 404s | Custom Nginx/Apache rewrites or `_redirects` file | `vercel.json` rewrites | Vercel's native config; `_redirects` is Netlify's format, not Vercel's |
| CI/CD to Vercel | Shell scripts calling raw Vercel REST API | Vercel CLI (`vercel --prod`) | CLI handles auth, project linking, upload, and deployment lifecycle |
| Credentials management | Hardcoding `VERCEL_TOKEN` in workflow YAML | GitHub Secrets + `${{ secrets.* }}` | Secrets are encrypted at rest; values are masked in logs |

**Key insight:** Vercel's CLI abstracts the entire deployment API surface. There is no reason to use the Vercel REST API directly for this use case.

---

## Common Pitfalls

### Pitfall 1: Missing `vercel.json` — React Router 404s on Direct URL Access

**What goes wrong:** The site homepage loads at the Vercel URL, but navigating directly to `/about` or `/projects` (e.g., pasting the URL, refreshing mid-navigation) returns a Vercel 404 page.

**Why it happens:** Vercel serves static files. When a request arrives for `/about`, there is no `about.html` file — React Router is supposed to handle it client-side, but the server never serves `index.html` for that path.

**How to avoid:** Create `vercel.json` at project root with a catch-all rewrite to `/index.html` before pushing.

**Warning signs:** Homepage works, but any non-root route returns "404: NOT_FOUND" from Vercel (not from React).

### Pitfall 2: Old GitHub Pages Workflow Permissions Left in Place

**What goes wrong:** If the `permissions` block (`pages: write`, `id-token: write`) is left in the replaced workflow, the GITHUB_TOKEN will have unnecessary permissions. The deploy may also fail if the `concurrency: group: pages` setting causes the job to wait for a phantom Pages deployment that never completes.

**Why it happens:** Copy-paste from old workflow without removing Pages-specific configuration.

**How to avoid:** Replace `deploy.yml` wholesale rather than editing individual steps. Remove the `permissions` block, `concurrency` group, and two-job structure entirely.

### Pitfall 3: CI Hangs Because CLI Prompts Interactively

**What goes wrong:** The GitHub Actions workflow run hangs for minutes then times out. The CLI is waiting for user input to select a scope or confirm project setup.

**Why it happens:** `VERCEL_ORG_ID` or `VERCEL_PROJECT_ID` env vars are missing or misnamed. Without them, the CLI does not know which project to deploy and enters interactive mode.

**How to avoid:** Confirm both secrets exist in GitHub (`Settings > Secrets and Variables > Actions`) before merging the workflow change. The workflow `env` block must declare both variables.

**Warning signs:** The workflow step shows no output for 30+ seconds, then either times out or shows "No existing credentials found" messages.

### Pitfall 4: `VERCEL_TOKEN` Scope Too Narrow

**What goes wrong:** Deployment fails with an authorization error even though the token exists.

**Why it happens:** Vercel tokens can be scoped to specific teams. If `VERCEL_ORG_ID` points to a team and the token was created under a personal account (or a different team), authentication fails.

**How to avoid:** Create the token at vercel.com/account/tokens. If the project lives under a team, ensure the token has access to that team scope. The `orgId` from `.vercel/project.json` indicates whether the project is under a team (`team_xxx`) or personal account (`user_xxx`).

### Pitfall 5: Vercel's Native GitHub Integration Creates Duplicate Deployments

**What goes wrong:** After pushing to `development`, two deployments appear in the Vercel dashboard — one from the GitHub App integration and one from the GitHub Actions workflow.

**Why it happens:** If the Vercel project was created by connecting it to the GitHub repo via Vercel's UI, the native GitHub integration may still be active and auto-deploying on push.

**How to avoid:** When creating the Vercel project via `vercel link` CLI (not via the Vercel UI), the native GitHub integration is not enabled by default. If using the Vercel dashboard to create the project, disable the GitHub integration in Vercel project settings, or set `"github": {"enabled": false}` in `vercel.json`.

---

## Code Examples

### Complete `vercel.json` for Vite SPA

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Source: [Vercel Vite docs — SPA section](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas)

### Complete replacement `deploy.yml`

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

on:
  push:
    branches:
      - development

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Deploy to Vercel Production
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

Source: Adapted from [Vercel GitHub Actions guide](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel) with user decisions applied.

### Updated `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
})
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `npx vercel --prod` (single-step source deploy) | `vercel pull` + `vercel build` + `vercel deploy --prebuilt` (3-step prebuilt deploy) | Vercel CLI v28+ | The 3-step flow is now Vercel's official recommended CI pattern; it builds locally and uploads artifacts. The single-command approach still works and is fine for this project (no build-time secrets, no Skew Protection needed). |
| `actions/checkout@v2`, `actions/setup-node@v2` | `actions/checkout@v4`, `actions/setup-node@v4` | 2023-2024 | v4 uses Node 20 runtime in the action itself; v2/v3 use deprecated Node 16. The existing workflow already uses v4. |

**Still valid (not deprecated):**
- `vercel --prod` single command: documented and supported per [official Vercel CLI deploy docs](https://vercel.com/docs/cli/deploy#prod)
- `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` env var names: unchanged, read automatically by CLI

---

## Open Questions

1. **Does the Vercel project need to be created before the first CI run?**
   - What we know: Yes. The Vercel project must exist and its IDs must be known before secrets can be set. `vercel link` (run locally once) creates the project and reveals the IDs.
   - What's unclear: Whether the user already has a Vercel account and project, or needs to create one from scratch.
   - Recommendation: The plan should include a Wave 0 task for one-time Vercel project setup (local, manual) that precedes the code changes.

2. **Should the old GitHub Pages deployment be explicitly disabled in GitHub settings?**
   - What we know: Removing the `upload-pages-artifact` / `deploy-pages` steps from `deploy.yml` stops new GitHub Pages deployments. The existing Pages site at `deepak.github.io/personal-website/` will remain accessible until GitHub Pages is explicitly disabled in repository settings.
   - What's unclear: Whether the user wants the old URL to 404 or simply stop updating.
   - Recommendation: Include a verification step to disable GitHub Pages in repository Settings > Pages > Source = "None" to avoid confusion about which URL is canonical.

---

## Validation Architecture

> `nyquist_validation` is `true` in `.planning/config.json` — section included.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None installed — this is a pure infrastructure/config phase |
| Config file | None |
| Quick run command | Manual: `npm run build` (verifies Vite config is valid) |
| Full suite command | Manual: verify live Vercel URL loads correctly after deployment |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SITE-01 | Vercel production URL returns HTTP 200 with site content | smoke (manual-only) | `curl -I <vercel-url>` — requires live deployment | ❌ Wave 0 — no test file; manual smoke check |
| SITE-02 | Assets load with root-relative paths (`/assets/...` not `/personal-website/assets/...`) | smoke (manual-only) | `npm run build && grep -r 'personal-website' dist/` — verifies no old prefix remains | ❌ Wave 0 — can be scripted |
| SITE-03 | Push to `development` triggers workflow and Vercel deployment updates | integration (manual-only) | Observe GitHub Actions run and Vercel dashboard after push | ❌ Wave 0 — CI behavior, not automatable pre-deploy |

### Sampling Rate

- **Per task commit:** `npm run build` — confirms Vite config change does not break build
- **Per wave merge:** `npm run build` + manual check of `dist/index.html` for correct asset paths
- **Phase gate:** Live Vercel URL verified before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `scripts/check-build-paths.sh` (optional) — grep `dist/` for `/personal-website/` prefix after build; covers SITE-02 automatically
- [ ] No test framework to install — this phase has no unit-testable code changes; all validation is deployment smoke testing

*(Note: This is an infrastructure phase — all acceptance criteria are observable behaviors of a live deployment. No unit tests apply.)*

---

## Sources

### Primary (HIGH confidence)

- [Vercel CLI deploy docs](https://vercel.com/docs/cli/deploy) — `--prod` flag, `--prebuilt` flag, env var behavior
- [Vercel CLI project linking docs](https://vercel.com/docs/cli/project-linking) — `vercel link`, `.vercel/project.json` structure
- [Vercel Vite framework docs](https://vercel.com/docs/frameworks/frontend/vite) — auto-detection, SPA rewrite requirement
- [Vercel GitHub Actions guide (KB)](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel) — exact workflow YAML, secret names
- [Vercel CLI deploying from CLI](https://vercel.com/docs/cli/deploying-from-cli) — source vs prebuilt deployment models

### Secondary (MEDIUM confidence)

- [Vercel community: Rewrite to index.html for React + Vite SPA](https://community.vercel.com/t/rewrite-to-index-html-ignored-for-react-vite-spa-404-on-routes/8412) — confirms routing issue is common; resolved by `vercel.json` rewrites (matches official docs)
- [GitHub discussion: Why are orgId and projectId gitignored?](https://github.com/vercel/vercel/discussions/4518) — confirms `.vercel/` is auto-gitignored; IDs safe to use via env vars

### Tertiary (LOW confidence)

- None — all critical findings are backed by official Vercel documentation.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — confirmed via official Vercel CLI and GitHub Actions documentation
- Architecture patterns: HIGH — workflow YAML and `vercel.json` patterns taken directly from official Vercel docs
- Pitfalls: HIGH for SPA routing (official docs explicitly warn); MEDIUM for token scope / duplicate deployment (community-verified)

**Research date:** 2026-03-04
**Valid until:** 2026-06-04 (Vercel CLI stable; reassess if major version bump)
