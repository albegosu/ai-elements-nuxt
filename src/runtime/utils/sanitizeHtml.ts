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

/** HTML void elements — never need a closing tag. */
const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
])

/**
 * Auto-close tags left open by a partial/streaming markup string.
 *
 * Discards a trailing tag cut off mid-declaration (an unterminated `<…` with no
 * closing `>`), then appends closing tags for every element still on the stack.
 * Used by {@link AiJsxPreview} so streamed markup renders without flashing.
 */
export function closeUnclosedTags(html: string): string {
  if (!html) return ''

  // Drop a trailing incomplete tag (`<div class="` with no closing `>`).
  const lastLt = html.lastIndexOf('<')
  const lastGt = html.lastIndexOf('>')
  const working = lastLt > lastGt ? html.slice(0, lastLt) : html

  const stack: string[] = []
  const tagRe = /<(\/?)([a-z][a-z0-9-]*)(?:\s[^>]*?)?(\/?)>/gi
  let match: RegExpExecArray | null
  while ((match = tagRe.exec(working)) !== null) {
    const closing = match[1] === '/'
    const name = match[2].toLowerCase()
    const selfClosing = match[3] === '/'
    if (VOID_ELEMENTS.has(name) || selfClosing) continue
    if (closing) {
      const idx = stack.lastIndexOf(name)
      if (idx !== -1) stack.splice(idx)
    }
    else {
      stack.push(name)
    }
  }

  let result = working
  for (let i = stack.length - 1; i >= 0; i--) {
    result += `</${stack[i]}>`
  }
  return result
}

/** Elements stripped wholesale (with any content) before rendering markup. */
const DANGEROUS_ELEMENTS = 'script|style|iframe|object|embed|link|meta|base'

/**
 * Sanitize arbitrary markup for `v-html`: strips dangerous elements, inline
 * event handlers, and `javascript:` URLs, then normalizes `href` values.
 *
 * Regex-based (matches the library's lightweight approach). For fully untrusted
 * input, pass a dedicated sanitizer via the component's `sanitize` prop.
 */
export function sanitizeMarkup(html: string): string {
  if (!html) return ''
  let out = html
  // Remove dangerous elements including their content.
  out = out.replace(
    new RegExp(`<(${DANGEROUS_ELEMENTS})\\b[^>]*>[\\s\\S]*?<\\/\\1>`, 'gi'),
    '',
  )
  // Remove any remaining (self-closing / unclosed) dangerous element openers.
  out = out.replace(
    new RegExp(`<\\/?(?:${DANGEROUS_ELEMENTS})\\b[^>]*>?`, 'gi'),
    '',
  )
  // Strip inline event handlers (onclick, onload, …).
  out = out.replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  // Neutralize javascript: in URL-bearing attributes.
  out = out.replace(
    /((?:src|href|xlink:href|action|formaction)\s*=\s*)(?:"javascript:[^"]*"|'javascript:[^']*'|javascript:[^\s>]+)/gi,
    '$1"#"',
  )
  return sanitizeRenderedHtml(out)
}
