import express from 'express'
import { readFile } from 'fs/promises'
import { renderToString } from 'react-dom/server'

import { parseJSX } from '../utils'

const app = express()

app.get('/:route(*)', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)

  if (req.url === '/favicon.ico') {
    res.status(204).end()
    return
  }

  if (url.pathname === '/client.js') {
    const content = await readFile('./client.js', 'utf-8')
    res.setHeader('Content-Type', 'text/javascript')
    res.end(content)
    return
  }

  // client jsx object
  const response = await fetch(`http://127.0.0.1:3001${url.pathname}`)
  if (!response.ok) {
    res.statusCode = response.status
    res.end()
    return
  }

  const clientJSXString = await response.text()
  if (url.searchParams.has('jsx')) {
    res.setHeader('Content-Type', 'application/json')
    res.end(clientJSXString)
  } else {
    const clientJSX = JSON.parse(clientJSXString, parseJSX)
    let html = renderToString(clientJSX)
    html = html.replace('</body>', '')
    html += '<script>window.__INITIAL_CLIENT_JSX_STRING__ ='
    html += JSON.stringify(clientJSXString).replace(/</g, '\\u003c')
    html += '</script>'
    html += `
<script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@18.3.1",
      "react-dom/client": "https://esm.sh/react-dom@18.3.1/client?dev"
    }
  }
</script>
`
    html += '<script type="module" src="/client.js"></script>'
    html += '</body>'
    res.setHeader('Content-Type', 'text/html')
    res.end(html)
  }
})

app.listen(3000, () => {
  console.log('Server started at http://localhost:3000')
})
