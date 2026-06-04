import type { PropRow } from '~/components/PropsTable.vue'
import type { ComponentCategory } from '~/data/navigation'

export interface ComponentMetaEvent {
  name: string
  payload?: string
}

export interface ComponentMeta {
  props: PropRow[]
  code: string
  slots?: string[]
  events?: ComponentMetaEvent[]
}

type MetaKey = `${ComponentCategory}/${string}`

const meta: Record<string, ComponentMeta> = {
  'chatbot/message': {
    props: [
      { name: 'role', type: "'user' | 'assistant' | 'system' | 'tool'", required: true, description: 'Message role' },
      { name: 'content', type: 'string', description: 'Plain text content' },
      { name: 'htmlContent', type: 'string', description: 'Sanitized HTML content' },
      { name: 'status', type: "'pending' | 'streaming' | 'complete' | 'error'", default: "'complete'", description: 'Message status' },
      { name: 'reasoning', type: 'string', description: 'Reasoning text for slot' },
      { name: 'sources', type: 'AiSource[]', description: 'Citation sources' },
      { name: 'toolCalls', type: 'AiToolCall[]', description: 'Tool invocations' },
      { name: 'attachments', type: 'AiAttachment[]', description: 'File attachments' },
    ],
    slots: ['avatar', 'reasoning', 'tool-calls', 'attachments', 'content', 'sources', 'metadata', 'actions'],
    code: `<AiMessage role="assistant" content="Hello!" status="complete">
  <template #content="{ content }">
    <p class="text-sm">{{ content }}</p>
  </template>
</AiMessage>`,
  },
  'chatbot/prompt-input': {
    props: [
      { name: 'modelValue', type: 'string', default: "''", description: 'Input value (v-model)' },
      { name: 'placeholder', type: 'string', default: "'Type a message...'", description: 'Placeholder text' },
      { name: 'disabled', type: 'boolean', default: 'false' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Shows stop button when true' },
      { name: 'rows', type: 'number', default: '1' },
      { name: 'autoResize', type: 'boolean', default: 'true' },
    ],
    slots: ['prefix', 'attachments-area', 'input', 'actions', 'send-icon', 'stop-icon', 'suffix'],
    code: `<AiPromptInput v-model="input" @submit="send">
  <template #actions="{ submit, canSubmit }">
    <button :disabled="!canSubmit" @click="submit">Send</button>
  </template>
</AiPromptInput>`,
  },
  'chatbot/conversation': {
    props: [
      { name: 'threads', type: 'AiConversationThread[]', required: true },
      { name: 'activeId', type: 'string', description: 'Active thread id' },
      { name: 'showArchived', type: 'boolean', default: 'false' },
    ],
    slots: ['header', 'thread', 'empty', 'footer'],
    code: `<AiConversation :threads="threads" :active-id="activeId" @select="onSelect" />`,
  },
  'chatbot/reasoning': {
    props: [
      { name: 'content', type: 'string' },
      { name: 'collapsed', type: 'boolean', default: 'true' },
      { name: 'streaming', type: 'boolean', default: 'false' },
    ],
    slots: ['trigger', 'content'],
    code: `<AiReasoning content="Thinking..." :streaming="true" />`,
  },
  'chatbot/shimmer': {
    props: [
      { name: 'active', type: 'boolean', default: 'true' },
      { name: 'lines', type: 'number', default: '3' },
    ],
    code: `<AiShimmer :lines="3" />`,
  },
  'chatbot/sources': {
    props: [{ name: 'sources', type: 'AiSource[]', required: true }],
    slots: ['source', 'default'],
    code: `<AiSources :sources="sources" />`,
  },
  'chatbot/tool': {
    props: [{ name: 'toolCall', type: 'AiToolCall', required: true }],
    slots: ['header', 'args', 'result', 'status'],
    code: `<AiTool :tool-call="toolCall" />`,
  },
  'chatbot/suggestion': {
    props: [{ name: 'suggestions', type: 'AiSuggestion[]', required: true }],
    slots: ['suggestion', 'default'],
    code: `<AiSuggestion :suggestions="suggestions" @select="onSelect" />`,
  },
  'chatbot/plan': {
    props: [
      { name: 'steps', type: 'AiPlanStep[]', required: true },
      { name: 'title', type: 'string' },
    ],
    slots: ['step', 'header'],
    code: `<AiPlan :steps="planSteps" title="Agent plan" />`,
  },
  'chatbot/task': {
    props: [{ name: 'task', type: 'AiTaskData', required: true }],
    slots: ['header', 'progress', 'subtask', 'default'],
    code: `<AiTask :task="task" />`,
  },
  'chatbot/checkpoint': {
    props: [{ name: 'checkpoint', type: 'AiCheckpointData', required: true }],
    slots: ['default', 'icon', 'title', 'description'],
    code: `<AiCheckpoint :checkpoint="checkpoint" />`,
  },
  'chatbot/confirmation': {
    props: [{ name: 'confirmation', type: 'AiConfirmationData', required: true }],
    slots: ['title', 'description', 'actions'],
    code: `<AiConfirmation :confirmation="data" @confirm="onConfirm" @deny="onDeny" />`,
  },
  'chatbot/context': {
    props: [
      { name: 'items', type: 'AiContextItem[]', required: true },
      { name: 'collapsed', type: 'boolean', default: 'true' },
    ],
    slots: ['item', 'header', 'default'],
    code: `<AiContext :items="contextItems" :collapsed="false" />`,
  },
  'chatbot/queue': {
    props: [{ name: 'items', type: 'AiQueueItem[]', required: true }],
    slots: ['item', 'default'],
    code: `<AiQueue :items="queueItems" />`,
  },
  'chatbot/model-selector': {
    props: [
      { name: 'models', type: 'AiModelOption[]', required: true },
      { name: 'modelValue', type: 'string', description: 'Selected model id (v-model)' },
      { name: 'groupByProvider', type: 'boolean', default: 'true' },
    ],
    slots: ['trigger', 'selected', 'search', 'option', 'group-header', 'empty'],
    code: `<AiModelSelector v-model="modelId" :models="models">
  <template #option="{ model, selected, select }">
    <button type="button" @click="select()">{{ model.name }}</button>
  </template>
</AiModelSelector>`,
  },
  'chatbot/inline-citation': {
    props: [
      { name: 'citation', type: 'AiCitation', required: true },
      { name: 'interactive', type: 'boolean', default: 'true' },
    ],
    slots: ['default'],
    code: `<AiInlineCitation :citation="citation" @click="onClick" />`,
  },
  'chatbot/attachments': {
    props: [
      { name: 'attachments', type: 'AiAttachment[]', required: true },
      { name: 'layout', type: "'grid' | 'inline' | 'list'", default: "'grid'" },
      { name: 'removable', type: 'boolean', default: 'false' },
    ],
    slots: ['attachment', 'preview', 'default'],
    code: `<AiAttachments :attachments="files" layout="grid" />`,
  },
  'chatbot/chain-of-thought': {
    props: [
      { name: 'steps', type: 'AiChainOfThoughtStep[]', required: true },
      { name: 'title', type: 'string' },
    ],
    slots: ['step', 'header'],
    code: `<AiChainOfThought :steps="steps" title="Reasoning" />`,
  },
  'chatbot/streaming-cursor': {
    props: [
      { name: 'active', type: 'boolean', default: 'true' },
      { name: 'character', type: 'string', default: "'|'" },
    ],
    code: `<AiStreamingCursor :active="isStreaming" />`,
  },
  'chatbot/tool-approval': {
    props: [
      { name: 'toolCall', type: 'AiToolCall', required: true },
      { name: 'editable', type: 'boolean', default: 'false' },
    ],
    slots: ['header', 'args', 'actions'],
    code: `<AiToolApproval :tool-call="toolCall" @approve="onApprove" @deny="onDeny" />`,
  },
  'chatbot/error-boundary': {
    props: [
      { name: 'error', type: 'Error | string | null' },
      { name: 'retryable', type: 'boolean', default: 'true' },
    ],
    slots: ['default', 'actions'],
    code: `<AiErrorBoundary :error="error" @retry="retry" />`,
  },
  'code/code-block': {
    props: [
      { name: 'code', type: 'string', required: true },
      { name: 'language', type: 'string', default: "'text'" },
      { name: 'filename', type: 'string' },
      { name: 'showLineNumbers', type: 'boolean', default: 'true' },
    ],
    slots: ['header', 'code', 'actions'],
    code: `<AiCodeBlock :code="source" language="typescript" filename="index.ts" />`,
  },
  'code/terminal': {
    props: [
      { name: 'lines', type: 'AiTerminalLine[]', required: true },
      { name: 'title', type: 'string', default: "'Terminal'" },
    ],
    slots: ['line', 'header'],
    code: `<AiTerminal :lines="terminalLines" title="bash" />`,
  },
  'code/agent': {
    props: [
      { name: 'steps', type: 'AiAgentStep[]', required: true },
      { name: 'title', type: 'string' },
    ],
    slots: ['step', 'header'],
    code: `<AiAgent :steps="agentSteps" title="Agent run" />`,
  },
  'code/artifact': {
    props: [{ name: 'artifacts', type: 'AiArtifactData[]', required: true }],
    slots: ['tab', 'content', 'header'],
    code: `<AiArtifact :artifacts="artifacts" />`,
  },
  'code/file-tree': {
    props: [
      { name: 'nodes', type: 'AiFileNode[]', required: true },
      { name: 'depth', type: 'number' },
    ],
    slots: ['node', 'icon'],
    code: `<AiFileTree :nodes="tree" @select="onSelect" />`,
  },
  'code/stack-trace': {
    props: [
      { name: 'error', type: 'string', required: true },
      { name: 'frames', type: 'AiStackFrame[]', required: true },
      { name: 'collapsed', type: 'boolean', default: 'false' },
    ],
    slots: ['frame', 'header'],
    code: `<AiStackTrace error="TypeError" :frames="frames" />`,
  },
  'code/snippet': {
    props: [
      { name: 'code', type: 'string', required: true },
      { name: 'language', type: 'string', default: "'text'" },
      { name: 'label', type: 'string' },
    ],
    slots: ['label', 'code', 'copy'],
    code: `<AiSnippet :code="cmd" language="bash" label="install" />`,
  },
  'code/commit': {
    props: [
      { name: 'commit', type: 'AiCommitData', required: true },
      { name: 'expanded', type: 'boolean', default: 'false' },
    ],
    slots: ['header', 'file'],
    code: `<AiCommit :commit="commit" />`,
  },
  'code/env-vars': {
    props: [{ name: 'variables', type: 'AiEnvVar[]', required: true }],
    slots: ['var', 'default'],
    code: `<AiEnvVars :variables="envVars" />`,
  },
  'code/package-info': {
    props: [{ name: 'package', type: 'AiPackageData', required: true }],
    slots: ['header', 'dependency', 'default'],
    code: `<AiPackageInfo :package="pkg" />`,
  },
  'code/schema-display': {
    props: [
      { name: 'fields', type: 'AiSchemaField[]', required: true },
      { name: 'title', type: 'string' },
    ],
    slots: ['field'],
    code: `<AiSchemaDisplay :fields="schema" title="Request body" />`,
  },
  'code/test-results': {
    props: [
      { name: 'tests', type: 'AiTestResult[]', required: true },
      { name: 'summary', type: 'AiTestSummary' },
    ],
    slots: ['test', 'summary'],
    code: `<AiTestResults :tests="results" />`,
  },
  'code/sandbox': {
    props: [
      { name: 'code', type: 'string', required: true },
      { name: 'language', type: 'string', default: "'html'" },
      { name: 'autoRun', type: 'boolean', default: 'false' },
    ],
    slots: ['preview', 'code', 'toolbar'],
    code: `<AiSandbox :code="html" language="html" :auto-run="true" />`,
  },
  'code/vue-preview': {
    props: [
      { name: 'code', type: 'string' },
      { name: 'html', type: 'string' },
      { name: 'title', type: 'string' },
    ],
    slots: ['header', 'preview'],
    code: `<AiVuePreview :html="rendered" title="Preview" />`,
  },
  'code/web-preview': {
    props: [
      { name: 'url', type: 'string' },
      { name: 'html', type: 'string' },
      { name: 'title', type: 'string' },
    ],
    slots: ['toolbar', 'frame'],
    code: `<AiWebPreview url="https://example.com" title="Preview" />`,
  },
  'voice/audio-player': {
    props: [
      { name: 'src', type: 'string', required: true },
      { name: 'title', type: 'string' },
      { name: 'autoplay', type: 'boolean', default: 'false' },
    ],
    slots: ['default', 'play-button', 'progress', 'time'],
    code: `<AiAudioPlayer src="/audio.mp3" title="Response" />`,
  },
  'voice/speech-input': {
    props: [
      { name: 'language', type: 'string', default: "'en-US'" },
      { name: 'continuous', type: 'boolean', default: 'false' },
    ],
    slots: ['button', 'transcript'],
    code: `<AiSpeechInput @result="onTranscript" />`,
  },
  'voice/transcription': {
    props: [
      { name: 'segments', type: 'TranscriptSegment[]', required: true },
      { name: 'currentTime', type: 'number' },
    ],
    slots: ['default', 'segment', 'timestamp', 'speaker', 'text'],
    code: `<AiTranscription :segments="segments" :current-time="time" />`,
  },
  'voice/voice-selector': {
    props: [
      { name: 'voices', type: 'VoiceOption[]', required: true },
      { name: 'modelValue', type: 'string' },
    ],
    slots: ['default', 'voice', 'voice-name', 'voice-meta', 'voice-preview'],
    code: `<AiVoiceSelector v-model="voice" :voices="voices" />`,
  },
  'voice/mic-selector': {
    props: [{ name: 'modelValue', type: 'string' }],
    slots: ['default', 'error', 'loading'],
    code: `<AiMicSelector v-model="deviceId" />`,
  },
  'voice/persona': {
    props: [
      { name: 'name', type: 'string', required: true },
      { name: 'avatar', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'voice', type: 'string' },
      { name: 'active', type: 'boolean' },
    ],
    slots: ['default', 'avatar', 'name', 'description', 'voice-label'],
    code: `<AiPersona name="Assistant" description="Helpful agent" :active="true" />`,
  },
  'workflow/canvas': {
    props: [
      { name: 'width', type: 'string', default: "'100%'" },
      { name: 'height', type: 'string', default: "'500px'" },
      { name: 'zoom', type: 'number', default: '1' },
      { name: 'panX', type: 'number', default: '0' },
      { name: 'panY', type: 'number', default: '0' },
      { name: 'minZoom', type: 'number', default: '0.1' },
      { name: 'maxZoom', type: 'number', default: '3' },
      { name: 'gridSize', type: 'number', default: '20' },
      { name: 'showGrid', type: 'boolean', default: 'true' },
      { name: 'snapToGrid', type: 'boolean', default: 'false' },
    ],
    slots: ['default', 'background', 'minimap'],
    events: [
      { name: 'zoom', payload: 'number' },
      { name: 'pan', payload: 'x: number, y: number' },
      { name: 'click', payload: 'x: number, y: number' },
      { name: 'select', payload: 'ids: string[]' },
    ],
    code: `<AiCanvas height="400px" :zoom="zoom" @zoom="zoom = $event">
  <AiNode id="n1" label="Retrieve" :x="80" :y="80" />
</AiCanvas>`,
  },
  'workflow/node': {
    props: [
      { name: 'id', type: 'string', required: true },
      { name: 'label', type: 'string', required: true },
      { name: 'x', type: 'number', required: true },
      { name: 'y', type: 'number', required: true },
      { name: 'type', type: 'string', default: "'default'" },
      { name: 'status', type: "'idle' | 'running' | 'completed' | 'error'", default: "'idle'" },
      { name: 'selected', type: 'boolean', default: 'false' },
      { name: 'draggable', type: 'boolean', default: 'true' },
      { name: 'inputs', type: 'string[]' },
      { name: 'outputs', type: 'string[]' },
      { name: 'zoom', type: 'number', description: 'Canvas zoom for drag coordinate conversion' },
      { name: 'panX', type: 'number' },
      { name: 'panY', type: 'number' },
    ],
    slots: ['default', 'header', 'ports', 'input-port', 'output-port'],
    events: [
      { name: 'select', payload: 'id: string' },
      { name: 'move', payload: 'id: string, x: number, y: number' },
      { name: 'connect-start', payload: 'nodeId, port, type' },
    ],
    code: `<AiNode id="retrieve" label="Retrieve" :x="100" :y="100" status="running" :outputs="['out']" />`,
  },
  'workflow/edge': {
    props: [
      { name: 'id', type: 'string', required: true },
      { name: 'sourceX', type: 'number', required: true },
      { name: 'sourceY', type: 'number', required: true },
      { name: 'targetX', type: 'number', required: true },
      { name: 'targetY', type: 'number', required: true },
      { name: 'label', type: 'string' },
      { name: 'animated', type: 'boolean', default: 'false' },
      { name: 'selected', type: 'boolean', default: 'false' },
      { name: 'type', type: "'bezier' | 'straight' | 'step'", default: "'bezier'" },
    ],
    slots: ['default', 'label'],
    events: [
      { name: 'select', payload: 'id: string' },
      { name: 'remove', payload: 'id: string' },
    ],
    code: `<AiEdge id="e1" :source-x="100" :source-y="50" :target-x="200" :target-y="150" animated>
  <template #label="{ label, position }">{{ label }}</template>
</AiEdge>`,
  },
  'workflow/connection': {
    props: [
      { name: 'sourceX', type: 'number', required: true },
      { name: 'sourceY', type: 'number', required: true },
      { name: 'targetX', type: 'number', required: true },
      { name: 'targetY', type: 'number', required: true },
      { name: 'active', type: 'boolean', default: 'false' },
      { name: 'validTarget', type: 'boolean', default: 'true' },
    ],
    slots: ['default'],
    code: `<AiConnection :source-x="0" :source-y="0" :target-x="120" :target-y="80" :active="connecting" :valid-target="valid" />`,
  },
  'workflow/controls': {
    props: [
      { name: 'zoom', type: 'number' },
      { name: 'position', type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'", default: "'bottom-left'" },
    ],
    slots: ['default', 'zoom-in', 'zoom-display', 'zoom-out', 'reset', 'fit-view'],
    events: [
      { name: 'zoom-in' },
      { name: 'zoom-out' },
      { name: 'reset' },
      { name: 'fit-view' },
    ],
    code: `<AiControls :zoom="zoom" @zoom-in="zoomIn" @zoom-out="zoomOut" @reset="resetView" @fit-view="fitView" />`,
  },
  'workflow/panel': {
    props: [
      { name: 'title', type: 'string' },
      { name: 'position', type: "'left' | 'right'", default: "'right'" },
      { name: 'collapsible', type: 'boolean' },
    ],
    slots: ['default', 'header'],
    code: `<AiPanel title="Details" position="right">...</AiPanel>`,
  },
  'workflow/toolbar': {
    props: [
      { name: 'position', type: "'top' | 'bottom'", default: "'top'" },
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
    ],
    slots: ['default', 'actions'],
    events: [{ name: 'action', payload: 'action: string' }],
    code: `<AiToolbar @action="onToolbarAction">
  <template #actions="{ emitAction }">
    <button type="button" @click="emitAction('add-node')">Add node</button>
  </template>
</AiToolbar>`,
  },
  'utilities/markdown': {
    props: [
      { name: 'content', type: 'string', default: "''" },
      { name: 'parser', type: "'marked' | 'simple'", description: 'Use simpleParse for lightweight regex parsing' },
    ],
    slots: ['default'],
    code: `<AiMarkdown content="# Hello\\n\\nGFM **bold**, tables, and task lists." />`,
  },
  'utilities/image': {
    props: [
      { name: 'src', type: 'string', required: true },
      { name: 'alt', type: 'string' },
      { name: 'zoomable', type: 'boolean' },
    ],
    slots: ['caption'],
    code: `<AiImage src="/diagram.png" alt="Architecture" :zoomable="true" />`,
  },
  'utilities/open-in-chat': {
    props: [
      { name: 'content', type: 'string', required: true },
      { name: 'label', type: 'string' },
    ],
    slots: ['default'],
    code: `<AiOpenInChat content="Explain this code" @open="openChat" />`,
  },
}

const defaultMeta: ComponentMeta = {
  props: [],
  code: '<!-- See component source and types in ai-elements-nuxt -->',
  slots: ['default'],
}

export function getComponentMeta(category: string, slug: string): ComponentMeta {
  return meta[`${category}/${slug}`] ?? defaultMeta
}
