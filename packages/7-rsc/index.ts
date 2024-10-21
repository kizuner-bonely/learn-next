import express from 'express'

import { generateHtml } from './generator'

const app = express()

app.get('/:route(*)', async (req, res) => {
  if (req.url === '/favicon.ico') {
    res.status(204).end()
    return
  }
  const url = new URL(req.url, `http://${req.headers.host}`)
  const html = await generateHtml(url)
  res.setHeader('Content-Type', 'text/html')
  res.end(html)
})

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`)
})
