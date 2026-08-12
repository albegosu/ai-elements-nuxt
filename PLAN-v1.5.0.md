# Plan — ai-elements-nuxt v1.5.0 (Ecosistema: Skill + MCP)

Último tramo del roadmap de [PARITY.md](PARITY.md). No añade componentes Vue: empaqueta el
registro de 66 componentes para agentes, vía un **skill** y un **MCP server** (equivalente al
AI Elements Skill v1.8.1 y MCP server v1.5 de Vercel).

- **Versión:** 1.4.0 → 1.5.0
- **Decisiones:** `@modelcontextprotocol/sdk` como **dependencia normal** (`npx` sin fricción);
  la lista de componentes en skill/AGENTS se **genera desde el registro** (no se vuelve a desfasar).

## 0. Contexto / problemas a resolver
- `AGENTS.md` y `.cursor/rules/ai-elements.mdc` están **desfasados** (dicen 52 componentes,
  `ai ^6`, `@ai-sdk/vue ^3`). Hay que refrescarlos a **66 / `ai ^7` / `@ai-sdk/vue ^4`**.
- El registro (props/slots/events/demos) vive en `docs/data/{navigation,component-meta}.ts` con
  alias `~/`, y el paquete npm solo publica `dist` + `src/runtime`. El MCP necesita un
  **registry JSON generado y empaquetado**.

## 1. Registro JSON (base de skill + MCP)
- **Script** `scripts/generate-registry.mjs`: importa `docs/data/navigation.ts` y
  `docs/data/component-meta.ts` con **jiti** (esbuild elimina los `import type '~/...'`, que son
  type-only → no requiere resolver alias). Fallback: bundle con esbuild si jiti falla.
- Salida `registry/components.json`: `[{ category, name, slug, description, props, slots, events, code }]`
  (66 entradas) + `composables` derivadas de `readdir('src/runtime/composables')` (11).
- Añadir `registry/` a `files` de `package.json` para que viaje en el tarball.
- `generate:registry` se ejecuta en `prepack`/`prepublishOnly` **antes** de `verify-dist`.

## 2. MCP server
- **Lógica pura y testeable** en `src/mcp/registry.mjs`: `listComponents({ category? })`,
  `getComponent(nameOrSlug)`, `searchComponents(query)`, `listComposables()` — leen
  `registry/components.json` (resuelto relativo a la raíz del paquete).
- **Wrapper stdio** `src/mcp/server.mjs`: `@modelcontextprotocol/sdk` (stdio) expone esas
  funciones como tools MCP + un resource `ai-elements://registry`.
- **bin** `ai-elements-nuxt-mcp` → `src/mcp/server.mjs` (añadir a `package.json` `bin`).
- `@modelcontextprotocol/sdk` → `dependencies`.
- Documentar config de cliente (Claude Code / Cursor) en README y AGENTS.

## 3. Skill
- `skills/ai-elements-nuxt/SKILL.md`: frontmatter (`name`, `description`) + guía concisa de uso
  (módulo, `useAiChat`/`useAiAgent`, server handlers, sidebar vs thread, "do not"), reusando lo
  bueno de la regla de Cursor.
- **Sección de componentes autogenerada** entre marcadores `<!-- REGISTRY:START/END -->` por
  `scripts/generate-skill.mjs`, que también refresca la misma sección en `AGENTS.md`.
- **Refrescar prosa** de `AGENTS.md` (52→66, `ai ^6→^7`, `@ai-sdk/vue ^3→^4`) y
  `.cursor/rules/ai-elements.mdc` (consistencia).
- Añadir `skills/` a `files` para que se pueda copiar desde el paquete instalado.

## 4. Tests
- `test/registry/generate.test.ts`: el JSON generado tiene 66 componentes y cada entrada trae
  `name`/`category`/`props`/`slots`/`code`.
- `test/mcp/registry.test.ts`: `listComponents` filtra por categoría; `getComponent` resuelve por
  name y slug; `searchComponents` encuentra por texto; `listComposables` devuelve 11.
- (El wrapper stdio se prueba con un smoke test manual, no unitario.)

## 5. Housekeeping
- `package.json`: `1.5.0`; `files` += `registry`, `skills`; `bin` += `ai-elements-nuxt-mcp`;
  `dependencies` += `@modelcontextprotocol/sdk`; scripts += `generate:registry`, `generate:skill`.
- `CHANGELOG.md` `## 1.5.0`; `README.md` (secciones MCP + Skill); `PARITY.md` roadmap v1.5.0 ✅.

## 6. Verificación
- `node scripts/generate-registry.mjs` → `registry/components.json` con 66 componentes.
- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build && node scripts/verify-dist.mjs`
  (sigue 66/11).
- **Smoke test MCP:** lanzar el bin y enviar `tools/list` + `list_components` por stdio (JSON-RPC),
  confirmar respuesta con los 66 componentes.

## Notas de diseño
- El registro es la **única fuente**: skill, AGENTS y MCP se derivan de `docs/data`, evitando el
  desfase que ya ocurrió (52 vs 66).
- El MCP no depende del runtime Nuxt; el `import` del SDK es solo en el bin, no en el módulo.
