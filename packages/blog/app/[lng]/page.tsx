'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

// import useTheme from './theme'
import './globals.css'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <h1 className="text-black dark:text-white">Hello world! {theme}</h1>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="system">System</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </>
  )
}
