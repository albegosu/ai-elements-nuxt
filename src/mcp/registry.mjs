/**
 * Pure, testable accessors over the generated component registry.
 * Shared by the MCP server ({@link ./server.mjs}) and any tooling.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const registryPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../registry/components.json',
)

let cache = null

/** Load (and memoize) the registry JSON. */
export function getRegistry() {
  if (!cache) cache = JSON.parse(fs.readFileSync(registryPath, 'utf8'))
  return cache
}

/** Valid component categories. */
export const CATEGORIES = ['chatbot', 'code', 'voice', 'workflow', 'utilities']

/** List components (name/slug/category/description), optionally by category. */
export function listComponents({ category } = {}) {
  const { components } = getRegistry()
  const list = category ? components.filter(c => c.category === category) : components
  return list.map(({ name, slug, category, title, description }) => ({
    name, slug, category, title, description,
  }))
}

/** Full metadata for a single component, matched by `Ai*` name or slug. */
export function getComponent(nameOrSlug) {
  if (!nameOrSlug) return null
  const { components } = getRegistry()
  const q = String(nameOrSlug).toLowerCase()
  return components.find(c =>
    c.name.toLowerCase() === q
    || c.slug.toLowerCase() === q
    || c.name.toLowerCase() === `ai${q}`,
  ) ?? null
}

/** Free-text search across name, slug, title, and description. */
export function searchComponents(query) {
  const { components } = getRegistry()
  const q = String(query ?? '').toLowerCase().trim()
  if (!q) return []
  return components
    .filter(c => `${c.name} ${c.slug} ${c.title} ${c.description}`.toLowerCase().includes(q))
    .map(({ name, slug, category, description }) => ({ name, slug, category, description }))
}

/** List available composables. */
export function listComposables() {
  return getRegistry().composables
}
