import { NextRequest } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import createIntlMiddleware from 'next-intl/middleware'

import { protectedRoutes } from '@/config/routes'
import { siteConfig } from '@/config/site'
import { pathnames } from '@/lib/i18n'

const { locales, defaultLocale, localePrefix, localeDetection } = siteConfig

const testPathnameRegex = (pages: string[], pathName: string): boolean => {
  return RegExp(
    `^(/(${locales.join('|')}))?(${pages.flatMap((p) => (p === '/' ? ['', '/'] : p)).join('|')})/?$`,
    'i'
  ).test(pathName)
}

const intlMiddleware = createIntlMiddleware({
  locales,
  localePrefix,
  defaultLocale,
  localeDetection,
  pathnames,
})

const authMiddleware = withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log('🚀 token', req.nextauth.token)
    return intlMiddleware(req)
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === 'admin',
    },
    pages: {
      signIn: '/sign-in',
    },
  }
)

export default function middleware(req: NextRequest) {
  const isApiRoute = req.nextUrl.pathname.startsWith('/api')

  if (isApiRoute) {
    return void 0
  }

  const isPrivatePage = testPathnameRegex(protectedRoutes, req.nextUrl.pathname)

  if (isPrivatePage) {
    return (authMiddleware as any)(req)
  }

  return intlMiddleware(req)
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next/static|_next/images|favicon.ico|.*\\..*).*)'],
}
