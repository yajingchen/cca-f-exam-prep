# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# First-time setup
npm run setup          # install deps + generate Prisma client + run migrations

# Development
npm run dev            # Next.js dev server with Turbopack at http://localhost:3000
npm run dev:daemon     # Same but runs in background, logs to logs.txt

# Testing
npm test               # Run all Vitest tests
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx  # Single test file

# Database
npm run db:reset       # Drop and re-run all migrations (destructive)
npx prisma migrate dev # Apply new migrations
npx prisma generate    # Regenerate Prisma client after schema changes

# Build / Lint
npm run build
npm run lint
```

## LLM Integration

The app uses **claude-haiku-4-5** via the **Vercel AI SDK** (`ai` package) with the `@ai-sdk/anthropic` provider adapter:

- `streamText` from `ai` drives the multi-step agentic loop (`maxSteps: 40`)
- `@ai-sdk/anthropic` wraps the Anthropic SDK and exposes it as a `LanguageModelV1`
- The system prompt is injected as the first message with `providerOptions.anthropic.cacheControl: { type: "ephemeral" }` for prompt caching
- If `ANTHROPIC_API_KEY` is absent, `src/lib/provider.ts` falls back to `MockLanguageModel`, a fully local `LanguageModelV1` implementation that streams static component code — useful for development without an API key

## Architecture

### Agentic generation loop (`src/app/api/chat/route.ts`)
The `/api/chat` POST route is the core. It reconstructs a `VirtualFileSystem` from client-sent JSON, then calls `streamText` with two Claude tools:
- `str_replace_editor` — create/view/edit files (`create`, `str_replace`, `insert`, `view`, `undo_edit`)
- `file_manager` — rename/delete files

Claude iterates through up to 40 tool-call steps, writing files into the virtual FS on each step. On finish, updated messages and file contents are saved to Prisma (`Project.messages` + `Project.data` as JSON strings).

### Virtual File System (`src/lib/file-system.ts`)
An in-memory tree of `FileNode` objects (`VirtualFileSystem` class). No files are ever written to disk. The FS is serialized to JSON for DB persistence and deserialized on load. The client sends the current FS state with each chat request so the server can reconstruct it.

### Live Preview pipeline (`src/lib/transform/jsx-transformer.ts`)
Files in the virtual FS are rendered in a sandboxed `<iframe>` (`src/components/preview/PreviewFrame.tsx`). The pipeline:
1. `@babel/standalone` transpiles each `.jsx`/`.tsx` file to plain JS in the browser
2. Each transpiled file becomes a `blob:` URL
3. An ES module import map is built so `@/` aliases and relative imports resolve to those blob URLs
4. Third-party packages are resolved via `https://esm.sh/` at runtime
5. Tailwind CSS is loaded from CDN in the preview `<iframe>`
6. The entry point is always `/App.jsx` — Claude is instructed to always create this file first

### State management
- `FileSystemContext` (`src/lib/contexts/file-system-context.tsx`) — holds the `VirtualFileSystem` instance; exposes CRUD helpers and a `handleToolCall` dispatcher that replays streaming tool calls from the chat stream to update the FS in real time
- `ChatContext` (`src/lib/contexts/chat-context.tsx`) — wraps Vercel AI SDK's `useChat`, manages message history, and passes the current FS state in each request body

### Auth (`src/lib/auth.ts`, `src/middleware.ts`)
JWT-based auth using `jose`. Passwords hashed with `bcrypt`. Anonymous users can create projects; data is only persisted to DB if the user is signed in. `src/lib/anon-work-tracker.ts` tracks anonymous session work for later claim on sign-up.

### Data model (`prisma/schema.prisma`)
Two models: `User` and `Project`. `Project.messages` and `Project.data` are JSON strings storing the full chat history and serialized virtual FS respectively. SQLite (`prisma/dev.db`).

## Generation prompt constraints

The system prompt (`src/lib/prompts/generation.tsx`) imposes these rules that Claude must follow when generating components:
- Every project must have `/App.jsx` as the root entry point with a default export
- Styling via Tailwind CSS only — no hardcoded styles
- Non-library imports use the `@/` alias (e.g., `import Foo from '@/components/Foo'`)
- No HTML files — `App.jsx` is the sole entry point


## Testing Notes

### General patterns
- Vitest + jsdom, no `@testing-library/jest-dom` — use `.toBeDefined()` / `.toBeNull()`, not `.toBeInTheDocument()`
- `afterEach(cleanup)` is called manually in each test file (no global setup file)

### Testing server-only modules (`auth.ts`, anything using `next/headers`)
Two required mocks — must be declared before any import of the module under test:

```ts
vi.mock("server-only", () => ({}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}));

// Dynamic import AFTER mocks so the module picks them up
const { createSession } = await import("../auth");
```

Use `// @vitest-environment node` at the top of the file. jsdom's `TextEncoder` produces a `Uint8Array` from a different realm than what `jose` expects, causing "payload must be an instance of Uint8Array" errors at JWT signing time. Server-only modules should always run in the node environment.

### JWT / HMAC tokens
HMAC-based JWTs (`jose` HS256) are deterministic — same inputs + same second = identical token. Don't write tests that assert a token differs across calls with the same arguments; test payload content and structure instead.

## Coding Style
- Use comments sparingly. Only comment complex code.