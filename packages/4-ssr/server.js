import { renderToString } from 'react-dom/server'
import express from 'express'
import React from 'react'

import App from './pages'

const app = express()
const content = renderToString(<App />)

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send(`
<html>
  <head>
    <title>Tiny React SSR</title>
  </head>
  <body>
    <div id='root'>${content}</div>
    <script src="/client.bundle.js"></script>
  </body>
</html>
`)
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
