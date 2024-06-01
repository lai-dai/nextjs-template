import * as React from 'react'
import { getServerSession } from 'next-auth'

import { Toaster as SonnerToaster } from '@/components/ui/sonner'
import { Toaster } from '@/components/ui/toaster'

import { DevToolsProvider } from './dev-tools'
import { JotaiProvider } from './jotai'
import { LocaleProvider } from './locale'
import { NextAuthProvider } from './next-auth'
import { NextIntlProvider } from './next-intl'
import { SessionProvider } from './session'
import { ThemeProvider } from './theme'
import { TooltipProvider } from './tooltip'

export async function Providers({ children }: React.PropsWithChildren) {
  const session = await getServerSession()

  return (
    <NextIntlProvider>
      <JotaiProvider>
        <NextAuthProvider session={session}>
          <ThemeProvider>
            <TooltipProvider>
              <SessionProvider>{children}</SessionProvider>
            </TooltipProvider>

            <SonnerToaster />
            <Toaster />

            <DevToolsProvider />
            <LocaleProvider />
          </ThemeProvider>
        </NextAuthProvider>
      </JotaiProvider>
    </NextIntlProvider>
  )
}
