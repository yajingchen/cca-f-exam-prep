import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocation } from "../ToolInvocation";
import type { ToolInvocation as ToolInvocationType } from "ai";

afterEach(() => {
  cleanup();
});

// --- str_replace_editor ---

test("create command done shows Created + path", () => {
  const tool: ToolInvocationType = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx", file_text: "" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocation toolInvocation={tool} />);

  expect(screen.getByText("Created")).toBeDefined();
  expect(screen.getByText("/App.jsx")).toBeDefined();
});

test("create command in-flight shows Creating + spinner", () => {
  const tool: ToolInvocationType = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx", file_text: "" },
    state: "partial-call",
  };

  const { container } = render(<ToolInvocation toolInvocation={tool} />);

  expect(screen.getByText("Creating")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("str_replace command done shows Edited + path", () => {
  const tool: ToolInvocationType = {
    toolCallId: "2",
    toolName: "str_replace_editor",
    args: { command: "str_replace", path: "/components/Card.jsx", old_str: "a", new_str: "b" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocation toolInvocation={tool} />);

  expect(screen.getByText("Edited")).toBeDefined();
  expect(screen.getByText("/components/Card.jsx")).toBeDefined();
});

test("insert command done shows Edited (same verb as str_replace)", () => {
  const tool: ToolInvocationType = {
    toolCallId: "3",
    toolName: "str_replace_editor",
    args: { command: "insert", path: "/components/Card.jsx", insert_line: 1, new_str: "x" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocation toolInvocation={tool} />);

  expect(screen.getByText("Edited")).toBeDefined();
});

test("view command done shows Viewed + path", () => {
  const tool: ToolInvocationType = {
    toolCallId: "4",
    toolName: "str_replace_editor",
    args: { command: "view", path: "/App.jsx" },
    state: "result",
    result: "file content",
  };

  render(<ToolInvocation toolInvocation={tool} />);

  expect(screen.getByText("Viewed")).toBeDefined();
  expect(screen.getByText("/App.jsx")).toBeDefined();
});

test("undo_edit command done shows Reverted + path", () => {
  const tool: ToolInvocationType = {
    toolCallId: "5",
    toolName: "str_replace_editor",
    args: { command: "undo_edit", path: "/App.jsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocation toolInvocation={tool} />);

  expect(screen.getByText("Reverted")).toBeDefined();
});

test("partial args (empty args object) shows fallback message and does not crash", () => {
  const tool: ToolInvocationType = {
    toolCallId: "6",
    toolName: "str_replace_editor",
    args: {},
    state: "partial-call",
  };

  render(<ToolInvocation toolInvocation={tool} />);

  expect(screen.getByText("Preparing file edit…")).toBeDefined();
});

// --- file_manager ---

test("rename command done shows Renamed + both paths with arrow", () => {
  const tool: ToolInvocationType = {
    toolCallId: "7",
    toolName: "file_manager",
    args: { command: "rename", path: "/Card.jsx", new_path: "/ProductCard.jsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocation toolInvocation={tool} />);

  expect(screen.getByText("Renamed")).toBeDefined();
  expect(screen.getByText("/Card.jsx")).toBeDefined();
  expect(screen.getByText("/ProductCard.jsx")).toBeDefined();
  expect(screen.getByText("→")).toBeDefined();
});

test("delete command done shows Deleted + path", () => {
  const tool: ToolInvocationType = {
    toolCallId: "8",
    toolName: "file_manager",
    args: { command: "delete", path: "/components/OldCard.jsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocation toolInvocation={tool} />);

  expect(screen.getByText("Deleted")).toBeDefined();
  expect(screen.getByText("/components/OldCard.jsx")).toBeDefined();
});

// --- state indicators ---

test("done state renders green dot, not spinner", () => {
  const tool: ToolInvocationType = {
    toolCallId: "9",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "result",
    result: "Success",
  };

  const { container } = render(<ToolInvocation toolInvocation={tool} />);

  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("in-progress state renders spinner, not green dot", () => {
  const tool: ToolInvocationType = {
    toolCallId: "10",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "call",
  };

  const { container } = render(<ToolInvocation toolInvocation={tool} />);

  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

// --- unknown tool fallback ---

test("unknown tool name falls back to raw tool name", () => {
  const tool: ToolInvocationType = {
    toolCallId: "11",
    toolName: "some_future_tool",
    args: {},
    state: "result",
    result: "done",
  };

  render(<ToolInvocation toolInvocation={tool} />);

  expect(screen.getByText("some_future_tool")).toBeDefined();
});
