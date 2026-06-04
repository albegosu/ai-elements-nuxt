<script setup lang="ts">
import type { AiTaskData } from '../../types'

const props = defineProps<{
  task: AiTaskData
}>()

const hasSubtasks = computed(() => !!props.task.subtasks?.length)
const completedSubtasks = computed(() =>
  props.task.subtasks?.filter(t => t.status === 'completed').length ?? 0
)
</script>

<template>
  <div
    data-ai-task
    :data-status="task.status"
    role="article"
    :aria-label="`Task: ${task.title}`"
  >
    <slot
      :task="task"
      :has-subtasks="hasSubtasks"
      :completed-subtasks="completedSubtasks"
    >
      <slot name="header" :task="task">
        <div data-ai-task-header>
          <slot name="status-icon" :status="task.status">
            <span data-ai-task-status :data-status="task.status" />
          </slot>
          <slot name="title" :task="task">
            <span data-ai-task-title>{{ task.title }}</span>
          </slot>
        </div>
      </slot>

      <slot name="description" :task="task">
        <div v-if="task.description" data-ai-task-desc>{{ task.description }}</div>
      </slot>

      <slot name="progress" :task="task" :progress="task.progress">
        <div v-if="task.progress != null" data-ai-task-progress role="progressbar" :aria-valuenow="task.progress" aria-valuemin="0" aria-valuemax="100">
          <div data-ai-task-progress-bar :style="{ width: `${task.progress}%` }" />
        </div>
      </slot>

      <div v-if="hasSubtasks" data-ai-task-subtasks role="list">
        <slot name="subtasks" :subtasks="task.subtasks" :completed="completedSubtasks">
          <div
            v-for="subtask in task.subtasks"
            :key="subtask.id"
            data-ai-task-subtask
            :data-status="subtask.status"
            role="listitem"
          >
            <slot name="subtask" :subtask="subtask">
              <span data-ai-task-status :data-status="subtask.status" />
              <span>{{ subtask.title }}</span>
            </slot>
          </div>
        </slot>
      </div>
    </slot>
  </div>
</template>
