import { hydrateRoot } from 'react-dom/client'

let currentPathname = window.location.pathname
const root = hydrateRoot(document, getInitialClientJSX())

function getInitialClientJSX() {
  return JSON.parse(window.__INITIAL_CLIENT_JSX_STRING__, parseJSX)
}

async function navigate(pathname) {
  currentPathname = pathname
  //* get the jsx after navigating to the new page
  const clientJSX = await fetchClientJSX(pathname)
  if (pathname === currentPathname) {
    root.render(clientJSX)
  }

  //* replace the html forcefully
  // if (pathname === currentPathname) {
  //   const res = /<body(.*?)>/.exec(html)
  //   const bodyStartIndex = res.index + res[0].length
  //   const bodyEndIndex = html.lastIndexOf('</body>')
  //   const bodyHTML = html.slice(bodyStartIndex, bodyEndIndex)
  //   document.body.innerHTML = bodyHTML
  // }
}

async function fetchClientJSX(pathname) {
  const response = await fetch(`${pathname}?jsx`)
  const clientJSXString = await response.text()
  const clientJSX = JSON.parse(clientJSXString, parseJSX)
  return clientJSX
}

function parseJSX(key, value) {
  if (value === '$RE') {
    return Symbol.for('react.element')
  } else if (typeof value === 'string' && value.startsWith('$$')) {
    return value.slice(1)
  } else {
    return value
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
