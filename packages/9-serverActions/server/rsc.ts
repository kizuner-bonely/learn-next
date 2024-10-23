import express from 'express'

import { generateJSX } from '../generator'

const app = express()

app.get('/:route(*)', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const { pipe } = generateJSX(url)
  pipe(res)
})

app.listen(3001, () => {
  console.log('Server started at http://localhost:3001')
})
