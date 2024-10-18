'use client'

import {
  useEffect,
  useRef,
  useTransition,
  useState,
  type ReactNode,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'

type Props = {
  id: string
  title: string
  children: ReactNode
  expandedChildren: ReactNode
}

export default function SidebarNoteContent(props: Props) {
  const { id, title, children, expandedChildren } = props

  const router = useRouter()
  const pathname = usePathname()
  const selectedId = pathname?.split('/')[1] || null

  const [isPending, startTransition] = useTransition()
  const [isExpanded, setIsExpanded] = useState(false)
  const isActive = id === selectedId

  const itemRef = useRef<HTMLDivElement>(null)
  const prevTitleRef = useRef(title)

  useEffect(() => {
    if (title !== prevTitleRef.current) {
      prevTitleRef.current = title
      itemRef.current?.classList.add('flash')
    }
  }, [title])

  return (
    <div
      ref={itemRef}
      onAnimationEnd={() => {
        itemRef.current!.classList.remove('flash')
      }}
      className={[
        'sidebar-note-list-item',
        isExpanded ? 'note-expanded' : '',
      ].join(' ')}
    >
      {children}
      <button
        className="sidebar-note-open"
        style={{
          backgroundColor: isPending
            ? 'var(--gray-80)'
            : isActive
              ? 'var(--tertiary-blue)'
              : '',
          border: isActive
            ? '1px solid var(--primary-border)'
            : '1px solid transparent',
        }}
        onClick={() => {
          const sidebarToggle = document.getElementById(
            'sidebar-toggle'
          ) as HTMLInputElement
          if (sidebarToggle) {
            sidebarToggle.checked = true
          }
          router.push(`/note/${id}`)
        }}
      >
        Open note for preview
      </button>
      <button
        className="sidebar-note-toggle-expand"
        onClick={(e) => {
          e.stopPropagation()
          startTransition(() => {
            setIsExpanded((_isExpanded) => !_isExpanded)
          })
        }}
      >
        {isExpanded ? (
          <img
            src="/chevron-down.svg"
            width="10px"
            height="10px"
            alt="Collapse"
          />
        ) : (
          <img src="/chevron-up.svg" width="10px" height="10px" alt="Expand" />
        )}
      </button>
      {isExpanded && expandedChildren}
    </div>
  )
}
