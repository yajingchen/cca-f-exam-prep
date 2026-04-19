import os
import pathlib
from markitdown import MarkItDown, StreamInfo
from io import BytesIO
from pydantic import Field

SUPPORTED_EXTENSIONS = {".pdf", ".docx"}


def binary_document_to_markdown(binary_data: bytes, file_type: str) -> str:
    """Converts binary document data to markdown-formatted text."""
    md = MarkItDown()
    file_obj = BytesIO(binary_data)
    stream_info = StreamInfo(extension=file_type)
    result = md.convert(file_obj, stream_info=stream_info)
    return result.text_content


def document_path_to_markdown(
    path: str | pathlib.Path = Field(description="Path to a PDF or DOCX file to convert to markdown"),
) -> str:
    """Convert a PDF or DOCX file to markdown text.

    Reads the file at the given path and returns its content as a markdown-formatted string.

    When to use:
    - When you need to extract readable text from a PDF or DOCX file
    - When you want to process document content as markdown

    Examples:
    >>> document_path_to_markdown("/docs/report.pdf")
    "# Report\\n\\nContent here..."
    >>> document_path_to_markdown("/docs/notes.docx")
    "# Notes\\n\\n- Item one..."
    """
    path = str(path)

    if not path:
        raise ValueError("Path must not be empty")

    ext = os.path.splitext(path)[1].lower()
    if ext not in SUPPORTED_EXTENSIONS:
        raise ValueError(f"Unsupported file type '{ext}'. Supported types: {', '.join(SUPPORTED_EXTENSIONS)}")

    if not os.path.exists(path):
        raise FileNotFoundError(f"File not found: {path}")

    if not os.access(path, os.R_OK):
        raise PermissionError(f"Permission denied: {path}")

    md = MarkItDown()
    result = md.convert(path)
    return result.text_content
