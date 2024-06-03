import { notFound } from 'next/navigation'
import { createSharedPathnamesNavigation } from 'next-intl/navigation'
import { getRequestConfig } from 'next-intl/server'

import { siteConfig } from '@/config/site'
import { LocalizedNavItem } from '@/lib/types/nav'

const { locales, localePrefix } = siteConfig

export type Languages = (typeof locales)[number]

export type LocalePaths = { [key in Languages]: string }

type Pathnames = {
  [key: string]: LocalePaths | string
}

export const generatePathnames = (routes: LocalizedNavItem[]): Pathnames => {
  const pathnames: Pathnames = {
    '/': '/',
  }

  routes.forEach((route) => {
    if (route.href !== undefined)
      if (typeof route.locale === 'object') {
        pathnames[route.href] = route.locale
      } else {
        pathnames[route.href] = route.href
      }
  })

  return pathnames
}

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound()

  return {
    messages: (
      await (locale === 'vi'
        ? // When using Turbopack, this will enable HMR for `en`
          import('../locales/vi.json')
        : import(`../locales/${locale}.json`))
    ).default,
  }
})

export const pathnames = generatePathnames([])

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({
    locales,
    localePrefix,
  })
