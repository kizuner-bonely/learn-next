import React from 'react'
import { readFile, readdir } from 'fs/promises'

import { Layout, IndexPage, PostPage } from './components'
import { renderJSXToHTML, renderJSXToClientJSX, stringifyJSX } from './utils'

export async function jsxGenerator(url: URL) {
  // @ts-expect-error ignore
  const clientJSX = await renderJSXToClientJSX(<Router url={url} />)
  const clientJSXString = JSON.stringify(clientJSX, stringifyJSX)
  return clientJSXString
}

export async function generateHtml(url: URL) {
  // @ts-expect-error ignore
  const _html = await renderJSXToHTML(<Router url={url} />)
  return _html.replace(/<\/body>/, '<script src="/client.js"></script></body>')
}

async function Router({ url }: { url: URL }) {
  let page: JSX.Element = <></>
  if (url.pathname === '/') {
    const files = await readdir('./posts')
    const slugs = files.map((file) => file.slice(0, file.lastIndexOf('.')))
    const contents = await Promise.all(
      slugs.map((slug) => readFile(`./posts/${slug}.txt`, 'utf-8')),
    )
    page = <IndexPage slugs={slugs} contents={contents} />
  } else {
    const slug = url.pathname.slice(1)
    const content = await readFile(`./posts/${slug}.txt`, 'utf-8')
    page = <PostPage slug={slug} content={content} />
  }

  return <Layout>{page}</Layout>
}
