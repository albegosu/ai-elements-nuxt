<script setup lang="ts">
import type { AiConversationThread } from '../../types'

const props = withDefaults(defineProps<{
  threads: AiConversationThread[]
  activeId?: string
  showArchived?: boolean
}>(), {
  showArchived: false,
})

const emit = defineEmits<{
  (e: 'select', thread: AiConversationThread): void
  (e: 'create'): void
  (e: 'delete', thread: AiConversationThread): void
  (e: 'archive', thread: AiConversationThread): void
}>()

const visibleThreads = computed(() => {
  if (props.showArchived) return props.threads
  return props.threads.filter(t => !t.archived)
})
</script>

<template>
  <div
    data-ai-conversation
    role="navigation"
    aria-label="Conversations"
  >
    <slot
      name="header"
      :thread-count="visibleThreads.length"
      :create="() => emit('create')"
    >
      <div data-ai-conversation-header>
        <slot name="title">Conversations</slot>
        <slot name="create-button" :create="() => emit('create')">
          <button type="button" @click="emit('create')" aria-label="New conversation">+</button>
        </slot>
      </div>
    </slot>

    <div data-ai-conversation-list role="list">
      <slot :threads="visibleThreads" :active-id="activeId">
        <div
          v-for="thread in visibleThreads"
          :key="thread.id"
          data-ai-conversation-item
          :data-active="thread.id === activeId || undefined"
          :data-archived="thread.archived || undefined"
          role="listitem"
        >
          <slot
            name="thread"
            :thread="thread"
            :active="thread.id === activeId"
            :select="() => emit('select', thread)"
            :delete-thread="() => emit('delete', thread)"
            :archive="() => emit('archive', thread)"
          >
            <button
              type="button"
              @click="emit('select', thread)"
              :aria-current="thread.id === activeId ? 'true' : undefined"
            >
              <slot name="thread-title" :thread="thread">
                {{ thread.title }}
              </slot>
              <slot name="thread-meta" :thread="thread">
                <span v-if="thread.messageCount" data-ai-conversation-count>
                  {{ thread.messageCount }}
                </span>
              </slot>
            </button>
          </slot>
        </div>
      </slot>
    </div>

    <slot name="footer" :thread-count="visibleThreads.length" />
  </div>
</template>
