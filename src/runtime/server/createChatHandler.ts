import { readBody } from 'h3'
import type { H3Event } from 'h3'
import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  toUIMessageStream,
  type LanguageModel,
  type UIMessage,
} from 'ai'

export interface CreateChatHandlerOptions {
  model: LanguageModel
  /** System prompt / instructions for the model. */
  instructions?: string
  /** @deprecated Use `instructions` instead. */
  system?: string
  sendReasoning?: boolean
  sendSources?: boolean
}

function extractLastUserText(messages: UIMessage[]): string {
  const lastUser = [...messages].reverse().find(m => m.role === 'user')
  if (!lastUser?.parts?.length) return 'Hello'
  return lastUser.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map(p => p.text)
    .join(' ')
}

/**
 * Creates a Nuxt/Nitro event handler that streams UI messages compatible with `@ai-sdk/vue` `useChat`.
 *
 * @example
 * ```ts
 * // server/api/chat.post.ts
 * import { createChatHandler } from 'ai-elements-nuxt/server'
 * import { openai } from '@ai-sdk/openai'
 *
 * export default createChatHandler({ model: openai('gpt-4o') })
 * ```
 */
export function createChatHandler(options: CreateChatHandlerOptions) {
  return async (event: H3Event) => {
    const body = await readBody<{ messages: UIMessage[] }>(event)
    const { messages } = body

    const result = streamText({
      model: options.model,
      instructions: options.instructions ?? options.system,
      messages: await convertToModelMessages(messages),
    })

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        sendReasoning: options.sendReasoning ?? true,
        sendSources: options.sendSources ?? true,
      }),
    })
  }
}

/**
 * Mock streaming handler for playground/demos without an API key.
 */
export function createMockChatHandler() {
  return async (event: H3Event) => {
    const body = await readBody<{ messages: UIMessage[] }>(event)
    const prompt = extractLastUserText(body.messages)
    const response = `This is a mock streamed response to: "${prompt}". Connect a model provider via createChatHandler() for real completions.`

    const stream = createUIMessageStream({
      originalMessages: body.messages,
      execute: async ({ writer }) => {
        const reasoningId = 'reasoning-1'
        writer.write({ type: 'reasoning-start', id: reasoningId })
        writer.write({ type: 'reasoning-delta', id: reasoningId, delta: `Thinking about: ${prompt.slice(0, 80)}...` })
        writer.write({ type: 'reasoning-end', id: reasoningId })

        const textId = 'text-1'
        writer.write({ type: 'text-start', id: textId })
        for (const char of response) {
          writer.write({ type: 'text-delta', id: textId, delta: char })
          await new Promise(r => setTimeout(r, 15))
        }
        writer.write({ type: 'text-end', id: textId })
      },
    })

    return createUIMessageStreamResponse({ stream })
  }
}
