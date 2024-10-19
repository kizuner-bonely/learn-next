import fs from 'fs/promises'
import Link from 'next/link'
import dayjs from 'dayjs'
import path from 'path'

import { getTranslation } from '@i18n'

type Params = { lng: string }

type PostCardProps = {
  title: string
  date: string
  url: string
}

export const generateMetadata = () => {
  return {
    title: 'blog list',
    description: 'This is a blog list',
    openGraph: {
      title: 'blog list',
      description: 'This is a blog list',
    },
  }
}

async function getAllPosts(): Promise<PostCardProps[]> {
  const postsDirectory = path.join(process.cwd(), 'posts')
  const filenames = await fs.readdir(postsDirectory)
  const posts = await Promise.all(
    filenames
      .filter((filename) => filename.endsWith('.mdx'))
      .map(async (filename) => {
        const filePath = path.join(postsDirectory, filename)
        const stat = await fs.stat(filePath)
        return {
          url: `/posts/${filename.replace(/\.mdx$/, '')}`,
          date: stat.mtime.toISOString(),
          title: filename,
        }
      }),
  )
  return posts
}

function PostCard(post: PostCardProps & { lng: string }) {
  const { title, date, url, lng } = post

  return (
    <div className="mb-8">
      <h2 className="mb-1 text-xl">
        <Link
          href={`/${lng}/${url}`}
          className="text-blue-700 hover:text-blue-900 dark:text-blue-400"
        >
          {title}
        </Link>
      </h2>
      <time dateTime={date} className="mb-2 block text-xs text-gray-600">
        {dayjs(date).format('DD/MM/YYYY')}
      </time>
    </div>
  )
}

export default async function Posts({ params }: { params: Params }) {
  const posts = await getAllPosts()
  const { t } = await getTranslation(params.lng)

  console.log('hh blogList', t('blogList'))

  return (
    <div className="mx-auto max-w-xl py-8">
      <h1 className="mb-8 text-center text-2xl font-black">{t('blogList')}</h1>
      {posts.map((post, idx) => {
        return (
          <PostCard key={`${idx}-${post.date}`} {...post} lng={params.lng} />
        )
      })}
    </div>
  )
}
