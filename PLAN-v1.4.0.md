# Plan — ai-elements-nuxt v1.4.0 (Paridad completa)

Continúa el roadmap de [PARITY.md](PARITY.md) tras v1.3.0. Cierra las mejoras de Vercel
AI Elements v1.6–v1.8 sobre componentes existentes, más los primitivos de branch y de
documentos-fuente.

- **Versión:** 1.3.0 → 1.4.0
- **Resultado:** +3 componentes (`AiBranch`, `AiSpeechButton`, `AiSourceDocuments`) → **66**;
  +1 composable (`useSpeechRecognition`) → **11**

## Cambios

### 1. `AiReasoning` — `getThinkingMessage` + duración + auto-close (v1.7)
Archivo: [Reasoning.vue](src/runtime/components/chatbot/Reasoning.vue)
- Track interno de duración: al pasar `streaming` de `true → false`, calcular segundos.
- Prop `getThinkingMessage?: (o: { streaming: boolean, duration: number }) => string` para
  personalizar el label del trigger.
- Prop `autoClose?: boolean` (default `true`): colapsar al terminar el streaming.
- Label por defecto: streaming → "Thinking…"; terminado → `Thought for Ns`; si no, "Show reasoning".
- Exponer `duration` en los slot props (`trigger`, `trigger-label`, default). Retrocompatible.

### 2. `AiBranch` — navegación de branches (nuevo, chatbot)
Archivo nuevo: `src/runtime/components/chatbot/Branch.vue`
- Réplica headless de los primitivos `Branch`/`BranchSelector` de Vercel (v1.6).
- Props: `branches: unknown[]`, `index?: number` (`v-model:index`).
- Slot default expone `{ current, index, count, next, previous, canPrev, canNext }`; emite `change`.
- Envuelve un `AiMessage` (o cualquier contenido) para paginar respuestas alternativas / regeneraciones.
- Tipo `AiBranchState` en [types/index.ts](src/runtime/types/index.ts) si aplica.

### 3. Voz → prompt: `useSpeechRecognition` + `AiSpeechButton`
Simétrico a `useScreenshotCapture` / `AiScreenshotButton` de v1.3.0.
- **Composable nuevo** `src/runtime/composables/useSpeechRecognition.ts`: extrae la lógica de
  `SpeechRecognition` (start/stop/toggle, `isListening`, `transcript`, `interimTranscript`,
  `isSupported`, eventos). Guards SSR.
- **Refactor** [SpeechInput.vue](src/runtime/components/voice/SpeechInput.vue) para consumir el
  composable — comportamiento idéntico, los tests existentes siguen pasando.
- **Componente nuevo** `src/runtime/components/chatbot/SpeechButton.vue`: solo botón, emite
  `result(transcript, isFinal)`; pensado para los slots de `PromptInput`.
- Demo: dictado que rellena el `PromptInput`.

### 4. `AiPromptInput` — teclado + SourceDocuments (v1.8)
Archivo: [PromptInput.vue](src/runtime/components/chatbot/PromptInput.vue)
- **Teclado:** prop `submitShortcut?: 'enter' | 'mod+enter'` (default `'enter'`). Con
  `'mod+enter'`, Enter inserta salto de línea y ⌘/Ctrl+Enter envía. Ajustar `handleKeydown`.
- **SourceDocuments (nuevo componente, chatbot):** `src/runtime/components/chatbot/SourceDocuments.vue`
  - Tipo `AiSourceDocument { id, title, type?, url?, size?, content? }` en types.
  - Props: `documents: AiSourceDocument[]`; emite `remove(document)`.
  - Renderiza chips con acción de quitar; slot `document` por ítem; `data-ai-source-documents`.
  - Se coloca en el slot `attachments-area` de `PromptInput`.

## Docs, tests y housekeeping
- Demos + páginas + `component-meta` + `navigation` para `AiBranch`, `AiSpeechButton`,
  `AiSourceDocuments`; docs actualizadas de Reasoning y PromptInput.
- Tests: `Branch.test.ts`, `SpeechButton.test.ts` (+ `useSpeechRecognition`), `SourceDocuments.test.ts`,
  y casos nuevos de Reasoning (duración/getThinkingMessage/autoClose) y PromptInput (`mod+enter`).
- `package.json` 1.4.0 · `CHANGELOG.md` `## 1.4.0` · `README.md` (66 componentes, 11 composables)
  · `PARITY.md` roadmap v1.4.0 marcado.

## Verificación
`pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build && node scripts/verify-dist.mjs`
(debe reportar **66 components, 11 composables**) · docs en el navegador para los 3 nuevos +
Reasoning (duración) + PromptInput (mod+enter).

## Fuera de alcance (v1.5.0)
Skill de Nuxt + MCP server para el ecosistema de agentes.
