import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import Link from 'next/link'

import SidebarSearchField from './SidebarSearchField'
import NoteListSkeleton from './NoteListSkeleton'
import SidebarNoteList from './SidebarNoteList'
import SidebarImport from './SidebarImport'
import EditButton from './EditButton'

export default async function Sidebar() {
  const t = await getTranslations('Basic')

  return (
    <section className="col sidebar">
      <Link href="/" className="link--unstyled">
        <section className="sidebar-header">
          <img
            role="presentation"
            className="logo"
            src="/logo.svg"
            height="22px"
            width="22px"
            alt=""
          />
          <strong>React Notes</strong>
        </section>
      </Link>
      <section className="sidebar-menu" role="menubar">
        <SidebarSearchField />
        <EditButton noteId={null}>{t('new')}</EditButton>
      </section>
      <nav>
        <Suspense fallback={<NoteListSkeleton />}>
          <SidebarNoteList />
        </Suspense>
      </nav>
      <SidebarImport />
    </section>
  )
}
