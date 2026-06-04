import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiPromptInput from '../../src/runtime/components/chatbot/PromptInput.vue'

describe('AiPromptInput', () => {
  it('emits update:modelValue on input', async () => {
    const wrapper = mount(AiPromptInput, {
      props: { modelValue: '' },
    })
    const textarea = wrapper.find('textarea')
    await textarea.setValue('test message')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test message'])
  })

  it('emits submit on Enter', async () => {
    const wrapper = mount(AiPromptInput, {
      props: { modelValue: 'hello' },
    })
    await wrapper.find('textarea').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('submit')).toBeTruthy()
  })
})
