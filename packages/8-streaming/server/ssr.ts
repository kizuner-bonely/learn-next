import express from 'express'
import fetch from 'node-fetch'
import { readFile } from 'fs/promises'
import { renderToPipeableStream } from 'react-dom/server'
// @ts-expect-error no types
import { createFromNodeStream } from 'react-server-dom-webpack/client'

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

  // get the client jsx object
  const response = await fetch(`http://127.0.0.1:3001${url.pathname}`)
  if (!response.ok) {
    res.statusCode = response.status
    res.end()
    return
  }

  const stream = response.body!

  if (url.searchParams.has('jsx')) {
    // jsx
    res.setHeader('Content-Type', 'text/x-component')
    stream.on('data', (data) => res.write(data))
    stream.on('end', () => res.end())
  } else {
    // html
    const root = await createFromNodeStream(stream, {})
    res.set('Content-Type', 'text/html')
    const { pipe } = renderToPipeableStream(root)
    pipe(res)
  }
})

app.listen(3000, () => {
  console.log('Server started at http://localhost:3000')
})
