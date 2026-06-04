const ALLOWED_LINK_PROTOCOLS = /^(?:https?:|mailto:|\/|#)/i

/** Reject dangerous URL schemes in rendered HTML links. */
export function sanitizeHref(href: string): string | null {
  const trimmed = href.trim()
  if (!trimmed) return null
  const lower = trimmed.toLowerCase()
  if (
    lower.startsWith('javascript:')
    || lower.startsWith('data:')
    || lower.startsWith('vbscript:')
    || lower.startsWith('file:')
  ) {
    return null
  }
  if (ALLOWED_LINK_PROTOCOLS.test(trimmed)) {
    return trimmed
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
  }
  if (!trimmed.includes(':')) {
    return trimmed
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
  }
  return null
}

/** Strip unsafe `href` values from HTML before `v-html` rendering. */
export function sanitizeRenderedHtml(html: string): string {
  return html.replace(
    /\shref\s*=\s*(?:"([^"]*)"|'([^']*)')/gi,
    (_match, d1: string, d2: string) => {
      const href = d1 ?? d2 ?? ''
      const safe = sanitizeHref(href)
      if (!safe) return ' href="#"'
      return ` href="${safe}"`
    },
  )
}
