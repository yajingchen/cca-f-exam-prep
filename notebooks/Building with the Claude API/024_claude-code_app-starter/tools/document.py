from markitdown import MarkItDown, StreamInfo
from io import BytesIO
from pathlib import Path
from pydantic import Field


def binary_document_to_markdown(binary_data: bytes, file_type: str) -> str:
    """Converts binary document data to markdown-formatted text."""
    md = MarkItDown()
    file_obj = BytesIO(binary_data)
    stream_info = StreamInfo(extension=file_type)
    result = md.convert(file_obj, stream_info=stream_info)
    return result.text_content


def document_path_to_markdown(
    path: str = Field(description="Absolute or relative path to a PDF or DOCX file"),
) -> str:
    """Convert a PDF or DOCX file at a given path to markdown-formatted text.

    Reads the file at the specified path and converts its contents to markdown.
    Supports .pdf and .docx file formats.

    When to use:
    - When you have a local file path to a document and need its text content
    - When you want to extract readable text from a PDF or Word document

    When not to use:
    - When you already have the binary data — use binary_document_to_markdown instead
    - For file formats other than PDF and DOCX

    Examples:
    >>> document_path_to_markdown("/tmp/report.pdf")
    "# Report Title\\n\\nContent..."
    >>> document_path_to_markdown("/tmp/notes.docx")
    "# Notes\\n\\n- Item one..."
    """
    SUPPORTED_TYPES = {"pdf", "docx"}
    p = Path(path)
    file_type = p.suffix.lstrip(".").lower()
    if file_type not in SUPPORTED_TYPES:
        raise ValueError(f"Unsupported file type '.{file_type}'. Supported types: {sorted(SUPPORTED_TYPES)}")
    if not p.exists():
        raise FileNotFoundError(f"File not found: {path}")
    with open(p, "rb") as f:
        data = f.read()
    return binary_document_to_markdown(data, file_type)
