# Architecture

**Analysis Date:** 2026-03-03

## Pattern Overview

**Overall:** Single Page Application (SPA) with Client-Side Routing

**Key Characteristics:**
- React-based frontend with React Router for client-side navigation
- Component-driven architecture with shared reusable UI components
- Page-level components that serve as route targets
- Motion/animation as a first-class design concern using Framer Motion
- Static content presentation with no backend API integration
- GitHub Pages deployment with Vite as build tool

## Layers

**Presentation Layer:**
- Purpose: Render UI and handle user interactions
- Location: `src/components/`, `src/pages/`
- Contains: React components, styled CSS modules
- Depends on: React, React Router, Framer Motion, react-icons
- Used by: App.jsx router configuration

**Page Layer:**
- Purpose: Route targets that compose components to display full page views
- Location: `src/pages/`
- Contains: Home, About, Experience, Projects, Education, Skills, Contact pages
- Depends on: Presentation components, local CSS, react-router-dom
- Used by: App.jsx Routes

**Component Layer:**
- Purpose: Reusable UI building blocks with animations and interactive behaviors
- Location: `src/components/`
- Contains: Navbar, Footer, Card, FloatingButton, CursorIcon
- Depends on: Framer Motion, react-icons, react-router-dom (for Navbar/Footer)
- Used by: Pages and other components

**Layout Components:**
- Purpose: Persistent layout elements rendered on all pages
- Location: `src/components/Navbar.jsx`, `src/components/Footer.jsx`
- Contains: Navigation bar with links, footer with contact links
- Depends on: react-router-dom for NavLink
- Used by: App.jsx wrapper

**Root Application:**
- Purpose: Entry point for routing and layout composition
- Location: `src/App.jsx`
- Contains: Route definitions, Navbar/Footer wrapper
- Depends on: react-router-dom Routes
- Used by: main.jsx

**Bootstrap Entry:**
- Purpose: Initialize React application and mount to DOM
- Location: `src/main.jsx`
- Contains: React root creation, BrowserRouter provider, app mount
- Depends on: React, React DOM, React Router
- Used by: index.html script tag

## Data Flow

**Page Navigation:**

1. User clicks NavLink in Navbar (`src/components/Navbar.jsx`)
2. React Router updates URL path based on route match
3. App component (`src/App.jsx`) renders corresponding page component
4. Page component renders with animation using Framer Motion
5. Content displays with Card animations triggered by viewport intersection

**Component Animation Flow:**

1. Page component mounts with initial Framer Motion state (opacity: 0, transform)
2. Framer Motion animates to final state (opacity: 1, transform: none)
3. Card components use `useInView` hook to trigger entrance animations on scroll
4. FloatingButton components have continuous floating animation (y-axis loop)
5. Interactive elements respond to hover/tap with Framer Motion variants

**Static Content Management:**

1. Content data stored as JavaScript objects/arrays within page components (e.g., `projects` array in Projects.jsx)
2. Data mapped to Card components with staggered animations based on index
3. Contact form data managed with React useState hook
4. Form submission triggers mailto: links for email delivery

**State Management:**

- Minimal state: Contact form in Contact.jsx uses useState for form inputs
- Navigation state: React Router manages current route
- Animation state: Framer Motion manages all animation state internally
- View state: Card components use useRef + useInView for viewport detection

## Key Abstractions

**Card Component:**
- Purpose: Reusable container for animated content with entrance animation and shimmer loading
- Examples: `src/components/Card.jsx`
- Pattern: Compound component with children. Uses Framer Motion for animations, useInView for viewport-based triggering
- Props: `children`, `className`, `delay` for stagger control

**FloatingButton Component:**
- Purpose: Animated button/link that floats with continuous Y-axis animation
- Examples: `src/components/FloatingButton.jsx`
- Pattern: Polymorphic component - renders as button or anchor based on `href` prop. Uses Framer Motion for continuous animation
- Props: `children`, `href` (optional), `onClick` (optional), `className`

**Page Layout Pattern:**
- Purpose: Consistent page structure and spacing
- Examples: `src/pages/*.jsx`
- Pattern: All pages wrap content in div with `page-container` class. Include `section-title` h2 as header
- Common children: Cards for content sections, staggered animations with delay prop

**Navigation Structure:**
- Purpose: Centralized route and navigation item definitions
- Examples: `src/components/Navbar.jsx` navItems array
- Pattern: Data-driven navigation with array mapping to NavLink components
- Allows: Easy addition of new routes without code duplication

## Entry Points

**HTML Entry Point:**
- Location: `index.html`
- Triggers: Initial page load in browser
- Responsibilities: Provides root DOM element (`<div id="root">`), loads Google Fonts, sets page title and metadata

**React Application Entry:**
- Location: `src/main.jsx`
- Triggers: Script loaded from index.html
- Responsibilities: Creates React root, wraps app with BrowserRouter, mounts App component

**Application Router:**
- Location: `src/App.jsx`
- Triggers: Initial page load after React mounts
- Responsibilities: Defines all routes, renders persistent Navbar/Footer, manages page-level routing

**Individual Page Entry:**
- Location: `src/pages/*.jsx` (Home, About, Experience, Projects, Education, Skills, Contact)
- Triggers: User navigation or direct URL
- Responsibilities: Render page-specific content, manage page-level animations, handle page data

## Error Handling

**Strategy:** Minimal error handling - static content approach

**Patterns:**
- Form validation: Required attributes on HTML inputs in Contact form
- Navigation: React Router handles invalid routes (no 404 page configured)
- Link handling: External links use `target="_blank"` and `rel="noopener noreferrer"` for security
- Email submission: Fallback to mailto: links, no backend validation

## Cross-Cutting Concerns

**Logging:** Not implemented - no logging library present

**Validation:**
- HTML5 form validation in Contact.jsx (required fields)
- No runtime validation library (Zod installed but not used)

**Authentication:** Not applicable - static portfolio site

**Animation:**
- Centralized through Framer Motion usage across all components
- Common patterns: entrance animations (opacity + transform), scroll-triggered animations (Card), continuous animations (FloatingButton)
- Timing: Staggered delays using index-based delay prop throughout

**Styling:**
- Design tokens in `src/index.css` (CSS custom properties for colors, spacing, shadows, transitions)
- Component-scoped CSS files (one per component/page)
- Consistent naming: `.component-name`, `.component-name--variant`, `.component-name__element`

---

*Architecture analysis: 2026-03-03*
