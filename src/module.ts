import { defineNuxtModule, createResolver, addComponentsDir, addImportsDir } from '@nuxt/kit'

export interface ModuleOptions {
  /** Load optional base styles for `[data-ai-*]` attributes */
  defaultStyles?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'ai-elements-nuxt',
    configKey: 'aiElements',
  },
  defaults: {
    defaultStyles: false,
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    const categories = ['chatbot', 'code', 'voice', 'workflow', 'utilities']

    for (const category of categories) {
      addComponentsDir({
        path: resolve('./runtime/components', category),
        prefix: 'Ai',
        pathPrefix: false,
      })
    }

    addImportsDir(resolve('./runtime/composables'))
    addImportsDir(resolve('./runtime/utils'))

    nuxt.options.alias['#ai-elements'] = resolve('./runtime')

    if (options.defaultStyles) {
      nuxt.options.css.push(resolve('./runtime/assets/ai-elements.css'))
    }
  },
})
