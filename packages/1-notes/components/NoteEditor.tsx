'use client'
import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'

import { saveNote, deleteNote } from '@app/actions'
import DeleteButton from './DeleteButton'
import NotePreview from './NotePreview'
import SaveButton from './SaveButton'
import { locales } from '@/config'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

type Props = {
  noteId: string | null
  initialTitle: string
  initialBody: string
}

export default function NoteEditor(props: Props) {
  const { noteId, initialTitle, initialBody } = props

  const [saveState, saveFormAction] = useFormState(saveNote, { message: '' })
  const [, delFormAction] = useFormState(deleteNote, { message: '' })

  const [title, setTitle] = useState(initialTitle)
  const [body, setBody] = useState(initialBody)

  const isDraft = !noteId

  useEffect(() => {
    // 处理错误
    if (saveState.errors) {
      console.log(saveState.errors)
    }
  }, [saveState])

  return (
    <div className="note-editor">
      <form className="note-editor-form" autoComplete="off">
        <div className="note-editor-menu" role="menubar">
          <input type="hidden" name="noteId" value={noteId ?? ''} />
          <SaveButton formAction={saveFormAction} />
          <DeleteButton isDraft={isDraft} formAction={delFormAction} />
        </div>
        <div className="note-editor-menu">
          <span style={{ color: '#cf0' }}>{saveState.message}</span>
          <span style={{ color: '#f00' }}>
            {saveState.errors?.[0]?.message}
          </span>
        </div>

        <label className="offscreen" htmlFor="note-title-input">
          Enter a title for your note
        </label>
        <input
          id="note-title-input"
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="offscreen" htmlFor="note-body-input">
          Enter the body for your note
        </label>
        <textarea
          value={body}
          name="body"
          id="note-body-input"
          onChange={(e) => setBody(e.target.value)}
        />
      </form>

      <div className="note-editor-preview">
        <p className="label label--preview" role="status">
          Preview
        </p>
        <h1 className="note-title">{title}</h1>
        <NotePreview>{body}</NotePreview>
      </div>
    </div>
  )
}
