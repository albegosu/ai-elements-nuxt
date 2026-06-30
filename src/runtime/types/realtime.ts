export type AiRealtimeStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

export interface AiRealtimeMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date | string
}

export interface AiRealtimeOptions {
  model: unknown
  token: string
  sessionConfig?: Record<string, unknown>
  sampleRate?: number
  onToolCall?: (args: { toolCall: { toolCallId: string; toolName: string; args: unknown } }) => Promise<unknown> | unknown
  onError?: (error: Error) => void
}

/** Tool approval policy per tool name. */
export type AiApprovalPolicyType = 'user-approval' | 'auto-approve' | 'auto-deny'

export interface AiApprovalPolicies {
  [toolName: string]: AiApprovalPolicyType | ((args: unknown) => AiApprovalPolicyType | Promise<AiApprovalPolicyType>)
}

/** Timeline entry for AiAgentTimeline. */
export interface AiTimelineEntry {
  id: string
  type: 'thought' | 'action' | 'observation' | 'result' | 'approval' | 'error'
  content: string
  tool?: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  startTime?: number
  endTime?: number
  duration?: number
  children?: AiTimelineEntry[]
}

/** File upload state for AiFileUpload. */
export interface AiFileUploadItem {
  id: string
  file: File
  name: string
  size: number
  mimeType: string
  status: 'pending' | 'uploading' | 'complete' | 'error'
  progress: number
  error?: string
  url?: string
}

/** Sandbox process output line. */
export interface AiSandboxLine {
  id: string
  stream: 'stdout' | 'stderr'
  content: string
  timestamp?: number
}

/** Sandbox execution state for AiSandboxPreview. */
export interface AiSandboxState {
  status: 'idle' | 'running' | 'completed' | 'error'
  command?: string
  lines: AiSandboxLine[]
  exitCode?: number
  artifacts?: AiSandboxArtifact[]
  error?: string
}

/** File artifact produced by a sandbox execution. */
export interface AiSandboxArtifact {
  id: string
  name: string
  path: string
  mimeType?: string
  size?: number
  url?: string
}

/** Video generation result for AiVideoPlayer. */
export interface AiVideoData {
  url: string
  mimeType?: string
  duration?: number
  width?: number
  height?: number
  poster?: string
}

/** MCP app rendering state. */
export interface AiMcpAppData {
  id: string
  name: string
  status: 'loading' | 'ready' | 'error'
  content?: string
  contentType?: 'html' | 'text' | 'json' | 'custom'
  error?: string
  metadata?: Record<string, unknown>
}

/** Runtime context entry for AiRuntimeContext. */
export interface AiRuntimeContextEntry {
  key: string
  value: unknown
  type: 'runtime' | 'tool' | 'approval'
  scope?: string
}
