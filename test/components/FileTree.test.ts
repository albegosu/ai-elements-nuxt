import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiFileTree from '../../src/runtime/components/code/FileTree.vue'

describe('AiFileTree', () => {
  it('renders file nodes', () => {
    const wrapper = mount(AiFileTree, {
      props: {
        nodes: [
          { name: 'src', type: 'directory', path: '/src', expanded: true, children: [
            { name: 'index.ts', type: 'file', path: '/src/index.ts' },
          ] },
        ],
      },
    })
    expect(wrapper.text()).toContain('src')
    expect(wrapper.text()).toContain('index.ts')
  })

  it('emits select on file click', async () => {
    const file = { name: 'app.vue', type: 'file' as const, path: '/app.vue' }
    const wrapper = mount(AiFileTree, {
      props: { nodes: [file] },
    })
    await wrapper.find('[data-ai-file-node-button]').trigger('click')
    expect(wrapper.emitted('select')?.[0]?.[0]).toEqual(file)
  })
})
