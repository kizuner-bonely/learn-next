import React from 'React'
import { hydrateRoot } from 'react-dom/client'

const { props, page } = window.__DATA__
const Component = (await import(`./pages/${page}.js`)).default

hydrateRoot(document.getElementById('root'), <Component {...props} />)
