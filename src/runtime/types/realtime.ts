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
