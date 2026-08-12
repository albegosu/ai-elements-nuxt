import { ref } from 'vue'
import type { AiScreenshotCapture } from '../types'

/**
 * Capture a screenshot of the current screen/tab/window via the Screen Capture
 * API (`getDisplayMedia`). Grabs a single frame, encodes it as PNG, and stops
 * the capture track. Returns `null` when unsupported or the user cancels.
 *
 * Mirrors Vercel's `PromptInputActionAddScreenshot` for visual model feedback.
 */
export function useScreenshotCapture() {
  const capturing = ref(false)
  const error = ref<Error | null>(null)

  async function capture(): Promise<AiScreenshotCapture | null> {
    error.value = null

    if (
      typeof navigator === 'undefined'
      || !navigator.mediaDevices
      || typeof navigator.mediaDevices.getDisplayMedia !== 'function'
    ) {
      error.value = new Error('Screen capture is not supported in this environment')
      return null
    }

    capturing.value = true
    let stream: MediaStream | null = null
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
      const video = document.createElement('video')
      video.srcObject = stream
      await video.play()

      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth || 1280
      canvas.height = video.videoHeight || 720
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Could not get 2D canvas context')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      const blob = await new Promise<Blob | null>(resolve =>
        canvas.toBlob(resolve, 'image/png'),
      )
      if (!blob) throw new Error('Failed to encode screenshot')

      const dataUrl = canvas.toDataURL('image/png')
      const file = new File([blob], `screenshot-${Date.now()}.png`, { type: 'image/png' })
      return { dataUrl, blob, file }
    }
    catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      return null
    }
    finally {
      stream?.getTracks().forEach(track => track.stop())
      capturing.value = false
    }
  }

  return { capture, capturing, error }
}
