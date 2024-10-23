import React from 'react'
import { readFile } from 'fs/promises'
import { renderToString } from 'react-dom/server'
import { renderToPipeableStream } from 'react-server-dom-webpack/server.node'

import { Layout, IndexPage, PostPage } from './components'
import { renderJSXToClientJSX, stringifyJSX } from './utils'

export function generateJSX(url: URL) {
  // return a RSC payload rather than a jsx string
  // @ts-expect-error ignore
  return renderToPipeableStream(<Router url={url} />)
}

export async function generateHtml(url: URL) {
  // @ts-expect-error ignore
  const clientJSX = await renderJSXToClientJSX(<Router url={url} />)
  const clientJSXString = JSON.stringify(clientJSX, stringifyJSX)
  let html = renderToString(clientJSX)

  // add importmap and client.js script
  html = html.replace('</body>', '')
  html += '<script>window.__INITIAL_CLIENT_JSX_STRING__ ='
  html += JSON.stringify(clientJSXString).replace(/</g, '\\u003c')
  html += '</script>'
  html += `
<script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@18.3.1",
      "react-dom/client": "https://esm.sh/react-dom@18.3.1/client?dev"
    }
  }
</script>
`
  html += '<script type="module" src="/client.js"></script>'
  html += '</body>'

  return html
}

async function Router({ url }: { url: URL }) {
  let page: JSX.Element = <></>
  if (url.pathname === '/') {
    // @ts-expect-error ignore
    page = <IndexPage />
  } else {
    const slug = url.pathname.slice(1)
    const content = await readFile(`./posts/${slug}.txt`, 'utf-8')
    page = <PostPage slug={slug} content={content} />
  }

  return <Layout>{page}</Layout>
}
