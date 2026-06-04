import { getCurrentInstance, useId } from 'vue'

/**
 * SSR-safe unique id for aria-controls / labelled regions (Vue 3.5+ `useId`).
 */
export function useUniqueId(prefix = 'ai'): string {
  const inst = getCurrentInstance()
  const suffix = inst != null ? `-${inst.uid}` : ''
  return `${prefix}-${useId()}${suffix}`
}
