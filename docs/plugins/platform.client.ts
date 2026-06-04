export default defineNuxtPlugin(() => {
  if (/Mac|iPhone|iPad/i.test(navigator.platform)) {
    document.documentElement.classList.add('mac')
  }
})
