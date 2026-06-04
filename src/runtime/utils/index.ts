export {
  isAiToolInProgress,
  isAiToolComplete,
  isAiToolFailed,
  isAiToolApprovalRequested,
} from '../types'
export type { AiToolUIPartState, AiToolApproval } from '../types'

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function getFileTypeFromMime(mimeType: string): 'image' | 'video' | 'audio' | 'document' | 'file' {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.startsWith('application/pdf') || mimeType.startsWith('text/')) return 'document'
  return 'file'
}
