import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiModelSelector from '../../src/runtime/components/chatbot/ModelSelector.vue'

const models = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'claude', name: 'Claude', provider: 'Anthropic' },
]

describe('AiModelSelector', () => {
  it('filters models by search', async () => {
    const wrapper = mount(AiModelSelector, {
      props: { models, modelValue: 'gpt-4o' },
    })
    await wrapper.find('[data-ai-model-selector] > button').trigger('click')
    await wrapper.find('input').setValue('claude')
    const options = wrapper.findAll('[data-ai-model-option]')
    expect(options).toHaveLength(1)
    expect(options[0].text()).toContain('Claude')
  })

  it('emits update on select', async () => {
    const wrapper = mount(AiModelSelector, {
      props: { models, modelValue: 'gpt-4o' },
    })
    await wrapper.find('[data-ai-model-selector] button').trigger('click')
    const options = wrapper.findAll('[data-ai-model-option]')
    await options[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['claude'])
  })
})
