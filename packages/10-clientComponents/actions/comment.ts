import { readFile, writeFile } from 'fs/promises'

export default async function postComment(req) {
  const { slug, comment } = req.body
  let comments: Array<{ content: string }> = []

  try {
    const commentData = await readFile(`./comments/${slug}.json`, 'utf-8')
    comments = JSON.parse(commentData)
  } catch (err) {
    if (err.code === 'ENOENT') {
      comments = []
    } else {
      throw err
    }
  }

  comments.push({ content: comment })
  await writeFile(`./comments/${slug}.json`, JSON.stringify(comments, null, 2))
}
