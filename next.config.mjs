import { fileURLToPath } from 'node:url'
import createJiti from 'jiti'
import createNextIntlPlugin from 'next-intl/plugin'

const jiti = createJiti(fileURLToPath(import.meta.url))

jiti('./src/lib/env')

const withNextIntl = createNextIntlPlugin('./src/lib/i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    minimumCacheTTL: 120,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_API_URL.replace('https://', ''),
        port: '',
        pathname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/home',
        locale: false,
      },
      {
        source: '/vi',
        destination: '/vi/home',
        locale: false,
      },
      {
        source: '/en',
        destination: '/en/home',
        locale: false,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
