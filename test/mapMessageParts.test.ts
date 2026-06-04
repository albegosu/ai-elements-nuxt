import { describe, it, expect } from 'vitest'
import { mapMessageParts, toAiMessageProps } from '../src/runtime/utils/mapMessageParts'

describe('mapMessageParts', () => {
  it('maps text parts', () => {
    const result = mapMessageParts({
      role: 'assistant',
      parts: [{ type: 'text', text: 'Hello world' }],
    })
    expect(result.content).toBe('Hello world')
  })

  it('maps reasoning parts', () => {
    const result = mapMessageParts({
      role: 'assistant',
      parts: [{ type: 'reasoning', text: 'Thinking...' }],
    })
    expect(result.reasoning).toBe('Thinking...')
  })

  it('maps legacy content and toolInvocations', () => {
    const result = mapMessageParts({
      role: 'assistant',
      content: 'Done',
      toolInvocations: [{
        toolCallId: 'tc1',
        toolName: 'search',
        state: 'result',
        args: { q: 'test' },
        result: { ok: true },
      }],
    })
    expect(result.content).toBe('Done')
    expect(result.toolCalls).toHaveLength(1)
    expect(result.toolCalls[0].name).toBe('search')
    expect(result.toolCalls[0].status).toBe('output-available')
  })

  it('maps approval-requested tool state and approvalId', () => {
    const result = mapMessageParts({
      role: 'assistant',
      parts: [{
        type: 'tool-deleteFile',
        toolCallId: 'tc-approval',
        state: 'approval-requested',
        input: { path: '/tmp/x' },
        approval: { id: 'approval-1' },
      }],
    })
    expect(result.toolCalls[0].status).toBe('approval-requested')
    expect(result.toolCalls[0].approvalId).toBe('approval-1')
    expect(result.isStreaming).toBe(true)
  })

  it('converts to AiMessageProps with streaming status', () => {
    const props = toAiMessageProps(
      { role: 'assistant', parts: [{ type: 'text', text: 'Hi', state: 'streaming' }] },
      'streaming',
    )
    expect(props.role).toBe('assistant')
    expect(props.content).toBe('Hi')
    expect(props.status).toBe('streaming')
  })

  it('maps dynamic-tool parts', () => {
    const result = mapMessageParts({
      role: 'assistant',
      parts: [{
        type: 'tool-search',
        toolCallId: 'tc1',
        state: 'output-available',
        input: { q: 'test' },
        output: { hits: 3 },
      }],
    })
    expect(result.toolCalls).toHaveLength(1)
    expect(result.toolCalls[0].name).toBe('search')
    expect(result.toolCalls[0].status).toBe('output-available')
  })

  it('maps source-url parts', () => {
    const result = mapMessageParts({
      role: 'assistant',
      parts: [{ type: 'source-url', url: 'https://example.com', title: 'Example' }],
    })
    expect(result.sources).toHaveLength(1)
    expect(result.sources[0].url).toBe('https://example.com')
    expect(result.sources[0].title).toBe('Example')
  })

  it('maps file parts', () => {
    const result = mapMessageParts({
      role: 'assistant',
      parts: [{ type: 'file', filename: 'doc.pdf', url: 'https://cdn/doc.pdf', mimeType: 'application/pdf' }],
    })
    expect(result.attachments).toHaveLength(1)
    expect(result.attachments[0].name).toBe('doc.pdf')
  })

  it('maps data role to system in toAiMessageProps', () => {
    const props = toAiMessageProps({ role: 'data', content: 'system note' })
    expect(props.role).toBe('system')
  })

  it('prefers parts over legacy fields when both present', () => {
    const result = mapMessageParts({
      role: 'assistant',
      content: 'legacy',
      parts: [{ type: 'text', text: 'from parts' }],
      toolInvocations: [{
        toolCallId: 'legacy',
        toolName: 'legacyTool',
        state: 'result',
      }],
    })
    expect(result.content).toBe('from parts')
    expect(result.toolCalls[0].name).toBe('legacyTool')
  })
})
