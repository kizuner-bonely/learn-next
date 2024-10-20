'use server'
import { mkdir, stat, writeFile } from 'fs/promises'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import dayjs from 'dayjs'
import mime from 'mime'
import path from 'path'
import { z } from 'zod'

import { addNote, updateNote, delNote } from '@lib/redis'
import { sleep } from '@/lib/utils'

const schema = z.object({
  title: z.string(),
  content: z.string().min(1, '内容不能为空').max(100, '内容不能超过100个字符'),
})

type FormState = {
  message?: string
  errors?: z.ZodIssue[]
}

export async function saveNote(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const noteId = formData.get('noteId') as string

  const data = {
    title: formData.get('title'),
    content: formData.get('body'),
    updateTime: new Date(),
  }

  // 校验数据
  const validation = schema.safeParse(data)
  if (!validation.success) {
    return { errors: validation.error.issues }
  }

  // 模拟请求延时
  await sleep(2000)

  if (noteId) {
    updateNote(noteId, JSON.stringify(data))
    revalidatePath('/', 'layout')
  } else {
    await addNote(JSON.stringify(data))
    revalidatePath('/', 'layout')
  }

  return { message: 'Add successfully' }
}

export async function deleteNote(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const noteId = formData.get('noteId') as string

  delNote(noteId)
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function importNote(formData: FormData) {
  const file = formData.get('file') as File

  // 空值校验
  if (!file) {
    return { error: 'File is required' }
  }

  // 写入文件
  const buffer = Buffer.from(await file.arrayBuffer())
  const relativeUploadDir = `/uploads/${dayjs().format('YYYY-MM-DD')}`
  const uploadDir = path.join(process.cwd(), 'public', relativeUploadDir)

  try {
    await stat(uploadDir)
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await mkdir(uploadDir, { recursive: true })
    } else {
      console.error(err)
      return { error: 'Something went wrong' }
    }
  }

  // 写入文件
  try {
    const uniqueSuffix = `${Math.random().toString(36).slice(-6)}`
    const filename = file.name.replace(/\.[^/.]+$/, '')
    const uniqueFilename = `${filename}-${uniqueSuffix}.${mime.getExtension(file.type)}`
    await writeFile(`${uploadDir}/${uniqueFilename}`, buffer)

    // 调用接口写入数据库
    const noteId = await addNote(
      JSON.stringify({ title: filename, content: buffer.toString('utf-8') }),
    )

    revalidatePath('/', 'layout')
    return { uid: noteId }
  } catch (err) {
    console.error(err)
    return { error: 'Something went wrong' }
  }
}
