import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AiScreenshotButton from '../../src/runtime/components/chatbot/ScreenshotButton.vue'

function setMediaDevices(value: unknown) {
  Object.defineProperty(navigator, 'mediaDevices', {
    value,
    configurable: true,
    writable: true,
  })
}

function stubCanvasAndVideo() {
  ;(HTMLMediaElement.prototype as unknown as { play: () => Promise<void> }).play = vi.fn().mockResolvedValue(undefined)
  ;(HTMLCanvasElement.prototype as unknown as { getContext: () => unknown }).getContext = vi.fn(() => ({ drawImage: vi.fn() }))
  ;(HTMLCanvasElement.prototype as unknown as { toBlob: (cb: (b: Blob) => void) => void }).toBlob = (cb: (b: Blob) => void) => cb(new Blob(['x'], { type: 'image/png' }))
  ;(HTMLCanvasElement.prototype as unknown as { toDataURL: () => string }).toDataURL = vi.fn(() => 'data:image/png;base64,abc')
}

describe('AiScreenshotButton', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders a button with an aria-label', () => {
    const wrapper = mount(AiScreenshotButton)
    expect(wrapper.attributes('data-ai-screenshot-button')).toBeDefined()
    expect(wrapper.find('button').attributes('aria-label')).toBe('Capture screenshot')
  })

  it('respects the disabled prop', () => {
    const wrapper = mount(AiScreenshotButton, { props: { disabled: true } })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('emits error when screen capture is unsupported', async () => {
    setMediaDevices(undefined)
    const wrapper = mount(AiScreenshotButton)
    await wrapper.find('button').trigger('click')
    await new Promise(r => setTimeout(r, 0))
    expect(wrapper.emitted('error')).toBeTruthy()
    expect(wrapper.emitted('capture')).toBeFalsy()
  })

  it('emits capture with the screenshot payload on success', async () => {
    const stop = vi.fn()
    const stream = new MediaStream()
    stream.getTracks = () => ([{ stop }] as unknown as MediaStreamTrack[])
    setMediaDevices({
      getDisplayMedia: vi.fn().mockResolvedValue(stream),
    })
    stubCanvasAndVideo()

    const wrapper = mount(AiScreenshotButton)
    await wrapper.find('button').trigger('click')
    await new Promise(r => setTimeout(r, 0))

    const payload = wrapper.emitted('capture')?.[0]?.[0] as { dataUrl: string, file: File } | undefined
    expect(payload).toBeTruthy()
    expect(payload?.dataUrl).toContain('data:image/png')
    expect(payload?.file).toBeInstanceOf(File)
    expect(stop).toHaveBeenCalled()
  })
})
