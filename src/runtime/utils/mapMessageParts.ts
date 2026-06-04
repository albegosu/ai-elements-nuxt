import type { AiAttachment, AiMessageProps, AiSource, AiToolCall, AiToolUIPartState } from '../types'
import { isAiToolInProgress } from '../types'

/** Minimal shape compatible with @ai-sdk/vue UIMessage and ai v6 UIMessage */
export interface SdkMessageLike {
  id?: string
  role: 'user' | 'assistant' | 'system' | 'tool' | 'data'
  content?: string
  reasoning?: string
  parts?: Array<Record<string, unknown>>
  toolInvocations?: Array<{
    toolCallId: string
    toolName: string
    args?: Record<string, unknown>
    result?: unknown
    state: 'partial-call' | 'call' | 'result'
  }>
  experimental_attachments?: Array<{
    name?: string
    contentType?: string
    url: string
  }>
}

export interface MappedMessageParts {
  content: string
  reasoning?: string
  sources: AiSource[]
  toolCalls: AiToolCall[]
  attachments: AiAttachment[]
  isStreaming: boolean
}

const SDK_TOOL_STATES: AiToolUIPartState[] = [
  'input-streaming',
  'input-available',
  'approval-requested',
  'approval-responded',
  'output-available',
  'output-denied',
  'output-error',
]

function isSdkToolState(state: string): state is AiToolUIPartState {
  return (SDK_TOOL_STATES as string[]).includes(state)
}

function mapLegacyInvocationState(state: string): AiToolUIPartState {
  if (state === 'result') return 'output-available'
  return 'input-available'
}

function extractApproval(part: Record<string, unknown>): AiToolCall['approval'] | undefined {
  const approval = part.approval as { id?: string; approved?: boolean; reason?: string } | undefined
  if (!approval?.id) return undefined
  return {
    id: approval.id,
    approved: approval.approved,
    reason: approval.reason,
  }
}

function mapDynamicToolPart(
  part: Record<string, unknown>,
  type: string,
): AiToolCall {
  const toolPart = part as {
    toolCallId: string
    toolName?: string
    state: string
    input?: Record<string, unknown>
    output?: unknown
    errorText?: string
    approval?: { id?: string; approved?: boolean; reason?: string }
  }
  const name = toolPart.toolName ?? type.replace(/^tool-/, '')
  const state = isSdkToolState(toolPart.state)
    ? toolPart.state
    : toolPart.state === 'output-available'
      ? 'output-available'
      : toolPart.state === 'output-error'
        ? 'output-error'
        : 'input-available'
  const approval = extractApproval(part)

  return {
    id: toolPart.toolCallId,
    name,
    args: toolPart.input,
    result: toolPart.output,
    status: state,
    error: toolPart.errorText,
    approvalId: approval?.id,
    approval,
  }
}

function mapToolInvocation(inv: {
  toolCallId: string
  toolName: string
  args?: Record<string, unknown>
  result?: unknown
  state: string
}): AiToolCall {
  const status = mapLegacyInvocationState(inv.state)
  return {
    id: inv.toolCallId,
    name: inv.toolName,
    args: inv.args,
    result: inv.result,
    status,
  }
}

/**
 * Maps AI SDK message parts (or legacy fields) to AiMessage slot props.
 */
export function mapMessageParts(message: SdkMessageLike): MappedMessageParts {
  const result: MappedMessageParts = {
    content: message.content ?? '',
    sources: [],
    toolCalls: [],
    attachments: [],
    isStreaming: false,
  }

  if (message.parts?.length) {
    const textParts: string[] = []
    const reasoningParts: string[] = []

    for (const part of message.parts) {
      const type = part.type as string

      if (type === 'text') {
        const text = (part.text ?? part.content) as string | undefined
        if (text) textParts.push(text)
        if (part.state === 'streaming') result.isStreaming = true
      }

      if (type === 'reasoning') {
        const text = (part.text ?? part.reasoning) as string | undefined
        if (text) reasoningParts.push(text)
        if (part.state === 'streaming') result.isStreaming = true
      }

      if (type === 'tool-invocation' && part.toolInvocation) {
        const inv = part.toolInvocation as Parameters<typeof mapToolInvocation>[0]
        result.toolCalls.push(mapToolInvocation(inv))
        if (inv.state !== 'result') result.isStreaming = true
      }

      if (type === 'dynamic-tool' || (typeof type === 'string' && type.startsWith('tool-'))) {
        const mapped = mapDynamicToolPart(part, type)
        result.toolCalls.push(mapped)
        if (isAiToolInProgress(mapped.status)) result.isStreaming = true
      }

      if (type === 'source' && part.source) {
        const src = part.source as { sourceId?: string; id?: string; url?: string; title?: string }
        result.sources.push({
          id: src.sourceId ?? src.id ?? String(result.sources.length),
          title: src.title ?? src.url ?? 'Source',
          url: src.url,
        })
      }

      if (type === 'source-url') {
        result.sources.push({
          id: (part.sourceId as string) ?? String(result.sources.length),
          title: (part.title as string) ?? (part.url as string) ?? 'Source',
          url: part.url as string | undefined,
        })
      }

      if (type === 'file') {
        result.attachments.push({
          id: String(result.attachments.length),
          name: (part.filename as string) ?? 'file',
          type: 'file',
          url: (part.url as string) ?? (part.data as string),
          mimeType: part.mimeType as string | undefined,
        })
      }
    }

    if (textParts.length) result.content = textParts.join('\n')
    if (reasoningParts.length) result.reasoning = reasoningParts.join('\n')
  }

  if (message.reasoning && !result.reasoning) {
    result.reasoning = message.reasoning
  }

  if (message.toolInvocations?.length && !result.toolCalls.length) {
    result.toolCalls = message.toolInvocations.map(mapToolInvocation)
  }

  if (message.experimental_attachments?.length) {
    result.attachments = message.experimental_attachments.map((a, i) => ({
      id: String(i),
      name: a.name ?? 'attachment',
      type: a.contentType?.startsWith('image/') ? 'image' as const : 'file' as const,
      url: a.url,
      mimeType: a.contentType,
    }))
  }

  return result
}

/**
 * Converts an AI SDK message to {@link AiMessageProps} for use with AiMessage.
 */
export function toAiMessageProps(
  message: SdkMessageLike,
  status?: AiMessageProps['status'],
): AiMessageProps {
  const mapped = mapMessageParts(message)
  const role = message.role === 'data' ? 'system' : message.role

  return {
    role: role as AiMessageProps['role'],
    content: mapped.content,
    reasoning: mapped.reasoning,
    sources: mapped.sources.length ? mapped.sources : undefined,
    toolCalls: mapped.toolCalls.length ? mapped.toolCalls : undefined,
    attachments: mapped.attachments.length ? mapped.attachments : undefined,
    status: status ?? (mapped.isStreaming ? 'streaming' : 'complete'),
  }
}
