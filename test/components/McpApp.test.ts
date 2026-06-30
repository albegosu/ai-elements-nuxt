import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiMcpApp from '../../src/runtime/components/utilities/McpApp.vue'

describe('AiMcpApp', () => {
  it('shows loading state', () => {
    const wrapper = mount(AiMcpApp, {
      props: {
        app: { id: '1', name: 'Weather', status: 'loading' },
      },
    })
    expect(wrapper.find('[data-ai-mcp-app-loading]').exists()).toBe(true)
    expect(wrapper.find('[data-ai-mcp-app-name]').text()).toBe('Weather')
  })

  it('shows error state', () => {
    const wrapper = mount(AiMcpApp, {
      props: {
        app: { id: '1', name: 'Weather', status: 'error', error: 'Connection failed' },
      },
    })
    expect(wrapper.find('[data-ai-mcp-app-error]').text()).toBe('Connection failed')
  })

  it('renders HTML content in iframe', () => {
    const wrapper = mount(AiMcpApp, {
      props: {
        app: {
          id: '1',
          name: 'Dashboard',
          status: 'ready',
          content: '<div>Hello</div>',
          contentType: 'html',
        },
      },
    })
    const iframe = wrapper.find('[data-ai-mcp-app-frame]')
    expect(iframe.exists()).toBe(true)
    expect(iframe.attributes('srcdoc')).toBe('<div>Hello</div>')
  })

  it('renders text content', () => {
    const wrapper = mount(AiMcpApp, {
      props: {
        app: {
          id: '1',
          name: 'Logger',
          status: 'ready',
          content: 'Plain text output',
          contentType: 'text',
        },
      },
    })
    expect(wrapper.find('[data-ai-mcp-app-text]').text()).toBe('Plain text output')
  })

  it('renders JSON content formatted', () => {
    const wrapper = mount(AiMcpApp, {
      props: {
        app: {
          id: '1',
          name: 'API',
          status: 'ready',
          content: '{"key":"value"}',
          contentType: 'json',
        },
      },
    })
    expect(wrapper.find('[data-ai-mcp-app-json]').exists()).toBe(true)
  })

  it('applies sandbox attribute to iframe', () => {
    const wrapper = mount(AiMcpApp, {
      props: {
        app: {
          id: '1',
          name: 'App',
          status: 'ready',
          content: '<p>Hi</p>',
          contentType: 'html',
        },
        sandbox: true,
      },
    })
    expect(wrapper.find('iframe').attributes('sandbox')).toBe('allow-scripts allow-same-origin')
  })
})
