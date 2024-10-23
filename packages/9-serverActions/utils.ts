import escapeHtml from 'escape-html'

function isObject(source: unknown): source is Record<string, any> {
  return typeof source === 'object' && source !== null
}

export async function renderJSXToHTML(jsx: unknown) {
  if (typeof jsx === 'string' || typeof jsx === 'number') {
    return escapeHtml(`${jsx}`)
  } else if (jsx === null || jsx === undefined || typeof jsx === 'boolean') {
    return ''
  } else if (Array.isArray(jsx)) {
    const childrenHtml = await Promise.all(
      jsx.map((child) => renderJSXToHTML(child)),
    )
    let html = ''
    let wasTextNode = false
    let isTextNode = false
    for (let i = 0; i < jsx.length; i++) {
      isTextNode = typeof jsx[i] === 'string' || typeof jsx[i] === 'number'
      if (wasTextNode && isTextNode) {
        html += '<!-- -->'
      }
      html += childrenHtml[i]
      wasTextNode = isTextNode
    }
    return html
    // return childrenHtml.join('')
  } else if (isObject(jsx)) {
    if (jsx.$$typeof === Symbol.for('react.element')) {
      // normal html element
      if (typeof jsx.type === 'string') {
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
        html += await renderJSXToHTML(jsx.props.children)
        html += `</${jsx.type}>`
        html = html.replace(/className/g, 'class')
        return html
      }
      // custom component
      else if (typeof jsx.type === 'function') {
        const Component = jsx.type
        const props = jsx.props
        const returnedJsx = await Component(props)
        return renderJSXToHTML(returnedJsx)
      }
      // fallback
      else {
        throw new Error('Type not implemented.')
      }
    } else {
      throw new Error('Cannot render an object.')
    }
  } else {
    throw new Error('Type not implemented.')
  }
}

export async function renderJSXToClientJSX(jsx: unknown) {
  if (
    typeof jsx === 'string' ||
    typeof jsx === 'number' ||
    typeof jsx === 'boolean' ||
    jsx === null ||
    jsx === undefined
  ) {
    return jsx
  } else if (Array.isArray(jsx)) {
    return Promise.all(jsx.map((child) => renderJSXToClientJSX(child)))
  } else if (isObject(jsx)) {
    if (jsx.$$typeof === Symbol.for('react.element')) {
      if (typeof jsx.type === 'string') {
        return { ...jsx, props: await renderJSXToClientJSX(jsx.props) }
      } else if (typeof jsx.type === 'function') {
        const Component = jsx.type
        const props = jsx.props
        const returnedJsx = await Component(props)
        return renderJSXToClientJSX(returnedJsx)
      } else {
        throw new Error('Type not implemented.')
      }
    } else {
      return Object.fromEntries(
        await Promise.all(
          Object.entries(jsx).map(async ([propName, value]) => [
            propName,
            await renderJSXToClientJSX(value),
          ]),
        ),
      )
    }
  } else {
    throw new Error('Type not implemented.')
  }
}

export function stringifyJSX(key: string, value: unknown) {
  if (value === Symbol.for('react.element')) {
    return '$RE'
  } else if (typeof value === 'string' && value.startsWith('$')) {
    return `$${value}`
  } else {
    return value
  }
}

export function parseJSX(_key: string, value: unknown) {
  if (value === '$RE') {
    return Symbol.for('react.element')
  } else if (typeof value === 'string' && value.startsWith('$')) {
    return value.slice(1)
  } else {
    return value
  }
}
