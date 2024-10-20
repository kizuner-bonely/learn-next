import { renderToString } from 'react-dom/server'
import express from 'express'
import React from 'react'
import path from 'path'
import fs from 'fs'

// Get all pages from the pages directory
const pageDir = path.join(process.cwd(), '/pages')
const pages = fs.readdirSync(pageDir).map((page) => page.split('.')[0])
// Create a server
const app = express()

app.use(express.static('public'))

app.get('*', async (req, res) => {
  const path = req.path.split('/')?.[1]
  const page = path ? path : 'index'

  if (pages.includes(page)) {
    const file = await import(`./pages/${page}.js`)
    const Component = file.default

    let propsObj = {}
    if (file.getServerSideProps) {
      const { props } = await file.getServerSideProps({ query: req.query })
      propsObj = props
    }

    const content = renderToString(<Component {...propsObj} />)

    res.send(`
<html>
  <head>
    <title>Tiny React SSG</title>
  </head>
  <body>
    <div id='root'>${content}</div>
    <script>
      window.__DATA__ = ${JSON.stringify({ props: propsObj, page: page })}
    </script>
    <script src="/client.bundle.js"></script>
  </body>
</html>
`)
  } else {
    return res.status(200).json({ message: `${page} not found in ${pages}` })
  }
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
