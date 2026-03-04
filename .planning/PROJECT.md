# Personal Portfolio Website + AI Bot

## What This Is

A personal portfolio website for Deepak that showcases his education, work experience, and projects — with an embedded AI chat bot that answers questions about him in real time. The bot is powered by RAG (retrieval-augmented generation) over a curated knowledge base (resume PDF + authored markdown files), and re-indexes automatically on every push.

## Core Value

Visitors can learn anything about Deepak — through a structured portfolio *and* a conversational AI that answers their specific questions — without Deepak having to be present.

## Requirements

### Validated

- ✓ React 19 + Vite 7 SPA with React Router and Framer Motion — existing
- ✓ GitHub Actions CI/CD pipeline — existing (currently deploying to GitHub Pages)

### Active

- [ ] Hero/About section with intro, photo, tagline, and social links
- [ ] Education section with degrees, institutions, and years
- [ ] Work Experience section with jobs, roles, and timeline
- [ ] Projects section with project cards (description, tech stack, GitHub link)
- [ ] Downloadable resume (static PDF linked from site)
- [ ] AI floating chat widget accessible from any page
- [ ] RAG-based AI backend: indexes resume PDF + authored markdown knowledge base files
- [ ] Provider-agnostic LLM interface (swap model/host without rewrite)
- [ ] Vercel deployment (replaces GitHub Pages) with serverless API functions
- [ ] GitHub Actions workflow to re-index knowledge base on push

### Out of Scope

- Skills section — deferred to v2; projects already convey tech breadth
- Contact form — deferred to v2; social links in Hero satisfy v1 need
- Fine-tuning a model — RAG is cheaper, faster, and more accurate for this use case
- Scraping external/private GitHub repos — manual markdown files keep it simple and controlled
- Auto-generated PDF resume — static PDF upload is sufficient for v1

## Context

- **Existing codebase**: React + Vite SPA with React Router, Framer Motion, react-icons. Currently deployed on GitHub Pages at `/personal-website/`.
- **Deployment migration**: Moving from GitHub Pages (static-only) to Vercel to support serverless functions for the AI backend.
- **AI knowledge base**: Two sources — (1) uploaded resume PDF, (2) markdown files authored in this repo describing Deepak's background, projects, and experience in detail.
- **RAG pipeline**: On push, a GitHub Actions workflow re-embeds the knowledge base into a vector store. At query time, relevant chunks are retrieved and injected into the LLM prompt.
- **Design principle**: Ship end-to-end first. Individual components (LLM provider, vector store, hosting) are abstracted behind clean interfaces to enable future swaps.

## Constraints

- **Tech stack**: React + Vite — already established, stay consistent
- **Hosting**: Vercel — serverless functions for AI backend, static frontend
- **LLM provider**: TBD — interface designed to be provider-agnostic (Claude, OpenAI, or other)
- **Vector store**: TBD — abstracted; start with lowest-friction option (e.g., Vercel KV or Pinecone free tier)
- **Data privacy**: Knowledge base is manually curated — nothing is scraped without Deepak's control

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| RAG over fine-tuning | Cheaper, faster to update, more accurate for Q&A | — Pending |
| Vercel over GitHub Pages | GitHub Pages can't run serverless functions; Vercel unifies frontend + backend | — Pending |
| Provider-agnostic LLM interface | Ship fast with one provider, swap later without rewrite | — Pending |
| Manual markdown knowledge base | Full control over what the bot knows; no auth complexity for private repos | — Pending |
| Static PDF resume | Simple and reliable for v1; auto-generation adds complexity without much gain | — Pending |

---
*Last updated: 2026-03-03 after initialization*
