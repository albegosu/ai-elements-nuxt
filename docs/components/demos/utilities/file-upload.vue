<script setup lang="ts">
function onUpload(files: File[]) {
  console.log('Uploaded:', files.map(f => f.name))
}

function onError(error: string) {
  console.warn(error)
}
</script>

<template>
  <AiFileUpload
    accept=".pdf,.txt,.md,image/*"
    :max-size="5 * 1024 * 1024"
    :max-files="5"
    @upload="onUpload"
    @error="onError"
  />
</template>
