export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'Nextjs-template',
  description: 'Nextjs-template',
  url: 'http://localhost:3000',
  ogImage: '',
  links: {
    twitter: 'https://x.com/laidai9966',
    github: 'https://github.com/lai-dai',
    docs: 'https://github.com/lai-dai',
  },
  locales: ['en', 'vi'],
  defaultLocale: 'vi',
  localePrefix: 'as-needed',
  localeDetection: false,
  logoSrc: '/images/logo.png',
  defaultNav: [
    {
      title: 'Đăng nhập',
      href: '/login',
      locale: {
        en: '/login',
        vi: '/dang-nhap',
      },
    },
    {
      title: 'Đăng ký',
      href: '/register',
      locale: {
        en: '/register',
        vi: '/dang-ky',
      },
    },
    {
      title: 'Quên mật khẩu',
      href: '/forgot-password',
      locale: {
        en: '/forgot-password',
        vi: '/quen-mat-khau',
      },
    },
    {
      title: 'Trang chủ',
      href: '/home',
      locale: {
        en: '/home',
        vi: '/trang-chu',
      },
    },
    {
      title: 'Quản lý tài khoản',
      href: '/my-account',
      locale: {
        en: '/my-account',
        vi: '/tai-khoan-cua-toi',
      },
    },
  ],
} as const
