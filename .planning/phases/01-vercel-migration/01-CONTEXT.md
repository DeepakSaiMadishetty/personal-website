# Phase 1: Vercel Migration - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Move hosting from GitHub Pages to Vercel — update `vite.config.js` base path, replace the GitHub Actions deployment workflow to use Vercel CLI, and decommission the GitHub Pages deployment. The site must load correctly at the Vercel production URL with no broken assets or routes.

</domain>

<decisions>
## Implementation Decisions

### CI/CD approach
- Use Vercel CLI (`npx vercel --prod`) inside the existing GitHub Actions workflow — do not use Vercel's native GitHub integration or a third-party action
- Vercel handles the build (source code is passed to Vercel; it auto-detects Vite and runs `npm run build` on its infrastructure — no separate build step needed in the workflow)
- Store Vercel credentials as GitHub repository secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

### Branch → environment mapping
- `development` branch triggers the Vercel production deployment (same trigger as the current GitHub Pages workflow)
- `main` branch is a stable reference branch — not wired to any deployment
- Single deployment target: push to `development` = live on Vercel

### Vite base path
- Change `vite.config.js` `base` from `/personal-website/` to `/` — required for Vercel's root-path hosting

### GitHub Pages cleanup
- The old `deploy.yml` GitHub Pages steps (`upload-pages-artifact`, `deploy-pages`) are fully replaced — no parallel GitHub Pages deployment remains

### Claude's Discretion
- Custom domain setup (use auto-generated `*.vercel.app` URL for now)
- Preview deployments for other branches (not configured in v1)
- Exact Vercel project name and team settings

</decisions>

<code_context>
## Existing Code Insights

### Files to modify
- `vite.config.js`: Change `base: '/personal-website/'` → `base: '/'` (line 7)
- `.github/workflows/deploy.yml`: Replace GitHub Pages deploy steps with Vercel CLI invocation; keep trigger on `development` branch push

### Integration points
- No routing or asset path changes needed in React code — React Router uses relative paths; only Vite's `base` config affects asset URLs
- Workflow already has Node 20 setup and `npm ci` step — reusable for any pre-flight checks

### No new dependencies in source
- Vercel CLI is invoked via `npx vercel` — no package.json dependency needed

</code_context>

<specifics>
## Specific Ideas

- No specific UI or behavior references — this is a pure infrastructure phase

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-vercel-migration*
*Context gathered: 2026-03-04*
