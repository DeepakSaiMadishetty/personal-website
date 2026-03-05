---
phase: 01-vercel-migration
plan: 01
subsystem: infra
tags: [vercel, vite, github-actions, spa, react-router]

# Dependency graph
requires: []
provides:
  - Vercel project linked with GitHub Actions CI/CD deployment
  - Vite configured for root-path asset serving (base '/')
  - SPA catch-all rewrite via vercel.json for React Router
  - GitHub Actions workflow deploying via Vercel CLI on push to development
affects:
  - 02-core-ui
  - all subsequent phases (deployment target established)

# Tech tracking
tech-stack:
  added: [vercel-cli]
  patterns: [vercel-cli-deploy, spa-rewrite-rule]

key-files:
  created:
    - vercel.json
  modified:
    - vite.config.js
    - .github/workflows/deploy.yml
    - .gitignore

key-decisions:
  - "Vercel CLI deployment (not Vercel GitHub integration) to avoid duplicate deploys"
  - "SPA catch-all rewrite in vercel.json so React Router routes don't 404 on direct navigation"
  - "Single-job workflow (not build+deploy split) since Vercel CLI handles build internally"

patterns-established:
  - "deploy.yml: single job, Vercel CLI --prod with token from secrets"
  - "vercel.json: catch-all rewrite to /index.html for SPA routing"

requirements-completed: [SITE-01, SITE-02, SITE-03]

# Metrics
duration: 10min
completed: 2026-03-04
---

# Phase 1 Plan 1: Vercel Migration Summary

**Vite base path changed to '/', vercel.json SPA rewrite added, and GitHub Actions replaced with Vercel CLI deploy — site now deploys to Vercel on push to development**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-04T00:00:00Z
- **Completed:** 2026-03-04T00:10:00Z
- **Tasks:** 2 (Task 1 human-action + Task 2 auto)
- **Files modified:** 4

## Accomplishments
- Vercel project created and linked; VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID secrets configured in GitHub (Task 1 — human-action)
- vite.config.js base changed from '/personal-website/' to '/' — assets now served root-relative
- vercel.json created with SPA catch-all rewrite so React Router routes (/about, /projects, etc.) resolve to index.html
- deploy.yml replaced entirely — removed GitHub Pages permissions, concurrency, and two-job structure; added Vercel CLI single-job deploy

## Task Commits

Each task was committed atomically:

1. **Task 1: Set up Vercel project and GitHub secrets** - (human-action — no commit, manual user steps)
2. **Task 2: Update Vite config, create vercel.json, replace deploy workflow** - `cc73d4e` (feat)

**Plan metadata:** (docs commit to follow)

## Files Created/Modified
- `vite.config.js` - Changed base from '/personal-website/' to '/' for root-relative asset paths
- `vercel.json` - New file: SPA catch-all rewrite routing all paths to /index.html
- `.github/workflows/deploy.yml` - Replaced GitHub Pages workflow with Vercel CLI deployment
- `.gitignore` - Confirmed .vercel directory is gitignored (entry was added)

## Decisions Made
- Used Vercel CLI deployment rather than Vercel's native GitHub integration to prevent duplicate deployments (GitHub integration auto-deploys AND Actions would deploy)
- Single-job workflow chosen because `vercel --prod` handles its own build step internally — no need to separate build and deploy jobs
- Catch-all rewrite `/(.*) → /index.html` handles all React Router client-side routes without Vercel 404s

## Deviations from Plan

None - plan executed exactly as written. The .gitignore already contained `.vercel` as an uncommitted change (noted by prior executor session), included in Task 2 commit.

## Issues Encountered
None - build passed cleanly, dist contained no `/personal-website/` path prefix.

## User Setup Required
Task 1 was a human-action checkpoint requiring manual setup:
- Vercel CLI installed globally and authenticated
- Project linked via `vercel link`
- Three GitHub secrets added: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
- Vercel project GitHub auto-deploy verified as DISABLED (to prevent duplicate deployments)

All manual steps completed by user before resumption.

## Next Phase Readiness
- Vercel deployment pipeline is fully operational — any push to `development` triggers a production Vercel deploy
- vite.config.js base '/' means all subsequent phases write asset paths without any prefix concerns
- React Router works on Vercel via catch-all rewrite
- Ready for Phase 2: Core UI implementation

---
*Phase: 01-vercel-migration*
*Completed: 2026-03-04*
