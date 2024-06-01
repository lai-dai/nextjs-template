'use client'

import Image, { ImageProps } from 'next/image'

import { siteConfig } from '@/config/site'

export function Logo({
  alt = siteConfig.name,
  src = siteConfig.logoSrc,
  ...props
}: ImageProps) {
  return (
    <Image width={120} height={120} priority alt={alt} src={src} {...props} />
  )
}
