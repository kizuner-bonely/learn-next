import escapeHtml from 'escape-html'

function isObject(source: unknown): source is Record<string, any> {
  return typeof source === 'object' && source !== null
}

export function renderJSXToHTML(jsx: unknown) {
  if (typeof jsx === 'string' || typeof jsx === 'number') {
    return escapeHtml(`${jsx}`)
  } else if (jsx === null || jsx === undefined || typeof jsx === 'boolean') {
    return ''
  } else if (Array.isArray(jsx)) {
    return jsx.map((child) => renderJSXToHTML(child)).join('')
  } else if (isObject(jsx)) {
    if (jsx.$$typeof === Symbol.for('react.element')) {
      let html = `<${jsx.type}`
      for (const propName in jsx.props) {
        if (jsx.props.hasOwnProperty(propName) && propName !== 'children') {
          html += ' '
          html += propName
          html += '='
          html += `"${escapeHtml(jsx.props[propName])}"`
        }
      }
      html += '>'
      html += renderJSXToHTML(jsx.props.children)
      html += `</${jsx.type}>`
      html = html.replace(/className/g, 'class')
      return html
    } else {
      throw new Error('Cannot render an object.')
    }
  } else {
    throw new Error('Type not implemented.')
  }
}
