'use client'

import React from 'react'
import { setDefaultOptions } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useAtom } from 'jotai'
import { useLocale } from 'next-intl'

import { localeAtom } from '@/lib/atom/i18n'

export function LocaleProvider({ children }: React.PropsWithChildren) {
  const locale = useLocale()
  const [, setLocale] = useAtom(localeAtom)

  React.useLayoutEffect(() => {
    setDefaultOptions({ locale: locale === 'vi' ? vi : undefined })
    setLocale(locale)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  return children
}
