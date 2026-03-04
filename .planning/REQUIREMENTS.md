# Requirements: Personal Portfolio Website + AI Bot

**Defined:** 2026-03-03
**Core Value:** Visitors can learn anything about Deepak — through a structured portfolio and a conversational AI that answers their specific questions — without Deepak having to be present.

---

## v1 Requirements

### Deployment

- [ ] **SITE-01**: Site deployed on Vercel with a production URL
- [ ] **SITE-02**: Vite base path updated from `/personal-website/` to `/` for Vercel compatibility
- [ ] **SITE-03**: GitHub Actions deploy workflow updated to target Vercel (replaces GitHub Pages)

### Portfolio Content

- [ ] **CONT-01**: Hero section displays real photo, name, tagline, and GitHub + LinkedIn links
- [ ] **CONT-02**: About section has a biographical introduction (not placeholder text)
- [ ] **CONT-03**: Education section lists each degree with institution and graduation year
- [ ] **CONT-04**: Work Experience section lists each job with company, role, dates, and key accomplishments
- [ ] **CONT-05**: Projects page shows project cards with name, description, tech stack, and GitHub link
- [ ] **CONT-06**: All pages render correctly on mobile viewport (responsive)

### Resume

- [ ] **RESM-01**: Resume PDF is downloadable from the site (linked from Hero or navigation)

### Knowledge Base

- [ ] **KB-01**: `/knowledge/experience.md` authored — rich work experience context beyond resume bullets (challenges, decisions, impact)
- [ ] **KB-02**: `/knowledge/projects.md` authored — project deep-dives (what it did, tech decisions, what was learned)
- [ ] **KB-03**: `/knowledge/education.md` authored — degrees, relevant coursework, background
- [ ] **KB-04**: Resume PDF placed at `/knowledge/resume.pdf` for the indexer

### RAG Indexer + Vector Store

- [ ] **RAG-01**: `scripts/indexer.js` parses `/knowledge/resume.pdf` and all `/knowledge/*.md` files
- [ ] **RAG-02**: Text chunked at ~500 tokens with 50-token overlap and source/section metadata per chunk
- [ ] **RAG-03**: Chunks embedded via OpenAI `text-embedding-3-small`
- [ ] **RAG-04**: Vectors upserted to Upstash Vector with deterministic chunk IDs (sha256 of source + chunk_index) — idempotent
- [ ] **RAG-05**: Retrieval validated via direct query script before any UI is built

### Serverless Chat API

- [ ] **API-01**: `POST /api/chat` serverless function deployed on Vercel
- [ ] **API-02**: RAG pipeline implemented: embed query → retrieve top-5 chunks → build augmented prompt → stream LLM response
- [ ] **API-03**: Persona-constrained system prompt ("answer ONLY from provided context; if insufficient, redirect to contact info")
- [ ] **API-04**: Response streamed via SSE (Server-Sent Events) to the frontend
- [ ] **API-05**: IP-based rate limiting (~20 requests/hour per IP)
- [ ] **API-06**: Graceful error handling — function returns structured error, never crashes
- [ ] **API-07**: All API keys stored as Vercel environment variables only — never in source code

### AI Abstraction Layer

- [ ] **ABST-01**: `EmbeddingClient` wrapper with OpenAI adapter — swap embedding provider by changing adapter + env var
- [ ] **ABST-02**: `VectorStoreClient` wrapper with Upstash adapter — swap vector store by changing adapter + env var
- [ ] **ABST-03**: `LLMClient` wrapper with initial provider adapter (OpenAI or Anthropic) — swap LLM by changing adapter + env var

### Chat Widget

- [ ] **CHAT-01**: Floating chat widget fixed to bottom-right corner, accessible from any page
- [ ] **CHAT-02**: Widget opens and minimizes with a single click
- [ ] **CHAT-03**: Streaming response rendered token-by-token as SSE arrives (not buffered)
- [ ] **CHAT-04**: Starter question chips shown on first open (e.g., "Where has Deepak worked?", "What projects has he built?")
- [ ] **CHAT-05**: Graceful error fallback — when API is unreachable, shows contact info instead of error message
- [ ] **CHAT-06**: Mobile-friendly layout — widget does not obscure page content on small screens

### GitHub Actions Re-Indexing

- [ ] **CI-01**: `.github/workflows/reindex.yml` triggers when knowledge base files change on push to `development`
- [ ] **CI-02**: Workflow exits with non-zero code if indexing fails (loud failure, not silent)
- [ ] **CI-03**: Workflow logs chunk count before and after indexing to confirm successful update

---

## v2 Requirements

### Portfolio

- **CONT-V2-01**: Skills section with tools and technologies
- **CONT-V2-02**: Contact form with backend email delivery

### AI Bot

- **BOT-V2-01**: Chat session persistence across browser refresh (localStorage or database)
- **BOT-V2-02**: GitHub API auto-sync to pull in README content from public repos
- **BOT-V2-03**: "About me" knowledge base section (motivations, personal context, what Deepak is looking for)

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Fine-tuning an LLM | RAG is cheaper, faster to update, and more accurate for Q&A. Fine-tuning solves a different problem. |
| Scraping private GitHub repos | Auth complexity; manual curation keeps content quality controlled |
| Auto-generated PDF resume | Static PDF upload is reliable and sufficient for v1 |
| Pre-built chat UI libraries | Would conflict with existing Framer Motion + custom CSS design system |
| WebSockets for chat streaming | SSE is sufficient for one-directional streaming; WebSockets add unnecessary complexity |
| Chroma / self-hosted vector store | Incompatible with Vercel serverless — needs persistent server |
| User accounts / auth | No use case for a personal portfolio |
| Dark mode | Significant UI complexity for v1; no payoff |
| Blog / CMS | Markdown files feed the AI; a blog is a separate product |

---

## Traceability

*Populated during roadmap creation.*

| Requirement | Phase | Status |
|-------------|-------|--------|
| SITE-01–03 | Phase 1 | Pending |
| CONT-01–06 | Phase 1 | Pending |
| RESM-01 | Phase 1 | Pending |
| KB-01–04 | Phase 2 | Pending |
| RAG-01–05 | Phase 3 | Pending |
| ABST-01–03 | Phase 3 | Pending |
| API-01–07 | Phase 4 | Pending |
| CHAT-01–06 | Phase 5 | Pending |
| CI-01–03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 33 total
- Mapped to phases: 33
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-03*
*Last updated: 2026-03-03 after initial definition*
