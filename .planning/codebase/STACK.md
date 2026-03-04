# Technology Stack

**Analysis Date:** 2026-03-03

## Languages

**Primary:**
- JavaScript (JSX) - All component and application code in `src/`
- CSS - Styling in `src/index.css` and component-level styles

## Runtime

**Environment:**
- Node.js v20 - GitHub Actions CI/CD uses Node 20 (from `.github/workflows/deploy.yml`)

**Package Manager:**
- npm v11.11.0
- Lockfile: Present (`package-lock.json`)

## Frameworks

**Core:**
- React 19.2.0 - UI library for building components
- React DOM 19.2.0 - React rendering to DOM
- React Router DOM 7.13.1 - Client-side routing for SPA navigation (`src/App.jsx`)

**Testing:**
- Not detected

**Build/Dev:**
- Vite 7.3.1 - Build tool and dev server (`vite.config.js`)
- @vitejs/plugin-react 5.1.1 - React support for Vite
- ESLint 9.39.1 - Code linting (`eslint.config.js`)
- ESLint plugins:
  - @eslint/js 9.39.1 - JavaScript rules
  - eslint-plugin-react-hooks 7.0.1 - React hooks linting
  - eslint-plugin-react-refresh 0.4.24 - React refresh validation

## Key Dependencies

**UI & Animation:**
- framer-motion 12.34.3 - Animation library for interactive components
- react-icons 5.5.0 - Icon library for UI elements

**Development Tools:**
- @types/react 19.2.7 - TypeScript type definitions (not using TypeScript, present for IDE support)
- @types/react-dom 19.2.3 - TypeScript type definitions for React DOM
- globals 16.5.0 - Global variable definitions for ESLint

## Configuration

**Environment:**
- No `.env` files present - No external environment-dependent configuration
- No `.nvmrc` file - Uses Node 20 via GitHub Actions setup

**Build:**
- `vite.config.js` - Vite configuration with React plugin and GitHub Pages base path (`/personal-website/`)
- `eslint.config.js` - ESLint configuration with flat config format
  - ECMAScript 2020 target with latest features
  - JSX parsing enabled
  - Browser globals enabled
  - No-unused-vars rule with uppercase pattern exception

**Entry Points:**
- `index.html` - HTML entry point with Google Fonts (Inter, Poppins)
- `src/main.jsx` - React application bootstrap with StrictMode and BrowserRouter

## Platform Requirements

**Development:**
- Node.js v20 or compatible
- npm or compatible package manager
- Modern browser with ES2020 support

**Production:**
- GitHub Pages - Static hosting from `dist/` directory
- Deployment: Automatic via GitHub Actions on `development` branch push
- Base path: `/personal-website/` for GitHub Pages subpath routing

## Build Process

**Development:**
```bash
npm run dev        # Start Vite dev server
```

**Production:**
```bash
npm run build      # Build optimized dist/
npm run preview    # Preview production build locally
npm run lint       # Run ESLint checks
```

**CI/CD:**
- GitHub Actions workflow: `.github/workflows/deploy.yml`
- Triggers: Push to `development` branch
- Steps: checkout → setup Node 20 → npm ci → npm run build → upload artifact → deploy to Pages

---

*Stack analysis: 2026-03-03*
