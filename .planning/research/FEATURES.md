# Features Research

**Domain:** Personal Portfolio Website + RAG AI Chatbot
**Researched:** 2026-03-03

---

## What's Already Built (Existing Codebase)

The SPA shell has 7 pages scaffolded: Home/Hero, About, Experience, Projects, Education, Skills, Contact.
The core portfolio structure **exists as scaffolding** but content is placeholder.

**What does NOT exist yet:**
- Real photo (About.jsx has "DS" initials placeholder)
- GitHub links on project cards
- Downloadable resume PDF
- The AI chatbot (no widget, no API, no RAG pipeline, no vector store, no knowledge base)
- Vercel deployment (currently on GitHub Pages)

---

## Table Stakes (Must Have)

Features visitors expect from any credible portfolio:

| Feature | Why Table Stakes | Complexity |
|---------|-----------------|------------|
| Real photo in Hero/About | Placeholder initials kills credibility | Low |
| GitHub links on project cards | Unverifiable work without links | Low |
| Downloadable resume PDF | Recruiters always want this | Low |
| GitHub icon in Hero social links | LinkedIn is there; GitHub should be too | Low |
| Responsive design (all pages) | Mobile visitors are 50%+ of traffic | Medium |
| Education section with dates | Standard credential display | Low |
| Work experience with timeline | Standard career display | Medium |
| Projects with tech stack + description | Core portfolio content | Medium |

---

## Differentiators

Features that make this stand out vs generic portfolios:

| Feature | Why Differentiating | Complexity |
|---------|---------------------|------------|
| AI chat widget (RAG-powered) | Recruiters ask questions in real time — interactive vs passive | High |
| Starter question chips in chat | Reduces cold-start friction; guides visitors to useful questions | Low |
| Streaming chat responses (SSE) | Feels alive vs waiting; perceived performance | Medium |
| Provider-agnostic LLM interface | Future-proof; swap Claude/OpenAI without rewrite | Medium |
| Auto re-indexing on push | Knowledge base stays current with zero manual effort | Medium |
| Deep markdown knowledge base | Hand-authored context beyond resume bullets; better RAG quality | Low |
| Graceful AI error fallback | Shows contact info when LLM unreachable; never a dead end | Low |
| Framer Motion animations | Existing dependency; use for section reveals and chat widget | Low |

---

## Anti-Features (Do NOT Build)

| Feature | Why Not |
|---------|---------|
| Contact form with backend | `mailto:` works; AI bot handles open questions |
| GitHub API repo auto-sync | Rate limits + token complexity; manual curation is cleaner and safer |
| Chat session persistence / database | Huge scope; component state is sufficient |
| User accounts / auth | No use case for a portfolio |
| Blog / CMS | Not needed; markdown files feed the AI |
| Skills proficiency bars/percentages | Misleading and dated; projects demonstrate skill better |
| WebSockets for chat streaming | SSE (Server-Sent Events) is correct for one-directional streaming |
| Self-hosted vector store | Incompatible with Vercel serverless; use managed |
| Fine-tuning an LLM | RAG is cheaper, faster to update, and more accurate for Q&A |
| Dark mode toggle | Scope creep for v1; adds significant UI complexity |

---

## Feature Dependencies (Critical Path)

```
Resume PDF + /knowledge/*.md files
  └── indexer.js (embed + upsert)
        └── Vector store (Upstash)
              └── /api/chat.js (RAG query pipeline)
                    └── Chat widget (React component)
```

Everything else (photo, GitHub links, PDF download) is **independent** of the AI pipeline.

---

## MVP Priority Order

**Portfolio content (no AI dependency):**
1. Real photo in About/Hero
2. GitHub links on project cards
3. Downloadable resume PDF link
4. Populate Education, Experience, Projects with real content

**AI pipeline (must build in order):**
5. Knowledge base markdown files (`/knowledge/` directory)
6. Vercel deployment (needed for serverless functions)
7. RAG indexer script (embed + upsert knowledge base)
8. Serverless chat API route (`/api/chat.js` — LLM + RAG + SSE streaming)
9. GitHub Actions re-indexing workflow
10. AI chat widget (floating, starter chips, streaming, minimize/restore, error fallback)

---

*Features analysis: 2026-03-03*
