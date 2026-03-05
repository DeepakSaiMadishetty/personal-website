---
phase: 1
slug: vercel-migration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-04
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — pure infrastructure/config phase; no unit-testable code |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && grep -r 'personal-website' dist/ && echo "CLEAN" || echo "OLD PATH FOUND"` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run full suite command + manual check of `dist/index.html` asset paths
- **Before `/gsd:verify-work`:** Live Vercel URL must return HTTP 200 with all assets loading

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 0 | SITE-01 | manual | Set up Vercel project + secrets (no automation) | ❌ manual | ⬜ pending |
| 1-01-02 | 01 | 1 | SITE-02 | automated | `npm run build && grep -r 'personal-website' dist/ \|\| echo "CLEAN"` | ✅ inline | ⬜ pending |
| 1-01-03 | 01 | 1 | SITE-02 | automated | `npm run build` | ✅ inline | ⬜ pending |
| 1-01-04 | 01 | 1 | SITE-03 | manual | Push to `development`, observe GitHub Actions run and Vercel dashboard | ❌ manual | ⬜ pending |
| 1-01-05 | 01 | 2 | SITE-01 | smoke | `curl -I <vercel-url>` — verify HTTP 200 | ❌ manual (live URL) | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] One-time Vercel project setup (local): `vercel login` → `vercel link` → capture `VERCEL_ORG_ID` + `VERCEL_PROJECT_ID`
- [ ] Add 3 GitHub repo secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

*No test framework installation needed — this phase has no unit-testable code changes.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Vercel production URL returns HTTP 200 | SITE-01 | Requires live deployment to exist | Visit the `*.vercel.app` URL after first deploy; check no white screen, no 404s on CSS/JS |
| All internal routes work (no 404 on `/about`, `/projects`) | SITE-02 | Requires live deployment + `vercel.json` rewrite | Navigate to each route directly (paste URL in browser); confirm page loads |
| Push to `development` triggers workflow | SITE-03 | CI behavior — not automatable pre-deploy | Make a test commit to `development`, observe GitHub Actions tab shows new run and Vercel dashboard shows deployment |
| Old GitHub Pages URL stops updating | SITE-01 | GitHub Pages is a separate system | After workflow replacement, verify `deepak.github.io/personal-website/` no longer gets new deployments |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
