import { User } from 'next-auth'

export type RawUser = {
  jwt: string
  user: Omit<User, 'token' | 'avatarLink'>
}
