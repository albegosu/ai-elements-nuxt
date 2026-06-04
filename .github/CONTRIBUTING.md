# Contributing to ai-elements-nuxt

Thank you for your interest in contributing. This project is a Nuxt module complementing [Vercel AI Elements](https://github.com/vercel/ai-elements) — headless AI UI for the [AI SDK](https://ai-sdk.dev). The package is published on [npm as `ai-elements-nuxt`](https://www.npmjs.com/package/ai-elements-nuxt).

## Prerequisites

- **Node.js** 22 (matches CI)
- **pnpm** 9

```bash
git clone https://github.com/albegosu/ai-elements-nuxt.git
cd ai-elements-nuxt
pnpm install
```

## Repository layout

| Path | Purpose |
|------|---------|
| `src/` | Nuxt module, runtime components, composables, server helpers |
| `docs/` | Documentation site (component reference, guides, playgrounds) |
| `playground/` | Local Nuxt app for manual testing |
| `test/` | Vitest unit tests |
| `scripts/` | Build and docs utilities |

## Development

```bash
pnpm dev              # Docs site at http://localhost:3000
pnpm dev:playground   # Playground app
pnpm run build        # Build the module
pnpm run typecheck    # Vue/TS type check
pnpm run lint         # ESLint
pnpm run test         # Vitest
```

## Conventions

- **Components**: Auto-imported with the `Ai` prefix (`AiMessage`, `AiPromptInput`, …). Keep components headless: slot-driven UI and `data-ai-*` attributes for styling.
- **Styling**: Do not force a design system inside the library. Optional base CSS is gated by `aiElements.defaultStyles` in `nuxt.config.ts`.
- **AI SDK**: Prefer `UIMessage.parts` and helpers like `mapMessageParts` / `toAiMessageProps` over legacy patterns.
- **Cursor / agents**: See [AGENTS.md](../AGENTS.md) and [.cursor/rules/ai-elements.mdc](../.cursor/rules/ai-elements.mdc) for detailed patterns.

## Documentation changes

When you add or change a public component or composable API:

1. Update or add pages under `docs/pages/` (and demos under `docs/components/demos/` if needed).
2. Align metadata in `docs/data/component-meta.ts` when props or slots change.
3. Run `node scripts/generate-docs-demos.mjs` when demo scaffolding is required.

## Pull requests

1. Open an issue first for large features (optional but appreciated).
2. Keep PRs focused; one logical change per PR when possible.
3. Ensure CI passes locally:

   ```bash
   pnpm run build && pnpm run typecheck && pnpm run lint && pnpm run test
   ```

4. Add a changelog entry under `## Unreleased` in [CHANGELOG.md](../CHANGELOG.md) (or under the target version section before release).
5. Use short, imperative commit subjects (e.g. `fix:`, `feat:`, `docs:`, `chore:`).

## Code of conduct

This project follows our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## Questions

Open a [GitHub Discussion](https://github.com/albegosu/ai-elements-nuxt/discussions) or an issue for questions that are not security-related. For vulnerabilities, see [SECURITY.md](./SECURITY.md).
