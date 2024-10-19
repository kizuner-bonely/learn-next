import { compileMDX } from 'next-mdx-remote/rsc'
import { readFile } from 'node:fs/promises'
import { to } from 'await-to-js'
import path from 'path'

type Params = { id: string }

async function getMDXContent(name: string) {
  const filePath = path.join(process.cwd(), '/posts/', `${name}.mdx`)
  const [err, contents] = await to(readFile(filePath, 'utf-8'))
  if (err) return null
  return await compileMDX({
    source: contents,
    options: { parseFrontmatter: true },
  })
}

type GenerateMetaDataProps = { params: Params; searchParams: string }
export async function generateMetaData({ params }: GenerateMetaDataProps) {
  const res = await getMDXContent(params.id)
  if (!res) return { title: '' }
  const { frontmatter } = res
  return { title: frontmatter.title }
}

export default async function Home({ params }: { params: Params }) {
  const res = await getMDXContent(params.id)
  if (!res) return <h1>Page not found!</h1>
  const { content } = res
  return content
}
