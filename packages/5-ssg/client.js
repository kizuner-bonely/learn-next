import React from 'react'
import { hydrateRoot } from 'react-dom/client'

import App from './pages'

hydrateRoot(document.getElementById('root'), <App {...window.__DATA__} />)
