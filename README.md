# CCA-F Exam Prep

Study materials and hands-on notebooks for the Anthropic Claude Certified Associate – Foundations (CCA-F) exam.

## Structure

```
notebooks/
└── Building with the Claude API/   # Core API concepts via Jupyter notebooks
    ├── 001_requests.ipynb
    ├── 002_system_prompt.ipynb
    ├── 003_temperature.ipynb
    ├── 004_streaming.ipynb
    ├── 005_Controlling_Output.ipynb
    ├── 006_prompt_evals.ipynb
    ├── ...
    ├── 023_mcp_cli-chatbot-project/   # MCP CLI chatbot project
    └── 024_claude-code_app-starter/   # Claude Code app starter

docs/                # Architecture notes and decisions
src/                 # Source modules (api, persistence)
tools/               # Scripts and prompts
```

## Setup

```bash
pip install -r requirements.txt
```

Create a `.env` file with your API key:

```
ANTHROPIC_API_KEY=your_key_here
```
