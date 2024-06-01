'use client'

import * as React from 'react'

import { TooltipProvider as UITooltipProvider } from '@/components/ui/tooltip'

export function TooltipProvider({ children }: React.PropsWithChildren) {
  return (
    <UITooltipProvider
      disableHoverableContent
      delayDuration={300}
      skipDelayDuration={0}
    >
      {children}
    </UITooltipProvider>
  )
}
