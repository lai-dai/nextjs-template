import { LocalePaths } from '@/lib/i18n'
import { Icons } from '@/components/icons'

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
  hidden?: boolean
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithOptionalChildren[]
}

export interface LocalizedNavItem extends NavItem {
  locale?: LocalePaths
  items?: LocalizedNavItem[]
}

export interface DefaultNavItem extends LocalizedNavItem {}

export interface MainNavItem extends LocalizedNavItem {}

export interface SidebarNavItem extends LocalizedNavItem {}
