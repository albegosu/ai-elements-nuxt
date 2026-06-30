<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AiFileUploadItem } from '../../types/realtime'

const props = withDefaults(defineProps<{
  accept?: string
  multiple?: boolean
  maxSize?: number
  maxFiles?: number
  disabled?: boolean
}>(), {
  multiple: true,
  maxFiles: 10,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'upload', files: File[]): void
  (e: 'remove', item: AiFileUploadItem): void
  (e: 'error', error: string): void
}>()

const items = ref<AiFileUploadItem[]>([])
const isDragging = ref(false)

const fileInput = ref<HTMLInputElement | null>(null)

const hasFiles = computed(() => items.value.length > 0)
const canAddMore = computed(() => !props.maxFiles || items.value.length < props.maxFiles)

function createItem(file: File): AiFileUploadItem {
  return {
    id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    file,
    name: file.name,
    size: file.size,
    mimeType: file.type || 'application/octet-stream',
    status: 'pending',
    progress: 0,
  }
}

function validateFile(file: File): string | null {
  if (props.maxSize && file.size > props.maxSize) {
    return `File "${file.name}" exceeds max size of ${formatSize(props.maxSize)}`
  }
  if (props.accept) {
    const accepted = props.accept.split(',').map(t => t.trim())
    const matches = accepted.some((pattern) => {
      if (pattern.startsWith('.')) return file.name.toLowerCase().endsWith(pattern.toLowerCase())
      if (pattern.endsWith('/*')) return file.type.startsWith(pattern.replace('/*', '/'))
      return file.type === pattern
    })
    if (!matches) return `File "${file.name}" is not an accepted type`
  }
  return null
}

function addFiles(fileList: FileList | File[]) {
  const files = Array.from(fileList)
  const validFiles: File[] = []

  for (const file of files) {
    if (!canAddMore.value && validFiles.length === 0) {
      emit('error', `Maximum ${props.maxFiles} files allowed`)
      break
    }
    const error = validateFile(file)
    if (error) {
      emit('error', error)
      continue
    }
    validFiles.push(file)
    items.value.push(createItem(file))
  }

  if (validFiles.length) {
    emit('upload', validFiles)
  }
}

function removeItem(item: AiFileUploadItem) {
  items.value = items.value.filter(i => i.id !== item.id)
  emit('remove', item)
}

function openFilePicker() {
  fileInput.value?.click()
}

function onFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    addFiles(target.files)
    target.value = ''
  }
}

function onDragEnter(event: DragEvent) {
  event.preventDefault()
  if (props.disabled) return
  isDragging.value = true
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
}

function onDragLeave(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
  if (props.disabled) return
  if (event.dataTransfer?.files?.length) {
    addFiles(event.dataTransfer.files)
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function clearAll() {
  items.value = []
}

defineExpose({ items, addFiles, removeItem, clearAll, openFilePicker })
</script>

<template>
  <div
    data-ai-file-upload
    :data-disabled="disabled || undefined"
    :data-dragging="isDragging || undefined"
    :data-has-files="hasFiles || undefined"
  >
    <slot
      :items="items"
      :is-dragging="isDragging"
      :has-files="hasFiles"
      :can-add-more="canAddMore"
      :open-file-picker="openFilePicker"
      :remove-item="removeItem"
      :clear-all="clearAll"
      :format-size="formatSize"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        data-ai-file-upload-input
        style="display: none"
        @change="onFileSelect"
      >

      <slot
        v-if="canAddMore"
        name="dropzone"
        :is-dragging="isDragging"
        :open-file-picker="openFilePicker"
        :disabled="disabled"
      >
        <div
          data-ai-file-upload-dropzone
          :data-dragging="isDragging || undefined"
          role="button"
          tabindex="0"
          :aria-disabled="disabled"
          aria-label="Upload files"
          @click="openFilePicker"
          @keydown.enter.prevent="openFilePicker"
          @keydown.space.prevent="openFilePicker"
          @dragenter="onDragEnter"
          @dragover="onDragOver"
          @dragleave="onDragLeave"
          @drop="onDrop"
        >
          <slot name="dropzone-content" :is-dragging="isDragging">
            <div data-ai-file-upload-dropzone-text>
              {{ isDragging ? 'Drop files here' : 'Drag files here or click to upload' }}
            </div>
          </slot>
        </div>
      </slot>

      <slot v-if="hasFiles" name="file-list" :items="items" :remove-item="removeItem" :format-size="formatSize">
        <div data-ai-file-upload-list role="list" aria-label="Uploaded files">
          <div
            v-for="item in items"
            :key="item.id"
            data-ai-file-upload-item
            :data-status="item.status"
            role="listitem"
          >
            <slot name="file" :item="item" :remove="() => removeItem(item)" :format-size="formatSize">
              <div data-ai-file-upload-item-info>
                <span data-ai-file-upload-item-name>{{ item.name }}</span>
                <span data-ai-file-upload-item-size>{{ formatSize(item.size) }}</span>
              </div>

              <slot name="file-progress" :item="item">
                <div v-if="item.status === 'uploading'" data-ai-file-upload-progress>
                  <div data-ai-file-upload-progress-bar :style="{ width: `${item.progress}%` }" />
                </div>
              </slot>

              <slot name="file-actions" :item="item" :remove="() => removeItem(item)">
                <button
                  type="button"
                  data-ai-file-upload-remove
                  aria-label="Remove file"
                  @click="removeItem(item)"
                >
                  &times;
                </button>
              </slot>
            </slot>
          </div>
        </div>
      </slot>
    </slot>
  </div>
</template>
