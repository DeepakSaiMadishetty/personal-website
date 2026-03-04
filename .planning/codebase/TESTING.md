# Testing Patterns

**Analysis Date:** 2026-03-03

## Test Framework

**Runner:**
- Not detected - No test runner configured

**Assertion Library:**
- Not detected

**Run Commands:**
```bash
npm run lint              # ESLint only, no tests
npm run dev              # Development server
npm run build            # Production build
npm run preview          # Preview build
```

## Test File Organization

**Location:**
- No test files found in `/src` directory
- No `.test.js`, `.test.jsx`, `.spec.js`, `.spec.jsx` files detected in project

**Naming:**
- Not applicable

**Structure:**
- Not applicable

## Test Structure

**Suite Organization:**
- Not currently implemented

**Patterns:**
- Not applicable

## Mocking

**Framework:**
- Not used - No test framework detected

**Patterns:**
- Not applicable

**What to Mock:**
- Not currently relevant

**What NOT to Mock:**
- Not currently relevant

## Fixtures and Factories

**Test Data:**
- Not used - No test framework detected

**Location:**
- Not applicable

## Coverage

**Requirements:**
- No coverage requirements enforced

**View Coverage:**
- Not applicable

## Test Types

**Unit Tests:**
- Not currently implemented
- Candidates for testing:
  - `Card.jsx`: Animation and prop handling
  - `CursorIcon.jsx`: Mouse event handling and rotation calculation
  - `Navbar.jsx`: Navigation link rendering
  - `FloatingButton.jsx`: Link vs button behavior

**Integration Tests:**
- Not currently implemented
- Candidates:
  - Route navigation with React Router
  - Page rendering with all components

**E2E Tests:**
- Not implemented
- Could use Playwright or Cypress for testing user flows:
  - Navigation between pages
  - Animation performance
  - Link functionality

## Recommended Testing Setup

**To Add Testing to This Project:**

1. **Install testing dependencies:**
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

2. **Create vitest.config.js:**
```javascript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
  },
})
```

3. **Test file location pattern:**
- Place test files next to source: `Card.test.jsx` beside `Card.jsx`
- Or in `src/__tests__/` directory for unit tests

4. **Example test structure (Vitest + React Testing Library):**
```javascript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from './Card'

describe('Card Component', () => {
  it('renders children content', () => {
    render(<Card>Test content</Card>)
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Card className="custom">Content</Card>)
    expect(container.querySelector('.custom')).toBeInTheDocument()
  })

  it('applies delay prop to animation', () => {
    render(<Card delay={0.5}>Content</Card>)
    // Animation testing would verify transition props
  })
})
```

## Current Testing Status

**Coverage:** 0% - No tests implemented

**Quality Risks:**
- No automated testing for component rendering
- No tests for animation state transitions
- No tests for event handlers (e.g., `CursorIcon` mouse tracking)
- No tests for routing functionality
- No tests for data mapping (e.g., projects, skills arrays)

---

*Testing analysis: 2026-03-03*
