<script setup lang="ts">
import type { AiFileNode } from '../../src/runtime/types'

const codeExample = `import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

const result = await streamText({
  model: anthropic('claude-sonnet-4-6'),
  prompt: 'What is RAG?',
})

for await (const chunk of result.textStream) {
  process.stdout.write(chunk)
}`

const terminalLines = [
  { type: 'command' as const, content: 'pnpm add ai @ai-sdk/anthropic' },
  { type: 'output' as const, content: 'Packages: +42' },
  { type: 'output' as const, content: '++++++++++++++++++++++++++++++++++++++++++++' },
  { type: 'output' as const, content: 'Progress: resolved 842, reused 800, downloaded 42, added 42, done' },
  { type: 'command' as const, content: 'node index.ts' },
  { type: 'output' as const, content: 'RAG (Retrieval-Augmented Generation) is a technique...' },
  { type: 'info' as const, content: 'Done in 1.2s', prefix: 'ℹ' },
]

const stackFrames = [
  { file: 'src/server/api/chat.post.ts', line: 42, column: 12, function: 'streamChat', isApp: true },
  { file: 'src/server/utils/agent.service.ts', line: 87, function: 'agentStreamText', isApp: true },
  { file: 'node_modules/ai/dist/index.mjs', line: 1234, function: 'streamText' },
  { file: 'node_modules/@ai-sdk/anthropic/dist/index.mjs', line: 567, function: 'doStream' },
]

const fileTree = reactive<AiFileNode[]>([
  {
    name: 'src', type: 'directory', path: 'src', expanded: true, children: [
      {
        name: 'components', type: 'directory', path: 'src/components', expanded: true, children: [
          { name: 'ChatMessage.vue', type: 'file', path: 'src/components/ChatMessage.vue' },
          { name: 'ChatInput.vue', type: 'file', path: 'src/components/ChatInput.vue' },
          { name: 'ChatSources.vue', type: 'file', path: 'src/components/ChatSources.vue' },
        ],
      },
      {
        name: 'composables', type: 'directory', path: 'src/composables', children: [
          { name: 'useAiChat.ts', type: 'file', path: 'src/composables/useAiChat.ts' },
        ],
      },
      { name: 'app.vue', type: 'file', path: 'src/app.vue', selected: true },
    ],
  },
  { name: 'package.json', type: 'file', path: 'package.json' },
  { name: 'nuxt.config.ts', type: 'file', path: 'nuxt.config.ts' },
])

const agentSteps = [
  { id: '1', type: 'thought' as const, content: 'The user wants to know about RAG. I should search the knowledge base first.', status: 'completed' as const },
  { id: '2', type: 'action' as const, content: 'Searching for "RAG definition retrieval augmented generation"', tool: 'searchKnowledgeBase', status: 'completed' as const },
  { id: '3', type: 'observation' as const, content: 'Found 3 relevant documents with scores > 0.8', status: 'completed' as const },
  { id: '4', type: 'action' as const, content: 'Reranking results using cross-encoder', tool: 'rerank', status: 'running' as const },
  { id: '5', type: 'result' as const, content: 'Generating final response...', status: 'pending' as const },
]

const artifacts = [
  { id: 'a1', title: 'index.ts', type: 'code' as const, content: codeExample, language: 'typescript' },
  { id: 'a2', title: 'README.md', type: 'document' as const, content: '# My RAG App\n\nA simple RAG application built with the Vercel AI SDK.' },
  { id: 'a3', title: 'Preview', type: 'html' as const, content: '<div style="padding: 20px; font-family: sans-serif;"><h2>RAG App</h2><p>Everything is working!</p></div>' },
]

const commit = {
  hash: 'a9fefb521d3e4f7b',
  message: 'feat(chat): add reasoning/CoT display component',
  author: 'alberto',
  date: new Date().toISOString(),
  files: [
    { path: 'src/components/chatbot/Reasoning.vue', status: 'added' as const, additions: 65, deletions: 0 },
    { path: 'src/runtime/types/index.ts', status: 'modified' as const, additions: 12, deletions: 2 },
    { path: 'playground/pages/index.vue', status: 'modified' as const, additions: 24, deletions: 5 },
  ],
}

const schemaFields = [
  { name: 'id', type: 'string', required: true, description: 'Unique identifier' },
  { name: 'content', type: 'string', required: true, description: 'Message content' },
  {
    name: 'metadata', type: 'object', description: 'Additional metadata', children: [
      { name: 'model', type: 'string', description: 'LLM model used' },
      { name: 'tokens', type: 'number', description: 'Token count' },
      { name: 'sources', type: 'array', description: 'Retrieved sources' },
    ],
  },
  { name: 'createdAt', type: 'Date', required: true },
]

const packageData = {
  name: 'ai-elements-nuxt',
  version: '0.1.0',
  description: 'Headless AI UI components for Nuxt',
  license: 'MIT',
  homepage: 'https://github.com/albegosu/ai-elements-nuxt',
  repository: 'https://github.com/albegosu/ai-elements-nuxt',
  downloads: 1250,
  dependencies: { '@nuxt/kit': '^3.15.0', 'ai': '^6.0.0' },
}

const envVars = [
  { key: 'ANTHROPIC_API_KEY', value: 'sk-ant-api03-xxxxxxxxxxxxx', type: 'secret' as const, required: true, description: 'Anthropic API key' },
  { key: 'DATABASE_URL', value: 'postgresql://user:pass@localhost:5432/hypar', type: 'secret' as const, required: true },
  { key: 'EMBEDDING_PROVIDER', value: 'google', type: 'string' as const },
  { key: 'CHUNK_SIZE', value: '512', type: 'number' as const },
  { key: 'ENABLE_HYDE', value: 'true', type: 'boolean' as const },
]

const testResults = [
  { name: 'should parse user query', status: 'passed' as const, duration: 12, suite: 'RAG Pipeline' },
  { name: 'should search knowledge base', status: 'passed' as const, duration: 45, suite: 'RAG Pipeline' },
  { name: 'should rerank results', status: 'passed' as const, duration: 23, suite: 'RAG Pipeline' },
  { name: 'should generate response with citations', status: 'failed' as const, duration: 156, suite: 'RAG Pipeline', error: 'Expected 3 citations but received 2' },
  { name: 'should handle empty results', status: 'passed' as const, duration: 8, suite: 'Edge Cases' },
  { name: 'should timeout after 30s', status: 'skipped' as const, suite: 'Edge Cases' },
]

function handleFileSelect(node: AiFileNode) {
  fileTree.forEach(function deselect(n: AiFileNode) {
    n.selected = false
    n.children?.forEach(deselect)
  })
  node.selected = true
}
</script>

<template>
  <div style="max-width: 1200px; margin: 0 auto; padding: 24px; font-family: system-ui, sans-serif;">
    <h1 style="margin-bottom: 8px;">AI Elements Nuxt — Code Components</h1>
    <p style="color: #666; margin-bottom: 32px;">
      <a href="/" style="color: #2563eb;">← Back to Chatbot</a>
      &nbsp;·&nbsp; All 14 code components rendered headless
    </p>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <!-- CodeBlock -->
      <section style="grid-column: span 2; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px;">CodeBlock</h3>
        <AiCodeBlock :code="codeExample" language="typescript" filename="index.ts" :highlight-lines="[5, 6]">
          <template #header="{ filename: fn, language: lang, copy, copied }">
            <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: #1e1e1e; color: #ccc; border-radius: 8px 8px 0 0; font-size: 12px;">
              <span>{{ fn }} <span style="color: #666;">· {{ lang }}</span></span>
              <button @click="copy" style="background: none; border: 1px solid #444; color: #ccc; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                {{ copied ? '✓ Copied' : 'Copy' }}
              </button>
            </div>
          </template>
          <template #default="{ lines: codeLines }">
            <pre style="background: #1e1e1e; color: #d4d4d4; padding: 12px; margin: 0; border-radius: 0 0 8px 8px; font-size: 13px; overflow-x: auto;"><code><template v-for="(line, i) in codeLines" :key="i"><span style="color: #666; user-select: none; display: inline-block; width: 28px; text-align: right; margin-right: 12px;">{{ i + 1 }}</span><span :style="{ background: [5, 6].includes(i + 1) ? 'rgba(255,255,0,0.1)' : 'transparent' }">{{ line }}</span>
</template></code></pre>
          </template>
        </AiCodeBlock>
      </section>

      <!-- Terminal -->
      <section style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px;">Terminal</h3>
        <AiTerminal :lines="terminalLines" title="zsh">
          <template #header="{ title: t }">
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: #2d2d2d; border-radius: 8px 8px 0 0;">
              <span style="display: flex; gap: 4px;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: #ff5f57;" />
                <span style="width: 10px; height: 10px; border-radius: 50%; background: #febc2e;" />
                <span style="width: 10px; height: 10px; border-radius: 50%; background: #28c840;" />
              </span>
              <span style="color: #999; font-size: 12px;">{{ t }}</span>
            </div>
          </template>
          <template #line="{ line }">
            <div style="padding: 1px 12px; font-family: monospace; font-size: 13px;"
              :style="{ color: line.type === 'command' ? '#fff' : line.type === 'error' ? '#ff5f57' : line.type === 'info' ? '#28c840' : '#999' }"
            >
              <span style="color: #28c840; margin-right: 6px;">{{ line.prefix ?? (line.type === 'command' ? '$' : '') }}</span>
              {{ line.content }}
            </div>
          </template>
        </AiTerminal>
        <div style="background: #1e1e1e; height: 4px; border-radius: 0 0 8px 8px;" />
      </section>

      <!-- StackTrace -->
      <section style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px;">StackTrace</h3>
        <AiStackTrace error="Cannot read property 'chunks' of undefined" error-type="TypeError" :frames="stackFrames" :collapsed="false">
          <template #error="{ error: err, errorType: et }">
            <div style="padding: 8px 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; margin-bottom: 8px;">
              <span style="color: #dc2626; font-weight: 600;">{{ et }}: </span>
              <span style="color: #991b1b;">{{ err }}</span>
            </div>
          </template>
          <template #frame="{ frame, index }">
            <div style="padding: 4px 12px; font-family: monospace; font-size: 12px; border-left: 2px solid transparent;"
              :style="{ borderColor: frame.isApp ? '#2563eb' : 'transparent', color: frame.isApp ? '#333' : '#999' }"
            >
              <span v-if="frame.function" style="margin-right: 8px;">{{ frame.function }}</span>
              <span style="opacity: 0.7;">{{ frame.file }}:{{ frame.line }}<template v-if="frame.column">:{{ frame.column }}</template></span>
            </div>
          </template>
        </AiStackTrace>
      </section>

      <!-- FileTree -->
      <section style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px;">FileTree</h3>
        <AiFileTree :nodes="fileTree" @select="handleFileSelect">
          <template #node="{ node, depth, toggle }">
            <button
              @click="toggle"
              style="display: flex; align-items: center; gap: 6px; width: 100%; text-align: left; border: none; background: transparent; padding: 3px 8px; cursor: pointer; font-size: 13px; border-radius: 4px;"
              :style="{ paddingLeft: `${depth * 16 + 8}px`, background: node.selected ? '#e8f0fe' : 'transparent', fontWeight: node.selected ? '600' : '400' }"
            >
              <span>{{ node.type === 'directory' ? (node.expanded ? '📂' : '📁') : '📄' }}</span>
              <span>{{ node.name }}</span>
            </button>
          </template>
        </AiFileTree>
      </section>

      <!-- Agent -->
      <section style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px;">Agent</h3>
        <AiAgent :steps="agentSteps" title="RAG Agent">
          <template #step="{ step, isLast }">
            <div style="display: flex; gap: 12px; padding: 8px 0; border-left: 2px solid;"
              :style="{ borderColor: step.status === 'completed' ? '#16a34a' : step.status === 'running' ? '#2563eb' : '#e5e7eb' }"
            >
              <div style="width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; margin-left: -13px;"
                :style="{ background: step.status === 'completed' ? '#16a34a' : step.status === 'running' ? '#2563eb' : '#e5e7eb', color: step.status === 'pending' ? '#666' : 'white' }"
              >
                {{ step.type === 'thought' ? '💭' : step.type === 'action' ? '⚡' : step.type === 'observation' ? '👁' : '✨' }}
              </div>
              <div style="flex: 1;">
                <div style="font-size: 11px; text-transform: uppercase; color: #999; margin-bottom: 2px;">
                  {{ step.type }}<template v-if="step.tool"> · {{ step.tool }}</template>
                </div>
                <div style="font-size: 13px;">{{ step.content }}</div>
              </div>
            </div>
          </template>
        </AiAgent>
      </section>

      <!-- Artifact -->
      <section style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px;">Artifact</h3>
        <AiArtifact :artifacts="artifacts">
          <template #tab="{ artifact, active }">
            <span :style="{ fontWeight: active ? '600' : '400', borderBottom: active ? '2px solid #2563eb' : 'none', padding: '4px 12px' }">
              {{ artifact.title }}
            </span>
          </template>
          <template #content="{ artifact }">
            <div v-if="artifact" style="padding: 12px; background: #f9fafb; border-radius: 0 0 8px 8px; font-size: 13px;">
              <pre v-if="artifact.type === 'code'" style="margin: 0; font-family: monospace; white-space: pre-wrap;">{{ artifact.content }}</pre>
              <div v-else-if="artifact.type === 'html'" v-html="artifact.content" />
              <div v-else style="white-space: pre-wrap;">{{ artifact.content }}</div>
            </div>
          </template>
        </AiArtifact>
      </section>

      <!-- Commit -->
      <section style="grid-column: span 2; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px;">Commit</h3>
        <AiCommit :commit="commit" :expanded="true">
          <template #header="{ commit: c, totalAdditions, totalDeletions }">
            <div style="display: flex; align-items: center; gap: 12px; padding: 8px 0; cursor: pointer;">
              <code style="background: #f3f4f6; padding: 2px 8px; border-radius: 4px; font-size: 12px;">{{ c.hash.slice(0, 7) }}</code>
              <span style="flex: 1; font-weight: 500;">{{ c.message }}</span>
              <span style="font-size: 12px; color: #999;">{{ c.author }}</span>
              <span style="font-size: 12px;">
                <span style="color: #16a34a;">+{{ totalAdditions }}</span>
                <span style="color: #dc2626; margin-left: 4px;">-{{ totalDeletions }}</span>
              </span>
            </div>
          </template>
          <template #file="{ file }">
            <div style="display: flex; align-items: center; gap: 8px; padding: 4px 0; font-size: 13px; font-family: monospace;">
              <span style="width: 16px; text-align: center; font-weight: 600;"
                :style="{ color: file.status === 'added' ? '#16a34a' : file.status === 'deleted' ? '#dc2626' : '#ca8a04' }"
              >{{ file.status === 'added' ? 'A' : file.status === 'deleted' ? 'D' : 'M' }}</span>
              <span style="flex: 1;">{{ file.path }}</span>
              <span style="font-size: 11px; color: #16a34a;">+{{ file.additions ?? 0 }}</span>
              <span style="font-size: 11px; color: #dc2626;">-{{ file.deletions ?? 0 }}</span>
            </div>
          </template>
        </AiCommit>
      </section>

      <!-- SchemaDisplay -->
      <section style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px;">SchemaDisplay</h3>
        <AiSchemaDisplay :fields="schemaFields" title="Message Schema">
          <template #field="{ field, depth }">
            <div style="display: flex; align-items: center; gap: 6px; padding: 4px 0; font-size: 13px;" :style="{ paddingLeft: `${depth * 16}px` }">
              <span v-if="field.children?.length" style="color: #999; font-size: 10px; cursor: pointer;">▼</span>
              <code style="color: #2563eb;">{{ field.name }}</code>
              <span style="color: #999; font-size: 12px;">{{ field.type }}</span>
              <span v-if="field.required" style="color: #dc2626; font-size: 10px;">required</span>
              <span v-if="field.description" style="color: #999; font-size: 11px; margin-left: auto;">{{ field.description }}</span>
            </div>
          </template>
        </AiSchemaDisplay>
      </section>

      <!-- PackageInfo -->
      <section style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px;">PackageInfo</h3>
        <AiPackageInfo :package="packageData">
          <template #header="{ pkg }">
            <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px;">
              <span style="font-size: 18px; font-weight: 700;">{{ pkg.name }}</span>
              <span style="color: #999; font-size: 13px;">v{{ pkg.version }}</span>
            </div>
          </template>
          <template #description="{ description }">
            <p style="color: #666; margin-bottom: 8px; font-size: 13px;">{{ description }}</p>
          </template>
          <template #meta="{ pkg }">
            <div style="display: flex; gap: 12px; font-size: 12px; color: #999; margin-bottom: 8px;">
              <span>📜 {{ pkg.license }}</span>
              <span>📦 {{ pkg.downloads?.toLocaleString() }} downloads</span>
            </div>
          </template>
        </AiPackageInfo>
      </section>

      <!-- EnvVars -->
      <section style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px;">EnvVars</h3>
        <AiEnvVars :variables="envVars">
          <template #variable="{ variable: v, maskedValue, toggleReveal, revealed }">
            <div style="display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px;">
              <code style="min-width: 180px; color: #2563eb;">{{ v.key }}</code>
              <code style="flex: 1; color: #666;">{{ maskedValue }}</code>
              <button
                v-if="v.type === 'secret'"
                @click="toggleReveal"
                style="font-size: 11px; border: 1px solid #ddd; background: white; padding: 2px 8px; border-radius: 4px; cursor: pointer;"
              >
                {{ revealed ? '🔒 Hide' : '👁 Show' }}
              </button>
              <span v-if="v.required" style="font-size: 10px; color: #dc2626;">req</span>
            </div>
          </template>
        </AiEnvVars>
      </section>

      <!-- TestResults -->
      <section style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px;">TestResults</h3>
        <AiTestResults :tests="testResults">
          <template #summary="{ summary }">
            <div style="display: flex; gap: 12px; padding: 8px 12px; background: #f9fafb; border-radius: 6px; margin-bottom: 12px; font-size: 13px;">
              <span>{{ summary.total }} tests</span>
              <span style="color: #16a34a;">✓ {{ summary.passed }} passed</span>
              <span v-if="summary.failed" style="color: #dc2626;">✗ {{ summary.failed }} failed</span>
              <span v-if="summary.skipped" style="color: #999;">○ {{ summary.skipped }} skipped</span>
              <span style="color: #999; margin-left: auto;">{{ summary.duration }}ms</span>
            </div>
          </template>
          <template #suite="{ suite }">
            <div style="font-size: 11px; text-transform: uppercase; color: #999; margin-top: 8px; margin-bottom: 4px;">{{ suite }}</div>
          </template>
          <template #test="{ test }">
            <div style="display: flex; align-items: center; gap: 8px; padding: 3px 0; font-size: 13px;">
              <span :style="{ color: test.status === 'passed' ? '#16a34a' : test.status === 'failed' ? '#dc2626' : '#999' }">
                {{ test.status === 'passed' ? '✓' : test.status === 'failed' ? '✗' : '○' }}
              </span>
              <span :style="{ color: test.status === 'failed' ? '#dc2626' : '#333' }">{{ test.name }}</span>
              <span v-if="test.duration" style="color: #999; font-size: 11px; margin-left: auto;">{{ test.duration }}ms</span>
            </div>
          </template>
          <template #test-error="{ test }">
            <div style="margin-left: 24px; padding: 4px 8px; background: #fef2f2; border-radius: 4px; font-size: 12px; color: #dc2626;">
              {{ test.error }}
            </div>
          </template>
        </AiTestResults>
      </section>

      <!-- Snippet -->
      <section style="grid-column: span 2; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px;">Snippet + WebPreview + Sandbox</h3>
        <div style="display: flex; gap: 16px;">
          <AiSnippet code="pnpm add ai-elements-nuxt" language="bash" label="Install">
            <template #default="{ code: c, label: l, copy, copied }">
              <div style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; background: #f3f4f6; border-radius: 6px;">
                <span v-if="l" style="color: #999; font-size: 12px;">{{ l }}:</span>
                <code style="font-size: 13px;">{{ c }}</code>
                <button @click="copy" style="font-size: 11px; background: none; border: none; cursor: pointer; color: #666;">
                  {{ copied ? '✓' : '📋' }}
                </button>
              </div>
            </template>
          </AiSnippet>

          <AiWebPreview
            :html="'<div style=&quot;padding: 20px; font-family: sans-serif; background: #f0fdf4; border-radius: 8px;&quot;><h3>Live Preview</h3><p>This is rendered in a sandboxed iframe.</p></div>'"
            title="Component Preview"
            height="100px"
            width="300px"
          >
            <template #header="{ title: t, refresh }">
              <div style="display: flex; justify-content: space-between; padding: 4px 8px; background: #f3f4f6; border-radius: 6px 6px 0 0; font-size: 12px;">
                <span>{{ t }}</span>
                <button @click="refresh" style="background: none; border: none; cursor: pointer;">↻</button>
              </div>
            </template>
          </AiWebPreview>
        </div>
      </section>
    </div>
  </div>
</template>
