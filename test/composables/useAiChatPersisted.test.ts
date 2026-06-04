import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { useAiChatPersisted } from '../../src/runtime/composables/useAiChatPersisted'

describe('useAiChatPersisted', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    localStorage.clear()
  })

  it('restores messages from localStorage on mount', async () => {
    localStorage.setItem(
      'test-chat',
      JSON.stringify([{ role: 'user', content: 'Hi', status: 'complete' }]),
    )
    const chat = useAiChatPersisted({ key: 'test-chat', storage: 'localStorage' })
    await chat.restore()
    expect(chat.messages.value).toHaveLength(1)
    expect(chat.messages.value[0].content).toBe('Hi')
  })

  it('ignores corrupt JSON in storage', async () => {
    localStorage.setItem('bad-chat', '{not json')
    const chat = useAiChatPersisted({ key: 'bad-chat', storage: 'localStorage' })
    await chat.restore()
    expect(chat.messages.value).toHaveLength(0)
  })

  it('debounces persist after restore', async () => {
    const chat = useAiChatPersisted({ key: 'debounce-chat', debounceMs: 300 })
    await chat.restore()
    expect(chat.restored.value).toBe(true)
    chat.addMessage({ role: 'user', content: 'A', status: 'complete' })
    await nextTick()
    vi.advanceTimersByTime(300)
    await nextTick()
    const raw = localStorage.getItem('debounce-chat')
    expect(raw).toBeTruthy()
    expect(JSON.parse(raw!)).toHaveLength(1)
  })
})
