import express from 'express'
import escapeHtml from 'escape-html'
import { readFile } from 'fs/promises'

async function generateHtml() {
  const author = 'hh'
  const postContent = await readFile('./posts/hello.txt', 'utf-8')

  return `
<html>
  <head>
    <title>My blog</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="p-5">
    <nav class="flex items-center justify-center gap-10 text-blue-600">
      <a href="/">Home</a>
    </nav>
    <article class="h-40 mt-5 flex-1 rounded-xl bg-indigo-500 text-white flex items-center justify-center">
      ${escapeHtml(postContent)}
    </article>
    <footer class="h-20 mt-5 flex-1 rounded-xl bg-cyan-500 text-white flex items-center justify-center">
      (c) ${escapeHtml(author)}, ${new Date().getFullYear()}
    </footer>
  </body>
</html>
`.trim()
}

const app = express()

app.get('/:route(*)', async (req, res) => {
  const html = await generateHtml()
  res.setHeader('Content-Type', 'text/html')
  res.send(html)
})

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`)
})
