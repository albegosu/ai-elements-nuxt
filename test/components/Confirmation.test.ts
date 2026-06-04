import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiConfirmation from '../../src/runtime/components/chatbot/Confirmation.vue'

describe('AiConfirmation', () => {
  it('emits confirm and deny', async () => {
    const wrapper = mount(AiConfirmation, {
      props: {
        confirmation: {
          id: 'c1',
          title: 'Delete?',
          description: 'Are you sure?',
        },
      },
    })
    await wrapper.find('[data-ai-confirmation-confirm]').trigger('click')
    expect(wrapper.emitted('confirm')?.[0]).toEqual(['c1'])
    await wrapper.find('[data-ai-confirmation-deny]').trigger('click')
    expect(wrapper.emitted('deny')?.[0]).toEqual(['c1'])
  })
})
