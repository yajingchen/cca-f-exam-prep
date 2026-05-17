# CCA-F Exam Prep

Study materials and hands-on notebooks for the Anthropic Claude Certified Associate – Foundations (CCA-F) exam.

## Structure

```
notebooks/
├── Building with the Claude API/       # Core API concepts via Jupyter notebooks
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
│   ├── 023_mcp_cli-chatbot-project/    # MCP CLI chatbot (Python, uv)
│   ├── 024_claude-code_app-starter/   # Claude Code app starter (Python, uv)
│   └── 024_claude-code_app-starter-TDD/ # TDD variant: document tools MCP server (Python, uv)
│
└── Claude Code in Action/             # Claude Code workflows and agentic patterns
    ├── 001_uigen/                     # UI generator (Next.js, @ai-sdk/anthropic)
    └── 002_queries/                   # Natural language queries (TypeScript, Claude Agent SDK, SQLite)

docs_exam/                             # Official exam PDFs (Course Catalog, Exam Guide, FAQ)
```

## Setup

### Jupyter Notebooks

```bash
pip install -r requirements.txt
```

### Python sub-projects (023, 024, 024-TDD)

Each uses `uv` for isolated environments:

```bash
cd notebooks/Building\ with\ the\ Claude\ API/023_mcp_cli-chatbot-project
uv sync

cd notebooks/Building\ with\ the\ Claude\ API/024_claude-code_app-starter
uv sync

# TDD variant — document tools MCP server
cd notebooks/Building\ with\ the\ Claude\ API/024_claude-code_app-starter-TDD
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
