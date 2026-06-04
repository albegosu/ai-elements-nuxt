import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSendMessage = vi.fn()
const mockStop = vi.fn()
const mockAddToolApprovalResponse = vi.fn()
const mockRegenerate = vi.fn()
const mockClearError = vi.fn()

vi.mock('@ai-sdk/vue', () => ({
  Chat: vi.fn().mockImplementation(() => ({
    messages: [],
    status: 'ready',
    error: undefined,
    sendMessage: mockSendMessage,
    stop: mockStop,
    regenerate: mockRegenerate,
    clearError: mockClearError,
    addToolApprovalResponse: mockAddToolApprovalResponse,
    addToolOutput: vi.fn(),
    resumeStream: vi.fn(),
  })),
}))

vi.mock('ai', async (importOriginal) => {
  const actual = await importOriginal<typeof import('ai')>()
  return {
    ...actual,
    DefaultChatTransport: vi.fn(),
  }
})

describe('useAiChat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exposes addToolApprovalResponse when api is set', async () => {
    const { useAiChat } = await import('../../src/runtime/composables/useAiChat')
    const chat = useAiChat({ api: '/api/chat' })
    chat.addToolApprovalResponse({ id: 'a1', approved: true })
    expect(mockAddToolApprovalResponse).toHaveBeenCalledWith({ id: 'a1', approved: true })
  })

  it('falls back to local mode without api', async () => {
    const { useAiChat } = await import('../../src/runtime/composables/useAiChat')
    const chat = useAiChat()
    expect(chat.chat).toBeUndefined()
    chat.input.value = 'hello'
    chat.handleSubmit({ preventDefault: () => {} })
    expect(chat.messages.value).toHaveLength(1)
  })

  it('passes body, headers, and credentials to DefaultChatTransport', async () => {
    const { DefaultChatTransport } = await import('ai')
    const { useAiChat } = await import('../../src/runtime/composables/useAiChat')
    const body = () => ({ conversationId: 'c1', model: 'gpt-4o' })
    const headers = { 'X-Custom': 'test' }
    useAiChat({
      api: '/api/chat',
      body,
      headers,
      credentials: 'include',
    })
    expect(DefaultChatTransport).toHaveBeenCalledWith({
      api: '/api/chat',
      body,
      headers,
      credentials: 'include',
    })
  })
})
