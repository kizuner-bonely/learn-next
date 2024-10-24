import { createElement, use, useState, startTransition } from 'react'
import { createFromFetch } from 'react-server-dom-webpack'
import { readFile, writeFile } from 'fs/promises'
import { hydrateRoot } from 'react-dom/client'
import path from 'path'

const clientJSXCache = {}
let currentPathname = window.location.pathname
let updateRoot = null

const data = createFromFetch(fetch(`${currentPathname}?jsx`))

hydrateRoot(document, createElement(Shell, { data }))

export async function renderJSXToClientJSX(jsx) {
  if (
    typeof jsx === 'string' ||
    typeof jsx === 'number' ||
    typeof jsx === 'boolean' ||
    jsx === null
  ) {
    return jsx
  } else if (Array.isArray(jsx)) {
    return Promise.all(jsx.map((child) => renderJSXToClientJSX(child)))
  } else if (jsx !== null && typeof jsx === 'object') {
    if (jsx.$$typeof === Symbol.for('react.element')) {
      if (typeof jsx.type === 'string') {
        return {
          ...jsx,
          props: await renderJSXToClientJSX(jsx.props),
        }
      } else if (typeof jsx.type === 'function') {
        const Component = jsx.type
        const props = jsx.props
        const isClientComponent = Component.toString().includes('use client')
        if (isClientComponent) {
          return await transformClientComponent(Component, props)
        } else {
          const returnedJSX = await Component(props)
          return renderJSXToClientJSX(returnedJSX)
        }
      } else {
        throw new Error('unknown jsx.type')
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
    throw new Error('type not implemented')
  }
}

async function transformClientComponent(Component, props) {
  const raw = Component.toString()
  const children = await renderJSXToClientJSX(props.children)

  const clientComponent = {
    value: raw,
    props: {
      ...props,
      'data-client': true,
      'data-component': Component.name,
      children,
    },
  }

  await createClientComponentJS(clientComponent)

  return createElement('div', {
    'data-client': true,
    'data-component': Component.name,
  })
}

async function createClientComponentJS(Component) {
  const { props, value } = Component
  const name = props['data-component']
  const filenameRaw = path.join(process.cwd(), 'public', 'client', `${name}.js`)
  const filename = path.normalize(filenameRaw)
  const fileContents = `
import React from 'react'
export const props = ${JSON.stringify(props)}
export const jsx = ${value.replaceAll('import_react.default', 'React')}
`
  try {
    await writeFile(filename, fileContents)
  } catch (err) {
    console.error('err in writeComponentToDisk', err)
  }
}

function Shell({ data }) {
  console.log('Shell', data)
  const [root, setRoot] = useState(use(data))
  clientJSXCache[currentPathname] = root
  updateRoot = setRoot
  return root
}

async function navigate(pathname, revalidate) {
  currentPathname = pathname
  if (!revalidate && clientJSXCache[pathname]) {
    updateRoot(clientJSXCache[pathname])
    return
  } else {
    const response = fetch(`${pathname}?jsx`)
    const root = await createFromFetch(response)
    clientJSXCache[pathname] = root
    startTransition(() => {
      updateRoot(root)
    })
  }
}

window.addEventListener(
  'click',
  (e) => {
    const target = e.target

    // ignore clicks beyond a tag
    if (target?.tagName !== 'A') return

    // ignore "open in a new tab"
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

    // ignore links with target="_blank"
    const href = target?.getAttribute('href') ?? ''
    if (!href.startsWith('/')) return

    // prevent the default behavior
    e.preventDefault()

    // update the URL
    window.history.pushState(null, '', href)

    navigate(href)
  },
  true,
)

window.addEventListener('submit', async (e) => {
  const action = e.target.action
  const actionURL = new URL(action, window.location.origin)

  if (!actionURL.pathname.startsWith('/actions/')) return

  e.preventDefault()

  if (e.target.method === 'post') {
    const formData = new FormData(e.target)
    const body = Object.fromEntries(formData.entries())
    const response = await fetch(action, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) return
    navigate(window.location.pathname, true)
    return
  } else {
    console.error('unknown method', e.target.method)
  }
})
