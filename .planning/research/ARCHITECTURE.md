# Architecture Patterns

**Domain:** RAG-based AI chatbot embedded in personal portfolio SPA
**Researched:** 2026-03-03
**Overall confidence:** HIGH (well-established patterns with stable APIs)

---

## Recommended Architecture

Two independent runtime modes share the same vector store:
- **Query-time**: user asks a question → retrieve relevant chunks → augment prompt → stream response
- **Index-time**: push to repo → parse docs → embed chunks → upsert vector store

```
FRONTEND (React SPA on Vercel CDN)
  └── ChatWidget component
        └── fetch POST /api/chat
              │
              ▼
VERCEL SERVERLESS (api/chat.js)
  ├── 1. Embed user query  →  EmbeddingClient
  ├── 2. Vector similarity search  →  VectorStoreClient
  ├── 3. Retrieve top-K chunks
  ├── 4. Compose augmented prompt
  └── 5. Stream LLM response  →  LLMClient
              │
              ▼
         Streamed SSE response → ChatWidget

INDEX-TIME (GitHub Actions on push)
  ├── Parse /knowledge/*.md + resume PDF
  ├── Chunk documents (~500 tokens, 50-token overlap)
  ├── Embed each chunk  →  EmbeddingClient
  └── Upsert vectors  →  VectorStoreClient
```

---

## Component Boundaries

| Component | Responsibility | Input | Output |
|-----------|---------------|-------|--------|
| `ChatWidget` (React) | Render chat UI, send queries, stream responses | User text | Streamed response text |
| `/api/chat.js` (Vercel serverless) | Orchestrate RAG query pipeline | POST `{message, history[]}` | Streaming SSE text |
| `EmbeddingClient` (abstraction) | Convert text to embedding vector | String | Float[1536] |
| `VectorStoreClient` (abstraction) | Upsert and query vectors | Float[], top-K | Chunk objects |
| `LLMClient` (abstraction) | Generate completion from prompt | Prompt string | Streaming text |
| `indexer.js` (GitHub Actions script) | Parse docs, embed, upsert | File paths | Upserted vectors |
| `/knowledge/` | Source of truth about Deepak | Markdown files + resume PDF | Parsed text |

**Security rule:** The serverless function is the ONLY component that touches LLM and vector APIs. The `ChatWidget` never calls AI APIs directly — API keys never reach the browser.

---

## Data Flow

### Query-Time (user asks a question)

```
1. User types in ChatWidget
2. POST /api/chat { message, history[] }
3. api/chat.js: embed user message → Float[1536]
4. api/chat.js: similarity search → top-5 chunks with metadata
5. api/chat.js: compose prompt = system + context chunks + user message
6. api/chat.js: stream LLM response via SSE
7. ChatWidget: reads stream, appends tokens to message bubble in real time
```

### Index-Time (GitHub Actions on push)

```
1. Push to development branch
2. GitHub Actions triggers .github/workflows/reindex.yml
3. Check out repo, install dependencies
4. Parse /knowledge/*.md → text, parse resume.pdf → text
5. Chunk each document (500 tokens, 50-token overlap, metadata: {source, section, chunk_index})
6. Batch embed all chunks
7. Upsert to vector store with deterministic IDs (sha256 of source + chunk_index)
8. Index complete
```

---

## Key Patterns

### Pattern 1: Provider Abstraction (Thin Client Wrappers)

```javascript
// src/lib/llm-client.js
export class LLMClient {
  constructor(adapter) { this.adapter = adapter; }
  async streamCompletion(prompt, history) { return this.adapter.streamCompletion(prompt, history); }
}
// Change provider: update LLM_PROVIDER env var + add new adapter file
```

### Pattern 2: Idempotent Re-Indexing

Use deterministic chunk IDs (`sha256(source_path + "::" + chunk_index)`). Re-running the indexer on unchanged content is a no-op. Prevents vector accumulation on every push.

### Pattern 3: System Prompt with Persona Constraint

Instruct the LLM to answer ONLY from provided context and redirect to contact info when insufficient. Without this constraint, the LLM hallucinates details from training data.

### Pattern 4: SSE Streaming (not WebSockets)

Use `ReadableStream` / Vercel streaming to pipe tokens as they arrive. SSE is one-directional and sufficient — no need for WebSockets.

### Pattern 5: Fixed Chunking with Overlap

~500 tokens per chunk, 50-token overlap. Include source/section metadata in each chunk. Overlap prevents answer fragments spanning chunk boundaries.

---

## File Structure

```
/
├── api/
│   └── chat.js                   # RAG query pipeline serverless endpoint
├── src/
│   ├── components/
│   │   └── ChatWidget/
│   │       ├── ChatWidget.jsx
│   │       └── ChatWidget.css
│   └── lib/
│       ├── embedding-client.js
│       ├── vector-store-client.js
│       ├── llm-client.js
│       └── adapters/
│           ├── embedding-openai.js
│           ├── vectorstore-upstash.js
│           └── llm-anthropic.js      # or llm-openai.js
├── knowledge/
│   ├── experience.md
│   ├── projects.md
│   ├── education.md
│   └── resume.pdf
├── scripts/
│   └── indexer.js
├── .github/workflows/
│   ├── deploy.yml           # Updated for Vercel
│   └── reindex.yml          # New — re-embeds knowledge base on push
└── vercel.json
```

---

## Build Order (Phase Dependencies)

1. **Vercel Migration** — Required first; serverless functions need Vercel
2. **Knowledge Base + Indexer** — No UI dependency; validates embedding + vector store choices
3. **Serverless Query API** — Build and test with curl before building any UI
4. **Chat Widget** — Frontend last; depends on working `/api/chat` endpoint
5. **GitHub Actions Re-Indexing** — Can build in parallel with Chat Widget; shares indexer script

---

## Swappability Notes

- **Embedding model**: MUST match between index-time and query-time. Swapping requires full re-index (breaking change, document as a procedure).
- **LLM swap**: Change `LLM_PROVIDER` env var + add new adapter. Zero changes to `api/chat.js`.
- **Vector store swap**: Change `VECTOR_STORE_PROVIDER` env var + add new adapter. Metadata schema stays constant.

---

*Architecture analysis: 2026-03-03 | Confidence: HIGH*
