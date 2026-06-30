import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AiSandboxPreview from '../../src/runtime/components/code/SandboxPreview.vue'
import type { AiSandboxState } from '../../src/runtime/types/realtime'

const idleState: AiSandboxState = {
  status: 'idle',
  command: 'node index.js',
  lines: [],
}

const runningState: AiSandboxState = {
  status: 'running',
  command: 'npm test',
  lines: [
    { id: '1', stream: 'stdout', content: 'Running tests...' },
    { id: '2', stream: 'stderr', content: 'Warning: deprecated API' },
  ],
}

const completedState: AiSandboxState = {
  status: 'completed',
  command: 'build.sh',
  lines: [{ id: '1', stream: 'stdout', content: 'Done' }],
  exitCode: 0,
  artifacts: [
    { id: 'a1', name: 'output.zip', path: '/out/output.zip', size: 2048 },
  ],
}

describe('AiSandboxPreview', () => {
  it('renders command and run button when idle', () => {
    const wrapper = mount(AiSandboxPreview, {
      props: { state: idleState },
    })
    expect(wrapper.find('[data-ai-sandbox-command]').text()).toBe('node index.js')
    expect(wrapper.find('[data-ai-sandbox-run]').exists()).toBe(true)
  })

  it('shows stop button when running', () => {
    const wrapper = mount(AiSandboxPreview, {
      props: { state: runningState },
    })
    expect(wrapper.find('[data-ai-sandbox-stop]').exists()).toBe(true)
    expect(wrapper.find('[data-ai-sandbox-run]').exists()).toBe(false)
  })

  it('renders output lines with stream type', () => {
    const wrapper = mount(AiSandboxPreview, {
      props: { state: runningState },
    })
    const lines = wrapper.findAll('[data-ai-sandbox-line]')
    expect(lines).toHaveLength(2)
    expect(lines[0].attributes('data-stream')).toBe('stdout')
    expect(lines[1].attributes('data-stream')).toBe('stderr')
  })

  it('shows exit code on completion', () => {
    const wrapper = mount(AiSandboxPreview, {
      props: { state: completedState },
    })
    expect(wrapper.find('[data-ai-sandbox-exit]').text()).toContain('0')
  })

  it('renders artifacts', () => {
    const wrapper = mount(AiSandboxPreview, {
      props: { state: completedState },
    })
    expect(wrapper.find('[data-ai-sandbox-artifact-name]').text()).toBe('output.zip')
  })

  it('emits run when run button clicked', async () => {
    const wrapper = mount(AiSandboxPreview, {
      props: { state: idleState },
    })
    await wrapper.find('[data-ai-sandbox-run]').trigger('click')
    expect(wrapper.emitted('run')).toBeTruthy()
  })

  it('shows error state', () => {
    const errorState: AiSandboxState = {
      status: 'error',
      lines: [],
      error: 'Process crashed',
    }
    const wrapper = mount(AiSandboxPreview, {
      props: { state: errorState },
    })
    expect(wrapper.find('[data-ai-sandbox-error]').text()).toBe('Process crashed')
  })
})
