# Project Research Summary

**Project:** Personal Portfolio Website + AI Bot
**Domain:** Personal Portfolio SPA + RAG AI Chatbot on Vercel
**Researched:** 2026-03-03
**Confidence:** HIGH

## Executive Summary

This is a personal portfolio SPA with an embedded RAG-powered AI chatbot. The portfolio shell already exists (React 19 + Vite 7, 7 pages scaffolded, deployed to GitHub Pages), but contains only placeholder content and lacks the AI layer entirely. The work ahead splits cleanly into two independent tracks: (1) filling the existing portfolio with real content, and (2) building the full AI backend pipeline from scratch. The recommended approach is to complete both tracks sequentially — content first since it has no dependencies, then AI infrastructure in strict dependency order (knowledge base → indexer → serverless API → chat widget).

The AI architecture follows a well-established serverless RAG pattern: Vercel hosts the frontend SPA and a single serverless function (`/api/chat.js`) that owns the full query pipeline. A GitHub Actions workflow handles re-indexing on every push. The key technology choices are Vercel AI SDK v4 for LLM orchestration, OpenAI `text-embedding-3-small` for embeddings, and Upstash Vector as the serverless-native vector store. All three AI service integrations are abstracted behind thin client wrappers, enabling provider swaps with minimal code changes.

The top risks are: API keys leaking into the browser bundle (must be enforced from day one of the AI phase), LLM hallucinating facts about Deepak without a persona constraint in the system prompt, and poor RAG retrieval due to a thin knowledge base. All three risks have clear prevention strategies that must be built into the architecture from the start, not bolted on after the fact. A second category of risk — rate limiting and cost controls — can be added to the serverless function before the site goes live.

---

## Key Findings

### Recommended Stack

The existing React 19 + Vite 7 + Framer Motion stack is kept as-is. The deployment platform migrates from GitHub Pages to Vercel, which is required to host serverless functions for the AI backend. Vercel's Hobby tier (free) supports 100k function invocations/month and 10s max execution time — sufficient for a personal portfolio with moderate traffic.

For AI, Vercel AI SDK v4 is the canonical choice: the `useChat` hook manages message state and streaming on the frontend, while `streamText` drives the serverless function. LLM and vector store integrations are wrapped in provider-agnostic adapters so the underlying service can be swapped by changing an environment variable.

**Core technologies:**
- **Vercel (hosting):** Replaces GitHub Pages — required for serverless functions; unifies frontend + backend in one deploy
- **Vercel AI SDK v4 (`ai` package):** LLM orchestration — `useChat` hook + `streamText`; handles SSE streaming natively
- **`@ai-sdk/openai` / `@ai-sdk/anthropic`:** Provider adapters — swap with a single import change in `lib/llm.js`
- **OpenAI `text-embedding-3-small`:** Embeddings — 1536 dimensions, <$0.01 total cost for a resume-scale knowledge base
- **Upstash Vector:** Vector store — serverless/REST-native, free tier (~10k vectors, ~10k queries/day), no credit card required
- **`pdf-parse`:** Resume PDF parsing — simple, no native deps; fallback to `pdfjs-dist` for complex layouts
- **LangChain `RecursiveCharacterTextSplitter` (text splitter only):** Chunking — 500 tokens, 50-token overlap; do NOT adopt LangChain's chain/agent system

**What NOT to use:** Pre-built chat UI libraries (conflict with design system), WebSockets for streaming (SSE is sufficient), Vercel KV for vectors (not a vector DB), Chroma (needs persistent server), LangChain chains/agents (heavy overhead for this use case).

### Expected Features

The SPA scaffolding exists but has no real content. Every portfolio page requires real data. The AI chatbot — the site's primary differentiator — does not exist at all.

**Must have (table stakes):**
- Real photo in Hero/About — placeholder initials kill credibility
- GitHub links on project cards — unverifiable work without them
- Downloadable resume PDF — recruiters always want this
- Populated Education, Experience, Projects sections with real content
- Responsive design across all pages — 50%+ of traffic is mobile

**Should have (differentiators):**
- AI floating chat widget (RAG-powered) — interactive vs passive; main differentiator
- Starter question chips in chat — reduces cold-start friction
- Streaming SSE responses — perceived performance; "alive" feeling
- Provider-agnostic LLM interface — future-proof
- Auto re-indexing on push — knowledge base stays current at zero manual effort
- Rich markdown knowledge base (`/knowledge/` directory) — depth of context determines bot quality
- Graceful AI error fallback — shows contact info when LLM is unreachable

**Defer (v2+):**
- Skills section — projects already convey tech breadth
- Contact form — social links in Hero satisfy v1 need
- Dark mode toggle — significant UI complexity, no v1 payoff
- Chat session persistence / database — component state is sufficient for v1
- GitHub API repo auto-sync — rate limits + token complexity; manual curation is cleaner

### Architecture Approach

The system has two independent runtime modes sharing one vector store. Query-time: user message → embed → similarity search → augment prompt → stream LLM response via SSE. Index-time: push to repo → parse docs → chunk → embed → upsert vectors. The security rule is absolute: the serverless function is the ONLY component that touches AI/vector APIs. API keys never reach the browser bundle.

**Major components:**
1. **`ChatWidget` (React)** — renders UI, sends queries via `POST /api/chat`, reads SSE stream
2. **`/api/chat.js` (Vercel serverless)** — owns entire RAG query pipeline; the security boundary
3. **`EmbeddingClient` / `VectorStoreClient` / `LLMClient` (thin wrappers)** — provider-agnostic abstractions; change provider by swapping adapter + env var
4. **`/knowledge/` directory** — markdown files + resume PDF; source of truth for the bot
5. **`scripts/indexer.js`** — parses, chunks, embeds, and upserts knowledge base
6. **`.github/workflows/reindex.yml`** — triggers indexer on push; keeps knowledge base current

**Key patterns:** Idempotent re-indexing via deterministic chunk IDs (sha256 of source + chunk_index) prevents vector accumulation. Persona-constrained system prompt prevents hallucination. SSE streaming over ReadableStream (not WebSockets). Fixed 500-token chunks with 50-token overlap and source/section metadata.

### Critical Pitfalls

1. **API keys in the browser** — Any AI SDK import in a `.jsx` file is a breach. Enforce the serverless boundary from the first AI commit. All keys are Vercel env vars only.

2. **LLM hallucinating facts about Deepak** — Without a persona constraint, the LLM invents plausible-sounding but wrong details. System prompt MUST include: "Answer ONLY from the provided context. If the context does not contain the answer, say so and direct the visitor to contact Deepak."

3. **Vite base path left as `/personal-website/` after Vercel migration** — This breaks all asset URLs on Vercel with a white screen. First step of migration phase: change `base: '/personal-website/'` to `base: '/'` in `vite.config.js`.

4. **Thin knowledge base → poor bot quality** — Resume PDF alone is not enough. The bot will hit "I don't know" frequently. Author rich markdown per project (decisions, challenges, motivations) and an `about.md` with personal context. Think of it as FAQ docs for yourself.

5. **No rate limiting → runaway LLM costs** — Add IP-based rate limiting to `/api/chat.js` (max ~20 req/hr per IP) and set a spend cap in the LLM provider dashboard before the site goes public.

6. **GitHub Actions re-indexing silently failing** — Knowledge base becomes stale without notification. Fail the job loudly with non-zero exit code; add failure notifications; log chunk counts.

7. **Embedding model mismatch** — Switching embedding models requires a full re-index. Document the model as critical configuration; treat any swap as a breaking change with a checklist.

---

## Implications for Roadmap

Based on the dependency chain in FEATURES.md and the build order in ARCHITECTURE.md, 5 phases are recommended. The portfolio content track is independent of the AI track and should land first — it unblocks credibility with recruiters while AI infrastructure is being built.

### Phase 1: Vercel Migration + Portfolio Content

**Rationale:** Vercel is a hard prerequisite for the AI backend (GitHub Pages cannot run serverless functions). Portfolio content (photo, GitHub links, resume PDF, real copy) has zero AI dependencies and should ship in the same phase to establish a credible baseline. The Vite base path fix must be the first action.
**Delivers:** Live Vite + React SPA on Vercel with real content, real photo, GitHub project links, downloadable resume PDF. Replaces GitHub Pages deployment.
**Addresses:** All table-stakes features (photo, GitHub links, resume PDF, populated sections, responsive design).
**Avoids:** Vite base path pitfall (fix first); white screen on Vercel.
**Research flag:** SKIP — standard Vercel + Vite deployment is well-documented. No additional research needed.

### Phase 2: Knowledge Base Authoring

**Rationale:** Knowledge base quality is the single largest determinant of chatbot usefulness. It must be authored before the indexer is built — you can't test indexing without content. This phase has no code, but it is not optional; skipping it guarantees a poor bot.
**Delivers:** `/knowledge/` directory with rich markdown files (experience, projects, education, about) plus verified resume PDF.
**Addresses:** "Thin knowledge base" pitfall; sets up the entire AI pipeline with good source material.
**Research flag:** SKIP — this is content authoring, not a technical decision. No research needed.

### Phase 3: RAG Indexer + Vector Store

**Rationale:** Validate the full index-time pipeline before building any UI. Test embedding, chunking, and retrieval quality in isolation with curl/scripts. Fixing retrieval issues at this phase is cheap; fixing them after the UI is built is expensive.
**Delivers:** Working `scripts/indexer.js` that parses, chunks, embeds, and upserts knowledge base into Upstash Vector. Retrieval validated via direct queries.
**Uses:** `pdf-parse`, LangChain `RecursiveCharacterTextSplitter`, `@ai-sdk/openai` (embeddings), `@upstash/vector`.
**Implements:** Index-time architecture; idempotent re-indexing pattern.
**Avoids:** Poor RAG retrieval pitfall; PDF parsing failures; embedding model mismatch.
**Research flag:** LIGHT — Upstash Vector free tier limits should be verified at `upstash.com/pricing/vector` at time of implementation.

### Phase 4: Serverless Chat API

**Rationale:** Build and test the full RAG query pipeline as a serverless function before wiring up any frontend. Validate streaming with curl. The security boundary (no AI calls from the browser) is enforced here from the first line of code.
**Delivers:** Working `POST /api/chat` endpoint with RAG query pipeline, SSE streaming, persona-constrained system prompt, rate limiting, and graceful error handling.
**Uses:** Vercel AI SDK `streamText`, `@ai-sdk/openai` or `@ai-sdk/anthropic`, `@upstash/vector`.
**Implements:** Query-time RAG architecture; provider-agnostic LLM adapter pattern.
**Avoids:** API key exposure; LLM hallucination; CORS issues; runaway API costs (rate limiting).
**Research flag:** SKIP — Vercel AI SDK streaming + Upstash query patterns are well-documented.

### Phase 5: Chat Widget + GitHub Actions Re-Indexing

**Rationale:** Frontend chat widget is built last, against a working API. GitHub Actions re-indexing workflow can be built in parallel since it reuses the indexer script. Both ship together as the AI feature becomes user-visible.
**Delivers:** Floating `ChatWidget` React component with starter question chips, SSE streaming display, minimize/restore, graceful error fallback (contact info on failure), and a `reindex.yml` GitHub Actions workflow.
**Uses:** Vercel AI SDK `useChat` hook, Framer Motion (animations), react-icons (chat icons).
**Implements:** Full end-to-end user-facing AI feature; auto re-indexing.
**Avoids:** Cold start UX issue (show "thinking" indicator immediately); z-index/mobile layout issues; silent re-indexing failures.
**Research flag:** SKIP — `useChat` hook and SSE streaming UI are standard Vercel AI SDK patterns.

### Phase Ordering Rationale

- Vercel migration cannot be deferred — GitHub Pages blocks the entire AI track. Portfolio content ships in Phase 1 because it is independent and unblocks recruiter credibility immediately.
- Knowledge base authoring (Phase 2) precedes indexer (Phase 3) because you cannot validate retrieval quality without real content.
- Serverless API (Phase 4) is built and curl-tested before any UI (Phase 5) — following the architecture's explicit build order. This ensures retrieval and streaming are validated before investing in frontend work.
- GitHub Actions re-indexing is deferred to Phase 5 (alongside the widget) because it requires a working indexer script (Phase 3) and the project to be on Vercel (Phase 1).

### Research Flags

Phases needing deeper research during planning:
- **Phase 3 (Indexer):** Verify current Upstash Vector free tier limits at implementation time — pricing pages change frequently.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Vercel Migration):** Standard Vite deployment to Vercel; well-documented.
- **Phase 2 (Knowledge Base):** Content authoring, no technical unknowns.
- **Phase 4 (Serverless API):** Vercel AI SDK `streamText` + Upstash query; well-documented.
- **Phase 5 (Chat Widget):** Vercel AI SDK `useChat` hook; standard pattern.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All major choices have official docs; Vercel AI SDK v4 is the current stable release. Upstash Vector free tier limits need point-in-time verification. |
| Features | HIGH | Existing codebase is well-understood; feature gaps are concrete and enumerable. Anti-features are clearly motivated. |
| Architecture | HIGH | RAG on Vercel serverless is a well-established pattern. Component boundaries, data flow, and build order are unambiguous. |
| Pitfalls | HIGH | All 13 pitfalls are concrete, actionable, and phase-tagged. Prevention strategies are specific. |

**Overall confidence:** HIGH

### Gaps to Address

- **Upstash Vector pricing:** Free tier limits should be confirmed at `upstash.com/pricing/vector` when Phase 3 begins. If limits are insufficient, Pinecone or Supabase pgvector are documented fallbacks.
- **Actual resume PDF structure:** `pdf-parse` suitability depends on whether Deepak's resume PDF uses multi-column layout or tables. Validate by running `pdf-parse` on the actual file before committing to it in Phase 3.
- **LLM provider selection:** Research left the LLM provider as TBD (OpenAI vs Anthropic). The provider-agnostic adapter pattern means this can be decided at Phase 4 start with no architecture impact.
- **Knowledge base depth:** The quality of the chatbot is directly proportional to the richness of the `/knowledge/` markdown files. This is a content authoring decision that cannot be researched in advance — it depends on how much Deepak is willing to write.

---

## Sources

### Primary (HIGH confidence)
- Vercel AI SDK v4 official docs — `streamText`, `useChat`, SSE streaming, provider adapters
- Upstash Vector official docs — serverless REST API, upsert/query patterns, free tier
- Vercel serverless functions docs — `/api` directory, runtime, environment variables, edge runtime

### Secondary (MEDIUM confidence)
- LangChain `RecursiveCharacterTextSplitter` docs — chunk size and overlap recommendations
- `pdf-parse` npm package — capabilities and limitations for standard PDFs
- `pdfjs-dist` — fallback for complex PDF layouts

### Tertiary (inferred / community consensus)
- 500-token chunk size with 50-token overlap — community consensus for resume-scale RAG; validate if retrieval quality is poor in Phase 3
- IP-based rate limiting via in-memory map — simple approach; consider Vercel KV for distributed rate limiting if abuse is detected post-launch

---
*Research completed: 2026-03-03*
*Ready for roadmap: yes*
