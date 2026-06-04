import { afterEach, vi } from 'vitest'
import failOnConsole from 'vitest-fail-on-console'
import {
  ref,
  computed,
  watch,
  shallowRef,
  onMounted,
  onUnmounted,
  onScopeDispose,
  onErrorCaptured,
  nextTick,
  reactive,
  toRef,
  useId,
} from 'vue'

failOnConsole({
  allowMessage: (message) =>
    typeof message === 'string'
    && (
      message.includes('onScopeDispose() is called when there is no active effect scope')
      || message.includes('onMounted is called when there is no active component instance')
    ),
})

afterEach(() => {
  vi.restoreAllMocks()
})

Object.assign(globalThis, {
  ref,
  computed,
  watch,
  shallowRef,
  onMounted,
  onUnmounted,
  onScopeDispose,
  onErrorCaptured,
  nextTick,
  reactive,
  toRef,
  useId,
})
