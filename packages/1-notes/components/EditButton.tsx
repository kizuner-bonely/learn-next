import type { ReactElement } from 'react'
import Link from 'next/link'

type Props = {
  noteId: string | null
  children: string
}

export default function EditButton(props: Props) {
  const { children, noteId } = props
  const isDraft = noteId === null

  return (
    <Link href={`/note/edit/${noteId ?? ''}`} className="link--unstyled">
      <button
        className={[
          'edit-button',
          `edit-button--${isDraft ? 'solid' : 'outline'}`,
        ].join(' ')}
        role="menuitem"
      >
        {children}
      </button>
    </Link>
  )
}
