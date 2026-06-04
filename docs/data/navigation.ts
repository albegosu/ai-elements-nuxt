export type ComponentCategory = 'chatbot' | 'code' | 'voice' | 'workflow' | 'utilities'

export interface NavComponent {
  slug: string
  name: string
  component: string
  description: string
}

export interface NavCategory {
  id: ComponentCategory
  label: string
  description: string
  components: NavComponent[]
}

export const categories: NavCategory[] = [
  {
    id: 'chatbot',
    label: 'Chatbot',
    description: 'Messages, input, tools, reasoning, and conversation UI.',
    components: [
      { slug: 'attachments', name: 'Attachments', component: 'AiAttachments', description: 'Display file and document attachments in grid, inline, or list layouts.' },
      { slug: 'chain-of-thought', name: 'Chain of Thought', component: 'AiChainOfThought', description: 'Discrete labeled steps for agent reasoning flows.' },
      { slug: 'checkpoint', name: 'Checkpoint', component: 'AiCheckpoint', description: 'Pipeline checkpoint status indicators.' },
      { slug: 'confirmation', name: 'Confirmation', component: 'AiConfirmation', description: 'Destructive or sensitive action confirmation dialogs.' },
      { slug: 'context', name: 'Context', component: 'AiContext', description: 'Context window items with token counts.' },
      { slug: 'conversation', name: 'Conversation', component: 'AiConversation', description: 'Thread list with active state and archive support.' },
      { slug: 'error-boundary', name: 'Error Boundary', component: 'AiErrorBoundary', description: 'Error display with optional retry.' },
      { slug: 'inline-citation', name: 'Inline Citation', component: 'AiInlineCitation', description: 'Inline citation badges linked to sources.' },
      { slug: 'message', name: 'Message', component: 'AiMessage', description: 'Headless message container with slots for content, reasoning, tools, and sources.' },
      { slug: 'model-selector', name: 'Model Selector', component: 'AiModelSelector', description: 'Model picker grouped by provider.' },
      { slug: 'plan', name: 'Plan', component: 'AiPlan', description: 'Nested step plan with status indicators.' },
      { slug: 'prompt-input', name: 'Prompt Input', component: 'AiPromptInput', description: 'Textarea input with submit, stop, and slot customization.' },
      { slug: 'queue', name: 'Queue', component: 'AiQueue', description: 'Queued message list with processing status.' },
      { slug: 'reasoning', name: 'Reasoning', component: 'AiReasoning', description: 'Collapsible reasoning / thinking block.' },
      { slug: 'shimmer', name: 'Shimmer', component: 'AiShimmer', description: 'Loading placeholder skeleton lines.' },
      { slug: 'sources', name: 'Sources', component: 'AiSources', description: 'Source citation list for assistant messages.' },
      { slug: 'streaming-cursor', name: 'Streaming Cursor', component: 'AiStreamingCursor', description: 'Blinking cursor for streaming text.' },
      { slug: 'suggestion', name: 'Suggestion', component: 'AiSuggestion', description: 'Follow-up suggestion chips.' },
      { slug: 'task', name: 'Task', component: 'AiTask', description: 'Task progress with optional subtasks.' },
      { slug: 'tool', name: 'Tool', component: 'AiTool', description: 'Tool invocation display with lifecycle states.' },
      { slug: 'tool-approval', name: 'Tool Approval', component: 'AiToolApproval', description: 'Human-in-the-loop tool approval UI.' },
    ],
  },
  {
    id: 'code',
    label: 'Code',
    description: 'Code blocks, terminals, agents, artifacts, and dev tooling UI.',
    components: [
      { slug: 'agent', name: 'Agent', component: 'AiAgent', description: 'Agent thought/action/observation step timeline.' },
      { slug: 'artifact', name: 'Artifact', component: 'AiArtifact', description: 'Tabbed artifact viewer for code, docs, and HTML.' },
      { slug: 'code-block', name: 'Code Block', component: 'AiCodeBlock', description: 'Syntax-highlighted code with copy and line numbers.' },
      { slug: 'commit', name: 'Commit', component: 'AiCommit', description: 'Git commit summary with file changes.' },
      { slug: 'env-vars', name: 'Env Vars', component: 'AiEnvVars', description: 'Environment variables with reveal toggle.' },
      { slug: 'file-tree', name: 'File Tree', component: 'AiFileTree', description: 'Expandable file tree navigation.' },
      { slug: 'package-info', name: 'Package Info', component: 'AiPackageInfo', description: 'npm package metadata display.' },
      { slug: 'sandbox', name: 'Sandbox', component: 'AiSandbox', description: 'Runnable code sandbox preview.' },
      { slug: 'schema-display', name: 'Schema Display', component: 'AiSchemaDisplay', description: 'JSON schema field tree.' },
      { slug: 'snippet', name: 'Snippet', component: 'AiSnippet', description: 'Compact copyable code snippet.' },
      { slug: 'stack-trace', name: 'Stack Trace', component: 'AiStackTrace', description: 'Error stack trace with frame list.' },
      { slug: 'terminal', name: 'Terminal', component: 'AiTerminal', description: 'Terminal output with command lines.' },
      { slug: 'test-results', name: 'Test Results', component: 'AiTestResults', description: 'Test run results and summary.' },
      { slug: 'vue-preview', name: 'Vue Preview', component: 'AiVuePreview', description: 'Vue component live preview.' },
      { slug: 'web-preview', name: 'Web Preview', component: 'AiWebPreview', description: 'iframe or HTML web preview.' },
    ],
  },
  {
    id: 'voice',
    label: 'Voice',
    description: 'Audio playback, speech input, transcription, and voice selection.',
    components: [
      { slug: 'audio-player', name: 'Audio Player', component: 'AiAudioPlayer', description: 'Audio playback controls.' },
      { slug: 'mic-selector', name: 'Mic Selector', component: 'AiMicSelector', description: 'Microphone device picker.' },
      { slug: 'persona', name: 'Persona', component: 'AiPersona', description: 'Voice persona card with avatar.' },
      { slug: 'speech-input', name: 'Speech Input', component: 'AiSpeechInput', description: 'Speech-to-text input control.' },
      { slug: 'transcription', name: 'Transcription', component: 'AiTranscription', description: 'Timestamped transcript segments.' },
      { slug: 'voice-selector', name: 'Voice Selector', component: 'AiVoiceSelector', description: 'TTS voice selection list.' },
    ],
  },
  {
    id: 'workflow',
    label: 'Workflow',
    description: 'Canvas-based workflow diagrams with nodes and edges.',
    components: [
      { slug: 'canvas', name: 'Canvas', component: 'AiCanvas', description: 'Pannable, zoomable workflow canvas.' },
      { slug: 'connection', name: 'Connection', component: 'AiConnection', description: 'SVG connection path between points.' },
      { slug: 'controls', name: 'Controls', component: 'AiControls', description: 'Zoom and pan controls overlay.' },
      { slug: 'edge', name: 'Edge', component: 'AiEdge', description: 'Workflow edge with label and animation.' },
      { slug: 'node', name: 'Node', component: 'AiNode', description: 'Workflow node with status.' },
      { slug: 'panel', name: 'Panel', component: 'AiPanel', description: 'Side panel for workflow details.' },
      { slug: 'toolbar', name: 'Toolbar', component: 'AiToolbar', description: 'Workflow toolbar actions.' },
    ],
  },
  {
    id: 'utilities',
    label: 'Utilities',
    description: 'Markdown rendering, images, and chat integrations.',
    components: [
      { slug: 'image', name: 'Image', component: 'AiImage', description: 'Image with optional lightbox zoom.' },
      { slug: 'markdown', name: 'Markdown', component: 'AiMarkdown', description: 'Sanitized markdown to HTML renderer.' },
      { slug: 'open-in-chat', name: 'Open In Chat', component: 'AiOpenInChat', description: 'Action to open content in chat.' },
    ],
  },
]

export const allComponents = categories.flatMap(c =>
  c.components.map(comp => ({ ...comp, category: c.id, categoryLabel: c.label })),
)

export function findComponent(category: string, slug: string) {
  return allComponents.find(c => c.category === category && c.slug === slug)
}
