import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
  },
}).append({
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/require-default-prop': 'off',
    '@typescript-eslint/unified-signatures': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'unicorn/prefer-number-properties': 'off',
    'vue/no-v-html': 'warn',
    'vue/attributes-order': 'warn',
    'vue/html-self-closing': 'warn',
    'regexp/no-super-linear-backtracking': 'warn',
  },
})
