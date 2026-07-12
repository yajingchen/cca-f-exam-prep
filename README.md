# CCA-F Exam Prep

Study materials and hands-on notebooks for the Anthropic Claude Certified Associate – Foundations (CCA-F) exam.

## Structure

```
notebooks/
├── Building with the Claude API/       # Core API concepts via Jupyter notebooks
│   ├── 000_Video Course Notes – Building with the Claude API.md
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
│   ├── 013_report.md                  # Sample chunking output report
│   ├── 014_embeddings.ipynb
│   ├── 015_vectordb.ipynb
│   ├── 016_bm25.ipynb
│   ├── 017_hybrid.ipynb
│   ├── 018_extended-thinking.ipynb
│   ├── 019_images_and_pdf_handling.ipynb
│   ├── 020_citations.ipynb
│   ├── 021_caching.ipynb
│   ├── 022_code_execution_and_files_api.ipynb
│   ├── 022_streaming.csv              # Sample CSV used in notebook 022
│   ├── 023_mcp_cli-chatbot-project/   # MCP CLI chatbot (Python, uv)
│   ├── 024_claude-code_app-starter/   # Claude Code app starter (Python, uv)
│   └── 024_claude-code_app-starter-TDD/ # Claude Code app starter – TDD variant (Python, uv)
│
└── Claude Code in Action/             # Claude Code workflows and agentic patterns
    ├── 000_Video Course Notes – Claude Code in Action.md
    ├── 001_uigen/                     # UI generator (Next.js, @ai-sdk/anthropic)
    └── 002_queries/                   # E-commerce NL query utility (TypeScript, Claude Agent SDK, SQLite)
        ├── src/
        │   ├── schema.ts              # Database schema (customers, orders, products, …)
        │   ├── main.ts                # Entry point; daily cron for overdue-order Slack alerts
        │   ├── slack.ts               # Slack Incoming Webhook client (#order-alerts)
        │   └── queries/
        │       ├── analytics_queries.ts
        │       ├── customer_queries.ts
        │       ├── inventory_queries.ts
        │       ├── order_queries.ts
        │       ├── product_queries.ts
        │       ├── promotion_queries.ts
        │       ├── review_queries.ts
        │       └── shipping_queries.ts
        └── hooks/
            ├── query_hook.js          # PreToolUse: blocks duplicate query functions
            ├── read_hook.js           # PreToolUse: blocks reads of secret env files
            └── tsc.js                 # PostToolUse: runs tsc after every TS edit

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
SLACK_WEBHOOK_URL=your_url_here  # required for 002_queries Slack alerts
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
