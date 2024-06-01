'use client'

import React from 'react'
import Error from 'next/error'

export default function GlobalError({ error }: { error: unknown }) {
  React.useEffect(() => {
    console.error('💥 error', error)
  }, [error])

  return (
    <html lang="vi">
      <body>
        <Error statusCode={500} />
      </body>
    </html>
  )
}
