# Stack Research

**Domain:** Personal Portfolio Website + RAG AI Chatbot
**Researched:** 2026-03-03
**Confidence:** HIGH (established patterns; verify SDK versions at implementation time)

---

## Recommended Stack

### Hosting: Vercel (confirmed)

- GitHub Pages cannot run serverless functions — Vercel is required for the AI backend
- Vercel Hobby (free): 100GB bandwidth, 100k function invocations/month, 10s max execution time
- One repo, one deploy — frontend + `/api` functions together
- **Confidence: HIGH**

### LLM Orchestration: Vercel AI SDK v4

The `ai` package is the canonical 2025/2026 solution for Vercel + LLM:
- `streamText` / `generateText` for serverless function
- `useChat` hook for the React chat widget (handles message state + streaming)
- Provider adapters: `@ai-sdk/openai`, `@ai-sdk/anthropic` — swap with one import
- **Confidence: HIGH**

**Provider-agnostic pattern:**
```javascript
// lib/llm.js — only file that changes when swapping provider
import { openai } from '@ai-sdk/openai';
export const chatModel = openai('gpt-4o-mini');
// swap: export const chatModel = anthropic('claude-3-haiku-20240307');
```

### Embeddings: OpenAI text-embedding-3-small

- 1536 dimensions, $0.02/1M tokens
- For ~50-200 chunks (a resume + a few markdown files), total embedding cost < $0.01
- **Confidence: HIGH**

### Vector Store: Upstash Vector (recommended)

| Option | Free Tier | Verdict |
|--------|-----------|---------|
| **Upstash Vector** | ~10k vectors, ~10k queries/day, no credit card required | **RECOMMENDED** |
| Pinecone | 2GB, 2M read units/month | Good but requires credit card |
| Supabase pgvector | 500MB | Overkill — full PostgreSQL for pure vector use |
| Vercel KV (Redis) | 30MB | NOT a vector DB — no similarity search support |
| Chroma (self-hosted) | Free | Incompatible with serverless — needs persistent server |

Upstash Vector is serverless/REST-native, pairs naturally with Vercel, free tier is sufficient.
- **Confidence: MEDIUM** — correct architectural choice; verify free tier limits at upstash.com/pricing/vector

### PDF Parsing: `pdf-parse`

Simple, no native dependencies. Adequate for standard resume PDFs. Fallback: `pdfjs-dist` for complex layouts (multi-column, tables).
- **Confidence: MEDIUM** — depends on actual PDF structure

### Text Chunking: LangChain `RecursiveCharacterTextSplitter`

Import only the text splitter — do NOT adopt LangChain's chain/agent system (major overhead). Recommended: `chunkSize: 500`, `chunkOverlap: 50`.
- **Confidence: MEDIUM**

### Chat UI: `useChat` hook (Vercel AI SDK) + custom CSS

Do NOT use pre-built chat UI libraries — they'll conflict with the existing Framer Motion + custom CSS design system. The `useChat` hook handles all message state and streaming; you style it yourself.
- **Confidence: HIGH**

---

## Packages to Install

```bash
# AI + RAG
npm install ai @ai-sdk/openai @ai-sdk/anthropic @upstash/vector pdf-parse

# Text processing
npm install langchain

# Dev
npm install -D @types/node
```

---

## What NOT to Use

| Tool | Why Not |
|------|---------|
| LangChain chains/agents | Major overhead; only need the text splitter |
| Chroma | Needs persistent server — incompatible with Vercel serverless |
| WebSockets for streaming | Use SSE (Server-Sent Events) via Vercel streaming response instead |
| Pre-built chat UI libraries (e.g. react-chat-ui) | Conflict with existing design system |
| Vercel KV for vector storage | Not a vector DB; no similarity search |

---

## Existing Stack (Keep)

- React 19 + Vite 7 — keep as-is
- React Router DOM 7 — keep as-is
- Framer Motion 12 — keep for chat widget animations
- react-icons 5 — use for chat icons

---

*Stack analysis: 2026-03-03 | Confidence: HIGH*
