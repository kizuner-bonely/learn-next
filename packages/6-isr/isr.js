import express from 'express'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import {
  existsSync,
  readdirSync,
  mkdirSync,
  writeFileSync,
  stat,
} from 'node:fs'

const app = express()
app.use(express.static('public'))

async function asyncForEach(arr, cb) {
  for (let i = 0; i < arr.length; i++) {
    await cb(arr[i], i, arr)
  }
}

const pageDir = join(process.cwd(), '/pages')
const pages = readdirSync(pageDir).map((page) => page.split('.')[0])

const expiresTime = 10 * 1000

async function build() {
  if (!existsSync('output')) {
    mkdirSync('output')
  }

  await asyncForEach(pages, async (page) => {
    const file = await import(`./pages/${page}.js`)
    const Component = file.default

    let propsObj = {}
    if (file.getServerSideProps) {
      const { props } = await file.getServerSideProps()
      propsObj = props
    }

    const content = renderToString(createElement(Component, propsObj))
    writeFileSync(
      `output/${page}.html`,
      `
<html>
    <head>
      <title>Tiny React ISR</title>
    </head>
    <body>
      <div id="root">${content}</div>
      <script>
        window.__DATA__ = ${JSON.stringify({ props: propsObj, page })}
      </script>
      <script src="/client.bundle.js"></script>
    </body>
</html>
    `,
    )
  })
}

app.get(/.*$/, async (req, res) => {
  const path = req.path.split('/')[1]
  const page = path ? path : 'index'

  if (pages.includes(page)) {
    const htmlPath = join('./output', `${page}.html`)
    stat(htmlPath, async (err, stats) => {
      if (err) {
        await build()
        return res.sendFile(join(process.cwd(), `output/${page}.html`))
      }
      if (Date.now() - stats.mtime > expiresTime) {
        await build()
        return res.sendFile(join(process.cwd(), `output/${page}.html`))
      } else {
        return res.sendFile(join(process.cwd(), `output/${page}.html`))
      }
    })
  } else {
    return res.status(200).json({ message: `${page} not found in ${pages}` })
  }
})

app.listen(3000, () => {
  console.log('Server started at http://localhost:3000')
})
