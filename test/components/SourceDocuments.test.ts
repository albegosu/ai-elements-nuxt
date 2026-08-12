import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiSourceDocuments from '../../src/runtime/components/chatbot/SourceDocuments.vue'

const docs = [
  { id: '1', title: 'spec.pdf', type: 'pdf' as const },
  { id: '2', title: 'https://example.com', type: 'url' as const },
]

describe('AiSourceDocuments', () => {
  it('renders a chip per document', () => {
    const wrapper = mount(AiSourceDocuments, { props: { documents: docs } })
    expect(wrapper.attributes('data-ai-source-documents')).toBeDefined()
    expect(wrapper.findAll('[data-ai-source-document]')).toHaveLength(2)
    expect(wrapper.text()).toContain('spec.pdf')
  })

  it('renders nothing when empty', () => {
    const wrapper = mount(AiSourceDocuments, { props: { documents: [] } })
    expect(wrapper.find('[data-ai-source-documents]').exists()).toBe(false)
  })

  it('emits remove with the document', async () => {
    const wrapper = mount(AiSourceDocuments, { props: { documents: docs } })
    await wrapper.findAll('button')[0].trigger('click')
    expect(wrapper.emitted('remove')?.[0]?.[0]).toEqual(docs[0])
  })

  it('hides remove buttons when not removable', () => {
    const wrapper = mount(AiSourceDocuments, { props: { documents: docs, removable: false } })
    expect(wrapper.findAll('button')).toHaveLength(0)
  })
})
