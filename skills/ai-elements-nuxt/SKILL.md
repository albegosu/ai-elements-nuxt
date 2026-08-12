---
name: ai-elements-nuxt
description: Build Nuxt 3 / Vue 3 AI interfaces (chat, agents, RAG, voice, workflows) with the headless ai-elements-nuxt component library on top of the Vercel AI SDK. Use when implementing streaming chat UIs, tool-approval flows, message rendering, or any Ai* component in a Nuxt app.
---

# ai-elements-nuxt

Headless UI layer for the Vercel AI SDK in Nuxt 3 / Vue 3 (`ai ^7`, `@ai-sdk/vue ^4`).
Components are auto-imported with the `Ai` prefix and expose **slots** + `data-ai-*` hooks —
they ship no design system; you style them with your own CSS/Tailwind.

## Setup

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['ai-elements-nuxt'],
  aiElements: { defaultStyles: true }, // optional base CSS for [data-ai-*]
})
```

```bash
pnpm add ai-elements-nuxt ai @ai-sdk/vue
```

## Core patterns

- **Streaming chat:** `useAiChat({ api: '/api/chat' })` → `aiMessages`, `input`, `handleSubmit`, `isStreaming`.
- **Dynamic body (RAG):** `useAiChat({ api, body: () => ({ conversationId, model }) })`.
- **Render messages:** `toAiMessageProps(uiMessage, status)` then `<AiMessage v-bind="msg" />`.
- **Types:** `import type { AiMessageProps } from 'ai-elements-nuxt/types'` (or `#ai-elements`).
- **Server:** `createChatHandler` / `createAgentHandler` / `createMockChatHandler` from `ai-elements-nuxt/server`.
- **Sidebar vs thread:** `AiConversation` is the thread list only; render the active thread with `v-for` + `AiMessage`.

## Do not

- Manually import `Ai*` when the module is enabled (they are auto-imported).
- Use legacy `toolInvocations`-only mapping — map from `UIMessage.parts`.
- Style *inside* library components — use slots and `[data-ai-*]` selectors.

## Discovery

For the full, always-current API (props, slots, events, usage) run the MCP server and query it,
or read `ai-elements-nuxt/registry` (JSON):

```bash
npx ai-elements-nuxt-mcp   # MCP stdio server: list_components, get_component, search_components
```

<!-- REGISTRY:START -->
#### Components (66)

- **Chatbot:** AiAttachments, AiChainOfThought, AiCheckpoint, AiConfirmation, AiContext, AiConversation, AiErrorBoundary, AiInlineCitation, AiMessage, AiModelSelector, AiPlan, AiPromptInput, AiQueue, AiReasoning, AiShimmer, AiSources, AiStreamingCursor, AiSuggestion, AiTask, AiTool, AiToolApproval, AiApprovalPolicy, AiScreenshotButton, AiDownloadConversation, AiBranch, AiSpeechButton, AiSourceDocuments
- **Code:** AiAgent, AiAgentTimeline, AiArtifact, AiCodeBlock, AiCommit, AiEnvVars, AiFileTree, AiPackageInfo, AiSandbox, AiSandboxPreview, AiSchemaDisplay, AiSnippet, AiStackTrace, AiTerminal, AiTestResults, AiVuePreview, AiWebPreview
- **Voice:** AiAudioPlayer, AiMicSelector, AiPersona, AiSpeechInput, AiTranscription, AiVoiceSelector, AiRealtimeChat
- **Workflow:** AiCanvas, AiConnection, AiControls, AiEdge, AiNode, AiPanel, AiToolbar
- **Utilities:** AiImage, AiMarkdown, AiJsxPreview, AiOpenInChat, AiFileUpload, AiVideoPlayer, AiMcpApp, AiRuntimeContext

#### Composables (11)

`useAiAgent`, `useAiChat`, `useAiChatLocal`, `useAiChatPersisted`, `useAiCompletion`, `useAiMarkdown`, `useAiRealtime`, `useAiTools`, `useAiWorkflow`, `useScreenshotCapture`, `useSpeechRecognition`
<!-- REGISTRY:END -->

See **AGENTS.md** in the package for the full implementation guide.
