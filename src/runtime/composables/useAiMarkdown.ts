import { computed, unref, type MaybeRef } from 'vue'
import { marked } from 'marked'
import { sanitizeHref, sanitizeRenderedHtml } from '../utils/sanitizeHtml'

export interface UseAiMarkdownOptions {
  /** Custom parser; defaults to GFM via `marked` */
  parse?: (markdown: string) => string
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function parseInline(text: string): string {
  let html = escapeHtml(text)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, href: string) => {
    const safe = sanitizeHref(href)
    if (!safe) return label
    return `<a href="${safe}" target="_blank" rel="noopener noreferrer">${label}</a>`
  })
  return html
}

/**
 * Lightweight regex-based markdown parser (no `marked` features like GFM tables).
 */
export function simpleParse(markdown: string): string {
  if (!markdown) return ''

  const lines = markdown.split('\n')
  const blocks: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    const fenceMatch = line.match(/^```(\w*)\s*$/)
    if (fenceMatch) {
      const lang = fenceMatch[1] || 'text'
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(escapeHtml(lines[i]))
        i++
      }
      i++
      blocks.push(
        `<pre data-ai-markdown-code data-language="${escapeHtml(lang)}"><code>${codeLines.join('\n')}</code></pre>`,
      )
      continue
    }

    const headingMatch = line.match(/^(#{1,6})[ \t]+(\S(?:.*\S)?)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      blocks.push(`<h${level}>${parseInline(headingMatch[2])}</h${level}>`)
      i++
      continue
    }

    if (/^(?:-{3,}|\*{3,}|_{3,})[ \t]*$/.test(line)) {
      blocks.push('<hr>')
      i++
      continue
    }

    if (line.startsWith('> ')) {
      const quoteLines: string[] = []
      while (i < lines.length && (lines[i].startsWith('> ') || lines[i] === '>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      blocks.push(`<blockquote><p>${parseInline(quoteLines.join(' '))}</p></blockquote>`)
      continue
    }

    if (/^[-*+]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*+]\s+/.test(lines[i])) {
        items.push(`<li>${parseInline(lines[i].replace(/^[-*+]\s+/, ''))}</li>`)
        i++
      }
      blocks.push(`<ul>${items.join('')}</ul>`)
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(`<li>${parseInline(lines[i].replace(/^\d+\.\s+/, ''))}</li>`)
        i++
      }
      blocks.push(`<ol>${items.join('')}</ol>`)
      continue
    }

    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/)
    if (imageMatch) {
      const safe = sanitizeHref(imageMatch[2])
      if (safe) {
        blocks.push(
          `<img src="${safe}" alt="${escapeHtml(imageMatch[1])}" data-ai-markdown-image />`,
        )
      }
      i++
      continue
    }

    if (!line.trim()) {
      i++
      continue
    }

    const paraLines: string[] = []
    while (
      i < lines.length
      && lines[i].trim()
      && !lines[i].match(/^#{1,6}\s/)
      && !lines[i].startsWith('```')
      && !/^[-*+]\s+/.test(lines[i])
      && !/^\d+\.\s+/.test(lines[i])
      && !lines[i].startsWith('> ')
    ) {
      paraLines.push(lines[i])
      i++
    }
    blocks.push(`<p>${parseInline(paraLines.join(' '))}</p>`)
  }

  return blocks.join('\n') || ''
}

function addMarkdownDataAttributes(html: string): string {
  return html
    .replace(/<pre>/g, '<pre data-ai-markdown-code>')
    .replace(/<table>/g, '<table data-ai-markdown-table>')
    .replace(/<ul>/g, '<ul data-ai-markdown-list>')
    .replace(/<ol>/g, '<ol data-ai-markdown-list>')
    .replace(/<blockquote>/g, '<blockquote data-ai-markdown-quote>')
    .replace(/<img /g, '<img data-ai-markdown-image ')
}

function defaultParse(markdown: string): string {
  if (!markdown) return ''
  const raw = marked.parse(markdown, { async: false, gfm: true, breaks: true }) as string
  return sanitizeRenderedHtml(addMarkdownDataAttributes(raw))
}

marked.setOptions({ gfm: true, breaks: true })

/**
 * Converts markdown to HTML for use with {@link AiMarkdown} or custom renderers.
 */
export function useAiMarkdown(
  content: MaybeRef<string>,
  options?: UseAiMarkdownOptions,
) {
  const parse = options?.parse ?? defaultParse

  const html = computed(() => parse(unref(content)))

  return { html }
}
