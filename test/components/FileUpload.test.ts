import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiFileUpload from '../../src/runtime/components/utilities/FileUpload.vue'

describe('AiFileUpload', () => {
  it('renders dropzone', () => {
    const wrapper = mount(AiFileUpload)
    expect(wrapper.find('[data-ai-file-upload-dropzone]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Drag files here')
  })

  it('shows disabled state', () => {
    const wrapper = mount(AiFileUpload, {
      props: { disabled: true },
    })
    expect(wrapper.find('[data-ai-file-upload]').attributes('data-disabled')).toBeDefined()
  })

  it('exposes addFiles and items via ref', async () => {
    const wrapper = mount(AiFileUpload)
    const file = new File(['hello'], 'test.txt', { type: 'text/plain' })
    ;(wrapper.vm as unknown as { addFiles: (files: File[]) => void }).addFiles([file])
    const items = (wrapper.vm as unknown as { items: { value: unknown[] } }).items
    expect(items).toHaveLength(1)
  })

  it('emits upload event when files added', () => {
    const wrapper = mount(AiFileUpload)
    const file = new File(['data'], 'doc.pdf', { type: 'application/pdf' })
    ;(wrapper.vm as unknown as { addFiles: (files: File[]) => void }).addFiles([file])
    expect(wrapper.emitted('upload')?.[0]?.[0]).toHaveLength(1)
  })

  it('validates max file size', () => {
    const wrapper = mount(AiFileUpload, {
      props: { maxSize: 100 },
    })
    const bigFile = new File(['x'.repeat(200)], 'big.txt', { type: 'text/plain' })
    ;(wrapper.vm as unknown as { addFiles: (files: File[]) => void }).addFiles([bigFile])
    expect(wrapper.emitted('error')).toBeTruthy()
  })
})
