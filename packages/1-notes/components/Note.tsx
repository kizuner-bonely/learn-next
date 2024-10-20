import dayjs from 'dayjs'

import EditButton from './EditButton'
import NotePreview from './NotePreview'

type Props = {
  noteId: string
  note: {
    title: string
    content: string
    updateTime: string
  }
}

export default function Note(props: Props) {
  const {
    noteId,
    note: { title, content, updateTime },
  } = props

  return (
    <div className="note">
      <div className="note-header">
        <h1 className="note-title">{title}</h1>
        <div className="note-menu" role="menubar">
          <small className="note-updated-at" role="status">
            Last updated on {dayjs(updateTime).format('YYYY-MM-DD hh:mm:ss')}
          </small>
          <EditButton noteId={noteId}>Edit</EditButton>
        </div>
      </div>
      <NotePreview>{content}</NotePreview>
    </div>
  )
}
