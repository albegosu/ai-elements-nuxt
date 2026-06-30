import { readBody } from 'h3'
import type { H3Event } from 'h3'
import {
  streamText,
  convertToModelMessages,
  isStepCount,
  createUIMessageStreamResponse,
  toUIMessageStream,
  tool,
  type FlexibleSchema,
  type LanguageModel,
  type Tool,
  type UIMessage,
} from 'ai'

export interface AgentToolDefinition {
  description: string
  /** Zod schema or other AI SDK-compatible schema */
  parameters: FlexibleSchema
  execute?: (args: unknown) => Promise<unknown> | unknown
  /** Pause for human approval before running `execute` (AI SDK `needsApproval`) */
  requireConfirmation?: boolean
}

export interface CreateAgentHandlerOptions {
  model: LanguageModel
  /** System prompt / instructions for the model. */
  instructions?: string
  /** @deprecated Use `instructions` instead. */
  system?: string
  tools: Record<string, AgentToolDefinition>
  /** Multi-step agent loop limit (maps to `stopWhen: isStepCount(n)`) */
  maxSteps?: number
  sendReasoning?: boolean
  sendSources?: boolean
  /** Optional middleware before default `execute` */
  onToolCall?: (toolCall: { name: string; args: unknown }) => Promise<unknown> | unknown
}

function buildSdkTools(
  tools: Record<string, AgentToolDefinition>,
  onToolCall?: CreateAgentHandlerOptions['onToolCall'],
) {
  const sdkTools: Record<string, Tool> = {}

  for (const [name, def] of Object.entries(tools)) {
    sdkTools[name] = tool({
      description: def.description,
      inputSchema: def.parameters,
      needsApproval: def.requireConfirmation ?? false,
      execute: async (args: unknown) => {
        if (onToolCall) {
          const overridden = await onToolCall({ name, args })
          if (overridden !== undefined) return overridden
        }
        if (!def.execute) {
          throw new Error(`Tool "${name}" has no execute handler`)
        }
        return def.execute(args)
      },
    })
  }

  return sdkTools
}

/**
 * Creates a Nuxt/Nitro handler for multi-step agents with tools and optional human approval.
 *
 * @example
 * ```ts
 * // server/api/chat.post.ts
 * import { createAgentHandler } from 'ai-elements-nuxt/server'
 * import { openai } from '@ai-sdk/openai'
 * import { z } from 'zod'
 *
 * export default createAgentHandler({
 *   model: openai('gpt-4o'),
 *   maxSteps: 10,
 *   tools: {
 *     getWeather: {
 *       description: 'Get weather for a city',
 *       parameters: z.object({ city: z.string() }),
 *       execute: async ({ city }) => ({ temp: 72, city }),
 *     },
 *   },
 * })
 * ```
 */
export function createAgentHandler(options: CreateAgentHandlerOptions) {
  const maxSteps = options.maxSteps ?? 10
  const sdkTools = buildSdkTools(options.tools, options.onToolCall)

  return async (event: H3Event) => {
    const body = await readBody<{ messages: UIMessage[] }>(event)
    const { messages } = body

    const result = streamText({
      model: options.model,
      instructions: options.instructions ?? options.system,
      messages: await convertToModelMessages(messages),
      tools: sdkTools,
      stopWhen: isStepCount(maxSteps),
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
