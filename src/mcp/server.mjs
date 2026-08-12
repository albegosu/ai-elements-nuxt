#!/usr/bin/env node
/**
 * MCP server exposing the ai-elements-nuxt component registry to agents.
 *
 * Run: `npx ai-elements-nuxt-mcp` (stdio transport). Add to your MCP client
 * config (Claude Code / Cursor) as a stdio server.
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import {
  CATEGORIES,
  getRegistry,
  listComponents,
  getComponent,
  searchComponents,
  listComposables,
} from './registry.mjs'

const registry = getRegistry()

const server = new Server(
  { name: registry.package, version: registry.version },
  { capabilities: { tools: {}, resources: {} } },
)

const tools = [
  {
    name: 'list_components',
    description: 'List ai-elements-nuxt components (name, slug, category, description). Optionally filter by category.',
    inputSchema: {
      type: 'object',
      properties: { category: { type: 'string', enum: CATEGORIES } },
    },
  },
  {
    name: 'get_component',
    description: 'Get full metadata (props, slots, events, usage example) for one component by its Ai* name or slug.',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string', description: 'Ai* name or slug, e.g. "AiBranch" or "branch"' } },
      required: ['name'],
    },
  },
  {
    name: 'search_components',
    description: 'Search components by free text across name, slug, title, and description.',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string' } },
      required: ['query'],
    },
  },
  {
    name: 'list_composables',
    description: 'List available composables (useAiChat, useAiAgent, …).',
    inputSchema: { type: 'object', properties: {} },
  },
]

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params
  let result
  switch (name) {
    case 'list_components':
      result = listComponents(args)
      break
    case 'get_component':
      result = getComponent(args.name)
      if (!result) throw new Error(`Component not found: ${args.name}`)
      break
    case 'search_components':
      result = searchComponents(args.query)
      break
    case 'list_composables':
      result = listComposables()
      break
    default:
      throw new Error(`Unknown tool: ${name}`)
  }
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
})

const REGISTRY_URI = 'ai-elements://registry'

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [{
    uri: REGISTRY_URI,
    name: 'AI Elements Nuxt registry',
    description: 'Full component + composable registry as JSON.',
    mimeType: 'application/json',
  }],
}))

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri !== REGISTRY_URI) {
    throw new Error(`Unknown resource: ${request.params.uri}`)
  }
  return {
    contents: [{
      uri: REGISTRY_URI,
      mimeType: 'application/json',
      text: JSON.stringify(registry),
    }],
  }
})

const transport = new StdioServerTransport()
await server.connect(transport)
// Announce on stderr (stdout is reserved for the JSON-RPC stream).
console.error(`ai-elements-nuxt MCP server ready (${registry.componentCount} components)`)
