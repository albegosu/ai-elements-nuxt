/** Minimal message shape accepted by {@link messagesToMarkdown}. */
export interface AiMessageLike {
  role: string
  content?: string
  /** AI SDK `UIMessage` parts — text parts are extracted when `content` is absent. */
  parts?: Array<{ type: string, text?: string }>
}

/** Human-readable heading per message role. */
function roleHeading(role: string): string {
  switch (role) {
    case 'user': return 'User'
    case 'assistant': return 'Assistant'
    case 'system': return 'System'
    case 'tool': return 'Tool'
    default: return role.charAt(0).toUpperCase() + role.slice(1)
  }
}

/** Extract plain text from a message, falling back to `UIMessage` text parts. */
function messageText(message: AiMessageLike): string {
  if (typeof message.content === 'string' && message.content.length > 0) {
    return message.content
  }
  if (Array.isArray(message.parts)) {
    return message.parts
      .filter(part => part.type === 'text' && typeof part.text === 'string')
      .map(part => part.text)
      .join('\n')
      .trim()
  }
  return ''
}

/**
 * Serialize a conversation to Markdown, with a `## Role` heading per message.
 * Tolerant of both plain `{ role, content }` and AI SDK `UIMessage` (`parts[]`).
 */
export function messagesToMarkdown(messages: AiMessageLike[]): string {
  if (!Array.isArray(messages) || messages.length === 0) return ''
  return messages
    .map((message) => {
      const text = messageText(message)
      return `## ${roleHeading(message.role)}\n\n${text}`.trimEnd()
    })
    .join('\n\n')
}

/**
 * Trigger a client-side download of `text` as a file. No-op during SSR.
 */
export function downloadTextFile(
  text: string,
  filename = 'conversation.md',
  mime = 'text/markdown',
): void {
  if (typeof document === 'undefined' || typeof URL === 'undefined') return
  const blob = new Blob([text], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}
