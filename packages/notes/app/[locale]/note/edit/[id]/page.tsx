import NoteEditor from '@/components/NoteEditor'
import { getNote } from '@/lib/redis'
import { sleep } from '@/lib/utils'

type Props = {
  params: { id: string }
}

export default async function EditPage(props: Props) {
  const {
    params: { id },
  } = props

  const noteId = id
  const note = await getNote(noteId)

  // 模拟请求延迟
  await sleep(1500)

  if (!note) {
    return (
      <div className="note--empty-state">
        <span className="note-text--empty-state">
          Click a note on the left to view something!
        </span>
      </div>
    )
  }

  return (
    <NoteEditor
      noteId={noteId}
      initialTitle={note.title}
      initialBody={note.content}
    />
  )
}
