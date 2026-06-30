# Changelog

## 1.2.0

### Added
- `AiSandboxPreview` component — sandbox stdout/stderr streaming with run/stop controls, exit code, and file artifacts
- `AiVideoPlayer` component — AI-generated video playback with loading/error/empty states and duration display
- `AiMcpApp` component — sandboxed MCP application rendering via iframe (HTML, JSON, text)
- `AiRuntimeContext` component — dev tool for inspecting runtime, tool, and approval context entries
- New types: `AiSandboxLine`, `AiSandboxState`, `AiSandboxArtifact`, `AiVideoData`, `AiMcpAppData`, `AiRuntimeContextEntry`
- Demo files and component-meta entries for all v1.1.0 and v1.2.0 components
- Updated docs: README (60 components), composables guide (`useAiRealtime`), CHANGELOG, version badge

## 1.1.0

### Added
- `useAiRealtime` composable — Vue wrapper for AI SDK v7 `AbstractRealtimeSession` with audio capture/playback
- `AiRealtimeChat` component — voice + text realtime conversation with capture, playback, and connection controls
- `AiApprovalPolicy` component — declarative tool approval policies (auto-approve, auto-deny, user-approval)
- `AiAgentTimeline` component — rich timeline visualization with duration, connectors, and nested children
- `AiFileUpload` component — drag-and-drop file upload with validation, progress, and file list
- New types: `AiRealtimeStatus`, `AiRealtimeMessage`, `AiApprovalPolicies`, `AiTimelineEntry`, `AiFileUploadItem`

## 1.0.0

### Changed
- **Breaking**: peer dependencies updated to `ai@^7.0.0`, `@ai-sdk/vue@^4.0.0` (AI SDK v7)
- Server handlers migrated: `system` → `instructions`, `stepCountIs` → `isStepCount`, `result.toUIMessageStreamResponse()` → `createUIMessageStreamResponse()` + `toUIMessageStream()`
- Docs and README updated for v7 APIs

## 0.5.1

### Fixed
- Add explicit Vue imports to runtime components

## 0.5.0 — 2026-06-04

### Added
- Open-source policy docs, issue/PR templates, README community section

## 0.4.0

### Added
- `createAgentHandler` server helper: multi-step `streamText`, tool definitions, `maxSteps`, `needsApproval` for `requireConfirmation`
- `useAiTools` composable: declarative tool registry, `pendingApprovals`, `approveTool` / `denyTool`
- `useAiWorkflow` composable: graph state (nodes, edges, selection, `canConnect`, `toJSON` / `fromJSON`)
- GFM markdown via `marked` in `useAiMarkdown`; `simpleParse` fallback
- Agent docs: `.cursor/rules/ai-elements.mdc`, `AGENTS.md` (streaming chat, tool approval, agent with tools)
- Docs guides: getting started, building a chat, building an agent, styling, composables reference
- Agent playground demo (`docs/pages/playground/agent.vue`)

### Changed
- Workflow components: canvas pan/zoom/touch, snap grid, fit view; node drag with ports; edge types, delete key, label slot props; connection `validTarget`
- `docs/data/component-meta.ts` aligned with workflow/voice slot and prop APIs
- README: new APIs, guides, GFM markdown note

### Dependencies
- `marked` ^15.0.0

## 0.3.0

### Added
- Full AI SDK `ToolUIPart` state lifecycle on `AiToolCall` (`approval-requested`, `output-denied`, etc.)
- `approvalId` / `approval` on tool calls; stream-driven `pendingConfirmation` in `useAiAgent`
- `useAiChat`: `addToolApprovalResponse`, `addToolOutput`, `resumeStream`; forwards `onToolCall`, `sendAutomaticallyWhen`, and other `ChatInit` options
- `useAiAgent`: wires approve/deny to `chat.addToolApprovalResponse`; default `sendAutomaticallyWhen` for approval responses
- Enhanced default `useAiMarkdown` parser (headings, lists, code blocks, blockquotes, images) with link sanitization
- `ErrorBoundary`: `onErrorCaptured` + `reset()` expose
- `AiTool` / `AiToolApproval`: state-specific slots aligned with Vercel AI Elements confirmation flow
- `scripts/verify-dist.mjs` and `prepublishOnly` dist parity check
- Tests for markdown XSS, persistence, tool approval, error boundary, and approval state mapping

### Fixed
- SSR-safe IDs via Vue 3.5 `useId()` in `useUniqueId`
- `useAiChatPersisted`: debounce cleanup, restore-before-persist gate, JSON validation
- `useAiChat`: try/catch on `Chat` construction; `onScopeDispose` stops active streams
- `SpeechInput`: unmount cleanup, double-start guard, reactive recognition settings
- Removed inline styles from `AiImage` lightbox (moved to optional CSS)

### Changed
- `mapMessageParts` preserves full tool states and extracts `approval.id`
- Lint scope includes `src/runtime/components`

## 0.2.0

### Added
- AI SDK v6 integration via `@ai-sdk/vue` `Chat` + `DefaultChatTransport`
- `useAiChat`, `useAiChatLocal`, `useAiCompletion` composables
- `mapMessageParts` / `toAiMessageProps` utilities
- Server helpers: `createChatHandler`, `createMockChatHandler`
- `AiChainOfThought`, `AiVuePreview` components
- Optional base styles (`aiElements.defaultStyles`)
- README, playground streaming demo, unit tests, CI

### Fixed
- npm packaging now includes `src/runtime` Vue SFCs
- FileTree/SchemaDisplay recursive component names
- Panel `collapsed` prop sync, Agent active step, Shimmer SSR, Connection SVG path

### Changed
- Peer: `@ai-sdk/vue` ^3.0.0 (AI SDK 6 compatible)
