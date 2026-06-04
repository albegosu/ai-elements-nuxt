import { existsSync, readdirSync, statSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function listFiles(dir, ext) {
  const results = []
  if (!existsSync(dir)) return results
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...listFiles(full, ext))
    } else if (entry.name.endsWith(ext)) {
      results.push(full)
    }
  }
  return results
}

function relative(from, to) {
  return to.slice(from.length + 1)
}

const srcComponents = listFiles(join(root, 'src/runtime/components'), '.vue')
const distComponents = listFiles(join(root, 'dist/runtime/components'), '.vue')

const srcComposables = listFiles(join(root, 'src/runtime/composables'), '.ts')
const distComposables = listFiles(join(root, 'dist/runtime/composables'), '.js')
  .map(p => p.replace(/\.js$/, '.ts'))

const srcServer = listFiles(join(root, 'src/runtime/server'), '.ts')
  .filter(p => !p.endsWith('/index.ts'))

const missingComponents = srcComponents
  .map(p => relative(join(root, 'src/runtime/components'), p))
  .filter(rel => {
    const distPath = join(root, 'dist/runtime/components', rel)
    return !existsSync(distPath)
  })

const missingComposables = srcComposables
  .map(p => relative(join(root, 'src/runtime/composables'), p).replace(/\.ts$/, '.js'))
  .filter(rel => {
    const distPath = join(root, 'dist/runtime/composables', rel)
    return !existsSync(distPath)
  })

const missingServer = srcServer
  .map(p => relative(join(root, 'src/runtime/server'), p).replace(/\.ts$/, '.js'))
  .filter(rel => {
    const distPath = join(root, 'dist/runtime/server', rel)
    return !existsSync(distPath)
  })

if (!existsSync(join(root, 'dist/module.mjs'))) {
  console.error('Missing dist/module.mjs — run pnpm run build')
  process.exit(1)
}

if (missingComponents.length || missingComposables.length || missingServer.length) {
  console.error('dist/ is out of sync with src/runtime:')
  for (const f of missingComponents) console.error(`  missing component: ${f}`)
  for (const f of missingComposables) console.error(`  missing composable: ${f}`)
  for (const f of missingServer) console.error(`  missing server: ${f}`)
  process.exit(1)
}

console.log(
  `dist parity OK (${distComponents.length} components, ${listFiles(join(root, 'dist/runtime/composables'), '.js').length} composables)`,
)
