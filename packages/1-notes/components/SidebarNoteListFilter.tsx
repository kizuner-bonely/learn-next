'use client'
import { useSearchParams } from 'next/navigation'

import SidebarNoteItem from './SidebarNoteItem'

type Props = {
  notes: Array<{
    noteId: string
    note: { title: string; content: string; updateTime: string }
  }>
}

export default function SidebarNoteListFilter({ notes }: Props) {
  const searchParams = useSearchParams()
  const searchText = searchParams.get('q')

  const noKey = !searchText
  const isIncluded = (title: string) => {
    return title.toLowerCase().includes(searchText?.toLocaleLowerCase() ?? '')
  }

  return (
    <ul className="notes-list">
      {notes.map((noteItem) => {
        const { note, noteId } = noteItem

        if (noKey || isIncluded(note.title)) {
          return <SidebarNoteItem key={noteId} noteId={noteId} note={note} />
        }
        return null
      })}
    </ul>
  )
}
