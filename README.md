# CCA-F Exam Prep

Study materials and hands-on notebooks for the Anthropic Claude Certified Associate – Foundations (CCA-F) exam.

## Structure

```
notebooks/
├── Building with the Claude API/           # Core API concepts via Jupyter notebooks
│   ├── 001_requests.ipynb
│   ├── 002_system_prompt.ipynb
│   ├── 003_temperature.ipynb
│   ├── 004_streaming.ipynb
│   ├── 005_Controlling_Output.ipynb
│   ├── 006_prompt_evals.ipynb
│   ├── 007_prompt_engineering.ipynb
│   ├── 008_tool_usage_process.ipynb
│   ├── 009_tools_multi-turn.ipynb
│   ├── 010_tool_streaming.ipynb
│   ├── 011_text_editor_tool.ipynb
│   ├── 012_web_search.ipynb
│   ├── 013_chunking.ipynb
│   ├── 014_embeddings.ipynb
│   ├── 015_vectordb.ipynb
│   ├── 016_bm25.ipynb
│   ├── 017_hybrid.ipynb
│   ├── 018_extended-thinking.ipynb
│   ├── 019_images_and_pdf_handling.ipynb
│   ├── 020_citations.ipynb
│   ├── 021_caching.ipynb
│   ├── 022_code_execution_and_files_api.ipynb
│   ├── 023_mcp_cli-chatbot-project/        # MCP CLI chatbot (Python, uv)
│   ├── 024_claude-code_app-starter/        # Document Tools MCP server — Claude Code app starter (Python, uv)
│   └── 024_claude-code_app-starter-TDD/   # Same project built TDD-first (Python, uv, pytest)
│
└── Claude Code in Action/                 # Claude Code workflows and agentic patterns
    ├── 001_uigen/                         # UI generator (Next.js, @ai-sdk/anthropic)
    └── 002_queries/                       # NL→SQL queries with Slack alerts (TypeScript, Claude Agent SDK, SQLite)

.github/
└── workflows/
    ├── claude.yml                         # Claude PR Assistant — responds to @claude in issues/PRs
    └── claude-code-review.yml             # Claude Code Review — automated review on every PR

docs_exam/                                 # Official exam PDFs (Course Catalog, Exam Guide, FAQ)
```

## Setup

### Jupyter Notebooks

```bash
pip install -r requirements.txt
```

### Python sub-projects (023, 024)

Each uses `uv` for isolated environments:

```bash
cd notebooks/Building\ with\ the\ Claude\ API/023_mcp_cli-chatbot-project
uv sync
```

### Node.js sub-projects (001_uigen, 002_queries)

```bash
cd notebooks/Claude\ Code\ in\ Action/001_uigen
npm install

cd notebooks/Claude\ Code\ in\ Action/002_queries
npm install
```

### Environment

Create a `.env` file at the repo root with your API key:

```
ANTHROPIC_API_KEY=your_key_here
VOYAGE_API_KEY=your_key_here   # required for notebooks 014, 015, 017
```

## GitHub Actions

Two workflows live in `.github/workflows/` and run automatically on every PR:

| Workflow | File | Trigger | What it does |
|---|---|---|---|
| Claude PR Assistant | `claude.yml` | `@claude` mention in an issue or PR comment | Claude reads the comment and acts on the request (implement, explain, fix) |
| Claude Code Review | `claude-code-review.yml` | PR opened / updated | Runs the `code-review` plugin via `claude-code-action` and posts inline review comments |

Both workflows use the `CLAUDE_CODE_OAUTH_TOKEN` repository secret.

## Claude Code Configuration

The `.claude/` directory contains project-level Claude Code config (tracked in git; `settings.local.json` and `agent-memory/` are gitignored):

```
.claude/
├── agents/
│   └── code-reviewer.md       # Custom subagent: security-focused code review
├── commands/
│   ├── audit.md               # /audit — runs npm audit and fixes vulnerable deps
│   └── write_tests.md         # /write_tests — generates test suites for given targets
├── docs/
│   ├── architecture.md        # Architecture notes
│   └── style-guide.md         # Style reference
├── hooks/
│   └── read_hook.js           # PreToolUse hook: blocks Claude from reading .env
├── skills/
│   └── pr-description/
│       └── SKILL.md           # /pr-description — writes PR descriptions
├── settings.example.json      # Example hook configuration template
└── settings.json              # Project-level Claude Code settings (hooks, permissions)
```
