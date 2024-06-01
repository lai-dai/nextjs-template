'use client'

import * as React from 'react'

export function Client(props: React.PropsWithChildren) {
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient ? props.children : null
}
