# External Integrations

**Analysis Date:** 2026-03-03

## APIs & External Services

**None detected**
- No API client libraries (axios, fetch wrappers, SDK packages)
- No third-party service integrations
- Application is entirely client-side rendered

## Data Storage

**Databases:**
- Not used - Portfolio website requires no data persistence

**File Storage:**
- Local filesystem only
- Static assets in `public/` directory
- Icon assets via react-icons library

**Caching:**
- Browser-based caching via HTTP headers
- No application-level caching mechanism

## Authentication & Identity

**Auth Provider:**
- Not applicable - No authentication required
- Public-facing portfolio website

## Monitoring & Observability

**Error Tracking:**
- Not detected - No error tracking service integrated

**Logs:**
- Browser console only - Development logging via console methods
- No centralized logging service

**Analytics:**
- Not detected - No analytics or usage tracking integration

## CI/CD & Deployment

**Hosting:**
- GitHub Pages - Static site hosting via GitHub
  - Repository: Personal website with automatic deployment
  - Base URL path: `https://github.com/deepak-sai/personal-website`

**CI Pipeline:**
- GitHub Actions (`.github/workflows/deploy.yml`)
  - Trigger: Push to `development` branch
  - Build environment: ubuntu-latest with Node.js 20
  - Process:
    1. Checkout code (`actions/checkout@v4`)
    2. Setup Node 20 with npm cache (`actions/setup-node@v4`)
    3. Install dependencies (`npm ci`)
    4. Build production artifacts (`npm run build`)
    5. Upload build artifacts (`actions/upload-pages-artifact@v3`)
    6. Deploy to GitHub Pages (`actions/deploy-pages@v4`)

**Deployment Context:**
- Environment: `github-pages`
- Permissions: Read contents, write pages, write ID token
- Concurrency: Single active deployment (older jobs cancelled)

## Environment Configuration

**Required env vars:**
- None - No environment-dependent configuration

**Secrets location:**
- Not applicable - No secrets or API keys required

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## Third-Party CDNs

**Google Fonts:**
- Integration: Loaded in `index.html` via `<link>` tag
- Fonts: Inter (wght: 300,400,500,600,700,800), Poppins (wght: 400,500,600,700,800)
- Purpose: Typography for professional portfolio appearance

## Social & Contact Integration

**Social Links:**
- Likely integrated via react-icons for social media icons in `src/components/` and `src/pages/Contact.jsx`
- No OAuth or social login required
- Static links only

---

*Integration audit: 2026-03-03*
