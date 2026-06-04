import { describe, it, expect } from 'vitest'
import { useAiChatLocal } from '../../src/runtime/composables/useAiChatLocal'

describe('useAiChatLocal', () => {
  it('exposes aiMessages matching messages', () => {
    const { messages, aiMessages } = useAiChatLocal({
      initialMessages: [{ role: 'user', content: 'Hi', status: 'complete' }],
    })
    expect(aiMessages.value).toEqual(messages.value)
  })

  it('handleSubmit pushes user message and clears input', () => {
    const { input, messages, handleSubmit } = useAiChatLocal()
    input.value = 'Hello'
    handleSubmit({ preventDefault: () => {} })
    expect(messages.value).toHaveLength(1)
    expect(messages.value[0].role).toBe('user')
    expect(messages.value[0].content).toBe('Hello')
    expect(input.value).toBe('')
  })

  it('sendMessage adds a user message', () => {
    const { messages, sendMessage } = useAiChatLocal()
    sendMessage('Test')
    expect(messages.value[0].content).toBe('Test')
  })

  it('clearMessages empties the list', () => {
    const { messages, addMessage, clearMessages } = useAiChatLocal()
    addMessage({ role: 'user', content: 'x', status: 'complete' })
    clearMessages()
    expect(messages.value).toHaveLength(0)
  })

  it('stop and clearError are safe no-ops', () => {
    const { stop, clearError, status } = useAiChatLocal()
    stop()
    clearError()
    expect(status.value).toBe('ready')
  })
})
