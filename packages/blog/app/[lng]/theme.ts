import { useEffect, useState } from 'react'

export default function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setTheme(darkModeMediaQuery.matches ? 'dark' : 'light')
    const listener = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'dark' : 'light')
    }

    darkModeMediaQuery.addEventListener('change', listener)
    return () => {
      darkModeMediaQuery.removeEventListener('change', listener)
    }
  }, [])

  return {
    theme,
    isDartMode: theme === 'dark',
    isLightMode: theme === 'light',
  }
}
