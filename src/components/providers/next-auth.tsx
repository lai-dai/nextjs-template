'use client'

import * as React from 'react'
import { SessionProvider, SessionProviderProps } from 'next-auth/react'

import { Spinner } from '@/components/my-ui/spinner'

export function NextAuthProvider(props: SessionProviderProps) {
  return (
    <React.Suspense fallback={<Spinner.FullPage />}>
      <SessionProvider {...props} />
    </React.Suspense>
  )
}
