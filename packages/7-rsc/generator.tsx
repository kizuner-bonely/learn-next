/* eslint-disable @next/next/no-head-element */
import { readFile } from 'fs/promises'
import React from 'react'

import { renderJSXToHTML } from './utils'

export async function generateHtml() {
  const author = 'hh'
  const postContent = await readFile('./posts/hello.txt', 'utf-8')

  const jsx = (
    <html>
      <head>
        <title>My blog</title>
        <script async src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="p-5">
        <nav className="flex items-center justify-center gap-10 text-blue-600">
          <a href="/">Home</a>
        </nav>
        <article className="h-40 mt-5 flex-1 rounded-xl bg-indigo-500 text-white flex items-center justify-center">
          {postContent}
        </article>
        <footer className="h-20 mt-5 flex-1 rounded-xl bg-cyan-500 text-white flex items-center justify-center">
          (c) {author}, {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  )

  return renderJSXToHTML(jsx)
}
