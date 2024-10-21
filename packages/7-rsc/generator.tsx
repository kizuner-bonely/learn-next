import { readFile, readdir } from 'fs/promises'
import React from 'react'

import { Layout, IndexPage, PostPage } from './components'
import { renderJSXToHTML } from './utils'

export async function generateHtml(url: URL) {
  // @ts-expect-error ignore
  return renderJSXToHTML(<Router url={url} />)
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
