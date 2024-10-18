import { getTranslations } from 'next-intl/server'

import { getNote } from '@/lib/redis'
import Note from '@/components/Note'

type Props = {
  params: { id: string }
}

export default async function Page({ params }: Props) {
  const noteId = params.id
  const note = await getNote(noteId)
  const t = await getTranslations('Basic')

  if (!note) {
    return (
      <div className="note--empty-state">
        <span className="note-text--empty-state">{t('initText')}</span>
      </div>
    )
  }

  return <Note noteId={noteId} note={note} />
}
