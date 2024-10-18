'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'

function Spinner({ active = true }: { active: boolean }) {
  return (
    <div
      className={['spinner', active ? 'spinner--active' : ''].join(' ')}
      aria-busy={active ? 'true' : 'false'}
      role="progressbar"
    />
  )
}

export default function SidebarSearchField() {
  const { replace } = useRouter()
  const pathname = usePathname()

  const [isPending, startTransition] = useTransition()

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(window.location.search)
    if (term) params.set('q', term)
    else params.delete('q')

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="search" role="search">
      <label className="offscreen" htmlFor="sidebar-search-input">
        Search for a note by title
      </label>
      <input
        onChange={(e) => handleSearch(e.target.value)}
        id="sidebar-search-input"
        placeholder="Search"
        type="text"
      />

      <Spinner active={isPending} />
    </div>
  )
}
