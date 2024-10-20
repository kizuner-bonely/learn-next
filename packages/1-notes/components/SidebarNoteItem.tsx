import dayjs from 'dayjs'

import SidebarNoteContent from './SidebarNoteItemContent'

type Props = {
  noteId: string
  note: {
    title: string
    content: string
    updateTime: string
  }
}

export default function SidebarNoteItem({ noteId, note }: Props) {
  const { title, content, updateTime } = note

  return (
    <SidebarNoteContent
      id={noteId}
      title={title}
      expandedChildren={
        <p className="sidebar-note-excerpt">
          {content.substring(0, 20) || <i>(No content)</i>}
        </p>
      }
    >
      <header className="sidebar-note-header">
        <strong>{title}</strong>
        <small>{dayjs(updateTime).format('YYYY-MM-DD hh:mm:ss')}</small>
      </header>
    </SidebarNoteContent>
  )
}
