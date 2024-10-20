'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import './globals.css'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <h1 className="text-black dark:text-white">Hello world! {theme}</h1>
}
