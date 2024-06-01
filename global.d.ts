import vi from './src/locales/vi.json'

type Messages = typeof vi

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}
