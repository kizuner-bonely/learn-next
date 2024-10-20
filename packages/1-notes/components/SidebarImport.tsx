'use client'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { useRef } from 'react'

import { importNote } from '@/app/[locale]/actions'

function Submit() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? 'Submitting' : 'Submit'}</button>
}

export default function SidebarImport() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const upload = async (formData: FormData) => {
    const file = formData.get('file') as File
    if (!file) {
      console.warn('File is required')
      return
    }

    try {
      const data = await importNote(formData)
      router.push(`/note/${data.uid}`)
    } catch (err) {
      console.error('Something went wrong', err)
    }
    formRef.current!.reset()
  }

  return (
    <form style={{ textAlign: 'center' }} action={upload} ref={formRef}>
      <label htmlFor="file" style={{ cursor: 'pointer' }}>
        Import .md File
      </label>
      <input type="file" id="file" name="file" accept=".md" />

      <div>
        <Submit />
      </div>
    </form>
  )
}
