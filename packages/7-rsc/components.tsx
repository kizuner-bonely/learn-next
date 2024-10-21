/* eslint-disable @next/next/no-head-element */
/* eslint-disable @next/next/no-sync-scripts */
import { readFile } from 'fs/promises'
import React from 'react'

type RoutePageProps = {
  slugs: string[]
  contents: string[]
}

export function Layout({ children }: { children: JSX.Element }) {
  const author = 'hh'
  return (
    <html>
      <head>
        <title>My blog</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="p-5">
        <nav className="flex items-center justify-center gap-10 text-blue-600">
          <a href="/">Home</a>
        </nav>
        <input
          required
          className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
        <main>{children}</main>
        <Footer author={author} />
      </body>
    </html>
  )
}

export function IndexPage({ slugs }: RoutePageProps) {
  return (
    <section>
      <h1>Blog List:</h1>
      <div>
        {slugs.map((slug, idx) => (
          // @ts-expect-error ignore
          <Post key={idx} slug={slug} />
        ))}
      </div>
    </section>
  )
}

export function PostPage({ slug }: { slug: string; content: string }) {
  // @ts-expect-error ignore
  return <Post slug={slug} />
}

async function Post({ slug }: { slug: string }) {
  const content = await readFile(`./posts/${slug}.txt`, 'utf-8')
  return (
    <section>
      <a className="text-blue-600" href={'/' + slug}>
        {slug}
      </a>
      <article className="h-40 mt-5 flex-1 rounded-xl bg-indigo-500 text-white flex items-center justify-center">
        {content}
      </article>
    </section>
  )
}

export function Footer({ author }: { author: string }) {
  return (
    <footer className="h-20 mt-5 flex-1 rounded-xl bg-cyan-500 text-white flex items-center justify-center">
      (c) {author}, {new Date().getFullYear()}
    </footer>
  )
}
