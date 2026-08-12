#!/usr/bin/env node
/**
 * Generates `registry/components.json` — the machine-readable component registry
 * consumed by the MCP server and the agent skill. Single source of truth is the
 * docs data (`docs/data/navigation.ts` + `docs/data/component-meta.ts`).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createJiti } from 'jiti'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const jiti = createJiti(import.meta.url)

const { categories } = await jiti.import(path.join(root, 'docs/data/navigation.ts'))
const { getComponentMeta } = await jiti.import(path.join(root, 'docs/data/component-meta.ts'))

const components = []
for (const category of categories) {
  for (const comp of category.components) {
    const meta = getComponentMeta(category.id, comp.slug) ?? {}
    components.push({
      category: category.id,
      categoryLabel: category.label,
      name: comp.component,
      slug: comp.slug,
      title: comp.name,
      description: comp.description,
      props: meta.props ?? [],
      slots: meta.slots ?? [],
      events: meta.events ?? [],
      code: meta.code ?? '',
    })
  }
}

// Composables derived from source filenames — self-updating.
const composablesDir = path.join(root, 'src/runtime/composables')
const composables = fs.readdirSync(composablesDir)
  .filter(f => f.endsWith('.ts'))
  .map(f => f.replace(/\.ts$/, ''))
  .sort()

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))

const registry = {
  package: pkg.name,
  version: pkg.version,
  generatedAt: new Date().toISOString().slice(0, 10),
  componentCount: components.length,
  composableCount: composables.length,
  components,
  composables,
}

const outDir = path.join(root, 'registry')
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(
  path.join(outDir, 'components.json'),
  `${JSON.stringify(registry, null, 2)}\n`,
)

console.log(`registry generated: ${components.length} components, ${composables.length} composables`)
