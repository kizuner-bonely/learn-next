/* eslint-disable @next/next/no-head-element */
import { readFile } from 'fs/promises'
import React from 'react'

import { BlogPostPage } from './components'
import { renderJSXToHTML } from './utils'

export async function generateHtml() {
  const author = 'hh'
  const postContent = await readFile('./posts/hello.txt', 'utf-8')

  return renderJSXToHTML(
    <BlogPostPage postContent={postContent} author={author} />,
  )
}
