# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Setup (Python 3.13)
uv venv --python 3.13 && source .venv/bin/activate
uv pip install -e .

# Start the MCP server
uv run main.py

# Run all tests
uv run pytest

# Run a single test
uv run pytest tests/test_document.py::TestBinaryDocumentToMarkdown::test_binary_document_to_markdown_with_docx
```

## Architecture

This project is an MCP server that exposes document processing utilities as tools to AI assistants.

- **`main.py`** — Entry point. Creates a `FastMCP` instance, registers tools via `mcp.tool()(fn)`, and calls `mcp.run()`.
- **`tools/`** — One file per domain (e.g. `math.py`, `document.py`). Functions here are pure Python — no MCP imports needed.
- **`tests/`** — pytest tests against the tool functions directly (not via MCP). Fixtures live in `tests/fixtures/`.

## Defining MCP Tools

Tools are plain Python functions registered in `main.py` with `mcp.tool()(fn)`. No decorator is needed in the tool file itself.

**Parameter descriptions** use `pydantic.Field`:

```python
from pydantic import Field

def my_tool(
    param1: str = Field(description="What this parameter does"),
    param2: int = Field(description="What this parameter does"),
) -> ReturnType:
    """One-line summary.

    Detailed explanation of what the tool does.

    When to use:
    - Specific scenario A
    - Specific scenario B

    Examples:
    >>> my_tool("foo", 1)
    "expected output"
    """
    ...
```

**Registration in `main.py`**:

```python
from tools.my_module import my_tool
mcp.tool()(my_tool)
```

Tool docstrings are surfaced to the AI assistant as the tool description — write them to explain *when* and *when not* to use the tool, not just what it does.
