import * as React from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

export async function NextIntlProvider({ children }: React.PropsWithChildren) {
  const messages = await getMessages()
  const locale = await getLocale()

  return (
    <NextIntlClientProvider
      timeZone="Asia/Ho_Chi_Minh"
      locale={locale}
      messages={messages}
    >
      {children}
    </NextIntlClientProvider>
  )
}
