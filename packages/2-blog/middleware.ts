import { NextResponse, type NextRequest } from 'next/server'
import acceptLanguage from 'accept-language'

import siteMetadata from './data/siteMetadata'

const { fallbackLanguage, languages } = siteMetadata
acceptLanguage.languages(languages)

const publicFile = /\.(.*)$/
const excludeFile: string[] = []

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)',
  ],
}

function getLocale(req: NextRequest) {
  let language = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!language) language = fallbackLanguage
  return language
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const filteredLanguage = languages.filter((locale) =>
    pathname.startsWith(`/${locale}`),
  )

  if (filteredLanguage.length) {
    if (filteredLanguage[0] === fallbackLanguage) {
      // en/xxx -> /xxx
      const url = pathname.replace(`/${fallbackLanguage}`, '')
      return NextResponse.redirect(new URL(url ? url : '/', req.url))
    }
    return
  }

  if (
    publicFile.test(pathname) &&
    excludeFile.indexOf(pathname.substring(1)) === -1
  ) {
    return
  }

  const locale = getLocale(req)
  req.nextUrl.pathname = `/${locale}${pathname}`

  // do not redirect when the language is fallbackLanguage
  if (locale === fallbackLanguage) {
    return NextResponse.rewrite(req.nextUrl)
  }

  return Response.redirect(req.nextUrl)
}
