import { useCompletion, type UseCompletionOptions } from '@ai-sdk/vue'

export type UseAiCompletionOptions = UseCompletionOptions

/**
 * Thin wrapper around `@ai-sdk/vue` `useCompletion` for non-chat text generation.
 * Requires `@ai-sdk/vue` as a peer dependency.
 */
export function useAiCompletion(options?: UseAiCompletionOptions) {
  return useCompletion(options)
}
