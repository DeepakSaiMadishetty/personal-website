# Pitfalls Research

**Domain:** Personal Portfolio Website + RAG AI Chatbot on Vercel
**Researched:** 2026-03-03

---

## Critical Pitfalls

### 1. API Keys Exposed in Frontend Code

**Risk:** Calling AI/vector APIs directly from React exposes keys in the browser bundle.
**Warning signs:** Any `import { openai } from '@ai-sdk/openai'` in a `.jsx` file.
**Prevention:** ALL AI calls go through `/api/chat.js` serverless function. Keys are Vercel environment variables only.
**Phase:** Must enforce from the start of the AI backend phase.

---

### 2. Vercel Cold Starts on the AI Function

**Risk:** Serverless functions spin down after inactivity. First request after idle can take 2-5 seconds, making the chat feel broken.
**Warning signs:** User reports chat "freezes" on first message.
**Prevention:** Show a "thinking" indicator immediately on message send. Consider Vercel Edge Runtime for `/api/chat.js` (faster cold starts, ~0ms vs ~500ms for Node.js runtime).
**Phase:** Handle in Chat Widget phase.

---

### 3. LLM Hallucinating Details About Deepak

**Risk:** Without a persona constraint in the system prompt, the LLM will invent plausible-sounding details from its training data (wrong companies, wrong dates, wrong projects).
**Warning signs:** Bot answers questions correctly for some topics but invents details for others.
**Prevention:** System prompt must include: "Answer ONLY from the provided context. If the context does not contain the answer, say so and suggest contacting Deepak directly at [email]."
**Phase:** Handle in Serverless API phase.

---

### 4. Poor RAG Retrieval Quality (Wrong Chunks Retrieved)

**Risk:** Vector similarity search retrieves irrelevant chunks. LLM then either can't answer or hallucinates.
**Warning signs:** Bot says "I don't have information about that" for things clearly in the knowledge base.
**Prevention:** (a) Good chunk metadata so retrieval can be debugged. (b) Test retrieval before building the chat UI. (c) Consider hybrid retrieval (similarity + keyword) for exact facts.
**Phase:** Test thoroughly in Indexer phase before building UI.

---

### 5. Vite Base Path Left as `/personal-website/` After Vercel Migration

**Risk:** The existing `vite.config.js` has `base: '/personal-website/'` for GitHub Pages. On Vercel, the base path should be `/`. Forgetting to change this breaks all asset URLs.
**Warning signs:** White screen on Vercel; 404s for JS/CSS files.
**Prevention:** First thing in the Vercel migration phase: change `base: '/personal-website/'` to `base: '/'` in `vite.config.js`.
**Phase:** Vercel migration — first step.

---

### 6. GitHub Actions Re-Indexing Silently Failing

**Risk:** The re-indexing workflow fails (expired token, rate limit, API error) but nothing alerts you. The knowledge base becomes stale without you knowing.
**Warning signs:** Bot gives outdated answers after you've updated knowledge base files.
**Prevention:** Fail the GitHub Actions job loudly (non-zero exit code). Add email/Slack notification on failure. Log chunk counts before and after indexing.
**Phase:** GitHub Actions workflow phase.

---

### 7. Embedding Model Mismatch

**Risk:** If you switch embedding models (e.g., from `text-embedding-3-small` to `text-embedding-3-large`), vectors in the store are incompatible with new query embeddings. Retrieval silently breaks.
**Warning signs:** Bot stops being able to answer things it previously answered correctly.
**Prevention:** Document the embedding model as a critical configuration. Switching requires a full re-index. Treat it as a breaking change with a checklist.
**Phase:** Document in ARCHITECTURE.md; enforce in re-indexing script (log the model name used).

---

### 8. Vector Store Costs Unexpectedly Blowing Up

**Risk:** Some vector store free tiers have per-query limits. High traffic (or bot being abused) can exhaust free tier quickly.
**Warning signs:** API errors from vector store; unexpected charges.
**Prevention:** Use Upstash Vector (per-day query limit, no surprises). Add rate limiting on `/api/chat.js` (simple in-memory or Vercel Edge rate limiting). Monitor Upstash dashboard.
**Phase:** Serverless API phase.

---

### 9. CORS Issues with Serverless Functions

**Risk:** The browser blocks requests from the React SPA to `/api/chat.js` if CORS headers are misconfigured.
**Warning signs:** Console error: "CORS policy: No 'Access-Control-Allow-Origin' header".
**Prevention:** On Vercel, functions in the `/api` directory at the same domain don't need CORS headers. If using a custom domain, ensure all requests go to the same origin. Don't move the API to a separate Vercel project.
**Phase:** Serverless API phase.

---

### 10. PDF Parsing Failures on Complex Resume Layouts

**Risk:** `pdf-parse` struggles with multi-column PDFs, tables, or scanned PDFs. Produces garbled text that degrades RAG quality.
**Warning signs:** Parsed resume text has merged words, wrong order, or missing sections.
**Prevention:** Test `pdf-parse` on your actual resume PDF before committing to it. Fallback: `pdfjs-dist` for complex layouts. Inspect the raw parsed text before embedding.
**Phase:** Indexer phase — validate early.

---

### 11. Knowledge Base Too Thin → Poor Bot Quality

**Risk:** If the knowledge base is just the resume PDF, the bot will only be able to answer questions the resume answers. Visitors asking about project decisions, tech choices, or motivations will get dead ends.
**Warning signs:** Bot frequently says "I don't have that information."
**Prevention:** Author rich markdown files for each project (what problem it solved, tech decisions, challenges). Add an `about.md` with deeper personal context. Think of it as FAQ docs for yourself.
**Phase:** Knowledge Base authoring phase.

---

### 12. Chat Widget z-index / Layout Issues

**Risk:** Floating chat widget gets hidden behind other elements or causes scroll issues on mobile.
**Warning signs:** Widget partially visible; overlaps with footer or nav.
**Prevention:** Use `position: fixed; z-index: 9999`. Test on mobile viewports explicitly. Ensure the widget doesn't obscure critical content when open.
**Phase:** Chat Widget UI phase.

---

### 13. No Rate Limiting on `/api/chat` → Runaway API Costs

**Risk:** Someone (or a bot) sends thousands of requests to `/api/chat`, exhausting your LLM API credits.
**Warning signs:** Unexpected LLM API charges.
**Prevention:** Add basic rate limiting in the serverless function (IP-based, e.g., max 20 requests/hour per IP using Vercel KV or a simple in-memory map). Add a spend limit in your LLM provider dashboard.
**Phase:** Serverless API phase.

---

*Pitfalls analysis: 2026-03-03*
