# Roadmap: Personal Portfolio Website + AI Bot

## Overview

Starting from a scaffolded React 19 + Vite 7 SPA with placeholder content deployed on GitHub Pages, this roadmap delivers a credible live portfolio with real content, then builds the full RAG-powered AI chatbot infrastructure layer by layer. The work splits into two independent early tracks — Vercel migration (infrastructure prerequisite) and portfolio content (recruiter credibility) — then converges into a strict dependency chain for the AI backend: knowledge base authoring → abstraction layer → RAG indexer → serverless API → chat widget + CI automation. Every phase delivers something independently verifiable before the next phase begins.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Phases 1 and 2 can run in parallel (independent tracks).
Phases 3 and 4 can run in parallel (content authoring vs. code infrastructure).
Phase 5 depends on both 3 and 4.
Phases 7 and 8 can run in parallel (both depend on Phase 6).

- [ ] **Phase 1: Vercel Migration** - Move deployment from GitHub Pages to Vercel, fix Vite base path, update CI/CD
- [ ] **Phase 2: Portfolio Content** - Replace all placeholder content with real photo, bio, education, experience, projects, and resume PDF
- [ ] **Phase 3: Knowledge Base Authoring** - Write rich markdown files in `/knowledge/` that give the AI bot depth of context
- [ ] **Phase 4: AI Abstraction Layer** - Build provider-agnostic client wrappers for embedding, vector store, and LLM
- [ ] **Phase 5: RAG Indexer** - Build and validate the full index-time pipeline: parse, chunk, embed, upsert
- [ ] **Phase 6: Serverless Chat API** - Build and curl-test the full RAG query pipeline as a Vercel serverless function
- [ ] **Phase 7: Chat Widget** - Build the floating React chat UI against the working API with SSE streaming
- [ ] **Phase 8: GitHub Actions Re-Indexing** - Automate knowledge base re-indexing on push with loud failure on error

## Phase Details

### Phase 1: Vercel Migration
**Goal**: The site runs on Vercel at a production URL, assets load correctly, and the GitHub Actions workflow deploys to Vercel instead of GitHub Pages
**Depends on**: Nothing (first phase)
**Requirements**: SITE-01, SITE-02, SITE-03
**Success Criteria** (what must be TRUE):
  1. Visiting the production Vercel URL loads the site with all assets (no white screen, no 404s on CSS/JS)
  2. All internal navigation links work correctly (no `/personal-website/` prefix in routes or asset URLs)
  3. Pushing to the `development` branch triggers the GitHub Actions deploy workflow and the Vercel deployment updates
  4. The old GitHub Pages deployment is replaced and Vercel is the single source of truth for production
**Plans**: 2 plans
Plans:
- [ ] 01-01-PLAN.md — Vercel project setup + code changes (vite.config.js, vercel.json, deploy.yml)
- [ ] 01-02-PLAN.md — Push to development and verify live deployment

### Phase 2: Portfolio Content
**Goal**: Every portfolio section displays real, accurate information about Deepak — real photo, real bio, real education, real work history, real projects with GitHub links, downloadable resume
**Depends on**: Phase 1 (needs Vercel URL for final content verification; can be authored in parallel, deployed after Phase 1)
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, RESM-01
**Success Criteria** (what must be TRUE):
  1. Hero section shows a real photo of Deepak (not initials/placeholder), his name, tagline, and clickable GitHub and LinkedIn links
  2. About section contains a biographical paragraph written in Deepak's voice (not lorem ipsum or generic copy)
  3. Education section lists each degree with institution name and graduation year
  4. Work Experience section lists each job with company, role, date range, and 2-4 key accomplishments
  5. Projects page shows real project cards with name, description, tech stack badges, and a working GitHub link for each
  6. All pages render without horizontal scroll or layout breakage on a 375px wide mobile viewport
  7. Resume PDF is accessible via a download link from the Hero or navigation (link opens/downloads the file)
**Plans**: TBD

### Phase 3: Knowledge Base Authoring
**Goal**: The `/knowledge/` directory contains rich markdown files that give the AI bot enough context to answer nuanced questions about Deepak's experience, projects, and education — not just resume bullets
**Depends on**: Nothing (content authoring, no code dependencies; can run in parallel with Phase 1 and 4)
**Requirements**: KB-01, KB-02, KB-03, KB-04
**Success Criteria** (what must be TRUE):
  1. `/knowledge/experience.md` exists and covers each role with context beyond bullet points: key challenges faced, decisions made, and measurable impact
  2. `/knowledge/projects.md` exists and covers each project with what it did, tech decisions and tradeoffs, and what was learned
  3. `/knowledge/education.md` exists and covers degrees, relevant coursework, and academic background
  4. `/knowledge/resume.pdf` is present at the exact path the indexer expects
  5. The combined knowledge base is rich enough that a bot reading it could answer "What's the hardest problem Deepak solved at [company]?" with a specific, accurate answer
**Plans**: TBD

### Phase 4: AI Abstraction Layer
**Goal**: Three thin client wrappers exist — `EmbeddingClient`, `VectorStoreClient`, `LLMClient` — each backed by a concrete adapter, each swappable by changing a single adapter import and environment variable
**Depends on**: Phase 1 (Vercel environment in place for env var patterns)
**Requirements**: ABST-01, ABST-02, ABST-03
**Success Criteria** (what must be TRUE):
  1. `EmbeddingClient` wraps OpenAI `text-embedding-3-small` and accepts text input, returns a float array — no OpenAI SDK details exposed to callers
  2. `VectorStoreClient` wraps Upstash Vector and exposes `upsert(chunks)` and `query(vector, topK)` — no Upstash SDK details exposed to callers
  3. `LLMClient` wraps one provider (OpenAI or Anthropic) and exposes a `stream(prompt, systemPrompt)` method — swappable by changing one import
  4. Each client reads its API key from environment variables only — no keys in source code
**Plans**: TBD

### Phase 5: RAG Indexer
**Goal**: Running `node scripts/indexer.js` fully parses the knowledge base, chunks it, embeds it, and upserts it to Upstash Vector — and a direct query script confirms retrieval is returning relevant chunks
**Depends on**: Phase 3 (needs real knowledge base content) and Phase 4 (uses abstraction layer clients)
**Requirements**: RAG-01, RAG-02, RAG-03, RAG-04, RAG-05
**Success Criteria** (what must be TRUE):
  1. `scripts/indexer.js` runs to completion without error against the real `/knowledge/` directory
  2. Chunks are 500 tokens with 50-token overlap, and each chunk carries source filename and section metadata
  3. Querying Upstash Vector with "Where has Deepak worked?" returns the top-5 chunks that are genuinely about work experience (not education or projects)
  4. Re-running the indexer with unchanged content does not create duplicate vectors (idempotent via sha256 chunk IDs)
  5. Re-running the indexer after editing one markdown file updates only the changed chunks, not the entire vector store
**Plans**: TBD

### Phase 6: Serverless Chat API
**Goal**: `POST /api/chat` is a deployed Vercel serverless function that accepts a user message, runs the full RAG pipeline, and streams a persona-constrained LLM response back via SSE — validated with curl before any frontend is built
**Depends on**: Phase 5 (needs populated vector store and validated retrieval)
**Requirements**: API-01, API-02, API-03, API-04, API-05, API-06, API-07
**Success Criteria** (what must be TRUE):
  1. `curl -X POST /api/chat -d '{"message":"Where has Deepak worked?"}'` returns a streaming SSE response with accurate, grounded content
  2. The LLM response is constrained by persona prompt — when asked something not in the knowledge base, it says so and directs to contact info rather than hallucinating
  3. Sending more than 20 requests within an hour from the same IP returns a rate-limit error (not a successful LLM call)
  4. Sending a malformed request or triggering an internal error returns a structured JSON error response — the function does not crash or return an unhandled 500
  5. No API keys appear anywhere in the client-side JavaScript bundle (verified via `npm run build` + bundle inspection)
**Plans**: TBD

### Phase 7: Chat Widget
**Goal**: A floating chat widget in the bottom-right corner of every page lets visitors ask questions and receive streaming, persona-constrained answers — with starter chips, minimize/restore, graceful error fallback, and mobile-friendly layout
**Depends on**: Phase 6 (needs working `/api/chat` endpoint)
**Requirements**: CHAT-01, CHAT-02, CHAT-03, CHAT-04, CHAT-05, CHAT-06
**Success Criteria** (what must be TRUE):
  1. A chat icon is visible in the bottom-right corner on every page — clicking it opens the chat panel
  2. Clicking the icon again (or a close/minimize control) collapses the panel without losing message history in the same session
  3. Typing a question and submitting shows the response appearing token by token as SSE arrives (not a full response appearing at once after a delay)
  4. On first open (no messages yet), 3-4 starter question chips are shown — clicking one sends that question
  5. When the API is unreachable or returns an error, the widget shows a helpful message with contact info rather than a raw error or blank state
  6. On a 375px wide mobile screen, the widget opens without obscuring the entire page — readable and closeable
**Plans**: TBD

### Phase 8: GitHub Actions Re-Indexing
**Goal**: Pushing changes to files in `/knowledge/` on the `development` branch automatically triggers re-indexing — and if indexing fails, the GitHub Actions job fails loudly with a non-zero exit code and logs chunk counts
**Depends on**: Phase 5 (reuses `scripts/indexer.js`) and Phase 1 (project is on Vercel, secrets configured in GitHub)
**Requirements**: CI-01, CI-02, CI-03
**Success Criteria** (what must be TRUE):
  1. Editing any file in `/knowledge/` and pushing to `development` triggers the `reindex.yml` workflow automatically (without touching other files)
  2. Editing a non-knowledge-base file and pushing to `development` does NOT trigger the reindex workflow
  3. The workflow logs the number of chunks before and after indexing — a successful run shows "Indexed N chunks" in the Actions log
  4. Artificially breaking the indexer (e.g., bad API key) causes the workflow to exit with a non-zero code and the GitHub Actions job shows red (failed), not green (passed silently)
**Plans**: TBD

## Progress

**Execution Order:**
Phases 1 and 2 can run in parallel.
Phases 3 and 4 can run in parallel (both can start after planning).
Phase 5 requires Phases 3 and 4 complete.
Phase 6 requires Phase 5 complete.
Phases 7 and 8 can run in parallel (both require Phase 6).

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Vercel Migration | 1/2 | In Progress|  |
| 2. Portfolio Content | 0/TBD | Not started | - |
| 3. Knowledge Base Authoring | 0/TBD | Not started | - |
| 4. AI Abstraction Layer | 0/TBD | Not started | - |
| 5. RAG Indexer | 0/TBD | Not started | - |
| 6. Serverless Chat API | 0/TBD | Not started | - |
| 7. Chat Widget | 0/TBD | Not started | - |
| 8. GitHub Actions Re-Indexing | 0/TBD | Not started | - |

---

## Git Workflow Notes

This project uses feature branches for parallel work and clean history. Recommended branch strategy:

- `development` — integration branch; all feature branches merge here
- `feature/phase-1-vercel-migration` — Phase 1 work
- `feature/phase-2-portfolio-content` — Phase 2 work (can run alongside Phase 1)
- `feature/phase-3-knowledge-base` — Phase 3 work (can run alongside Phase 4)
- `feature/phase-4-abstraction-layer` — Phase 4 work
- `feature/phase-5-rag-indexer` — Phase 5 work
- `feature/phase-6-chat-api` — Phase 6 work
- `feature/phase-7-chat-widget` — Phase 7 work
- `feature/phase-8-ci-reindex` — Phase 8 work (can run alongside Phase 7)

Each plan within a phase can be committed on its branch; merge to `development` when the phase passes its success criteria. `main` receives merges from `development` for production deploys.

---
*Roadmap created: 2026-03-03*
*Granularity: fine (8 phases)*
*Coverage: 38/38 v1 requirements mapped*
