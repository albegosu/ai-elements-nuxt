import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiRuntimeContext from '../../src/runtime/components/utilities/RuntimeContext.vue'
import type { AiRuntimeContextEntry } from '../../src/runtime/types/realtime'

const entries: AiRuntimeContextEntry[] = [
  { key: 'model', value: 'gpt-4o', type: 'runtime' },
  { key: 'search', value: { enabled: true }, type: 'tool', scope: 'agent' },
  { key: 'deleteFile', value: 'user-approval', type: 'approval' },
]

describe('AiRuntimeContext', () => {
  it('renders all entries', () => {
    const wrapper = mount(AiRuntimeContext, {
      props: { entries },
    })
    expect(wrapper.findAll('[data-ai-runtime-context-entry]')).toHaveLength(3)
  })

  it('groups entries by type', () => {
    const wrapper = mount(AiRuntimeContext, {
      props: { entries },
    })
    expect(wrapper.findAll('[data-ai-runtime-context-group]')).toHaveLength(3)
  })

  it('filters by type', () => {
    const wrapper = mount(AiRuntimeContext, {
      props: { entries, filterType: 'tool' },
    })
    expect(wrapper.findAll('[data-ai-runtime-context-entry]')).toHaveLength(1)
  })

  it('hides entries when collapsed', () => {
    const wrapper = mount(AiRuntimeContext, {
      props: { entries, collapsed: true },
    })
    expect(wrapper.find('[data-ai-runtime-context-body]').exists()).toBe(false)
  })

  it('toggles collapse on header click', async () => {
    const wrapper = mount(AiRuntimeContext, {
      props: { entries },
    })
    expect(wrapper.find('[data-ai-runtime-context-body]').exists()).toBe(true)
    await wrapper.find('[data-ai-runtime-context-header]').trigger('click')
    expect(wrapper.find('[data-ai-runtime-context-body]').exists()).toBe(false)
  })

  it('shows entry count in header', () => {
    const wrapper = mount(AiRuntimeContext, {
      props: { entries },
    })
    expect(wrapper.find('[data-ai-runtime-context-count]').text()).toBe('3 entries')
  })
})
