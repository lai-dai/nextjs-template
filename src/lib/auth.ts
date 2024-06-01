import { getServerSession, type NextAuthOptions, type User } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import { signInUser } from '@/lib/actions/auth'
import { env } from '@/lib/env'
import { getErrorMessage } from '@/lib/utils'
import { SignInUser } from '@/lib/validations/auth'

const isSecureCookies = env.NEXT_PUBLIC_BASE_URL.startsWith('https://')

const hostName = new URL(env.NEXT_PUBLIC_BASE_URL).hostname
const port = new URL(env.NEXT_PUBLIC_BASE_URL).port
const cookiePrefix = isSecureCookies ? '__Secure-' : `${hostName}-${port}-`

export const tokenCookiesName = `${cookiePrefix}authjs.session-token`

export const authOptions = {
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
    verifyRequest: '/verify-request', // (used for check email message)
    newUser: '/register',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 daysd
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const { email, password } = credentials as SignInUser
          const { data } = await signInUser({ email, password })

          const user = { ...data.user, token: data.jwt }

          return user as User
        } catch (error) {
          throw new Error(
            getErrorMessage(error, 'Có lỗi xảy ra, vui lòng thử lại sau!')
          )
        }
      },
    }),
  ],
  callbacks: {
    session({ token, session }) {
      if (token) {
        token
        return { ...session, user: token } as any
      }

      return session
    },
    jwt({ token, user }) {
      if (user) {
        return user as any
      }
      return token
    },
  },
  cookies: {
    sessionToken: {
      name: tokenCookiesName,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isSecureCookies,
      },
    },
  },
} satisfies NextAuthOptions

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)
