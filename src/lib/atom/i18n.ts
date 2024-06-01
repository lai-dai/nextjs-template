import { atom } from 'jotai'

import { siteConfig } from '@/config/site'

export const localeAtom = atom<string>(siteConfig.defaultLocale)
