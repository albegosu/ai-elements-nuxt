# ai-elements-nuxt

[![CI](https://github.com/albegosu/ai-elements-nuxt/actions/workflows/ci.yml/badge.svg)](https://github.com/albegosu/ai-elements-nuxt/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/albegosu/ai-elements-nuxt?color=brightgreen)](LICENSE)
[![version](https://img.shields.io/npm/v/ai-elements-nuxt.svg)](https://www.npmjs.com/package/ai-elements-nuxt)

**Nuxt/Vue complement to [Vercel AI Elements](https://github.com/vercel/ai-elements)** — headless AI UI components for the [AI SDK](https://ai-sdk.dev) ecosystem.

[Documentation](https://albegosu.github.io/ai-elements-nuxt/) · [npm](https://www.npmjs.com/package/ai-elements-nuxt) · [Contributing](.github/CONTRIBUTING.md) · [Code of Conduct](.github/CODE_OF_CONDUCT.md) · [Security](.github/SECURITY.md) · [Changelog](CHANGELOG.md)

> Not a replacement for AI Elements. This project extends the same UI patterns to Nuxt 3 and Vue 3 so you can build AI-native apps with your own design system.

## Install

**1. Core** (always required):

```bash
pnpm add ai-elements-nuxt ai @ai-sdk/vue
```

**2. Choose a model provider** (at least one required for production):

```bash
pnpm add @ai-sdk/openai        # OpenAI / GPT-4o
# pnpm add @ai-sdk/anthropic   # Anthropic / Claude
# pnpm add @ai-sdk/google      # Google / Gemini
# pnpm add @ai-sdk/mistral     # Mistral
```

Full provider list → [ai-sdk.dev/providers](https://ai-sdk.dev/providers/ai-sdk-providers)

**3. Agents only** — add Zod for tool parameter schemas:

```bash
pnpm add zod
```

**Set your API key** in `.env` (Nuxt reads it automatically):

```bash
OPENAI_API_KEY=sk-...
```

**Register the module**:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['ai-elements-nuxt'],
  aiElements: {
    defaultStyles: true, // optional base CSS for [data-ai-*] attributes
  },
})
```

### What do you need?

| Goal | Key components | Composable | Server handler |
|------|---------------|------------|----------------|
| Streaming chat | `AiMessage`, `AiPromptInput` | `useAiChat` | `createChatHandler` |
| Agent with tools | + `AiAgent`, `AiTool`, `AiToolApproval` | `useAiAgent`, `useAiTools` | `createAgentHandler` |
| Persisted chat | same as chat | `useAiChatPersisted` | same as chat |

### Install from GitHub

To use the latest commit from the repository instead of the npm release:

```bash
pnpm add github:albegosu/ai-elements-nuxt
```

With pnpm strict build settings, allow the module to run its `prepack` build:

```yaml
# pnpm-workspace.yaml (consumer monorepo root)
allowBuilds:
  ai-elements-nuxt: true
```

Types in consumer apps:

```ts
import type { AiMessageProps, AiSource } from 'ai-elements-nuxt/types'
```

## Quick start (streaming chat)

**1. Server route** (`server/api/chat.post.ts`):

```ts
// Start with mock (no API key needed):
import { createMockChatHandler } from 'ai-elements-nuxt/server'
export default createMockChatHandler()

// Swap for production:
// import { createChatHandler } from 'ai-elements-nuxt/server'
// import { openai } from '@ai-sdk/openai'
// export default createChatHandler({ model: openai('gpt-4o') })
```

**2. Page**:

```vue
<script setup lang="ts">
const { aiMessages, input, handleSubmit, isStreaming } = useAiChat({ api: '/api/chat' })
</script>

<template>
  <AiMessage v-for="(msg, i) in aiMessages" :key="i" v-bind="msg">
    <template #content="{ content, isStreaming: streaming }">
      <AiStreamingCursor v-if="streaming && content" :active="true" />
      {{ content }}
    </template>
  </AiMessage>
  <form @submit="handleSubmit">
    <AiPromptInput v-model="input" :loading="isStreaming" />
  </form>
</template>
```

## Agentic apps

**Server** — multi-step tools with optional human approval:

```ts
import { createAgentHandler } from 'ai-elements-nuxt/server'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

export default createAgentHandler({
  model: openai('gpt-4o'),
  maxSteps: 10,
  tools: {
    getWeather: {
      description: 'Get weather for a city',
      parameters: z.object({ city: z.string() }),
      execute: async ({ city }) => ({ temp: 72, city }),
    },
    deleteFile: {
      description: 'Delete a file',
      parameters: z.object({ path: z.string() }),
      requireConfirmation: true,
      execute: async ({ path }) => ({ deleted: path }),
    },
  },
})
```

**Client** — `useAiAgent` + `useAiTools`:

```vue
<script setup lang="ts">
const agent = useAiAgent({ api: '/api/chat' })
// useAiTools wires per-tool metadata; pendingApprovals is already AiToolCall[] — no reshaping needed
const tools = useAiTools([
  { name: 'getWeather' },
  { name: 'deleteFile', requireConfirmation: true },
], agent)
const { aiMessages, steps, handleSubmit, input } = agent
</script>

<template>
  <!-- AiAgent (also AiAgentSteps) renders the steps[] from useAiAgent -->
  <AiAgent :steps="steps" title="Agent run" />

  <!-- pendingApprovals[0] is already AiToolCall-shaped — pass directly -->
  <AiToolApproval
    v-if="tools.pendingApprovals.value[0]"
    :tool-call="tools.pendingApprovals.value[0]"
    @approve="tools.approveTool"
    @deny="tools.denyTool"
  />

  <AiMessage v-for="(msg, i) in aiMessages" :key="i" v-bind="msg" />
  <form @submit="handleSubmit">
    <AiPromptInput v-model="input" />
  </form>
</template>
```

See [AGENTS.md](./AGENTS.md) for step-by-step recipes for coding agents.

## Markdown rendering

```vue
<script setup lang="ts">
const { html } = useAiMarkdown(() => markdownSource)
</script>

<template>
  <AiMarkdown :content="markdownSource" />
  <!-- or -->
  <div v-html="html" />
</template>
```

GFM (tables, task lists, strikethrough) is enabled by default via `marked`. Use auto-imported `simpleParse` for a lightweight fallback (no tables — useful during streaming to avoid layout shifts):

```ts
const { html } = useAiMarkdown(() => markdownSource, { parse: simpleParse })
```

## Components (52)

All components are auto-imported with the `Ai` prefix.

| Category | Components |
|----------|------------|
| **Chatbot** | Message, PromptInput, Conversation (thread list / sidebar), Reasoning, ChainOfThought, Sources, Tool, ToolApproval, Suggestion, Attachments, Shimmer, StreamingCursor, Plan, Task, Checkpoint, Confirmation, Context, Queue, InlineCitation, ModelSelector, ErrorBoundary |
| **Code** | CodeBlock, Terminal, FileTree, StackTrace, Agent (also `AiAgentSteps`), Artifact, Commit, SchemaDisplay, PackageInfo, EnvVars, TestResults, Snippet, WebPreview, Sandbox, VuePreview |
| **Voice** | SpeechInput, Transcription, AudioPlayer, MicSelector, VoiceSelector, Persona |
| **Workflow** | Canvas, Node, Edge, Connection, Controls, Panel, Toolbar |
| **Utilities** | Image, OpenInChat, Markdown |

## Composables

| Composable | Description |
|------------|-------------|
| `useAiChat` | Wraps `@ai-sdk/vue` `Chat` when `api` is set; supports `body` / `headers` / `credentials`; local state without `api` |
| `useAiChatLocal` | Local message state without AI SDK |
| `useAiChatPersisted` | `useAiChat` with localStorage/sessionStorage persistence |
| `useAiAgent` | Agent steps, plan, tasks, and confirmation flow on top of chat |
| `useAiTools` | Declarative per-tool UI metadata wired to `useAiAgent`; exposes `pendingApprovals` (typed `AiToolCall[]`) for `AiToolApproval` |
| `useAiWorkflow` | Workflow graph nodes/edges state |
| `useAiCompletion` | Wraps `@ai-sdk/vue` `useCompletion` |
| `useAiMarkdown` | Markdown string → sanitized HTML (GFM via `marked`); pass `{ parse: simpleParse }` for lightweight fallback |
| `mapMessageParts` / `toAiMessageProps` | Map AI SDK `UIMessage.parts` → `AiMessage` props |

## Server utilities

```ts
import {
  createChatHandler,
  createMockChatHandler,
  createAgentHandler,
} from 'ai-elements-nuxt/server'
```

## Development

```bash
git clone https://github.com/albegosu/ai-elements-nuxt.git
cd ai-elements-nuxt
pnpm install
pnpm dev
```

See [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md) for the full contributor guide (lint, test, docs conventions).

## Documentation & playground

```bash
pnpm dev
```

Opens the docs site at `http://localhost:3000` (or the [hosted docs](https://albegosu.github.io/ai-elements-nuxt/)) with:
- **Guides**: getting started, building a chat, custom transport & RAG, building an agent, styling, composables
- Component reference with Preview/Code tabs for all 52 components
- Playgrounds: chat, streaming, agent, code, voice & workflow

## Philosophy

- **Headless**: slot-driven, `data-ai-*` attributes, no forced design system
- **Compatible**: follows AI SDK `UIMessage.parts` contract
- **Nuxt-native**: module auto-imports, Nitro server helpers
- **Agent-ready**: `AGENTS.md` and `.cursor/rules/` for AI coding tools

## Credits

Inspired by and designed to complement [vercel/ai-elements](https://github.com/vercel/ai-elements) and the [AI SDK](https://ai-sdk.dev).

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](.github/CONTRIBUTING.md) and our [Code of Conduct](.github/CODE_OF_CONDUCT.md) before opening a pull request.

## License

MIT
