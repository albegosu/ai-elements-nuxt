import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createAgentHandler } from '../../src/runtime/server/createAgentHandler'
import { z } from 'zod'

vi.mock('ai', async (importOriginal) => {
  const actual = await importOriginal<typeof import('ai')>()
  return {
    ...actual,
    streamText: vi.fn(() => ({
      toUIMessageStreamResponse: vi.fn(() => new Response('stream')),
    })),
    convertToModelMessages: vi.fn(async (messages: unknown[]) => messages),
    tool: vi.fn((def: unknown) => def),
    stepCountIs: vi.fn((n: number) => ({ type: 'stepCount', n })),
  }
})

vi.mock('h3', () => ({
  readBody: vi.fn(async () => ({
    messages: [{ role: 'user', parts: [{ type: 'text', text: 'Hello' }] }],
  })),
}))

describe('createAgentHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls streamText with tools and stopWhen', async () => {
    const { streamText, tool, stepCountIs } = await import('ai')
    const model = { provider: 'test', modelId: 'test' } as never
    const handler = createAgentHandler({
      model,
      maxSteps: 5,
      tools: {
        echo: {
          description: 'Echo',
          parameters: z.object({ text: z.string() }),
          execute: async (args: unknown) => (args as { text: string }).text,
        },
      },
    })
    const event = {} as Parameters<typeof handler>[0]
    await handler(event)

    expect(tool).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Echo',
        needsApproval: false,
      }),
    )
    expect(stepCountIs).toHaveBeenCalledWith(5)
    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({
        model,
        tools: expect.any(Object),
        stopWhen: { type: 'stepCount', n: 5 },
      }),
    )
  })

  it('sets needsApproval when requireConfirmation is true', async () => {
    const { tool } = await import('ai')
    const model = { provider: 'test', modelId: 'test' } as never
    createAgentHandler({
      model,
      tools: {
        deleteFile: {
          description: 'Delete',
          parameters: z.object({ path: z.string() }),
          requireConfirmation: true,
          execute: async () => ({ ok: true }),
        },
      },
    })

    expect(tool).toHaveBeenCalledWith(
      expect.objectContaining({ needsApproval: true }),
    )
  })

  it('defaults maxSteps to 10', async () => {
    const { stepCountIs } = await import('ai')
    const model = { provider: 'test', modelId: 'test' } as never
    const handler = createAgentHandler({
      model,
      tools: {
        t: {
          description: 'T',
          parameters: z.object({}),
          execute: async () => ({}),
        },
      },
    })
    await handler({} as Parameters<typeof handler>[0])
    expect(stepCountIs).toHaveBeenCalledWith(10)
  })
})
