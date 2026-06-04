<template>
  <AiPersona
    name="Research Assistant"
    description="Searches academic papers, summarizes findings, and provides citations in APA format."
    :active="true"
  >
    <template #default="{ 'name-prop': name, description, active }">
      <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div class="flex items-start gap-4">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            RA
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {{ name }}
              </h3>
              <span
                v-if="active"
                class="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
              >
                Active
              </span>
            </div>
            <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {{ description }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </AiPersona>
</template>
