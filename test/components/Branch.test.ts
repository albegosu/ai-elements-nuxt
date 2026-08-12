import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiBranch from '../../src/runtime/components/chatbot/Branch.vue'

describe('AiBranch', () => {
  it('renders an indicator for multiple branches', () => {
    const wrapper = mount(AiBranch, { props: { branches: ['a', 'b', 'c'] } })
    expect(wrapper.attributes('data-ai-branch')).toBeDefined()
    expect(wrapper.attributes('data-count')).toBe('3')
    expect(wrapper.find('[data-ai-branch-indicator]').text()).toBe('1 / 3')
  })

  it('hides controls for a single branch', () => {
    const wrapper = mount(AiBranch, { props: { branches: ['only'] } })
    expect(wrapper.find('[data-ai-branch-controls]').exists()).toBe(false)
  })

  it('navigates and emits change + update:index', async () => {
    const wrapper = mount(AiBranch, { props: { branches: ['a', 'b', 'c'] } })
    const [prev, next] = wrapper.findAll('button')
    expect(prev.attributes('disabled')).toBeDefined()

    await next.trigger('click')
    expect(wrapper.emitted('update:index')?.[0]).toEqual([1])
    expect(wrapper.emitted('change')?.[0]).toEqual([1, 'b'])
    expect(wrapper.find('[data-ai-branch-indicator]').text()).toBe('2 / 3')
  })

  it('clamps and disables next at the end', async () => {
    const wrapper = mount(AiBranch, { props: { branches: ['a', 'b'], index: 5 } })
    // index clamped to last
    expect(wrapper.find('[data-ai-branch-indicator]').text()).toBe('2 / 2')
    const buttons = wrapper.findAll('button')
    expect(buttons[1].attributes('disabled')).toBeDefined()
  })

  it('exposes navigation via default slot', () => {
    const wrapper = mount(AiBranch, {
      props: { branches: ['a', 'b'] },
      slots: {
        default: `<template #default="{ current, count, canNext }">
          <span class="probe">{{ current }}-{{ count }}-{{ canNext }}</span>
        </template>`,
      },
    })
    expect(wrapper.find('.probe').text()).toBe('a-2-true')
  })
})
