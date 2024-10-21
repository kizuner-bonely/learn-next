import express from 'express'

import { generateJSX } from '../generator'

const app = express()

app.get('/:route(*)', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const clientJSXString = await generateJSX(url)
  res.setHeader('Content-Type', 'text/javascript')
  res.end(clientJSXString)
})

app.listen(3001, () => {
  console.log('Server started at http://localhost:3001')
})
