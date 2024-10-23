import { createElement, use, useState, startTransition } from 'react'
import { createFromFetch } from 'react-server-dom-webpack'
import { hydrateRoot } from 'react-dom/client'

const clientJSXCache = {}
let currentPathname = window.location.pathname
let updateRoot = null

const data = createFromFetch(fetch(`${currentPathname}?jsx`))

hydrateRoot(document, createElement(Shell, { data }))

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
