<script setup lang="ts">
// Voice data
const transcriptSegments = [
  { id: '1', text: 'Hello, welcome to the RAG demo.', startTime: 0, endTime: 3.2, speaker: 'Host', confidence: 0.98 },
  { id: '2', text: 'Today we will explore retrieval augmented generation.', startTime: 3.5, endTime: 7.1, speaker: 'Host', confidence: 0.95 },
  { id: '3', text: 'Can you explain how embedding works?', startTime: 8.0, endTime: 10.5, speaker: 'Guest', confidence: 0.92 },
  { id: '4', text: 'Sure, embeddings convert text into dense vector representations.', startTime: 11.0, endTime: 15.2, speaker: 'Host', confidence: 0.97 },
]

const voices = [
  { id: 'v1', name: 'Aria', language: 'en-US', gender: 'Female', preview: '#' },
  { id: 'v2', name: 'Marcus', language: 'en-US', gender: 'Male', preview: '#' },
  { id: 'v3', name: 'Luna', language: 'es-ES', gender: 'Female' },
  { id: 'v4', name: 'Nova', language: 'en-GB', gender: 'Female', preview: '#' },
]

const personas = [
  { name: 'Research Assistant', description: 'Searches and synthesizes academic papers', voice: 'Aria' },
  { name: 'Code Helper', description: 'Helps write and debug code', voice: 'Marcus' },
  { name: 'Creative Writer', description: 'Generates creative content and stories', voice: 'Luna' },
]

const selectedVoice = ref('v1')
const activePersona = ref(0)
const playbackTime = ref(5.0)

// Workflow data
const nodes = reactive([
  { id: 'n1', label: 'User Query', x: 50, y: 80, type: 'input', status: 'completed' as const, outputs: ['query'] },
  { id: 'n2', label: 'Embed Query', x: 250, y: 40, type: 'process', status: 'completed' as const, inputs: ['text'], outputs: ['embedding'] },
  { id: 'n3', label: 'Vector Search', x: 250, y: 150, type: 'process', status: 'running' as const, inputs: ['embedding'], outputs: ['results'] },
  { id: 'n4', label: 'Rerank', x: 470, y: 80, type: 'process', status: 'idle' as const, inputs: ['results'], outputs: ['ranked'] },
  { id: 'n5', label: 'Generate', x: 670, y: 80, type: 'output', status: 'idle' as const, inputs: ['context'] },
])

const edges = [
  { sourceNode: 'n1', targetNode: 'n2', sourceX: 180, sourceY: 100, targetX: 250, targetY: 60 },
  { sourceNode: 'n1', targetNode: 'n3', sourceX: 180, sourceY: 100, targetX: 250, targetY: 170 },
  { sourceNode: 'n2', targetNode: 'n4', sourceX: 380, sourceY: 60, targetX: 470, targetY: 100 },
  { sourceNode: 'n3', targetNode: 'n4', sourceX: 380, sourceY: 170, targetX: 470, targetY: 100 },
  { sourceNode: 'n4', targetNode: 'n5', sourceX: 600, sourceY: 100, targetX: 670, targetY: 100 },
]

function handleNodeMove(id: string, x: number, y: number) {
  const node = nodes.find(n => n.id === id)
  if (node) { node.x = x; node.y = y }
}
</script>

<template>
  <div style="max-width: 1200px; margin: 0 auto; padding: 24px; font-family: system-ui, sans-serif;">
    <h1 style="margin-bottom: 8px;">AI Elements Nuxt — Voice, Workflow & Utilities</h1>
    <p style="color: #666; margin-bottom: 32px;">
      <a href="/" style="color: #2563eb;">← Chatbot</a> ·
      <a href="/code" style="color: #2563eb;">Code</a> ·
      15 components rendered headless
    </p>

    <!-- VOICE SECTION -->
    <h2 style="font-size: 18px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">Voice Components (6)</h2>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
      <!-- AudioPlayer -->
      <section style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px;">AudioPlayer</h3>
        <AiAudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" title="Sample Audio">
          <template #default="{ isPlaying, toggle, progress, currentTime, duration, formatTime }">
            <div style="display: flex; align-items: center; gap: 12px;">
              <button @click="toggle" style="width: 36px; height: 36px; border-radius: 50%; border: 2px solid #2563eb; background: white; color: #2563eb; font-size: 14px; cursor: pointer;">
                {{ isPlaying ? '⏸' : '▶' }}
              </button>
              <div style="flex: 1;">
                <div style="height: 4px; background: #e5e7eb; border-radius: 2px;">
                  <div style="height: 100%; background: #2563eb; border-radius: 2px; transition: width 0.1s;" :style="{ width: `${progress}%` }" />
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: #999; margin-top: 4px;">
                  <span>{{ formatTime(currentTime) }}</span>
                  <span>{{ formatTime(duration) }}</span>
                </div>
              </div>
            </div>
          </template>
        </AiAudioPlayer>
      </section>

      <!-- SpeechInput -->
      <section style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px;">SpeechInput</h3>
        <AiSpeechInput language="en-US">
          <template #default="{ isListening, isSupported, transcript, interimTranscript, toggle }">
            <div>
              <button
                @click="toggle"
                :disabled="!isSupported"
                style="padding: 8px 16px; border-radius: 20px; border: 2px solid; cursor: pointer; font-size: 14px;"
                :style="{ borderColor: isListening ? '#dc2626' : '#2563eb', background: isListening ? '#fef2f2' : 'white', color: isListening ? '#dc2626' : '#2563eb' }"
              >
                {{ isListening ? '⏹ Stop' : '🎤 Speak' }}
              </button>
              <div v-if="transcript || interimTranscript" style="margin-top: 8px; padding: 8px; background: #f9fafb; border-radius: 6px; font-size: 13px;">
                {{ transcript }}<span style="color: #999;">{{ interimTranscript }}</span>
              </div>
              <div v-if="!isSupported" style="margin-top: 8px; color: #999; font-size: 12px;">Speech recognition not supported</div>
            </div>
          </template>
        </AiSpeechInput>
      </section>

      <!-- Transcription -->
      <section style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px;">Transcription</h3>
        <AiTranscription :segments="transcriptSegments" :current-time="playbackTime" highlight-active>
          <template #segment="{ segment, active, formatTime }">
            <div
              style="display: flex; gap: 8px; padding: 6px 8px; border-radius: 4px; font-size: 13px; cursor: pointer; transition: background 0.2s;"
              :style="{ background: active ? '#e8f0fe' : 'transparent' }"
            >
              <span style="color: #999; font-family: monospace; min-width: 40px;">{{ formatTime(segment.startTime) }}</span>
              <span style="color: #2563eb; min-width: 50px; font-weight: 500;">{{ segment.speaker }}</span>
              <span>{{ segment.text }}</span>
              <span v-if="segment.confidence" style="margin-left: auto; color: #999; font-size: 11px;">{{ (segment.confidence * 100).toFixed(0) }}%</span>
            </div>
          </template>
        </AiTranscription>
        <div style="margin-top: 8px;">
          <input type="range" min="0" max="16" step="0.5" v-model.number="playbackTime" style="width: 100%;" />
          <span style="font-size: 11px; color: #999;">Playback: {{ playbackTime.toFixed(1) }}s</span>
        </div>
      </section>

      <!-- VoiceSelector + Persona -->
      <section style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px;">VoiceSelector</h3>
        <AiVoiceSelector :voices="voices" v-model="selectedVoice">
          <template #voice="{ voice, selected, select }">
            <div
              @click="select"
              style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border: 1px solid; border-radius: 6px; margin-bottom: 4px; cursor: pointer;"
              :style="{ borderColor: selected ? '#2563eb' : '#e5e7eb', background: selected ? '#eff6ff' : 'white' }"
            >
              <div>
                <span style="font-weight: 500;">{{ voice.name }}</span>
                <span style="color: #999; font-size: 12px; margin-left: 8px;">{{ voice.language }} · {{ voice.gender }}</span>
              </div>
              <span v-if="selected" style="color: #2563eb;">✓</span>
            </div>
          </template>
        </AiVoiceSelector>

        <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin: 16px 0 12px;">Persona</h3>
        <div style="display: flex; gap: 8px;">
          <AiPersona
            v-for="(p, i) in personas"
            :key="p.name"
            :name="p.name"
            :description="p.description"
            :voice="p.voice"
            :active="i === activePersona"
            @select="activePersona = i"
          >
            <template #default="{ active }">
              <div
                style="padding: 10px; border: 2px solid; border-radius: 8px; cursor: pointer; text-align: center; min-width: 120px;"
                :style="{ borderColor: active ? '#2563eb' : '#e5e7eb', background: active ? '#eff6ff' : 'white' }"
              >
                <div style="font-size: 24px; margin-bottom: 4px;">{{ p.name.charAt(0) }}</div>
                <div style="font-size: 12px; font-weight: 500;">{{ p.name }}</div>
                <div style="font-size: 11px; color: #999;">{{ p.voice }}</div>
              </div>
            </template>
          </AiPersona>
        </div>
      </section>
    </div>

    <!-- WORKFLOW SECTION -->
    <h2 style="font-size: 18px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">Workflow Components (7)</h2>

    <section style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 24px;">
      <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px;">Canvas + Node + Edge + Controls + Toolbar + Panel</h3>

      <div style="display: flex; gap: 0;">
        <div style="flex: 1; position: relative;">
          <AiToolbar position="top">
            <template #actions="{ emitAction }">
              <div style="display: flex; gap: 4px; padding: 6px 8px; background: #f3f4f6; border-radius: 6px; margin-bottom: 8px;">
                <button @click="emitAction('add-node')" style="padding: 4px 10px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer; font-size: 12px;">+ Node</button>
                <button @click="emitAction('delete')" style="padding: 4px 10px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer; font-size: 12px;">🗑 Delete</button>
                <button @click="emitAction('undo')" style="padding: 4px 10px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer; font-size: 12px;">↩ Undo</button>
              </div>
            </template>
          </AiToolbar>

          <AiCanvas width="100%" height="300px" :show-grid="true" :grid-size="20">
            <template #default="{ zoom }">
              <svg style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;">
                <AiEdge
                  v-for="(edge, i) in edges"
                  :key="i"
                  :id="`e${i}`"
                  :source-x="edge.sourceX"
                  :source-y="edge.sourceY"
                  :target-x="edge.targetX"
                  :target-y="edge.targetY"
                  :animated="edge.sourceNode === 'n3' || edge.targetNode === 'n3'"
                  type="bezier"
                />
              </svg>

              <AiNode
                v-for="node in nodes"
                :key="node.id"
                v-bind="node"
                @move="handleNodeMove"
              >
                <template #default="{ label, status, type }">
                  <div style="padding: 8px 16px; border: 2px solid; border-radius: 8px; background: white; min-width: 100px; text-align: center; cursor: grab; user-select: none;"
                    :style="{
                      borderColor: status === 'completed' ? '#16a34a' : status === 'running' ? '#2563eb' : '#e5e7eb',
                      boxShadow: status === 'running' ? '0 0 0 3px rgba(37,99,235,0.2)' : 'none'
                    }"
                  >
                    <div style="font-size: 10px; text-transform: uppercase; color: #999;">{{ type }}</div>
                    <div style="font-size: 13px; font-weight: 500;">{{ label }}</div>
                    <div style="font-size: 10px; margin-top: 2px;"
                      :style="{ color: status === 'completed' ? '#16a34a' : status === 'running' ? '#2563eb' : '#999' }"
                    >{{ status }}</div>
                  </div>
                </template>
              </AiNode>
            </template>
          </AiCanvas>

          <AiControls :zoom="1" position="bottom-right" @zoom-in="() => {}" @zoom-out="() => {}" @reset="() => {}">
            <template #default="{ zoomIn, zoomOut, reset }">
              <div style="display: flex; gap: 4px; position: absolute; bottom: 8px; right: 8px;">
                <button @click="zoomIn" style="width: 28px; height: 28px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;">+</button>
                <button @click="zoomOut" style="width: 28px; height: 28px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;">−</button>
                <button @click="reset" style="width: 28px; height: 28px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;">⟲</button>
              </div>
            </template>
          </AiControls>
        </div>

        <AiPanel title="Node Properties" width="200px" position="right">
          <template #header="{ title: t, toggle, collapsed }">
            <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
              <span v-if="!collapsed" style="font-size: 12px; font-weight: 600;">{{ t }}</span>
              <button @click="toggle" style="border: none; background: none; cursor: pointer; font-size: 12px;">
                {{ collapsed ? '◀' : '▶' }}
              </button>
            </div>
          </template>
          <template #default>
            <div style="padding: 12px; font-size: 13px;">
              <div style="margin-bottom: 8px;"><strong>Embed Query</strong></div>
              <div style="color: #666; font-size: 12px; margin-bottom: 4px;">Type: process</div>
              <div style="color: #666; font-size: 12px; margin-bottom: 4px;">Status: completed</div>
              <div style="color: #666; font-size: 12px;">Model: text-embedding-3-small</div>
            </div>
          </template>
        </AiPanel>
      </div>
    </section>

    <!-- UTILITIES SECTION -->
    <h2 style="font-size: 18px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">Utilities (2)</h2>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <section style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px;">Image</h3>
        <AiImage
          src="https://picsum.photos/400/200"
          alt="Sample landscape"
          caption="Random landscape — click to zoom"
          width="100%"
        >
          <template #default="{ src: imgSrc, alt: imgAlt, isLoading, toggleZoom }">
            <div>
              <div v-if="isLoading" style="height: 200px; background: #f3f4f6; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #999;">Loading...</div>
              <img :src="imgSrc" :alt="imgAlt" style="width: 100%; border-radius: 6px; cursor: zoom-in;" @click="toggleZoom" />
            </div>
          </template>
          <template #caption="{ caption }">
            <div style="font-size: 12px; color: #999; margin-top: 4px; text-align: center;">{{ caption }}</div>
          </template>
        </AiImage>
      </section>

      <section style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 12px;">OpenInChat</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <AiOpenInChat content="What are the best practices for chunking documents in RAG?" label="Ask about chunking" @open="(c) => alert(`Opening in chat: ${c}`)">
            <template #default="{ label: l }">
              <div style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 6px; cursor: pointer;">
                <span>💬</span>
                <span style="font-size: 13px;">{{ l }}</span>
                <span style="margin-left: auto; color: #999;">→</span>
              </div>
            </template>
          </AiOpenInChat>
          <AiOpenInChat content="Explain the difference between dense and sparse embeddings" label="Ask about embeddings" @open="(c) => alert(`Opening in chat: ${c}`)">
            <template #default="{ label: l }">
              <div style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 6px; cursor: pointer;">
                <span>💬</span>
                <span style="font-size: 13px;">{{ l }}</span>
                <span style="margin-left: auto; color: #999;">→</span>
              </div>
            </template>
          </AiOpenInChat>
        </div>
      </section>
    </div>
  </div>
</template>
