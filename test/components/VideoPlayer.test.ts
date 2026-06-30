import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiVideoPlayer from '../../src/runtime/components/utilities/VideoPlayer.vue'

describe('AiVideoPlayer', () => {
  it('shows loading state', () => {
    const wrapper = mount(AiVideoPlayer, {
      props: { loading: true },
    })
    expect(wrapper.find('[data-ai-video-loading]').exists()).toBe(true)
    expect(wrapper.attributes('data-status')).toBe('loading')
  })

  it('shows error state', () => {
    const wrapper = mount(AiVideoPlayer, {
      props: { error: 'Generation failed' },
    })
    expect(wrapper.find('[data-ai-video-error]').text()).toBe('Generation failed')
    expect(wrapper.attributes('data-status')).toBe('error')
  })

  it('shows empty state when no video', () => {
    const wrapper = mount(AiVideoPlayer)
    expect(wrapper.find('[data-ai-video-empty]').exists()).toBe(true)
    expect(wrapper.attributes('data-status')).toBe('empty')
  })

  it('renders video element with correct attributes', () => {
    const wrapper = mount(AiVideoPlayer, {
      props: {
        video: { url: 'https://example.com/video.mp4', mimeType: 'video/mp4', width: 640, height: 480 },
        controls: true,
        autoplay: false,
      },
    })
    const video = wrapper.find('[data-ai-video-element]')
    expect(video.exists()).toBe(true)
    expect(video.attributes('src')).toBe('https://example.com/video.mp4')
    expect(wrapper.attributes('data-status')).toBe('ready')
  })

  it('shows duration info when available', () => {
    const wrapper = mount(AiVideoPlayer, {
      props: {
        video: { url: 'https://example.com/v.mp4', duration: 125 },
      },
    })
    expect(wrapper.find('[data-ai-video-info]').text()).toContain('2:05')
  })
})
