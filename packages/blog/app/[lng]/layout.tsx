import localFont from 'next/font/local'
import type { Metadata } from 'next'
import { dir } from 'i18next'

import LangSwitch from '@/components/LangSwitch'
import ThemeProviders from './theme-providers'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'blog',
  description: 'practice blog',
}

type Props = Readonly<{
  children: React.ReactNode
  lng: string
}>

export default function RootLayout({ children, lng }: Props) {
  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProviders>
          <header className="flex justify-end fixed w-full">
            <LangSwitch />
          </header>
          {children}
        </ThemeProviders>
      </body>
    </html>
  )
}
