'use client'

import React from 'react'
import { createStore, Provider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { useLocale } from 'next-intl'

import { localeAtom } from '@/lib/atom/i18n'
import { Spinner } from '@/components/my-ui/spinner'

export const atomStore = createStore()

export const HydrateAtoms = ({ children }: React.PropsWithChildren) => {
  const locale = useLocale()

  useHydrateAtoms([[localeAtom, locale]])

  return children
}

export function JotaiProvider({ children }: React.PropsWithChildren) {
  return (
    <React.Suspense fallback={<Spinner.FullPage />}>
      <Provider store={atomStore}>
        <HydrateAtoms>{children}</HydrateAtoms>
      </Provider>
    </React.Suspense>
  )
}
