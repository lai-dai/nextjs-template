import {
  JetBrains_Mono as FontMono,
  Be_Vietnam_Pro as FontSans,
} from 'next/font/google'

export const fontSans = FontSans({
  subsets: ['vietnamese'],
  variable: '--font-sans',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
})
