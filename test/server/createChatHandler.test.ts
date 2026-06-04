import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createChatHandler, createMockChatHandler } from '../../src/runtime/server/createChatHandler'

vi.mock('ai', async (importOriginal) => {
  const actual = await importOriginal<typeof import('ai')>()
  return {
    ...actual,
    streamText: vi.fn(() => ({
      toUIMessageStreamResponse: vi.fn(() => new Response('stream')),
    })),
    convertToModelMessages: vi.fn(async (messages: unknown[]) => messages),
    createUIMessageStream: vi.fn((opts: { execute: (args: { writer: { write: (chunk: unknown) => void } }) => Promise<void> }) => {
      void opts.execute({
        writer: { write: () => {} },
      })
      return {
        [Symbol.asyncIterator]() {
          return {
            next: async () => ({ done: true, value: undefined }),
          }
        },
      }
    }),
    createUIMessageStreamResponse: vi.fn(() => new Response('mock-stream')),
  }
})

vi.mock('h3', () => ({
  readBody: vi.fn(async () => ({
    messages: [{ role: 'user', parts: [{ type: 'text', text: 'Hello' }] }],
  })),
}))

describe('createChatHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('createMockChatHandler returns a streaming response', async () => {
    const handler = createMockChatHandler()
    const event = {} as Parameters<typeof handler>[0]
    const response = await handler(event)
    expect(response).toBeInstanceOf(Response)
  })

  it('createChatHandler calls streamText with model', async () => {
    const { streamText } = await import('ai')
    const model = { provider: 'test', modelId: 'test' } as never
    const handler = createChatHandler({ model })
    const event = {} as Parameters<typeof handler>[0]
    await handler(event)
    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({ model }),
    )
  })
})
