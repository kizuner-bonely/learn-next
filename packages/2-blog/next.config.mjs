/** @type {import('next').NextConfig} */
import rehypePrismPlus from 'rehype-prism-plus'
import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'

const withMDX = createMDX({
  extension: /\.mdx?/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [rehypePrismPlus, { ignoreMissing: true, defaultLanguage: 'js' }],
    ],
  },
  experimental: { mdxRs: true },
})

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
}

export default withMDX(nextConfig)
