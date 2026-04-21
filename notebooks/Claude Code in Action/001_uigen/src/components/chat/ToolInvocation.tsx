"use client";

import type { ToolInvocation as ToolInvocationType } from "ai";
import { Loader2 } from "lucide-react";

interface LabelResult {
  verb: string;
  path?: string;
  newPath?: string;
}

function resolveLabel(toolInvocation: ToolInvocationType): LabelResult {
  const { toolName, args, state } = toolInvocation;
  const done = state === "result";

  if (toolName === "str_replace_editor") {
    const command = args?.command as string | undefined;
    const path = args?.path as string | undefined;

    if (!command || !path) {
      return { verb: "Preparing file edit…" };
    }

    switch (command) {
      case "create":
        return { verb: done ? "Created" : "Creating", path };
      case "str_replace":
      case "insert":
        return { verb: done ? "Edited" : "Editing", path };
      case "view":
        return { verb: done ? "Viewed" : "Viewing", path };
      case "undo_edit":
        return { verb: done ? "Reverted" : "Reverting", path };
      default:
        return { verb: done ? "Edited" : "Editing", path };
    }
  }

  if (toolName === "file_manager") {
    const command = args?.command as string | undefined;
    const path = args?.path as string | undefined;
    const newPath = args?.new_path as string | undefined;

    if (!command || !path) {
      return { verb: "Updating files…" };
    }

    if (command === "rename") {
      return { verb: done ? "Renamed" : "Renaming", path, newPath };
    }
    if (command === "delete") {
      return { verb: done ? "Deleted" : "Deleting", path };
    }

    return { verb: "Updating files…" };
  }

  return { verb: toolName };
}

interface ToolInvocationProps {
  toolInvocation: ToolInvocationType;
}

export function ToolInvocation({ toolInvocation }: ToolInvocationProps) {
  const done = toolInvocation.state === "result" && (toolInvocation as any).result != null;
  const { verb, path, newPath } = resolveLabel(toolInvocation);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {done ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{verb}</span>
      {path && <code className="font-mono text-neutral-900">{path}</code>}
      {newPath && (
        <>
          <span className="text-neutral-400">&rarr;</span>
          <code className="font-mono text-neutral-900">{newPath}</code>
        </>
      )}
    </div>
  );
}
