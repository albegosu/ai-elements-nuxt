# Paridad con Vercel AI Elements

Estado de `ai-elements-nuxt` frente al paquete oficial [`vercel/ai-elements`](https://github.com/vercel/ai-elements).

- **Versión de este paquete:** 1.2.0 (AI SDK v7)
- **Referencia upstream analizada:** `ai-elements@1.9.0` (2026-03-12)
- **Última revisión:** 2026-08-12

## Resumen

`ai-elements-nuxt` cubre **los 48 componentes base de Vercel** más ~12 componentes propios
del ecosistema Nuxt/Vue. Cubrimos completas las tandas de **Voice Elements** (enero 2026) y
**Code Elements** (enero 2026). El único componente de Vercel sin equivalente es `JSXPreview`.

El delta pendiente es, sobre todo, **mejoras a componentes existentes** introducidas entre
v1.6 y v1.9, más un componente nuevo y el **skill/MCP para agentes**.

## Tabla de paridad (componentes)

Leyenda: ✅ portado · 🔴 falta · ➕ extra propio (no existe upstream)

| Vercel (`packages/elements/src`) | Nuxt (`src/runtime/components`) | Estado |
| --- | --- | --- |
| agent | code/Agent | ✅ |
| artifact | code/Artifact | ✅ |
| attachments | chatbot/Attachments | ✅ |
| audio-player | voice/AudioPlayer | ✅ |
| canvas | workflow/Canvas | ✅ |
| chain-of-thought | chatbot/ChainOfThought | ✅ |
| checkpoint | chatbot/Checkpoint | ✅ |
| code-block | code/CodeBlock | ✅ |
| commit | code/Commit | ✅ |
| confirmation | chatbot/Confirmation | ✅ |
| connection | workflow/Connection | ✅ |
| context | chatbot/Context | ✅ |
| controls | workflow/Controls | ✅ |
| conversation | chatbot/Conversation | ✅ (falta descarga a Markdown) |
| edge | workflow/Edge | ✅ |
| environment-variables | code/EnvVars | ✅ |
| file-tree | code/FileTree | ✅ |
| image | utilities/Image | ✅ |
| inline-citation | chatbot/InlineCitation | ✅ |
| **jsx-preview** | — | 🔴 **falta** |
| message | chatbot/Message | ✅ (verificar branches) |
| mic-selector | voice/MicSelector | ✅ |
| model-selector | chatbot/ModelSelector | ✅ |
| node | workflow/Node | ✅ |
| open-in-chat | utilities/OpenInChat | ✅ |
| package-info | code/PackageInfo | ✅ |
| panel | workflow/Panel | ✅ |
| persona | voice/Persona | ✅ |
| plan | chatbot/Plan | ✅ |
| prompt-input | chatbot/PromptInput | ✅ (faltan screenshot/speech/sourceDoc) |
| queue | chatbot/Queue | ✅ |
| reasoning | chatbot/Reasoning | ✅ (falta `getThinkingMessage`) |
| sandbox | code/Sandbox | ✅ |
| schema-display | code/SchemaDisplay | ✅ |
| shimmer | chatbot/Shimmer | ✅ |
| snippet | code/Snippet | ✅ |
| sources | chatbot/Sources | ✅ |
| speech-input | voice/SpeechInput | ✅ |
| stack-trace | code/StackTrace | ✅ |
| suggestion | chatbot/Suggestion | ✅ |
| task | chatbot/Task | ✅ |
| terminal | code/Terminal | ✅ |
| test-results | code/TestResults | ✅ |
| tool | chatbot/Tool | ✅ |
| toolbar | workflow/Toolbar | ✅ |
| transcription | voice/Transcription | ✅ |
| voice-selector | voice/VoiceSelector | ✅ |
| web-preview | code/WebPreview | ✅ |

### Componentes propios (no existen en Vercel)

`SandboxPreview` · `VideoPlayer` · `McpApp` · `RuntimeContext` · `ApprovalPolicy` ·
`AgentTimeline` · `FileUpload` · `RealtimeChat` · `VuePreview` · `StreamingCursor` ·
`ToolApproval` · `Markdown`

## Delta de features (upstream 1.6 → 1.9)

Ninguno presente hoy en el código Nuxt:

| Feature upstream | Versión | Impacto | Notas de adaptación a Vue |
| --- | --- | --- | --- |
| `JSXPreview` | 1.8.3 / 1.9 | 🔴 Alto | Renderiza markup en streaming, auto-cierra tags incompletos, fallback al último render válido. En Vue: `AiMarkupPreview` que compile plantilla/HTML sanitizado en vivo. |
| `PromptInputActionAddScreenshot` | 1.9 | 🟡 Medio | Captura pantalla vía `getDisplayMedia()` y la adjunta al prompt. |
| Descargar conversación como Markdown | 1.8.3 | 🟡 Medio | Botón opcional en `Conversation` que serializa mensajes a `.md`. |
| PromptInput: SpeechButton integrado | 1.6.x | 🟡 Medio | Ya tenemos `SpeechInput` como componente aparte; falta integrarlo como acción del prompt. |
| PromptInput: SourceDocument | 1.8 | 🟢 Bajo | Adjuntar documentos fuente al prompt. |
| PromptInput: config tooltip/teclado | 1.8.3 | 🟢 Bajo | Props de configuración de atajos y tooltips. |
| Reasoning: `getThinkingMessage` custom | 1.7 | 🟢 Bajo | Prop para personalizar el mensaje "Thought for…". |
| Message: navegación de branches | 1.6 | 🟢 Bajo | Verificar paridad del merge Actions/Branch/Response. |

## Ecosistema

| Item | Versión | Estado Nuxt |
| --- | --- | --- |
| AI Elements Skill (instalable en agentes) | 1.8.1 | 🔴 Falta — tenemos `AGENTS.md` + `.cursor/rules`, falta un skill formal |
| AI Elements MCP server | 1.5 | 🔴 Falta |

## Roadmap propuesto

### v1.3.0 — Paridad clave ✅ (publicado)
- [x] `AiJsxPreview` — preview de markup en streaming (equivalente Vue de `JSXPreview`).
- [x] `AiScreenshotButton` + `useScreenshotCapture` — captura de pantalla (`getDisplayMedia`) para el prompt.
- [x] `AiDownloadConversation` + `messagesToMarkdown` — descarga de la conversación a Markdown.

### v1.4.0 — Paridad completa ✅ (publicado)
- [x] `AiSpeechButton` + `useSpeechRecognition` — voz como acción de `PromptInput`.
- [x] `Reasoning`: `getThinkingMessage`, duración ("Thought for Ns") y `autoClose`.
- [x] `AiBranch` — navegación de branches (componente headless dedicado).
- [x] `PromptInput`: `submitShortcut` (teclado) + `AiSourceDocuments` (documentos-fuente).

### v1.5.0 — Ecosistema
- [ ] Publicar un **AI Elements Skill** para Nuxt (equivalente al de Vercel).
- [ ] Evaluar un **MCP server** para el registro de componentes Nuxt.

## Cómo se generó este análisis

1. Inventario local: `find src/runtime/components -name '*.vue'`.
2. Inventario upstream: árbol de `vercel/ai-elements` (`packages/elements/src/*.tsx`).
3. Delta de features: releases `ai-elements@1.3.0 … 1.9.0` en GitHub.
4. Verificación de features en componentes existentes con `grep`.
