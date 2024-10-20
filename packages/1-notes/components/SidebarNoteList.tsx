import SidebarNoteListFilter from './SidebarNoteListFilter'
import { getAllNotes } from '@/lib/redis'

export default async function SidebarNoteList() {
  const notes = await getAllNotes()
  const arr = Object.entries(notes)

  if (!arr.length) {
    return <p className="notes-empty">No notes created yet!</p>
  }

  return (
    <SidebarNoteListFilter
      notes={arr.map(([noteId, note]) => {
        return {
          noteId,
          note: JSON.parse(note),
        }
      })}
    />
  )
}
