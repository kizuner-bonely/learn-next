import { MDXRemote } from 'next-mdx-remote/rsc'
import { readFile } from 'node:fs/promises'
import { to } from 'await-to-js'
import fs from 'fs/promises'
import path from 'path'

type Params = { id: string }

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'posts')
  const filenames = await fs.readdir(postsDirectory)
  return filenames.map((filename) => ({ id: filename.replace(/.mdx?/, '') }))
}

export default async function Home({ params }: { params: Params }) {
  const filePath = path.join(process.cwd(), '/posts/', `${params.id}.mdx`)
  const [readingErr, contents] = await to(readFile(filePath, 'utf-8'))
  if (readingErr) return null

  return (
    <article className="mx-auto max-w-xl py-8 prose prose-slate">
      <MDXRemote source={contents} options={{ parseFrontmatter: true }} />
    </article>
  )
}
