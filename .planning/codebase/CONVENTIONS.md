# Coding Conventions

**Analysis Date:** 2026-03-03

## Naming Patterns

**Files:**
- Components use PascalCase: `Card.jsx`, `Navbar.jsx`, `FloatingButton.jsx`
- Pages use PascalCase: `Home.jsx`, `About.jsx`, `Projects.jsx`
- CSS files use lowercase matching component: `Card.css`, `Navbar.css`
- One component per file

**Functions:**
- Component functions use PascalCase: `function Card()`, `function Navbar()`
- Event handlers use camelCase prefixed with `handle`: `handleMouseMove()`, `handleClick()`
- Helper functions use camelCase: `isInView`, `setRotation`
- Regular functions use camelCase: `useCallback()` hooks

**Variables:**
- State variables use camelCase: `rotation`, `isInView`
- Constants use camelCase: `navItems`, `projects`, `skillCategories`
- CSS class names use kebab-case: `home-hero`, `card-content`, `skill-chip`
- CSS modifier classes use double dash: `nav-link--active`, `floating-btn--secondary`

**Types:**
- Props are destructured in function parameters
- No TypeScript types defined (JavaScript project)
- JSDoc comments optional, not used consistently

## Code Style

**Formatting:**
- 2-space indentation (inferred from code style)
- ESLint 9.39.1 configured for JavaScript/JSX
- No dedicated Prettier config file detected
- Line lengths typically under 100 characters

**Linting:**
- Config: `eslint.config.js`
- ESLint flat config format (new style)
- Rules configured:
  - `no-unused-vars`: Error, with varsIgnorePattern for uppercase variables
- Extends: `@eslint/js`, `eslint-plugin-react-hooks/recommended`, `eslint-plugin-react-refresh`
- Language: ECMAScript 2020, JSX enabled
- Target environment: Browser globals

## Import Organization

**Order:**
1. External libraries (react, framer-motion, react-router-dom, react-icons)
2. Component imports from relative paths
3. CSS imports (last)

**Example from `Home.jsx`:**
```javascript
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaLinkedin } from 'react-icons/fa'
import CursorIcon from '../components/CursorIcon'
import FloatingButton from '../components/FloatingButton'
import Card from '../components/Card'
import './Home.css'
```

**Path Aliases:**
- No path aliases configured
- Uses relative paths: `../components/`, `../pages/`

## Error Handling

**Patterns:**
- No explicit error handling with try-catch blocks detected
- Defensive checks with early returns: `if (!containerRef.current) return`
- No error state management
- No error boundaries detected

## Logging

**Framework:** Not used

**Patterns:**
- No logging statements detected in source code
- No console.log, console.error, or similar found

## Comments

**When to Comment:**
- Comments are minimal to none in the codebase
- Self-documenting code preferred (descriptive variable/function names)
- Complex animations and calculations rely on clear variable names

**JSDoc/TSDoc:**
- Not used in this JavaScript project

## Function Design

**Size:**
- Components typically 30-60 lines
- Keep functions focused and modular
- Larger components (like `Home.jsx`) reach ~90 lines

**Parameters:**
- Destructure props in function signature
- Keep prop count reasonable (3-4 props typical)
- Example: `function Card({ children, className = '', delay = 0 })`

**Return Values:**
- Always return JSX for components
- Use conditional rendering with ternary operators
- Use logical AND for optional content: `{!isInView && <div ... />}`

## Module Design

**Exports:**
- Use default export for components: `export default Card`
- One component per file

**Barrel Files:**
- No barrel files (index.js) detected
- Imports use direct paths: `import Card from '../components/Card'`

**Data Structure:**
- Use constant arrays/objects for static data at module level
- Examples: `const projects = [...]`, `const navItems = [...]`
- Place before component function
- Map over data in render with unique keys (index when stable)

## React Patterns

**Hooks:**
- Use `useState` for local state: `const [rotation, setRotation] = useState(0)`
- Use `useRef` for DOM access: `const ref = useRef(null)`, `const containerRef = useRef(null)`
- Use `useCallback` for event handlers with dependencies: `const handleMouseMove = useCallback((e) => { ... }, [])`

**Props:**
- Always provide `key` prop in lists (use index when data is static)
- Use class name concatenation for conditional styles: `className={`nav-link ${isActive ? 'nav-link--active' : ''}`}`

**Animation:**
- Framer Motion is standard library for animations
- Use `motion` components for animated elements
- Common pattern: `initial`, `animate`, `transition` props
- Use `useInView` hook for scroll-triggered animations

---

*Convention analysis: 2026-03-03*
