import express from 'express'
import { readFile } from 'fs/promises'

import { generateHtml } from './generator'

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
  } else {
    const html = await generateHtml(url)
    res.setHeader('Content-Type', 'text/html')
    res.end(html)
  }
})

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`)
})
