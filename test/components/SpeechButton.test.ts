import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AiSpeechButton from '../../src/runtime/components/chatbot/SpeechButton.vue'

interface FakeRecognition {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((e: unknown) => void) | null
  onerror: ((e: unknown) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

let lastRecognition: FakeRecognition | null = null

// Factory avoids aliasing `this`; `new (vi.fn)()` returns the object it creates.
const FakeCtor = vi.fn(() => {
  const rec: FakeRecognition = {
    lang: '',
    continuous: false,
    interimResults: false,
    onresult: null,
    onerror: null,
    onend: null,
    start: vi.fn(),
    stop: vi.fn(() => rec.onend?.()),
  }
  lastRecognition = rec
  return rec
})

function setSpeechSupported(supported: boolean) {
  Object.defineProperty(window, 'SpeechRecognition', {
    value: supported ? FakeCtor : undefined,
    configurable: true,
    writable: true,
  })
  Object.defineProperty(window, 'webkitSpeechRecognition', {
    value: undefined,
    configurable: true,
    writable: true,
  })
}

describe('AiSpeechButton', () => {
  afterEach(() => {
    lastRecognition = null
    vi.restoreAllMocks()
  })

  it('disables the button when unsupported', () => {
    setSpeechSupported(false)
    const wrapper = mount(AiSpeechButton)
    expect(wrapper.attributes('data-ai-speech-button')).toBeDefined()
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('emits result from recognition when supported', async () => {
    setSpeechSupported(true)
    const wrapper = mount(AiSpeechButton)
    // Drive via the exposed toggle (happy-dom suppresses clicks on a button
    // that rendered disabled before isSupported flipped true on mount).
    ;(wrapper.vm as unknown as { toggle: () => void }).toggle()

    expect(lastRecognition).not.toBeNull()
    lastRecognition!.onresult?.({
      resultIndex: 0,
      results: [{ 0: { transcript: 'hello world' }, isFinal: true, length: 1 }],
    })

    expect(wrapper.emitted('result')?.[0]).toEqual(['hello world', true])
    expect(wrapper.emitted('start')).toBeTruthy()
  })
})
