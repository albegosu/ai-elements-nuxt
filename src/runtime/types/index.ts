/** Props for {@link AiMessage} — maps from AI SDK `UIMessage` via `toAiMessageProps`. */
export interface AiMessageProps {
  role: 'user' | 'assistant' | 'system' | 'tool'
  content?: string
  htmlContent?: string
  status?: 'pending' | 'streaming' | 'complete' | 'error'
  reasoning?: string
  sources?: AiSource[]
  toolCalls?: AiToolCall[]
  attachments?: AiAttachment[]
  metadata?: Record<string, unknown>
}

/** Citation/source attached to an assistant message. */
export interface AiSource {
  id: string
  title: string
  url?: string
  score?: number
  snippet?: string
}

/** AI SDK `ToolUIPart` state — full lifecycle for tools and human-in-the-loop. */
export type AiToolUIPartState =
  | 'input-streaming'
  | 'input-available'
  | 'approval-requested'
  | 'approval-responded'
  | 'output-available'
  | 'output-denied'
  | 'output-error'
  /** @deprecated Use `input-streaming` or `input-available` */
  | 'calling'
  /** @deprecated Use `output-available` */
  | 'result'
  /** @deprecated Use `output-error` */
  | 'error'

/** Approval metadata from streamed tool parts (AI SDK `ToolUIPart.approval`). */
export interface AiToolApproval {
  id: string
  approved?: boolean
  reason?: string
}

/** Tool invocation state for {@link AiTool} and {@link AiToolApproval}. */
export interface AiToolCall {
  id: string
  name: string
  args?: Record<string, unknown>
  result?: unknown
  status: AiToolUIPartState
  error?: string
  /** Approval id for `addToolApprovalResponse` — from `ToolUIPart.approval.id` */
  approvalId?: string
  approval?: AiToolApproval
}

/** Whether the tool is still in progress (not terminal). */
export function isAiToolInProgress(status: AiToolUIPartState): boolean {
  return (
    status === 'calling'
    || status === 'input-streaming'
    || status === 'input-available'
    || status === 'approval-requested'
    || status === 'approval-responded'
  )
}

/** Whether the tool finished successfully. */
export function isAiToolComplete(status: AiToolUIPartState): boolean {
  return status === 'result' || status === 'output-available'
}

/** Whether the tool failed or was denied. */
export function isAiToolFailed(status: AiToolUIPartState): boolean {
  return status === 'error' || status === 'output-error' || status === 'output-denied'
}

/** Whether human approval is currently requested. */
export function isAiToolApprovalRequested(status: AiToolUIPartState): boolean {
  return status === 'approval-requested'
}

export interface AiAttachment {
  id: string
  name: string
  type: 'image' | 'video' | 'audio' | 'document' | 'file'
  url?: string
  size?: number
  mimeType?: string
  previewUrl?: string
}

/** Suggested follow-up prompt chip. */
export interface AiSuggestion {
  id: string
  label: string
  value: string
  description?: string
  icon?: string
}

export interface AiConversationThread {
  id: string
  title: string
  lastMessage?: string
  updatedAt: Date | string
  messageCount?: number
  active?: boolean
  archived?: boolean
}

export interface AiModelOption {
  id: string
  name: string
  provider: string
  description?: string
  capabilities?: string[]
}

export interface AiPromptInputEmits {
  (e: 'submit', value: string): void
  (e: 'stop'): void
  (e: 'update:modelValue', value: string): void
}

export interface AiPlanStep {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped'
  children?: AiPlanStep[]
}

export interface AiCheckpointData {
  id: string
  title: string
  description?: string
  timestamp?: Date | string
  status: 'pending' | 'reached' | 'passed' | 'failed'
  metadata?: Record<string, unknown>
}

export interface AiTaskData {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled'
  progress?: number
  subtasks?: AiTaskData[]
}

export interface AiConfirmationData {
  id: string
  title: string
  description?: string
  confirmLabel?: string
  denyLabel?: string
  destructive?: boolean
}

export interface AiContextItem {
  id: string
  type: 'system' | 'document' | 'memory' | 'tool' | 'custom'
  title: string
  content?: string
  tokenCount?: number
  metadata?: Record<string, unknown>
}

export interface AiQueueItem {
  id: string
  content: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  position?: number
  createdAt?: Date | string
}

export interface AiCitation {
  id: string
  sourceId: string
  sourceTitle: string
  text: string
  url?: string
  index: number
}

/** Step in {@link AiChainOfThought} — discrete labeled steps (vs continuous reasoning stream). */
export interface AiChainOfThoughtStep {
  id: string
  label: string
  description?: string
  status: 'pending' | 'active' | 'complete'
  searchResults?: Array<{ id: string; title: string; url?: string; snippet?: string }>
  images?: Array<{ id: string; src: string; alt?: string }>
}

// Code category types

export interface AiCodeBlockData {
  code: string
  language?: string
  filename?: string
  highlightLines?: number[]
  showLineNumbers?: boolean
}

export interface AiSnippetData {
  code: string
  language?: string
  label?: string
}

export interface AiTerminalLine {
  type: 'command' | 'output' | 'error' | 'info'
  content: string
  prefix?: string
}

export interface AiStackFrame {
  file: string
  line?: number
  column?: number
  function?: string
  code?: string
  isApp?: boolean
}

export interface AiFileNode {
  name: string
  type: 'file' | 'directory'
  path: string
  children?: AiFileNode[]
  icon?: string
  language?: string
  selected?: boolean
  expanded?: boolean
}

export interface AiAgentStep {
  id: string
  type: 'thought' | 'action' | 'observation' | 'result'
  content: string
  tool?: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  timestamp?: Date | string
}

export interface AiArtifactData {
  id: string
  title: string
  type: 'code' | 'document' | 'image' | 'html' | 'custom'
  content: string
  language?: string
  metadata?: Record<string, unknown>
}

export interface AiCommitData {
  hash: string
  message: string
  author?: string
  date?: Date | string
  files: AiCommitFile[]
}

export interface AiCommitFile {
  path: string
  status: 'added' | 'modified' | 'deleted' | 'renamed'
  additions?: number
  deletions?: number
  diff?: string
}

export interface AiSchemaField {
  name: string
  type: string
  required?: boolean
  description?: string
  children?: AiSchemaField[]
  default?: unknown
}

export interface AiPackageData {
  name: string
  version: string
  description?: string
  license?: string
  homepage?: string
  repository?: string
  downloads?: number
  dependencies?: Record<string, string>
}

export interface AiEnvVar {
  key: string
  value: string
  type?: 'string' | 'number' | 'boolean' | 'secret'
  required?: boolean
  description?: string
}

export interface AiTestResult {
  name: string
  status: 'passed' | 'failed' | 'skipped' | 'pending'
  duration?: number
  error?: string
  suite?: string
}

export interface AiTestSummary {
  total: number
  passed: number
  failed: number
  skipped: number
  duration?: number
}

// Voice category types

export interface AiAudioTrack {
  id: string
  url: string
  title?: string
  duration?: number
  mimeType?: string
}

export interface AiTranscriptSegment {
  id: string
  text: string
  startTime: number
  endTime: number
  speaker?: string
  confidence?: number
}

export interface AiMediaDevice {
  deviceId: string
  label: string
  kind: 'audioinput' | 'audiooutput'
}

export interface AiVoiceOption {
  id: string
  name: string
  language?: string
  gender?: string
  preview?: string
}

export interface AiPersonaData {
  id: string
  name: string
  avatar?: string
  description?: string
  voice?: string
}

// Workflow category types

export interface AiWorkflowNode {
  id: string
  type: string
  label: string
  position: { x: number; y: number }
  data?: Record<string, unknown>
  status?: 'idle' | 'running' | 'completed' | 'error'
  inputs?: string[]
  outputs?: string[]
}

export interface AiWorkflowEdge {
  id: string
  source: string
  target: string
  sourceOutput?: string
  targetInput?: string
  label?: string
  animated?: boolean
}

export interface AiWorkflowData {
  nodes: AiWorkflowNode[]
  edges: AiWorkflowEdge[]
}
