#!/usr/bin/env node
/**
 * Injects the generated component + composable list into the skill and AGENTS.md
 * between `<!-- REGISTRY:START -->` and `<!-- REGISTRY:END -->` markers, so the
 * agent-facing docs never drift from the registry. Run after generate-registry.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const registryPath = path.join(root, 'registry/components.json')
if (!fs.existsSync(registryPath)) {
  console.error('registry/components.json missing — run generate:registry first')
  process.exit(1)
}
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'))

const CATEGORY_LABELS = {
  chatbot: 'Chatbot',
  code: 'Code',
  voice: 'Voice',
  workflow: 'Workflow',
  utilities: 'Utilities',
}

function buildBlock() {
  const lines = [`#### Components (${registry.componentCount})`, '']
  for (const [id, label] of Object.entries(CATEGORY_LABELS)) {
    const comps = registry.components
      .filter(c => c.category === id)
      .map(c => c.name)
      .join(', ')
    if (comps) lines.push(`- **${label}:** ${comps}`)
  }
  lines.push('', `#### Composables (${registry.composableCount})`, '')
  lines.push(registry.composables.map(c => `\`${c}\``).join(', '))
  return lines.join('\n')
}

const block = buildBlock()
const markerStart = '<!-- REGISTRY:START -->'
const markerEnd = '<!-- REGISTRY:END -->'

const targets = [
  path.join(root, 'skills/ai-elements-nuxt/SKILL.md'),
  path.join(root, 'AGENTS.md'),
]

for (const file of targets) {
  if (!fs.existsSync(file)) continue
  const src = fs.readFileSync(file, 'utf8')
  const pattern = new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`)
  if (!pattern.test(src)) {
    console.error(`markers not found in ${path.relative(root, file)} — skipped`)
    continue
  }
  const next = src.replace(pattern, `${markerStart}\n${block}\n${markerEnd}`)
  fs.writeFileSync(file, next)
  console.log(`updated ${path.relative(root, file)}`)
}
