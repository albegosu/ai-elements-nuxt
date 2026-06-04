import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiErrorBoundary from '../../src/runtime/components/chatbot/ErrorBoundary.vue'

describe('AiErrorBoundary', () => {
  it('shows prop error', () => {
    const wrapper = mount(AiErrorBoundary, {
      props: { error: 'Something failed' },
    })
    expect(wrapper.text()).toContain('Something failed')
    expect(wrapper.attributes('data-has-error')).toBeDefined()
  })

  it('reset clears prop-driven display when error cleared', async () => {
    const wrapper = mount(AiErrorBoundary, {
      props: { error: 'err' },
    })
    const vm = wrapper.vm as { reset: () => void }
    vm.reset()
    await wrapper.setProps({ error: null })
    expect(wrapper.attributes('data-has-error')).toBeUndefined()
  })

  it('exposes retry and dismiss actions', async () => {
    const wrapper = mount(AiErrorBoundary, {
      props: { error: 'fail', retryable: true },
    })
    await wrapper.find('[data-ai-error-boundary-retry]').trigger('click')
    expect(wrapper.emitted('retry')).toBeTruthy()
    await wrapper.find('[data-ai-error-boundary-dismiss]').trigger('click')
    expect(wrapper.emitted('dismiss')).toBeTruthy()
  })
})
