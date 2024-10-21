import express from 'express'

import { generateHtml } from './generator'

const app = express()

app.get('/:route(*)', async (req, res) => {
  const html = await generateHtml()
  res.setHeader('Content-Type', 'text/html')
  res.end(html)
})

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`)
})
