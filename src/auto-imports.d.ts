export {}

declare global {
  const ref: typeof import('vue').ref
  const computed: typeof import('vue').computed
  const watch: typeof import('vue').watch
  const shallowRef: typeof import('vue').shallowRef
  const reactive: typeof import('vue').reactive
  const onMounted: typeof import('vue').onMounted
  const onUnmounted: typeof import('vue').onUnmounted
  const onScopeDispose: typeof import('vue').onScopeDispose
  const onErrorCaptured: typeof import('vue').onErrorCaptured
  const nextTick: typeof import('vue').nextTick
  const toRef: typeof import('vue').toRef
  const useId: typeof import('vue').useId
  const defineOptions: typeof import('vue').defineOptions
}
