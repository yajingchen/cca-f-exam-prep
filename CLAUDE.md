# CLAUDE.md

## Project

CCA-F exam prep repo. Two courses covered:

1. **Building with the Claude API** — Jupyter notebooks (001–022) + three Python sub-projects
2. **Claude Code in Action** — two TypeScript/Node sub-projects

## Python Environment

- Notebooks use `pip install -r requirements.txt` (root-level)
- Sub-projects (023, 024, 024-TDD) use `uv` — each has its own `pyproject.toml` and `.venv`

## Key Dependencies

- Notebooks: `anthropic`, `python-dotenv`, `voyageai` (embeddings notebooks 014/015/017)
- 023 MCP chatbot: `anthropic`, `mcp[cli]`, `prompt-toolkit`
- 024 app starter: `mcp[cli]`, `markitdown`, `pydantic`, `pytest`
- 024-TDD app starter: `mcp[cli]`, `markitdown[docx,pdf]`, `pydantic`, `pytest`, `python-docx`
- 001_uigen: Next.js + `@ai-sdk/anthropic`
- 002_queries: TypeScript + `@anthropic-ai/claude-agent-sdk` + SQLite

## Secrets

`.env` at repo root (gitignored):
- `ANTHROPIC_API_KEY`
- `VOYAGE_API_KEY` (notebooks 014, 015, 017 only)
