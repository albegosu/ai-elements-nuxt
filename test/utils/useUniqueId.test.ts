import { describe, it, expect } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useUniqueId } from '../../src/runtime/utils/useUniqueId'

const IdProbe = defineComponent({
  setup() {
    const a = useUniqueId('test')
    const b = useUniqueId('test')
    return () => h('div', { 'data-a': a, 'data-b': b })
  },
})

describe('useUniqueId', () => {
  it('generates unique ids with prefix inside setup', () => {
    const wrapper = mount(IdProbe)
    const a = wrapper.attributes('data-a')
    const b = wrapper.attributes('data-b')
    expect(a).toMatch(/^test-/)
    expect(b).toMatch(/^test-/)
    expect(a).not.toBe(b)
  })
})
