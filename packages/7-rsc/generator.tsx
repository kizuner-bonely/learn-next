/* eslint-disable @next/next/no-head-element */
import { readFile, readdir } from 'fs/promises'
import React from 'react'

import { Layout, IndexPage, PostPage } from './components'
import { renderJSXToHTML } from './utils'

async function matchRoute(url: URL) {
  if (url.pathname === '/') {
    const files = await readdir('./posts')
    const slugs = files.map((file) => file.slice(0, file.lastIndexOf('.')))
    const contents = await Promise.all(
      slugs.map((slug) => readFile(`./posts/${slug}.txt`, 'utf-8')),
    )
    return <IndexPage slugs={slugs} contents={contents} />
  } else {
    const slug = url.pathname.slice(1)
    const content = await readFile(`./posts/${slug}.txt`, 'utf-8')
    return <PostPage slug={slug} content={content} />
  }
}

export async function generateHtml(url: URL) {
  const page = await matchRoute(url)
  return renderJSXToHTML(<Layout>{page}</Layout>)
}
