'use client'

import React from 'react'
import { useSession } from 'next-auth/react'

export function SessionProvider({ children }: React.PropsWithChildren) {
  const { status, data: session } = useSession()

  React.useEffect(() => {
    if (status === 'authenticated' && session) {
      console.log('🚀 status', status)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session])

  return children
}
