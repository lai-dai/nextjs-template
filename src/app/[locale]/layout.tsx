import type { Metadata, Viewport } from 'next'

import '@/styles/globals.css'

import { siteConfig } from '@/config/site'
import { fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { TailwindIndicator } from '@/components/layouts/tailwind-indicator'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'Next.js',
    'React',
    'Tailwind CSS',
    'Server Components',
    'Radix UI',
  ],
  authors: [
    {
      name: 'lai-dai',
      url: 'https://github.com/lai-dai',
    },
  ],
  creator: 'lai-dai',
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'vi',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: '@laidai9966',
  },
  icons: {
    icon: '/favicon.ico',
    // shortcut: '/favicon-16x16.png',
    // apple: '/apple-touch-icon.png',
    // username: '/favicon-32x32.png',
  },
  // manifest: `${siteConfig.url}/site.webmanifest`,
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
  userScalable: false,
}

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode
  params: { locale: string }
}>) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen scroll-smooth bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <Providers>{children}</Providers>
        <TailwindIndicator />
      </body>
    </html>
  )
}
