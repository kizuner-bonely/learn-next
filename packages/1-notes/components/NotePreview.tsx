import sanitizeHtml from 'sanitize-html'
import { merge } from 'es-toolkit'
import { marked } from 'marked'

const allowedTags = sanitizeHtml.defaults.allowedTags.concat([
  'img',
  'h1',
  'h2',
  'h3',
])

const allowedAttributes = merge(sanitizeHtml.defaults.allowedAttributes, {
  img: ['alt', 'src'],
})

export default function NotePreview(props: { children: string }) {
  const { children } = props
  const _html = marked(children || '') as string

  return (
    <div className="note-preview">
      <div
        className="text-with-markdown"
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(_html, { allowedTags, allowedAttributes }),
        }}
      />
    </div>
  )
}
