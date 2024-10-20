import React from 'react'
import { hydrateRoot } from 'react-dom/client'

const { props, page } = window.__DATA__

async function importFile(path) {
  return await import(`./pages/${path}.js`)
}

const data = await importFile(page)
const Component = data.default

hydrateRoot(document.getElementById('root'), <Component {...props} />)
