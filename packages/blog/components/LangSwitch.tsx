'use client'
import { useParams, useRouter, useSelectedLayoutSegment } from 'next/navigation'
import { Menu, MenuButton, Transition } from '@headlessui/react'
import { useState } from 'react'

import siteMetadata from '@/data/siteMetadata'

const { languages } = siteMetadata

export default function LangSwitch() {
  const urlSegments = useSelectedLayoutSegment()
  const router = useRouter()
  const params = useParams()
  const [locale, setLocale] = useState(params.lng)

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale)
    router.push(`/${newLocale}/${urlSegments ?? ''}`)
  }

  return (
    <div className="relative inline-block text-left mr-5 w-6">
      <Menu>
        <div>
          <MenuButton>{locale[0].toUpperCase() + locale.slice(1)}</MenuButton>
        </div>
        <Transition
          as={'div'}
          enter="transition-all ease-out duration-300"
          enterFrom="opacity-0 scale-95 translate-y-[-10px]"
          enterTo="opacity-100 scale-100 translate-y-0"
          leave="transition-all ease-in duration-200"
          leaveFrom="opacity-100 scale-100 translate-y-0"
          leaveTo="opacity-0 scale-95 translate-y-[10px]"
        >
          {languages.map((_locale) => {
            return (
              <button key={_locale} onClick={() => handleLocaleChange(_locale)}>
                {_locale.charAt(0).toUpperCase() + _locale.slice(1)}
              </button>
            )
          })}
        </Transition>
      </Menu>
    </div>
  )
}
