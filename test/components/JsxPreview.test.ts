import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiJsxPreview from '../../src/runtime/components/utilities/JsxPreview.vue'
import { closeUnclosedTags, sanitizeMarkup } from '../../src/runtime/utils/sanitizeHtml'

describe('AiJsxPreview', () => {
  it('renders complete markup', () => {
    const wrapper = mount(AiJsxPreview, {
      props: { content: '<p class="x">Hello</p>' },
    })
    expect(wrapper.attributes('data-ai-jsx-preview')).toBeDefined()
    expect(wrapper.find('p.x').exists()).toBe(true)
    expect(wrapper.text()).toContain('Hello')
  })

  it('auto-closes tags cut off mid-stream', () => {
    const wrapper = mount(AiJsxPreview, {
      props: { content: '<div><span>hi' },
    })
    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.text()).toContain('hi')
  })

  it('falls back to the last valid render when a chunk is empty', async () => {
    const wrapper = mount(AiJsxPreview, {
      props: { content: '<p>stable</p>' },
    })
    expect(wrapper.text()).toContain('stable')
    // A lone unterminated tag sanitizes to nothing → keep previous render.
    await wrapper.setProps({ content: '<' })
    expect(wrapper.text()).toContain('stable')
  })

  it('strips dangerous markup', () => {
    const wrapper = mount(AiJsxPreview, {
      props: { content: '<p>ok</p><script>alert(1)</script>' },
    })
    expect(wrapper.html()).not.toContain('<script')
    expect(wrapper.text()).toContain('ok')
  })
})

describe('closeUnclosedTags', () => {
  it('appends missing closing tags in reverse order', () => {
    expect(closeUnclosedTags('<div><span>hi')).toBe('<div><span>hi</span></div>')
  })

  it('ignores void elements', () => {
    expect(closeUnclosedTags('<div><img src="a.png">')).toBe('<div><img src="a.png"></div>')
  })

  it('drops a trailing incomplete tag', () => {
    expect(closeUnclosedTags('<div>text <span cla')).toBe('<div>text </div>')
  })
})

describe('sanitizeMarkup', () => {
  it('removes script elements and inline handlers', () => {
    const out = sanitizeMarkup('<div onclick="x()">a<script>b()</script></div>')
    expect(out).not.toContain('onclick')
    expect(out).not.toContain('<script')
    expect(out).toContain('a')
  })

  it('neutralizes javascript: urls', () => {
    const out = sanitizeMarkup('<img src="javascript:alert(1)">')
    expect(out).not.toContain('javascript:')
  })
})
