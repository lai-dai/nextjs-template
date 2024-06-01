import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: number | string
    username: string
    email: string
    provider: string
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string
    phone: string
    birthday: string
    fullname: string
    token: string
    avatarSrc: string | null
  }
  interface Session {
    user: User
  }
}
